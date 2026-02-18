/* oxlint-disable @typescript-eslint/no-unused-vars */
import type { Currency } from "@x7/utils"
import { ChainId } from "@x7/utils"

import type { V2Route, V3Route } from "../../router"

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = 0n

//l2 execution fee on optimism is roughly the same as ETHEREUM
export const BASE_SWAP_COST = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISM_TESTNET:
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return 2000n
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
      return 5000n
  }
}

export const COST_PER_INIT_TICK = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
    case ChainId.BSC:
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISM_TESTNET:
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return 31000n
    default:
      return 0n
  }
}

export const COST_PER_HOP = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISM_TESTNET:
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return 80000n
  }
}

export const SINGLE_HOP_OVERHEAD = (_id: ChainId): bigint => {
  return 15000n
}

export const TOKEN_OVERHEAD = (
  id: ChainId,
  route: V3Route | V2Route
): bigint => {
  const overhead = 0n

  return overhead
}

// TODO: change per chain
export const NATIVE_WRAP_OVERHEAD = (id: ChainId): bigint => {
  switch (id) {
    default:
      return 27938n
  }
}

export const NATIVE_UNWRAP_OVERHEAD = (id: ChainId): bigint => {
  switch (id) {
    default:
      return 36000n
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
  return 0n
}
