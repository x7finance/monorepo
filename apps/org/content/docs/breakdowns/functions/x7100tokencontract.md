---
title: X7100 Token Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L102)
- [interface IERC20Metadata](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L125)
- [interface ILiquidityHub](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L267)
- [interface IDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L271)

## Contract events

- [event LiquidityHubSet(address indexed oldLiquidityHub, address indexed newLiquidityHub)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L295)
- [event DiscountAuthoritySet(address indexed oldDiscountAuthority, address indexed newDiscountAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L296)
- [event FeeNumeratorSet(uint256 indexed oldFeeNumerator, uint256 indexed newFeeNumerator)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L297)
- [event AMMSet(address indexed oldAMM, address indexed newAMM)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L298)
- [event OffRampPairSet(address indexed oldOffRampPair, address indexed newOffRampPair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L299)
- [event LiquidityHubFrozen(address indexed liquidityHub)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L300)
- [event DiscountAuthorityFrozen(address indexed discountAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L301)

## External Functions

- [function setLiquidityHub(address \_liquidityHub) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L313)
- [function setDiscountAuthority(address \_discountAuthority) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L319)
- [function setFeeNumerator(uint256 \_feeNumerator) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L325)
- [function setAMM(address \_AMM) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L331)
- [function setOffRampPair(address \_offRampPair) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L337)
- [function freezeLiquidityHub() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L343)
- [function freezeDiscountAuthority() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L349)
- [function enableTrading() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L359)
- [function rescueETH(address to, uint256 value) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L412)
- [function rescueTokens(address to, address token, uint256 value) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L417)

## Internal Functions

- [function \_transfer(address sender, address recipient, uint256 amount) internal virtual override](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L364)

## Read-Only Functions

- [function circulatingSupply() public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L355)
- [function discountRatio(address account) public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7101.sol#L?)
