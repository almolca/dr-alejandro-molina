import { SOURCES, type Source } from "@/lib/domain/source";

/**
 * Maps a raw `utm_source` value to a normalized `Source`. Brief §8/§30 —
 * do not depend only on referrer, but utm_source (when present) always
 * wins over referrer-based inference below.
 */
const UTM_SOURCE_MAP: Record<string, Source> = {
  google_business: "google_business",
  "google-business": "google_business",
  gbp: "google_business",
  google: "google_organic",
  instagram: "instagram",
  ig: "instagram",
  mens_health: "mens_health",
  menshealth: "mens_health",
  doctoralia: "doctoralia",
  top_doctors: "top_doctors",
  topdoctors: "top_doctors",
  nmc: "nmc",
  referral: "referral",
  direct: "direct",
};

export function normalizeSource(input: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  refererHost?: string | null;
  siteHost: string;
}): Source {
  const utmSource = input.utmSource?.trim().toLowerCase();
  if (utmSource) {
    if (utmSource === "google" && input.utmCampaign?.toLowerCase().includes("gbp")) {
      return "google_business";
    }
    return UTM_SOURCE_MAP[utmSource] ?? "other";
  }

  const refererHost = input.refererHost?.toLowerCase();
  if (!refererHost || refererHost === input.siteHost.toLowerCase()) return "direct";
  if (refererHost.includes("google.")) return "google_organic";
  if (refererHost.includes("instagram.com")) return "instagram";
  if (refererHost.includes("doctoralia")) return "doctoralia";
  if (refererHost.includes("topdoctors")) return "top_doctors";
  return "referral";
}

export function isKnownSource(value: string): value is Source {
  return (SOURCES as readonly string[]).includes(value);
}
