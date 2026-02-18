/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable react-hooks/exhaustive-deps */

import type { SendTransactionReturnType } from "@wagmi/core"
import type { FC, MouseEvent } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import type { Address } from "viem"
import { UserRejectedRequestError } from "viem"
import { useAccount, usePublicClient } from "wagmi"

import { cn } from "@x7/css"
import { CheckCircleIcon } from "@x7/icons"
import { useSlippageTolerancePercent } from "@x7/ui"
import { Button } from "@x7/ui/button"
import { Dots } from "@x7/ui/dots"
import type { ChainId, Currency, Native } from "@x7/utils"
import { Amount, LogCodes, slippageAmount } from "@x7/utils"
import { APPROVE_TAG_ADD_LEGACY } from "~/lib/constants/misc"
import { useAddLiquidity } from "~/lib/hooks/liquidity/useAddLiquidityHook"
import { useTransactionDeadline } from "~/lib/hooks/utils/useTransactionDeadline"
import { useTransactionStore } from "~/lib/providers/tx"
import { useApproved } from "~/lib/systems/Checker/Provider"
import { XchangeV2PoolState } from "~/lib/systems/PoolFinder/types"
import { log } from "~/lib/utils/log"

interface ConfirmLiquidityAddProps {
  poolState: XchangeV2PoolState
  poolAddress: Address | undefined
  chainId: ChainId
  token0: Currency | Native | undefined
  token1: Currency | Native | undefined
  input0: Amount<Currency | Native> | undefined
  input1: Amount<Currency | Native> | undefined
  onSuccess: () => void
  contract: Address | undefined
}

export const ConfirmLiquidityAdd: FC<ConfirmLiquidityAddProps> = ({
  poolAddress,
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  contract,
  onSuccess: _onSuccess,
}) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false)
  const { data: deadline } = useTransactionDeadline({ chainId })
  const { address } = useAccount()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()
  const { approved } = useApproved(APPROVE_TAG_ADD_LEGACY)
  const [slippageTolerance] = useSlippageTolerancePercent("addLiquidity")
  const client = usePublicClient()

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      if (!token0 || !token1 || !client) return

      trackTransaction({
        txHash: hash,
        type: "addLiquidity",
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: "Something went wrong when adding liquidity",
        },
      })

      log.info(LogCodes.SUCCESS, "Pool created", { poolAddress })
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
        ? poolState === XchangeV2PoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(
              input0.currency,
              slippageAmount(input0, slippageTolerance)[0]
            )
        : undefined,
      input1
        ? poolState === XchangeV2PoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(
              input1.currency,
              slippageAmount(input1, slippageTolerance)[0]
            )
        : undefined,
    ]
  }, [poolState, input0, input1, slippageTolerance])

  const {
    write,
    status,
    isPending: isWritePending,
  } = useAddLiquidity({
    token0,
    token1,
    chainId,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    deadline,
    mutation: {
      onSuccess,
      onError,
    },
    contract,
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
  }, [status, isWritePending, _onSuccess])

  const buttonText = useMemo(() => {
    if (isWritePending) {
      return <Dots>Confirm in wallet</Dots>
    }
    if (status === "success") {
      return "Liquidity Added"
    }
    if (isLocalLoading) {
      return "Adding Liquidity"
    }
    return "Add Liquidity"
  }, [isWritePending, status, isLocalLoading])

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
