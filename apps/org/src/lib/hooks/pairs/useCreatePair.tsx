/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useCallback, useMemo, useState } from "react";
import type { BaseError } from "@wagmi/core";
import { toast } from "sonner";
import { UserRejectedRequestError } from "viem";
import type { Address } from "viem";
import { useAccount, useSimulateContract, useWriteContract } from "wagmi";
import type {
  WriteContractErrorType,
  WriteContractReturnType,
} from "wagmi/actions";
import { waitForTransactionReceipt } from "wagmi/actions";

import { XchangeFactory } from "@x7/contracts";

import { useTransactionStore } from "~/lib/providers/tx";
import { useWeb3Config } from "../../providers/web3";

interface UseCreatePairParams {
  tokenA: Address;
  tokenB: Address;
  factoryAddress: Address;
  enabled?: boolean;
}

export const useCreatePair = ({
  tokenA,
  tokenB,
  factoryAddress,
}: UseCreatePairParams) => {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const {
    mutate: { trackTransaction },
  } = useTransactionStore();
  const { wagmiConfig: config } = useWeb3Config();

  const { data } = useSimulateContract({
    config,
    address: factoryAddress,
    abi: XchangeFactory,
    functionName: "createPair",
    args: [tokenA, tokenB],
  });

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message);
        }
      }

      if (hash && tokenA && tokenB) {
        setIsPending(true);

        trackTransaction({
          txHash: hash,
          type: "createPair",
          summary: {
            pending: `Creating a pair for ${tokenA} and ${tokenB}`,
            completed: `Successfully created a pair for ${tokenA} and ${tokenB}`,
            failed: `Something went wrong creating a pair for ${tokenA} and ${tokenB}`,
          },
        });
      }
    },
    [address, tokenA, tokenB],
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
