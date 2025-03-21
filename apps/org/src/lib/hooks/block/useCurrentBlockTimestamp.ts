"use client";

import { useReadContract } from "wagmi";

import { getMulticall3ContractConfig } from "../contracts/useMulticall3Contract";

export const useCurrentBlockTimestamp = (
  chainId: number | undefined,
  enabled = true,
) => {
  return useReadContract({
    ...getMulticall3ContractConfig(chainId),
    functionName: "getCurrentBlockTimestamp",
    query: {
      enabled,
    },
  });
};
