import { expect } from "@playwright/test";
import axios from "axios";
import { ethers, JsonRpcProvider } from "ethers";

import { IAccountGuardAbi, IAccountImplementationAbi } from "./abis";
import { SetBalanceTokens } from "./testData";

require("dotenv").config();

const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;

const request = axios.create({
  baseURL: "https://api.tenderly.co/api/v1",
  headers: {
    "X-Access-Key": TENDERLY_ACCESS_KEY,
    "Content-Type": "application/json",
  },
});

export const createFork = async ({
  network,
}: {
  network: "mainnet" | "optimism" | "arbitrum" | "base";
}) => {
  const network_ids = {
    mainnet: "1",
    optimism: "10",
    arbitrum: "42161",
    base: "8453",
  };
  const network_id = network_ids[network];

  return await request.post(TENDERLY_FORK_API, { network_id });
};

export const deleteFork = async (forkId: string) => {
  return await request.delete(`${TENDERLY_FORK_API}/${forkId}`);
};

export const getSimulations = async (forkId: string) => {
  return await request.get(
    `${TENDERLY_FORK_API}/${forkId}/transactions?page=1&perPage=20`,
  );
};

export const verifyTxReceiptStatusSuccess = async (forkId: string) => {
  const resp = await getSimulations(forkId);
  const autoBuyTxReceiptStatus =
    await resp.data.fork_transactions[0].receipt.status;
  expect(autoBuyTxReceiptStatus, "tx status should be success").toEqual("0x1");
};

export const getTxCount = async (forkId: string) => {
  const resp = await getSimulations(forkId);
  const txCount: number = resp.data.fork_transactions.length;
  return txCount;
};

export const tokenAddresses = {
  mainnet: {
    AJNA: "0x9a96ec9b57fb64fbc60b423d1f4da7691bd35079",
    CBETH: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
    DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
    ENA: "0x57e114b691db790c35207b2e685d4a43181e6061",
    EZETH: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
    FRAX: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
    GHO: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
    // LDO: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
    LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    LUSD: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
    MKR: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    OSETH: "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38",
    PYUSD: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
    RETH: "0xae78736cd615f374d3085123a210448e74fc6393",
    RSETH: "0xa1290d69c65a6fe4df752f95823fae25cb99e5a7",
    SDAI: "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
    // STETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    SUSDE: "0x9d39a5de30e57443bff2a8307a4256c8797a3497",
    TBTC: "0x18084fbA666a33d37592fA2633fD49a74DD93a88",
    USDA: "0x0000206329b97db379d5e1bf586bbdb969c63274",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    USDE: "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    WBTC: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    WEETH: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
    WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    WOETH: "0xdcee70654261af21c44c093c300ed3bb97b78192",
    WSTETH: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    YFI: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  },
  arbitrum: {
    DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    RETH: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    WBTC: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    WEETH: "0x35751007a407ca6feffe80b3cb397736d2cf4dbe",
    WSTETH: "0x5979D7b546E38E414F7E9822514be443A4800529",
  },
  base: {
    AERO: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
    BSDETH: "0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff",
    CBETH: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    EZETH: "0x2416092f143378750bb29b79ed961ab195cceea5",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    // WEETH: '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A',
    WSTETH: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
  },
  optimism: {
    DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    OP: "0x4200000000000000000000000000000000000042",
    RETH: "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D",
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    USDC_E: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    WBTC: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    WSTETH: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
  },
};

export const tokenBalances = {
  AJNA: "10000",
  AERO: "300000",
  BSDETH: "1000",
  CBETH: "1000",
  DAI: "200000",
  ENA: "400000",
  ETH: "1000",
  EZETH: "1000",
  FRAX: "200000",
  GHO: "10000",
  LDO: "200000",
  LINK: "100000",
  LUSD: "200000",
  MKR: "2000",
  OP: "100000",
  OSETH: "1000",
  PYUSD: "200000",
  RETH: "1000",
  RSETH: "1000",
  SDAI: "200000",
  STETH: "1000",
  SUSDE: "10000000",
  TBTC: "10000",
  USDA: "20000",
  USDC: "200000",
  USDC_E: "200000",
  USDE: "200000",
  USDT: "200000",
  WBTC: "10",
  WEETH: "1000",
  WETH: "1000",
  WOETH: "1000",
  WSTETH: "1000",
  YFI: "100",
};

/**
 *
 * @param balance In token units
 */
export const setTokenBalance = async ({
  forkId,
  network,
  token,
  balance,
  walletAddress,
}: {
  forkId: string;
  network: "mainnet" | "optimism" | "arbitrum" | "base";
  token: SetBalanceTokens;
  balance: string;
  walletAddress: string;
}) => {
  const provider = new JsonRpcProvider(
    `https://rpc.tenderly.co/fork/${forkId}`,
  );

  const WALLETS = [walletAddress];

  if (token === "ETH") {
    await provider.send("tenderly_setBalance", [
      WALLETS,
      ethers.toQuantity(ethers.parseUnits(balance, "ether")),
    ]);
  } else {
    await provider.send("tenderly_setErc20Balance", [
      tokenAddresses[network][token],
      walletAddress,
      token === "WBTC"
        ? ethers.toQuantity(ethers.parseUnits(balance, 8))
        : token === "PYUSD" ||
            token === "USDC" ||
            token === "USDT" ||
            token === "USDC_E" ||
            token === "USDA"
          ? ethers.toQuantity(ethers.parseUnits(balance, 6))
          : ethers.toQuantity(ethers.parseUnits(balance, "ether")),
    ]);
  }
};

/**
 *
 * @param account Addres of the proxy to take ownershipt of
 * @param newOwner New wallet address
 */
export const changeAccountOwner = async ({
  account,
  newOwner,
  forkId,
}: {
  account: string;
  newOwner: string;
  forkId: string;
}): Promise<boolean> => {
  const provider = new JsonRpcProvider(
    `https://rpc.tenderly.co/fork/${forkId}`,
  );
  const accountInterface = new ethers.Interface(IAccountImplementationAbi);
  const guardInterface = new ethers.Interface(IAccountGuardAbi);
  const contract = new ethers.Contract(account, accountInterface, provider);
  const guard = await contract.guard();
  const owner = await contract.owner();
  const encoded = guardInterface.encodeFunctionData("changeOwner", [
    newOwner,
    account,
  ]);
  try {
    await provider.send("eth_sendTransaction", [
      { from: owner, to: guard, input: encoded },
    ]);
    return true;
  } catch {
    return false;
  }
};
