"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CatCard } from "@/components/cat-card";
import { CatLightbox } from "@/components/cat-lightbox";
import { useFavorites } from "@/hooks/use-favorites";
import { copy } from "@/lib/copy";
import type { CatImage } from "@/lib/types";

interface CatGridProps {
  cats: CatImage[];
  /** 收藏页需要在取消收藏后立刻把卡片移除 */
  onUnfavorite?: (id: string) => void;
}

/** 猫卡网格 + 大图预览，猫墙和收藏页共用 */
export function CatGrid({ cats, onUnfavorite }: CatGridProps) {
  const { has, toggle } = useFavorites();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (cat: CatImage) => {
    const added = toggle(cat);
    toast(added ? copy.toast.favorited : copy.toast.unfavorited);
    if (!added) onUnfavorite?.(cat.id);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {cats.map((cat, index) => (
          <CatCard
            key={cat.id}
            cat={cat}
            isFavorite={has(cat.id)}
            onToggleFavorite={handleToggle}
            onPreview={() => setActiveIndex(index)}
          />
        ))}
      </div>
      <CatLightbox
        cats={cats}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
