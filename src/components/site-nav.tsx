"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Mascot } from "@/components/mascot/mascot";
import { Button } from "@/components/ui/button";
import { DEFAULT_PALETTE } from "@/components/mascot/mascot-art";
import { GitHubMark } from "@/components/github-mark";
import { REPO_URL, copy } from "@/lib/copy";

const LINKS = [
  { href: "/", label: copy.nav.wall },
  { href: "/studio", label: copy.nav.studio },
  { href: "/says", label: copy.nav.says },
  { href: "/favorites", label: copy.nav.favorites },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[oklch(0.14_0.01_80_/_0.72)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <Mascot size={32} palette={DEFAULT_PALETTE} animated title={copy.site.name} />
          <span className="font-heading text-sm font-semibold tracking-[0.18em] uppercase">
            {copy.site.name}
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-1">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Button
                key={href}
                render={<Link href={href} />}
                variant={active ? "secondary" : "ghost"}
                className={
                  active
                    ? "tracking-wide"
                    : "text-muted-foreground tracking-wide"
                }
              >
                {label}
              </Button>
            );
          })}
          <Button
            variant="outline"
            render={
              <a href={REPO_URL} target="_blank" rel="noreferrer" />
            }
          >
            <GitHubMark />
            {copy.site.repo}
          </Button>
        </div>
      </nav>
    </header>
  );
}
