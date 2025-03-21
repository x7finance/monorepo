---
title: X7100 Constellation Tokens
tags: [breakdowns]
---

Contract explanation of the X7101 - X7105 Constellation tokens

```js
interface ILiquidityHub {
    function processFees(address) external;
}

interface IDiscountAuthority {
    function discountRatio(address) external view returns (uint256, uint256);
}
```

The provided code represents two interfaces: `ILiquidityHub` and `IDiscountAuthority`. Let's examine each interface in detail:

1.  `ILiquidityHub` Interface:

- `processFees(address) external`: A function that takes an `address` parameter and is used to process fees. It doesn't return any value.

1.  `IDiscountAuthority` Interface:

- `discountRatio(address) external view returns (uint256, uint256)`: A function that takes an `address` parameter and returns a tuple of two `uint256` values. It is used to retrieve the discount ratio for a specific address. The first `uint256` represents the numerator, and the second `uint256` represents the denominator of the discount ratio.

Both interfaces define external functions that are meant to be implemented by other contracts. The `ILiquidityHub` the interface provides a way to process fees, while the `IDiscountAuthority` the interface provides a way to retrieve discount ratios for specific addresses.

```js
 IDiscountAuthority public discountAuthority;
    ILiquidityHub public liquidityHub;

    mapping(address => bool) public ammPair;
    address public offRampPair;

    // max 6% fee
    uint256 public maxFeeNumerator = 600;

    // 2 % fee
    uint256 public feeNumerator = 200;
    uint256 public feeDenominator = 10000;

    bool discountAuthorityFrozen;
    bool liquidityHubFrozen;

    bool transfersEnabled;
```

These are the additional state variables present in the contract:

1.  `IDiscountAuthority public discountAuthority`: A public variable of type `IDiscountAuthority` representing the discount authority contract. This variable holds the address of the discount authority contract.
2.  `ILiquidityHub public liquidityHub`: A public variable of type `ILiquidityHub` representing the liquidity hub contract. This variable holds the address of the liquidity hub contract.
3.  `mapping(address => bool) public ammPair`: A mapping that associates a boolean value with each address. It is used to determine whether an address is an automated market maker (AMM) pair or not.
4.  `address public offRampPair`: An address variable representing the off-ramp pair. It is used to specify an address that serves as the off-ramp for the token.
5.  `uint256 public maxFeeNumerator`: A uint256 variable representing the maximum fee numerator. It is set to 600, indicating a maximum fee of 6%.
6.  `uint256 public feeNumerator`: A uint256 variable representing the fee numerator. It is set to 200, indicating a fee of 2%.
7.  `uint256 public feeDenominator`: A uint256 variable representing the fee denominator. It is set to 10000, providing the precision for the fee calculation.
8.  `bool discountAuthorityFrozen`: A boolean variable indicating whether the discount authority is frozen or not.
9.  `bool liquidityHubFrozen`: A boolean variable indicating whether the liquidity hub is frozen or not.
10. `bool transfersEnabled`: A boolean variable indicating whether transfers are enabled or not. It is used to control whether token transfers are allowed.

```js
    event LiquidityHubSet(address indexed liquidityHub);
    event DiscountAuthoritySet(address indexed discountAuthority);
    event FeeNumeratorSet(uint256 feeNumerator);
    event AMMSet(address indexed pairAddress, bool isAMM);
    event OffRampPairSet(address indexed offRampPair);
    event LiquidityHubFrozen();
    event DiscountAuthorityFrozen();
```

The contract emits These events in various situations to provide information and notify external observers. Here's a description of each event:

1.  `event LiquidityHubSet(address indexed liquidityHub)`: This event is emitted when the liquidity hub address is set. It includes the address of the liquidity hub as an indexed parameter.
2.  `event DiscountAuthoritySet(address indexed discountAuthority)`: This event is emitted when the discount authority address is set. It includes the address of the discount authority as an indexed parameter.
3.  `event FeeNumeratorSet(uint256 feeNumerator)`: This event is emitted when the fee numerator is set. It includes the updated fee numerator as a parameter.
4.  `event AMMSet(address indexed pairAddress, bool isAMM)`: This event is emitted when an AMM pair address is set. It includes the address of the AMM pair as an indexed parameter and a boolean indicating whether it is an AMM or not.
5.  `event OffRampPairSet(address indexed offRampPair)`: This event is emitted when the off-ramp pair address is set. It includes the address of the off-ramp pair as an indexed parameter.
6.  `event LiquidityHubFrozen()`: This event is emitted when the liquidity hub is frozen. It indicates that the liquidity hub functionality has been frozen.
7.  `event DiscountAuthorityFrozen()`: This event is emitted when the discount authority is frozen. It indicates that the discount authority functionality has been frozen.

These events provide a way for external entities to listen for changes and updates related to the liquidity hub, discount authority, fee settings, AMM pairs, and freezing of functionalities in the contract.

```js
    constructor(
        address discountAuthority_,
        address liquidityHub_
    ) ERC20("X7101", "X7101") Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {
        discountAuthority = IDiscountAuthority(discountAuthority_);
        liquidityHub = ILiquidityHub(liquidityHub_);

        _mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 100000000 * 10**18);
    }
```

The constructor initializes the contract with the given addresses of the discount authority and liquidity hub.

Here's a breakdown of the constructor:

1.  `ERC20("X7101", "X7101")`: It initializes the ERC20 token with the name "X7101" and the symbol "X7101".
2.  `Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105))`: It initializes the contract as an Ownable contract, setting the initial owner address to `address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)`.
3.  `discountAuthority = IDiscountAuthority(discountAuthority_)`: It assigns the `discountAuthority_` address to the `discountAuthority` variable, casting it to the `IDiscountAuthority` interface type.
4.  `liquidityHub = ILiquidityHub(liquidityHub_)`: It assigns the `liquidityHub_` address to the `liquidityHub` variable, casting it to the `ILiquidityHub` interface type.
5.  `_mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 100000000 * 10**18)`: It mints 100,000,000 tokens with 18 decimal places and assigns them to the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105`.

```js
function setLiquidityHub(address liquidityHub_) external onlyOwner {
        require(!liquidityHubFrozen);
        liquidityHub = ILiquidityHub(liquidityHub_);
        emit LiquidityHubSet(liquidityHub_);
    }
```

The `setLiquidityHub` function is a public function that allows the contract owner to set the address of the liquidity hub.

1.  `require(!liquidityHubFrozen)`: This statement ensures that the liquidity hub address can only be set if it is not frozen. If the `liquidityHubFrozen` boolean variable is `true`, the function will revert.
2.  `liquidityHub = ILiquidityHub(liquidityHub_)`: It assigns the `liquidityHub_` address to the `liquidityHub` variable, casting it to the `ILiquidityHub` interface type.
3.  `emit LiquidityHubSet(liquidityHub_)`: It emits the `LiquidityHubSet` event, indicating that the liquidity hub address has been updated. The `liquidityHub_` address is passed as the indexed parameter in the event.

This function provides a way for the contract owner to update the liquidity hub address, as long as it is not frozen.

```js
  function setDiscountAuthority(address discountAuthority_) external onlyOwner {
        require(!discountAuthorityFrozen);
        discountAuthority = IDiscountAuthority(discountAuthority_);
        emit DiscountAuthoritySet(discountAuthority_);
    }
```

The `setDiscountAuthority` function is a public function that allows the contract owner to set the address of the discount authority contract.

1.  `require(!discountAuthorityFrozen)`: This statement ensures that the discount authority address can only be set if it is not frozen. If the `discountAuthorityFrozen` boolean variable is `true`, the function will revert.
2.  `discountAuthority = IDiscountAuthority(discountAuthority_)`: It assigns the `discountAuthority_` address to the `discountAuthority` variable, casting it to the `IDiscountAuthority` interface type.
3.  `emit DiscountAuthoritySet(discountAuthority_)`: It emits the `DiscountAuthoritySet` event, indicating that the discount authority address has been updated. The `discountAuthority_` address is passed as the indexed parameter in the event.

This function provides a way for the contract owner to update the discount authority address, as long as it is not frozen.

```js
 function setFeeNumerator(uint256 feeNumerator_) external onlyOwner {
        require(feeNumerator_ <= maxFeeNumerator);
        feeNumerator = feeNumerator_;
        emit FeeNumeratorSet(feeNumerator_);
    }
```

The `setFeeNumerator` function is a public function that allows the contract owner to set the fee numerator.

1.  `require(feeNumerator_ <= maxFeeNumerator)`: This statement ensures that the new fee numerator value is less than or equal to the `maxFeeNumerator`. If the condition is not met, the function will revert.
2.  `feeNumerator = feeNumerator_`: It updates the `feeNumerator` variable with the new value provided.
3.  `emit FeeNumeratorSet(feeNumerator_)`: It emits the `FeeNumeratorSet` event, indicating that the fee numerator has been updated. The `feeNumerator_` value is passed as a parameter in the event.

This function provides a way for the contract owner to update the fee numerator, as long as it does not exceed the maximum fee numerator value.

```js
    function setAMM(address ammAddress, bool isAMM) external {
        require(msg.sender == address(liquidityHub) || msg.sender == owner(), "Only the owner or the liquidity hub may add a new pair");
        ammPair[ammAddress] = isAMM;
        emit AMMSet(ammAddress, isAMM);
    }
```

The `setOffRampPair` function is a public function that allows either the contract owner or the liquidity hub to set the address of the off-ramp pair.

1.  `require(msg.sender == address(liquidityHub) || msg.sender == owner(), "Only the owner or the liquidity hub may add a new pair")`: This statement ensures that only the contract owner or the liquidity hub contract can call this function. If the condition is not met, the function will revert to the given error message.
2.  `offRampPair = ammAddress`: It assigns the `ammAddress` to the `offRampPair` variable, indicating the address of the off-ramp pair.
3.  `emit OffRampPairSet(ammAddress)`: It emits the `OffRampPairSet` event, indicating that the off-ramp pair address has been set. The `ammAddress` is passed as the indexed parameter in the event.

This function provides a way for the contract owner or the liquidity hub to set the address of the off-ramp pair.

```js
    function setOffRampPair(address ammAddress) external {
        require(msg.sender == address(liquidityHub) || msg.sender == owner(), "Only the owner or the liquidity hub may add a new pair");
        offRampPair = ammAddress;
        emit OffRampPairSet(ammAddress);
    }
```

The `setOffRampPair` function is a public function that allows either the contract owner or the liquidity hub to set the address of the off-ramp pair.

1.  `require(msg.sender == address(liquidityHub) || msg.sender == owner(), "Only the owner or the liquidity hub may add a new pair")`: This statement ensures that only the contract owner or the liquidity hub contract can call this function. If the condition is not met, the function will revert to the given error message.
2.  `offRampPair = ammAddress`: It assigns the `ammAddress` to the `offRampPair` variable, indicating the address of the off-ramp pair.
3.  `emit OffRampPairSet(ammAddress)`: It emits the `OffRampPairSet` event, indicating that the off-ramp pair address has been set. The `ammAddress` is passed as the indexed parameter in the event.

This function provides a way for the contract owner or the liquidity hub to set the address of the off-ramp pair.

```js
 function freezeLiquidityHub() external onlyOwner {
        require(!liquidityHubFrozen);
        liquidityHubFrozen = true;
        emit LiquidityHubFrozen();
    }
```

The `freezeLiquidityHub` function is a public function that allows the contract owner to freeze the liquidity hub.

1.  `require(!liquidityHubFrozen)`: This statement ensures that the liquidity hub is not already frozen. If the `liquidityHubFrozen` boolean variable is `true`, indicating that the liquidity hub is already frozen, the function will revert.
2.  `liquidityHubFrozen = true`: It sets the `liquidityHubFrozen` variable to `true`, indicating that the liquidity hub is now frozen.
3.  `emit LiquidityHubFrozen()`: It emits the `LiquidityHubFrozen` event, indicating that the liquidity hub has been frozen.

This function provides a way for the contract owner to freeze the liquidity hub, preventing further modifications to the liquidity hub address.

```js
    function freezeDiscountAuthority() external onlyOwner {
        require(!discountAuthorityFrozen);
        discountAuthorityFrozen = true;
        emit DiscountAuthorityFrozen();
    }
```

The `freezeDiscountAuthority` function is a public function that allows the contract owner to freeze the discount authority.

1.  `require(!discountAuthorityFrozen)`: This statement ensures that the discount authority is not already frozen. If the `discountAuthorityFrozen` boolean variable is `true`, indicating that the discount authority is already frozen, the function will revert.
2.  `discountAuthorityFrozen = true`: It sets the `discountAuthorityFrozen` variable to `true`, indicating that the discount authority is now frozen.
3.  `emit DiscountAuthorityFrozen()`: It emits the `DiscountAuthorityFrozen` event, indicating that the discount authority has been frozen.

This function provides a way for the contract owner to freeze the discount authority, preventing further modifications to the discount authority address.

```js
   function circulatingSupply() external view returns (uint256) {
        return totalSupply() - balanceOf(address(0)) - balanceOf(address(0x000000000000000000000000000000000000dEaD));
    }
```

The `circulatingSupply` function is a public view function that returns the circulating supply of the token.

1.  `totalSupply()`: This function retrieves the total supply of the token.
2.  `balanceOf(address(0))`: This function retrieves the balance of the zero address, which represents tokens that are burned or destroyed.
3.  `balanceOf(address(0x000000000000000000000000000000000000dEaD))`: This function retrieves the balance of a specific address (in this case, `0x000000000000000000000000000000000000dEaD`), which represents tokens that are locked or permanently inaccessible.

The `circulatingSupply` function calculates the circulating supply by subtracting the balances of the zero address and the locked address from the total supply. The result is returned as a `uint256` value representing the circulating supply of the token.

```js
   function enableTrading() external onlyOwner {
        require(!transfersEnabled);
        transfersEnabled = true;
    }
```

The `enableTrading` function is a public function that allows the contract owner to enable token trading.

1.  `require(!transfersEnabled)`: This statement ensures that token transfers are not already enabled. If the `transfersEnabled` boolean variable is `true`, indicating that token transfers are already enabled, the function will revert.
2.  `transfersEnabled = true`: It sets the `transfersEnabled` variable to `true`, indicate that token transfers are now enabled.

This function provides a way for the contract owner to enable trading of the token by allowing token transfers between addresses. Once enabled, tokens can be freely transferred between users.

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

The `_transfer` function is an internal override function that facilitates the transfer of tokens between addresses. It first checks if transfers are enabled or if the `from` address is the owner of the contract. If either condition is true, the transfer is allowed to proceed; otherwise, the function reverts.

Next, it determines the `transferAmount` variable, which initially holds the original transfer amount. If either the `from` or `to` address is the liquidity hub, the function delegates the transfer to the `_transfer` function of the parent contract `ERC20` to handle it conventionally, and the function ends.

If either the `to` or `from` address is an Automated Market Maker (AMM) pair, the function calculates the fee amount by multiplying the transfer amount by the `feeNumerator`, any discount modifiers obtained from the `discountAuthority`, and dividing by the `feeDenominator`. If the discount modifiers exceed the denominator or if the denominator is zero, the fee modifiers are set to 1 to prevent unexpected behaviour. The fee amount is then transferred from the `from` address to the liquidity hub, and the `transferAmount` is updated to be the remaining amount after deducting the fee.

If the `to` address is the off-ramp pair, the function calls the `processFees` function of the liquidity hub to handle any fees associated with the transfer.

Finally, the function calls the `_transfer` function of the parent contract `ERC20` to execute the actual transfer of the `transferAmount` from the `from` address to the `to` address, completing the token transfer process.

This sequence of steps ensures proper handling of transfers, fee calculations, and fee processing for specific addresses, such as the liquidity hub and AMM pairs, as well as the off-ramp pair.

```js
   function rescueETH() external {
        (bool success,) = payable(address(liquidityHub)).call{value: address(this).balance}("");
        require(success);
    }
```

The `rescueETH` function allows the contract owner to rescue any ETH (Ether) that might be stuck in the contract.

When the function is called, it attempts to send the entire ETH balance of the contract to the address of the liquidity hub using a low-level `call` function. The `payable` keyword indicates that the address of the liquidity hub can receive Ether. The `value` field specifies the amount of ETH to send, which is set to the balance of the contract (`address(this).balance`).

The function captures the success status of the `call` operation in the `success` variable. If the `call` is successful, `success` will be `true`; otherwise, it will be `false`. The empty variable declaration after `success` is used to ignore the second return value of the `call` function.

After attempting to send the ETH, the function checks if the `call` was successful by using the `require` statement. If `success` is `false`, indicating that the ETH transfer failed, the function will revert and the rescue attempt will not succeed. On the other hand, if `success` is `true`, the function execution will continue, and the rescue of ETH will be considered successful.

```js
    function rescueTokens(address tokenAddress) external {
        IERC20(tokenAddress).transfer(address(liquidityHub), IERC20(tokenAddress).balanceOf(address(this)));
    }
```

The `rescueTokens` function allows the contract owner to rescue any ERC20 tokens that might be held in the contract.

When the function is called, it takes an `address` parameter `tokenAddress`, representing the address of the ERC20 token contract that needs to be rescued. The function then uses the `IERC20` interface to interact with the token contract.

Using the `tokenAddress`, the function creates an instance of the ERC20 token contract and calls the `transfer` function on it. It transfers the balance of the token held by the contract (`IERC20(tokenAddress).balanceOf(address(this))`) to the address of the liquidity hub (`address(liquidityHub)`). This effectively transfers all the ERC20 tokens to the liquidity hub address.

By calling the `transfer` function, the function assumes that the contract has the necessary approval to transfer the tokens. If the contract does not have the required approval, the token transfer will fail.

This function provides a way for the contract owner to retrieve any ERC20 tokens that are mistakenly or intentionally sent to the contract, ensuring that they are transferred to the liquidity hub for further handling.
