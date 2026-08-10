"use client";

import { useCallback, useSyncExternalStore } from "react";

import type {
  MascotAccessory,
  MascotPalette,
  MascotState,
} from "@/components/mascot/mascot-art";
import type { CatHead } from "@/lib/cats";
import { ALL_ACCESSORIES, MASCOT_STATES } from "@/lib/cats";

const STORAGE_KEY = "meow-wall:custom-cats";
const SYNC_EVENT = "meow-wall:custom-cats-changed";
const EMPTY: CatHead[] = [];

let cachedRaw: string | null = null;
let cachedValue: CatHead[] = EMPTY;

function isPalette(value: unknown): value is MascotPalette {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.head === "string" &&
    typeof record.headDark === "string" &&
    typeof record.headLight === "string" &&
    typeof record.earInner === "string" &&
    typeof record.ink === "string" &&
    typeof record.blush === "string" &&
    typeof record.nose === "string" &&
    typeof record.white === "string"
  );
}

export const CUSTOM_CATS_BACKUP_VERSION = 1;

function parseValue(value: unknown): CatHead[] {
  const candidate =
    typeof value === "object" && value !== null && "cats" in value
      ? (value as { cats?: unknown }).cats
      : value;
  if (!Array.isArray(candidate)) return EMPTY;
  return candidate.flatMap((item): CatHead[] => {
    if (typeof item !== "object" || item === null) return [];
    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.label !== "string") {
      return [];
    }
    if (!isPalette(record.palette)) return [];
    const accessories = Array.isArray(record.accessories)
      ? record.accessories.filter(
          (value): value is MascotAccessory =>
            typeof value === "string" &&
            (ALL_ACCESSORIES as readonly string[]).includes(value),
        )
      : [];
    const state =
      typeof record.state === "string" &&
      (MASCOT_STATES as readonly string[]).includes(record.state)
        ? (record.state as MascotState)
        : "idle";
    return [
      {
        id: record.id,
        label: record.label,
        palette: record.palette,
        accessories,
        state,
        kind: "custom",
      },
    ];
  });
}

function parse(raw: string | null): CatHead[] {
  if (!raw) return EMPTY;
  try {
    return parseValue(JSON.parse(raw) as unknown);
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CatHead[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

function getServerSnapshot(): CatHead[] {
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

function write(cats: CatHead[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useCustomCats() {
  const customs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const save = useCallback(
    (input: {
      label: string;
      palette: MascotPalette;
      accessories: readonly MascotAccessory[];
      state?: MascotState;
    }) => {
      const cat: CatHead = {
        id: `custom-${crypto.randomUUID()}`,
        label: input.label.trim() || "Untitled Cat",
        palette: input.palette,
        accessories: [...input.accessories],
        state: input.state ?? "idle",
        kind: "custom",
      };
      write([cat, ...getSnapshot()]);
      return cat;
    },
    [],
  );

  const remove = useCallback((id: string) => {
    write(getSnapshot().filter((cat) => cat.id !== id));
  }, []);

  const update = useCallback(
    (
      id: string,
      input: {
        label: string;
        palette: MascotPalette;
        accessories: readonly MascotAccessory[];
        state?: MascotState;
      },
    ) => {
      let updated: CatHead | undefined;
      write(
        getSnapshot().map((cat) => {
          if (cat.id !== id) return cat;
          updated = {
            ...cat,
            label: input.label.trim() || "Untitled Cat",
            palette: input.palette,
            accessories: [...input.accessories],
            state: input.state ?? "idle",
          };
          return updated;
        }),
      );
      return updated;
    },
    [],
  );

  const exportBackup = useCallback(() => {
    return JSON.stringify(
      { version: CUSTOM_CATS_BACKUP_VERSION, cats: getSnapshot() },
      null,
      2,
    );
  }, []);

  const importBackup = useCallback((raw: string) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      throw new Error("invalid-json");
    }
    const imported = parseValue(parsed);
    if (imported.length === 0) throw new Error("no-cats");
    const merged = new Map(getSnapshot().map((cat) => [cat.id, cat]));
    imported.forEach((cat) => merged.set(cat.id, cat));
    write([...imported, ...[...merged.values()].filter((cat) => !imported.some((item) => item.id === cat.id))]);
    return imported.length;
  }, []);

  const get = useCallback(
    (id: string) => customs.find((cat) => cat.id === id),
    [customs],
  );

  return { customs, save, update, remove, get, exportBackup, importBackup };
}

/** 非 hook：给收藏页同步查找用 */
export function readCustomCats(): CatHead[] {
  if (typeof window === "undefined") return EMPTY;
  return getSnapshot();
}
