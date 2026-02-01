require("dotenv").config();
const { version } = require("../package.json");
const {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
} = require("viem/chains");
const { getContract, createPublicClient, http } = require("viem");
const tokenRegisteryABI = require("./abis/tokenRegistry");
const erc20ABI = require("./abis/erc20");

const REGISTRY_MAP = {
  [mainnet.id]: {
    contract: "0x7deF192aDB727777c5f24c05018cfbaFDFaD805a",
    chain: mainnet,
  },
  [bsc.id]: {
    contract: "0x7deF192aDB727777c5f24c05018cfbaFDFaD805a",
    chain: bsc,
  },
  [polygon.id]: {
    contract: "0x7deF192aDB727777c5f24c05018cfbaFDFaD805a",
    chain: polygon,
  },
  [optimism.id]: {
    contract: "0x7deF192aDB727777c5f24c05018cfbaFDFaD805a",
    chain: optimism,
  },
  [arbitrum.id]: {
    contract: "0x7deF192aDB727777c5f24c05018cfbaFDFaD805a",
    chain: arbitrum,
  },
  [base.id]: {
    contract: "0x7deF192aDB727777c5f24c05018cfbaFDFaD805a",
    chain: base,
  },
};

const createCustomPublicClient = (chain) => {
  let rpcUrl;
  switch (chain.id) {
    case mainnet.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_ETHER_RPC;
      break;
    case bsc.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_BSC_RPC;
      break;
    case polygon.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_POLY_RPC;
      break;
    case optimism.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_OPTI_RPC;
      break;
    case arbitrum.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_ARB_RPC;
      break;
    case base.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_BASE_RPC;
      break;
    case sepolia.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_ETHER_TESTNET_RPC;
      break;
    case baseSepolia.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_BASE_TESTNET_RPC;
      break;
    case bscTestnet.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_BSC_TESTNET_RPC;
      break;
    case arbitrumSepolia.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_ARB_TESTNET_RPC;
      break;
    case optimismSepolia.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_OPTI_TESTNET_RPC;
      break;
    case polygonAmoy.id:
      rpcUrl = process.env.NEXT_PUBLIC_DEFAULT_POLY_TESTNET_RPC;
      break;
    default:
      throw new Error(`Unsupported chain: ${chain.id}`);
  }

  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
};

const FETCH_TIMEOUT = 5000; // 5 seconds timeout for each token

const fetchTokenWithTimeout = async (
  address,
  ercContract,
  chainId,
  timeout,
) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Token fetch timeout")), timeout),
  );

  try {
    const result = await Promise.race([
      (async () => ({
        address,
        symbol: await ercContract.read.symbol(),
        decimals: await ercContract.read.decimals(),
        name: await ercContract.read.name(),
        chainId: Number(chainId),
      }))(),
      timeoutPromise,
    ]);

    return result;
  } catch {
    console.error(
      `Error or timeout fetching token ${address} on chain ${chainId}`,
    );
    return null;
  }
};

module.exports = async function buildList() {
  const parsed = version.split(".");
  const currentMapping = {};

  for (const chainId of Object.keys(REGISTRY_MAP)) {
    try {
      const client = createCustomPublicClient(REGISTRY_MAP[chainId].chain);
      const depotContract = getContract({
        address: REGISTRY_MAP[chainId].contract,
        abi: tokenRegisteryABI,
        chainId,
        client: { public: client },
      });

      const list = await depotContract?.read?.getRegisteredTokens();

      const tokens = await Promise.all(
        list.map(async (address) => {
          const ercContract = getContract({
            address: address,
            abi: erc20ABI,
            chainId,
            client: { public: client },
          });

          return fetchTokenWithTimeout(
            address,
            ercContract,
            chainId,
            FETCH_TIMEOUT,
          );
        }),
      );

      tokens
        .filter((token) => token !== null)
        .forEach((obj) => {
          if (!currentMapping[obj.symbol]) {
            currentMapping[obj.symbol] = {
              ...obj,
              extensions: {},
            };
          } else {
            currentMapping[obj.symbol] = {
              ...currentMapping[obj.symbol],
              extensions: {
                ...currentMapping?.[obj.symbol].extensions,
                bridgeInfo: {
                  ...currentMapping?.[obj.symbol].extensions.bridgeInfo,
                  [chainId]: {
                    tokenAddress: obj.address,
                  },
                },
              },
            };
          }
        });
    } catch {
      console.log(
        `Skipping: ${chainId}:${REGISTRY_MAP[Number(chainId)].contract}`,
      );
    }
  }

  const l1List = {
    name: "Xchange Default Token List",
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2],
    },
    tags: {},
    logoURI: "",
    keywords: ["xchange", "default"],
    tokens: [...Object.values(currentMapping)].sort((t1, t2) => {
      if (t1.chainId === t2.chainId) {
        return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
      }
      return t1.chainId < t2.chainId ? -1 : 1;
    }),
  };

  console.log("✅ Successfully fetched default token lists");

  return l1List;
};
