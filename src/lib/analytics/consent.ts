"use client";

import { buildConsentCookieString } from "./consent-cookie";

/**
 * Analytics consent state — spec §27, Phase 5 brief §7. `localStorage`
 * remains the client's source of truth (`hasAnalyticsConsent()` below
 * is what actually gates every `trackEvent()` call in `events.ts`).
 *
 * R8.1C privacy audit: `setConsent()` now also mirrors the choice into
 * a plain cookie (`consent-cookie.ts`), solely so `src/proxy.ts` —
 * server-side middleware, which cannot read `localStorage` — can gate
 * the non-essential attribution cookies it sets (`attr_first`,
 * `attr_last`, `book_origin`) on the same choice. This does not change
 * what gates analytics events themselves.
 */

const STORAGE_KEY = "consent:analytics:v1";

export type ConsentStatus = "granted" | "denied" | "unset";

function safeLocalStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    // Private browsing / storage disabled — fail safe to "unset".
    return null;
  }
}

export function getConsent(): ConsentStatus {
  const storage = safeLocalStorage();
  const value = storage?.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : "unset";
}

export function setConsent(status: "granted" | "denied"): void {
  safeLocalStorage()?.setItem(STORAGE_KEY, status);
  if (typeof document !== "undefined") {
    document.cookie = buildConsentCookieString(status);
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "granted";
}

/**
 * Re-mirrors an already-made choice into the cookie, without touching
 * `localStorage` or showing the banner. Covers visitors who chose
 * before the cookie mirror existed (setConsent() only runs from a
 * banner click) — without this, they'd keep `granted` in localStorage
 * (banner correctly stays hidden, analytics events keep firing) but
 * `src/proxy.ts` would never see a "granted" cookie and would silently
 * stop refreshing their attribution cookies. Safe to call on every
 * mount: a no-op once the mirror already matches.
 */
export function resyncConsentCookie(): void {
  const status = getConsent();
  if (status !== "unset" && typeof document !== "undefined") {
    document.cookie = buildConsentCookieString(status);
  }
}
