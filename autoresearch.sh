#!/bin/bash
set -euo pipefail

# Step 1: Build all packages and the Next.js app
BUILD_OUTPUT=$(turbo build --continue --output-logs=errors-only 2>&1 || true)
BUILD_TS_ERRORS=$(echo "$BUILD_OUTPUT" | grep -c "error TS" || true)
# Count build task failures (next build errors, etc.)
BUILD_FAILED_LINE=$(echo "$BUILD_OUTPUT" | grep "^Failed:" || true)
BUILD_TASK_FAILURES=0
if [ -n "$BUILD_FAILED_LINE" ]; then
  BUILD_TASK_FAILURES=$(echo "$BUILD_FAILED_LINE" | tr ',' '\n' | wc -l | tr -d ' ')
fi
BUILD_ERRORS=$((BUILD_TS_ERRORS + BUILD_TASK_FAILURES))

# Step 2: Checks (format + lint + typecheck)
CHECK_OUTPUT=$(TURBO_LOG_ORDER=stream turbo format lint typecheck --continue --output-logs=errors-only 2>&1 || true)
CHECK_TS_ERRORS=$(echo "$CHECK_OUTPUT" | grep "error TS" | grep -v "build:" | grep -c "error TS" || true)
CHECK_FAILED_LINE=$(echo "$CHECK_OUTPUT" | grep "^Failed:" || true)
CHECK_TASK_FAILURES=0
if [ -n "$CHECK_FAILED_LINE" ]; then
  CHECK_TASK_FAILURES=$(echo "$CHECK_FAILED_LINE" | tr ',' '\n' | wc -l | tr -d ' ')
fi
CHECK_ERRORS=$((CHECK_TS_ERRORS + CHECK_TASK_FAILURES))

# Step 3: Tests
TEST_OUTPUT=$(turbo test --continue --output-logs=errors-only 2>&1 || true)
TEST_FAILED_LINE=$(echo "$TEST_OUTPUT" | grep "^Failed:" || true)
TEST_ERRORS=0
if [ -n "$TEST_FAILED_LINE" ]; then
  TEST_ERRORS=$(echo "$TEST_FAILED_LINE" | tr ',' '\n' | wc -l | tr -d ' ')
fi

TOTAL=$((BUILD_ERRORS + CHECK_ERRORS + TEST_ERRORS))

echo "=== Build (TS errors: $BUILD_TS_ERRORS, task failures: $BUILD_TASK_FAILURES) ==="
echo "$BUILD_OUTPUT" | grep -E "error TS|Error |Build error|^Failed:" | head -20 || true
echo ""
echo "=== Checks (TS errors: $CHECK_TS_ERRORS, task failures: $CHECK_TASK_FAILURES) ==="
echo "$CHECK_OUTPUT" | grep -E "error TS|^Failed:" | grep -v "build:" | head -20 || true
echo ""
echo "=== Tests (task failures: $TEST_ERRORS) ==="
echo "$TEST_OUTPUT" | grep -E "^Failed:|FAIL" | head -10 || true
echo ""
echo "METRIC total_errors=$TOTAL"
echo "METRIC build_errors=$BUILD_ERRORS"
echo "METRIC check_errors=$CHECK_ERRORS"
echo "METRIC test_errors=$TEST_ERRORS"
