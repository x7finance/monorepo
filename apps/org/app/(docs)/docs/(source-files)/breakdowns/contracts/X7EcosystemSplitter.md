---
title: X7 Ecosystem Splitter Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-ecosystem-splitter-contract-6942ea3aa36b

The `X7EcosystemSplitter` contract is a contract that allows the owner to split incoming funds between different outlets (recipients) in predetermined proportions.

The outlets are represented by an `enum` called `Outlet` and are defined as `X7R`, `X7DAO`, `X7100`, `LENDING_POOL`, and `TREASURY`. The owner can specify the proportions (shares) of incoming funds that should be sent to each outlet using the `setShares` function.

The owner can also specify the recipients (addresses) of each outlet using the `setOutlet` function. The contract has a `receive` function that is called whenever the contract receives funds, and this function splits the incoming funds and sends them to the corresponding outlets in the specified proportions.

The contract also has a `takeBalance` function that allows the owner to withdraw the balance of a specific outlet. The contract has a `onlyOwner` modifier that ensures that only the contract owner can call certain functions.

The contract is also `Ownable`, meaning it has an `_owner` variable that represents the owner address, and it has functions for transferring ownership and renouncing ownership.

```solidity
 enum Outlet {
        NONE,
        X7R,
        X7DAO,
        X7100,
        LENDING_POOL,
        TREASURY
    }
```

The `Outlet` enum is a data type in the `X7EcosystemSplitter` contract that is used to represent different outlets that can receive a share of incoming funds. An outlet is a recipient of funds that is defined in the contract. The `Outlet` enum has six possible values: `NONE`, `X7R`, `X7DAO`, `X7100`, `LENDING_POOL`, and `TREASURY`. Each value represents a different outlet that can receive a share of incoming funds. For example, if the value of an `Outlet` variable is `X7R`, it means that the outlet represented by this variable is the `X7R` outlet, which will receive a share of incoming funds as specified in the contract. The `Outlet` enum is used in various functions and mappings in the `X7EcosystemSplitter` contract to identify the outlets and specify their share of incoming funds.

```solidity
 mapping(Outlet => uint256) public outletBalance;
    mapping(Outlet => address) public outletRecipient;
    mapping(Outlet => uint256) public outletShare;
    mapping(address => Outlet) public outletLookup;
    mapping(Outlet => bool) public isFrozen;
```

The `outletBalance`, `outletRecipient`, `outletShare`, `outletLookup`, and `isFrozen` mappings are used in the `X7EcosystemSplitter` contract to store data about the outlets.

The `outletBalance` mapping is a mapping from an `Outlet` value to a `uint256` value. It is used to store the balance of each outlet in the contract. The balance of an outlet is the amount of funds that have been received by the contract and allocated to the outlet, but have not yet been withdrawn by the recipient of the outlet.

The `outletRecipient` mapping is a mapping from an `Outlet` value to an `address` value. It is used to store the address of the recipient of each outlet. The recipient of an outlet is the address that will receive the funds allocated to the outlet when the balance of the outlet is withdrawn using the `takeBalance` function.

The `outletShare` mapping is a mapping from an `Outlet` value to a `uint256` value. It is used to store the proportion (share) of incoming funds that should be allocated to each outlet. The share of an outlet is specified as a percentage of incoming funds, with a maximum value of 1000 (100%). For example, if the share of the `X7R` outlet is 200, it means that 20% of incoming funds will be allocated to the `X7R` outlet.

The `outletLookup` mapping is a mapping from an `address` value to an `Outlet` value. It is used to store the outlet that is associated with a specific address. This mapping is used in the `takeBalance` function to determine which outlet the caller wants to withdraw the balance from.

The `isFrozen` mapping is a mapping from an `Outlet` value to a `bool` value. It is used to store a boolean flag that indicates whether an outlet is frozen or not. If an outlet is frozen, it means that its recipient and share cannot be changed until it is unfrozen. This mapping is used in the `setOutlet` and `setShares` functions to ensure that frozen outlets cannot be modified.

```solidity
 event SharesSet(uint256 x7RShare, uint256 x7DAOShare, uint256 x7100Share, uint256 lendingPoolShare, uint256 treasuryShare);
    event OutletRecipientSet(Outlet outlet, address oldRecipient, address newRecipient);
    event OutletFrozen(Outlet outlet);
```

The `SharesSet`, `OutletRecipientSet`, and `OutletFrozen` events are used in the `X7EcosystemSplitter` contract to emit log messages when certain actions occur in the contract.

The `SharesSet` event is emitted whenever the proportions (shares) of incoming funds allocated to each outlet are changed using the `setShares` function. The event logs the new shares of the `X7R`, `X7DAO`, `X7100`, `LENDING_POOL`, and `TREASURY` outlets as parameters.

The `OutletRecipientSet` event is emitted whenever the recipient of an outlet is changed using the `setOutlet` function. The event logs the outlet that was modified, the old recipient of the outlet, and the new recipient of the outlet as parameters.

The `OutletFrozen` event is emitted whenever an outlet is frozen using the `freezeOutlet` function. The event logs the outlet that was frozen as a parameter.

These events can be used by external users or contracts to track changes in the `X7EcosystemSplitter` contract and react to them accordingly. For example, a contract could watch for the `SharesSet` event and adjust its own allocation of funds based on the new shares of the outlets.

```solidity
 constructor () Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {
        outletShare[Outlet.X7R] = 200;
        outletShare[Outlet.X7DAO] = 200;
        outletShare[Outlet.X7100] = 200;
        outletShare[Outlet.LENDING_POOL] = 200;
        outletShare[Outlet.TREASURY] = 200;

        emit SharesSet(200, 200, 200, 200, 200);
    }
```

This is the constructor function of the `X7EcosystemSplitter` contract. The constructor is a special function in a Solidity contract that is called when the contract is deployed. It is used to initialize the contract and set up its initial state.

In this case, the constructor function has a single parameter called `Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105))`, which specifies the initial owner of the contract. The `Ownable` contract is a contract that defines functions for transferring and renouncing ownership of a contract. The `address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)` is the address of the initial owner of the `X7EcosystemSplitter` contract.

Inside the constructor function, the shares of the outlets are set to 200, which means that each outlet will receive 20% of incoming funds. Then, the `SharesSet` event is emitted with the new shares of the outlets as parameters. This event can be used by external users or contracts to track the initial shares of the outlets.

Finally, the constructor function calls the constructor function of the `Ownable` contract, passing the initial owner address as a parameter. This sets the initial owner of the `X7EcosystemSplitter` contract to the specified address.

```solidity
 receive () external payable {
        outletBalance[Outlet.X7R] += msg.value * outletShare[Outlet.X7R] / 1000;
        outletBalance[Outlet.X7DAO] += msg.value * outletShare[Outlet.X7DAO] / 1000;
        outletBalance[Outlet.X7100] += msg.value * outletShare[Outlet.X7100] / 1000;
        outletBalance[Outlet.LENDING_POOL] += msg.value * outletShare[Outlet.LENDING_POOL] / 1000;
        outletBalance[Outlet.TREASURY] = address(this).balance - outletBalance[Outlet.X7R] - outletBalance[Outlet.X7DAO] - outletBalance[Outlet.X7100] - outletBalance[Outlet.LENDING_POOL];
    }
```

The `receive` function is a special function in a Solidity contract that is called when the contract receives funds. It is equivalent to the `payable` fallback function, which means that it will be called automatically if a contract function is not specified in a transaction that sends funds to the contract.

In this case, the `receive` function is used to split the incoming funds and allocate them to the different outlets in the specified proportions (shares). It does this by adding the incoming funds to the balance of each outlet, multiplied by the share of the outlet, and divided by 1000 (since the shares are specified as a percentage of incoming funds, with a maximum value of 1000).

For example, if the share of the `X7R` outlet is 200 and the contract receives 10 ETH, 2 ETH will be added to the balance of the `X7R` outlet (10 ETH \* 200 / 1000 = 2 ETH).

Finally, the balance of the `TREASURY` outlet is set to the remaining balance of the contract, after subtracting the balances of the other outlets. This ensures that all incoming funds are allocated to one of the outlets.

ItÔÇÖs important to note that the `receive` function does not send the funds to the outlets. It only updates their balances in the contract. The outlets can then withdraw their balances using the `takeBalance` function.

```solidity
 function setWETH(address weth_) external onlyOwner {
        weth = weth_;
    }
```

The `setWETH` function is a function in the `X7EcosystemSplitter` contract that allows the owner to set the address of the WETH contract. The WETH contract is an interface for interacting with the Wrapped Ether (WETH) contract, which is a smart contract that represents Ether (ETH) on the Ethereum network.

The `setWETH` function has a single parameter, `weth_`, which is the address of the WETH contract. The function sets the value of the `weth` variable to the value of the `weth_` parameter. The `weth` variable is a public variable in the contract that stores the address of the WETH contract.

The `setWETH` function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This is to ensure that only the owner of the contract can set the WETH contract address.

The `setWETH` function does not return any value. It simply updates the value of the `weth` variable in the contract. This function is typically used to set the WETH contract address when the `X7EcosystemSplitter` contract is deployed or when the WETH contract address changes.

```solidity
 function setOutlet(Outlet outlet, address recipient) external onlyOwner {
        require(!isFrozen[outlet]);
        require(outletRecipient[outlet] != recipient);
        address oldRecipient = outletRecipient[outlet];
        outletLookup[recipient] = outlet;
        outletRecipient[outlet] = recipient;

        emit OutletRecipientSet(outlet, oldRecipient, recipient);
    }
```

The `setOutlet` function is a function in the `X7EcosystemSplitter` contract that allows the owner to set the recipient of an outlet. The recipient of an outlet is the address that will receive the funds allocated to the outlet when the balance of the outlet is withdrawn using the `takeBalance` function.

The `setOutlet` function has two parameters:

- `outlet`: an `Outlet` value that specifies the outlet to be modified.
- `recipient`: an `address` value that specifies the new recipient of the outlet.

The function starts by checking that the outlet is not frozen using the `isFrozen` mapping, and that the new recipient is different from the current recipient. If either of these conditions is not met, the function will stop execution and return.

If the conditions are met, the function updates the `outletLookup` mapping to associate the new recipient with the outlet, and updates the `outletRecipient` mapping to set the new recipient of the outlet.

Finally, the function emits the `OutletRecipientSet` event with the outlet, the old recipient, and the new recipient as parameters. This event can be used by external users or contracts to track changes to the recipients of the outlets.

ItÔÇÖs important to note that the `setOutlet` function does not transfer any funds to the new recipient. It only updates the recipient of the outlet in the contract. The recipient can then withdraw the balance of the outlet using the `takeBalance` function.

```solidity
 function freezeOutletChange(Outlet outlet) external onlyOwner {
        require(!isFrozen[outlet]);
        isFrozen[outlet] = true;

        emit OutletFrozen(outlet);
    }
```

The `freezeOutletChange` function is a function in the `X7EcosystemSplitter` contract that allows the owner to freeze an outlet. When an outlet is frozen, it means that its recipient and share cannot be changed until it is unfrozen.

The `freezeOutletChange` function has a single parameter, `outlet`, which is an `Outlet` value that specifies the outlet to be frozen.

The function starts by checking that the outlet is not already frozen using the `isFrozen` mapping. If the outlet is already frozen, the function will stop execution and return.

If the outlet is not frozen, the function sets the `isFrozen` mapping for the outlet to `true`, indicating that the outlet is now frozen.

Finally, the function emits the `OutletFrozen` event with the outlet as a parameter. This event can be used by external users or contracts to track when outlets are frozen.

ItÔÇÖs important to note that the `freezeOutletChange` function does not transfer any funds or change the recipient or share of the outlet. It only updates the `isFrozen` mapping for the outlet in the contract.

```solidity
 function setShares(uint256 x7rShare_, uint256 x7daoShare_, uint256 x7100Share_, uint256 lendingPoolShare_, uint256 treasuryShare_) external onlyOwner {
        require(treasuryShare_ >= treasuryMinShare);
        require(x7rShare_ + x7daoShare_ + x7100Share_ + lendingPoolShare_ + treasuryShare_ == 1000);
        require(x7rShare_ >= minShare && x7daoShare_ >= minShare && x7100Share_ >= minShare && lendingPoolShare_ >= minShare);
        require(x7rShare_ <= maxShare && x7daoShare_ <= maxShare && x7100Share_ <= maxShare && lendingPoolShare_ <= maxShare);

        outletShare[Outlet.X7R] = x7rShare_;
        outletShare[Outlet.X7DAO] = x7daoShare_;
        outletShare[Outlet.X7100] = x7100Share_;
        outletShare[Outlet.LENDING_POOL] = lendingPoolShare_;
        outletShare[Outlet.TREASURY] = treasuryShare_;

        emit SharesSet(x7rShare_, x7daoShare_, x7100Share_, lendingPoolShare_, treasuryShare_);
    }
```

The `setShares` function is a function in the `X7EcosystemSplitter` contract that allows the owner to set the shares of the outlets. The shares of the outlets determine the proportion of incoming funds that will be allocated to each outlet.

The `setShares` function has five parameters:

- `x7rShare_`: a `uint256` value that specifies the share of the `X7R` outlet.
- `x7daoShare_`: a `uint256` value that specifies the share of the `X7DAO` outlet.
- `x7100Share_`: a `uint256` value that specifies the share of the `X7100` outlet.
- `lendingPoolShare_`: a `uint256` value that specifies the share of the `LENDING_POOL` outlet.
- `treasuryShare_`: a `uint256` value that specifies the share of the `TREASURY` outlet.

The function starts by checking that the `treasuryShare_` parameter is greater than or equal to the `treasuryMinShare` variable (which is set to 200), that the sum of the shares is equal to 1000, and that each share is within the specified range (minimum of `minShare` and maximum of `maxShare`). If any of these conditions is not met, the function will stop execution and return.

If the conditions are met, the function updates the `outletShare` mapping for each outlet with the new shares specified in the parameters.

Finally, the function emits the `SharesSet` event with the new shares as parameters. This event can be used by external users or contracts to track changes to the shares of the outlets.

ItÔÇÖs important to note that the `setShares` function does not transfer any funds or change the balances of the outlets. It only updates the shares of the outlets in the contract. The allocation of incoming funds to the outlets will be based on the new shares the next time the `receive` function is called.

```solidity
 function takeBalance() external {
        Outlet outlet = outletLookup[msg.sender];
        require(outlet != Outlet.NONE);
        _sendBalance(outlet);
    }
```

The `takeBalance` function is a function in the `X7EcosystemSplitter` contract that allows the recipient of an outlet to withdraw the balance of the outlet.

The `takeBalance` function does not have any parameters. It determines the outlet associated with the caller (the address calling the function) using the `outletLookup` mapping, and then calls the `_sendBalance` function with the outlet as a parameter.

The `_sendBalance` function is an internal function that is used to send the balance of the outlet to the recipient of the outlet. It has a single parameter, `outlet`, which is an `Outlet` value that specifies the outlet to be withdrawn.

The `takeBalance` function is marked with the `external` visibility specifier, which means that it can be called by external contracts or users. However, it can only be called by the recipient of the outlet (as determined by the `outletLookup` mapping). This is because the `outletLookup` mapping is private, and can only be accessed by the contract itself.

If the caller is not the recipient of an outlet, the `require` statement at the beginning of the function will cause the function to stop execution and return. This is to prevent unauthorized users from attempting to withdraw the balance of an outlet.

ItÔÇÖs important to note that the `takeBalance` function does not check whether the outlet is frozen. This means that the recipient can still withdraw the balance of a frozen outlet. However, the recipient will not be able to change the recipient or share of the outlet until it is unfrozen.

```solidity
 function _sendBalance(Outlet outlet) internal {
        if (outletRecipient[outlet] == address(0)) {
            return;
        }

        uint256 ethToSend = outletBalance[outlet];

        if (ethToSend > 0) {
            outletBalance[outlet] = 0;

            (bool success,) = outletRecipient[outlet].call{value: ethToSend}("");
            if (!success) {
                outletBalance[outlet] += ethToSend;
            }
        }
    }
```

The `_sendBalance` function is an internal function in the `X7EcosystemSplitter` contract that transfers the balance of an outlet to its recipient. The function is called by the `takeBalance` function when the recipient of the outlet wants to withdraw its balance.

The function has a single parameter, `outlet`, which is an `Outlet` value that specifies the outlet whose balance will be transferred.

The function starts by checking that the recipient of the outlet is not the zero address (`0x0`). If the recipient is the zero address, the function stops execution and returns.

If the recipient is not the zero address, the function retrieves the balance of the outlet using the `outletBalance` mapping and stores it in the `ethToSend` variable. If the balance is greater than zero, the function sets the balance of the outlet to zero using the `outletBalance` mapping, and calls the `transfer` function of the recipient with the balance as the `value` parameter. The `transfer` function is a function in the Ethereum Virtual Machine (EVM) that transfers a specified amount of Ether to an address.

If the `transfer` function call is successful (i.e. it returns `true`), the function stops execution and returns. If the call is unsuccessful (i.e. it returns `false`), the function sets the balance of the outlet back to the original value using the `outletBalance` mapping.

ItÔÇÖs important to note that the `_sendBalance` function does not check whether the recipient of the outlet is frozen. This means that the recipient can still receive the balance of a frozen outlet. However, the recipient will not be able to change the recipient or share of the outlet until it is unfrozen.

```solidity
 function pushAll() external {
        _sendBalance(Outlet.X7R);
        _sendBalance(Outlet.X7DAO);
        _sendBalance(Outlet.X7100);
        _sendBalance(Outlet.LENDING_POOL);
        _sendBalance(Outlet.TREASURY);
    }
```

The `pushAll` function is a function in the `X7EcosystemSplitter` contract that allows the owner to transfer the balances of all outlets to their respective recipients.

The function does not have any parameters. It starts by calling the `_sendBalance` function with each outlet as a parameter. The `_sendBalance` function is an internal function that transfers the balance of an outlet to its recipient.

ItÔÇÖs important to note that the `pushAll` function does not check whether the recipients of the outlets are frozen. This means that the recipients can still receive the balances of frozen outlets. However, the recipients will not be able to change the recipients or shares of the outlets until they are unfrozen.

The `pushAll` function is useful when the owner wants to distribute the balances of the outlets to their respective recipients all at once, rather than having to call the `takeBalance` function for each outlet separately.

```solidity
 function rescueWETH() external {
        IWETH(weth).withdraw(IERC20(weth).balanceOf(address(this)));
    }
```

The `rescueWETH` function is a function in the `X7EcosystemSplitter` contract that allows the owner to withdraw the balance of the contract from the WETH contract.

The function does not have any parameters. It starts by retrieving the balance of the contract in the WETH contract using the `balanceOf` function of the `IERC20` interface, and stores it in a local variable.

Then, the function calls the `withdraw` function of the WETH contract with the balance as the parameter. The `withdraw` function is a function in the WETH contract that allows the contract owner to withdraw a specified amount of WETH from the contract.

ItÔÇÖs important to note that the `rescueWETH` function does not check whether the WETH contract is frozen. This means that the owner can still withdraw the balance of the contract from the WETH contract even if it is frozen.

The `rescueWETH` function is useful when the owner wants to withdraw the balance of the contract from the WETH contract and transfer it to another contract or wallet. This might be necessary if the WETH contract is no longer being used or if the owner wants to use the balance in a different way.

```solidity
 function rescueTokens(address tokenAddress) external {
        IERC20(tokenAddress).transfer(outletRecipient[Outlet.TREASURY], IERC20(tokenAddress).balanceOf(address(this)));
    }
```

The `rescueTokens` function is a function in the `X7EcosystemSplitter` contract that allows the owner to transfer all tokens of a specified contract from the contract to the recipient of the TREASURY outlet.

The function has a single parameter, `tokenAddress`, which is the address of the contract whose tokens will be transferred.

The function starts by retrieving the balance of the contract in the `X7EcosystemSplitter` contract using the `balanceOf` function of the `IERC20` interface, and stores it in a local variable. Then, the function calls the `transfer` function of the contract with the recipient of the TREASURY outlet as the `to` parameter and the balance as the `amount` parameter. The `transfer` function is a function in the `IERC20` interface that allows the contract owner to transfer a specified amount of tokens to an address.

ItÔÇÖs important to note that the `rescueTokens` function does not check whether the recipient of the TREASURY outlet is frozen. This means that the recipient can still receive the tokens even if it is frozen. However, the recipient will not be able to change the recipient or share of the outlet until it is unfrozen.

The `rescueTokens` function is useful when the owner wants to transfer all tokens of a specified contract from the contract to the recipient of the TREASURY outlet. This might be necessary if the contract is no longer being used or if the owner wants to use the tokens in a different way.
