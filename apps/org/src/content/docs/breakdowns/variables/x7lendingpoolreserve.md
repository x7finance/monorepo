---
title: X7 Lending Pool Reserve
tags: [breakdowns]
---

## Smart Contract Function Variables

### EcosystemRecipientSet

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `oldAddress`   | `address`      | The old ecosystem recipient address. |
| `newAddress`   | `address`      | The new ecosystem recipient address. |

### EcosystemPayerSet

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `payorAddress` | `address`      | The payer's address.                 |
| `isPayer`      | `bool`         | Whether the payer is a payer or not. |

### LendingPoolSet

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `oldAddress`   | `address`      | The old lending pool address. |
| `newAddress`   | `address`      | The new lending pool address. |

### FundsSent

| Parameter Name | Parameter Type | Description                                |
| -------------- | -------------- | ------------------------------------------ |
| `recipient`    | `address`      | The address of the recipient of the funds. |
| `amount`       | `uint256`      | The amount of funds sent.                  |

### FundsReturned

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `sender`       | `address`      | The address of the sender of the funds. |
| `amount`       | `uint256`      | The amount of funds returned.           |

### depositETH

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |

### depositETHForRecipient

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `recipient`    | `address`      | The address of the recipient. |

### withdrawETH

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `amount`       | `uint256`      | The amount of ETH to withdraw. |

### returnETH

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |

### setLendingPool

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `lendingPool_` | `address`      | The new lending pool address. |

### setEcosystemRecipientAddress

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `recipient`    | `address`      | The new ecosystem recipient address. |

### setX7D

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `X7DAddress`   | `address`      | The new X7D contract address. |

### setEcosystemPayer

| Parameter Name          | Parameter Type | Description                            |
| ----------------------- | -------------- | -------------------------------------- |
| `ecosystemPayerAddress` | `address`      | The address of the ecosystem payer.    |
| `value`                 | `bool`         | Whether the address is a payer or not. |

### fundLendingPool

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `amount`       | `uint256`      | The amount to fund the lending pool with. |
