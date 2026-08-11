"use client";

import { useMemo, useState } from "react";
import { Search, Shuffle, X } from "lucide-react";

import { CatGrid } from "@/components/cat-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomCats } from "@/hooks/use-custom-cats";
import { useCopy } from "@/hooks/use-copy";
import { listWallCats, shuffleCats } from "@/lib/cats";
import { cn } from "@/lib/utils";

export function CatWall() {
  const copy = useCopy();
  const { customs } = useCustomCats();
  const base = useMemo(() => listWallCats(customs), [customs]);
  const [order, setOrder] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "builtin" | "custom">("all");

  const cats = useMemo(() => {
    if (!order) return base;
    const byId = new Map(base.map((cat) => [cat.id, cat]));
    const ordered = order
      .map((id) => byId.get(id))
      .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined);
    const missing = base.filter((cat) => !order.includes(cat.id));
    return [...ordered, ...missing];
  }, [base, order]);

  const visibleCats = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return cats.filter((cat) => {
      const matchesKind = filter === "all" || cat.kind === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        cat.label.toLocaleLowerCase().includes(normalizedQuery);
      return matchesKind && matchesQuery;
    });
  }, [cats, filter, query]);

  const hasFilters = query.trim().length > 0 || filter !== "all";

  return (
    <section className="flex flex-col gap-6 py-10 md:gap-8 md:py-14">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
            {copy.wall.eyebrow}
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
      <div className="gallery-panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.wall.searchPlaceholder}
            aria-label={copy.wall.searchPlaceholder}
            className="h-10 bg-card pl-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={copy.wall.clearFilters}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/70 p-1">
          {(
            [
              ["all", copy.wall.filterAll],
              ["builtin", copy.wall.filterBuiltin],
              ["custom", copy.wall.filterCustom],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                filter === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visibleCats.length > 0 ? (
        <CatGrid cats={visibleCats} />
      ) : (
        <div className="gallery-panel flex flex-col items-center gap-4 p-10 text-center">
          <p className="font-heading text-lg font-semibold">{copy.wall.noResults}</p>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              <X />
              {copy.wall.clearFilters}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
