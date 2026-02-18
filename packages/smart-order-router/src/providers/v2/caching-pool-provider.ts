/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import _ from "lodash"

import type { Pair } from "@x7/sdk"
import type { ChainId, Implementation, Token } from "@x7/utils"
import { LogCodes } from "@x7/utils"

import { log } from "../../utils/log"
import type { ICache } from "../cache"
import type { ProviderConfig } from "../provider"

import type {
  ImplementationPair,
  IV2PoolProvider,
  V2PoolAccessor,
} from "./pool-provider"

/**
 * Provider for getting V2 pools, with functionality for caching the results per block.
 *
 * @export
 * @class CachingV2PoolProvider
 */
export class CachingV2PoolProvider implements IV2PoolProvider {
  private POOL_KEY = (
    chainId: ChainId,
    address: string,
    implementation: Implementation
  ) => `pool-${chainId}-${address}-${implementation}`

  /**
   * Creates an instance of CachingV3PoolProvider.
   * @param chainId The chain id to use.
   * @param poolProvider The provider to use to get the pools when not in the cache.
   * @param cache Cache instance to hold cached pools.
   */
  constructor(
    protected chainId: ChainId,
    protected poolProvider: IV2PoolProvider,
    // Cache is block aware. For V2 pools we need to use the current blocks reserves values since
    // we compute quotes off-chain.
    // If no block is specified in the call to getPools we just return whatever is in the cache.
    private cache: ICache<{ pair: Pair; block?: number }>
  ) {}

  public async getPools(
    tokenPairs: [Token, Token][],
    providerConfig?: ProviderConfig
  ): Promise<V2PoolAccessor> {
    const poolAddressSet: Set<string> = new Set<string>()
    const poolsToGetTokenPairs: [Token, Token][] = []
    const poolsToGetAddresses: string[] = []
    const poolAddressToPool: Record<string, Pair> = {}

    const blockNumber = await providerConfig?.blockNumber

    for (const [tokenA, tokenB] of tokenPairs) {
      const { poolAddresses, token0, token1 } = this.getPoolAddresses(
        tokenA,
        tokenB,
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
          implementation: impPair.implementation,
          cache: await this.cache.get(
            this.POOL_KEY(this.chainId, impPair.address, impPair.implementation)
          ),
        }))
      )
      if (cachedPools) {
        // If a block was specified by the caller, ensure that the result in our cache matches the
        // expected block number. If a block number is not specified, just return whatever is in the
        // cache.
        if (
          !blockNumber ||
          (blockNumber &&
            cachedPools.filter(
              (cachedPool) =>
                cachedPool.cache && cachedPool.cache.block === blockNumber
            ).length > 0)
        ) {
          cachedPools
            .filter(
              (cachedPool) =>
                !blockNumber ||
                (!!blockNumber &&
                  cachedPool?.cache &&
                  cachedPool?.cache?.block === blockNumber)
            )
            .filter((cachedPool) => !!cachedPool?.cache)
            .forEach((cachedPool) => {
              poolAddressToPool[cachedPool.address] = cachedPool.cache!.pair
            })
          continue
        }
      }

      poolsToGetTokenPairs.push([token0, token1])
      poolAddresses.forEach((impPair) =>
        poolsToGetAddresses.push(impPair.address)
      )
    }

    log.info(
      LogCodes.CACHE_HIT,
      `Found ${
        Object.keys(poolAddressToPool).length
      } V2 pools already in local cache for block ${blockNumber}. About to get reserves for ${
        poolsToGetTokenPairs.length
      } pools.`,
      {
        poolsFound: _.map(
          Object.values(poolAddressToPool),
          (p) => p.token0.symbol + " " + p.token1.symbol
        ),
        poolsToGetTokenPairs: _.map(
          poolsToGetTokenPairs,
          (t) => t[0].symbol + " " + t[1].symbol
        ),
      }
    )

    if (poolsToGetAddresses.length > 0) {
      const poolAccessor = await this.poolProvider.getPools(
        poolsToGetTokenPairs,
        {
          ...providerConfig,
          enableFeeOnTransferFeeFetching: true,
        }
      )
      for (const address of poolsToGetAddresses) {
        const pool = poolAccessor.getPoolByAddress(address)
        if (pool) {
          poolAddressToPool[address] = pool
          // We don't want to wait for this caching to complete before returning the pools.
          void this.cache.set(
            this.POOL_KEY(this.chainId, address, pool.pairType),
            {
              pair: pool,
              block: Number(blockNumber),
            }
          )
        }
      }
    }

    return {
      getPool: (tokenA: Token, tokenB: Token): (Pair | undefined)[] => {
        const { poolAddresses } = this.getPoolAddresses(
          tokenA,
          tokenB,
          providerConfig?.forceAllImplementations ?? false
        )
        return poolAddresses.map(
          (impPair) => poolAddressToPool[impPair.address] ?? undefined
        )
      },
      getPoolByAddress: (address: string): Pair | undefined =>
        poolAddressToPool[address],
      getAllPools: (): Pair[] => Object.values(poolAddressToPool),
    }
  }

  public getPoolAddress(
    tokenA: Token,
    tokenB: Token
  ): { poolAddress: ImplementationPair; token0: Token; token1: Token } {
    return this.poolProvider.getPoolAddress(tokenA, tokenB)
  }

  public getPoolAddresses(
    tokenA: Token,
    tokenB: Token,
    forceAllImplementations = false
  ): { poolAddresses: ImplementationPair[]; token0: Token; token1: Token } {
    return this.poolProvider.getPoolAddresses(
      tokenA,
      tokenB,
      forceAllImplementations
    )
  }
}
