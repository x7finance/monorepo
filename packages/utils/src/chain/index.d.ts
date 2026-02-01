import { ChainId } from "./constants";
declare const RAW: readonly [{
    readonly chainId: 1;
    readonly explorers: readonly [{
        readonly name: "etherscan";
        readonly url: "https://etherscan.io";
        readonly standard: "EIP3091";
    }, {
        readonly name: "blockscout";
        readonly url: "https://eth.blockscout.com";
        readonly icon: "blockscout";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "Ethereum Mainnet";
    readonly shortName: "eth";
}, {
    readonly chainId: 11155111;
    readonly explorers: readonly [{
        readonly name: "etherscan";
        readonly url: "https://sepolia.etherscan.io";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "Ethereum Sepolia";
    readonly shortName: "eth";
}, {
    readonly chainId: 10;
    readonly explorers: readonly [{
        readonly name: "etherscan";
        readonly url: "https://optimistic.etherscan.io";
        readonly standard: "EIP3091";
    }, {
        readonly name: "blockscout";
        readonly url: "https://optimism.blockscout.com";
        readonly icon: "blockscout";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "OP Mainnet";
    readonly shortName: "oeth";
}, {
    readonly chainId: 11155420;
    readonly explorers: readonly [{
        readonly name: "etherscan";
        readonly url: "https://sepolia-optimistic.etherscan.io/";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "OP Sepolia ";
    readonly shortName: "oeth";
}, {
    readonly chainId: 56;
    readonly explorers: readonly [{
        readonly name: "bscscan";
        readonly url: "https://bscscan.com";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "BNB Chain Native Token";
        readonly symbol: "BNB";
        readonly decimals: 18;
    };
    readonly name: "BNB Smart Chain Mainnet";
    readonly shortName: "bnb";
}, {
    readonly chainId: 97;
    readonly explorers: readonly [{
        readonly name: "bscscan-testnet";
        readonly url: "https://testnet.bscscan.com";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "BNB Chain Native Token";
        readonly symbol: "tBNB";
        readonly decimals: 18;
    };
    readonly name: "BNB Smart Chain Testnet";
    readonly shortName: "bnbt";
}, {
    readonly chainId: 137;
    readonly explorers: readonly [{
        readonly name: "polygonscan";
        readonly url: "https://polygonscan.com";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "MATIC";
        readonly symbol: "MATIC";
        readonly decimals: 18;
    };
    readonly name: "Polygon Mainnet";
    readonly shortName: "matic";
}, {
    readonly chainId: 80002;
    readonly explorers: readonly [{
        readonly name: "polygonscan";
        readonly url: "https://amoy.polygonscan.com";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "MATIC";
        readonly symbol: "MATIC";
        readonly decimals: 18;
    };
    readonly name: "Polygon Amoy";
    readonly shortName: "matic";
}, {
    readonly chainId: 8453;
    readonly explorers: readonly [{
        readonly name: "basescan";
        readonly url: "https://basescan.org";
        readonly standard: "none";
    }, {
        readonly name: "basescout";
        readonly url: "https://base.blockscout.com";
        readonly icon: "blockscout";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "Base";
    readonly shortName: "base";
}, {
    readonly chainId: 84532;
    readonly explorers: readonly [{
        readonly name: "basescan-sepolia";
        readonly url: "https://sepolia.basescan.org";
        readonly standard: "none";
    }, {
        readonly name: "basescout";
        readonly url: "https://base-sepolia.blockscout.com";
        readonly icon: "blockscout";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "Base";
    readonly shortName: "base";
}, {
    readonly chainId: 42161;
    readonly explorers: readonly [{
        readonly name: "Arbiscan";
        readonly url: "https://arbiscan.io";
        readonly standard: "EIP3091";
    }, {
        readonly name: "Arbitrum Explorer";
        readonly url: "https://explorer.arbitrum.io";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "Arbitrum One";
    readonly shortName: "arb1";
    readonly parent: {
        readonly type: "L2";
        readonly chain: "eip155-1";
        readonly bridges: readonly [{
            readonly url: "https://bridge.arbitrum.io";
        }];
    };
}, {
    readonly chainId: 421614;
    readonly explorers: readonly [{
        readonly name: "Arbiscan";
        readonly url: "https://sepolia.arbiscan.io";
        readonly standard: "EIP3091";
    }];
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly name: "Arbitrum One Sepolia";
    readonly shortName: "arb1";
    readonly parent: {
        readonly type: "L2";
        readonly chain: "eip155-1";
        readonly bridges: readonly [{
            readonly url: "https://bridge.arbitrum.io";
        }];
    };
}];
type Data = (typeof RAW)[number];
export interface Chain {
    name: string;
    nativeCurrency: NativeCurrency;
    shortName: string;
    chainId: ChainId;
    explorers?: Explorer[];
    parent?: Parent;
}
export interface Explorer {
    name: string;
    url: string;
    standard: Standard;
    icon?: string;
}
export declare const Standard: {
    readonly Eip3091: "EIP3091";
    readonly None: "none";
};
export type Standard = (typeof Standard)[keyof typeof Standard];
export interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
}
export interface Parent {
    type: ChainParentType;
    chain: string;
    bridges?: Bridge[];
}
export interface Bridge {
    url: string;
}
export declare const ChainType: {
    readonly L2: "L2";
    readonly Shard: "shard";
};
export type ChainParentType = (typeof ChainType)[keyof typeof ChainType];
export declare class Chain implements Chain {
    static fromRaw(data: Data): Chain;
    static from(chainId: number): Chain | undefined;
    static fromShortName(shortName: string): Chain | undefined;
    static fromChainId(chainId: number): Chain | undefined;
    static txUrl(chainId: number, txHash: string): string;
    static blockUrl(chainId: number, blockHashOrHeight: string): string;
    static tokenUrl(chainId: number, tokenAddress: string): string;
    static accountUrl(chainId: number, accountAddress: string): string;
    constructor(data: Data);
    getTxUrl(txHash: string): string;
    getBlockUrl(blockHashOrHeight: string): string;
    getTokenUrl(tokenAddress: string): string;
    getAccountUrl(accountAddress: string): string;
}
export declare const natives: {
    [k: string]: NativeCurrency;
};
export declare const chains: {
    [k: string]: Chain;
};
export declare const chainsL2: {
    [k: string]: Chain;
};
export declare const chainIds: (1 | 10 | 56 | 97 | 137 | 8453 | 42161 | 80002 | 84532 | 421614 | 11155111 | 11155420)[];
export declare const chainShortNameToChainId: {
    [k: string]: number;
};
export declare const chainShortName: {
    [k: string]: string;
};
export declare const chainName: {
    [k: string]: string;
};
export * from "./constants";
export default chains;
//# sourceMappingURL=index.d.ts.map