---
title: Understanding Swap Creation
tags: [whitepaper]
---

Below follows a quick overview of how the smart contracts for swapping are created in Uniswap and on Xchange

## Overview - Uniswap

In Uniswap, a user has 100M TokenA and & 10 ETH and wants to launch a Swap: calls TokenA#approve, then calls the Uniswap#AddLiquidityETH function sending 100M TokenA and 10Eth. A successful result yields a newly launched Liquidity Pair contract with 100M TokenA and 10Eth of liquidity. User now has 10 ETH worth of liquidity tokens.

![Uniswap Flow](https://assets.x7finance.org/images/diagrams/uniswap-001.jpg)

## Overview - Xchange

In Xchange, a user has 100M TokenA and & 1 ETH and wants to launch a Swap with 10 ETH of Liquidity: calls TokenA#approve, LendingPool#InitialLiquidityLoan which calls Xchange#AddLoanedLiquidity function sending 100M TokenA and 1Eth and a selected Initial Liquidity Loan. A successful result yields a newly launched contract with 100M TokenA and 10Eth of liquidity. User now has 10 ETH worth of liquidity tokens.

![Xchange Flow](https://assets.x7finance.org/images/diagrams/uniswap-002.jpg)
