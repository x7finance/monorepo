import type { AlphaRouter } from "@x7/smart-order-router"
import { SwapType } from "@x7/smart-order-router"
import type { Currency } from "@x7/utils"
import { CurrencyAmount, DEAD_ADDRESS, Percent, TradeType } from "@x7/utils"
import { fromReadableAmount } from "~/lib/utils/conversion"

export const generateRoute = async (
  token0: Currency,
  token1: Currency,
  router: AlphaRouter
) => {
  const route = await router.route(
    CurrencyAmount.fromRawAmount(
      token0,
      fromReadableAmount(1 / 10_000, token0.decimals)
    ),
    token1,
    TradeType.EXACT_INPUT,
    {
      recipient: DEAD_ADDRESS,
      slippageTolerance: new Percent(1, 10_000),
      deadline: Math.floor(+new Date() / 1000 + 60 * 20),
      type: SwapType.SWAP_ROUTER_02,
    }
  )

  return route?.quote.multiply(10_000n).add(route.quote)
}
