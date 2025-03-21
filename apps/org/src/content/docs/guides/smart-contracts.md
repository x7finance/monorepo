---
title: Smart Contracts
---

Xchange functions primarily around 3 contracts to operate these are the router, factory and pairs contracts.

## Router Contract

The Router contract in Xchange serves as a facilitator for interactions with the Xchange protocol. It's a crucial component that helps users interact with the Xchange's ecosystem, particularly when executing complex operations. For example, it aids in swapping tokens, adding or removing liquidity, and routing trades through multiple pairs. It also acts as an intermediary, enabling transactions between different pairs and ensuring that the best execution path is selected. The Router contract thus plays a pivotal role in the efficient functioning of the Xchange ecosystem.

## Factory Contract

The Factory contract is another vital component of the Xchange protocol. It's responsible for creating new token pairs in the system. When a user wants to create a new trading pair that doesn't exist yet, they interact with the Factory contract. The Factory contract maintains a record of all pairs created, ensuring uniqueness and preventing duplication. This contract plays a critical role in expanding the Xchange ecosystem by facilitating the creation of new trading opportunities.

[View the factory contract breakdown](/docs/breakdowns/contracts/xchangefactory)

## Pairs Contract

The Pairs contracts, or liquidity pool contracts, in Xchange are at the core of the protocol's functionality. They hold the reserves of two ERC-20 tokens, representing a liquidity pool that users can trade against. These contracts are created by the Factory contract whenever a new pair is needed. Each pair contract adheres to a specific template, ensuring uniformity across all pairs. The Pairs contract keeps track of liquidity provision, handles trades, and ensures that the invariant (the product of the reserves) is maintained after each trade. This contract is crucial for maintaining the robustness and integrity of the Xchange trading ecosystem.

[View the pair contract breakdown](/docs/breakdowns/contracts/xchangepair)
