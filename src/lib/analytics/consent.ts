"use client";

/**
 * Analytics consent state — spec §27, Phase 5 brief §7.
 *
 * No analytics provider is wired up yet (see `events.ts`), so nothing
 * currently reads this to decide whether to fire a real request. This
 * exists so that decision point already exists and is already tested
 * before GA4/Vercel Analytics is ever added — adding a provider later
 * should mean "call `hasAnalyticsConsent()` before sending," not "now
 * go build a consent system too."
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
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "granted";
}
