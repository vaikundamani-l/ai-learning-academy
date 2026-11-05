#!/usr/bin/env bash
# ==============================================================================
# Reproducible Git Repository Initializer & DAG Builder
# Stage 0 Milestone Implementation
#
# Creates a multi-branch Git repository illustrating content-addressable
# object storage, commit trees, branches, merge topologies, and annotated tags.
# ==============================================================================

set -euo pipefail

TARGET_REPO="${1:-./demo_workspace_repo}"

echo "================================================================================"
echo "Initializing Reproducible Git Repository in: ${TARGET_REPO}"
echo "================================================================================"

if [[ -d "$TARGET_REPO" ]]; then
    echo "[WARN] Target directory already exists. Recreating clean test bed..."
    rm -rf "$TARGET_REPO"
fi

mkdir -p "$TARGET_REPO"
cd "$TARGET_REPO"

# 1. Initialize Git Repo
git init -b main

# Configure local repository identity (does not affect global git config)
git config user.name "Stage 0 Engineer"
git config user.email "engineer@curriculum.ai"

# 2. Scaffolding commit on main
cat << 'EOF' > README.md
# Stage 0 Engineering Workspace
A reproducible, audited development repository demonstrating core computing,
POSIX filesystem standards, and Git DAG internals.
EOF

cat << 'EOF' > .gitignore
*.pyc
__pycache__/
*.o
*.out
.organizer_undo.json
_duplicates/
EOF

git add README.md .gitignore
git commit -m "feat: initial commit of Stage 0 project workspace"

# 3. Create feature branch and add tooling
git checkout -b feature/organizer-optimization

cat << 'EOF' > config.json
{
  "version": "1.0.0",
  "environment": "production",
  "telemetry": true,
  "max_chunk_size_bytes": 65536
}
EOF

git add config.json
git commit -m "feat(config): add engine configuration and chunk telemetry"

# 4. Return to main, simulate parallel progress
git checkout main

cat << 'EOF' >> README.md

## Hardware Prerequisites
- x86-64 or ARM64 multi-core processor
- POSIX-compliant shell (bash 4+, zsh, or ash)
- Python 3.8 or newer
EOF

git add README.md
git commit -m "docs: document hardware and architecture prerequisites"

# 5. Merge feature branch with explicit merge commit
git merge --no-ff feature/organizer-optimization -m "merge: reconcile feature/organizer-optimization into main"

# 6. Create annotated release tag
git tag -a v1.0.0 -m "Release v1.0.0: Certified Stage 0 Workspace"

echo ""
echo "================================================================================"
echo "Git DAG & Object Store Validation:"
echo "================================================================================"
git log --graph --oneline --decorate --all

echo ""
echo "HEAD Commit Object Deconstruction (git cat-file -p HEAD):"
echo "--------------------------------------------------------"
git cat-file -p HEAD

echo ""
echo "Running git fsck integrity audit:"
echo "---------------------------------"
git fsck --full

echo ""
echo "✅ Git Repository created and verified successfully in: ${TARGET_REPO}"
