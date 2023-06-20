---
title: X7R LiquidityHub Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-finance-x7r-liquidityhub-contract-4e1cca89fe22

```js
interface IERC20 {
    function circulatingSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IUniswapV2Router {
    function WETH() external returns (address);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
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

interface ILiquidityHub {
    function processFees(address) external;
}

interface IX7EcosystemSplitter {
    function takeBalance() external;
}

interface IWETH {
    function withdraw(uint) external;
}
```

Above are the Interface functions of the contract

```js
    function setShares(uint256 distributeShare_, uint256 liquidityShare_, uint256 treasuryShare_) external onlyOwner {
        require(distributeShare + liquidityShare + treasuryShare == 1000);

        require(distributeShare_ >= minShare && distributeShare_ <= maxShare);
        require(liquidityShare_ >= minShare && liquidityShare_ <= maxShare);
        require(treasuryShare_ >= minShare && treasuryShare_ <= maxShare);

        distributeShare = distributeShare_;
        liquidityShare = liquidityShare_;
        treasuryShare = treasuryShare_;

        emit SharesSet(distributeShare_, liquidityShare_, treasuryShare_);
    }
```

The `setShares` function allows the owner of the contract to set the share percentages for distributing, adding liquidity, and sending to the treasury. It requires that the three share percentages being set must add up to 1000, and that each share percentage must be within the specified minimum and maximum values (`minShare` and `maxShare`). Once the share percentages have been set, it emits a `SharesSet` event with the new share percentages as arguments.

This function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This is implemented by calling the `_checkOwner` function, which checks that the caller of the function is the owner of the contract by comparing the caller's address to the `_owner` address stored in the contract. If the caller is not the owner, the function will throw an exception and terminate.

```js
    function setRouter(address router_) external onlyOwner {
        require(router_ != address(router));
        router = IUniswapV2Router(router_);
        emit RouterSet(router_);
    }
```

The `setRouter` function allows the owner of the contract to set the address of the V2 exchange that the contract will interact with. It requires that the new router address being set is different from the current router address stored in the contract.

Once the new router address has been set, the contract will store it in the `router` variable and cast it to the `IUniswapV2Router` interface. This will allow the contract to call functions on the V2 exchange using the `router` variable. For example, the contract could call the `addLiquidityETH` function on the V2 exchange by calling `router.addLiquidityETH(...)`.

Finally, the function emits a `RouterSet` event with the new router address as an argument. This event can be used by external parties to track changes to the router address stored in the contract.

Like the `setShares` function, this function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function setOffRampPair(address offRampPairAddress) external onlyOwner {
        require(offRampPair != offRampPairAddress);
        offRampPair = offRampPairAddress;
        emit OffRampPairSet(offRampPairAddress);
    }
```

The `setOffRampPair` function allows the owner of the contract to set the address of an off-ramp pair for the X7R cryptocurrency. An off-ramp pair is a liquidity pool on a decentralized exchange (DEX) that allows users to trade X7R for another cryptocurrency, such as Ether (ETH).

The function requires that the new off-ramp pair address being set is different from the current off-ramp pair address stored in the contract. Once the new off-ramp pair address has been set, it stores it in the `offRampPair` variable.

Finally, the function emits an `OffRampPairSet` event with the new off-ramp pair address as an argument. This event can be used by external parties to track changes to the off-ramp pair address stored in the contract.

Like the `setShares` and `setRouter` functions, this function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function setBalanceThreshold(uint256 threshold) external onlyOwner {
        require(!balanceThresholdFrozen);
        balanceThreshold = threshold;
        emit BalanceThresholdSet(threshold);
    }
```

The `setBalanceThreshold` function allows the owner of the contract to set the balance threshold for the contract. The balance threshold is a minimum balance that the contract must maintain in order to ensure that it has sufficient funds to perform its functions.

The function requires that the balance threshold has not been frozen, which means that it can only be set if the `balanceThresholdFrozen` variable is `false`. Once the new balance threshold has been set, it stores it in the `balanceThreshold` variable.

Finally, the function emits a `BalanceThresholdSet` event with the new balance threshold as an argument. This event can be used by external parties to track changes to the balance threshold stored in the contract.

Like the previous functions, this function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function setLiquidityRatioTarget(uint256 liquidityRatioTarget_) external onlyOwner {
        require(liquidityRatioTarget_ != liquidityRatioTarget);
        require(liquidityRatioTarget_ >= minLiquidityRatioTarget && liquidityRatioTarget <= maxLiquidityRatioTarget);
        liquidityRatioTarget = liquidityRatioTarget_;
        emit LiquidityRatioTargetSet(liquidityRatioTarget_);
    }
```

The `setLiquidityRatioTarget` function allows the owner of the contract to set the target liquidity ratio for the contract. The liquidity ratio is a measure of the amount of liquidity in the V2 exchange, and it is calculated as the ratio of the total value of X7R tokens in the exchange to the total value of ETH in the exchange.

The function requires that the new liquidity ratio target being set is different from the current liquidity ratio target stored in the contract, and that it is within the specified minimum and maximum values (`minLiquidityRatioTarget` and `maxLiquidityRatioTarget`). Once the new liquidity ratio target has been set, it stores it in the `liquidityRatioTarget` variable.

Finally, the function emits a `LiquidityRatioTargetSet` event with the new liquidity ratio target as an argument. This event can be used by external parties to track changes to the liquidity ratio target stored in the contract.

Like the previous functions, this function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function setLiquidityTokenReceiver(address liquidityTokenReceiver_) external onlyOwner {
        require(
            liquidityTokenReceiver_ != address(0)
            && liquidityTokenReceiver_ != address(0x000000000000000000000000000000000000dEaD)
            && liquidityTokenReceiver != liquidityTokenReceiver_
        );

        address oldLiquidityTokenReceiver = liquidityTokenReceiver;
        liquidityTokenReceiver = liquidityTokenReceiver_;
        emit LiquidityTokenReceiverSet(oldLiquidityTokenReceiver, liquidityTokenReceiver_);
    }
```

The `setLiquidityTokenReceiver` function allows the owner of the contract to set the address of the liquidity token receiver. The liquidity token receiver is the address that will receive the liquidity tokens when they are generated by the contract.

The function requires that the new liquidity token receiver address being set is not the zero address (`0x0`) or the special Ethereum address `0x000000000000000000000000000000000000dEaD`, and that it is different from the current liquidity token receiver address stored in the contract. Once the new liquidity token receiver address has been set, it stores it in the `liquidityTokenReceiver` variable.

Finally, the function emits a `LiquidityTokenReceiverSet` event with the old liquidity token receiver address and the new liquidity token receiver address as arguments. This event can be used by external parties to track changes to the liquidity token receiver address stored in the contract.

This function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function setDistributionTarget(address target) external onlyOwner {
        require(
            target != address(0)
            && target != address(0x000000000000000000000000000000000000dEaD)
            && distributeTarget != payable(target)
        );
        require(!distributeTargetFrozen);
        address oldTarget = address(distributeTarget);
        distributeTarget = payable(target);
        emit DistributeTargetSet(oldTarget, distributeTarget);
    }
```

The `setDistributionTarget` function allows the owner of the contract to set the address of the distribute target. The distribute target is the address that will receive a share of the X7R tokens generated by the contract when they are distributed.

The function requires that the new distribute target address being set is not the zero address (`0x0`) or the special Ethereum address `0x000000000000000000000000000000000000dEaD`, and that it is different from the current distribute target address stored in the contract. It also requires that the distribute target has not been frozen, which means that it can only be set if the `distributeTargetFrozen` variable is `false`. Once the new distribute target address has been set, it stores it in the `distributeTarget` variable as a payable address.

Finally, the function emits a `DistributeTargetSet` event with the old distribute target address and the new distribute target address as arguments. This event can be used by external parties to track changes to the distribute target address stored in the contract.

This function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function setTreasuryTarget(address target) external onlyOwner {
        require(
            target != address(0)
            && target != address(0x000000000000000000000000000000000000dEaD)
            && treasuryTarget != payable(target)
        );
        require(!treasuryTargetFrozen);
        address oldTarget = address(treasuryTarget);
        treasuryTarget = payable(target);
        emit TreasuryTargetSet(oldTarget, target);
    }
```

The `setTreasuryTarget` function allows the owner of the contract to set the address of the treasury target. The treasury target is the address that will receive a share of the X7R tokens generated by the contract when they are sent to the treasury.

The function requires that the new treasury target address being set is not the zero address (`0x0`) or the special Ethereum address `0x000000000000000000000000000000000000dEaD`, and that it is different from the current treasury target address stored in the contract. It also requires that the treasury target has not been frozen, which means that it can only be set if the `treasuryTargetFrozen` variable is `false`. Once the new treasury target address has been set, it stores it in the `treasuryTarget` variable as a payable address.

Finally, the function emits a `TreasuryTargetSet` event with the old treasury target address and the new treasury target address as arguments. This event can be used by external parties to track changes to the treasury target address stored in the contract.

This function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function freezeTreasuryTarget() external onlyOwner {
        require(!treasuryTargetFrozen);
        treasuryTargetFrozen = true;
        emit TreasuryTargetFrozen();
    }
```

The `freezeTreasuryTarget` function allows the owner of the contract to freeze the treasury target, which means that it cannot be changed. This function is useful for ensuring that the treasury target address remains unchanged after it has been set.

The function requires that the treasury target has not already been frozen, which means that it can only be called if the `treasuryTargetFrozen` variable is `false`. Once the function has been called, it sets the `treasuryTargetFrozen` variable to `true`.

Finally, the function emits a `TreasuryTargetFrozen` event. This event can be used by external parties to track when the treasury target has been frozen.

This function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function freezeDistributeTarget() external onlyOwner {
        require(!distributeTargetFrozen);
        distributeTargetFrozen = true;
        emit DistributeTargetFrozen();
    }
```

The `freezeDistributeTarget` function allows the owner of the contract to freeze the distribute target, which means that it cannot be changed. This function is useful for ensuring that the distribute target address remains unchanged after it has been set.

The function requires that the distribute target has not already been frozen, which means that it can only be called if the `distributeTargetFrozen` variable is `false`. Once the function has been called, it sets the `distributeTargetFrozen` variable to `true`.

Finally, the function emits a `DistributeTargetFrozen` event. This event can be used by external parties to track when the distribute target has been frozen.

This function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function freezeBalanceThreshold() external onlyOwner {
        require(!balanceThresholdFrozen);
        balanceThresholdFrozen = true;
        emit BalanceThresholdFrozen();
    }
```

The `freezeBalanceThreshold` function allows the owner of the contract to freeze the balance threshold, which means that it cannot be changed. This function is useful for ensuring that the balance threshold remains unchanged after it has been set.

The function requires that the balance threshold has not already been frozen, which means that it can only be called if the `balanceThresholdFrozen` variable is `false`. Once the function has been called, it sets the `balanceThresholdFrozen` variable to `true`.

Finally, the function emits a `BalanceThresholdFrozen` event. This event can be used by external parties to track when the balance threshold has been frozen.

This function is also marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```js
    function processFees(address tokenAddress) external {
        uint256 startingETHBalance = address(this).balance;

        uint256 tokensToSwap = IERC20(tokenAddress).balanceOf(address(this));

        if (tokenAddress == address(x7r)) {
            tokensToSwap -= x7rLiquidityBalance;
        }

        if (tokensToSwap > 0) {
            swapTokensForEth(tokenAddress, tokensToSwap);
        }

        uint256 ETHForDistribution = address(this).balance - startingETHBalance;

        distributeBalance += ETHForDistribution * distributeShare / 1000;
        treasuryBalance += ETHForDistribution * treasuryShare / 1000;
        liquidityBalance = address(this).balance - distributeBalance - treasuryBalance;

        if (distributeBalance >= balanceThreshold) {
            sendDistributeBalance();
        }

        if (treasuryBalance >= balanceThreshold) {
            sendTreasuryBalance();
        }

        if (liquidityBalance >= balanceThreshold) {
            buyBackAndAddLiquidity();
        }
    }
```

The `processFees` function is called by external parties to process fees that have been collected by the contract. The function takes an address of a token contract as an argument, and processes the fees in the form of that token.

The function starts by calculating the contractÔÇÖs starting balance of ETH, and then calculates the number of tokens to swap by calling the `balanceOf` function on the token contract with the contract's address as the argument. If the token being processed is the X7R token, it subtracts the X7R liquidity balance from the total number of tokens to ensure that the liquidity balance is not included in the swap.

If there are any tokens to swap, the function calls the `swapTokensForEth` function to swap the tokens for ETH. It then calculates the amount of ETH available for distribution by subtracting the starting ETH balance from the contract's current ETH balance.

The function then calculates the distribute balance, treasury balance, and liquidity balance by allocating the available ETH according to the distribute share, treasury share, and liquidity share. If the distribute balance or treasury balance is greater than or equal to the balance threshold, the function calls the `sendDistributeBalance` or `sendTreasuryBalance` function to send the balance to the appropriate target address. If the liquidity balance is greater than or equal to the balance threshold, the function calls the `buyBackAndAddLiquidity` function to buy back and add liquidity to the X7R/ETH pair.

```js
   function sendDistributeBalance() public {
        if (distributeTarget == address(0)) {
            return;
        }

        IX7EcosystemSplitter(distributeTarget).takeBalance();

        uint256 ethToSend = distributeBalance;
        distributeBalance = 0;

        (bool success,) = distributeTarget.call{value: ethToSend}("");

        if (!success) {
            distributeBalance = ethToSend;
        }
    }
```

The `sendDistributeBalance` function is called by the `processFees` function to send the distribute balance to the distribute target address. The distribute target address is the address that receives a share of the X7R tokens generated by the contract when they are distributed.

The function first checks if the distribute target address is the zero address (`0x0`). If it is, the function immediately returns without doing anything.

The function then calls the `takeBalance` function on the distribute target contract, which is assumed to be an instance of the `IX7EcosystemSplitter` interface. This function allows the distribute target contract to take the distribute balance from the contract.

The function then sets the distribute balance to zero and tries to send the ETH to the distribute target address using a contract call. If the call is successful, the function returns without doing anything further. If the call is unsuccessful, the function sets the distribute balance back to the original value, so that it can be tried again in the future.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the `processFees` function, which is only called by the contract owner.

```js
    function sendTreasuryBalance() public {
        if (treasuryTarget == address(0)) {
            return;
        }

        uint256 ethToSend = treasuryBalance;
        treasuryBalance = 0;

        (bool success,) = treasuryTarget.call{value: ethToSend}("");

        if (!success) {
            treasuryBalance = ethToSend;
        }
    }
```

The `sendTreasuryBalance` function is similar to the `sendDistributeBalance` function, but it is called to send the treasury balance to the treasury target address instead of the distribute balance to the distribute target address.

The treasury target address is the address that receives a share of the fees collected by the contract. Like the distribute target address, the treasury target address is specified by the owner of the contract.

The function first checks if the treasury target address is the zero address (`0x0`). If it is, the function immediately returns without doing anything.

The function then sets the treasury balance to zero and tries to send the ETH to the treasury target address using a contract call. If the call is successful, the function returns without doing anything further. If the call is unsuccessful, the function sets the treasury balance back to the original value, so that it can be tried again in the future.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the `processFees` function, which is only called by the contract owner.

```js
   function buyBackAndAddLiquidity() internal {
        uint256 ethForSwap;
        uint256 startingETHBalance = address(this).balance;

        if (x7r.balanceOf(offRampPair) > x7r.circulatingSupply() * liquidityRatioTarget / 100 ) {
            ethForSwap = liquidityBalance;
            liquidityBalance = 0;
            swapEthForTokens(ethForSwap);
        } else {
            ethForSwap = liquidityBalance;
            liquidityBalance = 0;

            if (x7r.balanceOf(address(this)) > 0) {
                addLiquidityETH(x7r.balanceOf(address(this)), ethForSwap);
                ethForSwap = ethForSwap - (startingETHBalance - address(this).balance);
            }

            if (ethForSwap > 0) {
                uint256 ethLeft = ethForSwap;
                ethForSwap = ethLeft / 2;
                uint256 ethForLiquidity = ethLeft - ethForSwap;
                swapEthForTokens(ethForSwap);
                addLiquidityETH(x7r.balanceOf(address(this)), ethForLiquidity);
            }
        }

        x7rLiquidityBalance = x7r.balanceOf(address(this));

    }
```

The `buyBackAndAddLiquidity` function is called by the `processFees` function when the liquidity balance is greater than or equal to the balance threshold. The function is used to buy back X7R tokens from the market and add them to the X7R/ETH liquidity pool.

The function starts by calculating the starting ETH balance of the contract and initializing a variable called `ethForSwap` to the value of the liquidity balance. It then checks if the balance of X7R tokens in the off-ramp pair (an exchange pair used to facilitate the transfer of X7R tokens to and from the pool) is greater than the target liquidity ratio. If it is, the function calls the `swapEthForTokens` function to swap the ETH in the liquidity balance for X7R tokens.

If the balance of X7R tokens in the off-ramp pair is not greater than the target liquidity ratio, the function first checks if the contract has any X7R tokens. If it does, it calls the `addLiquidityETH` function to add the X7R tokens and the remaining ETH in the liquidity balance to the pool.

If there are still some ETH left after adding liquidity, the function splits the remaining ETH into two equal parts and uses one part to buy back X7R tokens and the other part to add liquidity to the pool.

Finally, the function updates the X7R liquidity balance to the current balance of X7R tokens in the contract.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the `processFees` function, which is only called by the contract owner.

```js
    function addLiquidityETH(uint256 tokenAmount, uint256 ethAmount) internal {
        x7r.approve(address(router), tokenAmount);
        router.addLiquidityETH{value: ethAmount}(
            address(x7r),
            tokenAmount,
            0,
            0,
            liquidityTokenReceiver,
            block.timestamp
        );
    }
```

The `addLiquidityETH` function is called by the `buyBackAndAddLiquidity` function to add X7R tokens and ETH to the X7R/ETH liquidity pool.

The function starts by approving the router contract to transfer the specified amount of X7R tokens on behalf of the contract. It then calls the `addLiquidityETH` function of the router contract to add the X7R tokens and ETH to the pool. The `addLiquidityETH` function is a standard function of the V2 Router contract and is used to add liquidity to any V2 pool.

The function passes the following arguments to the `addLiquidityETH` function of the router contract:

- `address(x7r)`: The address of the X7R token contract.
- `tokenAmount`: The amount of X7R tokens to add to the pool.
- `0`: The minimum amount of X7R tokens that the function should return.
- `0`: The minimum amount of ETH that the function should return.
- `liquidityTokenReceiver`: The address to receive the liquidity tokens, which represent the ownership share in the pool.
- `block.timestamp`: The deadline for the function to complete.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the `buyBackAndAddLiquidity` function, which is only called by the `processFees` function, which is only called by the contract owner.

```js
    function swapTokensForEth(address tokenAddress, uint256 tokenAmount) internal {
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

The `swapTokensForEth` function is called by the `processFees` function to exchange the specified amount of tokens for ETH. The function calls the `swapExactTokensForETHSupportingFeeOnTransferTokens` function of the Router contract to perform the token-to-ETH swap.

The `swapExactTokensForETHSupportingFeeOnTransferTokens` function is a standard function of the V2 Router contract and is used to exchange a specified amount of tokens for the equivalent amount of ETH. The function takes the following arguments:

- `tokenAmount`: The amount of tokens to exchange.
- `0`: The minimum amount of ETH that the function should return.
- `path`: The array of addresses representing the path of tokens to swap through. In this case, the array contains only two addresses: the token contract address and the WETH contract address.
- `address(this)`: The address to receive the ETH.
- `block.timestamp`: The deadline for the function to complete.

Before calling the `swapExactTokensForETHSupportingFeeOnTransferTokens` function, the `swapTokensForEth` function first calls the `approve` function of the token contract to allow the router contract to transfer the specified amount of tokens on behalf of the contract. This is required because the `swapExactTokensForETHSupportingFeeOnTransferTokens` function transfers the tokens on behalf of the contract.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the `processFees` function, which is only called by the contract owner.

```js
    function swapEthForTokens(uint256 ethAmount) internal {
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = address(x7r);
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0,
            path,
            address(this),
            block.timestamp
        );
    }
```

The `swapTokensForEth` function is called by the `processFees` function to exchange the specified amount of tokens for ETH. The function calls the `swapExactTokensForETHSupportingFeeOnTransferTokens` function of the V2 Router contract to perform the token-to-ETH swap.

The `swapExactTokensForETHSupportingFeeOnTransferTokens` function is a standard function of the V2 Router contract and is used to exchange a specified amount of tokens for the equivalent amount of ETH. The function takes the following arguments:

- `tokenAmount`: The amount of tokens to exchange.
- `0`: The minimum amount of ETH that the function should return.
- `path`: The array of addresses representing the path of tokens to swap through. In this case, the array contains only two addresses: the token contract address and the WETH contract address.
- `address(this)`: The address to receive the ETH.
- `block.timestamp`: The deadline for the function to complete.

Before calling the `swapExactTokensForETHSupportingFeeOnTransferTokens` function, the `swapTokensForEth` function first calls the `approve` function of the token contract to allow the router contract to transfer the specified amount of tokens on behalf of the contract. This is required because the `swapExactTokensForETHSupportingFeeOnTransferTokens` function transfers the tokens on behalf of the contract.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the `processFees` function, which is only called by the contract owner.

```js
    function rescueWETH() external {
        address wethAddress = router.WETH();
        IWETH(wethAddress).withdraw(IERC20(wethAddress).balanceOf(address(this)));
    }
```

The `rescueWETH` function is used to withdraw the balance of the contract from the WETH contract. The WETH contract is a smart contract implementation of the ERC20 Wrapped Ether (WETH) standard, which allows users to wrap Ether (ETH) in a ERC20-compliant token.

The function first retrieves the address of the WETH contract by calling the `WETH` function of the V2 Router contract. Then it calls the `withdraw` function of the WETH contract, passing in the balance of the contract as an argument. This function transfers the specified amount of WETH from the contract to the contract owner.

This function does not have any access control, which means that it can be called by any external party. However, it is generally only called by the contract owner.
