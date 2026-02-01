import type { ActiveChainId, Currency } from "@x7/utils"
import type { Address } from "viem"

import { useQuery } from "@tanstack/react-query"
import { zeroAddress } from "viem"

import { useWeb3Config } from "~/lib/providers/web3"
import { CACHE_TIERS, TIME } from "~/lib/query"

import { queryFnUseBalances } from "./useBalancesWeb3"

interface UseBalanceParams {
  chainId: ActiveChainId | undefined
  currency: Currency | undefined
  account: Address | undefined
  enabled?: boolean
}

export const useBalanceWeb3 = ({
  chainId,
  currency,
  account,
  enabled = true,
}: UseBalanceParams) => {
  const { wagmiConfig } = useWeb3Config()

  return useQuery({
    queryKey: ["useBalance", { chainId, currency, account }],
    queryFn: async () => {
      if (!currency) return null
      const data = await queryFnUseBalances({
        chainId,
        currencies: [currency],
        account,
        config: wagmiConfig,
      })
      return (
        data?.[currency.isNative ? zeroAddress : currency.wrapped.address] ??
        null
      )
    },
    refetchInterval: TIME.MINUTE,
    enabled: Boolean(chainId && account && enabled),
    ...CACHE_TIERS.DYNAMIC,
  })
}
