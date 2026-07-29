"use client";

import { useState } from "react";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MASCOT_STATES, type CatHead, type MascotState } from "@/lib/cats";
import { useCopy } from "@/hooks/use-copy";

interface CatLightboxProps {
  cat: CatHead | null;
  onClose: () => void;
}

export function CatLightbox({ cat, onClose }: CatLightboxProps) {
  const copy = useCopy();
  return (
    <Dialog
      open={cat !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] max-w-md overflow-y-auto border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">
          {cat?.label ?? copy.card.preview}
        </DialogTitle>
        {cat && <CatLightboxContent key={cat.id} cat={cat} />}
      </DialogContent>
    </Dialog>
  );
}

function CatLightboxContent({ cat }: { cat: CatHead }) {
  const copy = useCopy();
  const [state, setState] = useState<MascotState>(cat.state ?? "idle");

  return (
    <div className="gallery-panel flex flex-col items-center gap-5 p-4 sm:gap-6 sm:p-6">
            <CatStage size="lg" className="min-h-56 w-full sm:min-h-64">
              <Mascot
                size={224}
                state={state}
                palette={cat.palette}
                markings={cat.markings}
                accessories={cat.accessories}
                title={cat.label}
              />
            </CatStage>
            <div className="text-center">
              <p className="font-heading text-2xl font-semibold tracking-tight">
                {cat.label}
              </p>
              <p className="text-muted-foreground mt-1 font-mono text-xs tracking-widest uppercase">
                {copy.state[state]}
              </p>
            </div>
            <div className="grid w-full grid-cols-5 gap-1.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
              {MASCOT_STATES.map((next) => (
                <Button
                  key={next}
                  size="sm"
                  variant={state === next ? "default" : "secondary"}
                  onClick={() => setState(next)}
                  className="h-9 min-w-0 px-1.5 text-[11px] sm:px-3"
                  aria-pressed={state === next}
                >
                  {copy.state[next]}
                </Button>
              ))}
            </div>
    </div>
  );
}
