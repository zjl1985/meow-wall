"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Mascot } from "@/components/mascot/mascot";
import { listSpecialCats, type CatHead } from "@/lib/cats";
import { copy } from "@/lib/copy";

interface CatParadeProps {
  onDone: () => void;
}

/** 彩蛋：专属像素猫横穿屏幕 */
export function CatParade({ onDone }: CatParadeProps) {
  const cats: CatHead[] = listSpecialCats();

  useEffect(() => {
    toast(copy.easterEgg.parade);
    const timer = window.setTimeout(onDone, 5200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex items-end gap-10"
    >
      {cats.map((cat, index) => (
        <div
          key={cat.id}
          className="gallery-parade gallery-bob flex flex-col items-center"
          style={{ animationDelay: `${index * 180}ms` }}
        >
          <Mascot
            size={72}
            state={index % 2 === 0 ? "success" : "thinking"}
            palette={cat.palette}
            markings={cat.markings}
            accessories={cat.accessories}
            title={cat.label}
          />
          <span className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            {cat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
