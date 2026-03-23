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
(Nothing yet — baseline run)
