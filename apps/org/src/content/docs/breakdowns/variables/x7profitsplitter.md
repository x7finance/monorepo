---
title: X7 Profit Share Splitter
tags: [breakdowns]
---

## Smart Contract Function Variables

### OutletControllerAuthorizationSet

| Parameter Name  | Parameter Type | Description                   |
| --------------- | -------------- | ----------------------------- |
| `setter`        | address        | The address of the setter     |
| `controller`    | address        | The address of the controller |
| `authorization` | bool           | The authorization status      |

### setOutletRecipient

| Parameter Name | Parameter Type | Description                  |
| -------------- | -------------- | ---------------------------- |
| `outlet`       | Outlet         | Outlet type                  |
| `recipient`    | address        | The address of the recipient |

### takeBalance

No parameters.

### takeCurrentBalance

No parameters.

### pushAll

No parameters.

### rescueWETH

No parameters.

### rescueTokens

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `tokenAddress` | address        | The address of the token to be rescued |

### \_sendBalance

| Parameter Name | Parameter Type | Description |
| -------------- | -------------- | ----------- |
| `outlet`       | Outlet         | Outlet type |
