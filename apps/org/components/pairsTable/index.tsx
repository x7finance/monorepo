"use client"

import { ContractsEnum } from "common"
import { cn } from "utils"
import { Button } from "ui"
import { AllPairsLength } from "contracts"

import { useEffect, useState } from "react"
import { useContractReads } from "wagmi"

import { generateWagmiChain } from "@/lib/generateWagmiChain"

import { Loading } from "../loading"
import { Pagination } from "../pagination"
import { Pair } from "../pair"

export function LivePairs() {
  const [activeTab, setActiveTab] = useState("ethereum")

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  return (
    <>
      <div className="justify-center p-4 mt-6 overflow-x-auto border rounded-md dark:border-zinc-800 border-zinc-200">
        <div className="md:justify-center flex space-x-4">
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              ` border-zinc-800`,
              `${
                activeTab === "ethereum"
                  ? "text-blue-600 ring-blue-600 ring-1 bg-blue-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleTabChange("ethereum")}
          >
            Ethereum
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              ` border-zinc-800`,
              `${
                activeTab === "binance"
                  ? "text-yellow-600 ring-1 ring-yellow-600 bg-yellow-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleTabChange("binance")}
          >
            Binance
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              ` border-zinc-800`,
              `${
                activeTab === "polygon"
                  ? "text-purple-600 ring-1 ring-purple-600 bg-purple-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleTabChange("polygon")}
          >
            Polygon
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              ` border-zinc-800`,
              `${
                activeTab === "arbitrum"
                  ? "text-blue-600 ring-blue-600 ring-1 bg-blue-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleTabChange("arbitrum")}
          >
            Arbitrum
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              ` border-zinc-800`,
              `${
                activeTab === "optimism"
                  ? "text-red-600 ring-1 ring-red-600 bg-red-600/10"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleTabChange("optimism")}
          >
            Optimism
          </Button>
        </div>
      </div>

      {activeTab === "ethereum" && <PairsTable chainId={1} />}
      {activeTab === "binance" && <PairsTable chainId={56} />}
      {activeTab === "polygon" && <PairsTable chainId={137} />}
      {activeTab === "arbitrum" && <PairsTable chainId={42161} />}
      {activeTab === "optimism" && <PairsTable chainId={10} />}
    </>
  )
}

const ITEMS_PER_PAGE = 8

function PairsTable({ chainId }) {
  const [allPairsLength, setAllPairsLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.XchangeFactory,
        abi: AllPairsLength as any,
        functionName: "allPairsLength",
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const pairsCount = parseInt(data?.[0]?.result?.toString() || "0", 10)

  useEffect(() => {
    setAllPairsLength(pairsCount)
  }, [pairsCount])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const pairsToDisplay = Array.from(
    { length: allPairsLength },
    (_, idx) => allPairsLength - idx - 1
  ).slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    const maxPage = Math.ceil(allPairsLength / ITEMS_PER_PAGE)
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage))
  }

  return (
    <>
      <div className="ring-zinc-900/7.5 -mx-4 mt-6 ring-1 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
        <table className="divide-zinc-900/7.5 min-w-full divide-y dark:divide-white/10">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
              >
                Token
              </th>

              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Pair Contract
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Price
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Pair Reserves
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Chart
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Scan
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingLivePair />
            ) : pairsToDisplay.length > 0 ? (
              pairsToDisplay.map((pairId) => (
                <Pair
                  key={`${pairId}-${chainId}`}
                  id={pairId}
                  chainId={chainId}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No pairs created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        {...{
          currentPage,
          pageLength: allPairsLength,
          itemsPerPage: ITEMS_PER_PAGE,
          goToPreviousPage,
          goToNextPage,
        }}
      />
    </>
  )
}

function LoadingLivePair() {
  return (
    <tr>
      <td colSpan={4} className="py-4 text-center">
        <Loading size={12} />
      </td>
    </tr>
  )
}
