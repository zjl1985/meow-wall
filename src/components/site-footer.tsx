import { GitHubMark } from "@/components/github-mark";
import { REPO_URL, copy } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
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
