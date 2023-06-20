---
title: X7DAO Discount Authority Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

[interface IDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAODiscountAuthority.sol#L85)

### Contract events

[event EcosystemMaxiNFTSet(address indexed oldTokenAddress, address indexed newTokenAddress)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAODiscountAuthority.sol#L94)\
[event LiquidityMaxiNFTSet(address indexed oldTokenAddress, address indexed newTokenAddress)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAODiscountAuthority.sol#L95)

### Read-Only Functions

[function discountRatio(address swapper) external view returns (uint256 numerator, uint256 denominator)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAODiscountAuthority.sol#L113)\

### External Functions

[function setEcosystemMaxiNFT(address tokenAddress) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAODiscountAuthority.sol#L99)\
[function setLiquidityMaxiNFT(address tokenAddress) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAODiscountAuthority.sol#L106)
