/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Suspense, useEffect, useState } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@x7/ui/pagination"
import { StaticTable } from "@x7/ui/static-table"
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer"
import type { ChainId, LoanType } from "@x7/utils"
import { EmptyPioneer } from "~/lib/components/core/empty-pioneer"
import { LoadingPioneer } from "~/lib/components/core/loading-pioneer"
import { useTotalLoanSupply } from "~/lib/hooks/loans/useXchangeLoanData"
import { useIsComponentReady } from "~/lib/hooks/utils/useIsComponentReady"

import { LoanRow } from "./row"

const ITEMS_PER_PAGE = 8

interface LoanTableProps {
  chainId: ChainId
  loanTypeId: LoanType
}

export function LoansTable(props: LoanTableProps) {
  const { chainId, loanTypeId } = props
  const [loansTotalSupply, setLoansTotalSupply] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const isComponentReady = useIsComponentReady()
  const { totalSupply, isLoading } = useTotalLoanSupply(chainId, loanTypeId)

  useEffect(() => {
    setLoansTotalSupply(totalSupply)
  }, [totalSupply])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const loansToDisplay: any = Array.from(
    { length: loansTotalSupply },
    (_, idx) => loansTotalSupply - idx - 1
  ).slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    const maxPage = Math.ceil(loansTotalSupply / ITEMS_PER_PAGE)
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage))
  }

  return (
    <>
      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          {isLoading ? (
            <div className="mb-96">
              <LoadingPioneer />
            </div>
          ) : totalSupply > 0 ? (
            <>
              <div className="sm:-mx-6 md:mx-0">
                <StaticTable
                  data={loansToDisplay}
                  columns={[
                    {
                      header: "Loan Details",
                      accessor: "description",
                      responsive: true,
                      cellRenderer: (t: any) => (
                        <LoanRow
                          loanType={loanTypeId}
                          id={t}
                          chainId={chainId}
                          type="details"
                        />
                      ),
                    },
                    {
                      header: "Status",
                      accessor: "status",
                      responsive: true,
                      cellRenderer: (t: any) => (
                        <LoanRow
                          loanType={loanTypeId}
                          id={t}
                          chainId={chainId}
                          type="status"
                        />
                      ),
                    },
                    {
                      header: "Loan Amount",
                      accessor: "amount",
                      responsive: true,
                      cellRenderer: (t: any) => (
                        <LoanRow
                          loanType={loanTypeId}
                          id={t}
                          chainId={chainId}
                          type="amount"
                        />
                      ),
                    },
                    {
                      header: "Total Due",
                      accessor: "totalDue",
                      responsive: true,
                      cellRenderer: (t: any) => (
                        <LoanRow
                          loanType={loanTypeId}
                          id={t}
                          chainId={chainId}
                          type="due"
                        />
                      ),
                    },
                    {
                      header: "Loan Initiated",
                      accessor: "startDate",
                      responsive: true,
                      cellRenderer: (t: any) => (
                        <LoanRow
                          loanType={loanTypeId}
                          id={t}
                          chainId={chainId}
                          type="startDate"
                        />
                      ),
                    },
                    {
                      header: "",
                      accessor: "details",
                      responsive: true,
                      cellRenderer: (t: any) => (
                        <LoanRow
                          loanType={loanTypeId}
                          id={t}
                          chainId={chainId}
                          type="more"
                        />
                      ),
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
          ) : (
            <div className="mb-80 text-center">
              <EmptyPioneer
                message="No loans found."
                secondaryMessage="Please adjust your parameters above and try again."
              />
            </div>
          )}
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  )
}
