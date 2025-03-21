---
title: X7 Pioneer
tags: [breakdowns]
---

## Smart Contract Function Variables

### MintingOpen

| Parameter Name | Parameter Type | Description                  |
| -------------- | -------------- | ---------------------------- |
|                |                | No parameters for this event |

### TransferUnlockFeeDestinationSet

| Parameter Name   | Parameter Type | Description                                 |
| ---------------- | -------------- | ------------------------------------------- |
| `oldDestination` | `address`      | Old transfer unlock fee destination address |
| `newDestination` | `address`      | New transfer unlock fee destination address |

### TransferUnlockFeeSet

| Parameter Name | Parameter Type | Description             |
| -------------- | -------------- | ----------------------- |
| `oldPrice`     | `uint256`      | Old transfer unlock fee |
| `newPrice`     | `uint256`      | New transfer unlock fee |

### BaseURISet

| Parameter Name | Parameter Type | Description  |
| -------------- | -------------- | ------------ |
| `oldURI`       | `string`       | Old base URI |
| `newURI`       | `string`       | New base URI |

### TransferUnlocked

| Parameter Name | Parameter Type | Description                               |
| -------------- | -------------- | ----------------------------------------- |
| `tokenId`      | `uint256`      | Token ID whose transfer has been unlocked |

### RewardsClaimed

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `tokenId`      | `uint256`      | Token ID whose rewards have been claimed |
| `recipient`    | `address`      | Address of the recipient of the rewards  |
| `amount`       | `uint256`      | Amount of rewards claimed                |

### AirdropDisabled

| Parameter Name | Parameter Type | Description                  |
| -------------- | -------------- | ---------------------------- |
|                |                | No parameters for this event |

### VariantSelected

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `tokenId`      | `uint256`      | Token ID whose variant has been selected |
| `variantIndex` | Variant        | Index of the selected variant            |

### setTransferUnlockFeeDestination

| Parameter Name                  | Parameter Type | Description                                 |
| ------------------------------- | -------------- | ------------------------------------------- |
| `transferUnlockFeeDestination_` | `address`      | New transfer unlock fee destination address |

### setBaseURI

| Parameter Name | Parameter Type | Description  |
| -------------- | -------------- | ------------ |
| `baseURI_`     | `string`       | New base URI |

### setTransferUnlockFee

| Parameter Name       | Parameter Type | Description             |
| -------------------- | -------------- | ----------------------- |
| `transferUnlockFee_` | `uint256`      | New transfer unlock fee |

### SetAllowTokenOwnerVariantSelection

| Parameter Name | Parameter Type | Description                                    |
| -------------- | -------------- | ---------------------------------------------- |
| `allowed`      | `bool`         | Whether to allow token owner variant selection |

### airdropTokens

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `recipients`   | `address[]`    | Addresses to airdrop tokens to |

### disableAirDrop

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |

### unlockTransfer

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `tokenId`      | `uint256`      | Token ID to unlock transfer for |

### claimRewards

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `tokenIds`     | `uint256[]`    | Array of token IDs to claim rewards for |

### unclaimedRewards (single tokenId)

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `tokenId`      | `uint256`      | Token ID to check unclaimed rewards for |

### unclaimedRewards (multiple tokenIds)

| Parameter Name | Parameter Type | Description                                       |
| -------------- | -------------- | ------------------------------------------------- |
| `tokenIds`     | `uint256[]`    | Array of token IDs to check unclaimed rewards for |

### selectVariant

| Parameter Name | Parameter Type | Description                    |
| -------------- | -------------- | ------------------------------ |
| `tokenId`      | `uint256`      | Token ID to select variant for |
| `variant`      | Variant        | Variant to be selected         |

### \_baseURI

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
|                |                | No parameters for this function |
