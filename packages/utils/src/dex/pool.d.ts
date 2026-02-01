import type { Token } from "../currency/Token";
import type { CurrencyAmount } from "../math/fractions/currencyAmount";
import type { Fee } from "./fee";
export declare abstract class Pool {
    abstract readonly liquidityToken: Token;
    abstract readonly swapGasCost: bigint;
    abstract readonly minLiquidity: bigint;
    abstract get chainId(): number;
    abstract get fee(): Fee;
    abstract get assets(): Token[];
    abstract get reserves(): CurrencyAmount<Token>[];
    abstract getLiquidityMinted(totalSupply: CurrencyAmount<Token>, tokenAmountA: CurrencyAmount<Token>, tokenAmountB: CurrencyAmount<Token>): CurrencyAmount<Token>;
    abstract getLiquidityValue(token: Token, totalSupply: CurrencyAmount<Token>, liquidity: CurrencyAmount<Token>): CurrencyAmount<Token>;
    abstract involvesToken(token: Token): boolean;
}
//# sourceMappingURL=pool.d.ts.map