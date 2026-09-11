import type { CSSProperties, ReactNode } from "react";
import { Noto_Sans_Arabic } from "next/font/google";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { personSchema, physicianSchema } from "@/lib/seo/json-ld";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

/**
 * R9 Phase A spec §4: `lang`/`dir` are set here, on a wrapper just
 * inside `<body>` — not on the true `<html>` root. `<html>` (defined
 * once in `src/app/layout.tsx`) always stays `lang="en"`; that's an
 * accepted, documented trade-off (see spec §4/§14) that avoids the real
 * costs of Next.js's multiple-root-layouts pattern (touching `/admin`,
 * an experimental `globalNotFound` flag, full-reload navigation between
 * `(marketing)`/`(legal)`). `dir`/`lang` on this element still cascade
 * correctly to every descendant for RTL rendering and assistive tech.
 *
 * `display: contents` (via the `contents` class) removes this element
 * from the layout/box tree entirely, so it can't interrupt the
 * `h-full`/`min-h-full` height chain from `<body>` down to `PageShell` —
 * `dir`/`lang`/CSS custom properties still inherit to children exactly
 * as they would from a normal element.
 */
const arabicFontVars = {
  "--font-display": "var(--font-noto-sans-arabic)",
  "--font-sans": "var(--font-noto-sans-arabic)",
} as CSSProperties;

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className={`${notoSansArabic.variable} contents`} style={arabicFontVars}>
      <JsonLd data={[personSchema(), physicianSchema()]} />
      <MotionProvider>
        <ConsentBanner locale="ar" />
        {children}
      </MotionProvider>
    </div>
  );
}
