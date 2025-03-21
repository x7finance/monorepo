---
order: 100
tags: [guide]
---

# Pair

This documentation covers Xchange-specific functionality. For ERC-20 functionality, see Pair (ERC-20).

## Code

XchangePair.sol

### Address

See Pair Addresses.

## Events

### Mint

event Mint(address indexed sender, uint amount0, uint amount1);
Emitted each time liquidity tokens are created via mint.

### Burn

event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
Emitted each time liquidity tokens are destroyed via burn.

### Swap

```solidity
event Swap(
  address indexed sender,
  uint amount0In,
  uint amount1In,
  uint amount0Out,
  uint amount1Out,
  address indexed to
);
```

Emitted each time a swap occurs via swap.

### Sync

```solidity
event Sync(uint112 reserve0, uint112 reserve1);
```

Emitted each time reserves are updated via mint, burn, swap, or sync.

## Read-Only Functions

### MINIMUM_LIQUIDITY

```solidity
function MINIMUM_LIQUIDITY() external pure returns (uint);
```

Returns 1000 for all pairs. See Minimum Liquidity.

### factory

```solidity
function factory() external view returns (address);
```

Returns the factory address.

### token0

```solidity
function token0() external view returns (address);
```

Returns the address of the pair token with the lower sort order.

### token1

```solidity
function token1() external view returns (address);
```

Returns the address of the pair token with the higher sort order.

### getReserves

```solidity
function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
```

Returns the reserves of token0 and token1 used to price trades and distribute liquidity. See Pricing. Also returns the block.timestamp (mod 2\*\*32) of the last block during which an interaction occured for the pair.

### price0CumulativeLast

```solidity
function price0CumulativeLast() external view returns (uint);
```

See [Oracles](https://www.google.com).

### price1CumulativeLast

```solidity
function price1CumulativeLast() external view returns (uint);
```

See [Oracles](https://www.google.com).

### kLast

function kLast() external view returns (uint);
Returns the product of the reserves as of the most recent liquidity event. See Protocol Charge Calculation.

## State-Changing Functions

## Xchange features

### initialize

```solidity
  function initialize(address, address) external;
```

### mustBurn

```solidity
  function mustBurn(address to, uint256 gasAmount) external returns (uint256 amount0, uint256 amount1);
```

`mustBurn` is similar to `burn`, functions present in the UniswapV2 protocol. However, they contain various countermeasures to ensure these calls always succeed. These countermeasures include configurable gas limits and best effort calls. They prevent ecosystem owned liquidity from being trapped within the pair contract due to accidental or intentional pathological token contracts.

### swapWithDiscount

```solidity
  function swapWithDiscount(uint amount0Out, uint amount1Out, address to, uint feeAmountOverride, bytes calldata data) external;
```

`swapWithDiscount` is a modified version of swap which allows a caller to assert they should be granted a discount.

If the caller is an untrusted party, the `msg.sender` is validated against the Discount Authority contract. This check is skipped if the caller is a trusted authority. This enables the use of a peripheral router contract.

This functionality exists to ensure that the swap gas cost is not affected by the discount capability except when a caller chooses to request that they be discounted. This ensures the default gas cost of interacting with the pair is similar to the existing implementations of the UniswapV2 protocol.

### syncSafe

```solidity
  function syncSafe(uint256 gasAmountToken0, uint256 gasAmountToken1) external;
```

`syncSafe` is similar to `sync`, functions present in the UniswapV2 protocol. However, they contain various countermeasures to ensure these calls always succeed. These countermeasures include configurable gas limits and best effort calls. They prevent ecosystem owned liquidity from being trapped within the pair contract due to accidental or intentional pathological token contracts.

### withdrawTokensAgainstMinimumBalance

```solidity
  function withdrawTokensAgainstMinimumBalance(address tokenAddress, address to, uint112 amount) external returns (uint112);
```

Used by trusted external addresses to remove tokens while simultaneously reducing the set minimum balance. This is the functionality that allows loan liquidation while also protecting the token balance greater than the loan amount from being withdrawn.

### setMinimumBalance

```solidity
  function setMinimumBalance(address tokenAddress, uint112 minimumAmount) external;
```

Callable only by a trusted address to prevent the associated balance of tokens drop below that amount. All external calls are checked against these minimum values.

### mint

```solidity
function mint(address to) external returns (uint liquidity);
```

Creates pool tokens.

- Emits Mint, Sync, Transfer.

### burn

```solidity
function burn(address to) external returns (uint amount0, uint amount1);
```

Destroys pool tokens.

- Emits Burn, Sync, Transfer.

### swap

```solidity
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
```

Swaps tokens. For regular swaps, data.length must be 0. Also see Flash Swaps.

- Emits Swap, Sync.

### skim

```solidity
function skim(address to) external;
```

See the whitepaper.

### sync

```solidity
function sync() external;
```

See the whitepaper.

- Emits Sync.

### Interface

```solidity
pragma solidity >=0.5.0;

interface IXchangeV2Pair {
  event Approval(address indexed owner, address indexed spender, uint value);
  event Transfer(address indexed from, address indexed to, uint value);

  function name() external pure returns (string memory);
  function symbol() external pure returns (string memory);
  function decimals() external pure returns (uint8);
  function totalSupply() external view returns (uint);
  function balanceOf(address owner) external view returns (uint);
  function allowance(address owner, address spender) external view returns (uint);

  function approve(address spender, uint value) external returns (bool);
  function transfer(address to, uint value) external returns (bool);
  function transferFrom(address from, address to, uint value) external returns (bool);

  function DOMAIN_SEPARATOR() external view returns (bytes32);
  function PERMIT_TYPEHASH() external pure returns (bytes32);
  function nonces(address owner) external view returns (uint);

  function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

  event Mint(address indexed sender, uint amount0, uint amount1);
  event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
  event Swap(
      address indexed sender,
      uint amount0In,
      uint amount1In,
      uint amount0Out,
      uint amount1Out,
      address indexed to
  );
  event Sync(uint112 reserve0, uint112 reserve1);

  function MINIMUM_LIQUIDITY() external pure returns (uint);
  function factory() external view returns (address);
  function token0() external view returns (address);
  function token1() external view returns (address);
  function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
  function price0CumulativeLast() external view returns (uint);
  function price1CumulativeLast() external view returns (uint);
  function kLast() external view returns (uint);

  function mint(address to) external returns (uint liquidity);
  function burn(address to) external returns (uint amount0, uint amount1);
  function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
  function skim(address to) external;
  function sync() external;

  // Xchange additional features
  function initialize(address, address) external;

  function mustBurn(address to, uint256 gasAmount) external returns (uint256 amount0, uint256 amount1);
  function swapWithDiscount(uint amount0Out, uint amount1Out, address to, uint feeAmountOverride, bytes calldata data) external;
  function syncSafe(uint256 gasAmountToken0, uint256 gasAmountToken1) external;

  function withdrawTokensAgainstMinimumBalance(address tokenAddress, address to, uint112 amount) external returns (uint112);
  function setMinimumBalance(address tokenAddress, uint112 minimumAmount) external;

}



```

ABI
