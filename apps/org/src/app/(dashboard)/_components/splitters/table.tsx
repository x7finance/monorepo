/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */

/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import type { ChainId } from "@x7/utils"

import { useEffect, useState } from "react"
import { useReadContracts } from "wagmi"

import { X7EcosystemSplitter, X7TreasurySplitterV3 } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import { DEAD_ADDRESS } from "@x7/utils"

import { DashboardSubheader } from "../dashboard-subheader"
import { DonutChart } from "../donutChart/donut-chart"

interface SplittersTableProps {
  chainId: ChainId
}

export function SplittersTable({ chainId }: SplittersTableProps) {
  const [ecoSplit, setEcoSplit] = useState<any>([])
  const [treasurySplit, setTreasurySplit] = useState<any>([])

  const { data: ecosystemData, isFetched: ecosystemFetched } = useReadContracts(
    {
      contracts: [
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          chainId,
          args: [1],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          chainId,
          args: [1],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          chainId,
          args: [2],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          chainId,
          args: [2],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          chainId,
          args: [3],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          chainId,
          args: [3],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          chainId,
          args: [4],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          chainId,
          args: [4],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          chainId,
          args: [5],
        },
        {
          address: X7ContractsEnum.EcosystemSplitter(chainId),
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          chainId,
          args: [5],
        },
      ],
    }
  )

  const { data: treasuryData, isFetched: treasuryFetched } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletShare",
        chainId,
        args: [1],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletRecipient",
        chainId,
        args: [1],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletShare",
        chainId,
        args: [2],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletRecipient",
        chainId,
        args: [2],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletShare",
        chainId,
        args: [3],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletRecipient",
        chainId,
        args: [3],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletShare",
        chainId,
        args: [4],
      },
      {
        address: X7ContractsEnum.TreasurySplitter(chainId),
        abi: X7TreasurySplitterV3,
        functionName: "outletRecipient",
        chainId,
        args: [4],
      },
    ],
  })

  useEffect(() => {
    if (ecosystemFetched) {
      const builtEcoSplitArray = ecosystemData?.reduce(
        (accumulator: any[], _cv, currentIndex) => {
          if (currentIndex % 2 === 0) {
            accumulator.push({
              label: fetchAddressName(
                `${ecosystemData[currentIndex + 1]?.result}`,
                chainId
              ),
              chain: chainId,
              address: ecosystemData[currentIndex + 1],
              value: ecosystemData[currentIndex]
                ? parseInt(
                    `${ecosystemData[currentIndex]?.result?.toString()}`
                  ) / 10
                : 0,
            })
          }

          return accumulator
        },
        []
      )

      setEcoSplit(builtEcoSplitArray)
    }
  }, [ecosystemData, ecosystemFetched])

  useEffect(() => {
    if (treasuryFetched) {
      const builtTreasurySplitArray = treasuryData?.reduce(
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
                `${treasuryData[currentIndex + 1]?.result}`,
                chainId
              ),
              chain: chainId,
              address: treasuryData[currentIndex + 1],
              value:
                parseInt(`${treasuryData[currentIndex]?.result?.toString()}`) /
                1000,
            })
          }

          return accumulator
        },
        []
      )

      setTreasurySplit(builtTreasurySplitArray)
    }
  }, [treasuryData, treasuryFetched])

  return (
    <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2">
      <div className="col-span-1 flex flex-col items-center px-6 lg:px-8">
        <DashboardSubheader
          id="ecosystem-splitter"
          title="Ecosystem Splitter Breakdown"
          description="A percentage of all taxed tokens are sent to the ecosystem
          splitter. This splitter ensures liquidity is spread throughout the
          ecosystem. Below is how the ecosystem allocation is split. This
          allocation can be adjusted by X7 DAO."
        />
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={ecoSplit}
          className="h-auto w-full max-w-xs md:max-w-md"
        />
      </div>
      <div className="col-span-1 flex flex-col items-center px-6 lg:px-8">
        <DashboardSubheader
          id="treasury-splitter"
          title="Treasury Splitter Breakdown"
          description="A percentage of all taxed tokens are sent to the treasury. Below
          is how the treasury allocation is split. This allocation can be
          adjusted by X7 DAO as well as the taxes set for each individual token once the X7 DAO is live."
        />
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={treasurySplit}
          className="h-auto w-full max-w-xs md:max-w-md"
        />
      </div>
    </div>
  )
}

function fetchAddressName(address: string, chainId: ChainId): string {
  const addressMap = {
    [X7ContractsEnum.X7R_LiquidityHub(chainId)]: "X7R",
    [X7ContractsEnum.X7DAO_LiquidityHub(chainId)]: "X7DAO",
    [X7ContractsEnum.X7100_LiquidityHub(chainId)]: "X7 Constellations",
    [X7ContractsEnum.LendingPoolReserve(chainId)]: "Lending Pool",
    [X7ContractsEnum.TreasurySplitter(chainId)]: "Treasury",
    [X7ContractsEnum.CommunityMultiSig]: "Community MultiSig",
    [X7ContractsEnum.UtilityDeployer]: "Utility Deployer",
    [X7ContractsEnum.DAOMultiSig(chainId)]: "DAO MultiSig",
    [X7ContractsEnum.DevelopersMultiSig(chainId)]: "Developers MultiSig",
    [X7ContractsEnum.PioneerRewardPool(chainId)]: "Pioneer Reward Pool",
    [X7ContractsEnum.ProfitSplitter(chainId)]: "Profit Splitter Contract",
    [DEAD_ADDRESS]: "Not Set",
  }

  return addressMap[address] ?? ""
}
