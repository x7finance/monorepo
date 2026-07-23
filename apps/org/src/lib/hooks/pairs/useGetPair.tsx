import type { Address } from "viem"
import { useReadContracts } from "wagmi"

import { XchangeFactory } from "@x7/contracts"
import type { ChainId } from "@x7/utils"

export function useGetPair(
  chainId: ChainId,
  factoryAddress: Address,
  tokenA: Address,
  tokenB: Address
) {
  const { data, isLoading: isInitialGetPair } = useReadContracts({
    contracts: [
      {
        address: factoryAddress,
        abi: XchangeFactory,
        functionName: "getPair",
        args: [tokenA, tokenB],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetPair,
    getPair: data?.[0]?.result as `0x${string}`,
  }
}
