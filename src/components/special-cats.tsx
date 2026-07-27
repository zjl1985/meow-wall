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
    <section className="flex flex-col gap-6">
      <header>
        <p className="text-primary text-xs font-bold tracking-[0.2em]">
          EASTER EGGS
        </p>
        <h2 className="font-heading clay-text-shadow mt-1 text-3xl font-extrabold">
          {copy.specials.title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {copy.specials.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cats.map((cat) => (
          <div key={cat.id} className="clay-surface clay-pop group relative p-3">
            <Badge className="absolute top-3 left-3 z-10">
              {copy.card.specialBadge}
            </Badge>
            <PressArea
              className="w-full text-left"
              onClick={() => setActive(cat)}
              aria-label={`${copy.card.preview}：${cat.label}`}
            >
              <CatStage size="sm" className="!rounded-2xl shadow-none">
                <Mascot
                  size={96}
                  state="idle"
                  palette={cat.palette}
                  markings={cat.markings}
                  accessories={cat.accessories}
                  title={cat.label}
                />
              </CatStage>
              <p className="font-heading mt-3 text-center text-base font-bold">
                {cat.label}
              </p>
            </PressArea>
            <div className="mt-2 flex justify-center">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const added = toggle(cat.id, cat.label);
                  toast(added ? copy.toast.favorited : copy.toast.unfavorited);
                }}
              >
                <Heart
                  className={cn(
                    has(cat.id) && "fill-destructive text-destructive",
                  )}
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
