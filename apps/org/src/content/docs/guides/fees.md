---
title: Fees
---

In Xchange, the fees for swapping tokens are set at 0.2% per trade. Out of this fee, 50% is distributed to liquidity providers in proportion to their contribution to the liquidity reserves, while the remaining 50% is allocated back into the ecosystem.

When users perform token swaps, the 0.1% fee is immediately added to the liquidity reserves. As a result, the value of liquidity tokens increases, functioning as a payout to all liquidity providers in proportion to their share of the pool. To collect their share of the fees, liquidity providers need to burn their liquidity tokens, which results in the removal of a proportional share of the underlying reserves.

As fees are continuously added to liquidity pools, the invariant (token0_pool / token1_pool) increases at the end of every trade. Within a single transaction, the invariant represents the ratio of the pool's reserve tokens at the end of the previous transaction.
