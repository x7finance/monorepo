/* oxlint-disable @typescript-eslint/only-throw-error */
import invariant from "tiny-invariant";
import { getAddress } from "viem";
import { Currency } from "./Currency";
import { WETH9_ADDRESS } from "./weth-addresses";
import { tokenSchema } from "./zod";
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
    id;
    isNative = false;
    isToken = true;
    /**
     * The contract address on the chain on which this token lives
     */
    address;
    /**
     * Relevant for fee-on-transfer (FOT) token taxes,
     * Not every ERC20 token is FOT token, so this field is optional
     */
    buyFeeBps;
    sellFeeBps;
    /**
     *
     * @param chainId {@link BaseCurrency#chainId}
     * @param address The contract address on the chain on which this token lives
     * @param decimals {@link BaseCurrency#decimals}
     * @param symbol {@link BaseCurrency#symbol}
     * @param name {@link BaseCurrency#name}
     * @param bypassChecksum If true it only checks for length === 42, startsWith 0x and contains only hex characters
     * @param buyFeeBps Buy fee tax for FOT tokens, in basis points
     * @param sellFeeBps Sell fee tax for FOT tokens, in basis points
     */
    constructor({ chainId, address, decimals, symbol, name, buyFeeBps, sellFeeBps, }) {
        super({
            chainId,
            decimals,
            symbol,
            name,
        });
        try {
            this.address = getAddress(address);
            this.id = `${chainId}:${address}`;
            this.buyFeeBps = buyFeeBps;
            this.sellFeeBps = sellFeeBps;
        }
        catch {
            throw `${address} is not a valid address`;
        }
    }
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other) {
        return (other.isToken &&
            this.chainId === other.chainId &&
            this.address === other.address);
    }
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other) {
        invariant(this.chainId === other.chainId, "CHAIN_IDS");
        // This will hit for only wrapping/unwrapping cases
        const weth9Address = WETH9_ADDRESS[this.chainId];
        if (this.address === other.address && this.address === weth9Address) {
            return true;
        }
        invariant(this.address !== other.address, "ADDRESSES");
        return this.address.toLowerCase() < other.address.toLowerCase();
    }
    /**
     * Return this token, which does not need to be wrapped
     */
    get wrapped() {
        return this;
    }
    // public get tokenURI(): string {
    //   return `tokens/${this.chainId}/${this.address}.jpg`
    // }
    /**
     * Serialize to JSON object
     */
    serialize() {
        return tokenSchema.parse({
            isNative: this.isNative,
            name: this.name,
            symbol: this.symbol,
            decimals: this.decimals,
            chainId: this.chainId,
            address: this.address,
        });
    }
    static deserialize({ name, symbol, address, decimals, chainId, }) {
        return new Token({
            name,
            symbol,
            address,
            decimals,
            chainId: chainId,
        });
    }
}
//# sourceMappingURL=Token.js.map