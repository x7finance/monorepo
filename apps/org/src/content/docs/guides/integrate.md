---
title: Project Engineers
---

## Elevate Your Project with Xchange by X7 Finance

Hello, Smart Contract Engineers! Are you ready to take your project to the next level? [Xchange](https://www.x7finance.org), the native Decentralized Exchange (DEX) of X7 Finance, is here to make your token launch a resounding success. Here's why [Xchange](https://www.x7finance.org) is the perfect DEX for your token:

## Unleash the Power of Robust Smart Contracts

With [Xchange](https://www.x7finance.org), you're not just launching your token - you're harnessing the power of our meticulously designed and rigorously tested smart contracts. Experience the peace of mind that comes with secure, trustless trades on the Ethereum blockchain.

## Follow these steps to select and execute your loan on X7 Finance:

{% spacer /%}

### Step 1: Select Your Loan

Choose from the following Initial Liquidity Loans (ILL):

- ILL001: `0x7400165E167479a3c81C8fC8CC3df3D2a92E9017`
- ILL002: `0x740019A6b3a9cF3bd193986a560B05726143B217`
- ILL003: `0x74001C747B6cc9091EE63bC9424DfF633FBAc617`

Or if you're launching with a custom loan through the protocol, ensure that loan contract is correct.

### Step 2: Set Your Token's Router to Xchange's Router

Set a variable for your token's router and assign it to Xchange's router `0x7DE80da14460A72855d597a4bCa2C10925373000`:

it might look like the following...

```js
constructor() ERC20("XXXX", "XXXX") {
    IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
        0x7DE80da14460A72855d597a4bCa2C10925373000
    );

    excludeFromMaxTransaction(address(_uniswapV2Router), true);
    uniswapV2Router = _uniswapV2Router;

    uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
        .createPair(address(this), _uniswapV2Router.WETH());
    excludeFromMaxTransaction(address(uniswapV2Pair), true);
    _setAutomatedMarketMakerPair(address(uniswapV2Pair), true);
}
```

### Step 3: Read Contract

Read the desired loan contract using the `getQuote` function. This function returns:

- `loanAmountRounded`
- `originationFee`
- `totalPremium`

### Step 4: Approve Token For Trade

Approve the token for trade on the X7 Lending Pool Contract (`0x740015c39da5D148fcA25A467399D00bcE10c001`). Ensure to exclude the X7 Lending Pool Contract from any Max TXs and Max fees.

### Step 5: Write Contract

Write to the X7 Lending Pool Contract using the `getInitialLiquidityLoan` function. Input the following parameters:

- `payableAmount` (ether)
- `tokenAddress` (address)
- `amount` (uint256)
- `loanTermContract` (address)
- `loanAmount` (uint256)
- `loanDurationSeconds` (uint256)
- `liquidityReceiver` (address)
- `deadline` (uint256)

- allow a variable for your tokens router and set it to Xchange's router `0x7DE80da14460A72855d597a4bCa2C10925373000`

## Dive into a Sea of High Liquidity

Say goodbye to price impact worries. With our unique lending solutions, including Simple, Interest Only, and Amortizing Initial Liquidity Loans, your token will enjoy high liquidity from the get-go.

## Innovate with Our Unique Loan Mechanisms

Stand out from the crowd with [Xchange](https://www.x7finance.org)'s innovative loan mechanisms. By providing initial liquidity to trading pairs, these mechanisms reduce capital lock-in, giving your project the leverage it needs to soar.

## Enjoy a Seamless Token Launch

We've made token launches a breeze with our user-friendly interface and robust smart contracts. Get ready for a smooth takeoff and an even smoother journey.

## Be Part of a Vibrant Ecosystem

When you launch your token on [Xchange](https://www.x7finance.org), you're not just launching a token - you're joining a vibrant ecosystem. Give your token holders more than just a token - give them a world of opportunities with our lending pool and unique Utility NFTs.

## Launch Your Token on Xchange in 4 Easy Steps

1. Determine your project's liquidity needs.
2. Pick the Initial Liquidity Loan that fits your project like a glove.
3. Use our smart contracts to launch your token on [Xchange](https://www.x7finance.org).
4. Choose your preferred loan repayment option.

Join us at [Xchange](https://www.x7finance.org) and let's make your token launch a resounding success in the world of decentralized finance.

_Trust No One. Trust Code. Long Live DeFi!_
