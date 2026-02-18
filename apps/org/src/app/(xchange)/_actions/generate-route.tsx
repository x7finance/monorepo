/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { Config } from "@wagmi/core"
import { getPublicClient, getWalletClient } from "@wagmi/core"

import type { AlphaRouter, SwapRoute } from "@x7/smart-order-router"
import { SwapType, WRAPPED_NATIVE_CURRENCY } from "@x7/smart-order-router"
import { LogCodes, Percent, TradeType } from "@x7/utils"
import type { SwapState } from "~/lib/stores/swap"
import { log } from "~/lib/utils/log"

export const generateRoute = async (
  swapState: SwapState,
  config: Config,
  router: AlphaRouter
): Promise<SwapRoute | null> => {
  const {
    state: { token1, token0, swapAmount, recipient },
    mutate: { clearPossibleRoutes },
  } = swapState
  const publicClient = getPublicClient(config)
  let walletClient

  try {
    walletClient = await getWalletClient(config)
  } catch (error) {
    log.error(LogCodes.FAIL, "No wallet connected", { error })
  }

  if (!walletClient && !publicClient) {
    throw new Error("No Clients Detected")
  }

  if (!token0 || !token1) {
    throw new Error("No tokens selected!")
  }

  if (!swapAmount) {
    throw new Error("No swap amount specified!")
  }

  const [address] = (await walletClient?.requestAddresses()) ?? []
  const recipientAddress = recipient ?? address

  if (!recipientAddress) {
    throw new Error("No recipient address available!")
  }

  clearPossibleRoutes()
  //router.abortCurrentRoute();
  if (!router) {
    throw new Error("No AlphaRouter instance setup")
  }

  // Check for wrap/unwrap cases
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[token0.chainId]
  const isWrap = !token0.isToken && token1.equals(nativeCurrency)
  const isUnwrap = token0.equals(nativeCurrency) && !token1.isToken

  if (isWrap || isUnwrap) {
    return router.wrapUnwrap(swapAmount, TradeType.EXACT_INPUT, {
      recipient: recipientAddress,
      slippageTolerance: swapState.state.slippage ?? new Percent(50, 10_000),
      deadline: Math.floor(+new Date() / 1000 + 60 * 20),
      type: SwapType.SWAP_ROUTER_02,
      simulate: {
        fromAddress: recipientAddress,
      },
    })
  }

  const route = await router.route(
    swapAmount,
    token1,
    TradeType.EXACT_INPUT,
    {
      recipient: recipientAddress,
      slippageTolerance: swapState.state.slippage ?? new Percent(50, 10_000),
      deadline: Math.floor(+new Date() / 1000 + 60 * 20),
      type: SwapType.SWAP_ROUTER_02,
      simulate: {
        fromAddress: recipientAddress,
      },
      saveRoutes: true,
    },
    {
      enableFeeOnTransferFeeFetching: true,
    }
  )

  return route
}
