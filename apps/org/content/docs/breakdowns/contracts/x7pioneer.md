---
title: X7 Pioneer NFT
tags: [breakdowns]
---

The `X7Pioneer` contract is an ERC721 token contract with support for variant selection, airdrops, and claiming rewards. Token owners can unlock transfers by paying a fee, select a variant for their tokens, and claim accumulated rewards. The contract also includes features like airdropping tokens to recipients, disabling the airdrop functionality, and enforcing transfer restrictions.

```js
enum Variant {
    NOT_SELECTED,
    SELECTION1,
    SELECTION2,
    SELECTION3,
    SELECTION4,
    SELECTION5,
    SELECTION6,
    SELECTION7
}

address payable public transferUnlockFeeDestination;
string public _internalBaseURI;

mapping(uint256 => bool) public transferUnlocked;

uint256 public lastETHBalance;
uint256 public totalRewards;

// token ID => claimed rewards
mapping(uint256 => uint256) public rewardsClaimed;

// 0.07 ETH
uint256 public transferUnlockFee = 7 * 10**16;

bool public airdropActive = true;
mapping(address => bool) public receivedAirdrop;

bool public allowTokenOwnerVariantSelection = true;
// tokenId => Variant
mapping(uint256 => Variant) public selectedVariantIndex;
```

The contract defines an enumeration called `Variant` representing different options for tokens. It includes state variables for the destination of transfer unlock fees, the base URI for token metadata, transfer unlock status for each token, the last ETH balance and total rewards in the contract, claimed rewards for each token, the transfer unlock fee amount, the status of the airdrop feature, addresses that have received airdropped tokens, and whether token owners can select a variant for their tokens.

```js
event TransferUnlockFeeDestinationSet(address indexed oldDestination, address indexed newDestination);
event TransferUnlockFeeSet(uint256 oldPrice, uint256 newPrice);

event BaseURISet(string oldURI, string newURI);
event TransferUnlocked(uint256 indexed tokenId);

event RewardsClaimed(uint256 indexed tokenId, address indexed receipient, uint256 amount);

event AirdropDisabled();
event VariantSelected(uint256 indexed tokenId, Variant variantIndex);
```

The contract emits several events to communicate important actions and updates. These events include:

- `TransferUnlockFeeDestinationSet`: Triggered when the transfer unlock fee destination address is changed.
- `TransferUnlockFeeSet`: Triggered when the transfer unlock fee amount is updated.
- `BaseURISet`: Triggered when the base URI for token metadata is set.
- `TransferUnlocked`: Triggered when the transfer of a token is successfully unlocked.
- `RewardsClaimed`: Triggered when rewards are claimed for a token.
- `AirdropDisabled`: Triggered when the airdrop feature is disabled.
- `VariantSelected`: Triggered when a variant is selected for a token.

```js
constructor(address transferUnlockFeeDestination_) ERC721("X7 Pioneer", "X7PIONEER") Ownable(msg.sender) {
    transferUnlockFeeDestination = payable(transferUnlockFeeDestination_);
}
```

The constructor of the contract initializes the `X7 Pioneer` ERC721 token by setting the token name and symbol (`X7 Pioneer` and `X7PIONEER`, respectively). It also sets the owner of the contract and assigns the provided `transferUnlockFeeDestination_` address as the destination for transfer unlock fees.

```js
receive () external payable {}
```

The contract includes a `receive` function, which is a special function that is automatically called when the contract receives ETH. It is marked as `external` and `payable`, meaning it can receive ETH from external accounts, and the function can receive value (ETH) along with the call.

```js
function setTransferUnlockFeeDestination(address transferUnlockFeeDestination_) external onlyOwner {
    require(transferUnlockFeeDestination != transferUnlockFeeDestination_);
    address oldTransferUnlockFeeDestination = transferUnlockFeeDestination;
    transferUnlockFeeDestination = payable(transferUnlockFeeDestination_);
    emit TransferUnlockFeeDestinationSet(oldTransferUnlockFeeDestination, transferUnlockFeeDestination_);
}
```

The `setTransferUnlockFeeDestination` function allows the owner of the contract to update the address where the transfer unlock fees will be sent. The function takes the new `transferUnlockFeeDestination_` address as a parameter. It first checks that the new address is different from the current one. If so, it updates the `transferUnlockFeeDestination` variable with the new address and emits the `TransferUnlockFeeDestinationSet` event, providing the old and new destinations as parameters.

```js
function setBaseURI(string memory baseURI_) external onlyOwner {
    require(keccak256(abi.encodePacked(_internalBaseURI)) != keccak256(abi.encodePacked(baseURI_)));
    string memory oldBaseURI = _internalBaseURI;
    _internalBaseURI = baseURI_;
    emit BaseURISet(oldBaseURI, baseURI_);
}
```

The `setBaseURI` function allows the owner of the contract to update the base URI used for generating metadata URIs for the tokens. The function takes the new `baseURI_` as a parameter. It first checks that the new base URI is different from the current one by comparing their keccak256 hashes. If they are different, it updates the `_internalBaseURI` variable with the new base URI and emits the `BaseURISet` event, providing the old and new URIs as parameters.

```js
function setTransferUnlockFee(uint256 transferUnlockFee_) external onlyOwner {
    require(transferUnlockFee_ != transferUnlockFee);
    uint256 oldTransferUnlockFee = transferUnlockFee;
    transferUnlockFee = transferUnlockFee_;
    emit TransferUnlockFeeSet(oldTransferUnlockFee, transferUnlockFee_);
}
```

The `setTransferUnlockFee` function allows the owner of the contract to update the transfer unlock fee amount. The function takes the new `transferUnlockFee_` as a parameter. It first checks that the new fee is different from the current one. If they are different, it updates the `transferUnlockFee` variable with the new fee and emits the `TransferUnlockFeeSet` event, providing the old and new fee amounts as parameters.

```js
function SetAllowTokenOwnerVariantSelection(bool allowed) external onlyOwner {
    require(allowTokenOwnerVariantSelection != allowed);
    allowTokenOwnerVariantSelection = allowed;
}
```

The `SetAllowTokenOwnerVariantSelection` function allows the owner of the contract to enable or disable the ability for token owners to select a variant for their tokens. The function takes a boolean parameter `allowed` indicating whether token owner variant selection should be allowed or not. It checks that the desired setting is different from the current one. If they are different, it updates the `allowTokenOwnerVariantSelection` variable with the new setting.

```js
function airdropTokens(address[] memory recipients) external onlyOwner {
    require(airdropActive);
    for (uint i=0; i < recipients.length; i++) {
        if (!receivedAirdrop[recipients[i]]) {
            uint256 nextTokenId = ERC721Enumerable.totalSupply();
            super._mint(recipients[i], nextTokenId + i);
        }
    }
}
```

The `airdropTokens` function allows the owner of the contract to airdrop tokens to multiple recipients. It takes an array of `recipients` addresses as a parameter. The function first checks if the airdrop feature is active. If it is, it iterates over the `recipients` array and mints tokens for recipients who have not already received an airdrop. The token IDs are determined by adding the current total supply of tokens to the index of the recipient in the `recipients` array.

```js
function disableAirDrop() external onlyOwner {
    require(airdropActive);
    airdropActive = false;
    emit AirdropDisabled();
}
```

The `disableAirDrop` function allows the owner of the contract to disable the airdrop feature. It checks if the airdrop feature is currently active and, if so, sets the `airdropActive` flag to `false`. It also emits the `AirdropDisabled` event to signal that the airdrop feature has been disabled.

```js
function unlockTransfer(uint256 tokenId) external payable {
    require(!transferUnlocked[tokenId]);
    require(ownerOf(tokenId) == msg.sender);
    require(msg.value == transferUnlockFee);
    (bool ok, ) = transferUnlockFeeDestination.call{value: msg.value}("");
    require(ok);
    transferUnlocked[tokenId] = true;
    emit TransferUnlocked(tokenId);
}
```

The `unlockTransfer` function allows a token owner to unlock the transfer of a specific token by paying the transfer unlock fee. It takes the `tokenId` of the token as a parameter. The function first checks if the transfer of the token has not been unlocked yet, if the caller is the owner of the token, and if the sent value is equal to the transfer unlock fee. It then transfers the fee to the `transferUnlockFeeDestination` address and sets the `transferUnlocked` flag for the token to `true`. Finally, it emits the `TransferUnlocked` event to indicate that the transfer of the token has been successfully unlocked.

```js
function claimRewards(uint256[] memory tokenIds) public nonReentrant {
    if (lastETHBalance < address(this).balance) {
        totalRewards += (address(this).balance - lastETHBalance);
    }

    uint256 claimable;
    uint256 tokenClaimable;

    for (uint i=0; i < tokenIds.length; i++) {
        require(ownerOf(tokenIds[i]) == msg.sender);
        uint256 tokenTotalRewards = totalRewards / totalSupply();
        uint256 tokenClaimedRewards = rewardsClaimed[tokenIds[i]];
        if (tokenClaimedRewards < tokenTotalRewards) {
            rewardsClaimed[tokenIds[i]] = tokenTotalRewards;
            tokenClaimable = tokenTotalRewards - tokenClaimedRewards;
            claimable += tokenClaimable;
            emit RewardsClaimed(tokenIds[i], msg.sender, tokenClaimable);
        }
    }

    if (claimable > 0) {
        lastETHBalance = address(this).balance - claimable;
        (bool ok, ) = msg.sender.call{value: claimable}("");
        require(ok);
    }
}
```

The `claimRewards` function allows a token owner to claim their accumulated rewards for one or more tokens. It takes an array of `tokenIds` as a parameter. The function first checks if the contractΓÇÖs ETH balance has increased since the last rewards calculation. If it has, the difference is added to the `totalRewards`.

Then, for each token ID in the `tokenIds` array, the function checks if the caller is the owner of the token and if there are unclaimed rewards for the token. If there are, it updates the `rewardsClaimed` mapping to mark the rewards as claimed, calculates the amount of rewards claimable for the token, and adds it to the `claimable` variable. It also emits the `RewardsClaimed` event to indicate the claimed rewards for the token.

After processing all token IDs, if there are claimable rewards (`claimable > 0`), the function updates the `lastETHBalance` to the current contract balance minus the claimable rewards, transfers the claimable rewards to the callerΓÇÖs address, and reverts the transaction if the transfer fails.

```js
function unclaimedRewards(uint256 tokenId) public view returns (uint256) {
    uint256 totalRewards_ = totalRewards;
    if (lastETHBalance < address(this).balance) {
        totalRewards_ += (address(this).balance - lastETHBalance);
    }
    return (totalRewards / totalSupply()) - rewardsClaimed[tokenId];
}
```

The `unclaimedRewards` function is a public view function that calculates the amount of unclaimed rewards for a specific token, identified by its `tokenId`.

The function first initializes `totalRewards_` with the current `totalRewards` value. Then, it checks if the contractΓÇÖs ETH balance has increased since the last rewards calculation. If it has, the difference is added to `totalRewards_`.

Finally, the function calculates the unclaimed rewards for the token by dividing `totalRewards_` by the total supply of tokens and subtracting the amount of rewards already claimed for the token (`rewardsClaimed[tokenId]`).

The result is the amount of unclaimed rewards for the specified token.

```js
function unclaimedRewards(uint[] memory tokenIds) public view returns (uint256) {
    uint256 totalRewards_ = totalRewards;
    if (lastETHBalance < address(this).balance) {
        totalRewards_ += (address(this).balance - lastETHBalance);
    }

    uint256 claimable;
    uint256 tokenClaimable;

    for (uint i=0; i < tokenIds.length; i++) {
        require(ownerOf(tokenIds[i]) == msg.sender);
        uint256 tokenTotalRewards = totalRewards / totalSupply();
        uint256 tokenClaimedRewards = rewardsClaimed[tokenIds[i]];
        if (tokenClaimedRewards < tokenTotalRewards) {
            tokenClaimable = tokenTotalRewards - tokenClaimedRewards;
            claimable += tokenClaimable;
        }
    }

    return claimable;
}
```

The `unclaimedRewards` function is a public view function that calculates the total amount of unclaimed rewards for an array of token IDs (`tokenIds`) for the caller of the function.

The function first initializes `totalRewards_` with the current `totalRewards` value. Then, it checks if the contractΓÇÖs ETH balance has increased since the last rewards calculation. If it has, the difference is added to `totalRewards_`.

Next, the function iterates over each token ID in the `tokenIds` array. For each token, it checks if the caller is the owner of the token. If the owner is correct, it calculates the total rewards per token by dividing `totalRewards_` by the total supply of tokens. It also retrieves the amount of rewards already claimed for the token from the `rewardsClaimed` mapping.

If the claimed rewards for the token are less than the total rewards per token, it calculates the claimable rewards by subtracting the claimed rewards from the total rewards per token, and adds this value to the `claimable` variable.

Finally, the function returns the total amount of claimable rewards for the callerΓÇÖs tokens in the `tokenIds` array.

```js
function selectVariant(uint256 tokenId, Variant variant) external {
    require(allowTokenOwnerVariantSelection);
    require(ownerOf(tokenId) == msg.sender);
    require(variant != Variant.NOT_SELECTED);
    require(variant != selectedVariantIndex[tokenId]);
    selectedVariantIndex[tokenId] = variant;
    emit VariantSelected(tokenId, variant);
}
```

The `selectVariant` function allows the owner of a token to select a variant for that token. It takes the `tokenId` of the token and the desired `variant` as parameters.

The function first checks if token owner variant selection is allowed by verifying the `allowTokenOwnerVariantSelection` flag. Then, it checks if the caller is the owner of the token and if the specified variant is not the `NOT_SELECTED` value and is different from the currently selected variant for the token.

If all requirements are met, the function updates the `selectedVariantIndex` mapping for the token to the new variant value and emits the `VariantSelected` event to indicate that the variant has been successfully selected for the token.

```js
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
) internal override {
    require(transferUnlocked[tokenId] || msg.sender == owner());
    super._beforeTokenTransfer(from, to, tokenId);

}
```

The `_beforeTokenTransfer` function is an internal function that is called before a token transfer occurs. It overrides the same function in the inherited ERC721 contract.

Within the function, it checks whether the transfer of the token with the given `tokenId` is unlocked (`transferUnlocked[tokenId]` is `true`) or if the caller is the owner of the token (`msg.sender == owner()`). If either of these conditions is satisfied, the transfer is allowed to proceed. Otherwise, the function will revert and the token transfer will be prevented.

After performing the necessary transfer checks, the function calls the `_beforeTokenTransfer` function of the parent ERC721 contract using the `super` keyword, which allows the parent contract to perform any additional logic related to the token transfer.

```js
function _baseURI() internal view override returns (string memory) {
    return _internalBaseURI;
}
```

The `_baseURI` function is an internal view function that overrides the same function in the inherited ERC721 contract. It is used to provide the base URI for generating metadata URIs for the tokens.

Within the function, it simply returns the value of the `_internalBaseURI` variable, which represents the base URI for the token metadata.
