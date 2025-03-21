/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useCallback, useMemo, useState } from "react";
import type { BaseError } from "@wagmi/core";
import { toast } from "sonner";
import { UserRejectedRequestError } from "viem";
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

import { X7Pioneer } from "@x7/contracts";
import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId } from "@x7/utils";

import { useTransactionStore } from "~/lib/providers/tx";
import { useWeb3Config } from "../../providers/web3";

interface UsePioneerClaimParams {
  pioneerIds: number | number[];
  enabled?: boolean;
}

export const usePioneerClaim = ({ pioneerIds }: UsePioneerClaimParams) => {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const chainId = useChainId() as ChainId;
  const { wagmiConfig: config } = useWeb3Config();

  const {
    mutate: { trackTransaction },
  } = useTransactionStore();

  const { data } = useSimulateContract({
    config,
    address: X7ContractsEnum.PioneerRewardPool(chainId),
    abi: X7Pioneer,
    functionName: "claimRewards",
    args: [pioneerIds],
  });

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message);
        }
      }

      if (hash && pioneerIds) {
        setIsPending(true);

        trackTransaction({
          txHash: hash,
          type: "claim",
          summary: {
            pending: `Claiming Rewards`,
            completed: `Successfully claimed`,
            failed: `Something went wrong claiming`,
          },
        });
      }
    },
    [address, pioneerIds],
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
