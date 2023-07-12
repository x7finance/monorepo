---
title: Xchange Factory Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IXchangeFactory](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L100)
- [interface IXchangePair](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L126)
- [interface IXchangeERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L164)
- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L186)
- [interface IXchangeDiscountAuthority](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L202)
- [interface IUniswapV2Callee](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L206)

## External Functions

- [function setFeeTo(address \_feeTo) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L630)
- [function setDiscountAuthority(address \_discountAuthority) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L637)
- [function setTrusted(address \_trustedAddress) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L644)
- [function setFailsafeLiquidator(address \_failsafeLiquidator) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L650)
- [function createPair(address tokenA, address tokenB) external override returns (address pair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L656)

## Library Functions

- [function min(uint x, uint y) internal pure returns (uint z)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L681)
- [function sqrt(uint y) internal pure returns (uint z)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L686)
- [function encode(bytes32 b32) internal pure returns (address)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L709)
- [function uqdiv(uint x, uint y) internal pure returns (uint z)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L714)

## Read-Only Functions

- [function allPairsLength() public view returns (uint)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L618)
- [function isTrusted(address \_address) public view returns (bool)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L622)
- [function isFailsafeLiquidator(address \_address) public view returns (bool)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/XchangeFactory.sol#L626)
