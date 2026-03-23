# Autoresearch: Zero Console Errors

## Objective
Eliminate all console.error and console.warn output across every page in apps/org.
The benchmark visits 39 pages via Playwright and collects browser console output.

## Metrics
- **Primary**: error_count (count, lower is better) — total console errors + warnings
- **Secondary**: errors, warnings, clean_pages, pages_with_issues

## How to Run
`./autoresearch.sh` — outputs `METRIC name=number` lines.
Requires dev server running at https://x7-org.localhost:1355

## Files in Scope
- `apps/org/src/` — all app source code
- `packages/*/src/` — shared package source code
- `scripts/testing/console-check.ts` — the benchmark script (can update filters)

## Off Limits
- No new dependencies
- Don't change API behavior or public component interfaces
- No React anti-patterns (conditional hooks, hooks in JSX, hooks after early returns)
- Pages must render without hydration mismatches

## Constraints
- `bun run checks` must pass (format, lint, typecheck)
- Each fix should be targeted — one error category at a time

## Known Error Categories (from baseline)
1. **Duplicate keys** (14 on /dashboard, 4 on /lending, 7 on /liquidity) — React warning about children with same key
2. **Unrecognized DOM prop** (2 on /dashboard/contracts/*) — passing non-standard props to DOM elements
3. **element.ref removed in React 19** (2 on /create) — likely from react-hook-form or similar
4. **404 resource** (1 on /swap) — missing resource
5. **Filtered as noise**: Lit dev mode warning (third-party, every page)

## What's Been Tried
- Baseline: 80 errors total (after filtering Lit dev mode warnings)
