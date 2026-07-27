"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { copy } from "@/lib/copy";

interface CatParadeProps {
  onDone: () => void;
}

const PARADE = ["🐱", "🐈", "🐈‍⬛", "😻", "🐾", "😼", "🙀"];

/** 彩蛋：一排猫从屏幕底部横穿而过 */
export function CatParade({ onDone }: CatParadeProps) {
  useEffect(() => {
    toast(copy.easterEgg.parade);
    const timer = window.setTimeout(onDone, 4200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex gap-6 text-4xl"
    >
      {PARADE.map((cat, index) => (
        <span
          key={cat}
          className="clay-parade inline-block"
          style={{ animationDelay: `${index * 140}ms` }}
        >
          {cat}
        </span>
      ))}
    </div>
  );
}
