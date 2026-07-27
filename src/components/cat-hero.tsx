"use client";

import Link from "next/link";
import { Dices, Heart, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CatParade } from "@/components/cat-parade";
import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
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
    <section className="grid items-center gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-5">
        <p className="text-primary text-xs font-bold tracking-[0.22em]">
          {copy.hero.eyebrow}
        </p>
        <h1 className="font-heading clay-text-shadow text-5xl leading-tight font-extrabold tracking-tight">
          {copy.hero.title}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          {copy.hero.hint}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={roll}>
            <Dices />
            {copy.hero.roll}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              const added = toggle(cat.id, cat.label);
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
          <Button size="lg" variant="outline" render={<Link href="/studio" />}>
            <Sparkles />
            {copy.hero.makeOne}
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-heading text-lg font-bold">{cat.label}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{copy.state[state]}</span>
          {rollCount > 1 && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {copy.hero.rollCount(rollCount)}
              </span>
            </>
          )}
        </div>
      </div>

      <CatStage size="xl" className="clay-enter w-full">
        <Mascot
          key={`${cat.id}-${state}-${rollCount}`}
          size={280}
          state={state}
          palette={cat.palette}
          markings={cat.markings}
          accessories={cat.accessories}
          title={cat.label}
        />
      </CatStage>

      {showParade && <CatParade onDone={() => setParadedAt(rollCount)} />}
    </section>
  );
}
