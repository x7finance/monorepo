---
title: X7 Token Burner Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IUniswapV2Router](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L77)
- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L94)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L98)

## Contract events

- [event RouterSet(address indexed oldRouter, address indexed newRouter)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L108)
- [event TargetTokenSet(address indexed oldTargetToken, address indexed newTargetToken)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L109)
- [event TokensBurned(address indexed token, uint256 indexed amount)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L110)

## External Functions

- [function setRouter(address \_router) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L119)
- [function setTargetToken(address \_targetToken) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L125)
- [function receive() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L131)
- [function rescueTokens(address to, address token, uint256 value) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L168)
- [function rescueWETH(address to, uint256 value) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L172)

## Internal Functions

- [function swapTokensForEth(uint256 amountIn, address token) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7TokenBurner.sol#L151)
