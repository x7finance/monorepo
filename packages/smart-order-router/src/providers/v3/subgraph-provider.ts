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
import type { V2SubgraphPool } from "../v2/subgraph-provider"

export interface V3SubgraphPool {
  id: string
  feeTier: string
  liquidity: string
  factory: string
  token0: {
    id: string
  }
  token1: {
    id: string
  }
  tvlETH: number
  tvlUSD: number
}

interface RawV3SubgraphPool {
  id: string
  realId: string
  feeTier: string
  factory: string
  liquidity: string
  token0: {
    symbol: string
    id: string
  }
  token1: {
    symbol: string
    id: string
  }
  totalValueLockedUSD: string
  totalValueLockedETH: string
}

export const printV3SubgraphPool = (s: V3SubgraphPool) =>
  `${s.token0.id}/${s.token1.id}/${s.feeTier}`

export const printV2SubgraphPool = (s: V2SubgraphPool) =>
  `${s.token0.id}/${s.token1.id}`

const PAGE_SIZE = 1000 // 1k is max possible query size from subgraph.

/**
 * Provider for getting V3 pools from the Subgraph
 *
 * @export
 * @interface IV3SubgraphProvider
 */
export interface IV3SubgraphProvider {
  getPools(
    tokenIn?: Token,
    tokenOut?: Token,
    providerConfig?: ProviderConfig
  ): Promise<V3SubgraphPool[]>
}

export class V3SubgraphProvider implements IV3SubgraphProvider {
  private client: GraphQLClient | null
  private commonTokens: Set<string>
  private maxPoolsForCommonTokens = 1000

  constructor(
    private chainId: ChainId,
    private enabledImplementations: Implementation[],
    private retries = 2,
    private timeout = 30000,
    private rollback = true
  ) {
    const subgraphUrl = generateX7SubgraphByChainId(this.chainId)

    if (!subgraphUrl) {
      this.client = null
    } else {
      this.client = new GraphQLClient(subgraphUrl)
    }

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
  ): Promise<V3SubgraphPool[]> {
    if (!this.client) {
      return []
    }

    let blockNumber = providerConfig?.blockNumber
      ? await providerConfig.blockNumber
      : undefined

    // Note: This is a different query, we gonna rock with this to avoid spam.
    const query = gql`
      query getPools(
        $pageSize: Int!
        $id: Bytes
        $token0: Bytes
        $token1: Bytes
        $allowedImps: [String!]
      ) {
        poolCreateds(
          orderBy: id
          orderDirection: asc
          first: $pageSize
          where: {
            and: [
              { id_gt: $id }
              { or: [{ token0: $token0 }, { token1: $token0 }] }
              { or: [{ token0: $token1 }, { token1: $token1 }] }
              { factory_in: $allowedImps }
            ]
          }
        ) {
          realId: id
          id: pair
          token0
          token1
          transactionHash
          tickSpacing
          fee
          factory
          blockTimestamp
          blockNumber
        }
      }
    `

    let pools: RawV3SubgraphPool[] = []

    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      `Getting V3 pools from the subgraph with page size ${PAGE_SIZE}${
        providerConfig?.blockNumber
          ? ` as of block ${providerConfig.blockNumber}`
          : ""
      }.`
    )

    await retry(
      async () => {
        const timeout = new Timeout()

        const getPools = async (): Promise<RawV3SubgraphPool[]> => {
          let lastId = ""
          let pools: RawV3SubgraphPool[] = []
          let poolsPage: RawV3SubgraphPool[] = []
          const isCommonToken =
            (_tokenIn &&
              // oxlint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              this.commonTokens.has(_tokenIn.address.toLowerCase())) ||
            (_tokenOut &&
              this.commonTokens.has(_tokenOut.address.toLowerCase()))

          do {
            const poolsResult = await this.client?.request<{
              poolCreateds: RawV3SubgraphPool[]
            }>(query, {
              pageSize: PAGE_SIZE,
              id: lastId,
              token0: _tokenIn?.wrapped.address,
              token1: _tokenOut?.wrapped.address,
              allowedImps: this.enabledImplementations.map((imp) =>
                imp.toLowerCase()
              ),
            })

            poolsPage = poolsResult?.poolCreateds ?? []

            pools = pools.concat(poolsPage)

            lastId = pools[pools.length - 1]?.realId ?? ""

            if (isCommonToken && pools.length >= this.maxPoolsForCommonTokens) {
              log.info(
                LogCodes.FETCHING_SUBGRAPH_POOLS,
                `Found ${pools.length} common token pools. Breaking early.`
              )
              break
            }
          } while (poolsPage.length > 0)

          return pools
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
            _.includes(err.message, "indexed up to")
          ) {
            blockNumber = Number(blockNumber) - 10
            log.error(
              LogCodes.SUBGRAPH_INDEXING_ERROR,
              `Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`
            )
          }
          pools = []
          log.error(
            LogCodes.SUBGRAPH_INDEXING_ERROR,
            `Failed to get pools from subgraph. Retry attempt: ${retryAttempt}`,
            { err }
          )
        },
      }
    )

    const poolsSanitized = pools.map((pool) => {
      return {
        ...pool,
        id: pool.id.toLowerCase(),
        token0: {
          id: pool.token0.id.toLowerCase(),
        },
        token1: {
          id: pool.token1.id.toLowerCase(),
        },
        factory: pool.factory,
        tvlETH: 0,
        tvlUSD: 0,
      }
    })

    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      `Got ${pools.length} V3 pools from the subgraph. ${poolsSanitized.length} after filtering`
    )

    return poolsSanitized
  }
}
