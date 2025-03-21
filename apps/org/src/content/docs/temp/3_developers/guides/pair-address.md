---
order: 100
tags: [guide]
---

# Compute Pair Address

`getPair`

The most obvious way to get the address for a pair is to call getPair on the factory. If the pair exists, this function will return its address, else `address(0)` `(0x0000000000000000000000000000000000000000)`.

The "canonical" way to determine whether or not a pair exists.
Requires an on-chain lookup.
\

## CREATE2

Thanks to some fancy footwork in the factory, we can also compute pair addresses without any on-chain lookups because of CREATE2. The following values are required for this technique:

| address              | The factory address                                                |
| -------------------- | ------------------------------------------------------------------ |
| salt                 | `keccak256(abi.encodePacked(token0, token1))`                      |
| keccak256(init_code) | `579e9bdec156a1150f17cf9884a4421f309e7e9be6b26dcfbd9a52883418ee21` |
| token0               | must be strictly less than token1 by sort order.                   |

Can be computed offline.
Requires the ability to perform keccak256.

### Examples

### Solidity

```solidity
address factory = 0x7de800467aFcE442019884f51A4A1B9143a34fAc;
address token0 = 0xCAFE000000000000000000000000000000000000; // change me!
address token1 = 0xF00D000000000000000000000000000000000000; // change me!

address pair = address(uint(keccak256(abi.encodePacked(
  hex'ff',
  factory,
  keccak256(abi.encodePacked(token0, token1)),
  hex'579e9bdec156a1150f17cf9884a4421f309e7e9be6b26dcfbd9a52883418ee21'
))));

```
