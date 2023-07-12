---
title: X7 Liquidity Maxi Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IX7Migration](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1267)

## Contract events

- [event MintingOpen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1287)
- [event MintFeeDestinationSet(address indexed oldMintFeeDestination, address indexed newMintFeeDestination)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1288)
- [event MintPriceSet(uint256 indexed oldMintPrice, uint256 indexed newMintPrice)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1289)
- [event BaseURISet(string oldBaseURI, string newBaseURI)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1290)
- [event WhitelistActivitySet(bool oldWhitelistActive, bool newWhitelistActive)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1291)
- [event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1292)

## External Functions

- [function whitelist(address holder) external view returns (bool)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1299)
- [function setMintFeeDestination(address destination) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1303)
- [function setBaseURI(string memory baseURI\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1310)
- [function setMintPrice(uint256 price) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1317)
- [function setWhitelist(address[] calldata addresses, bool[] calldata isWhitelisted) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1324)
- [function setWhitelistComplete(bool \_isComplete) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1331)
- [function setWhitelistAuthority(address \_whitelistAuthority) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1337)
- [function openMinting() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1344)
- [function mint(address to) external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1351)
- [function mintMany(address[] calldata to) external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1355)

## Internal Functions

- [function \_mintMany(address[] memory to) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1359)
- [function \_baseURI() internal view virtual returns (string memory)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LiquidityMaxi.sol#L1383)
