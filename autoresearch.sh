#!/bin/bash
set -euo pipefail

# Count unique TypeScript errors from build
BUILD_OUTPUT=$(turbo build --continue --output-logs=errors-only 2>&1 || true)
BUILD_ERRORS=$(echo "$BUILD_OUTPUT" | grep -c "error TS" || true)

# Count errors from checks (format + lint + typecheck)
CHECK_OUTPUT=$(TURBO_LOG_ORDER=stream turbo format lint typecheck --continue --output-logs=errors-only 2>&1 || true)
CHECK_TS_ERRORS=$(echo "$CHECK_OUTPUT" | grep "error TS" | grep -v "build:" | grep -c "error TS" || true)
CHECK_LINT_ERRORS=$(echo "$CHECK_OUTPUT" | grep -c "oxlint.*error" || true)
CHECK_FORMAT_ERRORS=$(echo "$CHECK_OUTPUT" | grep -c "oxfmt.*error" || true)
CHECK_ERRORS=$((CHECK_TS_ERRORS + CHECK_LINT_ERRORS + CHECK_FORMAT_ERRORS))

# Count test failures
TEST_OUTPUT=$(turbo test --continue --output-logs=errors-only 2>&1 || true)
TEST_ERRORS=0
if echo "$TEST_OUTPUT" | grep -q "^Failed:"; then
  TEST_ERRORS=$(echo "$TEST_OUTPUT" | grep "^Failed:" | tr ',' '\n' | wc -l)
fi

TOTAL=$((BUILD_ERRORS + CHECK_ERRORS + TEST_ERRORS))

echo "=== Build errors: $BUILD_ERRORS ==="
echo "$BUILD_OUTPUT" | grep "error TS" | head -20 || true
echo ""
echo "=== Check errors: $CHECK_ERRORS ==="
echo "$CHECK_OUTPUT" | grep "error TS" | grep -v "build:" | head -20 || true
echo ""
echo "=== Test failures: $TEST_ERRORS ==="
echo "$TEST_OUTPUT" | grep "^Failed:" || true
echo ""
echo "METRIC total_errors=$TOTAL"
echo "METRIC build_errors=$BUILD_ERRORS"
echo "METRIC check_errors=$CHECK_ERRORS"
echo "METRIC test_errors=$TEST_ERRORS"
