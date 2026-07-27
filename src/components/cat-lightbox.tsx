"use client";

import { useState } from "react";

import { CatStage } from "@/components/cat-stage";
import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MASCOT_STATES, type CatHead, type MascotState } from "@/lib/cats";
import { copy } from "@/lib/copy";

interface CatLightboxProps {
  cat: CatHead | null;
  onClose: () => void;
}

export function CatLightbox({ cat, onClose }: CatLightboxProps) {
  const [state, setState] = useState<MascotState>("idle");

  return (
    <Dialog
      open={cat !== null}
      onOpenChange={(open) => {
        if (!open) {
          setState("idle");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">
          {cat?.label ?? copy.card.preview}
        </DialogTitle>
        {cat && (
          <div className="gallery-panel flex flex-col items-center gap-6 p-6">
            <CatStage size="lg" className="w-full">
              <Mascot
                size={220}
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
            <div className="flex flex-wrap justify-center gap-2">
              {MASCOT_STATES.map((next) => (
                <Button
                  key={next}
                  size="sm"
                  variant={state === next ? "default" : "secondary"}
                  onClick={() => setState(next)}
                >
                  {copy.state[next]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
