---
title: X7100 Discount Authority Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IERC721](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L95)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L99)
- [interface IDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L103)

## Contract events

- [event EcosystemMaxiNFTSet(address indexed oldEcosystemMaxiNFT, address indexed newEcosystemMaxiNFT)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L114)
- [event LiquidityMaxiNFTSet(address indexed oldLiquidityMaxiNFT, address indexed newLiquidityMaxiNFT)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L115)
- [event MagisterNFTSet(address indexed oldMagisterNFT, address indexed newMagisterNFT)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L116)
- [event X7DAOTokenSet(address indexed oldX7DAO, address indexed newX7DAO)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L117)

## Read-Only Functions

- [function discountRatio(address account) public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L149)

## External Functions

- [function setEcosystemMaxiNFT(address \_ecosystemMaxiNFT) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L121)
- [function setLiquidityMaxiNFT(address \_liquidityMaxiNFT) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L128)
- [function setMagisterNFT(address \_magisterNFT) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L135)
- [function setX7DAO(address \_x7DAO) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100DiscountAuthority.sol#L142)
