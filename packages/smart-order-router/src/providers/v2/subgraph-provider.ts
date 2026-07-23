/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
/* oxlint-disable @typescript-eslint/restrict-template-expressions */

/* oxlint-disable @typescript-eslint/no-base-to-string */
import retry from "async-retry"
import Timeout from "await-timeout"
import { gql, GraphQLClient } from "graphql-request"
import _ from "lodash"

import {
  DAI_ADDRESS,
  generateX7SubgraphByChainId,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from "@x7/sdk"
import type { ChainId, Implementation, Token } from "@x7/utils"
import { LogCodes } from "@x7/utils"

import { log } from "../../utils/log"
import type { ProviderConfig } from "../provider"

export interface V2SubgraphPool {
  id: string
  token0: {
    id: string
  }
  token1: {
    id: string
  }
  supply: number
  reserve: number
  reserveUSD: number
}

interface RawV2SubgraphPool {
  id: string
  realId: string
  token0: {
    symbol: string
    id: string
  }
  token1: {
    symbol: string
    id: string
  }
  totalSupply: string
  trackedReserveETH: string
  reserveUSD: string
}

const PAGE_SIZE = 1000 // 1k is max possible query size from subgraph.

/**
 * Provider for getting V2 pools from the Subgraph
 *
 * @export
 * @interface IV2SubgraphProvider
 */
export interface IV2SubgraphProvider {
  getPools(
    tokenIn?: Token,
    tokenOut?: Token,
    providerConfig?: ProviderConfig
  ): Promise<V2SubgraphPool[]>
}

export class V2SubgraphProvider implements IV2SubgraphProvider {
  private client: GraphQLClient | null
  private commonTokens: Set<string>
  private maxPoolsForCommonTokens = 1000
  private commonTokenPageSize = 500 // Smaller page size for common tokens
  private maxPagesPerCommonToken = 5 // Maximum number of pages to query for common tokens

  constructor(
    private chainId: ChainId,
    private enabledImplementations: Implementation[],
    private retries = 2,
    private timeout = 360000,
    private rollback = true,
    private pageSize = PAGE_SIZE
  ) {
    const subgraphUrl = generateX7SubgraphByChainId(this.chainId)
    if (!subgraphUrl) {
      this.client = null
    } else {
      this.client = new GraphQLClient(subgraphUrl)
    }

    // Initialize set of common tokens
    this.commonTokens = new Set(
      [
        WETH_ADDRESS[this.chainId as keyof typeof WETH_ADDRESS],
        USDC_ADDRESS[this.chainId as keyof typeof USDC_ADDRESS],
        DAI_ADDRESS[this.chainId as keyof typeof DAI_ADDRESS],
        USDT_ADDRESS[this.chainId as keyof typeof USDT_ADDRESS],
      ]
        // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .filter((a) => a && a.length > 0)
        .map((address) => {
          return address.toLowerCase()
        })
    )
  }

  public async getPools(
    _tokenIn?: Token,
    _tokenOut?: Token,
    providerConfig?: ProviderConfig
  ): Promise<V2SubgraphPool[]> {
    if (!this.client) {
      return []
    }

    let blockNumber = providerConfig?.blockNumber
      ? await providerConfig.blockNumber
      : undefined
    // Due to limitations with the Subgraph API this is the only way to parameterize the query.
    // {
    //   or: [
    //     { or: [{ token0: $token0 }, { token1: $token1 }] }
    //     { or: [{ token0: $token1 }, { token1: $token0 }] }
    //   ]
    // }
    // { or: [{ token0: $token0 }, { token1: $token0 }] }
    // { or: [{ token0: $token1 }, { token1: $token1 }] }
    const query2 = gql`
      query getPools(
        $pageSize: Int!
        $id: Bytes
        $token0: Bytes
        $token1: Bytes
        $allowedImps: [String!]
      ) {
        pairCreateds(
          orderBy: id
          orderDirection: asc
          first: $pageSize
          where: {
            and: [
              { id_gt: $id }
              { factory_in: $allowedImps }
              {
                or: [
                  { or: [{ token0: $token0 }, { token1: $token1 }] }
                  { or: [{ token0: $token1 }, { token1: $token0 }] }
                ]
              }
            ]
          }
        ) {
          realId: id
          id: pair
          token0
          token1
          transactionHash
          factory
          blockTimestamp
        }
      }
    `

    let pools: RawV2SubgraphPool[] = []

    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      `Fetching V2 pools from subgraph with page size ${this.pageSize}${
        providerConfig?.blockNumber
          ? ` as of block ${providerConfig.blockNumber}`
          : ""
      }.`
    )

    await retry(
      async () => {
        const timeout = new Timeout()

        const getPools = async (): Promise<RawV2SubgraphPool[]> => {
          let lastId = ""
          let pairs: RawV2SubgraphPool[] = []
          let pairsPage: RawV2SubgraphPool[] = []
          let pageCount = 0

          const isCommonToken =
            (_tokenIn &&
              this.commonTokens.has(_tokenIn.address.toLowerCase())) ||
            (_tokenOut &&
              this.commonTokens.has(_tokenOut.address.toLowerCase()))

          // Adjust page size and threshold based on token type
          const effectivePageSize = isCommonToken
            ? this.commonTokenPageSize
            : this.pageSize
          const maxPages = isCommonToken
            ? this.maxPagesPerCommonToken
            : Infinity

          do {
            pageCount++

            // Add delay between requests for common tokens
            if (isCommonToken && pageCount > 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 second delay
            }

            const poolsResult = await this.client?.request<{
              pairCreateds: RawV2SubgraphPool[]
            }>(query2, {
              pageSize: effectivePageSize,
              id: lastId,
              token0: _tokenIn?.address,
              token1: _tokenOut?.address,
              allowedImps: this.enabledImplementations.map((imp) =>
                imp.toLowerCase()
              ),
            })

            pairsPage = poolsResult?.pairCreateds ?? []
            pairs = pairs.concat(pairsPage)
            lastId = pairs[pairs.length - 1]?.realId ?? ""

            log.info(
              LogCodes.FETCHING_SUBGRAPH_POOLS,
              `V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.pageSize_${effectivePageSize} (page ${pageCount})`
            )

            // Break if we've reached either the page limit or pool threshold
            if (
              pageCount >= maxPages ||
              pairs.length >= this.maxPoolsForCommonTokens
            ) {
              log.info(
                LogCodes.FETCHING_SUBGRAPH_POOLS,
                `Breaking early: ${pageCount}/${maxPages} pages, ${pairs.length} pools`
              )
              break
            }
          } while (pairsPage.length > 0)

          return pairs
        }

        try {
          const getPoolsPromise = getPools()
          const timerPromise = timeout.set(this.timeout).then(() => {
            throw new Error(
              `Timed out getting pools from subgraph: ${this.timeout}`
            )
          })
          pools = await Promise.race([getPoolsPromise, timerPromise])
          return
          // oxlint-disable-next-line no-useless-catch
        } catch (error) {
          throw error
        } finally {
          timeout.clear()
        }
      },
      {
        retries: this.retries,
        onRetry: (err: Error, retryAttempt: number) => {
          if (
            this.rollback &&
            blockNumber &&
            err.message.includes("indexed up to")
          ) {
            blockNumber = Number(BigInt(blockNumber) - BigInt(10))
            log.error(
              LogCodes.FAIL,
              `Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`
            )
          }
          pools = []
          log.error(
            LogCodes.FAIL,
            `Failed to get pools from subgraph. Retry attempt: ${retryAttempt}`,
            { err }
          )
        },
      }
    )

    // Filter pools that have tracked reserve ETH less than threshold.
    // trackedReserveETH filters pools that do not involve a pool from this allowlist:
    // https://github.com/Uniswap/v2-subgraph/blob/7c82235cad7aee4cfce8ea82f0030af3d224833e/src/mappings/pricing.ts#L43
    // Which helps filter pools with manipulated prices/liquidity.

    // TODO: explain
    // TODO: Remove. Temporary fix to ensure tokens without trackedReserveETH are in the list.
    // const FEI = "0x956f47f50a910163d8bf957cf5846d573e7f87ca";

    const poolsSanitized: V2SubgraphPool[] = pools.map((pool) => {
      return {
        ...pool,
        id: pool.id.toLowerCase(),
        token0: {
          id: pool.token0.id.toLowerCase(),
        },
        token1: {
          id: pool.token1.id.toLowerCase(),
        },
        supply: 0,
        reserve: 0,
        reserveUSD: 0,
      }
    })

    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      `Found ${pools.length} V2 pools from the subgraph. ${poolsSanitized.length} after filtering`
    )

    return poolsSanitized
  }
}
