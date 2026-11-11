"""Run: python3 -m unittest -v test_tasks (standard library only)."""
import io
import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch
import task_cli
from task_domain import TaskError, add_task, complete_task, empty_state
from task_store import StoreError, encode_state, initialize, load_state, save_state


class TaskTests(unittest.TestCase):
    def setUp(self):
        self.folder = TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.path = Path(self.folder.name) / "tasks.json"
        initialize(self.path)

    def test_candidate_does_not_mutate_original(self):
        original = empty_state()
        candidate, task = add_task(original, "Read CPU")
        self.assertEqual(original, empty_state())
        self.assertEqual(task["id"], 1)
        changed, _, did_change = complete_task(candidate, 1)
        self.assertTrue(did_change)
        self.assertFalse(candidate["tasks"][0]["done"])
        self.assertTrue(changed["tasks"][0]["done"])

    def test_repeated_completion_is_a_noop(self):
        state, _ = add_task(empty_state(), "Read CPU")
        state, _, _ = complete_task(state, 1)
        repeated, task, changed = complete_task(state, 1)
        self.assertFalse(changed)
        self.assertTrue(task["done"])
        self.assertEqual(repeated, state)
        with self.assertRaises(TaskError):
            complete_task(state, 9)

    def test_init_refuses_overwrite(self):
        before = self.path.read_bytes()
        with self.assertRaises(FileExistsError):
            initialize(self.path)
        self.assertEqual(self.path.read_bytes(), before)

    def test_malformed_store_is_not_reset(self):
        self.path.write_bytes(b'{"version":')
        before = self.path.read_bytes()
        with self.assertRaises(StoreError):
            load_state(self.path)
        self.assertEqual(self.path.read_bytes(), before)

    def test_replace_failure_preserves_old_file(self):
        before = self.path.read_bytes()
        candidate, _ = add_task(load_state(self.path), "Trace memory")
        with patch("task_store.os.replace", side_effect=OSError("synthetic replace failure")):
            with self.assertRaises(OSError):
                save_state(self.path, candidate)
        self.assertEqual(self.path.read_bytes(), before)
        self.assertEqual(list(self.path.parent.glob(".*.tmp")), [])

    def test_actual_cli_roundtrip(self):
        script = Path(task_cli.__file__)
        def invoke(*arguments):
            return subprocess.run([sys.executable, str(script), "--db", str(self.path), *arguments],
                                  capture_output=True, text=True, timeout=5)
        added = invoke("add", "Read CPU")
        self.assertEqual(added.returncode, 0, added.stderr)
        self.assertEqual(json.loads(added.stdout)["added"]["id"], 1)
        self.assertEqual(invoke("done", "1").returncode, 0)
        listed = invoke("list")
        self.assertTrue(json.loads(listed.stdout)["tasks"][0]["done"])
        before = self.path.read_bytes()
        rejected = invoke("done", "9")
        self.assertEqual(rejected.returncode, 2)
        self.assertEqual(rejected.stdout, "")
        self.assertEqual(self.path.read_bytes(), before)

    def test_output_failure_can_follow_commit(self):
        class BrokenOutput:
            def write(self, text):
                raise BrokenPipeError("synthetic output failure")
            def flush(self):
                pass
        with patch("sys.stdout", BrokenOutput()), patch("sys.stderr", io.StringIO()) as errors:
            code = task_cli.main(["--db", str(self.path), "add", "Read CPU"])
        self.assertEqual(code, 1)
        self.assertIn("may already be committed", errors.getvalue())
        self.assertEqual(load_state(self.path)["tasks"][0]["title"], "Read CPU")


if __name__ == "__main__":
    unittest.main()
