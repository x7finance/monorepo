/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useCallback, useMemo, useState } from "react";
import type { BaseError } from "@wagmi/core";
import { toast } from "sonner";
import { UserRejectedRequestError } from "viem";
import type { Address } from "viem";
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

import { useTransactionStore } from "~/lib/providers/tx";
import { useWeb3Config } from "~/lib/providers/web3";

interface UseGetInitialLiquidityLoanParams {
  payableAmount: string | undefined;
  tokenAddress: Address;
  amount: string | undefined;
  loanTermContractAddress: `0x${string}`;
  loanAmount: bigint;
  loanDuration: bigint;
  liquidityReceiverAddress: `0x${string}`;
  deadline: bigint;
  enabled?: boolean;
}

export const useGetInitialLiquidityLoan = ({
  payableAmount,
  tokenAddress,
  amount,
  loanTermContractAddress,
  loanAmount,
  loanDuration,
  liquidityReceiverAddress,
  deadline,
}: UseGetInitialLiquidityLoanParams) => {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const chainId = useChainId() as ChainId;
  const { wagmiConfig: config } = useWeb3Config();
  const {
    mutate: { trackTransaction },
  } = useTransactionStore();

  const { data } = useSimulateContract({
    query: {
      enabled: Boolean(
        address &&
          chainId &&
          payableAmount &&
          !!tokenAddress &&
          !!amount &&
          !isNaN(Number(amount)) && // Ensure amount is a number
          Number(amount) > 0 &&
          !!loanTermContractAddress &&
          loanAmount &&
          loanDuration &&
          !!liquidityReceiverAddress &&
          deadline,
      ),
    },
    config,
    address: X7ContractsEnum.X7_LendingPool(chainId),
    abi: X7LendingPoolV2,
    functionName: "getInitialLiquidityLoan",
    value: payableAmount ? BigInt(payableAmount) : 0n,
    account: address,
    args: [
      tokenAddress,
      amount && amount !== "0.0" && !isNaN(Number(amount)) && Number(amount) > 0
        ? BigInt(amount)
        : 0n,
      loanTermContractAddress,
      loanAmount ? BigInt(loanAmount.toString()) : 0n,
      loanDuration,
      liquidityReceiverAddress,
      deadline,
    ],
  });

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message);
        }
      }

      if (hash && payableAmount) {
        setIsPending(true);

        trackTransaction({
          txHash: hash,
          type: "getLoan",
          summary: {
            pending: `Creating your loan for ${tokenAddress}`,
            completed: `Successfully issued your loan for ${tokenAddress}`,
            failed: `Something went wrong creating your loan for ${tokenAddress}`,
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, payableAmount],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, write]);
};
