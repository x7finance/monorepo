## Developer Questions

### What leverage can I currently take when deploying liquidity?

Please find details on the [loans page here](/loans/)

{% spacer /%}

### Does X7 Finance have its own liquidity pools?

Yes.

X7 Finance has its own router, factory, and pairs contract to create liquidity pools and allows trading.

You can find the addresses for each chain on the [contracts page here](/contracts/)

{% spacer /%}

### What do I need to do with my token contract to deploy on X7 Finance?

All you need to do is set the router address in your token contract to X7 Finance Router Address.

{% spacer /%}

### What is a trustless Initial Liquidity Loan (ILL)?

An ILL allows the liquidity pair creator the ability to take a short-term loan to deploy more ETH in their LP than they originally planned or save funds by doing this.

The loan acts as a buffer of ETH in the liquidity pool, which creates a higher launch price and more stable trading over the initial phase.

{% spacer /%}

### Do I, the creator, receive the ILL funds?

No, the funds are always in the ownership of the X7 Finance smart contracts and placed automatically in the liquidity pool when you deploy your initial token liquidity.

{% spacer /%}

### What stops someone from creating a fake project and running off with the funds?

The liquidity pairs contract is aware of the loan amount at all times. If a sell transaction was created that would leave less ETH in the liquidity pair than the loan amount then the transaction will be rejected.

{% spacer /%}

### How is the loaned liquidity protected when Xchange is supposed to be in an AMM?

An AMM is just the underlying logic of a DEX to calculate a token price and is independent of the liquidity pair.

Xchange DEX has its own router, factory and pairs contracts. Although they function in line with uniswapV2 contracts they have some extra added functions. One of these functions checks during a sell transaction if the loan ETH in the liquidity pair will be less than the loaned amount. If so the trade will be rejected.

{% spacer /%}

### How does the liquidity pair creation work on X7 Finance?

More details and diagrams can be found on the [Swap Creation Guide Here](/whitepaper/understanding-swap-creation/)

{% spacer /%}

### Uniswap is using V3 why is X7 Finance based on V2?

The V2 design rewards liquidity pool providers across the whole range of the AMM. The V3 only rewards liquidity pool providers in a specific tick range set by the creator. When trading happens outside of this range, the liquidity provider receives zero fees.

V3 is a concept of manipulating liquidity into a theoretical trading range and ignoring the low/high liquidity areas.

X7, with its lending pool, will inject liquidity to naturally make the token price more stable and valuable on launch.

{% spacer /%}

### What is the liquidity provider fee?

The liquidity provider fee is 0.2%.

{% spacer /%}

### My token contract is already deployed; what options do I have to launch on X7 Finance?

If your token contract has an onlyOwner function you can set the router in your token contract to X7 Finance and create a new liquidity pair.

If the router is hard coded into the token contract, you have 3 options;

1. Upgrade your token contract to a V2, for example, and use the X7 Finance Router
2. If your LP tokens are locked or burnt, create a second new liquidity pair on X7 Finance which would allow for arbitrage bot trading when there is a price difference.
3. If your LP tokens are not locked or burnt, same as above, but you can also move a portion of your LP funds to the new pair on X7 Finance
