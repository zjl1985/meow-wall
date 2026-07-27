import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** 颜色选择器：业务层不要直接写原生 color input */
export function ColorInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="color"
      data-slot="color-input"
      className={cn(
        "border-border bg-card size-10 cursor-pointer rounded-lg border p-1 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
