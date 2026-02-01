import type { ChainId } from "@x7/utils"

import { useBalance, useReadContracts } from "wagmi"

import { X7LendingPoolV2 } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"

import { useLendingPoolData } from "./useLendingPoolData"

export function useLendingPoolPrettyData(chainId: ChainId) {
  const lendingPoolContractAddress = X7ContractsEnum.X7_LendingPool(chainId)

  const { data: poolBalanceData } = useBalance({
    address: lendingPoolContractAddress,
    chainId,
  })

  const { data: reserveBalanceData } = useBalance({
    address: X7ContractsEnum.LendingPoolReserve(chainId),
    chainId,
  })

  const { data: readContractData } = useReadContracts({
    contracts: [
      {
        address: lendingPoolContractAddress,
        abi: X7LendingPoolV2,
        functionName: "nextLoanID",
        chainId,
      },
      {
        address: lendingPoolContractAddress,
        abi: X7LendingPoolV2,
        functionName: "liquidationEscrow",
        chainId,
      },
      {
        address: lendingPoolContractAddress,
        abi: X7LendingPoolV2,
        functionName: "availableCapital",
        chainId,
      },
      {
        address: lendingPoolContractAddress,
        abi: X7LendingPoolV2,
        functionName: "liquidationReward",
        chainId,
      },
    ],
  })

  const { statusData, splitData, utilizedData } = useLendingPoolData(
    chainId,
    poolBalanceData,
    reserveBalanceData,
    readContractData,
    lendingPoolContractAddress
  )

  return {
    poolBalanceData,
    reserveBalanceData,
    readContractData,
    statusData,
    splitData,
    utilizedData,
  }
}
