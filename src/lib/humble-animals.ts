/** 朴实小动物：手绘图标系列。原有插画使用压缩 WebP，agent-hub 补充插画使用柔和纸纹 SVG。 */
export const HUMBLE_ANIMAL_IDS = ["rabbit", "chick", "bear", "puppy", "cat",
  "elephant", "caterpillar", "peacock", "koala", "pig", "frog", "monkey", "hippo", "giraffe",
] as const;

export type HumbleAnimalId = (typeof HUMBLE_ANIMAL_IDS)[number];

export interface HumbleAnimal {
  id: HumbleAnimalId;
  src: string;
  width: number;
  height: number;
}

/** Web-optimized size; originals are 1024px+ PNGs. */
export const HUMBLE_ANIMAL_SIZE = 640;

export const HUMBLE_ANIMALS: readonly HumbleAnimal[] = HUMBLE_ANIMAL_IDS.map((id) => ({
  id,
  src: `/humble-animals/${id}.${["rabbit", "chick", "bear", "puppy", "cat"].includes(id) ? "webp" : "svg"}`,
  width: HUMBLE_ANIMAL_SIZE,
  height: HUMBLE_ANIMAL_SIZE,
}));
