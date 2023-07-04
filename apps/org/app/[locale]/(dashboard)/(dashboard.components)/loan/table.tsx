"use client"

import { X7InitialLiquidityLoanTerm001 } from "contracts"

import { useEffect, useState } from "react"
import { BlockchainType, ContractsEnum, LoanType } from "@x7/common"
import { generateX7InitialLiquidityLoanTermContract } from "@x7/utils"
import { useContractReads } from "wagmi"

import { generateWagmiChain } from "@/lib/generateWagmiChain"
import { Pagination } from "@/components/pagination"
import { Table } from "@/components/table"

import { LoanRow } from "./row"

const ITEMS_PER_PAGE = 8

interface LoanTableProps {
  chainId: BlockchainType
  loanTypeId: LoanType
}

export function LoansTable(props: LoanTableProps) {
  const { chainId, loanTypeId } = props
  const [loansTotalSupply, setLoansTotalSupply] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data } = useContractReads({
    contracts: [
      {
        address: generateX7InitialLiquidityLoanTermContract(loanTypeId),
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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const loansToDisplay = Array.from(
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
      <div className="-mx-4 sm:-mx-6 md:mx-0">
        <Table
          data={loansToDisplay}
          columns={[
            {
              header: "Index",
              responsiveHeader: "Details",
              accessor: "index",
              responsive: false,
              width: "50",
              cellRenderer: (t) => (
                <LoanRow
                  loanType={loanTypeId}
                  id={t}
                  chainId={chainId}
                  type="index"
                />
              ),
            },
            {
              header: "ID",
              accessor: "id",
              responsive: true,
              cellRenderer: (t) => (
                <LoanRow
                  loanType={loanTypeId}
                  id={t}
                  chainId={chainId}
                  type="id"
                />
              ),
            },
            {
              header: "Loan Details",
              accessor: "description",
              responsive: true,
              cellRenderer: (t) => (
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
              cellRenderer: (t) => (
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
              cellRenderer: (t) => (
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
              cellRenderer: (t) => (
                <LoanRow
                  loanType={loanTypeId}
                  id={t}
                  chainId={chainId}
                  type="due"
                />
              ),
            },
            {
              header: "Start Date",
              accessor: "startDate",
              responsive: true,
              cellRenderer: (t) => (
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
              cellRenderer: (t) => (
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
      </div>
      <Pagination
        {...{
          currentPage,
          pageLength: loansTotalSupply,
          itemsPerPage: ITEMS_PER_PAGE,
          goToPreviousPage,
          goToNextPage,
        }}
      />
    </>
  )
}
