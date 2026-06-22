import { expect, test } from "@playwright/test";

test("homepage renders and shows the page title", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();

  await expect(page.locator("main")).toBeVisible();
});
