"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";

import { CatGrid } from "@/components/cat-grid";
import { Button } from "@/components/ui/button";
import { useCustomCats } from "@/hooks/use-custom-cats";
import { useCopy } from "@/hooks/use-copy";
import { listWallCats, shuffleCats } from "@/lib/cats";

export function CatWall() {
  const copy = useCopy();
  const { customs } = useCustomCats();
  const base = useMemo(() => listWallCats(customs), [customs]);
  const [order, setOrder] = useState<string[] | null>(null);

  const cats = useMemo(() => {
    if (!order) return base;
    const byId = new Map(base.map((cat) => [cat.id, cat]));
    const ordered = order
      .map((id) => byId.get(id))
      .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined);
    const missing = base.filter((cat) => !order.includes(cat.id));
    return [...ordered, ...missing];
  }, [base, order]);

  return (
    <section className="flex flex-col gap-6 py-10 md:gap-8 md:py-14">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
            Archive / 03
          </p>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {copy.wall.title}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {copy.wall.subtitle(cats.length, customs.length)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setOrder(shuffleCats(base).map((cat) => cat.id))}
          className="shrink-0 px-3 sm:px-4"
        >
          <Shuffle />
          {copy.wall.reshuffle}
        </Button>
      </header>
      <CatGrid cats={cats} />
    </section>
  );
}
