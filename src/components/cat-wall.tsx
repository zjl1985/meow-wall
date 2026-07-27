"use client";

import { useEffect, useRef } from "react";

import { CatGrid } from "@/components/cat-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCats } from "@/hooks/use-cats";
import { copy } from "@/lib/copy";

const BATCH_SIZE = 12;

export function CatWall() {
  const { cats, isLoading, error, loadMore, reset } = useCats(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (error && cats.length === 0) {
    return (
      <div className="clay-surface flex flex-col items-center gap-4 p-12 text-center">
        <span className="text-5xl">🙈</span>
        <p className="text-lg font-semibold">{copy.error.title}</p>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button onClick={reset}>{copy.error.retry}</Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading clay-text-shadow text-3xl font-extrabold">
            {copy.wall.title}
          </h2>
          <p className="text-muted-foreground text-sm">{copy.wall.subtitle}</p>
        </div>
        <Button onClick={loadMore} disabled={isLoading} className="shrink-0">
          {isLoading ? copy.wall.loading : copy.wall.loadMore}
        </Button>
      </header>

      <CatGrid cats={cats} />

      {isLoading && (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: BATCH_SIZE }, (_, index) => (
            <Skeleton
              key={index}
              className="rounded-3xl aspect-square w-full"
            />
          ))}
        </div>
      )}

      <div ref={sentinelRef} aria-hidden className="h-1" />
    </section>
  );
}
