/* oxlint-disable react-hooks/exhaustive-deps */

import type { BaseError } from "@wagmi/core"
import type { ChainId } from "@x7/utils"
import type {
  WriteContractErrorType,
  WriteContractReturnType,
} from "wagmi/actions"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { UserRejectedRequestError } from "viem"
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWriteContract,
} from "wagmi"
import { waitForTransactionReceipt } from "wagmi/actions"

import { X7LendingPoolV2 } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import { useTransactionStore } from "~/lib/providers/tx"
import { useWeb3Config } from "~/lib/providers/web3"

interface UseLiquidateLoanParams {
  loanId: number
  enabled?: boolean
}

export function useLiquidateLoan({ loanId }: UseLiquidateLoanParams) {
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const chainId = useChainId() as ChainId
  const { wagmiConfig: config } = useWeb3Config()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()

  const { data } = useSimulateContract({
    config,
    address: X7ContractsEnum.X7_LendingPool(chainId),
    abi: X7LendingPoolV2,
    functionName: "liquidate",
    args: loanId ? [BigInt(loanId)] : undefined,
  })

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message)
        }
      }

      if (hash && loanId) {
        setIsPending(true)

        trackTransaction({
          txHash: hash,
          type: "liquidate",
          summary: {
            pending: `Liquidating loan ${loanId}`,
            completed: `Successfully liquidated loan ${loanId}`,
            failed: `Something went wrong liquidating loan ${loanId}`,
          },
        })
      }
    },
    [address, loanId, chainId, config]
  )

  const write = useWriteContract({
    mutation: {
      onSettled,
      onSuccess: (hash: WriteContractReturnType) => {
        waitForTransactionReceipt(config, {
          hash,
          pollingInterval: 2_500,
          retryDelay: 2_500,
        })
          .then(() => {
            setIsPending(false)
          })
          .catch(() => setIsPending(false))
      },
    },
  })

  return useMemo(() => {
    return {
      ...write,
      isPending,
      data,
    }
  }, [isPending, write, data])
}
