---
title: X7DAO Discount Authority
tags: [breakdowns]
---

## Smart Contract Function Variables

### EcosystemMaxiNFTSet

| Parameter Name    | Parameter Type | Description                                |
| ----------------- | -------------- | ------------------------------------------ |
| `oldTokenAddress` | `address`      | The old address of the Ecosystem Maxi NFT. |
| `newTokenAddress` | `address`      | The new address of the Ecosystem Maxi NFT. |

### LiquidityMaxiNFTSet

| Parameter Name    | Parameter Type | Description                                |
| ----------------- | -------------- | ------------------------------------------ |
| `oldTokenAddress` | `address`      | The old address of the Liquidity Maxi NFT. |
| `newTokenAddress` | `address`      | The new address of the Liquidity Maxi NFT. |

### setEcosystemMaxiNFT

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `tokenAddress` | `address`      | The address of the Ecosystem Maxi NFT. |

### setLiquidityMaxiNFT

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `tokenAddress` | `address`      | The address of the Liquidity Maxi NFT. |

### discountRatio

| Parameter Name | Parameter Type | Description                 |
| -------------- | -------------- | --------------------------- |
| `swapper`      | `address`      | The address of the swapper. |

The function "discountRatio" returns two values:

| Return Name   | Return Type | Description                            |
| ------------- | ----------- | -------------------------------------- |
| `numerator`   | `uint256`   | The numerator of the discount ratio.   |
| `denominator` | `uint256`   | The denominator of the discount ratio. |
