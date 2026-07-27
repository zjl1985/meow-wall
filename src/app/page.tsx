import { CatHero } from "@/components/cat-hero";
import { CatWall } from "@/components/cat-wall";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14 py-8">
      <CatHero />
      <CatWall />
    </div>
  );
}
