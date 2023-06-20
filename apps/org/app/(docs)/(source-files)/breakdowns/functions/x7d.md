---
title: X7D Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

[interface IX7D](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L310)\
[interface X7DMinter](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L316)\
[interface X7DBurner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L330)

### Contract events

[event AuthorizedMinterSet(address indexed minterAddress, bool isAuthorized)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L393)\
[event AuthorizedRedeemerSet(address indexed redeemerAddress, bool isAuthorized)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L394)

### Read-Only Functions

[function authorizedMintersCount() external view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L400)\
[function authorizedRedeemersCount() external view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L404)\
[function circulatingSupply() external view returns (uint256)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L458)

### External Functions

[receive() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L398)\
[function setAuthorizedMinter(address minterAddress, bool isAuthorized) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L408)\
[function setAuthorizedRedeemer(address redeemerAddress, bool isAuthorized) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L428)\
[function mint(address to, uint256 amount) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L448)\
[function burn(address from, uint256 amount) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L453)
