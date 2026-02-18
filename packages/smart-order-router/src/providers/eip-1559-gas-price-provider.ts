/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash"
import type { Client } from "viem"

import { LogCodes } from "@x7/utils"

import { log } from "../utils/log"

import type { GasPrice } from "./gas-price-provider"
import { IGasPriceProvider } from "./gas-price-provider"

export interface RawFeeHistoryResponse {
  baseFeePerGas: string[]
  gasUsedRatio: number[]
  oldestBlock: string
  reward: string[]
}

export interface FeeHistoryResponse {
  baseFeePerGas: bigint[]
  gasUsedRatio: number[]
  oldestBlock: bigint
  reward: bigint[]
}

// We get the Xth percentile of priority fees for transactions successfully included in previous blocks.
const DEFAULT_PRIORITY_FEE_PERCENTILE = 50
// Infura docs say only past 4 blocks guaranteed to be available: https://infura.io/docs/ethereum#operation/eth_feeHistory
const DEFAULT_BLOCKS_TO_LOOK_BACK = 4

/**
 * Computes a gas estimate using on-chain data from the eth_feeHistory RPC endpoint.
 *
 * Takes the average priority fee from the past `blocksToConsider` blocks, and adds it
 * to the current base fee.
 *
 * @export
 * @class EIP1559GasPriceProvider
 */
export class EIP1559GasPriceProvider extends IGasPriceProvider {
  constructor(
    protected provider: Client<any>,
    private priorityFeePercentile: number = DEFAULT_PRIORITY_FEE_PERCENTILE,
    private blocksToConsider: number = DEFAULT_BLOCKS_TO_LOOK_BACK
  ) {
    super()
  }

  public async getGasPrice(): Promise<GasPrice> {
    const feeHistoryRaw = await this.provider.request({
      method: "eth_feeHistory",
      params: [
        BigInt(this.blocksToConsider).toString() as `0x${string}`,
        "latest",
        [this.priorityFeePercentile],
      ],
    })

    const feeHistory: FeeHistoryResponse = {
      baseFeePerGas: _.map(feeHistoryRaw.baseFeePerGas, (b) => BigInt(b)),
      gasUsedRatio: feeHistoryRaw.gasUsedRatio,
      oldestBlock: BigInt(feeHistoryRaw.oldestBlock),
      // @ts-expect-error: todo fix
      reward: _.map(feeHistoryRaw.reward, (b) => BigInt(b[0])),
    }

    const nextBlockBaseFeePerGas =
      feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1]

    const averagePriorityFeePerGas =
      BigInt(
        _.reduce(
          feeHistory.reward,
          (sum: bigint, cur: bigint) => BigInt(sum) + BigInt(cur),
          BigInt(0)
        )
      ) / BigInt(feeHistory.reward.length)

    log.info(
      LogCodes.GAS_ESTIMATE,
      "Got fee history from provider and computed gas estimate",
      {
        feeHistory,
        feeHistoryReadable: {
          baseFeePerGas: _.map(feeHistory.baseFeePerGas, (f) => f.toString()),
          oldestBlock: feeHistory.oldestBlock.toString(),
          reward: _.map(feeHistory.reward, (r) => r.toString()),
        },
        nextBlockBaseFeePerGas: nextBlockBaseFeePerGas?.toString(),
        averagePriorityFeePerGas: averagePriorityFeePerGas.toString(),
      }
    )

    const gasPriceWei =
      BigInt(nextBlockBaseFeePerGas!) + BigInt(averagePriorityFeePerGas)

    const blockNumber =
      BigInt(feeHistory.oldestBlock) + BigInt(this.blocksToConsider)

    log.info(
      LogCodes.GAS_ESTIMATE,
      `Estimated gas price in wei: ${gasPriceWei} as of block ${blockNumber.toString()}`
    )

    return { gasPriceWei: gasPriceWei }
  }
}
