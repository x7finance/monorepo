---
title: X7DAO Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

[interface ILiquidityHub](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L265)\
[interface IDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L269)

### Contract events

[event LiquidityHubSet(address indexed liquidityHub)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L293)\
[event DiscountAuthoritySet(address indexed discountAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L294)\
[event FeeNumeratorSet(uint256 feeNumerator)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L295)\
[event AMMSet(address indexed pairAddress, bool isAMM)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L296)\
[event OffRampPairSet(address indexed offRampPair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L297)\
[event LiquidityHubFrozen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L298)\
[event DiscountAuthorityFrozen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L299)

### External Functions

[function setLiquidityHub(address liquidityHub\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L311)\
[function setDiscountAuthority(address discountAuthority\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L317)\
[function setFeeNumerator(uint256 feeNumerator\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L323)\
[function setAMM(address ammAddress, bool isAMM) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L329)\
[function setOffRampPair(address ammAddress) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L334)\
[function freezeLiquidityHub() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L339)\
[function freezeDiscountAuthority() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L345)\
[function circulatingSupply() external view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L351)\
[function enableTrading() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L355)\
[function rescueETH() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L408)\
[function rescueTokens(address tokenAddress) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L413)

### Internal Functions

[function \_transfer(address from, address to, uint256 amount) internal override](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAO.sol#L360)
