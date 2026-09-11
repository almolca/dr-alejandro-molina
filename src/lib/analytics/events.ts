import { hasAnalyticsConsent } from "./consent";
import { getAnonymousSessionId } from "./session";

/**
 * Analytics event contract — R7.2 brief §11. First-party provider:
 * `/api/events` inserts into Supabase `analytics_events` (see
 * docs/patient-acquisition.md for the platform decision). Every
 * property here is allow-listed and non-PII by construction — there is
 * no field for name/email/phone/medical data anywhere in this type, so
 * it's structurally impossible to pass PII through this contract.
 */
export type BookingClickProperties = {
  /** Path of the page the click originated from, e.g. "/erectile-dysfunction". */
  source_page: string;
  /** Service/treatment context, if the CTA is scoped to one. */
  service?: string;
  /** Where on the page the CTA lives, e.g. "hero", "sticky-mobile-cta", "footer". */
  cta_position: string;
};

type FunnelEventProperties = {
  path: string;
  service?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

type AnalyticsEvent =
  | { name: "nmc_booking_click"; properties: BookingClickProperties }
  | { name: "physician_profile_click"; properties: { source_page: string } }
  | { name: "page_view"; properties: FunnelEventProperties }
  | { name: "book_cta_click"; properties: BookingClickProperties }
  | { name: "book_page_view"; properties: FunnelEventProperties }
  | { name: "lead_submit_success"; properties: FunnelEventProperties }
  | { name: "lead_submit_error"; properties: FunnelEventProperties };

/**
 * Consent-gated (brief §23/§27's predecessor requirement). Posts to
 * `/api/events` with `keepalive: true` so the request can outlive a
 * page navigation (e.g. the NMC redirect). Never throws into caller
 * code — a dropped analytics event must never break the booking flow.
 */
export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event.name, event.properties);
  }

  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined") return;

  const properties = event.properties as Record<string, string | undefined>;
  const path = "path" in properties ? properties.path : properties.source_page;
  const locale = path?.startsWith("/ar") ? "ar" : "en";

  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name: event.name,
        anonymousSessionId: getAnonymousSessionId(),
        path,
        locale,
        serviceInterest: properties.service,
        source: properties.source,
        utmSource: properties.utm_source,
        utmMedium: properties.utm_medium,
        utmCampaign: properties.utm_campaign,
      }),
    }).catch(() => {
      // Analytics is best-effort — never surface a network failure to the caller.
    });
  } catch {
    // Same rationale: swallow synchronous errors (e.g. fetch unavailable).
  }
}
