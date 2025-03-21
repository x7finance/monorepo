---
title: X7R Token Contract
tags: [breakdowns]
---

## Smart Contract Function Variables

### LiquidityHubSet

| Parameter Name    | Parameter Type | Description                    |
| ----------------- | -------------- | ------------------------------ |
| `oldLiquidityHub` | `address`      | The old Liquidity Hub address. |
| `newLiquidityHub` | `address`      | The new Liquidity Hub address. |

### DiscountAuthoritySet

| Parameter Name         | Parameter Type | Description                         |
| ---------------------- | -------------- | ----------------------------------- |
| `oldDiscountAuthority` | `address`      | The old Discount Authority address. |
| `newDiscountAuthority` | `address`      | The new Discount Authority address. |

### FeeNumeratorSet

| Parameter Name    | Parameter Type | Description                  |
| ----------------- | -------------- | ---------------------------- |
| `oldFeeNumerator` | `uint256`      | The old fee numerator value. |
| `newFeeNumerator` | `uint256`      | The new fee numerator value. |

### AMMSet

| Parameter Name | Parameter Type | Description          |
| -------------- | -------------- | -------------------- |
| `oldAMM`       | `address`      | The old AMM address. |
| `newAMM`       | `address`      | The new AMM address. |

### OffRampPairSet

| Parameter Name   | Parameter Type | Description                    |
| ---------------- | -------------- | ------------------------------ |
| `oldOffRampPair` | `address`      | The old Off Ramp Pair address. |
| `newOffRampPair` | `address`      | The new Off Ramp Pair address. |

### LiquidityHubFrozen

| Parameter Name | Parameter Type | Description                       |
| -------------- | -------------- | --------------------------------- |
| `liquidityHub` | `address`      | The frozen Liquidity Hub address. |

### DiscountAuthorityFrozen

| Parameter Name      | Parameter Type | Description                            |
| ------------------- | -------------- | -------------------------------------- |
| `discountAuthority` | `address`      | The frozen Discount Authority address. |

### setLiquidityHub

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `liquidityHub` | `address`      | Sets the Liquidity Hub address. |

### setDiscountAuthority

| Parameter Name      | Parameter Type | Description                          |
| ------------------- | -------------- | ------------------------------------ |
| `discountAuthority` | `address`      | Sets the Discount Authority address. |

### setFeeNumerator

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `feeNumerator` | `uint256`      | Sets the fee numerator value. |

### setAMM

| Parameter Name | Parameter Type | Description           |
| -------------- | -------------- | --------------------- |
| `amm`          | `address`      | Sets the AMM address. |

### setOffRampPair

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `offRampPair`  | `address`      | Sets the Off Ramp Pair address. |

### freezeLiquidityHub

No parameters

### freezeDiscountAuthority

No parameters

### enableTrading

No parameters

### rescueETH

| Parameter Name | Parameter Type | Description                         |
| -------------- | -------------- | ----------------------------------- |
| `to`           | `address`      | Rescues ETH to a specified address. |
| `value`        | `uint256`      | The value of ETH to be rescued.     |

### rescueTokens

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `to`           | `address`      | Rescues tokens to a specified address.   |
| `token`        | `address`      | The address of the tokens to be rescued. |
| `value`        | `uint256`      | The value of tokens to be rescued.       |

### \_transfer

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `sender`       | `address`      | The address sending tokens.             |
| `recipient`    | `address`      | The address receiving tokens.           |
| `amount`       | `uint256`      | The amount of tokens to be transferred. |

### circulatingSupply

Returns the current circulating supply of tokens. (Return type: uint256)
