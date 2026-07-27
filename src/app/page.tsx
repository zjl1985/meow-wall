import { CatHero } from "@/components/cat-hero";
import { CatWall } from "@/components/cat-wall";
import { SpecialCats } from "@/components/special-cats";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <CatHero />
      <SpecialCats />
      <CatWall />
    </div>
  );
}
