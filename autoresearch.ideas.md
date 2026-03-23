# Autoresearch Ideas — Remaining Lint Warnings (38)

## Irreducible org warnings (23)
- 12 `no-array-index-key`: Code fence tokens (4), sequential loan/period lists (8) — genuinely correct uses of index keys
- 4 `no-explicit-any`: RHF form.control cast in create-coin-form, useRemoveLiquidityHook — intentional
- 3 `exhaustive-deps`: slippage/token0Approval in swap store — complex hook deps, risky to change
- 3 `no-shadow`: value (currency-input prop), SlippageTolerance (component name collision), path (node import)
- 1 `jsx-no-constructed-context-values`: swap-state provider builtState — too many deps for useMemo

## SOR (12)
- on-chain-quote-provider: retry loops re-declare inputs/normalizedChunk/inputsChunked (5)
- gas-factory-helpers: chainId in nested functions (2)
- Other: error, total, routes, pools shadows in complex functions (5)

## SDK (2)
- swapRouter.ts: route destructuring in for-of loops — 60+ refs to rename safely

## Tines (1)
- Unknown remaining warning
