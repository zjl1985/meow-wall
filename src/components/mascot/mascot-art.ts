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
 * Geometry: a 32×32 body grid plus a shared 1px face-detail layer, rendered
 * into a 64×64 viewBox. Every skin therefore gets exactly the same cat head;
 * a variant can only change colour, optional fur markings, and accessories.
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
  head: "#6F94AA",
  headDark: "#35536E",
  headLight: "#A9CBD8",
  earInner: "#F05E68",
  ink: "#172033",
  blush: "#F09AA8",
  nose: "#26384B",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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
      ink: "#172033",
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

/** The aspect ratio of the approved orange-cat SVG reference. */
export const MASCOT_VIEWBOX_WIDTH = 386;
export const MASCOT_VIEWBOX_HEIGHT = 288;
const REFERENCE_CELL = 20;
// Existing accessories/expressions were authored on a 32-cell, 64px canvas.
// The reference head starts 20px from the left and uses 10px logical cells.
const LEGACY_REFERENCE_X_OFFSET = 20;
const LEGACY_REFERENCE_CELL = 10;

/**
 * The approved cat head, transcribed from `public/orange-cat-reference.svg`.
 * This is intentionally a separate, larger pixel grid: it preserves the
 * reference's chunky 20px body pixels and its finer 10px mouth/whisker pass.
 * Palette tokens keep the drawing reusable for every skin.
 */
const REFERENCE_CAT_GRID: readonly string[] = [
  "...KK.........KK...",
  "...KDK.......KDK...",
  "..KRHDK.....KDHRK..",
  "..KRRHDK....DHRRK..",
  "..KRRDHDHDHDHDRRK..",
  "...KDLLDHDHDLLDK...",
  "...KDHHHHHHHHHDK...",
  "..KDHKWHHHHHWKHDK..",
  "..KDHKKHLKLHKKHDKK.",
  "..KDHBBLKLKLBBHDK..",
  "..KDHHHHLLLHHHHDKK.",
  "...KDHHHHHHHHHDK...",
  "....KDDDDDDDDDK....",
];

/**
 * The canonical cat head body. Each character is one 2×2 pixel block; `.` is
 * transparent. Eyes, nose, mouth and whiskers deliberately live in
 * `BASE_FACE_DETAILS` below so that all skins share the exact same readable
 * face at a finer, 1px resolution.
 */
export const CAT_GRID: readonly string[] = [
  "................................",
  "................................",
  "................................",
  "................................",
  ".....KKK................KKK.....",
  "....KDDHK..............KHDDK....",
  "....KRRHHK............KHHRRK....",
  "...KHRRRLHK..........KHLRRRHK...",
  "...KHRRRRHHK........KHHRRRRHK...",
  "...KHHRRRRDHKKKKKKKKHDRRRRHHK...",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  "....KDHHLLLHHHHHHHHHHLLLHHDK....",
  "....KDHHHHHHHHLHHLHHHHHHHHDK....",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  ".KKKKDHHHHHHHHHHHHHHHHHHHHDKKKK.",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  ".KKKKDHHHHHHHHHHHHHHHHHHHHDKKKK.",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  "....KDHHHHHHHHHHHHHHHHHHHHDK....",
  ".....KDHHHHHHHHHHHHHHHHHHDK.....",
  ".....KDDDDDDDDDDDDDDDDDDDDK.....",
  "......KDDDDDDDDDDDDDDDDDDK......",
  ".......KKKKKKKKKKKKKKKKKK.......",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
];

/**
 * Face cells reserved for the shared eye/muzzle details. Fur markings cannot
 * paint here: a tabby stripe must never turn the common cat face into a
 * different character.
 */
const FACE_PROTECTED_CELLS: ReadonlyArray<readonly [number, number]> = (() => {
  const cells: Array<[number, number]> = [];
  for (let y = 16; y <= 24; y += 1) {
    for (let x = 7; x <= 24; x += 1) cells.push([x, y]);
  }
  return cells;
})();

const FACE_PROTECTED_CELL_SET = new Set(
  FACE_PROTECTED_CELLS.map(([x, y]) => `${x}:${y}`),
);

interface FaceDetail {
  x: number;
  y: number;
  w: number;
  h: number;
  token: PixelToken;
  /** Eye details are wrapped in the blink group by the React component. */
  eye?: boolean;
}

/** Fine-pixel pass from the approved SVG: closed 人 mouth and 3 whiskers. */
const REFERENCE_FACE_DETAILS: readonly FaceDetail[] = [
  { x: 10, y: 165, w: 50, h: 10, token: "K" },
  { x: 0, y: 185, w: 60, h: 10, token: "K" },
  { x: 10, y: 205, w: 50, h: 10, token: "K" },
  { x: 326, y: 165, w: 50, h: 10, token: "K" },
  { x: 326, y: 185, w: 60, h: 10, token: "K" },
  { x: 326, y: 205, w: 50, h: 10, token: "K" },
  { x: 150, y: 190, w: 80, h: 10, token: "L" },
  { x: 145, y: 200, w: 100, h: 30, token: "L" },
  { x: 175, y: 190, w: 30, h: 10, token: "K" },
  { x: 185, y: 200, w: 10, h: 10, token: "K" },
  { x: 180, y: 205, w: 10, h: 5, token: "K" },
  { x: 170, y: 210, w: 15, h: 5, token: "K" },
  { x: 190, y: 205, w: 10, h: 5, token: "K" },
  { x: 195, y: 210, w: 15, h: 5, token: "K" },
];

// ---------------------------------------------------------------------------
// Expressions (axis 2) — eye / mouth overlays keyed by state
// ---------------------------------------------------------------------------

export type MascotState =
  | "idle"
  | "thinking"
  | "success"
  | "error"
  | "sleeping"
  | "angry"
  | "wink"
  | "surprised"
  | "love"
  | "sad";

interface Expression {
  /** Opaque base-colour patches that remove the idle features first. */
  clear?: readonly FaceDetail[];
  /** Reference-canvas details that draw the replacement expression. */
  details?: readonly FaceDetail[];
  /** Whether the (open) eyes should blink. */
  blink: boolean;
}

const EYE_CLEAR: readonly FaceDetail[] = [
  { x: 95, y: 155, w: 50, h: 50, token: "H" },
  { x: 240, y: 155, w: 50, h: 50, token: "H" },
];

const MUZZLE_CLEAR: readonly FaceDetail[] = [
  { x: 145, y: 190, w: 100, h: 40, token: "L" },
];

const EXPRESSION_NOSE: readonly FaceDetail[] = [
  { x: 175, y: 190, w: 30, h: 10, token: "N" },
  { x: 185, y: 200, w: 10, h: 10, token: "K" },
];

export const EXPRESSIONS: Record<MascotState, Expression> = {
  idle: { blink: true },
  thinking: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      ...EXPRESSION_NOSE,
      // Looking up/right with a small pondering mouth.
      { x: 105, y: 165, w: 25, h: 25, token: "K", eye: true },
      { x: 115, y: 165, w: 10, h: 10, token: "W", eye: true },
      { x: 255, y: 175, w: 25, h: 15, token: "K", eye: true },
      { x: 275, y: 165, w: 10, h: 10, token: "K" },
      { x: 185, y: 212, w: 15, h: 8, token: "K" },
    ],
  },
  success: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      ...EXPRESSION_NOSE,
      { x: 100, y: 180, w: 15, h: 8, token: "K", eye: true },
      { x: 115, y: 188, w: 20, h: 8, token: "K", eye: true },
      { x: 250, y: 188, w: 20, h: 8, token: "K", eye: true },
      { x: 270, y: 180, w: 15, h: 8, token: "K", eye: true },
      // A clear U-shaped smile, rather than a flat line.
      { x: 165, y: 210, w: 10, h: 10, token: "K" },
      { x: 205, y: 210, w: 10, h: 10, token: "K" },
      { x: 175, y: 220, w: 30, h: 8, token: "K" },
    ],
  },
  error: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      ...EXPRESSION_NOSE,
      { x: 100, y: 160, w: 10, h: 10, token: "K", eye: true },
      { x: 125, y: 160, w: 10, h: 10, token: "K", eye: true },
      { x: 110, y: 170, w: 15, h: 10, token: "K", eye: true },
      { x: 100, y: 190, w: 10, h: 10, token: "K", eye: true },
      { x: 125, y: 190, w: 10, h: 10, token: "K", eye: true },
      { x: 250, y: 160, w: 10, h: 10, token: "K", eye: true },
      { x: 275, y: 160, w: 10, h: 10, token: "K", eye: true },
      { x: 260, y: 170, w: 15, h: 10, token: "K", eye: true },
      { x: 250, y: 190, w: 10, h: 10, token: "K", eye: true },
      { x: 275, y: 190, w: 10, h: 10, token: "K", eye: true },
      // Small open “o” mouth.
      { x: 175, y: 210, w: 30, h: 18, token: "K" },
      { x: 183, y: 216, w: 14, h: 8, token: "L" },
    ],
  },
  sleeping: {
    blink: false,
    clear: EYE_CLEAR,
    details: [
      { x: 100, y: 185, w: 40, h: 8, token: "K", eye: true },
      { x: 245, y: 185, w: 40, h: 8, token: "K", eye: true },
    ],
  },
  angry: {
    blink: false,
    clear: EYE_CLEAR,
    details: [
      { x: 95, y: 150, w: 25, h: 8, token: "K" },
      { x: 120, y: 158, w: 25, h: 8, token: "K" },
      { x: 240, y: 158, w: 25, h: 8, token: "K" },
      { x: 265, y: 150, w: 25, h: 8, token: "K" },
      { x: 105, y: 180, w: 35, h: 12, token: "K", eye: true },
      { x: 245, y: 180, w: 35, h: 12, token: "K", eye: true },
    ],
  },
  wink: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      ...EXPRESSION_NOSE,
      { x: 100, y: 180, w: 40, h: 8, token: "K", eye: true },
      { x: 250, y: 160, w: 35, h: 38, token: "K", eye: true },
      { x: 260, y: 168, w: 12, h: 12, token: "W", eye: true },
      { x: 165, y: 210, w: 10, h: 10, token: "K" },
      { x: 205, y: 210, w: 10, h: 10, token: "K" },
      { x: 175, y: 220, w: 30, h: 8, token: "K" },
    ],
  },
  surprised: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      { x: 98, y: 155, w: 42, h: 46, token: "K", eye: true },
      { x: 108, y: 165, w: 22, h: 26, token: "W", eye: true },
      { x: 245, y: 155, w: 42, h: 46, token: "K", eye: true },
      { x: 255, y: 165, w: 22, h: 26, token: "W", eye: true },
      ...EXPRESSION_NOSE,
      { x: 175, y: 212, w: 30, h: 24, token: "K" },
      { x: 183, y: 218, w: 14, h: 12, token: "L" },
    ],
  },
  love: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      { x: 96, y: 162, w: 18, h: 18, token: "B", eye: true },
      { x: 122, y: 162, w: 18, h: 18, token: "B", eye: true },
      { x: 104, y: 178, w: 28, h: 18, token: "B", eye: true },
      { x: 243, y: 162, w: 18, h: 18, token: "B", eye: true },
      { x: 269, y: 162, w: 18, h: 18, token: "B", eye: true },
      { x: 251, y: 178, w: 28, h: 18, token: "B", eye: true },
      ...EXPRESSION_NOSE,
      { x: 165, y: 210, w: 10, h: 10, token: "K" },
      { x: 205, y: 210, w: 10, h: 10, token: "K" },
      { x: 175, y: 220, w: 30, h: 8, token: "K" },
    ],
  },
  sad: {
    blink: false,
    clear: [...EYE_CLEAR, ...MUZZLE_CLEAR],
    details: [
      { x: 98, y: 166, w: 38, h: 28, token: "K", eye: true },
      { x: 106, y: 174, w: 22, h: 12, token: "W", eye: true },
      { x: 249, y: 166, w: 38, h: 28, token: "K", eye: true },
      { x: 257, y: 174, w: 22, h: 12, token: "W", eye: true },
      { x: 280, y: 194, w: 10, h: 22, token: "H" },
      ...EXPRESSION_NOSE,
      { x: 175, y: 220, w: 30, h: 8, token: "K" },
      { x: 168, y: 226, w: 10, h: 8, token: "K" },
      { x: 202, y: 226, w: 10, h: 8, token: "K" },
    ],
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
  | "gold-chain"
  | "party-hat"
  | "wizard-hat"
  | "mustache"
  | "eyepatch"
  | "ribbon";

/**
 * Accessory overlays use the same sparse format but are painted **above**
 * everything (including eyes). `.` is transparent.
 */
export const ACCESSORIES: Record<MascotAccessory, Overlay> = {
  // Two lenses over the eye boxes (7-12 / 20-25) joined by a thin nose bridge.
  sunglasses: {
    15: ".......KKKKKK.......KKKKKK......",
    16: ".......KWKKKKKKKKKKKKKWKKKK.....",
    17: ".......KKKKKK.......KKKKKK......",
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
    15: ".......KKKKK.......KKKKK........",
    16: ".......K...K.......K...K........",
    17: ".......KKKKK.......KKKKK........",
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
  "party-hat": {
    2:  ".................K..............",
    3:  "................KMK.............",
    4:  "...............KMMMK............",
    5:  "..............KMMMMMK...........",
    6:  ".............KKKKKKKKK..........",
  },
  "wizard-hat": {
    1:  "..................K.............",
    2:  ".................KK.............",
    3:  "................KMMK............",
    4:  "...............KMMMMK...........",
    5:  ".............KKMMMMMMK..........",
    6:  "...........KKKKKKKKKKKK.........",
  },
  mustache: {
    21: "............KK....KK............",
    22: "..........KKKKK..KKKKK..........",
    23: "...........KKKKKKKKKK...........",
  },
  eyepatch: {
    14: "......KKKKKKKKKK................",
    15: ".......KKKKKK...................",
    16: ".......KKKKKK...................",
    17: "........KKKK....................",
  },
  ribbon: {
    6:  "...KKK.KKK......................",
    7:  "....KKKKK.......................",
    8:  "...KKK.KKK......................",
  },
};

/**
 * Accessory art redrawn for the approved reference canvas. The old overlays
 * remain exported for the Studio picker, while this map is the actual render
 * geometry so every prop lands on the new cat head cleanly.
 */
const REFERENCE_ACCESSORIES: Record<MascotAccessory, readonly FaceDetail[]> = {
  sunglasses: [
    { x: 88, y: 155, w: 62, h: 48, token: "K" },
    { x: 235, y: 155, w: 62, h: 48, token: "K" },
    { x: 150, y: 170, w: 85, h: 12, token: "K" },
  ],
  glasses: [
    { x: 88, y: 152, w: 62, h: 8, token: "K" },
    { x: 88, y: 152, w: 8, h: 55, token: "K" },
    { x: 88, y: 199, w: 62, h: 8, token: "K" },
    { x: 142, y: 152, w: 8, h: 55, token: "K" },
    { x: 235, y: 152, w: 62, h: 8, token: "K" },
    { x: 235, y: 152, w: 8, h: 55, token: "K" },
    { x: 235, y: 199, w: 62, h: 8, token: "K" },
    { x: 289, y: 152, w: 8, h: 55, token: "K" },
    { x: 150, y: 172, w: 85, h: 8, token: "K" },
  ],
  bowtie: [
    { x: 155, y: 250, w: 25, h: 10, token: "K" },
    { x: 205, y: 250, w: 25, h: 10, token: "K" },
    { x: 165, y: 260, w: 55, h: 10, token: "K" },
    { x: 180, y: 250, w: 25, h: 20, token: "M" },
  ],
  headphones: [
    { x: 55, y: 75, w: 10, h: 105, token: "K" },
    { x: 320, y: 75, w: 10, h: 105, token: "K" },
    { x: 55, y: 70, w: 20, h: 10, token: "K" },
    { x: 310, y: 70, w: 20, h: 10, token: "K" },
    { x: 45, y: 165, w: 20, h: 35, token: "M" },
    { x: 320, y: 165, w: 20, h: 35, token: "M" },
  ],
  crown: [
    { x: 150, y: 10, w: 10, h: 45, token: "K" },
    { x: 190, y: 5, w: 10, h: 50, token: "K" },
    { x: 230, y: 10, w: 10, h: 45, token: "K" },
    { x: 145, y: 45, w: 100, h: 15, token: "M" },
  ],
  scarf: [
    { x: 110, y: 238, w: 170, h: 15, token: "M" },
    { x: 125, y: 253, w: 140, h: 15, token: "M" },
    { x: 205, y: 268, w: 30, h: 12, token: "M" },
  ],
  flower: [
    { x: 55, y: 65, w: 20, h: 20, token: "B" },
    { x: 75, y: 45, w: 20, h: 20, token: "B" },
    { x: 95, y: 65, w: 20, h: 20, token: "B" },
    { x: 75, y: 85, w: 20, h: 20, token: "B" },
    { x: 75, y: 65, w: 20, h: 20, token: "M" },
  ],
  cap: [
    { x: 105, y: 55, w: 175, h: 15, token: "K" },
    { x: 120, y: 35, w: 145, h: 20, token: "D" },
    { x: 140, y: 20, w: 105, h: 15, token: "D" },
    { x: 235, y: 65, w: 80, h: 15, token: "K" },
  ],
  headband: [
    { x: 85, y: 118, w: 215, h: 12, token: "K" },
    { x: 95, y: 130, w: 195, h: 15, token: "M" },
    { x: 85, y: 145, w: 215, h: 12, token: "K" },
  ],
  leaf: [
    { x: 280, y: 35, w: 15, h: 15, token: "K" },
    { x: 295, y: 20, w: 20, h: 20, token: "M" },
    { x: 315, y: 35, w: 15, h: 15, token: "M" },
    { x: 295, y: 50, w: 15, h: 20, token: "M" },
  ],
  "gold-chain": [
    { x: 145, y: 245, w: 15, h: 12, token: "M" },
    { x: 170, y: 255, w: 15, h: 12, token: "M" },
    { x: 195, y: 245, w: 15, h: 12, token: "M" },
    { x: 220, y: 255, w: 15, h: 12, token: "M" },
  ],
  "party-hat": [
    { x: 190, y: 0, w: 12, h: 12, token: "B" },
    { x: 178, y: 12, w: 35, h: 18, token: "M" },
    { x: 163, y: 30, w: 65, h: 18, token: "B" },
    { x: 150, y: 48, w: 90, h: 12, token: "K" },
  ],
  "wizard-hat": [
    { x: 205, y: 0, w: 20, h: 16, token: "K" },
    { x: 185, y: 14, w: 50, h: 18, token: "D" },
    { x: 165, y: 31, w: 80, h: 22, token: "D" },
    { x: 135, y: 53, w: 145, h: 14, token: "K" },
    { x: 202, y: 25, w: 12, h: 12, token: "W" },
  ],
  mustache: [
    { x: 135, y: 210, w: 45, h: 14, token: "K" },
    { x: 205, y: 210, w: 45, h: 14, token: "K" },
    { x: 120, y: 220, w: 60, h: 14, token: "K" },
    { x: 205, y: 220, w: 60, h: 14, token: "K" },
  ],
  eyepatch: [
    { x: 70, y: 137, w: 220, h: 10, token: "K" },
    { x: 88, y: 150, w: 66, h: 58, token: "K" },
    { x: 99, y: 160, w: 14, h: 10, token: "W" },
  ],
  ribbon: [
    { x: 50, y: 55, w: 30, h: 35, token: "B" },
    { x: 95, y: 55, w: 30, h: 35, token: "B" },
    { x: 76, y: 65, w: 25, h: 22, token: "M" },
  ],
};

/** State cues placed over opaque sunglasses; the lenses remain fully solid. */
const SUNGLASSES_STATE_MARKERS: Record<MascotState, readonly FaceDetail[]> = {
  idle: [
    { x: 98, y: 165, w: 14, h: 10, token: "W" },
    { x: 245, y: 165, w: 14, h: 10, token: "W" },
  ],
  thinking: [
    { x: 118, y: 162, w: 14, h: 10, token: "W" },
    { x: 255, y: 170, w: 14, h: 10, token: "W" },
  ],
  success: [
    { x: 102, y: 184, w: 28, h: 8, token: "W" },
    { x: 112, y: 176, w: 12, h: 8, token: "W" },
    { x: 255, y: 176, w: 12, h: 8, token: "W" },
    { x: 267, y: 184, w: 28, h: 8, token: "W" },
  ],
  error: [
    { x: 105, y: 165, w: 12, h: 10, token: "W" },
    { x: 121, y: 175, w: 12, h: 10, token: "W" },
    { x: 105, y: 185, w: 12, h: 10, token: "W" },
    { x: 121, y: 165, w: 12, h: 10, token: "W" },
    { x: 105, y: 175, w: 12, h: 10, token: "W" },
    { x: 121, y: 185, w: 12, h: 10, token: "W" },
    { x: 250, y: 165, w: 12, h: 10, token: "W" },
    { x: 266, y: 175, w: 12, h: 10, token: "W" },
    { x: 250, y: 185, w: 12, h: 10, token: "W" },
    { x: 266, y: 165, w: 12, h: 10, token: "W" },
    { x: 250, y: 175, w: 12, h: 10, token: "W" },
    { x: 266, y: 185, w: 12, h: 10, token: "W" },
  ],
  sleeping: [
    { x: 102, y: 184, w: 32, h: 8, token: "L" },
    { x: 250, y: 184, w: 32, h: 8, token: "L" },
  ],
  angry: [
    { x: 102, y: 165, w: 30, h: 8, token: "W" },
    { x: 112, y: 173, w: 25, h: 8, token: "W" },
    { x: 250, y: 173, w: 25, h: 8, token: "W" },
    { x: 260, y: 165, w: 30, h: 8, token: "W" },
  ],
  wink: [
    { x: 102, y: 184, w: 32, h: 8, token: "W" },
    { x: 250, y: 165, w: 26, h: 22, token: "W" },
  ],
  surprised: [
    { x: 103, y: 165, w: 24, h: 24, token: "W" },
    { x: 250, y: 165, w: 24, h: 24, token: "W" },
  ],
  love: [
    { x: 100, y: 168, w: 16, h: 18, token: "B" },
    { x: 120, y: 168, w: 16, h: 18, token: "B" },
    { x: 247, y: 168, w: 16, h: 18, token: "B" },
    { x: 267, y: 168, w: 16, h: 18, token: "B" },
  ],
  sad: [
    { x: 102, y: 180, w: 30, h: 8, token: "W" },
    { x: 250, y: 180, w: 30, h: 8, token: "W" },
  ],
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
  /** Expression marker drawn above an opaque eye accessory (e.g. sunglasses). */
  top?: boolean;
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
  canPaint?: (x: number, y: number, current: string) => boolean,
): void {
  for (const [rowKey, row] of Object.entries(overlay)) {
    const y = Number(rowKey);
    for (let x = 0; x < row.length && x < GRID_SIZE; x += 1) {
      const ch = row[x];
      if (ch === "." || !isPixelToken(ch)) continue;
      if (canPaint && !canPaint(x, y, grid[y][x])) continue;
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
  const rects: MascotRect[] = [];

  // First paint the approved template exactly as authored. This is the one
  // base head every cat shares; only palette tokens differ per variant.
  for (let y = 0; y < REFERENCE_CAT_GRID.length; y += 1) {
    const row = REFERENCE_CAT_GRID[y];
    for (let x = 0; x < row.length; x += 1) {
      const token = row[x];
      if (!isPixelToken(token)) continue;
      const isEye =
        (y === 7 && (x === 5 || x === 6 || x === 12 || x === 13)) ||
        (y === 8 && (x === 5 || x === 6 || x === 12 || x === 13));
      rects.push({
        x: x * REFERENCE_CELL,
        y: (y + 1) * REFERENCE_CELL,
        w: REFERENCE_CELL,
        h: REFERENCE_CELL,
        fill: tokenColor(token, palette),
        eye: isEye,
        accessory: false,
      });
    }
  }

  const grid: string[][] = CAT_GRID.map((row) => row.split(""));

  // Skin markings sit beneath the expression / eyes.
  if (markings) {
    applyOverlay(
      grid,
      markings,
      undefined,
      (x, y, current) =>
        isPixelToken(current) &&
        current !== "K" &&
        !FACE_PROTECTED_CELL_SET.has(`${x}:${y}`),
    );
  }

  const expr = EXPRESSIONS[state];

  // Breed markings retain their existing 32×32 authoring format. Project them
  // onto the reference canvas, but only emit cells changed by the overlay.
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const token = grid[y][x];
      if (token === CAT_GRID[y][x] || !isPixelToken(token)) continue;
      rects.push({
        x: LEGACY_REFERENCE_X_OFFSET + x * LEGACY_REFERENCE_CELL,
        y: y * LEGACY_REFERENCE_CELL,
        w: LEGACY_REFERENCE_CELL,
        h: LEGACY_REFERENCE_CELL,
        fill: tokenColor(token, palette),
        eye: false,
        accessory: false,
      });
    }
  }

  // Re-apply the source SVG's finer pass after markings. The idle cat now
  // matches the approved standalone SVG rather than an approximation of it.
  for (const detail of REFERENCE_FACE_DETAILS) {
    rects.push({
      x: detail.x,
      y: detail.y,
      w: detail.w,
      h: detail.h,
      fill: tokenColor(detail.token, palette),
      eye: detail.eye ?? false,
      accessory: false,
    });
  }

  // Non-idle states replace the common face. Only opaque sunglasses hide eye
  // pixels; transparent glasses keep the full eye expression visible.
  if (expr.details) {
    const hasOpaqueEyeWear = accessories.includes("sunglasses");
    for (const clear of expr.clear ?? []) {
      if (hasOpaqueEyeWear && clear !== MUZZLE_CLEAR[0]) continue;
      rects.push({ ...clear, fill: tokenColor(clear.token, palette), eye: false, accessory: false });
    }
    for (const detail of expr.details) {
      if (hasOpaqueEyeWear && detail.eye) continue;
      rects.push({
        x: detail.x,
        y: detail.y,
        w: detail.w,
        h: detail.h,
        fill: tokenColor(detail.token, palette),
        eye: detail.eye ?? false,
        accessory: false,
      });
    }
  }

  for (const accessory of accessories) {
    for (const detail of REFERENCE_ACCESSORIES[accessory]) {
      rects.push({
        x: detail.x,
        y: detail.y,
        w: detail.w,
        h: detail.h,
        fill: tokenColor(detail.token, palette),
        eye: false,
        accessory: true,
      });
    }
  }

  // Opaque sunglasses get state-specific marks after the accessory layer;
  // this preserves solid lenses without making Sleep/Happy/Oops look idle.
  if (accessories.includes("sunglasses")) {
    for (const detail of SUNGLASSES_STATE_MARKERS[state]) {
      rects.push({
        x: detail.x,
        y: detail.y,
        w: detail.w,
        h: detail.h,
        fill: tokenColor(detail.token, palette),
        eye: false,
        accessory: false,
        top: true,
      });
    }
  }

  return rects;
}

// ---------------------------------------------------------------------------
// Standalone SVG generation (consumed by scripts/gen-mascot-svg.ts)
// ---------------------------------------------------------------------------

const IDLE_STYLE = `  <style>
    .eyes { transform-box: fill-box; transform-origin: 50% 50%; animation: cat-blink 5.2s ease-in-out infinite }

    @keyframes cat-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(0.12) } 97% { transform: scaleY(1) } }

    @media (prefers-reduced-motion: reduce) {
      .eyes { animation: none }
    }
  </style>
`;

export interface SvgOptions {
  ariaLabel: string;
  /** When true, emits the blink animation + eye classes. */
  animated?: boolean;
  /** Per-skin breed markings. */
  markings?: Overlay;
  /** Optional props painted above the cat face. */
  accessories?: readonly MascotAccessory[];
  /** Expression to preserve in exported custom cats. */
  state?: MascotState;
}

function rectTag(r: MascotRect, indent: string, withEyeClass: boolean): string {
  const cls = withEyeClass && r.eye ? ` class="eyes"` : "";
  return `${indent}<rect${cls} x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" />`;
}

/** Render a standalone `.svg` string for a palette (hex-hardcoded). */
export function toSvg(palette: MascotPalette, opts: SvgOptions): string {
  const rects = buildRects(palette, {
    state: opts.state ?? "idle",
    accessories: opts.accessories,
    markings: opts.markings,
  });
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MASCOT_VIEWBOX_WIDTH} ${MASCOT_VIEWBOX_HEIGHT}" width="${MASCOT_VIEWBOX_WIDTH}" height="${MASCOT_VIEWBOX_HEIGHT}" role="img" aria-label="${opts.ariaLabel}" shape-rendering="crispEdges">`;

  if (opts.animated) {
    const body = rects.map((r) => rectTag(r, "    ", true)).join("\n");
    return `${open}\n${IDLE_STYLE}\n${body}\n</svg>\n`;
  }

  const body = rects.map((r) => rectTag(r, "  ", false)).join("\n");
  return `${open}\n${body}\n</svg>\n`;
}
