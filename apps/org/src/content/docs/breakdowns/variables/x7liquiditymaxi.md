---
title: X7 Liquidity Maxi
tags: [breakdowns]
---

## Smart Contract Function Variables

### MintingOpen

| Parameter Name | Parameter Type | Description                  |
| -------------- | -------------- | ---------------------------- |
|                |                | No parameters for this event |

### MintFeeDestinationSet

| Parameter Name   | Parameter Type | Description                           |
| ---------------- | -------------- | ------------------------------------- |
| `oldDestination` | `address`      | The old mint fee destination address. |
| `newDestination` | `address`      | The new mint fee destination address. |

### MintPriceSet

| Parameter Name | Parameter Type | Description         |
| -------------- | -------------- | ------------------- |
| `oldPrice`     | `uint256`      | The old mint price. |
| `newPrice`     | `uint256`      | The new mint price. |

### BaseURISet

| Parameter Name | Parameter Type | Description       |
| -------------- | -------------- | ----------------- |
| `oldURI`       | `string`       | The old base URI. |
| `newURI`       | `string`       | The new base URI. |

### WhitelistActivitySet

| Parameter Name    | Parameter Type | Description                      |
| ----------------- | -------------- | -------------------------------- |
| `whitelistActive` | `bool`         | Whether the whitelist is active. |

### WhitelistAuthoritySet

| Parameter Name          | Parameter Type | Description                          |
| ----------------------- | -------------- | ------------------------------------ |
| `oldWhitelistAuthority` | `address`      | The old whitelist authority address. |
| `newWhitelistAuthority` | `address`      | The new whitelist authority address. |

### whitelist

| Parameter Name | Parameter Type | Description           |
| -------------- | -------------- | --------------------- |
| `holder`       | `address`      | The holder's address. |

### setMintFeeDestination

| Parameter Name        | Parameter Type | Description                           |
| --------------------- | -------------- | ------------------------------------- |
| `mintFeeDestination_` | `address`      | The new mint fee destination address. |

### setBaseURI

| Parameter Name | Parameter Type | Description       |
| -------------- | -------------- | ----------------- |
| `baseURI_`     | `string`       | The new base URI. |

### setMintPrice

| Parameter Name | Parameter Type | Description         |
| -------------- | -------------- | ------------------- |
| `mintPrice_`   | `uint256`      | The new mint price. |

### setWhitelist

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `isActive`     | `bool`         | Whether the whitelist should be active. |

### setWhitelistComplete

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |

### setWhitelistAuthority

| Parameter Name        | Parameter Type | Description                          |
| --------------------- | -------------- | ------------------------------------ |
| `whitelistAuthority_` | `address`      | The new whitelist authority address. |

### openMinting

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |

### mint

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |

### mintMany

| Parameter Name | Parameter Type | Description          |
| -------------- | -------------- | -------------------- |
| `numMints`     | `uint256`      | The number of mints. |

### \_mintMany

| Parameter Name | Parameter Type | Description          |
| -------------- | -------------- | -------------------- |
| `numMints`     | `uint256`      | The number of mints. |

### \_baseURI

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |
