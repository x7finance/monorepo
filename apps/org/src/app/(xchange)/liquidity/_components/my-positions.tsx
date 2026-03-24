import { useAccount, usePublicClient } from "wagmi"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@x7/ui/table"
import type { ActiveChainId, ChainId } from "@x7/utils"
import { EmptyPioneer } from "~/lib/components/core/empty-pioneer"
import { LoadingPioneer } from "~/lib/components/core/loading-pioneer"
import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens"
import { useAllLiquidityPositions } from "~/lib/hooks/tokens/useGetAllUserTokens"
import { useWeb3Config } from "~/lib/providers/web3"

import { LiquidityPositionRow } from "../../_components/liquidity/liquidity-position-table-row"

function useLiquidityPositions(isOpen: boolean) {
  const { address, chainId } = useAccount()
  const { wagmiConfig } = useWeb3Config()
  const publicClient = usePublicClient({
    chainId: chainId,
    config: wagmiConfig,
  })

  const { pairs: xChangePositions, isLoading } = useAllLiquidityPositions(
    address,
    chainId as ChainId,
    // @ts-expect-error: todo fix
    publicClient
  )

  return {
    pairs: xChangePositions.filter((position: UserPositionsResponse) => {
      const hasBalance =
        position.tokenBalance !== undefined && position.tokenBalance !== 0n
      return isOpen ? hasBalance : !hasBalance
    }),
    isLoading,
  }
}

function LiquidityPositions({
  positions,
  chainId,
  isLoading,
  view,
}: {
  view?: "small" | "default"
  positions: UserPositionsResponse[]
  chainId: ActiveChainId
  isLoading: boolean
}) {
  if (isLoading) {
    return <LoadingPioneer />
  }

  if (positions.length === 0) {
    return <EmptyPioneer message="No positions found" />
  }

  return (
    <div className="mx-auto">
      <div className="my-12 flex w-full justify-center text-sm text-zinc-500">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Value</TableHead>
              {view !== "small" && (
                <TableHead className="flex items-center justify-end">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position: UserPositionsResponse, idx: number) => (
              <LiquidityPositionRow
                key={`${position.contractAddress}-${idx}`}
                chainId={chainId}
                position={position}
                view={view}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function MyOpenLiquidityPositions({
  view = "default",
}: {
  view?: "small" | "default"
}) {
  const { chainId } = useAccount()
  const { pairs: openPositions, isLoading } = useLiquidityPositions(true)

  return (
    <LiquidityPositions
      view={view}
      isLoading={isLoading}
      positions={openPositions}
      chainId={chainId as ActiveChainId}
    />
  )
}

export function MyClosedLiquidityPositions({
  view = "default",
}: {
  view?: "small" | "default"
}) {
  const { chainId } = useAccount()
  const { pairs: closedPositions, isLoading } = useLiquidityPositions(false)

  return (
    <LiquidityPositions
      view={view}
      isLoading={isLoading}
      positions={closedPositions}
      chainId={chainId as ActiveChainId}
    />
  )
}
