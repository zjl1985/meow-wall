"use client";

import Image from "next/image";
import { Download, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_SAYS_LENGTH } from "@/lib/cat-source";
import { copy } from "@/lib/copy";
import type { ApiResponse, CatImage } from "@/lib/types";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export default function SaysPage() {
  const [text, setText] = useState("");
  const [cat, setCat] = useState<CatImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { has, toggle } = useFavorites();

  const trimmed = text.trim();
  const isTooLong = trimmed.length > MAX_SAYS_LENGTH;
  const canSubmit = trimmed.length > 0 && !isTooLong && !isLoading;

  const generate = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/cats/says?text=${encodeURIComponent(value)}`,
      );
      const payload = (await response.json()) as ApiResponse<CatImage>;
      if (!payload.success) throw new Error(payload.error);
      setCat(payload.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.error.title);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = cat ? has(cat.id) : false;

  return (
    <div className="flex flex-col gap-8 py-10">
      <header className="text-center">
        <h1 className="font-heading clay-text-shadow text-4xl font-extrabold">
          {copy.says.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {copy.says.subtitle}
        </p>
      </header>

      <div className="clay-surface mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canSubmit) void generate(trimmed);
            }}
            placeholder={copy.says.placeholder}
            className="w-full"
          />
          <Button
            onClick={() => void generate(trimmed)}
            disabled={!canSubmit}
            className="shrink-0"
          >
            <Sparkles />
            {isLoading ? copy.says.generating : copy.says.submit}
          </Button>
        </div>

        {isTooLong && (
          <p className="text-destructive text-xs">
            {copy.says.tooLong(MAX_SAYS_LENGTH)}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {copy.says.presets.map((preset) => (
            <Button
              key={preset}
              variant="secondary"
              size="sm"
              onClick={() => {
                setText(preset);
                void generate(preset);
              }}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "clay-surface mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden",
          // 没出图时不占一整个正方形，免得页面上挂着一大块空白
          cat && !error && !isLoading ? "aspect-square" : "h-56",
        )}
      >
        {isLoading && <Skeleton className="h-full w-full" />}
        {!isLoading && !cat && !error && (
          <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm">
            <span className="clay-wiggle text-5xl">🐱</span>
            {copy.says.empty}
          </div>
        )}
        {!isLoading && error && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
            <span className="text-4xl">🙈</span>
            {error}
          </div>
        )}
        {!isLoading && cat && !error && (
          <div className="clay-enter relative h-full w-full">
            <Image
              key={cat.id}
              src={cat.url}
              alt={`猫说：${trimmed}`}
              fill
              sizes="576px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {cat && !error && (
        <div className="flex justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
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
            variant="secondary"
            render={
              <a
                href={`/api/cats/download?url=${encodeURIComponent(cat.url)}`}
              />
            }
          >
            <Download />
            {copy.card.download}
          </Button>
        </div>
      )}
    </div>
  );
}
