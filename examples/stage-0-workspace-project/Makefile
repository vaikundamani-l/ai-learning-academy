# ==============================================================================
# Makefile — Stage 0 Reproducible Developer Workspace
# ==============================================================================

SHELL := /bin/bash
PYTHON := python3

.PHONY: all help test inspect organize report git-demo diagnose clean

all: test report

help:
	@echo "Stage 0 Reproducible Workspace Build Orchestration:"
	@echo "  make test      - Run automated unit & integration test suite"
	@echo "  make inspect   - Run POSIX metadata inspector on workspace files"
	@echo "  make organize  - Run file organizer in dry-run mode"
	@echo "  make report    - Generate directory telemetry & permissions report"
	@echo "  make git-demo  - Initialize a reproducible multi-branch Git DAG"
	@echo "  make diagnose  - Run failure diagnosis and restoration check"
	@echo "  make clean     - Clean temporary files, caches, and demo artifacts"

test:
	@echo "Running Stage 0 workspace automated test suite..."
	$(PYTHON) tests/test_workspace.py

inspect:
	@echo "Inspecting workspace files with POSIX Metadata Inspector..."
	$(PYTHON) src/metadata_inspector.py src/ Makefile

organize:
	@echo "Simulating directory organization (Dry Run)..."
	$(PYTHON) src/file_organizer.py --dry-run .

report:
	@echo "Generating directory telemetry report..."
	./src/directory_reporter.sh --format text .

git-demo:
	@echo "Initializing demo Git repository with branching DAG..."
	./scripts/init_git_repo.sh ./demo_repo

diagnose:
	@echo "Executing Stage 0 failure diagnosis and recovery check..."
	./scripts/diagnose_failure.sh

clean:
	@echo "Cleaning temporary test artifacts..."
	rm -rf __pycache__ src/__pycache__ tests/__pycache__
	@echo "Cache cleanup complete. Recovery journals, duplicate files, backups, and demo repositories were preserved."
