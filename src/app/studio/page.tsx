"use client";

import Link from "next/link";
import { Check, Download, Dices, RotateCcw, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { toSvg } from "@/components/mascot/mascot-art";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/ui/color-input";
import { Input } from "@/components/ui/input";
import { PressArea } from "@/components/ui/press-area";
import { useCustomCats } from "@/hooks/use-custom-cats";
import { useCopy } from "@/hooks/use-copy";
import {
  ALL_ACCESSORIES,
  MASCOT_STATES,
  PALETTE_SLOTS,
  createEmptyDraft,
  createRandomDraft,
  type CustomCatDraft,
  type MascotAccessory,
  type MascotState,
  type PaletteSlot,
} from "@/lib/cats";

type AccessoryZone = "head" | "face" | "ear" | "neck";

const ACCESSORY_ZONE: Record<MascotAccessory, AccessoryZone> = {
  sunglasses: "face",
  glasses: "face",
  eyepatch: "face",
  mustache: "face",
  headphones: "head",
  crown: "head",
  cap: "head",
  headband: "head",
  "party-hat": "head",
  "wizard-hat": "head",
  flower: "ear",
  leaf: "ear",
  ribbon: "ear",
  bowtie: "neck",
  scarf: "neck",
  "gold-chain": "neck",
};

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
  const copy = useCopy();
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
      if (prev.accessories.includes(accessory)) {
        return {
          ...prev,
          accessories: prev.accessories.filter((item) => item !== accessory),
        };
      }

      const zone = ACCESSORY_ZONE[accessory];
      return {
        ...prev,
        accessories: [
          ...prev.accessories.filter((item) => ACCESSORY_ZONE[item] !== zone),
          accessory,
        ],
      };
    });
  };

  const svg = useMemo(
    () =>
      toSvg(draft.palette, {
        ariaLabel: draft.label || "custom cat",
        accessories: draft.accessories,
        state: draft.state,
      }),
    [draft],
  );

  return (
    <div className="flex flex-col gap-7 py-7 md:gap-10 md:py-12">
      <header className="section-rule max-w-2xl border-b pb-6 md:pb-8">
        <p className="playful-label font-mono text-[11px] tracking-[0.28em] uppercase">
          {copy.studio.stats}
        </p>
        <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          {copy.studio.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          {copy.studio.subtitle}
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 xl:gap-12">
        <div className="lg:sticky lg:top-24">
          <CatStage size="xl" className="min-h-[18rem] w-full sm:min-h-[24rem]">
            <span className="absolute top-4 left-4 z-20 rounded-full border border-primary/15 bg-card/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
              {copy.state[draft.state]} · {copy.studio.accessoryCount(draft.accessories.length)}
            </span>
            <Mascot
              size={256}
              state={draft.state}
              palette={draft.palette}
              accessories={draft.accessories}
              title={draft.label || "custom"}
              className="h-auto w-[min(62vw,16rem)]"
            />
          </CatStage>
          <div className="mt-3 flex items-center justify-between px-1 text-xs">
            <span className="text-muted-foreground">{copy.studio.livePreview}</span>
            <span className="font-semibold">{draft.label || copy.studio.unnamed}</span>
          </div>
        </div>

        <div className="gallery-panel flex flex-col gap-7 p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">{copy.studio.name}</label>
            <Input
              value={draft.label}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, label: event.target.value }))
              }
              placeholder={copy.studio.namePlaceholder}
              className="h-12 w-full bg-card"
            />
          </div>

          <section className="flex flex-col gap-3">
            <p className="text-sm font-bold">{copy.studio.colors}</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {PALETTE_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className="choice-tile flex cursor-pointer flex-col items-center gap-2 rounded-xl p-2 text-center sm:p-3"
                >
                  <ColorInput
                    value={toColorInputValue(draft.palette[slot])}
                    onChange={(event) => setPalette(slot, event.target.value)}
                  />
                  <span className="text-muted-foreground text-[11px]">
                    {copy.palette[slot]}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold">{copy.studio.accessories}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {copy.studio.accessoryHint}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              <AccessoryChoice
                label={copy.studio.noneAccessory}
                selected={draft.accessories.length === 0}
                palette={draft.palette}
                onClick={() =>
                  setDraft((prev) => ({ ...prev, accessories: [] }))
                }
              />
              {ALL_ACCESSORIES.map((accessory) => (
                <AccessoryChoice
                  key={accessory}
                  label={copy.accessory[accessory]}
                  selected={draft.accessories.includes(accessory)}
                  palette={draft.palette}
                  accessory={accessory}
                  onClick={() => toggleAccessory(accessory)}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="text-sm font-bold">{copy.studio.expression}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {MASCOT_STATES.map((state) => (
                <ExpressionChoice
                  key={state}
                  state={state}
                  selected={draft.state === state}
                  palette={draft.palette}
                  onClick={() => setDraft((prev) => ({ ...prev, state }))}
                />
              ))}
            </div>
          </section>

          <div className="section-rule grid grid-cols-2 gap-2 border-t pt-6 sm:flex sm:flex-wrap">
            <Button
              onClick={() => setDraft(createRandomDraft())}
              className="w-full sm:w-auto"
            >
              <Dices />
              {copy.studio.randomize}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDraft(createEmptyDraft())}
              className="w-full sm:w-auto"
            >
              <RotateCcw />
              {copy.studio.reset}
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                const cat = save({
                  label: draft.label,
                  palette: draft.palette,
                  accessories: draft.accessories,
                  state: draft.state,
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
              className="w-full sm:w-auto"
              onClick={() => {
                const slug = draft.label.trim() || "custom-cat";
                downloadSvg(`${slug}.svg`, svg);
                toast(copy.toast.exported);
              }}
            >
              <Download />
              {copy.studio.exportSvg}
            </Button>
            <Button
              variant="ghost"
              render={<Link href="/" />}
              nativeButton={false}
              className="col-span-2 w-full sm:w-auto"
            >
              <Sparkles />
              {copy.studio.goWall}
            </Button>
          </div>

          {savedLabel && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
            >
              <Check className="size-4" />
              {copy.toast.customSaved}：{savedLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AccessoryChoice({
  label,
  selected,
  palette,
  accessory,
  onClick,
}: {
  label: string;
  selected: boolean;
  palette: CustomCatDraft["palette"];
  accessory?: MascotAccessory;
  onClick: () => void;
}) {
  return (
    <PressArea
      aria-pressed={selected}
      onClick={onClick}
      className="choice-tile relative flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl p-2"
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-2.5" />
        </span>
      )}
      <Mascot
        size={54}
        palette={palette}
        accessories={accessory ? [accessory] : []}
        animated={false}
        title={label}
      />
      <span className="line-clamp-1 text-[11px] font-semibold">{label}</span>
    </PressArea>
  );
}

function ExpressionChoice({
  state,
  selected,
  palette,
  onClick,
}: {
  state: MascotState;
  selected: boolean;
  palette: CustomCatDraft["palette"];
  onClick: () => void;
}) {
  const copy = useCopy();
  return (
    <PressArea
      aria-pressed={selected}
      onClick={onClick}
      className="choice-tile relative flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl p-2"
    >
      <Mascot
        size={54}
        state={state}
        palette={palette}
        animated={false}
        title={copy.state[state]}
      />
      <span className="text-[11px] font-semibold">{copy.state[state]}</span>
    </PressArea>
  );
}

/** `<input type="color">` 只吃 #rrggbb */
function toColorInputValue(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#92A5C6";
}
