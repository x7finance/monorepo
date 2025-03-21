export default [
  {
    chainId: 1,
    explorers: [
      {
        name: "etherscan",
        url: "https://etherscan.io",
        standard: "EIP3091",
      },
      {
        name: "blockscout",
        url: "https://eth.blockscout.com",
        icon: "blockscout",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Ethereum Mainnet",
    shortName: "eth",
  },
  {
    chainId: 11155111,
    explorers: [
      {
        name: "etherscan",
        url: "https://sepolia.etherscan.io",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Ethereum Sepolia",
    shortName: "eth",
  },
  {
    chainId: 10,
    explorers: [
      {
        name: "etherscan",
        url: "https://optimistic.etherscan.io",
        standard: "EIP3091",
      },
      {
        name: "blockscout",
        url: "https://optimism.blockscout.com",
        icon: "blockscout",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "OP Mainnet",
    shortName: "oeth",
  },
  {
    chainId: 11155420,
    explorers: [
      {
        name: "etherscan",
        url: "https://sepolia-optimistic.etherscan.io/",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "OP Sepolia ",
    shortName: "oeth",
  },
  {
    chainId: 56,
    explorers: [
      {
        name: "bscscan",
        url: "https://bscscan.com",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "BNB Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    name: "BNB Smart Chain Mainnet",
    shortName: "bnb",
  },
  {
    chainId: 97,
    explorers: [
      {
        name: "bscscan-testnet",
        url: "https://testnet.bscscan.com",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "BNB Chain Native Token",
      symbol: "tBNB",
      decimals: 18,
    },
    name: "BNB Smart Chain Testnet",
    shortName: "bnbt",
  },
  {
    chainId: 137,
    explorers: [
      {
        name: "polygonscan",
        url: "https://polygonscan.com",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    name: "Polygon Mainnet",
    shortName: "matic",
  },
  {
    chainId: 80002,
    explorers: [
      {
        name: "polygonscan",
        url: "https://amoy.polygonscan.com",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    name: "Polygon Amoy",
    shortName: "matic",
  },
  {
    chainId: 8453,
    explorers: [
      {
        name: "basescan",
        url: "https://basescan.org",
        standard: "none",
      },
      {
        name: "basescout",
        url: "https://base.blockscout.com",
        icon: "blockscout",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Base",
    shortName: "base",
  },
  {
    chainId: 84532,
    explorers: [
      {
        name: "basescan-sepolia",
        url: "https://sepolia.basescan.org",
        standard: "none",
      },
      {
        name: "basescout",
        url: "https://base-sepolia.blockscout.com",
        icon: "blockscout",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Base",
    shortName: "base",
  },
  {
    chainId: 42161,
    explorers: [
      {
        name: "Arbiscan",
        url: "https://arbiscan.io",
        standard: "EIP3091",
      },
      {
        name: "Arbitrum Explorer",
        url: "https://explorer.arbitrum.io",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Arbitrum One",
    shortName: "arb1",
    parent: {
      type: "L2",
      chain: "eip155-1",
      bridges: [
        {
          url: "https://bridge.arbitrum.io",
        },
      ],
    },
  },
  {
    chainId: 421614,
    explorers: [
      {
        name: "Arbiscan",
        url: "https://sepolia.arbiscan.io",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Arbitrum One Sepolia",
    shortName: "arb1",
    parent: {
      type: "L2",
      chain: "eip155-1",
      bridges: [
        {
          url: "https://bridge.arbitrum.io",
        },
      ],
    },
  },
] as const;
