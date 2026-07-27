"use client";

import Image from "next/image";
import { Download, Heart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PressArea } from "@/components/ui/press-area";
import { Skeleton } from "@/components/ui/skeleton";
import { copy } from "@/lib/copy";
import type { CatImage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CatCardProps {
  cat: CatImage;
  isFavorite: boolean;
  onToggleFavorite: (cat: CatImage) => void;
  onPreview: (cat: CatImage) => void;
}

export function CatCard({
  cat,
  isFavorite,
  onToggleFavorite,
  onPreview,
}: CatCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="clay-surface clay-pop clay-enter group relative overflow-hidden">
      <PressArea
        aria-label={copy.card.preview}
        onClick={() => onPreview(cat)}
        className="relative block aspect-square w-full"
      >
        {!isLoaded && <Skeleton className="absolute inset-0" />}
        <Image
          src={cat.url}
          alt="随机猫猫头"
          fill
          sizes="(min-width: 1280px) 25vw, 33vw"
          className={cn(
            "object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIsLoaded(true)}
          unoptimized
        />
      </PressArea>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/55 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          variant="secondary"
          size="icon"
          aria-label={isFavorite ? copy.card.unfavorite : copy.card.favorite}
          onClick={() => onToggleFavorite(cat)}
        >
          <Heart
            className={cn(isFavorite && "fill-destructive text-destructive")}
          />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          aria-label={copy.card.download}
          render={
            <a href={`/api/cats/download?url=${encodeURIComponent(cat.url)}`} />
          }
        >
          <Download />
        </Button>
      </div>
    </div>
  );
}
