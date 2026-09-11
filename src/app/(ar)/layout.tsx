import type { ReactNode } from "react";
import { notoSansArabic } from "@/lib/fonts/arabic";
import { RootProviders } from "@/components/layout/RootProviders";

/**
 * The genuine Arabic root — <html lang="ar" dir="rtl"> is now set at the
 * true document root (not a wrapper element inside a shared en-rooted
 * document, per the earlier Phase A interim approach). --font-fraunces
 * and --font-inter are still the CSS custom-property names to override
 * (not --font-display/--font-sans): Tailwind v4 inlines those exact
 * variable names into the generated .font-display/.font-sans utility
 * classes at build time, so overriding anything else is a no-op — this
 * part of the mechanism is unchanged from the original font fix, only
 * WHERE it's applied has moved (the true <html>/<body> now, instead of
 * an inner wrapper div that other content could render outside of).
 */
const arabicFontVars = {
  "--font-fraunces": "var(--font-noto-sans-arabic)",
  "--font-inter": "var(--font-noto-sans-arabic)",
} as React.CSSProperties;

export default function ArabicRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${notoSansArabic.variable} h-full font-sans`}
      style={arabicFontVars}
    >
      <body className="h-full antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
