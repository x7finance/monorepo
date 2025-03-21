import { LogCodes } from "@x7/utils";
import type { ChainId, Token } from "@x7/utils";

import { log } from "../../utils";
import type { ICache } from "../cache";
import type { ProviderConfig } from "../provider";
import type { IV3SubgraphProvider, V3SubgraphPool } from "./subgraph-provider";

/**
 * Provider for getting V3 pools, with functionality for caching the results.
 *
 * @export
 * @class CachingV3SubgraphProvider
 */
export class CachingV3SubgraphProvider implements IV3SubgraphProvider {
  private SUBGRAPH_KEY = (chainId: ChainId) => `subgraph-pools-${chainId}`;

  /**
   * Creates an instance of CachingV3SubgraphProvider.
   * @param chainId The chain id to use.
   * @param subgraphProvider The provider to use to get the subgraph pools when not in the cache.
   * @param cache Cache instance to hold cached pools.
   */
  constructor(
    private chainId: ChainId,
    protected subgraphProvider: IV3SubgraphProvider,
    private cache: ICache<V3SubgraphPool[]>,
  ) {}

  public async getPools(
    _tokenIn?: Token,
    _tokenOut?: Token,
    providerConfig?: ProviderConfig,
  ): Promise<V3SubgraphPool[]> {
    const cachedPools = await this.cache.get(this.SUBGRAPH_KEY(this.chainId));

    // console.log("cachedPools", cachedPools);
    if (cachedPools) {
      log.info(LogCodes.SUBGRAPH_V3_CACHE_HIT, `SubgraphV3 Cache Hit`, {
        cachedPools,
      });
      return cachedPools;
    } else {
      const pools = await this.subgraphProvider.getPools(
        _tokenIn,
        _tokenOut,
        providerConfig,
      );
      log.info(LogCodes.SUBGRAPH_V3_CACHE_MISS, `SubgraphV3 Cache Miss`, {
        pools,
      });

      await this.cache.set(this.SUBGRAPH_KEY(this.chainId), pools);

      return pools;
    }
  }
}
