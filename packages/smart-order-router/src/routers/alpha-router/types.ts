import type { Protocol } from "@x7/utils"

import type { CacheMode } from "../../providers/caching/route/model/cache-mode"

export class MapWithLowerCaseKey<V> extends Map<string, V> {
  override set(key: string, value: V): this {
    return super.set(key.toLowerCase(), value)
  }
}

/**
 * Determines the pools that the algorithm will consider when finding the optimal swap.
 *
 * All pools on each protocol are filtered based on the heuristics specified here to generate
 * the set of candidate pools. The Top N pools are taken by Total Value Locked (TVL).
 *
 * Higher values here result in more pools to explore which results in higher latency.
 */
export interface ProtocolPoolSelection {
  /**
   * The top N pools by TVL out of all pools on the protocol.
   */
  topN: number
  /**
   * The top N pools by TVL of pools that consist of tokenIn and tokenOut.
   */
  topNDirectSwaps: number
  /**
   * The top N pools by TVL of pools where one token is tokenIn and the
   * top N pools by TVL of pools where one token is tokenOut tokenOut.
   */
  topNTokenInOut: number
  /**
   * Given the topNTokenInOut pools, gets the top N pools that involve the other token.
   * E.g. for a WETH -> USDC swap, if topNTokenInOut found WETH -> DAI and WETH -> USDT,
   * a value of 2 would find the top 2 pools that involve DAI and top 2 pools that involve USDT.
   */
  topNSecondHop: number
  /**
   * Given the topNTokenInOut pools and a token address,
   * gets the top N pools that involve the other token.
   * If token address is not on the list, we default to topNSecondHop.
   * E.g. for a WETH -> USDC swap, if topNTokenInOut found WETH -> DAI and WETH -> USDT,
   * and there's a mapping USDT => 4, but no mapping for DAI
   * it would find the top 4 pools that involve USDT, and find the topNSecondHop pools that involve DAI
   */
  topNSecondHopForTokenAddress?: MapWithLowerCaseKey<number>
  /**
   * The top N pools for token in and token out that involve a token from a list of
   * hardcoded 'base tokens'. These are standard tokens such as WETH, USDC, DAI, etc.
   * This is similar to how the legacy routing algorithm used by Uniswap would select
   * pools and is intended to make the new pool selection algorithm close to a superset
   * of the old algorithm.
   */
  topNWithEachBaseToken: number
  /**
   * Given the topNWithEachBaseToken pools, takes the top N pools from the full list.
   * E.g. for a WETH -> USDC swap, if topNWithEachBaseToken found WETH -0.05-> DAI,
   * WETH -0.01-> DAI, WETH -0.05-> USDC, WETH -0.3-> USDC, a value of 2 would reduce
   * this set to the top 2 pools from that full list.
   */
  topNWithBaseToken: number
}

export interface AlphaRouterConfig {
  /**
   * The block number to use for all on-chain data. If not provided, the router will
   * use the latest block returned by the provider.
   */
  blockNumber?: number | Promise<number>
  /**
   * The protocols to consider when finding the optimal swap. If not provided all protocols
   * will be used.
   */
  protocols?: Protocol[]
  /**
   * Config for selecting which pools to consider routing via on V2.
   */
  v2PoolSelection: ProtocolPoolSelection
  /**
   * Config for selecting which pools to consider routing via on V3.
   */
  v3PoolSelection: ProtocolPoolSelection
  /**
   * For each route, the maximum number of hops to consider. More hops will increase latency of the algorithm.
   */
  maxSwapsPerPath: number
  /**
   * The maximum number of splits in the returned route. A higher maximum will increase latency of the algorithm.
   */
  maxSplits: number
  /**
   * The minimum number of splits in the returned route.
   * This parameters should always be set to 1. It is only included for testing purposes.
   */
  minSplits: number
  /**
   * Forces the returned swap to route across all protocols.
   * This parameter should always be false. It is only included for testing purposes.
   */
  forceCrossProtocol: boolean
  /**
   * Force the alpha router to choose a mixed route swap.
   * Default will be falsy. It is only included for testing purposes.
   */
  forceMixedRoutes?: boolean
  /**
   * The minimum percentage of the input token to use for each route in a split route.
   * All routes will have a multiple of this value. For example is distribution percentage is 5,
   * a potential return swap would be:
   *
   * 5% of input => Route 1
   * 55% of input => Route 2
   * 40% of input => Route 3
   */
  distributionPercent: number
  /**
   * Flag to indicate whether to use the cached routes or not.
   * By default, the cached routes will be used.
   */
  useCachedRoutes?: boolean
  /**
   * Flag to indicate whether to write to the cached routes or not.
   * By default, the cached routes will be written to.
   */
  writeToCachedRoutes?: boolean
  /**
   * Flag to indicate whether to use the CachedRoutes in optimistic mode.
   * Optimistic mode means that we will allow blocksToLive greater than 1.
   */
  optimisticCachedRoutes?: boolean
  /**
   * Debug param that helps to see the short-term latencies improvements without impacting the main path.
   */
  debugRouting?: boolean
  /**
   * Flag that allow us to override the cache mode.
   */
  overwriteCacheMode?: CacheMode
  /**
   * Flag for token properties provider to enable fetching fee-on-transfer tokens.
   */
  enableFeeOnTransferFeeFetching?: boolean
  /**
   * Tenderly natively support save simulation failures if failed,
   * we need this as a pass-through flag to enable/disable this feature.
   */
  saveTenderlySimulationIfFailed?: boolean
  /**
   * Ignore these pools when finding the best route.
   * E.g. if a pool is causing a bad experience for a user, we can recall route with ignoring this list.
   */
  ignoreThesePools?: { v2?: string[]; v3?: string[] }
  attemptCount?: number
}
