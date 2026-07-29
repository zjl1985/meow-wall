"use client";

import Link from "next/link";
import { Cat, Heart, Languages, MessageCircle, Palette } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Mascot } from "@/components/mascot/mascot";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_PALETTE } from "@/components/mascot/mascot-art";
import { GitHubMark } from "@/components/github-mark";
import { REPO_URL } from "@/lib/copy";
import { setLocale, useCopy, useLocale } from "@/hooks/use-copy";

export function SiteNav() {
  const pathname = usePathname();
  const copy = useCopy();
  const locale = useLocale();
  const links = [
    { href: "/", label: copy.nav.wall, icon: Cat },
    { href: "/studio", label: copy.nav.studio, icon: Palette },
    { href: "/says", label: copy.nav.says, icon: MessageCircle },
    { href: "/favorites", label: copy.nav.favorites, icon: Heart },
  ] as const;
  const nextLocale = locale === "en" ? "zh" : "en";
  const languageLabel =
    nextLocale === "zh" ? copy.nav.switchToChinese : copy.nav.switchToEnglish;

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = `${copy.site.name} · ${copy.site.tagline}`;
  }, [copy.site.name, copy.site.tagline, locale]);

  return (
    <>
      <header className="section-rule sticky top-0 z-40 border-b bg-[oklch(0.985_0.015_86_/_0.78)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-4 py-3 sm:px-6 md:py-4">
          <Link
            href="/"
            className="press-feedback group flex min-h-11 items-center gap-2.5 rounded-xl pr-2"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
              <Mascot
                size={32}
                palette={DEFAULT_PALETTE}
                animated
                title={copy.site.name}
              />
            </span>
            <span>
              <span className="font-heading block text-sm font-bold tracking-[0.13em] uppercase">
                {copy.site.name}
              </span>
              <span className="text-muted-foreground hidden text-[10px] tracking-wide sm:block">
                {copy.site.miniTagline}
              </span>
            </span>
          </Link>
          <div className="hidden items-center justify-end gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={buttonVariants({
                    variant: active ? "secondary" : "ghost",
                    className: active
                      ? "tracking-wide"
                      : "text-muted-foreground tracking-wide",
                  })}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setLocale(nextLocale)}
              aria-label={languageLabel}
              className={buttonVariants({ variant: "ghost" })}
            >
              <Languages />
              {nextLocale === "zh" ? "中文" : "EN"}
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={copy.site.repo}
              className={buttonVariants({ variant: "outline" })}
            >
              <GitHubMark />
              <span className="hidden lg:inline">{copy.site.repo}</span>
            </a>
          </div>
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setLocale(nextLocale)}
              aria-label={languageLabel}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Languages />
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={copy.site.repo}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <GitHubMark />
            </a>
          </div>
        </nav>
      </header>

      <nav
        aria-label={copy.nav.mobile}
        className="section-rule fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 grid grid-cols-4 rounded-[1.35rem] border bg-[oklch(0.995_0.008_85_/_0.9)] p-1.5 shadow-[0_12px_36px_oklch(0.35_0.04_35_/_0.16)] backdrop-blur-xl md:hidden"
      >
        {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`press-feedback flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-semibold ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
      </nav>
    </>
  );
}
