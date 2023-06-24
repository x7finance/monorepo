---
title: X7 Ecosystem Maxi
tags: [breakdowns]
---

The `X7EcosystemMaxi` contract is an ERC721 token contract with additional functionality. It allows for minting tokens with a specified price and maximum supply. It supports a whitelist feature controlled by a whitelist authority contract, and allows the owner to set various parameters such as the mint fee destination and base URI for token metadata.

```js
interface IX7Migration {
    function inMigration(address) external view returns (bool);
}
```

The `IX7Migration` is an interface that defines a single function `inMigration`. The function takes an `address` as a parameter and returns a boolean value indicating whether the address is in migration. The `view` keyword indicates that the function is a read-only function and does not modify the state of the contract.

```js
    address payable public mintFeeDestination;
    address payable public treasury;
    string public _internalBaseURI;

    uint256 public maxSupply = 500;
    uint256 public mintPrice = 10**17;
    uint256 public maxMintsPerTransaction = 5;

    bool public mintingOpen;
    bool public whitelistComplete;

    bool public whitelistActive = true;
    IX7Migration public whitelistAuthority;
```

The contract defines several state variables:

- `mintFeeDestination`: The address where minting fees are sent to (payable).
- `treasury`: The address where a portion of the minting fees are sent to (payable).
- `_internalBaseURI`: The base URI used for generating token metadata URIs.
- `maxSupply`: The maximum number of tokens that can be minted.
- `mintPrice`: The price (in wei) required to mint each token.
- `maxMintsPerTransaction`: The maximum number of tokens that can be minted in a single transaction.
- `mintingOpen`: A boolean flag indicating whether minting is currently open or not.
- `whitelistComplete`: A boolean flag indicating whether the whitelist has been completed or not.
- `whitelistActive`: A boolean flag indicating whether the whitelist is currently active or not.
- `whitelistAuthority`: An instance of the `IX7Migration` interface that determines whether an address is whitelisted.

```js
event MintingOpen();
event MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination);
event MintPriceSet(uint256 oldPrice, uint256 newPrice);
event BaseURISet(string oldURI, string newURI);
event WhitelistActivitySet(bool whitelistActive);
event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority);
```

The contract defines several events:

- `MintingOpen`: Triggered when minting is opened.
- `MintFeeDestinationSet`: Triggered when the mint fee destination address is updated, providing the old and new addresses.
- `MintPriceSet`: Triggered when the mint price is updated, providing the old and new prices.
- `BaseURISet`: Triggered when the base URI for token metadata is updated, providing the old and new URIs.
- `WhitelistActivitySet`: Triggered when the whitelist activity is updated, providing the new whitelist activity status.
- `WhitelistAuthoritySet`: Triggered when the whitelist authority address is updated, providing the old and new authority addresses.

```js
    constructor(address mintFeeDestination_, address treasury_) ERC721("X7 Ecosystem Maxi", "X7EMAXI") Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105) {
        mintFeeDestination = payable(mintFeeDestination_);
        treasury = payable(treasury_);
    }
```

The constructor of the contract initializes the contract with the following parameters:

- `mintFeeDestination_`: The address where minting fees will be sent (payable).
- `treasury_`: The address where a portion of the minting fees will be sent (payable).

It also calls the constructors of the parent contracts:

- `ERC721("X7 Ecosystem Maxi", "X7EMAXI")`: Initializes the ERC721 token with the name "X7 Ecosystem Maxi" and symbol "X7EMAXI".
- `Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105)`: Initializes the contract's owner with the address `0x7000a09c425ABf5173FF458dF1370C25d1C58105`.

Finally, it sets the `mintFeeDestination` and `treasury` variables with the provided addresses. The addresses are cast to `payable` addresses using the `payable` keyword.

```js
    function whitelist(address holder) external view returns (bool) {
        return whitelistAuthority.inMigration(holder);
    }
```

The `whitelist` function is an external view function that takes an `address` parameter `holder` and returns a boolean value.

Inside the function, it calls the `inMigration` function of the `whitelistAuthority` contract (of type `IX7Migration`) and passes the `holder` address as an argument. The `inMigration` function determines whether the `holder` address is whitelisted for migration. The result of this call is then returned as the result of the `whitelist` function.

```js
    function setMintFeeDestination(address mintFeeDestination_) external onlyOwner {
        require(mintFeeDestination != mintFeeDestination_);
        address oldMintFeeDestination = mintFeeDestination;
        mintFeeDestination = payable(mintFeeDestination_);
        emit MintFeeDestinationSet(oldMintFeeDestination, mintFeeDestination_);
    }
```

The `setMintFeeDestination` function is an external function that can only be called by the owner of the contract. It takes an `address` parameter `mintFeeDestination_`, representing the new address where minting fees will be sent.

The function first checks that the new `mintFeeDestination_` address is different from the current `mintFeeDestination` address by using the `require` statement. If they are different, the function continues execution.

Then, the function creates a local variable `oldMintFeeDestination` to store the current `mintFeeDestination` address.

Next, the `mintFeeDestination` state variable is updated with the new address `mintFeeDestination_`, and it is cast to a `payable` address using the `payable` keyword.

Finally, the function emits the `MintFeeDestinationSet` event, providing the `oldMintFeeDestination` and the new `mintFeeDestination` addresses as indexed parameters.

```js
    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)));
        string memory oldBaseURI = _internalBaseURI;
        _internalBaseURI = baseURI_;
        emit BaseURISet(oldBaseURI, baseURI_);
    }
```

The `setBaseURI` function is an external function that can only be called by the owner of the contract. It takes a `string` parameter `baseURI_`, representing the new base URI for token metadata.

The function first checks if the new `baseURI_` is different from the current `_internalBaseURI` by comparing their hash values using the `keccak256` function and the `require` statement. If they are different, the function continues execution.

Then, the function creates a local variable `oldBaseURI` to store the current `_internalBaseURI` value.

Next, the `_internalBaseURI` state variable is updated with the new `baseURI_`.

Finally, the function emits the `BaseURISet` event, providing the `oldBaseURI` and the new `baseURI_` as parameters.

```js
    function setMintPrice(uint256 mintPrice_) external onlyOwner {
        require(mintPrice_ > mintPrice);
        uint256 oldPrice = mintPrice;
        mintPrice = mintPrice_;
        emit MintPriceSet(oldPrice, mintPrice_);
    }
```

The `setMintPrice` function is an external function that can only be called by the owner of the contract. It takes a `uint256` parameter `mintPrice_`, representing the new price (in wei) required to mint each token.

The function first checks if the new `mintPrice_` is greater than the current `mintPrice` by using the `require` statement. If it is greater, the function continues execution.

Then, the function creates a local variable `oldPrice` to store the current `mintPrice` value.

Next, the `mintPrice` state variable is updated with the new `mintPrice_`.

Finally, the function emits the `MintPriceSet` event, providing the `oldPrice` and the new `mintPrice_` as parameters.

```js
    function setWhitelist(bool isActive) external onlyOwner {
        require(!whitelistComplete);
        require(whitelistActive != isActive);
        whitelistActive = isActive;
        emit WhitelistActivitySet(isActive);
    }
```

The `setWhitelist` function is an external function that can only be called by the owner of the contract. It takes a boolean parameter `isActive` indicating whether the whitelist should be active or not.

The function first checks if the `whitelistComplete` flag is `false` by using the `require` statement. This ensures that the whitelist is not marked as complete.

Next, the function checks if the current `whitelistActive` status is different from the desired `isActive` status. If they are different, the function continues execution.

Then, the `whitelistActive` state variable is updated with the new `isActive` status.

Finally, the function emits the `WhitelistActivitySet` event, providing the updated `isActive` status as a parameter.

```js
    function setWhitelistComplete() external onlyOwner {
        require(!whitelistComplete);
        whitelistComplete = true;
        whitelistActive = false;
    }
```

The `setWhitelistComplete` function is an external function that can only be called by the owner of the contract.

The function first checks if the `whitelistComplete` flag is `false` by using the `require` statement. This ensures that the whitelist is not already marked as complete.

Then, the `whitelistComplete` flag is set to `true`, indicating that the whitelist is now complete.

Additionally, the `whitelistActive` flag is set to `false`, effectively disabling the whitelist functionality.

This function is typically called when the whitelist is no longer required or when the whitelist has been fully populated.

Note that once the whitelist is marked as complete, it cannot be modified further unless explicitly allowed by other contract functions.

```js
    function setWhitelistAuthority(address whitelistAuthority_) external onlyOwner {
        require(address(whitelistAuthority) != whitelistAuthority_);
        address oldWhitelistAuthority = address(whitelistAuthority);
        whitelistAuthority = IX7Migration(whitelistAuthority_);
        emit WhitelistAuthoritySet(oldWhitelistAuthority, whitelistAuthority_);
    }
```

The `setWhitelistAuthority` function is an external function that can only be called by the owner of the contract. It takes an `address` parameter `whitelistAuthority_`, representing the new address of the whitelist authority contract.

The function first checks if the current `whitelistAuthority` address is different from the new `whitelistAuthority_` address by using the `require` statement. If they are different, the function continues execution.

Then, the function creates a local variable `oldWhitelistAuthority` to store the current `whitelistAuthority` address.

Next, the `whitelistAuthority` state variable is updated with the new `whitelistAuthority_` address, casting it to the `IX7Migration` interface.

Finally, the function emits the `WhitelistAuthoritySet` event, providing the `oldWhitelistAuthority` and the new `whitelistAuthority_` addresses as indexed parameters.

```js
    function openMinting() external onlyOwner {
        require(!mintingOpen);
        require(mintFeeDestination != address(0));
        mintingOpen = true;
        emit MintingOpen();
    }
```

The `openMinting` function is an external function that can only be called by the owner of the contract.

The function first checks if the `mintingOpen` flag is `false` by using the `require` statement. This ensures that minting is not already open.

Next, the function checks if the `mintFeeDestination` is not the zero address. This ensures that a valid address for minting fees has been set.

If both conditions are satisfied, the `mintingOpen` flag is set to `true`, indicating that minting is now open.

Finally, the function emits the `MintingOpen` event, signalling that minting has been opened.

```js
    function mint() external payable {
        _mintMany(1);
    }
```

The `mint` function is an external function that allows a user to mint a single token. It requires the caller to send a payment in Ether along with the transaction.

Inside the function, it calls the internal `_mintMany` function with a parameter `1`, indicating that only one token should be minted.

This function is a convenient way to mint a single token with a single transaction.

```js
    function mintMany(uint256 numMints) external payable {
        _mintMany(numMints);
    }
```

The `mintMany` function is an external function that allows a user to mint multiple tokens in a single transaction. It requires the caller to send a payment in Ether along with the transaction.

The function takes a parameter `numMints`, which specifies the number of tokens to be minted. It then calls the internal `_mintMany` function, passing `numMints` as the argument.

This function provides a way to mint multiple tokens in a single transaction, potentially saving on gas costs and reducing the number of interactions with the contract.

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

The `_mintMany` function is an internal function that is called by the `mintMany` function to handle the actual minting of multiple tokens.

The function first checks if minting is open by using the `require` statement with the `mintingOpen` flag. This ensures that tokens can only be minted when the minting process is open.

Next, it checks if the whitelist is not active or if the caller is whitelisted by calling the `inMigration` function of the `whitelistAuthority` contract. This allows whitelisted addresses to bypass the whitelist requirement.

Then, it checks if the total supply of tokens plus the number of tokens to be minted does not exceed the `maxSupply` limit.

After that, it checks if the number of tokens to be minted is within the allowed range, specified by `maxMintsPerTransaction`.

Next, it checks if the value sent with the transaction is equal to the required amount, calculated by multiplying the number of tokens to be minted (`numMints`) by the `mintPrice`.

The function calculates the treasury fee by multiplying the value sent with the transaction (`msg.value`) by 10% and dividing it by 100.

Then, it transfers the treasury fee to the `treasury` address by using the `call` function and the `treasuryFee` value.

It also transfers the remaining amount after deducting the treasury fee to the `mintFeeDestination` address using the `call` function.

Next, it determines the ID of the next token to be minted by retrieving the current total supply of tokens using `ERC721Enumerable.totalSupply()`.

Finally, it uses a loop to mint the specified number of tokens. It calls the `_mint` function inherited from `ERC721` to mint each token, assigning it to the `msg.sender` and incrementing the token ID by `i`.

If any of the required conditions or transfer operations fail, the function will revert the transaction.

```js
    function _baseURI() internal view override returns (string memory) {
        return _internalBaseURI;
    }
```

The `_baseURI` function is an internal view function that overrides the base implementation from the `ERC721` contract. It returns the base URI for the token metadata.

Inside the function, it simply returns the value of the `_internalBaseURI` variable, which represents the base URI set for the token metadata.

By overriding this function, the contract provides a custom base URI for the token metadata.
