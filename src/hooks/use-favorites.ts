"use client";

import { useCallback, useSyncExternalStore } from "react";

import { getBuiltinCat } from "@/lib/cats";
import { readCustomCats } from "@/hooks/use-custom-cats";
import type { FavoriteCat } from "@/lib/types";

const STORAGE_KEY = "meow-wall:favorites";
const SYNC_EVENT = "meow-wall:favorites-changed";
const EMPTY: FavoriteCat[] = [];

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
      return typeof record.id === "string" && typeof record.label === "string";
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

  const toggle = useCallback((id: string, label?: string) => {
    const builtin = getBuiltinCat(id);
    const custom = readCustomCats().find((cat) => cat.id === id);
    const resolvedLabel = label ?? builtin?.label ?? custom?.label;
    if (!resolvedLabel) return false;

    const current = getSnapshot();
    const exists = current.some((item) => item.id === id);
    write(
      exists
        ? current.filter((item) => item.id !== id)
        : [{ id, label: resolvedLabel, addedAt: Date.now() }, ...current],
    );
    return !exists;
  }, []);

  const clear = useCallback(() => {
    write([]);
  }, []);

  const has = useCallback(
    (id: string) => favorites.some((item) => item.id === id),
    [favorites],
  );

  return { favorites, isHydrated, toggle, clear, has };
}
