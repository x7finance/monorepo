---
title: X7DAO Discount Authority Contract
tags: [breakdowns]
---

This contract `X7DAODiscountAuthority` is a contract that implements an interface called `IDiscountAuthority`. This interface has one public view function called `discountRatio` which takes an `address` parameter called `swapper` and returns two `uint256` values: `numerator` and `denominator`.

The contract also extends the `Ownable` contract, which provides basic ownership functionality such as setting and transferring ownership, as well as a modifier called `onlyOwner` which can be applied to function to restrict the function to be called only by the owner of the contract.

The `X7DAODiscountAuthority` contract has two public variables of type `IERC721` called `ecoMaxiNFT` and `liqMaxiNFT`, which seem to be used to store the addresses of two ERC-721 tokens. The contract has two public functions called `setEcosystemMaxiNFT` and `setLiquidityMaxiNFT` which allow the owner of the contract to set the addresses of these tokens.

The `discountRatio` function of the `X7DAODiscountAuthority` contract checks the balances of the `ecoMaxiNFT` and `liqMaxiNFT` tokens for the `swapper` address and returns a discount ratio based on the balance. If the `swapper` has a balance of either token greater than 0, a discount is applied. If the `swapper` has a balance of the `liqMaxiNFT` token, a 15% discount is applied. If the `swapper` has a balance of the `ecoMaxiNFT` token, a 10% discount is applied. If the `swapper` has a balance of 0 for both tokens, no discount is applied and the ratio returned is 1:1.

```js
IERC721 public ecoMaxiNFT;
IERC721 public liqMaxiNFT;
```

`IERC721` is an interface for an ERC-721 token. ERC-721 is a standard for non-fungible tokens NFTs) on the Ethereum blockchain. NFTs are unique digital assets that represent ownership of a unique item or asset, such as a piece of art, a collectible, or a virtual real estate. ERC-721 defines a set of functions and events that an NFT contract must implement to be considered compliant with the standard.

The `IERC721` interface specifies the functions and events that an ERC-721 token contract should implement. It has functions for transferring and approving the transfer of NFTs, as well as functions for querying the balance and owner of an NFT.

The `IERC721` interface is being used to declare two public variables called `ecoMaxiNFT` and `liqMaxiNFT`. These variables are being used to store the addresses of two ERC-721 token contracts. The `setEcosystemMaxiNFT` and `setLiquidityMaxiNFT` functions allow the owner of the `X7DAODiscountAuthority` contract to set the addresses of these token contracts.

```js
event EcosystemMaxiNFTSet(address indexed oldTokenAddress, address indexed newTokenAddress);
event LiquidityMaxiNFTSet(address indexed oldTokenAddress, address indexed newTokenAddress);
```

The `EcosystemMaxiNFTSet` and `LiquidityMaxiNFTSet` events are being emitted when the `setEcosystemMaxiNFT` and `setLiquidityMaxiNFT` functions are called, respectively. These events are being declared with two indexed parameters: `oldTokenAddress` and `newTokenAddress`.

An event is a way for a contract to communicate with the outside world, specifically with off-chain clients that may be listening to the contract. When an event is emitted, it is logged in the blockchain and can be accessed through a log.

The `indexed` keyword is used to specify that a parameter should be indexed in the log. An indexed parameter is stored in a separate data structure in the blockchain, which makes it easier and faster to search for and retrieve the logs. This can be useful when you want to filter or query the logs based on the value of the indexed parameter.

In this case, the `EcosystemMaxiNFTSet` and `LiquidityMaxiNFTSet` events are being emitted with the `oldTokenAddress` and `newTokenAddress` parameters as indexed. This allows listeners to filter or query the logs based on the old or new token address.

```js
constructor() Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {}
```

The `constructor` is a special function in Solidity that is executed when a contract is deployed. It is used to initialize the contract and set up its initial state.

The `constructor` function is being called with the `Ownable` contract's constructor, passing in the `address` `0x7000a09c425ABf5173FF458dF1370C25d1C58105`. This sets the initial owner of the `X7DAODiscountAuthority` contract to this address. The `Ownable` contract's constructor sets the `_owner` variable to the address passed as a parameter, and emits the `OwnershipTransferred` event to indicate that the ownership has been transferred to the new owner.

This means that the `X7DAODiscountAuthority` contract will be initially owned by the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105`. Only this address will be able to call functions that are protected by the `onlyOwner` modifier.

```js
 function setEcosystemMaxiNFT(address tokenAddress) external onlyOwner {
        require(address(ecoMaxiNFT) != tokenAddress);
        address oldTokenAddress = address(ecoMaxiNFT);
        ecoMaxiNFT = IERC721(tokenAddress);
        emit EcosystemMaxiNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setEcosystemMaxiNFT` function is a public function of the `X7DAODiscountAuthority` contract that allows the owner of the contract to set the address of the `ecoMaxiNFT` token.

The function takes an `address` parameter called `tokenAddress` which represents the new address of the `ecoMaxiNFT` token. It also has the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

The function first checks that the address of the current `ecoMaxiNFT` token is not the same as the new `tokenAddress`. If the addresses are the same, the function does nothing and returns. If the addresses are different, the function sets the `ecoMaxiNFT` variable to the new `tokenAddress` and emits the `EcosystemMaxiNFTSet` event with the old and new token addresses as parameters.

```js
 function setLiquidityMaxiNFT(address tokenAddress) external onlyOwner {
        require(address(liqMaxiNFT) != tokenAddress);
        address oldTokenAddress = address(liqMaxiNFT);
        liqMaxiNFT = IERC721(tokenAddress);
        emit LiquidityMaxiNFTSet(oldTokenAddress, tokenAddress);
    }
```

The `setLiquidityMaxiNFT` function is similar to the `setEcosystemMaxiNFT` function. It is a public function of the `X7DAODiscountAuthority` contract that allows the owner of the contract to set the address of the `liqMaxiNFT` token.

Like the `setEcosystemMaxiNFT` function, the `setLiquidityMaxiNFT` function takes an `address` parameter called `tokenAddress` which represents the new address of the `liqMaxiNFT` token. It also has the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

The function first checks that the address of the current `liqMaxiNFT` token is not the same as the new `tokenAddress`. If the addresses are the same, the function does nothing and returns. If the addresses are different, the function sets the `liqMaxiNFT` variable to the new `tokenAddress` and emits the `LiquidityMaxiNFTSet` event with the old and new token addresses as parameters.

```js
 function discountRatio(address swapper) external view returns (uint256 numerator, uint256 denominator) {
        numerator = 1;
        denominator = 1;

        if (liqMaxiNFT.balanceOf(swapper) > 0) {
            // 15% discount
            numerator = 85;
            denominator = 100;
        } else if (ecoMaxiNFT.balanceOf(swapper) > 0) {
            // 10% discount
            numerator = 90;
            denominator = 100;
        }
    }
```

The `discountRatio` function is a public view function of the `X7DAODiscountAuthority` contract that implements the `IDiscountAuthority` interface. It takes an `address` parameter called `swapper` and returns two `uint256` values: `numerator` and `denominator`.

The function first initializes the `numerator` and `denominator` variables to 1. It then checks the balances of the `liqMaxiNFT` and `ecoMaxiNFT` tokens for the `swapper` address. If the `swapper` has a balance of the `liqMaxiNFT` token that is greater than 0, the function applies a 15% discount by setting the `numerator` to 85 and the `denominator` to 100. If the `swapper` has a balance of the `ecoMaxiNFT` token that is greater than 0, the function applies a 10% discount by setting the `numerator` to 90 and the `denominator` to 100. If the `swapper` has a balance of 0 for both tokens, no discount is applied and the ratio returned is 1:1.

The `discountRatio` function is marked with the `view` keyword, which means that it is a read-only function that does not modify the state of the contract and does not have any side effects. It is also marked with the `external` keyword, which means that it can be called from external contracts and addresses.
