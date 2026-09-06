import { env } from "@/lib/env";
import { doctor } from "./doctor";

/**
 * Site-wide metadata configuration.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §23, §24
 */

/**
 * TODO(owner): confirm production domain before launch. Not specified in
 * the master spec. Falls back to a same-origin-safe relative base so
 * metadata/OG generation still works correctly in preview/dev without a
 * fabricated public domain being asserted anywhere — this is the "fail
 * safely if missing in local development" behavior (spec §32 / Phase 5
 * brief). In production specifically, a missing value is loud rather
 * than silent: every canonical/OG/sitemap URL would otherwise point at
 * "localhost" for real visitors with no visible signal anything was
 * wrong. This only logs (doesn't throw) — a warning that ships is far
 * better than a build that fails at the least convenient moment.
 */
if (
  process.env.NODE_ENV === "production" &&
  !env.NEXT_PUBLIC_SITE_URL
) {
  console.warn(
    "[config/site] NEXT_PUBLIC_SITE_URL is not set in a production build — " +
      "canonical URLs, Open Graph tags and sitemap.xml will all use " +
      "http://localhost:3000. Set NEXT_PUBLIC_SITE_URL to the real domain before launch.",
  );
}

export const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: doctor.displayName,
  titleTemplate: `%s | ${doctor.displayName}`,
  defaultTitle: `${doctor.displayName} — ${doctor.title}, Abu Dhabi`,
  description:
    "Specialist assessment and treatment for erectile dysfunction, male hormonal health, penile conditions, fertility and male genital aesthetics.",
  locale: "en_AE",
  themeColor: "#f5f1ea",
} as const;
