/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react"
import { useReadContracts } from "wagmi"

import { AllPairsLength } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@x7/ui/pagination"
import { StaticTable } from "@x7/ui/static-table"
import type { ChainId } from "@x7/utils"

import { PairRow } from "./row"

interface PairsTableProps {
  chainId: ChainId
}

const ITEMS_PER_PAGE = 8

export function PairsTable({ chainId }: PairsTableProps) {
  const [allPairsLength, setAllPairsLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.XchangeFactory,
        abi: AllPairsLength,
        functionName: "allPairsLength",
        chainId,
      },
    ],
  })

  const pairsCount = parseInt(data?.[0]?.result?.toString() ?? "0", 10)

  useEffect(() => {
    setAllPairsLength(pairsCount)
  }, [pairsCount])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const pairsToDisplay: number[] = Array.from(
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
      <div className="sm:-mx-6 md:mx-0">
        <StaticTable
          data={pairsToDisplay}
          columns={[
            {
              header: "Token",
              accessor: "token",
              responsive: false,
              width: "100",
              cellRenderer: (t: any) => <PairRow id={t} type="token" />,
            },
            {
              header: "Pair Contract",
              accessor: "description",
              responsive: true,
              cellRenderer: (t: any) => <PairRow id={t} type="description" />,
            },
            {
              header: "Price",
              accessor: "price",
              responsive: true,
              cellRenderer: (t: any) => <PairRow id={t} type="price" />,
            },
            {
              header: "Pair Reserves",
              accessor: "reserves",
              responsive: true,
              cellRenderer: (t: any) => <PairRow id={t} type="reserves" />,
            },
            {
              header: "Chart",
              accessor: "chart",
              responsive: true,
              cellRenderer: (t: any) => <PairRow id={t} type="chart" />,
            },
            {
              header: "Scan",
              accessor: "scan",
              responsive: true,
              cellRenderer: (t: any) => <PairRow id={t} type="scan" />,
            },
            {
              header: "Trade",
              accessor: "trade",
              responsive: true,
              cellRenderer: (t: any) => <PairRow id={t} type="trade" />,
            },
          ]}
        />

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={goToPreviousPage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={goToNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
