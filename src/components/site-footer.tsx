"use client";

import { GitHubMark } from "@/components/github-mark";
import { useCopy } from "@/hooks/use-copy";
import { REPO_URL } from "@/lib/copy";

export function SiteFooter() {
  const copy = useCopy();
  return (
    <footer className="section-rule border-t">
      <div className="text-muted-foreground mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{copy.site.footer}</p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <GitHubMark className="size-3.5" />
          {REPO_URL.replace("https://", "")}
        </a>
      </div>
    </footer>
  );
}
