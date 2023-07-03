---
title: X7 Borrowing Maxi NFT
tags: [breakdowns]
---

The `X7BorrowingMaxi` contract is an ERC721 token contract that allows users to mint a limited supply of tokens. It implements features such as setting the minting fee destination, defining the base URI for token metadata, and setting the whitelist authority. The contract supports batch minting of tokens and enforces various restrictions such as maximum mints per transaction and whitelist validation. It also includes treasury and ownership functionalities.

```js
interface IX7Migration {
    function inMigration(address) external view returns (bool);
}
```

The `IX7Migration` interface defines a single function called `inMigration` that takes an address as input and returns a boolean value. The purpose of this interface is to provide a way to check whether an address is in the migration process. The implementation of this function would determine the specific logic for determining migration status, such as checking a whitelist or other conditions.

```js
   address payable public mintFeeDestination;
    address payable public treasury;
    string public _internalBaseURI;

    uint256 public maxSupply = 100;
    uint256 public mintPrice = 10**18;
    uint256 public maxMintsPerTransaction = 2;

    bool public mintingOpen;
    bool public whitelistComplete;

    bool public whitelistActive = true;
    IX7Migration public whitelistAuthority;
```

The code snippet provided declares several state variables for the `X7BorrowingMaxi` contract:

- `mintFeeDestination`: An `address payable` variable that represents the destination address where the minting fees will be sent.
- `treasury`: An `address payable` variable that represents the treasury address where a portion of the minting fees will be sent.
- `_internalBaseURI`: A `string` variable that holds the base URI for the token metadata.
- `maxSupply`: An `uint256` variable indicating the maximum supply of tokens that can be minted.
- `mintPrice`: An `uint256` variable representing the price in wei to mint a single token.
- `maxMintsPerTransaction`: An `uint256` variable representing the maximum number of tokens that can be minted in a single transaction.
- `mintingOpen`: A `bool` variable indicating whether minting is currently open or not.
- `whitelistComplete`: A `bool` variable indicating whether the whitelist is complete or not.
- `whitelistActive`: A `bool` variable indicating whether the whitelist is currently active or not.
- `whitelistAuthority`: An instance of the `IX7Migration` interface representing the authority responsible for the whitelist.

```js
    event MintingOpen();
    event MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination);
    event MintPriceSet(uint256 oldPrice, uint256 newPrice);
    event BaseURISet(string oldURI, string newURI);
    event WhitelistActivitySet(bool whitelistActive);
    event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority);
```

The code snippet declares several events used within the `X7BorrowingMaxi` contract:

- `MintingOpen()`: An event triggered when the minting process is opened.
- `MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination)`: An event triggered when the mint fee destination address is updated, indicating the old and new destinations.
- `MintPriceSet(uint256 oldPrice, uint256 newPrice)`: An event triggered when the mint price is changed, providing the old and new prices.
- `BaseURISet(string oldURI, string newURI)`: An event emitted when the base URI for token metadata is modified, specifying the old and new URIs.
- `WhitelistActivitySet(bool whitelistActive)`: An event emitted when the whitelist activity status is modified, indicating whether the whitelist is active or not.
- `WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority)`: An event emitted when the whitelist authority address is updated, specifying the old and new authority addresses.

```js
    constructor(address mintFeeDestination_, address treasury_) ERC721("X7 Borrowing Maxi", "X7BMAXI") Ownable(0x7000a09c425ABf5173FF458dF1370C25d1C58105) {
        mintFeeDestination = payable(mintFeeDestination_);
        treasury = payable(treasury_);
    }
```

The constructor of the `X7BorrowingMaxi` contract is defined as follows:

- It takes two parameters: `mintFeeDestination_` and `treasury_`.
- It inherits from the `ERC721` contract with the token name "X7 Borrowing Maxi" and the symbol "X7BMAXI".
- It also inherits from the `Ownable` contract and sets the initial owner address as 0x7000a09c425ABf5173FF458dF1370C25d1C58105.
- The `mintFeeDestination` variable is set to the provided `mintFeeDestination_` address, converted to a payable address.
- The `treasury` variable is set to the provided `treasury_` address, converted to a payable address.

In summary, the constructor initializes the contract by setting the mint fee destination and treasury addresses, as well as defining the token name, symbol, and initial owner.

```js
    function whitelist(address holder) external view returns (bool) {
        return whitelistAuthority.inMigration(holder);
    }
```

The `whitelist` function is a public view function that takes an address `holder` as a parameter and returns a boolean value.

Inside the function, it calls the `inMigration` function of the `whitelistAuthority` contract, which implements the `IX7Migration` interface. The `inMigration` function is expected to take an address as input and return a boolean value indicating whether the address is in the migration process or satisfies the whitelist criteria.

The purpose of the `whitelist` function is to provide a way to check if a specific address is whitelisted or in the migration process according to the `whitelistAuthority`.

```js
    function setMintFeeDestination(address mintFeeDestination_) external onlyOwner {
        require(mintFeeDestination != mintFeeDestination_);
        address oldMintFeeDestination = mintFeeDestination;
        mintFeeDestination = payable(mintFeeDestination_);
        emit MintFeeDestinationSet(oldMintFeeDestination, mintFeeDestination_);
    }
```

The `setMintFeeDestination` function is a public function that can only be called by the contract owner. It takes an `address` parameter `mintFeeDestination_`, representing the new mint fee destination address.

The function performs the following steps:

1.  It checks if the new mint fee destination address is different from the current one by using the `require` statement.
2.  It stores the current mint fee destination address in the `oldMintFeeDestination` variable.
3.  It updates the `mintFeeDestination` variable with the new address, converting it to a payable address.
4.  It emits the `MintFeeDestinationSet` event, providing the old and new mint fee destination addresses as indexed parameters.

In summary, the function allows the contract owner to set a new mint fee destination address, triggering the `MintFeeDestinationSet` event to indicate the change.

```js
    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)));
        string memory oldBaseURI = _internalBaseURI;
        _internalBaseURI = baseURI_;
        emit BaseURISet(oldBaseURI, baseURI_);
    }
```

The `setBaseURI` function is a public function that can only be called by the contract owner. It takes a `string` parameter `baseURI_`, representing the new base URI for token metadata.

The function performs the following steps:

1.  It checks if the new base URI is different from the current one by comparing their keccak256 hashes using the `require` statement.
2.  It stores the current base URI in the `oldBaseURI` variable.
3.  It updates the `_internalBaseURI` variable with the new base URI.
4.  It emits the `BaseURISet` event, providing the old and new base URIs as parameters.

In summary, the function allows the contract owner to set a new base URI for the token metadata, triggering the `BaseURISet` event to indicate the change.

```js
    function setMintPrice(uint256 mintPrice_) external onlyOwner {
        require(mintPrice_ > mintPrice);
        uint256 oldPrice = mintPrice;
        mintPrice = mintPrice_;
        emit MintPriceSet(oldPrice, mintPrice_);
    }
```

The `setMintPrice` function is a public function that can only be called by the contract owner. It takes a `uint256` parameter `mintPrice_`, representing the new mint price in wei for a single token.

The function performs the following steps:

1.  It checks if the new mint price is greater than the current mint price using the `require` statement.
2.  It stores the current mint price in the `oldPrice` variable.
3.  It updates the `mintPrice` variable with the new mint price.
4.  It emits the `MintPriceSet` event, providing the old and new mint prices as parameters.

In summary, the function allows the contract owner to set a new mint price, triggering the `MintPriceSet` event to indicate the change.

```js
    function setWhitelist(bool isActive) external onlyOwner {
        require(!whitelistComplete);
        require(whitelistActive != isActive);
        whitelistActive = isActive;
        emit WhitelistActivitySet(isActive);
    }
```

The `setWhitelist` function is a public function that can only be called by the contract owner. It takes a boolean parameter `isActive`, representing whether the whitelist should be active or not.

The function performs the following steps:

1.  It checks if the whitelist is not yet complete by using the `require` statement.
2.  It checks if the new whitelist activity status is different from the current status by comparing their boolean values using the `require` statement.
3.  It updates the `whitelistActive` variable with the new activity status.
4.  It emits the `WhitelistActivitySet` event, providing the new whitelist activity status as a parameter.

In summary, the function allows the contract owner to enable or disable the whitelist functionality by setting the `whitelistActive` variable and emitting the `WhitelistActivitySet` event to indicate the change in whitelist activity.

```js
    function setWhitelistComplete() external onlyOwner {
        require(!whitelistComplete);
        whitelistComplete = true;
        whitelistActive = false;
    }
```

The `setWhitelistComplete` function is a public function that can only be called by the contract owner. It does not take any parameters.

The function performs the following steps:

1.  It checks if the whitelist is not yet complete by using the `require` statement.
2.  It sets the `whitelistComplete` variable to `true`, indicating that the whitelist is now complete.
3.  It sets the `whitelistActive` variable to `false`, effectively deactivating the whitelist.

In summary, the function allows the contract owner to mark the whitelist as complete and deactivate its functionality. This can be useful when the whitelist has served its purpose and no longer needs to be active.

```js
    function setWhitelistAuthority(address whitelistAuthority_) external onlyOwner {
        require(address(whitelistAuthority) != whitelistAuthority_);
        address oldWhitelistAuthority = address(whitelistAuthority);
        whitelistAuthority = IX7Migration(whitelistAuthority_);
        emit WhitelistAuthoritySet(oldWhitelistAuthority, whitelistAuthority_);
    }
```

The `setWhitelistAuthority` function is a public function that can only be called by the contract owner. It takes an `address` parameter `whitelistAuthority_`, representing the new address of the whitelist authority contract.

The function performs the following steps:

1.  It checks if the new whitelist authority address is different from the current one by using the `require` statement.
2.  It stores the current whitelist authority address in the `oldWhitelistAuthority` variable.
3.  It updates the `whitelistAuthority` variable with the new whitelist authority address, casting it to the `IX7Migration` interface.
4.  It emits the `WhitelistAuthoritySet` event, providing the old and new whitelist authority addresses as parameters.

In summary, the function allows the contract owner to set a new whitelist authority contract, triggering the `WhitelistAuthoritySet` event to indicate the change.

```js
    function openMinting() external onlyOwner {
        require(!mintingOpen);
        require(mintFeeDestination != address(0));
        mintingOpen = true;
        emit MintingOpen();
    }
```

The `openMinting` function is a public function that can only be called by the contract owner. It does not take any parameters.

The function performs the following steps:

1.  It checks if minting is not already open by using the `require` statement.
2.  It checks if the mint fee destination address is not the zero address (0x0) using the `require` statement.
3.  It sets the `mintingOpen` variable to `true`, indicating that minting is now open.
4.  It emits the `MintingOpen` event to indicate that minting has been opened.

In summary, the function allows the contract owner to open the minting process by setting the `mintingOpen` variable and emitting the `MintingOpen` event. This enables users to mint tokens when minting is open and the other conditions are met.

```js
    function mint() external payable {
        _mintMany(1);
    }
```

The `mint` function is a public function that can be called by anyone. It does not take any parameters.

The function performs the following steps:

1.  It calls the internal `_mintMany` function, passing `1` as the `numMints` parameter. This function is responsible for handling the minting process.
2.  Since the function is marked as `payable`, it means that the caller must send a certain amount of Ether along with the function call. The amount of Ether sent will be used to pay for the minting operation.

In summary, the `mint` function allows any user to mint a single token by calling the internal `_mintMany` function with a `numMints` value of 1. The user must also send the required amount of Ether to cover the minting cost.

```js
    function mintMany(uint256 numMints) external payable {
        _mintMany(numMints);
    }
```

The `mintMany` function is a public function that can be called by anyone. It takes a `uint256` parameter `numMints`, representing the number of tokens to mint.

The function performs the following steps:

1.  It calls the internal `_mintMany` function, passing `numMints` as the `numMints` parameter. This function is responsible for handling the minting process.
2.  Since the function is marked as `payable`, it means that the caller must send a certain amount of Ether along with the function call. The amount of Ether sent should be proportional to the `numMints` parameter and will be used to pay for the minting operation.

In summary, the `mintMany` function allows any user to mint multiple tokens by calling the internal `_mintMany` function with the desired `numMints` value. The user must also send the required amount of Ether to cover the minting cost.

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

The `_mintMany` function is an internal function that handles the minting process for multiple tokens. It takes a `uint256` parameter `numMints`, representing the number of tokens to mint.

The function performs the following steps:

1.  It checks if minting is currently open by using the `require` statement.
2.  It checks if either the whitelist is not active or the caller is in the whitelist by using the `require` statement and calling the `inMigration` function of the `whitelistAuthority` contract.
3.  It checks if the total supply of tokens plus the number of tokens to be minted does not exceed the maximum supply allowed by using the `require` statement.
4.  It checks if the number of tokens to be minted is greater than zero and does not exceed the maximum number of mints allowed per transaction by using the `require` statement.
5.  It checks if the amount of Ether sent by the caller is equal to the total cost of minting the specified number of tokens by using the `require` statement.
6.  It calculates the treasury fee by multiplying the amount of Ether sent by 10% and storing it in the `treasuryFee` variable.
7.  It transfers the treasury fee to the `treasury` address by using the `call` function and specifying the `value` parameter as the `treasuryFee`. The success of the transfer is checked with the `require` statement.
8.  It transfers the remaining amount of Ether (after deducting the treasury fee) to the `mintFeeDestination` address by using the `call` function and specifying the `value` parameter as `msg.value - treasuryFee`. The success of the transfer is checked with the `require` statement.
9.  It determines the next token ID to be minted by accessing the total supply of tokens using the `totalSupply` function of the `ERC721Enumerable` contract.
10. It uses a loop to mint the specified number of tokens by calling the `_mint` function inherited from the `ERC721` contract, passing the caller's address and the calculated token ID as parameters.

In summary, the `_mintMany` function handles the minting process for multiple tokens. It performs various checks and calculations related to minting requirements, fees, and addresses, and mints the tokens using the `_mint` function.

```js
    function _baseURI() internal view override returns (string memory) {
        return _internalBaseURI;
    }
```

The `_baseURI` function is an internal view function that overrides the `_baseURI` function from the inherited `ERC721` contract. It does not take any parameters.

The function performs a simple operation:

1.  It returns the value of the `_internalBaseURI` variable, which represents the base URI for the token metadata.

In summary, the `_baseURI` function returns the base URI that is used to construct the token metadata URI for each token in the contract. This allows for the retrieval of additional metadata associated with each token.
