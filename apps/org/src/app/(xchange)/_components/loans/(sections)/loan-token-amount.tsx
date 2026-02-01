import type { ChainId } from "@x7/utils"
import type { Address } from "viem"

import { config } from "@react-spring/web"
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react"
import { useChainId } from "wagmi"

import { cn } from "@x7/css"
import { PencilIcon } from "@x7/icons"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@x7/ui/form"
import { Input } from "@x7/ui/input"
import { Slider } from "@x7/ui/slider"
import { Tag } from "@x7/ui/tag"
import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency"
import {
  useMaximumLoanAmount,
  useMinimumLoanAmount,
} from "~/lib/hooks/loans/useXchangeLoanData"
import { generateX7InitialLiquidityLoanTermNumber } from "~/lib/utils/lending"

import TextTransition from "../TextTransition"

interface LoanTokenAmountProps {
  form: any
  loanAmount: string
  setLoanAmount: (value: string) => void
  loanAddress: Address
}

export const LoanTokenAmount: React.FC<LoanTokenAmountProps> = ({
  form,
  loanAmount,
  setLoanAmount,
  loanAddress,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const chainId = (useChainId() || 1) as ChainId
  const { minimumLoanAmount } = useMinimumLoanAmount(
    chainId,
    generateX7InitialLiquidityLoanTermNumber(loanAddress.toString(), chainId)
  )
  const { maximumLoanAmount } = useMaximumLoanAmount(
    chainId,
    generateX7InitialLiquidityLoanTermNumber(loanAddress.toString(), chainId)
  )

  const { symbol } = useNativeCurrency({ chainId })

  return (
    <FormField
      control={form?.control}
      defaultValue={loanAmount}
      name="duration"
      render={() => (
        <FormItem className="space-y-3 border-t-2 pt-4">
          <FormLabel className="mt-4 text-sm text-muted-foreground">
            3. Select {symbol} loan amount for your LP
          </FormLabel>
          <FormControl>
            <div>
              <span className="mb-2 flex gap-1 text-xl font-bold tabular-nums">
                <div
                  className={cn(
                    `px-0.5`,
                    loanAmount.toString().length > 1 ? "w-18" : "w-4"
                  )}
                >
                  <TextTransition springConfig={config.gentle} direction="down">
                    {loanAmount}
                  </TextTransition>
                </div>
                <span className="text-emerald-500">{symbol}</span>
                <span className="ml-auto">
                  <Tag variant="large" color="zinc">
                    {`${minimumLoanAmount}-${maximumLoanAmount} available`}
                  </Tag>
                </span>
              </span>
              <div className="flex items-center gap-4">
                <Slider
                  defaultValue={[Number(loanAmount)]}
                  step={0.01}
                  min={minimumLoanAmount || 0.5}
                  max={maximumLoanAmount || 5}
                  onValueChange={(newValues: number[]) =>
                    setLoanAmount(newValues[0]?.toString() ?? "0")
                  }
                  className="grow"
                />
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="rounded-full p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
              {showCustomInput && (
                <Input
                  type="number"
                  inputMode="decimal"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder={`Enter ${symbol} amount`}
                  className="mt-2 w-full"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
