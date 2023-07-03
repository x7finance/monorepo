---
title: X7 Dex Maxi
tags: [breakdowns]
---

The `X7DEXMaxi` contract is an ERC721 token contract with additional features. It allows for the minting of tokens at a specified price and sets a maximum supply. The contract supports a whitelist functionality, enabling certain addresses to participate in the minting process. The contract owner can control various aspects such as setting the mint fee destination, adjusting the mint price, and managing the base URI for token metadata.

```js
interface IX7Migration {
    function inMigration(address) external view returns (bool);
}
```

The `IX7Migration` interface defines a single function called `inMigration`. This function takes an `address` as an input parameter and returns a boolean value indicating whether the address is in migration or not. The purpose and implementation details of the migration process are not provided in the interface alone, but it suggests that there is a mechanism or contract associated with migration, and this interface defines the required functionality to check if an address is part of that migration process.

```js
    address payable public mintFeeDestination;
    address payable public treasury;
    string public _internalBaseURI;

    uint256 public maxSupply = 150;
    uint256 public mintPrice = 5 * 10**17;
    uint256 public maxMintsPerTransaction = 3;

    bool public mintingOpen;
    bool public whitelistComplete;

    bool public whitelistActive = true;
    IX7Migration public whitelistAuthority;
```

In this section of the code, several state variables are declared:

- `mintFeeDestination`: An address payable variable representing the destination address for minting fees.
- `treasury`: An address payable variable representing the treasury address.
- `_internalBaseURI`: A string variable representing the base URI for token metadata.
- `maxSupply`: An unsigned integer variable representing the maximum supply of tokens that can be minted.
- `mintPrice`: An unsigned integer variable representing the price to mint a token.
- `maxMintsPerTransaction`: An unsigned integer variable representing the maximum number of tokens that can be minted per transaction.
- `mintingOpen`: A boolean variable indicating whether the minting is open or not.
- `whitelistComplete`: A boolean variable indicating whether the whitelist is complete or not.
- `whitelistActive`: A boolean variable indicating whether the whitelist is active or not.
- `whitelistAuthority`: An interface variable of type `IX7Migration` representing the whitelist authority contract.

These variables define various aspects of the contract, including the addresses for minting fees and treasury, pricing information, supply limits, and the status of minting and whitelist functionality.

```js
   event MintingOpen();
   event MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination);
   event MintPriceSet(uint256 oldPrice, uint256 newPrice);
   event BaseURISet(string oldURI, string newURI);
   event WhitelistActivitySet(bool whitelistActive);
   event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority);
```

The code defines several events:

- `MintingOpen`: This event is emitted when the minting process is opened.
- `MintFeeDestinationSet`: This event is emitted when the mint fee destination address is changed. It includes the old destination address and the new destination address as indexed parameters.
- `MintPriceSet`: This event is emitted when the mint price is changed. It includes the old price and the new price as parameters.
- `BaseURISet`: This event is emitted when the base URI for token metadata is changed. It includes the old URI and the new URI as parameters.
- `WhitelistActivitySet`: This event is emitted when the whitelist activity status is changed. It includes the new whitelist activity status as a parameter.
- `WhitelistAuthoritySet`: This event is emitted when the whitelist authority address is changed. It includes the old whitelist authority address and the new whitelist authority address as indexed parameters.

These events provide a way for external entities to track and listen for specific changes or actions occurring within the contract, such as changes in minting settings, base URI, whitelist activity, and whitelist authority.

```js
 constructor(address mintFeeDestination_, address treasury_) ERC721("X7 DEX Maxi", "X7DMAXI") Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105) {
        mintFeeDestination = payable(mintFeeDestination_);
        treasury = payable(treasury_);
    }
```

The constructor of the `X7DEXMaxi` contract is defined with two parameters: `mintFeeDestination_` and `treasury_`. It inherits from the `ERC721`, `Ownable`, and `ERC721Enumerable` contracts.

Inside the constructor, the `mintFeeDestination` and `treasury` variables are assigned the values of `mintFeeDestination_` and `treasury_`, respectively. The `payable` keyword is used to ensure that these variables can receive Ether (payable addresses).

Additionally, the `ERC721` constructor is called with the parameters "X7 DEX Maxi" (the name of the token) and "X7DMAXI" (the symbol of the token). The `Ownable` constructor is also called with the parameter `0x7000a09c425ABf5173FF458dF1370C25d1C58105`, which sets the initial owner of the contract.

Overall, this constructor initializes the contract by setting the mint fee destination, treasury address, token name, token symbol, and the initial owner.

```js
    function whitelist(address holder) external view returns (bool) {
        return whitelistAuthority.inMigration(holder);
    }
```

The `whitelist` function is an external view function that takes an `address` parameter `holder` and returns a boolean value.

Inside the function, it calls the `inMigration` function of the `whitelistAuthority` contract, which is of type `IX7Migration`. It passes the `holder` address as an argument to the `inMigration` function, which checks if the address is in migration (whitelisted) and returns a boolean value indicating the result.

The `whitelist` function allows external callers to check if a specific address is whitelisted by invoking the `inMigration` function on the `whitelistAuthority` contract.

```js
    function setMintFeeDestination(address mintFeeDestination_) external onlyOwner {
        require(mintFeeDestination != mintFeeDestination_);
        address oldMintFeeDestination = mintFeeDestination;
        mintFeeDestination = payable(mintFeeDestination_);
        emit MintFeeDestinationSet(oldMintFeeDestination, mintFeeDestination_);
    }
```

The `setMintFeeDestination` function is an external function that can only be called by the contract owner. It takes an `address` parameter `mintFeeDestination_`, representing the new mint fee destination address.

Within the function, it first checks that the new mint fee destination address is different from the current one by using the `require` statement with the inequality condition. If the condition is not met, the function will revert.

Next, it assigns the current `mintFeeDestination` value to the `oldMintFeeDestination` variable, preserving the previous mint fee destination address for the event emission.

Then, it updates the `mintFeeDestination` variable with the new address provided. The `payable` keyword is used to ensure that the address can receive Ether.

Finally, it emits the `MintFeeDestinationSet` event, providing the old and new mint fee destination addresses as indexed parameters for tracking the change.

This function allows the contract owner to update the mint fee destination address, ensuring that it is different from the current one. The change is recorded through an event emission.

```js
    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)));
        string memory oldBaseURI = _internalBaseURI;
        _internalBaseURI = baseURI_;
        emit BaseURISet(oldBaseURI, baseURI_);
    }
```

The `setBaseURI` function is an external function that can only be called by the contract owner. It takes a `string` parameter `baseURI_`, representing the new base URI for token metadata.

Within the function, it first checks that the new base URI is different from the current one by comparing their keccak256 hashes. If the hashes are equal, indicating no change, the function will revert.

Next, it assigns the current `_internalBaseURI` value to the `oldBaseURI` variable, preserving the previous base URI for the event emission.

Then, it updates the `_internalBaseURI` variable with the new base URI provided.

Finally, it emits the `BaseURISet` event, providing the old and new base URIs as parameters for tracking the change.

This function allows the contract owner to update the base URI for token metadata, ensuring that it is different from the current one. The change is recorded through an event emission.

```js
    function setMintPrice(uint256 mintPrice_) external onlyOwner {
        require(mintPrice_ > mintPrice);
        uint256 oldPrice = mintPrice;
        mintPrice = mintPrice_;
        emit MintPriceSet(oldPrice, mintPrice_);
    }
```

The `setMintPrice` function is an external function that can only be called by the contract owner. It takes a `uint256` parameter `mintPrice_`, representing the new mint price for tokens.

Within the function, it first checks that the new mint price is greater than the current mint price by using the `require` statement with the greater than (`>`) condition. If the condition is not met, the function will revert.

Next, it assigns the current `mintPrice` value to the `oldPrice` variable, preserving the previous mint price for the event emission.

Then, it updates the `mintPrice` variable with the new price provided.

Finally, it emits the `MintPriceSet` event, providing the old and new mint prices as parameters for tracking the change.

This function allows the contract owner to update the mint price for tokens, ensuring that it is greater than the current price. The change is recorded through an event emission.

```js
    function setWhitelist(bool isActive) external onlyOwner {
        require(!whitelistComplete);
        require(whitelistActive != isActive);
        whitelistActive = isActive;
        emit WhitelistActivitySet(isActive);
    }
```

The `setWhitelist` function is an external function that can only be called by the contract owner. It takes a boolean parameter `isActive`, indicating whether the whitelist should be active or not.

Within the function, it first checks that the whitelist is not complete, meaning it can still be modified. If the whitelist is complete, the function will revert.

Next, it checks if the desired whitelist activity status (`isActive`) is different from the current whitelist activity status (`whitelistActive`). If they are the same, indicating no change, the function will revert.

Then, it updates the `whitelistActive` variable with the new whitelist activity status.

Finally, it emits the `WhitelistActivitySet` event, providing the new whitelist activity status as a parameter for tracking the change.

This function allows the contract owner to enable or disable the whitelist functionality, as long as the whitelist is not already complete. The change in whitelist activity is recorded through an event emission.

```js
    function setWhitelistComplete() external onlyOwner {
        require(!whitelistComplete);
        whitelistComplete = true;
        whitelistActive = false;
    }
```

The `setWhitelistComplete` function is an external function that can only be called by the contract owner. It does not take any parameters.

Within the function, it first checks that the whitelist is not already complete by using the `require` statement. If the whitelist is already complete, meaning it has been marked as such before, the function will revert.

Next, it sets the `whitelistComplete` variable to `true`, indicating that the whitelist is now complete.

Then, it sets the `whitelistActive` variable to `false`, effectively disabling the whitelist functionality.

This function allows the contract owner to mark the whitelist as complete, preventing further modifications. It also disables the whitelist functionality by setting `whitelistActive` to `false`.

```js
    function setWhitelistAuthority(address whitelistAuthority_) external onlyOwner {
        require(address(whitelistAuthority) != whitelistAuthority_);
        address oldWhitelistAuthority = address(whitelistAuthority);
        whitelistAuthority = IX7Migration(whitelistAuthority_);
        emit WhitelistAuthoritySet(oldWhitelistAuthority, whitelistAuthority_);
    }
```

The `setWhitelistAuthority` function is an external function that can only be called by the contract owner. It takes an `address` parameter `whitelistAuthority_`, representing the new address of the whitelist authority contract.

Within the function, it first checks that the new whitelist authority address is different from the current one by using the `require` statement with the inequality condition. If the condition is not met, the function will revert.

Next, it assigns the current `whitelistAuthority` address to the `oldWhitelistAuthority` variable, preserving the previous whitelist authority address for the event emission.

Then, it updates the `whitelistAuthority` variable with the new address provided, casting it to the `IX7Migration` interface type.

Finally, it emits the `WhitelistAuthoritySet` event, providing the old and new whitelist authority addresses as indexed parameters for tracking the change.

This function allows the contract owner to update the address of the whitelist authority contract, ensuring that it is different from the current one. The change is recorded through an event emission.

```js
    function openMinting() external onlyOwner {
        require(!mintingOpen);
        require(mintFeeDestination != address(0));
        mintingOpen = true;
        emit MintingOpen();
    }
```

The `openMinting` function is an external function that can only be called by the contract owner. It does not take any parameters.

Within the function, it first checks that minting is not already open by using the `require` statement. If minting is already open, meaning it has been called before, the function will revert.

Next, it checks that the `mintFeeDestination` address is not the zero address (`address(0)`). If it is the zero address, indicating that the mint fee destination has not been set, the function will revert.

Then, it sets the `mintingOpen` variable to `true`, indicating that minting is now open.

Finally, it emits the `MintingOpen` event, signaling that minting has been opened.

This function allows the contract owner to open the minting process by setting the `mintingOpen` variable to `true`, ensuring that minting is not already open and that the mint fee destination has been set. The opening of minting is recorded through an event emission.

```js
    function mint() external payable {
        _mintMany(1);
    }
```

The mint function is an external function that allows anyone to mint a single token by sending the required payment with the transaction.

Within the function, it calls the internal \_mintMany function, passing 1 as the numMints parameter. This means it will attempt to mint a single token.

This function enables anyone to mint a single token by calling the internal \_mintMany function. The payment sent with the transaction should match the required minting price.

```js
    function mintMany(uint256 numMints) external payable {
        _mintMany(numMints);
    }
```

The `mintMany` function is an external function that allows anyone to mint multiple tokens at once by specifying the number of tokens to mint and sending the required payment with the transaction.

Within the function, it calls the internal `_mintMany` function, passing the `numMints` parameter that represents the number of tokens to mint.

This function enables anyone to mint multiple tokens at once by calling the internal `_mintMany` function. The payment sent with the transaction should match the required minting price multiplied by the `numMints` value.

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

The `_mintMany` function is an internal function that is called to perform the actual minting of multiple tokens. It is called by the `mintMany` and `mint` functions.

Within the function, it first checks that minting is open by using the `require` statement. If minting is not open, the function will revert.

Next, it checks if either the whitelist is not active or the sender is included in the whitelist by calling the `inMigration` function of the `whitelistAuthority` contract. If the whitelist is active and the sender is not in the whitelist, the function will revert.

Then, it checks if the total supply of tokens plus the number of tokens to mint does not exceed the maximum supply. If it exceeds the maximum supply, the function will revert.

After that, it checks if the number of tokens to mint is greater than zero and does not exceed the maximum number of mints per transaction. If either condition is not met, the function will revert.

It also checks if the value sent with the transaction matches the total cost of minting the specified number of tokens. If the values do not match, the function will revert.

The function calculates the treasury fee by multiplying the value sent with the transaction by 10% and storing it in the `treasuryFee` variable.

Then, it attempts to transfer the treasury fee to the `treasury` address using the `call` function. If the transfer fails, the function will revert.

Next, it attempts to transfer the remaining value (after deducting the treasury fee) to the `mintFeeDestination` address using the `call` function. If the transfer fails, the function will revert.

It determines the `nextTokenId` by getting the current total supply of tokens.

Finally, it uses a for loop to mint the specified number of tokens by calling the `_mint` function inherited from the ERC721 contract, passing the sender's address and the token ID calculated as `nextTokenId + i`.

In summary, the `_mintMany` function performs the minting of multiple tokens. It checks various conditions such as minting availability, whitelist status, maximum supply, number of tokens to mint, and payment validation. It also calculates and transfers the required fees.

```js
    function _baseURI() internal view override returns (string memory) {
        return _internalBaseURI;
    }
```

The `_baseURI` function is an internal view function that overrides the `_baseURI` function from the ERC721 contract. It returns the base URI for the token metadata.

Within the function, it simply returns the `_internalBaseURI` variable, which represents the current base URI for the token metadata.
