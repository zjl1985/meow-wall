"use client";

import Image from "next/image";
import { Dices, Heart, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CatParade } from "@/components/cat-parade";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRandomCat } from "@/hooks/use-cats";
import { useFavorites } from "@/hooks/use-favorites";
import { copy } from "@/lib/copy";
import { playMeow } from "@/lib/meow";
import { cn } from "@/lib/utils";

const PARADE_AT = 10;

export function CatHero() {
  const { cat, isLoading, error, roll, rollCount } = useRandomCat();
  const { has, toggle } = useFavorites();
  const [paradedAt, setParadedAt] = useState(0);

  // 每换满 10 只猫来一次猫猫大游行；同一个整十只放一次
  const showParade =
    rollCount > 0 && rollCount % PARADE_AT === 0 && paradedAt !== rollCount;

  // 空格 / R 换猫，但不抢输入框的按键
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

  const isFavorite = cat ? has(cat.id) : false;

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <h1 className="font-heading clay-text-shadow text-4xl font-extrabold tracking-tight">
          {copy.hero.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{copy.hero.hint}</p>
      </div>

      <div className="clay-surface relative aspect-square w-full max-w-md overflow-hidden">
        {(isLoading || !cat) && <Skeleton className="absolute inset-0" />}
        {cat && (
          <Image
            key={cat.id}
            src={cat.url}
            alt="今天的猫"
            fill
            sizes="448px"
            priority
            className={cn(
              "object-cover transition-opacity duration-500",
              isLoading ? "opacity-40" : "opacity-100",
            )}
          />
        )}
        {error && (
          <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-sm">
            <span className="text-4xl">🙈</span>
            {copy.error.title}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button size="lg" onClick={roll} disabled={isLoading}>
          <Dices />
          {isLoading ? copy.hero.rolling : copy.hero.roll}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          disabled={!cat}
          aria-label={isFavorite ? copy.card.unfavorite : copy.card.favorite}
          onClick={() => {
            if (!cat) return;
            const added = toggle(cat);
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
