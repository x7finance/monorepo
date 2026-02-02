---
title: X7 Ecosystem Maxi
tags: [breakdowns]
---

## Smart Contract Function Variables

### MintFeeDestinationSet

| Parameter Name   | Parameter Type | Description                                  |
| ---------------- | -------------- | -------------------------------------------- |
| `oldDestination` | `address`      | The old address of the mint fee destination. |
| `newDestination` | `address`      | The new address of the mint fee destination. |

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

| Parameter Name    | Parameter Type | Description                          |
| ----------------- | -------------- | ------------------------------------ |
| `whitelistActive` | `bool`         | The new state of whitelist activity. |

### WhitelistAuthoritySet

| Parameter Name          | Parameter Type | Description                                 |
| ----------------------- | -------------- | ------------------------------------------- |
| `oldWhitelistAuthority` | `address`      | The old address of the whitelist authority. |
| `newWhitelistAuthority` | `address`      | The new address of the whitelist authority. |

### whitelist

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `holder`       | `address`      | The holder address to check in whitelist. |

**Returns:**

| Return | Type | Description |
|--------------------|----------------|-----------------------------------------------------|
| | `bool` | Returns true if the holder is in whitelist. |

### setMintFeeDestination

| Parameter Name        | Parameter Type | Description                               |
| --------------------- | -------------- | ----------------------------------------- |
| `mintFeeDestination_` | `address`      | The new address for mint fee destination. |

### setBaseURI

| Parameter Name | Parameter Type | Description       |
| -------------- | -------------- | ----------------- |
| `baseURI_`     | `string`       | The new base URI. |

### setMintPrice

| Parameter Name | Parameter Type | Description         |
| -------------- | -------------- | ------------------- |
| `mintPrice_`   | `uint256`      | The new mint price. |

### setWhitelist

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `isActive`     | `bool`         | The new state to set for whitelist activity. |

### setWhitelistComplete

This function does not have any parameters.

### setWhitelistAuthority

| Parameter Name        | Parameter Type | Description                              |
| --------------------- | -------------- | ---------------------------------------- |
| `whitelistAuthority_` | `address`      | The new address for whitelist authority. |

### openMinting

This function does not have any parameters.

### mint

This function does not have any parameters.

### mintMany

| Parameter Name | Parameter Type | Description          |
| -------------- | -------------- | -------------------- |
| `numMints`     | `uint256`      | The number of mints. |

### \_mintMany

| Parameter Name | Parameter Type | Description          |
| -------------- | -------------- | -------------------- |
| `numMints`     | `uint256`      | The number of mints. |

### \_baseURI

This function does not have any parameters.
**Returns:**

| Return | Type | Description |
|--------------------|----------------|-----------------------------------------------------|
| | `string` | Returns the base URI. |
