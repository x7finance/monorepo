---
title: X7 Borrowing Maxi NFT
tags: [breakdowns]
---

## Smart Contract Function Variables

### MintDestinationSet

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

| Parameter Name    | Parameter Type | Description                                       |
| ----------------- | -------------- | ------------------------------------------------- |
| `whitelistActive` | `bool`         | Indicates whether the whitelist is active or not. |

### WhitelistAuthoritySet

| Parameter Name          | Parameter Type | Description                          |
| ----------------------- | -------------- | ------------------------------------ |
| `oldWhitelistAuthority` | `address`      | The old whitelist authority address. |
| `newWhitelistAuthority` | `address`      | The new whitelist authority address. |

### whitelist

| Parameter Name | Parameter Type | Description                                         |
| -------------- | -------------- | --------------------------------------------------- |
| `holder`       | `address`      | The holder's address to check for whitelist status. |

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

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `isActive`     | `bool`         | Indicates whether to activate the whitelist. |

### setWhitelistComplete

No parameters

### setWhitelistAuthority

| Parameter Name        | Parameter Type | Description                          |
| --------------------- | -------------- | ------------------------------------ |
| `whitelistAuthority_` | `address`      | The new whitelist authority address. |

### openMinting

No parameters

### mint

No parameters

### mintMany

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `numMints`     | `uint256`      | The number of mints to be done. |

### \_mintMany

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `numMints`     | `uint256`      | The number of mints to be done. |

### \_baseURI

No parameters
