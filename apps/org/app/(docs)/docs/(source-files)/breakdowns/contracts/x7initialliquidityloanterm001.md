---
title: X7 Initial Liquidity Loan Term
tags: [breakdowns]
---

https://medium.com/@mikemurpher/x7-initial-liquidity-loan-term-225ecb32a706

Smart Contract

This contract uses an abstract base contract shared among all our standard Initial Liquidity Loan Terms. Although this contract only allows a small number of configuration changes (namely minimum and maximum loan amounts and durations), variations can be deployed and added to the Active Loan terms of the Lending Pool.

```js
interface IX7InitialLiquidityLoanTerm {
    enum LiquidationPolicy {
        NONE,
        LIQUIDATE_INCREMENTAL,
        LIQUIDATE_IN_FULL
    }

    enum LoanState {
        ACTIVE,
        COMPLETE
    }

    event BaseURISet(string oldURI, string newURI);
    event UseBaseURIOnlySet(bool shouldUseBaseURIOnly);
    event LoanLengthLimitsSet(uint256 oldMinSeconds, uint256 oldMaxSeconds, uint256 minSeconds, uint256 maxSeconds);
    event LoanAmountLimitsSet(uint256 oldMinAmount, uint256 oldMaxAmount, uint256 minAmount, uint256 maxAmount);
    event LoanAuthoritySet(address contractAddress, bool isAuthority);
    event LoanOriginated(uint256 indexed loanID);
    event LoanComplete(uint256 indexed loanID);

    function ownerOf(uint256 tokenId) external view returns (address owner);
    function internalBaseURI() external view returns (string memory);
    function useBaseURIOnly() external view returns (bool);
    function loanAuthorities(address) external view returns (bool);
    function principleFractionDenominator() external view returns (uint16);
    function loanPrecision() external view returns (uint256);
    function repaymentPeriodIndices(uint256) external view returns (uint8);
    function premiumPeriodIndices(uint256) external view returns (uint8);
    function originationFeeNumerator() external view returns (uint16);
    function minimumLoanAmount() external view returns (uint256);
    function maximumLoanAmount() external view returns (uint256);
    function minimumLoanLengthSeconds() external view returns (uint256);
    function maximumLoanLengthSeconds() external view returns (uint256);
    function repaymentFractions(uint8 period) external view returns (uint16);
    function premiumFractions(uint8 period) external view returns (uint16);
    function liquidationPolicy() external view returns (LiquidationPolicy);
    function loanAmount(uint256 loanID) external view returns (uint256);
    function premiumAmountPaid(uint256 loanID) external view returns (uint256);
    function principalAmountPaid(uint256 loanID) external view returns (uint256);
    function premiumAmount(uint256 loanID) external view returns (uint256);
    function premiumModifierNumerator(uint256 loanID) external view returns (uint256);
    function originationFeeModifierNumerator(uint256 loanID) external view returns (uint256);
    function originationFeeCollected(uint256 loanID) external view returns (uint256);
    function loanLengthSeconds(uint256 loanID) external view returns (uint256);
    function loanStartTime(uint256 loanID) external view returns (uint256);
    function loanState(uint256 loanID) external view returns (LoanState);
    function numberOfRepaymentPeriods() external view returns (uint256);
    function numberOfPremiumPeriods() external view returns (uint256);
    function getOriginationAmounts(uint256 loanAmount_) external view returns (uint256 loanAmountRounded, uint256 originationFee);
    function isComplete(uint256 loanID) external view returns (bool);
    function liquidationAmount(uint256 loanID) external view returns (uint256);
    function getQuote(uint256 loanAmount_) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium);
    function getDiscountedQuote(uint256 loanAmount_, uint256 premiumFeeModifier, uint256 originationFeeModifier) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium);
    function getPrincipalDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getPremiumsDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getTotalDue(uint256 loanID, uint256 asOf) external view returns (uint256);
    function getRemainingLiability(uint256 loanID) external view returns (uint256);
    function getPremiumPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory);
    function getPrincipalPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);

    function setLoanAuthority(address contractAddress, bool isAuthority) external;
    function setBaseURI(string memory baseURI_) external;
    function setUseBaseURIOnly(bool shouldUse) external;
    function originateLoan(
        uint256 loanAmount_,
        uint256 originationFee,
        uint256 loanLengthSeconds_,
        uint256 premiumFeeModifierNumerator_,
        uint256 originationFeeModifierNumerator_,
        address receiver,
        uint256 tokenId
    ) external returns (uint256);
    function recordPayment(uint256 loanID, uint256 amount) external returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability);
    function recordPrincipalRepayment(uint256 loanID, uint256 amount) external returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability);
}
```

The contract defines several functions and events related to managing loans, including: setting loan parameters such as amount limits and loan length limits, checking loan status, and paying off loans. The contract also defines several events related to updating the contractΓÇÖs settings, including setting the base URI, setting the loan authority, and setting the liquidation policy. Additionally, the contract defines several functions for querying the contract state, including functions for checking the loan amount, loan length, and loan state, as well as functions for calculating loan payments and remaining liabilities.

```js
interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}
```

The `IERC721Receiver` interface defines a single function `onERC721Received`, which is called whenever an ERC-721 token (identified by its `tokenId`) is transferred to a contract that implements this interface. The function takes four parameters:

- `operator`: the address of the account that initiated the transfer
- `from`: the address of the account that the token was transferred from
- `tokenId`: the unique identifier of the ERC-721 token being transferred
- `data`: any additional data that was passed along with the transfer

The function is expected to return the selector of the `onERC721Received` function, which is a 4-byte value that uniquely identifies the function. If any other value is returned or the interface is not implemented by the recipient contract, the transfer will be reverted.

```js
interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
```

The `IERC165` interface is a standard interface for contracts to implement in order to support the ERC-165 standard. It defines a single function, `supportsInterface(bytes4 interfaceId)`, which allows other contracts to query whether the implementing contract supports a specific interface. The function takes a single argument, `interfaceId`, which is the four-byte identifier of the interface in question. It returns a boolean value indicating whether the contract supports that interface. The function is marked as `view`, which means it is a read-only function and does not modify the state of the contract.

```js
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}
```

It provides two internal view functions, `_msgSender()` and `_msgData()`, that return the address of the message sender (`msg.sender`) and the data of the message (`msg.data`) respectively. These functions are marked as virtual, which means they can be overridden by contracts that inherit from the `Context` contract. The `internal` visibility specifier means that these functions can only be accessed by other contracts that inherit from the `Context` contract or from the contract itself.

```js
abstract contract X7InitialLiquidityLoanTerm is ERC721Enumerable, ERC721Holder, Ownable {}


function setLoanAuthority(address contractAddress, bool isAuthority) external onlyOwner {
 require(loanAuthorities[contractAddress] != isAuthority);
 loanAuthorities[contractAddress] = isAuthority;
 emit LoanAuthoritySet(contractAddress, isAuthority);
 }
```

The function `setLoanAuthority` is used to set the loan authority status of a specific contract address. It can only be called by the contractΓÇÖs owner, and requires that the contract address passed as an argument is not already set to the same authority status (i.e. if the address is already an authority, it cannot be set as an authority again, and vice versa). The function then sets the loan authority status of the contract address passed as an argument to the value passed as the second argument, and emits an event `LoanAuthoritySet` with the contract address and the new authority status as parameters.

```js
function setBaseURI(string memory baseURI*) external onlyOwner {
 require(keccak256(abi.encodePacked(internalBaseURI)) != keccak256(abi.encodePacked(baseURI*)));
 string memory oldBaseURI = internalBaseURI;
 internalBaseURI = baseURI*;
 emit BaseURISet(oldBaseURI, baseURI*);
 }

```

This function is called `setBaseURI` and it takes in a single input, a string called `baseURI_`. It is defined as `external` which means it can be called from outside of the smart contract. The function has a modifier `onlyOwner` which means that only the owner of the contract can call this function.

The function has several lines of code, letΓÇÖs breakdown what it does:

1.  The first line has a require statement which checks if the keccak256 hash of the packed ABI encoded `internalBaseURI` is not equal to the keccak256 hash of the packed ABI encoded `baseURI_`.
2.  The next line creates a string memory variable called `oldBaseURI` and assigns it the current value of `internalBaseURI`.
3.  The following line assigns the value of `baseURI_` to `internalBaseURI`.
4.  The last line emits an event called `BaseURISet` that contains the oldBaseURI and the new baseURI\_ that is set.

In summary, this function allows the owner of the contract to set a new baseURI while checking if the new baseURI is different than the existing one and emitting an event with the old and new baseURI.

```js

function setUseBaseURIOnly(bool shouldUse) external onlyOwner {
 require(useBaseURIOnly != shouldUse);
 useBaseURIOnly = shouldUse;
 emit UseBaseURIOnlySet(shouldUse);
 }

```

The `setUseBaseURIOnly` the function allows the owner to set a flag indicating whether to use only the base URI (a Uniform Resource Identifier) or not. This function requires that the current value of the flag `useBaseURIOnly` must not be equal to the argument `shouldUse` being passed in. The function updates the value of `useBaseURIOnly` with `shouldUse` and emits an event `UseBaseURIOnlySet` with the updated value as its argument.

```js

function numberOfRepaymentPeriods() external view returns (uint256) {
 return repaymentPeriodIndices.length;
 }

```

It returns the number of repayment periods by returning the length of the `repaymentPeriodIndices` array. The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js

function numberOfPremiumPeriods() external view returns (uint256) {
 return premiumPeriodIndices.length;
 } function numberOfPremiumPeriods() external view returns (uint256) {
 return premiumPeriodIndices.length;
 }

```

It returns the number of premium periods by returning the length of the `premiumPeriodIndices` array. The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js
function getOriginationAmounts(uint256 loanAmount*) external view returns (uint256 loanAmountRounded, uint256 originationFee) {
 (loanAmountRounded, originationFee) = \_getOriginationAmounts(loanAmount*);
 }
```

It takes in a uint256 argument `loanAmount_` and returns two values: `loanAmountRounded` and `originationFee`. The function calls another internal function `_getOriginationAmounts` with the input argument `loanAmount_`. The returned values from `_getOriginationAmounts` are then assigned to `loanAmountRounded` and `originationFee`. The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js

function isComplete(uint256 loanID) external view returns (bool) {
 return loanState[loanID] == LoanState.COMPLETE;
 }

```

It takes in a uint256 argument `loanID` and returns a boolean value indicating whether the loan associated with the loanID is complete or not. The function accesses the `loanState` mapping with the key `loanID` and compares its value to the constant `LoanState.COMPLETE`. If they are equal, the function returns true, otherwise it returns false. The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js

function liquidationAmount(uint256 loanID) external view returns (uint256) {
 require(loanState[loanID] == LoanState.ACTIVE);
 uint256 premiumsDue = \_getPremiumsDue(loanID, block.timestamp);
 uint256 principalDue = \_getPrincipalDue(loanID, block.timestamp);

        uint256 totalDue = premiumsDue + principalDue;

        if (totalDue == 0) {
            return 0;
        }

        uint256 remainingInitialCapital = loanAmount[loanID] - principalAmountPaid[loanID];

        if (
            liquidationPolicy == LiquidationPolicy.LIQUIDATE_INCREMENTAL
        ) {
            if (totalDue >= remainingInitialCapital) {
                return remainingInitialCapital;
            } else {
                return totalDue;
            }
        } else if (liquidationPolicy == LiquidationPolicy.LIQUIDATE_IN_FULL) {
            return remainingInitialCapital;
        } else {
            revert("Invalid repayment policy");
        }
    }

```

It takes in a uint256 argument `loanID` and returns the liquidation amount for the loan associated with the loanID.

The function starts by checking that the loan is active using the `require` statement and accessing the `loanState` mapping with the key `loanID`. If the loan is not active, the function will revert with an error message.

Then, the function calculates the `premiumsDue` and `principalDue` by calling the internal functions `_getPremiumsDue` and `_getPrincipalDue` respectively with the loanID and the current block timestamp as arguments.

The `totalDue` is calculated by adding up `premiumsDue` and `principalDue`. If `totalDue` is equal to zero, the function returns zero.

Next, the function calculates `remainingInitialCapital` by subtracting the `principalAmountPaid` from the `loanAmount` for the loan associated with the loanID.

Depending on the value of `liquidationPolicy`, the function returns either `remainingInitialCapital`, `totalDue` or a smaller value of them. If `liquidationPolicy` is equal to `LiquidationPolicy.LIQUIDATE_INCREMENTAL`, the function returns the smaller value of `remainingInitialCapital` and `totalDue`. If `liquidationPolicy` is equal to `LiquidationPolicy.LIQUIDATE_IN_FULL`, the function returns `remainingInitialCapital`. If `liquidationPolicy` has an invalid value, the function reverts with an error message.

The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js

function getQuote(uint256 loanAmount*) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium) {
 (loanAmountRounded, originationFee) = \_getOriginationAmounts(loanAmount*);

        // Provide a non discounted quote
        totalPremium = _getTotalPremium(loanAmount_, principleFractionDenominator);

        return (loanAmountRounded, originationFee, totalPremium);
    }

```

It takes in a uint256 argument `loanAmount_` and returns the loan amount rounded, the origination fee, and the total premium for the loan.

The function starts by calling the internal function `_getOriginationAmounts` with the `loanAmount_` argument to get the loan amount rounded and the origination fee.

Next, the function calculates the total premium by calling the internal function `_getTotalPremium` with the `loanAmount_` and the `principleFractionDenominator` as arguments.

Finally, the function returns the loan amount rounded, the origination fee, and the total premium.

The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js

function getDiscountedQuote(uint256 loanAmount*, uint256 premiumFeeModifier, uint256 originationFeeModifier) external view returns (uint256 loanAmountRounded, uint256 originationFee, uint256 totalPremium) {
 (loanAmountRounded, originationFee) = \_getOriginationAmounts(loanAmount*);

        // Modify origination fee to include a rounded discount
        originationFee = originationFee * originationFeeModifier / principleFractionDenominator / loanPrecision * loanPrecision;

        // Provide a discounted quote
        totalPremium = _getTotalPremium(loanAmount_, premiumFeeModifier);

        return (loanAmountRounded, originationFee, totalPremium);
    }

```

It takes in three uint256 arguments: `loanAmount_`, `premiumFeeModifier`, and `originationFeeModifier`. It returns the loan amount rounded, the origination fee, and the total premium for the loan with discounts applied.

The function starts by calling the internal function `_getOriginationAmounts` with the `loanAmount_` argument to get the loan amount rounded and the origination fee.

Next, the function modifies the origination fee to include a rounded discount. It does this by multiplying the origination fee by the `originationFeeModifier` divided by the `principleFractionDenominator` divided by the `loanPrecision`, and then multiplying the result by the `loanPrecision`.

The function then calculates the total premium with the discounts applied by calling the internal function `_getTotalPremium` with the `loanAmount_` and the `premiumFeeModifier` as arguments.

Finally, the function returns the loan amount rounded, the origination fee, and the total premium.

The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js
function getPrincipalDue(uint256 loanID, uint256 asOf) external view returns (uint256) {
    require(loanAmount[loanID] > 0);
    return \_getPrincipalDue(loanID, asOf);
}
```

It takes in two arguments: `loanID` and `asOf`, both of type uint256. It returns the principal amount that is due for a specific loan as of a given timestamp.

The function starts by requiring that the loan amount for the specified loan must be greater than 0. This is likely a requirement to ensure that the loan is valid and has been originated before trying to retrieve the principal due.

Next, the function calls the internal function `_getPrincipalDue` with the `loanID` and `asOf` arguments to calculate the principal due.

Finally, the function returns the calculated principal due.

The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js
function getPremiumsDue(uint256 loanID, uint256 asOf) external view returns (uint256) {
    require(loanAmount[loanID] > 0);
    return \_getPremiumsDue(loanID, asOf);
}
```

It takes in two arguments: `loanID` and `asOf`, both of type uint256. It returns the premium amount that is due for a specific loan as of a given timestamp.

The function starts by requiring that the loan amount for the specified loan must be greater than 0. This is likely a requirement to ensure that the loan is valid and has been originated before trying to retrieve the premiums due.

Next, the function calls the internal function `_getPremiumsDue` with the `loanID` and `asOf` arguments to calculate the premiums due.

Finally, the function returns the calculated premiums due.

The `view` keyword indicates that the function does not modify the state of the contract and can be safely called without triggering any changes. The `external` keyword indicates that the function can be called from outside the contract.

```js

function getTotalDue(uint256 loanID, uint256 asOf) external view returns (uint256) {
 require(loanAmount[loanID] > 0);
 return \_getPrincipalDue(loanID, asOf) + \_getPremiumsDue(loanID, asOf);
 }

```

This function calculates the total amount due for a loan with a given ID as of a certain timestamp. It first requires that the loan amount for the specified loan ID is greater than 0. Then, it calls two helper functions `_getPrincipalDue` and `_getPremiumsDue` to calculate the amount of principal and premiums due, respectively. Finally, it returns the sum of the two.

```js

function getRemainingLiability(uint256 loanID) external view returns (uint256) {
 require(loanAmount[loanID] > 0);

        return premiumAmount[loanID] - premiumAmountPaid[loanID] + loanAmount[loanID] - principalAmountPaid[loanID];
    }

```

This function calculates the remaining liability for a loan with a given ID. It first requires that the loan amount for the specified loan ID is greater than 0. Then, it calculates the remaining liability as the sum of the remaining premiums and remaining principal, which is equal to the total amount of premiums minus the amount of premiums paid plus the total amount of the loan minus the amount of principal paid.

```js

function getPremiumPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory) {
 uint256 startTime = loanStartTime[loanID];
 uint256 durationSeconds = loanLengthSeconds[loanID];
 uint256 loanAmount\_ = loanAmount[loanID];

        require(loanAmount_ > 0);

        uint256[] memory dueDates = new uint256[](premiumPeriodIndices.length);
        uint256[] memory paymentAmounts = new uint256[](premiumPeriodIndices.length);

        for (uint i=0; i < premiumPeriodIndices.length; i++) {
            dueDates[i] = (durationSeconds * premiumPeriodIndices[i] / 60) + startTime;
            paymentAmounts[i] = (loanAmount_ * premiumFractions[premiumPeriodIndices[i]] / principleFractionDenominator) / loanPrecision * loanPrecision;
        }

        return (dueDates, paymentAmounts);
    }

```

The `getPremiumPaymentSchedule` function returns an array of due dates and an array of payment amounts, representing the premium payments schedule for a loan. It takes a loan ID as input and returns the due dates and payment amounts for all premium payments in the loan. It requires that the loan amount is greater than 0. The due dates are calculated as the duration of the loan in seconds multiplied by the premium period index divided by 60, plus the start time of the loan. The payment amounts are calculated as the loan amount multiplied by the premium fraction corresponding to the premium period index, divided by the principle fraction denominator, and rounded to the nearest precision of the loan.

```js

function getPrincipalPaymentSchedule(uint256 loanID) external view returns (uint256[] memory, uint256[] memory) {
 uint256 startTime = loanStartTime[loanID];
 uint256 durationSeconds = loanLengthSeconds[loanID];
 uint256 loanAmount\_ = loanAmount[loanID];

        require(loanAmount_ > 0);

        uint256[] memory dueDates = new uint256[](repaymentPeriodIndices.length);
        uint256[] memory paymentAmounts = new uint256[](repaymentPeriodIndices.length);

        for (uint i=0; i < repaymentPeriodIndices.length; i++) {
            dueDates[i] = (durationSeconds * repaymentPeriodIndices[i] / 60) + startTime;
            paymentAmounts[i] = (loanAmount_ * repaymentFractions[repaymentPeriodIndices[i]] / principleFractionDenominator) / loanPrecision * loanPrecision;
        }

        return (dueDates, paymentAmounts);
    }

```

This function is called `getPrincipalPaymentSchedule`, and it returns a schedule of due dates and payment amounts for the principal of a loan with a specified ID.

It starts by retrieving the loanΓÇÖs start time, loan length, and amount from the contractΓÇÖs storage variables. If the loan amount is not greater than zero, the function stops and requires the loan amount to be greater than zero.

Then, the function creates two dynamic arrays: `dueDates` and `paymentAmounts`. It loops through the `repaymentPeriodIndices` array and calculates the due date and payment amount for each index. The due date is calculated by adding the product of the duration of the loan in seconds and the indexΓÇÖs value divided by 60 to the loanΓÇÖs start time. The payment amount is calculated by multiplying the loan amount by the `repaymentFractions` value at the same index and dividing by the `principleFractionDenominator` and `loanPrecision`, then rounding down to the nearest `loanPrecision`.

Finally, the function returns the `dueDates` and `paymentAmounts` arrays.

```js

function tokenURI(uint256 tokenId) public view override returns (string memory) {
 if (useBaseURIOnly) {
 return \_baseURI();
 } else {
 return super.tokenURI(tokenId);
 }
 }

```

The `tokenURI` function returns the URL of the token information. If the `useBaseURIOnly` variable is set to `true`, it returns the base URI defined by the `_baseURI` function. Otherwise, it calls the `tokenURI` function of the parent contract, which provides a unique URL for each token in the NFT collection. The token URI can be used to retrieve information about the token, such as its owner, metadata, or other information stored on the blockchain.

```js

function originateLoan(
 uint256 loanAmount*,
 uint256 originationFee,
 uint256 loanLengthSeconds*,

        // 10000 == no discount 9000 == 10% discount
        uint256 premiumFeeModifierNumerator_,
        uint256 originationFeeModifierNumerator_,

        address receiver,
        uint256 tokenId
    ) external onlyLoanAuthority returns (uint256) {
        (uint256 expectedLoanAmount, uint256 expectedOriginationFee) = _getOriginationAmounts(loanAmount_);
        uint256 discountedOriginationFee = expectedOriginationFee * originationFeeModifierNumerator_ / principleFractionDenominator / loanPrecision * loanPrecision;

        // Check the loan conforms to the loan terms of this contract
        require(expectedLoanAmount == loanAmount_, "Loan amounts must be rounded");
        require(loanAmount_ >= minimumLoanAmount && loanAmount_ <= maximumLoanAmount, "Invalid loan Amount");
        require(loanLengthSeconds_ >= minimumLoanLengthSeconds && loanLengthSeconds_ <= maximumLoanLengthSeconds, "Invalid loan length");
        require(originationFee == discountedOriginationFee, "Insufficient origination fee collected");

        loanAmount[tokenId] = loanAmount_;
        originationFeeCollected[tokenId] = originationFee;
        premiumModifierNumerator[tokenId] = premiumFeeModifierNumerator_;
        originationFeeModifierNumerator[tokenId] = originationFeeModifierNumerator_;
        premiumAmount[tokenId] = _getTotalPremium(loanAmount_, premiumFeeModifierNumerator_);

        loanLengthSeconds[tokenId] = loanLengthSeconds_;
        loanState[tokenId] = LoanState.ACTIVE;

        loanStartTime[tokenId] = block.timestamp;

        _mint(receiver, tokenId);

        emit LoanOriginated(tokenId);

        return tokenId;
    }

```

The `originateLoan` function is used to originate a loan, which is created and managed by a loan authority. The function takes in the following parameters:

1.  `loanAmount_`: The amount of the loan to be originated.
2.  `originationFee`: The fee charged for originating the loan.
3.  `loanLengthSeconds_`: The length of the loan in seconds.
4.  `premiumFeeModifierNumerator_`: A number that is used to modify the premium fee.
5.  `originationFeeModifierNumerator_`: A number that is used to modify the origination fee.
6.  `receiver`: The address of the loan receiver.
7.  `tokenId`: The unique identifier of the token that represents the loan.

The function starts by checking if the loan amount is within the minimum and maximum allowed loan amounts, and that the loan length is within the minimum and maximum allowed loan lengths. It then calculates the expected loan amount and origination fee based on the inputs, and checks if the actual origination fee matches the expected origination fee. If everything is in order, the function sets the loan parameters such as the loan amount, premium fee, origination fee, loan length, and loan start time, sets the loan state to active, and mints a new token for the loan receiver. Finally, it emits a `LoanOriginated` event.

```js

function recordPayment(uint256 loanID, uint256 amount) external onlyLoanAuthority returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability) {
 if (loanState[loanID] == LoanState.COMPLETE) {
 refundAmount = amount;
 return (premiumPaid, principalPaid, refundAmount, remainingLiability);
 }

        uint256 premiumDue = _getPremiumsDue(loanID, block.timestamp);
        uint256 principalDue = _getPrincipalDue(loanID, block.timestamp);

        uint256 remaining = amount;

        if (premiumDue > 0) {
            if (remaining >= premiumDue) {
                remaining -= premiumDue;
                premiumPaid = premiumDue;
            } else {
                premiumPaid = amount;
                remaining = 0;
            }
        }

        if (principalDue > 0 && remaining > 0) {
            if (remaining >= principalDue) {
                principalPaid = principalDue;
                remaining -= principalDue;
            } else {
                principalPaid = remaining;
                remaining = 0;
            }
        }

        uint256 excessAmount = _recordPremiumPayment(loanID, premiumPaid + remaining);
        premiumPaid = premiumPaid + remaining - excessAmount;

        refundAmount = _recordPrincipalPayment(loanID, principalPaid + excessAmount);
        principalPaid = principalPaid + excessAmount - refundAmount;

        remainingLiability = premiumAmount[loanID] - premiumAmountPaid[loanID] + loanAmount[loanID] - principalAmountPaid[loanID];

        if (remainingLiability == 0) {
            loanState[loanID] = LoanState.COMPLETE;
            emit LoanComplete(loanID);
        }
    }

```

This function `recordPayment` is used to record payment for a loan given the loan ID and payment amount. The function performs the following steps:

1.  It checks if the loan is already completed and if yes, it sets the refund amount to the payment amount and returns the premium paid, principal paid refund amount, and remaining liability.
2.  If the loan is not completed, it calculates the premium due and principal due as of the current block timestamp.
3.  It then uses the payment amount to pay first towards the premium due and then towards the principal due, and calculates the premium paid, principal paid, and refund amount accordingly.
4.  It then records the premium payment and principal payment.
5.  It calculates the remaining liability by subtracting the amounts paid from the premium amount and loan amount.
6.  If the remaining liability is zero, it sets the loan state to complete and emits an `LoanComplete` event.
7.  It returns the premium paid, principal paid, refund amount, and remaining liability.

```js

function recordPrincipalRepayment(uint256 loanID, uint256 amount) external onlyLoanAuthority returns (uint256 premiumPaid, uint256 principalPaid, uint256 refundAmount, uint256 remainingLiability) {
 uint256 excessAmount = \_recordPrincipalPayment(loanID, amount);

        if (excessAmount > 0) {
            refundAmount = _recordPremiumPayment(loanID, excessAmount);
        }
        principalPaid = amount - excessAmount;
        premiumPaid = excessAmount - refundAmount;

        remainingLiability = premiumAmount[loanID] - premiumAmountPaid[loanID] + loanAmount[loanID] - principalAmountPaid[loanID];

        if (remainingLiability == 0) {
            loanState[loanID] = LoanState.COMPLETE;
            emit LoanComplete(loanID);
        }
    }

```

This is the implementation of the `recordPrincipalRepayment` function in the code you provided. This function is used to record the repayment of the principal amount of a loan by the borrower.

The function starts by calling the `_recordPrincipalPayment` function to record the payment of the principal amount. It then calculates the refund amount by calling `_recordPremiumPayment` with the excess amount, if any.

The function then calculates the amounts paid for premium and principal, and the remaining liability for the loan. If the remaining liability is zero, it means that the loan has been fully repaid, so the state of the loan is updated to `LoanState.COMPLETE` and the `LoanComplete` event is emitted.

```js

function _getOriginationAmounts(uint256 loanAmount_) internal view returns (uint256 loanAmountRounded, uint256 originationFee) {
 for (uint i=0; i < repaymentPeriodIndices.length; i++) {
 loanAmountRounded += (loanAmount\_ _ repaymentFractions[repaymentPeriodIndices[i]] / principleFractionDenominator) / loanPrecision _ loanPrecision;
 }

        require(loanAmountRounded > 0);

        originationFee = (loanAmountRounded * originationFeeNumerator / principleFractionDenominator) / loanPrecision * loanPrecision;
    }

```

The function `_getOriginationAmounts` is an internal function that calculates the origination fees for a given loan amount.

It first rounds up the loan amount by adding the rounded value of the product of the loan amount and the repayment fractions for each repayment period.

It then calculates the origination fee as the rounded product of the origination fee numerator and the loan amount rounded up divided by the principle fraction denominator.

The function requires that the rounded up loan amount is greater than 0, otherwise it will revert.

```js

function _getTotalPremium(uint256 loanAmount_, uint256 discountModifier) internal view returns (uint256) {
 uint256 totalPremium;

        for (uint i=0; i < premiumPeriodIndices.length; i++) {
            totalPremium += (loanAmount_ * premiumFractions[premiumPeriodIndices[i]] / principleFractionDenominator) * discountModifier / principleFractionDenominator / loanPrecision * loanPrecision;
        }

        return totalPremium;
    }

```

The `_getTotalPremium` function calculates the total premium for a loan given its loan amount and a discount modifier. It loops over the `premiumPeriodIndices` array and calculates the premium for each period by multiplying the loan amount with the corresponding `premiumFractions` fraction, then dividing it by `principleFractionDenominator` and finally rounding it to the nearest multiple of `loanPrecision`. The total premium is the sum of premiums of all periods and is returned by the function.

```js

function _getPrincipalDue(uint256 loanID, uint256 asOf) internal view returns (uint256) {
 uint256 startTime = loanStartTime[loanID];
 uint256 durationSeconds = loanLengthSeconds[loanID];
 uint256 loanAmount_ = loanAmount[loanID];

        uint256 totalRepaymentDue;

        for (uint i=0; i < repaymentPeriodIndices.length; i++) {
            if (
                (durationSeconds * repaymentPeriodIndices[i] / 60) + startTime > asOf
            ) {
                break;
            }

            totalRepaymentDue += (loanAmount_ * repaymentFractions[repaymentPeriodIndices[i]] / principleFractionDenominator) / loanPrecision * loanPrecision;
        }

        if (principalAmountPaid[loanID] >= totalRepaymentDue) {
            return 0;
        } else {
            return totalRepaymentDue - principalAmountPaid[loanID];
        }
    }

```

Calculates the total principal repayment due for a given loan and a given point in time (specified by `asOf`).

The calculation starts by initializing a variable `totalRepaymentDue` to 0. Then, it iterates over the `repaymentPeriodIndices` array and adds the calculated amount for each period to the `totalRepaymentDue` using the formula `loanAmount_ * repaymentFractions[repaymentPeriodIndices[i]] / principleFractionDenominator / loanPrecision * loanPrecision`. The calculation stops when the point in time (`asOf`) becomes greater than the current iteration's due date, which is calculated as `(durationSeconds * repaymentPeriodIndices[i] / 60) + startTime`.

Finally, the function checks if the `totalRepaymentDue` is greater than the `principalAmountPaid[loanID]`. If it is, the function returns the difference between the two. If not, it returns 0, indicating that the total repayment due has already been paid.

```js

function _getPremiumsDue(uint256 loanID, uint256 asOf) internal view returns (uint256) {
 uint256 startTime = loanStartTime[loanID];
 uint256 durationSeconds = loanLengthSeconds[loanID];
 uint256 loanAmount_ = loanAmount[loanID];

        uint256 totalPremiumsDue;

        for (uint i=0; i < premiumPeriodIndices.length; i++) {
            if (
                (durationSeconds * premiumPeriodIndices[i] / 60) + startTime > asOf
            ) {
                break;
            }

            totalPremiumsDue += (loanAmount_ * premiumFractions[premiumPeriodIndices[i]] / principleFractionDenominator) * premiumModifierNumerator[loanID] / principleFractionDenominator / loanPrecision * loanPrecision;
        }

        if (premiumAmountPaid[loanID] >= totalPremiumsDue) {
            return 0;
        } else {
            return totalPremiumsDue - premiumAmountPaid[loanID];
        }
    }

```

It calculates the total amount of premiums that are due for a given loan (specified by `loanID`) up to a certain point in time (specified by `asOf`). It starts by initializing a variable `totalPremiumsDue` to keep track of the total amount of premiums due. The function then loops through all the `premiumPeriodIndices` and adds the amount of premiums due at each period to `totalPremiumsDue`. If the current time is after the due time for a period, the loop breaks. The function then calculates the remaining amount of premiums due by subtracting the amount of premiums already paid (`premiumAmountPaid[loanID]`) from the total amount of premiums due (`totalPremiumsDue`). If all the premiums have already been paid, the function returns 0.

```js

function \_recordPremiumPayment(uint256 loanID, uint256 amount) internal returns (uint256 refundAmount) {
 if (amount == 0) {
 return 0;
 }
 uint256 owedAmount = premiumAmount[loanID] - premiumAmountPaid[loanID];

        if (owedAmount > 0) {
            if (owedAmount <= amount) {
                premiumAmountPaid[loanID] += owedAmount;
                refundAmount = amount - owedAmount;
            } else {
                premiumAmountPaid[loanID] += amount;
            }
        } else {
            refundAmount = amount;
        }
    }

```

This function records a premium payment for a loan specified by the `loanID` argument. The amount of the payment is specified by the `amount` argument.

First, the function checks if the `amount` is equal to 0, and if so, it returns 0, which means no payment was made.

Next, the function calculates the amount owed on the loan, which is `premiumAmount[loanID] - premiumAmountPaid[loanID]`.

Then, it checks if the `owedAmount` is greater than 0, meaning there is still a balance due. If `owedAmount` is less than or equal to the `amount` being paid, the function updates the `premiumAmountPaid[loanID]` to reflect the full payment, and calculates the refund amount as `amount - owedAmount`. If `owedAmount` is greater than `amount`, the function updates `premiumAmountPaid[loanID]` by `amount` to reflect the partial payment.

If `owedAmount` is not greater than 0, meaning the balance has already been paid in full, the function returns the `amount` as the refund amount, since no further payment is due.

```js

function \_recordPrincipalPayment(uint256 loanID, uint256 amount) internal returns (uint256 refundAmount) {
 if (amount == 0) {
 return 0;
 }

        uint256 owedAmount = loanAmount[loanID] - principalAmountPaid[loanID];

        if (owedAmount > 0) {
            if (owedAmount <= amount) {
                principalAmountPaid[loanID] += owedAmount;
                refundAmount = amount - owedAmount;
            } else {
                principalAmountPaid[loanID] += amount;
            }
        } else {
            refundAmount = amount;
        }

    }

```

This function records a payment towards the principal of a loan and returns any overpayment amount. If the input amount is 0, it returns 0 immediately.

It first calculates the amount owed by checking the difference between the total loan amount and the amount already paid towards the principal.

Then, it updates the amount paid towards the principal. If the owed amount is greater than the amount paid, it sets the amount paid to the owed amount, and the refund amount to the difference between the amount paid and owed amount.

If the owed amount is less than or equal to the amount paid, it adds the amount paid to the amount already paid towards the principal, and sets the refund amount to the difference between the amount paid and the owed amount.

```js

function \_setRepaymentTerms(uint16[60] memory fractions) internal {
 uint256 totalFraction;
 uint8 period;
 uint16 fraction;

        for (uint8 i=0; i < fractions.length; i++) {
            if (fractions[i] == 0) {
                continue;
            }

            period = i+1;
            fraction = fractions[i];
            require(period > 0 && period <= 60);

            totalFraction += fraction;
            repaymentFractions[period] = fraction;
            repaymentPeriodIndices.push(period);
        }

        require(totalFraction == principleFractionDenominator);
    }

```

This function `_setRepaymentTerms` sets the repayment terms of the loans, based on the input array of repayment fractions.

- For each non-zero fraction in the input array `fractions`, the period and the fraction are recorded.
- The total fraction is accumulated and is required to be equal to `principleFractionDenominator`.
- The period and the fraction are stored in the `repaymentPeriodIndices` and `repaymentFractions` arrays, respectively.

```js

function \_setPremiumTerms(uint16[60] memory fractions) internal {
 uint256 totalFraction;
 uint8 period;
 uint16 fraction;

        for (uint8 i=0; i < fractions.length; i++) {
            if (fractions[i] == 0) {
                continue;
            }
            period = i +1;
            fraction = fractions[i];
            require(period > 0 && period <= 60);

            totalFraction += fraction;
            premiumFractions[period] = fraction;
            premiumPeriodIndices.push(period);
        }
    }

```

ItΓÇÖs a function to set premium terms for a loan contract. The function takes an array of 60 integers as its argument, representing the fraction of the loan amount to be paid as premiums for each period.

The function loops through the array and checks if the fraction for a period is non-zero. If itΓÇÖs non-zero, the period number and fraction value are recorded. The total fraction is also accumulated. The recorded period and fraction values are then stored in the `premiumFractions` mapping and `premiumPeriodIndices` array.

Note that this function does not check if the total fraction of premiums equals 100%, unlike the `_setRepaymentTerms` function.

```js

function \_setOriginationFeeNumerator(uint16 feeNumerator) internal {
 require(feeNumerator < principleFractionDenominator);
 originationFeeNumerator = feeNumerator;
 }

```

This function sets the numerator of the origination fee rate, which is used to calculate the amount of origination fee charged to a loan. The function takes one argument, `feeNumerator`, which is the numerator of the fraction representing the origination fee rate.

The function requires that `feeNumerator` is less than `principleFractionDenominator`, which is a constant representing the denominator of the fraction representing various rates in the contract.

The value of `feeNumerator` is stored in the `originationFeeNumerator` state variable.

```js

function \_setLoanAmountLimits(uint256 minimumAmount, uint256 maximumAmount) internal {
 require(minimumAmount < maximumAmount);
 require(minimumAmount != minimumLoanAmount || maximumAmount != maximumLoanAmount);
 uint256 oldMinimumAmount = minimumLoanAmount;
 uint256 oldMaxiimumAmount = maximumLoanAmount;
 minimumLoanAmount = (minimumAmount / loanPrecision) _ loanPrecision;
 maximumLoanAmount = (maximumAmount / loanPrecision) _ loanPrecision;

        emit LoanAmountLimitsSet(oldMinimumAmount, oldMaxiimumAmount, minimumAmount, maximumAmount);
    }

```

This function, `_setLoanAmountLimits`, sets the minimum and maximum loan amounts that can be issued. The function takes two parameters: `minimumAmount` and `maximumAmount`.

The function starts by requiring that `minimumAmount` is less than `maximumAmount` and that the new minimum and maximum amounts are different from the current minimum and maximum loan amounts. The values of `minimumAmount` and `maximumAmount` are then rounded down to the nearest multiple of `loanPrecision` and stored as the new minimum and maximum loan amounts.

Finally, the function emits an event `LoanAmountLimitsSet` that indicates that the loan amount limits have been set, passing the old and new minimum and maximum amounts as arguments.

```js

function _setLiquidationPolicy(LiquidationPolicy liquidationPolicy_) internal {
 require(liquidationPolicy* != LiquidationPolicy.NONE);
 liquidationPolicy = liquidationPolicy*;
 }

```

This function sets the liquidation policy for loans on the contract. The function takes in an input `liquidationPolicy_` of type `LiquidationPolicy`, which is an enumeration type that represents the different options for liquidation policies. The function then checks that the input policy is not equal to `LiquidationPolicy.NONE`, which is an invalid option. If this check passes, the global state variable `liquidationPolicy` is set to the input policy.

```js

function \_setLoanLengthLimits(uint256 minimumSeconds, uint256 maximumSeconds) internal {
 require(minimumSeconds <= maximumSeconds);
 require(minimumSeconds != minimumLoanLengthSeconds || maximumSeconds != maximumLoanLengthSeconds);
 uint256 oldMinimumSeconds = minimumLoanLengthSeconds;
 uint256 oldMaximumSeconds = maximumLoanLengthSeconds;
 minimumLoanLengthSeconds = minimumSeconds;
 maximumLoanLengthSeconds = maximumSeconds;

        emit LoanLengthLimitsSet(oldMinimumSeconds, oldMaximumSeconds, minimumSeconds, maximumSeconds);
    }

```

This function `_setLoanLengthLimits` sets the minimum and maximum loan length limits in seconds for a loan term contract.

It starts by checking if the minimum loan length is less than or equal to the maximum loan length and if the new minimum and maximum are different from the previous ones. If these conditions are met, it updates the values of `minimumLoanLengthSeconds` and `maximumLoanLengthSeconds` to the new values.

Finally, it emits an event `LoanLengthLimitsSet` to log the change in the loan length limits, providing the old and new minimum and maximum values.

```js

function \_baseURI() internal view override returns (string memory) {
 return internalBaseURI;
 }

```

This is a function that returns the base URI of an ERC721 token. The function is declared as `internal view override` which means it has internal visibility, is a view function (i.e., it does not modify the state of the contract) and overrides a function of the same name in a parent contract. The function returns a `string` type variable named `internalBaseURI`.

```js

contract X7InitialLiquidityLoanTerm001 is X7InitialLiquidityLoanTerm {
 constructor () Ownable(msg.sender) ERC721("X7 Initial Liquidity Loan Term (001)", "X7ILL001") {
 \_setLiquidationPolicy(
 LiquidationPolicy.LIQUIDATE_IN_FULL
 );

        // This can be changed post deploy
        _setLoanAmountLimits(
            // 0.5 ETH
            1 ether * 5 / 10,
            5 ether
        );

        // This can be changed post deploy
        _setLoanLengthLimits(
            // 1 day
            24 * 60 * 60,

            // 7 days
            7 * 24 * 60 * 60
        );

        _setOriginationFeeNumerator(
            // 25% loan origination fee
            2500
        );

        // No premium terms
        // _setPremiumTerms();

        // 100% of principal due by end of loan term
        uint16[60] memory repaymentPeriodFraction;
        repaymentPeriodFraction[59] = 10000;

        _setRepaymentTerms(
            repaymentPeriodFraction
        );
    }

    function setLoanLengthLimits(uint256 minimumSeconds, uint256 maximumSeconds) external onlyOwner {
        _setLoanLengthLimits(minimumSeconds, maximumSeconds);
    }

    function setLoanAmountLimits(uint256 minimum, uint256 maximum) external onlyOwner {
        _setLoanAmountLimits(minimum, maximum);
    }

}

```

The contract X7InitialLiquidityLoanTerm001 is a derivative of the X7InitialLiquidityLoanTerm contract and implements the Ownable, ERC721, and X7InitialLiquidityLoanTerm interfaces.

The constructor sets several parameters for the loan terms, such as the liquidation policy, loan amount limits, loan length limits, origination fee, and repayment terms.

The contract also provides two external functions to allow the owner to change the loan length limits and loan amount limits after the contract deployment. The functions are only accessible by the owner.
