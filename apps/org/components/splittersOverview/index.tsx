"use client"

import { useEffect, useState } from "react"
import { ContractsEnum } from "common"
import { X7EcosystemSplitter, X7TreasurySplitterV2 } from "contracts"
import { useContractReads } from "wagmi"

import { DonutChart } from "../donutChart/DonutChart"

export function SplittersOverview() {
  const [ecoSplit, setEcoSplit] = useState<any>([])
  const [treasurySplit, setTreasurySplit] = useState<any>([])

  const { data: ecosystemData, isFetched: ecosystemFetched } = useContractReads(
    {
      contracts: [
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          args: [1],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          args: [1],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter as any,
          functionName: "outletShare",
          args: [2],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          args: [2],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          args: [3],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          args: [3],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          args: [4],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          args: [4],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletShare",
          args: [5],
        },
        {
          address: ContractsEnum.EcosystemSplitter,
          abi: X7EcosystemSplitter,
          functionName: "outletRecipient",
          args: [5],
        },
      ],
    }
  )

  const { data: treasuryData, isFetched: treasuryFetched } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2 as any,
        functionName: "outletShare",
        args: [1],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [1],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [2],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [2],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [3],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [3],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [4],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [4],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [5],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [5],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [6],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [6],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [7],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [7],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [8],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [8],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [9],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [9],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletShare",
        args: [10],
      },
      {
        address: ContractsEnum.TreasurySplitter,
        abi: X7TreasurySplitterV2,
        functionName: "outletRecipient",
        args: [10],
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
                `${ecosystemData?.[currentIndex + 1]?.result}`
              ),
              address: ecosystemData?.[currentIndex + 1],
              value: ecosystemData?.[currentIndex]
                ? parseInt(
                    `${ecosystemData?.[currentIndex]?.result?.toString()}`
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
        (accumulator: any[], _cv, currentIndex) => {
          if (currentIndex % 2 === 0) {
            accumulator.push({
              label: fetchAddressName(
                `${treasuryData?.[currentIndex + 1]?.result}`
              ),
              address: treasuryData?.[currentIndex + 1],
              value:
                parseInt(
                  `${treasuryData?.[currentIndex]?.result?.toString()}`
                ) / 1000 ?? 0,
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
    <>
      <div className="col-span-1 px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-xl text-slate-900 dark:text-slate-100">
              Treasury Splitter Breakdown
            </h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 xl:min-h-[150px]">
              A percentage of all taxed tokens are sent to the treasury. Below
              is how the treasury allocation is split. This allocation can be
              adjusted by X7 DAO.
            </p>
          </div>
        </div>
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={treasurySplit}
        />
      </div>
      <div className="col-span-1 px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-xl text-slate-900 dark:text-slate-100">
              Ecosystem Splitter Breakdown
            </h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 xl:min-h-[150px]">
              A percentage of all taxed tokens are sent to the ecosystem
              splitter. This splitter ensures liquidity is spread throughout the
              ecosystem. Below is how the ecosystem allocation is split. This
              allocation can be adjusted by X7 DAO.
            </p>
          </div>
        </div>
        <DonutChart
          height={300}
          innerRadius={0.5}
          width={300}
          data={ecoSplit}
        />
      </div>
    </>
  )
}

function fetchAddressName(address: string) {
  switch (address) {
    case ContractsEnum.X7R_LiquidityHub:
      return "X7R"
    case ContractsEnum.X7DAO_LiquidityHub:
      return "X7DAO"
    case ContractsEnum.X7100_LiquidityHub:
      return "X7 Constellations"
    case ContractsEnum.LendingPoolReserve:
      return "Lending Pool"
    case ContractsEnum.TreasurySplitter:
      return "Treasury"

    case ContractsEnum.FoundDev1:
    case ContractsEnum.FoundDev1Optimism:
    case ContractsEnum.FoundDev1Matic:
    case ContractsEnum.FoundDev1BSC:
    case ContractsEnum.FoundDev1Arbitrum:
      return "Founding X7 Dev 1"
    case ContractsEnum.FoundDev2:
      return "Founding X7 Dev 2"
    case ContractsEnum.FoundDev3:
      return "Founding X7 Dev 3"
    case ContractsEnum.FoundDev4:
      return "Founding X7 Dev 4"
    case ContractsEnum.FoundDev5:
      return "Founding X7 Dev 5"

    case ContractsEnum.FoundDev6:
    case ContractsEnum.FoundDev6Matic:
      return "Founding X7 Dev 6"
    case ContractsEnum.FoundDev7:
      return "Founding X7 Dev 7"
    case ContractsEnum.CommunityMultiSig:
      return "Community MultiSig"
    case ContractsEnum.DevelopersMultiSig:
      return "Developers MultiSig"
    case ContractsEnum.PioneerRewardPool:
      return "Pioneer Reward Pool"

    case ContractsEnum.X7RInitialLiquidityTimeLock:
      return "X7R Initial Liquidity TimeLock"
    case ContractsEnum.X7DAOInitialLiquidityTimeLock:
      return "X7DAO Initial Liquidity TimeLock"
    case ContractsEnum.X7100InitialLiquidityTimeLock:
      return "X7 Constellations Initial Liquidity TimeLock"
    case ContractsEnum.deadAddress:
      return "deadAddress"

    default:
      return ""
  }
}
