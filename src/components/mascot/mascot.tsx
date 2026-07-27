"use client";

import { useId } from "react";

import {
  buildRects,
  DEFAULT_PALETTE,
  EXPRESSIONS,
  MASCOT_VIEWBOX_HEIGHT,
  MASCOT_VIEWBOX_WIDTH,
  type MascotAccessory,
  type MascotPalette,
  type MascotState,
  type Overlay,
} from "./mascot-art";

/**
 * Fabel CONSULTING AI mascot — pixel-art cat face.
 *
 * All geometry, palettes, expressions and accessories live in the pure
 * `mascot-art.ts` module (the single source of truth, also used to generate the
 * standalone `.svg` files). This component is just the React/animation shell.
 */

// Re-exported so existing imports from "@/components/common/mascot" keep working.
export {
  DEFAULT_PALETTE,
  CAT_VARIANTS,
  CAT_VARIANT_PALETTES,
  ALL_PALETTES,
  getPaletteIndex,
  getPaletteForName,
  getVariantForName,
  getAccessoriesForName,
  getAvatarConfig,
} from "./mascot-art";
export type {
  MascotPalette,
  MascotState,
  MascotAccessory,
  CatVariant,
  Overlay,
} from "./mascot-art";

export interface MascotProps {
  size?: number;
  state?: MascotState;
  animated?: boolean;
  palette?: Partial<MascotPalette>;
  /** Add-on overlays (e.g. sunglasses), orthogonal to `state`. */
  accessories?: readonly MascotAccessory[];
  /** Per-skin breed markings (usually from `getVariantForName`). */
  markings?: Overlay;
  className?: string;
  title?: string;
}

function renderDecoration(state: MascotState, p: MascotPalette) {
  if (state === "thinking") {
    // 像素省略号，不用 emoji
    return (
      <g className="ah-cat-think">
        <rect x="46" y="8" width="2" height="2" fill={p.ink} />
        <rect x="51" y="6" width="2" height="2" fill={p.ink} />
        <rect x="56" y="4" width="2" height="2" fill={p.ink} />
      </g>
    );
  }
  if (state === "sleeping") {
    return (
      <g className="ah-cat-zzz" fill={p.headDark} fontFamily="monospace" fontWeight="900">
        <text x="44" y="15" fontSize="8">
          z
        </text>
        <text x="49" y="8" fontSize="11">
          Z
        </text>
      </g>
    );
  }
  return null;
}

export function Mascot({
  size = 40,
  state = "idle",
  animated = true,
  palette,
  accessories,
  markings,
  className,
  title = "Fabel CONSULTING AI",
}: MascotProps) {
  const p: MascotPalette = { ...DEFAULT_PALETTE, ...palette };
  const uid = useId();

  const rects = buildRects(p, { state, accessories, markings });
  const blink = EXPRESSIONS[state].blink;

  const cssParts = [
    `[data-cat="${uid}"] .ah-cat-think { transform-box: fill-box; transform-origin: 50% 100%; animation: ah-cat-bob 1.8s ease-in-out infinite }`,
    `[data-cat="${uid}"] .ah-cat-zzz text { animation: ah-cat-float 2.6s ease-in-out infinite }`,
    "@keyframes ah-cat-bob { 0%,100% { transform: translateY(0); opacity: .8 } 50% { transform: translateY(-3px); opacity: 1 } }",
    "@keyframes ah-cat-float { 0% { transform: translateY(1px); opacity: .3 } 50% { transform: translateY(-3px); opacity: 1 } 100% { transform: translateY(-5px); opacity: 0 } }",
  ];
  if (blink) {
    cssParts.push(
      `[data-cat="${uid}"] .ah-cat-eyes { transform-box: fill-box; transform-origin: 50% 50%; animation: ah-cat-blink 5.2s ease-in-out infinite }`,
      "@keyframes ah-cat-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(.08) } 97% { transform: scaleY(1) } }",
    );
  }
  cssParts.push(
    `@media (prefers-reduced-motion: reduce) { [data-cat="${uid}"] * { animation: none !important } }`,
  );
  const css = cssParts.join("\n");

  const bodyRects = rects.filter((r) => !r.eye && !r.accessory);
  const eyeRects = rects.filter((r) => r.eye);
  const accessoryRects = rects.filter((r) => r.accessory);

  return (
    <svg
      data-cat={uid}
      role="img"
      aria-label={title}
      width={size}
      height={size}
      viewBox={`0 0 ${MASCOT_VIEWBOX_WIDTH} ${MASCOT_VIEWBOX_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {animated && <style>{css}</style>}
      <title>{title}</title>

      <g className="ah-cat-breathe">
        {bodyRects.map((r, i) => (
          <rect key={`b${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
        ))}
        <g className="ah-cat-eyes">
          {eyeRects.map((r, i) => (
            <rect key={`e${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
          ))}
        </g>
        {accessoryRects.map((r, i) => (
          <rect key={`a${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
        ))}
      </g>
      {renderDecoration(state, p)}
    </svg>
  );
}

export default Mascot;
