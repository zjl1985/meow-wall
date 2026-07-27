import { afterEach, describe, expect, it, vi } from "vitest";

import { GET as downloadCat } from "@/app/api/cats/download/route";
import { GET as listCats } from "@/app/api/cats/route";
import { GET as saysCat } from "@/app/api/cats/says/route";
import type { ApiResponse, CatImage } from "@/lib/types";

function request(path: string): Request {
  return new Request(`http://localhost:3000${path}`);
}

function stubCats(count: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify(
            Array.from({ length: count }, (_, index) => ({
              id: `cat-${index}`,
              url: `https://cdn2.thecatapi.com/images/${index}.jpg`,
            })),
          ),
          { headers: { "content-type": "application/json" } },
        ),
      ),
    ),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/cats", () => {
  it("默认返回 12 只猫", async () => {
    stubCats(12);

    const response = await listCats(request("/api/cats"));
    const payload = (await response.json()) as ApiResponse<CatImage[]>;

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    if (payload.success) expect(payload.data).toHaveLength(12);
  });

  it("count 超出范围返回 400", async () => {
    const tooMany = await listCats(request("/api/cats?count=99"));
    const zero = await listCats(request("/api/cats?count=0"));
    const notNumber = await listCats(request("/api/cats?count=abc"));

    expect(tooMany.status).toBe(400);
    expect(zero.status).toBe(400);
    expect(notNumber.status).toBe(400);
  });

  it("所有来源都失败时返回 503", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("nope", { status: 500 }))),
    );

    const response = await listCats(request("/api/cats?count=2"));
    const payload = (await response.json()) as ApiResponse<CatImage[]>;

    expect(response.status).toBe(503);
    expect(payload.success).toBe(false);
    if (!payload.success) expect(payload.code).toBe("CAT_SOURCE_UNAVAILABLE");
  });
});

describe("GET /api/cats/says", () => {
  it("返回带文字的猫图地址", async () => {
    const response = saysCat(request("/api/cats/says?text=喵"));
    const payload = (await response.json()) as ApiResponse<CatImage>;

    expect(response.status).toBe(200);
    if (payload.success) {
      expect(payload.data.url).toContain("/cat/says/");
    }
  });

  it("空文字和超长文字都返回 400", async () => {
    const empty = saysCat(request("/api/cats/says?text=%20%20"));
    const tooLong = saysCat(
      request(`/api/cats/says?text=${"猫".repeat(41)}`),
    );

    expect(empty.status).toBe(400);
    expect(tooLong.status).toBe(400);
  });
});

describe("GET /api/cats/download", () => {
  it("代理白名单域名的图并带上下载头", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response("binary", { headers: { "content-type": "image/png" } }),
        ),
      ),
    );

    const response = await downloadCat(
      request(
        "/api/cats/download?url=https%3A%2F%2Fcdn2.thecatapi.com%2Fimages%2Fa.png",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-disposition")).toContain(".png");
  });

  it("拒绝白名单外的地址", async () => {
    const response = await downloadCat(
      request("/api/cats/download?url=https%3A%2F%2Fevil.example.com%2Fa.png"),
    );

    expect(response.status).toBe(400);
  });
});
