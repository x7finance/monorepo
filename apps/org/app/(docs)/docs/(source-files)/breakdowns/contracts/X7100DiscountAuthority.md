---
title: X7100 Discount Authority Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7100-discount-authority-contract-b5c4a274b3ee

The `X7100DiscountAuthority` contract allows the owner to set the addresses of four different NFT & token contracts: `ecoMaxiNFT`, `liqMaxiNFT`, `magisterNFT`, and `x7dao`. The `X7100DiscountAuthority` contract also has a public function called `discountRatio` that takes an address as an argument and returns a fraction representing a discount. This contract allows for a discount percentage on X7100 Series tokens.

The `discountRatio` function determines the discount that should be applied to a given user (whose address is passed as an argument) based on the balance of certain tokens that they own.

```js
 constructor() Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {}

    function setEcosystemMaxiNFT(address tokenAddress) external onlyOwner {
        require(address(ecoMaxiNFT) != tokenAddress);
        address oldTokenAddress = address(ecoMaxiNFT);
        ecoMaxiNFT = IERC721(tokenAddress);
        emit EcosystemMaxiNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setEcosystemMaxiNFT` function is a public function that is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the `X7100DiscountAuthority` contract.

The function takes a single argument `tokenAddress`, which is the address of an `IERC721` token contract. The function first checks that the address of the `IERC721` contract currently stored in the `ecoMaxiNFT` variable is not the same as `tokenAddress`. If they are the same, the function does nothing and returns.

If the address of the `IERC721` contract currently stored in `ecoMaxiNFT` is different from `tokenAddress`, the function stores the address of `tokenAddress` in the `ecoMaxiNFT` variable and emits an `EcosystemMaxiNFTSet` event. The `EcosystemMaxiNFTSet` event logs the previous address of the `IERC721` contract stored in `ecoMaxiNFT` and the new address that is being set.

The `setEcosystemMaxiNFT` function allows the owner of the `X7100DiscountAuthority` contract to change the address of the `IERC721` contract that is stored in the `ecoMaxiNFT` variable. This may be useful if the contract address of the `IERC721` contract needs to be changed for some reason.

```js
 function setLiquidityMaxiNFT(address tokenAddress) external onlyOwner {
        require(address(liqMaxiNFT) != tokenAddress);
        address oldTokenAddress = address(liqMaxiNFT);
        liqMaxiNFT = IERC721(tokenAddress);
        emit LiquidityMaxiNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setLiquidityMaxiNFT` function is similar to the `setEcosystemMaxiNFT` function in that it allows the owner of the `X7100DiscountAuthority` contract to change the address of an `IERC721` token contract that is stored in a variable. In this case, the variable is `liqMaxiNFT`.

Like the `setEcosystemMaxiNFT` function, the `setLiquidityMaxiNFT` function takes a single argument `tokenAddress`, which is the address of an `IERC721` token contract. The function first checks that the address of the `IERC721` contract currently stored in the `liqMaxiNFT` variable is not the same as `tokenAddress`. If they are the same, the function does nothing and returns.

If the address of the `IERC721` contract currently stored in `liqMaxiNFT` is different from `tokenAddress`, the function stores the address of `tokenAddress` in the `liqMaxiNFT` variable and emits a `LiquidityMaxiNFTSet` event. The `LiquidityMaxiNFTSet` event logs the previous address of the `IERC721` contract stored in `liqMaxiNFT` and the new address that is being set.

The `setLiquidityMaxiNFT` function allows the owner of the `X7100DiscountAuthority` contract to change the address of the `IERC721` contract that is stored in the `liqMaxiNFT` variable. This may be useful if the contract address of the `IERC721` contract needs to be changed for some reason.

```js
 function setMagisterNFT(address tokenAddress) external onlyOwner {
        require(address(magisterNFT) != tokenAddress);
        address oldTokenAddress = address(magisterNFT);
        magisterNFT = IERC721(tokenAddress);
        emit MagisterNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setMagisterNFT` function is similar to the `setEcosystemMaxiNFT` and `setLiquidityMaxiNFT` functions in that it allows the owner of the `X7100DiscountAuthority` contract to change the address of an `IERC721` token contract that is stored in a variable. In this case, the variable is `magisterNFT`.

Like the other two functions, the `setMagisterNFT` function takes a single argument `tokenAddress`, which is the address of an `IERC721` token contract. The function first checks that the address of the `IERC721` contract currently stored in the `magisterNFT` variable is not the same as `tokenAddress`. If they are the same, the function does nothing and returns.

If the address of the `IERC721` contract currently stored in `magisterNFT` is different from `tokenAddress`, the function stores the address of `tokenAddress` in the `magisterNFT` variable and emits a `MagisterNFTSet` event. The `MagisterNFTSet` event logs the previous address of the `IERC721` contract stored in `magisterNFT` and the new address that is being set.

The `setMagisterNFT` function allows the owner of the `X7100DiscountAuthority` contract to change the address of the `IERC721` contract that is stored in the `magisterNFT` variable. This may be useful if the contract address of the `IERC721` contract needs to be changed for some reason.

```js
 function setX7DAO(address tokenAddress) external onlyOwner {
        require(address(x7dao) != tokenAddress);
        address oldTokenAddress = address(x7dao);
        x7dao = IERC20(tokenAddress);
        emit X7DAOTokenSet(oldTokenAddress, tokenAddress);
    }
```

The `setX7DAO` function is similar to the `setEcosystemMaxiNFT`, `setLiquidityMaxiNFT`, and `setMagisterNFT` functions in that it allows the owner of the `X7100DiscountAuthority` contract to change the address of a token contract that is stored in a variable. In this case, the variable is `x7dao` and the token contract is an `IERC20` contract.

Like the other three functions, the `setX7DAO` function takes a single argument `tokenAddress`, which is the address of an `IERC20` token contract. The function first checks that the address of the `IERC20` contract currently stored in the `x7dao` variable is not the same as `tokenAddress`. If they are the same, the function does nothing and returns.

If the address of the `IERC20` contract currently stored in `x7dao` is different from `tokenAddress`, the function stores the address of `tokenAddress` in the `x7dao` variable and emits an `X7DAOTokenSet` event. The `X7DAOTokenSet` event logs the previous address of the `IERC20` contract stored in `x7dao` and the new address that is being set.

The `setX7DAO` function allows the owner of the `X7100DiscountAuthority` contract to change the address of the `IERC20` contract that is stored in the `x7dao` variable. This may be useful if the contract address of the `IERC20` contract needs to be changed for some reason.

```js
 function discountRatio(address swapper) external view returns (uint256 numerator, uint256 denominator) {
        numerator = 1;
        denominator = 1;

        if (liqMaxiNFT.balanceOf(swapper) > 0 || x7dao.balanceOf(swapper) >= 50000 \* 10\*\*18) {
            // 50% Fee Discount
            numerator = 50;
            denominator = 100;
        } else if (ecoMaxiNFT.balanceOf(swapper) > 0 || magisterNFT.balanceOf(swapper) > 0) {
            // 25% Fee Discount
            numerator = 75;
            denominator = 100;
        }
    }
```

The `discountRatio` function is a public function that takes an address `swapper` as an argument and returns a fraction representing a discount. The fraction is represented by two unsigned integers: `numerator` and `denominator`.

The function first sets the `numerator` and `denominator` variables to 1, which represents a 100% discount (or no discount). The function then checks the balance of certain tokens that the user with address `swapper` holds. If the user has a balance of `liqMaxiNFT` tokens or holds at least 50000 `x7dao` tokens, the `numerator` and `denominator` variables are updated to represent a 50% discount. If the user has a balance of `ecoMaxiNFT` tokens or `magisterNFT` tokens, the `numerator` and `denominator` variables are updated to represent a 25% discount. If the user does not meet any of these conditions, the `numerator` and `denominator` variables remain set to 1, which represents a 100% discount.

The `discountRatio` function allows a user to receive a discount on X7100 series tokens.
