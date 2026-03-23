# Autoresearch Ideas

## Dependency Upgrades (future — no impact on current metric)
- `@vitejs/plugin-react` was downgraded from v6→v5 due to vite 8 requirement. When vitest upgrades to support vite 8, re-upgrade.
- Global turbo version (2.5.8) doesn't match repo version (^2.8.20) — install turbo locally

## Architecture (no impact on current metric)
- `getRandomPioneerNumber()` now uses a deterministic counter — works for builds but means each build gets the same pioneers. Consider using build timestamp as part of seed if variety is desired.

## DONE
- ~~turbo.json outputs missing `build/**`~~ — fixed run 11
- ~~`under-construction.tsx` uses `||` instead of `??`~~ — fixed run 12
- ~~`@types/react-window` and `@types/react-virtualized-auto-sizer`~~ — removed run 10
- ~~`env.mjs` → `env.ts`~~ — converted run 14
