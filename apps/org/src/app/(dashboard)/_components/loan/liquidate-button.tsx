import type { ChainId } from "@x7/utils"

import { useAccount } from "wagmi"

import { cn } from "@x7/css"
import { Button, buttonVariants } from "@x7/ui/button"
import { useLiquidate } from "~/lib/hooks/loans/useLiquidate"

interface LiquidateButtonProps {
  loanId: number
  chainId?: ChainId
}

export function LiquidateButton({ loanId }: LiquidateButtonProps) {
  const { isConnected } = useAccount()
  const { writeContract, data, isPending } = useLiquidate({
    loanId,
  })

  const handleLiquidation = () => {
    if (loanId > 0) {
      // @ts-expect-error: todo fix
      writeContract(data?.request)
    }
  }

  return (
    <Button
      loading={isPending}
      disabled={!isConnected}
      className={cn(
        buttonVariants({
          variant: "outline",
        }),
        "mt-2"
      )}
      onClick={handleLiquidation}
    >
      liquidate
    </Button>
  )
}
