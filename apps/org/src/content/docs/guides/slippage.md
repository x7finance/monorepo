---
title: Slippage
---

Slippage refers to the disparity between the anticipated price of a crypto asset at the time of placing an order and the actual price at which the order is executed.

![AMM Trading Slippage](https://assets.x7finance.org/images/docs/guides/slippage/slippage.png)

The slippage percentage indicates the extent of price movement for a specific asset. Given the inherent volatility of the cryptocurrency market, the price of an asset can experience frequent fluctuations, influenced by trade volume and market activity.

DEXs (Decentralized Exchanges) are particularly affected by slippage, which is contingent on the available liquidity. In situations where there is low liquidity or limited trading activity for a particular asset, the slippage percentage tends to be higher. This phenomenon is largely attributed to the functioning of Automated Market Makers (AMMs) and the intricacies of price calculation.

Setting the slippage tolerance too high can lead to potential vulnerabilities like front-running and sandwich attacks. Front-running involves an attacker observing a pending transaction and then executing a significantly larger transaction (with the same tokens) just before and after the victim's transaction. This action artificially drives up the price of the victim's transaction, enabling the attacker to extract the difference in value. By keeping the slippage tolerance at a lower level, such attacks can be effectively mitigated.

On the other hand, setting the slippage tolerance too low may result in transactions failing to execute, leading to missed opportunities during significant price movements. This could be particularly detrimental during substantial price jumps or drops, causing users to forego cashing in or out at favorable prices and incurring additional losses in gas fees due to the failed transactions.

Balancing the slippage tolerance is essential to optimize trading strategies and achieve successful outcomes in the dynamic and rapidly changing landscape of cryptocurrency markets. It requires careful consideration of market conditions and individual risk preferences to strike an appropriate balance between mitigating risk and capitalizing on favorable price opportunities.

In some cases, ERC20 tokens may incorporate taxes or fees directly into their smart contracts, which can significantly impact the slippage amount required for a trade to be executed successfully. These embedded taxes within the token's contract can introduce additional costs or deductions during the transaction, affecting the overall trade price. As a result, traders need to account for these potential fees while setting their slippage tolerance to ensure that the trade can be executed without facing unexpected price discrepancies or failed transactions. Being mindful of such token-specific taxes is crucial for traders aiming to navigate the complexities of the cryptocurrency market and achieve optimal trade outcomes while managing slippage effectively.
