# Stage 1 task-manager project

Run from this folder with Python 3.12 (standard library only):

```sh
python3 task_cli.py --db tasks.json init
python3 task_cli.py --db tasks.json add "Read CPU"
python3 task_cli.py --db tasks.json add "Trace memory"
python3 task_cli.py --db tasks.json done 1
python3 task_cli.py --db tasks.json list
python3 task_cli.py --db tasks.json --help
```

Use a new task-file path in a trusted personal directory. Init uses exclusive creation and refuses to overwrite any existing path. No automatic recovery/reset or task deletion is provided. List is read-only; repeated done is a no-op. Every command requires --db before its subcommand.

The domain layer validates version, exact fields/types, printable 1–80-character titles, unique positive ids, monotonic next_id, up to 100 tasks and ids through 9999. The store bounds input/output to 32768 UTF-8 bytes and rejects malformed JSON, duplicate keys, nonstandard constants and unsupported schemas. Do not treat corrupted data as an empty task list.

Updates prepare an independent candidate, serialize/validate it, write and fsync a same-directory temporary file, close it, then use os.replace. Exceptions before replacement preserve the old file; temporary-file deletion is attempted on failure. Replacement is the commit boundary. This is not a full power-loss durability guarantee: no parent-directory fsync is performed, and abrupt termination may leave staged files or interrupt initial creation. File metadata/permissions are not preserved as if editing the old inode in place.

Single writer only. No lock or compare-and-swap protects simultaneous read/modify/write cycles. Two writers can each read the same state and the later replacement can lose the earlier update. Direct symlink database paths are rejected, but this app does not defend against hostile concurrent path changes. Use a database/locking design for a different concurrency or trust contract.

Successful JSON is printed after commit. Output failure can occur after a successful save; exit code 1 therefore does not prove a mutation was undone. Repeating add can create a duplicate task. Reconcile the saved list before retrying uncertain operations. Application/validation/I/O errors before success output use code 2; argparse usage errors also use code 2. A successful normal invocation uses code 0.

Verified on local Linux/Python 3.12.3 with real subprocesses and injected storage/output failures. Windows/macOS, hostile directories, simultaneous-writer safety and crash/power-loss durability are not certified. All automatic checks use disposable files.
