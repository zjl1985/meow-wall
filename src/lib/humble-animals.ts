/** 朴实小动物：手绘图标系列。原图保存在 art/humble-animals/，网页使用 public/humble-animals/ 下的压缩 WebP。 */
export const HUMBLE_ANIMAL_IDS = ["rabbit", "chick", "bear", "puppy", "cat"] as const;

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
  src: `/humble-animals/${id}.webp`,
  width: HUMBLE_ANIMAL_SIZE,
  height: HUMBLE_ANIMAL_SIZE,
}));
