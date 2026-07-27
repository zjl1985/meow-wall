"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CatGrid } from "@/components/cat-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { getCatHead } from "@/lib/cats";
import { copy } from "@/lib/copy";

export default function FavoritesPage() {
  const { favorites, isHydrated, clear } = useFavorites();
  const cats = favorites
    .map((item) => getCatHead(item.id))
    .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined);

  return (
    <div className="flex flex-col gap-8 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading clay-text-shadow text-4xl font-extrabold">
            {copy.favorites.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {copy.favorites.subtitle(favorites.length)}
          </p>
        </div>
        {favorites.length > 0 && (
          <Button
            variant="secondary"
            className="shrink-0"
            onClick={() => {
              clear();
              toast(copy.toast.cleared);
            }}
          >
            <Trash2 />
            {copy.favorites.clear}
          </Button>
        )}
      </header>

      {!isHydrated && (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="rounded-3xl aspect-square w-full" />
          ))}
        </div>
      )}

      {isHydrated && cats.length === 0 && (
        <div className="clay-surface flex flex-col items-center gap-4 p-16 text-center">
          <span className="clay-wiggle text-6xl">😿</span>
          <p className="text-lg font-semibold">{copy.favorites.empty}</p>
          <p className="text-muted-foreground text-sm">
            {copy.favorites.emptyHint}
          </p>
          <Button render={<Link href="/" />}>{copy.favorites.goWall}</Button>
        </div>
      )}

      {isHydrated && cats.length > 0 && <CatGrid cats={cats} />}
    </div>
  );
}
