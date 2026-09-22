"use client";

import { Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { useLocale } from "@/hooks/use-copy";
import { themes } from "@/lib/themes";

const subscribe = () => () => {};

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return (
    <label className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary focus-within:ring-2 focus-within:ring-ring">
      <Paintbrush aria-hidden="true" className="size-4" />
      <select
        aria-label={locale === "zh" ? "主题" : "Theme"}
        title={locale === "zh" ? "主题" : "Theme"}
        value={mounted ? theme ?? "cream" : "cream"}
        onChange={(event) => setTheme(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {themes.map(({ id, name, nameZh }) => (
          <option key={id} value={id}>{locale === "zh" ? nameZh : name}</option>
        ))}
      </select>
    </label>
  );
}
