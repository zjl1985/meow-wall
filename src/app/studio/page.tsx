"use client";

import Link from "next/link";
import { Download, Dices, RotateCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { toSvg } from "@/components/mascot/mascot-art";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/ui/color-input";
import { Input } from "@/components/ui/input";
import { useCustomCats } from "@/hooks/use-custom-cats";
import {
  ALL_ACCESSORIES,
  MASCOT_STATES,
  PALETTE_SLOTS,
  createEmptyDraft,
  createRandomDraft,
  type CustomCatDraft,
  type MascotAccessory,
  type PaletteSlot,
} from "@/lib/cats";
import { copy } from "@/lib/copy";

function downloadSvg(filename: string, content: string) {
  const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function StudioPage() {
  const [draft, setDraft] = useState<CustomCatDraft>(() => createEmptyDraft());
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const { save } = useCustomCats();

  const setPalette = (slot: PaletteSlot, value: string) => {
    setDraft((prev) => ({
      ...prev,
      palette: { ...prev.palette, [slot]: value },
    }));
  };

  const toggleAccessory = (accessory: MascotAccessory) => {
    setDraft((prev) => {
      const exists = prev.accessories.includes(accessory);
      return {
        ...prev,
        accessories: exists
          ? prev.accessories.filter((item) => item !== accessory)
          : [...prev.accessories, accessory],
      };
    });
  };

  const svg = useMemo(
    () =>
      toSvg(draft.palette, {
        ariaLabel: draft.label || "custom cat",
        accessories: draft.accessories,
      }),
    [draft],
  );

  return (
    <div className="flex flex-col gap-10 py-12">
      <header className="max-w-2xl border-b border-white/10 pb-8">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.28em] uppercase">
          Workshop
        </p>
        <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          {copy.studio.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{copy.studio.subtitle}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <CatStage size="xl" className="w-full">
          <Mascot
            size={280}
            state={draft.state}
            palette={draft.palette}
            accessories={draft.accessories}
            title={draft.label || "custom"}
          />
        </CatStage>

        <div className="gallery-panel flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">{copy.studio.name}</label>
            <Input
              value={draft.label}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, label: event.target.value }))
              }
              placeholder={copy.studio.namePlaceholder}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">{copy.studio.colors}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PALETTE_SLOTS.map((slot) => (
                <label key={slot} className="flex flex-col items-start gap-2">
                  <span className="text-muted-foreground text-xs">
                    {copy.palette[slot]}
                  </span>
                  <ColorInput
                    value={toColorInputValue(draft.palette[slot])}
                    onChange={(event) => setPalette(slot, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">{copy.studio.accessories}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={draft.accessories.length === 0 ? "default" : "secondary"}
                onClick={() =>
                  setDraft((prev) => ({ ...prev, accessories: [] }))
                }
              >
                {copy.studio.noneAccessory}
              </Button>
              {ALL_ACCESSORIES.map((accessory) => (
                <Button
                  key={accessory}
                  size="sm"
                  variant={
                    draft.accessories.includes(accessory)
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => toggleAccessory(accessory)}
                >
                  {copy.accessory[accessory]}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">{copy.studio.expression}</p>
            <div className="flex flex-wrap gap-2">
              {MASCOT_STATES.map((state) => (
                <Button
                  key={state}
                  size="sm"
                  variant={draft.state === state ? "default" : "secondary"}
                  onClick={() => setDraft((prev) => ({ ...prev, state }))}
                >
                  {copy.state[state]}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => setDraft(createRandomDraft())}>
              <Dices />
              {copy.studio.randomize}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDraft(createEmptyDraft())}
            >
              <RotateCcw />
              {copy.studio.reset}
            </Button>
            <Button
              onClick={() => {
                const cat = save({
                  label: draft.label,
                  palette: draft.palette,
                  accessories: draft.accessories,
                });
                setSavedLabel(cat.label);
                toast.success(copy.toast.customSaved);
                setDraft((prev) => ({ ...prev, label: cat.label }));
              }}
            >
              <Save />
              {copy.studio.save}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const slug = draft.label.trim() || "custom-cat";
                downloadSvg(`${slug}.svg`, svg);
                toast(copy.toast.exported);
              }}
            >
              <Download />
              {copy.studio.exportSvg}
            </Button>
            <Button variant="ghost" render={<Link href="/" />}>
              {copy.nav.wall}
            </Button>
          </div>

          {savedLabel && (
            <p role="status" className="text-primary text-sm font-semibold">
              {copy.toast.customSaved}：{savedLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** `<input type="color">` 只吃 #rrggbb */
function toColorInputValue(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#92A5C6";
}
