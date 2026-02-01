import type { ChainId } from "@x7/utils"

import { useAccount } from "wagmi"

import { Card, CardContent } from "@x7/ui/card"
import { LinkExternal } from "@x7/ui/link"
import { getChainInfo } from "~/lib/constants/chainInfo"

interface ActivityTransactionProps {
  hash: string
  value: string
  blockNum: string
  asset: string
}

export function ActivityAlchemyTransaction({
  transaction,
}: {
  transaction: ActivityTransactionProps
}) {
  const { hash, value, blockNum, asset } = transaction
  const { chain } = useAccount()
  const chainId = chain?.id as ChainId
  const chainInfo = getChainInfo(chainId)

  return (
    <Card
      key={hash}
      style={{ fontSize: "0.8rem" }}
      className="dark:bg-secondary mb-3 rounded-lg border border-black bg-zinc-200 p-3 text-black dark:border-zinc-500 dark:text-white"
    >
      <CardContent className="space-y-2 p-0">
        <p>getAssetTransfers</p>
        <p>Block Number: {blockNum}</p>

        <p>Token: {asset} </p>
        <p>
          Value: {value} {asset}
        </p>
        <p>
          {chainInfo.api && (
            <LinkExternal
              href={`${chainInfo.explorer}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View On Chain
            </LinkExternal>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
