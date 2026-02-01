import type { ChainId } from "../../chain"

import { Token } from "../Token"

export function addressMapToTokenMap(
  {
    decimals,
    symbol,
    name,
  }: {
    decimals: number | string
    symbol?: string | undefined
    name?: string | undefined
  },
  map: Record<number, `0x${string}`>
) {
  return Object.fromEntries(
    Object.entries(map).map(([chainId, address]) => [
      chainId,
      new Token({
        chainId: Number(chainId) as ChainId,
        address,
        decimals: Number(decimals),
        symbol,
        name,
      }),
    ])
  )
}
