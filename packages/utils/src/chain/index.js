/* oxlint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { ChainId } from "./constants";
import raw from "./generated";
const additional = [];
const RAW = [...raw, ...additional];
const EIP3091_OVERRIDE = [ChainId.OPTIMISM, ChainId.BASE];
export const Standard = {
    Eip3091: "EIP3091",
    None: "none",
};
export const ChainType = {
    L2: "L2",
    Shard: "shard",
};
// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: explaination
export class Chain {
    static fromRaw(data) {
        return new Chain(data);
    }
    static from(chainId) {
        return chains[chainId];
    }
    static fromShortName(shortName) {
        const chainId = chainShortNameToChainId[shortName];
        if (!chainId)
            throw new Error(`Unknown chain short name: ${shortName}`);
        return Chain.from(chainId);
    }
    static fromChainId(chainId) {
        return Chain.from(chainId);
    }
    static txUrl(chainId, txHash) {
        return Chain.fromChainId(chainId)?.getTxUrl(txHash) ?? "";
    }
    static blockUrl(chainId, blockHashOrHeight) {
        return Chain.fromChainId(chainId)?.getBlockUrl(blockHashOrHeight) ?? "";
    }
    static tokenUrl(chainId, tokenAddress) {
        return Chain.fromChainId(chainId)?.getTokenUrl(tokenAddress) ?? "";
    }
    static accountUrl(chainId, accountAddress) {
        return Chain.fromChainId(chainId)?.getAccountUrl(accountAddress) ?? "";
    }
    constructor(data) {
        Object.assign(this, data);
        // process name overrides
        const targets = ["Mainnet", "Opera", "Mainnet Shard 0"];
        for (const target of targets) {
            if (data.name.includes(target)) {
                this.name = data.name.replace(target, "").trim();
            }
        }
        // process explorer overrides etc...
    }
    getTxUrl(txHash) {
        if (!this.explorers)
            return "";
        for (const explorer of this.explorers) {
            if (explorer.standard === Standard.Eip3091 ||
                EIP3091_OVERRIDE.includes(this.chainId)) {
                return `${explorer.url}/tx/${txHash}`;
            }
        }
        return "";
    }
    getBlockUrl(blockHashOrHeight) {
        if (!this.explorers)
            return "";
        for (const explorer of this.explorers) {
            if (explorer.standard === Standard.Eip3091) {
                return `${explorer.url}/block/${blockHashOrHeight}`;
            }
        }
        return "";
    }
    getTokenUrl(tokenAddress) {
        if (!this.explorers)
            return "";
        for (const explorer of this.explorers) {
            if (explorer.standard === Standard.Eip3091 ||
                EIP3091_OVERRIDE.includes(this.chainId)) {
                return `${explorer.url}/token/${tokenAddress}`;
            }
        }
        return "";
    }
    getAccountUrl(accountAddress) {
        if (!this.explorers)
            return "";
        for (const explorer of this.explorers) {
            if (explorer.standard === Standard.Eip3091 ||
                EIP3091_OVERRIDE.includes(this.chainId)) {
                return `${explorer.url}/address/${accountAddress}`;
            }
        }
        return "";
    }
}
export const natives = Object.fromEntries(RAW.map((data) => [
    data.chainId,
    data.nativeCurrency,
]));
// Chain Id => Chain mapping
export const chains = Object.fromEntries(RAW.map((data) => [data.chainId, new Chain(data)]));
// Chain Id => Chain mapping
export const chainsL2 = Object.fromEntries(RAW.filter(
// oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
(data) => "parent" in data && data.parent.type === ChainType.L2).map((data) => [data.chainId, new Chain(data)]));
// ChainId array
export const chainIds = RAW.map((chain) => chain.chainId);
// Chain Short Name => Chain Id mapping
export const chainShortNameToChainId = Object.fromEntries(RAW.map((data) => [data.shortName, data.chainId]));
// Chain Id => Short Name mapping
export const chainShortName = Object.fromEntries(RAW.map((data) => [
    data.chainId,
    Chain.fromRaw(data).shortName,
]));
// Chain Id => Chain Name mapping
export const chainName = Object.fromEntries(RAW.map((data) => [data.chainId, Chain.fromRaw(data).name]));
export * from "./constants";
export default chains;
//# sourceMappingURL=index.js.map