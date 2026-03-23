#!/bin/bash
set -euo pipefail

# Run project checks - format, lint, typecheck
bun run checks 2>&1 | tail -80
