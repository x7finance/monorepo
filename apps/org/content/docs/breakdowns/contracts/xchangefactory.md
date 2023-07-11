---
title: Xchange Factory
tags: [breakdowns]
---

The `XchangeFactory` contract is a factory contract that allows the creation of token pairs for a decentralized exchange.  
It includes functions for setting addresses, managing trusted and failsafe liquidator addresses, and creating new pairs of tokens.

```js
interface IXchangeFactory {}
interface IXchangePair {}
interface IXchangeERC20 {}
interface IERC20 {}
interface IXchangeDiscountAuthority {}
interface IUniswapV2Callee {}
```

Xchange Factory Contract interfaces with multiple interfaces. These interfaces define the required functions, events, and structures that need to be implemented in the respective contracts to ensure proper functionality and interaction within the Xchange ecosystem.

1. `IXchangeFactory`: Provides functions and events related to the XchangeFactory contract, including pair creation, trusted address management, and fee settings.

2. `IXchangePair`: Represents the interface for a pair of tokens in the XchangePair contract. It includes functions for token swapping, liquidity minting/burning, and balance synchronization.

3. `IXchangeERC20`: Represents the interface for an ERC20 token used in the XchangePair contract. It includes functions for token transfers, approvals, and permit functionality.

4. `IERC20`: Represents the standard ERC20 interface with basic token-related functions such as name, symbol, decimals, balanceOf, allowance, transfer, and transferFrom.

5. `IXchangeDiscountAuthority`: Provides a function to retrieve the fee percentage for a given address.

6. `IUniswapV2Callee`: Represents the interface for a contract that can be called by the UniswapV2 router during token swaps.

```js
contract XchangeERC20 is IXchangeERC20 {}
contract XchangePair is IXchangePair, XchangeERC20 {}
```

The `XchangeERC20` contract is an implementation of the `IXchangeERC20` interface. It represents an ERC20 token with additional functionality specific to the XchangePair contract.

The `XchangePair` contract is an implementation of the `IXchangePair` interface and inherits from the `XchangeERC20` contract. It represents a pair of tokens in the Xchange ecosystem and includes functions for token swapping, liquidity management, fee calculations, and synchronization with token balances.

```js
address public feeTo;
address public discountAuthority;
mapping(address => bool) _isTrusted;
mapping(address => bool) _isFailSafeLiquidator;

mapping(address => mapping(address => address)) public getPair;
mapping(address => bool) public isPair;
address[] public allPairs;

// Pair Address => token address => Is in the pair
mapping(address => mapping(address => bool)) public pairTokens;
```

The state variables of the `XchangeFactory` contract.

- `feeTo`: The address where the trading fees will be sent to.
- `discountAuthority`: The address that determines the discount percentage for certain addresses.
- `_isTrusted`: A mapping that stores whether an address is trusted or not.
- `_isFailSafeLiquidator`: A mapping that stores whether an address is a failsafe liquidator or not.
- `getPair`: A mapping that associates token pairs with their corresponding pair contract addresses.
- `isPair`: A mapping that stores whether a given address corresponds to a pair contract or not.
- `allPairs`: An array that holds the addresses of all the pair contracts created.
- `pairTokens`: A nested mapping that represents the tokens included in a pair contract, where `pairAddress => tokenAddress => isInPair`.

```js
constructor() Ownable(msg.sender) {
    _isTrusted[address(this)] = true;
}
```

The constructor function initializes the `XchangeFactory` contract. It is called when the contract is deployed.

- The constructor extends the `Ownable` contract, which means the deployer of the `XchangeFactory` contract becomes the owner.
- It sets the `_isTrusted` mapping value for the `XchangeFactory` contract address (`address(this)`) to `true`, indicating that the factory contract is trusted.

```js
function allPairsLength() external view returns (uint) {
    return allPairs.length;
}
```

The `allPairsLength` function is a publicly accessible view function in the `XchangeFactory` contract.

- The function returns the length of the `allPairs` array, which represents the number of pair contracts created by the factory.
- It does not modify the contractΓÇÖs state and can be called by anyone to retrieve the length of the `allPairs` array.

```js
function isTrusted(address checkAddress) external view returns (bool) {
    return _isTrusted[checkAddress];
}
```

Apologies for the formatting issue. HereΓÇÖs the revised summary with proper bullet points:

The `isTrusted` function is a publicly accessible view function in the `XchangeFactory` contract.

- It takes an `address` parameter called `checkAddress`.
- The function retrieves the value associated with `checkAddress` from the `_isTrusted` mapping, which determines if the address is trusted.
- The function returns a boolean value indicating whether the specified address is trusted or not.

```js
function isFailsafeLiquidator(address checkAddress) external view returns (bool) {
    return _isFailSafeLiquidator[checkAddress];
}
```

The `isFailsafeLiquidator` function is a publicly accessible view function in the `XchangeFactory` contract.

- It takes an `address` parameter called `checkAddress`.
- The function retrieves the value associated with `checkAddress` from the `_isFailSafeLiquidator` mapping, which determines if the address is a failsafe liquidator.
- The function returns a boolean value indicating whether the specified address is a failsafe liquidator or not.

```js
function setFeeTo(address _feeTo) external onlyOwner {
    require(_feeTo != feeTo);
    address oldFeeToo = feeTo;
    feeTo = _feeTo;
    emit FeeToSet(oldFeeToo, _feeTo);
}
```

The `setFeeTo` function is a publicly accessible function in the `XchangeFactory` contract.

- It takes an `address` parameter `_feeTo` representing the new fee recipient address.
- The function can only be called by the contract owner (the one who deployed the contract) due to the `onlyOwner` modifier.
- It checks if the new fee recipient address is different from the current `feeTo` address.
- If the check passes, it updates the `feeTo` address with the new value.
- It emits the `FeeToSet` event, providing the old `feeTo` address and the new `_feeTo` address as event arguments.

```js
function setDiscountAuthority(address _discountAuthority) external onlyOwner {
    require(_discountAuthority != discountAuthority);
    address oldDiscountAuthority = discountAuthority;
    discountAuthority = _discountAuthority;
    emit DiscountAuthoritySet(oldDiscountAuthority, _discountAuthority);
}
```

The `setDiscountAuthority` function is a publicly accessible function in the `XchangeFactory` contract.

- It takes an `address` parameter `_discountAuthority` representing the new discount authority address.
- The function can only be called by the contract owner (the one who deployed the contract) due to the `onlyOwner` modifier.
- It checks if the new discount authority address is different from the current `discountAuthority` address.
- If the check passes, it updates the `discountAuthority` address with the new value.
- It emits the `DiscountAuthoritySet` event, providing the old `discountAuthority` address and the new `_discountAuthority` address as event arguments.

```js
function setTrusted(address trustAddress, bool shouldTrustAddress) external onlyOwner {
    require(_isTrusted[trustAddress] != shouldTrustAddress);
    _isTrusted[trustAddress] = shouldTrustAddress;
    emit TrustedSet(trustAddress, shouldTrustAddress);
}
```

The `setTrusted` function is a publicly accessible function in the `XchangeFactory` contract.

- It takes two parameters: `trustAddress`, which is the address to be trusted or untrusted, and `shouldTrustAddress`, which is a boolean value indicating whether the address should be trusted or not.
- The function can only be called by the contract owner (the one who deployed the contract) due to the `onlyOwner` modifier.
- It checks if the current trust status of `trustAddress` matches the desired trust status specified by `shouldTrustAddress`.
- If the check passes, it updates the trust status of `trustAddress` by setting `_isTrusted[trustAddress]` to `shouldTrustAddress`.
- It emits the `TrustedSet` event, providing `trustAddress` and `shouldTrustAddress` as event arguments to indicate the change in trust status.

```js
function setFailsafeLiquidator(address trustAddress, bool shouldTrustAddress) external onlyOwner {
    require(_isFailSafeLiquidator[trustAddress] != shouldTrustAddress);
    _isFailSafeLiquidator[trustAddress] = shouldTrustAddress;
    emit FailsafeLiquidatorSet(trustAddress, shouldTrustAddress);
}
```

The `setFailsafeLiquidator` function is a publicly accessible function in the `XchangeFactory` contract. HereΓÇÖs a summary of its functionality:

- It takes two parameters: `trustAddress`, which is the address to be designated as a failsafe liquidator or not, and `shouldTrustAddress`, which is a boolean value indicating whether the address should be designated as a failsafe liquidator or not.
- The function can only be called by the contract owner (the one who deployed the contract) due to the `onlyOwner` modifier.
- It checks if the current failsafe liquidator status of `trustAddress` matches the desired status specified by `shouldTrustAddress`.
- If the check passes, it updates the failsafe liquidator status of `trustAddress` by setting `_isFailSafeLiquidator[trustAddress]` to `shouldTrustAddress`.
- It emits the `FailsafeLiquidatorSet` event, providing `trustAddress` and `shouldTrustAddress` as event arguments to indicate the change in failsafe liquidator status.

```js
function createPair(address tokenA, address tokenB) external returns (address pair) {
    require(tokenA != tokenB, 'Xchange: IDENTICAL_ADDRESSES');
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), 'Xchange: ZERO_ADDRESS');
    require(getPair[token0][token1] == address(0), 'Xchange: PAIR_EXISTS'); // single check is sufficient
    bytes memory bytecode = type(XchangePair).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
        pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }

    IXchangePair(pair).initialize(token0, token1);
    getPair[token0][token1] = pair;
    getPair[token1][token0] = pair; // populate mapping in the reverse direction
    pairTokens[pair][token0] = true;
    pairTokens[pair][token1] = true;
    isPair[pair] = true;
    allPairs.push(pair);
    emit PairCreated(token0, token1, pair, allPairs.length);
}
```

The `createPair` function is a publicly accessible function in the `XchangeFactory` contract.

- It takes two parameters: `tokenA` and `tokenB`, which are the addresses of the tokens to be paired.
- The function ensures that `tokenA` and `tokenB` are not identical and not the zero address.
- It checks if a pair already exists for the given tokens by looking up the `getPair` mapping.
- If a pair does not exist, the function proceeds to create a new pair contract using the `XchangePair` contractΓÇÖs bytecode and a unique salt value based on the token addresses.
- The newly created pair contract is initialized with the token addresses using the `initialize` function.
- The `getPair` mapping is updated to store the pair address for both token pairs (`token0`/`token1` and `token1`/`token0`).
- The `pairTokens` mapping is updated to indicate that the pair contract includes both tokens.
- The `isPair` mapping is updated to mark the pair address as a valid pair.
- The pair address is added to the `allPairs` array.
- The `PairCreated` event is emitted, providing the token addresses, pair address, and the length of `allPairs` as event arguments.

The function creates a new pair contract for the given tokens, initializes it, and updates the relevant mappings and arrays to reflect the new pairΓÇÖs existence.

```js
// a library for performing various math operations

library Math {
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    // babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

// a library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

// range: [0, 2**112 - 1]
// resolution: 1 / 2**112

library UQ112x112 {
    uint224 constant Q112 = 2**112;

    // encode a uint112 as a UQ112x112
    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112; // never overflows
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }
}
```

The code provided includes two libraries: `Math` and `UQ112x112`.

1.  Library `Math`:

- The `min` function takes two `uint` values, `x` and `y`, and returns the minimum value between them.
- The `sqrt` function calculates the square root of a `uint` value `y` using the Babylonian method. It iteratively approximates the square root until convergence.

2. Library `UQ112x112`:

- The library defines a constant `Q112` with a value of 2¹¹².
- The `encode` function converts a `uint112` value `y` into a `uint224` value `z` by multiplying `y` with `Q112`.
- The `uqdiv` function divides a `uint224` value `x` by a `uint112` value `y` and returns the result as a `uint224` value `z`.

These libraries provide reusable functions for performing mathematical operations and handling fixed-point numbers.
