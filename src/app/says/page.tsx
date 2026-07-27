"use client";

import { Heart, MessageCircle, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomCats } from "@/hooks/use-custom-cats";
import { useFavorites } from "@/hooks/use-favorites";
import {
  listBuiltinCats,
  pickRandomCat,
  type CatHead,
} from "@/lib/cats";
import { MAX_SAYS_LENGTH, copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export default function SaysPage() {
  const { customs } = useCustomCats();
  const pool = useMemo(
    () => [...customs, ...listBuiltinCats()],
    [customs],
  );
  const [text, setText] = useState("");
  const [spoken, setSpoken] = useState<string | null>(null);
  const [cat, setCat] = useState<CatHead>(() => listBuiltinCats()[0]!);
  const { has, toggle } = useFavorites();

  const trimmed = text.trim();
  const isTooLong = trimmed.length > MAX_SAYS_LENGTH;
  const canSubmit = trimmed.length > 0 && !isTooLong;
  const isFavorite = has(cat.id);

  return (
    <div className="flex flex-col gap-10 py-12">
      <header className="border-b border-white/10 pb-8">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
          Dialogue
        </p>
        <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          {copy.says.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm">
          {copy.says.subtitle}
        </p>
      </header>

      <div className="gallery-panel mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
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

      <CatStage size="lg" className="mx-auto w-full max-w-xl">
        <div className="relative flex flex-col items-center gap-4 pt-10">
          {spoken ? (
            <div className="gallery-enter absolute -top-1 left-1/2 z-10 max-w-[14rem] -translate-x-1/2 border border-white/20 bg-[oklch(0.18_0.01_80)] px-4 py-2 text-center text-sm font-medium">
              {spoken}
              <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-[oklch(0.18_0.01_80)]" />
            </div>
          ) : (
            <p className="text-muted-foreground absolute -top-1 font-mono text-xs tracking-widest uppercase">
              {copy.says.empty}
            </p>
          )}
          <Mascot
            size={200}
            state={spoken ? "thinking" : "idle"}
            palette={cat.palette}
            markings={cat.markings}
            accessories={cat.accessories}
            title={cat.label}
          />
          <p className="font-heading text-base font-medium tracking-wide">
            {cat.label}
          </p>
        </div>
      </CatStage>

      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setCat((prev) => pickRandomCat(pool, prev.id));
            setSpoken(null);
          }}
        >
          <Shuffle />
          {copy.says.pickCat}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const added = toggle(cat.id, cat.label);
            toast(added ? copy.toast.favorited : copy.toast.unfavorited);
          }}
        >
          <Heart className={cn(isFavorite && "fill-primary text-primary")} />
          {isFavorite ? copy.card.unfavorite : copy.card.favorite}
        </Button>
      </div>
    </div>
  );
}
