#!/bin/bash
set -euo pipefail

# Console error checker - visits all pages and reports console errors/warnings
# Assumes dev server is already running at https://x7-org.localhost:1355

# Quick syntax check on recently modified files
if ! bun check --no-emit scripts/testing/console-check.ts 2>/dev/null; then
  echo "METRIC error_count=999"
  echo "METRIC errors=999"
  echo "METRIC warnings=0"
  echo "METRIC clean_pages=0"
  echo "METRIC pages_with_issues=0"
  exit 1
fi

# Run the console check using npx from e2e which has playwright
cd packages/e2e
NODE_PATH="$(pwd)/node_modules" bun run ../../scripts/testing/console-check.ts
