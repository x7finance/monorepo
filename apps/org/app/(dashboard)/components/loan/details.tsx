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

import React, { useEffect, useState } from "react"
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
          <section className="group relative flex flex-col flex-grow overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
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
        <div className="col-span-1 flex flex-col p-2">
          <section className="group relative flex flex-col flex-grow overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
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
                  {generatePaymentScheduleElements(
                    getPrincipalPaymentSchedule,
                    getPremiumPaymentSchedule,
                    numberOfPremiumPeriods,
                    numberOfRepaymentPeriods,
                    chainId
                  )}
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
                isCompleted={isCompleted}
              />
            ) : (
              ""
            )}
          </section>
        </div>

        <div className="col-span-1 flex flex-col p-2">
          <section className="group relative flex flex-col flex-grow overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-white-400">
                <X7Logo className="h-5 w-5 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:stroke-zinc-400 dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400  fill-black dark:fill-white" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Address Information
              </span>
            </h3>
            <ul
              role="list"
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {AddressDetails.map((detail: any) => (
                <li
                  key={detail.title}
                  className="flex items-center w-full py-2 "
                >
                  <ChevronRightIcon
                    className={cn("h-6 w-6 flex-none text-White-400")}
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
          <section className="group relative flex flex-col flex-grow overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
            <h3 className="flex flex-col items-center text-sm font-semibold text-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-white-400">
                <X7Logo className="h-5 w-5 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:stroke-zinc-400 dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400  fill-black dark:fill-white" />
              </div>
              <span className="mt-2 leading-7 text-zinc-500">
                Payment Progress Information
              </span>
            </h3>
            <ul
              role="list"
              className={cn(
                "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
              )}
            >
              {PaymentDetails.map((detail: any) => (
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
          </section>
        </div>
      </div>
    </div>
  )
}

export function CountdownTimer({
  getPrincipalPaymentSchedule,
  getPremiumPaymentSchedule,
  numberOfPremiumPeriods,
  numberOfRepaymentPeriods,
  loanState,
  isCompleted,
}) {
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime())

  useEffect(() => {
    const fetchedEndDate = findEndDate()
    setEndDate(fetchedEndDate)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [endDate])

  // Rest of the code...

  function findEndDate() {
    const paymentSchedule =
      numberOfPremiumPeriods > numberOfRepaymentPeriods
        ? getPremiumPaymentSchedule
        : getPrincipalPaymentSchedule
    if (paymentSchedule && paymentSchedule.length > 0) {
      const arrayCount =
        numberOfPremiumPeriods > numberOfRepaymentPeriods
          ? numberOfPremiumPeriods
          : numberOfRepaymentPeriods

      const lastPayment = paymentSchedule?.[0]?.[arrayCount - 1]
      if (lastPayment > 0) {
        const timestamp = parseInt(lastPayment.toString(), 10)
        return new Date(timestamp * 1000)
      }
    }
    return null
  }

  function calculateRemainingTime() {
    const currentTime =
      parseInt(new Date().getTime().toString() ?? "0", 10) || 0
    const targetTime = endDate
      ? parseInt(endDate.getTime().toString() ?? "0", 10) || 0
      : 0
    let timeDifference = currentTime - targetTime

    if (timeDifference < 0 && !isCompleted && loanState === 1) {
      timeDifference = timeDifference * -1
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      )
      const seconds = (timeDifference % (1000 * 60)) / 1000

      return {
        days,
        hours,
        minutes,
        seconds: seconds.toFixed(3),
      }
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }
  }

  return (
    <div className="mt-4 group relative flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-2 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
      <span className="mr-2">{remainingTime.days}d</span>
      <span className="mr-2">{remainingTime.hours}h</span>
      <span className="mr-2">{remainingTime.minutes}m</span>
      <span>{remainingTime.seconds}s</span>
    </div>
  )
}

function generatePaymentScheduleElements(
  getPrincipalPaymentSchedule,
  getPremiumPaymentSchedule,
  numberOfPremiumPeriods,
  numberOfRepaymentPeriods,
  chainId
): JSX.Element[] {
  const paymentScheduleElements: JSX.Element[] = []
  const diffPeriods = numberOfPremiumPeriods - numberOfRepaymentPeriods
  let paddedPrincipalPaymentSchedule: number[][] = []

  if (numberOfPremiumPeriods > numberOfRepaymentPeriods) {
    for (let i = 0; i < numberOfRepaymentPeriods; i++) {
      paddedPrincipalPaymentSchedule[i] = []
      paddedPrincipalPaymentSchedule[i + 1] = []
      for (let j = 0; j < diffPeriods; j++) {
        paddedPrincipalPaymentSchedule[i][j] = 0
        paddedPrincipalPaymentSchedule[i + 1][j] = 0
      }
      paddedPrincipalPaymentSchedule[i].push(...getPrincipalPaymentSchedule[i])
      paddedPrincipalPaymentSchedule[i + 1].push(
        ...getPrincipalPaymentSchedule[i + 1]
      )
    }
  } else {
    paddedPrincipalPaymentSchedule = getPrincipalPaymentSchedule
  }

  const arrayCount =
    numberOfPremiumPeriods > numberOfRepaymentPeriods
      ? numberOfPremiumPeriods
      : numberOfRepaymentPeriods
  for (let innerIndex = 0; innerIndex < arrayCount; innerIndex++) {
    const premiumTimeStamp = parseInt(
      getPremiumPaymentSchedule?.[0]?.[innerIndex]?.toString() ?? "0",
      10
    )

    const principalTimeStamp = parseInt(
      paddedPrincipalPaymentSchedule?.[0]?.[innerIndex]?.toString() ?? "0",
      10
    )

    const principalPayment = parseInt(
      paddedPrincipalPaymentSchedule?.[1]?.[innerIndex]?.toString() ?? "0",
      10
    )
    const premiumPayment = parseInt(
      getPremiumPaymentSchedule?.[1]?.[innerIndex]?.toString() ?? "0",
      10
    )

    const timestamp =
      premiumTimeStamp !== 0 ? premiumTimeStamp : principalTimeStamp ?? "0"
    const date = new Date(timestamp * 1000).toLocaleString()

    const paymentAmount = (
      (principalPayment + premiumPayment) /
      10 ** 18
    ).toFixed(4)

    const element = (
      <div key={innerIndex}>
        <span>{date}</span>
        <span className="ml-5">
          {paymentAmount} {generateChainAbbreviation(chainId)}
        </span>
      </div>
    )

    paymentScheduleElements.push(element)
  }

  return paymentScheduleElements
}
