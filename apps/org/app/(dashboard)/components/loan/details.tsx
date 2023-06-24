"use client"

import {
  BlockchainType,
  ChainEnum,
  ChainShortNameEnum,
  ChainShortNameType,
  LoanType,
} from "common"
import {
  cn,
  generateChainAbbreviation,
  generateChainBase,
  generateX7InitialLiquidityLoanTermContract,
} from "utils"
import { buttonVariants } from "ui-server"
import {
  AlertCircle,
  CheckCircleIcon,
  ChevronRightIcon,
  FlagIcon,
  X7Logo,
  XCircleIcon,
} from "icons"

import React from "react"
import Link from "next/link"

import { useXchangeLoanData } from "@/lib/hooks/useXchangeLoanData"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-client/tooltip"

interface LoanProps {
  loanId: string
  loanType: LoanType
  chain: ChainShortNameType
}

function generateChainIdByName(chain: ChainShortNameType): BlockchainType {
  switch (chain) {
    case ChainShortNameEnum.erc:
      return ChainEnum.erc
    case ChainShortNameEnum.bsc:
      return ChainEnum.bsc
    case ChainShortNameEnum.polygon:
      return ChainEnum.polygon
    case ChainShortNameEnum.arbitrum:
      return ChainEnum.arbitrum
    case ChainShortNameEnum.optimism:
      return ChainEnum.optimism
    default:
      return ChainEnum.erc
  }
}

export function LoanDetails(props: LoanProps) {
  const { loanId, loanType, chain } = props

  const chainId = generateChainIdByName(chain)

  const {
    loanID,
    symbol,
    isCompleted,
    loanAmount,
    loanStartTime,
    totalDue,
    loanState,
    getPrincipalPaymentSchedule,
    getPremiumPaymentSchedule,
    canLiquidate,
  } = useXchangeLoanData(parseInt(loanId), chainId, loanType)

  const loanDetails = [
    {
      title: "Loan ID",
      value: loanId,
    },
    {
      title: "Lending Pool ID",
      value: loanID,
    },
    {
      title: "Loan Type",
      value: symbol,
    },
    {
      title: "Loan Amount",
      value: loanAmount,
    },
    {
      title: "Loan Start Time",
      value: loanStartTime,
    },
    {
      title: "Total Due",
      value: totalDue,
    },
    {
      title: "Loan State",
      value: (
        <span>
          {loanState === 1
            ? isCompleted
              ? "Loan Paided"
              : "Loan Active"
            : "Liquidated"}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {loanState === 1 ? (
                  isCompleted ? (
                    <CheckCircleIcon className="ml-4 text-green-500 w-5 h-5" />
                  ) : (
                    <AlertCircle className="ml-4 text-yellow-500 w-5 h-5" />
                  )
                ) : (
                  <XCircleIcon className="ml-4 text-red-500 w-5 h-5" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {canLiquidate > 0 ? "Liquidable" : "Non-Liquidable"}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      ),
    },
    {
      title: "Can Liquidate",
      value: (
        <span>
          {canLiquidate > 0 ? "Liquidable" : "Non-Liquidable"}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {canLiquidate > 0 ? (
                  <FlagIcon className="ml-4 text-green-500 w-5 h-5" />
                ) : (
                  <FlagIcon className="ml-4 text-red-500 w-5 h-5" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {canLiquidate > 0 ? "Liquidable" : "Non-Liquidable"}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      ),
    },
  ]

  const RepaymentDetails = [
    {
      title: "Principal Payment Schedule",
      value: getPrincipalPaymentSchedule,
    },
    {
      title: "Premium Payment Schedule",
      value: getPremiumPaymentSchedule,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex flex-col md:flex-row md:justify-between w-full md:w-auto">
        <div className="flex-1 flex-grow p-2">
          <section className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-white-400">
                <X7Logo className="h-5 w-5 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:stroke-zinc-400 dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400  fill-black dark:fill-white" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Loan Information
              </span>
            </h3>
            <ul
              role="list"
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {loanDetails.map((detail: any) => (
                <li key={detail.title} className="flex w-full py-2">
                  <ChevronRightIcon
                    className={cn("h-6 w-6 flex-none text-White-400")}
                  />
                  <span className="ml-4 text-zinc-600 dark:text-zinc-400">
                    {detail.title}
                  </span>
                  <span className="ml-auto">{detail.value}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`${generateChainBase(
                chainId
              )}/token/${generateX7InitialLiquidityLoanTermContract(
                loanType
              )}?a=${loanId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "mt-2"
              )}
            >
              View On Chain
            </Link>
          </section>
        </div>
        <div className="flex-1 flex-grow p-2 md:w-auto">
          <section className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-white-400">
                <X7Logo className="h-5 w-5 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:stroke-zinc-400 dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400  fill-black dark:fill-white" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Repayment Information
              </span>
            </h3>
            <ul
              role="list"
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {RepaymentDetails.map((detail: any) => (
                <React.Fragment key={detail.title}>
                  <li className="flex w-full py-2">
                    <ChevronRightIcon
                      className={cn("h-6 w-6 flex-none text-white-400")}
                    />
                    <div className="ml-4 text-zinc-600 dark:text-zinc-400">
                      {detail.title}
                    </div>
                    <span className="ml-auto text-right">
                      {detail.value?.map(
                        (innerArray: number[], outerIndex: number) =>
                          innerArray
                            .filter(
                              (element: number, innerIndex: number) =>
                                outerIndex === 0
                            )
                            .map((element: number, innerIndex: number) => (
                              <div key={`${outerIndex}-${innerIndex}`}>
                                <span>
                                  {new Date(
                                    parseInt(element.toString() ?? "0", 10) *
                                      1000
                                  ).toLocaleString()}
                                </span>
                                <span className="ml-5">
                                  {(
                                    parseInt(
                                      detail.value[outerIndex + 1][
                                        innerIndex
                                      ].toString() ?? "0",
                                      10
                                    ) /
                                    10 ** 18
                                  ).toFixed(4)}{" "}
                                  {generateChainAbbreviation(chainId)}
                                </span>
                              </div>
                            ))
                      )}
                    </span>
                  </li>
                </React.Fragment>
              ))}
              <li className="flex w-full py-2">
                <ChevronRightIcon
                  className={cn("h-6 w-6 flex-none text-white-400")}
                />
                <span className="ml-4 text-zinc-600 dark:text-zinc-400">
                  Total Repayment Schedule
                </span>
                <span className="ml-auto text-right">
                  {getPrincipalPaymentSchedule?.map(
                    (innerArray: number[], outerIndex: number) =>
                      innerArray
                        .filter(
                          (element: number, innerIndex: number) =>
                            outerIndex === 0
                        )
                        .map((element: number, innerIndex: number) => (
                          <div key={`${outerIndex}-${innerIndex}`}>
                            <span>
                              {new Date(
                                parseInt(element.toString() ?? "0", 10) * 1000
                              ).toLocaleString()}
                            </span>
                            <span className="ml-5">
                              {(
                                (parseInt(
                                  getPrincipalPaymentSchedule?.[
                                    outerIndex + 1
                                  ]?.[innerIndex]?.toString() ?? "0",
                                  10
                                ) +
                                  parseInt(
                                    getPremiumPaymentSchedule?.[
                                      outerIndex + 1
                                    ]?.[innerIndex]?.toString() ?? "0",
                                    10
                                  )) /
                                10 ** 18
                              ).toFixed(4)}{" "}
                              {generateChainAbbreviation(chainId)}
                            </span>
                          </div>
                        ))
                  )}
                </span>
              </li>
            </ul>

            <Link
              href={`${generateChainBase(
                chainId
              )}/token/${generateX7InitialLiquidityLoanTermContract(
                loanType
              )}?a=${loanId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "mt-2"
              )}
            >
              View On Chain
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
