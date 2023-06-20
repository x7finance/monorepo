---
title: X7 Finance Lending Pool Reserve
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-finance-lending-pool-reserve-4f1c361feff1

Smart contract

This is a smart contract for a lending pool reserve on the Ethereum blockchain. It is implemented as an extension of the X7DMinter, X7DBurner, and Ownable contracts, and it allows for the minting and burning of X7D tokens, as well as the deposit and withdrawal of ETH. The contract also has the ability to set and change the address of the lending pool, the ecosystem recipient, and the X7D contract. Additionally, it can also set certain addresses as ecosystem payers, which will redirect their deposit of ETH to the ecosystem recipient instead of themselves. The contract is also able to fund the lending pool, with the owner as the only one who can do this.

```solidity
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

interface IX7D {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

interface X7DMinter {
    // Call this function to explicitly mint X7D
    function depositETH() external payable;

    // Call this function to return ETH to this contract without minting X7D
    function returnETH() external payable;

    // Call this function to mint X7D to a recipient of your choosing
    function depositETHForRecipient(address recipient) external payable;
}

interface X7DBurner {
    // Call this function to redeem (burn) X7D for ETH
    function withdrawETH(uint256 amount) external;
}
```

Interfaces of the contract

```solidity
abstract contract TokensCanBeRecovered is Ownable {
    bytes4 private constant TRANSFERSELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));
    address public recoveredTokenRecipient;

    event RecoveredTokenRecipientSet(address oldRecipient, address newRecipient);

    function setRecoveredTokenRecipient(address tokenRecipient_) external onlyOwner {
        require(recoveredTokenRecipient != tokenRecipient_);
        address oldRecipient = recoveredTokenRecipient;
        recoveredTokenRecipient = tokenRecipient_;
        emit RecoveredTokenRecipientSet(oldRecipient, tokenRecipient_);
    }

    function recoverTokens(address tokenAddress) external {
        require(recoveredTokenRecipient != address(0));
        _safeTransfer(tokenAddress, recoveredTokenRecipient, IERC20(tokenAddress).balanceOf(address(this)));
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(TRANSFERSELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TRANSFER_FAILED');
    }
}
```

The contract `TokensCanBeRecovered` is an abstract contract that is meant to be inherited by other contracts. It provides functionality for recovering tokens that are held by the contract by transferring them to a specified recipient. The contract has a single public variable `recoveredTokenRecipient` which is an address that represents the recipient of recovered tokens. The contract has a function `setRecoveredTokenRecipient` which can be called by the contract owner to set the recipient of recovered tokens. The contract has a function `recoverTokens` which can be called to recover all tokens that are held by the contract and transfer them to the recipient address that is set in `recoveredTokenRecipient`. The contract also has a private function `_safeTransfer` which is used to safely transfer the tokens to the specified recipient address.

```
IX7D public                     X7D;
address public                  lendingPool;
address public                  ecosystemRecipient;
mapping(address => bool) public isEcosystemPayer;
```

- IX7D public X7D; declares a public variable named X7D of type IX7D
- address public lendingPool; declares a public variable named lendingPool of type address
- address public ecosystemRecipient; declares a public variable named ecosystemRecipient of type address
- mapping(address => bool) public isEcosystemPayer; declares a public mapping named isEcosystemPayer, which maps addresses to booleans. This can be used to track whether certain addresses are considered `ecosystem payers` or not.

```solidity
event X7DSet(address oldAddress, address newAddress);
event EcosystemRecipientSet(address oldAddress, address newAddress);
event EcosystemPayerSet(address payorAddress, bool isPayer);
event LendingPoolSet(address oldAddress, address newAddress);
event FundsSent(address indexed recipient, uint256 amount);
event FundsReturned(address indexed sender, uint256 amount);
```

These events are used to track changes to certain state variables within the contract, such as the X7D address, ecosystem recipient, ecosystem payers and lending pool address. Additionally, there are events for when funds are sent or returned by the contract. The events have indexed parameters, which can be used to filter and query the event data.

```solidity
 constructor (address X7DAddress, address ecosystemRecipientAddress) Ownable(msg.sender) {
        X7D = IX7D(X7DAddress);
        ecosystemRecipient = ecosystemRecipientAddress;

        emit X7DSet(address(0), X7DAddress);
        emit EcosystemRecipientSet(address(0), ecosystemRecipientAddress);
    }
```

The constructor is a special function that is called when a new instance of the contract is created. It takes in 2 arguments: an `address` representing the X7DAddress, and an `address` representing the ecosystemRecipientAddress

- The constructor is called by the `msg.sender`, and it will be the owner of the contract
- The constructor sets the `X7D` variable to an instance of the `IX7D` contract, which is created using the `X7DAddress` passed in as an argument
- The constructor sets the `ecosystemRecipient` variable to the `ecosystemRecipientAddress` passed in as an argument
- The constructor emits an `X7DSet` event, which sets the `X7D` address to the `X7DAddress` passed in as an argument, and the old address to `address(0)`
- The constructor emits an `EcosystemRecipientSet` event, which sets the `ecosystemRecipient` address to the `ecosystemRecipientAddress` passed in as an argument, and the old address to `address(0)`

```solidity
 receive () external payable {
        address recipient = msg.sender;

        if (isEcosystemPayer[msg.sender]) {
            recipient = ecosystemRecipient;
        }

        X7D.mint(recipient, msg.value);
    }
```

- The `receive` function is marked as `external payable`, meaning it can be called by external contracts and will also accept Ether payments.
- The first step of the function is to set a variable `recipient` equal to the address of the message sender (`msg.sender`).
- Then, it checks if the address of the message sender is present in the `isEcosystemPayer` mapping. If it is, `recipient` is set to the address stored in the `ecosystemRecipient` variable.
- Then it calls the `mint` function on the `X7D` contract, passing in the `recipient` and `msg.value` as arguments. This will mint new tokens and assign them to the `recipient`.

```solidity
 function depositETH() external payable {
        X7D.mint(msg.sender, msg.value);
    }
```

The `depositETH()` function allows a user to deposit ETH into the contract by calling the `mint()` function of the X7D token contract. Specifically, it does the following:

- Calls the `mint()` function of the X7D token contract (`X7D.mint()`), passing in the `msg.sender` (the address of the user calling the function) as the recipient, and `msg.value` (the amount of ETH being sent with the function call) as the amount of X7D tokens to be minted.
- It is external and payable means it can be called by external address and also can receive ethers.

```solidity
 function depositETHForRecipient(address recipient) external payable {
        X7D.mint(recipient, msg.value);
    }
```

The function `depositETHForRecipient()` allows for a user to deposit ether and have it converted to X7D tokens, but instead of the tokens being minted to the user's own address, they are minted to the address passed as the function's parameter. This function has the following characteristics:

- It is marked as `external` and `payable`, meaning it can be called by external contracts and it can receive ether.
- It takes a single parameter `recipient`, which is an Ethereum address where the X7D tokens will be minted to.
- Inside the function body, it calls the `mint()` function on the IX7D contract, passing the "recipient" address and the amount of ether in the msg.value as the arguments.
- This function does not have any return value.

```solidity
 function withdrawETH(uint256 amount) external {
        require(amount <= address(this).balance, "Insufficient funds to redeem that amount of X7D");
        X7D.burn(msg.sender, amount);
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
    }
```

The function withdrawETH(uint256 amount) allows a user to withdraw a specified amount of ETH from the contract. The function performs the following actions:

- It checks if the user has sufficient funds to redeem that amount of X7D by comparing the amount to the balance of the contract address.
- It burns the specified amount of X7D from the userÔÇÖs account
- It sends the specified amount of ETH to the userÔÇÖs address by using the low-level call function with empty data and the specified amount as the value.
- It checks if the call was successful and reverts the transaction if it failed.

```solidity
 function returnETH() external payable {
        emit FundsReturned(msg.sender, msg.value);
    }
```

The `returnETH` function is an external function that can be called by any address. It is a payable function, meaning that it can receive ETH.

- When the function is called, it emits an event named `FundsReturned` that includes the msg.sender address and the msg.value as parameters.
- msg.sender represents the address of the account that called the function
- msg.value represents the amount of Ether that was sent to the smart contract when the function was called.
- This function does not perform any other action besides emitting the event, so any Ether sent to the contract when calling this function will stay in the contractÔÇÖs balance and can be withdrawn by the smart contract owner.

```solidity
 function setLendingPool(address lendingPool_) external onlyOwner {
        require(lendingPool != lendingPool_);
        address oldLendingPool = lendingPool;
        lendingPool = lendingPool_;

        emit LendingPoolSet(oldLendingPool, lendingPool_);
    }
```

The function `setLendingPool` allows the owner of the contract to set a new lending pool address. It takes in a single parameter, `lendingPool_`, which is the new address of the lending pool. The function first checks if the new address is different from the current one, and if so, it updates the value of the `lendingPool` variable to the new address. It also emits an event, `LendingPoolSet`, which logs the old and new lending pool addresses. The function has a `onlyOwner` modifier, which means that it can only be called by the owner of the contract.

```solidity
 function setEcosystemRecipientAddress(address recipient) external onlyOwner {
        require(ecosystemRecipient != recipient);
        address oldRecipient = ecosystemRecipient;
        ecosystemRecipient = recipient;

        emit EcosystemRecipientSet(oldRecipient, recipient);
    }
```

This function, named `setEcosystemRecipientAddress,` allows the contract owner to set a new address for the ecosystem recipient. It takes in one parameter, `recipient,` which is the new address for the ecosystem recipient. The function first checks if the current ecosystem recipient address is different from the new address, and if so, it sets the new address and emits an event `EcosystemRecipientSet` with the old and new recipient address as the parameters. The function also has an `onlyOwner` modifier that prevents anyone other than the contract owner from executing this function.

```solidity
 function setX7D(address X7DAddress) external onlyOwner {
        require(address(X7D) != X7DAddress);
        address oldX7D = address(X7D);
        X7D = IX7D(X7DAddress);

        emit X7DSet(oldX7D, X7DAddress);
    }
```

The function `setX7D` allows the contract owner to change the address of the IX7D contract that the current contract is interacting with. It performs the following steps:

- It checks that the new address passed as an argument is different from the current address of the IX7D contract.
- It saves the old address of the IX7D contract.
- It updates the IX7D contract instance variable to the new address passed as an argument.
- It emits an event `X7DSet` with the old address and the new address of the IX7D contract.

This function is protected by the modifier `onlyOwner`, so that only the owner of the contract can execute this function.

```solidity
 function setEcosystemPayer(address ecosystemPayerAddress, bool value) external onlyOwner {
        require(isEcosystemPayer[ecosystemPayerAddress] != value);
        isEcosystemPayer[ecosystemPayerAddress] = value;

        emit EcosystemPayerSet(ecosystemPayerAddress, value);
    }
```

The function `setEcosystemPayer` allows the contract owner to set whether a specific address is considered an `ecosystem payer` or not. It takes two parameters: an address representing the ecosystem payer and a boolean value representing whether the address should be considered an ecosystem payer or not. The function first checks that the address being set as an ecosystem payer is not already set to the same value. It then sets the value of isEcosystemPayer for the address to the value provided and emits an event called EcosystemPayerSet, which will log the address of the ecosystem payer and the new value.

```solidity
 function fundLendingPool(uint256 amount) external onlyOwner {
        require(lendingPool != address(0));
        require(amount <= address(this).balance);

        (bool success,) = lendingPool.call{value: amount}("");
        require(success);

        emit FundsSent(lendingPool, amount);
    }
```

This is a function named `fundLendingPool` that allows the contract owner to send a specified amount of Ether to the lending pool contract. The function first checks that the address for the lending pool has been set and is not equal to 0, and also checks that the contract has enough balance to send the specified amount. The function then sends the specified amount of Ether to the lending pool contract using the call function. It also emits an event named `FundsSent` to log the recipient of the sent funds and the amount sent.
