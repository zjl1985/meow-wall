"use client";

import { Shuffle } from "lucide-react";

import { CatGrid } from "@/components/cat-grid";
import { Button } from "@/components/ui/button";
import { useCatWall } from "@/hooks/use-cats";
import { copy } from "@/lib/copy";

export function CatWall() {
  const { cats, reshuffle, total } = useCatWall();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading clay-text-shadow text-3xl font-extrabold">
            {copy.wall.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {copy.wall.subtitle(total)}
          </p>
        </div>
        <Button onClick={reshuffle} className="shrink-0">
          <Shuffle />
          {copy.wall.reshuffle}
        </Button>
      </header>
      <CatGrid cats={cats} />
    </section>
  );
}
