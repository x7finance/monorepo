---
title: X7 Lending Pool Reserve Functions Breakdown
tags: [breakdowns]
---

Contains the contract functions only with a link to the full function in the contract code

## Interface

[interface IERC20](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L130)\
[interface IX7D](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L134)\
[interface X7DMinter](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L139)\
[interface X7DBurner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7D.sol#L150)

### Contract events

[event X7DSet(address oldAddress, address newAddress)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L185)\
[event EcosystemRecipientSet(address oldAddress, address newAddress)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L186)\
[event EcosystemPayerSet(address payorAddress, bool isPayer)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L187)\
[event LendingPoolSet(address oldAddress, address newAddress)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L188)\
[event FundsSent(address indexed recipient, uint256 amount)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L189)\
[event FundsReturned(address indexed sender, uint256 amount)](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L190)

### External Functions

[receive() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L200)\
[function depositETH() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L210)\
[function depositETHForRecipient(address recipient) external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L214)\
[function withdrawETH(uint256 amount) external](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L218)\
[function returnETH() external payable](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L225)\
[function setLendingPool(address lendingPool\_) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L229)\
[function setEcosystemRecipientAddress(address recipient) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L237)\
[function setX7D(address X7DAddress) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L245)\
[function setEcosystemPayer(address ecosystemPayerAddress, bool value) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L253)\
[function fundLendingPool(uint256 amount) external onlyOwner](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/contracts/source/X7LendingPoolReserve.sol#L260)
