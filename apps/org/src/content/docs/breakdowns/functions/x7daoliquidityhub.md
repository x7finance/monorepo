---
title: X7DAO Discount Liquidity Hub Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

[interface ILiquidityHub](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L212)\
[interface IX7EcosystemSplitter](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L216)\
[interface IWETH](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L220)

### Contract events

[event SharesSet(uint256 distributeShare, uint256 liquidityShare, uint256 auxiliaryShare, uint256 treasuryShare)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L261)\
[event OffRampPairSet(address indexed offRampPair)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L262)\
[event DistributeTargetSet(address indexed oldTarget, address indexed newTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L263)\
[event AuxiliaryTargetSet(address indexed oldTarget, address indexed newTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L264)\
[event TreasuryTargetSet(address indexed oldTarget, address indexed newTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L265)\
[event LiquidityRatioTargetSet(uint256 liquidityRatioTarget)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L266)\
[event LiquidityTokenReceiverSet(address indexed oldReciever, address indexed newReceiver)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L267)\
[event BalanceThresholdSet(uint256 threshold)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L268)\
[event RouterSet(address router)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L269)\
[event TreasuryTargetFrozen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L270)\
[event AuxiliaryTargetFrozen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L271)\
[event DistributeTargetFrozen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L272)\
[event BalanceThresholdFrozen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L273)

### External Functions

[function setShares(uint256 distributeShare\_, uint256 liquidityShare\_, uint256 auxiliaryShare\_, uint256 treasuryShare\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L283)\
[function setRouter(address router\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L299)\
[function setOffRampPair(address offRampPairAddress) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L305)\
[function setBalanceThreshold(uint256 threshold) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L311)\
[function setLiquidityRatioTarget(uint256 liquidityRatioTarget\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L317)\
[function setLiquidityTokenReceiver(address liquidityTokenReceiver\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L324)\
[function setDistributionTarget(address target) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L336)\
[function setAuxiliaryTarget(address target) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L348)\
[function setTreasuryTarget(address target) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L360)\
[function freezeTreasuryTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L372)\
[function freezeDistributeTarget() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L378)\
[function freezeAuxiliaryTarget() external onlyOwner ](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L384)\
[function freezeBalanceThreshold() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L390)\
[function processFees(address tokenAddress) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L396)\
[function rescueWETH() external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L549)

### Internal Functions

[function sendAuxiliaryBalance() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L465)\
[function buyBackAndAddLiquidity() internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L480)\
[function addLiquidityETH(uint256 tokenAmount, uint256 ethAmount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L510)\
[function swapTokensForEth(address tokenAddress, uint256 tokenAmount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L522)\
[function swapEthForTokens(uint256 ethAmount) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L537)

### Public Functions

[function sendDistributeBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L433)\
[function sendTreasuryBalance() public](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7DAOLiquidityHub.sol#L450)
