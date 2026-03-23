# Autoresearch: Fix Monorepo Build Errors

## Objective
Get the full X7 Finance monorepo to build, pass all checks (format, lint, typecheck), and pass all tests with zero errors. Currently there are multiple TypeScript errors across 6 packages/apps.

## Metrics
- **Primary**: `total_errors` (count, lower is better) — total unique TS errors across build + typecheck + checks
- **Secondary**: `build_errors`, `check_errors` — breakdown by phase

## How to Run
`./autoresearch.sh` — outputs `METRIC name=number` lines.

## Files in Scope
- `packages/dexie/tsconfig.json` — needs console/DOM types
- `packages/dexie/src/**` — console.error usage
- `packages/tines/tsconfig.json` — needs console/process types
- `packages/tines/src/**` — console/process usage
- `packages/router/tsconfig.json` — needs console/process types
- `packages/router/src/**` — console/process usage
- `packages/sdk/tsconfig.json` — needs console types
- `packages/sdk/src/**` — console usage
- `packages/ui/src/chart.tsx` — recharts type issues
- `packages/ui/src/currency/currency-list.tsx` — react-virtualized-auto-sizer/react-window import issues
- `apps/org/src/app/(xchange)/_components/swap/(chart)/*.tsx` — recharts payload type errors
- `tooling/typescript/build.json` — shared tsconfig base

## Off Limits
- Do NOT change test assertions or weaken tests
- Do NOT add `console.log` (only `console.error`/`console.warn` allowed)
- Do NOT use `||` for defaults (must use `??`)
- Do NOT add `any` types
- Do NOT break server/client boundary

## Constraints
- All packages must build to `dist/` with `tsgo`
- `workspace:*` internal dependency references must be preserved
- No regressions to already-passing packages
- Existing test assertions must not be weakened

## Error Summary (Baseline)
### Build errors (6 packages fail):
1. **@x7/dexie** — 4 errors: `console` not found (TS2584) — needs DOM lib
2. **@x7/tines** — ~30 errors: `console` (TS2584) + `process` (TS2591) — needs DOM + node types
3. **@x7/router** — ~25 errors: `console` (TS2584) + `process` (TS2591) — needs DOM + node types
4. **@x7/sdk** — 1 error: `console` (TS2584) — needs DOM lib
5. **@x7/ui** — 10 errors: recharts types in chart.tsx + import issues in currency-list.tsx
6. **@x7/org** (typecheck only) — 3 errors: recharts payload type in swap chart components

### Root cause analysis:
- `tooling/typescript/build.json` has `"lib": ["ES2022"]` — no DOM types, so `console` is unknown
- Packages using `process.env` also need `@types/node` or node types
- UI chart types need proper recharts generic typing
- UI currency-list needs different import style for react-virtualized-auto-sizer

## What's Been Tried

### ✅ Fix 1: Add DOM lib to build.json (155→33 errors)
- Added `"DOM", "DOM.Iterable"` to `tooling/typescript/build.json` `lib` array
- Added `"types": ["node"]` to `packages/tines/tsconfig.json` and `packages/router/tsconfig.json`
- Fixed all TS2584 (console) and TS2591 (process) errors across dexie, tines, router, sdk

### ✅ Fix 2: Recharts v3 type updates (33→8 errors)
- `packages/ui/src/chart.tsx`: Use `TooltipContentProps` instead of `ComponentProps<typeof Tooltip>` for tooltip content
- `packages/ui/src/chart.tsx`: Use `DefaultLegendContentProps` instead of `LegendProps` for legend content (v3 removed payload/verticalAlign from LegendProps)
- `packages/ui/src/currency/currency-list.tsx`: Use named import `{ AutoSizer }` (v2 doesn't have default export)
- `packages/ui/src/currency/currency-list.tsx`: Use `List` instead of `FixedSizeList` (react-window v2 API)

### ✅ Fix 3: Remaining type errors (8→0 errors)
- `chart.tsx`: Narrow `fill` to string before passing to `sanitizeColor`
- `chart.tsx`: Use `String(item.dataKey)` for React key prop (DataKey includes function type)
- `currency-list.tsx`: Rewrote for react-window v2 API (flat props instead of data wrapper, required rowProps)

### ✅ Fix 4: Test failures (1→0 test errors)
- `packages/default-token-list`: Added `ajv-formats` dep and `addFormats(ajv)` call (ajv v8 requires plugin for date-time format)
- `packages/token-lists/package.json`: Added export path `./src/tokenlist.schema.json` for backward compat
- `packages/ui`: Downgraded `@vitejs/plugin-react` from v6 to v5 (v6 requires vite 8, but vitest 4 uses vite 7)
- `packages/ui/vitest.config.ts`: Added `passWithNoTests: true` (no test files exist yet)

### ✅ Fix 5: Next.js config (experimental.ppr → cacheComponents)
- Removed `experimental.ppr: true` from `apps/org/next.config.ts` — PPR is now enabled via `cacheComponents: true`
- This was a Next.js 16 breaking change

### ✅ Fix 6: Next.js prerender errors (docs/blog pages)
- `apps/org/src/app/(docs)/docs/[[...slug]]/page.tsx`: Await `params` Promise (Next.js 16 change)
- `apps/org/src/app/(marketing)/blog/public/[[...slug]]/page.tsx`: Same — await `params` Promise
- `apps/org/src/app/(docs)/_utils/markdoc-parse.tsx`: Make `ParamsProps.section` optional (derived from slug)
- `apps/org/src/app/(marketing)/blog/_utils/markdoc-parse.tsx`: Same
- Wrapped metadata function in `"use cache"` directive for PPR compatibility

### ✅ Fix 7: Math.random() in server components
- `packages/utils/src/misc/pioneers.ts`: Replaced `Math.random()` in `getRandomPioneerNumber()` with deterministic seeded counter — compatible with Next.js 16 server components and PPR
- 24 files use this function across the org app

### Final result: 155 → 0 total errors (build + checks + tests + next build with 424 pages)

## Phase 2: Lint Warning Cleanup (173 → 94)

### ✅ Fix 8: Package-level no-shadow warnings
- icons (10→0): Prefix glyph imports to avoid enum shadowing
- utils (5→1): Rename inner loop vars, preserve-caught-error, non-null-assertion fix
- tines (4→0): Rename nested function params (vPrice, vGasPrice, fromToken/toToken)
- router (4→0): Rename filter destructuring, map callback params
- sdk (19→2): Reduce accumulator renames, loop var renames, redundant var removal
- sor (31→12): compute-all-routes callback params, retry renames, gas-factory-helpers, subgraph providers

### ✅ Fix 9: UI warnings (13→0)
- chart.tsx: useMemo for context value, config shadow rename
- form.tsx: useMemo for FormField and FormItem context values
- navigation-menu.tsx: useMemo for context value
- button.tsx: Rename inner forwardRef function
- chip-input.tsx: Rename sync callback param
- pathname-button.tsx: Forward ref parameter
- data-table: Static skeleton keys
- static-table: Semantic row keys, header keys
- token-view-row: Rename interface to Props suffix
- use-interval: Rename inner function param

### ✅ Fix 10: Org warnings (87→79)
- swap store: Rename _token0/_token1 callback params
- donut-chart: useMemo for context value
- web3 provider: useMemo for context value
- mobile-navigation: Use href as key
- site-header: Use href as key
- whiteboard skeleton: Static keys
