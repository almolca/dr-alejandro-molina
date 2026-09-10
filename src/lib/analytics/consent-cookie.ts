/**
 * Cookie name/lifetime mirroring the client-only `localStorage` consent
 * choice (see `consent.ts`) into a plain cookie — R8.1C privacy audit.
 *
 * `src/proxy.ts` runs server-side (Edge middleware) and cannot read
 * `localStorage`, so it has no way to know the visitor's consent choice
 * when deciding whether to set non-essential attribution cookies
 * (`attr_first`, `attr_last`, `book_origin`). Mirroring the choice into
 * a cookie gives the server a value to check without changing
 * `localStorage`'s role as the client's source of truth for gating
 * analytics events (`hasAnalyticsConsent()` in `consent.ts` is
 * unchanged).
 *
 * Deliberately its own file, not exported from `consent.ts` directly:
 * `consent.ts` is `"use client"`, and importing a client-directive
 * module into Edge middleware is unnecessary risk for a two-constant
 * value. This file has no directive and no browser-only reference, so
 * it's safe to import from both `consent.ts` (client) and `proxy.ts`
 * (Edge), matching the existing pattern in `attribution/cookies.ts`.
 */
export const CONSENT_COOKIE_NAME = "cookie_consent";
export const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days — matches the other first-party cookies' lifetime

/**
 * Pure cookie-string builder, kept separate from the `document.cookie =`
 * assignment in `consent.ts` so this can be unit tested without a DOM —
 * same pure/impure split this codebase already uses for the attribution
 * cookies (`attribution/cookies.ts`'s `serializeTouch`/`parseAttributionCookie`
 * vs. the actual `response.cookies.set()` call in `proxy.ts`).
 *
 * R8.1D: takes `secure` as an explicit parameter rather than reading
 * `window.location` itself, so this file stays free of browser-only
 * references (its own design constraint above, for safe import from
 * `proxy.ts`) — `consent.ts` (the only caller) decides `secure` from
 * `window.location.protocol`. A `Secure` cookie is silently *not set at
 * all* by the browser over plain `http://`, which is exactly how local
 * dev serves this app — so this must stay conditional, never hardcoded
 * true, or `next dev` would break with no error, just a cookie that
 * never appears.
 */
export function buildConsentCookieString(
  status: "granted" | "denied",
  options?: { secure?: boolean },
): string {
  const secure = options?.secure ? "; Secure" : "";
  return `${CONSENT_COOKIE_NAME}=${status}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
