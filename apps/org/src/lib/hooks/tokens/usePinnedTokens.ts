/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useMemo } from "react"
import { getAddress as _getAddress, isAddress } from "viem"

import { ARB, DAI, USDC, USDT, WBTC } from "@x7/sdk"
import { useLocalStorage } from "@x7/ui"
import type { Currency } from "@x7/utils"
import { ChainId, Native, WETH9, WNATIVE } from "@x7/utils"

// TODO: this should probably be in sdk
export const COMMON_BASES = {
  [ChainId.ETHEREUM]: [
    Native.onChain(ChainId.ETHEREUM),
    WNATIVE[ChainId.ETHEREUM],
    WBTC[ChainId.ETHEREUM],
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
  ],
  [ChainId.BSC]: [
    Native.onChain(ChainId.BSC),
    WNATIVE[ChainId.BSC],
    WETH9[ChainId.BSC],
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
  ],
  [ChainId.POLYGON]: [
    Native.onChain(ChainId.POLYGON),
    WNATIVE[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.ARBITRUM]: [
    Native.onChain(ChainId.ARBITRUM),
    WNATIVE[ChainId.ARBITRUM],
    ARB[ChainId.ARBITRUM],
    WBTC[ChainId.ARBITRUM],
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
  ],
  [ChainId.OPTIMISM]: [
    Native.onChain(ChainId.OPTIMISM),
    WNATIVE[ChainId.OPTIMISM],
    WBTC[ChainId.OPTIMISM],
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
  ],
  [ChainId.BASE]: [
    Native.onChain(ChainId.BASE),
    WNATIVE[ChainId.BASE],
    DAI[ChainId.BASE],
    USDC[ChainId.BASE],
  ],
  [ChainId.ETHEREUM_TESTNET]: [
    Native.onChain(ChainId.ETHEREUM_TESTNET),
    WETH9[ChainId.ETHEREUM_TESTNET],
    USDC[ChainId.ETHEREUM_TESTNET],
  ],
  [ChainId.BASE_TESTNET]: [
    Native.onChain(ChainId.BASE_TESTNET),
    WNATIVE[ChainId.BASE_TESTNET],
    USDC[ChainId.BASE_TESTNET],
  ],
} as const

const COMMON_BASES_IDS = Object.entries(COMMON_BASES).reduce<
  Record<string, string[]>
>(
  (acc, [chain, tokens]) => {
    const chainId = chain
    acc[chainId] = Array.from(new Set(tokens.map((token) => token.id)))
    return acc
  },
  {} as Record<ChainId, string[]>
)

function getAddress(address: string) {
  if (address === "NATIVE") return "NATIVE"
  return _getAddress(address)
}

export const usePinnedTokens = () => {
  const [value, setValue] = useLocalStorage(
    "xchange.pinnedTokens",
    COMMON_BASES_IDS
  )

  useEffect(() => {
    Object.entries(COMMON_BASES_IDS).forEach(([chainId, tokens]) => {
      if (!value[chainId]) {
        value[chainId] = tokens
        setValue(value)
      }
    })
  }, [setValue])

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(":")
      if (chainId === undefined || address === undefined) {
        return
      }
      setValue((value) => {
        value[chainId] = Array.from(
          new Set([
            ...(value[chainId] ?? []),
            `${chainId}:${getAddress(address)}`,
          ])
        )
        return value
      })
    },
    [setValue]
  )

  const removePinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(":")
      setValue((value: any) => {
        if (chainId === undefined || address === undefined) {
          return
        }
        value[chainId] = Array.from(
          new Set(
            value[chainId]?.filter(
              (token: string) => token !== `${chainId}:${getAddress(address)}`
            )
          )
        )
        return value
      })
    },
    [setValue]
  )

  const hasToken = useCallback(
    (currency: Currency | string) => {
      if (typeof currency === "string") {
        if (!currency.includes(":")) {
          throw new Error("Address provided instead of id")
        }

        const [chainId, address] = currency.split(":")

        if (address !== "NATIVE" && !isAddress(address ?? "")) {
          throw new Error("Address provided not a valid ERC20 address")
        }

        if (!chainId) {
          throw new Error("ChainId not provided")
        }

        return value[chainId]?.includes(
          `${chainId}:${getAddress(address ?? "")}`
        )
      }

      return !!value[currency.chainId]?.includes(currency.id)
    },
    [value]
  )

  const mutate = useCallback(
    (type: "add" | "remove", currencyId: string) => {
      if (type === "add") addPinnedToken(currencyId)
      if (type === "remove") removePinnedToken(currencyId)
    },
    [addPinnedToken, removePinnedToken]
  )

  return useMemo(() => {
    return {
      data: value,
      mutate,
      hasToken,
    }
  }, [hasToken, mutate, value])
}
