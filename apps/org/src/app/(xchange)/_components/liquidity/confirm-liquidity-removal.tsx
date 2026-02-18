/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable react-hooks/exhaustive-deps */

import type { SendTransactionReturnType } from "@wagmi/core"
import type { FC, MouseEvent } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import type { Address } from "viem"
import { UserRejectedRequestError } from "viem"
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi"

import { cn } from "@x7/css"
import { CheckCircleIcon } from "@x7/icons"
import { useSlippageTolerancePercent } from "@x7/ui"
import { Button } from "@x7/ui/button"
import { Dots } from "@x7/ui/dots"
import type { ChainId, Currency, Native } from "@x7/utils"
import { Amount, LogCodes, slippageAmount } from "@x7/utils"
import { APPROVE_TAG_REMOVE } from "~/lib/constants/misc"
import { useRemoveLiquidity } from "~/lib/hooks/liquidity/useRemoveLiquidityHook"
import type {
  LiquidityFees,
  UserPositionsResponse,
} from "~/lib/hooks/tokens/useGetAllUserTokens"
import { useTransactionDeadline } from "~/lib/hooks/utils/useTransactionDeadline"
import { useTransactionStore } from "~/lib/providers/tx"
import { useApproved } from "~/lib/systems/Checker/Provider"
import { log } from "~/lib/utils/log"

interface ConfirmLiquidityRemovalProps {
  poolAddress: Address | undefined
  position: UserPositionsResponse
  liquidityRemoving: Amount<Currency> | undefined
  chainId: ChainId
  token0: Currency | Native | undefined
  token1: Currency | Native | undefined
  input0: Amount<Currency | Native> | undefined
  input1: Amount<Currency | Native> | undefined
  ammInput: Amount<Currency | Native> | undefined
  fees: LiquidityFees
  onSuccess: () => void
  contract: Address | undefined
}

export const ConfirmLiquidityRemoval: FC<ConfirmLiquidityRemovalProps> = ({
  poolAddress,
  chainId,
  token0,
  token1,
  input0,
  input1,
  liquidityRemoving,
  fees,
  onSuccess: _onSuccess,
  contract,
  ammInput,
}) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false)
  const { data: deadline } = useTransactionDeadline({ chainId })
  const { address } = useAccount()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()
  const { approved } = useApproved(APPROVE_TAG_REMOVE)
  const [slippageTolerance] = useSlippageTolerancePercent("removeLiquidity")
  const client = usePublicClient()

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      if (!token0 || !token1 || !client) return

      trackTransaction({
        txHash: hash,
        type: "removeLiquidity",
        summary: {
          pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          failed: "Something went wrong when removing liquidity",
        },
      })

      // TODO: send user to pool page when its created
      log.info(LogCodes.LIQUIDITY_ADD, "Pool created", { poolAddress })
    },
    [client, chainId, token0, token1, address]
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof UserRejectedRequestError) {
      toast.error(e.message)
    }
  }, [])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? Amount.fromRawAmount(
            input0.currency,
            slippageAmount(input0, slippageTolerance)[0]
          )
        : undefined,
      input1
        ? Amount.fromRawAmount(
            input1.currency,
            slippageAmount(input1, slippageTolerance)[0]
          )
        : undefined,
    ]
  }, [input0, input1, slippageTolerance])

  const {
    write,
    data,
    isPending: isWritePending,
  } = useRemoveLiquidity({
    token0,
    token1,
    chainId,
    liquidityRemoving,
    address,
    minAmount0,
    minAmount1,
    deadline,
    ammInput,
    contract,
    fees,
    mutation: {
      onSuccess,
      onError,
    },
  })

  const { status } = useWaitForTransactionReceipt({
    chainId,
    hash: data,
    pollingInterval: 2_500,
    retryDelay: 2_500,
  })

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (write) {
        write(() => {
          setIsLocalLoading(true)
        }).catch((error) => {
          log.error(LogCodes.FAIL, "Error confirming transaction:", {
            error,
          })
        })
      }
    },
    [write]
  )

  useEffect(() => {
    if (status === "success" && !isWritePending) {
      setIsLocalLoading(false)
      _onSuccess()
    }
  }, [status, isWritePending])

  const buttonText = useMemo(() => {
    if (isWritePending) {
      return <Dots>Confirm in wallet</Dots>
    }
    if (status === "success") {
      return "Liquidity Removed"
    }
    if (isLocalLoading) {
      return "Removing Liquidity"
    }
    return "Remove Liquidity"
  }, [isWritePending, status])

  const isDisabled = isWritePending || !approved || !write
  const buttonVariant =
    status === "success" || isDisabled ? "outline" : "primary"
  const isLoading = (isWritePending && !isDisabled) || isLocalLoading

  return (
    <Button
      size="lg"
      variant={buttonVariant}
      disabled={isDisabled}
      loading={isLoading}
      icon={status === "success" ? CheckCircleIcon : undefined}
      iconPosition="end"
      iconProps={{
        className: cn(
          status === "success" ? "text-emerald-500" : undefined,
          "h-5 w-5 relative left-2"
        ),
      }}
      onClick={handleClick}
      fullWidth
    >
      {buttonText}
    </Button>
  )
}
