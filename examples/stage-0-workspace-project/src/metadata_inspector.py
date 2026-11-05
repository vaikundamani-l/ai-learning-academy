#!/usr/bin/env python3
"""
POSIX File Metadata Inspector CLI
Stage 0 Milestone Implementation

Deep inspection of POSIX filesystem inodes, permissions, ownership,
disk block allocations, and timestamps. Produces human-readable terminal
reports or machine-readable JSON telemetry.

Zero external dependencies - runs on standard Python 3.8+ library.
"""

import os
import sys
import stat
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional

try:
    import pwd
    import grp
except ImportError:
    # Fallback for non-POSIX platforms (e.g. Windows)
    pwd = None
    grp = None


def format_bytes(size: int) -> str:
    """Formats raw byte count into human-readable SI units."""
    for unit in ["B", "KiB", "MiB", "GiB", "TiB"]:
        if size < 1024.0:
            return f"{size:3.1f} {unit}" if unit != "B" else f"{size} B"
        size /= 1024.0
    return f"{size:.1f} PiB"


def get_file_type(mode: int) -> str:
    """Translates POSIX mode bits into human-readable file type."""
    if stat.S_ISREG(mode):
        return "Regular File"
    elif stat.S_ISDIR(mode):
        return "Directory"
    elif stat.S_ISLNK(mode):
        return "Symbolic Link"
    elif stat.S_ISCHR(mode):
        return "Character Device"
    elif stat.S_ISBLK(mode):
        return "Block Device"
    elif stat.S_ISFIFO(mode):
        return "FIFO / Named Pipe"
    elif stat.S_ISSOCK(mode):
        return "UNIX Domain Socket"
    return "Unknown"


def parse_posix_permissions(mode: int) -> Dict[str, Any]:
    """
    Parses POSIX permission bits into octal, symbolic string,
    and special bit flags (SUID, SGID, Sticky bit).
    """
    octal_full = oct(stat.S_IMODE(mode))
    octal_4digit = f"{stat.S_IMODE(mode):04o}"
    
    # Symbolic string (e.g., -rwxr-xr-x)
    symbolic = stat.filemode(mode)

    # Special bits analysis
    suid = bool(mode & stat.S_ISUID)
    sgid = bool(mode & stat.S_ISGID)
    sticky = bool(mode & stat.S_ISVTX)

    return {
        "octal": octal_4digit,
        "symbolic": symbolic,
        "special_bits": {
            "setuid": suid,
            "setgid": sgid,
            "sticky": sticky
        },
        "breakdown": {
            "user": {
                "read": bool(mode & stat.S_IRUSR),
                "write": bool(mode & stat.S_IWUSR),
                "execute": bool(mode & stat.S_IXUSR),
            },
            "group": {
                "read": bool(mode & stat.S_IRGRP),
                "write": bool(mode & stat.S_IWGRP),
                "execute": bool(mode & stat.S_IXGRP),
            },
            "others": {
                "read": bool(mode & stat.S_IROTH),
                "write": bool(mode & stat.S_IWOTH),
                "execute": bool(mode & stat.S_IXOTH),
            }
        }
    }


def inspect_path(filepath: Path) -> Dict[str, Any]:
    """Collects comprehensive low-level POSIX inode metadata for a target path."""
    # Use lstat to inspect symbolic links without following them
    try:
        st = filepath.lstat()
    except (FileNotFoundError, OSError) as e:
        return {"path": str(filepath), "error": str(e)}

    # Resolve username and groupname
    uid = st.st_uid
    gid = st.st_gid
    user_name = str(uid)
    group_name = str(gid)

    if pwd:
        try:
            user_name = pwd.getpwuid(uid).pw_name
        except KeyError:
            pass
    if grp:
        try:
            group_name = grp.getgrgid(gid).gr_name
        except KeyError:
            pass

    perms = parse_posix_permissions(st.st_mode)
    ftype = get_file_type(st.st_mode)

    # Symlink target if applicable
    symlink_target = None
    if stat.S_ISLNK(st.st_mode):
        try:
            symlink_target = os.readlink(filepath)
        except OSError:
            symlink_target = "<unreadable>"

    # Timestamps in ISO-8601
    atime_iso = datetime.fromtimestamp(st.st_atime, tz=timezone.utc).isoformat()
    mtime_iso = datetime.fromtimestamp(st.st_mtime, tz=timezone.utc).isoformat()
    ctime_iso = datetime.fromtimestamp(st.st_ctime, tz=timezone.utc).isoformat()

    return {
        "path": str(filepath.resolve()),
        "name": filepath.name,
        "inode": st.st_ino,
        "device_id": st.st_dev,
        "hard_links": st.st_nlink,
        "type": ftype,
        "size_bytes": st.st_size,
        "size_human": format_bytes(st.st_size),
        "blocks_512b": getattr(st, "st_blocks", None),
        "block_size_bytes": getattr(st, "st_blksize", None),
        "owner": {
            "uid": uid,
            "username": user_name,
            "gid": gid,
            "groupname": group_name
        },
        "permissions": perms,
        "timestamps": {
            "access_atime_utc": atime_iso,
            "modify_mtime_utc": mtime_iso,
            "change_ctime_utc": ctime_iso
        },
        "symlink_target": symlink_target
    }


def print_ascii_report(metadata: Dict[str, Any]):
    """Renders a beautiful, structured ASCII terminal report."""
    if "error" in metadata:
        print(f"[ERROR] Could not inspect {metadata['path']}: {metadata['error']}")
        return

    p = metadata["permissions"]
    o = metadata["owner"]
    t = metadata["timestamps"]
    sp = p["special_bits"]
    special_str = []
    if sp["setuid"]: special_str.append("SUID")
    if sp["setgid"]: special_str.append("SGID")
    if sp["sticky"]: special_str.append("Sticky")
    special_desc = f" ({', '.join(special_str)})" if special_str else ""

    print("=" * 64)
    print(f"  POSIX METADATA INSPECTOR: {metadata['name']}")
    print("=" * 64)
    print(f"  Absolute Path:     {metadata['path']}")
    if metadata["symlink_target"]:
        print(f"  Symlink Points To: {metadata['symlink_target']}")
    print(f"  File Type:         {metadata['type']}")
    print(f"  Inode Number:      {metadata['inode']}")
    print(f"  Filesystem Device: {metadata['device_id']}")
    print(f"  Hard Link Count:   {metadata['hard_links']}")
    print(f"  File Size:         {metadata['size_bytes']} bytes ({metadata['size_human']})")
    if metadata['blocks_512b'] is not None:
        print(f"  Blocks Allocated:  {metadata['blocks_512b']} (512-byte blocks)")
    if metadata['block_size_bytes'] is not None:
        print(f"  Optimal I/O Block: {metadata['block_size_bytes']} bytes")
    print("-" * 64)
    print(f"  Permissions:       {p['symbolic']} (Octal: {p['octal']}){special_desc}")
    print(f"  Owner:             {o['username']} (UID: {o['uid']})")
    print(f"  Group:             {o['groupname']} (GID: {o['gid']})")
    print("-" * 64)
    print("  Detailed Permission Matrix:")
    print(f"    User  (u): Read={'Y' if p['breakdown']['user']['read'] else '-'}, Write={'Y' if p['breakdown']['user']['write'] else '-'}, Exec={'Y' if p['breakdown']['user']['execute'] else '-'}")
    print(f"    Group (g): Read={'Y' if p['breakdown']['group']['read'] else '-'}, Write={'Y' if p['breakdown']['group']['write'] else '-'}, Exec={'Y' if p['breakdown']['group']['execute'] else '-'}")
    print(f"    Other (o): Read={'Y' if p['breakdown']['others']['read'] else '-'}, Write={'Y' if p['breakdown']['others']['write'] else '-'}, Exec={'Y' if p['breakdown']['others']['execute'] else '-'}")
    print("-" * 64)
    print("  POSIX Timestamps (UTC):")
    print(f"    Last Modification (mtime): {t['modify_mtime_utc']}")
    print(f"    Last Access       (atime): {t['access_atime_utc']}")
    print(f"    Metadata Change   (ctime): {t['change_ctime_utc']}")
    print("=" * 64)
    print()


def main():
    parser = argparse.ArgumentParser(
        description="Deep POSIX Inode & Permissions Metadata Inspector",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("paths", nargs="+", help="File or directory path(s) to inspect")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    parser.add_argument("--recursive", "-r", action="store_true", help="Recursively inspect directory contents")
    
    args = parser.parse_args()

    results: List[Dict[str, Any]] = []

    for path_str in args.paths:
        target = Path(path_str)
        if not target.exists() and not target.is_symlink():
            print(f"[ERROR] Target path does not exist: {path_str}", file=sys.stderr)
            continue

        if target.is_dir() and args.recursive:
            for root, dirs, files in os.walk(target):
                results.append(inspect_path(Path(root)))
                for f in files:
                    results.append(inspect_path(Path(root) / f))
        else:
            results.append(inspect_path(target))

    if args.json:
        print(json.dumps(results if len(results) > 1 else results[0], indent=2))
    else:
        for res in results:
            print_ascii_report(res)


if __name__ == "__main__":
    main()
