import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";

import { AwayTitle } from "@/components/away-title";
import { SiteNav } from "@/components/site-nav";
import { Toaster } from "@/components/ui/sonner";
import { copy } from "@/lib/copy";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${copy.site.name} · 像素猫猫头工坊`,
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
      className={`${nunito.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AwayTitle />
        <SiteNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
          {children}
        </main>
        <footer className="text-muted-foreground px-6 pb-8 text-center text-xs">
          {copy.site.footer}
        </footer>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
