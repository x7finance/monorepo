---
title: Pools
---

## Token Value

![How Xchange Works](https://assets.x7finance.org/images/docs/guides/how-xchange-works/how-xchange-works.jpg)

Each Xchange liquidity pool serves as a trading venue for a specific pair of ERC20 tokens. When a pool contract is initially created, the balances of both tokens are set to 0. To enable the pool to facilitate trades, someone must provide an initial deposit of both tokens. This first liquidity provider plays a crucial role in setting the initial price of the pool. The incentive for this provider is to deposit an equal value of both tokens into the pool. By doing so, they minimize the chances of creating a profitable arbitrage opportunity. If the first liquidity provider were to deposit tokens at a ratio different from the current market rate, it would immediately attract external parties to exploit the price discrepancy through arbitrage.

When other liquidity providers subsequently add to an existing pool, they must deposit tokens in proportion to the current price. Failing to do so would expose the liquidity they added to potential arbitrage opportunities. If these liquidity providers believe that the current price is not accurate, they have the option to arbitrage it to the desired level before adding liquidity at that price. This mechanism helps to maintain the efficiency of the pool and ensures that liquidity providers are incentivized to align their deposits with the prevailing market conditions.

## Pool Token

![AMM](https://assets.x7finance.org/images/docs/guides/how-xchange-works/amm.jpg)

Whenever liquidity is added to a pool on Xchange, liquidity providers receive unique tokens called liquidity tokens. These tokens represent the specific liquidity provider's contribution to the pool. The number of liquidity tokens issued to a provider is determined based on the proportion of liquidity they provide in the pool. If a provider is creating a new pool, the number of liquidity tokens they receive will be equal to sqrt(x \* y), where x and y are the amounts of each token they provided.

When a trade occurs in the pool, a 0.2% fee is charged to the sender of the transaction. 50% of this fee is then distributed proportionally to all liquidity providers in the pool once the trade is completed. The remaining 50% is distributed for the eco-system.

To retrieve their share of the underlying liquidity, along with any accrued fees, liquidity providers must "burn" their liquidity tokens. This process effectively involves exchanging the liquidity tokens for their corresponding portion of the liquidity pool, including the proportional fee allocation.

Since liquidity tokens themselves are tradable assets, liquidity providers have the flexibility to sell, transfer, or utilize them in any way they wish, providing them with additional options for managing their investment.

## Liquidity Pools

Xchange distinguishes itself from traditional exchanges by embracing a unique approach that eliminates the need for order books. Instead, Xchange employs Liquidity Pools as a core element for enabling seamless token swaps.

Unlike conventional finance, where liquidity relies on centralized order books and requires active management by market participants, Xchange's decentralized environment offers a fresh perspective. The use of order books necessitates intermediary infrastructure to host and match orders, which can introduce points of control and complexity. Moreover, the active involvement of sophisticated market makers may limit accessibility for many traders. Order books were initially designed for a world with limited assets, making them less ideal for the diversity of tokens within decentralized ecosystems, each with varying liquidity.

In Xchange, a Pool is represented by a smart contract, interacted with through function calls made by users. Token swapping is achieved by calling the swap function on a Pool contract instance, while liquidity providers add funds by calling the deposit function.

Just like end-users can seamlessly interact with the Xchange protocol through its user-friendly Interface, developers also have the flexibility to directly interact with the smart contracts. This empowers developers to integrate Xchange's functionality into their applications without the need for intermediaries or permissions. The decentralized and inclusive nature of Xchange ensures a vibrant ecosystem where all participants can actively engage in the Xchange protocol.
