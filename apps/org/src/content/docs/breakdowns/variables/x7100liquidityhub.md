---
title: X7100 Liquidity Hub
tags: [breakdowns]
---

## Smart Contract Variables

Sure, I can add backticks around the parameter name and parameter type for each cell. Here it is:

### SharesSet

| Parameter Name    | Parameter Type | Description                 |
| ----------------- | -------------- | --------------------------- |
| `distributeShare` | `uint256`      | The share for distribution. |
| `liquidityShare`  | `uint256`      | The share for liquidity.    |
| `treasuryShare`   | `uint256`      | The share for the treasury. |

### OffRampPairSet

| Parameter Name | Parameter Type | Description                       |
| -------------- | -------------- | --------------------------------- |
| `offRampPair`  | `address`      | The address of the off-ramp pair. |

### DistributeTargetSet

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `oldTarget`    | `address`      | The address of the old distribute target. |
| `newTarget`    | `address`      | The address of the new distribute target. |

### TreasuryTargetSet

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `oldTarget`    | `address`      | The address of the old treasury target. |
| `newTarget`    | `address`      | The address of the new treasury target. |

### LiquidityRatioTargetSet

| Parameter Name         | Parameter Type | Description                 |
| ---------------------- | -------------- | --------------------------- |
| `liquidityRatioTarget` | `uint256`      | The target liquidity ratio. |

### LiquidityTokenReceiverSet

| Parameter Name | Parameter Type | Description                                      |
| -------------- | -------------- | ------------------------------------------------ |
| `oldReciever`  | `address`      | The address of the old liquidity token receiver. |
| `newReceiver`  | `address`      | The address of the new liquidity token receiver. |

### BalanceThresholdSet

| Parameter Name | Parameter Type | Description            |
| -------------- | -------------- | ---------------------- |
| `threshold`    | `uint256`      | The balance threshold. |

### RouterSet

| Parameter Name | Parameter Type | Description                |
| -------------- | -------------- | -------------------------- |
| `router`       | `address`      | The address of the router. |

### setShares

| Parameter Name     | Parameter Type | Description                 |
| ------------------ | -------------- | --------------------------- |
| `distributeShare_` | `uint256`      | The share for distribution. |
| `liquidityShare_`  | `uint256`      | The share for liquidity.    |
| `treasuryShare_`   | `uint256`      | The share for the treasury. |

### setRouter

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `router_`      | `address`      | The address of the new router. |

### setOffRampPair

| Parameter Name       | Parameter Type | Description                           |
| -------------------- | -------------- | ------------------------------------- |
| `offRampPairAddress` | `address`      | The address of the new off-ramp pair. |

### setBalanceThreshold

| Parameter Name | Parameter Type | Description                |
| -------------- | -------------- | -------------------------- |
| `threshold`    | `uint256`      | The new balance threshold. |

### setLiquidityRatioTarget

| Parameter Name          | Parameter Type | Description                     |
| ----------------------- | -------------- | ------------------------------- |
| `liquidityRatioTarget_` | `uint256`      | The new target liquidity ratio. |

### setLiquidityTokenReceiver

| Parameter Name            | Parameter Type | Description                                      |
| ------------------------- | -------------- | ------------------------------------------------ |
| `liquidityTokenReceiver_` | `address`      | The address of the new liquidity token receiver. |

### setDistributionTarget

| Parameter Name | Parameter Type | Description                                 |
| -------------- | -------------- | ------------------------------------------- |
| `target`       | `address`      | The address of the new distribution target. |

### setTreasuryTarget

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `target`       | `address`      | The address of the new treasury target. |

### processFees

| Parameter Name | Parameter Type | Description                                         |
| -------------- | -------------- | --------------------------------------------------- |
| `tokenAddress` | `address`      | The address of the token for which to process fees. |

### sendDistributeBalance

No parameters.

### sendTreasuryBalance

No parameters.

### \_sendBalance

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `outlet`       | `Outlet`       | The outlet to which to send balance. |

### addLiquidityETH

| Parameter Name | Parameter Type | Description                                     |
| -------------- | -------------- | ----------------------------------------------- |
| `tokenAmount`  | `uint256`      | The amount of tokens to be added for liquidity. |
| `ethAmount`    | `uint256`      | The amount of ETH to be added for liquidity.    |

### swapTokensForEth

| Parameter Name | Parameter Type | Description                                |
| -------------- | -------------- | ------------------------------------------ |
| `tokenAddress` | `address`      | The address of the tokens to swap for ETH. |
| `tokenAmount`  | `uint256`      | The amount of tokens to swap for ETH.      |

### swapEthForTokens

| Parameter Name | Parameter Type | Description                           |
| -------------- | -------------- | ------------------------------------- |
| `ethAmount`    | `uint256`      | The amount of ETH to swap for tokens. |

### rescueWETH

No parameters.
