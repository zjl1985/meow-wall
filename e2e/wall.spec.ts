import { expect, test } from "@playwright/test";

test("首页有像素猫、专属区和 GitHub 链接", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "今日展出" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Specials" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open：Nicole" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open：Zero" })).toBeVisible();
  await expect(page.getByRole("link", { name: /GitHub/ }).first()).toBeVisible();
  await expect(page.getByRole("img").first()).toBeVisible();
});

test("Studio 能随机并保存到 Archive", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "Studio" })).toBeVisible();

  await page.getByRole("button", { name: "Random" }).click();
  await page.getByPlaceholder("Name this cat").fill("测试猫");
  await page.getByRole("button", { name: "Save to Archive" }).click();
  await expect
    .poll(async () =>
      page.evaluate(() => localStorage.getItem("meow-wall:custom-cats") ?? ""),
    )
    .toContain("测试猫");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open：测试猫" })).toBeVisible();
  await expect(page.getByText("Custom").first()).toBeVisible();
});

test("专属猫可收藏", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Specials" }) })
    .getByRole("button", { name: "Save" })
    .first()
    .click();
  await expect(page.getByText("Saved").first()).toBeVisible();
  await page.getByRole("link", { name: "Saved", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Saved" })).toBeVisible();
});
