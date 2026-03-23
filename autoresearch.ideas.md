# Autoresearch Ideas

## Remaining warnings (hard to fix safely)
- SOR on-chain-quote-provider: retry loops re-declare inputs/normalizedChunk/inputsChunked — would need restructuring
- SOR gas-factory-helpers: chainId shadows in nested functions — deep rename across many uses
- SDK swapRouter.ts: route destructuring shadows in for-of loops — 60+ refs to rename
- Org: 83 warnings (32 no-array-index-key, many no-shadow, 5 context-values, 4 no-explicit-any, 3 exhaustive-deps)
- Org hubs/table.tsx: 12 warnings from state vars shadowing in effects

## DONE
- ~~turbo.json outputs missing `build/**`~~ — fixed
- ~~`under-construction.tsx` uses `||` instead of `??`~~ — fixed
- ~~`@types/react-window` and `@types/react-virtualized-auto-sizer`~~ — removed
- ~~`env.mjs` → `env.ts`~~ — converted
- ~~icons(10), utils(5), tines(4), router(4) shadows~~ — fixed
- ~~ui(13) all warnings~~ — fixed  
- ~~sdk(19→2)~~ — most fixed
- ~~sor(31→12)~~ — most fixed
