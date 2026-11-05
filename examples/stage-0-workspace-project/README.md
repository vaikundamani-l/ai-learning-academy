# Stage 0 Milestone Project: Reproducible Developer Workspace & Git Repository

> **Stage 0 Capstone Demonstration**  
> *Part I — Computing and Software Foundations*  
> Certified reproducible developer workspace combining low-level POSIX filesystem operations, stream pipelines, cryptographic SHA deduplication, and Git DAG internals.

---

## 1. Architectural Overview & Foundations Alignment

This milestone project serves as the hands-on synthesis for **Stage 0: Computer and Development Fundamentals**, directly translating the theoretical lessons into verified, production-grade tools:

| Stage 0 Topic | Milestone Implementation & Architectural Evidence |
| :--- | :--- |
| **CPU, Cache & Memory Hierarchy** | `calculate_sha256()` uses streaming 64 KiB I/O chunks that comfortably fit within CPU L1/L2 data cache boundaries, preventing memory ballooning or page thrashing on large files. |
| **POSIX Inodes & Permissions** | `metadata_inspector.py` queries `lstat()` to inspect filesystem inodes (`st_ino`), hard link counts (`st_nlink`), disk block allocations (`st_blocks`), and parses octal permission bitmasks (`0755`, SUID, SGID, Sticky bit). |
| **Unix Shells & Standard Streams** | `directory_reporter.sh` demonstrates strict stream separation (sending telemetry to stdout and informational logs to stderr `1>&2`), pipeline composition (`find \| awk \| sort \| uniq`), and POSIX `trap` signal handling for clean temporary resource deallocation. |
| **Git Internals & Content Addressability** | `init_git_repo.sh` constructs a real commit DAG containing branching paths, non-fast-forward merge commits, and annotated tags, verified via `git fsck --full` and `git cat-file -p HEAD`. |
| **Reproducibility & Containerization** | Bundled `Dockerfile`, `.devcontainer/devcontainer.json`, and standardized `Makefile` guarantee deterministic, zero-config reproduction across Linux, macOS, and container runtimes. |

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
A robust command-line utility for classifying files based on MIME types, extensions, or creation timestamps.
- **Categorization:** Automatically sorts files into `Documents/`, `Code/`, `Data/`, `Images/`, `Audio/`, `Video/`, `Archives/`, and `Misc/`.
- **Deduplication (`--deduplicate`):** Computes cryptographic SHA-256 hashes of identical-size files and safely moves duplicates to a designated `_duplicates/` folder.
- **Collision Resolution:** Automatically appends monotonic numeric suffixes to avoid destructive overwrites (`file_1.txt`, `file_2.txt`).
- **Dry-Run Mode (`--dry-run`):** Simulates all moves and outputs planned filesystem mutations without modifying disk state.
- **Transactional Rollback (`--undo-log` and `--undo`):** Records an atomic JSON journal of every move, allowing 100% loss-free rollback of previous operations.

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
A POSIX-compliant shell pipeline script that traverses directory structures and generates an audit report.
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
| `make clean` | Wipes temporary build caches, bytecode, and demo directories. |
| `make all` | Executes both `test` and `report` (default target). |

---

## 5. Stage 0 Mastery Verification Walkthrough

The Stage 0 curriculum defines the following mastery gate:
> *"Start from a clean environment, install dependencies, run the application, diagnose a failure, and restore a previous working version."*

You can execute this complete sequence automatically via:
```bash
./scripts/diagnose_failure.sh
```

### Step-by-Step Manual Walkthrough:
1. **Clean Environment Setup:**
   ```bash
   make clean
   python3 -m unittest tests/test_workspace.py
   ```
2. **Inject a Controlled Failure:**
   ```bash
   # Inject syntax regression into the organizer
   echo "FATAL_REGRESSION = [invalid syntax >>>" >> src/file_organizer.py
   ```
3. **Diagnose the Failure:**
   ```bash
   # Attempt execution - observe intercepted failure
   python3 src/file_organizer.py --help
   # Inspect file metadata using the inspector
   python3 src/metadata_inspector.py src/file_organizer.py --json
   ```
4. **Restore Known-Good Version:**
   ```bash
   # Restore clean working copy using Git
   git checkout src/file_organizer.py
   ```
5. **Verify Full Recovery:**
   ```bash
   make test
   ```

---

## 6. Docker & Dev Container Setup

To run this workspace in a hermetically sealed container:

```bash
# Build the Docker image
docker build -t stage0-workspace .

# Run the automated test suite inside the container
docker run --rm stage0-workspace

# Open an interactive shell inside the container
docker run --rm -it stage0-workspace /bin/bash
```

When opened in VS Code, the workspace detects `.devcontainer/devcontainer.json` and prompts to reopen in container, mounting the codebase with Python extensions pre-configured.
