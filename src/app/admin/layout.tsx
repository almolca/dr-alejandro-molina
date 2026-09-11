import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { rootMetadata } from "@/lib/seo/metadata";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/**
 * /admin's own root (upgraded in place from a thin pass-through that
 * used to inherit the single shared app/layout.tsx — that shared root no
 * longer exists after the multi-root migration, so admin now owns its
 * own <html>/<body> exactly like (en) and (ar) do).
 *
 * Combines the site's base metadata (title template, OG defaults — for
 * parity with what admin used to inherit from the old shared root) with
 * the noindex override this file already had, in one export instead of
 * two, since there's no longer an ancestor root to inherit the base
 * metadata from automatically.
 *
 * Uses RootProviders (JsonLd/ConsentBanner/MotionProvider) purely to
 * preserve exact pre-migration behavior — the old shared root rendered
 * all three unconditionally for every route including /admin. None of
 * the three is inherently required by an internal, authenticated,
 * noindex admin tool; splitting admin onto a narrower provider set is a
 * legitimate future cleanup, intentionally not done here.
 */
export const metadata: Metadata = {
  ...rootMetadata,
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="h-full font-sans antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
