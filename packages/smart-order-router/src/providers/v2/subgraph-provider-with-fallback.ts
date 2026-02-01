/* oxlint-disable @typescript-eslint/no-unused-vars */
import { LogCodes } from "@x7/utils";
import type { Token } from "@x7/utils";

import { log } from "../../utils/log";
import type { ProviderConfig } from "../provider";
import type { IV2SubgraphProvider, V2SubgraphPool } from "./subgraph-provider";

/**
 * Provider for getting V2 subgraph pools that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class V2SubgraphProviderWithFallBacks
 */
export class V2SubgraphProviderWithFallBacks implements IV2SubgraphProvider {
  /**
   * Creates an instance of V2SubgraphProviderWithFallBacks.
   * @param fallbacks Ordered list of `IV2SubgraphProvider` to try to get pools from.
   */
  constructor(private fallbacks: IV2SubgraphProvider[]) {}

  public async getPools(
    tokenIn?: Token,
    tokenOut?: Token,
    providerConfig?: ProviderConfig,
  ): Promise<V2SubgraphPool[]> {
    for (let i = 0; i < this.fallbacks.length; i++) {
      const provider = this.fallbacks[i];
      if (provider === undefined) {
        throw new Error("Undefined provider in fallbacks");
      }

      try {
        const pools = await provider.getPools(
          tokenIn,
          tokenOut,
          providerConfig,
        );
        return pools;
      } catch (error) {
        log.error(
          LogCodes.FAIL,
          `Failed to get subgraph pools for V2 from fallback #${i}`,
        );
      }
    }

    return [];
    //throw new Error("Failed to get subgraph pools from any providers");
  }
}
