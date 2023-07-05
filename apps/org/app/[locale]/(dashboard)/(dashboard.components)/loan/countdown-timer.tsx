import { useEffect, useState } from "react"

type CountdownTimerProps = {
  getPrincipalPaymentSchedule: any
  getPremiumPaymentSchedule: any
  numberOfPremiumPeriods: number
  numberOfRepaymentPeriods: number
  loanState: number
  liquidationAmount: number
}

export function CountdownTimer(props: CountdownTimerProps) {
  const {
    getPrincipalPaymentSchedule,
    getPremiumPaymentSchedule,
    numberOfPremiumPeriods,
    numberOfRepaymentPeriods,
    loanState,
    liquidationAmount,
  } = props

  const [endDate, setEndDate] = useState<Date | null>(null)
  const [remainingTime, setRemainingTime] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number | string
  }>(calculateRemainingTime())

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

  function findEndDate(): Date | null {
    const paymentSchedule =
      numberOfPremiumPeriods > numberOfRepaymentPeriods
        ? getPremiumPaymentSchedule
        : getPrincipalPaymentSchedule
    if (paymentSchedule && paymentSchedule.length > 0) {
      const arrayCount =
        numberOfPremiumPeriods > numberOfRepaymentPeriods
          ? numberOfPremiumPeriods
          : numberOfRepaymentPeriods

      const nowUnix = Math.floor(Date.now() / 1000) // Current Unix timestamp in seconds

      let nextLargest = 0

      for (let i = 0; i < arrayCount; i++) {
        const value = parseInt(paymentSchedule?.[0]?.[i] ?? "0", 10) || 0

        if (value && value > nowUnix) {
          if (nextLargest === 0 || value < nextLargest) {
            nextLargest = value
          }
        }
      }

      if (nextLargest > 0) {
        const timestamp = parseInt(nextLargest.toString(), 10)
        return new Date(timestamp * 1000)
      }
    }
    return null
  }

  function calculateRemainingTime(): {
    days: number
    hours: number
    minutes: number
    seconds: number | string
  } {
    const currentTime =
      parseInt(new Date().getTime().toString() ?? "0", 10) || 0
    const targetTime = endDate
      ? parseInt(endDate.getTime().toString() ?? "0", 10) || 0
      : 0
    let timeDifference = currentTime - targetTime

    if (timeDifference < 0 && loanState === 0 && liquidationAmount !== -1) {
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
    <div className="group relative mt-4 flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-2 shadow-lg ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20">
      <span className="mr-2">{remainingTime.days}d</span>
      <span className="mr-2">{remainingTime.hours}h</span>
      <span className="mr-2">{remainingTime.minutes}m</span>
      <span>{remainingTime.seconds}s</span>
    </div>
  )
}
