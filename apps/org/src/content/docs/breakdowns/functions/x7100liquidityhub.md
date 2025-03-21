---
title: X7100 Liquidity Hub Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

- [interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L196)
- [interface IUniswapV2Router](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L203)
- [interface ILiquidityHub](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L228)
- [interface IX7EcosystemSplitter](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L232)
- [interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L236)

## Contract events

- [event SharesSet(uint256 indexed oldShares, uint256 indexed newShares)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L288)
- [event OffRampPairSet(address indexed oldOffRampPair, address indexed newOffRampPair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L289)
- [event DistributeTargetSet(address indexed oldDistributeTarget, address indexed newDistributeTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L290)
- [event LendingPoolTargetSet(address indexed oldLendingPoolTarget, address indexed newLendingPoolTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L291)
- [event TreasuryTargetSet(address indexed oldTreasuryTarget, address indexed newTreasuryTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L292)
- [event LiquidityRatioTargetSet(uint256 indexed oldLiquidityRatioTarget, uint256 indexed newLiquidityRatioTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L293)
- [event LiquidityTokenReceiverSet(address indexed oldLiquidityTokenReceiver, address indexed newLiquidityTokenReceiver)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L294)
- [event BalanceThresholdSet(uint256 indexed oldBalanceThreshold, uint256 indexed newBalanceThreshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L295)
- [event LiquidityBalanceThresholdSet(uint256 indexed oldLiquidityBalanceThreshold, uint256 indexed newLiquidityBalanceThreshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L296)
- [event ConstellationTokenSet(address indexed oldConstellationToken, address indexed newConstellationToken)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L297)
- [event RouterSet(address indexed oldRouter, address indexed newRouter)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L298)
- [event TreasuryTargetFrozen(address indexed treasuryTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L299)
- [event LendingPoolTargetFrozen(address indexed lendingPoolTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L300)
- [event DistributeTargetFrozen(address indexed distributeTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L301)
- [event BalanceThresholdFrozen(uint256 indexed balanceThreshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L302)
- [event LiquidityBalanceThresholdFrozen(uint256 indexed liquidityBalanceThreshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L303)
- [event ConstellationTokensFrozen(address indexed constellationToken)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L304)

## External Functions

- [receive() external payable {}](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L311)
- [function setShares(uint256 \_shares) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L313)
- [function setRouter(address \_router) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L329)
- [function setOffRampPair(address \_offRampPair) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L335)
- [function setBalanceThreshold(uint256 \_balanceThreshold) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L341)
- [function setLiquidityBalanceThreshold(uint256 \_liquidityBalanceThreshold) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L347)
- [function setLiquidityRatioTarget(uint256 \_liquidityRatioTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L353)
- [function setLiquidityTokenReceiver(address \_liquidityTokenReceiver) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L360)
- [function setDistributionTarget(address \_distributionTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L372)
- [function setLendingPoolTarget(address \_lendingPoolTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L384)
- [function setConstellationToken(address \_constellationToken) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L396)
- [function setTreasuryTarget(address \_treasuryTarget) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L402)
- [function freezeTreasuryTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L414)
- [function freezeDistributeTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L420)
- [function freezeLendingPoolTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L426)
- [function freezeBalanceThreshold() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L432)
- [function freezeLiquidityBalanceThreshold() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L438)
- [function freezeConstellationTokens() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L444)
- [function processFees() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L450)
- [function rescueWETH(address to, uint256 value) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L619)

## Internal Functions

- [function buyBackAndAddLiquidity() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L547)
- [function addLiquidityETH(uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L580)
- [function swapTokensForEth(uint256 tokenAmount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L592)
- [function swapEthForTokens(uint256 EthAmount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L607)

## Read-Only Function

- [function sendDistributeBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L500)
- [function sendTreasuryBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L517)
- [function sendLendingPoolBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7100LiquidityHub.sol#L532)
