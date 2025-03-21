---
title: X7 Dex Maxi
tags: [breakdowns]
---

## Smart Contract Function Variables

### SharesSet

| Parameter Name     | Parameter Type | Description                     |
| ------------------ | -------------- | ------------------------------- |
| `x7RShare`         | `uint256`      | The share for X7R.              |
| `x7DAOShare`       | `uint256`      | The share for X7DAO.            |
| `x7100Share`       | `uint256`      | The share for X7100.            |
| `lendingPoolShare` | `uint256`      | The share for the lending pool. |
| `treasuryShare`    | `uint256`      | The share for the treasury.     |

### OutletRecipientSet

| Parameter Name | Parameter Type | Description                      |
| -------------- | -------------- | -------------------------------- |
| `outlet`       | `Outlet`       | The outlet that is being set.    |
| `oldRecipient` | `address`      | The old recipient of the outlet. |
| `newRecipient` | `address`      | The new recipient of the outlet. |

### OutletFrozen

| Parameter Name | Parameter Type | Description                      |
| -------------- | -------------- | -------------------------------- |
| `outlet`       | `Outlet`       | The outlet that is being frozen. |

### receive

This function does not have any parameters.

### setWETH

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `weth_`        | `address`      | The address of the WETH token. |

### setOutlet

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `outlet`       | `Outlet`       | The outlet to be set.                   |
| `recipient`    | `address`      | The recipient to be set for the outlet. |

### freezeOutletChange

| Parameter Name | Parameter Type | Description              |
| -------------- | -------------- | ------------------------ |
| `outlet`       | `Outlet`       | The outlet to be frozen. |

### setShares

| Parameter Name      | Parameter Type | Description                               |
| ------------------- | -------------- | ----------------------------------------- |
| `x7rShare_`         | `uint256`      | The share to be set for X7R.              |
| `x7daoShare_`       | `uint256`      | The share to be set for X7DAO.            |
| `x7100Share_`       | `uint256`      | The share to be set for X7100.            |
| `lendingPoolShare_` | `uint256`      | The share to be set for the lending pool. |
| `treasuryShare_`    | `uint256`      | The share to be set for the treasury.     |

### takeBalance

This function does not have any parameters.

### \_sendBalance

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `outlet`       | `Outlet`       | The outlet from which to send balance. |

### pushAll

This function does not have any parameters.

### rescueWETH

This function does not have any parameters.

### rescueTokens

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `tokenAddress` | `address`      | The address of the token to be rescued. |
