"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getLocalizedPathPair } from "@/lib/seo/routes";

/**
 * Language switcher (R9 Phase A spec §7 — final decision). Only ever
 * renders a link to the other locale when the route registry confirms
 * a real pair exists; otherwise the other-language slot is omitted
 * entirely — never a disabled placeholder, never a fallback to the
 * locale homepage. The current language is always shown as plain,
 * non-link text.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const pair = getLocalizedPathPair(pathname);
  const isArabic = pair ? pair.ar === pathname : pathname.startsWith("/ar");
  const currentLabel = isArabic ? "العربية" : "EN";
  const otherHref = pair ? (isArabic ? pair.en : pair.ar) : null;

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span aria-current="true" className="text-foreground">
        {currentLabel}
      </span>
      {otherHref && (
        <>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link
            href={otherHref}
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {isArabic ? "English" : "العربية"}
          </Link>
        </>
      )}
    </div>
  );
}
