// import { expect, test } from "@playwright/test";

// test("should show all pages are loading...", async ({ page }) => {
//   await page.goto("/");
//   await page.click("text=Trade");
//   await expect(page).toHaveURL("/");
//   await expect(page.locator("h1")).toContainText("Trade");

//   await page.goto("/docs");
//   await page.click("text=X7 Finance Docs");
//   await expect(page).toHaveURL("/docs");
//   await expect(page.locator("h1")).toContainText("X7 Finance Docs");

//   await page.goto("/docs/whitepaper");
//   await expect(page).toHaveURL("/docs/whitepaper");
//   await expect(page.locator("h1")).toContainText("X7 Finance Whitepaper");

//   await page.goto(
//     "/docs/breakdowns/variables/x7initialliquidityloanterm001#set-loan-length-limits",
//   );
//   await expect(page).toHaveURL(
//     "/docs/breakdowns/variables/x7initialliquidityloanterm001#set-loan-length-limits",
//   );
//   await expect(page.locator("h1")).toContainText(
//     "X7 Initial Liquidity Loan 001",
//   );

//   await page.goto("/about");
//   await expect(page).toHaveURL("/about");
//   await expect(page.locator("h1")).toContainText("Trade.");

//   await page.goto("/blog");
//   await expect(page).toHaveURL("/blog");
//   await expect(page.locator("h1")).toContainText("X7 Blog");

//   await page.goto("/community");
//   await expect(page).toHaveURL("/community");
//   await expect(page.locator("h1")).toContainText("Community");

//   await page.goto("/dashboard");
//   await expect(page).toHaveURL("/dashboard");
//   await expect(page.locator("h1")).toContainText("Lending Pool Status");

//   await page.goto("/dashboard/contracts");
//   await expect(page).toHaveURL("/dashboard/contracts");
//   await expect(page.locator("h1")).toContainText("X7 Finance Ecosystem");

//   await page.goto("/dashboard/contracts/hubs");
//   await expect(page).toHaveURL("/dashboard/contracts/hubs");
//   await expect(page.locator("h1")).toContainText("X7 Finance Liquidity Hubs");

//   await page.goto("/dashboard/contracts/splitters");
//   await expect(page).toHaveURL("/dashboard/contracts/splitters");
//   await expect(page.locator("h1")).toContainText("X7 Finance Splitters");

//   await page.goto("/lending");
//   await expect(page).toHaveURL("/lending");
//   await expect(page.locator("h1")).toContainText("Onchain Loans");

//   await page.goto("/lending/eth/001/3");
//   await expect(page).toHaveURL("/lending/eth/001/3");
//   await expect(page.locator("h1")).toContainText("Loan Details");

//   await page.goto("/dashboard/marketplace");
//   await expect(page).toHaveURL("/dashboard/marketplace");
//   await expect(page.locator("h1")).toContainText("NFT Marketplace");

//   await page.goto("/dashboard/pairs");
//   await expect(page).toHaveURL("/dashboard/pairs");
//   await expect(page.locator("h1")).toContainText("Live Pairs");

//   await page.goto("/dashboard/pioneer");
//   await expect(page).toHaveURL("/dashboard/pioneer");
//   await expect(page.locator("h1")).toContainText("X7 Pioneer Dashboard");

//   await page.goto("/fund");
//   await expect(page).toHaveURL("/fund");
//   await expect(page.locator("h1")).toContainText("Fund Lending");

//   await page.goto("/getstarted");
//   await expect(page).toHaveURL("/getstarted");
//   await expect(page.locator("h1")).toContainText(
//     "How do you plan on using Xchange?",
//   );

//   await page.goto("/ill");
//   await expect(page).toHaveURL("/ill");
//   await expect(page.locator("h1")).toContainText("Initial Liquidity Loans");

//   await page.goto("/ill/amortizing");
//   await expect(page).toHaveURL("/ill/amortizing");
//   await expect(page.locator("h1")).toContainText("Amortizing Loan");

//   await page.goto("/ill/interest");
//   await expect(page).toHaveURL("/ill/interest");
//   await expect(page.locator("h1")).toContainText("Interest Only Loan");

//   await page.goto("/ill/simple");
//   await expect(page).toHaveURL("/ill/simple");
//   await expect(page.locator("h1")).toContainText("Simple Loan");

//   await page.goto("/liquidity");
//   await expect(page).toHaveURL("/liquidity");
//   await expect(page.locator("h1")).toContainText(
//     "Liquidity that works for you",
//   );

//   await page.goto("/loans");
//   await expect(page).toHaveURL("/loans");
//   await expect(page.locator("h1")).toContainText("Liquidity Loans");

//   await page.goto("/nfts");
//   await expect(page).toHaveURL("/nfts");
//   await expect(page.locator("h1")).toContainText("Utility NFTs");

//   await page.goto("/nfts/borrowing-maxi");
//   await expect(page).toHaveURL("/nfts/borrowing-maxi");
//   await expect(page.locator("h1")).toContainText("Borrowing Maxi NFT");

//   await page.goto("/nfts/dex-maxi");
//   await expect(page).toHaveURL("/nfts/dex-maxi");
//   await expect(page.locator("h1")).toContainText("DEX Maxi NFT");

//   await page.goto("/nfts/ecosystem-maxi");
//   await expect(page).toHaveURL("/nfts/ecosystem-maxi");
//   await expect(page.locator("h1")).toContainText("Ecosystem Maxi NFT");

//   await page.goto("/nfts/liquidity-maxi");
//   await expect(page).toHaveURL("/nfts/liquidity-maxi");
//   await expect(page.locator("h1")).toContainText("Liquidity Maxi NFT");

//   await page.goto("/nfts/magister");
//   await expect(page).toHaveURL("/nfts/magister");
//   await expect(page.locator("h1")).toContainText("Magister NFT");

//   await page.goto("/nfts/pioneers");
//   await expect(page).toHaveURL("/nfts/pioneers");
//   await expect(page.locator("h1")).toContainText("Pioneer NFT");

//   await page.goto("/products");
//   await expect(page).toHaveURL("/products");
//   await expect(page.locator("h1")).toContainText("Products");

//   await page.goto("/products/ill");
//   await expect(page).toHaveURL("/products/ill");
//   await expect(page.locator("h1")).toContainText("Initial Liquidity Loans");

//   await page.goto("/products/xchange");
//   await expect(page).toHaveURL("/products/xchange");
//   await expect(page.locator("body")).toContainText("XCHANGE");

//   await page.goto("/robots.txt");
//   await expect(page).toHaveURL("/robots.txt");

//   await page.goto("/sitemap.xml");
//   await expect(page).toHaveURL("/sitemap.xml");

//   await page.goto("/styles");
//   await expect(page).toHaveURL("/styles");
//   await expect(page.locator("h1")).toContainText("X7 Styles");

//   await page.goto("/templates");
//   await expect(page).toHaveURL("/templates");
//   await expect(page.locator("h1")).toContainText("Find your Contract");

//   await page.goto("/tokens");
//   await expect(page).toHaveURL("/tokens");
//   await expect(page.locator("h1")).toContainText("X7 Tokens");

//   await page.goto("/tokens/x7100");
//   await expect(page).toHaveURL("/tokens/x7100");
//   await expect(page.locator("body")).toContainText("X7101 - X7105");

//   await page.goto("/tokens/x7d");
//   await expect(page).toHaveURL("/tokens/x7d");
//   await expect(page.locator("body")).toContainText("X7D");

//   await page.goto("/tokens/x7dao");
//   await expect(page).toHaveURL("/tokens/x7dao");
//   await expect(page.locator("body")).toContainText("X7DAO");

//   await page.goto("/tokens/x7r");
//   await expect(page).toHaveURL("/tokens/x7r");
//   await expect(page.locator("body")).toContainText("X7R");

//   await page.goto("/vote");
//   await expect(page).toHaveURL("/vote");
//   await expect(page.locator("h1")).toContainText("Vote");
// });
