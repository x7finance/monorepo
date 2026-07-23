/* oxlint-disable @typescript-eslint/no-base-to-string */
import type { Address } from "viem"
import { useReadContracts } from "wagmi"

import { XchangeTokenList } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import type { ChainId } from "@x7/utils"
import { getChainInfo } from "~/lib/constants/chainInfo"

export function useRegisteredTokens(
  chainId: ChainId,
  registeredToken: Address
) {
  const { data, isLoading: isInitialRegisteredTokens } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.TokenList,
        abi: XchangeTokenList,
        functionName: "registeredTokens",
        args: [registeredToken],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialRegisteredTokens,
    registeredToken: data?.[0]?.result as boolean,
  }
}

export function useFee(chainId: ChainId) {
  const { data, isLoading: isInitialFee } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.TokenList,
        abi: XchangeTokenList,
        functionName: "fee",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialFee,
    fee: BigInt(data?.[0]?.result?.toString() ?? "0"),
    feeDecimal: data?.[0]?.result
      ? // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
        parseInt(data[0].result.toString() ?? "0", 10) /
        10 ** getChainInfo(chainId).nativeCurrency.decimals
      : 0,
  }
}
