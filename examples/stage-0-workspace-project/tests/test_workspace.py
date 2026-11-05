#!/usr/bin/env python3
"""
Automated Test Suite for Stage 0 Reproducible Workspace Project
Validates file_organizer.py, metadata_inspector.py, and directory_reporter.sh.
Zero external dependencies - runs on standard Python 3.8+ library.
"""

import os
import sys
import tempfile
import shutil
import unittest
import subprocess
import json
from pathlib import Path

# Add src to sys.path
TEST_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TEST_DIR.parent
SRC_DIR = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_DIR))

from file_organizer import organize_directory, rollback_organization, calculate_sha256
from metadata_inspector import inspect_path, parse_posix_permissions, format_bytes


class TestFileOrganizer(unittest.TestCase):
    def setUp(self):
        self.test_dir = Path(tempfile.mkdtemp(prefix="org_test_"))
        # Create test files
        self.doc = self.test_dir / "report.pdf"
        self.code = self.test_dir / "main.py"
        self.data = self.test_dir / "metrics.csv"
        self.img = self.test_dir / "diagram.png"
        self.misc = self.test_dir / "unknown.xyz"

        self.doc.write_text("sample pdf data")
        self.code.write_text("print('hello world')")
        self.data.write_text("id,val\n1,100\n")
        self.img.write_text("png dummy bytes")
        self.misc.write_text("raw misc bits")

    def tearDown(self):
        if self.test_dir.exists():
            shutil.rmtree(self.test_dir)

    def test_dry_run_preserves_filesystem(self):
        telemetry = organize_directory(self.test_dir, strategy="category", dry_run=True)
        self.assertEqual(telemetry["candidate_count"], 5)
        self.assertEqual(telemetry["moves_planned"], 5)
        self.assertEqual(telemetry["executed_moves"], 0)
        # All files must still reside in top-level directory
        self.assertTrue(self.doc.exists())
        self.assertTrue(self.code.exists())
        self.assertFalse((self.test_dir / "Documents").exists())

    def test_category_organization(self):
        telemetry = organize_directory(self.test_dir, strategy="category", dry_run=False)
        self.assertEqual(telemetry["executed_moves"], 5)
        self.assertTrue((self.test_dir / "Documents" / "report.pdf").exists())
        self.assertTrue((self.test_dir / "Code" / "main.py").exists())
        self.assertTrue((self.test_dir / "Data" / "metrics.csv").exists())
        self.assertTrue((self.test_dir / "Images" / "diagram.png").exists())
        self.assertTrue((self.test_dir / "Misc" / "unknown.xyz").exists())

    def test_deduplication(self):
        dup_file = self.test_dir / "report_copy.pdf"
        dup_file.write_text("sample pdf data")  # Identical content to report.pdf

        telemetry = organize_directory(self.test_dir, strategy="category", deduplicate=True)
        self.assertEqual(telemetry["duplicates_found"], 1)
        self.assertTrue((self.test_dir / "_duplicates" / "report_copy.pdf").exists())
        self.assertTrue((self.test_dir / "Documents" / "report.pdf").exists())

    def test_undo_restores_original_state(self):
        undo_log = self.test_dir / ".undo_journal.json"
        telemetry = organize_directory(self.test_dir, strategy="category", undo_file=undo_log)
        self.assertEqual(telemetry["executed_moves"], 5)
        self.assertTrue(undo_log.exists())

        # Rollback
        restored = rollback_organization(undo_log)
        self.assertEqual(restored, 5)
        self.assertTrue(self.doc.exists())
        self.assertTrue(self.code.exists())
        self.assertTrue(self.data.exists())
        self.assertFalse(undo_log.exists())


class TestOrganizerRecovery(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.source = self.root / 'notes.txt'
        self.source.write_text('original lesson notes')
        self.log = self.root / '.undo.json'

    def tearDown(self):
        self.temp.cleanup()

    def organize(self):
        organize_directory(self.root, undo_file=self.log)

    def test_undo_preserves_new_file_at_original_path(self):
        self.organize()
        self.source.write_text('new work')
        self.assertEqual(rollback_organization(self.log), 0)
        self.assertEqual(self.source.read_text(), 'new work')
        self.assertEqual((self.root / 'Documents/notes.txt').read_text(), 'original lesson notes')
        self.assertTrue(self.log.exists())

    def test_undo_keeps_missing_file_recovery_record(self):
        self.organize()
        (self.root / 'Documents/notes.txt').unlink()
        self.assertEqual(rollback_organization(self.log), 0)
        self.assertTrue(self.log.exists())

    def test_second_run_cannot_replace_existing_journal(self):
        self.organize()
        journal = self.log.read_bytes()
        (self.root / 'new.txt').write_text('new')
        with self.assertRaises(FileExistsError): self.organize()
        self.assertEqual(self.log.read_bytes(), journal)
        self.assertTrue((self.root / 'new.txt').exists())

    def test_modified_organized_file_is_not_silently_restored(self):
        self.organize()
        (self.root / 'Documents/notes.txt').write_text('edited after organizing')
        self.assertEqual(rollback_organization(self.log), 0)
        self.assertFalse(self.source.exists())
        self.assertTrue(self.log.exists())

    def test_category_symlink_cannot_move_files_outside_target(self):
        with tempfile.TemporaryDirectory() as outside:
            (self.root / 'Documents').symlink_to(outside, target_is_directory=True)
            with self.assertRaises(ValueError): self.organize()
            self.assertTrue(self.source.exists())
            self.assertEqual(list(Path(outside).iterdir()), [])


class TestMetadataInspector(unittest.TestCase):
    def setUp(self):
        self.test_dir = Path(tempfile.mkdtemp(prefix="meta_test_"))
        self.sample_file = self.test_dir / "sample.txt"
        self.sample_file.write_text("Testing POSIX file metadata inspection.")
        os.chmod(self.sample_file, 0o644)

    def tearDown(self):
        if self.test_dir.exists():
            shutil.rmtree(self.test_dir)

    def test_inspect_regular_file(self):
        meta = inspect_path(self.sample_file)
        self.assertEqual(meta["name"], "sample.txt")
        self.assertEqual(meta["type"], "Regular File")
        self.assertGreater(meta["inode"], 0)
        self.assertEqual(meta["hard_links"], 1)
        self.assertEqual(meta["permissions"]["octal"], "0644")
        self.assertEqual(meta["permissions"]["symbolic"], "-rw-r--r--")
        self.assertTrue(meta["permissions"]["breakdown"]["user"]["read"])
        self.assertTrue(meta["permissions"]["breakdown"]["user"]["write"])
        self.assertFalse(meta["permissions"]["breakdown"]["user"]["execute"])
        self.assertEqual(meta["size_bytes"], len("Testing POSIX file metadata inspection."))

    def test_inspect_directory(self):
        meta = inspect_path(self.test_dir)
        self.assertEqual(meta["type"], "Directory")
        self.assertTrue(meta["permissions"]["symbolic"].startswith("d"))

    def test_inspect_symlink(self):
        link_target = self.test_dir / "symlink_to_sample.txt"
        link_target.symlink_to(self.sample_file)
        meta = inspect_path(link_target)
        self.assertEqual(meta["type"], "Symbolic Link")
        self.assertIsNotNone(meta["symlink_target"])
        self.assertEqual(meta["permissions"]["symbolic"][0], "l")

    def test_format_bytes(self):
        self.assertEqual(format_bytes(500), "500 B")
        self.assertEqual(format_bytes(1024), "1.0 KiB")
        self.assertEqual(format_bytes(1048576), "1.0 MiB")


class TestDirectoryReporter(unittest.TestCase):
    def setUp(self):
        self.test_dir = Path(tempfile.mkdtemp(prefix="rep_test_"))
        (self.test_dir / "src").mkdir()
        (self.test_dir / "docs").mkdir()
        (self.test_dir / "src" / "script.py").write_text("print('hello')\n" * 10)
        (self.test_dir / "docs" / "guide.md").write_text("# Documentation\n" * 20)

    def tearDown(self):
        if self.test_dir.exists():
            shutil.rmtree(self.test_dir)

    def test_shell_reporter_markdown_output(self):
        reporter_script = SRC_DIR / "directory_reporter.sh"
        if not reporter_script.exists():
            self.skipTest("directory_reporter.sh not found")

        cmd = [str(reporter_script), "--format", "markdown", str(self.test_dir)]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        self.assertEqual(proc.returncode, 0, f"Script failed with: {proc.stderr}")
        output = proc.stdout
        self.assertIn("Directory Telemetry & Architecture Report", output)
        self.assertIn("Regular Files", output)
        self.assertIn("`.py`", output)
        self.assertIn("`.md`", output)
        self.assertIn("Security & Permissions Audit", output)


if __name__ == "__main__":
    unittest.main()
