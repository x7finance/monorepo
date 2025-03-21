---
title: X7 Lending Pool
tags: [breakdowns]
---

## Smart Contract Function Variables

### EcosystemRecipientSet

| Parameter Name | Parameter Type | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `oldAddress`   | `address`      | The old ecosystem recipient address. |
| `newAddress`   | `address`      | The new ecosystem recipient address. |

### RouterSet

| Parameter Name | Parameter Type | Description             |
| -------------- | -------------- | ----------------------- |
| `oldAddress`   | `address`      | The old router address. |
| `newAddress`   | `address`      | The new router address. |

### WETHSet

| Parameter Name | Parameter Type | Description           |
| -------------- | -------------- | --------------------- |
| `oldAddress`   | `address`      | The old WETH address. |
| `newAddress`   | `address`      | The new WETH address. |

### X7DSet

| Parameter Name | Parameter Type | Description                   |
| -------------- | -------------- | ----------------------------- |
| `oldAddress`   | `address`      | The old X7D contract address. |
| `newAddress`   | `address`      | The new X7D contract address. |

### LoanTermActiveStateSet

| Parameter Name | Parameter Type | Description                                                        |
| -------------- | -------------- | ------------------------------------------------------------------ |
| `newAddress`   | `address`      | The address of the loan term contract for which the state changed. |
| `isActive`     | `bool`         | The new active state of the loan term contract.                    |

### LiquidationRewardSet

| Parameter Name | Parameter Type | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `oldReward`    | `uint256`      | The old liquidation reward amount. |
| `newReward`    | `uint256`      | The new liquidation reward amount. |

### OriginationSharesSet

| Parameter Name                         | Parameter Type | Description                                                              |
| -------------------------------------- | -------------- | ------------------------------------------------------------------------ |
| `oldEcosystemSplitterOriginationShare` | `uint256`      | The old percentage share of origination fees for the ecosystem splitter. |
| `oldX7DAOOriginationShare`             | `uint256`      | The old percentage share of origination fees for X7DAO.                  |
| `oldX7100OriginationShare`             | `uint256`      | The old percentage share of origination fees for X7100.                  |
| `oldLendingPoolOriginationShare`       | `uint256`      | The old percentage share of origination fees for the lending pool.       |
| `newEcosystemSplitterOriginationShare` | `uint256`      | The new percentage share of origination fees for the ecosystem splitter. |
| `newX7DAOOriginationShare`             | `uint256`      | The new percentage share of origination fees for X7DAO.                  |
| `newX7100OriginationShare`             | `uint256`      | The new percentage share of origination fees for X7100.                  |
| `newLendingPoolOriginationShare`       | `uint256`      | The new percentage share of origination fees for the lending pool.       |

### PremiumSharesSet

| Parameter Name                     | Parameter Type | Description                                                          |
| ---------------------------------- | -------------- | -------------------------------------------------------------------- |
| `oldEcosystemSplitterPremiumShare` | `uint256`      | The old percentage share of premium fees for the ecosystem splitter. |
| `oldX7DAOPremiumShare`             | `uint256`      | The old percentage share of premium fees for X7DAO.                  |
| `oldX7100PremiumShare`             | `uint256`      | The old percentage share of premium fees for X7100.                  |
| `oldLendingPoolPremiumShare`       | `uint256`      | The old percentage share of premium fees for the lending pool.       |
| `newEcosystemSplitterPremiumShare` | `uint256`      | The new percentage share of premium fees for the ecosystem splitter. |
| `newX7DAOPremiumShare`             | `uint256`      | The new percentage share of premium fees for X7DAO.                  |
| `newX7100PremiumShare`             | `uint256`      | The new percentage share of premium fees for X7100.                  |
| `newLendingPoolPremiumShare`       | `uint256`      | The new percentage share of premium fees for the lending pool.       |

### EcosystemSplitterSet

| Parameter Name | Parameter Type | Description                         |
| -------------- | -------------- | ----------------------------------- |
| `oldAddress`   | `address`      | The old ecosystem splitter address. |
| `newAddress`   | `address`      | The new ecosystem splitter address. |

### X7100ReserveRecipientSet

| Parameter Name | Parameter Type | Description                              |
| -------------- | -------------- | ---------------------------------------- |
| `oldAddress`   | `address`      | The old X7100 reserve recipient address. |
| `newAddress`   | `address`      | The new X7100 reserve recipient address. |

### X7DAORewardRecipientSet

| Parameter Name | Parameter Type | Description                             |
| -------------- | -------------- | --------------------------------------- |
| `oldAddress`   | `address`      | The old X7DAO reward recipient address. |
| `newAddress`   | `address`      | The new X7DAO reward recipient address. |

### DiscountAuthoritySet

| Parameter Name | Parameter Type | Description                                  |
| -------------- | -------------- | -------------------------------------------- |
| `oldAddress`   | `address`      | The old discount authority contract address. |
| `newAddress`   | `address`      | The new discount authority contract address. |

### RetainedFeeNumeratorSet

| Parameter Name | Parameter Type | Description                           |
| -------------- | -------------- | ------------------------------------- |
| `oldValue`     | `uint256`      | The old retained fee numerator value. |
| `newValue`     | `uint256`      | The new retained fee numerator value. |

### LendingPoolReserveSet

| Parameter Name | Parameter Type | Description                                    |
| -------------- | -------------- | ---------------------------------------------- |
| `oldAddress`   | `address`      | The old lending pool reserve contract address. |
| `newAddress`   | `address`      | The new lending pool reserve contract address. |

### EcosystemFeeNumeratorSet

| Parameter Name | Parameter Type | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `oldValue`     | `uint256`      | The old ecosystem fee numerator value. |
| `newValue`     | `uint256`      | The new ecosystem fee numerator value. |

### X7DAOFeeNumeratorSet

| Parameter Name | Parameter Type | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `oldValue`     | `uint256`      | The old X7DAO fee numerator value. |
| `newValue`     | `uint256`      | The new X7DAO fee numerator value. |

### X7100FeeNumerator

Set

| Parameter Name | Parameter Type | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `oldValue`     | `uint256`      | The old X7100 fee numerator value. |
| `newValue`     | `uint256`      | The new X7100 fee numerator value. |

### OriginationFeeSet

| Parameter Name | Parameter Type | Description                     |
| -------------- | -------------- | ------------------------------- |
| `oldValue`     | `uint256`      | The old origination fee amount. |
| `newValue`     | `uint256`      | The new origination fee amount. |

### PremiumFeeSet

| Parameter Name | Parameter Type | Description                 |
| -------------- | -------------- | --------------------------- |
| `oldValue`     | `uint256`      | The old premium fee amount. |
| `newValue`     | `uint256`      | The new premium fee amount. |

### OriginationPaymentMade

| Parameter Name  | Parameter Type | Description                                    |
| --------------- | -------------- | ---------------------------------------------- |
| `loanId`        | `uint256`      | The ID of the loan for which payment was made. |
| `paymentAmount` | `uint256`      | The amount of the origination payment made.    |

### PremiumPaymentMade

| Parameter Name  | Parameter Type | Description                                    |
| --------------- | -------------- | ---------------------------------------------- |
| `loanId`        | `uint256`      | The ID of the loan for which payment was made. |
| `paymentAmount` | `uint256`      | The amount of the premium payment made.        |

### DiscountedQuoteCalculated

| Parameter Name | Parameter Type | Description                                                 |
| -------------- | -------------- | ----------------------------------------------------------- |
| `loanId`       | `uint256`      | The ID of the loan for which the quote was calculated.      |
| `quoteAmount`  | `uint256`      | The amount of the discounted quote calculated for the loan. |

### LoanLiquidated

| Parameter Name | Parameter Type | Description                                          |
| -------------- | -------------- | ---------------------------------------------------- |
| `loanId`       | `uint256`      | The ID of the loan that was successfully liquidated. |

### LoanBoughtOut

| Parameter Name | Parameter Type | Description                                          |
| -------------- | -------------- | ---------------------------------------------------- |
| `loanId`       | `uint256`      | The ID of the loan that was successfully bought out. |
