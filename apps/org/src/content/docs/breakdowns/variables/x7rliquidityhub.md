---
title: X7R Liquidity Hub
tags: [breakdowns]
---

## Smart Contract Function Variables

### SharesSet

| Parameter Name    | Parameter Type | Description               |
| ----------------- | -------------- | ------------------------- |
| `distributeShare` | `uint256`      | The share of distribution |
| `liquidityShare`  | `uint256`      | The share of liquidity    |
| `treasuryShare`   | `uint256`      | The share of the treasury |

### OffRampPairSet

| Parameter Name | Parameter Type | Description                      |
| -------------- | -------------- | -------------------------------- |
| `offRampPair`  | `address`      | The address of the off-ramp pair |

### DistributeTargetSet

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `oldTarget`    | `address`      | Old distribution target address |
| `newTarget`    | `address`      | New distribution target address |

### TreasuryTargetSet

| Parameter Name | Parameter Type | Description                 |
| -------------- | -------------- | --------------------------- |
| `oldTarget`    | `address`      | Old treasury target address |
| `newTarget`    | `address`      | New treasury target address |

### LiquidityRatioTargetSet

| Parameter Name         | Parameter Type | Description                |
| ---------------------- | -------------- | -------------------------- |
| `liquidityRatioTarget` | `uint256`      | The target liquidity ratio |

### LiquidityTokenReceiverSet

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `oldReciever`  | `address`      | Old liquidity token receiver address |
| `newReceiver`  | `address`      | New liquidity token receiver address |

### BalanceThresholdSet

| Parameter Name | Parameter Type | Description           |
| -------------- | -------------- | --------------------- |
| `threshold`    | `uint256`      | The threshold balance |

### RouterSet

| Parameter Name | Parameter Type | Description               |
| -------------- | -------------- | ------------------------- |
| `router`       | `address`      | The address of the router |

### TreasuryTargetFrozen

No parameters

### DistributeTargetFrozen

No parameters

### BalanceThresholdFrozen

No parameters

### setShares

| Parameter Name    | Parameter Type | Description               |
| ----------------- | -------------- | ------------------------- |
| `distributeShare` | `uint256`      | The share of distribution |
| `liquidityShare`  | `uint256`      | The share of liquidity    |
| `treasuryShare`   | `uint256`      | The share of the treasury |

### setRouter

| Parameter Name | Parameter Type | Description               |
| -------------- | -------------- | ------------------------- |
| `router`       | `address`      | The address of the router |

### setOffRampPair

| Parameter Name       | Parameter Type | Description                      |
| -------------------- | -------------- | -------------------------------- |
| `offRampPairAddress` | `address`      | The address of the off-ramp pair |

### setBalanceThreshold

| Parameter Name | Parameter Type | Description           |
| -------------- | -------------- | --------------------- |
| `threshold`    | `uint256`      | The threshold balance |

### setLiquidityRatioTarget

| Parameter Name         | Parameter Type | Description                |
| ---------------------- | -------------- | -------------------------- |
| `liquidityRatioTarget` | `uint256`      | The target liquidity ratio |

### setLiquidityTokenReceiver

| Parameter Name           | Parameter Type | Description                                 |
| ------------------------ | -------------- | ------------------------------------------- |
| `liquidityTokenReceiver` | `address`      | The address of the liquidity token receiver |

### setDistributionTarget

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `target`       | `address`      | The address of the distribution target |

### setTreasuryTarget

| Parameter Name | Parameter Type | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `target`       | `address`      | The address of the treasury target |

### freezeTreasuryTarget

No parameters

### freezeDistributeTarget

No parameters

### freezeBalanceThreshold

No parameters

### processFees

| Parameter Name | Parameter Type | Description                                        |
| -------------- | -------------- | -------------------------------------------------- |
| `tokenAddress` | `address`      | The address of the token for which to process fees |

### sendDistributeBalance

No parameters

### sendTreasuryBalance

No parameters

### buyBackAndAddLiquidity

No parameters

### addLiquidityETH

| Parameter Name | Parameter Type | Description                                       |
| -------------- | -------------- | ------------------------------------------------- |
| `tokenAmount`  | `uint256`      | The amount of tokens to add to the liquidity pool |
| `ethAmount`    | `uint256`      | The amount of ETH to add to the liquidity pool    |

### swapTokensForEth

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `tokenAddress` | `address`      | The address of the token to swap for ETH |
| `tokenAmount`  | `uint256`      | The amount of tokens to swap for ETH     |

### swapEthForTokens

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `ethAmount`    | `uint256`      | The amount of ETH to swap for tokens |

### rescueWETH

No parameters
