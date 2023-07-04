import { AllPairsLength } from "contracts"

import { useEffect, useState } from "react"
import { ContractsEnum } from "@x7/common"
import { useContractReads } from "wagmi"

import { generateWagmiChain } from "@/lib/generateWagmiChain"
import { Pagination } from "@/components/pagination"
import { Table } from "@/components/table"

import { PairRow } from "./row"

const ITEMS_PER_PAGE = 8

export function PairsTable({ chainId }) {
  const [allPairsLength, setAllPairsLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data } = useContractReads({
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
      <div className="-mx-4 sm:-mx-6 md:mx-0">
        <Table
          data={pairsToDisplay}
          columns={[
            {
              header: "Token",
              accessor: "token",
              responsive: false,
              width: "100",
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="token" />
              ),
            },
            {
              header: "Pair Contract",
              accessor: "description",
              responsive: true,
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="description" />
              ),
            },
            {
              header: "Price",
              accessor: "price",
              responsive: true,
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="price" />
              ),
            },
            {
              header: "Pair Reserves",
              accessor: "reserves",
              responsive: true,
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="reserves" />
              ),
            },
            {
              header: "Chart",
              accessor: "chart",
              responsive: true,
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="chart" />
              ),
            },
            {
              header: "Scan",
              accessor: "scan",
              responsive: true,
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="scan" />
              ),
            },
            {
              header: "Trade",
              accessor: "trade",
              responsive: true,
              cellRenderer: (t) => (
                <PairRow id={t} chainId={chainId} type="trade" />
              ),
            },
          ]}
        />
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
