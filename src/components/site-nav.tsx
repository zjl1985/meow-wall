"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutGrid, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";

const LINKS = [
  { href: "/", label: copy.nav.wall, icon: LayoutGrid },
  { href: "/says", label: copy.nav.says, icon: MessageCircle },
  { href: "/favorites", label: copy.nav.favorites, icon: Heart },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🐱</span>
          <span className="font-heading clay-text-shadow text-xl font-extrabold">
            {copy.site.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
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
