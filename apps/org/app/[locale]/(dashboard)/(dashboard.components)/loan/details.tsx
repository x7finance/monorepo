"use client"

import { Fragment } from "react"
import Link from "next/link"

import type { BlockchainType, ChainShortNameType, LoanType } from "@x7/common"
import { ChainEnum, ChainShortNameEnum } from "@x7/common"
import {
  AlertCircle,
  CheckCircleIcon,
  ChevronRightIcon,
  FlagIcon,
  X7Logo,
  XCircleIcon,
} from "@x7/icons"
// @ts-expect-error todo: fix this
import { buttonVariants } from "@x7/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  // @ts-expect-error todo: fix this
} from "@x7/ui/tooltip"
import {
  cn,
  generateChainAbbreviation,
  generateChainBase,
  generateX7InitialLiquidityLoanTermContract,
} from "@x7/utils"

import { useXchangeLoanData } from "@/lib/hooks/useXchangeLoanData"
import { CountdownTimer } from "./countdown-timer"
import { PaymentScheduleElements } from "./payment-schedule-elements"

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
    loanAmount,
    loanStartTime,
    totalDue,
    loanState,
    getPrincipalPaymentSchedule,
    getPremiumPaymentSchedule,
    canLiquidate,
    loanBorrower,
    loanToken,
    loanPair,
    originationFeeCollected,
    premiumAmount,
    premiumAmountPaid,
    getRemainingLiablity,
    getPremiumsDue,
    getPrincipalDue,
    numberOfPremiumPeriods,
    numberOfRepaymentPeriods,
    liquidationAmount,
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
      title: "Loan State",
      value: (
        <span>
          {liquidationAmount === -1
            ? "Liquidated"
            : loanState === 0
            ? "Loan Active"
            : loanState === 1
            ? "Loan Paid"
            : ""}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {liquidationAmount === -1 ? (
                  <XCircleIcon className="ml-4 h-5 w-5 text-red-500" />
                ) : loanState === 0 ? (
                  <AlertCircle className="ml-4 h-5 w-5 text-yellow-500" />
                ) : loanState === 1 ? (
                  <CheckCircleIcon className="ml-4 h-5 w-5 text-green-500" />
                ) : (
                  ""
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
                  <FlagIcon className="ml-4 h-5 w-5 text-green-500" />
                ) : (
                  <FlagIcon className="ml-4 h-5 w-5 text-red-500" />
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
      title: "Origination Fee Collected",
      value: `${originationFeeCollected} ${generateChainAbbreviation(chainId)}`,
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

  const AddressDetails = [
    {
      title: "Borrower",
      value: loanBorrower,
    },
    {
      title: "Token",
      value: loanToken,
    },
    {
      title: "Pair",
      value: loanPair,
    },
  ]

  const PaymentDetails = [
    {
      title: "Premium Paid",
      value: `${premiumAmountPaid.toFixed(
        4
      )} of ${premiumAmount} ${generateChainAbbreviation(chainId)}`,
    },
    {
      title: "Premium Due",
      value: `${getPremiumsDue.toFixed(4)} ${generateChainAbbreviation(
        chainId
      )}`,
    },
    {
      title: "Principal Due",
      value: `${getPrincipalDue.toFixed(4)} ${generateChainAbbreviation(
        chainId
      )}`,
    },
    {
      title: "Total Due",
      value: `${totalDue.toFixed(4)} ${generateChainAbbreviation(chainId)}`,
    },
    {
      title: "Remaining Liability",
      value: `${getRemainingLiablity.toFixed(4)} ${generateChainAbbreviation(
        chainId
      )}`,
    },
  ]

  return (
    <div>
      <div className="mb-5 mt-5 grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="col-span-1 flex flex-col p-2">
          <section className="group relative flex flex-grow flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="dark:group-hover:ring-white-400 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10">
                <X7Logo className="dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400 h-5 w-5 fill-black stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900  dark:fill-white dark:stroke-zinc-400" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Loan Information
              </span>
            </h3>
            <ul
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {loanDetails.map((detail: any) => (
                <li key={detail.title} className="flex w-full py-2">
                  <ChevronRightIcon
                    className={cn("text-White-400 h-6 w-6 flex-none")}
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
        <div className="col-span-1 flex flex-col p-2">
          <section className="group relative flex flex-grow flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="dark:group-hover:ring-white-400 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10">
                <X7Logo className="dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400 h-5 w-5 fill-black stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900  dark:fill-white dark:stroke-zinc-400" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Repayment Information
              </span>
            </h3>
            <ul
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {RepaymentDetails.map((detail: any) => (
                <Fragment key={detail.title}>
                  <li className="flex w-full py-2">
                    <ChevronRightIcon
                      className={cn("text-white-400 h-6 w-6 flex-none")}
                    />
                    <div className="ml-4 text-zinc-600 dark:text-zinc-400">
                      {detail.title}
                    </div>
                    <span className="ml-auto text-right">
                      {detail.value?.map(
                        (innerArray: number[], outerIndex: number) =>
                          innerArray
                            .filter(() => outerIndex === 0)
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
                </Fragment>
              ))}
              <li className="flex w-full py-2">
                <ChevronRightIcon
                  className={cn("text-white-400 h-6 w-6 flex-none")}
                />
                <span className="ml-4 text-zinc-600 dark:text-zinc-400">
                  Total Repayment Schedule
                </span>
                <span className="ml-auto text-right">
                  <PaymentScheduleElements
                    getPrincipalPaymentSchedule={getPrincipalPaymentSchedule}
                    getPremiumPaymentSchedule={getPremiumPaymentSchedule}
                    numberOfPremiumPeriods={numberOfPremiumPeriods}
                    numberOfRepaymentPeriods={numberOfRepaymentPeriods}
                    chainId={chainId}
                  />
                </span>
              </li>
            </ul>
            {numberOfPremiumPeriods > 0 || numberOfRepaymentPeriods > 0 ? (
              <CountdownTimer
                getPrincipalPaymentSchedule={getPrincipalPaymentSchedule}
                getPremiumPaymentSchedule={getPremiumPaymentSchedule}
                numberOfPremiumPeriods={numberOfPremiumPeriods}
                numberOfRepaymentPeriods={numberOfRepaymentPeriods}
                loanState={loanState}
                liquidationAmount={liquidationAmount}
              />
            ) : (
              ""
            )}
          </section>
        </div>

        <div className="col-span-1 flex flex-col p-2">
          <section className="group relative flex flex-grow flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="dark:group-hover:ring-white-400 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10">
                <X7Logo className="dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400 h-5 w-5 fill-black stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900  dark:fill-white dark:stroke-zinc-400" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Address Information
              </span>
            </h3>
            <ul
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {AddressDetails.map((detail: any) => (
                <li
                  key={detail.title}
                  className="flex w-full items-center py-2 "
                >
                  <ChevronRightIcon
                    className={cn("text-White-400 h-6 w-6 flex-none")}
                  />
                  <span className="ml-4 text-zinc-600 dark:text-zinc-400">
                    {detail.title}
                  </span>
                  <div className="ml-auto">
                    <Link
                      href={`${generateChainBase(chainId)}/address/${
                        detail.value
                      }`}
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
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="col-span-1 flex flex-col p-2">
          <section className="group relative flex flex-grow flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="dark:group-hover:ring-white-400 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10">
                <X7Logo className="dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400 h-5 w-5 fill-black stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900  dark:fill-white dark:stroke-zinc-400" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Payment Progress Information
              </span>
            </h3>
            <ul
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {PaymentDetails.map((detail: any) => (
                <li key={detail.title} className="flex w-full py-2">
                  <ChevronRightIcon
                    className={cn("text-White-400 h-6 w-6 flex-none")}
                  />
                  <span className="ml-4 text-zinc-600 dark:text-zinc-400">
                    {detail.title}
                  </span>
                  <span className="ml-auto">{detail.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
