/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */

import type { BaseError } from "@wagmi/core"
import { getWalletClient } from "@wagmi/core"
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unused-vars */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData, UserRejectedRequestError } from "viem"
import { useAccount, useChainId } from "wagmi"

import type { ChainId, Token } from "@x7/utils"
import { LogCodes, Native } from "@x7/utils"
import { executeRoute } from "~/app/(xchange)/_actions/execute-route"
import { getErrorMessage } from "~/app/(xchange)/_actions/get-error-message"
import { ApprovalState } from "~/lib/hooks/approvals/useTokenApproval"
import { useTransactionStore } from "~/lib/providers/tx"
import { useWeb3Config } from "~/lib/providers/web3"
import { useSwapState } from "~/lib/stores/swap"
import { log } from "~/lib/utils/log"

export function useSwapFormLogic(
  _token0: Token | undefined,
  _token1: Token | undefined,
  token0: Token | undefined,
  token1: Token | undefined,
  route: any, // Replace 'any' with the correct type
  swapAmountString: string
) {
  const { wagmiConfig: config } = useWeb3Config()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()
  const {
    state: {
      swapAmount,
      token0Approval,
      recipient,
      routeQuoteKey,
      currentQuoteKey,
      chainId,
    },
    mutate: { setToken0, setToken1, setSwapAmount },
    loaders: { isQuoteLoading },
  } = useSwapState()
  const walletChainId = useChainId() as ChainId
  const { address } = useAccount()

  const [refetchCount, setRefetchCount] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const isWrap =
    token0?.isNative &&
    token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isUnwrap =
    token1?.isNative &&
    token0?.wrapped.address === Native.onChain(chainId).wrapped.address

  useEffect(() => {
    if (_token0 && !token0) setToken0(_token0)
    if (_token1 && !token1) setToken1(_token1)
    setRefetchCount((prev) => prev + 1)
  }, [_token0, _token1, token0, token1, setToken0, setToken1])

  const swapActionAllowed =
    !!address &&
    !!token0 &&
    !!token1 &&
    !!route &&
    !!recipient &&
    !!routeQuoteKey &&
    routeQuoteKey === currentQuoteKey &&
    walletChainId === chainId &&
    !isQuoteLoading &&
    (!token0.isNative
      ? token0Approval.approval !== ApprovalState.NOT_APPROVED
      : true) &&
    parseFloat(`${swapAmountString}`) > 0

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: Error | null) => {
      try {
        if (e instanceof Error) {
          if (!(e instanceof UserRejectedRequestError)) {
            toast.error((e as BaseError).shortMessage || e.message)
          }
        }

        if (hash) {
          setIsPending(true)

          trackTransaction({
            txHash: hash,
            type: "swap",
            summary: {
              pending: `${
                isWrap ? "Wrapping" : isUnwrap ? "Unwrapping" : "Swapping"
              } ${route?.trade.swaps[0]?.inputAmount?.toFixed(6)} ${token0?.symbol} ${
                isWrap ? "to" : isUnwrap ? "to" : "for"
              } ${route?.trade.swaps[0]?.outputAmount?.toFixed(6)} ${token1?.symbol}`,
              completed: `${
                isWrap ? "Wrap" : isUnwrap ? "Unwrap" : "Swap"
              } ${route?.trade.swaps[0]?.inputAmount?.toFixed(6)} ${token0?.symbol} ${
                isWrap ? "to" : isUnwrap ? "to" : "for"
              } ${route?.trade.swaps[0]?.outputAmount?.toFixed(6)} ${token1?.symbol}`,
              failed: `Something went wrong when trying to ${
                isWrap ? "wrap" : isUnwrap ? "unwrap" : "swap"
              } ${token0?.symbol} ${
                isWrap ? "to" : isUnwrap ? "to" : "for"
              } ${token1?.symbol}`,
            },
            onSuccess: () => {
              setSwapAmount("")
              setIsPending(false)
              setRefetchCount(refetchCount + 1)
            },
            onFail: (error) => {
              log.error(LogCodes.FAIL, "Failed to track transaction", {
                error,
              })
            },
          })
        }
      } catch (error) {
        setIsPending(false)
        setRefetchCount(refetchCount + 1)
      } finally {
        setSwapAmount("")
        setIsPending(false)
        // do we need to refetch balances?
      }
    },
    [
      trackTransaction,
      setSwapAmount,
      refetchCount,
      token0?.symbol,
      token1?.symbol,
      route,
    ]
  )

  const onExecute = useCallback(async () => {
    if (!token0 || !swapAmount) {
      return
    }

    try {
      setIsPending(true)
      let tx: `0x${string}`

      if (isWrap || isUnwrap) {
        // Handle wrap/unwrap directly without route
        const walletClient = await getWalletClient(config)
        if (!walletClient?.account.address)
          throw new Error("No wallet connected")

        if (isWrap) {
          // Wrap ETH to WETH
          tx = await walletClient.sendTransaction({
            to: token1?.wrapped.address,
            value: BigInt(swapAmount!.quotient),
            data: "0xd0e30db0", // deposit() function selector
          })
        } else {
          // Unwrap WETH to ETH
          tx = await walletClient.sendTransaction({
            to: token0?.wrapped.address,
            data: encodeFunctionData({
              abi: [
                {
                  inputs: [{ name: "wad", type: "uint256" }],
                  name: "withdraw",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              functionName: "withdraw",
              args: [BigInt(swapAmount!.quotient)],
            }),
          })
        }
      } else {
        // Regular swap using route
        tx = await executeRoute({
          token0,
          swapAmount: swapAmount!,
          route,
          expectedRecipient: recipient,
          currentQuoteKey,
          routeQuoteKey,
          expectedChainId: chainId,
          config,
        })
      }

      onSettled(tx, null)
    } catch (e) {
      const errorMessage = getErrorMessage(e as Error)
      toast.error(errorMessage)
      setIsPending(false)
    }
  }, [
    token0,
    swapAmount,
    route,
    recipient,
    currentQuoteKey,
    routeQuoteKey,
    chainId,
    config,
    onSettled,
    isWrap,
    isUnwrap,
  ])

  return {
    refetchCount,
    isPending,
    swapActionAllowed,
    isWrap,
    isUnwrap,
    onExecute,
  }
}
