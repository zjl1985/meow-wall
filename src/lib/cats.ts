import {
  CAT_VARIANTS,
  type CatVariant,
  type MascotAccessory,
  type MascotState,
} from "@/components/mascot/mascot-art";

export type { CatVariant, MascotAccessory, MascotState };

export interface CatHead {
  id: string;
  label: string;
  accessories?: readonly MascotAccessory[];
  markings?: CatVariant["markings"];
}

export const MASCOT_STATES: readonly MascotState[] = [
  "idle",
  "thinking",
  "success",
  "error",
  "sleeping",
  "angry",
] as const;

/** 全部皮肤，含 default，用于猫墙全览 */
export function listCatHeads(): CatHead[] {
  return CAT_VARIANTS.map((variant) => ({
    id: variant.id,
    label: variant.label,
    accessories: variant.accessories,
    markings: variant.markings,
  }));
}

export function getCatHead(id: string): CatHead | undefined {
  return listCatHeads().find((cat) => cat.id === id);
}

export function pickRandomCat(excludeId?: string): CatHead {
  const pool = listCatHeads().filter((cat) => cat.id !== excludeId);
  const source = pool.length > 0 ? pool : listCatHeads();
  return source[Math.floor(Math.random() * source.length)]!;
}

export function pickRandomState(): MascotState {
  return MASCOT_STATES[Math.floor(Math.random() * MASCOT_STATES.length)]!;
}

export function shuffleCats(cats: CatHead[]): CatHead[] {
  const next = [...cats];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = next[index]!;
    next[index] = next[swap]!;
    next[swap] = current;
  }
  return next;
}
