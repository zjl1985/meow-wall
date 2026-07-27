import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CatStageProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE = {
  sm: "min-h-36 p-4",
  md: "min-h-48 p-6",
  lg: "min-h-64 p-8",
  xl: "min-h-80 p-10",
} as const;

/** 像素点阵底座：让猫猫头站在有「游戏感」的台上，而不是空白白卡片中间 */
export function CatStage({ children, className, size = "md" }: CatStageProps) {
  return (
    <div
      className={cn(
        "clay-surface pixel-stage relative flex items-center justify-center overflow-hidden",
        SIZE[size],
        className,
      )}
    >
      <div aria-hidden className="pixel-grid absolute inset-0 opacity-70" />
      <div aria-hidden className="pixel-glow absolute inset-x-8 bottom-6 h-10 rounded-full blur-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
