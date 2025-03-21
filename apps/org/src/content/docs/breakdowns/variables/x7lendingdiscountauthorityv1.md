---
title: X7 Lending Discount Authority
tags: [breakdowns]
---

## Smart Contract Function Variables

### AuthorizedConsumerSet

Triggered when a consumer's authorization status is set.

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `consumer`     | `address`      | The address of the consumer.  |
| `isAuthorized` | `bool`         | The new authorization status. |

### TimeBasedDiscountSet

Triggered when the time-based discount is set.

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `oldMin`       | `uint256`      | The old minimum time-based discount. |
| `oldMax`       | `uint256`      | The old maximum time-based discount. |
| `min`          | `uint256`      | The new minimum time-based discount. |
| `max`          | `uint256`      | The new maximum time-based discount. |

### AmountBasedDiscountSet

Triggered when the amount-based discount is set.

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `oldMin`       | `uint256`      | The old minimum amount-based discount. |
| `oldMax`       | `uint256`      | The old maximum amount-based discount. |
| `min`          | `uint256`      | The new minimum amount-based discount. |
| `max`          | `uint256`      | The new maximum amount-based discount. |

### DiscountNFTSet

Triggered when the discount NFT is set.

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `oldAddress`   | `address`      | The old discount NFT address. |
| `newAddress`   | `address`      | The new discount NFT address. |

### ConsumableDiscountNFTSet

Triggered when the consumable discount NFT is set.

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `oldAddress`   | `address`      | The old consumable discount NFT address. |
| `newAddress`   | `address`      | The new consumable discount NFT address. |

### DiscountNFTDiscountsSet

Triggered when the discount NFT discounts are set.

| Parameter Name              | Parameter Type | Description                                            |
| --------------------------- | -------------- | ------------------------------------------------------ |
| `oldOriginationFeeDiscount` | `uint256`      | The old origination fee discount for the discount NFT. |
| `oldPremiumFeeDiscount`     | `uint256`      | The old premium fee discount for the discount NFT.     |
| `originationFeeDiscount`    | `uint256`      | The new origination fee discount for the discount NFT. |
| `premiumFeeDiscount`        | `uint256`      | The new premium fee discount for the discount NFT.     |

### ConsumableDiscountNFTDiscountsSet

Triggered when the consumable discount NFT discounts are set.

| Parameter Name              | Parameter Type | Description                                                       |
| --------------------------- | -------------- | ----------------------------------------------------------------- |
| `oldOriginationFeeDiscount` | `uint256`      | The old origination fee discount for the consumable discount NFT. |
| `oldPremiumFeeDiscount`     | `uint256`      | The old premium fee discount for the consumable discount NFT.     |
| `originationFeeDiscount`    | `uint256`      | The new origination fee discount for the consumable discount NFT. |
| `premiumFeeDiscount`        | `uint256`      | The new premium fee discount for the consumable discount NFT.     |

### setAuthorizedConsumer

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `consumer`     | `address`      | The address of the consumer.  |
| `isAuthorized` | `bool`         | The new authorization status. |

### setTimeBasedDiscount

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `min`          | `uint256`      | The new minimum time-based discount. |
| `max`          | `uint256`      | The new maximum time-based discount. |

### setAmountBasedDiscount

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `min`          | `uint256`      | The new minimum amount-based discount. |
| `max`          | `uint256`      | The new maximum amount-based discount. |

### setDiscountNFT

| Parameter Name       | Parameter Type | Description                          |
| -------------------- | -------------- | ------------------------------------ |
| `discountNFTAddress` | `address`      | The new address of the discount NFT. |

### setConsumableDiscountNFT

| Parameter Name                 | Parameter Type | Description                                     |
| ------------------------------ | -------------- | ----------------------------------------------- |
| `consumableDiscountNFTAddress` | `address`      | The new address of the consumable discount NFT. |

### setDiscountNFTDiscounts

| Parameter Name           | Parameter Type | Description                                            |
| ------------------------ | -------------- | ------------------------------------------------------ |
| `premiumFeeDiscount`     | `uint256`      | The new premium fee discount for the discount NFT.     |
| `originationFeeDiscount` | `uint256`      | The new origination fee discount for the discount NFT. |

### setConsumableDiscountNFTDiscounts

| Parameter Name | Parameter Type | Description |
|

---------------------- | -------------- | ----------------------------------------------------------------- |
| `premiumFeeDiscount` | `uint256` | The new premium fee discount for the consumable discount NFT. |
| `originationFeeDiscount` | `uint256` | The new origination fee discount for the consumable discount NFT. |

### getFeeModifiers

| Parameter Name        | Parameter Type | Description                  |
| --------------------- | -------------- | ---------------------------- |
| `borrower`            | `address`      | The address of the borrower. |
| `loanAmountDetails`   | `uint256[3]`   | The loan amount details.     |
| `loanDurationDetails` | `uint256[3]`   | The loan duration details.   |

### useFeeModifiers

| Parameter Name        | Parameter Type | Description                  |
| --------------------- | -------------- | ---------------------------- |
| `borrower`            | `address`      | The address of the borrower. |
| `loanAmountDetails`   | `uint256[3]`   | The loan amount details.     |
| `loanDurationDetails` | `uint256[3]`   | The loan duration details.   |
