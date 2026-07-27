"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutGrid, MessageCircle, Sparkles } from "lucide-react";

import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { DEFAULT_PALETTE } from "@/components/mascot/mascot-art";
import { copy } from "@/lib/copy";

const LINKS = [
  { href: "/", label: copy.nav.wall, icon: LayoutGrid },
  { href: "/studio", label: copy.nav.studio, icon: Sparkles },
  { href: "/says", label: copy.nav.says, icon: MessageCircle },
  { href: "/favorites", label: copy.nav.favorites, icon: Heart },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Mascot size={36} palette={DEFAULT_PALETTE} animated title="喵喵墙" />
          <span className="font-heading clay-text-shadow text-xl font-extrabold">
            {copy.site.name}
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              render={<Link href={href} />}
              variant={pathname === href ? "default" : "ghost"}
            >
              <Icon />
              {label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
}
