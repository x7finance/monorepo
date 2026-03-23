# Autoresearch Ideas

## Minor Turbo Config Fixes (won't change metric — just warnings)
- `@x7/default-token-list` builds to `build/` but turbo.json expects `dist/**` — add `"build/**"` to turbo.json outputs or change package output dir
- `@x7/subgraph` builds to `build/` from graph-cli — same issue

## Code Quality (won't change metric — covered by oxlint-disable)
- Many `/* oxlint-disable */` comments across the codebase — could be cleaned up by fixing the underlying issues
- `under-construction.tsx` uses `||` for defaults instead of `??` (has oxlint disable)
- `packages/ui/src/chart.tsx` has many oxlint disables for unsafe operations
- `apps/org/src/env.mjs` could be converted to `.ts` for consistency

## Dependency Upgrades (future)
- `@vitejs/plugin-react` was downgraded from v6→v5 due to vite 8 requirement. When vitest upgrades to support vite 8, re-upgrade.
- Global turbo version (2.5.8) doesn't match repo version (^2.8.20) — install turbo locally

## DONE (pruned)
- ~~@types/react-window and @types/react-virtualized-auto-sizer~~ — removed in run 10
