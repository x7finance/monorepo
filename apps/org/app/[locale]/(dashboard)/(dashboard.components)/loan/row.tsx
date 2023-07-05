"use client"

import Link from "next/link"

import type { BlockchainType, LoanType } from "@x7/common"
import { ChevronRightIcon } from "@x7/icons"
// @ts-expect-error todo: fix this
import { buttonVariants } from "@x7/ui/button"
// @ts-expect-error todo: fix this
import { ContractCopy } from "@x7/ui/copy-buttons"
import {
  cn,
  generateChainDenomination,
  generateChainShortName,
} from "@x7/utils"

import { useXchangeLoanData } from "@/lib/hooks/useXchangeLoanData"
import { IconAlerts } from "./icon-alerts"

interface LoansProps {
  id: number
  chainId: BlockchainType
  loanType: LoanType
  type:
    | "index"
    | "id"
    | "details"
    | "status"
    | "amount"
    | "due"
    | "startDate"
    | "more"
}

export function LoanRow({ id, chainId, type, loanType }: LoansProps) {
  const {
    loanID,
    symbol,
    ownerOf,
    isCompleted,
    loanAmount,
    loanStartTime,
    totalDue,
    loanState,
    fullLoanAddress,
    canLiquidate,
    liquidationAmount,
  } = useXchangeLoanData(id, chainId, loanType)

  switch (type) {
    case "index":
      return (
        <>
          <div className="w-full font-medium text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center">
              <div className="flex items-center">
                <>
                  <span
                    className={`font-medium ${
                      loanState === 1
                        ? "text-green-500 dark:text-green-500"
                        : "text-red-500 dark:text-red-500"
                    } dark:text-zinc-100`}
                  >
                    {loanID ? `${loanID}` : ". . ."}
                  </span>
                  <div className="relative ml-2 inline-block lg:hidden">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-shrink-0 space-x-1">
                        {symbol}
                      </div>
                    </div>
                  </div>
                </>
                <div className="ml-2 lg:hidden">
                  <IconAlerts
                    liquidationAmount={liquidationAmount}
                    canLiquidate={canLiquidate}
                    loanState={loanState}
                  />
                </div>
              </div>
              <div className="ml-auto inline-block lg:hidden">
                {loanID ? (
                  <Link
                    href={`/dashboard/loans/${generateChainShortName(
                      chainId
                    )}/${loanType}/${id}`}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "sm",
                      }),
                      "inline-flex"
                    )}
                  >
                    <span className="flex items-center whitespace-nowrap">
                      <span>View</span>
                      <span>
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-1 flex flex-col text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
            <div className="mt-1 flex flex-col text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
              <span className="flex items-center opacity-70 dark:opacity-50">
                Status : {isCompleted ? "Completed" : "Active"}
              </span>
              <span className="flex items-center opacity-70  dark:opacity-50">
                Total Due : {totalDue}
              </span>
            </div>
          </div>
        </>
      )

    case "id":
      return (
        <div>
          <span>{id}</span>
        </div>
      )
    case "details":
      return (
        <>
          <span>
            Loan Type:{" "}
            <Link
              className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              href={fullLoanAddress}
              target="_blank"
              rel="noopener noreferrer"
            >
              {symbol}
            </Link>
          </span>

          <ContractCopy name="Loan Contract" contract={ownerOf} />
        </>
      )
    case "status":
      return (
        <IconAlerts
          liquidationAmount={liquidationAmount}
          canLiquidate={canLiquidate}
          loanState={loanState}
        />
      )
    case "amount":
      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            {loanAmount}
            <span className="pl-1">{generateChainDenomination(chainId)}</span>
          </div>
        </div>
      )
    case "due":
      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <span>{totalDue.toFixed(6)}</span>
          </div>
        </div>
      )
    case "startDate":
      return (
        <div className="">
          <span>{loanStartTime}</span>
        </div>
      )
    case "more":
      return (
        <div className="float-right pr-4">
          <div className="flex w-full justify-center">
            {loanID ? (
              <Link
                href={`/dashboard/loans/${generateChainShortName(
                  chainId
                )}/${loanType}/${id}`}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                  }),
                  "inline-flex"
                )}
              >
                <span className="flex items-center whitespace-nowrap">
                  <span>View</span>
                  <span>
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      )
  }
}
