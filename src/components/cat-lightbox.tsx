"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { copy } from "@/lib/copy";
import type { CatImage } from "@/lib/types";

interface CatLightboxProps {
  cats: CatImage[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function CatLightbox({
  cats,
  activeIndex,
  onClose,
  onNavigate,
}: CatLightboxProps) {
  const step = useCallback(
    (delta: number) => {
      if (activeIndex === null || cats.length === 0) return;
      const next = (activeIndex + delta + cats.length) % cats.length;
      onNavigate(next);
    },
    [activeIndex, cats.length, onNavigate],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, step]);

  const cat = activeIndex === null ? null : cats[activeIndex];

  return (
    <Dialog open={cat !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{copy.card.preview}</DialogTitle>
        {cat && (
          <div className="clay-surface relative aspect-square w-full overflow-hidden">
            <Image
              src={cat.url}
              alt="猫猫大图"
              fill
              sizes="(min-width: 768px) 720px, 90vw"
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        {cats.length > 1 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
            <Button
              variant="secondary"
              size="icon"
              aria-label="上一只"
              onClick={() => step(-1)}
              className="pointer-events-auto"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="下一只"
              onClick={() => step(1)}
              className="pointer-events-auto"
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
