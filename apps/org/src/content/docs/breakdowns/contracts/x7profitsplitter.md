---
title: X7 Profit Share Splitter V1
tags: [breakdowns]
---

The `X7ProfitShareSplitterV1` contract is an implementation of a contract that allows for the distribution of funds among multiple recipients, referred to as "outlets." Each outlet has a corresponding recipient address and a share of the funds to be distributed. The contract is owned by a specific address, which has the ability to modify the behavior of the contract.

The contract has several functions:

- `takeBalance`: This function allows the owner to retrieve the current balance of the contract.
- `takeCurrentBalance`: This function allows the owner to retrieve the current balance of the contract and transfer it to the reward pool outlet.
- `divvyUp`: This function distributes the balance of the contract among the outlets according to their respective shares.
- `pushAll`: This function allows the owner to transfer the entire balance of the contract to a specified address.

The contract also includes several modifiers and events, such as the `onlyOwner` modifier which allows only the owner to execute certain functions, and the `OutletControllerAuthorizationSet` event which is emitted when the authorization of an outlet controller is set.

```js
mapping(uint256 => uint256) public outletBalance;
mapping(uint256=> address) public outletRecipient;
mapping(address => uint256) public outletLookup;
mapping(uint256 => mapping(address => bool)) public outletController;
mapping(uint256 => bool) public outletFrozen;
```

The `outletBalance` mapping stores the current balance for each outlet. The `outletRecipient` mapping stores the address of the recipient for each outlet. The `outletShare` mapping stores the percentage of the total balance that should be distributed to each outlet.

The `outletLookup` mapping allows for looking up the outlet corresponding to a given recipient address. The `outletController` mapping stores a mapping of addresses to booleans indicating whether or not each address has authorization to control the behavior of a given outlet.

The `outletFrozen` mapping stores a boolean value indicating whether or not an outlet is frozen, which means that it cannot receive any more funds.

These mappings and their corresponding functions allow for the flexible distribution of funds among the outlets and their recipients.

```js
event TokenReceiverSet(address indexed oldReceiver, address indexed newReceiver);
event OutletControllerAuthorizationSet(uint256 indexed outlet, address indexed setter, address indexed controller, bool authorization);
event OutletRecipientSet(uint256 indexed outlet, address indexed oldRecipient, address indexed newRecipient);
event OutletSharesSet(uint256 indexed outlet, uint256 oldShares, uint256 newShares);
event OutletFrozen(uint256 indexed outlet);
event NewRecipientAdded(uint256 indexed outlet, address indexed recipient, address indexed controller, uint256 shares);
event TotalSharesChanged(uint256 oldShareCount, uint256 newShareCount);
```

The `OutletControllerAuthorizationSet` event is emitted when the authorization of an outlet controller is set. This event includes the outlet, the address of the setter, the address of the controller, and a boolean indicating the authorization status.

The `OutletRecipientSet` event is emitted when the recipient for an outlet is changed. This event includes the outlet, the old recipient address, and the new recipient address.

The `OutletSharesSet` event is emitted when the shares of the outlets are modified.

The `OutletFrozen` event is emitted when the recipient for an outlet is frozen, which means that it can no longer receive any more funds.

The `NewRecipientAdded` event is emitted when the a new recipient is added to the contract.

The `TotalSharesChanged` event is emitted when the a contract total shgares are changed.

These events allow for tracking changes to the outlets, their recipients, and the distribution of funds in the contract.

```js
 receive () external payable {}
```

The `receive` function is a built-in function in the Solidity programming language that allows a contract to receive ether. It is a fallback function that is called when the contract receives an ether transfer.

The `payable` keyword indicates that the function is able to receive ether. The `external` keyword indicates that the function can be called from external contracts. The `receive` function does not have any arguments or a return value.

The `receive` function is often used in combination with the `transfer` or `send` functions to transfer ether to a contract.

The `receive` function is usually implemented to perform some action when the contract receives ether, such as storing the ether in a balance or distributing it among multiple recipients.

```js
function setTokenReceiver(address receiver) external onlyOwner {
    address oldReceiver = tokenReceiver;
    tokenReceiver = receiver;

    emit TokenReceiverSet(oldReceiver, receiver);
}
```

The function `setTokenReceiver` allows the contract owner to set a new address as the token receiver.

It first saves the current token receiver address as oldReceiver.
Then, it updates the tokenReceiver variable with the new address provided as the function argument.
Finally, it emits an event TokenReceiverSet to log the old and new token receiver addresses.
This function provides flexibility to change the destination address where tokens can be rescued or transferred within the contract.

```js
function addNewRecipient(address newRecipient, address controller, uint256 shares) external onlyOwner {
    divvyUp();
    require(outletLookup[newRecipient] == 0);
    require(shares > 0);
    outletShares.push(shares);
    uint256 outlet = outletShares.length-1;
    outletRecipient[outlet] = newRecipient;
    outletLookup[newRecipient] = outlet;
    outletController[outlet][owner()] = true;
    outletController[outlet][controller] = true;
    totalShares += shares;

    emit NewRecipientAdded(outlet, newRecipient, controller, shares);
    emit TotalSharesChanged(totalShares - shares, totalShares);
}
```

The addNewRecipient function is called by the contract owner to add a new recipient. It first distributes the current balance among existing recipients using the divvyUp function. Then, it checks that the new recipient address is not already associated with an existing outlet and that the specified number of shares is positive.

If these conditions are met, the function adds the new recipient to the outletRecipient mapping and updates the outletLookup mapping to associate the new recipient address with its outlet index. It also grants controller authorization to the contract owner and the specified controller address for the new outlet.

After updating the total shares, the function emits two events: NewRecipientAdded to indicate the addition of the new recipient, and TotalSharesChanged to show the change in the total number of shares.

```js
function divvyUp() public {
    if (!initialized) {
        return;
    }

    uint256 newETH = address(this).balance - reservedETH;
    uint256 spentETH = 0;

    if (newETH > 0) {
        for (uint256 i = 1; i < outletShares.length - 1; i++) {
            uint256 addBalance = newETH * outletShares[i] / totalShares;
            spentETH += addBalance;
            outletBalance[i] += addBalance;
        }

        outletBalance[outletShares.length-1] += (newETH - spentETH);
        reservedETH = address(this).balance;
    }
}
```

The `divvyUp` function is a public function of the `X7ProfitShareSplitter` contract that distributes the contract's balance among the various outlets.

The function starts with a check to see if the contract has been initialized. If it hasn't been initialized, the function simply returns without performing any further actions.

Then it calculates the amount of new ETH available for distribution. This is done by subtracting the reserved ETH (ETH that has already been distributed in previous cycles) from the current balance of the contract.

If there's new ETH available for distribution (i.e., newETH > 0), the function proceeds to distribute this ETH among different outlets based on their respective shares. It iterates through each outlet (excluding the last one, as indicated by outletShares.length - 1) and calculates the additional balance each outlet should receive based on its share (outletShares[i] / totalShares). It then adds this additional balance to the outlet's current balance (outletBalance[i]). The total amount of ETH spent in this step is tracked by the spentETH variable.

After distributing ETH among all outlets except the last one, any remaining ETH is added to the balance of the last outlet (outletShares.length - 1). This ensures that the entire balance is distributed, even if there are rounding errors in the previous distribution steps.

Finally, the function updates the reservedETH variable to reflect the current balance of the contract, indicating that this amount has been reserved for distribution in subsequent cycles.

```js
 function setOutletControllerAuthorization(Outlet outlet, address controller, bool authorization) external {
    require(!outletFrozen[outlet]);
    require(outlet != Outlet.OTHER_SLOT1 && outlet != Outlet.OTHER_SLOT2);
    require(outletController[outlet][msg.sender]);
    outletController[outlet][controller] = authorization;

    emit OutletControllerAuthorizationSet(outlet, msg.sender, controller, authorization);
}
```

The `setOutletControllerAuthorization` function is a public function of the `X7ProfitShareSplitter` contract that allows a controller of a given outlet to set the authorization of another address to control the outlet.

The function takes an `Outlet` enum value `outlet`, an address `controller`, and a boolean value `authorization` as arguments. It performs the following actions:

1.  It checks that the outlet is not frozen, using the `outletFrozen` mapping.
2.  It checks that the caller of the function is a controller of the outlet, using the `outletController` mapping.
3.  It sets the authorization of the `controller` address to control the outlet to the `authorization` value, using the `outletController` mapping.
4.  It emits an `OutletControllerAuthorizationSet` event with the outlet, the caller of the function, the controller, and the authorization value as arguments.

This function allows a controller of a given outlet to set the authorization of another address to control the outlet, subject to certain restrictions. It is used to manage the authorization of different addresses to control the outlets.

```js
function setOutletRecipient(uint256 outlet, address recipient) external {
    require(!outletFrozen[outlet]);
    require(outletRecipient[outlet] != recipient);
    require(outletController[outlet][msg.sender]);
    require(outletLookup[recipient] == 0);

    address oldRecipient = outletRecipient[outlet];

    outletLookup[recipient] = outlet;
    outletLookup[oldRecipient] = 0;
    outletRecipient[outlet] = recipient;

    emit OutletRecipientSet(outlet, oldRecipient, recipient);
}
```

The `setOutletRecipient` function is a public function of the `X7ProfitShareSplitter` contract that allows a controller of a given outlet to set the recipient of the outlet.

The function takes an `Outlet` enum value `outlet` and an address `recipient` as arguments. It performs the following actions:

1.  It checks that the outlet is not frozen, using the `outletFrozen` mapping.
2.  It checks that the recipient address is not already the recipient of the outlet, using an `if` statement.
3.  It checks that the caller of the function is a controller of the outlet, using the `outletController` mapping.
4.  It sets the `outletLookup` mapping for the `recipient` address to the outlet value.
5.  It sets the `outletRecipient` mapping for the outlet to the `recipient` address.

This function allows a controller of a given outlet to set the recipient of the outlet, subject to certain restrictions. It is used to manage the recipients of the different outlets.

```js
 function freezeOutlet(uint256 outlet) external {
    require(outletController[outlet][msg.sender]);
    outletFrozen[outlet] = true;
    emit OutletFrozen(outlet);
}
```

The `freezeOutlet` function is a public function of the `X7TreasurySplitterV3` contract that allows a controller of a given outlet to freeze the outlet.

The function takes an `Outlet` enum value `outlet` as an argument. It performs the following actions:

1.  It checks that the caller of the function is a controller of the outlet, using the `outletController` mapping.
2.  It sets the `outletFrozen` mapping for the outlet to `true`.

This function allows a controller of a given outlet to freeze the outlet, subject to certain restrictions. It is used to temporarily disable certain outlets from receiving new funds.

```js
 function takeBalance() external {
    Outlet outlet = outletLookup[msg.sender];
    require(outlet != Outlet.NONE);
    divvyUp();
    _sendBalance(outlet);
}
```

This function allows the recipient of one of the outlets to withdraw their balance from the contract. It first checks that the sender is the recipient of an outlet by looking up the outlet associated with the sender's address in the `outletLookup` mapping. If the sender is not the recipient of an outlet, it will throw an error. If the sender is the recipient of an outlet, it will first call the `divvyUp` function to redistribute the contract's balance among the outlets based on their share percentages. Then it calls the `_sendBalance` function, passing in the outlet associated with the sender's address, to transfer the balance of the outlet to the sender's address.

```js
 function takeCurrentBalance() external {
    Outlet outlet = outletLookup[msg.sender];
    require(outlet != Outlet.NONE);
    _sendBalance(outlet);
}
```

The `takeCurrentBalance` function allows the recipient of an outlet to take the balance of that outlet. To do so, the function looks up the outlet associated with the caller's address using the `outletLookup` mapping. If the outlet is not `NONE`, it calls the `_sendBalance` function with the outlet as an argument. The `_sendBalance` function is responsible for transferring the balance of the outlet to the recipient.

Note that the `takeCurrentBalance` function does not call the `divvyUp` function, which means that the balance of the outlet is not updated to reflect any new ETH that has been received by the contract. This means that the balance that is transferred to the recipient may not include any ETH that has been received by the contract since the last time the balance was distributed.

```js
 function pushAll() public {
    divvyUp();
    for (uint256 i = 1; i < outletShares.length; i++) {
        _sendBalance(i);
    }
}
```

Is responsible for distributing the balance of the contract among the various outlets specified in the `Outlet` enum. First, it calls the divvyUp function to calculate the amount of ETH to be allocated to each outlet based on their respective shares.
Then, it iterates over each outlet (starting from index 1) and calls the \_sendBalance function to transfer the allocated ETH to that outlet.

```js
 function rescueWETH() public {
    IWETH(WETH).withdraw(IERC20(WETH).balanceOf(address(this)));
    pushAll();
}
```

This function ia a way for the contract owner to retrieve any WETH (wrapped ETH) that is stuck in the contract and distribute it to the outlets.

```js
 function rescueTokens(address tokenAddress) external {
    if (tokenAddress == WETH) {
        rescueWETH();
    } else {
        IERC20(tokenAddress).transfer(tokenReceiver, IERC20(tokenAddress).balanceOf(address(this)));
    }
}
```

The function `rescueTokens` first checks if the tokenAddress is equal to WETH (Wrapped Ether). If it is, it calls the rescueWETH function to handle the rescue process specific to WETH.
If the tokenAddress is not equal to WETH, it uses the ERC20 token's transfer function to transfer the entire balance of the ERC20 token held by the contract `(address(this))` to the designated tokenReceiver address.

```js
 function _sendBalance(uint256 outlet) internal {
    bool success;
    address recipient = outletRecipient[outlet];

    if (recipient == address(0)) {
        return;
    }

    uint256 ethToSend = outletBalance[outlet];

    if (ethToSend > 0) {
        outletBalance[outlet] = 0;
        reservedETH -= ethToSend;

        (success,) = recipient.call{value: ethToSend}("");
        if (!success) {
            outletBalance[outlet] += ethToSend;
            reservedETH += ethToSend;
        }
    }
}
```

The `_sendBalance` function is an internal function that is used to send the balance of a given outlet to its recipient. The function takes one parameter outlet, which represents the identifier of the outlet whose balance will be transferred.
The function retrieves the recipient address associated with the specified outlet from the outletRecipient mapping and assigns it to the recipient variable.
It checks if the recipient address is equal to address(0), which indicates that no recipient is set for the specified outlet. If the recipient is not set, the function returns early without performing any transfer operation.
It calculates the amount of Ether (ethToSend) to be sent to the recipient. This amount is retrieved from the outletBalance mapping using the outlet identifier.
If the calculated ethToSend is greater than 0, the function proceeds to transfer this Ether to the recipient. It sets the outletBalance of the specified outlet to 0 and adjusts the reservedETH accordingly to reflect the transferred amount.
If the transfer operation fails (indicated by success being false), the function reverts the balance and reservedETH to their original values, ensuring that the transaction state remains consistent.
