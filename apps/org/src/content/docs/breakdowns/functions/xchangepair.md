---
title: Xchange Pair Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IXchangeFactory](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L100)
- [interface IXchangePair](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L126)
- [interface XchangeERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L164)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L186)
- [interface IXchangeDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L202)
- [interface IUniswapV2Callee](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L206)

## Read-Only Functions

- [function factory() public view returns (address)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L324)
- [function getReserves() public view returns (uint112, uint112, uint32)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L328)

## External Functions

- [function initialize(address, address) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L339)
- [function mintFee() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L345)
- [function setMinimumBalance(uint256) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L350)
- [function withdrawTokensAgainstMinimumBalance() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L363)
- [function mint(address) external returns (uint liquidity)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L379)
- [function burn(address) external returns (uint amount0, uint amount1)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L403)
- [function mustBurn(address to, uint256 gasAmount) external lock returns (uint amount0, uint amount1)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L431)
- [function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L473)
- [function swapWithDiscount(uint amount0Out, uint amount1Out, address to, bytes calldata data, uint discount) external lock](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L478)
- [function skim(address to) external lock](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L483)
- [function sync() external lock](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L495)
- [function syncSafe() external lock](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L500)

## Internal Functions

- [\_mintFee(uint112 \_reserve0, uint112 \_reserve1) private returns (bool feeOn)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L506)
- [\_swap(uint amount0Out, uint amount1Out, address to, uint feeAmountOverride, bytes calldata data) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L526)
- [\_update(uint balance0, uint balance1, uint112 \_reserve0, uint112 \_reserve1) private](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L569)
- [\_safeTransfer(address token, address to, uint value) private](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L586)
- [\_trySafeTransfer(address token, address to, uint value, uint gasAmount) private returns (uint)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangePair.sol#L591)
