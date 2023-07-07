import { generateChainAbbreviation } from "@x7/utils"

export function PaymentScheduleElements(props: any): JSX.Element[] {
  const {
    getPrincipalPaymentSchedule,
    getPremiumPaymentSchedule,
    numberOfPremiumPeriods,
    numberOfRepaymentPeriods,
    chainId,
  } = props

  const paymentScheduleElements: JSX.Element[] = []
  const diffPeriods = numberOfPremiumPeriods - numberOfRepaymentPeriods
  let paddedPrincipalPaymentSchedule: number[][] = []

  if (numberOfPremiumPeriods > numberOfRepaymentPeriods) {
    for (let i = 0; i < numberOfRepaymentPeriods; i++) {
      paddedPrincipalPaymentSchedule[i] = []
      paddedPrincipalPaymentSchedule[i + 1] = []
      for (let j = 0; j < diffPeriods; j++) {
        // @ts-expect-error
        paddedPrincipalPaymentSchedule[i][j] = 0
        // @ts-expect-error
        paddedPrincipalPaymentSchedule[i + 1][j] = 0
      }
      // @ts-expect-error
      paddedPrincipalPaymentSchedule[i].push(...getPrincipalPaymentSchedule[i])
      // @ts-expect-error
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
