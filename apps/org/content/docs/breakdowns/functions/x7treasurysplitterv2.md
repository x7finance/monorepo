---
title: X7 Treasury Splitter Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IUniswapV2Router02](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L89)
- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L100)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L106)
- [interface IX7TreasurySplitter ](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L111)

## Contract events

- [event OutletControllerAuthorizationSet(address indexed oldOutletControllerAuthorization, address indexed newOutletControllerAuthorization)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L144)
- [event OutletRecipientSet(address indexed oldOutletRecipient, address indexed newOutletRecipient)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L145)
- [event SharesSet(uint256 indexed oldShares, uint256 indexed newShares)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L146)
- [event OutletRecipientFrozen(address indexed outletRecipient)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L147)
- [event RouterSet(address indexed oldRouter, address indexed newRouter)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L148)

## External Functions

- [receive () external payable {}](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L192)
- [function setRouter(address \_router) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L224)
- [function setOutletControllerAuthorization(address \_outletControllerAuthorization) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L229)
- [function setOutletRecipient(address \_outletRecipient) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L238)
- [function freezeOutlet() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L247)
- [function setOtherSlotRecipient(address \_otherSlotRecipient) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L253)
- [function setOtherSlotShares(uint256 \_otherSlotShares) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L264)
- [function takeBalance(uint256 \_balance) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L278)
- [function takeCurrentBalance() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L285)
- [function pushAll() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L291)
- [function rescueWETH(address to, uint256 value) public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L305)
- [function rescueTokens(address to, address token, uint256 value) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L311)

## Internal Functions

- [function \_sendBalance(address \_to, uint256 \_amount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L336)

## Read-Only Functions

- [function divvyUp(uint256 \_totalAmount) public view returns (uint256, uint256, uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TreasurySplitterV2.sol#L194)
