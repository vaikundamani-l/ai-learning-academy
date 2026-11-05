# Stage 0 Milestone Project: Reproducible Developer Workspace & Git Repository

> **Stage 0 Capstone Demonstration**  
> *Part I — Computing and Software Foundations*  
> Educational developer workspace combining low-level POSIX filesystem operations, stream pipelines, cryptographic SHA deduplication, and Git DAG internals.

---

## 1. Architectural Overview & Foundations Alignment

This milestone project serves as the hands-on synthesis for **Stage 0: Computer and Development Fundamentals**, directly translating the theoretical lessons into small educational tools whose behavior you can inspect and test:

| Stage 0 Topic | Milestone Implementation & Architectural Evidence |
| :--- | :--- |
| **CPU, Cache & Memory Hierarchy** | `calculate_sha256()` reads one 64 KiB chunk at a time instead of loading the whole file. This bounds the file buffer; it does not guarantee a cache hit or prevent OS paging. |
| **POSIX Inodes & Permissions** | `metadata_inspector.py` queries `lstat()` to inspect filesystem inodes (`st_ino`), hard link counts (`st_nlink`), disk block allocations (`st_blocks`), and parses octal permission bitmasks (`0755`, SUID, SGID, Sticky bit). |
| **Unix Shells & Standard Streams** | `directory_reporter.sh` demonstrates strict stream separation (sending telemetry to stdout and informational logs to stderr `1>&2`), pipeline composition (`find \| awk \| sort \| uniq`), and POSIX `trap` signal handling for clean temporary resource deallocation. |
| **Git Internals & Content Addressability** | `init_git_repo.sh` constructs a real commit DAG containing branching paths, non-fast-forward merge commits, and annotated tags, verified via `git fsck --full` and `git cat-file -p HEAD`. |
| **Reproducibility & Containerization** | Bundled `Dockerfile`, `.devcontainer/devcontainer.json`, and standardized `Makefile` document a Linux/GNU-tool environment. Host tools and container image versions may differ; test on the environment you use. |

---

## 2. Workspace Directory Structure

```text
examples/stage-0-workspace-project/
├── .devcontainer/
│   └── devcontainer.json          # VS Code / Codespaces dev container profile
├── scripts/
│   ├── diagnose_failure.sh        # Automated failure injection, diagnosis & recovery
│   └── init_git_repo.sh           # Script initializing a multi-branch Git DAG
├── src/
│   ├── directory_reporter.sh      # POSIX shell telemetry and permissions reporter
│   ├── file_organizer.py          # High-performance CLI file organizer with undo
│   └── metadata_inspector.py      # Low-level POSIX inode and permission inspector
├── tests/
│   └── test_workspace.py          # Complete unit & integration test suite
├── .gitignore                     # Clean ignore patterns for Python and build caches
├── Dockerfile                     # Isolated Debian-based development container
├── Makefile                       # Standardized build and run orchestration
└── README.md                      # Comprehensive architectural documentation
```

---

## 3. Core Tooling Reference

### A. File Organizer CLI (`src/file_organizer.py`)
A robust command-line utility for classifying files based on filename extension categories, extensions, or modification month.
- **Categorization:** Automatically sorts files into `Documents/`, `Code/`, `Data/`, `Images/`, `Audio/`, `Video/`, `Archives/`, and `Misc/`.
- **Deduplication (`--deduplicate`):** Computes SHA-256 hashes of files and safely moves duplicates to a designated `_duplicates/` folder.
- **Collision Resolution:** Automatically appends monotonic numeric suffixes to avoid destructive overwrites (`file_1.txt`, `file_2.txt`).
- **Dry-Run Mode (`--dry-run`):** Simulates all moves and outputs planned filesystem mutations without modifying disk state.
- **Undo journal (`--undo-log` and `--undo`):** Records each move intent before moving. Undo refuses to overwrite occupied original paths or restore modified organized files, and retains unresolved entries for retry. This is a sequential teaching tool, not a crash-proof filesystem transaction; keep backups for valuable data.

```bash
# Example usage:
python3 src/file_organizer.py /path/to/target --by category --dry-run
python3 src/file_organizer.py /path/to/target --deduplicate --undo-log .undo.json
python3 src/file_organizer.py --undo --undo-log .undo.json
```

### B. POSIX File Metadata Inspector (`src/metadata_inspector.py`)
Queries the kernel via POSIX `lstat` system calls to extract filesystem metadata without dereferencing symbolic links.
- **Inode Data:** Inode number, filesystem device ID, hard link count, 512-byte blocks allocated, optimal I/O block size.
- **Permissions:** 4-digit octal mask (e.g. `0755`), symbolic mode string (`-rwxr-xr-x`), SUID/SGID/Sticky bit detection, and user/group/other permission breakdown.
- **Ownership & Timestamps:** UID/GID resolved to system usernames/groupnames, plus nanosecond-accurate access (`atime`), modification (`mtime`), and status change (`ctime`) timestamps formatted in UTC ISO-8601.
- **JSON Telemetry (`--json`):** Emits structured JSON suitable for machine ingestion or automated security linters.

```bash
# Inspect files in terminal:
python3 src/metadata_inspector.py src/ Makefile

# Emit machine-readable JSON:
python3 src/metadata_inspector.py src/file_organizer.py --json
```

### C. Directory Telemetry Reporter (`src/directory_reporter.sh`)
A Bash script requiring GNU-compatible command-line tools that traverses directory structures and generates an audit report.
- **Metrics Collected:** Total disk usage, regular file count, subdirectories, symlinks, file extension frequency distribution with percentages, top 5 largest files.
- **Security Audit:** Automatically flags world-writable files (`chmod o+w`) and binaries with dangerous SUID/SGID permission bits.
- **Stream Redirection:** Directs log telemetry to stderr (`>&2`) while sending the formatted report (Markdown or plain text) to standard output or a designated file (`-o report.md`).

```bash
# Generate Markdown report:
./src/directory_reporter.sh --format markdown .

# Save plain text report to file:
./src/directory_reporter.sh --format text -o telemetry.txt .
```

---

## 4. Build, Orchestration & Test Targets (`Makefile`)

The project includes a standardized `Makefile` to simplify local testing and continuous integration:

| Command | Action Performed |
| :--- | :--- |
| `make test` | Runs the automated Python test suite (`tests/test_workspace.py`). |
| `make inspect` | Executes the POSIX metadata inspector on workspace source code. |
| `make organize` | Simulates dry-run file organization across the directory. |
| `make report` | Runs the shell directory reporter and prints the audit report. |
| `make git-demo` | Builds a complete Git repository with branches, merges, and tags. |
| `make diagnose` | Executes the full Stage 0 failure diagnosis and version recovery check. |
| `make clean` | Removes bytecode caches; preserves journals, duplicates, backups, and demo repositories. |
| `make all` | Executes both `test` and `report` (default target). |

---

## 5. Stage 0 Mastery Verification Walkthrough

The Stage 0 curriculum defines the following mastery gate:
> *"Start from a clean environment, install dependencies, run the application, diagnose a failure, and restore a previous working version."*

You can execute this complete sequence automatically via:
```bash
./scripts/diagnose_failure.sh
```

### Student walkthrough: predict, run, inspect, explain

Use disposable sample files. Do not run the organizer on your home directory or academy source.

1. From this example directory, create a fixture:
   ```bash
   lab_dir=$(mktemp -d /tmp/stage0-student.XXXXXX)
   printf 'first notes\n' > "$lab_dir/notes.txt"
   printf 'print(42)\n' > "$lab_dir/hello.py"
   python3 src/file_organizer.py "$lab_dir" --dry-run
   ```
   Predict the destination of each file. Expected: `Documents/notes.txt` and `Code/hello.py`. Dry-run leaves both original files in place.
2. Execute the plan and inspect the journal:
   ```bash
   python3 src/file_organizer.py "$lab_dir" --undo-log "$lab_dir/.undo.json"
   cat "$lab_dir/.undo.json"
   python3 src/metadata_inspector.py "$lab_dir/Documents/notes.txt" --json
   ```
   Expected: two moves; each journal record contains original/current paths and a SHA-256 content fingerprint. Explain why a fingerprint helps detect later edits.
3. Restore, then inspect the two original files:
   ```bash
   python3 src/file_organizer.py --undo --undo-log "$lab_dir/.undo.json"
   ls "$lab_dir"
   ```
   Expected: two restored files; the journal is removed only when no unresolved records remain. Generated empty folders may remain.
4. Re-run the organization, create a **new** `notes.txt` at the original location, and attempt Undo. Predict the result first. Expected: Undo reports a conflict, keeps both files and retains its journal. Move your new file aside manually, then retry Undo. Never resolve a conflict by deleting an unfamiliar file.
5. Run `make diagnose`. The script copies source and tests into a temporary Git repository, verifies the baseline, appends a syntax error, observes failure, restores the baseline with `git restore`, and reruns the tests. The working example source is untouched. This automates a demonstration; it does not prove you can diagnose an unfamiliar failure yourself.

### What the mechanisms mean

- **Hashing:** start with an empty hash state, read a chunk, update the state, repeat until end-of-file, then compare digests. Duplicate detection here compares content, not filenames. Every candidate is hashed; there is no file-size prefilter.
- **Journaling:** write recovery intent before changing the file location. A later run must not overwrite that history. Undo checks both locations and the fingerprint before restoring.
- **Pipes:** the reporter sends report text to stdout (descriptor 1) and progress messages to stderr (descriptor 2). Try redirecting stdout to a file and confirm the logs remain visible. A pipe connects one process’s stdout to another’s stdin.
- **Git recovery:** `git restore --source=HEAD -- path` restores a tracked file from the current commit. Understand what will be replaced before using it. Practice only inside the disposable repository.

### Completion evidence you must produce

- Explain each tool’s inputs, outputs, and failure cases in your own words.
- Submit your fixture, dry-run output, journal inspection and successful Undo output.
- Demonstrate an occupied-path conflict and show that both files survive.
- Inspect a regular file, directory and symlink; explain how their permission strings differ.
- Run the reporter on filenames with spaces and explain its current limitations: it parses human-readable `ls` output and newline-delimited paths, so unusual names can be misreported.
- Show a Git graph with a branch and merge, then diagnose a different seeded failure without following the recovery script line by line.
- Repeat setup in a fresh Linux environment. Record tool versions and any missing dependencies. Container files are a setup recipe, not proof that a container build has passed.

Before Stage 0 sign-off, map all source topics to sufficient teaching and practical evidence, particularly GPUs, virtualization and basic internet architecture. Text encoding and Unicode already have a section in Lesson 2. Four lessons and this project do not automatically certify coverage or learner mastery of every original topic.

---

## 6. Docker & Dev Container Setup

To run the documented Linux tool environment in a container (container execution must be verified separately):

```bash
# Build the Docker image
docker build -t stage0-workspace .

# Run the automated test suite inside the container
docker run --rm stage0-workspace

# Open an interactive shell inside the container
docker run --rm -it stage0-workspace /bin/bash
```

When opened in VS Code, the workspace detects `.devcontainer/devcontainer.json` and prompts to reopen in container, mounting the codebase with Python extensions pre-configured.
