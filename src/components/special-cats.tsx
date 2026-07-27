"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CatLightbox } from "@/components/cat-lightbox";
import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PressArea } from "@/components/ui/press-area";
import { useFavorites } from "@/hooks/use-favorites";
import { listSpecialCats, type CatHead } from "@/lib/cats";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function SpecialCats() {
  const cats = listSpecialCats();
  const { has, toggle } = useFavorites();
  const [active, setActive] = useState<CatHead | null>(null);

  return (
    <section className="flex flex-col gap-8 border-b border-white/10 py-14">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
            Selected / 02
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {copy.specials.title}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm">
          {copy.specials.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="gallery-panel gallery-lift group relative p-3"
          >
            <Badge
              variant="outline"
              className="absolute top-3 left-3 z-10 border-white/20 bg-black/30"
            >
              {copy.card.specialBadge}
            </Badge>
            <PressArea
              className="w-full text-left"
              onClick={() => setActive(cat)}
              aria-label={`${copy.card.preview}：${cat.label}`}
            >
              <CatStage size="sm" className="w-full border-0! bg-transparent shadow-none">
                <Mascot
                  size={96}
                  state="idle"
                  palette={cat.palette}
                  markings={cat.markings}
                  accessories={cat.accessories}
                  title={cat.label}
                />
              </CatStage>
              <p className="font-heading mt-4 text-center text-sm font-medium tracking-wide">
                {cat.label}
              </p>
            </PressArea>
            <div className="mt-3 flex justify-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const added = toggle(cat.id, cat.label);
                  toast(added ? copy.toast.favorited : copy.toast.unfavorited);
                }}
              >
                <Heart
                  className={cn(has(cat.id) && "fill-primary text-primary")}
                />
                {has(cat.id) ? copy.card.unfavorite : copy.card.favorite}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CatLightbox cat={active} onClose={() => setActive(null)} />
    </section>
  );
}
