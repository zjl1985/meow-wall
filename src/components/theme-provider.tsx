"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { themes } from "@/lib/themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="cream"
      themes={themes.map(({ id }) => id)}
      storageKey="meow-wall:theme"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
