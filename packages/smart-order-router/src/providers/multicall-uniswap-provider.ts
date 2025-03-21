/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-for-of */
import _ from "lodash";
import stats from "stats-lite";
import { decodeFunctionResult, encodeFunctionData, getContract } from "viem";

import UniswapInterfaceMulticallJson from "@x7/contracts/artifacts/contracts/v3-periphery/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json";
import { UNISWAP_ADDRESS_MAP } from "@x7/sdk";
import type { ChainId } from "@x7/utils";
import { LogCodes } from "@x7/utils";

import { log } from "../utils";
import type { ViemProviderType } from "../utils";
import type {
  CallMultipleFunctionsOnSameContractParams,
  CallSameFunctionOnContractWithMultipleParams,
  CallSameFunctionOnMultipleContractsParams,
  Result,
} from "./multicall-provider";
import { IMulticallProvider } from "./multicall-provider";

export interface UniswapMulticallConfig {
  gasLimitPerCallOverride?: number;
}

/**
 * The UniswapMulticall contract has added functionality for limiting the amount of gas
 * that each call within the multicall can consume. This is useful for operations where
 * a call could consume such a large amount of gas that it causes the node to error out
 * with an out of gas error.
 *
 * @export
 * @class CustomMulticallProvider
 */
export class CustomMulticallProvider extends IMulticallProvider<UniswapMulticallConfig> {
  private multicallContract;
  constructor(
    protected chainId: ChainId,
    protected provider: ViemProviderType,
    protected gasLimitPerCall = 1_000_000,
  ) {
    super();
    const multicallAddress = UNISWAP_ADDRESS_MAP[this.chainId].multicallAddress;

    if (!multicallAddress) {
      throw new Error(
        `No address for Uniswap Multicall Contract on chain id: ${chainId}`,
      );
    }
    this.multicallContract = getContract({
      address: multicallAddress,
      abi: UniswapInterfaceMulticallJson.abi,
      client: {
        public: this.provider,
      },
    } as const);
  }

  public async callSameFunctionOnMultipleContracts<
    TFunctionParams extends any[] | undefined,
    TReturn = any,
  >(
    params: CallSameFunctionOnMultipleContractsParams<TFunctionParams>,
  ): Promise<{
    blockNumber: bigint;
    results: Result<TReturn>[];
  }> {
    try {
      const { addresses, contractInterface, functionName, functionParams } =
        params;

      const callData = encodeFunctionData({
        abi: contractInterface,
        functionName,
        args: functionParams ?? [],
      });

      const internalCalls = _.map(addresses, (address) => {
        return {
          target: address as `0x${string}`,
          callData,
          gasLimit: this.gasLimitPerCall,
        };
      });

      const multiCall: any = await this.multicallContract.simulate.multicall!([
        internalCalls,
      ]);
      console.log(`RESULT`, { multiCall });
      const {
        result: [blockNumber, aggregateResults],
      } = multiCall;

      const results: Result<TReturn>[] = [];

      for (let i = 0; i < aggregateResults.length; i++) {
        const { success, returnData } = aggregateResults[i];

        // Return data "0x" is sometimes returned for invalid calls.
        if (!success || returnData.length <= 2) {
          // log.debug(
          results.push({
            success: false,
            returnData,
          });
          continue;
        }

        try {
          const result = decodeFunctionResult({
            abi: contractInterface,
            functionName,
            data: returnData,
          });

          results.push({
            success: true,
            result: result as TReturn,
          });
        } catch (error) {
          results.push({
            success: false,
            returnData,
          });
        }
      }

      return { blockNumber, results };
    } catch (error) {
      log.error(LogCodes.FAIL, "Multicall failed", error);

      return { blockNumber: 0n, results: [] };
    }
  }

  public async callSameFunctionOnContractWithMultipleParams<
    TFunctionParams extends any[] | undefined,
    TReturn,
  >(
    params: CallSameFunctionOnContractWithMultipleParams<
      TFunctionParams,
      UniswapMulticallConfig
    >,
  ): Promise<{
    blockNumber: bigint;
    results: Result<TReturn>[];
    approxGasUsedPerSuccessCall: number;
  }> {
    const {
      address,
      contractInterface,
      functionName,
      functionParams,
      additionalConfig,
    } = params;

    const gasLimitPerCall =
      additionalConfig?.gasLimitPerCallOverride ?? this.gasLimitPerCall;

    const calls = _.map(functionParams, (functionParam) => {
      const callData = encodeFunctionData({
        abi: contractInterface,
        functionName,
        args: functionParam,
      });

      return {
        target: address as `0x${string}`,
        callData,
        gasLimit: gasLimitPerCall,
      };
    });

    const {
      result: [blockNumber, aggregateResults],
    }: any = await this.multicallContract.simulate.multicall!([calls]);

    const results: Result<TReturn>[] = [];

    const gasUsedForSuccess: number[] = [];
    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData, gasUsed } = aggregateResults[i]!;

      // Return data "0x" is sometimes returned for invalid pools.
      if (!success || returnData.length <= 2) {
        results.push({
          success: false,
          returnData,
        });
        continue;
      }

      gasUsedForSuccess.push(Number(gasUsed));

      try {
        const result: any = decodeFunctionResult({
          abi: contractInterface,
          functionName,
          data: returnData,
        });

        results.push({
          success: true,
          result: result as unknown as TReturn,
        });
      } catch (error) {
        results.push({
          success: false,
          returnData,
        });
      }
    }

    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
    };
  }

  public async callMultipleFunctionsOnSameContract<
    TFunctionParams extends any[] | undefined,
    TReturn,
  >(
    params: CallMultipleFunctionsOnSameContractParams<
      TFunctionParams,
      UniswapMulticallConfig
    >,
  ): Promise<{
    blockNumber: bigint;
    results: Result<TReturn>[];
    approxGasUsedPerSuccessCall: number;
  }> {
    const {
      address,
      contractInterface,
      functionNames,
      functionParams,
      additionalConfig,
    } = params;

    const gasLimitPerCall =
      additionalConfig?.gasLimitPerCallOverride ?? this.gasLimitPerCall;

    const calls = _.map(functionNames, (functionName, i) => {
      const callData = encodeFunctionData({
        abi: contractInterface,
        functionName,
        args: functionParams ? functionParams[i] : [],
      });
      return {
        target: address as `0x${string}`,
        callData,
        gasLimit: gasLimitPerCall,
      };
    });

    const {
      result: [blockNumber, aggregateResults],
    }: any = await this.multicallContract.simulate.multicall!([calls]);

    const results: Result<TReturn>[] = [];

    const gasUsedForSuccess: number[] = [];
    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData, gasUsed } = aggregateResults[i]!;

      // Return data "0x" is sometimes returned for invalid pools.
      if (!success || returnData.length <= 2) {
        results.push({
          success: false,
          returnData,
        });
        continue;
      }

      gasUsedForSuccess.push(Number(gasUsed));

      try {
        const result = decodeFunctionResult({
          abi: contractInterface,
          functionName: functionNames[i],
          data: returnData,
        });

        results.push({
          success: true,
          result: result as TReturn,
        });
      } catch (error) {
        results.push({
          success: false,
          returnData,
        });
      }
    }

    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
    };
  }
}
