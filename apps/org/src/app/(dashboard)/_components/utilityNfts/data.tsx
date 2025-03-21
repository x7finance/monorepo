import { X7ContractsEnum } from "@x7/sdk";
import { ChainId } from "@x7/utils";

import type { UtilityNftType } from "~/types";

export const EXCHANGE_IDS = {
  EcosystemMaxi: {
    openSea: "x7-ecosystem-maxi",
  },
  LiquidityMaxi: {
    openSea: "x7-liquidity-maxi",
  },
  DexMaxi: {
    openSea: "x7-dex-maxi",
  },
  BorrowingMaxi: {
    openSea: "x7-borrowing-maxi",
  },
  Magister: {
    openSea: "x7-magister",
  },
};

export const utilityNftData: UtilityNftType[] = [
  {
    name: "Liquidity MAXI",
    price: "0.75 ETH",
    maxMint: 4,
    slug: "liquidity-maxi",
    contract: X7ContractsEnum.LiquidityMaxi(ChainId.ETHEREUM),
    objective: "Arbitrage optimizer",
    description:
      "Liquidity Maxi NFTs are designed to provide added insurance to larger price movements. Ownership is for those who aim to preserve as much capital as possible while trading.",
    benefits: [
      "50% fee discount on X7100",
      "25% fee discount on X7R",
      "15% fee discount on X7DAO",
    ],
    denomination: {
      [ChainId.ETHEREUM]: `ETH`,
      [ChainId.BSC]: `BNB`,
      [ChainId.OPTIMISM]: `ETH`,
      [ChainId.POLYGON]: `MATIC`,
      [ChainId.ARBITRUM]: `ETH`,
      [ChainId.BASE]: ``,
    },
    exchanges: {
      [ChainId.ETHEREUM]: `https://opensea.io/collection/${EXCHANGE_IDS.LiquidityMaxi.openSea}`,
      [ChainId.BSC]: ``,
      [ChainId.OPTIMISM]: ``,
      [ChainId.POLYGON]: ``,
      [ChainId.ARBITRUM]: ``,
      [ChainId.BASE]: ``,
    },
  },
  {
    name: "Ecosystem MAXI",
    price: "0.3 ETH",
    maxMint: 5,
    slug: "ecosystem-maxi",
    contract: X7ContractsEnum.EcosystemMaxi(ChainId.ETHEREUM),
    objective: "Lower fees on trades",
    description:
      "Ecosystem Maxi NFTs are for your everyday X7 maximalist. Ownership will provide traders with added flexibility during their trading experience between trading pairs.",
    benefits: [
      "25% fee discount on X7100",
      "10% fee discount on X7DAO and X7R",
    ],
    exchanges: {
      [ChainId.ETHEREUM]: `https://opensea.io/collection/${EXCHANGE_IDS.EcosystemMaxi.openSea}`,
      [ChainId.BSC]: ``,
      [ChainId.OPTIMISM]: ``,
      [ChainId.POLYGON]: ``,
      [ChainId.ARBITRUM]: ``,
      [ChainId.BASE]: ``,
    },
  },
  {
    name: "Borrowing MAXI",
    price: "2 ETH",
    maxMint: 2,
    slug: "borrowing-maxi",
    contract: X7ContractsEnum.BorrowingMaxi(ChainId.ETHEREUM),
    objective: "Borrow at lower costs",
    description:
      "Borrowing Maxi NFTs will provide borrowers within our ILO Dex platform a significant advantage in their loan terms. Owning this NFT will reduce overall risk for lenders and borrowers while simultaneously allowing easier liquidity acquisition for DeFi entrepreneurs.",
    benefits: [
      "10% loan origination fee reduction",
      "20% loan premium discount",
    ],
    exchanges: {
      [ChainId.ETHEREUM]: `https://opensea.io/collection/${EXCHANGE_IDS.BorrowingMaxi.openSea}`,
      [ChainId.BSC]: ``,
      [ChainId.OPTIMISM]: ``,
      [ChainId.POLYGON]: ``,
      [ChainId.BASE]: ``,
      [ChainId.ARBITRUM]: ``,
    },
  },
  {
    name: "DEX MAXI",
    price: "1.5 ETH",
    slug: "dex-maxi",
    maxMint: 3,
    contract: X7ContractsEnum.DexMaxi(ChainId.ETHEREUM),
    objective: "Lower costs on Xchange",
    description:
      "Dex Maxi NFTs provide users of our Dex an additional layer of flexibility during trading. Dex users will find this NFT useful towards a more frictionless trading experience.",
    benefits: ["50% discount on DEX LP fee"],
    exchanges: {
      [ChainId.ETHEREUM]: `https://opensea.io/collection/${EXCHANGE_IDS.DexMaxi.openSea}`,
      [ChainId.BSC]: ``,
      [ChainId.OPTIMISM]: ``,
      [ChainId.BASE]: ``,
      [ChainId.POLYGON]: ``,
      [ChainId.ARBITRUM]: ``,
    },
  },
  {
    name: "MAGISTER",
    slug: "magister",
    price: "50 ETH",
    maxMint: 1,
    contract: X7ContractsEnum.Magister(ChainId.ETHEREUM),
    objective: "Veto power in DAO votes",
    description: `MAGISTER NFTs are designed to give investors responsible access to higher DAO voting privileges. Providing this ensures a proper array of checks and balances to the ecosystem. The MAGISTER NFTs also provide owners with the similar high tier benefits of Ecosystem, Liquidity, Dex and Borrower Maxi NFTs.`,
    benefits: [
      "Majority MAGISTER vote overrides 50-75% DAO vote",
      "50% discount on DEX LP fee",
      "20% loan origination fee reduction",
    ],
    exchanges: {
      [ChainId.ETHEREUM]: `https://opensea.io/collection/${EXCHANGE_IDS.Magister.openSea}`,
      [ChainId.BSC]: ``,
      [ChainId.OPTIMISM]: ``,
      [ChainId.BASE]: ``,
      [ChainId.POLYGON]: ``,
      [ChainId.ARBITRUM]: ``,
    },
  },
];
