---
title: X7 Treasury Splitter V2 Contract
tags: [breakdowns]
---

[Original Medium Post](https://medium.com/@mikemurpher/x7-treasury-splitter-v2-contract-2e43e20ba13f)

The `X7TreasurySplitterV2` contract is an implementation of a contract that allows for the distribution of funds among multiple recipients, referred to as "outlets." Each outlet has a corresponding recipient address and a share of the funds to be distributed. The contract is owned by a specific address, which has the ability to modify the behavior of the contract. The contract is also associated with an instance of the `IUniswapV2Router02` interface, which is used to exchange tokens for ether.

The contract has several functions:

- `takeBalance`: This function allows the owner to retrieve the current balance of the contract.
- `takeCurrentBalance`: This function allows the owner to retrieve the current balance of the contract and transfer it to the reward pool outlet.
- `divvyUp`: This function distributes the balance of the contract among the outlets according to their respective shares.
- `pushAll`: This function allows the owner to transfer the entire balance of the contract to a specified address.

The contract also includes several modifiers and events, such as the `onlyOwner` modifier which allows only the owner to execute certain functions, and the `OutletControllerAuthorizationSet` event which is emitted when the authorization of an outlet controller is set.

```js
 enum Outlet {
        NONE,
        X7DEV1,
        X7DEV2,
        X7DEV3,
        X7DEV4,
        X7DEV5,
        X7DEV6,
        X7DEV7,
        REWARD_POOL,
        OTHER_SLOT1,
        OTHER_SLOT2
    }
```

The `Outlet` enum defines a list of possible outlets for the distribution of funds in the `X7TreasurySplitterV2` contract. The outlets are as follows:

- `NONE`: This outlet represents the absence of an outlet.
- `X7DEV1`, `X7DEV2`, `X7DEV3`, `X7DEV4`, `X7DEV5`, `X7DEV6`, and `X7DEV7`: These outlets represent individual recipients of the funds.
- `REWARD_POOL`: This outlet represents a pool of funds that can be distributed to multiple recipients.
- `OTHER_SLOT1` and `OTHER_SLOT2`: These outlets represent additional recipients of the funds.

```js
 mapping(Outlet => uint256) public outletBalance;
    mapping(Outlet => address) public outletRecipient;
    mapping(Outlet => uint256) public outletShare;
    mapping(address => Outlet) public outletLookup;
    mapping(Outlet => mapping(address => bool)) outletController;
    mapping(Outlet => bool) outletFrozen;
```

The `outletBalance` mapping stores the current balance for each outlet. The `outletRecipient` mapping stores the address of the recipient for each outlet. The `outletShare` mapping stores the percentage of the total balance that should be distributed to each outlet.

The `outletLookup` mapping allows for looking up the outlet corresponding to a given recipient address. The `outletController` mapping stores a mapping of addresses to booleans indicating whether or not each address has authorization to control the behavior of a given outlet.

The `outletFrozen` mapping stores a boolean value indicating whether or not an outlet is frozen, which means that it cannot receive any more funds.

These mappings and their corresponding functions allow for the flexible distribution of funds among the outlets and their recipients.

```js
 event OutletControllerAuthorizationSet(Outlet indexed outlet, address indexed setter, address indexed controller, bool authorization);
    event OutletRecipientSet(Outlet indexed outlet, address indexed oldRecipient, address indexed newRecipient);
    event SharesSet(uint256 oldOtherSlot1Share, uint256 oldOtherSlot2Share, uint256 oldRewardPoolShare, uint256 newOtherSlot1Share, uint256 newOtherSlot2Share, uint256 newRewardPoolShare);
    event OutletRecipientFrozen(Outlet outlet);
    event RouterSet(address indexed router);
```

The `OutletControllerAuthorizationSet` event is emitted when the authorization of an outlet controller is set. This event includes the outlet, the address of the setter, the address of the controller, and a boolean indicating the authorization status.

The `OutletRecipientSet` event is emitted when the recipient for an outlet is changed. This event includes the outlet, the old recipient address, and the new recipient address.

The `SharesSet` event is emitted when the shares of the outlets are modified. This event includes the old and new shares for the `OTHER_SLOT1`, `OTHER_SLOT2`, and `REWARD_POOL` outlets.

The `OutletRecipientFrozen` event is emitted when the recipient for an outlet is frozen, which means that it can no longer receive any more funds.

The `RouterSet` event is emitted when the router for the contract is changed. This event includes the address of the new router.

These events allow for tracking changes to the outlets, their recipients, and the distribution of funds in the contract.

```js
 constructor (address router_) Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {
        router = IUniswapV2Router02(router_);

        outletShare[Outlet.X7DEV1] = 7000;
        outletShare[Outlet.X7DEV2] = 7000;
        outletShare[Outlet.X7DEV3] = 7000;
        outletShare[Outlet.X7DEV4] = 7000;
        outletShare[Outlet.X7DEV5] = 7000;
        outletShare[Outlet.X7DEV6] = 7000;
        outletShare[Outlet.X7DEV7] = 7000;
        outletShare[Outlet.REWARD_POOL] = 6000;
        outletShare[Outlet.OTHER_SLOT1] = 15000;
        outletShare[Outlet.OTHER_SLOT2] = 30000;

        // Dev shares will be allocated on chain via transactions to validate control of
        // destinations addresses.
        outletController[Outlet.X7DEV1][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;
        outletController[Outlet.X7DEV2][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;
        outletController[Outlet.X7DEV3][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;
        outletController[Outlet.X7DEV4][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;
        outletController[Outlet.X7DEV5][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;
        outletController[Outlet.X7DEV6][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;
        outletController[Outlet.X7DEV7][address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)] = true;

        outletRecipient[Outlet.X7DEV1] = address(0x7000a09c425ABf5173FF458dF1370C25d1C58105);
        outletRecipient[Outlet.X7DEV2] = address(0x0000000000000000000000000000000000000000);
        outletRecipient[Outlet.X7DEV3] = address(0x0000000000000000000000000000000000000000);
        outletRecipient[Outlet.X7DEV4] = address(0x0000000000000000000000000000000000000000);
        outletRecipient[Outlet.X7DEV5] = address(0x0000000000000000000000000000000000000000);
        outletRecipient[Outlet.X7DEV6] = address(0x0000000000000000000000000000000000000000);
        outletRecipient[Outlet.X7DEV7] = address(0x0000000000000000000000000000000000000000);

        // Reward Pool
        outletRecipient[Outlet.REWARD_POOL] = address(0x0000000000000000000000000000000000000000);

        // Initial Community Gnosis Wallet
        outletRecipient[Outlet.OTHER_SLOT1] = address(0x7063E83dF5349833A21f744398fD39D42fbC00f8);

        // Initial Project Gnosis Wallet
        outletRecipient[Outlet.OTHER_SLOT2] = address(0x5CF4288Bf373BBe17f76948E39Baf33B9f6ac2e0);
    }
```

This is the constructor function of the `X7TreasurySplitterV2` contract. It is called when the contract is deployed and sets up the initial state of the contract.

The constructor takes an address `router_` as an argument and sets the `router` variable to an instance of the `IUniswapV2Router02` interface at that address.

The function then sets the initial shares for each outlet. The `X7DEV1` through `X7DEV7` outlets are set to 7000 shares each, the `REWARD_POOL` outlet is set to 6000 shares, the `OTHER_SLOT1` outlet is set to 15000 shares, and the `OTHER_SLOT2` outlet is set to 30000 shares.

The function then sets the initial authorization and recipients for each outlet. The `X7DEV1` through `X7DEV7` outlets are set to be controlled by the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105`, and their recipients are also set to this address. The `REWARD_POOL` outlet is set to have an empty recipient, and the `OTHER_SLOT1` and `OTHER_SLOT2` outlets are set to have specific recipient addresses.

This constructor function initializes the outlets and their corresponding recipients and shares, as well as the authorization and control of these outlets.

```js
 receive () external payable {}
```

The `receive` function is a built-in function in the Solidity programming language that allows a contract to receive ether. It is a fallback function that is called when the contract receives an ether transfer.

The `payable` keyword indicates that the function is able to receive ether. The `external` keyword indicates that the function can be called from external contracts. The `receive` function does not have any arguments or a return value.

The `receive` function is often used in combination with the `transfer` or `send` functions to transfer ether to a contract.

The `receive` function is usually implemented to perform some action when the contract receives ether, such as storing the ether in a balance or distributing it among multiple recipients.

```js
function divvyUp() public {
        uint256 newETH = address(this).balance - reservedETH;

        if (newETH > 0) {
            outletBalance[Outlet.X7DEV1] += newETH * outletShare[Outlet.X7DEV1] / 100000;
            outletBalance[Outlet.X7DEV2] += newETH * outletShare[Outlet.X7DEV2] / 100000;
            outletBalance[Outlet.X7DEV3] += newETH * outletShare[Outlet.X7DEV3] / 100000;
            outletBalance[Outlet.X7DEV4] += newETH * outletShare[Outlet.X7DEV4] / 100000;
            outletBalance[Outlet.X7DEV5] += newETH * outletShare[Outlet.X7DEV5] / 100000;
            outletBalance[Outlet.X7DEV6] += newETH * outletShare[Outlet.X7DEV6] / 100000;
            outletBalance[Outlet.X7DEV7] += newETH * outletShare[Outlet.X7DEV7] / 100000;

            outletBalance[Outlet.REWARD_POOL] += newETH * outletShare[Outlet.REWARD_POOL] / 100000;
            outletBalance[Outlet.OTHER_SLOT1] += newETH * outletShare[Outlet.OTHER_SLOT1] / 100000;

            outletBalance[Outlet.OTHER_SLOT2] = address(this).balance -
            outletBalance[Outlet.X7DEV1] -
            outletBalance[Outlet.X7DEV2] -
            outletBalance[Outlet.X7DEV3] -
            outletBalance[Outlet.X7DEV4] -
            outletBalance[Outlet.X7DEV5] -
            outletBalance[Outlet.X7DEV6] -
            outletBalance[Outlet.X7DEV7] -
            outletBalance[Outlet.OTHER_SLOT1] -
            outletBalance[Outlet.REWARD_POOL];

            reservedETH = address(this).balance;
        }
    }
```

The `divvyUp` function is a public function of the `X7TreasurySplitterV2` contract that distributes the contract's balance among the various outlets.

The function first calculates the new amount of ether that has been received by the contract since the last time the function was called, by subtracting the `reservedETH` variable from the contract's current balance. If the new amount of ether is greater than zero, the function proceeds to distribute it among the outlets.

The function distributes the new ether to each outlet based on their respective shares, which are stored in the `outletShare` mapping. The shares are expressed as a percentage of the total balance, and are divided by 100000 to get the fractional value. For example, if the `X7DEV1` outlet has a share of 7000 and the new amount of ether is 10, the outlet would receive 0.7 ether.

The function then sets the `reservedETH` variable to the contract's current balance, to keep track of the amount of ether that has been distributed.

This function allows for the automatic distribution of the contractÔÇÖs balance among the outlets based on their respective shares.

```js
 function setRouter(address router_) external onlyOwner {
        require(router_ != address(router));
        router = IUniswapV2Router02(router_);
    }
```

The `setRouter` function is a public function of the `X7TreasurySplitterV2` contract that allows the contract owner to change the address of the `router` variable, which stores an instance of the `IUniswapV2Router02` interface.

The function takes an address `router_` as an argument and checks that it is not equal to the current value of the `router` variable. If the check passes, the function sets the `router` variable to an instance of the `IUniswapV2Router02` interface at the new address `router_`.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the contract owner. This is implemented using the `_checkOwner` function from the `Ownable` contract, which checks that the caller of the function is the contract owner.

This function allows the contract owner to change the address of the `router` variable, which is used to interact with the `IUniswapV2Router02` interface.

```js
 function setOutletControllerAuthorization(Outlet outlet, address controller, bool authorization) external {
        require(!outletFrozen[outlet]);
        require(outlet != Outlet.OTHER_SLOT1 && outlet != Outlet.OTHER_SLOT2);
        require(outletController[outlet][msg.sender]);
        outletController[outlet][controller] = authorization;

        emit OutletControllerAuthorizationSet(outlet, msg.sender, controller, authorization);
    }
```

The `setOutletControllerAuthorization` function is a public function of the `X7TreasurySplitterV2` contract that allows a controller of a given outlet to set the authorization of another address to control the outlet.

The function takes an `Outlet` enum value `outlet`, an address `controller`, and a boolean value `authorization` as arguments. It performs the following actions:

1.  It checks that the outlet is not frozen, using the `outletFrozen` mapping.
2.  It checks that the outlet is not `OTHER_SLOT1` or `OTHER_SLOT2`, using an `if` statement.
3.  It checks that the caller of the function is a controller of the outlet, using the `outletController` mapping.
4.  It sets the authorization of the `controller` address to control the outlet to the `authorization` value, using the `outletController` mapping.
5.  It emits an `OutletControllerAuthorizationSet` event with the outlet, the caller of the function, the controller, and the authorization value as arguments.

This function allows a controller of a given outlet to set the authorization of another address to control the outlet, subject to certain restrictions. It is used to manage the authorization of different addresses to control the outlets.

```js
 function setOutletRecipient(Outlet outlet, address recipient) external {
        require(!outletFrozen[outlet]);
        require(outletRecipient[outlet] != recipient);
        require(outletController[outlet][msg.sender]);
        require(outlet != Outlet.OTHER_SLOT1 && outlet != Outlet.OTHER_SLOT2 && outlet != Outlet.REWARD_POOL);
        outletLookup[recipient] = outlet;
        outletRecipient[outlet] = recipient;
    }
```

The `setOutletRecipient` function is a public function of the `X7TreasurySplitterV2` contract that allows a controller of a given outlet to set the recipient of the outlet.

The function takes an `Outlet` enum value `outlet` and an address `recipient` as arguments. It performs the following actions:

1.  It checks that the outlet is not frozen, using the `outletFrozen` mapping.
2.  It checks that the recipient address is not already the recipient of the outlet, using an `if` statement.
3.  It checks that the caller of the function is a controller of the outlet, using the `outletController` mapping.
4.  It checks that the outlet is not `OTHER_SLOT1`, `OTHER_SLOT2`, or `REWARD_POOL`, using an `if` statement.
5.  It sets the `outletLookup` mapping for the `recipient` address to the outlet value.
6.  It sets the `outletRecipient` mapping for the outlet to the `recipient` address.

This function allows a controller of a given outlet to set the recipient of the outlet, subject to certain restrictions. It is used to manage the recipients of the different outlets.

```js
 function freezeOutlet(Outlet outlet) external {
        require(outlet != Outlet.OTHER_SLOT1 && outlet != Outlet.OTHER_SLOT2);
        require(outletController[outlet][msg.sender]);
        outletFrozen[outlet] = true;
    }
```

The `freezeOutlet` function is a public function of the `X7TreasurySplitterV2` contract that allows a controller of a given outlet to freeze the outlet.

The function takes an `Outlet` enum value `outlet` as an argument. It performs the following actions:

1.  It checks that the outlet is not `OTHER_SLOT1` or `OTHER_SLOT2`, using an `if` statement.
2.  It checks that the caller of the function is a controller of the outlet, using the `outletController` mapping.
3.  It sets the `outletFrozen` mapping for the outlet to `true`.

This function allows a controller of a given outlet to freeze the outlet, subject to certain restrictions. It is used to temporarily disable certain outlets from receiving new funds.

```js
 function setOtherSlotRecipient(Outlet outlet, address recipient) external onlyOwner {
        require(outlet == Outlet.OTHER_SLOT1 || outlet == Outlet.OTHER_SLOT2 || outlet == Outlet.REWARD_POOL);
        require(!outletFrozen[outlet]);

        address oldRecipient = outletRecipient[outlet];
        outletLookup[recipient] = outlet;
        outletRecipient[outlet] = recipient;

        emit OutletRecipientSet(outlet, oldRecipient, recipient);
    }
```

The `setOtherSlotRecipient` function is a public function of the `X7TreasurySplitterV2` contract that allows the contract owner to set the recipient of the `OTHER_SLOT1`, `OTHER_SLOT2`, or `REWARD_POOL` outlets.

The function takes an `Outlet` enum value `outlet` and an address `recipient` as arguments. It performs the following actions:

1.  It checks that the outlet is either `OTHER_SLOT1`, `OTHER_SLOT2`, or `REWARD_POOL`, using an `if` statement.
2.  It checks that the outlet is not frozen, using the `outletFrozen` mapping.
3.  It saves the current recipient address of the outlet in a local variable `oldRecipient`.
4.  It sets the `outletLookup` mapping for the `recipient` address to the outlet value.
5.  It sets the `outletRecipient` mapping for the outlet to the `recipient` address.
6.  It emits an `OutletRecipientSet` event, passing the outlet, the old recipient address, and the new recipient address as arguments.

This function allows the contract owner to set the recipient of the `OTHER_SLOT1`, `OTHER_SLOT2`, or `REWARD_POOL` outlets, subject to certain restrictions.

```js
 function setOtherSlotShares(uint256 slot1Share, uint256 slot2Share, uint256 rewardPoolShare) external onlyOwner {
        require(slot1Share + slot2Share + rewardPoolShare == 51000);
        divvyUp();

        uint256 oldOtherSlot1Share = outletShare[Outlet.OTHER_SLOT1];
        uint256 oldOtherSlot2Share = outletShare[Outlet.OTHER_SLOT2];
        uint256 oldRewardPoolShare = outletShare[Outlet.REWARD_POOL];
        outletShare[Outlet.OTHER_SLOT1] = slot1Share;
        outletShare[Outlet.OTHER_SLOT2] = slot2Share;
        outletShare[Outlet.REWARD_POOL] = rewardPoolShare;

        emit SharesSet(oldOtherSlot1Share, oldOtherSlot2Share, oldRewardPoolShare, slot1Share, slot2Share, rewardPoolShare);
    }
```

This function allows the owner of the contract to set the percentage shares for the ÔÇ£OTHER_SLOT1ÔÇØ, ÔÇ£OTHER_SLOT2ÔÇØ, and ÔÇ£REWARD_POOLÔÇØ outlets. It requires that the sum of the three shares is 51000 (equivalent to 51%). The function first calls the `divvyUp()` function to redistribute the existing balance according to the new shares. Then, it updates the values of the `outletShare` mapping for the relevant outlets and emits an event to record the change. It also requires that the `outletFrozen` value for these outlets is false, indicating that they are not currently frozen and can be changed.

```js
 function takeBalance() external {
        Outlet outlet = outletLookup[msg.sender];
        require(outlet != Outlet.NONE);
        divvyUp();
        _sendBalance(outlet);
    }
```

This function allows the recipient of one of the outlets to withdraw their balance from the contract. It first checks that the sender is the recipient of an outlet by looking up the outlet associated with the senderÔÇÖs address in the `outletLookup` mapping. If the sender is not the recipient of an outlet, it will throw an error. If the sender is the recipient of an outlet, it will first call the `divvyUp` function to redistribute the contract's balance among the outlets based on their share percentages. Then it calls the `_sendBalance` function, passing in the outlet associated with the sender's address, to transfer the balance of the outlet to the sender's address.

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
        _sendBalance(Outlet.X7DEV1);
        _sendBalance(Outlet.X7DEV2);
        _sendBalance(Outlet.X7DEV3);
        _sendBalance(Outlet.X7DEV4);
        _sendBalance(Outlet.X7DEV5);
        _sendBalance(Outlet.X7DEV6);
        _sendBalance(Outlet.X7DEV7);
        _sendBalance(Outlet.REWARD_POOL);
        _sendBalance(Outlet.OTHER_SLOT1);
        _sendBalance(Outlet.OTHER_SLOT2);
    }
```

Is responsible for distributing the balance of the contract among the various outlets specified in the `Outlet` enum. The function first calls `divvyUp`, which updates the balance of each outlet based on the distribution of shares specified in the `outletShare` mapping. It then calls `_sendBalance` for each outlet, which sends the balance of the outlet to its corresponding recipient.

ItÔÇÖs worth noting that this function can only be called by the contractÔÇÖs owner, as it is not marked with the `external` visibility modifier. This means that only the contract owner can initiate the distribution of the contract's balance.

```js
 function rescueWETH() public {
        address weth = router.WETH();
        IWETH(weth).withdraw(IERC20(weth).balanceOf(address(this)));
        pushAll();
    }
```

This function ia a way for the contract owner to retrieve any WETH (wrapped ETH) that is stuck in the contract and distribute it to the outlets.

The function first retrieves the address of the WETH contract by calling the `router.WETH()` function. Then, it calls the `withdraw()` function on the WETH contract to transfer the balance of WETH that is held by this contract back to the owner of the contract. After that, the function calls the `pushAll()` function to distribute the WETH balance among the outlets.

It is important to note that this function can only be called by the contract owner, as it is marked with the `public` visibility modifier, but not the `external` modifier. This means that it can only be called internally within the contract, and not from an external contract or from a user's wallet.

```js
 function rescueTokens(address tokenAddress) external {
        if (tokenAddress == router.WETH()) {
            rescueWETH();
        } else {
            uint256 tokenAmount = IERC20(tokenAddress).balanceOf(address(this));

            if (tokenAmount > 0) {
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
                pushAll();
            }

        }
    }
```

The function `rescueTokens` allows you to exchange a given token for ETH using the roueter exchange. The function first checks if the token is WETH (wrapped ETH), in which case it calls the `rescueWETH` function. If the token is not WETH, the function checks if the contract has any balance of the given token. If it does, the function approves the router contract to transfer the tokens on behalf of the contract, and then calls the `swapExactTokensForETHSupportingFeeOnTransferTokens` function on the router contract to exchange the tokens for ETH. Finally, the function calls the `pushAll` function to distribute the ETH among the outlets.

```js
 function _sendBalance(Outlet outlet) internal {
        bool success;
        address payable recipient = payable(outletRecipient[outlet]);

        if (recipient == address(0)) {
            return;
        }

        uint256 ethToSend = outletBalance[outlet];
        outletBalance[outlet] = 0;
        reservedETH -= ethToSend;

        (success,) = recipient.call{value: ethToSend}("");
        if (!success) {
            outletBalance[outlet] += ethToSend;
            reservedETH += ethToSend;
        }
    }
```

The `_sendBalance` function is an internal function that is used to send the balance of a given outlet to its recipient. The function takes an `Outlet` as an argument and retrieves the recipient's address using the `outletRecipient` mapping. It then checks if the recipient's address is the zero address (`0x0`), in which case it simply returns without sending any funds.

If the recipientÔÇÖs address is not the zero address, the function calculates the amount of ETH to send by looking up the balance for the given outlet in the `outletBalance` mapping. It then sets the balance for the outlet to `0` and subtracts the amount of ETH to be sent from the reserved balance.

Finally, the function sends the calculated amount of ETH to the recipient using the `call` function. If the `call` function returns `false`, indicating that the transaction failed, the function restores the balance for the outlet and the reserved balance to their original values before returning.
