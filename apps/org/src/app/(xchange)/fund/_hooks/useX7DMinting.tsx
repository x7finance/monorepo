"use client"

import type { BaseError } from "@wagmi/core"
import type { ChainId } from "@x7/utils"
import type { Dispatch, SetStateAction } from "react"
import type {
  WriteContractErrorType,
  WriteContractReturnType,
} from "wagmi/actions"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { parseEther, UserRejectedRequestError } from "viem"
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWriteContract,
} from "wagmi"
import { waitForTransactionReceipt } from "wagmi/actions"

import { X7LendingPoolReserve } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency"
import { useTransactionStore } from "~/lib/providers/tx"
import { useWeb3Config } from "~/lib/providers/web3"

interface UseX7DMintingParams {
  valueInput: string | undefined
  enabled?: boolean
  setRefetchCount?: Dispatch<SetStateAction<number>>
}

export const useX7DMinting = ({
  valueInput,
  setRefetchCount,
}: UseX7DMintingParams) => {
  const { address } = useAccount()

  const [isPending, setIsPending] = useState(false)
  const chainId = useChainId() as ChainId
  const { wagmiConfig: config } = useWeb3Config()
  const lendingPoolReserve = X7ContractsEnum.LendingPoolReserve(chainId)

  const {
    mutate: { trackTransaction },
  } = useTransactionStore()

  const { data } = useSimulateContract({
    config,
    address: lendingPoolReserve,
    abi: X7LendingPoolReserve,
    functionName: "depositETH",
    value: valueInput ? parseEther(valueInput) : 0n,
  })
  const { symbol } = useNativeCurrency({ chainId })

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message)
        }
      }

      if (hash && valueInput) {
        setIsPending(true)

        trackTransaction({
          txHash: hash,
          type: "mint",
          summary: {
            pending: `Minting X7D with ${valueInput} ${symbol.toString()}`,
            completed: `Successfully minted ${valueInput} X7D`,
            failed: `Something went wrong minting ${valueInput} X7D`,
          },
        })
      }
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [address, valueInput]
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
            if (setRefetchCount)
              setRefetchCount((refetchCount: number) => refetchCount + 1)
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
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, write])
}
