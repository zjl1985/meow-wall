"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CatCard } from "@/components/cat-card";
import { CatLightbox } from "@/components/cat-lightbox";
import { useFavorites } from "@/hooks/use-favorites";
import type { CatHead } from "@/lib/cats";
import { copy } from "@/lib/copy";

interface CatGridProps {
  cats: CatHead[];
}

export function CatGrid({ cats }: CatGridProps) {
  const { has, toggle } = useFavorites();
  const [active, setActive] = useState<CatHead | null>(null);

  const handleToggle = (id: string) => {
    const added = toggle(id);
    toast(added ? copy.toast.favorited : copy.toast.unfavorited);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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
