/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useMemo, useState } from "react";
import type { BaseError } from "@wagmi/core";
import { toast } from "sonner";
import { parseEther, UserRejectedRequestError } from "viem";
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import type {
  WriteContractErrorType,
  WriteContractReturnType,
} from "wagmi/actions";
import { waitForTransactionReceipt } from "wagmi/actions";

import { X7LendingPoolV2 } from "@x7/contracts";
import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId } from "@x7/utils";

import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency";
import { useTransactionStore } from "~/lib/providers/tx";
import { useWeb3Config } from "../../providers/web3";

interface UsePayLiabilityParams {
  valueInput: string | undefined;
  loanId: number;
  enabled?: boolean;
}

export const usePayLiability = ({
  valueInput,
  loanId,
}: UsePayLiabilityParams) => {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const chainId = useChainId() as ChainId;
  const { wagmiConfig: config } = useWeb3Config();
  const {
    mutate: { trackTransaction },
  } = useTransactionStore();

  const { data } = useSimulateContract({
    config,
    address: X7ContractsEnum.X7_LendingPool(chainId),
    abi: X7LendingPoolV2,
    functionName: "payLiability",
    value: valueInput ? parseEther(valueInput) : 0n,
    args: [BigInt(loanId)],
  });
  const { symbol } = useNativeCurrency({ chainId });

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message);
        }
      }

      if (hash && valueInput) {
        setIsPending(true);

        trackTransaction({
          txHash: hash,
          type: "payLiability",
          summary: {
            pending: `Paying Liability with ${valueInput} ${symbol.toString()}`,
            completed: `Successfully paid ${valueInput} ${symbol.toString()}`,
            failed: `Something went wrong paying ${valueInput} ${symbol.toString()}`,
          },
        });
      }
    },
    [address, valueInput],
  );

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
            setIsPending(false);
          })
          .catch(() => setIsPending(false));
      },
    },
  });

  return useMemo(() => {
    return {
      ...write,
      isPending,
      data,
    };
  }, [isPending, write]);
};
