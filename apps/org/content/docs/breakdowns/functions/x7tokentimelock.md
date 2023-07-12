---
title: X7 Token Time Lock Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L106)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L112)

## Contract events

- [event GlobalUnlockTimestampSet(uint256 indexed oldGlobalUnlockTimestamp, uint256 indexed newGlobalUnlockTimestamp)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L132)
- [event GlobalUnlockTimeExtended(uint256 indexed oldGlobalUnlockTimestamp, uint256 indexed newGlobalUnlockTimestamp)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L133)
- [event TokenUnlockTimestampSet(address indexed token, uint256 indexed oldTokenUnlockTimestamp, uint256 indexed newTokenUnlockTimestamp)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L134)
- [event TokenUnlockTimeExtended(address indexed token, uint256 indexed oldTokenUnlockTimestamp, uint256 indexed newTokenUnlockTimestamp)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L135)
- [event TokenOwnerSet(address indexed token, address indexed oldOwner, address indexed newOwner)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L136)
- [event TokensWithdrawn(address indexed token, address indexed recipient, uint256 indexed amount)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L137)

## External Functions

- [receive () external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L143)
- [function setWETH(address \_weth) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L147)
- [function setGlobalUnlockTimestamp(uint256 \_globalUnlockTimestamp) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L151)
- [function extendGlobalUnlockTimestamp(uint256 \_globalUnlockTimestamp) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L157)
- [function setTokenUnlockTimestamp(address \_token, uint256 \_tokenUnlockTimestamp) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L162)
- [function extendTokenUnlockTimestamp(address \_token, uint256 \_tokenUnlockTimestamp) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L168)
- [function setTokenOwner(address \_token, address \_tokenOwner) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L173)
- [function withdrawTokens(address \_token, uint256 \_amount) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L190)

## Read-Only Functions

- [function getTokenUnlockTimestamp(address \_token) public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenTimeLock.sol#L180)
