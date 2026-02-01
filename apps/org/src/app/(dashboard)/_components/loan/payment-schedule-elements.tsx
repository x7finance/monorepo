import type { ChainId } from "@x7/utils"

import { Tag } from "@x7/ui/tag"
import { generateChainAbbreviation } from "@x7/utils"

interface PaymentScheduleElementsProps {
  getPrincipalPaymentSchedule: number[][]
  getPremiumPaymentSchedule: number[][]
  numberOfPremiumPeriods: number
  numberOfRepaymentPeriods: number
  loanId: number
  chainId: ChainId
}

export function PaymentScheduleElements(props: PaymentScheduleElementsProps) {
  const {
    getPrincipalPaymentSchedule = [],
    getPremiumPaymentSchedule = [],
    numberOfPremiumPeriods,
    numberOfRepaymentPeriods,
    chainId,
  } = props

  const paddedPrincipalPaymentSchedule = getPrincipalPaymentSchedule.length
    ? getPrincipalPaymentSchedule.slice()
    : [[], []]

  if (numberOfPremiumPeriods > numberOfRepaymentPeriods) {
    const diffPeriods = numberOfPremiumPeriods - numberOfRepaymentPeriods

    if (!paddedPrincipalPaymentSchedule[0]) {
      paddedPrincipalPaymentSchedule[0] = []
    }

    if (!paddedPrincipalPaymentSchedule[1]) {
      paddedPrincipalPaymentSchedule[1] = []
    }

    for (let i = 0; i < diffPeriods; i++) {
      paddedPrincipalPaymentSchedule[0].push(0)
      paddedPrincipalPaymentSchedule[1].push(0)
    }
  }

  const paymentScheduleElements = []
  const maxPeriods = Math.max(numberOfPremiumPeriods, numberOfRepaymentPeriods)

  for (let periodIndex = 0; periodIndex < maxPeriods; periodIndex++) {
    const premiumTime = getPremiumPaymentSchedule[0]?.[periodIndex] ?? 0
    const principalTime = paddedPrincipalPaymentSchedule[0]?.[periodIndex] ?? 0
    const principalAmount = Number(
      parseInt(
        paddedPrincipalPaymentSchedule[1]?.[periodIndex]?.toString() ?? "0"
      )
    )

    const premiumAmount = Number(
      parseInt(getPremiumPaymentSchedule[1]?.[periodIndex]?.toString() ?? "0")
    )

    const timestamp = Number(premiumTime || principalTime)
    const paymentDate = new Date(Number(timestamp) * 1000).toLocaleString()

    const totalPayment = principalAmount + premiumAmount

    if (Date.now() < timestamp * 1000) {
      const formattedPayment = (totalPayment / 10 ** 18).toFixed(4)
      const paymentButtonElement = (
        <div
          key={periodIndex}
          className="flex flex-auto items-center justify-between"
        >
          <div>
            <Tag variant="large" color="zinc">
              {paymentDate}
            </Tag>
          </div>
          <div className="ml-5 text-right">
            <Tag variant="large" color="emerald">
              {formattedPayment} {generateChainAbbreviation(chainId)}
            </Tag>
          </div>
        </div>
      )
      paymentScheduleElements.push(paymentButtonElement)
    }
  }

  return paymentScheduleElements
}
