---
title: X7D Token
tags: [breakdowns]
---

## Smart Contract Function Variables

### AuthorizedMinterSet

| Parameter Name  | Parameter Type | Description                                        |
| --------------- | -------------- | -------------------------------------------------- |
| `minterAddress` | `address`      | The address of the minter.                         |
| `isAuthorized`  | `bool`         | Indicates whether the minter is authorized or not. |

### AuthorizedRedeemerSet

| Parameter Name    | Parameter Type | Description                                          |
| ----------------- | -------------- | ---------------------------------------------------- |
| `redeemerAddress` | `address`      | The address of the redeemer.                         |
| `isAuthorized`    | `bool`         | Indicates whether the redeemer is authorized or not. |

### receive

No parameters

### authorizedMintersCount

No parameters

### authorizedRedeemersCount

No parameters

### setAuthorizedMinter

| Parameter Name  | Parameter Type | Description                                |
| --------------- | -------------- | ------------------------------------------ |
| `minterAddress` | `address`      | The address of the minter.                 |
| `isAuthorized`  | `bool`         | Indicates whether to authorize the minter. |

### setAuthorizedRedeemer

| Parameter Name    | Parameter Type | Description                                  |
| ----------------- | -------------- | -------------------------------------------- |
| `redeemerAddress` | `address`      | The address of the redeemer.                 |
| `isAuthorized`    | `bool`         | Indicates whether to authorize the redeemer. |

### mint

| Parameter Name | Parameter Type | Description             |
| -------------- | -------------- | ----------------------- |
| `to`           | `address`      | The address to mint to. |
| `amount`       | `uint256`      | The amount to mint.     |

### burn

| Parameter Name | Parameter Type | Description               |
| -------------- | -------------- | ------------------------- |
| `from`         | `address`      | The address to burn from. |
| `amount`       | `uint256`      | The amount to burn.       |

### circulatingSupply

No parameters
