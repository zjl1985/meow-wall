import { expect, test } from "@playwright/test";

test("猫墙渲染像素猫 → 收藏 → 收藏页能看到", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "今天的猫是这只" })).toBeVisible();
  await expect(page.getByRole("img").first()).toBeVisible();

  const wallCard = page.getByRole("button", { name: /看大猫：/ }).first();
  await wallCard.hover();
  await page.getByRole("button", { name: "收藏" }).first().click();
  await expect(page.getByText("收下了，这只猫是你的了")).toBeVisible();

  await page.getByRole("link", { name: "我的收藏" }).click();
  await expect(page.getByText("一共 1 只猫住在这里")).toBeVisible();
  await expect(page.getByRole("button", { name: /看大猫：/ })).toHaveCount(1);
});

test("猫猫说话页能冒泡", async ({ page }) => {
  await page.goto("/says");
  await page.getByRole("button", { name: "我不想上班" }).click();
  await expect(page.getByText("我不想上班").nth(1)).toBeVisible();
});
