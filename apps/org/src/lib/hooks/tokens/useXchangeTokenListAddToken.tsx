/* oxlint-disable react-hooks/exhaustive-deps */

"use client"

import type { BaseError } from "@wagmi/core"
import type { ChainId } from "@x7/utils"
import type { Address } from "viem"
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

import { tokenRegisteryABI } from "@x7/contracts"
import { generateChainEtherTokenEnum, X7ContractsEnum } from "@x7/sdk"
import { useTransactionStore } from "~/lib/providers/tx"

import { useWeb3Config } from "../../providers/web3"

interface UseXchangeTokenListAddTokenParams {
  fee: string | undefined
  tokenAddress: Address
  factoryAddress: Address
  enabled?: boolean
}

export const useXchangeTokenListAddToken = ({
  fee,
  tokenAddress,
  factoryAddress,
}: UseXchangeTokenListAddTokenParams) => {
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const chainId = useChainId() as ChainId
  const { wagmiConfig: config } = useWeb3Config()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()

  const pairedToken = generateChainEtherTokenEnum(chainId)

  const { data } = useSimulateContract({
    config,
    address: X7ContractsEnum.TokenList,
    abi: tokenRegisteryABI,
    functionName: "addToken",
    value: fee ? parseEther(fee) : 0n,
    args: [tokenAddress, pairedToken, factoryAddress],
  })

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message)
        }
      }

      if (hash && fee) {
        setIsPending(true)

        trackTransaction({
          txHash: hash,
          type: "addToken",
          summary: {
            pending: `Adding new token to the Xchange list`,
            completed: `Successfully added new token to the Xchange list`,
            failed: `Something went wrong adding new token to the Xchange list`,
          },
        })
      }
    },
    [address, fee]
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
