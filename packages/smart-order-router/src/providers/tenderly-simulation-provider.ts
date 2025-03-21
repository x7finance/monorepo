/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-base-to-string */
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { encodeFunctionData } from "viem";

import type { RouteV2Wrapper, RouteV3Wrapper } from "@x7/sdk";
import { generateRouterAddress, UNIVERSAL_ROUTER_ADDRESS } from "@x7/sdk";
import {
  ChainId,
  Implementation,
  LogCodes,
  PERMIT2_ADDRESS,
  Protocol,
} from "@x7/utils";
import type { Currency } from "@x7/utils";

import { erc20ABI } from "../abis/erc20";
import { permit2ABI } from "../abis/Permit2";
import type { SwapOptions, SwapRoute, V2Route } from "../routers";
import { metric, MetricLoggerUnit, SwapType } from "../routers";
import type { ViemProviderType } from "../utils";
import { log, MAX_UINT160 } from "../utils";
import { APPROVE_TOKEN_FOR_TRANSFER } from "../utils/callData";
import {
  calculateGasUsed,
  initSwapRouteFromExisting,
} from "../utils/gas-factory-helpers";
import type { EthEstimateGasSimulator } from "./eth-estimate-gas-provider";
import type { IPortionProvider } from "./portion-provider";
import type { ProviderConfig } from "./provider";
import type { SimulationResult } from "./simulation-provider";
import { SimulationStatus, Simulator } from "./simulation-provider";
import type { IV2PoolProvider } from "./v2/pool-provider";
import type { ArbitrumGasData, OptimismGasData } from "./v3/gas-data-provider";
import type { IV3PoolProvider } from "./v3/pool-provider";

export interface TenderlyResponseUniversalRouter {
  config: {
    url: string;
    method: string;
    data: string;
  };
  simulation_results: [SimulationResult, SimulationResult, SimulationResult];
}

export interface TenderlyResponseSwapRouter02 {
  config: {
    url: string;
    method: string;
    data: string;
  };
  simulation_results: [SimulationResult, SimulationResult];
}

enum TenderlySimulationType {
  QUICK = "quick",
  FULL = "full",
  ABI = "abi",
}

interface TenderlySimulationRequest {
  network_id: ChainId;
  estimate_gas: boolean;
  input: string;
  to: string;
  value: string;
  from: string;
  simulation_type: TenderlySimulationType;
  block_number?: number;
  save_if_fails?: boolean;
}

interface TenderlySimulationBody {
  simulations: TenderlySimulationRequest[];
  estimate_gas: boolean;
}

const TENDERLY_BATCH_SIMULATE_API = (
  tenderlyBaseUrl: string,
  tenderlyUser: string,
  tenderlyProject: string,
) =>
  `${tenderlyBaseUrl}/api/v1/account/${tenderlyUser}/project/${tenderlyProject}/simulate-batch`;

// We multiply tenderly gas limit by this to overestimate gas limit
const DEFAULT_ESTIMATE_MULTIPLIER = 1.3;

export class FallbackTenderlySimulator extends Simulator {
  private tenderlySimulator: TenderlySimulator;
  private ethEstimateGasSimulator: EthEstimateGasSimulator;
  constructor(
    chainId: ChainId,
    provider: ViemProviderType,
    portionProvider: IPortionProvider,
    tenderlySimulator: TenderlySimulator,
    ethEstimateGasSimulator: EthEstimateGasSimulator,
  ) {
    super(provider, portionProvider, chainId);
    this.tenderlySimulator = tenderlySimulator;
    this.ethEstimateGasSimulator = ethEstimateGasSimulator;
  }

  protected async simulateTransaction(
    fromAddress: string,
    swapOptions: SwapOptions,
    swapRoute: SwapRoute,
    l2GasData?: ArbitrumGasData | OptimismGasData,
    providerConfig?: ProviderConfig,
  ): Promise<SwapRoute> {
    // Make call to eth estimate gas if possible
    // For erc20s, we must check if the token allowance is sufficient
    const inputAmount = swapRoute.trade.inputAmount;

    if (
      inputAmount.currency.isNative ||
      (await this.checkTokenApproved(
        fromAddress,
        inputAmount,
        swapOptions,
        this.provider,
        (swapRoute.route[0]!.route as V2Route).pairs[0]!.pairType ??
          Implementation.UNISWAP,
      ))
    ) {
      log.info(
        LogCodes.GAS_ESTIMATE,
        "Simulating with eth_estimateGas since token is native or approved.",
      );

      try {
        const swapRouteWithGasEstimate =
          await this.ethEstimateGasSimulator.ethEstimateGas(
            fromAddress,
            swapOptions,
            swapRoute,
            l2GasData,
            providerConfig,
          );
        return swapRouteWithGasEstimate;
      } catch (error) {
        log.error(LogCodes.FAIL, "Error simulating using eth_estimateGas", {
          err: error,
        });
        return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
      }
    }

    try {
      return await this.tenderlySimulator.simulateTransaction(
        fromAddress,
        swapOptions,
        swapRoute,
        l2GasData,
        providerConfig,
      );
    } catch (error) {
      log.error(LogCodes.FAIL, "Failed to simulate via Tenderly", {
        err: error,
      });
      return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
    }
  }
}

export class TenderlySimulator extends Simulator {
  private tenderlyBaseUrl: string;
  private tenderlyUser: string;
  private tenderlyProject: string;
  private tenderlyAccessKey: string;
  private v2PoolProvider: IV2PoolProvider;
  private v3PoolProvider: IV3PoolProvider;
  private overrideEstimateMultiplier: Partial<Record<ChainId, number>>;
  private tenderlyRequestTimeout?: number;

  constructor(
    chainId: ChainId,
    tenderlyBaseUrl: string,
    tenderlyUser: string,
    tenderlyProject: string,
    tenderlyAccessKey: string,
    v2PoolProvider: IV2PoolProvider,
    v3PoolProvider: IV3PoolProvider,
    provider: ViemProviderType,
    portionProvider: IPortionProvider,
    overrideEstimateMultiplier?: Partial<Record<ChainId, number>>,
    tenderlyRequestTimeout?: number,
  ) {
    super(provider, portionProvider, chainId);
    this.tenderlyBaseUrl = tenderlyBaseUrl;
    this.tenderlyUser = tenderlyUser;
    this.tenderlyProject = tenderlyProject;
    this.tenderlyAccessKey = tenderlyAccessKey;
    this.v2PoolProvider = v2PoolProvider;
    this.v3PoolProvider = v3PoolProvider;
    this.overrideEstimateMultiplier = overrideEstimateMultiplier ?? {};
    this.tenderlyRequestTimeout = tenderlyRequestTimeout;
  }

  public async simulateTransaction(
    fromAddress: string,
    swapOptions: SwapOptions,
    swapRoute: SwapRoute,
    l2GasData?: ArbitrumGasData | OptimismGasData,
    providerConfig?: ProviderConfig,
  ): Promise<SwapRoute> {
    const currencyIn = swapRoute.trade.inputAmount.currency;
    const tokenIn = currencyIn.wrapped;
    const chainId = this.chainId;

    if (!swapRoute.methodParameters) {
      const msg = "No calldata provided to simulate transaction";
      log.error(LogCodes.FAIL, msg);
      throw new Error(msg);
    }

    const { calldata } = swapRoute.methodParameters;

    log.info(
      LogCodes.SIMULATE,
      {
        calldata: swapRoute.methodParameters.calldata,
        fromAddress: fromAddress,
        chainId: chainId,
        tokenInAddress: tokenIn.address,
        router: swapOptions.type,
      },
      "Simulating transaction",
    );

    const blockNumber = await providerConfig?.blockNumber;
    let estimatedGasUsed: bigint;
    const estimateMultiplier =
      this.overrideEstimateMultiplier[chainId] ?? DEFAULT_ESTIMATE_MULTIPLIER;

    if (swapOptions.type == SwapType.UNIVERSAL_ROUTER) {
      // Do initial onboarding approval of Permit2.

      const approvePermit2Calldata = encodeFunctionData({
        abi: erc20ABI,
        functionName: "approve",
        args: [PERMIT2_ADDRESS, BigInt(2 ** 255 - 1)],
      });

      // We are unsure if the users calldata contains a permit or not. We just
      // max approve the Univeral Router from Permit2 instead, which will cover both cases.
      const approveUniversalRouterCallData = encodeFunctionData({
        abi: permit2ABI,
        functionName: "approve",
        args: [
          tokenIn.address,
          UNIVERSAL_ROUTER_ADDRESS(this.chainId),
          BigInt(MAX_UINT160),
          Math.floor(new Date().getTime() / 1000) + 10000000,
        ],
      });

      const approvePermit2: TenderlySimulationRequest = {
        network_id: chainId,
        estimate_gas: true,
        input: approvePermit2Calldata,
        to: tokenIn.address,
        value: "0",
        from: fromAddress,
        simulation_type: TenderlySimulationType.QUICK,
        save_if_fails: providerConfig?.saveTenderlySimulationIfFailed,
      };

      const approveUniversalRouter: TenderlySimulationRequest = {
        network_id: chainId,
        estimate_gas: true,
        input: approveUniversalRouterCallData,
        to: PERMIT2_ADDRESS,
        value: "0",
        from: fromAddress,
        simulation_type: TenderlySimulationType.QUICK,
        save_if_fails: providerConfig?.saveTenderlySimulationIfFailed,
      };

      const swap: TenderlySimulationRequest = {
        network_id: chainId,
        input: calldata,
        estimate_gas: true,
        to: UNIVERSAL_ROUTER_ADDRESS(this.chainId),
        value: currencyIn.isNative ? swapRoute.methodParameters.value : "0",
        from: fromAddress,
        // TODO: This is a Temporary fix given by Tenderly team, remove once resolved on their end.
        block_number:
          chainId == ChainId.ARBITRUM && blockNumber
            ? Number(blockNumber) - 5
            : undefined,
        simulation_type: TenderlySimulationType.QUICK,
        save_if_fails: providerConfig?.saveTenderlySimulationIfFailed,
      };

      const body: TenderlySimulationBody = {
        simulations: [approvePermit2, approveUniversalRouter, swap],
        estimate_gas: true,
      };
      const opts: AxiosRequestConfig = {
        headers: {
          "X-Access-Key": this.tenderlyAccessKey,
        },
        timeout: this.tenderlyRequestTimeout,
      };
      const url = TENDERLY_BATCH_SIMULATE_API(
        this.tenderlyBaseUrl,
        this.tenderlyUser,
        this.tenderlyProject,
      );

      const before = Date.now();

      const resp = (
        await axios.post<TenderlyResponseUniversalRouter>(url, body, opts)
      ).data;

      const latencies = Date.now() - before;
      log.info(
        LogCodes.SIMULATE,
        `Tenderly simulation universal router request body: ${body}, having latencies ${latencies} in milliseconds.`,
      );
      metric.putMetric(
        "TenderlySimulationUniversalRouterLatencies",
        Date.now() - before,
        MetricLoggerUnit.Milliseconds,
      );

      // Validate tenderly response body
      if (
        !resp ||
        resp.simulation_results.length < 3 ||
        !resp.simulation_results[2].transaction ||
        resp.simulation_results[2].transaction.error_message
      ) {
        this.logTenderlyErrorResponse(resp);
        return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
      }

      // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
      estimatedGasUsed = BigInt(
        (
          resp.simulation_results[2].transaction.gas * estimateMultiplier
        ).toFixed(0),
      );

      log.info(
        LogCodes.SUCCESS,
        "Successfully Simulated Approvals + Swap via Tenderly for Universal Router. Gas used.",
        {
          body,
          approvePermit2GasUsed:
            resp.simulation_results[0].transaction.gas_used,
          approveUniversalRouterGasUsed:
            resp.simulation_results[1].transaction.gas_used,
          swapGasUsed: resp.simulation_results[2].transaction.gas_used,
          approvePermit2Gas: resp.simulation_results[0].transaction.gas,
          approveUniversalRouterGas: resp.simulation_results[1].transaction.gas,
          swapGas: resp.simulation_results[2].transaction.gas,
          swapWithMultiplier: estimatedGasUsed.toString(),
        },
      );

      log.info(
        LogCodes.SUCCESS,
        {
          body,
          swapSimulation: resp.simulation_results[2].simulation,
          swapTransaction: resp.simulation_results[2].transaction,
        },
        "Successful Tenderly Swap Simulation for Universal Router",
      );
    } else if (swapOptions.type == SwapType.SWAP_ROUTER_02) {
      const approve: TenderlySimulationRequest = {
        network_id: chainId,
        input: APPROVE_TOKEN_FOR_TRANSFER,
        estimate_gas: true,
        to: tokenIn.address,
        value: "0",
        from: fromAddress,
        simulation_type: TenderlySimulationType.QUICK,
      };

      const imp =
        swapRoute.trade.routes[0]?.protocol === Protocol.V2
          ? (swapRoute.trade.routes[0] as RouteV2Wrapper<Currency, Currency>)
              .pairs[0]!.pairType
          : (swapRoute.trade.routes[0] as RouteV3Wrapper<Currency, Currency>)
              .pools[0]!.poolType;

      const swap: TenderlySimulationRequest = {
        network_id: chainId,
        input: calldata,
        to: generateRouterAddress(chainId, imp),
        estimate_gas: true,
        value: currencyIn.isNative ? swapRoute.methodParameters.value : "0",
        from: fromAddress,
        // TODO: This is a Temporary fix given by Tenderly team, remove once resolved on their end.
        block_number:
          chainId == ChainId.ARBITRUM && blockNumber
            ? Number(blockNumber) - 5
            : undefined,
        simulation_type: TenderlySimulationType.QUICK,
      };

      const body = { simulations: [approve, swap] };
      const opts: AxiosRequestConfig = {
        headers: {
          "X-Access-Key": this.tenderlyAccessKey,
        },
        timeout: this.tenderlyRequestTimeout,
      };

      const url = TENDERLY_BATCH_SIMULATE_API(
        this.tenderlyBaseUrl,
        this.tenderlyUser,
        this.tenderlyProject,
      );

      const before = Date.now();

      const resp = (
        await axios.post<TenderlyResponseSwapRouter02>(url, body, opts)
      ).data;

      const latencies = Date.now() - before;
      log.info(
        LogCodes.SIMULATE,
        `Tenderly simulation swap router02 request body: ${body}, having latencies ${latencies} in milliseconds.`,
      );
      metric.putMetric(
        "TenderlySimulationSwapRouter02Latencies",
        latencies,
        MetricLoggerUnit.Milliseconds,
      );

      // Validate tenderly response body
      if (
        !resp ||
        resp.simulation_results.length < 2 ||
        !resp.simulation_results[1].transaction ||
        resp.simulation_results[1].transaction.error_message
      ) {
        const msg = `Failed to Simulate Via Tenderly!: ${resp.simulation_results[1].transaction.error_message}`;
        log.error(
          LogCodes.FAIL,
          { err: resp.simulation_results[1].transaction.error_message },
          msg,
        );
        return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
      }

      // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
      estimatedGasUsed = BigInt(
        (
          resp.simulation_results[1].transaction.gas * estimateMultiplier
        ).toFixed(0),
      );

      log.info(
        LogCodes.SUCCESS,
        "Successfully Simulated Approval + Swap via Tenderly for SwapRouter02. Gas used.",
        {
          body,
          approveGasUsed: resp.simulation_results[0].transaction.gas_used,
          swapGasUsed: resp.simulation_results[1].transaction.gas_used,
          approveGas: resp.simulation_results[0].transaction.gas,
          swapGas: resp.simulation_results[1].transaction.gas,
          swapWithMultiplier: estimatedGasUsed.toString(),
        },
      );

      log.info(
        LogCodes.SUCCESS,
        "Successful Tenderly Swap Simulation for SwapRouter02",
        {
          body,
          swapTransaction: resp.simulation_results[1].transaction,
          swapSimulation: resp.simulation_results[1].simulation,
        },
      );
    } else {
      throw new Error(`Unsupported swap type: ${swapOptions}`);
    }

    const {
      estimatedGasUsedUSD,
      estimatedGasUsedQuoteToken,
      quoteGasAdjusted,
    } = await calculateGasUsed(
      chainId,
      swapRoute,
      estimatedGasUsed,
      this.v2PoolProvider,
      this.v3PoolProvider,
      providerConfig,
    );
    return {
      ...initSwapRouteFromExisting(
        swapRoute,
        this.v2PoolProvider,
        this.v3PoolProvider,
        this.portionProvider,
        quoteGasAdjusted,
        estimatedGasUsed,
        estimatedGasUsedQuoteToken,
        estimatedGasUsedUSD,
        swapOptions,
      ),
      simulationStatus: SimulationStatus.Succeeded,
    };
  }

  private logTenderlyErrorResponse(resp: TenderlyResponseUniversalRouter) {
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly", {
      resp,
    });
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly #1 Transaction", {
      err:
        resp.simulation_results.length >= 1
          ? resp.simulation_results[0].transaction
          : {},
    });
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly #1 Simulation", {
      err:
        resp.simulation_results.length >= 1
          ? resp.simulation_results[0].simulation
          : {},
    });
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly #2 Transaction", {
      err:
        resp.simulation_results.length >= 2
          ? resp.simulation_results[1].transaction
          : {},
    });
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly #2 Simulation", {
      err:
        resp.simulation_results.length >= 2
          ? resp.simulation_results[1].simulation
          : {},
    });
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly #3 Transaction", {
      err:
        resp.simulation_results.length >= 3
          ? resp.simulation_results[2].transaction
          : {},
    });
    log.error(LogCodes.FAIL, "Failed to Simulate on Tenderly #3 Simulation", {
      err:
        resp.simulation_results.length >= 3
          ? resp.simulation_results[2].simulation
          : {},
    });
  }
}
