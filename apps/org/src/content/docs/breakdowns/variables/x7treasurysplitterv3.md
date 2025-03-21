---
title: Xchange Treasury Splitter V3
tags: [breakdowns]
---

## Smart Contract Function Variables

### SharesSet

| Parameter Name       | Parameter Type | Description                         |
| -------------------- | -------------- | ----------------------------------- |
| `oldOtherSlot1Share` | uint256        | Old share value of the other slot 1 |
| `oldOtherSlot2Share` | uint256        | Old share value of the other slot 2 |
| `oldRewardPoolShare` | uint256        | Old share value of the reward pool  |
| `newOtherSlot1Share` | uint256        | New share value of the other slot 1 |
| `newOtherSlot2Share` | uint256        | New share value of the other slot 2 |
| `newRewardPoolShare` | uint256        | New share value of the reward pool  |

### setOutletRecipient

| Parameter Name | Parameter Type | Description                  |
| -------------- | -------------- | ---------------------------- |
| `outlet`       | Outlet         | Outlet type                  |
| `recipient`    | address        | The address of the recipient |

### freezeOutlet

| Parameter Name | Parameter Type | Description                      |
| -------------- | -------------- | -------------------------------- |
| `outlet`       | `Outlet`       | The outlet that is being frozen. |

### takeBalance

No parameters.

### takeCurrentBalance

No parameters.

### setWETH

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `weth_`        | `address`      | The address of the WETH token. |

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
