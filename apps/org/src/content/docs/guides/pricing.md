---
title: Pricing
---

## Token Price

As we explored earlier in [How Xchange Works](/docs/guides/how-xchange-works), Xchange, operates on the foundation of liquidity pools for each trading pair. These liquidity pools function as smart contracts, housing reserves of two unique tokens, and they strictly enforce rules governing the deposit and withdrawal processes. The core rule is based on the constant product formula, which maintains a consistent value despite trades.

Whenever a user interacts with Xchange and withdraws or buys a token from a liquidity pool, they are required to deposit or sell a proportional amount of the other token to uphold the constant product. This dynamic relationship between the token reserves and the constant product formula determines the execution price of swaps on Xchange.

The constant product formula, expressed as x \* y = k, ensures that trades occur at fair and transparent prices, adapting to the changing dynamics of token balances within the liquidity pool. As trade volume and activities fluctuate, the formula maintains the constant value of the product of token reserves, facilitating smooth and efficient swaps.

By implementing these principles and embracing liquidity pools, Xchange fosters a decentralized, secure, and user-friendly environment for traders and liquidity providers alike. The constant product formula underpins Xchange's commitment to decentralization and ensures the equitable and decentralized pricing of assets on the platform.

## Trading Prices

When swapping tokens on Xchange. The aim is to receive as many output tokens as possible for a specific input amount or pay as few input tokens as possible for an exact output amount. To calculate these amounts, a smart contract needs to look up the current reserves of the Xchange trading pair to determine the prevailing price. However, performing this lookup without access to an external price source can be risky.

Suppose a smart contract wants to send 10 X7R tokens to the X7R/WETH pair and receive as much WETH as possible based on the current reserve ratio. A naive approach would involve looking up the current price and executing the trade. However, this leaves the contract vulnerable to front-running, potentially resulting in economic losses. A malicious actor could intercept the transaction, manipulate the X7R/WETH price, and exploit the naive swap for profit.

To safeguard against such attacks, it is crucial for swaps to access knowledge about the "fair" price at which the trade should execute. This can be achieved through the smart contract reserves, which provides insight into what the "true" price should be. By considering arbitrage opportunities, the ratio of intra-block reserves for the pair is usually close to the "true" market price. With this knowledge, a user can submit a trade, ensuring that losses due to front-running are kept within strict bounds.

To enhance trade safety, the Xchange frontend, for instance, employs this approach. It calculates optimal input/output amounts based on observed intra-block prices and utilizes the router to execute the swap. This guarantees that the swap will occur at a rate no worse than a user-specified slippage tolerance (defaulting to 0.5%) below the observed intra-block rate, safeguarding against undesirable price fluctuations and ensuring a more secure and efficient trading experience.
