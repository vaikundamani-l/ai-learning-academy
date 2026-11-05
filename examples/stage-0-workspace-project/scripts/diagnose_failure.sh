#!/usr/bin/env bash
# ==============================================================================
# Failure Diagnosis & Version Restoration Simulator
# Stage 0 Mastery Check Implementation
#
# Simulates the required curriculum mastery verification:
# 1. Start from a clean workspace environment
# 2. Run the application suite
# 3. Simulate and diagnose a critical filesystem / version failure
# 4. Restore the known-good working version via Git & verify recovery
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Work only in a disposable copy; never corrupt the academy or learner's source.
LAB_DIR=$(mktemp -d /tmp/stage0-diagnose.XXXXXX)
trap 'rm -rf -- "$LAB_DIR"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
cp -R "$PROJECT_ROOT/src" "$PROJECT_ROOT/tests" "$LAB_DIR/"
cd "$LAB_DIR"
git init -q -b main
git config user.name "Stage 0 Lab"
git config user.email "lab@example.invalid"
git add src tests
git commit -qm "Known-good exercise baseline"
echo "Disposable exercise directory: $LAB_DIR"

echo "================================================================================"
echo "Stage 0 Mastery Check: Failure Diagnosis & Restoration"
echo "================================================================================"

# Step 1: Clean Baseline Verification
echo "[STEP 1] Validating clean baseline environment..."
python3 tests/test_workspace.py > /dev/null
echo "  ✓ Baseline tests passing cleanly."

# Step 2: Inject Simulated Failure
# We simulate a permission corruption where a vital test file is stripped of read permissions
# and a code file has an intentional regression injected.
CORRUPT_TARGET="src/file_organizer.py"


echo "[STEP 2] Simulating workspace failure (injecting regression into ${CORRUPT_TARGET})..."


# Inject invalid syntax
echo "FATAL_SYNTAX_REGRESSION = [syntax error >>>" >> "$CORRUPT_TARGET"

echo "  ✓ Defect injected. Verifying failure detection..."

# Step 3: Run application and catch failure
set +e
python3 "$CORRUPT_TARGET" --help > /dev/null 2>&1
FAILURE_EXIT_CODE=$?
set -e

if [[ $FAILURE_EXIT_CODE -ne 0 ]]; then
    echo "  ✓ Failure successfully intercepted! Exit code: ${FAILURE_EXIT_CODE}"
else
    echo "  ✗ Error: Application did not fail when regression was present." >&2

    exit 1
fi

# Step 4: Diagnostic Inspection
echo "[STEP 3] Running diagnostic inspection..."
python3 src/metadata_inspector.py "$CORRUPT_TARGET" --json | grep -E '("size_bytes"|"permissions")' || true
echo "  ✓ Diagnostic telemetry captured."

# Step 5: Version Restoration
echo "[STEP 4] Restoring known working version..."
git restore --source=HEAD -- "$CORRUPT_TARGET"
echo "  ✓ Clean code restored."

# Step 6: Post-Recovery Verification
echo "[STEP 5] Verifying post-restoration health..."
python3 tests/test_workspace.py > /dev/null
echo "  ✓ Application tests re-verified successfully!"

echo "================================================================================"
echo "🎉 Mastery Check Complete: Failure diagnosed and restored cleanly!"
echo "================================================================================"
