import * as tenderly from "./tenderly";

type Networks = "mainnet" | "optimism" | "arbitrum" | "base";
type Tokens =
  | "CBETH"
  | "DAI"
  | "ETH"
  | "USDC"
  | "RETH"
  | "SDAI"
  | "WBTC"
  | "WSTETH";

const { NETWORK, WALLET_ADDRESS } = process.env;
const network = NETWORK as Networks;

const tokens = Object.keys(tenderly.tokenAddresses[network]) as Tokens[];
let walletAddress: string = WALLET_ADDRESS;

(async () => {
  const resp = await tenderly.createFork({ network });
  const forkId = resp.data.root_transaction.fork_id;

  await tenderly.setTokenBalance({
    forkId,
    network,
    token: "ETH",
    balance: tenderly.tokenBalances["ETH"],
    walletAddress: walletAddress,
  });

  await Promise.all(
    tokens.map((token) =>
      tenderly.setTokenBalance({
        forkId,
        network,
        token,
        balance: tenderly.tokenBalances[token],
        walletAddress: walletAddress,
      }),
    ),
  );

  console.log(`Selected network: ${NETWORK}`);
  console.log(`Wallet address: ${WALLET_ADDRESS}`);
  console.log("-------------------------------------");
  console.log("*** FUNDS ***");
  console.log(`ETH - ${tenderly.tokenBalances["ETH"]}`);
  tokens.forEach((token) => {
    console.log(`${token} - ${tenderly.tokenBalances[token]}`);
  });
  console.log("-------------------------------------");
  console.log("Fork RPC: ", `https://rpc.tenderly.co/fork/${forkId}`);
})();
