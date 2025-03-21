import { type Locator, type Page } from "@playwright/test";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";

dotenv.config();

export default class BasePage {
  readonly page: Page;
  readonly btnConnect: Locator;
  readonly textConnectedWallet: Locator;
  readonly btnAddCitizenHeader: Locator;
  readonly metamaskButton: Locator;
  readonly confirmMetamaskButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators
    this.btnConnect = this.page.locator("#connectButton");
    this.textConnectedWallet = this.page.getByTestId("account-button");
    this.confirmMetamaskButton = this.page.getByTestId(
      "page-container-footer-next",
    );
    this.metamaskButton = this.page.locator(
      "data-testid=rk-wallet-option-metaMask",
    );
    this.btnAddCitizenHeader = this.page.getByTestId("header-addCitizenButton");
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async connectWallet(): Promise<void> {
    await this.btnConnect.click();
    await this.metamaskButton.click();
    metamask.acceptAccess();
  }

  async getConnectedWalletAddress(): Promise<string> {
    const walletAddress =
      (await this.textConnectedWallet.textContent()) as string;
    return walletAddress;
  }

  async getConnectButtonText(): Promise<string> {
    const buttonText = (await this.btnConnect
      .locator("p")
      .textContent()) as string;
    return buttonText;
  }
}
