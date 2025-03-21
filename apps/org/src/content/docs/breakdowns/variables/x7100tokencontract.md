---
title: X7100 Token Contract
tags: [breakdowns]
---

## Smart Contract Function Variables

Certainly! Here are the tables with backticks around the parameter name and parameter type:

### LiquidityHubSet

| Parameter Name | Parameter Type | Description                       |
| -------------- | -------------- | --------------------------------- |
| `liquidityHub` | `address`      | The address of the liquidity hub. |

### DiscountAuthoritySet

| Parameter Name      | Parameter Type | Description                            |
| ------------------- | -------------- | -------------------------------------- |
| `discountAuthority` | `address`      | The address of the discount authority. |

### FeeNumeratorSet

| Parameter Name | Parameter Type | Description                |
| -------------- | -------------- | -------------------------- |
| `feeNumerator` | `uint256`      | The numerator for the fee. |

### AMMSet Event

| Parameter Name | Parameter Type | Description                 |
| -------------- | -------------- | --------------------------- |
| `pairAddress`  | `address`      | The address of the pair.    |
| `isAMM`        | `bool`         | Whether the pair is an AMM. |

### OffRampPairSet

| Parameter Name | Parameter Type | Description                       |
| -------------- | -------------- | --------------------------------- |
| `offRampPair`  | `address`      | The address of the off-ramp pair. |

### setLiquidityHub

| Parameter Name  | Parameter Type | Description                           |
| --------------- | -------------- | ------------------------------------- |
| `liquidityHub_` | `address`      | The address of the new liquidity hub. |

### setDiscountAuthority

| Parameter Name       | Parameter Type | Description                                |
| -------------------- | -------------- | ------------------------------------------ |
| `discountAuthority_` | `address`      | The address of the new discount authority. |

### setFeeNumerator

| Parameter Name  | Parameter Type | Description            |
| --------------- | -------------- | ---------------------- |
| `feeNumerator_` | `uint256`      | The new fee numerator. |

### setAMM

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `ammAddress`   | `address`      | The address of the AMM.        |
| `isAMM`        | `bool`         | Whether the address is an AMM. |

### setOffRampPair

| Parameter Name | Parameter Type | Description                           |
| -------------- | -------------- | ------------------------------------- |
| `ammAddress`   | `address`      | The address of the new off-ramp pair. |

### circulatingSupply

No parameters.

### enableTrading

No parameters.

### \_transfer

| Parameter Name | Parameter Type | Description                                    |
| -------------- | -------------- | ---------------------------------------------- |
| `from`         | `address`      | The address from which to transfer the tokens. |
| `to`           | `address`      | The address to which to transfer the tokens.   |
| `amount`       | `uint256`      | The amount of tokens to transfer.              |

### rescueETH

No parameters.

### rescueTokens

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `tokenAddress` | `address`      | The address of the tokens to rescue. |
