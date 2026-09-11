import type { CSSProperties, ReactNode } from "react";
import { Noto_Sans_Arabic } from "next/font/google";

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
 * Font override mechanism: Tailwind v4's `@theme inline` block
 * (`src/styles/tokens.css`) defines `--font-display: var(--font-fraunces), ...`
 * and `--font-sans: var(--font-inter), ...`, and the Tailwind build
 * inlines those RESOLVED values directly into the generated
 * `.font-display`/`.font-sans` utility CSS at build time — the
 * generated rules read `--font-fraunces`/`--font-inter` directly, never
 * `--font-display`/`--font-sans` at runtime. So overriding
 * `--font-display`/`--font-sans` here would be a no-op; instead this
 * wrapper overrides `--font-fraunces`/`--font-inter` themselves (see
 * `arabicFontVars` below), which the generated utility CSS actually
 * reads. The wrapper also needs its own explicit `font-sans` class:
 * `<body>` (root layout) already computed its `font-family` from the
 * pre-override variable value, and body-level text inherits that
 * already-computed value rather than re-reading the CSS variable fresh,
 * so this element must re-apply `font-sans` to force its subtree to
 * recompute `font-family` from the now-overridden variable.
 *
 * `display: contents` (via the `contents` class) removes this element
 * from the layout/box tree entirely, so it can't interrupt the
 * `h-full`/`min-h-full` height chain from `<body>` down to `PageShell` —
 * `dir`/`lang`/CSS custom properties still inherit to children exactly
 * as they would from a normal element.
 *
 * This layout deliberately does NOT render its own `<ConsentBanner>`,
 * `<JsonLd>`, or `<MotionProvider>` — `src/app/layout.tsx` already
 * renders exactly one instance of each for every route, `/ar` included
 * (nested layouts wrap through the existing root layout; they don't
 * replace it). Re-rendering them here would duplicate them, not swap
 * them: two consent banners, two identical JSON-LD schema blocks. The
 * root layout's `<ConsentBanner />` self-detects the `/ar` locale via
 * `usePathname()` instead, and its physician JSON-LD is locale-invariant
 * (same entity, nothing to localize) so one instance already covers
 * `/ar` too.
 */
const arabicFontVars = {
  "--font-fraunces": "var(--font-noto-sans-arabic)",
  "--font-inter": "var(--font-noto-sans-arabic)",
} as CSSProperties;

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <div
      lang="ar"
      dir="rtl"
      className={`${notoSansArabic.variable} contents font-sans`}
      style={arabicFontVars}
    >
      {children}
    </div>
  );
}
