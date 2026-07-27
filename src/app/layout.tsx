import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import { AwayTitle } from "@/components/away-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Toaster } from "@/components/ui/sonner";
import { copy } from "@/lib/copy";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${copy.site.name} · ${copy.site.tagline}`,
  description: copy.site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AwayTitle />
        <SiteNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20">
          {children}
        </main>
        <SiteFooter />
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
