---
title: X7R Token Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L100)
- [interface IERC20Metadata](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L123)
- [interface ILiquidityHub](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L265)
- [interface IDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L269)

## Contract events

- [event LiquidityHubSet(address indexed oldLiquidityHub, address indexed newLiquidityHub)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L293)
- [event DiscountAuthoritySet(address indexed oldDiscountAuthority, address indexed newDiscountAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L294)
- [event FeeNumeratorSet(uint256 indexed oldFeeNumerator, uint256 indexed newFeeNumerator)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L295)
- [event AMMSet(address indexed oldAMM, address indexed newAMM)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L296)
- [event OffRampPairSet(address indexed oldOffRampPair, address indexed newOffRampPair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L297)
- [event LiquidityHubFrozen(address indexed liquidityHub)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L298)
- [event DiscountAuthorityFrozen(address indexed discountAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L299)

## External Functions

- [function setLiquidityHub(address liquidityHub) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L311)
- [function setDiscountAuthority(address discountAuthority) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L317)
- [function setFeeNumerator(uint256 feeNumerator) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L323)
- [function setAMM(address amm) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L329)
- [function setOffRampPair(address offRampPair) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L334)
- [function freezeLiquidityHub() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L339)
- [function freezeDiscountAuthority() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L345)
- [function enableTrading() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L355)
- [function rescueETH(address to, uint256 value) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L408)
- [function rescueTokens(address to, address token, uint256 value) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L413)

## Internal Functions

- [function \_transfer(address sender, address recipient, uint256 amount) internal virtual override](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L360)

## Read-Only Functions

- [function circulatingSupply() external view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7R.sol#L351)
