/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import retry from "async-retry"
import Timeout from "await-timeout"
import axios from "axios"

import type { ChainId } from "@x7/utils"
import { LogCodes } from "@x7/utils"

import { log } from "../utils/log"

import type { V2SubgraphPool } from "./v2/subgraph-provider"
import type { V3SubgraphPool } from "./v3/subgraph-provider"

/**
 * Gets subgraph pools from a URI. The URI shoudl contain a JSON
 * stringified array of V2SubgraphPool objects or V3SubgraphPool
 * objects.
 *
 * @export
 * @class URISubgraphProvider
 * @template TSubgraphPool
 */
export class URISubgraphProvider<
  TSubgraphPool extends V2SubgraphPool | V3SubgraphPool,
> {
  constructor(
    private chainId: ChainId,
    private uri: string,
    private timeout = 6000,
    private retries = 2
  ) {}

  public async getPools(): Promise<TSubgraphPool[]> {
    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      { uri: this.uri },
      `Fetching subgraph pools from URI ${this.uri}`
    )

    let allPools: TSubgraphPool[] = []

    await retry(
      async () => {
        const timeout = new Timeout()
        const timerPromise = timeout.set(this.timeout).then(() => {
          throw new Error(
            `Timed out getting pools from subgraph: ${this.timeout}`
          )
        })

        let response

        try {
          response = await Promise.race([axios.get(this.uri), timerPromise])
          // oxlint-disable-next-line no-useless-catch
        } catch (error) {
          throw error
        } finally {
          timeout.clear()
        }

        const { data: poolsBuffer, status } = response

        if (status !== 200) {
          log.error(LogCodes.FAIL, `Unabled to get pools from ${this.uri}.`, {
            response,
          })

          throw new Error(`Unable to get pools from ${this.uri}`)
        }

        const pools = poolsBuffer as TSubgraphPool[]

        allPools = pools
      },
      {
        retries: this.retries,
        onRetry: (err, retry) => {
          log.info(
            LogCodes.FAIL,
            `Failed to get pools from uri ${this.uri}. Retry attempt: ${retry}`,
            { err }
          )
        },
      }
    )

    return allPools
  }
}
