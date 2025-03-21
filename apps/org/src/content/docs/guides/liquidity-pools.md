---
title: Liquidity Pools
---

A liquidity pool is a mechanism used on Xchange to provide liquidity for trading pairs of assets. In the context of decentralized exchanges (DEXs) like Xchange, a liquidity pool consists of funds from users who contribute tokens to a smart contract. These tokens are used to facilitate trading between different assets within the pool.

When users deposit their tokens into a liquidity pool, they are essentially becoming liquidity providers (LPs). Each liquidity pool is dedicated to a specific trading pair, such as X7R/LUSD, and it requires an equal value of both tokens to maintain the balance.

The primary purpose of a liquidity pool is to ensure that there are sufficient funds available for buyers and sellers to execute trades without relying on traditional order books. Instead of relying on a centralized entity to match buy and sell orders, liquidity pools use an automated market maker (AMM) mechanism to determine the prices for trades.

The AMM formula used in many liquidity pools, including those on Xchange, is called the constant product formula. It states that the product of the reserve balances of the two tokens in the pool must remain constant. When a trade occurs, the amount of one token in the pool increases, while the amount of the other token decreases to maintain the constant product.

LPs are incentivized to provide liquidity to these pools by earning a share of the trading fees generated from the trades within the pool. When a trade happens, a small fee (e.g., 0.2% on Xchange) is charged to the traders, and 50% of this fee is proportionally distributed among the LPs based on their contribution to the liquidity pool.

You can read more about Liquidity Pools in the [How Xchange Works](/docs/guides/how-xchange-works) section
