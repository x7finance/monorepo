/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import type { PublicClient } from "viem"

import type { ChainId } from "@x7/utils"
import { Implementation, LogCodes } from "@x7/utils"

import type { V2Route } from "../routers/route-types"
import type { SwapOptions, SwapRoute } from "../routers/router"
import { SwapType } from "../routers/router"
import {
  calculateGasUsed,
  initSwapRouteFromExisting,
} from "../utils/gas-factory-helpers"
import { log } from "../utils/log"
import type { ViemProviderType } from "../utils/viemHelpers"

import type { IPortionProvider } from "./portion-provider"
import type { ProviderConfig } from "./provider"
import { SimulationStatus, Simulator } from "./simulation-provider"
import type { IV2PoolProvider } from "./v2/pool-provider"
import type { ArbitrumGasData, OptimismGasData } from "./v3/gas-data-provider"
import type { IV3PoolProvider } from "./v3/pool-provider"

// We multiply eth estimate gas by this to add a buffer for gas limits
const DEFAULT_ESTIMATE_MULTIPLIER = 1

export class EthEstimateGasSimulator extends Simulator {
  v2PoolProvider: IV2PoolProvider
  v3PoolProvider: IV3PoolProvider
  private overrideEstimateMultiplier: Partial<Record<ChainId, number>>

  constructor(
    chainId: ChainId,
    provider: ViemProviderType,
    v2PoolProvider: IV2PoolProvider,
    v3PoolProvider: IV3PoolProvider,
    portionProvider: IPortionProvider,
    overrideEstimateMultiplier?: Partial<Record<ChainId, number>>
  ) {
    super(provider, portionProvider, chainId)
    this.v2PoolProvider = v2PoolProvider
    this.v3PoolProvider = v3PoolProvider
    this.overrideEstimateMultiplier = overrideEstimateMultiplier ?? {}
  }

  async ethEstimateGas(
    fromAddress: string,
    swapOptions: SwapOptions,
    route: SwapRoute,
    l2GasData?: ArbitrumGasData | OptimismGasData,
    providerConfig?: ProviderConfig
  ): Promise<SwapRoute> {
    const currencyIn = route.trade.inputAmount.currency
    let estimatedGasUsed: bigint
    if (swapOptions.type === SwapType.UNIVERSAL_ROUTER) {
      try {
        estimatedGasUsed = await (this.provider as PublicClient).estimateGas({
          data: route.methodParameters!.calldata as `0x${string}`,
          to: route.methodParameters!.to,
          account: fromAddress as `0x${string}`,
          value: BigInt(
            currencyIn.isNative ? route.methodParameters!.value : "0"
          ),
        })
      } catch (e) {
        log.error(LogCodes.FAIL, "Error estimating gas", { e })
        return {
          ...route,
          simulationStatus: SimulationStatus.Failed,
        }
      }
    } else if (swapOptions.type === SwapType.SWAP_ROUTER_02) {
      try {
        estimatedGasUsed = await (this.provider as PublicClient).estimateGas({
          data: route.methodParameters!.calldata as `0x${string}`,
          to: route.methodParameters!.to,
          account: fromAddress as `0x${string}`,
          value: BigInt(
            currencyIn.isNative ? route.methodParameters!.value : "0"
          ),
        })
      } catch (e) {
        log.error(LogCodes.FAIL, "Error estimating gas", { e })
        return {
          ...route,
          simulationStatus: SimulationStatus.Failed,
        }
      }
    } else {
      throw new Error(`Unsupported swap type ${swapOptions}`)
    }

    estimatedGasUsed = this.adjustGasEstimate(estimatedGasUsed)
    log.info(
      LogCodes.SIMULATE_SWAP_ROUTE,
      {
        methodParameters: route.methodParameters,
        estimatedGasUsed: estimatedGasUsed.toString(),
      },
      "Simulated using eth_estimateGas on SwapRouter02"
    )

    const {
      estimatedGasUsedUSD,
      estimatedGasUsedQuoteToken,
      quoteGasAdjusted,
    } = await calculateGasUsed(
      route.quote.currency.chainId,
      route,
      estimatedGasUsed,
      this.v2PoolProvider,
      this.v3PoolProvider,
      providerConfig
    )

    return {
      ...initSwapRouteFromExisting(
        route,
        this.v2PoolProvider,
        this.v3PoolProvider,
        this.portionProvider,
        quoteGasAdjusted,
        estimatedGasUsed,
        estimatedGasUsedQuoteToken,
        estimatedGasUsedUSD,
        swapOptions
      ),
      simulationStatus: SimulationStatus.Succeeded,
    }
  }

  private adjustGasEstimate(gasLimit: bigint): bigint {
    const estimateMultiplier =
      this.overrideEstimateMultiplier[this.chainId] ??
      DEFAULT_ESTIMATE_MULTIPLIER

    const adjustedGasEstimate =
      (BigInt(gasLimit) * BigInt(BigInt(estimateMultiplier) * BigInt(100))) /
      BigInt(100)

    return adjustedGasEstimate
  }

  protected async simulateTransaction(
    fromAddress: string,
    swapOptions: SwapOptions,
    swapRoute: SwapRoute,
    l2GasData?: OptimismGasData | ArbitrumGasData,

    _providerConfig?: ProviderConfig
  ): Promise<SwapRoute> {
    const inputAmount = swapRoute.trade.inputAmount
    if (
      inputAmount.currency.isNative ||
      (await this.checkTokenApproved(
        fromAddress,
        inputAmount,
        swapOptions,
        this.provider,
        (swapRoute?.route?.[0]?.route as V2Route)?.pairs?.[0]?.pairType ??
          Implementation.UNISWAP
      ))
    ) {
      return await this.ethEstimateGas(
        fromAddress,
        swapOptions,
        swapRoute,
        l2GasData
      )
    } else {
      log.info(
        LogCodes.SKIPPING_SIMULATION,
        "Token not approved, skipping simulation"
      )
      return {
        ...swapRoute,
        simulationStatus: SimulationStatus.NotApproved,
      }
    }
  }
}
