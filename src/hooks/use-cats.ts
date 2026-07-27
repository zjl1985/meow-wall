"use client";

import { useCallback, useState } from "react";

import {
  listBuiltinCats,
  pickRandomCat,
  pickRandomState,
  type CatHead,
  type MascotState,
} from "@/lib/cats";

/** Hero：首屏固定第一只，避免 SSR/CSR 不一致；点「换一只」再随机 */
export function useRandomCat() {
  const [cat, setCat] = useState<CatHead>(() => listBuiltinCats()[0]!);
  const [state, setState] = useState<MascotState>("idle");
  const [rollCount, setRollCount] = useState(0);

  const roll = useCallback(() => {
    const pool = listBuiltinCats();
    setCat((prev) => pickRandomCat(pool, prev.id));
    setState(pickRandomState());
    setRollCount((count) => count + 1);
  }, []);

  return { cat, state, roll, rollCount };
}
