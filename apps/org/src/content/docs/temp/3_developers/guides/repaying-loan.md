---
order: 100
tags: [guide]
---

# Loan repayment

Repaying an Active Loan on X7 Platform

`payLiability`

To repay an active loan on the X7 platform, borrowers should use the payLiability function. This function allows borrowers to make payments towards their outstanding loan liability. By calling this function and supplying the right amount, the loan liability gets reduced, and the borrower moves closer to settling their obligations.

It's the primary method to repay a loan on the platform.
Requires an on-chain execution.
\

Required Parameters
To successfully execute the function and make a repayment, you need to provide:

| Parameter | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| loanID    | The unique identifier of the loan you wish to repay, obtained when the loan was originated. |

To repay the loan, you'll send the repayment amount as part of the function call's transaction value.

## Prerequisites

- Ensure you've enough balance to repay the loan, considering the current liability.
- Ensure you're calling the function from the same address that initiated the loan, or have the necessary permissions otherwise.
  Examples
  Solidity

```solidity
IX7LendingPoolV1 lendingPool = IX7LendingPoolV1(0x740015c39da5d148fca25a467399d00bce10c001);
uint256 loanID = YOUR_LOAN_ID; // change me!

// Calculate the exact amount you want to repay. Make sure you have enough Ether (or relevant token) balance.
uint256 repaymentAmount = 500 ether; // change me! (assuming it's an Ether-based loan)

// Ensure your contract or account has enough balance.
require(address(this).balance >= repaymentAmount, "Insufficient funds to repay the loan.");

// Call the payLiability function to make the repayment.
lendingPool.payLiability{value: repaymentAmount}(loanID);
```

Always ensure to modify the placeholders (e.g., YOUR_LOAN_ID) with the appropriate values before deployment or execution. Also, ensure the right amount of funds is available in the account or contract from where the repayment is being made.
