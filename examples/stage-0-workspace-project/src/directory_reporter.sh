#!/usr/bin/env bash
# ==============================================================================
# Directory Processing & Telemetry Reporter
# Stage 0 Milestone Implementation
#
# POSIX-compliant shell pipeline script demonstrating standard streams (0, 1, 2),
# kernel pipes, trap signals, and deep directory analytics.
# ==============================================================================

set -euo pipefail

# Print usage instructions to stderr
usage() {
    cat << 'EOF' >&2
Usage: ./directory_reporter.sh [OPTIONS] <TARGET_DIRECTORY>

Options:
  -f, --format FORMAT   Report format: 'markdown' (default) or 'text'
  -o, --output FILE     Write report to FILE instead of standard output
  -h, --help            Display this help message and exit

Description:
  Recursively analyzes TARGET_DIRECTORY, aggregates file counts by extension,
  calculates disk space, pinpoints the largest files, and audits permission
  vulnerabilities (such as world-writable files and SUID/SGID binaries).
EOF
    exit 2
}

FORMAT="markdown"
OUTPUT_FILE=""
TARGET_DIR=""

# Parse command line flags
while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            if [[ -z "$TARGET_DIR" ]]; then
                TARGET_DIR="$1"
                shift
            else
                echo "[ERROR] Unexpected positional argument: $1" >&2
                usage
            fi
            ;;
    esac
done

if [[ -z "$TARGET_DIR" ]]; then
    TARGET_DIR="."
fi

if [[ ! -d "$TARGET_DIR" ]]; then
    echo "[ERROR] Target directory does not exist or is not a directory: $TARGET_DIR" >&2
    exit 1
fi

TARGET_DIR_ABS=$(cd "$TARGET_DIR" && pwd)
echo "[INFO] Commencing directory telemetry scan: $TARGET_DIR_ABS" >&2

# Setup isolated temporary scratchpad with automatic trap cleanup on exit/signals
TMP_DIR=$(mktemp -d /tmp/dir_reporter_XXXXXX)
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

FILES_LIST="$TMP_DIR/files.txt"
find "$TARGET_DIR_ABS" -mindepth 1 > "$FILES_LIST"

# Aggregate counts
TOTAL_DIRS=$(find "$TARGET_DIR_ABS" -mindepth 1 -type d | wc -l)
TOTAL_FILES=$(find "$TARGET_DIR_ABS" -mindepth 1 -type f | wc -l)
TOTAL_SYMLINKS=$(find "$TARGET_DIR_ABS" -mindepth 1 -type l | wc -l)
TOTAL_BYTES=$(du -sb "$TARGET_DIR_ABS" 2>/dev/null | awk '{print $1}' || du -sk "$TARGET_DIR_ABS" | awk '{print $1 * 1024}')
TOTAL_HUMAN=$(du -sh "$TARGET_DIR_ABS" | awk '{print $1}')

# Check for security warnings (world-writable files)
WORLD_WRITABLE_COUNT=$(find "$TARGET_DIR_ABS" -type f -perm -0002 | wc -l)
SUID_COUNT=$(find "$TARGET_DIR_ABS" -type f \( -perm -4000 -o -perm -2000 \) | wc -l)

# Generate extension frequency table
EXT_COUNTS="$TMP_DIR/extensions.txt"
find "$TARGET_DIR_ABS" -type f | sed -n 's/..*\.//p' | tr '[:upper:]' '[:lower:]' | sort | uniq -c | sort -nr > "$EXT_COUNTS" || true

# Generate top 5 largest files
LARGEST_FILES="$TMP_DIR/largest.txt"
find "$TARGET_DIR_ABS" -type f -exec ls -lh {} + 2>/dev/null | awk '{print $5, $9}' | sort -hr | head -n 5 > "$LARGEST_FILES" || true

# Function to generate report
generate_report() {
    local now
    now=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

    if [[ "$FORMAT" == "markdown" ]]; then
        cat << EOF
# Directory Telemetry & Architecture Report
*Generated on: ${now}*
*Target Path: \`${TARGET_DIR_ABS}\`*

## 1. Executive Summary
| Metric | Value |
| :--- | :--- |
| **Total Disk Usage** | **${TOTAL_HUMAN}** (${TOTAL_BYTES} bytes) |
| **Regular Files** | ${TOTAL_FILES} |
| **Directories** | ${TOTAL_DIRS} |
| **Symbolic Links** | ${TOTAL_SYMLINKS} |
| **World-Writable Files** | ${WORLD_WRITABLE_COUNT} |
| **SUID/SGID Binaries** | ${SUID_COUNT} |

## 2. File Type & Extension Breakdown
| Extension | Count | Percentage |
| :--- | :--- | :--- |
EOF
        if [[ -s "$EXT_COUNTS" && "$TOTAL_FILES" -gt 0 ]]; then
            while read -r count ext; do
                pct=$(awk "BEGIN {printf \"%.1f%%\", (${count}/${TOTAL_FILES})*100}")
                echo "| \`.${ext}\` | ${count} | ${pct} |"
            done < "$EXT_COUNTS"
        else
            echo "| *(none)* | 0 | 0.0% |"
        fi

        cat << EOF

## 3. Top Largest Files
| Size | File Path |
| :--- | :--- |
EOF
        if [[ -s "$LARGEST_FILES" ]]; then
            while read -r sz fpath; do
                echo "| ${sz} | \`${fpath}\` |"
            done < "$LARGEST_FILES"
        else
            echo "| - | *(no files found)* |"
        fi

        cat << EOF

## 4. Security & Permissions Audit
EOF
        if [[ "$WORLD_WRITABLE_COUNT" -eq 0 && "$SUID_COUNT" -eq 0 ]]; then
            echo "✅ **Audit Clean:** No world-writable files or unexpected SUID/SGID bits detected."
        else
            echo "⚠️ **Security Notice:**"
            [[ "$WORLD_WRITABLE_COUNT" -gt 0 ]] && echo "- Found ${WORLD_WRITABLE_COUNT} world-writable files (\`chmod o+w\`). Restrict permissions via \`chmod o-w\`."
            [[ "$SUID_COUNT" -gt 0 ]] && echo "- Found ${SUID_COUNT} SUID/SGID files. Inspect binaries for privilege escalation vectors."
        fi

    else
        # Plain text ASCII format
        cat << EOF
================================================================================
                    DIRECTORY TELEMETRY & AUDIT REPORT
================================================================================
Timestamp:   ${now}
Target:      ${TARGET_DIR_ABS}

1. EXECUTIVE SUMMARY:
   Total Size:            ${TOTAL_HUMAN} (${TOTAL_BYTES} bytes)
   Regular Files:         ${TOTAL_FILES}
   Directories:           ${TOTAL_DIRS}
   Symbolic Links:        ${TOTAL_SYMLINKS}
   World-Writable Files:  ${WORLD_WRITABLE_COUNT}
   SUID/SGID Binaries:    ${SUID_COUNT}

2. EXTENSION FREQUENCY:
EOF
        if [[ -s "$EXT_COUNTS" && "$TOTAL_FILES" -gt 0 ]]; then
            while read -r count ext; do
                pct=$(awk "BEGIN {printf \"%.1f%%\", (${count}/${TOTAL_FILES})*100}")
                printf "   .%-12s : %5d (%s)\n" "$ext" "$count" "$pct"
            done < "$EXT_COUNTS"
        else
            echo "   (no files found)"
        fi

        cat << EOF

3. LARGEST FILES:
EOF
        if [[ -s "$LARGEST_FILES" ]]; then
            while read -r sz fpath; do
                printf "   %-8s %s\n" "$sz" "$fpath"
            done < "$LARGEST_FILES"
        else
            echo "   (no files found)"
        fi

        cat << EOF

4. SECURITY AUDIT:
EOF
        if [[ "$WORLD_WRITABLE_COUNT" -eq 0 && "$SUID_COUNT" -eq 0 ]]; then
            echo "   Status: CLEAN (No dangerous world-writable or SUID permissions)"
        else
            echo "   Status: WARNING"
            [[ "$WORLD_WRITABLE_COUNT" -gt 0 ]] && echo "   - Detected $WORLD_WRITABLE_COUNT world-writable files."
            [[ "$SUID_COUNT" -gt 0 ]] && echo "   - Detected $SUID_COUNT SUID/SGID files."
        fi
        echo "================================================================================"
    fi
}

# Direct output
if [[ -n "$OUTPUT_FILE" ]]; then
    generate_report > "$OUTPUT_FILE"
    echo "[INFO] Telemetry report saved to $OUTPUT_FILE" >&2
else
    generate_report
fi
