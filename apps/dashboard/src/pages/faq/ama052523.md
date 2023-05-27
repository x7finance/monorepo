## AMA May 25 2023

### Intro

gm or gn X7 community,

We are very excited to be here with you today.

We reviewed your many questions and we want to provide some clarity that covers a number of the questions related to our origin and background.

From the very beginning we have prided ourselves on decentralization, censorship resistance and privacy as much as possible and as a community you have continued this in various ways. We still believe that our identities really do not matter, although we do understand the human nature to always wonder.

With respect to the current team, the current active developers have done the bulk of contract and user interface development and will do so now and in the future. The nature of DeFi and centralization is that all parties (represented by private keys and signed transactions) act of their own free will. "Your keys, your crypto." All devs in the past, present, and future act on their own behalf with respect to the project.

We imagine that in the future we may find opportunties to share more but we also believe deeply that the code and product speaks for itself.

Trust no one. Trust code. Long live DeFi Baby!

——

We will now begin to forward questions into this channel along with a response. We welcome follow up questions and will do our best to get to the most pressing and interesting questions.

{% spacer /%}

### As extensive as the current ecosystem is, are you exploring any ideas to expand it?

The Initial liquidity loan use case is filling a critical DeFi need and has a large current and future capacity for capital. However, if we find that the capital in the ecosystem is not seeing high utilization (in the form of unused capital wrapped in X7D) we will explore new and novel use cases to put that capital to work.

{% spacer /%}

### What are the devs most excited for (in terms of x7s development)?

The core product (undercollatoralized initial liquidity loans) is in place. However, the exact fee schedules that will fit the market best is something that will need to be iterated on as we go to market.

The Initial Liquidity Loan Term contracts are relatively flexible but ultimately we will have to find the sweet spot for the fees that will maximize adoption and capital allocation.

This was by design a component that will be able to be quickly iterated on and we are very excited to do this iteration.

{% spacer /%}

### Any goodies we could possible see when Xchnage launches that were kept quiet to really give a wow factor?

One ecosystem detail that may be overlooked but that will lead to interesting market dynamics is the following:

Initial Liquidity Loans are actually collatoralized by the WETH in the liquidity pair, NOT by LP tokens. That means that loan liquidation will directly remove the WETH from the pair. This is SOMEWHAT similar to a sell of that size. The consequence of that is that liquidiation will not “rug” the project or fundamentally ruin it, and a project that has built sufficient liquidity will be able to absorb a liquidation just as a big sell. This means that in some cases the most financially prudent mechanism for loan satisfaction will be decentralized liquidation.

{% spacer /%}

### Once this gets launched, competitors will start to attack the ecosystem. Have you thought about what kind of attacks these will be and what things you can do to prevent or mitigate them?

- X7D capital is backed 1:1 with the base currency of the chain, this prevents against liquidity duration mismatch attacks. We will be using the X7100 tokens as the backstop for this attack. However because the Initial Liquidity Loan capital is never at risk - only “at use” - the principal payments will be used to recover reserves of X7100 tokens.

- We have categorically looked for and tested for various re-entrancy and other style risks with automated testing and are confident in the core technology.

- The dao design (as described in the whitepaper) is intented to mitigate various griefing attacks and the Magister NFT voting design is also intended as a general defense against centralized or malicious participation in the DAO.

{% spacer /%}

### Can you descrbe exactly how the constellation tokens provide the backstop for the loans? Will the constellation tokens in the lending pool be sold to ETH to cover the lending pool?

A significant portion of the lending pool revenue will be used to add liquidity in the X7100 series tokens and/or purchase tokens. These tokens and/or LP will be temporarily liquidated in order to maintain a proper fraction available for withdrawals. This possible volatility will ideally entice active traders to find strategies to take advantage of this and provide the necessary liquidity when needed.

The “shared liquidity” nature of the X7100 series tokens essentially “flattens” the constant product curve and will allow for significantly lower slippage “liquidity withdrawals”.

{% spacer /%}

### Will the auto slippage be programed into the exchange?  If not will at least the X7 tokens have auto slippage that works?

We have considered how to support enhanced trading features for investors, the top features we look to build client side are:

Auto slippage\
Contract Verification\
Honeypot Check\
Buy Tax Estimation\
Sell Tax Estimation

Once the product is released we will continue to iterate on these kinds of features to ensure Xchange has a best in class DEX user experience. Some of these features require fairly complex implementations in a way that is decentralized.

{% spacer /%}

### There were a number of questions related to the non-ETH chain airdrops:

#### You mentioned that we can choose between airdrop of ETH. Will we get the same amount we invested back, the value at snapshot or a percentage of the value ?

#### How will the airdrop on the other chains in regard to ratio and vesting take place? etc.

The two goals of the multi-chain airdrop are to:

1. Provide a maximum amount of value to the existing holders on Ethereum
2. Ensure a successful DAO token distribution and overall successful token market

We think the best way to achieve these two goals is to use the revenue from the product to underwrite the initial liquidity.
This means the exact value at launch of these tokens is a function of both timing and product success.

The exact timing and value of the airdrop is therefore dependent on post launch product performance.

{% spacer /%}

### Will current uniswap liquidity be moved to Xchange for tokens currently trading?

The liquidity for all pairs is currently locked in the Ecosystem Token Timelock

0x7000F4Cddca46FB77196466C3833Be4E89ab810C

A few months prior to the locks opening, we will orchestrate a trustless migration of liquidity from UniswapV2 to Xchange. This migration will then happen automatically when the locks expire.

The token timelock is purpose built to allow for this kind of migration and liquidity management to ensure that investors are never asked to trust an EOA.

{% spacer /%}

### Will devs unlock all pioneers to make them more tradable? And solve the OpenSea issue?

The pioneer NFTs were designed in a way that they can only be unlocked by the pioneer owner - as they ultimately should decide whether they want to unlock their pioneer for transfer.

We have not gotten exact clarity on WHY OpenSea no longer supports trading, but we think this is a great example of a centralized third party choosing who can play and who cannot. We encourage trading on platforms that are either more decentralized or at least those that respect that ethos.

Maybe OpenSea will come around or maybe they won’t. But we won’t specifically build or cater to the needs or wants of centralized authorities.

{% spacer /%}

### Any goodies we could possible see when Xchnage launches that were kept quiet to really give a wow factor?

One ecosystem detail that may also have escaped people is related to the DAO and Premium payments.

When a project takes an Initial Liquidity Loan, the origination fee, the loan principal, and the escrowed liquidation reward are held by the ecosystem and are not at risk. However, the premium payments are volitional and borrowers may choose to abandon their loan (and liquidation reward escrow) rather than paying the premium. This means that premiums will need to be set at a competitive level and collected in a way that may even entail off chain positive or negative incentives. The group most empowered to fine tune the product market fit is the DAO.

That is why a significant portion of the premiums receipts are paid into the DAO. Once governance is live (and sDAO - staked DAO tokens) are live, this value will flow directly to DAO token stakers in native currency. This will incentivize the DAO to iterate on the ecosystem design to maximize this payout.

{% spacer /%}

### Is there going to be a tool to make it easy for other projects to move their liquidity pools from uniswap to x7?

We will 100% offer a utility for migrating liquidity from uniswap to X7.

This is well within our core competency 😃

{% spacer /%}

### Tea or Coffee?

Coffee for life.

{% spacer /%}

### Have you begun any work/research towards deploying the ecosystem on any other chains other than the 5 we know?

"Gradually and then suddenly."

We want to limit the amount of risk of spreading the attention too wide that it would dilute the other chains's launches. We will be deployed to every EVM chain, as the product gains adoption.

### Can you launch a few test pairs so we can do some final tests on the Xchange pairs alerts channel?

Yes we will gladly do so.

We have also ensured Dextools compatibility, Bobby Buy Bot compatibility, and Buy Bot Tech compatibility.

{% spacer /%}

### What is your ‘end goal’ in crypto?

Every individual has a different goal in crypto. Rather than speak for all of the team or summarize, they will all speak for themselves.

Up until now we have only messaged on chain from the X7 DAO Dev address. Within the next few days, each dev will publish their personalized response from their own address.

{% spacer /%}

### What is the correct way of calculating pioneer rewards right now? (there was some confusion about that)

Revenue from token fees, NFT Mints, and Loans flow into the ecosystem splitter and the treasury splitter. A portion of that flows into the pioneer NFT contract. Each NFT grants you a 1/639th of the total ETH received by the pool. The exact ratios is something that can be changed. However there are minimums that ensure the Treasury Splitter and the Pioneer contract will always receive some portion of the ecosystem revenue.

{% spacer /%}

### On Xchange, an LP fee of 0.2% is charged on every swap. In addition, will there also be a percentage per swap that is allocated to the ecosystem revenue? If so, what is that percentage?

0.1% of trades on Xchange are accrued by liquidity providers.
Another 0.1% of trades on Xchange are accrued by the ecosystem.

As any pair may be created on Xchange, the proper liquidation path for those tokens into native tokens may require judgement. At present these ecosystem LP tokens will go into a multisignature wallet and will be liquidiated at the most opportune time.
Eventually we expect that this will be done in a trustless manner.

All liquidation revenue will be converted into native tokens and deposited in the ecosystem splitter.

{% spacer /%}

### Outro

THANK YOU EVERYONE FOR YOUR CONTINUED ATTENDENCE, SUPPORT, AND ENTHUSIASM.

WE WILL LOOK OVER THE OTHER SUBMITTED QUESTIONS (AND WILL CONTINUE TO MONITOR THE COMMUNITY CHATS) AND PROVIDE MORE ANSWERS THROUGH OUR TYPICAL ON CHAIN COMMUNICATIONS AND OTHER MARKETING COLLATORAL.

THANK YOU AGAIN!

LONG LIVE DEFI!
