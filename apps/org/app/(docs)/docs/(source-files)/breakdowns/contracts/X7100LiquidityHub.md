---
title: X7100 Liquidity Hub Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-finance-x7100-liquidity-hub-contract-1ed44358a9cf

The contract has several variables that store information about the distribution of liquidity, including `distributeShare`, `liquidityShare`, `lendingPoolShare`, and `treasuryShare`. It also has variables that store information about the targets for these distributions, such as `distributeTarget` and `lendingPoolTarget`.

```solidity
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

```solidity
    function setShares(uint256 distributeShare_, uint256 liquidityShare_, uint256 lendingPoolShare_, uint256 treasuryShare_) external onlyOwner {
        require(distributeShare + liquidityShare + lendingPoolShare + treasuryShare == 1000);

        require(distributeShare_ >= minShare && distributeShare_ <= maxShare);
        require(liquidityShare_ >= minShare && liquidityShare_ <= maxShare);
        require(lendingPoolShare_ >= minShare && lendingPoolShare_ <= maxShare);
        require(treasuryShare_ >= minShare && treasuryShare_ <= maxShare);

        distributeShare = distributeShare_;
        liquidityShare = liquidityShare_;
        lendingPoolShare = lendingPoolShare_;
        treasuryShare = treasuryShare_;

        emit SharesSet(distributeShare_, liquidityShare_, lendingPoolShare_, treasuryShare_);
    }
```

The `setShares` function allows the owner of the contract to modify the distribution of liquidity in the liquidity hub. The function takes four arguments, `distributeShare_`, `liquidityShare_`, `lendingPoolShare_`, and `treasuryShare_`, which represent the new values for the `distributeShare`, `liquidityShare`, `lendingPoolShare`, and `treasuryShare` variables, respectively.

The function first checks that the sum of the four input values is equal to 1000, with the total percentage being 100.

The function then checks that each of the input values is within a certain range, specified by the `minShare` and `maxShare` variables. This is likely to ensure that the distribution of liquidity is not set to an unreasonable value.

If these checks pass, the function sets the values of the `distributeShare`, `liquidityShare`, `lendingPoolShare`, and `treasuryShare` variables to the input values. It then emits the `SharesSet` event, which includes the new values for these variables as arguments.

```solidity
    function setRouter(address router_) external onlyOwner {
        require(router_ != address(router));
        router = IUniswapV2Router(router_);
        emit RouterSet(router_);
    }
```

The `setRouter` function allows the owner of the contract to modify the address of the V2 router contract that is being used by the liquidity hub. The function takes a single argument, `router_`, which is the new address of the router contract.

The function first checks that the new address is different from the current address of the router contract. This is to prevent the function from being used to set the address of the router contract to the same value it is already set to.

If this check passes, the function sets the value of the `router` variable to the new address, after casting it to the `IUniswapV2Router` interface. The function then emits the `RouterSet` event, which includes the new address of the router contract as an argument.

```solidity
    function setOffRampPair(address tokenAddress, address offRampPairAddress) external onlyOwner {
        require(nativeTokenPairs[tokenAddress] != offRampPairAddress);
        nativeTokenPairs[tokenAddress] = offRampPairAddress;
        emit OffRampPairSet(tokenAddress, offRampPairAddress);
    }
```

Allows the owner of the contract to set a specific ÔÇ£off-rampÔÇØ pair for a given token on the liquidity hub. An off-ramp pair is a specific pair on the exchange that can be used to trade a token for another asset, such as a stablecoin, which can then be withdrawn from the exchange.

The function takes two arguments: `tokenAddress`, which is the address of the token for which an off-ramp pair is being set, and `offRampPairAddress`, which is the address of the V2 pair that will serve as the off-ramp for the token.

The function first checks that the off-ramp pair for the given token is not already set to the same value as the input pair. This is likely to prevent the function from being used to set the off-ramp pair to the same value it is already set to.

If this check passes, the function sets the off-ramp pair for the given token to the input pair by storing the pairÔÇÖs address in the `nativeTokenPairs` mapping. The function then emits the `OffRampPairSet` event, which includes the token address and the off-ramp pair address as arguments.

```solidity
    function setBalanceThreshold(uint256 threshold) external onlyOwner {
        require(!balanceThresholdFrozen);
        balanceThreshold = threshold;
        emit BalanceThresholdSet(threshold);
    }
```

Allows the owner of the contract to set a threshold for the balance of the contract. The function is used to prevent the contract from executing certain actions if the contract's balance falls below this threshold.

The function takes a single argument, `threshold`, which is the new balance threshold for the contract.

The function first checks that the `balanceThresholdFrozen` variable is not set to `true`. This variable is likely used to prevent the balance threshold from being changed once it has been set.

If the `balanceThresholdFrozen` variable is not set to `true`, the function sets the value of the `balanceThreshold` variable to the input threshold. It then emits the `BalanceThresholdSet` event, which includes the new balance threshold as an argument. This allows other contracts or external parties to be notified when the balance threshold has been changed.

```solidity
 function setLiquidityBalanceThreshold(uint256 threshold) external onlyOwner {
        require(!liquidityBalanceThresholdFrozen);
        liquidityBalanceThreshold = threshold;
        emit LiquidityBalanceThresholdSet(threshold);
    }
```

The `setLiquidityBalanceThreshold` function allows the owner of the contract to set a threshold for the balance of the contract's liquidity token. It seems that the function is used to prevent the contract from executing certain actions if the balance of the liquidity token falls below this threshold.

The function takes a single argument, `threshold`, which is the new liquidity balance threshold for the contract.

The function first checks that the `liquidityBalanceThresholdFrozen` variable is not set to `true`. This variable is likely used to prevent the liquidity balance threshold from being changed once it has been set.

If the `liquidityBalanceThresholdFrozen` variable is not set to `true`, the function sets the value of the `liquidityBalanceThreshold` variable to the input threshold. It then emits the `LiquidityBalanceThresholdSet` event, which includes the new liquidity balance threshold as an argument. This allows other contracts or external parties to be notified when the liquidity balance threshold has been changed.

```solidity
    function setLiquidityRatioTarget(uint256 liquidityRatioTarget_) external onlyOwner {
        require(liquidityRatioTarget_ != liquidityRatioTarget);
        require(liquidityRatioTarget_ >= minLiquidityRatioTarget && liquidityRatioTarget <= maxLiquidityRatioTarget);
        liquidityRatioTarget = liquidityRatioTarget_;
        emit LiquidityRatioTargetSet(liquidityRatioTarget_);
    }
```

This allows the owner of the contract to set a target for the liquidity ratio of the liquidity hub. The liquidity ratio is the ratio of the total value of a token in the liquidity pool to the total value of the liquidity token.

The function takes a single argument, `liquidityRatioTarget_`, which is the new liquidity ratio target for the contract.

The function first checks that the new liquidity ratio target is different from the current liquidity ratio target, and that it is within a certain range specified by the `minLiquidityRatioTarget` and `maxLiquidityRatioTarget` variables. This is to ensure that the liquidity ratio target is not set to an unreasonable value.

If these checks pass, the function sets the value of the `liquidityRatioTarget` variable to the input target. It then emits the `LiquidityRatioTargetSet` event, which includes the new liquidity ratio target as an argument. This allows other contracts or external parties to be notified when the liquidity ratio target has been changed.

```solidity
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

The `setLiquidityTokenReceiver` function is to allow the owner of the contract to set an address that will receive the liquidity token when it is withdrawn from the liquidity hub. The liquidity token is a token that represents the total liquidity in the liquidity pool.

The function takes a single argument, `liquidityTokenReceiver_`, which is the new address that will receive the liquidity token when it is withdrawn.

The function first checks that the new liquidity token receiver is not the zero address or the ÔÇ£deadÔÇØ address (an address with all zeros) and that it is different from the current liquidity token receiver. This is likely to ensure that the liquidity token is not accidentally sent to an invalid address.

If these checks pass, the function sets the value of the `liquidityTokenReceiver` variable to the input address. It then emits the `LiquidityTokenReceiverSet` event, which includes the old liquidity token receiver and the new liquidity token receiver as arguments. This allows other contracts or external parties to be notified when the liquidity token receiver has been changed.

```solidity
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

The `setDistributionTarget` function is to allow the owner of the contract to set an address that will receive a portion of the funds in the contract's distribute balance. The distribute balance is a balance of funds that are set aside for distribution to a specific address or for a specific purpose.

The function takes a single argument, `target`, which is the new address that will receive the funds from the distribute balance.

The function first checks that the new distribution target is not the zero address or the ÔÇ£deadÔÇØ address (an address with all zeros) and that it is different from the current distribution target. This is likely to ensure that the funds are not accidentally sent to an invalid address.

The function also checks that the `distributeTargetFrozen` variable is not set to `true`. This variable is used to prevent the distribution target from being changed once it has been set.

If these checks pass, the function sets the value of the `distributeTarget` variable to the input address, after casting it to a payable address. It then emits the `DistributeTargetSet` event, which includes the old distribution target and the new distribution target as arguments. This allows other contracts or external parties to be notified when the distribution target has been changed.

```solidity
 function setLendingPoolTarget(address target) external onlyOwner {
        require(
            target != address(0) &&
            target != address(0x000000000000000000000000000000000000dEaD)
            && lendingPoolTarget != payable(target)
        );
        require(!lendingPoolTargetFrozen);
        address oldTarget = address(lendingPoolTarget);
        lendingPoolTarget = payable(target);
        emit LendingPoolTargetSet(oldTarget, target);
    }
```

The `setLendingPoolTarget` function is to allow the owner of the contract to set an address that will receive a portion of the funds in the contract's lending pool balance. The lending pool balance is a balance of funds that are set aside for distribution to a specific lending pool or for a specific lending-related purpose.

The function takes a single argument, `target`, which is the new address that will receive the funds from the lending pool balance.

The function first checks that the new lending pool target is not the zero address or the ÔÇ£deadÔÇØ address (an address with all zeros) and that it is different from the current lending pool target. This is to ensure that the funds are not accidentally sent to an invalid address.

The function also checks that the `lendingPoolTargetFrozen` variable is not set to `true`. This variable is used to prevent the lending pool target from being changed once it has been set.

If these checks pass, the function sets the value of the `lendingPoolTarget` variable to the input address, after casting it to a payable address. It then emits the `LendingPoolTargetSet` event, which includes the old lending pool target and the new lending pool target as arguments. This allows other contracts or external parties to be notified when the lending pool target has been changed.

```solidity
    function setConstellationToken(address tokenAddress, bool isQuint) external onlyOwner {
        require(isConstellationToken[tokenAddress] != isQuint);
        isConstellationToken[tokenAddress] = isQuint;
        emit ConstellationTokenSet(tokenAddress, isQuint);
    }
```

The `setConstellationToken` function is to allow the owner of the contract to set whether a specific token is a "constellation token" \[Quint\] or not. The constellation token is a consistent collection of five tokens. These act as the backstop to the Lending Pool. The X7100 series of tokens are burned on every transaction. While continually raising its floor price

The function takes two arguments:

- `tokenAddress`, which is the address of the token whose constellation token status is being set.
- `isQuint`, which is a boolean value indicating whether the token is a constellation token or not.

The function first checks that the new constellation token status is different from the current constellation token status for the input token. This is to ensure that the status is only changed if it is necessary.

If this check passes, the function sets the value of the `isConstellationToken[tokenAddress]` mapping to the input value. It then emits the `ConstellationTokenSet` event, which includes the address of the token and its new constellation token status as arguments. This allows other contracts or external parties to be notified when the constellation token status of a token has been changed.

```solidity
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

The `setTreasuryTarget` function is to allow the owner of the contract to set an address that will receive a portion of the funds in the contract's treasury balance. The treasury balance is a balance of funds that are set aside for distribution to a specific address or for a specific purpose related to the contract's treasury.

The function takes a single argument, `target`, which is the new address that will receive the funds from the treasury balance.

The function first checks that the new treasury target is not the zero address or the ÔÇ£deadÔÇØ address (an address with all zeros) and that it is different from the current treasury target. This is likely to ensure that the funds are not accidentally sent to an invalid address.

The function also checks that the `treasuryTargetFrozen` variable is not set to `true`. This variable is used to prevent the treasury target from being changed once it has been set.

If these checks pass, the function sets the value of the `treasuryTarget` variable to the input address, after casting it to a payable address. It then emits the `TreasuryTargetSet` event, which includes the old treasury target and the new treasury target as arguments. This allows other contracts or external parties to be notified when the treasury target has been changed.

```solidity
    function freezeTreasuryTarget() external onlyOwner {
        require(!treasuryTargetFrozen);
        treasuryTargetFrozen = true;
        emit TreasuryTargetFrozen();
    }
```

The `freezeTreasuryTarget` function is to allow the owner of the contract to freeze the contract's treasury target, which is an address that receives a portion of the funds in the contract's treasury balance. This function is likely used to prevent the treasury target from being changed once it has been set.

The function does not take any arguments and only has a single line of code, which sets the value of the `treasuryTargetFrozen` variable to `true`. This variable is a boolean flag that is used to track the frozen status of the treasury target.

The function also emits the `TreasuryTargetFrozen` event to allow other contracts or external parties to be notified when the treasury target has been frozen.

```solidity
    function freezeLendingPoolTarget() external onlyOwner {
        require(!lendingPoolTargetFrozen);
        lendingPoolTargetFrozen = true;
        emit LendingPoolTargetFrozen();
    }
```

The `freezeDistributeTarget` function is to allow the owner of the contract to freeze the contract's distribute target, which is an address that receives a portion of the funds in the contract's distribute balance. This function is likely used to prevent the distribute target from being changed once it has been set.

The function does not take any arguments and only has a single line of code, which sets the value of the `distributeTargetFrozen` variable to `true`. This variable is a boolean flag that is used to track the frozen status of the distribute target.

The function also emits the `DistributeTargetFrozen` event to allow other contracts or external parties to be notified when the distribute target has been frozen.

```solidity
    function freezeLendingPoolTarget() external onlyOwner {
        require(!lendingPoolTargetFrozen);
        lendingPoolTargetFrozen = true;
        emit LendingPoolTargetFrozen();
    }
```

The `freezeLendingPoolTarget` function is to allow the owner of the contract to freeze the contract's lending pool target, which is an address that receives a portion of the funds in the contract's lending pool balance. This function is used to prevent the lending pool target from being changed once it has been set.

The function does not take any arguments and only has a single line of code, which sets the value of the `lendingPoolTargetFrozen` variable to `true`. This variable is a boolean flag that is used to track the frozen status of the lending pool target.

The function also emits the `LendingPoolTargetFrozen` event to allow other contracts or external parties to be notified when the lending pool target has been frozen.

```solidity
    function freezeBalanceThreshold() external onlyOwner {
        require(!balanceThresholdFrozen);
        balanceThresholdFrozen = true;
        emit BalanceThresholdFrozen();
    }
```

The `freezeBalanceThreshold` function is to allow the owner of the contract to freeze the contract's balance threshold. The balance threshold is a value that is used to determine when the contract's balance has reached a certain level and should be distributed to the contract's distribute target or other destinations. This function is used to prevent the balance threshold from being changed once it has been set.

The function does not take any arguments and only has a single line of code, which sets the value of the `balanceThresholdFrozen` variable to `true`. This variable is a boolean flag that is used to track the frozen status of the balance threshold.

The function also emits the `BalanceThresholdFrozen` event to allow other contracts or external parties to be notified when the balance threshold has been frozen.

```solidity
    function freezeLiquidityBalanceThreshold() external onlyOwner {
        require(!liquidityBalanceThresholdFrozen);
        liquidityBalanceThresholdFrozen = true;
        emit LiquidityBalanceThresholdFrozen();
    }
```

The `freezeLiquidityBalanceThreshold` function is to allow the owner of the contract to freeze the contract's liquidity balance threshold. The liquidity balance threshold is a value that is used to determine when the contract's liquidity balance has reached a certain level and should be distributed to the contract's liquidity token receiver or other destinations. This function is used to prevent the liquidity balance threshold from being changed once it has been set.

The function does not take any arguments and only has a single line of code, which sets the value of the `liquidityBalanceThresholdFrozen` variable to `true`. This variable is a boolean flag that is used to track the frozen status of the liquidity balance threshold.

The function also emits the `LiquidityBalanceThresholdFrozen` event to allow other contracts or external parties to be notified when the liquidity balance threshold has been frozen.

```solidity
    function freezeConstellationTokens() external onlyOwner {
        require(!constellationTokensFrozen);
        constellationTokensFrozen = true;
        emit ConstellationTokensFrozen();
    }
```

The `freezeConstellationTokens` function is to allow the owner of the contract to freeze the contract's constellation tokens. Constellation tokens are a specific type of token that are tracked by the contract, and this function is used to prevent these tokens from being modified or changed once they have been set.

The function does not take any arguments and only has a single line of code, which sets the value of the `constellationTokensFrozen` variable to `true`. This variable is a boolean flag that is used to track the frozen status of the constellation tokens.

The function also emits the `ConstellationTokensFrozen` event to allow other contracts or external parties to be notified when the constellation tokens have been frozen.

```solidity
    function processFees(address tokenAddress) external {
        uint256 startingETHBalance = address(this).balance;

        uint256 tokensToSwap = IERC20(tokenAddress).balanceOf(address(this));

        bool processingConstellationToken = isConstellationToken[tokenAddress];

        if (processingConstellationToken) {
            tokensToSwap -= liquidityTokenBalance[tokenAddress];
        }

        if (tokensToSwap > 0) {
            swapTokensForEth(tokenAddress, tokensToSwap);
        }

        if (leastLiquidTokenAddress == address(0) && processingConstellationToken) {
            leastLiquidTokenAddress = tokenAddress;
        } else if (processingConstellationToken && tokenAddress != leastLiquidTokenAddress) {
            uint256 pairETHBalance = IERC20(router.WETH()).balanceOf(nativeTokenPairs[tokenAddress]);
            uint256 leastLiquidTokenPairETHBalance = IERC20(router.WETH()).balanceOf(nativeTokenPairs[leastLiquidTokenAddress]);

            if (pairETHBalance <= leastLiquidTokenPairETHBalance) {
                leastLiquidTokenAddress = tokenAddress;
            }
        }

        uint256 ETHForDistribution = address(this).balance - startingETHBalance;

        distributeBalance += ETHForDistribution * distributeShare / 1000;
        lendingPoolBalance += ETHForDistribution * lendingPoolShare / 1000;
        treasuryBalance += ETHForDistribution * treasuryShare / 1000;
        liquidityBalance = address(this).balance - distributeBalance - lendingPoolBalance - treasuryBalance;

        if (distributeBalance >= balanceThreshold) {
            sendDistributeBalance();
        }

        if (lendingPoolBalance >= balanceThreshold) {
            sendLendingPoolBalance();
        }

        if (treasuryBalance >= balanceThreshold) {
            sendTreasuryBalance();
        }

        if (liquidityBalance >= liquidityBalanceThreshold) {
            buyBackAndAddLiquidity(leastLiquidTokenAddress);
        }
    }
```

The `processFees` function is responsible for processing fees that are paid to the contract in a specific token. The function takes a single argument, `tokenAddress`, which is the address of the token for which the fees are being paid.

The function first calculates the starting balance of the contract in Ether (ETH), and then retrieves the balance of the contract in the token specified by `tokenAddress` using the `balanceOf` function of the ERC20 interface. It then determines if the token is a constellation token, which is a specific type of token tracked by the contract. If the token is a constellation token, the function subtracts the amount of the token that has already been designated as liquidity from the balance.

If the balance of the token is greater than 0, the function calls the `swapTokensForEth` function to convert the tokens to ETH. It then determines if the token is a constellation token and, if so, compares its balance with the balance of the least liquid constellation token. If the balance of the token is less than or equal to the balance of the least liquid token, the function updates the `leastLiquidTokenAddress` variable to the address of the current token.

The function then calculates the amount of ETH that should be distributed to each of the contractÔÇÖs destinations based on the `distributeShare`, `lendingPoolShare`, and `treasuryShare` variables. It adds these amounts to the `distributeBalance`, `lendingPoolBalance`, and `treasuryBalance` variables, respectively, and calculates the remaining balance as the contract's total balance minus these values.

Finally, the function checks the values of each of the balances against their respective thresholds (`balanceThreshold` and `liquidityBalanceThreshold`) and, if any of them are above the threshold, calls the appropriate function to send the balance to the specified destination. If the liquidity balance is above the threshold, the function calls the `buyBackAndAddLiquidity` function, passing it the address of the least liquid constellation token as an argument.

```solidity
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

The `sendDistributeBalance` function is responsible for sending the balance in the `distributeBalance` variable to a specified destination contract.

The function first checks that the `distributeTarget` variable is not the zero address. If it is, the function returns without doing anything. If the `distributeTarget` variable is not the zero address, the function calls the `takeBalance` function of the `IX7EcosystemSplitter` contract at the `distributeTarget` address.

The function then stores the value of the `distributeBalance` variable in a local variable called `ethToSend`, and sets the `distributeBalance` variable to 0. It then attempts to call the fallback function of the `distributeTarget` contract, passing it `ethToSend` as the value of the transaction. If the call is successful, the function returns. If the call is not successful, the function sets the `distributeBalance` variable back to the value of `ethToSend`.

```solidity
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

The `sendTreasuryBalance` function is responsible for sending the balance in the `treasuryBalance` variable to a specified destination contract.

The function first checks that the `treasuryTarget` variable is not the zero address. If it is, the function returns without doing anything. If the `treasuryTarget` variable is not the zero address, the function stores the value of the `treasuryBalance` variable in a local variable called `ethToSend`, and sets the `treasuryBalance` variable to 0. It then attempts to call the fallback function of the `treasuryTarget` contract, passing it `ethToSend` as the value of the transaction. If the call is successful, the function returns. If the call is not successful, the function sets the `treasuryBalance` variable back to the value of `ethToSend`.

```solidity
    function sendLendingPoolBalance() public {
        if (lendingPoolTarget == address(0)) {
            return;
        }

        uint256 ethToSend = lendingPoolBalance;
        lendingPoolBalance = 0;

        (bool success,) = lendingPoolTarget.call{value: ethToSend}("");

        if (!success) {
            lendingPoolBalance = ethToSend;
        }
    }
```

The `sendLendingPoolBalance` function is responsible for sending the balance in the `lendingPoolBalance` variable to a specified destination contract.

The function first checks that the `lendingPoolTarget` variable is not the zero address. If it is, the function returns without doing anything. If the `lendingPoolTarget` variable is not the zero address, the function stores the value of the `lendingPoolBalance` variable in a local variable called `ethToSend`, and sets the `lendingPoolBalance` variable to 0. It then attempts to call the fallback function of the `lendingPoolTarget` contract, passing it `ethToSend` as the value of the transaction. If the call is successful, the function returns. If the call is not successful, the function sets the `lendingPoolBalance` variable back to the value of `ethToSend`.

```solidity
    function buyBackAndAddLiquidity(address tokenAddress) internal {
        uint256 ethForSwap;
        uint256 startingETHBalance = address(this).balance;

        IERC20 token = IERC20(tokenAddress);
        address offRampPair = nativeTokenPairs[tokenAddress];

        if (token.balanceOf(offRampPair) > token.circulatingSupply() * liquidityRatioTarget / 1000 ) {
            ethForSwap = liquidityBalance;
            liquidityBalance = 0;
            swapEthForTokens(tokenAddress, ethForSwap);
        } else {
            ethForSwap = liquidityBalance;
            liquidityBalance = 0;

            if (token.balanceOf(address(this)) > 0) {
                addLiquidityETH(tokenAddress, token.balanceOf(address(this)), ethForSwap);
                ethForSwap = ethForSwap - (startingETHBalance - address(this).balance);
            }

            if (ethForSwap > 0) {
                uint256 ethLeft = ethForSwap;
                ethForSwap = ethLeft / 2;
                uint256 ethForLiquidity = ethLeft - ethForSwap;
                swapEthForTokens(tokenAddress, ethForSwap);
                addLiquidityETH(tokenAddress, token.balanceOf(address(this)), ethForLiquidity);
            }
        }

        liquidityTokenBalance[tokenAddress] = token.balanceOf(address(this));

    }
```

The `buyBackAndAddLiquidity` function is responsible for adding liquidity to the exchange using the specified token. It first checks whether the balance of the specified token in the pair contract is greater than the `liquidityRatioTarget`; if it is, it swaps the entire `liquidityBalance` of the contract for the token and adds the resulting token balance to the pair.

If the balance of the token in the pair is not greater than the `liquidityRatioTarget`, the function first checks whether the contract itself holds any of the token. If it does, it calls the `addLiquidityETH` function with the token balance and a portion of the `liquidityBalance` as arguments. Then, if there is still a portion of the `liquidityBalance` left, it swaps half of it for the token and calls `addLiquidityETH` again with the remaining half of the `liquidityBalance` and the token balance as arguments.

Finally, the function updates the `liquidityTokenBalance` mapping for the specified token to the contract's current balance of the token.

```solidity
    function addLiquidityETH(address tokenAddress, uint256 tokenAmount, uint256 ethAmount) internal {
        IERC20(tokenAddress).approve(address(router), tokenAmount);
        router.addLiquidityETH{value: ethAmount}(
            tokenAddress,
            tokenAmount,
            0,
            0,
            liquidityTokenReceiver,
            block.timestamp
        );
    }
```

This function allows the contract to add liquidity to a V2 exchange pair. The function first approves the router contract to transfer the specified amount of tokens on behalf of the contract. It then calls the `addLiquidityETH` function on the router contract, passing in the token address, the amount of tokens to add, and the amount of ETH to add as liquidity. The `0` values passed in for the minimum liquidity and the deadline are default values used by liquidity pool. The `liquidityTokenReceiver` address is also passed in as the recipient of any liquidity tokens that may be created as a result of the liquidity addition.

```solidity
    function addLiquidityETH(address tokenAddress, uint256 tokenAmount, uint256 ethAmount) internal {
        IERC20(tokenAddress).approve(address(router), tokenAmount);
        router.addLiquidityETH{value: ethAmount}(
            tokenAddress,
            tokenAmount,
            0,
            0,
            liquidityTokenReceiver,
            block.timestamp
        );
    }
```

This function is used to exchange a certain amount of tokens of a given `tokenAddress` for ETH. The function first approves the router contract to move the tokens on behalf of the contract, and then calls the `swapExactTokensForETHSupportingFeeOnTransferTokens` function on the router contract to perform the exchange. The `path` array specifies the route for the token exchange, which in this case is an array with two elements, the `tokenAddress` and the address of the wrapped ETH (WETH) token. The `swapExactTokensForETHSupportingFeeOnTransferTokens` function allows the contract to specify the amount of tokens it wants to exchange and receives the exact amount of ETH in return. It also supports a fee on the token transfer, which means that a small portion of the tokens will be transferred to the router contract as a fee for facilitating the exchange.

```solidity
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

The `swapTokensForEth` function is used to exchange a specified number of tokens for an equivalent amount of ETH, using the exchange contract.

This function first sets up a path array, which specifies the order of tokens to be exchanged. In this case, the path array has two elements: the token to be exchanged and ETH.

Next, the function calls the `approve` function on the token contract to allow the router contract to transfer the specified number of tokens on behalf of the contract.

Finally, the function calls the `swapExactTokensForETHSupportingFeeOnTransferTokens` function on the router contract, passing in the amount of tokens to be exchanged, a value of 0 for the minimum amount of ETH to receive (meaning any amount of ETH is acceptable), the path array, the contract's own address as the recipient of the ETH, and the current block timestamp. This function will execute the token-to-ETH exchange and send the resulting ETH to the contract's address.

```solidity
    function swapEthForTokens(address tokenAddress, uint256 ethAmount) internal {
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = tokenAddress;
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0,
            path,
            address(this),
            block.timestamp
        );
    }
```

It exchanges ETH for tokens instead of tokens for ETH. It first calls the `swapExactETHForTokensSupportingFeeOnTransferTokens` function of the router contract, passing in the amount of ETH to exchange, the path of tokens to receive, and the recipient of the tokens. This function will transfer the specified amount of ETH from the contract's balance to the router contract and return the specified tokens to the recipient.

```solidity
 function rescueWETH() external {
        address wethAddress = router.WETH();
        IWETH(wethAddress).withdraw(IERC20(wethAddress).balanceOf(address(this)));
    }
```

The `rescueWETH` function allows the contract owner to withdraw any WETH (Wrapped Ether) tokens that may be held by the contract. It does this by first getting the address of the WETH contract using the `router` contract's `WETH` function, then using the `withdraw` function of the `IWETH` interface to transfer the contract's WETH balance to the contract's own address.

This function may be useful if, for some reason, the contract has acquired WETH tokens that it does not need or want to hold. By withdrawing these tokens, the contract owner can ensure that they are not unnecessarily tied up in the contract.

ItÔÇÖs worth noting that this function can only be called by the contract owner, as it is marked with the `onlyOwner` modifier. This is likely to prevent unauthorized users from being able to withdraw the contract's WETH tokens.
