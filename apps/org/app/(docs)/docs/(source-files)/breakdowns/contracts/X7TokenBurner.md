---
title: X7 Token Burner Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-finance-x7-token-burner-contract-a39bf132afb

A smart contract that allows the owner to burn a specified token in exchange for ETH, using the V2 exchange. It also includes functions to set the V2 router contract and the target token to be burned, as well as a function to swap the burned tokens back for ETH and withdraw them. The contract also includes an Ownable contract, which allows the owner to transfer ownership or renounce ownership of the contract. The receive function allows the contract to receive ETH, and will automatically burn the target token in exchange for the received ETH if the target token is set. The swapTokensForEth function allows the contract to swap a specified amount of a given token for ETH, and the rescueTokens function allows the owner to retrieve any remaining tokens that have not been burned.

```solidity
interface IUniswapV2Router {
    function WETH() external pure returns (address);
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

interface IWETH {
    function withdraw(uint) external;
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}
```

Above are the Interface functions of the contract.

```solidity
 function setRouter(address router_) external onlyOwner {
        require(router_ != address(router));
        router = IUniswapV2Router(router_);
        emit RouterSet(router_);
    }
```

The `setRouter` function allows the owner of the contract to set the address of the V2 router contract that will be used to perform the token burn. The function includes a `require` statement that ensures the new router address is different from the current router address. This is to prevent the owner from inadvertently overwriting the current router address with the same address. The function also emits a `RouterSet` event with the new router address. This event can be used by external actors to track changes to the router address.

```solidity
 function setTargetToken(address targetToken_) external onlyOwner {
        require(targetToken_ != targetToken);
        targetToken = targetToken_;
        emit TargetTokenSet(targetToken_);
    }
```

The `setTargetToken` function allows the owner of the contract to set the address of the token that will be burned. The function includes a `require` statement that ensures the new target token address is different from the current target token address. This is to prevent the owner from inadvertently overwriting the current target token address with the same address. The function also emits a `TargetTokenSet` event with the new target token address. This event can be used by external actors to track changes to the target token address.

```solidity
 receive() external payable {
        if (targetToken == address(0)) {
            return;
        }

        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = targetToken;

        uint256 purchaseAmount = address(this).balance;
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: purchaseAmount}(
            0,
            path,
            address(0x000000000000000000000000000000000000dEaD),
            block.timestamp
        );

        emit TokensBurned(targetToken, purchaseAmount);
    }
```

The `receive` function is a payable fallback function that allows the contract to receive ETH. It includes an `if` statement that checks if the target token address is set to the zero address. If it is, the function returns without doing anything. If the target token address is not the zero address, the function creates an array of addresses called `path` that contains the address of the WETH contract and the address of the target token. It then calculates the amount of ETH received by the contract by checking its balance, and calls the `swapExactETHForTokensSupportingFeeOnTransferTokens` function on the V2 router contract, passing in the `path` array and the amount of ETH received as arguments. This function will burn the specified amount of ETH and exchange it for the target token. The function also emits a `TokensBurned` event with the target token address and the amount of ETH burned as arguments. This event can be used by external actors to track the tokens that have been burned.

```solidity
 function swapTokensForEth(address tokenAddress, uint256 tokenAmount) internal {
        require(tokenAmount > 0);

        address[] memory path = new address[](2);
        path[0] = tokenAddress;
        path[1] = router.WETH();

        IERC20(tokenAddress).approve(address(router), tokenAmount);
        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }
```

The `swapTokensForEth` function allows the contract to swap a specified amount of a given token for ETH. It includes a `require` statement that ensures the specified amount of tokens is greater than 0. This is to prevent the contract from attempting to swap 0 tokens, which would not be a valid operation.

The function creates an array of addresses called `path` that contains the address of the given token and the address of the WETH contract. It then calls the `approve` function on the given token contract, passing in the address of the V2 router contract and the amount of tokens to be swapped as arguments. This function grants the router contract permission to transfer the specified amount of tokens on behalf of the contract.

The function then calls the `swapExactTokensForETHSupportingFeeOnTransferTokens` function on the V2 router contract, passing in the amount of tokens to be swapped, the `path` array, and the address of the contract as arguments. This function will burn the specified amount of tokens and exchange them for ETH, which will be sent to the contract.

```solidity
 function rescueTokens(address tokenAddress) external {
        swapTokensForEth(tokenAddress, IERC20(tokenAddress).balanceOf(address(this)));
    }
```

The `rescueTokens` function allows the owner of the contract to retrieve any remaining tokens that have not been burned. It does this by calling the `swapTokensForEth` function and passing in the address of the given token and the balance of the contract in that token as arguments. This will cause the contract to swap all of the remaining tokens for ETH and withdraw them. This function can be useful if the owner wants to retrieve any remaining tokens after the burn has completed, or if the target token address was set incorrectly and the contract accidentally burned the wrong tokens.

```solidity
 function rescueWETH() external {
        address wethAddress = router.WETH();
        IWETH(wethAddress).withdraw(IERC20(wethAddress).balanceOf(address(this)));
    }
```

The `rescueWETH` function allows the owner of the contract to retrieve any remaining WETH (wrapped ETH) that has not been burned. It does this by calling the `WETH` function on the V2 router contract to get the address of the WETH contract, and then calling the `withdraw` function on the WETH contract, passing in the balance of the contract in WETH as an argument. This will cause the contract to withdraw all of the remaining WETH. This function can be useful if the owner wants to retrieve any remaining WETH after the burn has completed, or if the contract has accidentally received and held onto more WETH than intended.
