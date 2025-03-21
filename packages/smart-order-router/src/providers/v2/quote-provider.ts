/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/require-await */

import {
  InsufficientInputAmountError,
  InsufficientReservesError,
  LogCodes,
  TradeType,
} from "@x7/utils";

import type { V2Route } from "../../routers/router";
import type { CurrencyAmount } from "../../utils/amounts";
import { log } from "../../utils/log";
import { routeToString } from "../../utils/routes";
import type { ProviderConfig } from "../provider";

// Quotes can be null (e.g. pool did not have enough liquidity).
export interface V2AmountQuote {
  amount: CurrencyAmount;
  quote: bigint | null;
}

export type V2RouteWithQuotes = [V2Route, V2AmountQuote[]];

export interface IV2QuoteProvider {
  getQuotesManyExactIn(
    amountIns: CurrencyAmount[],
    routes: V2Route[],
    providerConfig: ProviderConfig,
  ): Promise<{ routesWithQuotes: V2RouteWithQuotes[] }>;

  getQuotesManyExactOut(
    amountOuts: CurrencyAmount[],
    routes: V2Route[],
    providerConfig: ProviderConfig,
  ): Promise<{ routesWithQuotes: V2RouteWithQuotes[] }>;
}

/**
 * Computes quotes for V2 off-chain. Quotes are computed using the balances
 * of the pools within each route provided.
 *
 * @export
 * @class V2QuoteProvider
 */
export class V2QuoteProvider implements IV2QuoteProvider {
  /* eslint-disable @typescript-eslint/no-empty-function */
  constructor() {}

  /* eslint-enable @typescript-eslint/no-empty-function */

  public async getQuotesManyExactIn(
    amountIns: CurrencyAmount[],
    routes: V2Route[],
    providerConfig: ProviderConfig,
  ): Promise<{ routesWithQuotes: V2RouteWithQuotes[] }> {
    return this.getQuotes(
      amountIns,
      routes,
      TradeType.EXACT_INPUT,
      providerConfig,
    );
  }

  public async getQuotesManyExactOut(
    amountOuts: CurrencyAmount[],
    routes: V2Route[],
    providerConfig: ProviderConfig,
  ): Promise<{ routesWithQuotes: V2RouteWithQuotes[] }> {
    return this.getQuotes(
      amountOuts,
      routes,
      TradeType.EXACT_OUTPUT,
      providerConfig,
    );
  }

  private async getQuotes(
    amounts: CurrencyAmount[],
    routes: V2Route[],
    tradeType: TradeType,
    _providerConfig: ProviderConfig,
  ): Promise<{ routesWithQuotes: V2RouteWithQuotes[] }> {
    const routesWithQuotes: V2RouteWithQuotes[] = [];
    const debugStrs: string[] = [];
    for (const route of routes) {
      const amountQuotes: V2AmountQuote[] = [];

      let insufficientInputAmountErrorCount = 0;
      let insufficientReservesErrorCount = 0;
      for (const amount of amounts) {
        try {
          if (tradeType == TradeType.EXACT_INPUT) {
            let outputAmount = amount.wrapped;

            for (const pair of route.pairs) {
              [outputAmount] = pair.getOutputAmount(
                outputAmount,
                _providerConfig.enableFeeOnTransferFeeFetching === true,
              );
            }

            amountQuotes.push({
              amount,
              quote: BigInt(outputAmount.quotient.toString()),
            });
          } else {
            let inputAmount = amount.wrapped;

            for (let i = route.pairs.length - 1; i >= 0; i--) {
              const pair = route.pairs[i]!;
              [inputAmount] = pair.getInputAmount(
                inputAmount,
                _providerConfig.enableFeeOnTransferFeeFetching === true,
              );
            }

            amountQuotes.push({
              amount,
              quote: BigInt(inputAmount.quotient.toString()),
            });
          }
        } catch (error) {
          // Can fail to get quotes, e.g. throws InsufficientReservesError or InsufficientInputAmountError.
          if (error instanceof InsufficientInputAmountError) {
            insufficientInputAmountErrorCount =
              insufficientInputAmountErrorCount + 1;
            amountQuotes.push({ amount, quote: null });
          } else if (error instanceof InsufficientReservesError) {
            insufficientReservesErrorCount = insufficientReservesErrorCount + 1;
            amountQuotes.push({ amount, quote: null });
          } else {
            throw error;
          }
        }
      }

      if (
        insufficientInputAmountErrorCount > 0 ||
        insufficientReservesErrorCount > 0
      ) {
        debugStrs.push(
          `${[
            routeToString(route),
          ]} Input: ${insufficientInputAmountErrorCount} Reserves: ${insufficientReservesErrorCount} }`,
        );
      }

      routesWithQuotes.push([route, amountQuotes]);
    }

    if (debugStrs.length > 0) {
      log.error(LogCodes.FAILED_QUOTES, `Failed quotes for V2 routes`, {
        debugStrs,
      });
    }

    return {
      routesWithQuotes,
    };
  }
}
