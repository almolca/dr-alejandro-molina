import { features } from "./features";

/**
 * Navigation configuration.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §5, §6
 *
 * Primary nav mirrors the six top-level items specified in §6. Hrefs
 * point at the MVP site map (§5) even before every page exists — the
 * global not-found page renders gracefully for anything not yet built.
 * As Phase 2+ pages ship, no changes are needed here; only new subpages
 * get added to `serviceLinks` / the sitemap registry.
 */

export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Men's Health", href: "/mens-health" },
  { label: "Sexual Medicine", href: "/sexual-medicine" },
  { label: "Penile Surgery", href: "/penile-surgery" },
  { label: "Male Aesthetics", href: "/male-aesthetics" },
  { label: "Male Fertility", href: "/male-fertility" },
  { label: "About", href: "/about" },
];

/**
 * Internal "Book" page — collects context and hands off to the official
 * NMC appointment flow via `practice.bookingUrl` (spec §5, §7 Section 11,
 * §26). Kept distinct from the external booking URL itself.
 */
export const bookHref = "/book";

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
];

/**
 * Footer service quick-links, grouped to match the commercial priority
 * matrix (spec §3) — Tier 1 first, Tier 3 kept visually subordinate.
 *
 * "Penile Girth Enhancement" and "Male Genital Aesthetics" lead the
 * list per SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md Phase A8 — the
 * single highest-leverage internal-linking change identified in the
 * gap analysis (the flagship procedure previously had no named
 * footer link, only the generic hub link).
 */
export const footerServiceLinks: NavItem[] = [
  { label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
  { label: "Male Genital Aesthetics", href: "/male-aesthetics" },
  { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
  { label: "Penile Implant Surgery", href: "/penile-implant" },
  { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
  { label: "Peyronie's Disease", href: "/peyronies-disease" },
  { label: "Male Fertility", href: "/male-fertility" },
  ...(features.prpPage
    ? [{ label: "PRP", href: "/erectile-dysfunction/prp" }]
    : []),
];
