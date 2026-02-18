import invariant from "tiny-invariant"

import type { ChainId } from "../chain"
import { natives } from "../chain"

import { Currency } from "./Currency"
import type { Token } from "./Token"
import type { Currency as CurrencyType } from "./Type"
import { WNATIVE } from "./wrapped"
import type { SerializedNative } from "./zod"
import { nativeSchema } from "./zod"

export class Native extends Currency {
  public readonly id: string
  public readonly isNative = true as const
  public readonly isToken = false as const
  public override readonly symbol: string
  public override readonly name: string
  protected constructor(native: {
    chainId: ChainId
    decimals: number
    symbol: string
    name: string
  }) {
    super(native)
    this.id = `${native.chainId}:NATIVE`
    this.symbol = native.symbol
    this.name = native.name
  }
  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId as keyof typeof WNATIVE]
    invariant(!!wnative, "WRAPPED")
    return wnative
  }

  private static cache: Record<number, Native> = {}

  public static onChain(chainId: ChainId): Native {
    const cached = this.cache[chainId]

    if (typeof cached !== "undefined") {
      return cached
    }

    const nativeCurrency = natives[chainId]

    invariant(!!nativeCurrency, "NATIVE_CURRENCY")

    const { decimals, name, symbol } = nativeCurrency

    const native = new Native({
      chainId,
      decimals,
      name,
      symbol,
    })

    this.cache[chainId] = new Native({
      chainId,
      decimals,
      name,
      symbol,
    })

    return native
  }

  public equals(other: CurrencyType): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  public serialize(): SerializedNative {
    return nativeSchema.parse({
      isNative: this.isNative,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      chainId: this.chainId,
    })
  }

  public static deserialize(native: SerializedNative): Native {
    return Native.onChain(native.chainId as ChainId)
  }
}
