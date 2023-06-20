---
title: X7 Token Time Lock Contract
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-token-time-lock-contract-d30dd2b352ae

The X7TokenTimeLock is a general purpose token time lock suitable for holding the Liquidity Provider tokens for all X7 ecosystem uniswap pairs.

There is a global unlock time and token specific unlock times. If a token is locked either by the global lock or the token specific lock, it will be locked.

Withdrawals should be orchestrated by contracts to enable trustless withdrawal in the event of an upgrade.

The token owner is the only identity permitted to withdraw tokens. The contract owner may SET the token owner, but does not have any ability to withdraw tokens.

```solidity
 event GlobalUnlockTimestampSet(uint256 unlockTimestamp);
    event GlobalUnlockTimeExtended(uint256 secondsExtended, uint256 newUnlockTimestamp);
    event TokenUnlockTimestampSet(address indexed tokenAddress, uint256 unlockTimestamp);
    event TokenUnlockTimeExtended(address indexed tokenAddress, uint256 secondsExtended, uint256 newUnlockTimestamp);
    event TokenOwnerSet(address indexed tokenAddress, address indexed oldTokenOwner, address indexed newTokenOwner);
    event TokensWithdrawn(address indexed tokenAddress, address indexed recipientAddress, uint256 amount);
```

These events are emitted by the contract when certain actions occur. They allow external parties to be notified of these actions and to react to them if desired.

- The `GlobalUnlockTimestampSet` event is emitted when the global unlock timestamp is set by the contract owner. It includes the new global unlock timestamp as an argument.
- The `GlobalUnlockTimeExtended` event is emitted when the global unlock timestamp is extended by the contract owner. It includes the number of seconds that the unlock timestamp was extended by and the new global unlock timestamp as arguments.
- The `TokenUnlockTimestampSet` event is emitted when the unlock timestamp for a specific token is set by the contract owner. It includes the address of the token and the new unlock timestamp as arguments.
- The `TokenUnlockTimeExtended` event is emitted when the unlock timestamp for a specific token is extended by the contract owner. It includes the address of the token, the number of seconds that the unlock timestamp was extended by, and the new unlock timestamp as arguments.
- The `TokenOwnerSet` event is emitted when the owner of a specific token is set by the contract owner. It includes the address of the token, the old owner, and the new owner as arguments.
- The `TokensWithdrawn` event is emitted when tokens are withdrawn from the contract by their owner. It includes the address of the token, the address of the recipient, and the amount of tokens withdrawn as arguments.

```solidity
 constructor(address weth_) Ownable(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105)) {
        weth = IWETH(weth_);
    }
```

This is the constructor of the `X7TokenTimeLock` contract. It is called when the contract is deployed to the Ethereum blockchain.

The constructor has one argument, `weth_`, which is the address of a contract that implements the `IWETH` interface. The `IWETH` interface defines functions for depositing and withdrawing WETH, as well as transferring it to other addresses. The `weth` variable is set to an instance of the contract at the given address, which allows the `X7TokenTimeLock` contract to interact with it.

The constructor also calls the constructor of the `Ownable` contract, which is a contract that is being inherited (or "extended") by the `X7TokenTimeLock` contract. The `Ownable` contract allows the contract to have an owner and provides functions for transferring ownership and restricting certain actions to the owner. The `Ownable` contract's constructor takes an address as an argument and sets it as the initial owner of the contract. In this case, the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105` is passed as the argument, which means that this address will be the initial owner of the `X7TokenTimeLock` contract.

```solidity
 receive () external payable {
        weth.deposit{value: msg.value}();
    }
```

This is a fallback function, which is a special function in a Solidity contract that is executed when the contract is called with no specified function and with a non-zero amount of Ether. This can happen, for example, if someone sends Ether to the contractÔÇÖs address directly, rather than calling a function on the contract.

The `receive` function calls the `deposit` function of the `weth` contract, which is an instance of a contract that implements the `IWETH` interface. The `deposit` function is expected to accept a payable value, which is the amount of Ether being sent to the contract. The `{value: msg.value}` syntax is a so-called "anonymous function call" and is used to pass the `msg.value` (the amount of Ether being sent) as an argument to the `deposit` function.

This fallback function is useful because it allows the `X7TokenTimeLock` contract to receive Ether without the need for a separate function to be called. It is often used in contracts that accept payments or want to allow users to deposit assets.

```solidity
 function setWETH(address weth_) external onlyOwner {
        weth = IWETH(weth_);
    }
```

This function allows the owner of the `X7TokenTimeLock` contract to set the address of the contract that implements the `IWETH` interface. The function takes an `address` called `weth_` as an argument, which is the address of the contract to be set as the `weth` contract.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This modifier checks that the caller of the function is the contract's owner by calling the `_checkOwner` function, which compares the caller's address to the contract's owner stored in the `_owner` variable. If the caller is not the owner, the function will throw an error.

If the caller is the owner, the `weth` variable is set to an instance of the contract at the given address, which allows the `X7TokenTimeLock` contract to interact with it. This function allows the owner to change the `weth` contract that the `X7TokenTimeLock` contract is using.

```solidity
 function setGlobalUnlockTimestamp(uint256 unlockTimestamp) external onlyOwner {
        require(unlockTimestamp > globalUnlockTimestamp);
        globalUnlockTimestamp = unlockTimestamp;
        emit GlobalUnlockTimestampSet(unlockTimestamp);
    }
```

This function allows the owner of the `X7TokenTimeLock` contract to set the global unlock timestamp, which is the timestamp after which all tokens that do not have their own specific unlock timestamps will be unlockable.

The function takes a `uint256` called `unlockTimestamp` as an argument, which is the timestamp to be set as the global unlock timestamp.

The function has a `require` statement that checks that the given unlock timestamp is greater than the current global unlock timestamp. This is to ensure that the global unlock timestamp can only be set to a later time, not an earlier one.

If the require statement passes, the global unlock timestamp is set to the given value and an event called `GlobalUnlockTimestampSet` is emitted with the new global unlock timestamp as an argument. This event allows external parties to be notified that the global unlock timestamp has been set.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This modifier checks that the caller of the function is the contract's owner by calling the `_checkOwner` function, which compares the caller's address to the contract's owner stored in the `_owner` variable. If the caller is not the owner, the function will throw an error.

```solidity
 function extendGlobalUnlockTimestamp(uint256 extendSeconds) external onlyOwner {
        globalUnlockTimestamp += extendSeconds;
        emit GlobalUnlockTimeExtended(extendSeconds, globalUnlockTimestamp);
    }
```

This function allows the owner of the `X7TokenTimeLock` contract to extend the global unlock timestamp by a given number of seconds.

The function takes a `uint256` called `extendSeconds` as an argument, which is the number of seconds to add to the global unlock timestamp.

The global unlock timestamp is extended by adding the given number of seconds to it. An event called `GlobalUnlockTimeExtended` is then emitted with the number of seconds that the global unlock timestamp was extended by and the new global unlock timestamp as arguments. This event allows external parties to be notified that the global unlock timestamp has been extended.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This modifier checks that the caller of the function is the contract's owner by calling the `_checkOwner` function, which compares the caller's address to the contract's owner stored in the `_owner` variable. If the caller is not the owner, the function will throw an error.

```solidity
 function setTokenUnlockTimestamp(address tokenAddress, uint256 unlockTimestamp) external onlyOwner {
        require(unlockTimestamp > tokenUnlockTimestamp[tokenAddress]);
        tokenUnlockTimestamp[tokenAddress] = unlockTimestamp;
        emit TokenUnlockTimestampSet(tokenAddress, unlockTimestamp);
    }
```

This function allows the owner of the `X7TokenTimeLock` contract to set the unlock timestamp for a specific token.

The function takes an `address` called `tokenAddress` and a `uint256` called `unlockTimestamp` as arguments. The `tokenAddress` is the address of the ERC20 token for which the unlock timestamp is being set, and the `unlockTimestamp` is the timestamp at which the token will be unlockable.

The function has a `require` statement that checks that the given unlock timestamp is greater than the current unlock timestamp for the given token. This is to ensure that the unlock timestamp can only be set to a later time, not an earlier one.

If the require statement passes, the unlock timestamp for the given token is set to the given value and an event called `TokenUnlockTimestampSet` is emitted with the address of the token and the new unlock timestamp as arguments. This event allows external parties to be notified that the unlock timestamp for the token has been set.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This modifier checks that the caller of the function is the contract's owner by calling the `_checkOwner` function, which compares the caller's address to the contract's owner stored in the `_owner` variable. If the caller is not the owner, the function will throw an error.

```solidity
 function extendTokenUnlockTimestamp(address tokenAddress, uint256 extendSeconds) external onlyOwner {
        tokenUnlockTimestamp[tokenAddress] += extendSeconds;
        emit TokenUnlockTimeExtended(tokenAddress, extendSeconds, tokenUnlockTimestamp[tokenAddress]);
    }
```

This function allows the owner of the `X7TokenTimeLock` contract to extend the unlock timestamp for a specific token by a given number of seconds.

The function takes an `address` called `tokenAddress` and a `uint256` called `extendSeconds` as arguments. The `tokenAddress` is the address of the ERC20 token for which the unlock timestamp is being extended, and the `extendSeconds` is the number of seconds to add to the unlock timestamp.

The unlock timestamp for the given token is extended by adding the given number of seconds to it. An event called `TokenUnlockTimeExtended` is then emitted with the address of the token, the number of seconds that the unlock timestamp was extended by, and the new unlock timestamp as arguments. This event allows external parties to be notified that the unlock timestamp for the token has been extended.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This modifier checks that the caller of the function is the contract's owner by calling the `_checkOwner` function, which compares the caller's address to the contract's owner stored in the `_owner` variable. If the caller is not the owner, the function will throw an error.

```solidity
 function setTokenOwner(address tokenAddress, address ownerAddress) external onlyOwner {
        require(tokenOwner[tokenAddress] != ownerAddress);
        address oldOwner = tokenOwner[tokenAddress];
        tokenOwner[tokenAddress] = ownerAddress;
        emit TokenOwnerSet(tokenAddress, oldOwner, ownerAddress);
    }
```

This function allows the owner of the `X7TokenTimeLock` contract to set the owner of a specific token.

The function takes an `address` called `tokenAddress` and an `address` called `ownerAddress` as arguments. The `tokenAddress` is the address of the ERC20 token for which the owner is being set, and the `ownerAddress` is the address of the new owner.

The function has a `require` statement that checks that the given `ownerAddress` is not already the owner of the token. This is to ensure that the owner of the token is only changed if it is necessary.

If the require statement passes, the owner of the token is set to the given `ownerAddress` and an event called `TokenOwnerSet` is emitted with the address of the token, the old owner, and the new owner as arguments. This event allows external parties to be notified that the owner of the token has been set.

The function is marked with the `onlyOwner` modifier, which means that it can only be called by the owner of the contract. This modifier checks that the caller of the function is the contract's owner by calling the `_checkOwner` function, which compares the caller's address to the contract's owner stored in the `_owner` variable. If the caller is not the owner, the function will throw an error.

```solidity
 function getTokenUnlockTimestamp(address tokenAddress) public view returns (uint256) {
        uint256 unlockTimestamp = tokenUnlockTimestamp[tokenAddress];

        if (globalUnlockTimestamp > unlockTimestamp) {
            return globalUnlockTimestamp;
        }

        return unlockTimestamp;
    }
```

This function allows anyone to retrieve the unlock timestamp for a specific token.

The function takes an `address` called `tokenAddress` as an argument, which is the address of the token for which the unlock timestamp is being retrieved.

The function first retrieves the current unlock timestamp for the given token from the `tokenUnlockTimestamp` mapping. If the global unlock timestamp is later than this value, the function returns the global unlock timestamp instead. Otherwise, it returns the current unlock timestamp for the token.

The function is marked with the `view` keyword, which means that it is a read-only function that does not modify the state of the contract or interact with the Ethereum network. It is also marked with the `public` keyword, which means that it can be called by anyone.

The function returns a `uint256` value, which is the unlock timestamp for the given token.

```solidity
 function withdrawTokens(address tokenAddress, uint256 amount) external {
        require(tokenOwner[tokenAddress] == msg.sender);
        require(block.timestamp >= getTokenUnlockTimestamp(tokenAddress));
        IERC20(tokenAddress).transfer(msg.sender, amount);
        emit TokensWithdrawn(tokenAddress, msg.sender, amount);
    }
```

This function allows the owner of a specific token to withdraw the specified amount of the token.

The function takes an `address` called `tokenAddress` and a `uint256` called `amount` as arguments. The `tokenAddress` is the address of the token that is being withdrawn, and the `amount` is the amount of the token that is being withdrawn.

The function has two `require` statements. The first `require` statement checks that the caller of the function is the owner of the token by checking that the caller's address is equal to the value in the `tokenOwner` mapping for the given token.

The second `require` statement checks that the current block's timestamp is greater than or equal to the unlock timestamp for the given token by calling the `getTokenUnlockTimestamp` function. This ensures that the token is not withdrawn until it is unlockable.

If both of these `require` statements pass, the function calls the `transfer` function on the ERC20 contract at the given `tokenAddress` to transfer the specified amount of the token to the caller's address. An event called `TokensWithdrawn` is then emitted with the address of the token, the recipient's address, and the amount of the token that was withdrawn as arguments. This event allows external parties to be notified that the tokens have been withdrawn.

The function is marked with the `external` keyword, which means that it can be called from other contracts or from external accounts. It is not marked with the `view` or `pure` keywords, which means that it can modify the state of the contract and interact with the Ethereum network.
