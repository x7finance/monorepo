---
title: Flash Swaps
---

![Flash Swap Xchange](https://assets.x7finance.org/images/docs/guides/flash-swap/flash-swap.svg)

Flash Swaps on Xchange allow users to withdraw up to the full reserves of any ERC20 token without upfront capital costs. Users can execute arbitrary logic during the transaction, with the requirement that by the end of the swap, they either:

- Pay for the withdrawn ERC20 tokens using the corresponding pair tokens.
- Return the withdrawn ERC20 tokens along with a small fee.
- These flash swaps offer significant advantages, eliminating the need for upfront capital and removing order-of-operations constraints for multi-step transactions involving Xchange.

A notable use case for flash swaps is capital-free arbitrage. Typically, arbitrage opportunities on Xchange require substantial capital to take advantage of price discrepancies. However, with flash swaps, anyone can participate in arbitrage opportunities as long as they can cover the gas fees.

For example, let's consider a situation where 1 ETH can be bought for 200 DAI on Xchange, but on another platform like Oasis, 1 ETH buys 220 DAI. This represents a risk-free profit of 20 DAI for anyone with 200 DAI available. With flash swaps, this opportunity becomes accessible to anyone willing to pay the gas fees for the flash swap.

Another practical use case for flash swaps is instant leverage. Users can efficiently leverage their positions using lending protocols and Xchange. By using flash swaps, users can withdraw the full ETH amount upfront and deposit double the amount into a lending protocol like Maker to achieve 2x leverage without the need for multiple transactions. This simplifies the process and reduces gas costs compared to traditional approaches.

In summary, flash swaps on Xchange offer versatile possibilities, enabling capital-free arbitrage and facilitating instant leverage in a gas-efficient manner.
