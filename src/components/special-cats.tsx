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
import { useCopy } from "@/hooks/use-copy";
import { listSpecialCats, type CatHead } from "@/lib/cats";
import { cn } from "@/lib/utils";

export function SpecialCats() {
  const copy = useCopy();
  const cats = listSpecialCats();
  const { has, toggle } = useFavorites();
  const [active, setActive] = useState<CatHead | null>(null);

  return (
    <section className="section-rule flex flex-col gap-6 border-b py-10 md:gap-8 md:py-14">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
            {copy.specials.eyebrow}
          </p>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {copy.specials.title}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm">
          {copy.specials.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="gallery-panel gallery-lift group relative p-2.5 sm:p-3"
          >
            <Badge
              variant="outline"
              className="absolute top-3 left-3 z-10 border-primary/15 bg-card/80 text-primary"
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
            <div className="absolute top-2.5 right-2.5 z-10 sm:top-3 sm:right-3">
              <Button
                size="icon"
                variant="secondary"
                aria-label={has(cat.id) ? copy.card.unfavorite : copy.card.favorite}
                onClick={() => {
                  const added = toggle(cat.id, cat.label);
                  toast(added ? copy.toast.favorited : copy.toast.unfavorited);
                }}
              >
                <Heart
                  className={cn(has(cat.id) && "fill-primary text-primary")}
                />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CatLightbox cat={active} onClose={() => setActive(null)} />
    </section>
  );
}
