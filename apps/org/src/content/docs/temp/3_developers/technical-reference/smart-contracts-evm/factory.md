---
order: 100
tags: [guide]
---

# Factory

## Code

XchangeFactory.sol

### Address

XchangeFactory is deployed at:

| Chain               | Address                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum (Mainnet)  | 0x7de800467aFcE442019884f51A4A1B9143a34fAc [view](https://etherscan.io/address/0x7de800467aFcE442019884f51A4A1B9143a34fAc)            |
| Polygon             | 0x7de800467aFcE442019884f51A4A1B9143a34fAc [view](https://polygonscan.com/address/0x7de800467aFcE442019884f51A4A1B9143a34fAc)         |
| Arbitrum            | 0x7de800467aFcE442019884f51A4A1B9143a34fAc [view](https://arbiscan.io/address/0x7de800467aFcE442019884f51A4A1B9143a34fAc)             |
| Optimism            | 0x7de800467aFcE442019884f51A4A1B9143a34fAc [view](https://optimistic.etherscan.io/address/0x7de800467aFcE442019884f51A4A1B9143a34fAc) |
| Base                | 0x7de800467aFcE442019884f51A4A1B9143a34fAc [view](https://basescan.org/address/0x7de800467aFcE442019884f51A4A1B9143a34fAc)            |
| Binance Smart Chain | 0x7de800467aFcE442019884f51A4A1B9143a34fAc [view](https://bscscan.com/token/0x7de800467aFcE442019884f51A4A1B9143a34fAc)               |

## Events

### PairCreated

```solidity
event PairCreated(address indexed token0, address indexed token1, address pair, uint);
```

Emitted each time a pair is created via createPair.

token0 is guaranteed to be strictly less than token1 by sort order.
The final uint log value will be 1 for the first pair created, 2 for the second, etc. (see allPairs/getPair).

## Read-Only Functions

### getPair

```solidity
function getPair(address tokenA, address tokenB) external view returns (address pair);
```

Returns the address of the pair for tokenA and tokenB, if it has been created, else address(0) (0x0000000000000000000000000000000000000000).

tokenA and tokenB are interchangeable.
Pair addresses can also be calculated deterministically via the SDK.

### allPairs

```solidity
function allPairs(uint) external view returns (address pair);
```

Returns the address of the nth pair (0-indexed) created through the factory, or address(0) (0x0000000000000000000000000000000000000000) if not enough pairs have been created yet.

Pass 0 for the address of the first pair created, 1 for the second, etc.

### allPairsLength

```solidity
function allPairsLength() external view returns (uint);
```

Returns the total number of pairs created through the factory so far.

### feeTo

```solidity
function feeTo() external view returns (address);
```

See Protocol Charge Calculation.

### feeToSetter

```solidity
function feeToSetter() external view returns (address);
```

The address allowed to change feeTo.

## State-Changing Functions

### createPair

```solidity
function createPair(address tokenA, address tokenB) external returns (address pair);
```

Creates a pair for tokenA and tokenB if one doesn't exist already.

tokenA and tokenB are interchangeable.
Emits PairCreated.

## Interface

```solidity
pragma solidity >=0.5.0;

interface IXchangeFactory {
  event PairCreated(address indexed token0, address indexed token1, address pair, uint);

  function getPair(address tokenA, address tokenB) external view returns (address pair);
  function allPairs(uint) external view returns (address pair);
  function allPairsLength() external view returns (uint);

  function feeTo() external view returns (address);
  function feeToSetter() external view returns (address);

  function createPair(address tokenA, address tokenB) external returns (address pair);
}
```
