---
title: X7 Pioneer Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Contract events

- [event TransferUnlockFeeDestinationSet(address indexed oldTransferUnlockFeeDestination, address indexed newTransferUnlockFeeDestination)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1342)
- [event TransferUnlockFeeSet(uint256 indexed oldTransferUnlockFee, uint256 indexed newTransferUnlockFee)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1343)
- [event BaseURISet(string oldBaseURI, string newBaseURI)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1345)
- [event TransferUnlocked(address indexed owner, uint256 indexed tokenID)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1346)
- [event RewardsClaimed(address indexed owner, uint256 indexed tokenID, uint256 indexed rewards)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1348)
- [event AirdropDisabled()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1350)
- [event VariantSelected(address indexed owner, uint256 indexed tokenID, uint8 indexed variant)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1351)

## External Functions

- [receive () external payable {}](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1357)
- [function setTransferUnlockFeeDestination(address destination) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1359)
- [function setBaseURI(string memory baseURI\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1366)
- [function setTransferUnlockFee(uint256 fee) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1373)
- [function SetAllowTokenOwnerVariantSelection(bool allowed) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1380)
- [function airdropTokens(address[] calldata airdropAddresses) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1385)
- [function disableAirDrop() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1395)
- [function unlockTransfer(address owner, uint256 tokenID) external payable ](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1401)
- [function claimRewards(uint256 tokenID) public nonReentrant](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1411)
- [function selectVariant(uint256 tokenID, uint8 variant) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1468)

## Internal Functions

- [function \_beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1477)
- [function \_baseURI() internal view virtual returns (string memory)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1486)

## Read-Only Functions

- [function unclaimRewards(uint256 tokenId) public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1438)
- [function unclaimRewards(uint[] memory tokenIds) public view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7Pioneer.sol#L1446)
