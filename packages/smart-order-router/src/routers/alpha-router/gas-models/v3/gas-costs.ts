import type { Currency, Token } from "@x7/utils"
import { ChainId } from "@x7/utils"

import { AAVE_MAINNET, LIDO_MAINNET } from "../../../../providers"
import type { V3Route } from "../../../router"

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = BigInt(0)

//l2 execution fee on optimism is roughly the same as mainnet
export const BASE_SWAP_COST = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
    case ChainId.OPTIMISM:
    case ChainId.BSC:
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
      return BigInt(2000)
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
      return BigInt(5000)
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return BigInt(2000)
    //TODO determine if sufficient
  }
  return BigInt(0)
}
export const COST_PER_INIT_TICK = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
    case ChainId.BSC:
      return BigInt(31000)
    case ChainId.OPTIMISM:
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
      return BigInt(31000)
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
      return BigInt(31000)
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return BigInt(31000)
  }
  return BigInt(0)
}

export const COST_PER_HOP = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
    case ChainId.BSC:
    case ChainId.OPTIMISM:
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
      return BigInt(80000)
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
      return BigInt(80000)
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return BigInt(80000)
  }
  return BigInt(0)
}

export const SINGLE_HOP_OVERHEAD = (_id: ChainId): bigint => {
  return BigInt(15000)
}

export const TOKEN_OVERHEAD = (id: ChainId, route: V3Route): bigint => {
  const tokens: Token[] = route.tokenPath
  let overhead = BigInt(0)

  if (id === ChainId.ETHEREUM) {
    // AAVE's transfer contains expensive governance snapshotting logic. We estimate
    // it at around 150k.
    if (tokens.some((t: Token) => t.equals(AAVE_MAINNET))) {
      overhead = overhead + BigInt(150000)
    }

    // LDO's reaches out to an external token controller which adds a large overhead
    // of around 150k.
    if (tokens.some((t: Token) => t.equals(LIDO_MAINNET))) {
      overhead = overhead + BigInt(150000)
    }
  }

  return overhead
}

// TODO: change per chain
export const NATIVE_WRAP_OVERHEAD = (id: ChainId): bigint => {
  switch (id) {
    default:
      return BigInt(27938)
  }
}

export const NATIVE_UNWRAP_OVERHEAD = (id: ChainId): bigint => {
  switch (id) {
    default:
      return BigInt(36000)
  }
}

export const NATIVE_OVERHEAD = (
  chainId: ChainId,
  amount: Currency,
  quote: Currency
): bigint => {
  if (amount.isNative) {
    // need to wrap eth in
    return NATIVE_WRAP_OVERHEAD(chainId)
  }
  if (quote.isNative) {
    // need to unwrap eth out
    return NATIVE_UNWRAP_OVERHEAD(chainId)
  }
  return BigInt(0)
}
