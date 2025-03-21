---
order: 100
tags: [guide]
---

# Fees

## Liquidity provider fees

There is a 0.2% fee for swapping tokens. This fee is split by liquidity providers proportional to their contribution to liquidity reserves and protocol.

Swapping fees are immediately deposited into liquidity reserves. This increases the value of liquidity tokens, functioning as a payout to all liquidity providers proportional to their share of the pool. Fees are collected by burning liquidity tokens to remove a proportional share of the underlying reserves.

Since fees are added to liquidity pools, the invariant increases at the end of every trade. Within a single transaction, the invariant represents token0_pool / token1_pool at the end of the previous transaction.

There are many community-developed tools to determine returns. You can also read more in the docs about how to think about LP returns.

## Protocol Fees

At the moment the protocol fees is 0.1%.
