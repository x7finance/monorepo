/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { Options as RetryOptions } from "async-retry";
import retry from "async-retry";
import _ from "lodash";

import IUniswapV2Pair from "@x7/contracts/artifacts/contracts/v2-core/UniswapV2Pair.sol/UniswapV2Pair.json";
import { FACTORY_ADDRESSES, Pair, PAIR_INIT_HASH } from "@x7/sdk";
import {
  CurrencyAmount,
  Implementation,
  LogCodes,
  Protocol,
  Token,
} from "@x7/utils";
import type { ChainId } from "@x7/utils";

import { log } from "../../utils";
import type { IMulticallProvider, Result } from "../multicall-provider";
import type { ProviderConfig } from "../provider";
import type {
  ITokenPropertiesProvider,
  TokenPropertiesMap,
} from "../token-properties-provider";
import { TokenValidationResult } from "../token-validator-provider";

type IReserves = [
  reserve0: bigint,
  reserve1: bigint,
  blockTimestampLast: number,
];

export interface ImplementationPair {
  address: string;
  implementation: Implementation;
}

/**
 * Provider for getting V2 pools.
 *
 * @export
 * @interface IV2PoolProvider
 */
export interface IV2PoolProvider {
  /**
   * Gets the pools for the specified token pairs.
   *
   * @param tokenPairs The token pairs to get.
   * @param [providerConfig] The provider config.
   * @returns A pool accessor with methods for accessing the pools.
   */
  getPools(
    tokenPairs: [Token, Token][],
    providerConfig?: ProviderConfig,
  ): Promise<V2PoolAccessor>;

  /**
   * Gets the pool address for the specified token pair.
   *
   * @param tokenA Token A in the pool.
   * @param tokenB Token B in the pool.
   * @returns The unipool address and the two tokens.
   */
  getPoolAddress(
    tokenA: Token,
    tokenB: Token,
  ): { poolAddress: ImplementationPair; token0: Token; token1: Token };

  /**
   * Gets the pool address for the specified token pair.
   *
   * @param tokenA Token A in the pool.
   * @param tokenB Token B in the pool.
   * @returns All implenetations pools.
   */
  getPoolAddresses(
    tokenA: Token,
    tokenB: Token,
    forceAllImplementations?: boolean,
  ): { poolAddresses: ImplementationPair[]; token0: Token; token1: Token };
}

export interface V2PoolAccessor {
  getPool: (tokenA: Token, tokenB: Token) => (Pair | undefined)[];
  getPoolByAddress: (address: string) => Pair | undefined;
  getAllPools: () => Pair[];
}

export type V2PoolRetryOptions = RetryOptions;

export class V2PoolProvider implements IV2PoolProvider {
  // Computing pool addresses is slow as it requires hashing, encoding etc.
  // Addresses never change so can always be cached.
  private POOL_ADDRESS_CACHE: Record<string, ImplementationPair[]> = {};

  /**
   * Creates an instance of V2PoolProvider.
   * @param chainId The chain id to use.
   * @param multicall2Provider The multicall provider to use to get the pools.
   * @param tokenPropertiesProvider The token properties provider to use to get token properties.
   * @param retryOptions The retry options for each call to the multicall.
   */
  constructor(
    protected chainId: ChainId,
    protected multicall2Provider: IMulticallProvider,
    protected tokenPropertiesProvider: ITokenPropertiesProvider,
    protected enabledImplementations: Implementation[],
    protected retryOptions: V2PoolRetryOptions = {
      retries: 2,
      minTimeout: 50,
      maxTimeout: 500,
    },
  ) {}

  public async getPools(
    tokenPairs: [Token, Token][],
    providerConfig?: ProviderConfig,
  ): Promise<V2PoolAccessor> {
    const poolAddressSet: Set<string> = new Set<string>();
    const sortedTokenPairs = new Map<string, [Token, Token]>();
    const sortedPoolAddresses: ImplementationPair[] = [];

    for (const tokenPair of tokenPairs) {
      const [tokenA, tokenB] = tokenPair;

      const { poolAddresses, token0, token1 } = this.getPoolAddresses(
        tokenA,
        tokenB,
        providerConfig?.forceAllImplementations ?? false,
      );

      if (
        poolAddresses.filter((impPair) => poolAddressSet.has(impPair.address))
          .length > 0
      ) {
        continue;
      }

      poolAddresses.map((impPair) => {
        poolAddressSet.add(impPair.address);
        sortedTokenPairs.set(impPair.address, [token0, token1]);
        sortedPoolAddresses.push(impPair);
      });
    }

    const [reservesResults, tokenPropertiesMap]: [
      Result<IReserves>[],
      TokenPropertiesMap,
    ] = await Promise.all([
      this.getPoolsData<IReserves>(
        sortedPoolAddresses.map((impPair) => impPair.address),
        "getReserves",
        providerConfig,
      ),
      this.tokenPropertiesProvider.getTokensProperties(
        this.flatten(tokenPairs),
        providerConfig,
      ),
    ]);

    const poolAddressToPool: Record<string, Pair> = {};

    const invalidPools: { address: string; token0: Token; token1: Token }[] =
      [];

    for (let i = 0; i < sortedPoolAddresses.length; i++) {
      const reservesResult = reservesResults[i];
      const poolAddress = sortedPoolAddresses[i]?.address as `0x${string}`;
      const implementation = sortedPoolAddresses[i]?.implementation;
      if (!reservesResult?.success) {
        const [token0, token1] = sortedTokenPairs.get(poolAddress)!;
        invalidPools.push({ address: poolAddress, token0, token1 });

        continue;
      }

      let [token0, token1] = sortedTokenPairs.get(poolAddress)!;

      if (
        tokenPropertiesMap[token0.address.toLowerCase()]
          ?.tokenValidationResult === TokenValidationResult.FOT
      ) {
        token0 = new Token({
          chainId: token0.chainId,
          address: token0.address,
          decimals: token0.decimals,
          symbol: token0.symbol,
          name: token0.name,
          bypassChecksum: true, // at this point we know it's valid token address
          buyFeeBps: BigInt(
            tokenPropertiesMap[token0.address.toLowerCase()]?.tokenFeeResult
              ?.buyFeeBps!,
          ),
          sellFeeBps: BigInt(
            tokenPropertiesMap[token0.address.toLowerCase()]?.tokenFeeResult
              ?.sellFeeBps!,
          ),
        });
      }

      if (
        tokenPropertiesMap[token1.address.toLowerCase()]
          ?.tokenValidationResult === TokenValidationResult.FOT
      ) {
        token1 = new Token({
          chainId: token1.chainId,
          address: token1.address,
          decimals: token1.decimals,
          symbol: token1.symbol,
          name: token1.name,
          bypassChecksum: true, // at this point we know it's valid token address
          buyFeeBps: BigInt(
            tokenPropertiesMap[token1.address.toLowerCase()]?.tokenFeeResult
              ?.buyFeeBps!,
          ),
          sellFeeBps: BigInt(
            tokenPropertiesMap[token1.address.toLowerCase()]?.tokenFeeResult
              ?.sellFeeBps!,
          ),
        });
      }

      const [reserve0, reserve1] = reservesResult.result;

      const pool = new Pair(
        CurrencyAmount.fromRawAmount(token0, BigInt(reserve0)),
        CurrencyAmount.fromRawAmount(token1, BigInt(reserve1)),
        implementation!,
      );

      poolAddressToPool[poolAddress] = pool;
    }

    if (invalidPools.length > 0) {
      console.log(`Invalid pools`, {
        invalidPools,
      });
      log.error(
        LogCodes.FAIL,
        `Invalid Pools`,
        {
          invalidPools: _.map(
            invalidPools,
            ({
              address,
              token0,
              token1,
            }: {
              address: string;
              token0: Token;
              token1: Token;
            }) => `${address}: ${token0.symbol}/${token1.symbol}`,
          ),
        },
        `${invalidPools.length} pools invalid after checking their slot0 and liquidity results. Dropping.`,
      );
    }

    return {
      getPool: (tokenA: Token, tokenB: Token): (Pair | undefined)[] => {
        const { poolAddresses } = this.getPoolAddresses(
          tokenA,
          tokenB,
          providerConfig?.forceAllImplementations ?? false,
        );
        return poolAddresses.map(
          (impPair) => poolAddressToPool[impPair.address] ?? undefined,
        );
      },
      getPoolByAddress: (address: string): Pair | undefined =>
        poolAddressToPool[address],
      getAllPools: (): Pair[] => Object.values(poolAddressToPool),
    };
  }

  public getPoolAddress(
    tokenA: Token,
    tokenB: Token,
  ): { poolAddress: ImplementationPair; token0: Token; token1: Token } {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

    const cacheKey = `${this.chainId}/${token0.address}/${token1.address}`;

    const cachedAddresses =
      this.POOL_ADDRESS_CACHE[cacheKey]?.filter(
        (ca) =>
          ca.address.length > 0 &&
          this.activeImplementations(this.chainId, false).includes(
            ca.implementation,
          ),
      ) ?? [];

    if (cachedAddresses.length > 0) {
      const xchangePool = cachedAddresses.find(
        (ca) => ca.implementation === Implementation.XCHANGE,
      );
      if (xchangePool) {
        return {
          poolAddress: xchangePool,
          token0,
          token1,
        };
      }
      return {
        poolAddress: cachedAddresses[0]!,
        token0,
        token1,
      };
    }

    const allPools = Object.values(Implementation).map((imp) => {
      return {
        implementation: imp as Implementation,
        address: Pair.getAddress(token0, token1, imp as Implementation),
      };
    });

    const addressPair = allPools.filter((imp) => imp.address.length > 0);

    this.POOL_ADDRESS_CACHE[cacheKey] = addressPair;

    return {
      poolAddress: addressPair[1]!,
      token0,
      token1,
    };
  }

  public getPoolAddresses(
    tokenA: Token,
    tokenB: Token,
    forceAllImplementations = false,
  ): { poolAddresses: ImplementationPair[]; token0: Token; token1: Token } {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

    const cacheKey = `${this.chainId}/${token0.address}/${token1.address}`;

    const cachedAddresses = this.POOL_ADDRESS_CACHE[cacheKey];

    if (cachedAddresses && !forceAllImplementations) {
      return { poolAddresses: cachedAddresses, token0, token1 };
    }

    const allPools = this.activeImplementations(
      this.chainId,
      forceAllImplementations,
    ).map((imp) => {
      return {
        implementation: imp,
        address: Pair.getAddress(token0, token1, imp),
      };
    });

    log.info(LogCodes.POOL_ADDRESS_CACHE, { allPools });

    const addressPair = allPools.filter((imp) => imp.address.length > 0);

    this.POOL_ADDRESS_CACHE[cacheKey] = addressPair;

    return {
      poolAddresses: addressPair,
      token0,
      token1,
    };
  }

  private async getPoolsData<TReturn>(
    poolAddresses: string[],
    functionName: string,
    providerConfig?: ProviderConfig,
  ): Promise<Result<TReturn>[]> {
    const { results } = await retry(async () => {
      return this.multicall2Provider.callSameFunctionOnMultipleContracts<
        undefined,
        TReturn
      >({
        addresses: poolAddresses,
        contractInterface: IUniswapV2Pair.abi,
        functionName: functionName,
        providerConfig,
      });
    }, this.retryOptions);

    return results;
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
            protocols[Protocol.V2] &&
            pairInitHashes[implementation]?.[Protocol.V2] &&
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

  // We are using ES2017. ES2019 has native flatMap support
  private flatten(tokenPairs: [Token, Token][]): Token[] {
    const tokens = new Array<Token>();

    for (const [tokenA, tokenB] of tokenPairs) {
      tokens.push(tokenA);
      tokens.push(tokenB);
    }

    return tokens;
  }
}
