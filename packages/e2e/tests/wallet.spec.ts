import * as metamask from "@synthetixio/synpress/commands/metamask";
import { expectedValues } from "data/test-data";
import { expect, test } from "fixtures/pom-synpress";

import { mainnetChainIds, USDC } from "@x7/sdk";
import { ChainId } from "@x7/utils";

const getToken = (
  // @ts-expect-error: type is right
  chainId: ChainId,
  tokenType: "USDC" | "SUSHI_V2" | "UNISWAP_V2" | "UNISWAP_V3" | "XCHANGE_V2",
): string | null => {
  if (tokenType === "USDC") {
    return USDC[chainId]?.address || null;
  }

  // @ts-expect-error: type is right
  const tokens: Record<typeof tokenType, Partial<Record<ChainId, string>>> = {
    SUSHI_V2: {
      [ChainId.ETHEREUM]: "0x47b464edb8dc9bc67b5cd4c9310bb87b773845bd",
    },
    UNISWAP_V2: {
      [ChainId.ETHEREUM]: "0x576e2bed8f7b46d34016198911cdf9886f78bea7",
      [ChainId.BASE]: "0xf8a99f2bf2ce5bb6ce4aafcf070d8723bc904aa2",
    },
    UNISWAP_V3: {
      [ChainId.ETHEREUM]: "0x423f4e6138e475d85cf7ea071ac92097ed631eea",
      [ChainId.BASE]: "0x6b9bb36519538e0c073894e964e90172e1c0b41f",
    },
    XCHANGE_V2: {
      // [ChainId.ETHEREUM]: "0x285db79fa7e0e89e822786f48a7c98c6c1dc1c7d",
      [ChainId.BASE]: "0x79707e0ce46f83b1e62e737804f38ccb4e6f920c",
    },
  };

  return tokens[tokenType][chainId] || null;
};

test.describe("Xchange e2e wallet tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.connectWallet();
  });

  test("Connecting Wallet to the Xchange is successful, Sequential tests for each chain and token", async ({
    homePage,
  }) => {
    const tokenTypes = [
      "USDC",
      "SUSHI_V2",
      "UNISWAP_V2",
      "UNISWAP_V3",
      "XCHANGE_V2",
    ] as const;

    for (const chainId of mainnetChainIds) {
      for (const tokenType of tokenTypes) {
        const token = getToken(chainId, tokenType);
        if (token) {
          await performTest(homePage, chainId, token, tokenType);
        } else {
          console.log(
            `Skipping test for chain ${chainId} with token ${tokenType} (not found)`,
          );
        }
      }
    }
  });
});

const performTest = async (
  page: any,
  chainId: number,
  token1: string,
  tokenType: string,
) => {
  const connectedWalletAddress = await page.getConnectedWalletAddress();
  const connectedAddressMetamask = await metamask.getWalletAddress();
  console.log(
    `Connected Wallet Address (Metamask): ${connectedAddressMetamask}`,
  );

  await expect(page.accountNameEl).toBeVisible();
  await expect(page.btnConnect).not.toBeVisible();
  await expect(page.accountNameEl).toContainText(
    expectedValues.connectedWalletTextExpected,
  );
  expect(connectedWalletAddress).toEqual(
    expectedValues.connectedWalletTextExpected,
  );

  await page.navigateTo(
    `/?chainId=${chainId}&token0=NATIVE&token1=${token1}&swapAmount=.00000001`,
  );

  await expect(page.tradeSummaryContainer).toContainText("Est. received");

  await expect(page.isProtocolLocatorVisible(tokenType)).toBeTruthy();

  console.log(`Completed test for chain ${chainId} with token ${tokenType}`);
};
