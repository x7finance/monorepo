import type { GasPrice } from "./gas-price-provider"

import retry from "async-retry"
import axios from "axios"

import { LogCodes } from "@x7/utils"

import { log } from "../utils/log"

import { IGasPriceProvider } from "./gas-price-provider"

// Gas prices from ethgasstation are in x10 Gwei. Must divide by 10 to use.
export interface ETHGasStationResponse {
  fast: number
  fastest: number
  safeLow: number
  average: number
  block_time: number
  blockNum: number
  speed: number
  safeLowWait: number
  avgWait: number
  fastWait: number
  fastestWait: number
}

export class ETHGasStationInfoProvider extends IGasPriceProvider {
  private url: string
  constructor(url: string) {
    super()
    this.url = url
  }

  public async getGasPrice(): Promise<GasPrice> {
    const response = await retry(
      async () => {
        return axios.get<ETHGasStationResponse>(this.url)
      },
      { retries: 1 }
    )

    const { data: gasPriceResponse, status } = response

    if (status !== 200) {
      log.error(LogCodes.FAIL, `Unabled to get gas price from ${this.url}.`, {
        response,
      })

      throw new Error(`Unable to get gas price from ${this.url}`)
    }

    // Gas prices from ethgasstation are in GweiX10.
    const gasPriceWei =
      (BigInt(gasPriceResponse.fast) / BigInt(10)) * BigInt(10) ** BigInt(9)

    return { gasPriceWei: gasPriceWei }
  }
}
