---
title: Impermanent Loss
---

To gain a better understanding of Impermanent Loss, let's delve into the dynamics of a transaction within a liquidity pool, particularly focusing on the X7R-LUSD-LP pair.

![Impermanent Loss Curve](https://assets.x7finance.org/images/docs/guides/impermanent-loss/impermanent-loss-curve.png)

For illustrative purposes, assume you deposit 100 X7R tokens and 100 LUSD into the X7R-LUSD-LP pool, where the ratio between the two tokens is 1:1, valuing 1 X7R token at $1.

When a buyer, purchases $10 worth of X7R at the rate of $1 per token, the pool will now hold 90 X7R tokens and $110 LUSD. If you decide to withdraw your tokens from the pool at this point, you would receive approximately this amount, excluding any applicable fees.

Now, let's examine the new price of X7R after this transaction. We can calculate it using the remaining tokens in the pool.

X7R Price = LUSD / X7R

X7R Price = 110 / 90 = $1.22... thus, the new price for X7R is $1.22.

Next, let's consider the scenario of a liquidity pool with multiple users, where 10 individuals, including yourself, deposit 100 X7R tokens and 100 LUSD each into the X7R-LUSD-LP pool. In this pooled scenario, the pool accumulates a total of 1000 X7R tokens and 1000 LUSD, resulting in a pool value of $2000.

Given that you own 10% of the pool, your share amounts to $200. Now, suppose the price of X7R rises to $4 due to increased demand. In this case, the pool would contain 500 X7R tokens and 2000 LUSD.

Consequently, your 10% ownership of the pool would translate to 50 X7R tokens and $200, totaling $400. However, if you had chosen to hold your initial 100 X7R tokens and 100 LUSD in your wallet instead, the total value would have amounted to $500. This discrepancy in value is what constitutes Impermanent Loss.

To break down the implications of Impermanent Loss compared to simply holding the tokens (HODLing):

1.25x price change = 0.6% loss
1.50x price change = 2.0% loss
1.75x price change = 3.8% loss
2x price change = 5.7% loss
3x price change = 13.4% loss
4x price change = 20.0% loss
5x price change = 25.5% loss

Impermanent Loss highlights the potential risks and financial consequences associated with liquidity provision, emphasizing the need for strategic decision-making and careful consideration of market conditions when participating in liquidity pools on Xchange.
