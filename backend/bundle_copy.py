#!/usr/bin/env python3
import os
import argparse

EXCLUDE_DIRS = {'node_modules', '.git'}
EXCLUDE_PATTERNS = {'.env'}

def should_exclude(path):
    for pat in EXCLUDE_PATTERNS:
        if pat in os.path.basename(path):
            return True
    return False

def main():
    parser = argparse.ArgumentParser(description="Bundle all source files into a single .txt")
    parser.add_argument('-d', '--directory', default='.', help='Project root directory')
    parser.add_argument('-o', '--output', default='project_bundle1.txt', help='Output text file')
    args = parser.parse_args()

    with open(args.output, 'w', encoding='utf-8') as out:
        for root, dirs, files in os.walk(args.directory):
            # skip excluded dirs
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not should_exclude(d)]
            for fname in files:
                fpath = os.path.join(root, fname)
                if should_exclude(fname):
                    continue
                rel = os.path.relpath(fpath, args.directory)
                out.write(f"=== FILE: {rel} ===\n")
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        out.write(f.read())
                except UnicodeDecodeError:
                    out.write("[BINARY OR NON-TEXT FILE - skipped]\n")
                out.write("\n\n")
    print(f"Bundled into {args.output}")

if __name__ == "__main__":
    main()
