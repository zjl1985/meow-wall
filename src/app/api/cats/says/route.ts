import { z } from "zod";

import { MAX_SAYS_LENGTH, buildSaysCat } from "@/lib/cat-source";

const querySchema = z.object({
  text: z.string().trim().min(1).max(MAX_SAYS_LENGTH),
});

export function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    text: url.searchParams.get("text") ?? "",
  });

  if (!parsed.success) {
    return Response.json(
      {
        error: `想让猫说的话要在 1–${MAX_SAYS_LENGTH} 个字之间`,
        code: "INVALID_QUERY",
        success: false,
      },
      { status: 400 },
    );
  }

  return Response.json({ data: buildSaysCat(parsed.data.text), success: true });
}
