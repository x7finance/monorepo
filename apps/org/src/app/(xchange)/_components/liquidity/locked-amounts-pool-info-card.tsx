import type { FC } from "react"
import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens"

import { formatUnits } from "viem"

import { cn } from "@x7/css"
import { Card, CardContent } from "@x7/ui/card"
import { Collapsible } from "@x7/ui/collapsible"
import { StatLabel, StatValue } from "@x7/ui/stat"

interface LockedAmountsPoolInfoCardProps {
  position: UserPositionsResponse
}

export const LockedAmountsPoolInfoCard: FC<LockedAmountsPoolInfoCardProps> = ({
  position,
}) => {
  const lockedAmount0 = position.token0.minimumBalance
  const lockedAmount1 = position.token1.minimumBalance

  return (
    <Collapsible open={Boolean(lockedAmount0 > 0n && lockedAmount1 > 0n)}>
      <Card>
        <CardContent className="grid grid-cols-2 pt-4">
          <div className="flex flex-col items-center justify-center">
            <StatValue
              size="sm"
              className={cn(lockedAmount0 > 0n && "text-red-700")}
            >
              {lockedAmount0
                ? formatUnits(lockedAmount0, position.token0.decimals)
                : "0"}
            </StatValue>
            <StatLabel
              size="sm"
              className={cn(lockedAmount0 > 0n && "text-red-700")}
            >
              {position.token0.symbol} Locked
            </StatLabel>
          </div>
          <div className="flex flex-col items-center justify-center">
            <StatValue
              size="sm"
              className={cn(lockedAmount1 > 0n && "text-red-700")}
            >
              {lockedAmount1
                ? formatUnits(lockedAmount1, position.token1.decimals)
                : "0"}
            </StatValue>
            <StatLabel
              size="sm"
              className={cn(lockedAmount1 > 0n && "text-red-700")}
            >
              {position.token1.symbol} Locked
            </StatLabel>
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  )
}
