import type { ChainId } from "@x7/utils"

/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { useChainId } from "wagmi"

import { Card, CardContent } from "@x7/ui/card"
import { LinkExternal } from "@x7/ui/link"
import { getChainInfo } from "~/lib/constants/chainInfo"

interface ActivityTransactionProps {
  hash: string
  timeStamp: string
  functionName: string
  value: string
  blockNumber: string
  gasPrice: string
}

export function ActivityScannerTransaction({
  transaction,
}: {
  transaction: ActivityTransactionProps
}) {
  const { hash, timeStamp, functionName, value, blockNumber, gasPrice } =
    transaction
  const chainId = useChainId() as ChainId
  const chainInfo = getChainInfo(chainId)

  const weiToEther = (wei: number) => {
    return (wei / 10 ** (chainInfo.nativeCurrency.decimals ?? 0)).toFixed(6)
  }

  return (
    <Card
      key={hash}
      style={{ fontSize: "0.8rem" }}
      className="dark:bg-secondary mb-3 rounded-sm border border-black bg-zinc-200 p-3 text-black dark:border-zinc-500 dark:text-white"
    >
      <CardContent className="space-y-2 p-0">
        <p>{new Date(Number(timeStamp) * 1000).toLocaleString()}</p>
        <p>
          {(functionName.split("(")[0] ?? "Transfer").charAt(0).toUpperCase() +
            (functionName.split("(")[0] ?? "Transfer").slice(1)}
        </p>
        <p>
          Value: {weiToEther(Number(value))} {chainInfo.nativeCurrency.symbol}
        </p>
        <p>Block Number: {blockNumber}</p>
        <p>Gas Price: {gasPrice} Wei</p>
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
