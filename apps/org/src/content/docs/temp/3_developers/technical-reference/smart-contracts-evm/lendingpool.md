---
order: 100
tags: [guide]
---

# Lending Pool

## Address

X7LendingPoolV1 is deployed at:

| Chain               | Address                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum (Mainnet)  | 0x740015c39da5d148fca25a467399d00bce10c001 [view](https://etherscan.io/address/0x740015c39da5d148fca25a467399d00bce10c001)            |
| Polygon             | 0x740015c39da5d148fca25a467399d00bce10c001 [view](https://polygonscan.com/address/0x740015c39da5d148fca25a467399d00bce10c001)         |
| Arbitrum            | 0x740015c39da5d148fca25a467399d00bce10c001 [view](https://arbiscan.io/address/0x740015c39da5d148fca25a467399d00bce10c001)             |
| Optimism            | 0x740015c39da5d148fca25a467399d00bce10c001 [view](https://optimistic.etherscan.io/address/0x740015c39da5d148fca25a467399d00bce10c001) |
| Base                | 0x740015c39da5d148fca25a467399d00bce10c001 [view](https://basescan.org/address/0x740015c39da5d148fca25a467399d00bce10c001)            |
| Binance Smart Chain | 0x740015c39da5d148fca25a467399d00bce10c001 [view](https://bscscan.com/token/0x740015c39da5d148fca25a467399d00bce10c001)               |

## Contract Events

### EcosystemRecipientSet

```solidity
event EcosystemRecipientSet(address oldAddress, address newAddress);
```

Triggered when the ecosystem recipient address is changed.

### RouterSet

```solidity
event RouterSet(address oldAddress, address newAddress);
```

Fired when the router address is updated.

### WETHSet

```solidity
event WETHSet(address oldAddress, address newAddress);
```

Announces a change in the WETH address.

### X7DSet

```solidity
event X7DSet(address oldAddress, address newAddress);
```

Triggered when the X7D token address is updated.

### LoanTermActiveStateSet

```solidity
event LoanTermActiveStateSet(address indexed newAddress, bool isActive);
```

Reports the change in the active state of a loan term.

### LiquidationRewardSet

```solidity
event LiquidationRewardSet(uint256 oldReward, uint256 newReward);
```

Denotes a change in the liquidation reward amount.

### OriginationSharesSet

```solidity
event OriginationSharesSet(
    uint256 oldEcosystemSplitterOriginationShare,
    uint256 oldX7DAOOriginationShare,
    uint256 oldX7100OriginationShare,
    uint256 oldLendingPoolOriginationShare,
    uint256 newEcosystemSplitterOriginationShare,
    uint256 newX7DAOOriginationShare,
    uint256 newX7100OriginationShare,
    uint256 newLendingPoolOriginationShare
);
```

Marks changes in the origination shares distribution across different entities.

### PremiumSharesSet

```solidity
event PremiumSharesSet(
    uint256 oldEcosystemSplitterOriginationShare,
    uint256 oldX7DAOOriginationShare,
    uint256 oldX7100OriginationShare,
    uint256 oldLendingPoolOriginationShare,
    uint256 newEcosystemSplitterOriginationShare,
    uint256 newX7DAOOriginationShare,
    uint256 newX7100OriginationShare,
    uint256 newLendingPoolOriginationShare
);
```

Indicates updates to the premium shares distribution.

### EcosystemSplitterSet

```solidity
event EcosystemSplitterSet(address oldAddress, address newAddress);
```

Triggered when the ecosystem splitter address is updated.

### X7100ReserveRecipientSet

```solidity
event X7100ReserveRecipientSet(address oldAddress, address newAddress);
```

Signals a change in the X7100 reserve recipient address.

### X7DAORewardRecipientSet

```solidity
event X7DAORewardRecipientSet(address oldAddress, address newAddress);
```

Fired when the X7DAO reward recipient address is changed.

### DiscountAuthoritySet

```solidity
event DiscountAuthoritySet(address oldAddress, address newAddress);
```

Announces a change in the discount authority address.

### RetainedFeeNumeratorSet

```solidity
event RetainedFeeNumeratorSet(uint256 oldValue, uint256 newValue);
```

Indicates an update in the retained fee numerator value.

### LendingPoolReserveSet

```solidity
event LendingPoolReserveSet(address oldAddress, address newAddress);
```

Reports changes to the lending pool reserve address.

### LendingHalted

```solidity
event LendingHalted();
```

Notifies that lending operations have been halted.

### LendingCommenced

```solidity
event LendingCommenced();
```

Announces the resumption of lending operations.

### AuthorizedCapitalManagerSet

```solidity
event AuthorizedCapitalManagerSet(address managerAddress, bool isTrusted);
```

Signals the authorization state of a capital manager.

### LoanBuyoutAllowed

```solidity
event LoanBuyoutAllowed(bool isAllowed);
```

Reports the permission status for loan buyouts.

### SyncSafeGasAmountSet

```solidity
event SyncSafeGasAmountSet(uint256 oldValue, uint256 newValue);
```

Indicates a change in the sync safe gas amount.

### LoanBoughtOut

```solidity
event LoanBoughtOut(address indexed buyer, uint256 indexed loanID);
```

Reports a loan buyout by a particular buyer.

## Read-Only Functions

### getDiscountedQuote

```solidity
function getDiscountedQuote(
    address borrower,
    IX7InitialLiquidityLoanTerm loanTerm,
    uint256 loanAmount,
    uint256 loanDurationSeconds
) external view returns (uint256[7] memory)
```

Used to get a quote for a loan according to a specific borrower, loan term, amount, and duration.

### canLiquidate

```solidity
function canLiquidate(uint256 loanID) external view returns (uint256)
```

Used to see the amount of the loan that can be liquidated. If the amount is greater than 0 the loan is eligible for a liquidation event. For the initial loan terms, any past due payments make the entire loan eligible for liquidation.

## State-Changing Functions

### getInitialLiquidityLoan

```solidity
function getInitialLiquidityLoan(
    address tokenAddress,
    uint256 amount,
    address loanTermContract,
    uint256 loanAmount,
    uint256 loanDurationSeconds,
    address liquidityReceiver,
    uint256 deadline
) external lock payable returns (uint256 loanID)
```

Used to originate the actual loan.

### payLiability

```solidity
function payLiability(uint256 loanID) external lock payable
```

Used to pay against any outstanding loan liability. See the loan term contract to understand how payment is applied.

### liquidate

```solidity
function liquidate(uint256 loanID) external lock
```

Used to liquidate the loan. If the loan term allows, this will only be a partial liquidation. The initial loan terms all liquidate in full.

### buyoutLoanQuote

```solidity
function buyoutLoanQuote(uint256 loanID) external view returns (uint256)
```

Used to check the cost to buyout the loan (this is the remaining principal due).

### buyoutLoan

```solidity
function buyoutLoan(uint256 loanID) external payable
```

Used to buy out the loan. Doing so will cause the loan term NFT to be transferred to the caller.

### buyoutLoanTo

```solidity
function buyoutLoanTo(uint256 loanID, address to) external payable
```

Used to buy out the loan to a specific address. This will cause the loan term NFT to be transferred to the specified address.

```solidity
pragma solidity ^0.8.0

interface IX7LendingPoolV1 {

    // View functions
    function activeLoansByBorrower(address borrower) external view returns (uint256)
    function countOfActiveLoanTerms() external view returns (uint256)
    function availableCapital() external view returns (uint256)
    function getDiscountedQuote(
        address borrower,
        IX7InitialLiquidityLoanTerm loanTerm,
        uint256 loanAmount,
        uint256 loanDurationSeconds
    ) external view returns (uint256[7] memory)
    function canLiquidate(uint256 loanID) external view returns (uint256)
    function getPrincipalDue(uint256 loanID, uint256 asOf) external view returns (uint256)
    function getPremiumsDue(uint256 loanID, uint256 asOf) external view returns (uint256)
    function getTotalDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getRemainingLiability(uint256 loanID) external view returns (uint256);
    function getPremiumPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory);
    function getPrincipalPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory);
    function getQuote(
        address borrower,
        IX7InitialLiquidityLoanTerm loanTerm,
        uint256 loanAmount,
        uint256 loanDurationSeconds
    ) external view returns (uint256[5])
    function buyoutLoanQuote(uint256 loanID) external view returns (uint256);
    function getInitialLiquidityLoan(
            address tokenAddress,
            uint256 amount,
            address loanTermContract,
            uint256 loanAmount,
            uint256 loanDurationSeconds,
            address liquidityReceiver,
            uint256 deadline) external view returns (uint256);

    // External payable functions
    function payLiability(uint256 loanID) external payable;
    function liquidate(uint256 loanID) external;
    function buyoutLoan(uint256 loanID) external payable;
    function buyoutLoanTo(uint256 loanID, address to) external payable;
    function depositETH() external payable;
    function depositETHForRecipient(address recipient) external payable;
    function returnETHToLendingPoolReserve(uint256 amount) external;
    function returnETH() external payable;
}


```
