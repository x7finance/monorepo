---
order: 100
tags: [guide]
---

# Get Initial Liquidity Loan

`getInitialLiquidityLoan`

To take out a Initial Liquidity Loan, call the `getInitialLiquidityLoan` function on the Lending Pool contract. If executed correctly, this function will return the loanID, which can then be used to manage and track your loan, and a XchangePair will be created with the Tokens paired amount of tokens in the loan request. Else, the function reverts.

It's the primary method to originate a loan on the platform.
Requires an on-chain execution.

## Approve Lending Pool to move tokens

First approve the token to be spent by the Lending Pool.

```solidity
address tokenAddress = 0xTOKENADDRESS000000000000000000000000000000; // change me!
unint256 amountOfTokenForInitialLiquidityLoanPool = 100000000000000000000; // change me!
address lendingPoolAddress = 0x740015c39da5d148fca25a467399d00bce10c001;

IERC20 token = IERC20(tokenAddress);
token.approve(lendingPoolAddress, amountOfTokenForInitialLiquidityLoanPool)
```

## Create the Loan

### Required Parameters

To successfully execute the function and take out a loan, the following parameters must be provided:

| Parameter           | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| tokenAddress        | The address of the token intended to be used as collateral.                        |
| amount              | Amount of collateral you're putting up.                                            |
| loanTermContract    | The address of the chosen loan term contract.                                      |
| loanAmount          | The amount of money you wish to borrow.                                            |
| loanDurationSeconds | The time duration (in seconds) for which the loan will be active.                  |
| liquidityReceiver   | Address where the loan amount will be received (generally the borrower's address). |
| deadline            | The timestamp after which the loan request will expire.                            |

This function should be called after getting a quote using getDiscountedQuote to understand the terms.

```solidity
address tokenAddress = 0xTOKENADDRESS000000000000000000000000000000; // change me!
uint256 amount = 1000; // change me!
address loanTermContract = 0xLOANTERMADDRESS0000000000000000000000000000; // change me!
uint256 loanAmount = 50000000000000000000; // in gwei change me!
uint256 loanDurationSeconds = 604800; // change me! (7 days in seconds)
address liquidityReceiver = msg.sender; // usually the borrower's address
uint256 deadline = block.timestamp + 1200; // change me! (add 20 minutes from now)
IX7LendingPoolV1 lendingPool = IX7LendingPoolV1(0x740015c39da5d148fca25a467399d00bce10c001);

uint256 loanID = lendingPool.getInitialLiquidityLoan(
    tokenAddress,
    amount,
    loanTermContract,
    loanAmount,
    loanDurationSeconds,
    liquidityReceiver,
    deadline
);
```
