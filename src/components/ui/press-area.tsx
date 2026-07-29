import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * 无样式的可点击区域。用于图片、卡片这类"整块可按"的场景，
 * 避免在业务组件里出现原生 <button>，也避免为了改布局去覆盖 Button 的尺寸。
 */
export function PressArea({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="press-area"
      className={cn(
        "cursor-pointer touch-manipulation transition-transform duration-150 ease-out focus-visible:ring-ring/45 focus-visible:outline-none focus-visible:ring-[3px] active:scale-[0.98]",
        className,
      )}
      {...props}
    />
  );
}
