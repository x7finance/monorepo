import type { ChainId } from "@x7/utils"

import { Tag } from "@x7/ui/tag"
import { useCanLiquidate } from "~/lib/hooks/loans/useXchangeLendingPoolData"

interface ILLCardLiquidationStatusProps {
  tokenByIndex: number
  chainId: ChainId
}

export function ILLCardLiquidationStatus({
  tokenByIndex,
  chainId,
}: ILLCardLiquidationStatusProps) {
  const canLiquidate = useCanLiquidate(tokenByIndex, chainId).canLiquidate

  return (
    <div className="flex w-full border-t border-muted py-2">
      <h4 className="text-sm text-muted-foreground">Can liquidate</h4>
      <div className="ml-auto">
        {canLiquidate === 1 ? (
          <Tag variant="large" color="emerald">
            Yes
          </Tag>
        ) : (
          <Tag variant="large" color="zinc">
            No
          </Tag>
        )}
      </div>
    </div>
  )
}
