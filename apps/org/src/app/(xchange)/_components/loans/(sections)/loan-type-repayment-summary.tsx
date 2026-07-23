/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { formatEther } from "viem"
import { useChainId } from "wagmi"

import { Tag } from "@x7/ui/tag"
import type { ChainId } from "@x7/utils"
import { Native } from "@x7/utils"
import {
  useNumberOfPremiumPeriods,
  useNumberOfRepaymentPeriods,
  usePremiumPeriodIndices,
  usePrincipleFractionDenominator,
  useRepaymentPeriodIndices,
} from "~/lib/hooks/loans/useXchangeLoanData"
import type { QuoteResponse } from "~/lib/stores/loan"
import { generateX7InitialLiquidityLoanTermNumber } from "~/lib/utils/lending"

import { LoanTypeRepaymentFraction } from "./loan-type-repayment-fraction"

interface LoanTypeRepaymentSummaryProps {
  quote: QuoteResponse
  loanDuration: number
}

export function LoanTypeRepaymentSummary({
  quote,
  loanDuration,
}: LoanTypeRepaymentSummaryProps) {
  const chainId = useChainId() as ChainId
  const nativeCurrency = Native.onChain(chainId)
  const loanTermNumber = generateX7InitialLiquidityLoanTermNumber(
    quote.loanTerm.address,
    chainId
  )
  const { numberOfPremiumPeriods } = useNumberOfPremiumPeriods(
    chainId,
    loanTermNumber
  )
  const { numberOfRepaymentPeriods } = useNumberOfRepaymentPeriods(
    chainId,
    loanTermNumber
  )
  const { premiumPeriodIndices } = usePremiumPeriodIndices(
    numberOfPremiumPeriods - 1,
    chainId,
    loanTermNumber
  )
  const { repaymentPeriodIndices } = useRepaymentPeriodIndices(
    numberOfRepaymentPeriods - 1,
    chainId,
    loanTermNumber
  )
  const { principleFractionDenominator } = usePrincipleFractionDenominator(
    chainId,
    loanTermNumber
  )

  const totalIndices =
    repaymentPeriodIndices > premiumPeriodIndices
      ? repaymentPeriodIndices
      : premiumPeriodIndices

  const FractionArray = Array.from(
    { length: totalIndices },
    (_, index) => index + 1
  )

  const currentDate = new Date()
  const futureDate = new Date(currentDate)
  futureDate.setDate(currentDate.getDate() + loanDuration)

  const formattedFutureDate = formatDateTime(futureDate)

  const totalPremium = formatEther(BigInt(quote.result[2] ?? 0)).toString()

  return (
    <div className="border-b border-accent pb-4 pt-2">
      <div className="flex justify-between py-2">
        <span className="font-heading text-sm text-zinc-500 dark:text-zinc-400">
          Repayment Schedule
        </span>

        <Tag variant="large" color="zinc">
          {numberOfPremiumPeriods !== 0
            ? `${numberOfRepaymentPeriods} repayments, ${numberOfPremiumPeriods} premium payments`
            : `${numberOfRepaymentPeriods} repayments`}
        </Tag>
      </div>
      {numberOfPremiumPeriods > 0 && (
        <div className="flex justify-between py-2">
          <div></div>
          <div>
            <span className="text-lg font-bold">{`${String(totalPremium)} ${nativeCurrency.symbol.toString() ?? "ETH"}`}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 py-2">
        {numberOfPremiumPeriods !== 0 && numberOfRepaymentPeriods > 0 ? (
          FractionArray.map((period) => (
            <LoanTypeRepaymentFraction
              key={`period-${period}`}
              period={period}
              loanDuration={loanDuration}
              chainId={chainId}
              loanTermNumber={loanTermNumber}
              totalIndices={totalIndices}
              principalFractionDenominator={principleFractionDenominator}
              loanAmount={formatEther(BigInt(quote.result[0] ?? 0))}
            />
          ))
        ) : (
          <div className="flex justify-between py-1">
            <div>
              <span className="py-1 pr-2 text-sm font-medium text-black dark:text-white">
                Payment {}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground">
                <Tag
                  variant="large"
                  color="emerald"
                >{`${String(formatEther(quote.result[0] ?? 0n))} ${nativeCurrency.symbol.toString() ?? "ETH"}`}</Tag>
              </span>{" "}
              <span className="text-sm">due by</span> {formattedFutureDate}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDateTime(dateTime: Date) {
  const day = dateTime.getDate().toString().padStart(2, "0")
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  const month = monthNames[dateTime.getMonth()]
  const year = dateTime.getFullYear().toString()
  const hours = dateTime.getHours().toString().padStart(2, "0")
  const minutes = dateTime.getMinutes().toString().padStart(2, "0")

  return `${month} ${day}, ${year} ${hours}:${minutes}`
}
