"use client";

import Link from "next/link";
import { Dices, Heart, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CatParade } from "@/components/cat-parade";
import { CatStage } from "@/components/cat-stage";
import { HeroSpecialEffect } from "@/components/hero-special-effect";
import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { useRandomCat } from "@/hooks/use-cats";
import { useFavorites } from "@/hooks/use-favorites";
import { useCopy } from "@/hooks/use-copy";
import { playMeow } from "@/lib/meow";
import { getHeroSpecialEffect } from "@/lib/special-effects";
import { cn } from "@/lib/utils";

const PARADE_AT = 10;

export function CatHero() {
  const copy = useCopy();
  const { cat, state, roll, rollCount } = useRandomCat();
  const { has, toggle } = useFavorites();
  const [paradedAt, setParadedAt] = useState(0);

  const showParade =
    rollCount > 0 && rollCount % PARADE_AT === 0 && paradedAt !== rollCount;
  const isFavorite = has(cat.id);
  const specialEffect = rollCount > 0 ? getHeroSpecialEffect(cat.id) : null;

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
    <section className="section-rule gallery-enter grid items-center gap-7 border-b py-8 md:gap-10 md:py-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:py-16">
      <div className="order-2 flex flex-col gap-5 lg:order-1">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
          {copy.hero.eyebrow}
        </p>
        <h1 className="font-heading max-w-xl text-[2.75rem] leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl md:text-7xl">
          {copy.hero.title}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">
          {copy.hero.hint}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:flex-wrap sm:items-center">
          <Button size="lg" onClick={roll} className="w-full sm:w-auto">
            <Dices />
            {copy.hero.roll}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              const added = toggle(cat.id, cat.label);
              toast(added ? copy.toast.favorited : copy.toast.unfavorited);
            }}
          >
            <Heart
              className={cn(isFavorite && "fill-primary text-primary")}
            />
            {isFavorite ? copy.card.unfavorite : copy.card.favorite}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            aria-label={copy.easterEgg.sound}
            onClick={playMeow}
            className="sm:px-4"
          >
            <Volume2 />
            <span className="sm:hidden">{copy.easterEgg.sound}</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/studio" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            <Sparkles />
            {copy.hero.makeOne}
          </Button>
        </div>

        <div className="text-muted-foreground flex items-center gap-3 font-mono text-xs tracking-wide uppercase">
          <span className="text-foreground">{cat.label}</span>
          <span>/</span>
          <span>{copy.state[state]}</span>
          {rollCount > 1 && (
            <>
              <span>/</span>
              <span>{copy.hero.rollCount(rollCount)}</span>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={roll}
        aria-label={`${copy.hero.tapCat}：${cat.label}`}
        className="press-feedback relative order-1 block w-full cursor-pointer overflow-hidden rounded-[var(--radius-lg)] text-left focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:outline-none lg:order-2"
      >
        <CatStage
          size="xl"
          className={cn(
            "min-h-[19rem] w-full sm:min-h-[24rem]",
            specialEffect && `hero-stage--${specialEffect}`,
          )}
        >
          <span className="absolute top-4 right-4 z-20 rounded-full border border-primary/15 bg-card/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            {copy.hero.tapCat} ↻
          </span>
          <div
            className={cn(
              "relative z-10",
              specialEffect && `hero-cat--${specialEffect}`,
            )}
          >
            <Mascot
              key={`${cat.id}-${state}-${rollCount}`}
              size={256}
              state={state}
              palette={cat.palette}
              markings={cat.markings}
              accessories={cat.accessories}
              title={cat.label}
              className="h-auto w-[min(58vw,16rem)]"
            />
          </div>
        </CatStage>
        {specialEffect && (
          <HeroSpecialEffect
            key={`${specialEffect}-${rollCount}`}
            effect={specialEffect}
          />
        )}
      </button>

      {showParade && <CatParade onDone={() => setParadedAt(rollCount)} />}
    </section>
  );
}
