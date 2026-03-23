#!/bin/bash
set -euo pipefail

# Count unique TypeScript errors from build (includes typecheck deps)
BUILD_OUTPUT=$(turbo build --continue --output-logs=errors-only 2>&1 || true)
BUILD_ERRORS=$(echo "$BUILD_OUTPUT" | grep -c "error TS" || true)

# Count unique TypeScript errors from checks (format + lint + typecheck)
CHECK_OUTPUT=$(TURBO_LOG_ORDER=stream turbo format lint typecheck --continue --output-logs=errors-only 2>&1 || true)
# Only count errors that aren't already in build output (typecheck may overlap with build)
CHECK_TS_ERRORS=$(echo "$CHECK_OUTPUT" | grep "error TS" | grep -v "build:" | grep -c "error TS" || true)
CHECK_LINT_ERRORS=$(echo "$CHECK_OUTPUT" | grep -c "oxlint.*error" || true)
CHECK_FORMAT_ERRORS=$(echo "$CHECK_OUTPUT" | grep -c "oxfmt.*error" || true)
CHECK_ERRORS=$((CHECK_TS_ERRORS + CHECK_LINT_ERRORS + CHECK_FORMAT_ERRORS))

# Count failed tasks
BUILD_FAILED=$(echo "$BUILD_OUTPUT" | grep -c "^Failed:" || true)
CHECK_FAILED=$(echo "$CHECK_OUTPUT" | grep -c "^Failed:" || true)

TOTAL=$((BUILD_ERRORS + CHECK_ERRORS))

echo "=== Build errors: $BUILD_ERRORS ==="
echo "$BUILD_OUTPUT" | grep "error TS" | head -20 || true
echo ""
echo "=== Check errors (non-build): $CHECK_ERRORS ==="
echo "$CHECK_OUTPUT" | grep "error TS" | grep -v "build:" | head -20 || true
echo ""
echo "METRIC total_errors=$TOTAL"
echo "METRIC build_errors=$BUILD_ERRORS"
echo "METRIC check_errors=$CHECK_ERRORS"
