import { z } from "zod";

import { ALLOWED_IMAGE_HOSTS } from "@/lib/cat-source";

/** 只允许代理白名单域名，避免变成任意 URL 的转发器 */
const querySchema = z.object({
  url: z
    .string()
    .url()
    .refine((value) => {
      try {
        const { protocol, hostname } = new URL(value);
        return protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(hostname);
      } catch {
        return false;
      }
    }, "不是允许的猫图地址"),
});

export async function GET(request: Request) {
  const parsed = querySchema.safeParse({
    url: new URL(request.url).searchParams.get("url") ?? "",
  });

  if (!parsed.success) {
    return Response.json(
      { error: "不是允许的猫图地址", code: "INVALID_URL", success: false },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(parsed.data.url, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      return Response.json(
        { error: "取图失败", code: "UPSTREAM_ERROR", success: false },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const extension = contentType.includes("png") ? "png" : "jpg";
    const filename = `meow-${Date.now()}.${extension}`;

    return new Response(upstream.body, {
      headers: {
        "content-type": contentType,
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "取图失败", code: "UPSTREAM_ERROR", success: false },
      { status: 502 },
    );
  }
}
