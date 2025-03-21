---
title: X7 Token Time Lock
tags: [breakdowns]
---

## Smart Contract Function Variables

### GlobalUnlockTimestampSet

| Parameter Name    | Parameter Type | Description                                     |
| ----------------- | -------------- | ----------------------------------------------- |
| `unlockTimestamp` | `uint256`      | The timestamp when the global unlock will occur |

### GlobalUnlockTimeExtended

| Parameter Name       | Parameter Type | Description                                           |
| -------------------- | -------------- | ----------------------------------------------------- |
| `secondsExtended`    | `uint256`      | The number of seconds the unlock time was extended by |
| `newUnlockTimestamp` | `uint256`      | The new unlock timestamp after extension              |

### TokenUnlockTimestampSet

| Parameter Name    | Parameter Type | Description                              |
| ----------------- | -------------- | ---------------------------------------- |
| `tokenAddress`    | `address`      | The address of the token                 |
| `unlockTimestamp` | `uint256`      | The timestamp when the token will unlock |

### TokenUnlockTimeExtended

| Parameter Name       | Parameter Type | Description                                           |
| -------------------- | -------------- | ----------------------------------------------------- |
| `tokenAddress`       | `address`      | The address of the token                              |
| `secondsExtended`    | `uint256`      | The number of seconds the unlock time was extended by |
| `newUnlockTimestamp` | `uint256`      | The new unlock timestamp after extension              |

### TokenOwnerSet

| Parameter Name  | Parameter Type | Description                        |
| --------------- | -------------- | ---------------------------------- |
| `tokenAddress`  | `address`      | The address of the token           |
| `oldTokenOwner` | `address`      | The address of the old token owner |
| `newTokenOwner` | `address`      | The address of the new token owner |

### TokensWithdrawn

| Parameter Name     | Parameter Type | Description                                          |
| ------------------ | -------------- | ---------------------------------------------------- |
| `tokenAddress`     | `address`      | The address of the token                             |
| `recipientAddress` | `address`      | The address of the recipient of the withdrawn tokens |
| `amount`           | `uint256`      | The amount of tokens withdrawn                       |

### setWETH

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `weth`         | `address`      | The address of the WETH token |

### setGlobalUnlockTimestamp

| Parameter Name    | Parameter Type | Description                                     |
| ----------------- | -------------- | ----------------------------------------------- |
| `unlockTimestamp` | `uint256`      | The timestamp when the global unlock will occur |

### extendGlobalUnlockTimestamp

| Parameter Name  | Parameter Type | Description                                        |
| --------------- | -------------- | -------------------------------------------------- |
| `extendSeconds` | `uint256`      | The number of seconds to extend the unlock time by |

### setTokenUnlockTimestamp

| Parameter Name    | Parameter Type | Description                              |
| ----------------- | -------------- | ---------------------------------------- |
| `tokenAddress`    | `address`      | The address of the token                 |
| `unlockTimestamp` | `uint256`      | The timestamp when the token will unlock |

### extendTokenUnlockTimestamp

| Parameter Name  | Parameter Type | Description                                        |
| --------------- | -------------- | -------------------------------------------------- |
| `tokenAddress`  | `address`      | The address of the token                           |
| `extendSeconds` | `uint256`      | The number of seconds to extend the unlock time by |

### setTokenOwner

| Parameter Name | Parameter Type | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `tokenAddress` | `address`      | The address of the token           |
| `ownerAddress` | `address`      | The address of the new token owner |

### getTokenUnlockTimestamp

| Parameter Name | Parameter Type | Description              |
| -------------- | -------------- | ------------------------ |
| `tokenAddress` | `address`      | The address of the token |

### withdrawTokens

| Parameter Name | Parameter Type | Description                      |
| -------------- | -------------- | -------------------------------- |
| `tokenAddress` | `address`      | The address of the token         |
| `amount`       | `uint256`      | The amount of tokens to withdraw |
