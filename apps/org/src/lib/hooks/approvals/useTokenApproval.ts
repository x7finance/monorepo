import type { Currency, CurrencyAmount } from "@x7/utils"
import type { Address } from "viem"
import type {
  WriteContractErrorType,
  WriteContractReturnType,
} from "wagmi/actions"

/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { maxUint256, UserRejectedRequestError } from "viem"
import { useAccount, useSimulateContract, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "wagmi/actions"

import { LogCodes, Native } from "@x7/utils"
import { useTransactionStore } from "~/lib/providers/tx"
import { useWeb3Config } from "~/lib/providers/web3"
import { log } from "~/lib/utils/log"

import { useTokenAllowance } from "./useTokenAllowance"

export enum ApprovalState {
  LOADING = "LOADING",
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

interface UseTokenApprovalParams {
  spender: Address | undefined
  amount: CurrencyAmount<Currency> | undefined
  approveMax?: boolean
  enabled?: boolean
}

export const useTokenApproval = ({
  amount,
  spender,
  enabled = true,
  approveMax,
}: UseTokenApprovalParams): [
  ApprovalState,
  ReturnType<typeof useWriteContract<any, unknown>>,
  ReturnType<typeof useSimulateContract>["data"],
] => {
  const { address } = useAccount()
  const { wagmiConfig } = useWeb3Config()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()
  const [pending, setPending] = useState(false)
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch,
  } = useTokenAllowance({
    token: amount?.currency.wrapped,
    owner: address,
    spender,
    chainId: amount?.currency.chainId,
    enabled: Boolean(amount?.currency.isToken && enabled),
  })

  const { data: simulatedData } = useSimulateContract({
    chainId: amount?.currency.chainId,
    abi: [
      {
        constant: false,
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as const,
    address: amount?.currency.wrapped.address,
    functionName: "approve",
    args: [spender!, approveMax ? maxUint256 : amount ? amount.quotient : 0n],
  })

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        setPending(false)

        if (!(e instanceof UserRejectedRequestError)) {
          toast.error(e.message)
          log.error(LogCodes.APPROVAL_FAIL, "Failed to approve token", { e })
        }
      }

      if (hash && amount) {
        setPending(true)
        trackTransaction({
          txHash: hash,
          type: "approval",
          summary: {
            pending: `Approving ${amount.currency.symbol}`,
            completed: `Successfully approved ${amount.currency.symbol}`,
            failed: `Something went wrong approving ${amount.currency.symbol}`,
          },
          onFail: (e) => {
            log.error(LogCodes.APPROVAL_FAIL, "Failed to approve token", { e })
          },
        })
      }
    },
    [address, amount, wagmiConfig]
  )

  const execute = useWriteContract<any, unknown>({
    config: wagmiConfig,
    mutation: {
      onMutate: () => {
        setPending(true)
      },
      onSettled,
      onSuccess: (hash: WriteContractReturnType) => {
        waitForTransactionReceipt(wagmiConfig, {
          hash,
          pollingInterval: 2_500,

          retryDelay: 2_500,
        })
          .then(() =>
            refetch().then(() => {
              setPending(false)
            })
          )
          .catch(() => setPending(false))
      },
    },
  })

  const approvalState = useMemo(() => {
    if (
      !enabled ||
      amount?.currency.isNative ||
      amount?.currency.equals(Native.onChain(amount.currency.chainId).wrapped)
    ) {
      return ApprovalState.APPROVED
    }

    if (isAllowanceLoading) {
      return ApprovalState.LOADING
    }

    if (pending) {
      return ApprovalState.PENDING
    }

    if (allowance !== undefined && amount?.numerator !== undefined) {
      return allowance >= amount.numerator
        ? ApprovalState.APPROVED
        : ApprovalState.NOT_APPROVED
    }

    return ApprovalState.UNKNOWN
  }, [allowance, amount, enabled, isAllowanceLoading, pending])

  return [approvalState, execute, simulatedData]
}
