import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CatSourceError,
  buildSaysCat,
  fetchRandomCats,
} from "@/lib/cat-source";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** handler 里 throw 会变成 fetch 的 rejected promise，和真实网络错误一致 */
function mockFetch(handler: (url: string) => Response | Promise<Response>) {
  const spy = vi.fn(async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input.toString();
    return handler(url);
  });
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchRandomCats", () => {
  it("主源正常时直接返回主源结果", async () => {
    mockFetch(() =>
      jsonResponse([
        { id: "a", url: "https://cdn2.thecatapi.com/images/a.jpg", width: 100 },
        { id: "b", url: "https://cdn2.thecatapi.com/images/b.jpg" },
      ]),
    );

    const cats = await fetchRandomCats(2);

    expect(cats).toHaveLength(2);
    expect(cats[0]).toMatchObject({ id: "a", width: 100 });
  });

  it("丢掉不在白名单域名里的图", async () => {
    mockFetch(() =>
      jsonResponse([
        { id: "a", url: "https://evil.example.com/a.jpg" },
        { id: "b", url: "http://cdn2.thecatapi.com/images/b.jpg" },
        { id: "c", url: "https://cdn2.thecatapi.com/images/c.jpg" },
      ]),
    );

    const cats = await fetchRandomCats(3);

    expect(cats.map((cat) => cat.id)).toEqual(["c"]);
  });

  it("主源挂掉时降级到 cataas 逐张补齐", async () => {
    mockFetch((url) => {
      if (url.includes("thecatapi")) return jsonResponse({}, 500);
      return jsonResponse({ _id: `fallback-${Math.random()}` });
    });

    const cats = await fetchRandomCats(3);

    expect(cats).toHaveLength(3);
    expect(cats[0]?.url).toContain("cataas.com/cat/");
  });

  it("主源返回不足时用兜底源补到指定数量", async () => {
    mockFetch((url) => {
      if (url.includes("thecatapi")) {
        return jsonResponse([
          { id: "a", url: "https://cdn2.thecatapi.com/images/a.jpg" },
        ]);
      }
      return jsonResponse({ _id: `fallback-${Math.random()}` });
    });

    const cats = await fetchRandomCats(3);

    expect(cats).toHaveLength(3);
  });

  it("主源超时时降级到兜底源", async () => {
    mockFetch((url) => {
      if (url.includes("thecatapi")) {
        throw new DOMException("The operation was aborted", "TimeoutError");
      }
      return jsonResponse({ _id: `fallback-${Math.random()}` });
    });

    const cats = await fetchRandomCats(2);

    expect(cats).toHaveLength(2);
  });

  it("两个源都失败时抛 CatSourceError", async () => {
    mockFetch(() => jsonResponse({}, 503));

    await expect(fetchRandomCats(4)).rejects.toBeInstanceOf(CatSourceError);
  });

  it("兜底源重复抽到同一只猫时去重", async () => {
    mockFetch((url) => {
      if (url.includes("thecatapi")) return jsonResponse({}, 500);
      return jsonResponse({ _id: "same-cat" });
    });

    const cats = await fetchRandomCats(4);

    expect(cats).toHaveLength(1);
  });
});

describe("buildSaysCat", () => {
  it("对文字做 URL 编码，斜杠不会破坏路径", () => {
    const cat = buildSaysCat("a/b 喵");

    expect(cat.url).toContain("cataas.com/cat/says/a%2Fb%20%E5%96%B5");
    expect(cat.url).not.toContain("says/a/b");
  });

  it("去掉首尾空白", () => {
    expect(buildSaysCat("  喵  ").url).toContain("says/%E5%96%B5?");
  });
});
