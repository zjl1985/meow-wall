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
  xl: "min-h-[22rem] p-10",
} as const;

/** 画廊展台：像素网格底，锐利边框 */
export function CatStage({ children, className, size = "md" }: CatStageProps) {
  return (
    <div
      className={cn(
        "gallery-frame pixel-stage relative flex items-center justify-center overflow-hidden",
        SIZE[size],
        className,
      )}
    >
      <div aria-hidden className="pixel-grid absolute inset-0 opacity-80" />
      <div
        aria-hidden
        className="pixel-glow absolute inset-x-10 bottom-8 h-8 rounded-full blur-2xl"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
