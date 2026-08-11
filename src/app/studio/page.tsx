"use client";

import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  Dices,
  FileDown,
  Pencil,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { toSvg } from "@/components/mascot/mascot-art";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { downloadFile, safeFilename } from "@/lib/share-card";
import { cn } from "@/lib/utils";

type AccessoryZone = "head" | "face" | "ear" | "neck";
const ACCESSORY_ZONES = ["head", "face", "ear", "neck"] as const;

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accessoryZone, setAccessoryZone] = useState<AccessoryZone | "all">("head");
  const [showCompactPreview, setShowCompactPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { customs, save, update, remove, exportBackup, importBackup } =
    useCustomCats();

  const resetEditor = () => {
    setDraft(createEmptyDraft());
    setEditingId(null);
    setSavedLabel(null);
  };

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

  const visibleAccessories = useMemo(
    () =>
      accessoryZone === "all"
        ? ALL_ACCESSORIES
        : ALL_ACCESSORIES.filter(
            (accessory) => ACCESSORY_ZONE[accessory] === accessoryZone,
          ),
    [accessoryZone],
  );

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setShowCompactPreview(
          !entry.isIntersecting && entry.boundingClientRect.bottom < 72,
        );
      },
      { rootMargin: "-72px 0px 0px" },
    );
    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-7 py-7 md:gap-10 md:py-12">
      {showCompactPreview && (
        <div
          aria-hidden="true"
          className="gallery-panel pointer-events-none fixed top-[4.75rem] right-4 left-4 z-30 flex items-center gap-3 px-3 py-2 shadow-lg lg:hidden"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary/70">
            <Mascot
              size={54}
              state={draft.state}
              palette={draft.palette}
              accessories={draft.accessories}
              animated={false}
              title=""
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-semibold">
              {draft.label || copy.studio.unnamed}
            </p>
            <p className="text-muted-foreground text-xs">
              {copy.state[draft.state]} · {copy.studio.accessoryCount(draft.accessories.length)}
            </p>
          </div>
          <span className="playful-label text-[10px] font-bold tracking-wider uppercase">
            {copy.studio.livePreview}
          </span>
        </div>
      )}
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
        <div ref={previewRef} className="lg:sticky lg:top-24">
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
            <div className="grid grid-cols-5 gap-1 rounded-xl bg-muted/70 p-1">
              {(
                [...ACCESSORY_ZONES, "all"] as const
              ).map((zone) => {
                const selectedCount =
                  zone === "all"
                    ? draft.accessories.length
                    : draft.accessories.filter(
                        (accessory) => ACCESSORY_ZONE[accessory] === zone,
                      ).length;
                return (
                  <button
                    key={zone}
                    type="button"
                    aria-pressed={accessoryZone === zone}
                    onClick={() => setAccessoryZone(zone)}
                    className={cn(
                      "relative rounded-lg px-1 py-2 text-[11px] font-semibold transition-colors",
                      accessoryZone === zone
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground",
                    )}
                  >
                    {copy.studio.accessoryZones[zone]}
                    {selectedCount > 0 && (
                      <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
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
              {visibleAccessories.map((accessory) => (
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
              onClick={resetEditor}
              className="w-full sm:w-auto"
            >
              <RotateCcw />
              {copy.studio.reset}
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                const input = {
                  label: draft.label,
                  palette: draft.palette,
                  accessories: draft.accessories,
                  state: draft.state,
                };
                const cat = editingId ? update(editingId, input) : save(input);
                if (!cat) return;
                setSavedLabel(cat.label);
                toast.success(
                  editingId ? copy.toast.customUpdated : copy.toast.customSaved,
                );
                setDraft((prev) => ({ ...prev, label: cat.label }));
              }}
            >
              <Save />
              {editingId ? copy.studio.update : copy.studio.save}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={resetEditor}
              >
                <X />
                {copy.studio.cancelEdit}
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                const slug = safeFilename(draft.label, "custom-cat");
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

      <section className="section-rule flex flex-col gap-5 border-t pt-8 md:pt-10">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {copy.studio.myCats}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {copy.studio.myCatsHint}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={customs.length === 0}
              onClick={() => {
                const file = new File([exportBackup()], "meow-wall-cats.json", {
                  type: "application/json",
                });
                downloadFile(file);
                toast(copy.toast.backupExported);
              }}
            >
              <FileDown />
              {copy.studio.exportBackup}
            </Button>
            <label
              className={cn(
                buttonVariants({ variant: "outline" }),
                "cursor-pointer",
              )}
            >
              <Upload />
              {copy.studio.importBackup}
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  if (!file) return;
                  void file
                    .text()
                    .then((raw) => {
                      const count = importBackup(raw);
                      toast.success(copy.toast.backupImported(count));
                    })
                    .catch(() => toast.error(copy.toast.backupInvalid))
                    .finally(() => {
                      input.value = "";
                    });
                }}
              />
            </label>
          </div>
        </header>

        {customs.length === 0 ? (
          <div className="gallery-panel p-8 text-center text-sm text-muted-foreground">
            {copy.favorites.emptyHint}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customs.map((cat) => (
              <div
                key={cat.id}
                className="gallery-panel flex items-center gap-3 p-3"
              >
                <div className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-secondary/60">
                  <Mascot
                    size={86}
                    palette={cat.palette}
                    accessories={cat.accessories}
                    state={cat.state}
                    title={cat.label}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading font-semibold">{cat.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {copy.state[cat.state ?? "idle"]}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Button
                      size="sm"
                      variant={editingId === cat.id ? "default" : "outline"}
                      onClick={() => {
                        setEditingId(cat.id);
                        setSavedLabel(null);
                        setDraft({
                          label: cat.label,
                          palette: { ...cat.palette },
                          accessories: [...(cat.accessories ?? [])],
                          state: cat.state ?? "idle",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <Pencil />
                      {copy.studio.edit}
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      aria-label={`${copy.studio.duplicate} ${cat.label}`}
                      onClick={() => {
                        save({
                          label: copy.studio.copyName(cat.label),
                          palette: cat.palette,
                          accessories: cat.accessories ?? [],
                          state: cat.state,
                        });
                        toast.success(copy.toast.customDuplicated);
                      }}
                    >
                      <Copy />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`${copy.studio.delete} ${cat.label}`}
                      onClick={() => {
                        if (!window.confirm(copy.studio.confirmDelete(cat.label))) {
                          return;
                        }
                        remove(cat.id);
                        if (editingId === cat.id) resetEditor();
                        toast(copy.toast.customDeleted);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
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
