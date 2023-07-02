---
title: X7 Lending Discount Authority
tags: [breakdowns]
---

Is an Ownable contract and implements the `IX7LendingDiscountAuthority` interface. It has several state variables including `discountNFT`, `consumableDiscountNFT`, `authorizedConsumers`, and various fee discounts. It provides functions to set authorized consumers, time-based and amount-based fee discounts, discount NFT addresses, and discount values. It also includes functions to get and use fee modifiers based on borrower details. The contract emits events for various actions such as setting authorized consumers, setting discounts, and setting discount NFT addresses.

```js
interface IX7LendingDiscountAuthority {
    function getFeeModifiers(
        address borrower,
        uint256[3] memory loanAmountDetails,
        uint256[3] memory loanDurationDetails
    ) external view returns (uint256, uint256);

    function useFeeModifiers(
        address borrower,
        uint256[3] memory loanAmountDetails,
        uint256[3] memory loanDurationDetails
    ) external returns (uint256, uint256);
}

interface IDiscountNFT {
    function balanceOf(address) external view returns (uint256);
}

interface IConsumableDiscountNFT {
    function balanceOf(address) external view returns (uint256);
    function consumeOne(address) external;
    function consumeMany(address, uint256) external;
}
```

The `IX7LendingDiscountAuthority` interface declares two functions:

1.  `getFeeModifiers`: It takes the borrower's address, loan amount details, and loan duration details as parameters and returns two `uint256` values representing fee modifiers.
2.  `useFeeModifiers`: It takes the borrower's address, loan amount details, and loan duration details as parameters and returns two `uint256` values representing fee modifiers. This function also updates the state by consuming discount NFTs.

The `IDiscountNFT` interface declares a single function:

1.  `balanceOf`: It takes an address as a parameter and returns the balance of discount NFTs held by that address as a `uint256` value.

The `IConsumableDiscountNFT` interface declares three functions:

1.  `balanceOf`: It takes an address as a parameter and returns the balance of consumable discount NFTs held by that address as a `uint256` value.
2.  `consumeOne`: It takes an address as a parameter and consumes one consumable discount NFT held by that address.
3.  `consumeMany`: It takes an address and a quantity as parameters and consumes the specified quantity of consumable discount NFTs held by that address.

```js
    IDiscountNFT public discountNFT;
    IConsumableDiscountNFT public consumableDiscountNFT;

    // Only addresses in this mapping may call useFeeModifiers
    mapping(address => bool) public authorizedConsumers;

    // Discounts as a fraction of 10,000
    uint256 public discountNFTOriginationFeeDiscount;
    uint256 public discountNFTPremiumFeeDiscount;

    // Discounts as a fraction of 10,000
    uint256 public consumableDiscountNFTOriginationFeeDiscount;
    uint256 public consumableDiscountNFTPremiumFeeDiscount;

    // Time based discount scale as a fraction of 10,000
    uint256 public timeBasedFeeDiscountMin;
    uint256 public timeBasedFeeDiscountMax;

    // Amount based discount scale as a fraction of 10,000
    uint256 public amountBasedFeeDiscountMin;
    uint256 public amountBasedFeeDiscountMax;
```

The code snippet declares several state variables:

1.  `discountNFT`: An instance of the `IDiscountNFT` interface representing the discount non-fungible token.
2.  `consumableDiscountNFT`: An instance of the `IConsumableDiscountNFT` interface representing the consumable discount non-fungible token.
3.  `authorizedConsumers`: A mapping that associates addresses with a boolean value indicating whether they are authorized to call the `useFeeModifiers` function.
4.  `discountNFTOriginationFeeDiscount`: A `uint256` variable representing the discount on origination fees provided by the `discountNFT`.
5.  `discountNFTPremiumFeeDiscount`: A `uint256` variable representing the discount on premium fees provided by the `discountNFT`.
6.  `consumableDiscountNFTOriginationFeeDiscount`: A `uint256` variable representing the discount on origination fees provided by the `consumableDiscountNFT`.
7.  `consumableDiscountNFTPremiumFeeDiscount`: A `uint256` variable representing the discount on premium fees provided by the `consumableDiscountNFT`.
8.  `timeBasedFeeDiscountMin`: A `uint256` variable representing the minimum time-based fee discount.
9.  `timeBasedFeeDiscountMax`: A `uint256` variable representing the maximum time-based fee discount.
10. `amountBasedFeeDiscountMin`: A `uint256` variable representing the minimum amount-based fee discount.
11. `amountBasedFeeDiscountMax`: A `uint256` variable representing the maximum amount-based fee discount.

These variables store information related to discounts, fee modifiers, and authorization within the contract.

```js
    event AuthorizedConsumerSet(address indexed consumer, bool isAuthorized);
    event TimeBasedDiscountSet(uint256 oldMin, uint256 oldMax, uint256 min, uint256 max);
    event AmountBasedDiscountSet(uint256 oldMin, uint256 oldMax, uint256 min, uint256 max);
    event DiscountNFTSet(address indexed oldAddress, address indexed newAddress);
    event ConsumableDiscountNFTSet(address indexed oldAddress, address indexed newAddress);
    event DiscountNFTDiscountsSet(uint256 oldOriginationFeeDiscount, uint256 oldPremiumFeeDiscount, uint256 originationFeeDiscount, uint256 premiumFeeDiscount);
    event ConsumableDiscountNFTDiscountsSet(uint256 oldOriginationFeeDiscount, uint256 oldPremiumFeeDiscount, uint256 originationFeeDiscount, uint256 premiumFeeDiscount);
```

The code snippet defines several events:

1.  `AuthorizedConsumerSet`: This event is emitted when an address is set as an authorized consumer. It includes the address of the consumer and a boolean indicating whether they are authorized.
2.  `TimeBasedDiscountSet`: This event is emitted when the time-based fee discount range is set. It includes the old and new minimum and maximum values for the discount.
3.  `AmountBasedDiscountSet`: This event is emitted when the amount-based fee discount range is set. It includes the old and new minimum and maximum values for the discount.
4.  `DiscountNFTSet`: This event is emitted when the discount NFT address is set. It includes the old and new addresses.
5.  `ConsumableDiscountNFTSet`: This event is emitted when the consumable discount NFT address is set. It includes the old and new addresses.
6.  `DiscountNFTDiscountsSet`: This event is emitted when the discounts for the discount NFT are set. It includes the old and new origination fee discounts and premium fee discounts.
7.  `ConsumableDiscountNFTDiscountsSet`: This event is emitted when the discounts for the consumable discount NFT are set. It includes the old and new origination fee discounts and premium fee discounts.

These events provide a way to track and monitor changes to the contract's state, such as authorization status, discount ranges, and discount values.

```js
    constructor(address discountNFT_, address consumableDiscountNFT_) Ownable(msg.sender) {
        discountNFT = IDiscountNFT(discountNFT_);
        consumableDiscountNFT = IConsumableDiscountNFT(consumableDiscountNFT_);
        emit DiscountNFTSet(address(0), discountNFT_);
        emit ConsumableDiscountNFTSet(address(0), consumableDiscountNFT_);
    }
```

The constructor function of the contract `X7LendingDiscountAuthorityV1` takes two addresses as parameters: `discountNFT_` and `consumableDiscountNFT_`. It initializes the `discountNFT` variable with an instance of the `IDiscountNFT` interface using the `discountNFT_` address. Similarly, it initializes the `consumableDiscountNFT` variable with an instance of the `IConsumableDiscountNFT` interface using the `consumableDiscountNFT_` address.

The constructor also emits two events: `DiscountNFTSet` and `ConsumableDiscountNFTSet`. The `DiscountNFTSet` event indicates the setting of the discount NFT address, with the old address being `address(0)` and the new address being `discountNFT_`. Similarly, the `ConsumableDiscountNFTSet` event indicates the setting of the consumable discount NFT address, with the old address being `address(0)` and the new address being `consumableDiscountNFT_`.

Additionally, the constructor inherits from the `Ownable` contract and sets the contract deployer (`msg.sender`) as the owner of the contract.

```js
    modifier onlyAuthorizedConsumers {
        require(authorizedConsumers[msg.sender]);
        _;
    }
```

The code snippet defines a modifier called `onlyAuthorizedConsumers`. Modifiers are used to add a condition that must be met before executing a function.

In this case, the modifier ensures that only addresses that are listed as authorized consumers can proceed with the function execution. It uses the `require` statement to verify that `msg.sender`, the address calling the function, exists in the `authorizedConsumers` mapping with a value of `true`. If the condition is not met, the function execution is halted and an exception is thrown.

The underscore (`_`) is a placeholder that indicates where the body of the function using this modifier will be inserted. It allows the code inside the function to execute only if the modifier's condition is satisfied.

```js
    function setAuthorizedConsumer(address consumer, bool isAuthorized) external onlyOwner {
        require(authorizedConsumers[consumer] != isAuthorized);
        authorizedConsumers[consumer] = isAuthorized;
        emit AuthorizedConsumerSet(consumer, isAuthorized);
    }
```

The `setAuthorizedConsumer` function allows the contract owner to set the authorization status of a consumer. It takes two parameters: `consumer`, which is the address of the consumer, and `isAuthorized`, which is a boolean indicating whether the consumer should be authorized or not.

The function first checks if the current authorization status of the consumer is different from the desired `isAuthorized` value. If they are not different, the function reverts the transaction using the `require` statement.

If the authorization status is different, the function updates the `authorizedConsumers` mapping by setting the authorization status of the `consumer` to the provided `isAuthorized` value.

Finally, the function emits an `AuthorizedConsumerSet` event, indicating the change in authorization status for the `consumer` address.

```js
    function setTimeBasedDiscount(uint256 min, uint256 max) external onlyOwner {
        require(min != timeBasedFeeDiscountMin || max != timeBasedFeeDiscountMax);
        uint256 oldMin = timeBasedFeeDiscountMin;
        uint256 oldMax = timeBasedFeeDiscountMax;
        timeBasedFeeDiscountMin = min;
        timeBasedFeeDiscountMax = max;
        emit TimeBasedDiscountSet(oldMin, oldMax, min, max);
    }
```

The `setTimeBasedDiscount` function is used by the contract owner to set the time-based fee discount range. It takes two parameters: `min` and `max`, which represent the minimum and maximum values for the discount range, respectively.

The function first checks if the provided `min` value is different from the current `timeBasedFeeDiscountMin` value or if the provided `max` value is different from the current `timeBasedFeeDiscountMax` value. If they are not different, the function reverts the transaction using the `require` statement.

If the values are different, the function proceeds to update the `timeBasedFeeDiscountMin` and `timeBasedFeeDiscountMax` variables with the new values.

Lastly, the function emits a `TimeBasedDiscountSet` event, providing the previous (`oldMin` and `oldMax`) and new (`min` and `max`) values of the time-based fee discount range.

```js
   function setAmountBasedDiscount(uint256 min, uint256 max) external onlyOwner {
        require(min != amountBasedFeeDiscountMin || max != amountBasedFeeDiscountMax);
        uint256 oldMin = amountBasedFeeDiscountMin;
        uint256 oldMax = amountBasedFeeDiscountMax;
        amountBasedFeeDiscountMin = min;
        amountBasedFeeDiscountMax = max;
        emit AmountBasedDiscountSet(oldMin, oldMax, min, max);
    }
```

The `setAmountBasedDiscount` function is used by the contract owner to set the amount-based fee discount range. It takes two parameters: `min` and `max`, representing the minimum and maximum values for the discount range, respectively.

The function first checks if the provided `min` value is different from the current `amountBasedFeeDiscountMin` value or if the provided `max` value is different from the current `amountBasedFeeDiscountMax` value. If they are not different, the function reverts the transaction using the `require` statement.

If the values are different, the function updates the `amountBasedFeeDiscountMin` and `amountBasedFeeDiscountMax` variables with the new values.

Finally, the function emits an `AmountBasedDiscountSet` event, providing the previous (`oldMin` and `oldMax`) and new (`min` and `max`) values of the amount-based fee discount range.

```js
    function setDiscountNFT(address discountNFTAddress) external onlyOwner {
        require(discountNFTAddress != address(discountNFT));
        address oldDiscountNFTAddress = address(discountNFT);
        discountNFT = IDiscountNFT(discountNFTAddress);
        emit DiscountNFTSet(oldDiscountNFTAddress, discountNFTAddress);
    }
```

The `setDiscountNFT` function is used by the contract owner to set the address of the discount NFT (Non-Fungible Token). It takes one parameter, `discountNFTAddress`, representing the new address of the discount NFT.

First, the function checks if the provided `discountNFTAddress` is different from the current address stored in the `discountNFT` variable using the `require` statement. If they are the same, the function reverts the transaction.

If the addresses are different, the function saves the current address of the discount NFT in the `oldDiscountNFTAddress` variable, and then updates the `discountNFT` variable with the new address.

Finally, the function emits a `DiscountNFTSet` event, providing the previous (`oldDiscountNFTAddress`) and new (`discountNFTAddress`) addresses of the discount NFT.

```js
    function setConsumableDiscountNFT(address consumableDiscountNFTAddress) external onlyOwner {
        require(consumableDiscountNFTAddress != address(consumableDiscountNFT));
        address oldConsumableDiscountNFTAddress = address(consumableDiscountNFT);
        consumableDiscountNFT = IConsumableDiscountNFT(consumableDiscountNFTAddress);
        emit ConsumableDiscountNFTSet(oldConsumableDiscountNFTAddress, consumableDiscountNFTAddress);
    }
```

The `setConsumableDiscountNFT` function is used by the contract owner to set the address of the consumable discount NFT (Non-Fungible Token). It takes one parameter, `consumableDiscountNFTAddress`, representing the new address of the consumable discount NFT.

First, the function checks if the provided `consumableDiscountNFTAddress` is different from the current address stored in the `consumableDiscountNFT` variable using the `require` statement. If they are the same, the function reverts the transaction.

If the addresses are different, the function saves the current address of the consumable discount NFT in the `oldConsumableDiscountNFTAddress` variable, and then updates the `consumableDiscountNFT` variable with the new address.

Finally, the function emits a `ConsumableDiscountNFTSet` event, providing the previous (`oldConsumableDiscountNFTAddress`) and new (`consumableDiscountNFTAddress`) addresses of the consumable discount NFT.

```js
    function setDiscountNFTDiscounts(uint256 premiumFeeDiscount, uint256 originationFeeDiscount) external onlyOwner {
        require(premiumFeeDiscount != discountNFTPremiumFeeDiscount || originationFeeDiscount != discountNFTOriginationFeeDiscount);
        require(premiumFeeDiscount <= 10000);
        require(originationFeeDiscount <= 10000);
        uint256 oldPremiumFeeDiscount = discountNFTPremiumFeeDiscount;
        uint256 oldOriginationFeeDiscount = discountNFTOriginationFeeDiscount;
        discountNFTPremiumFeeDiscount = premiumFeeDiscount;
        discountNFTOriginationFeeDiscount = originationFeeDiscount;

        emit DiscountNFTDiscountsSet(oldOriginationFeeDiscount, oldPremiumFeeDiscount, originationFeeDiscount, premiumFeeDiscount);
    }
```

The `setDiscountNFTDiscounts` function is used by the contract owner to set the discounts associated with the discount NFT. It takes two parameters: `premiumFeeDiscount` and `originationFeeDiscount`, representing the new discounts for premium fees and origination fees, respectively.

First, the function checks if the provided `premiumFeeDiscount` and `originationFeeDiscount` are different from the current values stored in `discountNFTPremiumFeeDiscount` and `discountNFTOriginationFeeDiscount` variables using the `require` statement. If any of the values are the same, the function reverts the transaction.

Next, the function checks if the provided discounts are within the valid range of 0 to 10000 (inclusive) using the `require` statement. If any of the discounts are greater than 10000, the function reverts the transaction.

If the checks pass, the function saves the current values of `discountNFTPremiumFeeDiscount` and `discountNFTOriginationFeeDiscount` in the `oldPremiumFeeDiscount` and `oldOriginationFeeDiscount` variables, respectively. Then, it updates the `discountNFTPremiumFeeDiscount` and `discountNFTOriginationFeeDiscount` variables with the new values provided.

Finally, the function emits a `DiscountNFTDiscountsSet` event, providing the previous (`oldOriginationFeeDiscount` and `oldPremiumFeeDiscount`) and new (`originationFeeDiscount` and `premiumFeeDiscount`) values of the discounts.

```js
    function setConsumableDiscountNFTDiscounts(uint256 premiumFeeDiscount, uint256 originationFeeDiscount) external onlyOwner {
        require(premiumFeeDiscount != consumableDiscountNFTPremiumFeeDiscount || originationFeeDiscount != consumableDiscountNFTOriginationFeeDiscount);
        require(premiumFeeDiscount <= 10000);
        require(originationFeeDiscount <= 10000);
        uint256 oldPremiumFeeDiscount = consumableDiscountNFTPremiumFeeDiscount;
        uint256 oldOriginationFeeDiscount = consumableDiscountNFTOriginationFeeDiscount;
        consumableDiscountNFTPremiumFeeDiscount = premiumFeeDiscount;
        consumableDiscountNFTOriginationFeeDiscount = originationFeeDiscount;

        emit ConsumableDiscountNFTDiscountsSet(oldOriginationFeeDiscount, oldPremiumFeeDiscount, originationFeeDiscount, premiumFeeDiscount);
    }
```

The `setConsumableDiscountNFTDiscounts` function is similar to the `setDiscountNFTDiscounts` function, but it is used to set the discounts associated with the consumable discount NFT.

The function takes two parameters: `premiumFeeDiscount` and `originationFeeDiscount`, representing the new discounts for premium fees and origination fees, respectively.

First, the function checks if the provided `premiumFeeDiscount` and `originationFeeDiscount` are different from the current values stored in `consumableDiscountNFTPremiumFeeDiscount` and `consumableDiscountNFTOriginationFeeDiscount` variables using the `require` statement. If any of the values are the same, the function reverts the transaction.

Next, the function checks if the provided discounts are within the valid range of 0 to 10000 (inclusive) using the `require` statement. If any of the discounts are greater than 10000, the function reverts the transaction.

If the checks pass, the function saves the current values of `consumableDiscountNFTPremiumFeeDiscount` and `consumableDiscountNFTOriginationFeeDiscount` in the `oldPremiumFeeDiscount` and `oldOriginationFeeDiscount` variables, respectively. Then, it updates the `consumableDiscountNFTPremiumFeeDiscount` and `consumableDiscountNFTOriginationFeeDiscount` variables with the new values provided.

Finally, the function emits a `ConsumableDiscountNFTDiscountsSet` event, providing the previous (`oldOriginationFeeDiscount` and `oldPremiumFeeDiscount`) and new (`originationFeeDiscount` and `premiumFeeDiscount`) values of the discounts.

```js
    function getFeeModifiers(
        address borrower,
        uint256[3] memory loanAmountDetails,
        uint256[3] memory loanDurationDetails
    ) external view returns (uint256, uint256) {
        (uint256 premiumFeeModifier, uint256 originationFeeModifier,) = _getFeeModifiers(
            borrower,
            loanAmountDetails,
            loanDurationDetails
        );

        return (premiumFeeModifier, originationFeeModifier);
    }
```

The `getFeeModifiers` function is a view function that allows querying the fee modifiers for a given borrower and loan details. It takes the following parameters:

- `borrower`: The address of the borrower.
- `loanAmountDetails`: An array of three uint256 values representing the loan amount details.
- `loanDurationDetails`: An array of three uint256 values representing the loan duration details.

The function calls the internal `_getFeeModifiers` function, passing the borrower, loan amount details, and loan duration details. The `_getFeeModifiers` function is not shown in the provided code snippet, but it is likely implemented within the contract.

The return values of `_getFeeModifiers` are stored in the `premiumFeeModifier` and `originationFeeModifier` variables. Finally, the function returns these values as a tuple `(premiumFeeModifier, originationFeeModifier)`.

```js
    function useFeeModifiers(
        address borrower,
        uint256[3] memory loanAmountDetails,
        uint256[3] memory loanDurationDetails
    ) external onlyAuthorizedConsumers returns (uint256, uint256) {
        (uint256 premiumFeeModifier, uint256 originationFeeModifier, bool usedConsumable) = _getFeeModifiers(
            borrower,
            loanAmountDetails,
            loanDurationDetails
        );

        if (usedConsumable) {
            consumableDiscountNFT.consumeOne(borrower);
        }

        return (premiumFeeModifier, originationFeeModifier);
    }
```

The `useFeeModifiers` function is a public function that allows authorized consumers to apply fee modifiers for a given borrower and loan details. It takes the following parameters:

- `borrower`: The address of the borrower.
- `loanAmountDetails`: An array of three uint256 values representing the loan amount details.
- `loanDurationDetails`: An array of three uint256 values representing the loan duration details.

The function calls the internal `_getFeeModifiers` function, passing the borrower, loan amount details, and loan duration details. The `_getFeeModifiers` function is not shown in the provided code snippet, but it is likely implemented within the contract.

The return values of `_getFeeModifiers` are stored in the `premiumFeeModifier`, `originationFeeModifier`, and `usedConsumable` variables. The `usedConsumable` variable indicates whether a consumable discount NFT was used.

If a consumable discount NFT was used (`usedConsumable` is true), the function calls the `consumeOne` function of the `consumableDiscountNFT` contract, passing the borrower's address to consume one discount NFT.

Finally, the function returns the fee modifiers as a tuple `(premiumFeeModifier, originationFeeModifier)`.

```js
    function _getFeeModifiers(
        address borrower,
        uint256[3] memory loanAmountDetails,
        uint256[3] memory loanDurationDetails
    ) internal view returns (uint256 premiumFeeModifier, uint256 originationFeeModifier, bool usedConsumable) {
        uint256 premiumDiscount;
        uint256 originationDiscount;

        if (discountNFT.balanceOf(borrower) > 0) {
            premiumDiscount = discountNFTPremiumFeeDiscount;
            originationDiscount = discountNFTOriginationFeeDiscount;
        }

        if (consumableDiscountNFT.balanceOf(borrower) > 0) {
            premiumDiscount += consumableDiscountNFTPremiumFeeDiscount;
            originationDiscount += consumableDiscountNFTOriginationFeeDiscount;
            usedConsumable = true;
        } else {
            usedConsumable = false;
        }

        uint256 amountBasedDiscount = amountBasedFeeDiscountMin + (
            (amountBasedFeeDiscountMax - amountBasedFeeDiscountMin)
            * (loanAmountDetails[1] - loanAmountDetails[0])
            / (loanAmountDetails[2] - loanAmountDetails[0])
        );

        uint256 timeBasedDiscount = timeBasedFeeDiscountMax - (
            (timeBasedFeeDiscountMax - timeBasedFeeDiscountMin)
            * (loanDurationDetails[1] - loanDurationDetails[0])
            / (loanDurationDetails[2] - loanDurationDetails[0])
        );

        premiumDiscount += (amountBasedDiscount + timeBasedDiscount);
        originationDiscount += (amountBasedDiscount + timeBasedDiscount);

        if (premiumDiscount > 10000) {
            premiumFeeModifier = 0;
        } else {
            premiumFeeModifier = 10000 - premiumDiscount;
        }

        if (originationDiscount > 10000) {
            originationFeeModifier = 0;
        } else {
            originationFeeModifier = 10000 - originationDiscount;
        }
    }
```

The `_getFeeModifiers` function is an internal view function that calculates the fee modifiers for a given borrower and loan details. It takes the following parameters:

- `borrower`: The address of the borrower.
- `loanAmountDetails`: An array of three uint256 values representing the loan amount details.
- `loanDurationDetails`: An array of three uint256 values representing the loan duration details.

The function initializes `premiumDiscount` and `originationDiscount` variables to store the accumulated discount based on the ownership of discount NFTs.

If the borrower has discount NFTs (`discountNFT.balanceOf(borrower) > 0`), the function sets `premiumDiscount` and `originationDiscount` to the corresponding discount values (`discountNFTPremiumFeeDiscount` and `discountNFTOriginationFeeDiscount`).

If the borrower has consumable discount NFTs (`consumableDiscountNFT.balanceOf(borrower) > 0`), the function adds the consumable discount NFT discounts (`consumableDiscountNFTPremiumFeeDiscount` and `consumableDiscountNFTOriginationFeeDiscount`) to `premiumDiscount` and `originationDiscount`. It also sets `usedConsumable` to `true` to indicate that a consumable discount NFT was used.

Next, the function calculates the amount-based discount and time-based discount based on the loan amount and loan duration details provided. The amount-based discount is calculated using a linear interpolation formula based on the `amountBasedFeeDiscountMin` and `amountBasedFeeDiscountMax` values. The time-based discount is calculated using a linear interpolation formula based on the `timeBasedFeeDiscountMin` and `timeBasedFeeDiscountMax` values.

The `amountBasedDiscount` and `timeBasedDiscount` are then added to `premiumDiscount` and `originationDiscount`.

Finally, the function calculates the fee modifiers by subtracting the discount values from 10000. If the resulting discount exceeds 10000, the fee modifier is set to 0.

The function returns the fee modifiers as a tuple `(premiumFeeModifier, originationFeeModifier)`.

Note: The return value `usedConsumable` indicates whether a consumable discount NFT was used and is not utilized within the function itself.
