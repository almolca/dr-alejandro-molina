import { Noto_Sans_Arabic } from "next/font/google";

/**
 * Single shared `next/font` instance for Arabic body text.
 *
 * `next/font`'s `variable` option scopes the `--font-noto-sans-arabic`
 * custom property to whichever element the resulting `.variable`
 * className is applied to (and that element's descendants) — it is
 * NOT registered at `:root`/`<html>` the way `--font-fraunces`/
 * `--font-inter` are in `src/app/layout.tsx` (those apply their
 * `.variable` classNames to `<html>` itself). Confirmed live: a
 * sibling element outside `src/app/ar/layout.tsx`'s wrapper subtree
 * sees `--font-noto-sans-arabic` as unset (`getComputedStyle(...)
 * .getPropertyValue('--font-noto-sans-arabic')` returns `""`), so
 * `var(--font-noto-sans-arabic)` there resolves to nothing rather than
 * the Arabic font.
 *
 * Extracted here (instead of instantiating a second `Noto_Sans_Arabic(...)`
 * call, or importing the object from `src/app/ar/layout.tsx` directly)
 * so both `src/app/ar/layout.tsx` and `src/components/ui/ConsentBanner.tsx`
 * apply the exact same font instance's `.variable` class on their own
 * root element — each one independently brings `--font-noto-sans-arabic`
 * into scope for its own subtree, rather than relying on inheriting it
 * from the other.
 */
export const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});
