import {
  ACCESSORIES,
  CAT_VARIANTS,
  DEFAULT_PALETTE,
  type CatVariant,
  type MascotAccessory,
  type MascotPalette,
  type MascotState,
  type Overlay,
} from "@/components/mascot/mascot-art";

export type { CatVariant, MascotAccessory, MascotPalette, MascotState, Overlay };

export const SPECIAL_CAT_IDS = ["nicole", "goodman", "simon", "zero"] as const;
export type SpecialCatId = (typeof SPECIAL_CAT_IDS)[number];

export const ALL_ACCESSORIES = Object.keys(ACCESSORIES) as MascotAccessory[];

export const MASCOT_STATES: readonly MascotState[] = [
  "idle",
  "thinking",
  "success",
  "error",
  "sleeping",
  "angry",
] as const;

export const PALETTE_SLOTS = [
  "head",
  "headDark",
  "headLight",
  "earInner",
  "ink",
  "blush",
  "nose",
  "white",
] as const satisfies readonly (keyof MascotPalette)[];

export type PaletteSlot = (typeof PALETTE_SLOTS)[number];

export interface CatHead {
  id: string;
  label: string;
  palette: MascotPalette;
  accessories?: readonly MascotAccessory[];
  markings?: Overlay;
  kind: "builtin" | "special" | "custom";
}

export interface CustomCatDraft {
  label: string;
  palette: MascotPalette;
  accessories: MascotAccessory[];
  state: MascotState;
}

function fromVariant(variant: CatVariant): CatHead {
  const isSpecial = (SPECIAL_CAT_IDS as readonly string[]).includes(variant.id);
  return {
    id: variant.id,
    label: variant.label,
    palette: variant.palette,
    accessories: variant.accessories,
    markings: variant.markings,
    kind: isSpecial ? "special" : "builtin",
  };
}

export function listBuiltinCats(): CatHead[] {
  return CAT_VARIANTS.map(fromVariant);
}

export function listSpecialCats(): CatHead[] {
  return listBuiltinCats().filter((cat) => cat.kind === "special");
}

export function listRegularCats(): CatHead[] {
  return listBuiltinCats().filter((cat) => cat.kind === "builtin");
}

export function getBuiltinCat(id: string): CatHead | undefined {
  return listBuiltinCats().find((cat) => cat.id === id);
}

/** 墙面展示顺序：自定义 → 普通皮肤（彩蛋专属单独成区，不重复） */
export function listWallCats(customs: CatHead[]): CatHead[] {
  return [...customs, ...listRegularCats()];
}

export function pickRandomCat(
  pool: CatHead[],
  excludeId?: string,
): CatHead {
  const filtered = pool.filter((cat) => cat.id !== excludeId);
  const source = filtered.length > 0 ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)]!;
}

export function pickRandomState(): MascotState {
  return MASCOT_STATES[Math.floor(Math.random() * MASCOT_STATES.length)]!;
}

export function pickRandomAccessories(count = 1): MascotAccessory[] {
  const shuffled = shuffleItems([...ALL_ACCESSORIES]);
  return shuffled.slice(0, Math.max(0, Math.min(count, shuffled.length)));
}

export function randomPalette(): MascotPalette {
  const hue = Math.floor(Math.random() * 360);
  return {
    head: hslToHex(hue, 48, 62),
    headDark: hslToHex(hue, 42, 38),
    headLight: hslToHex(hue, 55, 78),
    earInner: hslToHex((hue + 330) % 360, 62, 68),
    ink: "#14042B",
    blush: hslToHex((hue + 350) % 360, 48, 72),
    nose: hslToHex(hue, 28, 28),
    white: "#FFFFFF",
  };
}

export function createEmptyDraft(): CustomCatDraft {
  return {
    label: "我的猫",
    palette: { ...DEFAULT_PALETTE },
    accessories: [],
    state: "idle",
  };
}

export function createRandomDraft(): CustomCatDraft {
  const accessories =
    Math.random() < 0.25 ? [] : pickRandomAccessories(Math.random() < 0.3 ? 2 : 1);
  return {
    label: randomCatName(),
    palette: randomPalette(),
    accessories,
    state: pickRandomState(),
  };
}

export function shuffleCats(cats: CatHead[]): CatHead[] {
  return shuffleItems(cats);
}

function shuffleItems<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = next[index]!;
    next[index] = next[swap]!;
    next[swap] = current;
  }
  return next;
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [chroma, x, 0];
  else if (h < 120) [r, g, b] = [x, chroma, 0];
  else if (h < 180) [r, g, b] = [0, chroma, x];
  else if (h < 240) [r, g, b] = [0, x, chroma];
  else if (h < 300) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];
  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const NAME_PREFIX = ["像素", "软乎", "方块", "奶油", "闪电", "豆豆", "毛线"];
const NAME_SUFFIX = ["喵", "团子", "罐头", "爪爪", "豆", "球", "猫"];

function randomCatName(): string {
  const prefix = NAME_PREFIX[Math.floor(Math.random() * NAME_PREFIX.length)]!;
  const suffix = NAME_SUFFIX[Math.floor(Math.random() * NAME_SUFFIX.length)]!;
  return `${prefix}${suffix}`;
}
