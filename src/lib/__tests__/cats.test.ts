import { describe, expect, it } from "vitest";

import { CAT_GRID, GRID_SIZE } from "@/components/mascot/mascot-art";
import {
  createRandomDraft,
  getBuiltinCat,
  listBuiltinCats,
  listSpecialCats,
  listWallCats,
  pickRandomCat,
  randomPalette,
  shuffleCats,
} from "@/lib/cats";

describe("pixel art geometry", () => {
  it("基础猫猫头始终是完整的 32×32 网格", () => {
    expect(CAT_GRID).toHaveLength(GRID_SIZE);
    expect(CAT_GRID.every((row) => row.length === GRID_SIZE)).toBe(true);
  });
});

describe("builtin / special cats", () => {
  it("内置猫数量充足且 id 唯一", () => {
    const cats = listBuiltinCats();
    expect(cats.length).toBeGreaterThanOrEqual(20);
    expect(new Set(cats.map((cat) => cat.id)).size).toBe(cats.length);
  });

  it("彩蛋专属猫 Nicole/Goodman/Simon/Zero 都在", () => {
    const ids = listSpecialCats().map((cat) => cat.id);
    expect(ids).toEqual(["nicole", "goodman", "simon", "zero"]);
    expect(listSpecialCats().every((cat) => cat.kind === "special")).toBe(true);
  });

  it("墙面顺序：自定义在前，不含彩蛋专属（专属另有专区）", () => {
    const custom = {
      id: "custom-1",
      label: "自制",
      palette: randomPalette(),
      kind: "custom" as const,
    };
    const wall = listWallCats([custom]);
    expect(wall[0]?.id).toBe("custom-1");
    expect(wall.some((cat) => cat.id === "nicole")).toBe(false);
  });
});

describe("generator helpers", () => {
  it("随机草稿带 hex 配色", () => {
    const draft = createRandomDraft();
    expect(draft.palette.head).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(draft.label.length).toBeGreaterThan(0);
  });

  it("随机猫可以排除指定 id", () => {
    const pool = listBuiltinCats();
    for (let index = 0; index < 20; index += 1) {
      expect(pickRandomCat(pool, "default").id).not.toBe("default");
    }
  });

  it("打乱后集合不变", () => {
    const cats = listBuiltinCats();
    const shuffled = shuffleCats(cats);
    expect(new Set(shuffled.map((cat) => cat.id))).toEqual(
      new Set(cats.map((cat) => cat.id)),
    );
  });

  it("能按 id 取到内置猫", () => {
    expect(getBuiltinCat("orange")?.kind).toBe("builtin");
    expect(getBuiltinCat("zero")?.kind).toBe("special");
    expect(getBuiltinCat("nope")).toBeUndefined();
  });
});
