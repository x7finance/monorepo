---
title: X7 Token Burner
tags: [breakdowns]
---

## Smart Contract Function Variables

### RouterSet

| Parameter Name  | Parameter Type | Description               |
| --------------- | -------------- | ------------------------- |
| `routerAddress` | `address`      | The address of the router |

### TargetTokenSet

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `tokenAddress` | `address`      | The address of the target token |

### TokensBurned

| Parameter Name | Parameter Type | Description                                           |
| -------------- | -------------- | ----------------------------------------------------- |
| `tokenAddress` | `address`      | The address of the burned token                       |
| `ETHAmount`    | `uint256`      | The amount of ETH used to purchase and burn the token |

### setRouter

| Parameter Name | Parameter Type | Description               |
| -------------- | -------------- | ------------------------- |
| `router`       | `address`      | The address of the router |

### setTargetToken

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `targetToken`  | `address`      | The address of the target token |

### receive

No parameters

### swapTokensForEth

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `tokenAddress` | `address`      | The address of the token to swap for ETH |
| `tokenAmount`  | `uint256`      | The amount of tokens to swap for ETH     |

### rescueTokens

| Parameter Name | Parameter Type | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `tokenAddress` | `address`      | The address of the token to rescue |

### rescueWETH

No parameters
