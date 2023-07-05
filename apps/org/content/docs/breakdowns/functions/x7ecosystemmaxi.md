---
title: X7 Eco System Maxi Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

[interface IX7Migration](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1267)

### Contract events

[event MintingOpen()](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1287)\
[event MintFeeDestinationSet(address indexed oldDestination, address indexed newDestination)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1288)\
[event MintPriceSet(uint256 oldPrice, uint256 newPrice)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1289)\
[event BaseURISet(string oldURI, string newURI)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1290)\
[event WhitelistActivitySet(bool whitelistActive)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1291)\
[event WhitelistAuthoritySet(address indexed oldWhitelistAuthority, address indexed newWhitelistAuthority)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1292)

### External Functions

[function whitelist(address holder) external view returns (bool)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1299)\
[function setMintFeeDestination(address mintFeeDestination\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1303)\
[function setBaseURI(string memory baseURI\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1310)\
[function setMintPrice(uint256 mintPrice\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1317)\
[function setWhitelist(bool isActive) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1324)\
[function setWhitelistComplete() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1331)\
[function setWhitelistAuthority(address whitelistAuthority\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1337)\
[function openMinting() external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1344)\
[function mint() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1351)\
[function mintMany(uint256 numMints) external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1355)

### Internal Functions

[function \_mintMany(uint256 numMints) internal](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1359)\
[function \_baseURI() internal view override returns (string memory)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7EcosystemMaxi.sol#L1383)
