import type { Address } from "viem";
import { useReadContracts } from "wagmi";

import { PairsAbi } from "@x7/contracts";
import type { ChainId } from "@x7/utils";

export function useGetReserves(chainId: ChainId, pairAddress: Address) {
  const { data, isLoading: isInitialGetReserves } = useReadContracts({
    contracts: [
      {
        address: pairAddress,
        abi: PairsAbi,
        functionName: "getReserves",
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialGetReserves,
    getReserves: data?.[0]?.result as [bigint, bigint, number] | undefined,
  };
}
