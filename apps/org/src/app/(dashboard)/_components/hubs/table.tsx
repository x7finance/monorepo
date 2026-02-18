/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-return */

/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { formatEther } from "viem"
import { useReadContracts } from "wagmi"

import {
  X7DAOLiquidityHub,
  X7RLiquidityHub,
  X7100LiquidityHub,
} from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import type { ChainId } from "@x7/utils"
import { DEAD_ADDRESS, generateChainDenomination } from "@x7/utils"

import { DashboardSubheader } from "../dashboard-subheader"
import { DonutChart } from "../donutChart/donut-chart"

interface SplittersTableProps {
  chainId: ChainId
}

export function HubsTable({ chainId }: SplittersTableProps) {
  const [x7daoSplit, setX7daoSplit] = useState<any>([])
  const [x7rSplit, setX7rSplit] = useState<any>([])
  const [x7100Split, setX7100Split] = useState<any>([])
  const [x7daoAuxiliary, setX7daoAuxiliary] = useState<any>([])
  const [x7daoBalanceThreshold, setX7daoBalanceThreshold] = useState<any>([])
  const [x7rBalanceThreshold, setX7rBalanceThreshold] = useState<any>([])
  const [x7100BalanceThreshold, setX7100BalanceThreshold] = useState<any>([])
  const [x7daoLiquidityRatio, setX7daoLiquidityRatio] = useState<any>([])
  const [x7rLiquidityRatio, setX7rLiquidityRatio] = useState<any>([])
  const [x7100LiquidityRatio, setX7100LiquidityRatio] = useState<any>([])

  const { data: x7daoData, isFetched: x7daoFetched } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "auxiliaryShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "auxiliaryTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "distributeShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "distributeTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "liquidityShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "liquidityTokenReceiver",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "treasuryShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "treasuryTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "balanceThreshold",
        chainId,
      },
      {
        address: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
        abi: X7DAOLiquidityHub,
        functionName: "liquidityRatioTarget",
        chainId,
      },
    ],
  })

  const { data: x7rData, isFetched: x7rFetched } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "distributeShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "distributeTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "liquidityShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "liquidityTokenReceiver",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "treasuryShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "treasuryTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "balanceThreshold",
        chainId,
      },
      {
        address: X7ContractsEnum.X7R_LiquidityHub(chainId),
        abi: X7RLiquidityHub,
        functionName: "liquidityRatioTarget",
        chainId,
      },
    ],
  })

  const { data: x7100Data, isFetched: x7100Fetched } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "lendingPoolShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "lendingPoolTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "distributeShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "distributeTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "liquidityShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "liquidityTokenReceiver",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "treasuryShare",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "treasuryTarget",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "balanceThreshold",
        chainId,
      },
      {
        address: X7ContractsEnum.X7100_LiquidityHub(chainId),
        abi: X7100LiquidityHub,
        functionName: "liquidityRatioTarget",
        chainId,
      },
    ],
  })

  useEffect(() => {
    if (x7daoFetched) {
      const x7daoBalanceThreshold = formatEther(
        (x7daoData?.[8].result as bigint) ?? BigInt(0)
      )
      const X7daoAuxiliary = x7daoData?.[1].result ?? "N/A"
      const x7daoLiquidityRatio = (() => {
        const result = x7daoData?.[9]?.result
        return typeof result === "number" ? result * 10 : 0
      })()
      const builtX7daoSplitArray = x7daoData
        ?.slice(0, 8)
        .reduce((accumulator: any[], _cv, currentIndex) => {
          if (currentIndex % 2 === 0) {
            accumulator.push({
              label: fetchAddressName(
                `${x7daoData[currentIndex + 1]?.result}`,
                chainId
              ),
              chain: chainId,
              address: x7daoData[currentIndex + 1],
              value: x7daoData[currentIndex]
                ? parseInt(`${x7daoData[currentIndex]?.result?.toString()}`) /
                  10
                : 0,
            })
          }

          return accumulator
        }, [])

      setX7daoSplit(builtX7daoSplitArray)
      setX7daoAuxiliary(X7daoAuxiliary)
      setX7daoBalanceThreshold(x7daoBalanceThreshold)
      setX7daoLiquidityRatio(x7daoLiquidityRatio)
    }
  }, [x7daoData, x7daoFetched])

  useEffect(() => {
    if (x7rFetched) {
      const x7rBalanceThreshold = formatEther(
        (x7rData?.[6].result as bigint) ?? BigInt(0)
      )
      const x7rLiquidityRatio = (() => {
        const result = x7rData?.[7]?.result
        return typeof result === "number" ? result * 10 : 0
      })()
      const builtX7rSplitArray = x7rData?.slice(0, 6).reduce(
        (
          accumulator: {
            label: string
            chain: any
            address: any
            value: number
          }[],
          _cv,
          currentIndex
        ) => {
          if (currentIndex % 2 === 0) {
            accumulator.push({
              label: fetchAddressName(
                `${x7rData[currentIndex + 1]?.result}`,
                chainId
              ),
              chain: chainId,
              address: x7rData[currentIndex + 1],
              value:
                parseInt(`${x7rData[currentIndex]?.result?.toString()}`) / 10,
            })
          }

          return accumulator
        },
        []
      )

      setX7rSplit(builtX7rSplitArray)
      setX7rBalanceThreshold(x7rBalanceThreshold)
      setX7rLiquidityRatio(x7rLiquidityRatio)
    }
  }, [x7rData, x7rFetched])

  useEffect(() => {
    if (x7100Fetched) {
      const x7100BalanceThreshold = formatEther(
        (x7100Data?.[8].result as bigint) ?? BigInt(0)
      )
      const x7100LiquidityRatio = (() => {
        const result = x7100Data?.[9]?.result
        return typeof result === "number" ? result * 10 : 0
      })()
      const builtX7100SplitArray = x7100Data
        ?.slice(0, 8)
        .reduce((accumulator: any[], _cv, currentIndex) => {
          if (currentIndex % 2 === 0) {
            accumulator.push({
              label: fetchAddressName(
                `${x7100Data[currentIndex + 1]?.result}`,
                chainId
              ),
              chain: chainId,
              address: x7100Data[currentIndex + 1],
              value: x7100Data[currentIndex]
                ? parseInt(`${x7100Data[currentIndex]?.result?.toString()}`) /
                  10
                : 0,
            })
          }

          return accumulator
        }, [])

      setX7100Split(builtX7100SplitArray)
      setX7100BalanceThreshold(x7100BalanceThreshold)
      setX7100LiquidityRatio(x7100LiquidityRatio)
    }
  }, [x7100Data, x7100Fetched])

  return (
    <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2">
      <div className="col-span-1 flex flex-col items-center px-6 lg:px-8">
        <DashboardSubheader
          id="x7dao-hub"
          title="X7DAO Liquidity Hub"
          description={`The X7DAO Liquidity Hub splits liquidity 4 ways.
        It currently has a ${x7daoLiquidityRatio}% target liquidity ratio and a ${x7daoBalanceThreshold} ${generateChainDenomination(chainId)} balance threshold.
        The Auxiliary slot is controlled by the DAO and is currently set to the ${fetchAddressName(x7daoAuxiliary, chainId)}`}
        />
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={x7daoSplit}
          className="h-auto w-full max-w-xs md:max-w-md"
        />
      </div>
      <div className="col-span-1 flex flex-col items-center px-6 lg:px-8">
        <DashboardSubheader
          id="x7r-hub"
          title="X7R Liquidity Hub"
          description={`The X7R Liquidity Hub distributes liquidity 3 ways.
          It currently has a ${x7rLiquidityRatio}% target liquidity ratio and a ${x7rBalanceThreshold} ${generateChainDenomination(chainId)} balance threshold`}
        />
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={x7rSplit}
          className="h-auto w-full max-w-xs md:max-w-md"
        />
      </div>
      <div className="col-span-1 flex flex-col items-center px-6 lg:px-8">
        <DashboardSubheader
          id="x7100-hub"
          title="X7100 Liquidity Hub"
          description={`Like the X7DAO liquidity Hub, the X7100 Liquidity Hub splits liquidity 4 ways, this time the extra slot is allocated to the X7 Finance Lending Pool.
          It currently has a ${x7100LiquidityRatio}% target liquidity ratio and a ${x7100BalanceThreshold} ${generateChainDenomination(chainId)} balance threshold`}
        />
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={x7100Split}
          className="h-auto w-full max-w-xs md:max-w-md"
        />
      </div>
    </div>
  )
}

function fetchAddressName(address: string, chainId: ChainId): string {
  if (address === X7ContractsEnum.LendingPoolReserve(chainId)) {
    return "Lending Pool"
  } else if (address === X7ContractsEnum.TreasurySplitter(chainId)) {
    return "Treasury"
  } else if (address === X7ContractsEnum.EcosystemSplitter(chainId)) {
    return "Ecosystem Splitter"
  } else if (address === X7ContractsEnum.TokenTimeLock(chainId)) {
    return "Token Time Locker"
  } else if (address === X7ContractsEnum.TokenBurner(chainId)) {
    return "Token Burner"
  } else if (address === X7ContractsEnum.UtilityDeployer) {
    return "Utility Deployer"
  } else if (address === DEAD_ADDRESS) {
    return "Not Set"
  } else {
    return ""
  }
}
