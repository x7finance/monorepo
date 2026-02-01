import invariant from "tiny-invariant";
/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export class Currency {
    /**
     * The chain ID on which this currency resides
     */
    chainId;
    /**
     * The decimals used in representing currency amounts
     */
    decimals;
    /**
     * The symbol of the currency, i.e. a short textual non-unique identifier
     */
    symbol;
    /**
     * The name of the currency, i.e. a descriptive textual non-unique identifier
     */
    name;
    /**
     * Constructs an instance of the abstract class `Currency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     * @param rebase of the currency
     */
    constructor({ chainId: _chainId, decimals: _decimals, symbol, name, }) {
        const chainId = Number(_chainId);
        const decimals = Number(_decimals);
        invariant(Number.isSafeInteger(chainId), "CHAIN_ID");
        invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "DECIMALS");
        this.chainId = chainId;
        this.decimals = decimals;
        this.symbol = symbol;
        this.name = name;
    }
}
//# sourceMappingURL=Currency.js.map