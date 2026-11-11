"""A bounded single-writer task manager. Every command requires an explicit path."""
import argparse
import json
import sys
from pathlib import Path
from task_domain import TaskError, add_task, complete_task
from task_store import StoreError, initialize, load_state, save_state


def main(argv=None):
    parser = argparse.ArgumentParser(description="Manage a small personal task file", allow_abbrev=False)
    parser.add_argument("--db", required=True, type=Path, help="database path; place before command")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("init", help="create an empty database without overwriting")
    commands.add_parser("list", help="read saved tasks without writing")
    add = commands.add_parser("add", help="add one task")
    add.add_argument("title")
    done = commands.add_parser("done", help="mark an existing task complete")
    done.add_argument("id", type=int)
    args = parser.parse_args(argv)
    try:
        if args.command == "init":
            initialize(args.db)
            result = {"created": True}
        else:
            state = load_state(args.db)
            if args.command == "list":
                result = {"tasks": state["tasks"]}
            elif args.command == "add":
                candidate, task = add_task(state, args.title)
                save_state(args.db, candidate)
                result = {"added": task}
            else:
                candidate, task, changed = complete_task(state, args.id)
                if changed:
                    save_state(args.db, candidate)
                result = {"changed": changed, "task": task}
    except (TaskError, StoreError, OSError) as error:
        print("error:", error, file=sys.stderr)
        return 2
    try:
        print(json.dumps(result, ensure_ascii=False, sort_keys=True), flush=True)
    except BrokenPipeError:
        sys.stderr.write("error: output unavailable; operation may already be committed\n")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
