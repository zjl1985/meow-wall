"use client";

import { Heart, MessageCircle, Shuffle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Mascot } from "@/components/mascot/mascot";
import { CAT_VARIANTS } from "@/components/mascot/mascot-art";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pickRandomCat, type CatHead } from "@/lib/cats";
import { MAX_SAYS_LENGTH, copy } from "@/lib/copy";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export default function SaysPage() {
  const [text, setText] = useState("");
  const [spoken, setSpoken] = useState<string | null>(null);
  const [cat, setCat] = useState<CatHead>(() => pickRandomCat());
  const { has, toggle } = useFavorites();

  const trimmed = text.trim();
  const isTooLong = trimmed.length > MAX_SAYS_LENGTH;
  const canSubmit = trimmed.length > 0 && !isTooLong;
  const palette = CAT_VARIANTS.find((variant) => variant.id === cat.id)?.palette;
  const isFavorite = has(cat.id);

  return (
    <div className="flex flex-col gap-8 py-10">
      <header className="text-center">
        <h1 className="font-heading clay-text-shadow text-4xl font-extrabold">
          {copy.says.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{copy.says.subtitle}</p>
      </header>

      <div className="clay-surface mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canSubmit) setSpoken(trimmed);
            }}
            placeholder={copy.says.placeholder}
            className="w-full"
          />
          <Button
            onClick={() => setSpoken(trimmed)}
            disabled={!canSubmit}
            className="shrink-0"
          >
            <MessageCircle />
            {copy.says.submit}
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
                setSpoken(preset);
              }}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <div className="clay-surface mx-auto flex w-full max-w-xl flex-col items-center gap-6 p-10">
        <div className="relative flex items-start justify-center pt-10">
          {spoken ? (
            <div className="clay-enter absolute -top-2 left-1/2 z-10 max-w-[14rem] -translate-x-1/2 rounded-2xl border-2 border-[oklch(0.26_0.04_45)] bg-white px-4 py-2 text-center text-sm font-semibold shadow-[0_4px_0_oklch(0.75_0.09_55_/_0.25)]">
              {spoken}
              <span className="absolute -bottom-2 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-[oklch(0.26_0.04_45)] bg-white" />
            </div>
          ) : (
            <p className="text-muted-foreground absolute -top-2 text-sm">
              {copy.says.empty}
            </p>
          )}
          <Mascot
            size={200}
            state={spoken ? "thinking" : "idle"}
            palette={palette}
            markings={cat.markings}
            accessories={cat.accessories}
            title={cat.label}
          />
        </div>
        <p className="font-heading text-lg font-bold">{cat.label}</p>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            setCat((prev) => pickRandomCat(prev.id));
            setSpoken(null);
          }}
        >
          <Shuffle />
          {copy.says.pickCat}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const added = toggle(cat.id);
            toast(added ? copy.toast.favorited : copy.toast.unfavorited);
          }}
        >
          <Heart
            className={cn(isFavorite && "fill-destructive text-destructive")}
          />
          {isFavorite ? copy.card.unfavorite : copy.card.favorite}
        </Button>
      </div>
    </div>
  );
}
