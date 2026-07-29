"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CatCard } from "@/components/cat-card";
import { CatLightbox } from "@/components/cat-lightbox";
import { useFavorites } from "@/hooks/use-favorites";
import { useCopy } from "@/hooks/use-copy";
import type { CatHead } from "@/lib/cats";

interface CatGridProps {
  cats: CatHead[];
}

export function CatGrid({ cats }: CatGridProps) {
  const copy = useCopy();
  const { has, toggle } = useFavorites();
  const [active, setActive] = useState<CatHead | null>(null);

  const handleToggle = (cat: CatHead) => {
    const added = toggle(cat.id, cat.label);
    toast(added ? copy.toast.favorited : copy.toast.unfavorited);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {cats.map((cat) => (
          <CatCard
            key={cat.id}
            cat={cat}
            isFavorite={has(cat.id)}
            onToggleFavorite={handleToggle}
            onPreview={setActive}
          />
        ))}
      </div>
      <CatLightbox cat={active} onClose={() => setActive(null)} />
    </>
  );
}
