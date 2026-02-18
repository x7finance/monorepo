/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import invariant from "tiny-invariant"
import { encodePacked, getContractAddress, keccak256, toBytes } from "viem"

import {
  CurrencyAmount,
  Implementation,
  InsufficientInputAmountError,
  InsufficientReservesError,
  Percent,
  Price,
  Protocol,
  Token,
} from "@x7/utils"

import { FACTORY_ADDRESSES, PAIR_INIT_HASH } from "../../core/addresses"
import type { BigintIsh } from "../../core/constants"
import {
  _997,
  _1000,
  BASIS_POINTS,
  FIVE,
  MINIMUM_LIQUIDITY,
  ONE,
  ZERO,
} from "../../core/constants"

export const computePairAddress = ({
  pairType,
  tokenA,
  tokenB,
}: {
  pairType: Implementation
  tokenA: Token
  tokenB: Token
}): `0x${string}` => {
  const chainIdFromToken = tokenA.chainId
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA] // does safety checks

  if (pairType === Implementation.AERODROME) {
    const chainIdFromToken = tokenA.chainId

    const prefix = "0x3d602d80600a3d3981f3363d3d373d3d3d363d73"
    const suffix = "5af43d82803e903d91602b57fd5bf3"
    const cleanImplementation = "a4e46b4f701c62e14df11b48dce76a7d793cd6d7"
    const initCode = `${prefix}${cleanImplementation}${suffix}`
    const salt = keccak256(
      encodePacked(
        ["address", "address", "bool"],
        [token0.address, token1.address, false]
      )
    )

    const factoryAddress =
      FACTORY_ADDRESSES[chainIdFromToken][pairType][Protocol.V2]

    return getContractAddress({
      bytecodeHash: keccak256(toBytes(initCode)),
      from: factoryAddress,
      opcode: "CREATE2",
      salt: salt,
    })
  }

  return getContractAddress({
    bytecodeHash: PAIR_INIT_HASH[chainIdFromToken][pairType][Protocol.V2],
    from: FACTORY_ADDRESSES[chainIdFromToken][pairType][Protocol.V2],
    opcode: "CREATE2",
    salt: keccak256(
      encodePacked(
        ["bytes"],
        [encodePacked(["address", "address"], [token0.address, token1.address])]
      )
    ),
  })
}
export const ZERO_PERCENT = new Percent(0)
export const ONE_HUNDRED_PERCENT = new Percent(1)

export class Pair {
  public readonly liquidityToken: Token
  private readonly tokenAmounts: [CurrencyAmount<Token>, CurrencyAmount<Token>]
  public pairType: Implementation

  public static getAddress(
    tokenA: Token,
    tokenB: Token,
    pairType: Implementation
  ): `0x${string}` {
    return computePairAddress({
      pairType,
      tokenA,
      tokenB,
    })
  }

  public constructor(
    currencyAmountA: CurrencyAmount<Token>,
    tokenAmountB: CurrencyAmount<Token>,
    pairType: Implementation
  ) {
    const tokenAmounts = currencyAmountA.currency.sortsBefore(
      tokenAmountB.currency
    ) // does safety checks
      ? [currencyAmountA, tokenAmountB]
      : [tokenAmountB, currencyAmountA]
    this.liquidityToken = new Token({
      chainId: tokenAmounts[0]!.currency.chainId,
      address: Pair.getAddress(
        tokenAmounts[0]!.currency,
        tokenAmounts[1]!.currency,
        pairType
      ),
      decimals: 18,
      symbol: "UNI-V2",
      name: "Uniswap V2",
    })
    this.pairType = pairType
    this.tokenAmounts = tokenAmounts as [
      CurrencyAmount<Token>,
      CurrencyAmount<Token>,
    ]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<Token, Token> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new Price(
      this.token0,
      this.token1,
      result.denominator,
      result.numerator
    )
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Token, Token> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(
      this.token1,
      this.token0,
      result.denominator,
      result.numerator
    )
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.involvesToken(token), "TOKEN")
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].currency
  }

  public get token1(): Token {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): CurrencyAmount<Token> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): CurrencyAmount<Token> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Token): CurrencyAmount<Token> {
    invariant(this.involvesToken(token), "TOKEN")
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public get address(): `0x${string}` {
    const address = computePairAddress({
      pairType: this.pairType,
      tokenA: this.token0,
      tokenB: this.token1,
    })

    return address
  }
  /**
   * getAmountOut is the linear algebra of reserve ratio against amountIn:amountOut.
   * https://ethereum.stackexchange.com/questions/101629/what-is-math-for-uniswap-calculates-the-amountout-and-amountin-why-997-and-1000
   * has the math deduction for the reserve calculation without fee-on-transfer fees.
   *
   * With fee-on-transfer tax, intuitively it's just:
   * inputAmountWithFeeAndTax = 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
   *                          = (1 - amountIn.sellFeesBips / 10000) * amountInWithFee
   * where amountInWithFee is the amountIn after taking out the LP fees
   * outputAmountWithTax = amountOut * (1 - amountOut.buyFeesBips / 10000)
   *
   * But we are illustrating the math deduction below to ensure that's the case.
   *
   * before swap A * B = K where A = reserveIn B = reserveOut
   *
   * after swap A' * B' = K where only k is a constant value
   *
   * getAmountOut
   *
   * A' = A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn # here 0.3% is deducted
   * B' = B - amountOut * (1 - amountOut.buyFeesBips / 10000)
   * amountOut = (B - B') / (1 - amountOut.buyFeesBips / 10000) # where A' * B' still is k
   *           = (B - K/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   *           = (B - AB/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   *           = ((BA + B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn - AB)/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   *           = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn / (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   * amountOut * (1 - amountOut.buyFeesBips / 10000) = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
   *                                                    /
   *                                                    (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
   *
   * outputAmountWithTax = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
   *                       /
   *                       (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
   *                       = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn * 1000
   *                       /
   *                       ((A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn) * 1000)
   *                     = (B * (1 - amountIn.sellFeesBips / 10000) 997 * * amountIn
   *                       /
   *                       (1000 * A + (1 - amountIn.sellFeesBips / 10000) * 997 * amountIn)
   *                     = (B * (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee)
   *                       /
   *                       (1000 * A + (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee)
   *                     = (B * inputAmountWithFeeAndTax)
   *                       /
   *                       (1000 * A + inputAmountWithFeeAndTax)
   *
   * inputAmountWithFeeAndTax = (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee
   * outputAmountWithTax = amountOut * (1 - amountOut.buyFeesBips / 10000)
   *
   * @param inputAmount
   * @param calculateFotFees
   */
  public getOutputAmount(
    inputAmount: CurrencyAmount<Token>,
    calculateFotFees = false
  ): [CurrencyAmount<Token>, Pair] {
    invariant(this.involvesToken(inputAmount.currency), "TOKEN")
    if (this.reserve0.quotient === ZERO || this.reserve1.quotient === ZERO) {
      throw new InsufficientReservesError()
    }

    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0
    )

    const percentAfterSellFees = calculateFotFees
      ? this.derivePercentAfterSellFees(inputAmount)
      : ZERO_PERCENT
    const inputAmountAfterTax = percentAfterSellFees.greaterThan(ZERO_PERCENT)
      ? CurrencyAmount.fromRawAmount(
          inputAmount.currency,
          percentAfterSellFees.multiply(inputAmount).quotient // fraction.quotient will round down by itself, which is desired
        )
      : inputAmount

    const inputAmountWithFeeAndAfterTax = inputAmountAfterTax.quotient * _997
    const numerator = inputAmountWithFeeAndAfterTax * outputReserve.quotient
    const denominator =
      inputReserve.quotient * _1000 + inputAmountWithFeeAndAfterTax
    const outputAmount = CurrencyAmount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator // Division in BigInt will naturally round down
    )

    if (outputAmount.quotient === ZERO) {
      throw new InsufficientInputAmountError()
    }

    const percentAfterBuyFees = calculateFotFees
      ? this.derivePercentAfterBuyFees(outputAmount)
      : ZERO_PERCENT
    const outputAmountAfterTax = percentAfterBuyFees.greaterThan(ZERO_PERCENT)
      ? CurrencyAmount.fromRawAmount(
          outputAmount.currency,
          outputAmount.multiply(percentAfterBuyFees).quotient // fraction.quotient will round down by itself, which is desired
        )
      : outputAmount
    if (outputAmountAfterTax.quotient === ZERO) {
      throw new InsufficientInputAmountError()
    }

    return [
      outputAmountAfterTax,
      new Pair(
        inputReserve.add(inputAmountAfterTax),
        outputReserve.subtract(outputAmountAfterTax),
        this.pairType
      ),
    ]
  }

  /**
   * getAmountIn is the linear algebra of reserve ratio against amountIn:amountOut.
   * https://ethereum.stackexchange.com/questions/101629/what-is-math-for-uniswap-calculates-the-amountout-and-amountin-why-997-and-1000
   * has the math deduction for the reserve calculation without fee-on-transfer fees.
   *
   * With fee-on-transfer fees, intuitively it's just:
   * outputAmountWithTax = amountOut / (1 - amountOut.buyFeesBips / 10000)
   * inputAmountWithTax = amountIn / (1 - amountIn.sellFeesBips / 10000) / 0.997
   *
   * But we are illustrating the math deduction below to ensure that's the case.
   *
   * before swap A * B = K where A = reserveIn B = reserveOut
   *
   * after swap A' * B' = K where only k is a constant value
   *
   * getAmountIn
   *
   * B' = B - amountOut * (1 - amountOut.buyFeesBips / 10000)
   * A' = A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn # here 0.3% is deducted
   * amountIn = (A' - A) / (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = (K / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)) - A)
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = (AB / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)) - A)
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = ((AB - AB + A * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = ((A * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = ((A * 1000 * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
   *            /
   *            (997 * (1 - amountIn.sellFeesBips / 10000))
   *
   * outputAmountWithTax = amountOut / (1 - amountOut.buyFeesBips / 10000)
   * inputAmountWithTax = amountIn / (997 * (1 - amountIn.sellFeesBips / 10000))
   *                    = (A * outputAmountWithTax * 1000) / ((B - outputAmountWithTax) * 997)
   *
   * @param outputAmount
   */
  public getInputAmount(
    outputAmount: CurrencyAmount<Token>,
    calculateFotFees = false
  ): [CurrencyAmount<Token>, Pair] {
    invariant(this.involvesToken(outputAmount.currency), "TOKEN")
    const percentAfterBuyFees = calculateFotFees
      ? this.derivePercentAfterBuyFees(outputAmount)
      : ZERO_PERCENT

    const outputAmountBeforeTax = percentAfterBuyFees.greaterThan(ZERO_PERCENT)
      ? CurrencyAmount.fromRawAmount(
          outputAmount.currency,
          outputAmount.divide(percentAfterBuyFees).quotient + ONE // add 1 for rounding up
        )
      : outputAmount

    if (
      this.reserve0.quotient === ZERO ||
      this.reserve1.quotient === ZERO ||
      outputAmount.quotient >= this.reserveOf(outputAmount.currency).quotient ||
      outputAmountBeforeTax.quotient >=
        this.reserveOf(outputAmount.currency).quotient
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0
    )

    const numerator =
      inputReserve.quotient * outputAmountBeforeTax.quotient * _1000
    const denominator =
      (outputReserve.quotient - outputAmountBeforeTax.quotient) * _997
    const inputAmount = CurrencyAmount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator + ONE // Add 1 here as part of the formula
    )

    const percentAfterSellFees = calculateFotFees
      ? this.derivePercentAfterSellFees(inputAmount)
      : ZERO_PERCENT
    const inputAmountBeforeTax = percentAfterSellFees.greaterThan(ZERO_PERCENT)
      ? CurrencyAmount.fromRawAmount(
          inputAmount.currency,
          inputAmount.quotient / percentAfterSellFees.quotient + ONE // Add 1 for rounding up
        )
      : inputAmount

    return [
      inputAmountBeforeTax,
      new Pair(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.pairType
      ),
    ]
  }

  public getLiquidityMinted(
    totalSupply: CurrencyAmount<Token>,
    tokenAmountA: CurrencyAmount<Token>,
    tokenAmountB: CurrencyAmount<Token>
  ): CurrencyAmount<Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), "LIQUIDITY")
    const tokenAmounts = tokenAmountA.currency.sortsBefore(
      tokenAmountB.currency
    ) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(
      tokenAmounts[0]!.currency.equals(this.token0) &&
        tokenAmounts[1]!.currency.equals(this.token1),
      "TOKEN"
    )

    let liquidity: bigint
    if (totalSupply.quotient === BigInt(0)) {
      liquidity =
        sqrt(tokenAmounts[0]!.quotient * tokenAmounts[1]!.quotient) -
        MINIMUM_LIQUIDITY
    } else {
      const amount0 =
        (tokenAmounts[0]!.quotient * totalSupply.quotient) /
        this.reserve0.quotient
      const amount1 =
        (tokenAmounts[1]!.quotient * totalSupply.quotient) /
        this.reserve1.quotient
      liquidity = amount0 <= amount1 ? amount0 : amount1
    }
    if (liquidity <= BigInt(0)) {
      throw new InsufficientInputAmountError()
    }
    return CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: CurrencyAmount<Token>,
    liquidity: CurrencyAmount<Token>,
    feeOn = false,
    kLast?: BigintIsh
  ): CurrencyAmount<Token> {
    invariant(this.involvesToken(token), "TOKEN")
    invariant(totalSupply.currency.equals(this.liquidityToken), "TOTAL_SUPPLY")
    invariant(liquidity.currency.equals(this.liquidityToken), "LIQUIDITY")
    invariant(liquidity.quotient <= totalSupply.quotient, "LIQUIDITY")

    let totalSupplyAdjusted: CurrencyAmount<Token>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, "K_LAST")
      const kLastParsed = BigInt(kLast.toString())
      if (kLastParsed !== ZERO) {
        const rootK = sqrt(this.reserve0.quotient * this.reserve1.quotient)

        const rootKLast = sqrt(kLastParsed)
        if (rootK > rootKLast) {
          const numerator = totalSupply.quotient * (rootK - rootKLast)
          const denominator = rootK * FIVE + rootKLast
          const feeLiquidity = numerator / denominator
          totalSupplyAdjusted = totalSupply.add(
            CurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity)
          )
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return CurrencyAmount.fromRawAmount(
      token,
      (liquidity.quotient * this.reserveOf(token).quotient) /
        totalSupplyAdjusted.quotient
    )
  }

  private derivePercentAfterSellFees(
    inputAmount: CurrencyAmount<Token>
  ): Percent {
    const sellFeeBips = this.token0.wrapped.equals(inputAmount.wrapped.currency)
      ? this.token0.wrapped.sellFeeBps
      : this.token1.wrapped.sellFeeBps
    if (BigInt(sellFeeBips ?? 0) > 0n) {
      return ONE_HUNDRED_PERCENT.subtract(
        new Percent(BigInt(sellFeeBips!)).divide(BASIS_POINTS)
      )
    } else {
      return ZERO_PERCENT
    }
  }

  private derivePercentAfterBuyFees(
    outputAmount: CurrencyAmount<Token>
  ): Percent {
    const buyFeeBps = this.token0.wrapped.equals(outputAmount.wrapped.currency)
      ? this.token0.wrapped.buyFeeBps
      : this.token1.wrapped.buyFeeBps
    if (BigInt(buyFeeBps ?? 0) > 0n) {
      return ONE_HUNDRED_PERCENT.subtract(
        new Percent(BigInt(buyFeeBps!)).divide(BASIS_POINTS)
      )
    } else {
      return ZERO_PERCENT
    }
  }
}

function sqrt(value: bigint) {
  // Implement the square root function for BigInt
  // Placeholder implementation
  return BigInt(Math.sqrt(Number(value)))
}
