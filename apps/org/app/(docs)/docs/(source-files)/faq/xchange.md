---
tags: [FAQ]
title: Xchange Questions
---

## What is a Decentralized Exchange (DEX)?

DEX offers complete ownership of coins and control of private keys during your trading.

DEXs use "automated market maker" AMMs protocols to determine the prices of assets without a centralized body orchestrating trades.

{% spacer /%}

### What is Xchange?

Xchange is a DEX that allows users to trade crypto tokens anonymously.

{% spacer /%}

### Why should I use Xchange?

Xchange is a fully decentralized exchange that uses no 3rd party APIs.

Xchange also features Auto Routing. If there is a better price option available through a different liquidity pair provider such as Uniswap, Xchange will route your trade to that LP to save you fees.

{% spacer /%}

### Does Xchange track me?

No. Xchange is a fully decentralized exchange with no 3rd party APIs and no analytics tracking.

{% spacer /%}

### What is the URL address for Xchange?

[https://beta.x7.finance/#/swap](https://beta.x7.finance/#/swap)

{% spacer /%}

### How does Xchange work out the swap token price?

Similar to Uniswap, Xchange uses the constant product formula.

When a token is withdrawn (bought), a proportional amount must be deposited (sold) to maintain the constant. The ratio of tokens in the pool, in combination with the constant product formula, ultimately determines the price at that a swap executes.

{% spacer /%}

### If Xchange is an aggregator like 1inch, what makes it different?

Xchange also has its own Router, Factory, and Pairs contracts which allow the creation of liquidity pairs. 1inch doesn't have the ability to create liquidity pairs

{% spacer /%}

### Uniswap is at V3 why is Xchange only using V2?

Uniswap V3 will only reward lp providers when trading is done between a set tick range - when trading happens outside of this trading range, LP providers receive zero profits.

V3 is a concept of manipulating liquidity into a theoretical trading range and ignoring the low/high liquidity areas.

X7, with its lending pool, will inject liquidity to naturally make the token price more stable and more valuable on launch.

{% spacer /%}

### What is the liquidity provider fee?

The liquidity provider fee is 0.2%

{% spacer /%}

### Is Xchange rug proof?

No. Although the loan lending liquidity pairs are rug-proof by having the loan locked in the smart contract at all times.
