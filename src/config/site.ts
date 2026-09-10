import { env } from "@/lib/env";
import { resolveSiteUrl } from "@/lib/seo/canonical-site-url";
import { doctor } from "./doctor";

/**
 * Site-wide metadata configuration.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §23, §24
 */

/**
 * R8 canonical-domain decision (owner-confirmed launch domain). This is
 * the one place every canonical URL, Open Graph URL, JSON-LD `url`, and
 * sitemap entry ultimately derives from (`siteUrl` below) — see
 * docs/r8-seo-migration.md §4.
 */
export const PRODUCTION_SITE_URL = "https://dralejandromolinaurologist.com";

/**
 * R8 §4/§5 — "Preview should still emit production canonical URLs
 * where appropriate for launch validation, while Preview itself
 * remains protected from indexing." `process.env.VERCEL` is set to
 * "1" by Vercel's build environment on every deployment it builds —
 * Preview and Production alike — and is unset in local dev
 * (https://vercel.com/docs/environment-variables/system-environment-variables).
 * So: any Vercel deployment (Preview included) emits real production
 * canonical/OG/sitemap URLs, letting the owner validate exactly what
 * will ship before cutover, while indexing itself is blocked
 * separately (Vercel Preview deployment protection + the `X-Robots-Tag`
 * proxy sets on non-production hosts, see src/proxy.ts). Local dev
 * keeps using `NEXT_PUBLIC_SITE_URL` (falling back to localhost) so
 * canonical URLs in a dev build still point at whatever's actually
 * running.
 */
export const siteUrl = resolveSiteUrl({
  isVercelDeployment: Boolean(process.env.VERCEL),
  productionSiteUrl: PRODUCTION_SITE_URL,
  devSiteUrl: env.NEXT_PUBLIC_SITE_URL,
});

export const site = {
  name: doctor.displayName,
  titleTemplate: `%s | ${doctor.displayName}`,
  defaultTitle: `${doctor.displayName} — ${doctor.title}, Abu Dhabi`,
  description:
    "Specialist assessment and treatment for erectile dysfunction, male hormonal health, penile conditions, fertility and male genital aesthetics.",
  locale: "en_AE",
  themeColor: "#f5f1ea",
} as const;
