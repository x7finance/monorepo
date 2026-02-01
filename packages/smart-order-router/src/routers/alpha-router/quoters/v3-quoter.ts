/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import _ from "lodash";

import type { ChainId, Currency, Token } from "@x7/utils";
import { Implementation, LogCodes, Protocol, TradeType } from "@x7/utils";

import type {
  IOnChainQuoteProvider,
  ITokenListProvider,
  ITokenProvider,
  ITokenValidatorProvider,
  IV3PoolProvider,
} from "../../../providers";
import { TokenValidationResult } from "../../../providers";
import type { CurrencyAmount } from "../../../utils";
import { log, metric, MetricLoggerUnit, routeToString } from "../../../utils";
import type { V3Route } from "../../router";
import type { AlphaRouterConfig } from "../alpha-router";
import { V3RouteWithValidQuote } from "../entities";
import { computeAllV3Routes } from "../functions/compute-all-routes";
import type {
  CandidatePoolsBySelectionCriteria,
  V3CandidatePools,
} from "../functions/get-candidate-pools";
import type { IGasModel } from "../gas-models";
import { BaseQuoter } from "./base-quoter";
import type { GetQuotesResult } from "./model/results/get-quotes-result";
import type { GetRoutesResult } from "./model/results/get-routes-result";

export class V3Quoter extends BaseQuoter<V3CandidatePools, V3Route> {
  protected v3PoolProvider: IV3PoolProvider;
  protected onChainQuoteProvider: IOnChainQuoteProvider;
  protected enabledImplementations?: Implementation[];

  constructor(
    v3PoolProvider: IV3PoolProvider,
    onChainQuoteProvider: IOnChainQuoteProvider,
    tokenProvider: ITokenProvider,
    chainId: ChainId,
    blockedTokenListProvider?: ITokenListProvider,
    tokenValidatorProvider?: ITokenValidatorProvider,
    enabledImplementations?: Implementation[],
  ) {
    super(
      tokenProvider,
      chainId,
      Protocol.V3,
      blockedTokenListProvider,
      tokenValidatorProvider,
    );
    this.v3PoolProvider = v3PoolProvider;
    this.onChainQuoteProvider = onChainQuoteProvider;
    this.enabledImplementations = enabledImplementations;
  }

  protected async getRoutes(
    tokenIn: Token,
    tokenOut: Token,
    v3CandidatePools: V3CandidatePools,
    _tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
  ): Promise<GetRoutesResult<V3Route>> {
    const beforeGetRoutes = Date.now();
    // Fetch all the pools that we will consider routing via. There are thousands
    // of pools, so we filter them to a set of candidate pools that we expect will
    // result in good prices.
    const { poolAccessor, candidatePools } = v3CandidatePools;
    const poolsRaw = poolAccessor.getAllPools();

    // Drop any pools that contain fee on transfer tokens (not supported by v3) or have issues with being transferred.
    const pools = await this.applyTokenValidatorToPools(
      poolsRaw,
      (
        token: Currency,
        tokenValidation: TokenValidationResult | undefined,
      ): boolean => {
        // If there is no available validation result we assume the token is fine.
        if (!tokenValidation) {
          return false;
        }

        // Only filters out *intermediate* pools that involve tokens that we detect
        // cant be transferred. This prevents us trying to route through tokens that may
        // not be transferrable, but allows users to still swap those tokens if they
        // specify.
        //
        if (
          tokenValidation === TokenValidationResult.STF &&
          (token.equals(tokenIn) || token.equals(tokenOut))
        ) {
          return false;
        }

        return (
          tokenValidation === TokenValidationResult.FOT ||
          tokenValidation === TokenValidationResult.STF
        );
      },
    );

    // Given all our candidate pools, compute all the possible ways to route from tokenIn to tokenOut.
    const { maxSwapsPerPath } = routingConfig;
    const routes = computeAllV3Routes(
      tokenIn,
      tokenOut,
      pools,
      maxSwapsPerPath,
    );

    metric.putMetric(
      "V3GetRoutesLoad",
      Date.now() - beforeGetRoutes,
      MetricLoggerUnit.Milliseconds,
    );

    return {
      routes,
      candidatePools,
    };
  }

  public async getQuotes(
    routes: V3Route[],
    amounts: CurrencyAmount[],
    percents: number[],
    quoteToken: Token,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    candidatePools?: CandidatePoolsBySelectionCriteria,
    gasModel?: IGasModel<V3RouteWithValidQuote>,
  ): Promise<GetQuotesResult> {
    const beforeGetQuotes = Date.now();

    log.info(LogCodes.FETCHING_QUOTES, "Starting to get V3 quotes");

    if (gasModel === undefined) {
      throw new Error(
        "GasModel for V3RouteWithValidQuote is required to getQuotes",
      );
    }

    if (routes.length === 0) {
      return { routesWithValidQuotes: [], candidatePools };
    }

    // For all our routes, and all the fractional amounts, fetch quotes on-chain.
    const quoteFn =
      tradeType === TradeType.EXACT_INPUT
        ? this.onChainQuoteProvider.getQuotesManyExactIn.bind(
            this.onChainQuoteProvider,
          )
        : this.onChainQuoteProvider.getQuotesManyExactOut.bind(
            this.onChainQuoteProvider,
          );

    const beforeQuotes = Date.now();
    log.info(
      LogCodes.FETCHING_QUOTES,
      `Getting quotes for V3 for ${routes.length} routes with ${amounts.length} amounts per route.`,
    );

    const { routesWithQuotes } = await quoteFn<V3Route>(amounts, routes, {
      blockNumber: routingConfig.blockNumber,
    });

    metric.putMetric(
      "V3QuotesLoad",
      Date.now() - beforeQuotes,
      MetricLoggerUnit.Milliseconds,
    );

    metric.putMetric(
      "V3QuotesFetched",
      _(routesWithQuotes)
        .map(([, quotes]) => quotes.length)
        .sum(),
      MetricLoggerUnit.Count,
    );

    const routesWithValidQuotes = [];

    for (const routeWithQuote of routesWithQuotes) {
      const [route, quotes] = routeWithQuote;

      for (let i = 0; i < quotes.length; i++) {
        const percent = percents[i];
        const amountQuote = quotes[i];
        const {
          quote,
          amount,
          sqrtPriceX96AfterList,
          initializedTicksCrossedList,
          gasEstimate,
        } = amountQuote ?? {};

        if (
          !quote ||
          !sqrtPriceX96AfterList ||
          !initializedTicksCrossedList ||
          !gasEstimate
        ) {
          log.debug(
            LogCodes.DROPPING_QUOTE,
            {
              route: routeToString(route),
              amountQuote,
            },
            "Dropping a null V3 quote for route.",
          );
          continue;
        }

        if (amount === undefined) {
          throw new Error("Amount is undefined");
        }

        if (percent === undefined) {
          throw new Error("Percent is undefined");
        }

        const routeWithValidQuote = new V3RouteWithValidQuote({
          route,
          rawQuote: quote,
          amount,
          percent,
          sqrtPriceX96AfterList,
          initializedTicksCrossedList,
          quoterGasEstimate: gasEstimate,
          gasModel,
          quoteToken,
          tradeType,
          v3PoolProvider: this.v3PoolProvider,
        });

        if (
          this.enabledImplementations?.includes(
            route?.pools?.[0]?.poolType ?? Implementation.UNISWAP,
          )
        ) {
          routesWithValidQuotes.push(routeWithValidQuote);
        }
      }
    }

    metric.putMetric(
      "V3GetQuotesLoad",
      Date.now() - beforeGetQuotes,
      MetricLoggerUnit.Milliseconds,
    );

    return {
      routesWithValidQuotes,
      candidatePools,
    };
  }
}
