import invariant from "tiny-invariant"

import { X7ContractsEnum } from "@x7/sdk"
import { WRAPPED_NATIVE_CURRENCY } from "@x7/smart-order-router"
import type { Currency } from "@x7/utils"
import { ChainId, Native, Token } from "@x7/utils"

export const X7R = new Token({
  chainId: ChainId.ETHEREUM,
  address: X7ContractsEnum.X7R(ChainId.ETHEREUM),
  decimals: 18,
  symbol: "X7R",
  name: "X7R",
})

export const X7DAO = new Token({
  chainId: ChainId.ETHEREUM,
  address: X7ContractsEnum.X7DAO(ChainId.ETHEREUM),
  decimals: 18,
  symbol: "X7DAO",
  name: "X7DAO",
})

export const X7D: Record<number, Token> = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: X7ContractsEnum.X7D(ChainId.ETHEREUM),
    decimals: 18,
    symbol: "X7D",
    name: "X7D",
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: X7ContractsEnum.X7D(ChainId.POLYGON),
    decimals: 18,
    symbol: "mX7D",
    name: "mX7D",
  }),
  [ChainId.ARBITRUM]: new Token({
    chainId: ChainId.ARBITRUM,
    address: X7ContractsEnum.X7D(ChainId.ARBITRUM),
    decimals: 18,
    symbol: "aX7D",
    name: "aX7D",
  }),
  [ChainId.OPTIMISM]: new Token({
    chainId: ChainId.OPTIMISM,
    address: X7ContractsEnum.X7D(ChainId.OPTIMISM),
    decimals: 18,
    symbol: "oX7D",
    name: "oX7D",
  }),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: X7ContractsEnum.X7D(ChainId.BSC),
    decimals: 18,
    symbol: "bX7D",
    name: "bX7D",
  }),
  [ChainId.BASE]: new Token({
    chainId: ChainId.BASE,
    address: X7ContractsEnum.X7D(ChainId.BASE),
    decimals: 18,
    symbol: "X7D",
    name: "X7D",
  }),
  [ChainId.BASE_TESTNET]: new Token({
    chainId: ChainId.BASE_TESTNET,
    address: X7ContractsEnum.X7D(ChainId.BASE_TESTNET),
    decimals: 18,
    symbol: "fX7D",
    name: "fX7D",
  }),
}

function isMatic(chainId: ChainId) {
  return chainId === ChainId.POLYGON_TESTNET || chainId === ChainId.POLYGON
}

class MaticNativeCurrency extends Native {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isMatic(this.chainId)) throw new Error("Not matic")
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: ChainId) {
    if (!isMatic(chainId)) throw new Error("Not matic")
    super({ chainId, decimals: 18, symbol: "MATIC", name: "Polygon Matic" })
  }
}

function isBsc(chainId: ChainId) {
  return chainId === ChainId.BSC
}

class BscNativeCurrency extends Native {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isBsc(this.chainId)) throw new Error("Not bnb")
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: ChainId) {
    if (!isBsc(chainId)) throw new Error("Not bnb")
    super({ chainId, decimals: 18, symbol: "BNB", name: "BNB" })
  }
}

export class ExtendedEther extends Native {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped instanceof Token) return wrapped
    throw new Error("Unsupported chain ID")
  }

  private static _cachedExtendedEther: Record<number, ExtendedEther> = {}

  public static onChain(chainId: ChainId): ExtendedEther {
    return (
      this._cachedExtendedEther[chainId] ??
      (this._cachedExtendedEther[chainId] = new ExtendedEther({
        ...this.deserialize(this as unknown as Native),
      }))
    )
  }
}

// Cache for native currencies
const cachedNativeCurrency: Record<number, Native | Token> = {}

// Function to get the native currency on a specific chain
export function nativeOnChain(chainId: ChainId): Native | Token {
  // If the native currency for this chain is already cached, return it
  if (cachedNativeCurrency[chainId]) {
    return cachedNativeCurrency[chainId]
  }

  // Determine the native currency based on the chain ID
  const nativeCurrency: Native | Token = isMatic(chainId)
    ? new MaticNativeCurrency(chainId)
    : isBsc(chainId)
      ? new BscNativeCurrency(chainId)
      : ExtendedEther.onChain(chainId)

  // Cache the native currency for this chain and return it
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}
