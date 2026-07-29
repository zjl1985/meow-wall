"use client";

import { useEffect, type CSSProperties } from "react";
import { toast } from "sonner";

import { useCopy } from "@/hooks/use-copy";
import type { HeroSpecialEffect } from "@/lib/special-effects";

interface HeroSpecialEffectProps {
  effect: HeroSpecialEffect;
}

const NICOLE_PARTICLES = [
  { x: "12%", y: "76%", dx: "-26px", dy: "-92px", delay: "0ms", size: "10px" },
  { x: "24%", y: "34%", dx: "-18px", dy: "-76px", delay: "90ms", size: "7px" },
  { x: "42%", y: "82%", dx: "8px", dy: "-116px", delay: "160ms", size: "12px" },
  { x: "62%", y: "28%", dx: "14px", dy: "-70px", delay: "40ms", size: "8px" },
  { x: "76%", y: "72%", dx: "28px", dy: "-104px", delay: "220ms", size: "11px" },
  { x: "88%", y: "44%", dx: "20px", dy: "-82px", delay: "120ms", size: "7px" },
] as const;

const ZERO_SHARDS = [
  { x: "8%", y: "22%", dx: "42px", delay: "0ms", width: "46px" },
  { x: "18%", y: "68%", dx: "-34px", delay: "80ms", width: "28px" },
  { x: "38%", y: "16%", dx: "50px", delay: "140ms", width: "36px" },
  { x: "58%", y: "78%", dx: "-44px", delay: "40ms", width: "52px" },
  { x: "72%", y: "26%", dx: "32px", delay: "190ms", width: "24px" },
  { x: "86%", y: "62%", dx: "-48px", delay: "110ms", width: "40px" },
] as const;

export function HeroSpecialEffect({ effect }: HeroSpecialEffectProps) {
  const copy = useCopy();

  useEffect(() => {
    toast(effect === "nicole" ? copy.easterEgg.nicole : copy.easterEgg.zero);
  }, [copy.easterEgg.nicole, copy.easterEgg.zero, effect]);

  if (effect === "nicole") {
    return (
      <div aria-hidden className="hero-special-effect hero-special-effect--nicole">
        <span className="nicole-aura" />
        {NICOLE_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="nicole-heart"
            style={
              {
                "--x": particle.x,
                "--y": particle.y,
                "--dx": particle.dx,
                "--dy": particle.dy,
                "--delay": particle.delay,
                "--particle-size": particle.size,
              } as CSSProperties
            }
          />
        ))}
        <span className="special-effect-label">NICOLE MODE ♡</span>
      </div>
    );
  }

  return (
    <div aria-hidden className="hero-special-effect hero-special-effect--zero">
      <span className="zero-scanlines" />
      <span className="zero-flash" />
      {ZERO_SHARDS.map((shard, index) => (
        <span
          key={index}
          className="zero-shard"
          style={
            {
              "--x": shard.x,
              "--y": shard.y,
              "--dx": shard.dx,
              "--delay": shard.delay,
              "--shard-width": shard.width,
            } as CSSProperties
          }
        />
      ))}
      <span className="special-effect-label">ZERO SIGNAL // 00</span>
    </div>
  );
}
