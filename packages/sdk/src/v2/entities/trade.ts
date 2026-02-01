/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import invariant from "tiny-invariant";

import type { Currency, Percent, Token } from "@x7/utils";
import {
  CurrencyAmount,
  Fraction,
  Price,
  Protocol,
  sortedInsert,
  TradeType,
} from "@x7/utils";

import { MAX_PRICE_IMPACT_PERCENT, ONE, ZERO } from "../../core/constants";
import { computePriceImpact } from "../../core/computePriceImpact";
import type { Pair } from "./pair";
import { RouteV2 } from "./route";

// minimal interface so the input output comparator may be shared across types
interface InputOutput<TInput extends Currency, TOutput extends Currency> {
  readonly inputAmount: CurrencyAmount<TInput>;
  readonly outputAmount: CurrencyAmount<TOutput>;
}

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparator<
  TInput extends Currency,
  TOutput extends Currency,
>(a: InputOutput<TInput, TOutput>, b: InputOutput<TInput, TOutput>): number {
  // must have same input and output token for comparison
  invariant(
    a.inputAmount.currency.equals(b.inputAmount.currency),
    "INPUT_CURRENCY",
  );
  invariant(
    a.outputAmount.currency.equals(b.outputAmount.currency),
    "OUTPUT_CURRENCY",
  );
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    }
    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}

interface InsufficientInputAmountError extends Error {
  isInsufficientInputAmountError: boolean;
}

function isInsufficientInputAmountError(
  error: unknown,
): error is InsufficientInputAmountError {
  return error instanceof Error && "isInsufficientInputAmountError" in error;
}

// extension of the input output comparator that also considers other dimensions of the trade in ranking them
export function tradeComparatorV2<
  TInput extends Currency,
  TOutput extends Currency,
  TTradeType extends TradeType,
>(
  a: TradeV2<TInput, TOutput, TTradeType>,
  b: TradeV2<TInput, TOutput, TTradeType>,
) {
  const ioComp = inputOutputComparator(a, b);
  if (ioComp !== 0) {
    return ioComp;
  }

  // consider lowest slippage next, since these are less likely to fail
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  }

  // finally consider the number of hops since each hop costs gas
  return a.route.path.length - b.route.path.length;
}

export interface BestTradeOptionsV2 {
  // how many results to return
  maxNumResults?: number;
  // the maximum number of hops a trade should contain
  maxHops?: number;
}

/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class TradeV2<
  TInput extends Currency,
  TOutput extends Currency,
  TTradeType extends TradeType,
> {
  /**
   * The route of the trade, i.e. which pairs the trade goes through and the input/output currencies.
   */
  public readonly route: RouteV2<TInput, TOutput>;
  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: TTradeType;
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: CurrencyAmount<TInput>;
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: CurrencyAmount<TOutput>;
  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price<TInput, TOutput>;
  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  public readonly priceImpact: Percent;

  public readonly protocol: Protocol = Protocol.V2;

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn<TInput extends Currency, TOutput extends Currency>(
    route: RouteV2<TInput, TOutput>,
    amountIn: CurrencyAmount<TInput>,
  ): TradeV2<TInput, TOutput, TradeType.EXACT_INPUT> {
    return new TradeV2(route, amountIn, TradeType.EXACT_INPUT);
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut<TInput extends Currency, TOutput extends Currency>(
    route: RouteV2<TInput, TOutput>,
    amountOut: CurrencyAmount<TOutput>,
  ): TradeV2<TInput, TOutput, TradeType.EXACT_OUTPUT> {
    return new TradeV2(route, amountOut, TradeType.EXACT_OUTPUT);
  }

  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public minimumAmountOut(slippageTolerance: Percent): CurrencyAmount<TOutput> {
    invariant(!slippageTolerance.lessThan(ZERO), "SLIPPAGE_TOLERANCE");
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.quotient).quotient;
      return CurrencyAmount.fromRawAmount(
        this.outputAmount.currency,
        slippageAdjustedAmountOut,
      );
    }
  }

  public constructor(
    route: RouteV2<TInput, TOutput>,
    amount: TTradeType extends TradeType.EXACT_INPUT
      ? CurrencyAmount<TInput>
      : CurrencyAmount<TOutput>,
    tradeType: TTradeType,
  ) {
    this.route = route;
    this.tradeType = tradeType;

    const tokenAmounts: CurrencyAmount<Token>[] = new Array(route.path.length);
    if (tradeType === TradeType.EXACT_INPUT) {
      invariant(amount.currency.equals(route.input), "INPUT");
      tokenAmounts[0] = amount.wrapped;
      for (let i = 0; i < route.path.length - 1; i++) {
        const pair = route.pairs[i];

        if (pair === undefined) {
          throw new Error("PAIR_NOT_FOUND");
        }

        if (tokenAmounts[i] === undefined) {
          throw new Error("TOKEN_AMOUNT_NOT_FOUND");
        }

        const [outputAmount] = pair.getOutputAmount(
          tokenAmounts[i]!,
          !!pair.token0.sellFeeBps,
        );
        tokenAmounts[i + 1] = outputAmount;
      }
      this.inputAmount = CurrencyAmount.fromFractionalAmount(
        route.input,
        amount.numerator,
        amount.denominator,
      );
      this.outputAmount = CurrencyAmount.fromFractionalAmount(
        route.output,
        tokenAmounts[tokenAmounts.length - 1]!.numerator,
        tokenAmounts[tokenAmounts.length - 1]!.denominator,
      );
    } else {
      invariant(amount.currency.equals(route.output), "OUTPUT");
      tokenAmounts[tokenAmounts.length - 1] = amount.wrapped;
      for (let i = route.path.length - 1; i > 0; i--) {
        const pair = route.pairs[i - 1];
        if (pair === undefined) {
          throw new Error("PAIR_NOT_FOUND");
        }

        if (tokenAmounts[i] === undefined) {
          throw new Error("TOKEN_AMOUNT_NOT_FOUND");
        }

        const [inputAmount] = pair.getInputAmount(
          tokenAmounts[i]!,
          !!pair.token1.buyFeeBps,
        );
        tokenAmounts[i - 1] = inputAmount;
      }
      this.inputAmount = CurrencyAmount.fromFractionalAmount(
        route.input,
        tokenAmounts[0]!.numerator,
        tokenAmounts[0]!.denominator,
      );
      this.outputAmount = CurrencyAmount.fromFractionalAmount(
        route.output,
        amount.numerator,
        amount.denominator,
      );
    }
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient,
    );
    this.priceImpact = computePriceImpact(
      route.midPrice,
      this.inputAmount,
      this.outputAmount,
    );
  }

  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public maximumAmountIn(slippageTolerance: Percent): CurrencyAmount<TInput> {
    invariant(!slippageTolerance.lessThan(ZERO), "SLIPPAGE_TOLERANCE");
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE)
        .add(slippageTolerance)
        .multiply(this.inputAmount.quotient).quotient;
      return CurrencyAmount.fromRawAmount(
        this.inputAmount.currency,
        slippageAdjustedAmountIn,
      );
    }
  }

  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactIn<
    TInput extends Currency,
    TOutput extends Currency,
  >(
    pairs: Pair[],
    currencyAmountIn: CurrencyAmount<TInput>,
    currencyOut: TOutput,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptionsV2 = {},
    // used in recursion.
    currentPairs: Pair[] = [],
    nextAmountIn: CurrencyAmount<Currency> = currencyAmountIn,
    bestTrades: TradeV2<TInput, TOutput, TradeType.EXACT_INPUT>[] = [],
  ): TradeV2<TInput, TOutput, TradeType.EXACT_INPUT>[] {
    invariant(pairs.length > 0, "PAIRS");
    invariant(maxHops > 0, "MAX_HOPS");
    invariant(
      currencyAmountIn === nextAmountIn || currentPairs.length > 0,
      "INVALID_RECURSION",
    );

    const amountIn = nextAmountIn.wrapped;
    const tokenOut = currencyOut.wrapped;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (pair === undefined) {
        throw new Error("PAIR_NOT_FOUND");
      }

      // pair irrelevant
      if (
        !pair.token0.equals(amountIn.currency) &&
        !pair.token1.equals(amountIn.currency)
      )
        continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;

      let amountOut: CurrencyAmount<Token>;
      try {
        [amountOut] = pair.getOutputAmount(amountIn);
      } catch (error) {
        if (isInsufficientInputAmountError(error)) {
          // input too low
          continue;
        }
        throw error;
      }

      if (amountOut.currency.equals(tokenOut)) {
        const newTrade = new TradeV2(
          new RouteV2(
            [...currentPairs, pair],
            currencyAmountIn.currency,
            currencyOut,
          ),
          currencyAmountIn,
          TradeType.EXACT_INPUT,
        );

        // Check if the price impact is acceptable
        if (newTrade.priceImpact.lessThan(MAX_PRICE_IMPACT_PERCENT)) {
          sortedInsert(bestTrades, newTrade, maxNumResults, tradeComparatorV2);
        }
      }

      // we have arrived at the output token, so this is the final trade of one of the paths
      if (amountOut.currency.equals(tokenOut)) {
        const newTrade = new TradeV2(
          new RouteV2(
            [...currentPairs, pair],
            currencyAmountIn.currency,
            currencyOut,
          ),
          currencyAmountIn,
          TradeType.EXACT_INPUT,
        );

        if (newTrade.priceImpact.lessThan(MAX_PRICE_IMPACT_PERCENT)) {
          sortedInsert(bestTrades, newTrade, maxNumResults, tradeComparatorV2);
        }
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs
          .slice(0, i)
          .concat(pairs.slice(i + 1, pairs.length));

        // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
        TradeV2.bestTradeExactIn(
          pairsExcludingThisPair,
          currencyAmountIn,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1,
          },
          [...currentPairs, pair],
          amountOut,
          bestTrades,
        );
      }
    }

    return bestTrades;
  }

  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   */
  public worstExecutionPrice(
    slippageTolerance: Percent,
  ): Price<TInput, TOutput> {
    return new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.maximumAmountIn(slippageTolerance).quotient,
      this.minimumAmountOut(slippageTolerance).quotient,
    );
  }

  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param currencyAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactOut<
    TInput extends Currency,
    TOutput extends Currency,
  >(
    pairs: Pair[],
    currencyIn: TInput,
    currencyAmountOut: CurrencyAmount<TOutput>,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptionsV2 = {},
    // used in recursion.
    currentPairs: Pair[] = [],
    nextAmountOut: CurrencyAmount<Currency> = currencyAmountOut,
    bestTrades: TradeV2<TInput, TOutput, TradeType.EXACT_OUTPUT>[] = [],
  ): TradeV2<TInput, TOutput, TradeType.EXACT_OUTPUT>[] {
    invariant(pairs.length > 0, "PAIRS");
    invariant(maxHops > 0, "MAX_HOPS");
    invariant(
      currencyAmountOut === nextAmountOut || currentPairs.length > 0,
      "INVALID_RECURSION",
    );

    const amountOut = nextAmountOut.wrapped;
    const tokenIn = currencyIn.wrapped;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      if (pair === undefined) {
        throw new Error("PAIR_NOT_FOUND");
      }
      // pair irrelevant
      if (
        !pair.token0.equals(amountOut.currency) &&
        !pair.token1.equals(amountOut.currency)
      )
        continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;

      let amountIn: CurrencyAmount<Token>;
      try {
        [amountIn] = pair.getInputAmount(amountOut);
      } catch (error) {
        if (isInsufficientInputAmountError(error)) {
          // input too low
          continue;
        }
        throw error;
      }
      // we have arrived at the input token, so this is the first trade of one of the paths
      if (amountIn.currency.equals(tokenIn)) {
        const newTrade = new TradeV2(
          new RouteV2(
            [pair, ...currentPairs],
            currencyIn,
            currencyAmountOut.currency,
          ),
          currencyAmountOut,
          TradeType.EXACT_OUTPUT,
        );

        // Check if the price impact is acceptable
        if (newTrade.priceImpact.lessThan(MAX_PRICE_IMPACT_PERCENT)) {
          sortedInsert(bestTrades, newTrade, maxNumResults, tradeComparatorV2);
        }
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs
          .slice(0, i)
          .concat(pairs.slice(i + 1, pairs.length));

        // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
        TradeV2.bestTradeExactOut(
          pairsExcludingThisPair,
          currencyIn,
          currencyAmountOut,
          {
            maxNumResults,
            maxHops: maxHops - 1,
          },
          [pair, ...currentPairs],
          amountIn,
          bestTrades,
        );
      }
    }

    return bestTrades;
  }
}
