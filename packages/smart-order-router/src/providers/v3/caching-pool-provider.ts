import type { ICache } from "../cache"
import type { ProviderConfig } from "../provider"
import type {
  IV3PoolProvider,
  V3ImplementationPair,
  V3PoolAccessor,
} from "./pool-provider"
import type { FeeAmount, Pool } from "@x7/sdk"
import type { ChainId, Token } from "@x7/utils"

import _ from "lodash"

import { LogCodes } from "@x7/utils"

import { log } from "../../utils/log"
import { metric, MetricLoggerUnit } from "../../utils/metric"

/**
 * Provider for getting V3 pools, with functionality for caching the results.
 * Does not cache by block because we compute quotes using the on-chain quoter
 * so do not mind if the liquidity values are out of date.
 *
 * @export
 * @class CachingV3PoolProvider
 */
export class CachingV3PoolProvider implements IV3PoolProvider {
  private POOL_KEY = (chainId: ChainId, address: string) =>
    `pool-${chainId}-${address}`

  /**
   * Creates an instance of CachingV3PoolProvider.
   * @param chainId The chain id to use.
   * @param poolProvider The provider to use to get the pools when not in the cache.
   * @param cache Cache instance to hold cached pools.
   */
  constructor(
    protected chainId: ChainId,
    protected poolProvider: IV3PoolProvider,
    private cache: ICache<Pool>
  ) {}

  public async getPools(
    tokenPairs: [Token, Token, FeeAmount][],
    providerConfig?: ProviderConfig
  ): Promise<V3PoolAccessor> {
    const poolAddressSet: Set<string> = new Set<string>()
    const poolsToGetTokenPairs: [Token, Token, FeeAmount][] = []
    const poolsToGetAddresses: string[] = []
    const poolAddressToPool: Record<string, Pool> = {}

    for (const [tokenA, tokenB, feeAmount] of tokenPairs) {
      const { poolAddresses, token0, token1 } = this.getPoolAddresses(
        tokenA,
        tokenB,
        feeAmount,
        providerConfig?.forceAllImplementations ?? false
      )

      if (
        poolAddresses.filter((impPair) => poolAddressSet.has(impPair.address))
          .length > 0
      ) {
        continue
      }

      poolAddresses.forEach(
        (impPair) => poolAddressSet.add(impPair.address),
        poolAddressSet
      )

      const cachedPools = await Promise.all(
        poolAddresses.map(async (impPair) => ({
          address: impPair.address,
          fee: impPair.fee,
          cache: await this.cache.get(
            this.POOL_KEY(this.chainId, impPair.address)
          ),
        }))
      )

      if (cachedPools.filter((c) => !!c.cache).length > 0) {
        metric.putMetric(
          "V3_INMEMORY_CACHING_POOL_HIT_IN_MEMORY",
          1,
          MetricLoggerUnit.None
        )
        cachedPools
          .filter((pool) => !!pool.cache)
          .forEach((cachedPool) => {
            // oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
            poolAddressToPool[cachedPool.address] = cachedPool.cache!
          })
        continue
      }

      metric.putMetric(
        "V3_INMEMORY_CACHING_POOL_MISS_NOT_IN_MEMORY",
        1,
        MetricLoggerUnit.None
      )
      poolsToGetTokenPairs.push([token0, token1, feeAmount])
      poolAddresses.forEach((impPair) =>
        poolsToGetAddresses.push(impPair.address)
      )
    }

    log.info(
      LogCodes.CACHE_HIT,
      `Found ${
        Object.keys(poolAddressToPool).length
      } V3 pools already in local cache. About to get liquidity and slot0s for ${
        poolsToGetTokenPairs.length
      } pools.`,
      {
        poolsFound: _.map(Object.values(poolAddressToPool), (p) => {
          return `${p.token0.symbol} ${p.token1.symbol} ${p.fee}`
        }),
        poolsToGetTokenPairs: _.map(poolsToGetTokenPairs, (t) => {
          return `${t[0].symbol} ${t[1].symbol} ${t[2]}`
        }),
      }
    )

    if (poolsToGetAddresses.length > 0) {
      const poolAccessor = await this.poolProvider.getPools(
        poolsToGetTokenPairs,
        providerConfig
      )
      for (const address of poolsToGetAddresses) {
        const pool = poolAccessor.getPoolByAddress(address)
        if (pool) {
          poolAddressToPool[address] = pool
          // We don't want to wait for this caching to complete before returning the pools.
          void this.cache.set(this.POOL_KEY(this.chainId, address), pool)
        }
      }
    }

    return {
      getPool: (
        tokenA: Token,
        tokenB: Token,
        feeAmount: FeeAmount
      ): (Pool | undefined)[] => {
        const { poolAddresses } = this.getPoolAddresses(
          tokenA,
          tokenB,
          feeAmount,
          providerConfig?.forceAllImplementations ?? false
        )
        return poolAddresses.map(
          (impPair) => poolAddressToPool[impPair.address] ?? undefined
        )
      },
      getPoolByAddress: (address: string): Pool | undefined =>
        poolAddressToPool[address],
      getAllPools: (): Pool[] => Object.values(poolAddressToPool),
    }
  }

  public getPoolAddress(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount
  ): { poolAddress: V3ImplementationPair; token0: Token; token1: Token } {
    return this.poolProvider.getPoolAddress(tokenA, tokenB, feeAmount)
  }

  public getPoolAddresses(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
    forceAllImplementations = false
  ): { poolAddresses: V3ImplementationPair[]; token0: Token; token1: Token } {
    return this.poolProvider.getPoolAddresses(
      tokenA,
      tokenB,
      feeAmount,
      forceAllImplementations
    )
  }
}
