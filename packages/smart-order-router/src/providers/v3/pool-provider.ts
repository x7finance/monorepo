/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-base-to-string */
import type { Options as RetryOptions } from "async-retry";
import retry from "async-retry";
import _ from "lodash";

import IUniswapV3Pool from "@x7/contracts/artifacts/contracts/v3-core/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import type { FeeAmount } from "@x7/sdk";
import {
  computePoolAddress,
  FACTORY_ADDRESSES,
  PAIR_INIT_HASH,
  Pool,
} from "@x7/sdk";
import { getLogger, LogCodes, Protocol, ServiceNames } from "@x7/utils";
import type { ChainId, Implementation, Token } from "@x7/utils";

import { log } from "../../utils";
import { poolToString } from "../../utils/routes";
import type { IMulticallProvider, Result } from "../multicall-provider";
import type { ProviderConfig } from "../provider";

const logger = getLogger({ serviceName: ServiceNames.SMART_ORDER_ROUTER });

export interface V3ImplementationPair {
  address: string;
  fee: FeeAmount;
  implementation: Implementation;
}
/**
 * Provider or getting V3 pools.
 *
 * @export
 * @interface IV3PoolProvider
 */
export interface IV3PoolProvider {
  /**
   * Gets the specified pools.
   *
   * @param tokenPairs The token pairs and fee amount of the pools to get.
   * @param [providerConfig] The provider config.
   * @returns A pool accessor with methods for accessing the pools.
   */
  getPools(
    tokenPairs: [Token, Token, FeeAmount][],
    providerConfig?: ProviderConfig,
  ): Promise<V3PoolAccessor>;

  /**
   * Gets the pool address for the specified token pair and fee tier.
   *
   * @param tokenA Token A in the pool.
   * @param tokenB Token B in the pool.
   * @param feeAmount The fee amount of the pool.
   * @returns The pool address and the two tokens.
   */
  getPoolAddress(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ): { poolAddress: V3ImplementationPair; token0: Token; token1: Token };
  /**
   * Gets the pool address for the specified token pair and fee tier.
   *
   * @param tokenA Token A in the pool.
   * @param tokenB Token B in the pool.
   * @param feeAmount The fee amount of the pool.
   * @returns The pool address and the two tokens.
   */
  getPoolAddresses(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
    forceAllImplementations?: boolean,
  ): { poolAddresses: V3ImplementationPair[]; token0: Token; token1: Token };
}

export interface V3PoolAccessor {
  getPool: (
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ) => (Pool | undefined)[];
  getPoolByAddress: (address: string) => Pool | undefined;
  getAllPools: () => Pool[];
}

export type V3PoolRetryOptions = RetryOptions;

export class V3PoolProvider implements IV3PoolProvider {
  // Computing pool addresses is slow as it requires hashing, encoding etc.
  // Addresses never change so can always be cached.
  private POOL_ADDRESS_CACHE: Record<string, V3ImplementationPair[]> = {};

  /**
   * Creates an instance of V3PoolProvider.
   * @param chainId The chain id to use.
   * @param multicall2Provider The multicall provider to use to get the pools.
   * @param retryOptions The retry options for each call to the multicall.
   */
  constructor(
    protected chainId: ChainId,
    protected multicall2Provider: IMulticallProvider,
    protected enabledImplementations: Implementation[],
    protected retryOptions: V3PoolRetryOptions = {
      retries: 2,
      minTimeout: 50,
      maxTimeout: 500,
    },
  ) {}

  public async getPools(
    tokenPairs: [Token, Token, FeeAmount][],
    providerConfig?: ProviderConfig,
  ): Promise<V3PoolAccessor> {
    const poolAddressSet: Set<string> = new Set<string>();
    const sortedTokenPairs = new Map<string, [Token, Token, FeeAmount]>();
    const sortedPoolAddresses: V3ImplementationPair[] = [];

    for (const tokenPair of tokenPairs) {
      const [tokenA, tokenB, feeAmount] = tokenPair;

      const { poolAddresses, token0, token1 } = this.getPoolAddresses(
        tokenA,
        tokenB,
        feeAmount,
        providerConfig?.forceAllImplementations ?? false,
      );

      // console.log(`Debug Token Readout`, {
      //   tokenA: `${tokenA.symbol} - ${tokenA.address}`,
      //   tokenB: `${tokenB.symbol} - ${tokenB.address}`,
      //   poolAddresses,
      // });

      if (
        poolAddresses.filter((impPair) => poolAddressSet.has(impPair.address))
          .length > 0
      ) {
        continue;
      }

      poolAddresses.map((impPair) => {
        poolAddressSet.add(impPair.address);
        sortedTokenPairs.set(impPair.address, [token0, token1, feeAmount]);
        sortedPoolAddresses.push(impPair);
      });
    }

    logger.debug(
      LogCodes.FETCHING_POOLS,
      `getPools called with ${tokenPairs.length} token pairs. Deduped down to ${poolAddressSet.size}`,
    );

    const [slot0Results, liquidityResults] = await Promise.all([
      this.getPoolsData<any>(
        sortedPoolAddresses.map((impPair) => impPair.address),
        "slot0",
        providerConfig,
      ),
      this.getPoolsData<any>(
        sortedPoolAddresses.map((impPair) => impPair.address),
        "liquidity",
        providerConfig,
      ),
    ]);
    // console.log(`Results from stuff2`, {
    //   slot0Results,
    //   liquidityResults,
    // });

    logger.info(
      LogCodes.FETCHING_POOLS,
      `Got liquidity and slots for ${poolAddressSet.size} pools ${
        providerConfig?.blockNumber
          ? `as of block: ${providerConfig.blockNumber}.`
          : ``
      }`,
    );

    const poolAddressToPool: Record<string, Pool> = {};

    const invalidPools: [Token, Token, FeeAmount][] = [];

    for (let i = 0; i < sortedPoolAddresses.length; i++) {
      const slot0Result = slot0Results[i];
      const liquidityResult = liquidityResults[i];
      const poolAddress = sortedPoolAddresses[i]?.address as `0x${string}`;
      const implementation = sortedPoolAddresses[i]?.implementation;

      // console.log(`Results from stuff`, {
      //   slot0Result,
      //   liquidityResult,
      //   poolAddress,
      //   implementation,
      // });
      // These properties tell us if a pool is valid and initialized or not.
      if (
        !slot0Result?.success ||
        !liquidityResult?.success ||
        BigInt(slot0Result.result[0]) === BigInt(0) ||
        BigInt(liquidityResult.result) === BigInt(0)
      ) {
        const [token0, token1, fee] = sortedTokenPairs.get(poolAddress)!;
        invalidPools.push([token0, token1, fee]);

        continue;
      }

      const [token0, token1, fee] = sortedTokenPairs.get(poolAddress)!;
      const slot0 = slot0Result.result;
      const liquidity = liquidityResult.result;

      const pool = new Pool(
        token0,
        token1,
        fee,
        slot0[0].toString(),
        liquidity,
        slot0[1],
        implementation!,
      );

      poolAddressToPool[poolAddress] = pool;
    }

    if (invalidPools.length > 0) {
      console.log(`Invalid pools`, {
        invalidPools,
      });
      logger.error(
        LogCodes.FAIL,
        `${invalidPools.length} pools invalid after checking their slot0 and liquidity results. Dropping.`,
        {
          invalidPools: _.map(
            invalidPools,
            ([token0, token1, fee]) =>
              `${token0.symbol}/${token1.symbol}/${fee / 10000}%`,
          ),
        },
      );
    }

    const poolStrs = _.map(Object.values(poolAddressToPool), poolToString);

    logger.debug(
      LogCodes.FETCHING_POOLS,
      `Found ${poolStrs.length} valid pools`,
      { poolStrs },
    );

    return {
      getPool: (
        tokenA: Token,
        tokenB: Token,
        feeAmount: FeeAmount,
      ): (Pool | undefined)[] => {
        const { poolAddresses } = this.getPoolAddresses(
          tokenA,
          tokenB,
          feeAmount,
          providerConfig?.forceAllImplementations ?? false,
        );
        return poolAddresses.map(
          (impPair) => poolAddressToPool[impPair.address] ?? undefined,
        );
      },
      getPoolByAddress: (address: string): Pool | undefined =>
        poolAddressToPool[address],
      getAllPools: (): Pool[] => Object.values(poolAddressToPool),
    };
  }

  public getPoolAddress(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ): { poolAddress: V3ImplementationPair; token0: Token; token1: Token } {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

    const cacheKey = `${this.chainId}/${token0.address}/${token1.address}/${feeAmount}`;

    const cachedAddresses =
      this.POOL_ADDRESS_CACHE[cacheKey]?.filter(
        (ca) =>
          ca.address.length > 0 &&
          this.activeImplementations(this.chainId, false).includes(
            ca.implementation,
          ),
      ) ?? [];

    if (cachedAddresses.length) {
      return {
        poolAddress: cachedAddresses.find((ca) => ca.address.length > 0)!,
        token0,
        token1,
      };
    }

    const allPools = this.activeImplementations(this.chainId, false).map(
      (imp) => {
        return {
          implementation: imp,
          fee: feeAmount,
          address: computePoolAddress({
            factoryAddress: FACTORY_ADDRESSES[this.chainId][imp][Protocol.V3]!,
            tokenA: token0,
            tokenB: token1,
            fee: feeAmount,
            initCodeHashManualOverride:
              PAIR_INIT_HASH[this.chainId][imp][Protocol.V3],
          }),
        };
      },
    );

    const poolAddress = allPools.filter((ca) => ca.address.length > 0);
    this.POOL_ADDRESS_CACHE[cacheKey] = poolAddress;

    return {
      poolAddress: poolAddress.find((ca) => ca.address.length > 0)!,
      token0,
      token1,
    };
  }

  public getPoolAddresses(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
    forceAllImplementations = false,
  ): { poolAddresses: V3ImplementationPair[]; token0: Token; token1: Token } {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

    const cacheKey = `${this.chainId}/${token0.address}/${token1.address}/${feeAmount}`;

    const cachedAddress = this.POOL_ADDRESS_CACHE[cacheKey];

    if (cachedAddress && !forceAllImplementations) {
      return { poolAddresses: cachedAddress, token0, token1 };
    }

    const allPools = this.activeImplementations(
      this.chainId,
      forceAllImplementations,
    ).map((imp) => {
      return {
        implementation: imp,
        fee: feeAmount,
        address: computePoolAddress({
          factoryAddress: FACTORY_ADDRESSES[this.chainId][imp][Protocol.V3]!,
          tokenA: token0,
          tokenB: token1,
          fee: feeAmount,
          initCodeHashManualOverride:
            PAIR_INIT_HASH[this.chainId][imp][Protocol.V3],
        }),
      };
    });

    const poolAddresses = allPools.filter((imp) => imp.address.length > 0);
    log.info(
      LogCodes.GET_POOL_ADDRESSES,
      `Get Pool Addresses: ${poolAddresses.length}`,
      {
        poolAddresses,
      },
    );

    this.POOL_ADDRESS_CACHE[cacheKey] = poolAddresses;

    return { poolAddresses, token0, token1 };
  }

  private activeImplementations(
    chainId: ChainId,
    forceAllImplementations: boolean,
  ): Implementation[] {
    const factoryAddresses = FACTORY_ADDRESSES[chainId];
    const pairInitHashes = PAIR_INIT_HASH[chainId];
    const activeImplementations: Implementation[] = [];

    if (factoryAddresses && pairInitHashes) {
      Object.entries(factoryAddresses).forEach(
        ([implementation, protocols]: any) => {
          if (
            protocols[Protocol.V3] &&
            pairInitHashes[implementation]?.[Protocol.V3] &&
            (forceAllImplementations ||
              this.enabledImplementations.includes(implementation))
          ) {
            activeImplementations.push(implementation);
          }
        },
      );
    }

    return activeImplementations;
  }

  private async getPoolsData<TReturn>(
    poolAddresses: string[],
    functionName: string,
    providerConfig?: ProviderConfig,
  ): Promise<Result<TReturn>[]> {
    const { results, blockNumber } = await retry(async () => {
      return this.multicall2Provider.callSameFunctionOnMultipleContracts<
        undefined,
        TReturn
      >({
        addresses: poolAddresses,
        contractInterface: IUniswapV3Pool.abi,
        functionName: functionName,
        providerConfig,
      });
    }, this.retryOptions);

    logger.debug(
      LogCodes.FETCHING_POOLS,
      `Pool data fetched as of block ${blockNumber}`,
    );

    return results;
  }
}
