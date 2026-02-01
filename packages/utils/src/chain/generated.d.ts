declare const _default: readonly [{
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
export default _default;
//# sourceMappingURL=generated.d.ts.map