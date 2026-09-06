import { hasAnalyticsConsent } from "./consent";

/**
 * Analytics event contract — spec §26, §27.
 *
 * IMPORTANT: no analytics provider is wired up yet. Spec §27 requires
 * GA4 to be added only after cookie/privacy implementation, and no
 * medical symptom data or identifiable health information may ever be
 * tracked. This module exists so every future call site (CTA buttons,
 * treatment page engagement) shares one typed, deliberately narrow
 * contract from day one, instead of ad-hoc tracking calls being added
 * per page later.
 */

export type BookingClickProperties = {
  /** Path of the page the click originated from, e.g. "/erectile-dysfunction". */
  source_page: string;
  /** Service/treatment context, if the CTA is scoped to one. */
  service?: string;
  /** Where on the page the CTA lives, e.g. "hero", "sticky-mobile-cta", "footer". */
  cta_position: string;
};

type AnalyticsEvent =
  | { name: "nmc_booking_click"; properties: BookingClickProperties }
  | { name: "physician_profile_click"; properties: { source_page: string } };

/**
 * No-op until a provider (GA4 / Vercel Analytics) is wired up per spec
 * §27. Kept as a single choke point so the eventual integration is a
 * one-file change, and so nothing upstream needs to know whether a
 * provider is connected yet.
 *
 * Already consent-gated (Phase 5, `lib/analytics/consent.ts`) even
 * though there's nothing to gate yet: the dev-only console log below
 * doesn't send data anywhere, so it logs regardless of consent (useful
 * for verifying events fire correctly during development) — but the
 * comment marks exactly where a real provider call must be added
 * *inside* the consent check, not next to it, so that requirement
 * can't be missed when a provider is finally wired up.
 */
export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics:noop]", event.name, event.properties);
  }

  if (!hasAnalyticsConsent()) return;

  // A real analytics provider call goes here, e.g.:
  //   window.gtag?.("event", event.name, event.properties);
  // Nothing is sent today — this function has no provider wired up.
}
