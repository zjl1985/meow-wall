"use client";

import { Heart } from "lucide-react";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PressArea } from "@/components/ui/press-area";
import type { CatHead, MascotState } from "@/lib/cats";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface CatCardProps {
  cat: CatHead;
  state?: MascotState;
  isFavorite: boolean;
  onToggleFavorite: (cat: CatHead) => void;
  onPreview: (cat: CatHead) => void;
}

export function CatCard({
  cat,
  state = "idle",
  isFavorite,
  onToggleFavorite,
  onPreview,
}: CatCardProps) {
  return (
    <div className="gallery-panel gallery-lift gallery-enter group relative overflow-hidden p-3">
      {cat.kind === "custom" && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 z-10 border-white/20 bg-black/30"
        >
          {copy.card.customBadge}
        </Badge>
      )}
      {cat.kind === "special" && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 z-10 border-white/20 bg-black/30"
        >
          {copy.card.specialBadge}
        </Badge>
      )}

      <PressArea
        aria-label={`${copy.card.preview}：${cat.label}`}
        onClick={() => onPreview(cat)}
        className="flex w-full flex-col items-center gap-3"
      >
        <CatStage size="sm" className="w-full border-0! bg-transparent">
          <Mascot
            size={112}
            state={state}
            palette={cat.palette}
            markings={cat.markings}
            accessories={cat.accessories}
            title={cat.label}
          />
        </CatStage>
        <span className="font-heading text-sm font-medium tracking-wide">
          {cat.label}
        </span>
      </PressArea>

      <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          variant="secondary"
          size="icon"
          aria-label={isFavorite ? copy.card.unfavorite : copy.card.favorite}
          onClick={() => onToggleFavorite(cat)}
        >
          <Heart className={cn(isFavorite && "fill-primary text-primary")} />
        </Button>
      </div>
    </div>
  );
}
