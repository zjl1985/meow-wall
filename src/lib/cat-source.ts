import type { CatImage } from "@/lib/types";

const THE_CAT_API = "https://api.thecatapi.com/v1/images/search";
const CATAAS = "https://cataas.com";

/** next/image 只放行这些域名，来源返回的其他域名一律丢弃 */
export const ALLOWED_IMAGE_HOSTS = ["cdn2.thecatapi.com", "cataas.com"];

export const MIN_COUNT = 1;
export const MAX_COUNT = 24;
export const MAX_SAYS_LENGTH = 40;

export class CatSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatSourceError";
  }
}

function isAllowedUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    return protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

function toCatImage(raw: unknown): CatImage | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const url = typeof record.url === "string" ? record.url : null;
  if (!url || !isAllowedUrl(url)) return null;
  return {
    id: typeof record.id === "string" && record.id ? record.id : url,
    url,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
  };
}

async function fetchFromTheCatApi(count: number): Promise<CatImage[]> {
  const response = await fetch(`${THE_CAT_API}?limit=${count}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new CatSourceError(`thecatapi responded ${response.status}`);
  }
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new CatSourceError("thecatapi returned an unexpected shape");
  }
  return payload.map(toCatImage).filter((cat): cat is CatImage => cat !== null);
}

async function fetchOneFromCataas(): Promise<CatImage> {
  const response = await fetch(`${CATAAS}/cat?json=true`, { cache: "no-store" });
  if (!response.ok) {
    throw new CatSourceError(`cataas responded ${response.status}`);
  }
  const payload: unknown = await response.json();
  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  // cataas 返回的是相对 id，需要自己拼出可访问的图片地址
  const id = typeof record._id === "string" ? record._id : null;
  if (!id) {
    throw new CatSourceError("cataas returned no id");
  }
  return { id, url: `${CATAAS}/cat/${id}` };
}

/**
 * 拉一批随机猫。主源 TheCatAPI，失败或返回不足时用 cataas 逐张补齐。
 * 两个源都拿不到东西才抛 CatSourceError。
 */
export async function fetchRandomCats(count: number): Promise<CatImage[]> {
  let cats: CatImage[] = [];
  let primaryError: unknown = null;

  try {
    cats = await fetchFromTheCatApi(count);
  } catch (error) {
    primaryError = error;
  }

  if (cats.length >= count) {
    return cats.slice(0, count);
  }

  const missing = count - cats.length;
  const fallback = await Promise.allSettled(
    Array.from({ length: missing }, () => fetchOneFromCataas()),
  );
  for (const result of fallback) {
    if (result.status === "fulfilled") {
      cats.push(result.value);
    }
  }

  if (cats.length === 0) {
    throw new CatSourceError(
      primaryError instanceof Error
        ? `所有猫猫来源都失败了：${primaryError.message}`
        : "所有猫猫来源都失败了",
    );
  }

  // 去重：兜底源可能重复抽到同一只猫
  const seen = new Set<string>();
  return cats.filter((cat) => {
    if (seen.has(cat.id)) return false;
    seen.add(cat.id);
    return true;
  });
}

/** 生成「猫猫说话」表情包地址。文字里的斜杠会破坏路径，需要编码。 */
export function buildSaysCat(text: string): CatImage {
  const encoded = encodeURIComponent(text.trim());
  return {
    id: `says-${encoded}-${Date.now()}`,
    url: `${CATAAS}/cat/says/${encoded}?fontSize=48&fontColor=white&width=600`,
  };
}
