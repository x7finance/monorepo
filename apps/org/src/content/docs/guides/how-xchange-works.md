---
title: How Xchange Works
---

![How Xchange Works](https://assets.x7finance.org/images/docs/guides/how-xchange-works/how-xchange-works.jpg)

Xchange is an automated liquidity protocol driven by a constant product formula and executed through a set of immutable smart contracts on the Ethereum blockchain. It eliminates the necessity for trusted intermediaries, giving utmost importance to decentralization, censorship resistance, and security. Xchange is an open-source software.

Each Xchange smart contract, also known as a pair, operates a liquidity pool comprising reserves of two ERC-20 tokens.

Anyone can participate as a liquidity provider (LP) for a pool by depositing an equal value of each underlying token, receiving pool tokens in return. These tokens represent proportional LP shares of the total reserves and are freely exchangeable for the underlying assets at any given moment.

Xchange operates using pairs as automated market makers, ready to facilitate token exchanges following the "constant product" formula. This formula, represented as x \* y = k, ensures that the product (k) of a pair's reserve balances (x and y) remains unchanged during trades, which is commonly referred to as the invariant. The advantage of this formula is that larger trades, relative to the reserves, experience progressively worse execution rates compared to smaller trades.

In practical terms, Xchange imposes a 0.20% fee on trades, which 50% is added to the reserves and the other 50% going back into the eco-system. Consequently, each trade increases the value of k. This serves as a payout to liquidity providers (LPs), which they receive when redeeming their pool tokens to withdraw their share of the total reserves.

![AMM](https://assets.x7finance.org/images/docs/guides/how-xchange-works/amm.jpg)

As trading is the sole mechanism capable of altering the relative price of the two paired assets on Xchange, any divergences between the Xchange price and external market prices create arbitrage opportunities. This fundamental characteristic ensures that Xchange prices consistently trend towards the market-clearing price, promoting efficient price discovery within the protocol.

To see how token swaps work in practice, and to walk through the lifecycle of a swap, check out [Swaps](/docs/guide/swaps). Or, to see how liquidity pools work, see Pools.

Ultimately, of course, the Xchange protocol is just smart contract code running on Ethereum. To understand how they work, head over to [Smart Contracts](/docs/breakdowns).
