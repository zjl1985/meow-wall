/**
 * Fabel CONSULTING AI mascot — single source of truth for the pixel-art cat.
 *
 * This module is **pure** (no React, no DOM). It owns three orthogonal axes:
 *
 *   1. Skin       — `MascotPalette` / `CAT_VARIANTS`   (add a cat = add a palette)
 *   2. Expression — `EXPRESSIONS` eye/mouth overlays   (add a mood = add an overlay)
 *   3. Accessory  — `ACCESSORIES` overlays drawn on top (add a prop = add an overlay)
 *
 * Both the React component (`mascot.tsx`) and the SVG generator
 * (`scripts/gen-mascot-svg.ts`) consume `buildRects()` / `toSvg()` from here, so
 * the standalone `.svg` files are derived artifacts — never hand-edited.
 *
 * Geometry: 32×32 grid, 2px per cell, rendered into a 64×64 viewBox.
 */

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

export interface MascotPalette {
  head: string;
  headDark: string;
  headLight: string;
  earInner: string;
  ink: string;
  blush: string;
  nose: string;
  white: string;
  /** Optional extra hue used only by breed `markings` (token `M`). */
  mark?: string;
}

/** A sparse pixel overlay: rowIndex → 32-char token string; `.` is transparent. */
export type Overlay = Readonly<Record<number, string>>;

export const DEFAULT_PALETTE: MascotPalette = {
  head: "#92A5C6",
  headDark: "#686791",
  headLight: "#BECEE8",
  earInner: "#EE676B",
  ink: "#14042B",
  blush: "#DBA1B7",
  nose: "#2D304F",
  white: "#FFFFFF",
};

export interface CatVariant {
  /** kebab-case id; also the `cat-<id>.svg` filename stem. */
  id: string;
  /** Human label, used in the SVG `aria-label`. */
  label: string;
  palette: MascotPalette;
  /**
   * Optional breed markings painted over the base grid (e.g. siamese points,
   * bicolor blaze). Uses normal tokens plus `M` (→ `palette.mark`).
   */
  markings?: Overlay;
  /** Optional built-in props for this skin, rendered in standalone SVGs too. */
  accessories?: readonly MascotAccessory[];
}

/**
 * The named color skins. `default` is the canonical grey-blue cat (rendered to
 * `static-logo.svg` / `mascot-idle.svg` / `icon.svg`); the rest become
 * `cat-<id>.svg`. **To add a new cat, append one entry here and run
 * `pnpm mascot:gen`.**
 */
export const CAT_VARIANTS: readonly CatVariant[] = [
  { id: "default", label: "Fabel CONSULTING AI", palette: DEFAULT_PALETTE },
  {
    id: "dark-gray",
    label: "Dark gray",
    palette: {
      head: "#59627C",
      headDark: "#343A56",
      headLight: "#8CA0C2",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#E48EAA",
      nose: "#2D304F",
      white: "#FFFFFF",
    },
    // Split face: right half darker (asymmetrical two-tone).
    markings: {
      8:  "................DDDDDDDDDD......",
      9:  "................DDDDDDDDDDD.....",
      10: "................DDDDDDDDDD......",
      11: "................DDDDDDDDDD......",
      12: "................DDDDDDDDDD......",
      13: "................DDDDDDDDDD......",
      14: "................DDDDDDDDDD......",
      15: "................DDDDDDDDDD......",
      16: "................DDDDDDDDD.......",
      20: "................DDDDDDDD........",
      21: "................DDDDDDD.........",
      22: "................DDDDDD..........",
      23: "................DDDDD...........",
      24: "................DDDD............",
      25: "................DDD.............",
      26: "................DD..............",
    },
  },
  {
    id: "orange",
    label: "Orange",
    palette: {
      head: "#E97832",
      headDark: "#A94836",
      headLight: "#F5A34B",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#F49AB0",
      nose: "#2D304F",
      white: "#FFFFFF",
    },
    // Ginger tabby: lighter stripes across forehead.
    markings: {
      13: "..........H.L...L.H.............",
      14: "...........L.H.H.L..............",
      15: "..........H.L...L.H.............",
    },
  },
  {
    id: "cream",
    label: "Cream",
    palette: {
      head: "#F4BE7A",
      headDark: "#C87842",
      headLight: "#FFD8A2",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#EFA3B8",
      nose: "#2D304F",
      white: "#FFFFFF",
    },
    // Calico: random patches of dark and light across the face.
    markings: {
      12: "...........D.............D......",
      14: "........D.............D.........",
      16: ".............D.........D........",
      22: ".........D.........D............",
      24: "...........D.........D..........",
    },
  },
  {
    id: "white",
    label: "White",
    palette: {
      head: "#F3F8FF",
      headDark: "#AEC0D6",
      headLight: "#FFFFFF",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#E7A4B8",
      nose: "#2D304F",
      white: "#FFFFFF",
    },
    // Cow: black spots on white fur.
    markings: {
      10: "..........D................D....",
      12: "...........D...D................",
      14: "...................D...D........",
      16: "......D.................D.......",
      20: "...........D................D...",
      22: "......D...........D.............",
      24: ".................D.......D......",
    },
  },
  {
    id: "blue-white",
    label: "Blue white",
    palette: {
      head: "#AFC8E2",
      headDark: "#4E5A82",
      headLight: "#D9F0FF",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#F0A1B6",
      nose: "#343A56",
      white: "#FFFFFF",
    },
    // Bicolor: a white blaze + muzzle down the centre.
    markings: {
      13: ".............WWWW...............",
      14: "............WWWWWW..............",
      15: "............WWWWWW..............",
      16: "............WWWWWW..............",
      23: "..........WWWWWWWWWWWW..........",
      24: "..........WWWWWWWWWWWW..........",
      25: "...........WWWWWWWWWW...........",
      26: "...........WWWWWWWWWW...........",
    },
  },
  {
    id: "siamese",
    label: "Siamese",
    palette: {
      head: "#C88656",
      headDark: "#6A3A3E",
      headLight: "#F0BE86",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#ECA0B3",
      nose: "#4A2A35",
      white: "#FFFFFF",
      mark: "#5A3330",
    },
    // Seal point: cream face with a dark muzzle mask.
    markings: {
      14: ".........LLLLLLLLLLLLLL.........",
      15: ".........LLLLLLLLLLLLLL.........",
      16: ".........LLLLLLLLLLLLLL.........",
      21: "............MMMM..MMMM..........",
      22: "............MMMM..MMMM..........",
      23: ".............MMMMMMMM...........",
      24: ".............MMMMMMMM...........",
    },
  },
  {
    id: "brown",
    label: "Brown",
    palette: {
      head: "#7E3F3D",
      headDark: "#4D2638",
      headLight: "#A85A51",
      earInner: "#D95B64",
      ink: "#14042B",
      blush: "#D98AA0",
      nose: "#2A1A2C",
      white: "#FFFFFF",
    },
  },
  // ─── New breeds (highly distinct) ───
  {
    id: "pink",
    label: "Pink",
    palette: {
      head: "#E89EC4",
      headDark: "#A85A7C",
      headLight: "#F7C8E0",
      earInner: "#D95B7C",
      ink: "#14042B",
      blush: "#F0A0B8",
      nose: "#7C3A56",
      white: "#FFFFFF",
    },
  },
  {
    id: "mint",
    label: "Mint",
    palette: {
      head: "#7ECCB4",
      headDark: "#4A8A72",
      headLight: "#B4E8D4",
      earInner: "#EE9B8C",
      ink: "#14042B",
      blush: "#E0A8BC",
      nose: "#3A584A",
      white: "#FFFFFF",
    },
  },
  {
    id: "lavender",
    label: "Lavender",
    palette: {
      head: "#B89EDC",
      headDark: "#7A5EA2",
      headLight: "#D8C8F0",
      earInner: "#EE7E8C",
      ink: "#14042B",
      blush: "#E0A8C4",
      nose: "#5A3A72",
      white: "#FFFFFF",
    },
    // Lilac point: pale face with darker ear tips and mask.
    markings: {
      4:  "..........D..D.........D..D.....",
      5:  "..........D..D.........D..D.....",
      14: ".........LLLLLLLLLLLLLL.........",
      15: ".........LLLLLLLLLLLLLL.........",
    },
  },
  {
    id: "red",
    label: "Red",
    palette: {
      head: "#D86050",
      headDark: "#9E3028",
      headLight: "#E88878",
      earInner: "#EE5060",
      ink: "#14042B",
      blush: "#E898A0",
      nose: "#6A1E18",
      white: "#FFFFFF",
    },
    // Red tabby: forehead stripes.
    markings: {
      13: ".........L.H...H.L..............",
      14: "..........H.L...L.H.............",
      15: ".........L.H...H.L..............",
    },
  },
  {
    id: "black",
    label: "Black",
    palette: {
      head: "#3C3C4A",
      headDark: "#1A1A24",
      headLight: "#5C5C6A",
      earInner: "#D95B64",
      ink: "#14042B",
      blush: "#C888A0",
      nose: "#0A0A12",
      white: "#E8E8F0",
    },
  },
  {
    id: "yellow",
    label: "Yellow",
    palette: {
      head: "#E8D058",
      headDark: "#A8902A",
      headLight: "#F8E888",
      earInner: "#EE8C6C",
      ink: "#14042B",
      blush: "#E8B8A0",
      nose: "#6A5A1A",
      white: "#FFFFFF",
    },
  },
  {
    id: "green",
    label: "Green",
    palette: {
      head: "#7CB858",
      headDark: "#4A7A2E",
      headLight: "#A4DC80",
      earInner: "#EE8C6C",
      ink: "#14042B",
      blush: "#D8B0A0",
      nose: "#3A5A1E",
      white: "#FFFFFF",
    },
    // Green frog-cat: dark spots on forehead.
    markings: {
      13: "...........D...D...D............",
      14: "............D...D...D...........",
      15: "...........D...D...D............",
    },
  },
  {
    id: "coral",
    label: "Coral",
    palette: {
      head: "#E87878",
      headDark: "#A84040",
      headLight: "#F0A0A0",
      earInner: "#EE5060",
      ink: "#14042B",
      blush: "#F0B0B8",
      nose: "#7C2828",
      white: "#FFFFFF",
    },
  },
  {
    id: "tuxedo",
    label: "Tuxedo",
    palette: {
      head: "#2F3340",
      headDark: "#151822",
      headLight: "#555B6D",
      earInner: "#D95B64",
      ink: "#14042B",
      blush: "#C9869A",
      nose: "#0C0E14",
      white: "#FFFFFF",
    },
    markings: {
      13: ".............WWWW...............",
      14: "............WWWWWW..............",
      15: "............WWWWWW..............",
      16: "............WWWWWW..............",
      23: "..........WWWWWWWWWWWW..........",
      24: "..........WWWWWWWWWWWW..........",
      25: "...........WWWWWWWWWW...........",
      26: "...........WWWWWWWWWW...........",
    },
    accessories: ["bowtie"],
  },
  {
    id: "tortie",
    label: "Tortie",
    palette: {
      head: "#5C3A3E",
      headDark: "#2C1C26",
      headLight: "#C87648",
      earInner: "#D95B64",
      ink: "#14042B",
      blush: "#D18A9C",
      nose: "#2A1A24",
      white: "#FFFFFF",
      mark: "#E09A58",
    },
    markings: {
      10: ".........M................D.....",
      12: "........MM....D.........MM......",
      14: "......D.....MMM....D............",
      16: ".........MM.......MM.....D......",
      21: "......MM.....D........MM........",
      23: "...........D.....MMM............",
      25: "........MM...........D..........",
    },
  },
  {
    id: "calico",
    label: "Calico",
    palette: {
      head: "#F3F4F0",
      headDark: "#3A2A34",
      headLight: "#FFF5D8",
      earInner: "#EE676B",
      ink: "#14042B",
      blush: "#ECA0B3",
      nose: "#2D304F",
      white: "#FFFFFF",
      mark: "#E6823E",
    },
    markings: {
      9:  "........MM...............DD.....",
      11: "........MMM.............DD......",
      13: "......MM...........DD...........",
      15: ".............DD........MMM......",
      20: ".......DD...........MM..........",
      22: "..........MMM.............DD....",
      24: ".............DD....MM...........",
    },
  },
  {
    id: "panda",
    label: "Panda",
    palette: {
      head: "#F7FAFF",
      headDark: "#252938",
      headLight: "#FFFFFF",
      earInner: "#E890A4",
      ink: "#14042B",
      blush: "#E3A0B2",
      nose: "#1A1E2C",
      white: "#FFFFFF",
    },
    markings: {
      16: "........DDDD.........DDDD.......",
      17: ".......DDDDDD.......DDDDDD......",
      18: ".......DDDDDD.......DDDDDD......",
      19: ".......DDDDDD.......DDDDDD......",
      20: "........DDDD.........DDDD.......",
    },
  },
  {
    id: "moonlight",
    label: "Moonlight",
    palette: {
      head: "#47507A",
      headDark: "#232844",
      headLight: "#AAB7E8",
      earInner: "#D97890",
      ink: "#14042B",
      blush: "#D6A2C0",
      nose: "#20243A",
      white: "#FFFFFF",
      mark: "#F3EBC0",
    },
    markings: {
      12: "..............MM................",
      13: ".............MMMM...............",
      14: "..............MM................",
      22: "..........W.............W.......",
      24: "...............MM...............",
    },
    accessories: ["glasses"],
  },
  {
    id: "aqua",
    label: "Aqua",
    palette: {
      head: "#55B9C6",
      headDark: "#267184",
      headLight: "#A8E8EA",
      earInner: "#EE8C8C",
      ink: "#14042B",
      blush: "#E7A0B4",
      nose: "#1C4E5A",
      white: "#FFFFFF",
    },
    markings: {
      13: ".........L.L.L.L.L.L............",
      14: "..........D.D.D.D.D.............",
      15: ".........L.L.L.L.L.L............",
    },
  },
  {
    id: "peach",
    label: "Peach",
    palette: {
      head: "#F0A06E",
      headDark: "#B85E48",
      headLight: "#FFD0A6",
      earInner: "#EC6F78",
      ink: "#14042B",
      blush: "#F0A0B6",
      nose: "#7A3A32",
      white: "#FFFFFF",
    },
    accessories: ["flower"],
  },
  {
    id: "blueberry",
    label: "Blueberry",
    palette: {
      head: "#5866B2",
      headDark: "#2F356C",
      headLight: "#91A0EA",
      earInner: "#E07990",
      ink: "#14042B",
      blush: "#CFA0D0",
      nose: "#252B58",
      white: "#FFFFFF",
    },
    accessories: ["headphones"],
  },
  {
    id: "matcha",
    label: "Matcha",
    palette: {
      head: "#9FCB6B",
      headDark: "#5F8238",
      headLight: "#D4E89C",
      earInner: "#E89A78",
      ink: "#14042B",
      blush: "#DDB0A0",
      nose: "#3E5428",
      white: "#FFFFFF",
    },
    markings: {
      13: "...........D...D...D............",
      14: "..........L.L.L.L.L.L...........",
      15: "...........D...D...D............",
    },
    accessories: ["scarf"],
  },
  {
    id: "rose-gold",
    label: "Rose gold",
    palette: {
      head: "#DFA0A0",
      headDark: "#A45B66",
      headLight: "#F2C899",
      earInner: "#E86F76",
      ink: "#14042B",
      blush: "#F0A8B8",
      nose: "#7A3C46",
      white: "#FFFFFF",
    },
    accessories: ["crown"],
  },
  {
    id: "copper",
    label: "Copper",
    palette: {
      head: "#B8643E",
      headDark: "#6E3428",
      headLight: "#E2945E",
      earInner: "#D95B64",
      ink: "#14042B",
      blush: "#E090A0",
      nose: "#4C241E",
      white: "#FFFFFF",
    },
    markings: {
      13: "..........H.L.H.L.H.............",
      14: "...........D.H.D.H..............",
      15: "..........H.L.H.L.H.............",
    },
    accessories: ["sunglasses"],
  },
  {
    id: "ash-cap",
    label: "Ash cap",
    palette: {
      head: "#8D94A3",
      headDark: "#4E5566",
      headLight: "#C9D0DA",
      earInner: "#E47A8C",
      ink: "#14042B",
      blush: "#D89AAC",
      nose: "#343846",
      white: "#FFFFFF",
    },
    accessories: ["cap"],
  },
  {
    id: "lilac-white",
    label: "Lilac white",
    palette: {
      head: "#B9A4D8",
      headDark: "#716092",
      headLight: "#DED2F0",
      earInner: "#EC7E92",
      ink: "#14042B",
      blush: "#E2A0C0",
      nose: "#554066",
      white: "#FFFFFF",
    },
    markings: {
      13: "............WWWWWW..............",
      14: "...........WWWWWWWW.............",
      15: "...........WWWWWWWW.............",
      16: "............WWWWWW..............",
      23: "..........WWWWWWWWWWWW..........",
      24: "..........WWWWWWWWWWWW..........",
    },
    accessories: ["bowtie"],
  },
  {
    id: "mango-cap",
    label: "Mango cap",
    palette: {
      head: "#E5B63E",
      headDark: "#9B6B22",
      headLight: "#F4D870",
      earInner: "#E98468",
      ink: "#14042B",
      blush: "#E9A090",
      nose: "#654214",
      white: "#FFFFFF",
      mark: "#E67335",
    },
    markings: {
      13: ".........M.M.M.M.M.M............",
      15: "..........M.M.M.M.M.............",
    },
    accessories: ["cap"],
  },
  {
    id: "aurora",
    label: "Aurora",
    palette: {
      head: "#6AB8B0",
      headDark: "#355D78",
      headLight: "#B9DFA8",
      earInner: "#E78BA0",
      ink: "#14042B",
      blush: "#DCA8C0",
      nose: "#28445A",
      white: "#FFFFFF",
      mark: "#9E8CE0",
    },
    markings: {
      12: ".........M........L.............",
      14: "..........MM....LL..............",
      16: "............MMLL................",
      22: ".........LL....MM...............",
      24: ".......M...........L............",
    },
  },
  {
    id: "cocoa-cream",
    label: "Cocoa cream",
    palette: {
      head: "#6B4436",
      headDark: "#3A2424",
      headLight: "#D8AA7A",
      earInner: "#D85E66",
      ink: "#14042B",
      blush: "#D898A0",
      nose: "#241616",
      white: "#FFFFFF",
    },
    markings: {
      14: ".........LLLLLLLLLLLLLL.........",
      15: ".........LLLLLLLLLLLLLL.........",
      21: "...........LLLLLLLLLL...........",
      22: "...........LLLLLLLLLL...........",
      23: "............LLLLLLLL............",
      24: "............LLLLLLLL............",
    },
    accessories: ["glasses"],
  },
  {
    id: "nicole",
    label: "Nicole",
    palette: {
      head: "#E8C7AA",
      headDark: "#1A1416",
      headLight: "#F8EDE3",
      earInner: "#D98890",
      ink: "#120B18",
      blush: "#D993A4",
      nose: "#5A3436",
      white: "#FFFFFF",
    },
    // Inspired by Nicole's avatar: black long hair, soft warm face, and white top.
    markings: {
      8:  "....DDDDDD...........DDDDDDDD...",
      9:  "....DDDDDDD..........DDDDDDDD...",
      10: "....DDDDDDD.........DDDDDDDDD...",
      11: "....DDDDD...........DDDDDDDDD...",
      12: "......DDD...........DDDDDDDDD...",
      13: ".....................DDDDDDD....",
      14: ".....................DDDDDDD....",
      15: ".....................DDDDDDD....",
      16: "......................DDDDDD....",
      17: ".......................DDDDD....",
      18: ".......................DDDDD....",
      19: ".......................DDDDD....",
      20: ".......................DDDDD....",
      21: ".......................DDDDD....",
      22: ".......................DDDDD....",
      23: ".......................DDDDD....",
      24: "..........WWW..........DDDDD....",
      25: ".........WW.............DDDD....",
      26: "........WWWW............DDDD....",
    },
    accessories: ["glasses"],
  },
  {
    id: "goodman",
    label: "Goodman",
    palette: {
      head: "#D98A4C",
      headDark: "#7A3E2A",
      headLight: "#F1B76E",
      earInner: "#EE6A72",
      ink: "#14042B",
      blush: "#E99094",
      nose: "#5A2B22",
      white: "#FFFFFF",
      mark: "#45B7C8",
    },
    // Fitness cat: energetic stripes, sport singlet collar, and a bright headband.
    markings: {
      13: ".........M.M.M.M.M.M............",
      14: "..........D.D.D.D.D.............",
      15: ".........M.M.M.M.M.M............",
      24: "..........WW........WW..........",
      25: ".........WWW......WWW...........",
      26: "........WWWW......WWWW..........",
    },
    accessories: ["headband"],
  },
  {
    id: "simon",
    label: "Simon",
    palette: {
      head: "#B9C77A",
      headDark: "#5F7A45",
      headLight: "#E3E5A4",
      earInner: "#D8A078",
      ink: "#14042B",
      blush: "#D6A8A0",
      nose: "#445838",
      white: "#FFFFFF",
      mark: "#7FBF86",
    },
    // Wellness cat: herbal forehead dots and a calm white tea-collar shape.
    markings: {
      12: "............M..M..M.............",
      14: "..........L...M...L.............",
      16: "............M...M...............",
      23: "...........WWWWWWWWWW...........",
      24: "..........WWWWWWWWWWWW..........",
      25: "...........WWWWWWWWWW...........",
      26: "............WWWWWWWW............",
    },
    accessories: ["leaf"],
  },
  {
    id: "zero",
    label: "Zero",
    palette: {
      head: "#E3B686",
      headDark: "#1B1716",
      headLight: "#F6D3A0",
      earInner: "#D98B80",
      ink: "#120B18",
      blush: "#D8948C",
      nose: "#5A3828",
      white: "#FFFFFF",
      mark: "#F0C341",
    },
    // Author cat: slick gold hair and black-shirt energy.
    markings: {
      7:  "..........MMMMMMMMMM............",
      8:  "........MMMMMMMMMMMMMM..........",
      9:  ".......MM.M.MMMMM.MMMM..........",
      10: "......MM...MMMMM...MMM..........",
      11: "...........MMMM.................",
      12: "...........MMM..................",
      24: "........DDDDDDDDDDDDDDDD........",
      25: ".......DDDDDDDDDDDDDDDDDD.......",
      26: "......DDDDDDDDDDDDDDDDDDDD......",
    },
    accessories: ["sunglasses", "gold-chain"],
  },
];

const SPECIAL_VARIANT_BY_NAME: Readonly<Record<string, string>> = {
  goodman: "goodman",
  nicole: "nicole",
  simon: "simon",
  zero: "zero",
};

/** Color-variant palettes excluding the default (backward-compatible export). */
export const CAT_VARIANT_PALETTES: MascotPalette[] = CAT_VARIANTS.filter(
  (v) => v.id !== "default",
).map((v) => v.palette);

/** All palettes including the default, in skin-picker order. */
export const ALL_PALETTES: MascotPalette[] = CAT_VARIANTS.map((v) => v.palette);

/** Deterministic palette index from a name (stable across renders).
 *  Uses DJB2-like hashing for better distribution than simple char-sum. */
export function getPaletteIndex(name: string, count: number): number {
  let hash = 5381;
  for (let i = 0; i < name.length; i += 1) {
    hash = ((hash << 5) + hash) + name.charCodeAt(i); /* hash * 33 + c */
    hash |= 0; // 32-bit int
  }
  return Math.abs(hash) % count;
}

/** Pick a cat color palette deterministically from a display name.
 *  Excludes the default brand palette so agents look distinct. */
export function getPaletteForName(name: string): MascotPalette {
  const specialVariant = getSpecialVariantForName(name);
  if (specialVariant) return specialVariant.palette;

  const nonDefault = ALL_PALETTES.slice(1);
  const idx = getPaletteIndex(name, nonDefault.length);
  return nonDefault[idx];
}

/** Pick a full cat variant (palette + markings) deterministically from a name.
 *  Excludes the default brand variant so agents look distinct. */
export function getVariantForName(name: string): CatVariant {
  const specialVariant = getSpecialVariantForName(name);
  if (specialVariant) return specialVariant;

  const nonDefault = CAT_VARIANTS.slice(1);
  const idx = getPaletteIndex(name, nonDefault.length);
  return nonDefault[idx];
}

function getSpecialVariantForName(name: string): CatVariant | undefined {
  const specialId = SPECIAL_VARIANT_BY_NAME[name.trim().toLowerCase()];
  if (!specialId) return undefined;
  return CAT_VARIANTS.find((variant) => variant.id === specialId);
}

export function hasSpecialVariantForName(name: string): boolean {
  return Boolean(SPECIAL_VARIANT_BY_NAME[name.trim().toLowerCase()]);
}

/** Deterministic accessory pick from a name, with built-in variant props first. */
export function getAccessoriesForName(name: string): MascotAccessory[] {
  const variant = getVariantForName(name);
  if (variant.accessories?.length) return [...variant.accessories];

  const h = getPaletteIndex(name, 2147483647); // reuse DJB2 as int
  // Some names stay clean; the rest get one deterministic accessory.
  if (h % 5 === 0) return []; // 20% no accessory
  const keys = Object.keys(ACCESSORIES) as MascotAccessory[];
  const idx = Math.abs(Math.floor(h / 31)) % keys.length;
  return [keys[idx]];
}

/** Full avatar config: variant + accessories + state in one call. */
export function getAvatarConfig(name: string) {
  return {
    variant: getVariantForName(name),
    accessories: getAccessoriesForName(name),
  };
}

// ---------------------------------------------------------------------------
// Geometry — the base grid (single source of truth)
// ---------------------------------------------------------------------------

export type PixelToken = "K" | "D" | "H" | "L" | "R" | "B" | "W" | "N" | "M";

const TOKEN_KEYS: Record<Exclude<PixelToken, "M">, Exclude<keyof MascotPalette, "mark">> = {
  K: "ink",
  D: "headDark",
  H: "head",
  L: "headLight",
  R: "earInner",
  B: "blush",
  W: "white",
  N: "nose",
};

export function tokenColor(token: PixelToken, p: MascotPalette): string {
  if (token === "M") return p.mark ?? p.headDark;
  return p[TOKEN_KEYS[token]];
}

export function isPixelToken(token: string): token is PixelToken {
  return token === "M" || token in TOKEN_KEYS;
}

export const GRID_SIZE = 32;
export const CELL = 2;

/**
 * The canonical cat face. Each character is one 2×2 pixel block; `.` is
 * transparent. This grid is byte-identical to the historical
 * `static-logo.svg` art — the SVG files are generated from it.
 */
export const CAT_GRID: readonly string[] = [
  "................................",
  "................................",
  "................................",
  "................................",
  "....KKKN.................KKKK...",
  "....KKKN.................KKKK...",
  "....KKDDKN.............KKDDKK...",
  "....KKDDKN.............KKDDKK...",
  "..KKRRHHDDKN.........KKDDHHRRKK.",
  "..KKRRBHDDNN.........NNDDBBRRKK.",
  "..KKRRRRHHDDKKKKKKKKKDDHHRRRRKK.",
  "..KKRRRRHHDDNNNNNNNNNDDHHRRRRKK.",
  "..KKRRRRDDHHHHHHHHHHHHHDDRRRRKK.",
  "..HHNNDDHLLLHHHHHHHHHLLHHDDNNHH.",
  "....KKDDLLLLHHHHHHHHHLLLLDDKK...",
  "....KKDDLLLHHHHHHHHHHLLLHDDKK...",
  "....KKDDHHHHHHHHHHHHHHHHHDDKK...",
  "..NNDDHDND.LHHHHHHHHHNN..HHDDNN.",
  "..KKDDHHKNWLHHHHHHHHHKKWWHHDDKK.",
  "KKKKDDHHKKKNHLLNKLLHHKKKKHHDDKKK",
  "KKKKDDHHKKKNHLLNKLLHHKKKKHHDDKKK",
  "..KKDDHHBBBBLDKHLNKLLBBBBHHDDKK.",
  "..KKDDHHBBBBLDKHLNKLLBBBBHHDDKK.",
  "KKKKDDHHHHHHHL.LL..HHHHHHHHDDKKK",
  "KKKKDDHHHHHHHLLLLLLHHHHHHHHDDKKK",
  "....KKDDHHHHHHHHHHHHHHHHHDDKK...",
  "....KKDDHHHHHHHHHHHHHHHHHDDKK...",
  "......KKDDDDDDDDDDDDDDDDDKK.....",
  "......KKDDDDDDDDDDDDDDDDDKK.....",
  ".......KKKKKKKKKKKKKKKKKK.......",
  ".......KKKKKKKKKKKKKKKKKK.......",
  "................................",
];

/**
 * Eye pixels in the base grid: the dark pupil / white glint tokens within the
 * eye band. Used to (a) drive the blink animation and (b) know what to wipe
 * when an expression overrides the eyes.
 */
function isBaseEyePixel(x: number, y: number, token: PixelToken): boolean {
  if (token !== "K" && token !== "W") return false;
  if (y < 18 || y > 20) return false;
  return (x >= 8 && x <= 12) || (x >= 21 && x <= 25);
}

/** Cells repainted to head color before drawing an overriding eye expression. */
const EYE_BOX: ReadonlyArray<readonly [number, number]> = (() => {
  const cells: Array<[number, number]> = [];
  for (let y = 18; y <= 20; y += 1) {
    for (const x of [8, 9, 10, 11, 21, 22, 23, 24]) {
      cells.push([x, y]);
    }
  }
  return cells;
})();

// ---------------------------------------------------------------------------
// Expressions (axis 2) — eye / mouth overlays keyed by state
// ---------------------------------------------------------------------------

export type MascotState =
  | "idle"
  | "thinking"
  | "success"
  | "error"
  | "sleeping"
  | "angry";

interface Expression {
  /** Eye overlay; when present the base eyes are wiped first. */
  eyes?: Overlay;
  /** Mouth / muzzle overlay, painted into the body layer. */
  mouth?: Overlay;
  /** Brow overlay (above eyes), painted into the body layer. */
  brow?: Overlay;
  /** Whether the (open) eyes should blink. */
  blink: boolean;
}

/*
 * Overlay authoring guide (column ruler):
 *   0         1         2         3
 *   0123456789012345678901234567890 1
 * Eyes live around cols 8-11 (left) / 21-24 (right), rows 18-20.
 * Mouth lives around cols 12-19, rows 23-25.
 */
export const EXPRESSIONS: Record<MascotState, Expression> = {
  idle: { blink: true },
  thinking: { blink: true },
  success: {
    blink: false,
    // ‿ ‿  smiling eyes (eye boxes: cols 8-11 / 21-24)
    eyes: {
      18: "........K..K.........K..K.......",
      19: ".........KK...........KK........",
    },
    mouth: {
      23: ".............K....K.............",
      24: "..............KKKK..............",
    },
  },
  error: {
    blink: false,
    // x x  crossed eyes
    eyes: {
      18: "........K..K.........K..K.......",
      19: ".........KK...........KK........",
      20: "........K..K.........K..K.......",
    },
    mouth: {
      23: "..............KKKK..............",
      24: ".............K....K.............",
    },
  },
  sleeping: {
    blink: false,
    // - -  closed lids
    eyes: {
      19: "........KKKK.........KKKK.......",
    },
    mouth: {
      24: "..............KK................",
    },
  },
  angry: {
    blink: false,
    // \  /  brows angling down toward the centre + narrowed glare
    brow: {
      16: ".......KK..............KK.......",
      17: ".........KK.........KK..........",
    },
    eyes: {
      19: "........KKK..........KKK........",
      20: "..........KK........KK..........",
    },
    mouth: {
      23: "..............KKKK..............",
      24: ".............K....K.............",
    },
  },
};

// ---------------------------------------------------------------------------
// Accessories (axis 3) — overlays painted on top, independent of state
// ---------------------------------------------------------------------------

export type MascotAccessory =
  | "sunglasses"
  | "bowtie"
  | "headphones"
  | "crown"
  | "scarf"
  | "glasses"
  | "flower"
  | "cap"
  | "headband"
  | "leaf"
  | "gold-chain";

/**
 * Accessory overlays use the same sparse format but are painted **above**
 * everything (including eyes). `.` is transparent.
 */
export const ACCESSORIES: Record<MascotAccessory, Overlay> = {
  // Two lenses over the eye boxes (7-12 / 20-25) joined by a thin nose bridge.
  sunglasses: {
    17: ".......KKKKKK.......KKKKKK......",
    18: ".......KWKKKKKKKKKKKKKWKKKK.....",
    19: ".......KKKKKK.......KKKKKK......",
  },
  // Small bowtie below chin (rows 27-29, cols 14-18).
  bowtie: {
    27: "..............K..K..............",
    28: ".............KKKKKK.............",
    29: "..............K..K..............",
  },
  // Headphone bands over ears (rows 6-15).
  headphones: {
    6:  "......KK..................KK....",
    7:  "......K....................K....",
    8:  "......K....................K....",
    9:  "......K....................K....",
    10: "......K....................K....",
    11: "......K....................K....",
    12: "......K....................K....",
    13: "......K....................K....",
    14: "......KK..................KK....",
  },
  // Crown on top of head (rows 2-5, cols 12-20).
  crown: {
    2:  ".............K.K.K..............",
    3:  "............KKKKKKK.............",
    4:  "............KKKKKKK.............",
    5:  ".............KKKKK..............",
  },
  // Scarf around neck (rows 26-28).
  scarf: {
    26: "...........KKKKKKKKKK...........",
    27: "..........KKKKKKKKKKKK..........",
    28: "...........KKKKKKKKKK...........",
  },
  // Round glasses — thinner frames than sunglasses.
  glasses: {
    17: ".......KKKKK.......KKKKK........",
    18: ".......K...K.......K...K........",
    19: ".......KKKKK.......KKKKK........",
  },
  // Small flower on left ear (rows 6-9, cols 2-6).
  flower: {
    6:  ".....K..........................",
    7:  "....KKK.........................",
    8:  ".....K..........................",
  },
  // Low baseball cap with a short brim, designed to sit above the eyes.
  cap: {
    5:  "..........KKKKKKKKKK............",
    6:  ".........KDDDDDDDDDDK...........",
    7:  "........KDDDDDDDDDDDDK..........",
    8:  "........KKKKKKKKKKKKKK..........",
    9:  "..................KKKKK.........",
  },
  // Sport headband across the forehead.
  headband: {
    12: "........KKKKKKKKKKKKKKKK........",
    13: "........KMMMMMMMMMMMMMMK........",
    14: "........KKKKKKKKKKKKKKKK........",
  },
  // Small wellness leaf above the right ear.
  leaf: {
    4:  "....................K...........",
    5:  "...................KKK..........",
    6:  "..................KMMMK.........",
    7:  "...................KMK..........",
    8:  "....................K...........",
  },
  // Chunky chain across the lower face / shirt.
  "gold-chain": {
    24: "...........M.K.M.K.M.M..........",
    25: "..........M.K.M.K.M.K.M.........",
    26: "...........M.K.M.K.M.M..........",
  },
};

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

export interface MascotRect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  /** Eye layer — wrapped in the blink group by the React component. */
  eye: boolean;
  /** Accessory layer — painted on top. */
  accessory: boolean;
}

export interface BuildOptions {
  state?: MascotState;
  accessories?: readonly MascotAccessory[];
  /** Per-skin breed markings, painted onto the base before the expression. */
  markings?: Overlay;
}

function applyOverlay(
  grid: string[][],
  overlay: Overlay,
  onPaint?: (x: number, y: number) => void,
): void {
  for (const [rowKey, row] of Object.entries(overlay)) {
    const y = Number(rowKey);
    for (let x = 0; x < row.length && x < GRID_SIZE; x += 1) {
      const ch = row[x];
      if (ch === "." || !isPixelToken(ch)) continue;
      grid[y][x] = ch;
      onPaint?.(x, y);
    }
  }
}

/**
 * Composite the grid for a given state + accessories and return run-length
 * encoded rectangles in row-major order. Eye and accessory cells are tagged so
 * downstream renderers can group / layer them.
 */
export function buildRects(
  palette: MascotPalette,
  { state = "idle", accessories = [], markings }: BuildOptions = {},
): MascotRect[] {
  const grid: string[][] = CAT_GRID.map((row) => row.split(""));
  const eyeMask: boolean[][] = grid.map((row) => row.map(() => false));
  const accGrid: string[][] = grid.map((row) => row.map(() => "."));

  // Skin markings sit beneath the expression / eyes.
  if (markings) applyOverlay(grid, markings);

  const expr = EXPRESSIONS[state];

  if (expr.eyes) {
    // Wipe the base eyes, then paint the expression's eyes.
    for (const [x, y] of EYE_BOX) grid[y][x] = "H";
    applyOverlay(grid, expr.eyes, (x, y) => {
      eyeMask[y][x] = true;
    });
  } else {
    // Keep the base eyes as the eye layer (they blink).
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const t = grid[y][x];
        if (isPixelToken(t) && isBaseEyePixel(x, y, t)) eyeMask[y][x] = true;
      }
    }
  }

  if (expr.brow) applyOverlay(grid, expr.brow);
  if (expr.mouth) applyOverlay(grid, expr.mouth);

  for (const acc of accessories) {
    applyOverlay(accGrid, ACCESSORIES[acc]);
  }

  const rects: MascotRect[] = [];

  // Body + eyes, run-length encoded; break runs on token / eye-layer change.
  for (let y = 0; y < GRID_SIZE; y += 1) {
    let runStart = -1;
    let runToken: PixelToken | null = null;
    let runEye = false;

    const flush = (endX: number) => {
      if (runStart < 0 || runToken === null) return;
      rects.push({
        x: runStart * CELL,
        y: y * CELL,
        w: (endX - runStart) * CELL,
        h: CELL,
        fill: tokenColor(runToken, palette),
        eye: runEye,
        accessory: false,
      });
      runStart = -1;
      runToken = null;
      runEye = false;
    };

    for (let x = 0; x < GRID_SIZE; x += 1) {
      const ch = grid[y][x];
      const isEye = eyeMask[y][x];
      if (isPixelToken(ch)) {
        if (runToken === ch && runEye === isEye) continue;
        flush(x);
        runStart = x;
        runToken = ch;
        runEye = isEye;
      } else {
        flush(x);
      }
    }
    flush(GRID_SIZE);
  }

  // Accessory layer on top, run-length encoded.
  for (let y = 0; y < GRID_SIZE; y += 1) {
    let runStart = -1;
    let runToken: PixelToken | null = null;

    const flush = (endX: number) => {
      if (runStart < 0 || runToken === null) return;
      rects.push({
        x: runStart * CELL,
        y: y * CELL,
        w: (endX - runStart) * CELL,
        h: CELL,
        fill: tokenColor(runToken, palette),
        eye: false,
        accessory: true,
      });
      runStart = -1;
      runToken = null;
    };

    for (let x = 0; x < GRID_SIZE; x += 1) {
      const ch = accGrid[y][x];
      if (isPixelToken(ch)) {
        if (runToken === ch) continue;
        flush(x);
        runStart = x;
        runToken = ch;
      } else {
        flush(x);
      }
    }
    flush(GRID_SIZE);
  }

  return rects;
}

// ---------------------------------------------------------------------------
// Standalone SVG generation (consumed by scripts/gen-mascot-svg.ts)
// ---------------------------------------------------------------------------

const IDLE_STYLE = `  <style>
    .breathe { transform-box: fill-box; transform-origin: 50% 90%; animation: cat-breathe 4s ease-in-out infinite }
    .eyes { transform-box: fill-box; transform-origin: 50% 50%; animation: cat-blink 5.2s ease-in-out infinite }

    @keyframes cat-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.02) } }
    @keyframes cat-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(0.12) } 97% { transform: scaleY(1) } }

    @media (prefers-reduced-motion: reduce) {
      .breathe, .eyes { animation: none }
    }
  </style>
`;

export interface SvgOptions {
  ariaLabel: string;
  /** When true, emits the breathe/blink animation + eye classes. */
  animated?: boolean;
  /** Per-skin breed markings. */
  markings?: Overlay;
  /** Optional props painted above the cat face. */
  accessories?: readonly MascotAccessory[];
}

function rectTag(r: MascotRect, indent: string, withEyeClass: boolean): string {
  const cls = withEyeClass && r.eye ? ` class="eyes"` : "";
  return `${indent}<rect${cls} x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" />`;
}

/** Render a standalone `.svg` string for a palette (hex-hardcoded). */
export function toSvg(palette: MascotPalette, opts: SvgOptions): string {
  const rects = buildRects(palette, {
    state: "idle",
    accessories: opts.accessories,
    markings: opts.markings,
  });
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${opts.ariaLabel}" shape-rendering="crispEdges">`;

  if (opts.animated) {
    const body = rects.map((r) => rectTag(r, "    ", true)).join("\n");
    return `${open}\n${IDLE_STYLE}\n  <g class="breathe">\n${body}\n  </g>\n</svg>\n`;
  }

  const body = rects.map((r) => rectTag(r, "  ", false)).join("\n");
  return `${open}\n${body}\n</svg>\n`;
}
