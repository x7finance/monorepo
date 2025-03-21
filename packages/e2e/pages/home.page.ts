import { type Locator, type Page } from "@playwright/test";

import BasePage from "./base.page";

export default class HomePage extends BasePage {
  readonly path: string;
  readonly page: Page;
  readonly useMetamaskButton: Locator;
  readonly connectButton: Locator;
  readonly accountNameEl: Locator;
  readonly tradeSummaryContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/";
    this.page = page;
    // Locators
    this.useMetamaskButton = page.locator(
      "data-testid=rk-wallet-option-metaMask",
    );
    this.tradeSummaryContainer = page.locator(
      "data-testid=trade-summary-details",
    );
    this.connectButton = page.locator("#connectButton");
    this.accountNameEl = page.locator("data-testid=account-button");
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async isProtocolLocatorVisible(tokenType: string): Promise<boolean> {
    return this.page
      .locator(
        `[data-test-id="${tokenType === "USDC" ? "UNISWAP_V3" : tokenType}"]`,
      )
      .isVisible();
  }

  async navigateTo(newPath: string): Promise<void> {
    await super.navigate(newPath);
  }

  async useMetamask() {
    await this.useMetamaskButton.click();
  }
  async connect() {
    await this.connectButton.click();
  }
}
