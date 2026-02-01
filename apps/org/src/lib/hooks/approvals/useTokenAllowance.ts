/* oxlint-disable @typescript-eslint/no-non-null-assertion */
"use client"

import type { ChainId, Token } from "@x7/utils"
import type { Address } from "viem"

import { erc20Abi } from "viem"
import { useReadContract } from "wagmi"

import { CurrencyAmount } from "@x7/utils"

interface UseTokenAllowance {
  token?: Token
  chainId: ChainId | undefined
  owner: Address | undefined
  spender: Address | undefined
  enabled?: boolean
}

export const useTokenAllowance = ({
  chainId,
  token,
  owner,
  spender,
}: UseTokenAllowance) => {
  return useReadContract({
    chainId,
    address: token ? token.address : undefined,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner!, spender!],
    // enabled: Boolean(token && owner && spender && enabled && chainId),
    // @ts-expect-error: todo move to new react-query
    select: (data: number) => {
      if (token) {
        return CurrencyAmount.fromRawAmount(token, data)
      }
    },
  })
}
