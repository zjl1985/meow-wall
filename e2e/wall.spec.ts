import { expect, test } from "@playwright/test";

test("home defaults to English and shows the cat gallery", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Which cat today?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Special guests" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Open.*Nicole/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Open.*Zero/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /GitHub/i }).first()).toBeVisible();
  await expect(page.getByRole("img").first()).toBeVisible();
});

test("Studio can randomize and save a custom cat", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "Make a cat" })).toBeVisible();

  await page.getByRole("button", { name: "Random cat" }).click();
  await page.getByPlaceholder("e.g. Captain Tuna").fill("Test Cat");
  await page.getByRole("button", { name: "Save to wall" }).click();
  await expect
    .poll(async () =>
      page.evaluate(() => localStorage.getItem("meow-wall:custom-cats") ?? ""),
    )
    .toContain("Test Cat");

  await page.goto("/");
  await expect(page.getByRole("button", { name: /Open.*Test Cat/ })).toBeVisible();
  await expect(page.getByText("Made by me").first()).toBeVisible();
});

test("a special cat can be saved", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Special guests" }) })
    .getByRole("button", { name: "Save" })
    .first()
    .click();
  await expect(page.getByText("Saved").first()).toBeVisible();
  await page.getByRole("link", { name: "Saved", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Saved cats" })).toBeVisible();
});

test("language switch persists Chinese preference", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "切换到中文" }).click();
  await expect(page.getByRole("heading", { name: "今天翻谁的牌？" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "今天翻谁的牌？" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.lang))
    .toBe("zh-CN");
});
