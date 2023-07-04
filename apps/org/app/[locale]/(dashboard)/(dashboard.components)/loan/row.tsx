"use client"

import Link from "next/link"
import { BlockchainType, LoanType } from "@x7/common"
import {
  AlertCircle,
  CheckCircleIcon,
  ChevronRightIcon,
  FlagIcon,
  XCircleIcon,
} from "@x7/icons"
import {
  cn,
  generateChainBase,
  generateChainDenomination,
  generateChainShortName,
  generateX7InitialLiquidityLoanTermContract,
} from "@x7/utils"

import { useXchangeLoanData } from "@/lib/hooks/useXchangeLoanData"
import { ContractCopy } from "@/components/ui-client/contractCopy"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-client/tooltip"

import { buttonVariants } from "../ui"

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
          <div className="font-medium text-zinc-900 dark:text-zinc-100 w-full">
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
                  <div className="relative inline-block ml-2 lg:hidden">
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
              <div className="inline-block ml-auto lg:hidden">
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
                    <span className="whitespace-nowrap flex items-center">
                      <span>View</span>
                      <span>
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </span>
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
            <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
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
            <span className="pl-1">
              {generateChainDenomination(chainId as BlockchainType)}
            </span>
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
          <div className="flex justify-center w-full">
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
                <span className="whitespace-nowrap flex items-center">
                  <span>View</span>
                  <span>
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      )
  }
}

function IconAlerts({ liquidationAmount, canLiquidate, loanState }) {
  return (
    <div className="flex space-x-2">
      <span className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {liquidationAmount === -1 ? (
                <XCircleIcon className="ml-4 text-red-500 w-5 h-5" />
              ) : loanState === 0 ? (
                <AlertCircle className="ml-4 text-yellow-500 w-5 h-5" />
              ) : loanState === 1 ? (
                <CheckCircleIcon className="ml-4 text-green-500 w-5 h-5" />
              ) : (
                ""
              )}
            </TooltipTrigger>
            <TooltipContent>
              <span>
                {liquidationAmount === -1
                  ? "Liquidated"
                  : loanState === 0
                  ? "Loan Active"
                  : loanState === 1
                  ? "Loan Paid"
                  : ""}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
      <span className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {canLiquidate > 0 ? (
                <FlagIcon className=" text-green-500 w-5 h-5" />
              ) : (
                <FlagIcon className="text-red-500 w-5 h-5" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <span>{canLiquidate > 0 ? "Liquidable" : "Non-Liquidable"}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  )
}
