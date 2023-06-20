---
title: X7R Discount Authority Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7r-discount-authority-contract-58a864c80aa3

The `X7RDiscountAuthority` contract has three interfaces defined for interacting with three different types of NFTs: `IERC721`, `ILiquidityMaxiNFT`, and `IMagisterNFT`. The contract also has three variables (`ecoMaxiNFT`, `liqMaxiNFT`, and `magisterNFT`) that are used to store the addresses of contracts that implement these interfaces.

The `X7RDiscountAuthority` contract has three functions for setting the addresses of these NFT contracts: `setEcosystemMaxiNFT`, `setLiquidityMaxiNFT`, and `setMagisterNFT`. These functions can only be called by the contract's owner, and they emit events to record the change in the NFT contract address.

Finally, the `X7RDiscountAuthority` contract has a `discountRatio` function that returns the discount ratio for a given user (specified by the `swapper` parameter). The function checks the user's balance of each of the three NFT types and applies a discount based on the balances. If the user has a balance of `liqMaxiNFT` or `magisterNFT` NFTs, a 25% discount is applied. If the user has a balance of `ecoMaxiNFT` NFTs, a 10% discount is applied. If the user has no balance of any of these NFTs, no discount is applied.

```solidity
 function setEcosystemMaxiNFT(address tokenAddress) external onlyOwner {
        require(address(ecoMaxiNFT) != tokenAddress);
        address oldTokenAddress = address(ecoMaxiNFT);
        ecoMaxiNFT = IERC721(tokenAddress);
        emit EcosystemMaxiNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setEcosystemMaxiNFT` function is used to set the address of the contract that implements the `IERC721` interface for the `ecoMaxiNFT` NFTs. The function has one input parameter, `tokenAddress`, which is the address of the contract to be set.

The function first checks that the `tokenAddress` is not the same as the current contract address stored in `ecoMaxiNFT`. This is done using the `require` function, which will revert the transaction and revert any changes made to the contract state if the condition is not met.

If the `tokenAddress` is different from the current contract address, the function sets the `ecoMaxiNFT` variable to the new contract address using the `IERC721` interface. It also emits an event, `EcosystemMaxiNFTSet`, to record the change in the contract address.

The `onlyOwner` modifier at the beginning of the function ensures that only the owner of the contract can call this function.

```solidity
 function setLiquidityMaxiNFT(address tokenAddress) external onlyOwner {
        require(address(liqMaxiNFT) != tokenAddress);
        address oldTokenAddress = address(liqMaxiNFT);
        liqMaxiNFT = IERC721(tokenAddress);
        emit LiquidityMaxiNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setLiquidityMaxiNFT` function is similar to the `setEcosystemMaxiNFT` function, but it is used to set the address of the contract that implements the `IERC721` interface for the `liqMaxiNFT` NFTs. The function has the same structure and behavior as the `setEcosystemMaxiNFT` function, with the only difference being the variables and events being used.

The function first checks that the `tokenAddress` is not the same as the current contract address stored in `liqMaxiNFT`. If the `tokenAddress` is different, the function sets the `liqMaxiNFT` variable to the new contract address using the `IERC721` interface. It also emits an event, `LiquidityMaxiNFTSet`, to record the change in the contract address.

The `onlyOwner` modifier at the beginning of the function ensures that only the owner of the contract can call this function.

```solidity
 function setMagisterNFT(address tokenAddress) external onlyOwner {
        require(address(magisterNFT) != tokenAddress);
        address oldTokenAddress = address(magisterNFT);
        magisterNFT = IERC721(tokenAddress);
        emit MagisterNFTSet(oldTokenAddress, tokenAddress);
```

The `setMagisterNFT` function is similar to the `setEcosystemMaxiNFT` and `setLiquidityMaxiNFT` functions, but it is used to set the address of the contract that implements the `IERC721` interface for the `magisterNFT` NFTs. The function has the same structure and behavior as the other two functions, with the only difference being the variables and events being used.

The function first checks that the `tokenAddress` is not the same as the current contract address stored in `magisterNFT`. If the `tokenAddress` is different, the function sets the `magisterNFT` variable to the new contract address using the `IERC721` interface. It also emits an event, `MagisterNFTSet`, to record the change in the contract address.

The `onlyOwner` modifier at the beginning of the function ensures that only the owner of the contract can call this function.

```solidity
 function discountRatio(address swapper) external view returns (uint256 numerator, uint256 denominator) {
        numerator = 1;
        denominator = 1;

        if (liqMaxiNFT.balanceOf(swapper) > 0 || magisterNFT.balanceOf(swapper) > 0) {
            // 25% discount
            numerator = 75;
            denominator = 100;
        } else if (ecoMaxiNFT.balanceOf(swapper) > 0) {
            // 10% discount
            numerator = 90;
            denominator = 100;
        }
    }
```

The `discountRatio` function is used to return the discount ratio for a given user (specified by the `swapper` parameter). The function returns a pair of integers, `numerator` and `denominator`, that represent the discount ratio as a fraction.

The function first initializes `numerator` and `denominator` to 1, which represents a discount ratio of 1 (i.e., no discount).

The function then checks the balance of each of the three NFT types for the `swapper` address using the `balanceOf` function from the `IERC721` interface. If the `swapper` has a balance of `liqMaxiNFT` or `magisterNFT` NFTs, the function sets the `numerator` and `denominator` variables to 75 and 100, respectively, which represents a discount ratio of 75/100, or 25%. If the `swapper` has a balance of `ecoMaxiNFT` NFTs, the function sets the `numerator` and `denominator` variables to 90 and 100, respectively, which represents a discount ratio of 90/100, or 10%. If the `swapper` has no balance of any of these NFTs, the function does not change the `numerator` and `denominator` variables, and the discount ratio remains at 1 (i.e., no discount).

The `discountRatio` function is marked as a view function (using the `view` keyword), which means that it does not modify the contract state and can be called without triggering a transaction.
