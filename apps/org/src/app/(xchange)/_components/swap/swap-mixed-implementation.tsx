import type { FC } from "react"
import { Fragment } from "react"

import type { Pool } from "@x7/sdk"
import { Implementation } from "@x7/utils"

import { ImplementationIcon } from "./swap-implementation-logos"

interface MixedImplementationDisplayProps {
  pools?: Pool[]
}

const implementationClassOverrides = {
  [Implementation.AERODROME]: "h-4",
  [Implementation.UNISWAP]: "h-5",
  [Implementation.PANCAKESWAP]: "h-5",
  [Implementation.XCHANGE]: "h-5",
  [Implementation.SUSHISWAP]: "h-4",
}

export const MixedImplementationDisplay: FC<
  MixedImplementationDisplayProps
> = ({ pools }) => {
  if (!pools || pools.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-1">
      {pools.map((pool, poolIdx) => (
        // oxlint-disable-next-line eslint-plugin-react(no-array-index-key) -- Pool route steps may repeat same pair; index disambiguates
        <Fragment
          key={`${pool.token0.address}-${pool.token1.address}-${poolIdx}`}
        >
          {poolIdx > 0 && <span className="text-xs">→</span>}
          <ImplementationIcon
            implementation={pool.poolType}
            classNameOverrides={implementationClassOverrides}
          />
        </Fragment>
      ))}
    </div>
  )
}
