---
title: X7 Profit Share Splitter Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L67)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#71)
- [interface IX7ProfitShareSplitterV1 ](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7X7ProfitShareSplitter.sol#L76)

## Contract events

- [event TokenReceiverSet(address indexed oldReceiver, address indexed newReceiver)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#92)
- [event OutletControllerAuthorizationSet(indexed outlet, address indexed setter, address indexed controller, bool authorization)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#93)
- [event OutletRecipientSet(indexed outlet, address indexed oldRecipient, address indexed newRecipient)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L94)
- [event OutletSharesSet( indexed outlet, uint256 oldShares, uint256 newShares)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L95)
- [event OutletFrozen(address indexed outletRecipient)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L96)
- [event NewRecipientAdded(indexed outlet, address indexed recipient, address indexed controller, uint256 shares)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L97)
- [event TotalSharesChanged(uint256 oldShareCount, uint256 newShareCount)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L99)

## External Functions

- [receive () external payable {}](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L107)
- [function setTokenReceiver(address receiver) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L114)
- [function addNewRecipient(address newRecipient, address controller, uint256 shares) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L121)
- [function setOutletShares(uint256 outlet, uint256 newShares) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L149)
- [function setOutletControllerAuthorization(address \_outletControllerAuthorization) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L194)
- [function setOutletRecipient(address \_outletRecipient) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter2.sol#L201)
- [function freezeOutlet() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L216)
- [function takeBalance(uint256 \_balance) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter2.sol#L222)
- [function takeCurrentBalance() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L229)
- [function pushAll() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L235)
- [function rescueWETH(address to, uint256 value) public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L242)
- [function rescueTokens(address to, address token, uint256 value) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L247)

## Internal Functions

- [function \_sendBalance(address \_to, uint256 \_amount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L336)

## Read-Only Functions

- [function divvyUp(uint256 \_totalAmount) public view returns (uint256, uint256, uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7ProfitShareSplitter.sol#L194)
