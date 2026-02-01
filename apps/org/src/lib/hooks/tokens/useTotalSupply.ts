"use client"

import type { Token } from "@x7/utils"

import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { erc20Abi } from "viem"
import { useReadContracts } from "wagmi"

import { CurrencyAmount } from "@x7/utils"

function bigIntToCurrencyAmount(totalSupply?: bigint, token?: Token) {
  return token?.isToken && totalSupply
    ? CurrencyAmount.fromRawAmount(token, totalSupply)
    : undefined
}

export const useMultipleTotalSupply = (
  tokens?: Token[]
): Record<string, CurrencyAmount<Token> | undefined> | undefined => {
  const contracts = useMemo(() => {
    return (
      tokens?.map((token) => {
        return {
          address: token.wrapped.address,
          chainId: token.chainId,
          abi: erc20Abi,
          functionName: "totalSupply" as const,
        }
      }) ?? []
    )
  }, [tokens])

  const { data } = useReadContracts({
    contracts,

    query: {
      enabled: tokens && tokens.length > 0,
      placeholderData: keepPreviousData,
    },
    // watch: true,
  })

  return useMemo(() => {
    return data
      ?.map((cs, i) => bigIntToCurrencyAmount(cs.result, tokens?.[i]))
      .reduce<Record<`0x${string}`, CurrencyAmount<Token> | undefined>>(
        (acc, curr, i) => {
          if (curr && tokens?.[i]) {
            acc[tokens[i].wrapped.address] = curr
          }
          return acc
        },
        {}
      )
  }, [data, tokens])
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export const useTotalSupply = (
  token?: Token
): CurrencyAmount<Token> | undefined => {
  const tokens = useMemo(() => (token ? [token] : undefined), [token])
  const resultMap = useMultipleTotalSupply(tokens)
  return useMemo(
    () => (token ? resultMap?.[token.wrapped.address] : undefined),
    [resultMap, token]
  )
}
