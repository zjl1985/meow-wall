import { z } from "zod";

import {
  CatSourceError,
  MAX_COUNT,
  MIN_COUNT,
  fetchRandomCats,
} from "@/lib/cat-source";

const querySchema = z.object({
  count: z.coerce.number().int().min(MIN_COUNT).max(MAX_COUNT).default(12),
});

/** 随机接口一旦被 CDN 缓存住，所有人就会看到同一批猫 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    count: url.searchParams.get("count") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      {
        error: `count 必须是 ${MIN_COUNT}–${MAX_COUNT} 之间的整数`,
        code: "INVALID_QUERY",
        success: false,
      },
      { status: 400 },
    );
  }

  try {
    const cats = await fetchRandomCats(parsed.data.count);
    return Response.json(
      { data: cats, success: true },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof CatSourceError) {
      return Response.json(
        {
          error: "猫猫们暂时躲起来了，稍后再试试",
          code: "CAT_SOURCE_UNAVAILABLE",
          success: false,
        },
        { status: 503 },
      );
    }
    return Response.json(
      { error: "服务器开小差了", code: "INTERNAL_ERROR", success: false },
      { status: 500 },
    );
  }
}
