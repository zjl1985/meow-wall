"use client";

import { Dices, Heart, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CatParade } from "@/components/cat-parade";
import { Mascot } from "@/components/mascot/mascot";
import { CAT_VARIANTS } from "@/components/mascot/mascot-art";
import { Button } from "@/components/ui/button";
import { useRandomCat } from "@/hooks/use-cats";
import { useFavorites } from "@/hooks/use-favorites";
import { copy } from "@/lib/copy";
import { playMeow } from "@/lib/meow";
import { cn } from "@/lib/utils";

const PARADE_AT = 10;

export function CatHero() {
  const { cat, state, roll, rollCount } = useRandomCat();
  const { has, toggle } = useFavorites();
  const [paradedAt, setParadedAt] = useState(0);

  const showParade =
    rollCount > 0 && rollCount % PARADE_AT === 0 && paradedAt !== rollCount;
  const isFavorite = has(cat.id);
  const palette = CAT_VARIANTS.find((variant) => variant.id === cat.id)?.palette;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.key === " " || event.key.toLowerCase() === "r") {
        event.preventDefault();
        roll();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [roll]);

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <h1 className="font-heading clay-text-shadow text-4xl font-extrabold tracking-tight">
          {copy.hero.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{copy.hero.hint}</p>
      </div>

      <div className="clay-surface flex aspect-square w-full max-w-md items-center justify-center">
        <Mascot
          key={`${cat.id}-${state}-${rollCount}`}
          size={260}
          state={state}
          palette={palette}
          markings={cat.markings}
          accessories={cat.accessories}
          title={cat.label}
          className="clay-enter"
        />
      </div>

      <div className="text-center">
        <p className="font-heading text-xl font-bold">{cat.label}</p>
        <p className="text-muted-foreground text-sm">{copy.state[state]}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button size="lg" onClick={roll}>
          <Dices />
          {copy.hero.roll}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          aria-label={isFavorite ? copy.card.unfavorite : copy.card.favorite}
          onClick={() => {
            const added = toggle(cat.id);
            toast(added ? copy.toast.favorited : copy.toast.unfavorited);
          }}
        >
          <Heart
            className={cn(isFavorite && "fill-destructive text-destructive")}
          />
          {isFavorite ? copy.card.unfavorite : copy.card.favorite}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          aria-label={copy.easterEgg.sound}
          onClick={playMeow}
        >
          <Volume2 />
        </Button>
      </div>

      {rollCount > 1 && (
        <p className="text-muted-foreground text-xs">
          {copy.hero.rollCount(rollCount)}
        </p>
      )}

      {showParade && <CatParade onDone={() => setParadedAt(rollCount)} />}
    </section>
  );
}
