---
title: X7 Magister Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IX7Migration](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1288)

## Contract events

- [event MintingOpen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1308)
- [event MintFeeDestinationSet(address indexed oldMintFeeDestination, address indexed newMintFeeDestination)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1309)
- [event MintPriceSet(uint256 indexed oldMintPrice, uint256 indexed newMintPrice)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1310)
- [event BaseURISet(string oldBaseURI, string newBaseURI)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1311)
- [event WhitelistActivitySet(bool oldWhitelistActive, bool newWhitelistActive)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1312)
- [event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1313)

## External Functions

- [function setMintFeeDestination(address destination) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1334)
- [function setBaseURI(string memory baseURI\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1341)
- [function setMintPrice(uint256 price) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1348)
- [function setWhitelist(address[] calldata addresses, bool[] calldata isWhitelisted) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1355)
- [function setWhitelistComplete(bool \_isComplete) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1362)
- [function setWhitelistAuthority(address \_whitelistAuthority) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1368)
- [function openMinting() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1375)
- [function mint() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1382)
- [function mintMany(address[] calldata to) external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1386)

## Internal Functions

- [function \_mintMany(address[] memory to) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1390)
- [function \_baseURI() internal view virtual returns (string memory)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1414)

## Read-Only Functions

- [function whitelist(address holder) external view returns (bool)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Magister.sol#L1330)
