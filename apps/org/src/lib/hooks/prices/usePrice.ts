/* oxlint-disable @typescript-eslint/no-non-null-assertion */

import { useQuery } from "@tanstack/react-query"

import { USDC } from "@x7/sdk"
import { SwapType } from "@x7/smart-order-router"
import type { ChainId, Currency } from "@x7/utils"
import {
  CurrencyAmount,
  DEAD_ADDRESS,
  LogCodes,
  Native,
  Percent,
  TradeType,
} from "@x7/utils"
import { useAlphaRouter } from "~/lib/providers/router"
import { CACHE_TIERS } from "~/lib/query"
import { fromReadableAmount } from "~/lib/utils/conversion"
import { log } from "~/lib/utils/log"

interface UsePrice {
  chainId: ChainId
  currency: Currency | undefined
}

export const usePrice = ({ chainId, currency }: UsePrice) => {
  const {
    state: { router, isChainIdSettled, debouncedChainId },
  } = useAlphaRouter()

  return useQuery({
    queryKey: [
      `${chainId}/${currency?.isNative ? "NATIVE" : currency?.wrapped.address}`,
    ],
    queryFn: async () => {
      // To quote a REAL live price we always goto the chain
      const options = {
        recipient: DEAD_ADDRESS,
        slippageTolerance: new Percent(50, 100),
        deadline: Math.floor(+new Date() / 1000 + 60 * 20),
        type: SwapType.SWAP_ROUTER_02,
        saveRoutes: false,
        ignoreAborts: true,
      }

      try {
        const route = await router?.route(
          CurrencyAmount.fromRawAmount(
            currency!,
            fromReadableAmount(0.1, currency!.decimals)
          ),
          currency?.isNative
            ? USDC[chainId as keyof typeof USDC]
            : Native.onChain(chainId),
          TradeType.EXACT_INPUT,
          options
        )

        if (route) {
          // Router is quoted with a 0.1-unit input; scale back to a 1-unit price.
          return route.quote.multiply(10n)
        } else {
          throw new Error("Route not found")
        }
      } catch (error) {
        log.error(LogCodes.FAIL, `Failed to fetch price`, { error })

        // Surface the failure to react-query (isError) instead of returning a
        // fabricated 1:1 price, which would silently render wrong dollar values.
        throw error
      }
    },
    enabled: Boolean(
      debouncedChainId && currency && router && isChainIdSettled
    ),
    ...CACHE_TIERS.SEMI_STATIC,
  })
}
