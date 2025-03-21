---
title: Xchange Factory
tags: [breakdowns]
---

## Smart Contract Function Variables

Here are the tables for the events and functions in the XchangeFactory contract:

### allPairsLength Function

| Parameter Name | Parameter Type | Description |

No parameters.

### isTrusted Function

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `checkAddress` | `address`      | The address to check if it is trusted. |

### isFailsafeLiquidator Function

| Parameter Name | Parameter Type | Description                                          |
| -------------- | -------------- | ---------------------------------------------------- |
| `checkAddress` | `address`      | The address to check if it is a failsafe liquidator. |

### setFeeTo Function

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `_feeTo`       | `address`      | The address to set as the new fee recipient. |

### setDiscountAuthority Function

| Parameter Name       | Parameter Type | Description                                       |
| -------------------- | -------------- | ------------------------------------------------- |
| `_discountAuthority` | `address`      | The address to set as the new discount authority. |

### setTrusted Function

| Parameter Name       | Parameter Type | Description                                 |
| -------------------- | -------------- | ------------------------------------------- |
| `trustAddress`       | `address`      | The address to set as trusted or untrusted. |
| `shouldTrustAddress` | `bool`         | The new trust status of the address.        |

### setFailsafeLiquidator Function

| Parameter Name       | Parameter Type | Description                                             |
| -------------------- | -------------- | ------------------------------------------------------- |
| `trustAddress`       | `address`      | The address to set as a failsafe liquidator or not.     |
| `shouldTrustAddress` | `bool`         | The new status of the address as a failsafe liquidator. |

### createPair Function

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `tokenA`       | `address`      | The address of the first token in the pair.  |
| `tokenB`       | `address`      | The address of the second token in the pair. |
