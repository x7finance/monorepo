---
title: X7DAO Token Contract
tags: [breakdowns]
---

The `X7DAO` contract is an ERC20 token contract with functionalities for setting a liquidity hub and discount authority, as well as managing fees and transfers. It allows the owner to configure AMM pairs and an off-ramp pair. The contract includes features such as freezing the liquidity hub and discount authority, calculating the circulating supply, enabling trading, and handling token transfers with fee calculations. Additionally, there are functions for rescuing ETH and other tokens held by the contract.

```js
interface ILiquidityHub {
    function processFees(address) external;
}

interface IDiscountAuthority {
    function discountRatio(address) external view returns (uint256, uint256);
}
```

The `ILiquidityHub` interface declares a function `processFees` that takes an `address` parameter and has an external visibility. It is likely used to process fees within the liquidity hub.

The `IDiscountAuthority` interface declares a function `discountRatio` that takes an `address` parameter and returns two `uint256` values. The function has a view visibility, indicating that it does not modify the state of the contract. It is likely used to retrieve discount ratios associated with specific addresses from the discount authority.

```js
    IDiscountAuthority public discountAuthority;
    ILiquidityHub public liquidityHub;

    mapping(address => bool) public ammPair;
    address public offRampPair;

    // max 7% fee
    uint256 public maxFeeNumerator = 700;

    // 6 % fee
    uint256 public feeNumerator = 600;
    uint256 public feeDenominator = 10000;

    bool discountAuthorityFrozen;
    bool liquidityHubFrozen;

    bool transfersEnabled;
```

Defines several state variables for the `X7DAO` contract:

1.  `discountAuthority`: A public state variable of type `IDiscountAuthority` that represents the discount authority contract.
2.  `liquidityHub`: A public state variable of type `ILiquidityHub` that represents the liquidity hub contract.
3.  `ammPair`: A mapping that associates addresses with booleans, indicating whether an address is an AMM (Automated Market Maker) pair or not.
4.  `offRampPair`: An address variable that represents the off-ramp pair.
5.  `maxFeeNumerator`: A uint256 variable that sets the maximum fee numerator to 700, which corresponds to a maximum fee of 7%.
6.  `feeNumerator`: A uint256 variable that sets the fee numerator to 600, which corresponds to a fee of 6%.
7.  `feeDenominator`: A uint256 variable that sets the fee denominator to 10000.
8.  `discountAuthorityFrozen`: A boolean variable indicating whether the discount authority is frozen or not.
9.  `liquidityHubFrozen`: A boolean variable indicating whether the liquidity hub is frozen or not.
10. `transfersEnabled`: A boolean variable indicating whether transfers are enabled or not.

```js
    event LiquidityHubSet(address indexed liquidityHub);
    event DiscountAuthoritySet(address indexed discountAuthority);
    event FeeNumeratorSet(uint256 feeNumerator);
    event AMMSet(address indexed pairAddress, bool isAMM);
    event OffRampPairSet(address indexed offRampPair);
    event LiquidityHubFrozen();
    event DiscountAuthorityFrozen();
```

The events that are emitted in the `X7DAO` contract:

1.  `LiquidityHubSet`: An event that is emitted when the liquidity hub address is set. It includes the address of the liquidity hub as an indexed parameter.
2.  `DiscountAuthoritySet`: An event that is emitted when the discount authority address is set. It includes the address of the discount authority as an indexed parameter.
3.  `FeeNumeratorSet`: An event that is emitted when the fee numerator is set. It includes the new fee numerator as a parameter.
4.  `AMMSet`: An event that is emitted when an address is set as an AMM pair or not. It includes the pair address and a boolean indicating whether it is an AMM or not.
5.  `OffRampPairSet`: An event that is emitted when the off-ramp pair address is set. It includes the off-ramp pair address as an indexed parameter.
6.  `LiquidityHubFrozen`: An event that is emitted when the liquidity hub is frozen. It indicates that further changes to the liquidity hub are not allowed.
7.  `DiscountAuthorityFrozen`: An event that is emitted when the discount authority is frozen. It indicates that further changes to the discount authority are not allowed.

These events can be used to track and monitor the changes and actions happening within the contract.

```js
    constructor(
        address discountAuthority_,
        address liquidityHub_
    ) ERC20("X7DAO", "X7DAO") Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {
        discountAuthority = IDiscountAuthority(discountAuthority_);
        liquidityHub = ILiquidityHub(liquidityHub_);

        _mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 100000000 * 10**18);
    }
```

The constructor function of the `X7DAO` contract is defined as follows:

1.  It takes two address parameters: `discountAuthority_` and `liquidityHub_`.
2.  The contract inherits from `ERC20`, `Ownable`, and specifies the token name as "X7DAO" and symbol as "X7DAO" using the `ERC20` constructor.
3.  The `Ownable` constructor is invoked with the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105`, setting it as the owner of the contract.
4.  The `discountAuthority` state variable is assigned the value of `discountAuthority_` cast to the `IDiscountAuthority` interface.
5.  The `liquidityHub` state variable is assigned the value of `liquidityHub_` cast to the `ILiquidityHub` interface.
6.  The contract mints 100,000,000 tokens to the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105` using the `_mint` function, with the amount calculated as 100,000,000 multiplied by 10^18 (18 decimal places).

```js
    function setLiquidityHub(address liquidityHub_) external onlyOwner {
        require(!liquidityHubFrozen);
        liquidityHub = ILiquidityHub(liquidityHub_);
        emit LiquidityHubSet(liquidityHub_);
    }
```

The `setLiquidityHub` function is a public function that allows the owner of the contract to set the address of the liquidity hub.

1.  The function takes an `address` parameter called `liquidityHub_`, representing the new address of the liquidity hub.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  It first checks whether the liquidity hub is frozen by requiring that the `liquidityHubFrozen` boolean variable is `false`. If the liquidity hub is frozen, the function will revert.
4.  If the liquidity hub is not frozen, the `liquidityHub` state variable is updated with the new address by casting `liquidityHub_` to the `ILiquidityHub` interface.
5.  The `LiquidityHubSet` event is emitted, indicating that the liquidity hub address has been successfully set. The `liquidityHub` address is passed as an indexed parameter in the event.
6.  The function execution completes.

```js
    function setDiscountAuthority(address discountAuthority_) external onlyOwner {
        require(!discountAuthorityFrozen);
        discountAuthority = IDiscountAuthority(discountAuthority_);
        emit DiscountAuthoritySet(discountAuthority_);
    }
```

The `setDiscountAuthority` function is a public function that allows the owner of the contract to set the address of the discount authority. Here's how it works:

1.  The function takes an `address` parameter called `discountAuthority_`, representing the new address of the discount authority.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  It first checks whether the discount authority is frozen by requiring that the `discountAuthorityFrozen` boolean variable is `false`. If the discount authority is frozen, the function will revert.
4.  If the discount authority is not frozen, the `discountAuthority` state variable is updated with the new address by casting `discountAuthority_` to the `IDiscountAuthority` interface.
5.  The `DiscountAuthoritySet` event is emitted, indicating that the discount authority address has been successfully set. The `discountAuthority` address is passed as an indexed parameter in the event.
6.  The function execution completes.

```js
    function setFeeNumerator(uint256 feeNumerator_) external onlyOwner {
        require(feeNumerator_ <= maxFeeNumerator);
        feeNumerator = feeNumerator_;
        emit FeeNumeratorSet(feeNumerator_);
    }
```

The `setFeeNumerator` function is a public function that allows the owner of the contract to set the fee numerator.

1.  The function takes a `uint256` parameter called `feeNumerator_`, representing the new value for the fee numerator.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  It checks whether the provided `feeNumerator_` value is less than or equal to the `maxFeeNumerator` value. If it exceeds the maximum fee numerator, the function will revert.
4.  If the `feeNumerator_` value is within the allowed range, the `feeNumerator` state variable is updated with the new value.
5.  The `FeeNumeratorSet` event is emitted, indicating that the fee numerator has been successfully set. The `feeNumerator` value is passed as a parameter in the event.
6.  The function execution completes.

```js
    function setAMM(address ammAddress, bool isAMM) external onlyOwner {
        ammPair[ammAddress] = isAMM;
        emit AMMSet(ammAddress, isAMM);
    }
```

The `setAMM` function is a public function that allows the owner of the contract to set an address as an AMM (Automated Market Maker) pair or not.

1.  The function takes two parameters: `ammAddress`, which represents the address to be set as an AMM pair, and `isAMM`, which is a boolean indicating whether the address should be set as an AMM pair or not.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  The function updates the `ammPair` mapping by assigning the value of `isAMM` to the `ammAddress` key. This associates the address with the boolean value indicating its AMM status.
4.  The `AMMSet` event is emitted, indicating that the AMM status of an address has been set. The `ammAddress` and `isAMM` values are passed as parameters in the event.
5.  The function execution completes.

```js
    function setOffRampPair(address ammAddress) external onlyOwner {
        offRampPair = ammAddress;
        emit OffRampPairSet(ammAddress);
    }
```

The `setOffRampPair` function is a public function that allows the owner of the contract to set an address as the off-ramp pair.

1.  The function takes an `address` parameter called `ammAddress`, which represents the address to be set as the off-ramp pair.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  The function updates the `offRampPair` state variable by assigning the value of `ammAddress`.
4.  The `OffRampPairSet` event is emitted, indicating that the off-ramp pair address has been successfully set. The `ammAddress` value is passed as an indexed parameter in the event.
5.  The function execution completes.

```js
    function freezeLiquidityHub() external onlyOwner {
        require(!liquidityHubFrozen);
        liquidityHubFrozen = true;
        emit LiquidityHubFrozen();
    }
```

The `freezeLiquidityHub` function is a public function that allows the owner of the contract to freeze the liquidity hub.

1.  The function does not take any parameters.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  It checks whether the liquidity hub is not already frozen by requiring that the `liquidityHubFrozen` boolean variable is `false`. If the liquidity hub is already frozen, the function will revert.
4.  If the liquidity hub is not already frozen, the `liquidityHubFrozen` state variable is set to `true`, indicating that the liquidity hub is now frozen.
5.  The `LiquidityHubFrozen` event is emitted, indicating that the liquidity hub has been successfully frozen.
6.  The function execution completes.

```js
    function freezeDiscountAuthority() external onlyOwner {
        require(!discountAuthorityFrozen);
        discountAuthorityFrozen = true;
        emit DiscountAuthorityFrozen();
    }
```

The `freezeDiscountAuthority` function is a public function that allows the owner of the contract to freeze the discount authority.

1.  The function does not take any parameters.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  It checks whether the discount authority is not already frozen by requiring that the `discountAuthorityFrozen` boolean variable is `false`. If the discount authority is already frozen, the function will revert.
4.  If the discount authority is not already frozen, the `discountAuthorityFrozen` state variable is set to `true`, indicating that the discount authority is now frozen.
5.  The `DiscountAuthorityFrozen` event is emitted, indicating that the discount authority has been successfully frozen.
6.  The function execution completes.

```js
   function circulatingSupply() external view returns (uint256) {
        return totalSupply() - balanceOf(address(0)) - balanceOf(address(0x000000000000000000000000000000000000dEaD));
    }
```

The `circulatingSupply` function is a public view function that returns the circulating supply of the token. Here's how it works:

The function does not take any parameters.

It calculates the circulating supply by subtracting the balances of two specific addresses from the total supply of the token.

`balanceOf(address(0))` retrieves the balance of the zero address, which typically represents tokens that are burned or permanently removed from circulation.

`balanceOf(address(0x000000000000000000000000000000000000dEaD))` retrieves the balance of a specific address (`0x000000000000000000000000000000000000dEaD`), which may also represent tokens that are burned or permanently removed from circulation.

The calculated value represents the circulating supply, which is the total supply minus the tokens held by the zero address and the specified address.

The function returns the circulating supply as a `uint256` value.

The function execution completes.

```js
    function enableTrading() external onlyOwner {
        require(!transfersEnabled);
        transfersEnabled = true;
    }
```

The `enableTrading` function is a public function that allows the owner of the contract to enable token transfers.

1.  The function does not take any parameters.
2.  The `onlyOwner` modifier ensures that only the owner of the contract can invoke this function.
3.  It checks whether transfers are not already enabled by requiring that the `transfersEnabled` boolean variable is `false`. If transfers are already enabled, the function will revert.
4.  If transfers are not already enabled, the `transfersEnabled` state variable is set to `true`, indicating that token transfers are now enabled.
5.  The function execution completes.

```js
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(transfersEnabled || from == owner());

        uint256 transferAmount = amount;

        if (
            from == address(liquidityHub)
            || to == address(liquidityHub)
        ) {
            super._transfer(from, to, amount);
            return;
        }

        if (
            ammPair[to] || ammPair[from]
        ) {
            address effectivePrincipal;
            if (ammPair[to]) {
                effectivePrincipal = from;
            } else {
                effectivePrincipal = to;
            }

            (uint256 feeModifierNumerator, uint256 feeModifierDenominator) = discountAuthority.discountRatio(effectivePrincipal);
            if (feeModifierNumerator > feeModifierDenominator || feeModifierDenominator == 0) {
                feeModifierNumerator = 1;
                feeModifierDenominator = 1;
            }

            uint256 feeAmount = amount * feeNumerator * feeModifierNumerator / feeDenominator / feeModifierDenominator;

            super._transfer(from, address(liquidityHub), feeAmount);
            transferAmount = amount - feeAmount;
        }

        if (
            to == offRampPair
        ) {
            liquidityHub.processFees(address(this));
        }

        super._transfer(from, to, transferAmount);
    }
```

The `_transfer` function is an internal function that handles the transfer of tokens from one address to another. It overrides the `_transfer` function from the inherited ERC20 contract. Here's how it works:

1.  The function takes three parameters: `from` (the address from which the tokens are transferred), `to` (the address to which the tokens are transferred), and `amount` (the number of tokens to be transferred).
2.  The function first checks if transfers are enabled (`transfersEnabled`) or if the transfer is initiated by the contract owner (`from == owner()`). If transfers are not enabled and the sender is not the owner, the function will revert.
3.  The `transferAmount` variable is initialized with the value of `amount`, representing the amount to be transferred.
4.  If the `from` or `to` address is the address of the liquidity hub, the tokens are transferred directly to or from the liquidity hub by calling the `_transfer` function of the ERC20 contract (inherited from `super`) with the given parameters. The function execution then returns.
5.  If either the `to` or `from` address corresponds to an AMM pair (as specified in the `ammPair` mapping), a fee is calculated and deducted from the transfer amount.

- The `effectivePrincipal` address is determined based on whether the `to` address corresponds to an AMM pair. If it does, the `effectivePrincipal` is set to `from`, otherwise, it is set to `to`.
- The `discountAuthority.discountRatio` function is called with `effectivePrincipal` as the argument to retrieve the fee modifier numerator and denominator.
- If the fee modifier numerator is greater than the denominator or the denominator is 0, the fee modifier values are set to 1 to avoid invalid calculations.
- The `feeAmount` is calculated by multiplying the transfer amount (`amount`) by the fee numerator (`feeNumerator`), the fee modifier numerator, and dividing it by the fee denominator (`feeDenominator`) and the fee modifier denominator.
- The calculated fee amount is transferred from `from` to the liquidity hub by calling the `_transfer` function of the ERC20 contract (inherited from `super`) with the appropriate parameters.
- The `transferAmount` is updated to be the remaining amount after deducting the fee.

If the `to` address corresponds to the `offRampPair`, the `processFees` function of the liquidity hub is called, passing the contract's address (`address(this)`) to process any accumulated fees.

Finally, the remaining transfer amount (`transferAmount`) is transferred from `from` to `to` by calling the `_transfer` function of the ERC20 contract (inherited from `super`) with the given parameters. The function execution completes.

```js
    function rescueETH() external {
        (bool success,) = payable(address(liquidityHub)).call{value: address(this).balance}("");
        require(success);
    }
```

The `rescueETH` function is a public function that allows the contract owner to withdraw any Ether (ETH) balance held by the contract and transfer it to the liquidity hub address.

1.  The function does not take any parameters.
2.  It attempts to transfer the entire Ether balance of the contract (`address(this).balance`) to the liquidity hub address (`address(liquidityHub)`) using the `call` function with the `value` parameter set to the contract's Ether balance. This transfer is made as a raw call to the `liquidityHub` address, allowing it to receive the Ether.
3.  The result of the transfer is stored in the boolean variable `success`. The second value returned by the `call` function is ignored.
4.  The `require(success)` statement is used to verify that the Ether transfer was successful. If the transfer fails, the function will revert, indicating that the rescue attempt was unsuccessful.
5.  If the transfer is successful, the function execution completes. Any transferred Ether will now be held by the liquidity hub address.

```js
    function rescueTokens(address tokenAddress) external {
        IERC20(tokenAddress).transfer(address(liquidityHub), IERC20(tokenAddress).balanceOf(address(this)));
    }
```

The `rescueTokens` function is a public function that allows the contract owner to rescue any ERC20 tokens held by the contract and transfer them to the liquidity hub address.

1.  The function takes one parameter, `tokenAddress`, which specifies the address of the ERC20 token to be rescued.
2.  The function uses the `IERC20` interface to interact with the ERC20 token contract at the given `tokenAddress`.
3.  It calls the `transfer` function of the ERC20 token contract to transfer the entire token balance held by the contract (`IERC20(tokenAddress).balanceOf(address(this))`) to the liquidity hub address (`address(liquidityHub)`).
4.  This transfer effectively moves the tokens from the contract to the liquidity hub, allowing the liquidity hub to manage them.
5.  The function execution completes. The ERC20 tokens are now held by the liquidity hub address.
