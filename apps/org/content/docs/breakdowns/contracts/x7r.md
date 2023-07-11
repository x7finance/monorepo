---
title: X7 Token
tags: [breakdowns]
---

The contract "X7R" is an ERC20 token that allows for token transfers with fees and integrates with a liquidity hub and discount authority. It includes features such as setting fee ratios, defining AMM pairs, and enabling/disabling transfers.

```js
interface ILiquidityHub {
    function processFees(address) external;
}

interface IDiscountAuthority {
    function discountRatio(address) external view returns (uint256, uint256);
}
```

The `ILiquidityHub` interface defines a function `processFees` that processes fees for a given address. The `IDiscountAuthority` interface defines a function `discountRatio` that returns the discount ratio for a given address, represented by two `uint256` values.

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

The contract has public variables `discountAuthority` and `liquidityHub` of types `IDiscountAuthority` and `ILiquidityHub`, respectively. It also includes a mapping `ammPair` that maps addresses to boolean values, representing whether an address is an automated market maker (AMM) pair. The contract has an `offRampPair` variable to store an address.

There are additional public variables `maxFeeNumerator`, `feeNumerator`, and `feeDenominator` to control the fee calculation. The contract also includes boolean variables `discountAuthorityFrozen`, `liquidityHubFrozen`, and `transfersEnabled` to track certain states related to discount authority, liquidity hub, and transfers.

```js
event LiquidityHubSet(address indexed liquidityHub);
event DiscountAuthoritySet(address indexed discountAuthority);
event FeeNumeratorSet(uint256 feeNumerator);
event AMMSet(address indexed pairAddress, bool isAMM);
event OffRampPairSet(address indexed offRampPair);
event LiquidityHubFrozen();
event DiscountAuthorityFrozen();
```

The contract emits various events:

- `LiquidityHubSet`: Triggered when the liquidity hub address is set.
- `DiscountAuthoritySet`: Triggered when the discount authority address is set.
- `FeeNumeratorSet`: Triggered when the fee numerator is set.
- `AMMSet`: Triggered when an AMM pair address is set.
- `OffRampPairSet`: Triggered when the off-ramp pair address is set.
- `LiquidityHubFrozen`: Triggered when the liquidity hub address is frozen.
- `DiscountAuthorityFrozen`: Triggered when the discount authority address is frozen.

```js
constructor(
    address discountAuthority_,
    address liquidityHub_
) ERC20("X7R", "X7R") Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {
    discountAuthority = IDiscountAuthority(discountAuthority_);
    liquidityHub = ILiquidityHub(liquidityHub_);

    _mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 100000000 * 10**18);
}
```

The constructor of the contract initializes the `discountAuthority` and `liquidityHub` variables with the provided addresses. It also sets the contract name and symbol to "X7R" using the `ERC20` constructor and sets the contract owner to the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105` using the `Ownable` constructor. Additionally, it mints 100,000,000 \* 10┬╣Γü╕ X7R tokens to the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105`.

```js
function setLiquidityHub(address liquidityHub_) external onlyOwner {
    require(!liquidityHubFrozen);
    liquidityHub = ILiquidityHub(liquidityHub_);
    emit LiquidityHubSet(liquidityHub_);
}
```

The `setLiquidityHub` function allows the owner of the contract to set the address of the liquidity hub. It requires that the liquidity hub address is not frozen (`liquidityHubFrozen` is false). Once the new address is set, the function emits the `LiquidityHubSet` event with the updated liquidity hub address.

```js
    function setDiscountAuthority(address discountAuthority_) external onlyOwner {
        require(!discountAuthorityFrozen);
        discountAuthority = IDiscountAuthority(discountAuthority_);
        emit DiscountAuthoritySet(discountAuthority_);
    }
```

The `setDiscountAuthority` function allows the owner of the contract to set the address of the discount authority. It requires that the discount authority address is not frozen (`discountAuthorityFrozen` is false). Once the new address is set, the function emits the `DiscountAuthoritySet` event with the updated discount authority address.

```js
    function setFeeNumerator(uint256 feeNumerator_) external onlyOwner {
        require(feeNumerator_ <= maxFeeNumerator);
        feeNumerator = feeNumerator_;
        emit FeeNumeratorSet(feeNumerator_);
    }
```

The `setFeeNumerator` function allows the owner of the contract to set the fee numerator value. It requires that the new fee numerator does not exceed the maximum fee numerator (`feeNumerator_ <= maxFeeNumerator`). Once the new fee numerator is set, the function emits the `FeeNumeratorSet` event with the updated fee numerator value.

```js
function setAMM(address ammAddress, bool isAMM) external onlyOwner {
    ammPair[ammAddress] = isAMM;
    emit AMMSet(ammAddress, isAMM);
}
```

The `setAMM` function allows the owner of the contract to set whether an address represents an Automated Market Maker (AMM) pair. It takes an `ammAddress` and a boolean `isAMM` as parameters. It updates the `ammPair` mapping with the given address and its associated AMM status. The function emits the `AMMSet` event with the updated AMM pair address and its corresponding boolean value.

```js
function setOffRampPair(address ammAddress) external onlyOwner {
    offRampPair = ammAddress;
    emit OffRampPairSet(ammAddress);
}
```

The `setOffRampPair` function allows the owner of the contract to set the address of the off-ramp pair. It takes an `ammAddress` parameter representing the off-ramp pair address and updates the `offRampPair` variable with this value. The function emits the `OffRampPairSet` event with the updated off-ramp pair address.

```js
function freezeLiquidityHub() external onlyOwner {
    require(!liquidityHubFrozen);
    liquidityHubFrozen = true;
    emit LiquidityHubFrozen();
}
```

The `freezeLiquidityHub` function allows the owner of the contract to freeze the liquidity hub address. It requires that the liquidity hub address is not already frozen (`liquidityHubFrozen` is false). If the condition is met, it sets the `liquidityHubFrozen` variable to true, indicating that the liquidity hub address is now frozen. The function emits the `LiquidityHubFrozen` event to signal the freezing of the liquidity hub address.

```js
function freezeDiscountAuthority() external onlyOwner {
    require(!discountAuthorityFrozen);
    discountAuthorityFrozen = true;
    emit DiscountAuthorityFrozen();
}
```

The `freezeDiscountAuthority` function allows the owner of the contract to freeze the discount authority address. It requires that the discount authority address is not already frozen (`discountAuthorityFrozen` is false). If the condition is met, it sets the `discountAuthorityFrozen` variable to true, indicating that the discount authority address is now frozen. The function emits the `DiscountAuthorityFrozen` event to signal the freezing of the discount authority address.

```js
function circulatingSupply() external view returns (uint256) {
    return totalSupply() - balanceOf(address(0)) - balanceOf(address(0x000000000000000000000000000000000000dEaD));
}
```

The `circulatingSupply` function is a view function that returns the circulating supply of the token. It calculates the circulating supply by subtracting the balance of the zero address (`address(0)`) and the balance of the dead address (`address(0x000000000000000000000000000000000000dEaD)`) from the total supply of the token (`totalSupply()`).

```js
function enableTrading() external onlyOwner {
    require(!transfersEnabled);
    transfersEnabled = true;
}
```

The `enableTrading` function allows the owner of the contract to enable token transfers. It requires that transfers are currently disabled (`transfersEnabled` is false). If the condition is met, it sets the `transfersEnabled` variable to true, indicating that token transfers are now enabled.

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

The `_transfer` function is an internal override function from the ERC20 contract. It handles the logic for token transfers with additional features.

1. It checks if transfers are enabled or if the transfer is initiated by the owner. If transfers are disabled and the sender is not the owner, the function will revert.
2. It initializes a variable `transferAmount` with the original transfer amount (`amount`).
3. If the sender or recipient address is the liquidity hub, the function calls the `_transfer` function from the ERC20 contract to execute the transfer and returns.
4. If the sender or recipient is identified as an AMM pair based on the `ammPair` mapping, additional fee calculations are performed.

- The effective principal address is determined based on whether the recipient is an AMM pair or not.
- The `discountRatio` function from the discount authority contract is called to retrieve the fee modifier numerator and denominator for the effective principal address.
- If the fee modifier numerator is greater than the denominator or the denominator is zero, the fee modifier values are set to 1 to avoid invalid calculations.
- The fee amount is calculated based on the fee numerator, fee modifier numerator, and fee denominator.
- The fee amount is transferred to the liquidity hub address using the `_transfer` function.
- The `transferAmount` is updated to reflect the amount minus the fee.

5. If the recipient address matches the off-ramp pair, the `processFees` function is called on the liquidity hub contract to process the fees for the current contract.
6. Finally, the remaining `transferAmount` is transferred to the recipient address using the `_transfer` function.

This function provides additional functionality for fee calculations, AMM pair handling, and integration with the liquidity hub contract during token transfers.

```js
function rescueETH() external {
    (bool success,) = payable(address(liquidityHub)).call{value: address(this).balance}("");
    require(success);
}
```

The `rescueETH` function allows anyone to transfer any Ether (ETH) held by the contract to the liquidity hub address. It uses the `payable` keyword to indicate that the contract can receive Ether. It calls the `call` function on the liquidity hub address with the Ether value as `address(this).balance`. The `success` variable captures the success status of the call. If the call is successful, it proceeds without any action. If the call fails, the function reverts the transaction with a `require` statement.

```js
function rescueTokens(address tokenAddress) external {
    IERC20(tokenAddress).transfer(address(liquidityHub), IERC20(tokenAddress).balanceOf(address(this)));
}
```

The `rescueTokens` function allows anyone to transfer any ERC20 tokens held by the contract to the liquidity hub address. It takes a `tokenAddress` parameter representing the address of the ERC20 token. It transfers the balance of the ERC20 token held by the contract (`IERC20(tokenAddress).balanceOf(address(this))`) to the liquidity hub address using the `transfer` function from the ERC20 token contract (`IERC20(tokenAddress)`).
