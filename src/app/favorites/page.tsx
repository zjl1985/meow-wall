"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { CatGrid } from "@/components/cat-grid";
import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomCats } from "@/hooks/use-custom-cats";
import { useCopy } from "@/hooks/use-copy";
import { useFavorites } from "@/hooks/use-favorites";
import { getBuiltinCat } from "@/lib/cats";
import { DEFAULT_PALETTE } from "@/components/mascot/mascot-art";

export default function FavoritesPage() {
  const copy = useCopy();
  const { favorites, isHydrated, clear } = useFavorites();
  const { customs } = useCustomCats();

  const cats = useMemo(() => {
    return favorites.flatMap((item) => {
      const builtin = getBuiltinCat(item.id);
      if (builtin) return [builtin];
      const custom = customs.find((cat) => cat.id === item.id);
      return custom ? [custom] : [];
    });
  }, [favorites, customs]);

  return (
    <div className="flex flex-col gap-7 py-7 md:gap-10 md:py-12">
      <header className="section-rule flex items-end justify-between gap-4 border-b pb-6 md:pb-8">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
            Collection
          </p>
          <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {copy.favorites.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {copy.favorites.subtitle(favorites.length)}
          </p>
        </div>
        {favorites.length > 0 && (
          <Button
            variant="outline"
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      )}

      {isHydrated && cats.length === 0 && (
        <div className="gallery-panel flex flex-col items-center gap-5 p-8 text-center sm:p-16">
          <Mascot size={96} state="sleeping" palette={DEFAULT_PALETTE} title="empty" />
          <p className="font-heading text-xl font-semibold">{copy.favorites.empty}</p>
          <p className="text-muted-foreground text-sm">{copy.favorites.emptyHint}</p>
          <div className="flex gap-3">
            <Button render={<Link href="/" />} nativeButton={false}>
              {copy.favorites.goWall}
            </Button>
            <Button
              variant="outline"
              render={<Link href="/studio" />}
              nativeButton={false}
            >
              {copy.favorites.goStudio}
            </Button>
          </div>
        </div>
      )}

      {isHydrated && cats.length > 0 && <CatGrid cats={cats} />}
    </div>
  );
}
