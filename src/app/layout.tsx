import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
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

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://meow-wall.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${copy.site.name} · ${copy.site.tagline}`,
  description: copy.site.tagline,
  openGraph: {
    title: `${copy.site.name} · Which cat today?`,
    description: "A wonderfully useless wall of pixel cats, with a studio for making your own.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Meow Wall pixel cat gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${copy.site.name} · Which cat today?`,
    description: "A wonderfully useless wall of pixel cats, with a studio for making your own.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="mobile-safe-bottom flex min-h-full flex-col md:pb-0">
        <ThemeProvider>
          <AwayTitle />
          <SiteNav />
          <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-14 sm:px-6 md:pb-20">
            {children}
          </main>
          <SiteFooter />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
