#!/usr/bin/env python3
"""
Reproducible Workspace File Organizer CLI
Stage 0 Milestone Implementation

Organizes files within a target directory by categorized MIME/file types,
file extensions, or creation/modification dates. Includes collision resolution,
cryptographic SHA-256 deduplication, dry-run simulation, and JSON undo journaling.

Zero external dependencies - runs on standard Python 3.8+ library.
"""

import os
import sys
import shutil
import hashlib
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Set

# Comprehensive category mapping based on file extensions
CATEGORY_MAP: Dict[str, List[str]] = {
    "Documents": [".pdf", ".docx", ".doc", ".txt", ".odt", ".rtf", ".tex", ".epub", ".md"],
    "Code": [".py", ".c", ".h", ".cpp", ".hpp", ".rs", ".go", ".js", ".ts", ".jsx", ".tsx", ".java", ".sh", ".bash", ".html", ".css"],
    "Data": [".json", ".csv", ".tsv", ".xml", ".yaml", ".yml", ".sql", ".sqlite", ".db", ".parquet"],
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp", ".ico", ".tiff"],
    "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"],
    "Video": [".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv"],
    "Archives": [".zip", ".tar", ".gz", ".bz2", ".xz", ".7z", ".rar"],
    "Executables": [".exe", ".bin", ".out", ".elf", ".appimage", ".deb", ".rpm"],
}

EXTENSION_TO_CATEGORY: Dict[str, str] = {}
for cat, exts in CATEGORY_MAP.items():
    for ext in exts:
        EXTENSION_TO_CATEGORY[ext.lower()] = cat


def calculate_sha256(filepath: Path, chunk_size: int = 65536) -> str:
    """Calculates SHA-256 hash of a file efficiently using streaming chunks."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(chunk_size):
            hasher.update(chunk)
    return hasher.hexdigest()


def get_target_subfolder(filepath: Path, strategy: str) -> str:
    """Determines target folder name based on selected strategy."""
    ext = filepath.suffix.lower()
    
    if strategy == "category":
        return EXTENSION_TO_CATEGORY.get(ext, "Misc")
    elif strategy == "extension":
        return ext.lstrip(".") if ext else "no_extension"
    elif strategy == "date":
        mtime = os.path.getmtime(filepath)
        dt = datetime.fromtimestamp(mtime)
        return dt.strftime("%Y-%m")
    else:
        return "Misc"


def resolve_collision(dest_dir: Path, filename: str) -> Path:
    """Resolves filename collision by appending an incrementing index before extension."""
    target_path = dest_dir / filename
    if not target_path.exists():
        return target_path
    
    stem = target_path.stem
    suffix = target_path.suffix
    counter = 1
    while target_path.exists():
        target_path = dest_dir / f"{stem}_{counter}{suffix}"
        counter += 1
    return target_path


def organize_directory(
    target_dir: Path,
    strategy: str = "category",
    dry_run: bool = False,
    deduplicate: bool = False,
    undo_file: Optional[Path] = None,
    verbose: bool = False
) -> Dict[str, any]:
    """
    Scans and organizes files in target_dir.
    Returns telemetry dictionary of executed operations.
    """
    if not target_dir.exists() or not target_dir.is_dir():
        raise ValueError(f"Target directory does not exist or is not a directory: {target_dir}")

    target_dir = target_dir.resolve()
    undo_file = undo_file.resolve() if undo_file else None
    if undo_file and undo_file.exists() and not dry_run:
        raise FileExistsError(f'Undo journal already exists: {undo_file}. Undo or archive it first.')

    journal: List[Dict[str, str]] = []
    seen_hashes: Dict[str, Path] = {}
    duplicates: List[Tuple[Path, Path]] = []
    moves: List[Tuple[Path, Path]] = []
    skipped: List[Path] = []

    # Exclude system folders, git metadata, and generated organization folders
    excluded_names = {".git", ".devcontainer", "__pycache__", "_duplicates"}
    for cat in list(CATEGORY_MAP.keys()) + ["Misc", "no_extension"]:
        excluded_names.add(cat)

    # Collect files to organize (only top-level to prevent runaway recursive nesting)
    candidate_files: List[Path] = []
    for item in target_dir.iterdir():
        if item.is_file() and not item.is_symlink() and item.name not in {".DS_Store", "desktop.ini"}:
            if undo_file is None or item.resolve() != undo_file:
                candidate_files.append(item)

    if verbose:
        print(f"[INFO] Discovered {len(candidate_files)} candidate files in {target_dir}")

    # Process deduplication if requested
    for f in sorted(candidate_files):
        if deduplicate:
            try:
                f_hash = calculate_sha256(f)
                if f_hash in seen_hashes:
                    duplicates.append((f, seen_hashes[f_hash]))
                    continue
                else:
                    seen_hashes[f_hash] = f
            except (PermissionError, OSError) as e:
                skipped.append(f)
                if verbose:
                    print(f"[WARN] Could not hash {f.name}: {e}", file=sys.stderr)
                continue

        # Determine destination
        subfolder = get_target_subfolder(f, strategy)
        dest_dir = target_dir / subfolder
        dest_path = resolve_collision(dest_dir, f.name)
        moves.append((f, dest_path))

    # Handle duplicates folder
    if deduplicate and duplicates:
        dup_dir = target_dir / "_duplicates"
        for dup_src, original in duplicates:
            dest_path = resolve_collision(dup_dir, dup_src.name)
            moves.append((dup_src, dest_path))

    # Validate every destination before any move. Do not follow category symlinks.
    for _, destination in moves:
        if destination.parent.is_symlink() or target_dir not in destination.resolve().parents:
            raise ValueError(f'Destination escapes the target directory: {destination}')

    def persist_journal():
        if undo_file is None:
            return
        undo_file.parent.mkdir(parents=True, exist_ok=True)
        temporary = undo_file.with_name(undo_file.name + '.tmp')
        with open(temporary, 'w', encoding='utf-8') as handle:
            json.dump({'strategy': strategy, 'target_dir': str(target_dir), 'journal': journal}, handle, indent=2)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, undo_file)

    executed_moves = 0
    for src, dst in moves:
        if verbose or dry_run:
            print(f"{'[DRY-RUN]' if dry_run else '[MOVE]'} {src.name} -> {dst.parent.name}/{dst.name}")
        if dry_run:
            continue
        # Recheck after planning; refuse any newly occupied destination.
        if dst.exists() or dst.is_symlink():
            raise FileExistsError(f'Destination became occupied: {dst}')
        entry = {'original': str(src), 'current': str(dst),
                 'sha256': calculate_sha256(src), 'timestamp': datetime.now(timezone.utc).isoformat()}
        journal.append(entry)
        persist_journal()  # Write intent before moving, so failures retain a recovery record.
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        executed_moves += 1

    return {
        "candidate_count": len(candidate_files),
        "moves_planned": len(moves),
        "executed_moves": executed_moves,
        "duplicates_found": len(duplicates),
        "skipped_files": len(skipped),
        "dry_run": dry_run
    }


def rollback_organization(undo_file: Path, verbose: bool = False) -> int:
    """Restores files to their original locations using an undo journal."""
    if not undo_file.exists():
        raise FileNotFoundError(f"Undo log file not found: {undo_file}")

    with open(undo_file, "r", encoding="utf-8") as jf:
        data = json.load(jf)

    journal = data.get("journal", [])
    restored_count = 0

    unresolved = []
    for entry in reversed(journal):
        src = Path(entry['current'])
        original = Path(entry['original'])
        expected = entry.get('sha256')
        if not src.exists() and not src.is_symlink():
            # A recorded move intent may not have executed yet.
            if original.is_file() and expected and calculate_sha256(original) == expected:
                continue
            unresolved.append(entry)
            print(f'[WARN] Missing organized file; keeping journal entry: {src}', file=sys.stderr)
            continue
        if original.exists() or original.is_symlink() or src.is_symlink() or (expected and calculate_sha256(src) != expected):
            unresolved.append(entry)
            print(f'[WARN] Restore conflict or modified file; leaving both paths untouched: {original}', file=sys.stderr)
            continue
        original.parent.mkdir(parents=True, exist_ok=True)
        try:
            shutil.move(str(src), str(original))
        except OSError:
            unresolved.append(entry)
            continue
        restored_count += 1
        if verbose:
            print(f'[RESTORE] {src.name} -> {original}')

    if unresolved:
        data['journal'] = list(reversed(unresolved))
        temporary = undo_file.with_name(undo_file.name + '.tmp')
        temporary.write_text(json.dumps(data, indent=2), encoding='utf-8')
        os.replace(temporary, undo_file)
    else:
        undo_file.unlink()
    return restored_count


def main():
    parser = argparse.ArgumentParser(
        description="POSIX-Compliant Reproducible Workspace File Organizer CLI",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("directory", nargs="?", default=".", help="Target directory to organize")
    parser.add_argument("--by", choices=["category", "extension", "date"], default="category",
                        help="Sorting strategy")
    parser.add_argument("--dry-run", action="store_true", help="Simulate actions without moving files")
    parser.add_argument("--deduplicate", action="store_true", help="Detect duplicate files via SHA-256 and move to _duplicates/")
    parser.add_argument("--undo-log", type=str, default=".organizer_undo.json", help="Path to undo journal file")
    parser.add_argument("--undo", action="store_true", help="Rollback previous organization using the undo log")
    parser.add_argument("--verbose", "-v", action="store_true", help="Print detailed operation logs")

    args = parser.parse_args()

    try:
        undo_path = Path(args.undo_log)

        if args.undo:
            print(f"Rolling back organization from undo journal: {undo_path}")
            restored = rollback_organization(undo_path, verbose=args.verbose)
            print(f"Successfully restored {restored} files.")
            if undo_path.exists():
                print('[WARN] Some entries were not restored. Resolve conflicts and retry; the journal was retained.', file=sys.stderr)
                sys.exit(1)
            sys.exit(0)

        target = Path(args.directory).resolve()
        print(f"Scanning target directory: {target} (Strategy: {args.by}, Dry-Run: {args.dry_run})")
        
        telemetry = organize_directory(
            target_dir=target,
            strategy=args.by,
            dry_run=args.dry_run,
            deduplicate=args.deduplicate,
            undo_file=undo_path,
            verbose=args.verbose
        )

        print("-" * 50)
        print("Organization Complete:")
        print(f"  • Files Evaluated:   {telemetry['candidate_count']}")
        print(f"  • Actions Planned:   {telemetry['moves_planned']}")
        print(f"  • Moves Executed:    {telemetry['executed_moves']}")
        print(f"  • Duplicates Found:  {telemetry['duplicates_found']}")
        if telemetry['dry_run']:
            print("  • Note: Dry-run mode active. No filesystem changes were made.")
        print("-" * 50)
        sys.exit(0)

    except Exception as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
