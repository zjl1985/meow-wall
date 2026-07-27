import { expect, test } from "@playwright/test";

test("首页有像素猫和彩蛋专属区", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "今天的猫是这只" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "彩蛋专属猫" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "看大猫：Nicole" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "看大猫：Zero" })).toBeVisible();
  await expect(page.getByRole("img").first()).toBeVisible();
});

test("捏猫页能随机并保存到猫墙", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "捏一只猫猫头" })).toBeVisible();

  await page.getByRole("button", { name: "随机来一只" }).click();
  await page.getByPlaceholder("给它起个名字").fill("测试猫");
  await page.getByRole("button", { name: "存进猫墙" }).click();
  await expect
    .poll(async () =>
      page.evaluate(() => localStorage.getItem("meow-wall:custom-cats") ?? ""),
    )
    .toContain("测试猫");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "看大猫：测试猫" })).toBeVisible();
  await expect(page.getByText("自制").first()).toBeVisible();
});

test("彩蛋猫可收藏", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "彩蛋专属猫" }) })
    .getByRole("button", { name: "收藏" })
    .first()
    .click();
  await expect(page.getByText("收下了，这只猫是你的了")).toBeVisible();
  await page.getByRole("link", { name: "收藏" }).click();
  await expect(page.getByText(/一共 \d+ 只猫住在这里/)).toBeVisible();
});
