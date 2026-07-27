"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ApiResponse, CatImage } from "@/lib/types";

interface UseCatsResult {
  cats: CatImage[];
  isLoading: boolean;
  error: string | null;
  loadMore: () => void;
  reset: () => void;
}

async function requestCats(
  count: number,
  signal: AbortSignal,
): Promise<CatImage[]> {
  const response = await fetch(`/api/cats?count=${count}`, { signal });
  const payload = (await response.json()) as ApiResponse<CatImage[]>;
  if (!payload.success) {
    throw new Error(payload.error);
  }
  return payload.data;
}

/** 猫墙数据源：首屏自动拉一批，loadMore 追加，重复调用不会打重复请求。 */
export function useCats(batchSize = 12): UseCatsResult {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(
    (mode: "append" | "replace") => {
      if (inFlight.current) return;
      const controller = new AbortController();
      inFlight.current = controller;
      setIsLoading(true);
      setError(null);

      requestCats(batchSize, controller.signal)
        .then((batch) => {
          setCats((prev) => {
            if (mode === "replace") return batch;
            const seen = new Set(prev.map((cat) => cat.id));
            return [...prev, ...batch.filter((cat) => !seen.has(cat.id))];
          });
        })
        .catch((cause: unknown) => {
          if (controller.signal.aborted) return;
          setError(cause instanceof Error ? cause.message : "加载失败了");
        })
        .finally(() => {
          if (inFlight.current === controller) {
            inFlight.current = null;
            setIsLoading(false);
          }
        });
    },
    [batchSize],
  );

  useEffect(() => {
    load("replace");
    return () => {
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [load]);

  return {
    cats,
    isLoading,
    error,
    loadMore: useCallback(() => load("append"), [load]),
    reset: useCallback(() => load("replace"), [load]),
  };
}

/** 单只猫（Hero 用）。 */
export function useRandomCat() {
  const [cat, setCat] = useState<CatImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const inFlight = useRef<AbortController | null>(null);

  const roll = useCallback(() => {
    if (inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    setIsLoading(true);
    setError(null);

    requestCats(1, controller.signal)
      .then(([next]) => {
        if (next) {
          setCat(next);
          setRollCount((count) => count + 1);
        }
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "加载失败了");
      })
      .finally(() => {
        if (inFlight.current === controller) {
          inFlight.current = null;
          setIsLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    roll();
    return () => {
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [roll]);

  return { cat, isLoading, error, roll, rollCount };
}
