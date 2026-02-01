import type { ChainId } from "../chain";
import type { Native } from "./Native";
import type { Token } from "./Token";
/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export declare abstract class Currency {
    /**
     * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
     */
    abstract readonly isNative: boolean;
    /**
     * Returns whether the currency is a token that is usable in Uniswap without wrapping
     */
    abstract readonly isToken: boolean;
    /**
     * The chain ID on which this currency resides
     */
    readonly chainId: ChainId;
    /**
     * The decimals used in representing currency amounts
     */
    readonly decimals: number;
    /**
     * The symbol of the currency, i.e. a short textual non-unique identifier
     */
    readonly symbol?: string | undefined;
    /**
     * The name of the currency, i.e. a descriptive textual non-unique identifier
     */
    readonly name?: string | undefined;
    /**
     * Constructs an instance of the abstract class `Currency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     * @param rebase of the currency
     */
    protected constructor({ chainId: _chainId, decimals: _decimals, symbol, name }: {
        chainId: number | string;
        decimals: number | string;
        symbol?: string | undefined;
        name?: string | undefined;
    });
    /**
     * Returns whether this currency is functionally equivalent to the other currency
     * @param other the other currency
     */
    abstract equals(other: Native | Token): boolean;
    /**
     * Return the wrapped version of this currency
     */
    abstract get wrapped(): Token;
}
//# sourceMappingURL=Currency.d.ts.map