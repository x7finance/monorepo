---
title: Xchange Pair
tags: [breakdowns]
---

The `XchangePair` contract represents a token pair on an exchange and provides functions for liquidity minting, burning, token swapping, and synchronization of reserves. It includes features such as minimum balance requirements, fee calculations, and failsafe mechanisms for handling token transfers and liquidity adjustments.

```js
interface IXchangeFactory {}
interface IXchangePair {}
interface IXchangeERC20 {}
interface IERC20 {}
interface IXchangeDiscountAuthority {}
interface IUniswapV2Callee {}
```

Xchange Pair Contract interfaces with multiple interfaces. These interfaces define the required functions, events, and structures that need to be implemented in the respective contracts to ensure proper functionality and interaction within the Xchange ecosystem.

1. `IXchangeFactory`: Provides functions and events related to the XchangeFactory contract, including pair creation, trusted address management, and fee settings.

2. `IXchangePair`: Represents the interface for a pair of tokens in the XchangePair contract. It includes functions for token swapping, liquidity minting/burning, and balance synchronization.

3. `IXchangeERC20`: Represents the interface for an ERC20 token used in the XchangePair contract. It includes functions for token transfers, approvals, and permit functionality.

4. `IERC20`: Represents the standard ERC20 interface with basic token-related functions such as name, symbol, decimals, balanceOf, allowance, transfer, and transferFrom.

5. `IXchangeDiscountAuthority`: Provides a function to retrieve the fee percentage for a given address.

6. `IUniswapV2Callee`: Represents the interface for a contract that can be called by the UniswapV2 router during token swaps.

```js
contract XchangeERC20 is IXchangeERC20 {}
contract XchangeFactory is IXchangeFactory, Ownable {}
```

1.  The `XchangeERC20` contract is an implementation of the `IXchangeERC20` interface, providing standard ERC20 token functionality.
2.  The `XchangeFactory` contract is an implementation of the `IXchangeFactory` interface and extends the `Ownable` contract. It represents a factory contract for creating and managing exchange pairs.

```js
using UQ112x112 for uint224;

uint public constant MINIMUM_LIQUIDITY = 10**3;
bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

IXchangeFactory _factory;
address public token0;
address public token1;

uint112 private reserve0;           // uses single storage slot, accessible via getReserves
uint112 private reserve1;           // uses single storage slot, accessible via getReserves
uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

uint public price0CumulativeLast;
uint public price1CumulativeLast;
uint public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

bool public hasMinimums;
mapping(address => uint112) public tokenMinimumBalance;

uint private unlocked = 1;
```

- The `UQ112x112` library is imported for fixed-point math calculations.
- `MINIMUM_LIQUIDITY` is a constant with a value of 1000.
- `SELECTOR` is a constant that stores the function selector for the `transfer(address,uint256)` function.
- `_factory` is a variable of type `IXchangeFactory`.
- `token0` and `token1` are addresses representing the two tokens in the exchange pair.
- `reserve0`, `reserve1`, and `blockTimestampLast` are variables to store the reserves and the timestamp of the last block.
- `price0CumulativeLast` and `price1CumulativeLast` store the cumulative prices of the tokens.
- `kLast` represents the product of `reserve0` and `reserve1` after the most recent liquidity event.
- `hasMinimums` is a boolean flag indicating whether the tokens have minimum balance requirements.
- `tokenMinimumBalance` is a mapping that stores the minimum balance requirements for each token address.
- `unlocked` is a private variable used as a lock for certain functions.

```js
modifier lock() {
    require(unlocked == 1, 'Xchange: LOCKED');
    unlocked = 0;
    _;
    unlocked = 1;
}
```

The `lock` modifier is defined in the code snippet. It is used to ensure that a specific section of code can only be executed when the `unlocked` variable is set to 1. The modifier performs the following actions:

1.  It checks if `unlocked` is equal to 1 using the `require` statement. If `unlocked` is not equal to 1, the execution is halted and an error message is displayed.
2.  If `unlocked` is equal to 1, the `unlocked` variable is set to 0, indicating that the section of code is locked.
3.  The code within the modifierΓÇÖs body (represented by the `_;` placeholder) is executed.
4.  After the code execution is complete, the `unlocked` variable is set back to 1, unlocking the section of code for subsequent calls.

In summary, the `lock` modifier ensures that the protected code can only be executed when the lock is active (when `unlocked` is set to 1), and it prevents concurrent execution of the same code by setting the lock to 0 during the execution.

```js
function factory() public view returns (address) {
    return address(_factory);
}
```

The `factory()` function is a public view function that returns the address of the `_factory` variable. It does not modify the contractΓÇÖs state and can be called by anyone to retrieve the address of the factory contract associated with the exchange pair.

```js
function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
    _reserve0 = reserve0;
    _reserve1 = reserve1;
    _blockTimestampLast = blockTimestampLast;
}
```

The `getReserves()` function is a public view function that returns the current reserves and the timestamp of the last block for the exchange pair. It does not modify the contractΓÇÖs state. The function returns three values:

- `_reserve0`: The current reserve of `token0`.
- `_reserve1`: The current reserve of `token1`.
- `_blockTimestampLast`: The timestamp of the last block when the reserves were updated.

```js
constructor() {
    _factory = IXchangeFactory(msg.sender);
}
```

The `constructor()` function is a constructor for the contract. It is called only once during the deployment of the contract. In this case, the constructor initializes the `_factory` variable with the address of the contract deployer (the sender of the deployment transaction) cast to the `IXchangeFactory` interface. This ensures that the `_factory` variable is set to the correct factory contract address when the `XchangePair` contract is deployed.

```js
// called once by the factory at time of deployment
function initialize(address _token0, address _token1) external {
    require(msg.sender == address(_factory), 'Xchange: FORBIDDEN'); // sufficient check
    token0 = _token0;
    token1 = _token1;
}
```

The `initialize` function is called by the factory contract at the time of deployment to set the token addresses for the exchange pair. It can only be called by the factory contract itself.

- The function is `external`, meaning it can be called from outside the contract.
- It takes two parameters: `_token0` and `_token1`, which represent the addresses of the two tokens in the exchange pair.
- The function starts with a `require` statement to ensure that the caller is the factory contract. If the condition is not met, an error message is displayed, and the execution is halted.
- If the caller is the factory contract, the `token0` and `token1` variables are updated with the provided token addresses.

```js
function mintFee() external {
    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    _mintFee(_reserve0, _reserve1);
}
```

The `mintFee` function is an external function used to calculate and mint liquidity tokens as a fee.

- The function starts by calling the `getReserves` function to retrieve the current reserves of the tokens. The returned values `_reserve0` and `_reserve1` are assigned to variables, and the last value is ignored using a blank `_` as a placeholder.
- The function then calls the `_mintFee` function, passing in the reserves `_reserve0` and `_reserve1` as arguments. The purpose of this function is to calculate and mint liquidity tokens as a fee based on the changes in the reserves.
- The function does not return any values.

```js
function setMinimumBalance(address tokenAddress, uint112 minimumAmount) external {
    require(_factory.isTrusted(msg.sender),'Xchange: FORBIDDEN');
    tokenMinimumBalance[tokenAddress] = minimumAmount;

    if (tokenMinimumBalance[token0] == 0 && tokenMinimumBalance[token1] == 0) {
        hasMinimums = false;
    } else {
        hasMinimums = true;
    }
}
```

The `setMinimumBalance` function allows a trusted entity (determined by `_factory.isTrusted`) to set the minimum balance requirement for a specific token.

- The function takes two parameters: `tokenAddress` represents the address of the token, and `minimumAmount` represents the desired minimum balance for that token.
- The function starts with a `require` statement to verify that the caller is a trusted entity. If the condition is not met, an error message is displayed, and the execution is halted.
- If the caller is a trusted entity, the `minimumAmount` is stored in the `tokenMinimumBalance` mapping for the corresponding `tokenAddress`.
- The function then checks if both `token0` and `token1` have minimum balance requirements of zero. If so, it sets the `hasMinimums` flag to `false`. Otherwise, it sets the flag to `true`.
- The function does not return any values.

```js
// this low-level function should be called from a contract which performs important safety checks
// The caller should try to call `sync` or `syncSafe`
function withdrawTokensAgainstMinimumBalance(address tokenAddress, address to, uint112 amount) external returns (uint112) {
    require(_factory.isTrusted(msg.sender),'Xchange: FORBIDDEN');
    if (amount > tokenMinimumBalance[tokenAddress]) {
        amount = tokenMinimumBalance[tokenAddress];
    }
    tokenMinimumBalance[tokenAddress] -= amount;
    _safeTransfer(tokenAddress, to,  amount);

    if (tokenMinimumBalance[token0] == 0 && tokenMinimumBalance[token1] == 0) {
        hasMinimums = false;
    }

    return amount;
}
```

The `withdrawTokensAgainstMinimumBalance` function is a low-level function that allows a trusted entity to withdraw tokens against the minimum balance requirement.

- The function takes three parameters: `tokenAddress` represents the address of the token, `to` represents the address where the tokens will be transferred, and `amount` represents the desired withdrawal amount.
- The function starts with a `require` statement to verify that the caller is a trusted entity. If the condition is not met, an error message is displayed, and the execution is halted.
- If the caller is a trusted entity, the function checks if the `amount` is greater than the minimum balance requirement for `tokenAddress`. If so, the `amount` is set to the minimum balance requirement.
- The function subtracts the `amount` from the `tokenMinimumBalance` mapping for `tokenAddress`.
- The function then calls the `_safeTransfer` function to transfer the tokens from the contract to the specified `to` address.
- If both `token0` and `token1` have minimum balance requirements of zero, the `hasMinimums` flag is set to `false`.
- Finally, the function returns the `amount` that was actually withdrawn.

```js
// this low-level function should be called from a contract which performs important safety checks
function mint(address to) external lock returns (uint liquidity) {
    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    uint balance0 = IERC20(token0).balanceOf(address(this));
    uint balance1 = IERC20(token1).balanceOf(address(this));
    uint amount0 = balance0 - _reserve0;
    uint amount1 = balance1 - _reserve1;

    bool feeOn = _mintFee(_reserve0, _reserve1);
    uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
    if (_totalSupply == 0) {
        liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
        _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
    } else {
        liquidity = Math.min(amount0 * _totalSupply / _reserve0, amount1 * _totalSupply / _reserve1);
    }
    require(liquidity > 0, 'Xchange: INSUFFICIENT_LIQUIDITY_MINTED');
    _mint(to, liquidity);

    _update(balance0, balance1, _reserve0, _reserve1);
    if (feeOn) kLast = uint(reserve0) * reserve1; // reserve0 and reserve1 are up-to-date
    emit Mint(msg.sender, amount0, amount1);
}
```

The `mint` function is used to mint liquidity tokens when tokens are added to the exchange pair.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- Inside the function, it first retrieves the current reserves `_reserve0` and `_reserve1` using the `getReserves` function.
- The function then retrieves the current balances of `token0` and `token1` using the `balanceOf` function from the `IERC20` interface.
- It calculates the amounts of tokens (`amount0` and `amount1`) that are being added to the exchange pair by subtracting the reserves from the balances.
- The function checks whether a fee should be minted using the `_mintFee` function and stores the result in the `feeOn` variable.
- It retrieves the current total supply of liquidity tokens `_totalSupply` and performs the minting calculation based on whether the total supply is zero or not.
- If the total supply is zero, it calculates the liquidity amount based on the square root of the product of `amount0` and `amount1` minus the `MINIMUM_LIQUIDITY` value.
- If the total supply is not zero, it calculates the liquidity amount based on the minimum of `amount0 * _totalSupply / _reserve0` and `amount1 * _totalSupply / _reserve1`.
- The function requires that the calculated liquidity amount is greater than zero, otherwise it reverts with an error message.
- It then mints the liquidity tokens to the specified `to` address using the `_mint` function.
- The function updates the balances and reserves using the `_update` function.
- If a fee is enabled, it updates the `kLast` variable by multiplying `reserve0` and `reserve1`.
- Finally, it emits a `Mint` event with the sender, `amount0`, and `amount1` as the event data.

```js
  // this low-level function should be called from a contract which performs important safety checks
  function burn(address to) external lock returns (uint amount0, uint amount1) {
      (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
      address _token0 = token0;                                // gas savings
      address _token1 = token1;                                // gas savings
      uint balance0 = IERC20(_token0).balanceOf(address(this));
      uint balance1 = IERC20(_token1).balanceOf(address(this));
      uint liquidity = balanceOf[address(this)];

      bool feeOn = _mintFee(_reserve0, _reserve1);
      uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
      amount0 = liquidity * balance0 / _totalSupply; // using balances ensures pro-rata distribution
      amount1 = liquidity * balance1 / _totalSupply; // using balances ensures pro-rata distribution
      require(amount0 > 0 && amount1 > 0, 'Xchange: INSUFFICIENT_LIQUIDITY_BURNED');
      _burn(address(this), liquidity);
      _safeTransfer(_token0, to, amount0);
      _safeTransfer(_token1, to, amount1);
      balance0 = IERC20(_token0).balanceOf(address(this));
      balance1 = IERC20(_token1).balanceOf(address(this));

      _update(balance0, balance1, _reserve0, _reserve1);
      if (feeOn) kLast = uint(reserve0) * reserve1; // reserve0 and reserve1 are up-to-date
      if (hasMinimums) {
          require(balance0 >= tokenMinimumBalance[_token0], 'Xchange: INSUFFICIENT_TOKEN0_BALANCE');
          require(balance1 >= tokenMinimumBalance[_token1], 'Xchange: INSUFFICIENT_TOKEN1_BALANCE');
      }
      emit Burn(msg.sender, amount0, amount1, to);
  }
```

The `burn` function is used to burn liquidity tokens and withdraw the underlying tokens from the exchange pair.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- Inside the function, it first retrieves the current reserves `_reserve0` and `_reserve1` using the `getReserves` function.
- The function then assigns the addresses of `token0` and `token1` to `_token0` and `_token1` variables, respectively, for gas savings.
- It retrieves the current balances of `_token0` and `_token1` using the `balanceOf` function from the `IERC20` interface.
- It retrieves the current liquidity balance of the contract using the `balanceOf` function for the `address(this)` (the contract itself).
- The function checks whether a fee should be minted using the `_mintFee` function and stores the result in the `feeOn` variable.
- It retrieves the current total supply of liquidity tokens `_totalSupply` and calculates the amounts of `_token0` and `_token1` tokens to be withdrawn based on the liquidity balance and the pro-rata distribution of balances.
- The function requires that both `amount0` and `amount1` are greater than zero, otherwise it reverts with an error message.
- It then burns the liquidity tokens from the contract using the `_burn` function.
- The underlying tokens (`_token0` and `_token1`) are transferred to the specified `to` address using the `_safeTransfer` function.
- It updates the balances of `_token0` and `_token1` after the transfer.
- The function updates the balances and reserves using the `_update` function.
- If a fee is enabled, it updates the `kLast` variable by multiplying `reserve0` and `reserve1`.
- If the contract has minimum balance requirements, it checks that the updated balances of `_token0` and `_token1` meet the minimum balance requirements, otherwise it reverts with an error message.
- Finally, it emits a `Burn` event with the sender, `amount0`, `amount1`, and `to` as the event data.

```js
function mustBurn(address to, uint256 gasAmount) external lock returns (uint amount0, uint amount1) {
    require(_factory.isFailsafeLiquidator(msg.sender));
    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    address _token0 = token0;                                // gas savings
    address _token1 = token1;                                // gas savings

    uint balance0 = _reserve0;
    uint balance1 = _reserve1;
    uint liquidity = balanceOf[address(this)];

    bool feeOn = _mintFee(_reserve0, _reserve1);
    uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
    amount0 = liquidity * balance0 / _totalSupply; // using balances ensures pro-rata distribution
    amount1 = liquidity * balance1 / _totalSupply; // using balances ensures pro-rata distribution
    require(amount0 > 0 && amount1 > 0, 'Xchange: INSUFFICIENT_LIQUIDITY_BURNED');
    _burn(address(this), liquidity);
    amount0 = _trySafeTransfer(_token0, to, amount0, gasAmount);
    amount1 = _trySafeTransfer(_token1, to, amount1, gasAmount);

    if (gasAmount > 0) {
        try IERC20(_token0).balanceOf{gas: gasAmount}(address(this)) returns (uint256 balance0_) {
            balance0 = balance0_;
        } catch {}

        try IERC20(_token1).balanceOf{gas: gasAmount}(address(this)) returns (uint256 balance1_) {
            balance1 = balance1_;
        } catch {}
    } else {
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
    }

    _update(balance0, balance1, _reserve0, _reserve1);
    if (feeOn) kLast = uint(reserve0) * reserve1; // reserve0 and reserve1 are up-to-date
    if (hasMinimums) {
        require(balance0 >= tokenMinimumBalance[_token0], 'Xchange: INSUFFICIENT_TOKEN0_BALANCE');
        require(balance1 >= tokenMinimumBalance[_token1], 'Xchange: INSUFFICIENT_TOKEN1_BALANCE');
    }
    emit Burn(msg.sender, amount0, amount1, to);
}
```

The `mustBurn` function is similar to the `burn` function but with additional functionality to handle failed token transfers.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- The function requires that the sender is a failsafe liquidator by checking the `isFailsafeLiquidator` function of the factory contract.
- Inside the function, it first retrieves the current reserves `_reserve0` and `_reserve1` using the `getReserves` function.
- The addresses of `token0` and `token1` are assigned to `_token0` and `_token1` variables, respectively, for gas savings.
- It sets the initial values of `balance0` and `balance1` to the current reserves `_reserve0` and `_reserve1` for gas savings.
- It retrieves the current liquidity balance of the contract using the `balanceOf` function for the `address(this)` (the contract itself).
- The function checks whether a fee should be minted using the `_mintFee` function and stores the result in the `feeOn` variable.
- It retrieves the current total supply of liquidity tokens `_totalSupply` and calculates the amounts of `_token0` and `_token1` tokens to be withdrawn based on the liquidity balance and the pro-rata distribution of balances.
- The function requires that both `amount0` and `amount1` are greater than zero, otherwise it reverts with an error message.
- It then burns the liquidity tokens from the contract using the `_burn` function.
- The underlying tokens (`_token0` and `_token1`) are transferred to the specified `to` address using the `_trySafeTransfer` function, which attempts the token transfer but handles potential failures.
- If `gasAmount` is greater than zero, it tries to retrieve the updated balances of `_token0` and `_token1` by using the `balanceOf` function with a specified gas amount.
- If the token balance retrieval fails, the balances remain unchanged, and any potential error is caught with a `catch` block.
- If `gasAmount` is zero, it retrieves the balances of `_token0` and `_token1` without specifying a gas amount.
- The function updates the balances and reserves using the `_update` function.
- If a fee is enabled, it updates the `kLast` variable by multiplying `reserve0` and `reserve1`.
- If the contract has minimum balance requirements, it checks that the updated balances of `_token0` and `_token1` meet the minimum balance requirements, otherwise it reverts with an error message.
- Finally, it emits a `Burn` event with the sender, `amount0`, `amount1`, and `to` as the event data.

```js
// this low-level function should be called from a contract which performs important safety checks
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
    _swap(amount0Out, amount1Out, to, 200, data);
}
```

The `swap` function is used to swap tokens in the exchange pair.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- The function takes the following parameters:
  - `amount0Out`: The desired amount of token0 to swap out.
  - `amount1Out`: The desired amount of token1 to swap out.
  - `to`: The address to which the swapped tokens will be sent.
  - `data`: Additional data that can be used by the `to` address (e.g., for a callback function).
- Inside the function, it calls the `_swap` function, passing `amount0Out`, `amount1Out`, `to`, a fee amount of 200, and `data`.
- The `_swap` function handles the actual token swapping logic, including checking the available liquidity, calculating the swap amounts, and updating balances and reserves.

```js
// this low-level function should be called from a contract which performs important safety checks
function swapWithDiscount(uint amount0Out, uint amount1Out, address to, uint feeAmountOverride, bytes calldata data) external lock {
    _swap(amount0Out, amount1Out, to, feeAmountOverride, data);
}
```

The `swapWithDiscount` function is similar to the `swap` function but allows for a custom fee amount to be specified.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- The function takes the following parameters:
  - `amount0Out`: The desired amount of token0 to swap out.
  - `amount1Out`: The desired amount of token1 to swap out.
  - `to`: The address to which the swapped tokens will be sent.
  - `feeAmountOverride`: The custom fee amount to be used for the swap.
  - `data`: Additional data that can be used by the `to` address (e.g., for a callback function).
- Inside the function, it calls the `_swap` function, passing `amount0Out`, `amount1Out`, `to`, `feeAmountOverride`, and `data`.
- The `_swap` function handles the actual token swapping logic, including checking the available liquidity, calculating the swap amounts, and updating balances and reserves.

```js
// force balances to match reserves
function skim(address to) external lock {
    address _token0 = token0; // gas savings
    address _token1 = token1; // gas savings
    _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)) - reserve0);
    _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)) - reserve1);
    if (hasMinimums) {
        require(IERC20(_token0).balanceOf(address(this)) >= tokenMinimumBalance[_token0], 'Xchange: INSUFFICIENT_TOKEN0_BALANCE');
        require(IERC20(_token1).balanceOf(address(this)) >= tokenMinimumBalance[_token1], 'Xchange: INSUFFICIENT_TOKEN1_BALANCE');
    }
}
```

The `skim` function is used to force the contractΓÇÖs token balances to match the reserves.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- The function takes a parameter `to`, which represents the address to which the excess tokens will be transferred.
- Inside the function, it retrieves the addresses of `token0` and `token1` for gas savings.
- It calculates the excess balance of `token0` and `token1` by subtracting the reserve amounts from the total balance of the contract.
- It transfers the excess tokens of `token0` and `token1` to the specified `to` address using the `_safeTransfer` function.
- If the contract has minimum balance requirements (`hasMinimums` is true), it checks that the updated balances meet the minimum balance requirements for `token0` and `token1`.
- This function is typically used to reconcile the token balances with the reserves after external transfers or operations to ensure that the contract remains in a consistent state.

```js
// force reserves to match balances
function sync() external lock {
    _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
}
```

The `sync` function is used to force the reserves of the contract to match the current token balances.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- Inside the function, it retrieves the current balances of `token0` and `token1` using the `balanceOf` function of the respective ERC20 tokens.
- It then calls the internal `_update` function, passing the current balances and the existing reserves (`reserve0` and `reserve1`).
- The `_update` function updates the reserves and other related variables based on the new balances, ensuring that the reserves accurately reflect the current state of the contract.
- This function is typically used to synchronize the reserves after external transfers or operations to ensure that the contract remains in a consistent state.

```js
// attempt to force reserves to match balances
function syncSafe(uint256 gasAmountToken0, uint256 gasAmountToken1) external lock {
    require(_factory.isTrusted(msg.sender), 'Xchange: FORBIDDEN');
    _update(IERC20(token0).balanceOf{gas: gasAmountToken0}(address(this)), IERC20(token1).balanceOf{gas: gasAmountToken1}(address(this)), reserve0, reserve1);
}
```

The `syncSafe` function attempts to force the reserves of the contract to match the current token balances.

- The function is `external` and has the `lock` modifier, which ensures that the function can only be executed when the contract is not locked.
- The function takes two parameters: `gasAmountToken0` and `gasAmountToken1`, which represent the gas amounts to be used when calling the `balanceOf` function for `token0` and `token1`, respectively.
- The function requires that the caller is a trusted address (verified by `_factory.isTrusted(msg.sender)`).
- Inside the function, it retrieves the current balances of `token0` and `token1` using the `balanceOf` function of the respective ERC20 tokens, specifying the provided gas amounts.
- It then calls the internal `_update` function, passing the current balances and the existing reserves (`reserve0` and `reserve1`).
- The `_update` function updates the reserves and other related variables based on the new balances, ensuring that the reserves accurately reflect the current state of the contract.
- This function provides a way to attempt to synchronize the reserves with the token balances, taking into account the specified gas amounts for improved gas efficiency. It is typically used when gas optimizations are necessary, but it may result in an approximation of the actual reserves.

```js
// if fee is on, mint liquidity equivalent to 1/2th of the growth in sqrt(k)
function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
    address feeTo = _factory.feeTo();
    feeOn = feeTo != address(0);
    uint _kLast = kLast; // gas savings
    if (feeOn) {
        if (_kLast != 0) {
            uint rootK = Math.sqrt(uint(_reserve0) * _reserve1);
            uint rootKLast = Math.sqrt(_kLast);
            if (rootK > rootKLast) {
                uint numerator = totalSupply * (rootK - rootKLast);
                uint denominator = rootK + rootKLast;
                uint liquidity = numerator / denominator;
                if (liquidity > 0) _mint(feeTo, liquidity);
            }
        }
    } else if (_kLast != 0) {
        kLast = 0;
    }
}
```

The `_mintFee` function is a private function that is used to mint liquidity tokens as a fee based on the growth of the square root of the product of the reserves (`sqrt(k)`).

- The function takes the reserves of `token0` and `token1` as parameters: `_reserve0` and `_reserve1`.
- It retrieves the address to which the fee should be minted from `_factory.feeTo()`.
- It checks if the fee is turned on by verifying if the `feeTo` address is not zero.
- If the fee is turned on, it further checks if there is a previous value for `k` stored in `kLast` (denoted as `_kLast` for gas savings).
- If `_kLast` is not zero, it calculates the current value of `sqrt(k)` as `rootK` based on the product of `_reserve0` and `_reserve1`.
- It also calculates the previous value of `sqrt(k)` as `rootKLast` based on `_kLast`.
- If the current `sqrt(k)` (`rootK`) is greater than the previous `sqrt(k)` (`rootKLast`), it calculates the increase in `sqrt(k)` as `numerator` and the sum of the current and previous `sqrt(k)` as `denominator`.
- It then calculates the amount of liquidity tokens to be minted as `liquidity` based on the ratio of `numerator` to `denominator`.
- If `liquidity` is greater than zero, it mints the liquidity tokens to the `feeTo` address using the internal `_mint` function.
- If the fee is not turned on, it checks if there is a previous value for `k` (`_kLast`), and if so, it sets `kLast` to zero, effectively resetting the previous `k` value.
- The function returns a boolean value `feeOn`, indicating whether the fee is turned on or off.

This function is typically called during the minting process to mint liquidity tokens as a fee proportional to the growth in `sqrt(k)`.

```js
function _swap(uint amount0Out, uint amount1Out, address to, uint feeAmountOverride, bytes calldata data) internal {
    require(amount0Out > 0 || amount1Out > 0, 'Xchange: INSUFFICIENT_OUTPUT_AMOUNT');
    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    require(amount0Out < _reserve0 && amount1Out < _reserve1, 'Xchange: INSUFFICIENT_LIQUIDITY');

    uint[2] memory balances;
    { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = token0;
        address _token1 = token1;
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
        if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
        balances[0] = IERC20(_token0).balanceOf(address(this));
        balances[1] = IERC20(_token1).balanceOf(address(this));
        if (hasMinimums) {
            require(balances[0] >= tokenMinimumBalance[_token0], 'Xchange: INSUFFICIENT_TOKEN0_BALANCE');
            require(balances[1] >= tokenMinimumBalance[_token1], 'Xchange: INSUFFICIENT_TOKEN1_BALANCE');
        }
    }
    uint amount0In = balances[0] > _reserve0 - amount0Out ? balances[0] - (_reserve0 - amount0Out) : 0;
    uint amount1In = balances[1] > _reserve1 - amount1Out ? balances[1] - (_reserve1 - amount1Out) : 0;
    require(amount0In > 0 || amount1In > 0, 'Xchange: INSUFFICIENT_INPUT_AMOUNT');
    { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
        uint feeAmount = 200;
        if (feeAmountOverride != 200) {
            if (_factory.isTrusted(msg.sender)) {
                feeAmount = feeAmountOverride;
            } else {
                feeAmount = IXchangeDiscountAuthority(_factory.discountAuthority()).fee(msg.sender);
            }
            feeAmount = feeAmount <= 200 ? feeAmount : 200;
        }

        uint balance0Adjusted = (balances[0] * 100000) - (amount0In * feeAmount);
        uint balance1Adjusted = (balances[1] * 100000) - (amount1In * feeAmount);
        require(balance0Adjusted * balance1Adjusted >= uint(_reserve0) * _reserve1 * 100000**2, 'Xchange: K');
    }

    _update(balances[0], balances[1], _reserve0, _reserve1);
    emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
}
```

The `_swap` function is an internal function used to perform token swaps within the Xchange contract.

- The function takes the desired output amounts `amount0Out` and `amount1Out`, the recipient address `to`, a fee amount override `feeAmountOverride`, and additional data as input.
- It requires that at least one of the output amounts is greater than zero to ensure there is an output.
- It retrieves the current reserves of `token0` and `token1` using the `getReserves` function.
- It checks if the requested output amounts are less than the available reserves, ensuring sufficient liquidity.
- It defines a memory array `balances` to store the current token balances.
- Within a scoped block, it optimistically transfers the requested output amounts of tokens to the recipient `to` using the internal `_safeTransfer` function.
- If additional data is provided, it calls the `uniswapV2Call` function of the `to` address, passing the sender, output amounts, and additional data.
- It updates the `balances` array with the current token balances after the transfers.
- If there are minimum balance requirements (`hasMinimums` is true), it checks if the updated balances meet the minimum balance requirements.
- It calculates the input amounts (`amount0In` and `amount1In`) based on the updated balances and the difference between the reserves and the output amounts.
- It requires that at least one of the input amounts is greater than zero to ensure there is an input.
- It determines the fee amount to be applied based on the `feeAmountOverride` value and the sender's discount authority.
- It adjusts the token balances by subtracting the fee amount from the input amounts and multiplying by a factor of 100000.
- It verifies that the adjusted product of the balances is greater than or equal to the product of the reserves, ensuring the invariant `K` is maintained.
- It updates the reserves using the updated balances.
- Finally, it emits a `Swap` event to indicate the token swap.

This function is responsible for performing token swaps while considering the fee amount, adjusting balances, and updating reserves accordingly.

```js
// update reserves and, on the first call per block, price accumulators
function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
    require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, 'Xchange: OVERFLOW');

    unchecked {
        uint32 timeElapsed = uint32(block.timestamp) - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
    }
    reserve0 = uint112(balance0);
    reserve1 = uint112(balance1);
    blockTimestampLast = uint32(block.timestamp);
    emit Sync(reserve0, reserve1);
}
```

The `_update` function is a private function used to update the reserves and price accumulators within the Xchange contract.

- The function takes the current token balances `balance0` and `balance1`, as well as the previous reserves `_reserve0` and `_reserve1` as input.
- It first checks that the balances do not exceed the maximum value of `uint112` to prevent overflow.
- Within an unchecked block, it calculates the time elapsed since the last update by subtracting the previous block timestamp (`blockTimestampLast`) from the current block timestamp (`block.timestamp`).
- If there was a positive time elapsed and both reserves are non-zero, it updates the price accumulators (`price0CumulativeLast` and `price1CumulativeLast`) based on the ratio of reserves and the time elapsed.
- The price accumulators are updated using fixed-point arithmetic with `UQ112x112` encoding to maintain precision.
- The reserves are updated with the current balances, casting them to `uint112`.
- The `blockTimestampLast` is updated with the current block timestamp cast to `uint32`.
- Finally, it emits a `Sync` event to indicate the updated reserves.

This function ensures that the reserves are updated and the price accumulators are calculated correctly, taking into account the time elapsed between updates. It allows for tracking the historical price changes in the Xchange contract.

```js
function _safeTransfer(address token, address to, uint value) private {
    (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'Xchange: TRANSFER_FAILED');
}
```

The `_safeTransfer` function is a private function used to safely transfer tokens from the Xchange contract to a specified recipient.

- The function takes three parameters: `token` (the address of the token contract), `to` (the address of the recipient), and `value` (the amount of tokens to transfer).
- It calls the `call` function on the `token` contract, passing the encoded function selector and arguments for the `transfer` function (`SELECTOR` is defined as the selector for the `transfer` function).
- The `call` function returns a boolean `success` indicating whether the call was successful, and `data` containing any returned data.
- It then checks that the transfer was successful (`success` is true) and that either the returned data is empty (`data.length == 0`) or the decoded data indicates a successful transfer (`abi.decode(data, (bool))` is true).
- If the transfer fails or the returned data indicates a failure, the function reverts with an error message.

This function ensures that token transfers are executed correctly and verifies the success of the transfer. It helps prevent tokens from being trapped or lost during the transfer process.

```js
  function _trySafeTransfer(address token, address to, uint value, uint gasAmount) private returns (uint) {
      (bool ok,) = token.call{gas: gasAmount}(abi.encodeWithSelector(SELECTOR, to, value));
      if (ok) {
          return value;
      } else {
          return 0;
      }
  }
```

The `_trySafeTransfer` function is a private function used to attempt a safe token transfer with a specified gas amount.

- The function takes four parameters: `token` (the address of the token contract), `to` (the address of the recipient), `value` (the amount of tokens to transfer), and `gasAmount` (the specified gas amount for the transfer).
- It calls the `call` function on the `token` contract, passing the encoded function selector and arguments for the `transfer` function (`SELECTOR` is defined as the selector for the `transfer` function), along with the specified `gasAmount`.
- The `call` function returns a boolean `ok` indicating whether the call was successful. The returned data is ignored.
- If the transfer is successful (`ok` is true), the function returns the `value` indicating the amount of tokens transferred.
- If the transfer fails (`ok` is false), the function returns 0 to indicate that no tokens were transferred.

This function attempts to execute the token transfer with the specified gas amount and checks the success of the transfer. If the transfer fails, it returns 0 to indicate the failure. This provides flexibility to handle different gas requirements for token transfers.
