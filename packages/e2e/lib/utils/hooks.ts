import type { Page, TestInfo } from "@playwright/test";
import { test } from "fixtures/pom-synpress";

export function setupSerial<T>(
  beforeAll: (args: { page: Page }, testInfo: TestInfo) => Promise<T>,
): () => T {
  test.describe.configure({ mode: "serial" });

  let p: T;

  test.beforeAll(async ({ page }, testInfo) => {
    p = await beforeAll({ page }, testInfo);
  });
  test.afterAll(async ({ page }) => {
    await page.close();
  });

  function get() {
    return p!;
  }
  return get;
}
