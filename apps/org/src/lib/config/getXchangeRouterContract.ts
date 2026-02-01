import type { ChainId } from "@x7/utils"

import { XchangeRouterAbi } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"

export const getXchangeRouterContractConfig = (chainId: ChainId) => ({
  address: X7ContractsEnum.XchangeRouter(chainId),
  abi: XchangeRouterAbi,
})
