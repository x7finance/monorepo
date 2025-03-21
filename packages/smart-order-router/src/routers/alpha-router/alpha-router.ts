/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import retry from "async-retry";
import _ from "lodash";
import NodeCache from "node-cache";
import type { PublicClient } from "viem";
import { getContract } from "viem";

import { XChangeV2PairAbi } from "@x7/contracts";
import DEFAULT_TOKEN_LIST from "@x7/default-token-list";
import type { RouteV2Wrapper, RouteV3Wrapper, Trade } from "@x7/sdk";
import {
  generateRouterAddress,
  MAX_PRICE_IMPACT_PERCENT,
  Pair,
  Pool,
  Position,
  SqrtPriceMath,
  SwapRouter,
  TickMath,
} from "@x7/sdk";
import type { TokenList } from "@x7/token-lists";
import {
  ChainId,
  Fraction,
  Implementation,
  LogCodes,
  Percent,
  Protocol,
  TradeType,
  V2_SUPPORTED,
  ZERO,
} from "@x7/utils";
import type { Currency, Token } from "@x7/utils";

import { erc20ABI } from "../../abis/erc20";
import type {
  IOnChainQuoteProvider,
  IRouteCachingProvider,
  ISwapRouterProvider,
  ITokenPropertiesProvider,
  IV2QuoteProvider,
  IV2SubgraphProvider,
  Simulator,
} from "../../providers";
import {
  CachedRoutes,
  CacheMode,
  CachingGasStationProvider,
  CachingTokenProviderWithFallback,
  CachingV2PoolProvider,
  CachingV2SubgraphProvider,
  CachingV3PoolProvider,
  CachingV3SubgraphProvider,
  CustomMulticallProvider,
  EIP1559GasPriceProvider,
  EthEstimateGasSimulator,
  LegacyGasPriceProvider,
  NodeJSCache,
  OnChainGasPriceProvider,
  OnChainQuoteProvider,
  StaticV2SubgraphProvider,
  StaticV3SubgraphProvider,
  SwapRouterProvider,
  TokenPropertiesProvider,
  V2QuoteProvider,
  V2SubgraphProvider,
  V2SubgraphProviderWithFallBacks,
  V3SubgraphProvider,
  V3SubgraphProviderWithFallBacks,
} from "../../providers";
import type { ITokenListProvider } from "../../providers/caching-token-list-provider";
import { CachingTokenListProvider } from "../../providers/caching-token-list-provider";
import type {
  GasPrice,
  IGasPriceProvider,
} from "../../providers/gas-price-provider";
import type { IPortionProvider } from "../../providers/portion-provider";
import { PortionProvider } from "../../providers/portion-provider";
import { OnChainTokenFeeFetcher } from "../../providers/token-fee-fetcher";
import type { ITokenProvider } from "../../providers/token-provider";
import { TokenProvider } from "../../providers/token-provider";
import type { ITokenValidatorProvider } from "../../providers/token-validator-provider";
import { TokenValidatorProvider } from "../../providers/token-validator-provider";
import type { IV2PoolProvider } from "../../providers/v2/pool-provider";
import { V2PoolProvider } from "../../providers/v2/pool-provider";
import type {
  ArbitrumGasData,
  IL2GasDataProvider,
  OptimismGasData,
} from "../../providers/v3/gas-data-provider";
import { ArbitrumGasDataProvider } from "../../providers/v3/gas-data-provider";
import type {
  IV3PoolProvider,
  V3ImplementationPair,
} from "../../providers/v3/pool-provider";
import { V3PoolProvider } from "../../providers/v3/pool-provider";
import type { IV3SubgraphProvider } from "../../providers/v3/subgraph-provider";
import { WRAPPED_NATIVE_CURRENCY } from "../../utils";
import type { ViemProviderType } from "../../utils";
import { CurrencyAmount } from "../../utils/amounts";
import {
  getHighestLiquidityV3NativePool,
  getHighestLiquidityV3USDPool,
} from "../../utils/gas-factory-helpers";
import { log } from "../../utils/log";
import {
  buildSwapMethodParameters,
  buildTrade,
} from "../../utils/methodParameters";
import { metric, MetricLoggerUnit } from "../../utils/metric";
import { UNSUPPORTED_TOKENS } from "../../utils/unsupported-tokens";
import type {
  IRouter,
  ISwapToRatio,
  MethodParameters,
  MixedRoute,
  SwapAndAddConfig,
  SwapAndAddOptions,
  SwapAndAddParameters,
  SwapOptions,
  SwapRoute,
  SwapToRatioResponse,
  V2Route,
  V3Route,
} from "../router";
import { SwapToRatioStatus } from "../router";
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from "./config";
import type {
  BestSwapRoute,
  MixedRouteWithValidQuote,
  RouteWithValidQuote,
  V3RouteWithValidQuote,
} from "./entities/route-with-valid-quote";
import { getBestSwapRoute } from "./functions/best-swap-route";
import { calculateRatioAmountIn } from "./functions/calculate-ratio-amount-in";
import type {
  CandidatePoolsBySelectionCriteria,
  PoolId,
  V2CandidatePools,
  V3CandidatePools,
} from "./functions/get-candidate-pools";
import {
  getV2CandidatePools,
  getV3CandidatePools,
} from "./functions/get-candidate-pools";
import type {
  GasModelProviderConfig,
  GasModelType,
  IGasModel,
  IOnChainGasModelFactory,
  IV2GasModelFactory,
  LiquidityCalculationPools,
} from "./gas-models/gas-model";
import { MixedRouteHeuristicGasModelFactory } from "./gas-models/mixedRoute/mixed-route-heuristic-gas-model";
import { V2HeuristicGasModelFactory } from "./gas-models/v2/v2-heuristic-gas-model";
import { NATIVE_OVERHEAD } from "./gas-models/v3/gas-costs";
import { V3HeuristicGasModelFactory } from "./gas-models/v3/v3-heuristic-gas-model";
import type { GetQuotesResult } from "./quoters";
import { MixedQuoter, V2Quoter, V3Quoter } from "./quoters";

export interface AlphaRouterParams {
  /**
   * The chain id for this instance of the Alpha Router.
   */
  chainId: ChainId;
  /**
   * The Web3 provider for getting on-chain data.
   */
  provider: ViemProviderType;
  /**
   * The provider to use for making multicalls. Used for getting on-chain data
   * like pools, tokens, quotes in batch.
   */
  multicall2Provider?: CustomMulticallProvider;
  /**
   * The provider for getting all pools that exist on V3 from the Subgraph. The pools
   * from this provider are filtered during the algorithm to a set of candidate pools.
   */
  v3SubgraphProvider?: IV3SubgraphProvider;
  /**
   * The provider for getting data about V3 pools.
   */
  v3PoolProvider?: IV3PoolProvider;
  /**
   * The provider for getting V3 quotes.
   */
  onChainQuoteProvider?: IOnChainQuoteProvider;
  /**
   * The provider for getting all pools that exist on V2 from the Subgraph. The pools
   * from this provider are filtered during the algorithm to a set of candidate pools.
   */
  v2SubgraphProvider?: IV2SubgraphProvider;
  /**
   * The provider for getting data about V2 pools.
   */
  v2PoolProvider?: IV2PoolProvider;
  /**
   * The provider for getting V3 quotes.
   */
  v2QuoteProvider?: IV2QuoteProvider;
  /**
   * The provider for getting data about Tokens.
   */
  tokenProvider?: ITokenProvider;
  /**
   * The provider for getting the current gas price to use when account for gas in the
   * algorithm.
   */
  gasPriceProvider?: IGasPriceProvider;
  /**
   * A factory for generating a gas model that is used when estimating the gas used by
   * V3 routes.
   */
  v3GasModelFactory?: IOnChainGasModelFactory<V3RouteWithValidQuote>;
  /**
   * A factory for generating a gas model that is used when estimating the gas used by
   * V2 routes.
   */
  v2GasModelFactory?: IV2GasModelFactory;
  /**
   * A factory for generating a gas model that is used when estimating the gas used by
   * V3 routes.
   */
  mixedRouteGasModelFactory?: IOnChainGasModelFactory<MixedRouteWithValidQuote>;
  /**
   * A token list that specifies Token that should be blocked from routing through.
   * Defaults to Uniswap's unsupported token list.
   */
  blockedTokenListProvider?: ITokenListProvider;

  /**
   * Calls lens function on SwapRouter02 to determine ERC20 approval types for
   * LP position tokens.
   */
  swapRouterProvider?: ISwapRouterProvider;

  /**
   * Calls the optimism gas oracle contract to fetch constants for calculating the l1 security fee.
   */
  optimismGasDataProvider?: IL2GasDataProvider<OptimismGasData>;

  /**
   * A token validator for detecting fee-on-transfer tokens or tokens that can't be transferred.
   */
  tokenValidatorProvider?: ITokenValidatorProvider;

  /**
   * Calls the arbitrum gas data contract to fetch constants for calculating the l1 fee.
   */
  arbitrumGasDataProvider?: IL2GasDataProvider<ArbitrumGasData>;

  /**
   * Simulates swaps and returns new SwapRoute with updated gas estimates.
   */
  simulator?: Simulator;

  /**
   * A provider for caching the best route given an amount, quoteToken, tradeType
   */
  routeCachingProvider?: IRouteCachingProvider;

  /**
   * A provider for getting token properties for special tokens like fee-on-transfer tokens.
   */
  tokenPropertiesProvider?: ITokenPropertiesProvider;

  /**
   * A provider for computing the portion-related data for routes and quotes.
   */
  portionProvider?: IPortionProvider;
  // App State Accessor
  addPossibleRoutes?: (routes: RouteWithValidQuote[]) => void;
  setBestRoute?: (route: BestSwapRoute) => void;
  setSecondaryRoute?: (route: BestSwapRoute) => void;
  enabledImplementations?: Implementation[];
}

export class MapWithLowerCaseKey<V> extends Map<string, V> {
  override set(key: string, value: V): this {
    return super.set(key.toLowerCase(), value);
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
  topN: number;
  /**
   * The top N pools by TVL of pools that consist of tokenIn and tokenOut.
   */
  topNDirectSwaps: number;
  /**
   * The top N pools by TVL of pools where one token is tokenIn and the
   * top N pools by TVL of pools where one token is tokenOut tokenOut.
   */
  topNTokenInOut: number;
  /**
   * Given the topNTokenInOut pools, gets the top N pools that involve the other token.
   * E.g. for a WETH -> USDC swap, if topNTokenInOut found WETH -> DAI and WETH -> USDT,
   * a value of 2 would find the top 2 pools that involve DAI and top 2 pools that involve USDT.
   */
  topNSecondHop: number;
  /**
   * Given the topNTokenInOut pools and a token address,
   * gets the top N pools that involve the other token.
   * If token address is not on the list, we default to topNSecondHop.
   * E.g. for a WETH -> USDC swap, if topNTokenInOut found WETH -> DAI and WETH -> USDT,
   * and there's a mapping USDT => 4, but no mapping for DAI
   * it would find the top 4 pools that involve USDT, and find the topNSecondHop pools that involve DAI
   */
  topNSecondHopForTokenAddress?: MapWithLowerCaseKey<number>;
  /**
   * The top N pools for token in and token out that involve a token from a list of
   * hardcoded 'base tokens'. These are standard tokens such as WETH, USDC, DAI, etc.
   * This is similar to how the legacy routing algorithm used by Uniswap would select
   * pools and is intended to make the new pool selection algorithm close to a superset
   * of the old algorithm.
   */
  topNWithEachBaseToken: number;
  /**
   * Given the topNWithEachBaseToken pools, takes the top N pools from the full list.
   * E.g. for a WETH -> USDC swap, if topNWithEachBaseToken found WETH -0.05-> DAI,
   * WETH -0.01-> DAI, WETH -0.05-> USDC, WETH -0.3-> USDC, a value of 2 would reduce
   * this set to the top 2 pools from that full list.
   */
  topNWithBaseToken: number;
}

export interface AlphaRouterConfig {
  /**
   * The block number to use for all on-chain data. If not provided, the router will
   * use the latest block returned by the provider.
   */
  blockNumber?: number | Promise<number>;
  /**
   * The protocols to consider when finding the optimal swap. If not provided all protocols
   * will be used.
   */
  protocols?: Protocol[];
  /**
   * Config for selecting which pools to consider routing via on V2.
   */
  v2PoolSelection: ProtocolPoolSelection;
  /**
   * Config for selecting which pools to consider routing via on V3.
   */
  v3PoolSelection: ProtocolPoolSelection;
  /**
   * For each route, the maximum number of hops to consider. More hops will increase latency of the algorithm.
   */
  maxSwapsPerPath: number;
  /**
   * The maximum number of splits in the returned route. A higher maximum will increase latency of the algorithm.
   */
  maxSplits: number;
  /**
   * The minimum number of splits in the returned route.
   * This parameters should always be set to 1. It is only included for testing purposes.
   */
  minSplits: number;
  /**
   * Forces the returned swap to route across all protocols.
   * This parameter should always be false. It is only included for testing purposes.
   */
  forceCrossProtocol: boolean;
  /**
   * Force the alpha router to choose a mixed route swap.
   * Default will be falsy. It is only included for testing purposes.
   */
  forceMixedRoutes?: boolean;
  /**
   * The minimum percentage of the input token to use for each route in a split route.
   * All routes will have a multiple of this value. For example is distribution percentage is 5,
   * a potential return swap would be:
   *
   * 5% of input => Route 1
   * 55% of input => Route 2
   * 40% of input => Route 3
   */
  distributionPercent: number;
  /**
   * Flag to indicate whether to use the cached routes or not.
   * By default, the cached routes will be used.
   */
  useCachedRoutes?: boolean;
  /**
   * Flag to indicate whether to write to the cached routes or not.
   * By default, the cached routes will be written to.
   */
  writeToCachedRoutes?: boolean;
  /**
   * Flag to indicate whether to use the CachedRoutes in optimistic mode.
   * Optimistic mode means that we will allow blocksToLive greater than 1.
   */
  optimisticCachedRoutes?: boolean;
  /**
   * Debug param that helps to see the short-term latencies improvements without impacting the main path.
   */
  debugRouting?: boolean;
  /**
   * Flag that allow us to override the cache mode.
   */
  overwriteCacheMode?: CacheMode;
  /**
   * Flag for token properties provider to enable fetching fee-on-transfer tokens.
   */
  enableFeeOnTransferFeeFetching?: boolean;
  /**
   * Tenderly natively support save simulation failures if failed,
   * we need this as a pass-through flag to enable/disable this feature.
   */
  saveTenderlySimulationIfFailed?: boolean;
  /**
   * Ignore these pools when finding the best route.
   * E.g. if a pool is causing a bad experience for a user, we can recall route with ignoring this list.
   */
  ignoreThesePools?: { v2?: string[]; v3?: string[] };
  attemptCount?: number;
}

export class AlphaRouter
  implements
    IRouter<AlphaRouterConfig>,
    ISwapToRatio<AlphaRouterConfig, SwapAndAddConfig>
{
  protected chainId: ChainId;
  protected provider: ViemProviderType;
  protected multicall2Provider: CustomMulticallProvider;
  protected v3SubgraphProvider: IV3SubgraphProvider;
  protected v3PoolProvider: IV3PoolProvider;
  protected onChainQuoteProvider: IOnChainQuoteProvider;
  protected v2SubgraphProvider: IV2SubgraphProvider;
  protected v2QuoteProvider: IV2QuoteProvider;
  protected v2PoolProvider: IV2PoolProvider;
  protected tokenProvider: ITokenProvider;
  protected gasPriceProvider: IGasPriceProvider;
  protected swapRouterProvider: ISwapRouterProvider;
  protected v3GasModelFactory: IOnChainGasModelFactory<V3RouteWithValidQuote>;
  protected v2GasModelFactory: IV2GasModelFactory;
  protected mixedRouteGasModelFactory: IOnChainGasModelFactory<MixedRouteWithValidQuote>;
  protected tokenValidatorProvider?: ITokenValidatorProvider;
  protected blockedTokenListProvider?: ITokenListProvider;
  protected l2GasDataProvider?: IL2GasDataProvider<ArbitrumGasData>;
  protected simulator?: Simulator;
  protected v2Quoter: V2Quoter;
  protected v3Quoter: V3Quoter;
  protected mixedQuoter: MixedQuoter;
  protected routeCachingProvider?: IRouteCachingProvider;
  protected tokenPropertiesProvider: ITokenPropertiesProvider;
  protected portionProvider: IPortionProvider;
  protected v2Supported?: ChainId[];
  protected addPossibleRoutes?: (
    routes: RouteWithValidQuote[] | MixedRouteWithValidQuote[],
  ) => void;
  protected setBestRoute?: (route: BestSwapRoute) => void;
  protected setSecondaryRoute?: (routed: BestSwapRoute) => void;
  protected enabledImplementations?: Implementation[];
  private currentAbortController: AbortController | null = null;

  public abortCurrentRoute() {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  constructor({
    chainId,
    provider,
    multicall2Provider,
    v3PoolProvider,
    onChainQuoteProvider,
    v2PoolProvider,
    v2QuoteProvider,
    v2SubgraphProvider,
    tokenProvider,
    blockedTokenListProvider,
    v3SubgraphProvider,
    gasPriceProvider,
    v3GasModelFactory,
    v2GasModelFactory,
    mixedRouteGasModelFactory,
    swapRouterProvider,
    tokenValidatorProvider,
    arbitrumGasDataProvider,
    simulator,
    routeCachingProvider,
    tokenPropertiesProvider,
    portionProvider,
    addPossibleRoutes,
    setBestRoute,
    setSecondaryRoute,
    enabledImplementations,
  }: AlphaRouterParams) {
    this.chainId = chainId;
    this.provider = provider;
    this.multicall2Provider =
      multicall2Provider ??
      new CustomMulticallProvider(chainId, provider, 375_000);
    this.v3PoolProvider =
      v3PoolProvider ??
      new CachingV3PoolProvider(
        this.chainId,
        new V3PoolProvider(
          chainId,
          this.multicall2Provider,
          enabledImplementations ?? [
            Implementation.UNISWAP,
            Implementation.XCHANGE,
          ],
        ),
        new NodeJSCache(new NodeCache({ stdTTL: 360, useClones: false })),
      );
    this.routeCachingProvider = routeCachingProvider;
    this.addPossibleRoutes = addPossibleRoutes;
    this.setBestRoute = setBestRoute;
    this.setSecondaryRoute = setSecondaryRoute;

    if (onChainQuoteProvider) {
      this.onChainQuoteProvider = onChainQuoteProvider;
    } else {
      switch (chainId) {
        case ChainId.OPTIMISM:
          this.onChainQuoteProvider = new OnChainQuoteProvider(
            chainId,
            provider,
            this.multicall2Provider,
            {
              retries: 2,
              minTimeout: 100,
              maxTimeout: 1000,
            },
            {
              multicallChunk: 110,
              gasLimitPerCall: 1_200_000,
              quoteMinSuccessRate: 0.1,
            },
            {
              gasLimitOverride: 3_000_000,
              multicallChunk: 45,
            },
            {
              gasLimitOverride: 3_000_000,
              multicallChunk: 45,
            },
            {
              baseBlockOffset: -10,
              rollback: {
                enabled: true,
                attemptsBeforeRollback: 1,
                rollbackBlockOffset: -10,
              },
            },
          );
          break;
        case ChainId.BASE:
        case ChainId.BASE_TESTNET:
          this.onChainQuoteProvider = new OnChainQuoteProvider(
            chainId,
            provider,
            this.multicall2Provider,
            {
              retries: 2,
              minTimeout: 100,
              maxTimeout: 1000,
            },
            {
              multicallChunk: 80,
              gasLimitPerCall: 1_200_000,
              quoteMinSuccessRate: 0.1,
            },
            {
              gasLimitOverride: 3_000_000,
              multicallChunk: 45,
            },
            {
              gasLimitOverride: 3_000_000,
              multicallChunk: 45,
            },
            {
              baseBlockOffset: -10,
              rollback: {
                enabled: true,
                attemptsBeforeRollback: 1,
                rollbackBlockOffset: -10,
              },
            },
          );
          break;
        case ChainId.ARBITRUM:
        case ChainId.ARBITRUM_TESTNET:
          this.onChainQuoteProvider = new OnChainQuoteProvider(
            chainId,
            provider,
            this.multicall2Provider,
            {
              retries: 2,
              minTimeout: 100,
              maxTimeout: 1000,
            },
            {
              multicallChunk: 10,
              gasLimitPerCall: 12_000_000,
              quoteMinSuccessRate: 0.1,
            },
            {
              gasLimitOverride: 30_000_000,
              multicallChunk: 6,
            },
            {
              gasLimitOverride: 30_000_000,
              multicallChunk: 6,
            },
          );
          break;
        default:
          this.onChainQuoteProvider = new OnChainQuoteProvider(
            chainId,
            provider,
            this.multicall2Provider,
            {
              retries: 2,
              minTimeout: 100,
              maxTimeout: 1000,
            },
            {
              multicallChunk: 210,
              gasLimitPerCall: 705_000,
              quoteMinSuccessRate: 0.15,
            },
            {
              gasLimitOverride: 2_000_000,
              multicallChunk: 70,
            },
          );
          break;
      }
    }

    if (tokenValidatorProvider) {
      this.tokenValidatorProvider = tokenValidatorProvider;
    } else if (this.chainId === ChainId.ETHEREUM) {
      this.tokenValidatorProvider = new TokenValidatorProvider(
        this.chainId,
        this.multicall2Provider,
        new NodeJSCache(new NodeCache({ stdTTL: 30000, useClones: false })),
      );
    }
    if (tokenPropertiesProvider) {
      this.tokenPropertiesProvider = tokenPropertiesProvider;
    } else {
      this.tokenPropertiesProvider = new TokenPropertiesProvider(
        this.chainId,
        new NodeJSCache(new NodeCache({ stdTTL: 86400, useClones: false })),
        new OnChainTokenFeeFetcher(
          this.chainId,
          provider,
          enabledImplementations ?? [
            Implementation.UNISWAP,
            Implementation.XCHANGE,
          ],
          this.multicall2Provider,
        ),
      );
    }
    this.v2PoolProvider =
      v2PoolProvider ??
      new CachingV2PoolProvider(
        chainId,
        new V2PoolProvider(
          chainId,
          this.multicall2Provider,
          this.tokenPropertiesProvider,
          enabledImplementations ?? [
            Implementation.UNISWAP,
            Implementation.XCHANGE,
          ],
        ),
        new NodeJSCache(new NodeCache({ stdTTL: 60, useClones: false })),
      );

    this.v2QuoteProvider = v2QuoteProvider ?? new V2QuoteProvider();

    this.blockedTokenListProvider =
      blockedTokenListProvider ??
      new CachingTokenListProvider(
        chainId,
        UNSUPPORTED_TOKENS as TokenList,
        new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false })),
      );

    this.tokenProvider =
      tokenProvider ??
      new CachingTokenProviderWithFallback(
        chainId,
        new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false })),
        // TODO: token-list Remove import and build at runtime from block baby
        new CachingTokenListProvider(
          chainId,
          // @ts-expect-error: todo fix
          DEFAULT_TOKEN_LIST,
          new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false })),
        ),
        new TokenProvider(chainId, this.multicall2Provider),
      );
    this.portionProvider = portionProvider ?? new PortionProvider();

    if (v2SubgraphProvider) {
      this.v2SubgraphProvider = v2SubgraphProvider;
    } else {
      this.v2SubgraphProvider = new V2SubgraphProviderWithFallBacks([
        new CachingV2SubgraphProvider(
          chainId,
          new V2SubgraphProvider(
            chainId,
            enabledImplementations ?? [
              Implementation.XCHANGE,
              Implementation.UNISWAP,
            ],
          ),
          new NodeJSCache(new NodeCache({ stdTTL: 300, useClones: false })),
        ),
        new StaticV2SubgraphProvider(chainId),
      ]);
    }

    if (v3SubgraphProvider) {
      this.v3SubgraphProvider = v3SubgraphProvider;
    } else {
      this.v3SubgraphProvider = new V3SubgraphProviderWithFallBacks([
        new CachingV3SubgraphProvider(
          chainId,
          new V3SubgraphProvider(
            chainId,
            enabledImplementations ?? [
              Implementation.XCHANGE,
              Implementation.UNISWAP,
            ],
          ),
          new NodeJSCache(new NodeCache({ stdTTL: 300, useClones: false })),
        ),
        new StaticV3SubgraphProvider(chainId, this.v3PoolProvider),
      ]);
    }

    let gasPriceProviderInstance: IGasPriceProvider;
    if ((this.provider as PublicClient).getGasPrice) {
      gasPriceProviderInstance = new OnChainGasPriceProvider(
        chainId,
        new EIP1559GasPriceProvider(this.provider),
        new LegacyGasPriceProvider(this.provider),
      );
    } else {
      throw new Error(
        "TODO; Implement custom error for invalid gasProvider (ensure you pass a viem PublicClient to the Router)",
      );
    }

    this.gasPriceProvider =
      gasPriceProvider ??
      new CachingGasStationProvider(
        chainId,
        gasPriceProviderInstance,
        new NodeJSCache<GasPrice>(
          new NodeCache({ stdTTL: 7, useClones: false }),
        ),
      );
    this.v3GasModelFactory =
      v3GasModelFactory ?? new V3HeuristicGasModelFactory();
    this.v2GasModelFactory =
      v2GasModelFactory ?? new V2HeuristicGasModelFactory();
    this.mixedRouteGasModelFactory =
      mixedRouteGasModelFactory ?? new MixedRouteHeuristicGasModelFactory();

    this.swapRouterProvider =
      swapRouterProvider ??
      new SwapRouterProvider(this.multicall2Provider, chainId);

    if (chainId === ChainId.ARBITRUM || chainId === ChainId.ARBITRUM_TESTNET) {
      this.l2GasDataProvider =
        arbitrumGasDataProvider ??
        new ArbitrumGasDataProvider(chainId, this.provider);
    }

    // Initialize the simulator
    this.simulator =
      simulator ??
      new EthEstimateGasSimulator(
        chainId,
        this.provider,
        this.v2PoolProvider,
        this.v3PoolProvider,
        this.portionProvider,
      );
    // new TenderlySimulator(
    //   ChainId.ETHEREUM,
    //   "",
    //   "",
    //   "",
    //   "",
    //   this.v2PoolProvider,
    //   this.v3PoolProvider,
    //   this.provider,
    //   this.portionProvider,
    //   undefined,
    //   60,
    // );

    // Initialize the Quoters.
    // Quoters are an abstraction encapsulating the business logic of fetching routes and quotes.
    this.v2Quoter = new V2Quoter(
      this.v2PoolProvider,
      this.v2QuoteProvider,
      this.v2GasModelFactory,
      this.tokenProvider,
      chainId,
      this.blockedTokenListProvider,
      this.tokenValidatorProvider,
    );

    this.v3Quoter = new V3Quoter(
      this.v3PoolProvider,
      this.onChainQuoteProvider,
      this.tokenProvider,
      chainId,
      this.blockedTokenListProvider,
      this.tokenValidatorProvider,
      enabledImplementations,
    );

    this.mixedQuoter = new MixedQuoter(
      this.v3PoolProvider,
      this.v2PoolProvider,
      this.onChainQuoteProvider,
      this.tokenProvider,
      chainId,
      this.blockedTokenListProvider,
      this.tokenValidatorProvider,
    );
  }

  private normalizeAddress(address: string): string {
    return address.toLowerCase();
  }

  public async routeToRatio(
    token0Balance: CurrencyAmount,
    token1Balance: CurrencyAmount,
    position: Position,
    swapAndAddConfig: SwapAndAddConfig,
    swapAndAddOptions?: SwapAndAddOptions,
    routingConfig: Partial<AlphaRouterConfig> = DEFAULT_ROUTING_CONFIG_BY_CHAIN(
      this.chainId,
    ),
  ): Promise<SwapToRatioResponse> {
    if (
      token1Balance.currency.wrapped.sortsBefore(token0Balance.currency.wrapped)
    ) {
      [token0Balance, token1Balance] = [token1Balance, token0Balance];
    }

    let preSwapOptimalRatio = this.calculateOptimalRatio(
      position,
      position.pool.sqrtRatioX96,
      true,
    );
    // set up parameters according to which token will be swapped
    let zeroForOne: boolean;
    if (position.pool.tickCurrent > position.tickUpper) {
      zeroForOne = true;
    } else if (position.pool.tickCurrent < position.tickLower) {
      zeroForOne = false;
    } else {
      zeroForOne = new Fraction(
        token0Balance.quotient,
        token1Balance.quotient,
      ).greaterThan(preSwapOptimalRatio);
      if (!zeroForOne) preSwapOptimalRatio = preSwapOptimalRatio.invert();
    }

    const [inputBalance, outputBalance] = zeroForOne
      ? [token0Balance, token1Balance]
      : [token1Balance, token0Balance];

    let optimalRatio = preSwapOptimalRatio;
    let postSwapTargetPool = position.pool;
    let exchangeRate: Fraction = zeroForOne
      ? position.pool.token0Price
      : position.pool.token1Price;
    let swap: SwapRoute | null = null;
    let ratioAchieved = false;
    let n = 0;
    // iterate until we find a swap with a sufficient ratio or return null
    while (!ratioAchieved) {
      n++;
      if (n > swapAndAddConfig.maxIterations) {
        log.error(LogCodes.FAIL, "max iterations exceeded");

        return {
          status: SwapToRatioStatus.NO_ROUTE_FOUND,
          error: "max iterations exceeded",
        };
      }

      const amountToSwap = calculateRatioAmountIn(
        optimalRatio,
        exchangeRate,
        inputBalance,
        outputBalance,
      );
      if (amountToSwap.equalTo(0)) {
        log.info(LogCodes.NO_SWAP_NEEDED, `no swap needed: amountToSwap = 0`);
        return {
          status: SwapToRatioStatus.NO_SWAP_NEEDED,
        };
      }
      swap = await this.route(
        amountToSwap,
        outputBalance.currency,
        TradeType.EXACT_INPUT,
        undefined,
        {
          ...DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId),
          ...routingConfig,
          /// @dev We do not want to query for mixedRoutes for routeToRatio as they are not supported
          /// [Protocol.V3, Protocol.V2] will make sure we only query for V3 and V2
          protocols: [Protocol.V3, Protocol.V2],
        },
      );
      if (!swap) {
        log.info(LogCodes.NOT_FOUND, "no route found from this.route()");
        return {
          status: SwapToRatioStatus.NO_ROUTE_FOUND,
          error: "no route found",
        };
      }

      const inputBalanceUpdated = inputBalance.subtract(swap.trade.inputAmount);
      const outputBalanceUpdated = outputBalance.add(swap.trade.outputAmount);
      const newRatio = inputBalanceUpdated.divide(outputBalanceUpdated);

      let targetPoolPriceUpdate;
      swap.route.forEach((route) => {
        if (route.protocol === Protocol.V3) {
          const v3Route = route;
          v3Route.route.pools.forEach((pool, i) => {
            if (
              pool.token0.equals(position.pool.token0) &&
              pool.token1.equals(position.pool.token1) &&
              pool.fee === position.pool.fee
            ) {
              targetPoolPriceUpdate = BigInt(
                v3Route.sqrtPriceX96AfterList[i]!.toString(),
              );
              optimalRatio = this.calculateOptimalRatio(
                position,
                BigInt(targetPoolPriceUpdate.toString()),
                zeroForOne,
              );
            }
          });
        }
      });
      if (!targetPoolPriceUpdate) {
        optimalRatio = preSwapOptimalRatio;
      }
      ratioAchieved =
        newRatio.equalTo(optimalRatio) ||
        this.absoluteValue(
          newRatio.asFraction.divide(optimalRatio).subtract(1),
        ).lessThan(swapAndAddConfig.ratioErrorTolerance);

      if (ratioAchieved && targetPoolPriceUpdate) {
        postSwapTargetPool = new Pool(
          position.pool.token0,
          position.pool.token1,
          position.pool.fee,
          targetPoolPriceUpdate,
          position.pool.liquidity,
          TickMath.getTickAtSqrtRatio(targetPoolPriceUpdate),
          position.pool.poolType,
          position.pool.tickDataProvider,
        );
      }
      exchangeRate = swap.trade.outputAmount.divide(swap.trade.inputAmount);

      log.info(LogCodes.FETCHING_QUOTES, "QuoteToRatio Iteration Parameters", {
        exchangeRate: exchangeRate.asFraction.toFixed(18),
        optimalRatio: optimalRatio.asFraction.toFixed(18),
        newRatio: newRatio.asFraction.toFixed(18),
        inputBalanceUpdated: inputBalanceUpdated.asFraction.toFixed(18),
        outputBalanceUpdated: outputBalanceUpdated.asFraction.toFixed(18),
        ratioErrorTolerance: swapAndAddConfig.ratioErrorTolerance.toFixed(18),
        iterationN: n.toString(),
      });

      if (exchangeRate.equalTo(0)) {
        log.error(LogCodes.FAIL, "exchangeRate to 0");

        return {
          status: SwapToRatioStatus.NO_ROUTE_FOUND,
          error: "insufficient liquidity to swap to optimal ratio",
        };
      }
    }

    if (!swap) {
      return {
        status: SwapToRatioStatus.NO_ROUTE_FOUND,
        error: "no route found",
      };
    }
    let methodParameters: MethodParameters | undefined;
    if (swapAndAddOptions) {
      methodParameters = await this.buildSwapAndAddMethodParameters(
        swap.trade,
        swapAndAddOptions,
        {
          initialBalanceTokenIn: inputBalance,
          initialBalanceTokenOut: outputBalance,
          preLiquidityPosition: position,
        },
      );
    }

    return {
      status: SwapToRatioStatus.SUCCESS,
      result: { ...swap, methodParameters, optimalRatio, postSwapTargetPool },
    };
  }

  /**
   * @inheritdoc IRouter
   */
  public async route(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    tradeType: TradeType,
    swapConfig?: SwapOptions,
    partialRoutingConfig: Partial<AlphaRouterConfig> = {},
  ): Promise<SwapRoute | null> {
    // this.abortCurrentRoute();
    this.currentAbortController = new AbortController();
    const signal = this.currentAbortController.signal;

    const originalAmount = amount;
    if (tradeType === TradeType.EXACT_OUTPUT) {
      const portionAmount = this.portionProvider.getPortionAmount(
        amount,
        tradeType,
        swapConfig,
      );
      if (portionAmount?.greaterThan(Number(ZERO))) {
        // In case of exact out swap, before we route, we need to make sure that the
        // token out amount accounts for flat portion, and token in amount after the best swap route contains the token in equivalent of portion.
        // In other words, in case a pool's LP fee bps is lower than the portion bps (0.01%/0.05% for v3), a pool can go insolvency.
        // This is because instead of the swapper being responsible for the portion,
        // the pool instead gets responsible for the portion.
        // The addition below avoids that situation.
        amount = amount.add(portionAmount);
      }
    }

    const { currencyIn, currencyOut } =
      this.determineCurrencyInOutFromTradeType(
        tradeType,
        amount,
        quoteCurrency,
      );

    const tokenIn = currencyIn.wrapped;
    const tokenOut = currencyOut.wrapped;

    metric.setProperty("chainId", this.chainId);
    metric.setProperty("pair", `${tokenIn.symbol}/${tokenOut.symbol}`);
    metric.setProperty("tokenIn", tokenIn.address);
    metric.setProperty("tokenOut", tokenOut.address);
    metric.setProperty(
      "tradeType",
      tradeType === TradeType.EXACT_INPUT ? "ExactIn" : "ExactOut",
    );

    metric.putMetric(
      `QuoteRequestedForChain${this.chainId}`,
      1,
      MetricLoggerUnit.Count,
    );

    // Get a block number to specify in all our calls. Ensures data we fetch from chain is
    // from the same block.
    const blockNumber =
      partialRoutingConfig.blockNumber ?? (await this.getBlockNumberPromise());

    const routingConfig: AlphaRouterConfig = _.merge(
      {
        // These settings could be changed by the partialRoutingConfig
        useCachedRoutes: true,
        writeToCachedRoutes: true,
        optimisticCachedRoutes: false,
      },
      DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId),
      partialRoutingConfig,
      { blockNumber },
    );

    if (routingConfig.debugRouting) {
      log.warn(
        LogCodes.ROUTING_CONFIG,
        `Finalized routing config is ${JSON.stringify(routingConfig)}`,
      );
    }

    const gasPriceWei = await this.getGasPriceWei();

    const quoteToken = quoteCurrency.wrapped;
    const providerConfig: GasModelProviderConfig = {
      ...routingConfig,
      blockNumber: Number(blockNumber),
      additionalGasOverhead: NATIVE_OVERHEAD(
        this.chainId,
        amount.currency,
        quoteCurrency,
      ),
    };

    const {
      v2GasModel: v2GasModel,
      v3GasModel: v3GasModel,
      mixedRouteGasModel: mixedRouteGasModel,
    } = await this.getGasModels(
      gasPriceWei,
      amount.currency.wrapped,
      quoteToken,
      providerConfig,
    );

    // Create a Set to sanitize the protocols input, a Set of undefined becomes an empty set,
    // Then create an Array from the values of that Set.
    const protocols: Protocol[] = Array.from(
      new Set(routingConfig.protocols).values(),
    );

    const cacheMode =
      routingConfig.overwriteCacheMode ??
      (await this.routeCachingProvider?.getCacheMode(
        this.chainId,
        amount,
        quoteToken,
        tradeType,
        protocols,
      ));

    // Fetch CachedRoutes
    let cachedRoutes: CachedRoutes | undefined;
    if (routingConfig.useCachedRoutes && cacheMode !== CacheMode.Darkmode) {
      cachedRoutes = await this.routeCachingProvider?.getCachedRoute(
        this.chainId,
        amount,
        quoteToken,
        tradeType,
        protocols,
        Number(blockNumber),
        routingConfig.optimisticCachedRoutes,
      );
    }

    metric.putMetric(
      routingConfig.useCachedRoutes
        ? "GetQuoteUsingCachedRoutes"
        : "GetQuoteNotUsingCachedRoutes",
      1,
      MetricLoggerUnit.Count,
    );

    if (
      cacheMode &&
      routingConfig.useCachedRoutes &&
      cacheMode !== CacheMode.Darkmode &&
      !cachedRoutes
    ) {
      metric.putMetric(
        `GetCachedRoute_miss_${cacheMode}`,
        1,
        MetricLoggerUnit.Count,
      );
      log.info(
        LogCodes.CACHE_MISS,
        `GetCachedRoute miss ${cacheMode} for ${this.tokenPairSymbolTradeTypeChainId(
          tokenIn,
          tokenOut,
          tradeType,
        )}`,
        {
          tokenIn: tokenIn.symbol,
          tokenInAddress: tokenIn.address,
          tokenOut: tokenOut.symbol,
          tokenOutAddress: tokenOut.address,
          cacheMode,
          amount: amount.toExact(),
          chainId: this.chainId,
          tradeType: this.tradeTypeStr(tradeType),
        },
      );
    } else if (cachedRoutes && routingConfig.useCachedRoutes) {
      metric.putMetric(
        `GetCachedRoute_hit_${cacheMode}`,
        1,
        MetricLoggerUnit.Count,
      );
      log.info(
        LogCodes.CACHE_HIT,
        `GetCachedRoute hit ${cacheMode} for ${this.tokenPairSymbolTradeTypeChainId(
          tokenIn,
          tokenOut,
          tradeType,
        )}`,
        {
          tokenIn: tokenIn.symbol,
          tokenInAddress: tokenIn.address,
          tokenOut: tokenOut.symbol,
          tokenOutAddress: tokenOut.address,
          cacheMode,
          amount: amount.toExact(),
          chainId: this.chainId,
          tradeType: this.tradeTypeStr(tradeType),
        },
      );
    }

    let swapRouteFromCachePromise: Promise<BestSwapRoute | null> =
      Promise.resolve(null);
    if (cachedRoutes) {
      swapRouteFromCachePromise = this.getSwapRouteFromCache(
        cachedRoutes,
        Number(blockNumber),
        amount,
        quoteToken,
        tradeType,
        routingConfig,
        v3GasModel,
        mixedRouteGasModel,
        gasPriceWei,
        swapConfig,
      );
    }

    let swapRouteFromChainPromise: Promise<BestSwapRoute | null> =
      Promise.resolve(null);
    if (!cachedRoutes || cacheMode !== CacheMode.Livemode) {
      swapRouteFromChainPromise = this.getSwapRouteFromChain(
        amount,
        tokenIn,
        tokenOut,
        protocols,
        quoteToken,
        tradeType,
        routingConfig,
        v3GasModel,
        mixedRouteGasModel,
        gasPriceWei,
        swapConfig,
      );
    }

    const [swapRouteFromCache, swapRouteFromChain] = await Promise.all([
      swapRouteFromCachePromise,
      swapRouteFromChainPromise,
    ]);

    let swapRouteRaw: BestSwapRoute | null;
    let hitsCachedRoute = false;
    if (cacheMode === CacheMode.Livemode && swapRouteFromCache) {
      log.info(
        LogCodes.CACHE_HIT,
        `CacheMode is ${cacheMode}, and we are using swapRoute from cache`,
      );
      hitsCachedRoute = true;
      swapRouteRaw = swapRouteFromCache;
    } else {
      log.info(
        LogCodes.CACHE_MISS,
        `CacheMode is ${cacheMode}, and we are using materialized swapRoute`,
      );
      swapRouteRaw = swapRouteFromChain;
    }

    // XChange Loan checks if selected route includes a XChangePair
    if (swapRouteRaw) {
      if (swapRouteRaw.routes[0]?.protocol === Protocol.V2) {
        const firstPair = swapRouteRaw.routes[0].route?.pairs[0];

        const pairType = firstPair?.pairType ?? Implementation.UNISWAP;

        if (firstPair && pairType === Implementation.XCHANGE) {
          // do check for minimums
          const minimumsReply = await this.provider.readContract({
            abi: XChangeV2PairAbi,
            address: firstPair.address,
            functionName: "tokenMinimumBalance",
            args: [quoteToken.address],
          });

          if (
            swapRouteRaw.quote.lessThan(minimumsReply) &&
            routingConfig?.attemptCount &&
            routingConfig?.attemptCount < 2
          ) {
            console.log(
              `WARNING- XChange Pool has an active loan that would put this trade below liquidation amount.`,
            );
            return this.route(amount, quoteCurrency, tradeType, swapConfig, {
              ...partialRoutingConfig,
              attemptCount: routingConfig.attemptCount
                ? routingConfig.attemptCount + 1
                : 1,
              ignoreThesePools: {
                v2: swapRouteRaw.routes[0].route?.pairs.map((pair) =>
                  this.normalizeAddress(pair.address),
                ),
                v3: [],
              },
            });
          } else if (
            routingConfig?.attemptCount &&
            routingConfig?.attemptCount >= 2
          )
            throw new Error(
              "XChange Pool has an active loan that would put this trade below liquidation amount.",
            );
        }
      }
    }

    if (!!swapRouteRaw && this.setBestRoute && swapConfig?.saveRoutes)
      this.setBestRoute(swapRouteRaw);

    if (
      cacheMode === CacheMode.Tapcompare &&
      swapRouteFromCache &&
      swapRouteFromChain
    ) {
      const quoteDiff = swapRouteFromChain.quote.subtract(
        swapRouteFromCache.quote,
      );
      const quoteGasAdjustedDiff = swapRouteFromChain.quoteGasAdjusted.subtract(
        swapRouteFromCache.quoteGasAdjusted,
      );
      const gasUsedDiff =
        BigInt(swapRouteFromChain.estimatedGasUsed) +
        BigInt(swapRouteFromCache.estimatedGasUsed);

      // Only log if quoteDiff is different from 0, or if quoteGasAdjustedDiff and gasUsedDiff are both different from 0
      if (
        !quoteDiff.equalTo(0) ||
        !(quoteGasAdjustedDiff.equalTo(0) || BigInt(gasUsedDiff) === BigInt(0))
      ) {
        // Calculates the percentage of the difference with respect to the quoteFromChain (not from cache)
        const misquotePercent =
          (BigInt(quoteGasAdjustedDiff.toExact()) /
            BigInt(swapRouteFromChain.quoteGasAdjusted.toExact())) *
          BigInt(100);

        metric.putMetric(
          `TapcompareCachedRoute_quoteGasAdjustedDiffPercent`,
          Number(misquotePercent),
          MetricLoggerUnit.Percent,
        );

        log.warn(
          LogCodes.QUOTE_DIFF,
          `Comparing quotes between Chain and Cache for ${this.tokenPairSymbolTradeTypeChainId(
            tokenIn,
            tokenOut,
            tradeType,
          )}`,
          {
            quoteFromChain: swapRouteFromChain.quote.toExact(),
            quoteFromCache: swapRouteFromCache.quote.toExact(),
            quoteDiff: quoteDiff.toExact(),
            quoteGasAdjustedFromChain:
              swapRouteFromChain.quoteGasAdjusted.toExact(),
            quoteGasAdjustedFromCache:
              swapRouteFromCache.quoteGasAdjusted.toExact(),
            quoteGasAdjustedDiff: quoteGasAdjustedDiff.toExact(),
            gasUsedFromChain: swapRouteFromChain.estimatedGasUsed.toString(),
            gasUsedFromCache: swapRouteFromCache.estimatedGasUsed.toString(),
            gasUsedDiff: gasUsedDiff.toString(),
            routesFromChain: swapRouteFromChain.routes.toString(),
            routesFromCache: swapRouteFromCache.routes.toString(),
            amount: amount.toExact(),
            originalAmount: cachedRoutes?.originalAmount,
            pair: this.tokenPairSymbolTradeTypeChainId(
              tokenIn,
              tokenOut,
              tradeType,
            ),
            blockNumber,
          },
        );
      }
    }

    if (!swapRouteRaw) {
      return null;
    }

    const {
      quote,
      quoteGasAdjusted,
      estimatedGasUsed,
      routes: routeAmounts,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
    } = swapRouteRaw;

    if (
      this.routeCachingProvider &&
      routingConfig.writeToCachedRoutes &&
      cacheMode !== CacheMode.Darkmode &&
      swapRouteFromChain
    ) {
      // Generate the object to be cached
      const routesToCache = CachedRoutes.fromRoutesWithValidQuotes(
        swapRouteFromChain.routes,
        this.chainId,
        tokenIn,
        tokenOut,
        protocols.sort(), // sort it for consistency in the order of the protocols.
        Number(blockNumber),
        tradeType,
        amount.toExact(),
      );

      if (routesToCache) {
        // Attempt to insert the entry in cache. This is fire and forget promise.
        // The catch method will prevent any exception from blocking the normal code execution.
        this.routeCachingProvider
          .setCachedRoute(routesToCache, amount)
          .then((success) => {
            const status = success ? "success" : "rejected";
            metric.putMetric(
              `SetCachedRoute_${status}`,
              1,
              MetricLoggerUnit.Count,
            );
          })
          .catch((reason) => {
            log.error(LogCodes.FAIL, `SetCachedRoute failure`, {
              reason: reason,
              tokenPair: this.tokenPairSymbolTradeTypeChainId(
                tokenIn,
                tokenOut,
                tradeType,
              ),
            });

            metric.putMetric(
              `SetCachedRoute_failure`,
              1,
              MetricLoggerUnit.Count,
            );
          });
      } else {
        metric.putMetric(
          `SetCachedRoute_unnecessary`,
          1,
          MetricLoggerUnit.Count,
        );
      }
    }

    metric.putMetric(
      `QuoteFoundForChain${this.chainId}`,
      1,
      MetricLoggerUnit.Count,
    );
    if (signal.aborted && !swapConfig?.ignoreAborts) {
      log.info(LogCodes.ABORTED, "Quote aborted");
      return null;
    }
    // Build Trade object that represents the optimal swap.
    const trade = buildTrade<typeof tradeType>(
      currencyIn,
      currencyOut,
      tradeType,
      routeAmounts,
    );

    let methodParameters: MethodParameters | undefined;

    if (signal.aborted && !swapConfig?.ignoreAborts) {
      log.info(LogCodes.ABORTED, "Quote aborted");
      return null;
    }
    // If user provided recipient, deadline etc. we also generate the calldata required to execute
    // the swap and return it too.
    if (swapConfig) {
      methodParameters = buildSwapMethodParameters(
        trade,
        swapConfig,
        this.chainId,
      );
    }

    const tokenOutAmount =
      tradeType === TradeType.EXACT_OUTPUT
        ? originalAmount // we need to pass in originalAmount instead of amount, because amount already added portionAmount in case of exact out swap
        : quote;
    const portionAmount = this.portionProvider.getPortionAmount(
      tokenOutAmount,
      tradeType,
      swapConfig,
    );
    const portionQuoteAmount = this.portionProvider.getPortionQuoteAmount(
      tradeType,
      quote,
      amount, // we need to pass in amount instead of originalAmount here, because amount here needs to add the portion for exact out
      portionAmount,
    );

    // we need to correct quote and quote gas adjusted for exact output when portion is part of the exact out swap
    const correctedQuote = this.portionProvider.getQuote(
      tradeType,
      quote,
      portionQuoteAmount,
    );

    const correctedQuoteGasAdjusted = this.portionProvider.getQuoteGasAdjusted(
      tradeType,
      quoteGasAdjusted,
      portionQuoteAmount,
    );
    const quoteGasAndPortionAdjusted =
      this.portionProvider.getQuoteGasAndPortionAdjusted(
        tradeType,
        quoteGasAdjusted,
        portionAmount,
      );

    const swapRoute: SwapRoute = {
      quote: correctedQuote,
      quoteGasAdjusted: correctedQuoteGasAdjusted,
      estimatedGasUsed,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      gasPriceWei,
      route: routeAmounts,
      trade,
      methodParameters,
      blockNumber: blockNumber as bigint,
      hitsCachedRoute: hitsCachedRoute,
      portionAmount: portionAmount,
      quoteGasAndPortionAdjusted: quoteGasAndPortionAdjusted,
    };

    if (swapConfig?.simulate && methodParameters?.calldata) {
      if (!this.simulator) {
        throw new Error("Simulator not initialized!");
      }

      const fromAddress = swapConfig.simulate.fromAddress;
      const beforeSimulate = Date.now();
      const swapRouteWithSimulation = await this.simulator.simulate(
        fromAddress,
        swapConfig,
        swapRoute,
        amount,
        // Quote will be in WETH even if quoteCurrency is ETH
        // So we init a new CurrencyAmount object here
        CurrencyAmount.fromRawAmount(quoteCurrency, quote.quotient),
        this.l2GasDataProvider
          ? await this.l2GasDataProvider.getGasData()
          : undefined,
        providerConfig,
      );
      metric.putMetric(
        "Simulate Transaction",
        Date.now() - beforeSimulate,
        MetricLoggerUnit.Milliseconds,
      );
      log.info(LogCodes.SIMULATE_SWAP_ROUTE, { swapRouteWithSimulation });

      return swapRouteWithSimulation;
    }
    if (signal.aborted && !swapConfig?.ignoreAborts) {
      log.info(LogCodes.ABORTED, "Quote aborted");
      return null;
    }
    return swapRoute;
  }

  public async routeFromValidQuote(
    amount: CurrencyAmount,
    swapRouteRaw: RouteWithValidQuote,
    tradeType: TradeType,
    swapConfig?: SwapOptions,
  ): Promise<SwapRoute | null> {
    const blockNumber = await this.getBlockNumberPromise();

    // Build Trade object that represents the optimal swap.
    const trade = buildTrade<typeof tradeType>(
      swapRouteRaw.route.input,
      swapRouteRaw.route.output,
      tradeType,
      [swapRouteRaw],
    );

    log.info(LogCodes.NEW_TRADE, { trade });

    let methodParameters: MethodParameters | undefined;

    // If user provided recipient, deadline etc. we also generate the calldata required to execute
    // the swap and return it too.
    if (swapConfig) {
      methodParameters = buildSwapMethodParameters(
        trade,
        swapConfig,
        this.chainId,
      );
    }

    const gasPriceWei = await this.getGasPriceWei();

    const tokenOutAmount =
      tradeType === TradeType.EXACT_OUTPUT ? amount : swapRouteRaw.quote;
    const portionAmount = this.portionProvider.getPortionAmount(
      tokenOutAmount,
      tradeType,
      swapConfig,
    );
    const portionQuoteAmount = this.portionProvider.getPortionQuoteAmount(
      tradeType,
      swapRouteRaw.quote,
      amount, // we need to pass in amount instead of originalAmount here, because amount here needs to add the portion for exact out
      portionAmount,
    );

    // we need to correct quote and quote gas adjusted for exact output when portion is part of the exact out swap
    const correctedQuote = this.portionProvider.getQuote(
      tradeType,
      swapRouteRaw.quote,
      portionQuoteAmount,
    );

    const correctedQuoteGasAdjusted = this.portionProvider.getQuoteGasAdjusted(
      tradeType,
      swapRouteRaw.quoteAdjustedForGas,
      portionQuoteAmount,
    );
    const quoteGasAndPortionAdjusted =
      this.portionProvider.getQuoteGasAndPortionAdjusted(
        tradeType,
        swapRouteRaw.quoteAdjustedForGas,
        portionAmount,
      );

    const newBestRoute = {
      quote: swapRouteRaw.quote,
      estimatedGasUsed: swapRouteRaw.gasEstimate,
      estimatedGasUsedQuoteToken: swapRouteRaw.gasCostInToken,
      estimatedGasUsedUSD: swapRouteRaw.gasCostInUSD,
      quoteGasAdjusted: correctedQuoteGasAdjusted,
      routes: [swapRouteRaw],
    };

    if (!!newBestRoute && this.setSecondaryRoute)
      this.setSecondaryRoute(newBestRoute);

    const swapRoute: SwapRoute = {
      quote: correctedQuote,
      quoteGasAdjusted: correctedQuoteGasAdjusted,
      estimatedGasUsed: swapRouteRaw.gasEstimate,
      estimatedGasUsedQuoteToken: swapRouteRaw.gasCostInToken,
      estimatedGasUsedUSD: swapRouteRaw.gasCostInUSD,
      gasPriceWei,
      route: [swapRouteRaw],
      trade,
      methodParameters,
      blockNumber: blockNumber,
      hitsCachedRoute: false,
      portionAmount: portionAmount,
      quoteGasAndPortionAdjusted: quoteGasAndPortionAdjusted,
    };

    return swapRoute;
  }

  private async getSwapRouteFromCache(
    cachedRoutes: CachedRoutes,
    blockNumber: number,
    amount: CurrencyAmount,
    quoteToken: Token,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    v3GasModel: IGasModel<V3RouteWithValidQuote>,
    mixedRouteGasModel: IGasModel<MixedRouteWithValidQuote>,
    gasPriceWei: bigint,
    swapConfig?: SwapOptions,
  ): Promise<BestSwapRoute | null> {
    log.info(LogCodes.CACHE_HIT, "Routing across CachedRoute", {
      protocols: cachedRoutes.protocolsCovered,
      tradeType: cachedRoutes.tradeType,
      cachedBlockNumber: cachedRoutes.blockNumber,
      quoteBlockNumber: blockNumber,
    });
    const quotePromises: Promise<GetQuotesResult>[] = [];

    const v3Routes = cachedRoutes.routes
      .filter((route) => route.protocol === Protocol.V3)
      .filter(
        (route) =>
          routingConfig.ignoreThesePools?.v3?.filter(
            (poolAddress) =>
              (route.route as V3Route).pools.filter(
                (p) => p.address === poolAddress,
              ).length === 0,
          ).length !== 0,
      );
    const v2Routes = cachedRoutes.routes
      .filter((route) => route.protocol === Protocol.V2)
      .filter(
        (route) =>
          routingConfig.ignoreThesePools?.v2?.filter(
            (poolAddress) =>
              (route.route as V2Route).pairs.filter(
                (p) => p.address === poolAddress,
              ).length === 0,
          ).length !== 0,
      );
    const mixedRoutes = cachedRoutes.routes.filter(
      (route) => route.protocol === Protocol.MIXED,
    );

    let percents: number[];
    let amounts: CurrencyAmount[];
    if (cachedRoutes.routes.length > 1) {
      // If we have more than 1 route, we will quote the different percents for it, following the regular process
      [percents, amounts] = this.getAmountDistribution(amount, routingConfig);
    } else if (cachedRoutes.routes.length == 1) {
      [percents, amounts] = [[100], [amount]];
    } else {
      // In this case this means that there's no route, so we return null
      return Promise.resolve(null);
    }

    if (v3Routes.length > 0) {
      const v3RoutesFromCache: V3Route[] = v3Routes.map(
        (cachedRoute) => cachedRoute.route as V3Route,
      );
      metric.putMetric(
        "SwapRouteFromCache_V3_GetQuotes_Request",
        1,
        MetricLoggerUnit.Count,
      );

      const beforeGetQuotes = Date.now();

      quotePromises.push(
        this.v3Quoter
          .getQuotes(
            v3RoutesFromCache,
            amounts,
            percents,
            quoteToken,
            tradeType,
            routingConfig,
            undefined,
            v3GasModel,
          )
          .then((result) => {
            metric.putMetric(
              `SwapRouteFromCache_V3_GetQuotes_Load`,
              Date.now() - beforeGetQuotes,
              MetricLoggerUnit.Milliseconds,
            );

            return result;
          }),
      );
    }

    if (v2Routes.length > 0) {
      const v2RoutesFromCache: V2Route[] = v2Routes.map(
        (cachedRoute) => cachedRoute.route as V2Route,
      );
      metric.putMetric(
        "SwapRouteFromCache_V2_GetQuotes_Request",
        1,
        MetricLoggerUnit.Count,
      );

      const beforeGetQuotes = Date.now();

      quotePromises.push(
        this.v2Quoter
          .refreshRoutesThenGetQuotes(
            cachedRoutes.tokenIn,
            cachedRoutes.tokenOut,
            v2RoutesFromCache,
            amounts,
            percents,
            quoteToken,
            tradeType,
            routingConfig,
            gasPriceWei,
          )
          .then((result) => {
            metric.putMetric(
              `SwapRouteFromCache_V2_GetQuotes_Load`,
              Date.now() - beforeGetQuotes,
              MetricLoggerUnit.Milliseconds,
            );

            return result;
          }),
      );
    }

    if (mixedRoutes.length > 0) {
      const mixedRoutesFromCache: MixedRoute[] = mixedRoutes.map(
        (cachedRoute) => cachedRoute.route as MixedRoute,
      );
      metric.putMetric(
        "SwapRouteFromCache_Mixed_GetQuotes_Request",
        1,
        MetricLoggerUnit.Count,
      );

      const beforeGetQuotes = Date.now();

      quotePromises.push(
        this.mixedQuoter
          .getQuotes(
            mixedRoutesFromCache,
            amounts,
            percents,
            quoteToken,
            tradeType,
            routingConfig,
            undefined,
            mixedRouteGasModel,
          )
          .then((result) => {
            metric.putMetric(
              `SwapRouteFromCache_Mixed_GetQuotes_Load`,
              Date.now() - beforeGetQuotes,
              MetricLoggerUnit.Milliseconds,
            );

            return result;
          }),
      );
    }

    const getQuotesResults = await Promise.all(quotePromises);
    const allRoutesWithValidQuotes = _.flatMap(
      getQuotesResults,
      (quoteResult) => quoteResult.routesWithValidQuotes,
    );

    if (this.addPossibleRoutes && swapConfig?.saveRoutes) {
      this.addPossibleRoutes(
        allRoutesWithValidQuotes.filter((q) => q.percent === 100),
      );
    }

    const bestSwapRoute = await getBestSwapRoute(
      amount,
      percents,
      allRoutesWithValidQuotes,
      tradeType,
      this.chainId,
      routingConfig,
      this.portionProvider,
      v3GasModel,
      swapConfig,
    );

    return bestSwapRoute;
  }

  private async getSwapRouteFromChain(
    amount: CurrencyAmount,
    tokenIn: Token,
    tokenOut: Token,
    protocols: Protocol[],
    quoteToken: Token,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    v3GasModel: IGasModel<V3RouteWithValidQuote>,
    mixedRouteGasModel: IGasModel<MixedRouteWithValidQuote>,
    gasPriceWei: bigint,
    swapConfig?: SwapOptions,
  ): Promise<BestSwapRoute | null> {
    // Generate our distribution of amounts, i.e. fractions of the input amount.
    // We will get quotes for fractions of the input amount for different routes, then
    // combine to generate split routes.
    const [percents, amounts] = this.getAmountDistribution(
      amount,
      routingConfig,
    );

    const noProtocolsSpecified = protocols.length === 0;
    const v3ProtocolSpecified = protocols.includes(Protocol.V3);
    const v2ProtocolSpecified = protocols.includes(Protocol.V2);
    // TODO: Verify this is matching our expected be
    // @ts-expect-error: fix migration
    const v2SupportedInChain = V2_SUPPORTED.includes(this.chainId);
    const shouldQueryMixedProtocol =
      protocols.includes(Protocol.MIXED) ||
      (noProtocolsSpecified && v2SupportedInChain);
    const mixedProtocolAllowed =
      // @ts-expect-error: fix migration
      [ChainId.ETHEREUM, ChainId.ETHEREUM_TESTNET].includes(this.chainId) &&
      tradeType === TradeType.EXACT_INPUT;

    const beforeGetCandidates = Date.now();

    let v3CandidatePoolsPromise: Promise<V3CandidatePools | undefined> =
      Promise.resolve(undefined);
    if (
      v3ProtocolSpecified ||
      noProtocolsSpecified ||
      (shouldQueryMixedProtocol && mixedProtocolAllowed)
    ) {
      v3CandidatePoolsPromise = getV3CandidatePools({
        tokenIn,
        tokenOut,
        tokenProvider: this.tokenProvider,
        blockedTokenListProvider: this.blockedTokenListProvider,
        poolProvider: this.v3PoolProvider,
        routeType: tradeType,
        subgraphProvider: this.v3SubgraphProvider,
        routingConfig,
        chainId: this.chainId,
      }).then((candidatePools) => {
        metric.putMetric(
          "GetV3CandidatePools",
          Date.now() - beforeGetCandidates,
          MetricLoggerUnit.Milliseconds,
        );
        return candidatePools;
      });
    }

    let v2CandidatePoolsPromise: Promise<V2CandidatePools | undefined> =
      Promise.resolve(undefined);
    if (
      (v2SupportedInChain && (v2ProtocolSpecified || noProtocolsSpecified)) ||
      (shouldQueryMixedProtocol && mixedProtocolAllowed)
    ) {
      // Fetch all the pools that we will consider routing via. There are thousands
      // of pools, so we filter them to a set of candidate pools that we expect will
      // result in good prices.
      v2CandidatePoolsPromise = getV2CandidatePools({
        tokenIn,
        tokenOut,
        tokenProvider: this.tokenProvider,
        blockedTokenListProvider: this.blockedTokenListProvider,
        poolProvider: this.v2PoolProvider,
        routeType: tradeType,
        subgraphProvider: this.v2SubgraphProvider,
        routingConfig,
        chainId: this.chainId,
      }).then((candidatePools) => {
        metric.putMetric(
          "GetV2CandidatePools",
          Date.now() - beforeGetCandidates,
          MetricLoggerUnit.Milliseconds,
        );
        return candidatePools;
      });
    }

    const quotePromises: Promise<GetQuotesResult>[] = [];

    // Maybe Quote V3 - if V3 is specified, or no protocol is specified
    if (v3ProtocolSpecified || noProtocolsSpecified) {
      log.info(LogCodes.TRADE_ROUTES, "Routing across V3", {
        protocols,
        tradeType,
      });

      metric.putMetric(
        "SwapRouteFromChain_V3_GetRoutesThenQuotes_Request",
        1,
        MetricLoggerUnit.Count,
      );
      const beforeGetRoutesThenQuotes = Date.now();

      quotePromises.push(
        v3CandidatePoolsPromise.then((v3CandidatePools) =>
          this.v3Quoter
            .getRoutesThenQuotes(
              tokenIn,
              tokenOut,
              amount,
              amounts,
              percents,
              quoteToken,
              v3CandidatePools!,
              tradeType,
              routingConfig,
              v3GasModel,
            )
            .then((result) => {
              metric.putMetric(
                `SwapRouteFromChain_V3_GetRoutesThenQuotes_Load`,
                Date.now() - beforeGetRoutesThenQuotes,
                MetricLoggerUnit.Milliseconds,
              );

              return result;
            }),
        ),
      );
    }

    // Maybe Quote V2 - if V2 is specified, or no protocol is specified AND v2 is supported in this chain
    if (v2SupportedInChain && (v2ProtocolSpecified || noProtocolsSpecified)) {
      log.info(LogCodes.TRADE_ROUTES, "Routing across V2", {
        protocols,
        tradeType,
      });

      metric.putMetric(
        "SwapRouteFromChain_V2_GetRoutesThenQuotes_Request",
        1,
        MetricLoggerUnit.Count,
      );
      const beforeGetRoutesThenQuotes = Date.now();

      quotePromises.push(
        v2CandidatePoolsPromise.then((v2CandidatePools) =>
          this.v2Quoter
            .getRoutesThenQuotes(
              tokenIn,
              tokenOut,
              amount,
              amounts,
              percents,
              quoteToken,
              v2CandidatePools!,
              tradeType,
              routingConfig,
              undefined,
              gasPriceWei,
            )
            .then((result) => {
              metric.putMetric(
                `SwapRouteFromChain_V2_GetRoutesThenQuotes_Load`,
                Date.now() - beforeGetRoutesThenQuotes,
                MetricLoggerUnit.Milliseconds,
              );
              return result;
            }),
        ),
      );
    }

    // Maybe Quote mixed routes
    // if MixedProtocol is specified or no protocol is specified and v2 is supported AND tradeType is ExactIn
    // AND is Mainnet or Gorli
    if (shouldQueryMixedProtocol && mixedProtocolAllowed) {
      log.info(LogCodes.TRADE_ROUTES, "Routing across MixedRoutes", {
        protocols,
        tradeType,
      });

      metric.putMetric(
        "SwapRouteFromChain_Mixed_GetRoutesThenQuotes_Request",
        1,
        MetricLoggerUnit.Count,
      );
      const beforeGetRoutesThenQuotes = Date.now();

      quotePromises.push(
        Promise.all([v3CandidatePoolsPromise, v2CandidatePoolsPromise]).then(
          ([v3CandidatePools, v2CandidatePools]) =>
            this.mixedQuoter
              .getRoutesThenQuotes(
                tokenIn,
                tokenOut,
                amount,
                amounts,
                percents,
                quoteToken,
                [v3CandidatePools!, v2CandidatePools!],
                tradeType,
                routingConfig,
                mixedRouteGasModel,
              )
              .then((result) => {
                metric.putMetric(
                  `SwapRouteFromChain_Mixed_GetRoutesThenQuotes_Load`,
                  Date.now() - beforeGetRoutesThenQuotes,
                  MetricLoggerUnit.Milliseconds,
                );

                return result;
              }),
        ),
      );
    }

    const getQuotesResults = await Promise.all(quotePromises);

    const allRoutesWithValidQuotes: RouteWithValidQuote[] = [];
    const allCandidatePools: CandidatePoolsBySelectionCriteria[] = [];
    getQuotesResults.forEach((getQuoteResult) => {
      allRoutesWithValidQuotes.push(
        ...getQuoteResult.routesWithValidQuotes.filter((route) => {
          if (route.protocol === Protocol.V2) {
            // Check if any of the route's pairs are in the ignore list
            const hasIgnoredPool = routingConfig.ignoreThesePools?.v2?.some(
              (ignoredAddress) =>
                route.route.pairs.some(
                  (pair) =>
                    pair.address.toLowerCase() === ignoredAddress.toLowerCase(),
                ),
            );

            // Return true to keep routes that don't have ignored pools
            return !hasIgnoredPool;
          }

          if (route.protocol === Protocol.V3) {
            // Check if any of the route's pools are in the ignore list
            const hasIgnoredPool = routingConfig.ignoreThesePools?.v3?.some(
              (ignoredAddress) =>
                route.route.pools.some(
                  (pool) =>
                    pool.address.toLowerCase() === ignoredAddress.toLowerCase(),
                ),
            );

            // Return true to keep routes that don't have ignored pools
            return !hasIgnoredPool;
          }

          return true;
        }),
      );

      if (getQuoteResult.candidatePools) {
        allCandidatePools.push(getQuoteResult.candidatePools);
      }
    });

    const validRoutes = allRoutesWithValidQuotes.filter((route) => {
      const priceImpact = this.calculatePriceImpact(route);
      return priceImpact.lessThan(MAX_PRICE_IMPACT_PERCENT);
    });

    if (validRoutes.length === 0) {
      log.info(
        LogCodes.NO_QUOTE,
        { amount, tradeType },
        "No valid routes found after price impact check",
      );
      throw new Error(
        "No trades with desirable price impacts, trade would be for a loss",
      );
    }

    if (validRoutes.length === 0) {
      log.info(LogCodes.NO_QUOTE, "Received no valid quotes", {
        validRoutes,
      });
      return null;
    }

    if (this.addPossibleRoutes && swapConfig?.saveRoutes) {
      this.addPossibleRoutes(validRoutes.filter((q) => q.percent === 100));
    }

    // Given all the quotes for all the amounts for all the routes, find the best combination.
    const bestSwapRoute = await getBestSwapRoute(
      amount,
      percents,
      validRoutes,
      tradeType,
      this.chainId,
      routingConfig,
      this.portionProvider,
      v3GasModel,
      swapConfig,
    );

    if (bestSwapRoute) {
      this.emitPoolSelectionMetrics(bestSwapRoute, allCandidatePools);
    }

    return bestSwapRoute;
  }

  private tradeTypeStr(tradeType: TradeType): string {
    return tradeType === TradeType.EXACT_INPUT ? "ExactIn" : "ExactOut";
  }

  private calculatePriceImpact(route: RouteWithValidQuote): Percent {
    // Implement price impact calculation logic here
    // This will depend on how your RouteWithValidQuote is structured
    // For example:
    const inputAmount = route.amount;
    const outputAmount = route.quote;
    const midPrice = route.route.midPrice;

    const exactQuote = midPrice.quote(inputAmount.wrapped);
    const slippage = exactQuote
      .subtract(outputAmount.wrapped)
      .divide(exactQuote);
    return new Percent(slippage.numerator, slippage.denominator);
  }

  private tokenPairSymbolTradeTypeChainId(
    tokenIn: Token,
    tokenOut: Token,
    tradeType: TradeType,
  ) {
    return `${tokenIn.symbol}/${tokenOut.symbol}/${this.tradeTypeStr(
      tradeType,
    )}/${this.chainId}`;
  }

  private determineCurrencyInOutFromTradeType(
    tradeType: TradeType,
    amount: CurrencyAmount,
    quoteCurrency: Currency,
  ) {
    if (tradeType === TradeType.EXACT_INPUT) {
      return {
        currencyIn: amount.currency,
        currencyOut: quoteCurrency,
      };
    } else {
      return {
        currencyIn: quoteCurrency,
        currencyOut: amount.currency,
      };
    }
  }

  private async getGasPriceWei(): Promise<bigint> {
    // Track how long it takes to resolve this async call.
    const beforeGasTimestamp = Date.now();

    // Get an estimate of the gas price to use when estimating gas cost of different routes.
    const { gasPriceWei } = await this.gasPriceProvider.getGasPrice();

    metric.putMetric(
      "GasPriceLoad",
      Date.now() - beforeGasTimestamp,
      MetricLoggerUnit.Milliseconds,
    );

    return gasPriceWei;
  }

  private async getGasModels(
    gasPriceWei: bigint,
    amountToken: Token,
    quoteToken: Token,
    providerConfig?: GasModelProviderConfig,
  ): Promise<GasModelType> {
    const beforeGasModel = Date.now();

    const usdPoolPromise = getHighestLiquidityV3USDPool(
      this.chainId,
      this.v3PoolProvider,
      providerConfig,
    );
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId];
    const nativeAndQuoteTokenV3PoolPromise = !quoteToken.equals(nativeCurrency)
      ? getHighestLiquidityV3NativePool(
          quoteToken,
          this.v3PoolProvider,
          providerConfig,
        )
      : Promise.resolve(null);
    const nativeAndAmountTokenV3PoolPromise = !amountToken.equals(
      nativeCurrency,
    )
      ? getHighestLiquidityV3NativePool(
          amountToken,
          this.v3PoolProvider,
          providerConfig,
        )
      : Promise.resolve(null);

    // If a specific gas token is specified in the provider config
    // fetch the highest liq V3 pool with it and the native currency
    const nativeAndSpecifiedGasTokenV3PoolPromise =
      providerConfig?.gasToken &&
      !providerConfig?.gasToken.equals(nativeCurrency)
        ? getHighestLiquidityV3NativePool(
            providerConfig?.gasToken,
            this.v3PoolProvider,
            providerConfig,
          )
        : Promise.resolve(null);

    const [
      usdPool,
      nativeAndQuoteTokenV3Pool,
      nativeAndAmountTokenV3Pool,
      nativeAndSpecifiedGasTokenV3Pool,
    ] = await Promise.all([
      usdPoolPromise,
      nativeAndQuoteTokenV3PoolPromise,
      nativeAndAmountTokenV3PoolPromise,
      nativeAndSpecifiedGasTokenV3PoolPromise,
    ]);

    const pools: LiquidityCalculationPools = {
      usdPool: usdPool,
      nativeAndQuoteTokenV3Pool: nativeAndQuoteTokenV3Pool,
      nativeAndAmountTokenV3Pool: nativeAndAmountTokenV3Pool,
      nativeAndSpecifiedGasTokenV3Pool: nativeAndSpecifiedGasTokenV3Pool,
    };

    const v2GasModelPromise = this.v2Supported?.includes(this.chainId)
      ? this.v2GasModelFactory
          .buildGasModel({
            chainId: this.chainId,
            gasPriceWei,
            poolProvider: this.v2PoolProvider,
            token: quoteToken,
            l2GasDataProvider: this.l2GasDataProvider,
            providerConfig: providerConfig,
          })
          .catch((_) => undefined) // If v2 model throws uncaught exception, we return undefined v2 gas model, so there's a chance v3 route can go through
      : Promise.resolve(undefined);

    const v3GasModelPromise = this.v3GasModelFactory.buildGasModel({
      chainId: this.chainId,
      gasPriceWei,
      pools,
      amountToken,
      quoteToken,
      v2poolProvider: this.v2PoolProvider,
      l2GasDataProvider: this.l2GasDataProvider,
      providerConfig: providerConfig,
    });

    const mixedRouteGasModelPromise =
      this.mixedRouteGasModelFactory.buildGasModel({
        chainId: this.chainId,
        gasPriceWei,
        pools,
        amountToken,
        quoteToken,
        v2poolProvider: this.v2PoolProvider,
        providerConfig: providerConfig,
      });

    const [v2GasModel, v3GasModel, mixedRouteGasModel] = await Promise.all([
      v2GasModelPromise,
      v3GasModelPromise,
      mixedRouteGasModelPromise,
    ]);

    metric.putMetric(
      "GasModelCreation",
      Date.now() - beforeGasModel,
      MetricLoggerUnit.Milliseconds,
    );

    return {
      v2GasModel: v2GasModel,
      v3GasModel: v3GasModel,
      mixedRouteGasModel: mixedRouteGasModel,
    } as GasModelType;
  }

  // Note multiplications here can result in a loss of precision in the amounts (e.g. taking 50% of 101)
  // This is reconcilled at the end of the algorithm by adding any lost precision to one of
  // the splits in the route.
  private getAmountDistribution(
    amount: CurrencyAmount,
    routingConfig: AlphaRouterConfig,
  ): [number[], CurrencyAmount[]] {
    const { distributionPercent } = routingConfig;
    const percents = [];
    const amounts = [];

    for (let i = 1; i <= 100 / distributionPercent; i++) {
      percents.push(i * distributionPercent);
      amounts.push(amount.multiply(new Fraction(i * distributionPercent, 100)));
    }

    return [percents, amounts];
  }

  private async buildSwapAndAddMethodParameters(
    trade: Trade<Currency, Currency, TradeType>,
    swapAndAddOptions: SwapAndAddOptions,
    swapAndAddParameters: SwapAndAddParameters,
  ): Promise<MethodParameters> {
    const imp =
      trade.routes[0]?.protocol == Protocol.V2
        ? (trade.routes[0] as RouteV2Wrapper<Currency, Currency>).pairs[0]!
            .pairType
        : (trade.routes[0] as RouteV3Wrapper<Currency, Currency>).pools[0]!
            .poolType;

    const {
      swapOptions: { recipient, slippageTolerance, deadline, inputTokenPermit },
      addLiquidityOptions: addLiquidityConfig,
    } = swapAndAddOptions;

    const preLiquidityPosition = swapAndAddParameters.preLiquidityPosition;
    const finalBalanceTokenIn =
      swapAndAddParameters.initialBalanceTokenIn.subtract(trade.inputAmount);
    const finalBalanceTokenOut =
      swapAndAddParameters.initialBalanceTokenOut.add(trade.outputAmount);
    const approvalTypes = await this.swapRouterProvider.getApprovalType(
      finalBalanceTokenIn,
      finalBalanceTokenOut,
      imp,
    );
    const zeroForOne = finalBalanceTokenIn.currency.wrapped.sortsBefore(
      finalBalanceTokenOut.currency.wrapped,
    );

    return {
      ...SwapRouter.swapAndAddCallParameters(
        trade,
        {
          recipient: recipient as `0x${string}`,
          slippageTolerance,
          deadlineOrPreviousBlockhash: deadline,
          inputTokenPermit,
        },
        Position.fromAmounts({
          pool: preLiquidityPosition.pool,
          tickLower: preLiquidityPosition.tickLower,
          tickUpper: preLiquidityPosition.tickUpper,
          amount0: zeroForOne
            ? finalBalanceTokenIn.quotient
            : finalBalanceTokenOut.quotient,
          amount1: zeroForOne
            ? finalBalanceTokenOut.quotient
            : finalBalanceTokenIn.quotient,
          useFullPrecision: false,
        }),
        addLiquidityConfig,
        approvalTypes.approvalTokenIn,
        approvalTypes.approvalTokenOut,
      ),
      to: generateRouterAddress(this.chainId, imp),
    };
  }

  private emitPoolSelectionMetrics(
    swapRouteRaw: {
      quote: CurrencyAmount;
      quoteGasAdjusted: CurrencyAmount;
      routes: RouteWithValidQuote[];
      estimatedGasUsed: bigint;
    },
    allPoolsBySelection: CandidatePoolsBySelectionCriteria[],
  ) {
    const poolAddressesUsed = new Set<string>();
    const { routes: routeAmounts } = swapRouteRaw;
    _(routeAmounts)
      .flatMap((routeAmount) => {
        const { poolAddresses } = routeAmount;
        return poolAddresses;
      })
      .forEach((address: string | V3ImplementationPair) => {
        if ((address as V3ImplementationPair).address) {
          poolAddressesUsed.add(
            (address as V3ImplementationPair).address.toLowerCase(),
          );
        } else {
          poolAddressesUsed.add((address as string).toLowerCase());
        }
      });

    for (const poolsBySelection of allPoolsBySelection) {
      const { protocol } = poolsBySelection;
      _.forIn(
        poolsBySelection.selections,
        (pools: PoolId[], topNSelection: string) => {
          const topNUsed =
            _.findLastIndex(pools, (pool) =>
              poolAddressesUsed.has(pool.id.toLowerCase()),
            ) + 1;
          metric.putMetric(
            _.capitalize(`${protocol}${topNSelection}`),
            topNUsed,
            MetricLoggerUnit.Count,
          );
        },
      );
    }

    let hasV3Route = false;
    let hasV2Route = false;
    let hasMixedRoute = false;
    for (const routeAmount of routeAmounts) {
      if (routeAmount.protocol === Protocol.V3) {
        hasV3Route = true;
      }
      if (routeAmount.protocol === Protocol.V2) {
        hasV2Route = true;
      }
      if (routeAmount.protocol === Protocol.MIXED) {
        hasMixedRoute = true;
      }
    }

    if (hasMixedRoute && (hasV3Route || hasV2Route)) {
      if (hasV3Route && hasV2Route) {
        metric.putMetric(
          `MixedAndV3AndV2SplitRoute`,
          1,
          MetricLoggerUnit.Count,
        );
        metric.putMetric(
          `MixedAndV3AndV2SplitRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      } else if (hasV3Route) {
        metric.putMetric(`MixedAndV3SplitRoute`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `MixedAndV3SplitRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      } else if (hasV2Route) {
        metric.putMetric(`MixedAndV2SplitRoute`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `MixedAndV2SplitRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      }
    } else if (hasV3Route && hasV2Route) {
      metric.putMetric(`V3AndV2SplitRoute`, 1, MetricLoggerUnit.Count);
      metric.putMetric(
        `V3AndV2SplitRouteForChain${this.chainId}`,
        1,
        MetricLoggerUnit.Count,
      );
    } else if (hasMixedRoute) {
      if (routeAmounts.length > 1) {
        metric.putMetric(`MixedSplitRoute`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `MixedSplitRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      } else {
        metric.putMetric(`MixedRoute`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `MixedRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      }
    } else if (hasV3Route) {
      if (routeAmounts.length > 1) {
        metric.putMetric(`V3SplitRoute`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `V3SplitRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      } else {
        metric.putMetric(`V3Route`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `V3RouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      }
    } else if (hasV2Route) {
      if (routeAmounts.length > 1) {
        metric.putMetric(`V2SplitRoute`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `V2SplitRouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      } else {
        metric.putMetric(`V2Route`, 1, MetricLoggerUnit.Count);
        metric.putMetric(
          `V2RouteForChain${this.chainId}`,
          1,
          MetricLoggerUnit.Count,
        );
      }
    }
  }

  private calculateOptimalRatio(
    position: Position,
    sqrtRatioX96: bigint,
    zeroForOne: boolean,
  ): Fraction {
    const upperSqrtRatioX96 = BigInt(
      TickMath.getSqrtRatioAtTick(position.tickUpper),
    );
    const lowerSqrtRatioX96 = BigInt(
      TickMath.getSqrtRatioAtTick(position.tickLower),
    );

    // returns Fraction(0, 1) for any out of range position regardless of zeroForOne. Implication: function
    // cannot be used to determine the trading direction of out of range positions.
    if (sqrtRatioX96 > upperSqrtRatioX96 || sqrtRatioX96 < lowerSqrtRatioX96) {
      return new Fraction(0, 1);
    }

    const precision = BigInt("1" + "0".repeat(18));
    let optimalRatio = new Fraction(
      SqrtPriceMath.getAmount0Delta(
        sqrtRatioX96,
        upperSqrtRatioX96,
        precision,
        true,
      ),
      SqrtPriceMath.getAmount1Delta(
        sqrtRatioX96,
        lowerSqrtRatioX96,
        precision,
        true,
      ),
    );
    if (!zeroForOne) optimalRatio = optimalRatio.invert();
    return optimalRatio;
  }

  public async userHasSufficientBalance(
    fromAddress: `0x${string}`,
    tradeType: TradeType,
    amount: CurrencyAmount,
    quote: CurrencyAmount,
  ): Promise<boolean> {
    try {
      const neededBalance =
        tradeType === TradeType.EXACT_INPUT ? amount : quote;
      let balance: bigint;
      if (neededBalance.currency.isNative) {
        balance = await (this.provider as PublicClient).getBalance({
          address: fromAddress,
        });
      } else {
        const tokenContract = getContract({
          address: neededBalance.currency.address,
          abi: erc20ABI,
          client: {
            public: this.provider,
          },
        });
        balance = await tokenContract.read.balanceOf([fromAddress]);
      }
      return BigInt(balance) >= BigInt(neededBalance.quotient.toString());
    } catch (e) {
      log.error(LogCodes.FAIL, "Error while checking user balance", e);
      return false;
    }
  }

  private absoluteValue(fraction: Fraction): Fraction {
    const numeratorAbs =
      fraction.numerator < BigInt(0) ? -fraction.numerator : fraction.numerator;
    const denominatorAbs =
      fraction.denominator < BigInt(0)
        ? -fraction.denominator
        : fraction.denominator;
    return new Fraction(numeratorAbs, denominatorAbs);
  }

  private getBlockNumberPromise(): Promise<bigint> {
    return retry(
      async (_b, attempt) => {
        if (attempt > 1) {
          log.info(LogCodes.GET_BLOCK, `Get block number attempt ${attempt}`);
        }
        return (this.provider as PublicClient).getBlockNumber();
      },
      {
        retries: 2,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    );
  }

  /**
   * Produces a route for wrapping or unwrapping the native currency
   */
  public async wrapUnwrap(
    amount: CurrencyAmount,
    tradeType: TradeType,
    swapConfig?: SwapOptions,
  ): Promise<SwapRoute | null> {
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId];

    // Check if this is a wrap/unwrap case
    const isWrap =
      !amount.currency.isToken && tradeType === TradeType.EXACT_INPUT;
    const isUnwrap =
      amount.currency.equals(nativeCurrency) &&
      tradeType === TradeType.EXACT_INPUT;

    if (!isWrap && !isUnwrap) {
      return null;
    }

    // For wrapping, quote = input amount
    // For unwrapping, quote = input amount
    const quote = amount;

    // No gas estimate needed for wrapping/unwrapping
    const estimatedGasUsed = BigInt(45_000); // Estimate for wrap/unwrap
    const gasPriceWei = await this.getGasPriceWei();

    // Convert gas cost to quote token
    const quoteGasAdjusted = amount;

    // Build dummy route to satisfy interface
    const route: RouteWithValidQuote[] = [
      {
        protocol: Protocol.V2, // Dummy protocol
        amount: amount,
        quote: quote,
        percent: 100,
        // @ts-expect-error: We don't need anything else for a wrapping/unwrapping case
        route: {
          protocol: Protocol.V2,
          pairs: [
            new Pair(amount.wrapped, quote.wrapped, Implementation.XCHANGE),
          ],
          input: amount.currency.wrapped,
          output: isWrap ? nativeCurrency : nativeCurrency.wrapped,
          path: [
            amount.currency.wrapped,
            isWrap ? nativeCurrency : nativeCurrency.wrapped,
          ],
        },
        gasEstimate: estimatedGasUsed,
        gasCostInToken: CurrencyAmount.fromRawAmount(amount.currency, 0),
        gasCostInUSD: CurrencyAmount.fromRawAmount(amount.currency, 0),
        tradeType: tradeType,
        poolAddresses: [],
        tokenPath: [
          amount.currency.wrapped,
          isWrap ? nativeCurrency : nativeCurrency.wrapped,
        ],
      },
    ];

    // Build trade object
    const trade = buildTrade(
      amount.currency,
      isWrap ? nativeCurrency : nativeCurrency.wrapped,
      tradeType,
      route,
    );

    let methodParameters: MethodParameters | undefined;
    if (swapConfig) {
      methodParameters = buildSwapMethodParameters(
        trade,
        swapConfig,
        this.chainId,
      );
    }

    return {
      quote,
      quoteGasAdjusted,
      estimatedGasUsed,
      estimatedGasUsedQuoteToken: CurrencyAmount.fromRawAmount(
        amount.currency,
        0,
      ),
      estimatedGasUsedUSD: CurrencyAmount.fromRawAmount(amount.currency, 0),
      gasPriceWei,
      route,
      trade,
      methodParameters,
      blockNumber: await this.getBlockNumberPromise(),
      hitsCachedRoute: false,
      portionAmount: CurrencyAmount.fromRawAmount(amount.currency, 0),
      quoteGasAndPortionAdjusted: quoteGasAdjusted,
    };
  }
}
