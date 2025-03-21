---
title: Xchange Swaps
---

[Xchange Swap](https://www.x7finance.org)

1 - Connect your wallet by clicking the connect button and then the connect wallet that appears underneath this. (currently Metamask and Wallet Connect supported) with more added as the market need exists (Coinbase Wallet, etc.)

![Xchange Homepage](https://assets.x7finance.org/images/docs/guides/xchange-swaps/homepage.png)

- Click Connect and then the connect wallet button that appears

![Xchange Wallet Connect](https://assets.x7finance.org/images/docs/guides/xchange-swaps/wallet-connect.png)

- Select the connection method for your wallet

2 - Make sure you are on the Ethereum Chain (for this example)

![Select Chain](https://assets.x7finance.org/images/docs/guides/xchange-swaps/select-chain.png)

- Select the Ethereum Chain

3 - Enter the tokens you want to swap. The swap is set to auto slipperage tolerance. Click the setting cog in the top right corner to override this to a preffered slippage.(use ~6% for $X7R token).

![Token Swap](https://assets.x7finance.org/images/docs/guides/xchange-swaps/token-swap.png)

- Select your tokens to swap

4 - Click ‘swap' when ready

![Xchange Swap Button](https://assets.x7finance.org/images/docs/guides/xchange-swaps/swap.png)

- Press Swap

5 - A confirm swap pop up will appear. The first time you use Xchange you need to press Accept first then Confirm Swap

![Confirm Swap](https://assets.x7finance.org/images/docs/guides/xchange-swaps/confirm-swap.png)

- Press Accept on your first use followed by Confirm Swap

6 - A waiting for confirmation window will appear where you now need to approve the transaction in your wallet.

![Confirm Swap](https://assets.x7finance.org/images/docs/guides/xchange-swaps/await-confirmation.png)

7 - When you have approved in your wallet the transaction will be submitted.

![Confirm Swap](https://assets.x7finance.org/images/docs/guides/xchange-swaps/transaction-submitted.png)

8 - You can review your transaction history in the dropdown of the the connect wallet.

![Confirm Swap](https://assets.x7finance.org/images/docs/guides/xchange-swaps/swap-history.png)

In addition to the core routing operations between pairs on Xchange (e.g. WETH -> Token A -> Token B ) we are be supporting cross DEX liquidity routing. This is to support swaps like WETH -> Uniswap Pair for Token A -> Xchange Swap for Token B.

The routing algorithm will select the most advantageous route to take either another DEX, Xchange, or across multiple pairs on both exchanges.
