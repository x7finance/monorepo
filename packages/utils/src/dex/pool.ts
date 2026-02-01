import type { Token } from "../currency/Token"
import type { CurrencyAmount } from "../math/fractions/currencyAmount"
import type { Fee } from "./fee"

export abstract class Pool {
  public abstract readonly liquidityToken: Token

  // Swap gas cost, could be different depending on source & dest,
  // wallet->wallet, bento->wallet/wallet->bento, bento->bento

  public abstract readonly swapGasCost: bigint

  // Minimum pool liquidity, typically 1000
  public abstract readonly minLiquidity: bigint

  public abstract get chainId(): number

  public abstract get fee(): Fee

  public abstract get assets(): Token[]

  public abstract get reserves(): CurrencyAmount<Token>[]

  public abstract getLiquidityMinted(
    totalSupply: CurrencyAmount<Token>,
    tokenAmountA: CurrencyAmount<Token>,
    tokenAmountB: CurrencyAmount<Token>
  ): CurrencyAmount<Token>

  public abstract getLiquidityValue(
    token: Token,
    totalSupply: CurrencyAmount<Token>,
    liquidity: CurrencyAmount<Token>
  ): CurrencyAmount<Token>

  public abstract involvesToken(token: Token): boolean
}
