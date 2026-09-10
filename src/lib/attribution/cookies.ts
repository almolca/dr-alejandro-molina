import type { Source } from "@/lib/domain/source";

/**
 * First-party attribution cookies — R7.2 brief §9. Deliberately simple:
 * two cookies, JSON-encoded, no server-side session store. "First
 * touch" is set once and never overwritten; "last touch" is overwritten
 * only on a fresh marketing entry (see `src/proxy.ts`), not on every
 * internal navigation.
 */
export const ATTRIBUTION_COOKIE = {
  first: "attr_first",
  last: "attr_last",
} as const;

export const ATTRIBUTION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export type AttributionTouch = {
  source: Source;
  page: string;
  at: string;
};

/**
 * Next.js's cookie APIs (`NextResponse.cookies.set` / `NextRequest.cookies.get`)
 * already URI-encode/decode values once, automatically, on their own —
 * verified empirically against this Next 16 build (see commit history).
 * Serialize/parse here only handle JSON, not URI encoding, to avoid a
 * redundant second encoding layer.
 */
export function serializeTouch(touch: AttributionTouch): string {
  return JSON.stringify(touch);
}

export function parseAttributionCookie(raw: string | undefined | null): AttributionTouch | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.source === "string" &&
      typeof parsed.page === "string" &&
      typeof parsed.at === "string"
    ) {
      return parsed as AttributionTouch;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Origin-page capture — R7.2 UX addendum. `leads.referrer` (captured
 * when the lead form POSTs) always resolves to `/book` itself, since
 * that's the page the POST originates from — never a reliable "which
 * marketing page linked here" signal. This cookie is set instead, at
 * `/book`'s initial GET (src/proxy.ts), from that request's own
 * Referer header — a short-lived, plain-path cookie (no JSON), just
 * long enough to survive filling out the form.
 */
export const BOOK_ORIGIN_COOKIE = "book_origin";
export const BOOK_ORIGIN_MAX_AGE_SECONDS = 60 * 30; // 30 minutes

export function parseBookOrigin(raw: string | undefined | null): string | null {
  return raw && raw.length > 0 ? raw : null;
}
