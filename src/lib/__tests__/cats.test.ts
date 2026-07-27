import { describe, expect, it } from "vitest";

import {
  getCatHead,
  listCatHeads,
  pickRandomCat,
  pickRandomState,
  shuffleCats,
} from "@/lib/cats";

describe("listCatHeads", () => {
  it("至少有 default 和一批皮肤", () => {
    const cats = listCatHeads();
    expect(cats.length).toBeGreaterThanOrEqual(20);
    expect(cats.some((cat) => cat.id === "default")).toBe(true);
    expect(cats.every((cat) => cat.id && cat.label)).toBe(true);
  });

  it("皮肤 id 不重复", () => {
    const cats = listCatHeads();
    expect(new Set(cats.map((cat) => cat.id)).size).toBe(cats.length);
  });
});

describe("getCatHead / pickRandomCat", () => {
  it("能按 id 取到猫", () => {
    expect(getCatHead("orange")?.label).toBeTruthy();
    expect(getCatHead("nope")).toBeUndefined();
  });

  it("随机猫可以排除指定 id", () => {
    for (let index = 0; index < 20; index += 1) {
      expect(pickRandomCat("default").id).not.toBe("default");
    }
  });

  it("随机表情落在已知集合里", () => {
    for (let index = 0; index < 20; index += 1) {
      expect([
        "idle",
        "thinking",
        "success",
        "error",
        "sleeping",
        "angry",
      ]).toContain(pickRandomState());
    }
  });
});

describe("shuffleCats", () => {
  it("打乱后元素集合不变", () => {
    const cats = listCatHeads();
    const shuffled = shuffleCats(cats);
    expect(shuffled).toHaveLength(cats.length);
    expect(new Set(shuffled.map((cat) => cat.id))).toEqual(
      new Set(cats.map((cat) => cat.id)),
    );
  });
});
