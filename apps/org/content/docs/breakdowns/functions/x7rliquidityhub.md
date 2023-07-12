---
title: X7R Liquidity Hub Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L160)
- [interface IUniswapV2Router](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L167)
- [interface ILiquidityHub](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L192)
- [interface IX7EcosystemSplitter](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L196)
- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L200)

## Contract events

- [event SharesSet(uint256 indexed oldShares, uint256 indexed newShares)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L237)
- [event OffRampPairSet(address indexed oldOffRampPair, address indexed newOffRampPair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L238)
- [event DistributeTargetSet(address indexed oldDistributeTarget, address indexed newDistributeTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L239)
- [event TreasuryTargetSet(address indexed oldTreasuryTarget, address indexed newTreasuryTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L240)
- [event LiquidityRatioTargetSet(uint256 indexed oldLiquidityRatioTarget, uint256 indexed newLiquidityRatioTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L241)
- [event LiquidityTokenReceiverSet(address indexed oldLiquidityTokenReceiver, address indexed newLiquidityTokenReceiver)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L242)
- [event BalanceThresholdSet(uint256 indexed oldBalanceThreshold, uint256 indexed newBalanceThreshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L243)
- [event RouterSet(address indexed oldRouter, address indexed newRouter)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L244)
- [event TreasuryTargetFrozen(address indexed treasuryTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L245)
- [event DistributeTargetFrozen(address indexed distributeTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L246)
- [event BalanceThresholdFrozen(uint256 indexed balanceThreshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L247)

## External Functions

- [receive() external payable {}](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L256)
- [function setShares(uint256 \_shares) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L258)
- [function setRouter(address \_router) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L272)
- [function setOffRampPair(address \_offRampPair) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L278)
- [function setBalanceThreshold(uint256 \_balanceThreshold) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L284)
- [function setLiquidityRatioTarget(uint256 \_liquidityRatioTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L290)
- [function setLiquidityTokenReceiver(address \_liquidityTokenReceiver) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L297)
- [function setDistributionTarget(address \_distributionTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L309)
- [function setTreasuryTarget(address \_treasuryTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L321)
- [function freezeTreasuryTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L333)
- [function freezeDistributeTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L339)
- [function freezeBalanceThreshold() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L345)
- [function processFees() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L351)
- [function rescueWETH() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L484)

## Internal Functions

- [function buyBackAndAddLiquidity() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L415)
- [function addLiquidityETH() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L445)
- [function swapTokensForEth() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L457)
- [function swapEthForTokens() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L472)

## Read-Only Functions

- [function sendDistributeBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L383)
- [function sendTreasuryBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7RLiquidityHub.sol#L400)
