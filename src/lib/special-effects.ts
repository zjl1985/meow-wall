export type HeroSpecialEffect = "nicole" | "zero";

export function getHeroSpecialEffect(catId: string): HeroSpecialEffect | null {
  if (catId === "nicole" || catId === "zero") return catId;
  return null;
}
