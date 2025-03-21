---
order: 100
tags: [guide]
label: Lossless Loans
---

# How are losses prevented on loans?

The concept of "lossless loans" is intriguing in that it promises no loss to the lenders while providing the borrowers with liquidity. Let's delve into how this might be achieved using the described functions.

Called during the Lending Pool creation of a pair with an initial Liquidity Loan:

## setMinimumBalance

```solidity
function setMinimumBalance(address tokenAddress, uint112 minimumAmount) external;
```

Purpose:
This function is to establish a safety net for the smart contract's liquidity by setting a "floor" or minimum balance for a specific token.

How it works:
The tokenAddress specifies which ERC-20 token's minimum balance you wish to set.
The minimumAmount is the minimum balance that this particular token should not drop below.
