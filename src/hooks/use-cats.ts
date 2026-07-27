"use client";

import { useCallback, useState } from "react";

import {
  listCatHeads,
  pickRandomCat,
  pickRandomState,
  shuffleCats,
  type CatHead,
  type MascotState,
} from "@/lib/cats";

/** Hero：随机一只猫 + 随机表情 */
export function useRandomCat() {
  const [cat, setCat] = useState<CatHead>(() => pickRandomCat());
  const [state, setState] = useState<MascotState>("idle");
  const [rollCount, setRollCount] = useState(0);

  const roll = useCallback(() => {
    setCat((prev) => pickRandomCat(prev.id));
    setState(pickRandomState());
    setRollCount((count) => count + 1);
  }, []);

  return { cat, state, roll, rollCount };
}

/** 猫墙：全皮肤 + 打乱顺序 */
export function useCatWall() {
  const [cats, setCats] = useState<CatHead[]>(() => listCatHeads());

  const reshuffle = useCallback(() => {
    setCats((prev) => shuffleCats(prev));
  }, []);

  return { cats, reshuffle, total: cats.length };
}
