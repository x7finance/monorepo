#!/bin/bash
set -euo pipefail

# Step 1: Build (must pass — no regressions allowed)
BUILD_OUTPUT=$(turbo build --continue --output-logs=errors-only 2>&1 || true)
BUILD_FAILED_LINE=$(echo "$BUILD_OUTPUT" | grep "^Failed:" || true)
if [ -n "$BUILD_FAILED_LINE" ]; then
  echo "BUILD FAILED — aborting"
  echo "$BUILD_OUTPUT" | grep -E "error|Error|^Failed:" | head -20
  echo "METRIC total_warnings=9999"
  echo "METRIC build_ok=0"
  exit 0
fi

# Step 2: Checks must pass (no regressions)
CHECK_OUTPUT=$(TURBO_LOG_ORDER=stream turbo format lint typecheck --continue --output-logs=errors-only 2>&1 || true)
CHECK_FAILED_LINE=$(echo "$CHECK_OUTPUT" | grep "^Failed:" || true)
if [ -n "$CHECK_FAILED_LINE" ]; then
  echo "CHECKS FAILED — aborting"
  echo "$CHECK_OUTPUT" | grep -E "error TS|^Failed:" | head -20
  echo "METRIC total_warnings=9999"
  echo "METRIC build_ok=0"
  exit 0
fi

# Step 3: Tests must pass
TEST_OUTPUT=$(turbo test --continue --output-logs=errors-only 2>&1 || true)
TEST_FAILED_LINE=$(echo "$TEST_OUTPUT" | grep "^Failed:" || true)
if [ -n "$TEST_FAILED_LINE" ]; then
  echo "TESTS FAILED — aborting"
  echo "$TEST_OUTPUT" | grep "^Failed:" | head -5
  echo "METRIC total_warnings=9999"
  echo "METRIC build_ok=0"
  exit 0
fi

# Step 4: Count lint warnings (strip ANSI codes)
LINT_OUTPUT=$(TURBO_LOG_ORDER=stream turbo lint --continue --output-logs=full 2>&1 | sed 's/\x1b\[[0-9;]*m//g')
TOTAL_WARNINGS=$(echo "$LINT_OUTPUT" | grep "Found " | awk '{sum += $3} END {print sum+0}')

# Per-package
extract_warnings() {
  echo "$LINT_OUTPUT" | grep "$1:lint: Found" | awk '{print $3+0}'
}
ORG_W=$(extract_warnings "@x7/org")
SOR_W=$(extract_warnings "@x7/smart-order-router")
UI_W=$(extract_warnings "@x7/ui")
SDK_W=$(extract_warnings "@x7/sdk")
OTHER_W=$(( TOTAL_WARNINGS - ${ORG_W:-0} - ${SOR_W:-0} - ${UI_W:-0} - ${SDK_W:-0} ))

echo "=== Lint warnings by package ==="
echo "$LINT_OUTPUT" | grep "Found " | grep -v "0 warnings" || echo "No warnings found!"
echo ""
echo "METRIC total_warnings=$TOTAL_WARNINGS"
echo "METRIC org_warnings=${ORG_W:-0}"
echo "METRIC sor_warnings=${SOR_W:-0}"
echo "METRIC ui_warnings=${UI_W:-0}"
echo "METRIC sdk_warnings=${SDK_W:-0}"
echo "METRIC other_warnings=$OTHER_W"
echo "METRIC build_ok=1"
