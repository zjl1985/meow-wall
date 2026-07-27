"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";

import { CatGrid } from "@/components/cat-grid";
import { Button } from "@/components/ui/button";
import { useCustomCats } from "@/hooks/use-custom-cats";
import { listWallCats, shuffleCats } from "@/lib/cats";
import { copy } from "@/lib/copy";

export function CatWall() {
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
    <section className="flex flex-col gap-8 py-14">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
            Archive / 03
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {copy.wall.title}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {copy.wall.subtitle(cats.length, customs.length)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setOrder(shuffleCats(base).map((cat) => cat.id))}
          className="shrink-0"
        >
          <Shuffle />
          {copy.wall.reshuffle}
        </Button>
      </header>
      <CatGrid cats={cats} />
    </section>
  );
}
