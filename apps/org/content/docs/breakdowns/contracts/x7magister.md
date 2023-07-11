---
title: X7 Magister NFT
tags: [breakdowns]
---

The X7Magister contract is an ERC721 token contract with additional functionality. It allows for the minting of tokens with a specified maximum supply and price. The contract supports the use of whitelists, allowing only whitelisted addresses to participate in the minting process. The contract owner can set the minting fee destination, base URI for token metadata, minting price, and whitelist settings. The contract includes functions to open the minting process, mint single or multiple tokens, and transfer fees to the designated addresses. The contract emits events to track important state changes. The contract provides a customizable and controlled environment for minting ERC721 tokens with the option of whitelisting.

```js
interface IX7Migration {
    function inMigration(address) external view returns (bool);
}
```

The interface `IX7Migration` declares a single function:

- `inMigration(address) external view returns (bool)`: This function takes an address as an argument and returns a boolean value indicating whether the given address is in migration or not. The purpose and implementation of this function would be defined in the contract that implements the `IX7Migration` interface.

```js
    address payable public mintFeeDestination;
    address payable public treasury;
    string public _internalBaseURI;

    uint256 public maxSupply = 49;
    uint256 public mintPrice = 50 ether;
    uint256 public maxMintsPerTransaction = 1;

    bool public mintingOpen;
    bool public whitelistComplete;

    bool public whitelistActive = true;
    IX7Migration public whitelistAuthority;
```

A breakdown of each variable:

- `mintFeeDestination`: A payable address where the fees collected from minting will be sent.
- `treasury`: A payable address where a portion of the minting fees will be sent as a treasury fee.
- `_internalBaseURI`: A string representing the base URI for token metadata.
- `maxSupply`: An unsigned integer indicating the maximum number of tokens that can be minted.
- `mintPrice`: The price, in ether, to mint a single token.
- `maxMintsPerTransaction`: The maximum number of tokens that can be minted in a single transaction.
- `mintingOpen`: A boolean flag indicating whether minting is open or not.
- `whitelistComplete`: A boolean flag indicating whether the whitelist process is complete or not.
- `whitelistActive`: A boolean flag indicating whether the whitelist is active or not.
- `whitelistAuthority`: An instance of the `IX7Migration` contract used for whitelist functionality.

```js
    event MintingOpen();
    event MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination);
    event MintPriceSet(uint256 oldPrice, uint256 newPrice);
    event BaseURISet(string oldURI, string newURI);
    event WhitelistActivitySet(bool whitelistActive);
    event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority);
```

- `MintingOpen()`: This event is emitted when the minting process is opened.
- `MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination)`: This event is emitted when the mint fee destination address is updated. It includes the old and new destination addresses as indexed parameters.
- `MintPriceSet(uint256 oldPrice, uint256 newPrice)`: This event is emitted when the mint price is updated. It includes the old and new prices as parameters.
- `BaseURISet(string oldURI, string newURI)`: This event is emitted when the base URI for token metadata is updated. It includes the old and new URIs as parameters.
- `WhitelistActivitySet(bool whitelistActive)`: This event is emitted when the whitelist activity status is updated. It includes the new whitelist activity status as a parameter.
- `WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority)`: This event is emitted when the whitelist authority address is updated. It includes the old and new whitelist authority addresses as indexed parameters.

These events provide a way for external observers to track and react to important state changes in the contract.

```js
    constructor(address mintFeeDestination_, address treasury_) ERC721("X7 Magister", "X7MAGISTER") Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105) {
        mintFeeDestination = payable(mintFeeDestination_);
        treasury = payable(treasury_);

        // These mints will be transferred to the active developers as soon
        // as positive control on the profit splitter is demonstrated.
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 0);
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 1);
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 2);
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 3);
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 4);
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 5);
        super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 6);
    }
```

The constructor sets the initial values for the contractΓÇÖs state variables, assigns the mint fee destination and treasury addresses, and mints a few initial tokens to a specific address.

- `address mintFeeDestination_, address treasury_`: Two addresses are passed as arguments to the constructor - `mintFeeDestination_` and `treasury_`.
- `ERC721("X7 Magister", "X7MAGISTER")`: The constructor of the parent ERC721 contract is called with the parameters "X7 Magister" as the token name and "X7MAGISTER" as the token symbol.
- `Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105)`: The constructor of the parent Ownable contract is called with the parameter "0x7000a09c425ABf5173FF458dF1370C25d1C58105" as the initial owner of the contract.
- `mintFeeDestination = payable(mintFeeDestination_)`: The `mintFeeDestination` variable is assigned the value of `mintFeeDestination_` after converting it to a payable address.
- `treasury = payable(treasury_)`: The `treasury` variable is assigned the value of `treasury_` after converting it to a payable address.
- `super._mint(address(0x7000a09c425ABf5173FF458dF1370C25d1C58105), 0)`: The `_mint` function of the parent ERC721 contract is called to mint a token with ID 0 and assign it to the address "0x7000a09c425ABf5173FF458dF1370C25d1C58105".
- Several more `_mint` function calls are made to mint additional tokens with different IDs and assign them to the same address "0x7000a09c425ABf5173FF458dF1370C25d1C58105". These tokens are intended to be transferred to active developers once control on the profit splitter is demonstrated.

```js
    function whitelist(address holder) external view returns (bool) {
        return whitelistAuthority.inMigration(holder);
    }
```

The `whitelist` function is a view function that allows external callers to check whether a given address is whitelisted.

- `function whitelist(address holder) external view returns (bool)`: The function takes an address `holder` as an argument and returns a boolean value indicating whether the address is whitelisted or not.
- `return whitelistAuthority.inMigration(holder)`: The function internally calls the `inMigration` function of the `whitelistAuthority` contract and passes the `holder` address as an argument. It returns the boolean value returned by the `inMigration` function.

```js
    function setMintFeeDestination(address mintFeeDestination_) external onlyOwner {
        require(mintFeeDestination != mintFeeDestination_);
        address oldMintFeeDestination = mintFeeDestination;
        mintFeeDestination = payable(mintFeeDestination_);
        emit MintFeeDestinationSet(oldMintFeeDestination, mintFeeDestination_);
    }
```

The `setMintFeeDestination` function is a public function that allows the contract owner to set the destination address for minting fees.

1.  The function takes an `address` parameter called `mintFeeDestination_`, representing the new destination address for minting fees.
2.  It first checks if the new destination address is different from the current one by using the `require` statement with the condition `mintFeeDestination != mintFeeDestination_`.
3.  If the condition is met, it saves the current destination address in a local variable called `oldMintFeeDestination`.
4.  Then, it updates the `mintFeeDestination` state variable with the new address by assigning `payable(mintFeeDestination_)` to it.
5.  Finally, it emits the `MintFeeDestinationSet` event, passing the `oldMintFeeDestination` and `mintFeeDestination_` addresses as indexed parameters.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function.

```js
    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)));
        string memory oldBaseURI = _internalBaseURI;
        _internalBaseURI = baseURI_;
        emit BaseURISet(oldBaseURI, baseURI_);
    }
```

The `setBaseURI` function is a public function that allows the contract owner to set the base URI for token metadata.

The function takes a `string` parameter called `baseURI_`, representing the new base URI for token metadata.

It first checks if the new base URI is different from the current one by using the `require` statement with the condition `keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_))`.

The `keccak256` function is used to compute the hash of the two base URIs, and the condition checks if the hashes are not equal. This ensures that the base URI is actually being changed.

If the condition is met, it saves the current base URI in a local variable called `oldBaseURI`.

Then, it updates the `_internalBaseURI` state variable with the new base URI by assigning `baseURI_` to it.

Finally, it emits the `BaseURISet` event, passing the `oldBaseURI` and `baseURI_` strings as parameters.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function.

```js
    function setMintPrice(uint256 mintPrice_) external onlyOwner {
        require(mintPrice_ > mintPrice);
        uint256 oldPrice = mintPrice;
        mintPrice = mintPrice_;
        emit MintPriceSet(oldPrice, mintPrice_);
    }
```

The `setMintPrice` function is a public function that allows the contract owner to set the price for minting tokens.

1.  The function takes a `uint256` parameter called `mintPrice_`, representing the new minting price in wei.
2.  It first checks if the new minting price is greater than the current price by using the `require` statement with the condition `mintPrice_ > mintPrice`.
3.  If the condition is met, it saves the current minting price in a local variable called `oldPrice`.
4.  Then, it updates the `mintPrice` state variable with the new price by assigning `mintPrice_` to it.
5.  Finally, it emits the `MintPriceSet` event, passing the `oldPrice` and `mintPrice_` values as parameters.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function. Additionally, this function assumes that the price is being increased; otherwise, the `require` statement would fail.

```js
    function setWhitelist(bool isActive) external onlyOwner {
        require(!whitelistComplete);
        require(whitelistActive != isActive);
        whitelistActive = isActive;
        emit WhitelistActivitySet(isActive);
    }
```

The `setWhitelist` function is a public function that allows the contract owner to enable or disable the whitelist.

1. The function takes a boolean parameter called `isActive`, representing whether the whitelist should be active or not.

2. It first checks if the whitelist is not complete by using the `require` statement with the condition `!whitelistComplete`.

3. Next, it checks if the desired whitelist activity is different from the current whitelist activity by using the `require` statement with the condition `whitelistActive != isActive`.

4. If both conditions are met, it updates the `whitelistActive` state variable with the value of `isActive`.

5. Finally, it emits the `WhitelistActivitySet` event, passing the `isActive` value as a parameter.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function. Additionally, this function cannot modify the whitelist if the whitelist has been marked as complete (`whitelistComplete` is true).

```js
    function setWhitelistComplete() external onlyOwner {
        require(!whitelistComplete);
        whitelistComplete = true;
        whitelistActive = false;
    }
```

The `setWhitelistComplete` function is a public function that allows the contract owner to mark the whitelist as complete.

1. It first checks if the whitelist is not already marked as complete by using the `require` statement with the condition `!whitelistComplete`.

2. If the condition is met, it sets the `whitelistComplete` state variable to `true`, indicating that the whitelist is now complete.

3. It also sets the `whitelistActive` state variable to `false`, effectively deactivating the whitelist.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function. This function can only be called once to mark the whitelist as complete, and it cannot be undone.

```js
    function setWhitelistAuthority(address whitelistAuthority_) external onlyOwner {
        require(address(whitelistAuthority) != whitelistAuthority_);
        address oldWhitelistAuthority = address(whitelistAuthority);
        whitelistAuthority = IX7Migration(whitelistAuthority_);
        emit WhitelistAuthoritySet(oldWhitelistAuthority, whitelistAuthority_);
    }
```

The `setWhitelistAuthority` function is a public function that allows the contract owner to set the address of the whitelist authority contract.

1. The function takes an `address` parameter called `whitelistAuthority_`, representing the address of the new whitelist authority contract.

2. It first checks if the new whitelist authority address is different from the current one by using the `require` statement with the condition `address(whitelistAuthority) != whitelistAuthority_`.

3. If the condition is met, it saves the current whitelist authority address in a local variable called `oldWhitelistAuthority`.

4. Then, it updates the `whitelistAuthority` state variable by assigning `IX7Migration(whitelistAuthority_)` to it. The `IX7Migration` typecast is used to ensure the correct interface is used.

5. Finally, it emits the `WhitelistAuthoritySet` event, passing the `oldWhitelistAuthority` and `whitelistAuthority_` addresses as indexed parameters.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function.

```js
    function openMinting() external onlyOwner {
        require(!mintingOpen);
        require(mintFeeDestination != address(0));
        mintingOpen = true;
        emit MintingOpen();
    }
```

The `openMinting` function is a public function that allows the contract owner to open the minting process.

1. It first checks if minting is not already open by using the `require` statement with the condition `!mintingOpen`.

2. Then, it checks if the mint fee destination address is not the zero address (`address(0)`) by using the `require` statement with the condition `mintFeeDestination != address(0)`.

3. If both conditions are met, it sets the `mintingOpen` state variable to `true`, indicating that minting is now open.

4. Finally, it emits the `MintingOpen` event, indicating that the minting process has been opened.

Note: The `onlyOwner` modifier ensures that only the contract owner can call this function. This function can only be called once to open the minting process.

```js
    function mint() external payable {
        _mintMany(1);
    }
```

The `mint` function is a public payable function that allows users to mint a single token by calling the internal `_mintMany` function.

1. The function is called with no parameters.

2. It calls the internal `_mintMany` function, passing `1` as the `numMints` parameter, indicating that the user wants to mint one token.

3. Since the function is payable, the user must send the required amount of Ether as payment for minting the token. The exact amount is calculated based on the `mintPrice` and the value of `numMints` (which is `1` in this case).

4. The `_mintMany` function handles the minting process and performs the necessary checks, such as ensuring that minting is open, checking the whitelist if it is active, validating the supply limit, and transferring the correct amount of Ether to the designated addresses.

Note: The `mint` function is a convenient way for users to mint a single token without specifying the number of tokens explicitly.

```js
    function mintMany(uint256 numMints) external payable {
        _mintMany(numMints);
    }
```

The `mintMany` function is a public payable function that allows users to mint multiple tokens in a single transaction by calling the internal `_mintMany` function.

1. The function takes a `uint256` parameter called `numMints`, representing the number of tokens the user wants to mint.

2. The function is called with `numMints` and no additional Ether value.

3. It calls the internal `_mintMany` function, passing `numMints` as the `numMints` parameter, indicating the number of tokens the user wants to mint.

4. Since the function is payable, the user must send the required amount of Ether as payment for minting the tokens. The exact amount is calculated based on the `mintPrice` and the value of `numMints`.

5. The `_mintMany` function handles the minting process and performs the necessary checks, such as ensuring that minting is open, checking the whitelist if it is active, validating the supply limit, and transferring the correct amount of Ether to the designated addresses.

Note: The `mintMany` function provides flexibility for users to mint multiple tokens in a single transaction, allowing them to save on gas costs.

```js
    function _mintMany(uint256 numMints) internal {
        require(mintingOpen);
        require(!whitelistActive || whitelistAuthority.inMigration(msg.sender));
        require(totalSupply() + numMints <= maxSupply);
        require(numMints > 0 && numMints <= maxMintsPerTransaction);
        require(msg.value == numMints * mintPrice);

        uint256 treasuryFee = msg.value * 10 / 100;

        bool success;

        (success,) = treasury.call{value: treasuryFee}("");
        require(success);

        (success,) = mintFeeDestination.call{value: msg.value - treasuryFee}("");
        require(success);

        uint256 nextTokenId = ERC721Enumerable.totalSupply();

        for (uint i=0; i < numMints; i++) {
            super._mint(msg.sender, nextTokenId + i);
        }
    }
```

The `_mintMany` function is an internal function that performs the minting process for multiple tokens.

1. It first checks if minting is open by using the `require` statement with the condition `mintingOpen`. If minting is not open, the function will revert.

2. Next, it checks if the whitelist is not active or if the senderΓÇÖs address is whitelisted by using the `require` statement with the condition `!whitelistActive || whitelistAuthority.inMigration(msg.sender)`. If the whitelist is active and the senderΓÇÖs address is not whitelisted, the function will revert.

3. It checks if the total supply of tokens plus the number of tokens to be minted is less than or equal to the maximum supply by using the `require` statement with the condition `totalSupply() + numMints <= maxSupply`. If the condition is not met, the function will revert.

4. It checks if the number of tokens to be minted is greater than zero and does not exceed the maximum mints per transaction by using the `require` statement with the condition `numMints > 0 && numMints <= maxMintsPerTransaction`. If the condition is not met, the function will revert.

5. It checks if the amount of Ether sent with the transaction is equal to the required payment for the number of tokens to be minted by using the `require` statement with the condition `msg.value == numMints * mintPrice`. If the condition is not met, the function will revert.

6. It calculates the treasury fee by multiplying the value of Ether sent with the transaction by 10% and dividing it by 100.

7. It uses a boolean variable `success` to track the success of the external calls.

8. It calls the `treasury` address and transfers the treasury fee to it by using the `.call` function and the `value` keyword.

9. It checks if the treasury call was successful by using the `require` statement with the condition `success`. If the call was not successful, the function will revert.

10. It calls the `mintFeeDestination` address and transfers the remaining Ether (the amount sent minus the treasury fee) to it by using the `.call` function and the `value` keyword.

11. It checks if the mint fee destination call was successful by using the `require` statement with the condition `success`. If the call was not successful, the function will revert.

12. It determines the `nextTokenId` by getting the total supply of tokens from the `ERC721Enumerable` contract.

13. It uses a `for` loop to mint the requested number of tokens. It calls the `super._mint` function to mint a token for the `msg.sender` with the `nextTokenId + i` as the token ID.

Note: The `_mintMany` function handles various checks, fee transfers, and token minting. It is meant to be called internally within the contract, typically from the `mint` and `mintMany` functions, after performing necessary validations.

```js
    function _baseURI() internal view override returns (string memory) {
        return _internalBaseURI;
    }
```

The `_baseURI` function is an internal view function that overrides the `_baseURI` function from the base contract. It returns the base URI for token metadata.

1. The function is marked as `internal`, meaning it can only be accessed within the contract and its derived contracts.

2. It is marked with the `view` keyword, indicating that it does not modify the contractΓÇÖs state.

3. The function overrides the `_baseURI` function from the base contract, which is typically the `ERC721` contract.

4. The function simply returns the value of the `_internalBaseURI` state variable, which represents the base URI for token metadata.

Note: The purpose of this function is to provide the base URI when generating the URI for each token. By overriding this function, the contract can customize the base URI as needed.
