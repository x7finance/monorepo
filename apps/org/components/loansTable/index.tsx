"use client"

import { ContractsEnum } from "common"
import { cn } from "utils"
import { Button } from "ui-server"
import { X7InitialLiquidityLoanTerm001 } from "contracts"

import { useEffect, useState } from "react"
import { useContractReads } from "wagmi"

import { generateWagmiChain } from "@/lib/generateWagmiChain"

import { Loading } from "../loading"
import { Loan } from "../loan"
import { Pagination } from "../pagination"

export function LiveLoans() {
  const [activeTab, setActiveTab] = useState("ethereum")
  const [activeLoanTab, setActiveLoanTab] = useState("001")

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }
  const handleLoanTabChange = (tabId) => {
    setActiveLoanTab(tabId)
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
                  ? "text-red-600 ring-1 ring-red-600 bg-red-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleTabChange("optimism")}
          >
            Optimism
          </Button>
        </div>
      </div>
      <div className="justify-center p-4 mt-6 overflow-x-auto border rounded-md dark:border-zinc-800 border-zinc-200">
        <div className="md:justify-center flex space-x-4">
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              `border-zinc-800`,
              `${
                activeLoanTab === "001"
                  ? "text-blue-600 ring-blue-600 ring-1 bg-blue-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleLoanTabChange("001")}
          >
            001 - Simple
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              `border-zinc-800`,
              `${
                activeLoanTab === "002"
                  ? "text-yellow-600 ring-1 ring-yellow-600 bg-yellow-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleLoanTabChange("002")}
          >
            002 - Amortizing
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              `border-zinc-800`,
              `${
                activeLoanTab === "003"
                  ? "text-purple-600 ring-1 ring-purple-600 bg-purple-600/5"
                  : "text-zinc-500"
              }`
            )}
            onClick={() => handleLoanTabChange("003")}
          >
            003 - Interest
          </Button>
        </div>
      </div>

      {activeTab === "ethereum" && (
        <LoansTable chainId={1} loanId={activeLoanTab} />
      )}
      {activeTab === "binance" && (
        <LoansTable chainId={56} loanId={activeLoanTab} />
      )}
      {activeTab === "polygon" && (
        <LoansTable chainId={137} loanId={activeLoanTab} />
      )}
      {activeTab === "arbitrum" && (
        <LoansTable chainId={42161} loanId={activeLoanTab} />
      )}
      {activeTab === "optimism" && (
        <LoansTable chainId={10} loanId={activeLoanTab} />
      )}
    </>
  )
}

function LoansTable({ chainId, loanId }) {
  const [loansTotalSupply, setLoansTotalSupply] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const loansPerPage = 8

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.X7InitialLiquidityLoanTerm001,
        abi: X7InitialLiquidityLoanTerm001 as any,
        functionName: "totalSupply",
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const totalSupply = parseInt(data?.[0]?.result?.toString() || "0", 10)

  useEffect(() => {
    setLoansTotalSupply(totalSupply)
  }, [totalSupply])

  const startIndex = (currentPage - 1) * loansPerPage
  const endIndex = startIndex + loansPerPage

  const pairsToDisplay = Array.from(
    { length: loansTotalSupply },
    (_, idx) => loansTotalSupply - idx - 1
  ).slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    const maxPage = Math.ceil(loansTotalSupply / loansPerPage)
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
                Index / ID
              </th>

              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Contract Details
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell text-center"
              >
                Status
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Loan Amount
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Total Due
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
              >
                Start Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingState />
            ) : pairsToDisplay.length > 0 ? (
              pairsToDisplay.map((pairId) => (
                <Loan
                  key={`${pairId}-${chainId}`}
                  id={pairId}
                  chainId={chainId}
                  loanType={loanId}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No loans created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        {...{
          currentPage,
          pageLength: loansTotalSupply,

          goToPreviousPage,
          goToNextPage,
        }}
      />
    </>
  )
}

function LoadingState() {
  return (
    <tr>
      <td colSpan={6} className="py-4 text-center">
        <Loading size={12} />
      </td>
    </tr>
  )
}
