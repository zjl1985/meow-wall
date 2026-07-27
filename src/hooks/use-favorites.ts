"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { CatImage, FavoriteCat } from "@/lib/types";

const STORAGE_KEY = "meow-wall:favorites";
/** 同一标签页内的多个组件靠这个事件保持同步（storage 事件只跨标签页触发） */
const SYNC_EVENT = "meow-wall:favorites-changed";

const EMPTY: FavoriteCat[] = [];

/** 缓存解析结果，保证 getSnapshot 返回稳定引用，否则 useSyncExternalStore 会死循环 */
let cachedRaw: string | null = null;
let cachedValue: FavoriteCat[] = EMPTY;

function parse(raw: string | null): FavoriteCat[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((item): item is FavoriteCat => {
      if (typeof item !== "object" || item === null) return false;
      const record = item as Record<string, unknown>;
      return typeof record.id === "string" && typeof record.url === "string";
    });
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): FavoriteCat[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

function getServerSnapshot(): FavoriteCat[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(SYNC_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SYNC_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(favorites: FavoriteCat[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

const noopSubscribe = () => () => {};

/** 首帧必须和服务端渲染一致，所以要区分"还没水合"和"真的没有收藏" */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isHydrated = useIsHydrated();

  const toggle = useCallback((cat: CatImage) => {
    const current = getSnapshot();
    const exists = current.some((item) => item.id === cat.id);
    write(
      exists
        ? current.filter((item) => item.id !== cat.id)
        : [{ ...cat, addedAt: Date.now() }, ...current],
    );
    return !exists;
  }, []);

  const remove = useCallback((id: string) => {
    write(getSnapshot().filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    write([]);
  }, []);

  const has = useCallback(
    (id: string) => favorites.some((item) => item.id === id),
    [favorites],
  );

  return { favorites, isHydrated, toggle, remove, clear, has };
}
