---
title: Xchange Pair
tags: [breakdowns]
---

## Smart Contract Function Variables

### factory Function

| Parameter Name | Parameter Type | Description |
| -------------- | -------------- | ----------- |

### getReserves Function

| Parameter Name | Parameter Type | Description |
| -------------- | -------------- | ----------- |

### initialize Function

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `_token0`      | `address`      | The address of the first token in the pair.  |
| `_token1`      | `address`      | The address of the second token in the pair. |

### setMinimumBalance Function

| Parameter Name  | Parameter Type | Description                                              |
| --------------- | -------------- | -------------------------------------------------------- |
| `tokenAddress`  | `address`      | The address of the token to set the minimum balance for. |
| `minimumAmount` | `uint112`      | The minimum amount of the token.                         |

### withdrawTokensAgainstMinimumBalance Function

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `tokenAddress` | `address`      | The address of the token to withdraw.        |
| `to`           | `address`      | The address to send the withdrawn tokens to. |
| `amount`       | `uint112`      | The amount of tokens to withdraw.            |

### mint Function

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `to`           | `address`      | The address to mint the liquidity tokens to. |

### burn Function

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `to`           | `address`      | The address to send the burned tokens to. |

### mustBurn Function

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `to`           | `address`      | The address to send the burned tokens to. |
| `gasAmount`    | `uint256`      | The amount of gas to use for the burn.    |

### swap Function

| Parameter Name | Parameter Type   | Description                                   |
| -------------- | ---------------- | --------------------------------------------- |
| `amount0Out`   | `uint`           | The amount of the first token to swap out.    |
| `amount1Out`   | `uint`           | The amount of the second token to swap out.   |
| `to`           | `address`        | The address to send the swapped tokens to.    |
| `data`         | `bytes calldata` | Additional data to be passed to the function. |

### swapWithDiscount Function

| Parameter Name      | Parameter Type   | Description                                   |
| ------------------- | ---------------- | --------------------------------------------- |
| `amount0Out`        | `uint`           | The amount of the first token to swap out.    |
| `amount1Out`        | `uint`           | The amount of the second token to swap out.   |
| `to`                | `address`        | The address to send the swapped tokens to.    |
| `feeAmountOverride` | `uint`           | The overridden fee amount.                    |
| `data`              | `bytes calldata` | Additional data to be passed to the function. |

### skim Function

| Parameter Name | Parameter Type | Description                                |
| -------------- | -------------- | ------------------------------------------ |
| `to`           | `address`      | The address to send the skimmed tokens to. |

### sync Function

| Parameter Name | Parameter Type | Description |
| -------------- | -------------- | ----------- |

### syncSafe Function

| Parameter Name    | Parameter Type | Description                                                           |
| ----------------- | -------------- | --------------------------------------------------------------------- |
| `gasAmountToken0` | `uint256`      | The amount of gas to use for the synchronization of the first token.  |
| `gasAmountToken1` | `uint256`      | The amount of gas to use for the synchronization of the second token. |

### \_mintFee Function

| Parameter Name | Parameter Type | Description                                    |
| -------------- | -------------- | ---------------------------------------------- |
| `_reserve0`    | `uint112`      | The amount of the first token in the reserve.  |
| `_reserve1`    | `uint112`      | The amount of the second token in the reserve. |

### \_swap Function

| Parameter Name      | Parameter Type   | Description                                   |
| ------------------- | ---------------- | --------------------------------------------- |
| `amount0Out`        | `uint`           | The amount of the first token to swap out.    |
| `amount1Out`        | `uint`           | The amount of the second token to swap out.   |
| `to`                | `address`        | The address to send the swapped tokens to.    |
| `feeAmountOverride` | `uint`           | The overridden fee amount.                    |
| `data`              | `bytes calldata` | Additional data to be passed to the function. |

### \_update Function

| Parameter Name | Parameter Type | Description                                    |
| -------------- | -------------- | ---------------------------------------------- |
| `balance0`     | `uint`         | The balance of the first token.                |
| `balance1`     | `uint`         | The balance of the second token.               |
| `_reserve0`    | `uint112`      | The amount of the first token in the reserve.  |
| `_reserve1`    | `uint112`      | The amount of the second token in the reserve. |

### \_safeTransfer Function

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `token`        | `address`      | The address of the token to transfer.  |
| `to`           | `address`      | The address to transfer the tokens to. |
| `value`        | `uint`         | The amount of tokens to transfer.      |

### \_trySafeTransfer Function

| Parameter Name | Parameter Type | Description                                |
| -------------- | -------------- | ------------------------------------------ |
| `token`        | `address`      | The address of the token to transfer.      |
| `to`           | `address`      | The address to transfer the tokens to.     |
| `value`        | `uint`         | The amount of tokens to transfer.          |
| `gasAmount`    | `uint`         | The amount of gas to use for the transfer. |
