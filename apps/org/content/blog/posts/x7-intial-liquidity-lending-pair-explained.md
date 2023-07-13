---
title: X7 Liquidity Lending Pair Explained.
authors: [mikemurpher]
date: Jan 11, 2023
imageUrl: /images/blog/headers/revolutionary-lending.png
tags: [Review]
summary: ILL - Initial Liquidity Loan.
---

Xchange router, factory and pairs contracts will soon go live and by understanding the benefits of launching on Xchange could be extremely beneficial for your token launch.

Normally when a token is launched the next step is to enable trading to allow people to purchase and later trade the token.

This is done by creating a liquidity pair through a factory such as Uniswap or Sushiswap on Ethereum, Pancakeswap on Binance Smart Chain and Spooky Fi on Fantom.

When the liquidity pair is created the creator deposits a certain amount of the newly created tokens with another ERC token usually Ethereum (technically it is wrapped Ethereum) on the Ethereum Network.

To Keep numbers simple we will say that 10 $X7R and 10 $ETH was deposited into the liquidity pair. Thus 1 $X7R is equal to 1 $ETH.

![Standard Liquidity Pair Example](https://assets.x7finance.org/images/blog/posts/x7-intial-liquidity-lending-pair-explained/standard-liquidity.png)

When the next buyer comes in with 1 $ETH they will receive 1 $X7R (excluding exchange fees, AMM calculation etc) and the liquidity pair will now have 9 $X7R and 11 $ETH meaning 1 $X7R is equal to 1.22$ETH.

With Xchange and to note you aren’t required to deploy your liquidity pair with leverage but below will show the advantage of the initial token launch by doing so.

In the above example the creator deployed their liquidity with 10 $ETH if they had used an Xchange Initial Liquidity Loan they could borrow up to 10 times this (if there is enough capital in the lending pool to do so).

This would mean at launch on Xchange there would be 10 $X7R and 100 $ETH in the lending Pool. The value of 1 $X7R is worth 10 $ETH where it was originally worth only 1 $ETH deploying on another exchange.

![Standard Liquidity Pair Example](https://assets.x7finance.org/images/blog/posts/x7-intial-liquidity-lending-pair-explained/Initial-Liquidity-Loan-Trading.png)

By deploying your project with leveraged liquidity it gives a lot of benefits to the project, the investor and the opinion of your project token;

- Less volatility in trading where early holders can easily pump and dump for fast gains
- More stable market cap attracting better investors
- Less initial liquidity needed when creating a pair
- Higher trading volume

When trading is open on an Xchange liquidity pair there may come a time due to reflections or a hidden mint function that would cause a scenario where there is more selling (1000 $X7R tokens in circulation) then the initial deployment amount of 10 $X7R. The Xchange Liquidity pair is aware of the amount of leverage (in the example 90 $ETH) that has been used at all times and if a sell was going to decrease the $ETH in the liquidity pair below 90 $ETH it will reject the sale.

This is a protection mechanism that makes sure the funds within the X7 eco-system are protected. So the creator is never in control of the leveraged amount, only the reserves (10 $ETH in the example) they leveraged against.
