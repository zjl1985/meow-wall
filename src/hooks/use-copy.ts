"use client";

import { useSyncExternalStore } from "react";

import { copyEn, copyZh, type Locale, type SiteCopy } from "@/lib/copy";

const STORAGE_KEY = "meow-wall:locale";
const CHANGE_EVENT = "meow-wall:locale-changed";

function getSnapshot(): Locale {
  return window.localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function setLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCopy(): SiteCopy {
  return useLocale() === "zh" ? copyZh : copyEn;
}
