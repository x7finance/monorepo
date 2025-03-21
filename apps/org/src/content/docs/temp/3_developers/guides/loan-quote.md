---
order: 100
tags: [guide]
---

# Loan quote

`getDiscountedQuote`

Before taking out a loan on the X7 platform, it's prudent to first get a quote. This allows you to understand the terms, interest, and other costs associated with the desired loan amount and term. The getDiscountedQuote function provides this service, giving potential borrowers a comprehensive view of the loan's structure tailored according to a specific borrower, loan term, amount, and duration.

This function facilitates borrowers to anticipate the financial implications of the loan.
Requires an on-chain lookup.

| Parameter           | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| borrower            | The address of the potential borrower seeking the loan quote.                        |
| loanTerm            | Contract address of the specific `IX7InitialLiquidityLoanTerm` you're interested in. |
| loanAmount          | The principal amount you're considering borrowing.                                   |
| loanDurationSeconds | The duration of the loan you're considering, in seconds.                             |

## Prerequisites

Determine the exact amount and duration you are considering for the loan.
Ensure you are calling the function from a relevant address or have necessary permissions otherwise.

```solidity
IX7LendingPoolV1 lendingPool = IX7LendingPoolV1(0x740015c39da5d148fca25a467399d00bce10c001);

address borrower = msg.sender; // or another Ethereum address
address loanTerm = 0xYourLoanTermContractAddress; // replace with the contract address of the desired loan term
uint256 desiredLoanAmount = 100 ether; // change as per requirement (assuming Ether-based loan)
uint256 desiredLoanDuration = 30 days; // loan duration in seconds

// Call the getDiscountedQuote function to get the loan details.
uint256[7] memory loanDetails = lendingPool.getDiscountedQuote(borrower, loanTerm, desiredLoanAmount, desiredLoanDuration);

// The loanDetails array will contain various metrics about the loan. You can then use these metrics to make an informed borrowing decision.
```

After calling the function, you can parse the loanDetails array to understand the specifics of the loan, including the interest, fees, and other essential metrics. Always ensure to replace placeholders with relevant values before querying the network.
