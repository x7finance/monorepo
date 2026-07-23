import { Aerodrome, PancakeSwap, SushiSwap, Uniswap, Xchange } from "@x7/icons"
import { Implementation } from "@x7/utils"

export const implementationComponents = {
  [Implementation.UNISWAP]: <Uniswap className="h-5 w-auto text-pink-500" />,
  [Implementation.PANCAKESWAP]: (
    <PancakeSwap className="h-4 w-auto text-zinc-400" />
  ),
  [Implementation.XCHANGE]: <Xchange className="h-5 w-auto dark:text-white" />,
  [Implementation.SUSHISWAP]: <SushiSwap className="h-4 w-auto" />,
  [Implementation.AERODROME]: <Aerodrome className="h-4 w-auto" />,
  [Implementation.MIXED]: <span>Mixed Pools</span>,
}
