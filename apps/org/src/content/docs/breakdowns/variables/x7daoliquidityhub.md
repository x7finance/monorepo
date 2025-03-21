---
title: X7DAO Liquidity Hub
tags: [breakdowns]
---

## Smart Contract Function Variables

### EcosystemMaxiNFTSet

| Parameter Name    | Parameter Type | Description                                |
| ----------------- | -------------- | ------------------------------------------ |
| `oldTokenAddress` | `address`      | The old address of the Ecosystem Maxi NFT. |
| `newTokenAddress` | `address`      | The new address of the Ecosystem Maxi NFT. |

### LiquidityMaxiNFTSet

| Parameter Name    | Parameter Type | Description                                |
| ----------------- | -------------- | ------------------------------------------ |
| `oldTokenAddress` | `address`      | The old address of the Liquidity Maxi NFT. |
| `newTokenAddress` | `address`      | The new address of the Liquidity Maxi NFT. |

### SharesSet

| Parameter Name    | Parameter Type | Description                 |
| ----------------- | -------------- | --------------------------- |
| `distributeShare` | `uint256`      | The share for distribution. |
| `liquidityShare`  | `uint256`      | The share for liquidity.    |
| `auxiliaryShare`  | `uint256`      | The share for auxiliary.    |
| `treasuryShare`   | `uint256`      | The share for treasury.     |

### OffRampPairSet

| Parameter Name       | Parameter Type | Description                       |
| -------------------- | -------------- | --------------------------------- |
| `offRampPairAddress` | `address`      | The address of the off ramp pair. |

### DistributeTargetSet

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `oldTarget`    | `address`      | The old address of the distribute target. |
| `newTarget`    | `address`      | The new address of the distribute target. |

### AuxiliaryTargetSet

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `oldTarget`    | `address`      | The old address of the auxiliary target. |
| `newTarget`    | `address`      | The new address of the auxiliary target. |

### TreasuryTargetSet

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `oldTarget`    | `address`      | The old address of the treasury target. |
| `newTarget`    | `address`      | The new address of the treasury target. |

### LiquidityRatioTargetSet

| Parameter Name         | Parameter Type | Description                     |
| ---------------------- | -------------- | ------------------------------- |
| `liquidityRatioTarget` | `uint256`      | The target ratio for liquidity. |

### LiquidityTokenReceiverSet

| Parameter Name | Parameter Type | Description                                      |
| -------------- | -------------- | ------------------------------------------------ |
| `oldReciever`  | `address`      | The old address of the liquidity token receiver. |
| `newReceiver`  | `address`      | The new address of the liquidity token receiver. |

### BalanceThresholdSet

| Parameter Name | Parameter Type | Description            |
| -------------- | -------------- | ---------------------- |
| `threshold`    | `uint256`      | The balance threshold. |

### RouterSet

| Parameter Name | Parameter Type | Description                |
| -------------- | -------------- | -------------------------- |
| `router`       | `address`      | The address of the router. |

### TreasuryTargetFrozen, DistributeTargetFrozen, AuxiliaryTargetFrozen, BalanceThresholdFrozen

These events do not have any parameters.

### setShares

| Parameter Name     | Parameter Type | Description                           |
| ------------------ | -------------- | ------------------------------------- |
| `distributeShare_` | `uint256`      | The share for distribution to be set. |
| `liquidityShare_`  | `uint256`      | The share for liquidity to be set.    |
| `auxiliaryShare_`  | `uint256`      | The share for auxiliary to be set.    |
| `treasuryShare_`   | `uint256`      | The share for treasury to be set.     |

### setRouter

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `router_`      | `address`      | The address of the router to be set. |

### setOffRampPair

| Parameter Name       | Parameter Type | Description                                 |
| -------------------- | -------------- | ------------------------------------------- |
| `offRampPairAddress` | `address`      | The address of the off ramp pair to be set. |

### setBalanceThreshold

| Parameter Name | Parameter Type | Description                      |
| -------------- | -------------- | -------------------------------- |
| `threshold`    | `uint256`      | The balance threshold to be set. |

### setLiquidityRatioTarget

| Parameter Name          | Parameter Type | Description                               |
| ----------------------- | -------------- | ----------------------------------------- |
| `liquidityRatioTarget_` | `uint256`      | The target ratio for liquidity to be set. |

### setLiquidityTokenReceiver

| Parameter Name            | Parameter Type | Description                                            |
| ------------------------- | -------------- | ------------------------------------------------------ |
| `liquidityTokenReceiver_` | `address`      | The address of the liquidity token receiver to be set. |

### setDistributionTarget

| Parameter Name | Parameter Type | Description                                       |
| -------------- | -------------- | ------------------------------------------------- |
| `target`       | `address`      | The address of the distribution target to be set. |

### setAuxiliaryTarget

| Parameter Name | Parameter Type | Description                                    |
| -------------- | -------------- | ---------------------------------------------- |
| `target`       | `address`      | The address of the auxiliary target to be set. |

### setTreasuryTarget

| Parameter Name | Parameter Type | Description                                   |
| -------------- | -------------- | --------------------------------------------- |
| `target`       | `address`      | The address of the treasury target to be set. |

### freezeTreasuryTarget, freezeDistributeTarget, freezeAuxiliaryTarget, freezeBalanceThreshold

These functions do not have any parameters.

### processFees

| Parameter Name | Parameter Type | Description                                         |
| -------------- | -------------- | --------------------------------------------------- |
| `tokenAddress` | `address`      | The address of the token for which to process fees. |

### sendDistributeBalance, sendTreasuryBalance

These functions do not have any parameters.

### rescueWETH

This function does not have any parameters.
