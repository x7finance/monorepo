/* oxlint-disable react-hooks/exhaustive-deps */

"use client"

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

import { X7Pioneer } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import { useTransactionStore } from "~/lib/providers/tx"

import { useWeb3Config } from "../../providers/web3"

interface UsePioneerUnlockParams {
  pioneerId: number
  unlockFee: number
  enabled?: boolean
}

export const usePioneerUnlock = ({
  pioneerId,
  unlockFee,
}: UsePioneerUnlockParams) => {
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const chainId = useChainId() as ChainId
  const { wagmiConfig: config } = useWeb3Config()

  const {
    mutate: { trackTransaction },
  } = useTransactionStore()

  const { data } = useSimulateContract({
    config,
    address: X7ContractsEnum.PioneerRewardPool(chainId),
    abi: X7Pioneer,
    functionName: "claimRewards",
    args: [unlockFee, pioneerId],
  })

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message)
        }
      }

      if (hash && pioneerId) {
        setIsPending(true)

        trackTransaction({
          txHash: hash,
          type: "unlock",
          summary: {
            pending: `Unlocking Pioneer ${pioneerId}`,
            completed: `Succesfully Unlocked Pioneer ${pioneerId}`,
            failed: `Something went wrong unlocking Pioneer ${pioneerId}`,
          },
        })
      }
    },
    [address, pioneerId]
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
  }, [isPending, write])
}
