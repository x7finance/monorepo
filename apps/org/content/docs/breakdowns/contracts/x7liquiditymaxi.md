---
title: X7 Liquidity Maxi NFT
tags: [breakdowns]
---

X7LiquidityMaxi which is an ERC721 token contract. It includes functionalities for minting and managing the token.

```js
interface IX7Migration {
    function inMigration(address) external view returns (bool);
}
```

The code snippet represents an interface called ΓÇ£IX7Migration.ΓÇ¥ It includes a single function called ΓÇ£inMigrationΓÇ¥ that accepts an address parameter and returns a boolean value.

The purpose of this interface is to define a contract's capability to check if a given address is in migration. The implementation of this interface would provide the logic to determine whether an address is considered to be in migration or not.

```js
    address payable public mintFeeDestination;
    address payable public treasury;
    string public _internalBaseURI;

    uint256 public maxSupply = 250;
    uint256 public mintPrice = 5 * 10**17;
    uint256 public maxMintsPerTransaction = 4;

    bool public mintingOpen;
    bool public whitelistComplete;

    bool public whitelistActive = true;
    IX7Migration public whitelistAuthority;
```

The code snippet declares several public variables and a public interface instance:

- `mintFeeDestination` and `treasury` are payable addresses that store the destination addresses for minting fees and treasury funds, respectively.
- `_internalBaseURI` is a public string variable representing the base URI for token metadata.
- `maxSupply` is a public uint256 variable indicating the maximum supply of tokens.
- `mintPrice` is a public uint256 variable representing the price (in wei) to mint a single token.
- `maxMintsPerTransaction` is a public uint256 variable specifying the maximum number of tokens that can be minted per transaction.
- `mintingOpen` is a boolean variable indicating whether minting is open or not.
- `whitelistComplete` is a boolean variable indicating if the whitelist is complete or not.
- `whitelistActive` is a boolean variable representing the current status of the whitelist.
- `whitelistAuthority` is an instance of the `IX7Migration` interface used to authorize addresses for whitelist-related functionality.

```js
    event MintingOpen();
    event MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination);
    event MintPriceSet(uint256 oldPrice, uint256 newPrice);
    event BaseURISet(string oldURI, string newURI);
    event WhitelistActivitySet(bool whitelistActive);
    event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority);
```

The code snippet includes several event declarations:

- `MintingOpen()` is an event triggered when minting is opened.
- `MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination)` is an event emitted when the mint fee destination address is updated. It provides the old and new destination addresses.
- `MintPriceSet(uint256 oldPrice, uint256 newPrice)` is an event emitted when the mint price is updated. It provides the old and new mint prices.
- `BaseURISet(string oldURI, string newURI)` is an event triggered when the base URI for token metadata is updated. It includes the old and new base URIs.
- `WhitelistActivitySet(bool whitelistActive)` is an event emitted when the whitelist activity status is updated. It provides the new whitelist activity status.
- `WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority)` is an event triggered when the whitelist authority address is updated. It includes the old and new whitelist authority addresses.

These events allow monitoring and tracking important changes and activities within the contract.

```js
    constructor(address mintFeeDestination_, address treasury_) ERC721("X7 Liquidity Maxi", "X7LMAXI") Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105) {
        mintFeeDestination = payable(mintFeeDestination_);
        treasury = payable(treasury_);
    }
```

The code snippet shows the constructor of the contract. It takes two address parameters: `mintFeeDestination_` and `treasury_`. The constructor also inherits from the ERC721, Ownable contracts.

Within the constructor:

- The `mintFeeDestination` variable is set to the `mintFeeDestination_` address passed as an argument. The `payable` keyword is used to convert the address into a payable address.
- The `treasury` variable is set to the `treasury_` address passed as an argument. Similarly, the `payable` keyword is used.

Additionally, the constructor includes a call to the constructors of the inherited contracts: ERC721 and Ownable. The ERC721 contract is initialized with the name ΓÇ£X7 Liquidity MaxiΓÇ¥ and symbol ΓÇ£X7LMAXIΓÇ¥. The Ownable contract is initialized with the owner address ΓÇ£0x7000a09c425ABf5173FF458dF1370C25d1C58105ΓÇ¥.

Overall, the constructor sets the initial values for the `mintFeeDestination` and `treasury` addresses and initializes the inherited contracts with their respective parameters.

```js
    function whitelist(address holder) external view returns (bool) {
        return whitelistAuthority.inMigration(holder);
    }
```

The code snippet represents a function called `whitelist`, which is an external view function.

- It takes an address parameter `holder`, which represents the address to check.
- Inside the function, it calls the `inMigration` function of the `whitelistAuthority` instance (of type `IX7Migration`).
- It passes the `holder` address as an argument to the `inMigration` function.
- The return value of the `inMigration` function is then returned by the `whitelist` function.

Essentially, the `whitelist` function provides a way to check whether a given address (`holder`) is in the migration whitelist. It delegates this check to the `inMigration` function of the `whitelistAuthority` contract instance and returns the result.

```js
    function setMintFeeDestination(address mintFeeDestination_) external onlyOwner {
        require(mintFeeDestination != mintFeeDestination_);
        address oldMintFeeDestination = mintFeeDestination;
        mintFeeDestination = payable(mintFeeDestination_);
        emit MintFeeDestinationSet(oldMintFeeDestination, mintFeeDestination_);
    }
```

The code snippet presents a function called `setMintFeeDestination`, which is an external function with the `onlyOwner` modifier.

- It takes an address parameter `mintFeeDestination_`, representing the new address for the mint fee destination.
- The function first checks if the new `mintFeeDestination` is different from the current one by using the `require` statement: `require(mintFeeDestination != mintFeeDestination_)`.
- If the condition is met, the function proceeds to update the `mintFeeDestination` variable with the new address. The `payable` keyword is used to convert the address into a payable address: `mintFeeDestination = payable(mintFeeDestination_)`.
- The function also emits the `MintFeeDestinationSet` event, providing the old and new mint fee destination addresses: `emit MintFeeDestinationSet(oldMintFeeDestination, mintFeeDestination_)`.

This function is restricted to be called only by the owner of the contract, allowing the contract owner to update the mint fee destination address.

```js
    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)));
        string memory oldBaseURI = _internalBaseURI;
        _internalBaseURI = baseURI_;
        emit BaseURISet(oldBaseURI, baseURI_);
    }
```

The code snippet showcases a function named `setBaseURI`, which is an external function with the `onlyOwner` modifier.

- It takes a string parameter `baseURI_`, representing the new base URI for token metadata.
- The function begins by checking if the new `baseURI_` is different from the current `_internalBaseURI` using the `require` statement: `require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)))`.
- If the condition is satisfied, the function proceeds to update the `_internalBaseURI` variable with the new base URI: `_internalBaseURI = baseURI_`.
- The function also emits the `BaseURISet` event, providing the old and new base URIs: `emit BaseURISet(oldBaseURI, baseURI_)`.

This function is intended to be invoked only by the owner of the contract, allowing the contract owner to modify the base URI for the token metadata.

```js
    function setMintPrice(uint256 mintPrice_) external onlyOwner {
        require(mintPrice_ > mintPrice);
        uint256 oldPrice = mintPrice;
        mintPrice = mintPrice_;
        emit MintPriceSet(oldPrice, mintPrice_);
    }
```

The provided code snippet showcases a function named `setMintPrice`, which is an external function with the `onlyOwner` modifier.

- It takes a `uint256` parameter `mintPrice_`, representing the new mint price for each token.
- The function includes a `require` statement to ensure that the new `mintPrice_` is greater than the current `mintPrice` value: `require(mintPrice_ > mintPrice)`.
- If the condition is met, the function continues to update the `mintPrice` variable with the new value: `mintPrice = mintPrice_`.
- The function also emits the `MintPriceSet` event, providing the old and new mint prices: `emit MintPriceSet(oldPrice, mintPrice_)`.

This function is restricted to be called only by the owner of the contract, allowing the contract owner to modify the mint price for each token.

```js
    function setWhitelist(bool isActive) external onlyOwner {
        require(!whitelistComplete);
        require(whitelistActive != isActive);
        whitelistActive = isActive;
        emit WhitelistActivitySet(isActive);
    }
```

The code snippet represents a function named `setWhitelist`, which is an external function with the `onlyOwner` modifier.

- It takes a boolean parameter `isActive`, indicating whether the whitelist should be active or not.
- The function includes two `require` statements. The first one checks if the whitelist is not complete: `require(!whitelistComplete)`. This ensures that the whitelist is not marked as complete.
- The second `require` statement checks if the new `isActive` value is different from the current `whitelistActive` value: `require(whitelistActive != isActive)`.
- If both conditions are satisfied, the function proceeds to update the `whitelistActive` variable with the new value: `whitelistActive = isActive`.
- The function also emits the `WhitelistActivitySet` event, providing the new whitelist activity status: `emit WhitelistActivitySet(isActive)`.

This function can only be called by the owner of the contract. It allows the contract owner to set the whitelist activity status, enabling or disabling the whitelist functionality. The function ensures that the whitelist is not marked as complete before modifying the `whitelistActive` variable.

```js
    function setWhitelistComplete() external onlyOwner {
        require(!whitelistComplete);
        whitelistComplete = true;
        whitelistActive = false;
    }
```

The provided code snippet shows a function named `setWhitelistComplete`, which is an external function with the `onlyOwner` modifier.

- The function begins with a `require` statement to check if the whitelist is not marked as complete: `require(!whitelistComplete)`. This ensures that the whitelist is not already marked as complete.
- If the condition is met, the function proceeds to update the `whitelistComplete` variable by setting it to `true`: `whitelistComplete = true`.
- Additionally, the `whitelistActive` variable is set to `false` to deactivate the whitelist functionality: `whitelistActive = false`.

This function can only be called by the owner of the contract. Its purpose is to mark the whitelist as complete, preventing any further modifications to the whitelist and deactivating the whitelist functionality by setting `whitelistActive` to `false`.

```js
    function setWhitelistAuthority(address whitelistAuthority_) external onlyOwner {
        require(address(whitelistAuthority) != whitelistAuthority_);
        address oldWhitelistAuthority = address(whitelistAuthority);
        whitelistAuthority = IX7Migration(whitelistAuthority_);
        emit WhitelistAuthoritySet(oldWhitelistAuthority, whitelistAuthority_);
    }
```

The provided code snippet presents a function called `setWhitelistAuthority`, which is an external function with the `onlyOwner` modifier.

- It takes an address parameter `whitelistAuthority_`, representing the new address for the whitelist authority contract.
- The function starts with a `require` statement to check if the new `whitelistAuthority_` address is different from the current `whitelistAuthority` address: `require(address(whitelistAuthority) != whitelistAuthority_)`.
- If the condition is satisfied, the function continues to update the `whitelistAuthority` variable. It assigns the new address `whitelistAuthority_` to the `whitelistAuthority` variable, casting it to the `IX7Migration` interface type: `whitelistAuthority = IX7Migration(whitelistAuthority_)`.
- The function also emits the `WhitelistAuthoritySet` event, providing the old and new whitelist authority addresses: `emit WhitelistAuthoritySet(oldWhitelistAuthority, whitelistAuthority_)`.

This function is restricted to be called only by the owner of the contract. It allows the contract owner to set the address of the whitelist authority contract by updating the `whitelistAuthority` variable.

```js
    function openMinting() external onlyOwner {
        require(!mintingOpen);
        require(mintFeeDestination != address(0));
        mintingOpen = true;
        emit MintingOpen();
    }
```

The provided code snippet represents a function named `openMinting`, which is an external function with the `onlyOwner` modifier.

- The function begins with a `require` statement to check if the `mintingOpen` flag is not already set to `true`: `require(!mintingOpen)`. This ensures that the minting process is not already open.
- It then includes another `require` statement to verify that the `mintFeeDestination` is not the zero address (0x0): `require(mintFeeDestination != address(0))`. This ensures that a valid mint fee destination address is set.
- If both conditions are satisfied, the function proceeds to set the `mintingOpen` flag to `true`, indicating that the minting process is open: `mintingOpen = true`.
- Lastly, the function emits the `MintingOpen` event, indicating that the minting process has been opened.

This function can only be called by the owner of the contract. It allows the contract owner to open the minting process by setting the `mintingOpen` flag to `true`, indicating that users can now mint tokens.

```js
    function mint() external payable {
        _mintMany(1);
    }
```

The provided code snippet shows a function named `mint`, which is an external function.

- It allows users to mint a single token by calling the internal function `_mintMany` with a parameter value of 1: `_mintMany(1)`.
- The function is marked as `payable`, indicating that users need to send Ether along with the function call.
- By calling `_mintMany(1)`, the function delegates the minting logic to the internal function `_mintMany` to handle the actual minting process.

This function enables users to mint a single token by invoking the internal `_mintMany` function with a count of 1. The amount of Ether sent along with the function call is expected to cover the minting cost.

```js
    function mintMany(uint256 numMints) external payable {
        _mintMany(numMints);
    }
```

The provided code snippet presents a function named `mintMany`, which is an external function.

- It allows users to mint multiple tokens by specifying the desired number of tokens to mint through the `numMints` parameter.
- The function is marked as `payable`, indicating that users need to send Ether along with the function call to cover the minting cost.
- Within the function, the minting logic is delegated to the internal function `_mintMany` by calling `_mintMany(numMints)`. The `numMints` parameter is passed to `_mintMany` to handle the actual minting process.

This function enables users to mint a specified number of tokens by invoking the internal `_mintMany` function with the desired count. The amount of Ether sent with the function call should be sufficient to cover the minting cost for the specified number of tokens.

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

The provided code snippet presents an internal function named `_mintMany`.

- It takes a parameter `numMints`, which represents the number of tokens to be minted.
- The function begins with several `require` statements to validate various conditions:
- `require(mintingOpen)` verifies that the minting process is open.
- `require(!whitelistActive || whitelistAuthority.inMigration(msg.sender))` checks if either the whitelist is not active or the sender is in the migration list.
- `require(totalSupply() + numMints <= maxSupply)` ensures that the total supply after minting does not exceed the maximum supply.
- `require(numMints > 0 && numMints <= maxMintsPerTransaction)` verifies that the number of mints is within the allowed range.
- `require(msg.value == numMints * mintPrice)` checks if the sent Ether matches the required amount for the requested number of mints.
- The function calculates the treasury fee by multiplying `msg.value` with 10%: `uint256 treasuryFee = msg.value * 10 / 100`.
- It then performs two `call` operations:
- The first one transfers the treasury fee to the `treasury` address: `(success,) = treasury.call{value: treasuryFee}("");`.
- The second one transfers the remaining amount (after deducting the treasury fee) to the `mintFeeDestination` address: `(success,) = mintFeeDestination.call{value: msg.value - treasuryFee}("");`.
- After the fee transfers, the function determines the `nextTokenId` by getting the current total supply of the ERC721 tokens.
- Finally, the function uses a loop to mint the specified number of tokens by calling `super._mint` and passing the sender's address and the calculated token ID (`nextTokenId + i`).

This internal function handles the minting process for multiple tokens. It performs various validations, calculates and transfers the required fees, and mints the tokens with unique token IDs starting from the next available ID.

```js
    function _baseURI() internal view override returns (string memory) {
        return _internalBaseURI;
    }
```

The provided code snippet represents an internal function named `_baseURI` that overrides the same function in the parent contract.

- The function is marked as `internal`, indicating that it can only be accessed from within the contract.
- It returns a string value, which represents the base URI for the ERC721 tokens.
- The function uses the `view` modifier, indicating that it does not modify the contract's state.
- The function is an override for the `_baseURI` function defined in the parent contract.
- Inside the function, it simply returns the value of the `_internalBaseURI` variable, which represents the current base URI for the tokens.

This function allows internal access to retrieve the base URI for the ERC721 tokens. The value returned by this function is used as the base for generating the URI of each token, which can be further customized or extended for specific token metadata.
