---
title: X7 Treasury Splitter Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L102)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L106)
- [interface IX7TreasurySplitterV3 ](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L111)

## Contract events

- [event OutletRecipientSet(address indexed oldOutletRecipient, address indexed newOutletRecipient)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L130)
- [event SharesSet(uint256 indexed oldShares, uint256 indexed newShares)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L131)
- [event OutletRecipientFrozen(address indexed outletRecipient)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L1132)

## External Functions

- [receive () external payable {}](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L155)
- [function freezeOutlet() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitter3.sol#L174)
- [function setOutletRecipient(address \_outletRecipient) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L181)
- [function setSlotShares(uint256 \_slotShares) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L195)
- [function takeBalance(uint256 \_balance) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L209)
- [function takeCurrentBalance() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L216)
- [function pushAll() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L222)
- [function rescueWETH(address to, uint256 value) public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L230)
- [function rescueTokens(address to, address token, uint256 value) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L235)

## Internal Functions

- [function \_sendBalance(address \_to, uint256 \_amount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L243)

## Read-Only Functions

- [function divvyUp(uint256 \_totalAmount) public view returns (uint256, uint256, uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV3.sol#L157)
