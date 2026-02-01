import type { ChainId } from "@x7/utils"

import { parseEther } from "viem"
import { useAccount } from "wagmi"

import { cn } from "@x7/css"
import { Button, buttonVariants } from "@x7/ui/button"
import { usePayLiability } from "~/lib/hooks/tokens/usePayLiability"

interface PaymentButtonProps {
  size?: "xs" | "default" | "sm" | "lg"
  amount: string
  buttonText: string
  loanId: number
  chainId?: ChainId
  disabled?: boolean
}

export function PaymentButton({
  amount,
  buttonText,
  loanId,
  disabled = false,
  size = "xs",
}: PaymentButtonProps) {
  const { isConnected } = useAccount()
  const { writeContract, data, isPending } = usePayLiability({
    valueInput: amount,
    loanId,
  })

  const handlePayment = () => {
    if (parseEther(amount) > 0) {
      // @ts-expect-error: todo fix
      writeContract(data?.request)
    }
  }

  return (
    <Button
      size={size}
      loading={isPending}
      disabled={!isConnected || disabled}
      className={cn(
        buttonVariants({
          variant: "secondary",
        }),
        "h-8 py-1"
      )}
      onClick={handlePayment}
    >
      {buttonText}
    </Button>
  )
}
