#!/bin/bash
set -euo pipefail

# Console error checker - visits all pages and reports console errors/warnings
# Assumes dev server is already running at https://x7-org.localhost:1355

# Run the console check using e2e's playwright
cd packages/e2e
NODE_PATH="$(pwd)/node_modules" bun run ../../scripts/testing/console-check.ts
