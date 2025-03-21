---
title: ERC20 Tokens
---

The ERC-20 token standard, also known as BEP-20 on Binance Smart Chain, provides a crucial framework for achieving interoperability between various tokens. By standardizing the core functionality of each token, ERC-20 ensures that all tokens created using this framework can seamlessly interact with one another. Additionally, this standard enables popular wallets like Metamask to support a wide range of tokens across different networks, as they are designed with the same set of rules.

The governance of every ERC-20 token is executed through a set of smart contracts, eliminating the need for reliance on any specific individual or entity for the token's operation. These smart contracts automatically enforce rules and conditions, allowing secure and trustless interactions. For instance, when users transfer tokens to others, they can do so without the need to place trust in intermediaries.

Developers implementing ERC-20 tokens must incorporate several required features, including functions such as totalSupply, balanceOf, transfer, approve, allowance, and transferFrom. These functions play crucial roles in determining token ownership, approving token spending, and facilitating seamless transactions.

Moreover, each ERC-20 token is equipped with two essential events: Transfer and Approval. The Transfer event is triggered when a successful transfer or transferFrom operation occurs, while the Approval event is fired when the approve function is called, providing details about the owner, spender, and the approved amount.

A notable concept related to ERC-20 tokens is that of "wrapped tokens." Wrapped tokens involve putting the original asset into a wrapper, enabling the minting of a wrapped version of the token on the same or a different blockchain. Wrapped tokens, represented by names with a 'w' prefix, such as wETH, wBTC, and wFTM, facilitate the creation of bridges between diverse blockchains.

When interacting with certain DeFi platforms on specific blockchains, like Fantom ($FTM), users are typically required to deposit wrapped tokens (e.g., wFTM) instead of the original token (FTM). The reason behind this is that smart contracts can interact with the ERC-20 token version (wFTM) but not with the original native token (FTM). Consequently, when users return the wrapped token, it is burnt, and the original token is promptly returned to them, ensuring a seamless and secure token exchange process.
