---
title: Xchange — The ‘Decentralised’ DEX we all wanted is here.
authors: [mikemurpher]
date: Dec 18, 2022
imageUrl: /images/blog/headers/story-3.png
tags: [Review]
summary: Just because it's referred to as a DEX doesn't mean it's ‘Decentralized’.
---

![](https://assets.x7finance.org/images/blog/posts/Xchange—The-Decentralised-DEX-we-all-wanted-is-here/DEX-we-all-wanted-is-here.png)

If you’re new to DEXs Uniswap is one of the leading crypto exchanges that run on the Ethereum blockchain. It’s referred to as being a ‘Decentralised’ exchange but we will come back to this.

The vast majority of crypto trading takes place on centralised exchanges (CEX) such as Coinbase and Binance. These platforms are governed by a single authority (the company that operates the exchange) and require users to place funds under their control. They function by using a traditional order book system to facilitate trading. When you use CEXs you hand over ownership of your tokens and forfeit control of them. CEX’s are also off-chain meaning you/we have no visibility of the legitimacy of how they operate. Due to this, we have seen the downfall of billion-dollar companies overleveraging and collapsing in this 2022 bear market. Three Arrows Capital (3AC) $42 billion lost in token value, FTX went bankrupt with a $32 billion valuation, VOYAGER DIGITAL, CELSIUS NETWORK, Alameda Research, BLOCKFI and more with the consumer, YOU, always being hit the worst and being the last in the chain to be reimbursed or not at all.

A DEX (decentralised exchange) is a peer-to-peer marketplace where users can trade cryptocurrencies via liquidity pairs in a non-custodial manner without the need for an intermediary to facilitate the transfer and custody of funds. Meaning you stay in ownership of your tokens at all times.

The most popular DEX that users are familiar with is Uniswap. Uniswap created in 2018 is fully open source allowing anyone to review the code, create pull requests with a bug fix and even fork the project to launch their own exchange. It is responsible for how most DEXs operate today.

But Uniswap and its forks aren’t fully decentralised. An example is the apis it uses to function and operate. Uniswap is built using the Infura API Suite which is a centralised service provider for querying blockchain data, meaning they also rely on other companies for them to function. Infura API was used by Tornado Cash which they disabled access to.

Uniswap has the ability to delist tokens via its interface meaning that the tokens won’t be displayed but the liquidity pair still exists as they are not the owner of this liquidity pair. They also have a partnership with TRM Labs. TRM Labs processes wallet addresses which are connected to the Uniswap app. This is deemed to be done for monitoring wallets that perform criminal activity but all wallets are monitored. This data sniffing can then be used to block wallet addresses from using the Uniswap service, if the block is in error it requires you to email a support address to liaise with the unblocking.

Uniswap introduced a token called $UNI. A governance protocol to allow users to vote on topics related to the protocol. The distribution of this was 60% provided to the community with the remaining 40% given to Uniswap itself, Investors and advisers.

There is a strong argument that this is as good as decentralisation can get but there always seems to be doubt about how private DEXs actually are.

This doubt is what Xchange is fixing.

The starting point is to remove centralised APIs which has been done. Xchange is relying solely on on-chain data for the swap functionality.

The governance token $X7DAO was a stealth launch which fairly allows anyone to purchase the token to propose and vote on the future of the project.

The user experience. We’re currently at a time where transaction fees are relatively low but it wasn’t too long ago people’s first complaint was transaction fees and slippage price impact.

In Miracle on 34th Street Kris Kringle tells customers where to find a better price (even if it means sending them to competing stores). Xchange goes a step further and will go to the store and get it for you.

Xchange will have its own liquidity pair factory to create its own pools but during a transaction, if there is better liquidity on another DEX it will perform cross-chain DEX liquidity routing to get the best rate.

The routing algorithm will select the most advantageous route to take either on Uniswap, Xchange or across multiple pairs on both exchanges. The routing algorithm will initially be solely client-side (with contract support to make the optimal swaps in a single transaction). In the future, Xchange will provide a limited on-chain cross-dex routing algorithm to allow for on-chain integrations.
