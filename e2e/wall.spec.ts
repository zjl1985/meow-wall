import { expect, test } from "@playwright/test";

/** 用假猫图，避免 E2E 依赖外部 API 的可用性和速度 */
const FAKE_CATS = Array.from({ length: 12 }, (_, index) => ({
  id: `e2e-cat-${index}`,
  url: `https://cdn2.thecatapi.com/images/e2e-${index}.jpg`,
}));

const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
  "base64",
);

test.beforeEach(async ({ page }) => {
  await page.route("**/api/cats?*", (route) =>
    route.fulfill({ json: { data: FAKE_CATS, success: true } }),
  );
  await page.route("https://cdn2.thecatapi.com/**", (route) =>
    route.fulfill({ contentType: "image/png", body: PNG_1PX }),
  );
});

test("猫墙加载 → 收藏一只 → 收藏页能看到", async ({ page }) => {
  await page.goto("/");

  const cards = page.getByRole("button", { name: "看大图" });
  await expect(cards.first()).toBeVisible();

  const firstCard = cards.first();
  await firstCard.hover();
  await page.getByRole("button", { name: "收藏" }).first().click();
  await expect(page.getByText("收下了，这只猫是你的了")).toBeVisible();

  await page.getByRole("link", { name: "我的收藏" }).click();
  await expect(page.getByText("一共 1 只猫住在这里")).toBeVisible();
  await expect(page.getByRole("button", { name: "看大图" })).toHaveCount(1);
});

test("外部猫源挂掉时显示错误和重试按钮，不白屏", async ({ page }) => {
  await page.route("**/api/cats?*", (route) =>
    route.fulfill({
      status: 503,
      json: {
        error: "猫猫们暂时躲起来了，稍后再试试",
        code: "CAT_SOURCE_UNAVAILABLE",
        success: false,
      },
    }),
  );

  await page.goto("/");

  await expect(page.getByText("猫猫们暂时躲起来了").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "再试一次" })).toBeVisible();
});
