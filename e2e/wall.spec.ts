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

test("Studio can edit, duplicate, delete, and export custom cats", async ({ page }) => {
  await page.goto("/studio");
  await page.getByPlaceholder("e.g. Captain Tuna").fill("Manager Cat");
  await page.getByRole("button", { name: "Save to wall" }).click();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByPlaceholder("e.g. Captain Tuna").fill("Edited Cat");
  await page.getByRole("button", { name: "Update cat" }).click();
  await expect(page.getByText("Edited Cat").last()).toBeVisible();

  await page.getByRole("button", { name: "Duplicate Edited Cat" }).click();
  await expect(
    page.getByRole("paragraph").filter({ hasText: "Edited Cat Copy" }),
  ).toBeVisible();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export backup" }).click();
  await expect((await download).suggestedFilename()).toBe("meow-wall-cats.json");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Edited Cat Copy" }).click();
  await expect(
    page.getByRole("paragraph").filter({ hasText: "Edited Cat Copy" }),
  ).toHaveCount(0);
});

test("Cat Says downloads a PNG share card", async ({ page }) => {
  await page.goto("/says");
  await page.getByPlaceholder("e.g. I need coffee").fill("Ship more cats");
  await page.getByRole("button", { name: "Say it" }).click();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  await expect((await download).suggestedFilename()).toMatch(/-says\.png$/);
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
