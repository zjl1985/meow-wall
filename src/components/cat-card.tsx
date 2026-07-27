"use client";

import { Heart } from "lucide-react";

import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { PressArea } from "@/components/ui/press-area";
import { CAT_VARIANTS } from "@/components/mascot/mascot-art";
import type { CatHead, MascotState } from "@/lib/cats";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface CatCardProps {
  cat: CatHead;
  state?: MascotState;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPreview: (cat: CatHead) => void;
}

export function CatCard({
  cat,
  state = "idle",
  isFavorite,
  onToggleFavorite,
  onPreview,
}: CatCardProps) {
  const palette =
    CAT_VARIANTS.find((variant) => variant.id === cat.id)?.palette;

  return (
    <div className="clay-surface clay-pop clay-enter group relative overflow-hidden p-4">
      <PressArea
        aria-label={`${copy.card.preview}：${cat.label}`}
        onClick={() => onPreview(cat)}
        className="flex w-full flex-col items-center gap-3"
      >
        <Mascot
          size={120}
          state={state}
          palette={palette}
          markings={cat.markings}
          accessories={cat.accessories}
          title={cat.label}
        />
        <span className="font-heading text-sm font-bold">{cat.label}</span>
      </PressArea>

      <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          variant="secondary"
          size="icon"
          aria-label={isFavorite ? copy.card.unfavorite : copy.card.favorite}
          onClick={() => onToggleFavorite(cat.id)}
        >
          <Heart
            className={cn(isFavorite && "fill-destructive text-destructive")}
          />
        </Button>
      </div>
    </div>
  );
}
