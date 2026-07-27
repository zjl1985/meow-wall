"use client";

import { useState } from "react";

import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CAT_VARIANTS } from "@/components/mascot/mascot-art";
import { MASCOT_STATES, type CatHead, type MascotState } from "@/lib/cats";
import { copy } from "@/lib/copy";

interface CatLightboxProps {
  cat: CatHead | null;
  onClose: () => void;
}

export function CatLightbox({ cat, onClose }: CatLightboxProps) {
  const [state, setState] = useState<MascotState>("idle");
  const palette = cat
    ? CAT_VARIANTS.find((variant) => variant.id === cat.id)?.palette
    : undefined;

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
          <div className="clay-surface flex flex-col items-center gap-6 p-8">
            <Mascot
              size={220}
              state={state}
              palette={palette}
              markings={cat.markings}
              accessories={cat.accessories}
              title={cat.label}
            />
            <div className="text-center">
              <p className="font-heading text-2xl font-extrabold">{cat.label}</p>
              <p className="text-muted-foreground mt-1 text-sm">
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
