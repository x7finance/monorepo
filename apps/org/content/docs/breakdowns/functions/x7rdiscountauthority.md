---
title: X7R Discount Authority Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IERC721](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L88)
- [interface IDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L92)

## Contract events

- [event EcosystemMaxiNFTSet(address indexed oldEcosystemMaxiNFT, address indexed newEcosystemMaxiNFT)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L102)
- [event LiquidityMaxiNFTSet(address indexed oldLiquidityMaxiNFT, address indexed newLiquidityMaxiNFT)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L103)
- [event MagisterNFTSet(address indexed oldMagisterNFT, address indexed newMagisterNFT)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L104)

## External Functions

- [function setEcosystemMaxiNFT(address \_ecosystemMaxiNFT) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L108)
- [function setLiquidityMaxiNFT(address \_liquidityMaxiNFT) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L115)
- [function setMagisterNFT(address \_magisterNFT) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L122)

## Read-Only Functions

- [function discountRatio(address owner, uint256 amount, address token) public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RDiscountAuthority.sol#L129)
