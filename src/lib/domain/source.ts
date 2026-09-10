/**
 * Normalized acquisition-source enum — R7.2 brief §8/§30. Every UTM
 * source or referrer this site sees is mapped down to one of these
 * values by `lib/attribution/normalize-source.ts`; nothing downstream
 * (cookies, `leads`, `analytics_events`, the admin dashboard) ever sees
 * a raw, un-normalized source string.
 */
export const SOURCES = [
  "google_organic",
  "google_business",
  "direct",
  "instagram",
  "mens_health",
  "doctoralia",
  "top_doctors",
  "nmc",
  "referral",
  "other",
] as const;

export type Source = (typeof SOURCES)[number];

export function isSource(value: string): value is Source {
  return (SOURCES as readonly string[]).includes(value);
}
