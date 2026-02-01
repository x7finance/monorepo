import type { ChainId } from "@x7/utils"

import { X7Logo } from "@x7/icons"
import { PaymentButton } from "~/app/(dashboard)/_components/loan/payment-button"

import { Countdown } from "./countdown"

interface PaymentCardProps {
  tokenByIndex: number
  paymentDueTimeStamp: number
  paymentAmount: string
  canLiquidate: boolean
  chainId: ChainId
}

export function IILPaymentCard({
  tokenByIndex,
  paymentDueTimeStamp,
  paymentAmount,
  canLiquidate,
  chainId,
}: PaymentCardProps) {
  const exactEnd = new Date(Number(paymentDueTimeStamp))
  const paymentShortDate = new Date(Number(paymentDueTimeStamp) * 1000)

  return (
    <>
      <li className="flex w-full flex-row items-center py-2">
        <div className="dark:group-hover:ring-white-400 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10">
          <X7Logo className="dark:group-hover:fill-white-300/10 dark:group-hover:stroke-white-400 h-5 w-5 fill-black stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white dark:stroke-zinc-400" />
        </div>
        <div className="px-4">
          <span className="ml-4 block align-middle text-muted-foreground">
            {paymentShortDate.toDateString()}
          </span>
          <span className="ml-4 block align-middle text-muted-foreground">
            {" ["}
            <Countdown exactEnd={exactEnd} canLiquidate={canLiquidate} />
            {"]"}
          </span>
        </div>
        <div>
          <span className="ml-auto">
            <PaymentButton
              amount={paymentAmount}
              buttonText={"Pay " + parseInt(paymentAmount, 10) / 10 ** 18}
              loanId={tokenByIndex}
              chainId={chainId}
            />
          </span>
        </div>
      </li>
    </>
  )
}
