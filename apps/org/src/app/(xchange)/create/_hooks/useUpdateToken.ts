import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { UserRejectedRequestError } from "viem";
import { useWriteContract } from "wagmi";
import type { WriteContractErrorType, WriteContractReturnType } from "wagmi/actions";
import { waitForTransactionReceipt } from "wagmi/actions";

import { XchangeTokenAbi } from "@x7/contracts";
import { useTransactionStore } from "~/lib/providers/tx";
import { useWeb3Config } from "~/lib/providers/web3";

export const useUpdateToken = (contractAddress: `0x${string}`) => {
  const [isPending, setIsPending] = useState(false);
  const { wagmiConfig: config } = useWeb3Config();
  const { mutate: { trackTransaction } } = useTransactionStore();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSettled: (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
        if (e instanceof Error && !(e instanceof UserRejectedRequestError)) {
          toast.error(e.message);
          setIsPending(false);
          return;
        }

        if (hash) {
          trackTransaction({
            txHash: hash,
            type: "updateToken",
            summary: {
              pending: `Executing transaction...`,
              completed: `Transaction executed successfully`,
              failed: `Transaction failed`,
            },
          });
        }
      },
      onSuccess: async (hash: WriteContractReturnType) => {
        try {
          await waitForTransactionReceipt(config, {
            hash,
            pollingInterval: 2500,
            retryDelay: 2500,
          });
        } finally {
          setIsPending(false);
        }
      },
    },
  });

  const executeContract = useCallback(
    async (functionName: string, args: unknown[] = []) => {
      try {
        setIsPending(true);

        await writeContractAsync({
          address: contractAddress,
          abi: XchangeTokenAbi,
          functionName,
          args,
        });
      } catch {
        setIsPending(false);
      }
    },
    [contractAddress, writeContractAsync]
  );

  return useMemo(() => ({ executeContract, isPending }), [executeContract, isPending]);
};
