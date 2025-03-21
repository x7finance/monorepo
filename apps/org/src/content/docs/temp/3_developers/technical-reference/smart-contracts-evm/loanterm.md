---
order: 100
tags: [guide]
---

# Initial Liquidity Loan Term

## Read-Only Functions

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner)
```

Retrieves the owner of a given token ID.

### liquidationAmount

```solidity
function liquidationAmount(uint256 loanID) external view returns (uint256)
```

Returns the liquidation amount for a specific loan.

### loanAmount

```solidity
function loanAmount(uint256 loanID) external view returns (uint256)
```

Returns the original loan amount for a specific loan.

### principalAmountPaid

```solidity
 function principalAmountPaid(uint256 loanID) external view returns (uint256);
```

### minimumLoanAmount

```solidity
function minimumLoanAmount() external view returns (uint256)
```

Returns the minimum allowed loan amount.

### maximumLoanAmount

```solidity
function maximumLoanAmount() external view returns (uint256)
```

Returns the maximum allowed loan amount.

### minimumLoanLengthSeconds

```solidity
function minimumLoanLengthSeconds() external view returns (uint256)
```

Returns the minimum duration of a loan in seconds.

### maximumLoanLengthSeconds

```solidity
function maximumLoanLengthSeconds() external view returns (uint256)
```

Returns the maximum duration of a loan in seconds.

### getPrincipalDue

```solidity
function getPrincipalDue(uint256 loanID, uint256 asOf) external view returns (uint256)
```

Returns the principal amount due for a specific loan as of a given time.

### getPremiumsDue

```solidity
function getPremiumsDue(uint256 loanID, uint256 asOf) external view returns (uint256)
```

Returns the premium amount due for a specific loan as of a given time.

### getTotalDue

```solidity
function getTotalDue(uint256 loanID, uint256 asOf) external view returns (uint256)
```

Returns the total amount due (both principal and premiums) for a specific loan as of a given time.

### getRemainingLiability

```solidity
function getRemainingLiability(uint256 loanID) external view returns (uint256)
```

Returns the remaining liability for a specific loan.

### getPremiumPaymentSchedule

```solidity
function getPremiumPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory)
```

Retrieves the premium payment schedule for a specific loan.

### getPrincipalPaymentSchedule

```solidity
function getPrincipalPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory)
```

Retrieves the principal payment schedule for a specific loan.

### isComplete

```solidity
function isComplete(uint256 loanID) external view returns (bool)
```

Checks if a specific loan has been completed or not.

### getOriginationAmounts

```solidity
function getOriginationAmounts(uint256 loanAmount) external view returns (uint256 loanAmountRounded, uint256 originationFee)
```

Returns the rounded loan amount and the origination fee for a given loan amount.

### getQuote

```solidity
function getQuote(uint256 loanAmount) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium)
```

Provides a quote for a given loan amount, detailing the rounded loan amount, origination fee, and total premium.

### getDiscountedQuote

```solidity
function getDiscountedQuote(uint256 loanAmount_, uint256 premiumFeeModifier, uint256 originationFeeModifier) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium)
```

Provides a discounted quote for a given loan amount based on provided premium and origination fee modifiers.

## State-Changing Functions

### transferFrom

```solidity
function transferFrom(
    address from,
    address to,
    uint256 tokenId
) external
```

Transfers a specific token from one address to another.

### originateLoan

```solidity
function originateLoan(
    uint256 loanAmount,
    uint256 originationFee,
    uint256 loanLengthSeconds_,

    uint256 premiumFeeModifierNumerator_,
    uint256 originationFeeModifierNumerator_,

    address receiver,
    uint256 tokenId
) external payable
```

Originate a new loan with the given parameters.

### recordPrincipalRepayment

```solidity
function recordPrincipalRepayment(uint256 loanID, uint256 amount) external returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability)
```

Records a principal repayment for a specific loan and returns details about the repayment.

### recordPayment

```solidity
function recordPayment(uint256 loanID, uint256 amount) external returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability)
```

Records a payment for a specific loan and returns details about the payment.

```solidity
interface IX7InitialLiquidityLoanTerm {

    function ownerOf(uint256 tokenId) external view returns (address owner);
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function originateLoan(
        uint256 loanAmount,
        uint256 originationFee,
        uint256 loanLengthSeconds_,

        uint256 premiumFeeModifierNumerator_,
        uint256 originationFeeModifierNumerator_,

        address receiver,
        uint256 tokenId
    ) external payable;

    function minimumLoanAmount() external view returns (uint256);
    function maximumLoanAmount() external view returns (uint256);
    function minimumLoanLengthSeconds() external view returns (uint256);
    function maximumLoanLengthSeconds() external view returns (uint256);

    function getPrincipalDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getPremiumsDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getTotalDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getRemainingLiability(uint256 loanID) external view returns (uint256);
    function getPremiumPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory);
    function getPrincipalPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory);

    function isComplete(uint256 loanID) external view returns (bool);
    function getOriginationAmounts(uint256 loanAmount) external view returns (uint256 loanAmountRounded, uint256 originationFee);
    function getQuote(uint256 loanAmount) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium);
    function getDiscountedQuote(uint256 loanAmount_, uint256 premiumFeeModifier, uint256 originationFeeModifier) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium);
    function recordPrincipalRepayment(uint256 loanID, uint256 amount) external returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability);
    function recordPayment(uint256 loanID, uint256 amount) external returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability);
    function liquidationAmount(uint256 loanID) external view returns (uint256);

    function loanAmount(uint256 loanID) external view returns (uint256);
    function principalAmountPaid(uint256 loanID) external view returns (uint256);

}
```
