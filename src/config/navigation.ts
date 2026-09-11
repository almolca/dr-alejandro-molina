import { features } from "./features";

/**
 * Navigation configuration.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §5, §6
 *
 * R4 primary hierarchy: the flagship procedure has a direct link to its
 * existing canonical route. Fertility remains in care areas and the footer.
 */

export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Men's Health", href: "/mens-health" },
  { label: "Sexual Medicine", href: "/sexual-medicine" },
  { label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
  { label: "Penile Surgery", href: "/penile-surgery" },
  { label: "Male Aesthetics", href: "/male-aesthetics" },
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
  { label: "Premature Ejaculation", href: "/sexual-medicine/premature-ejaculation" },
  { label: "Penile Implant Surgery", href: "/penile-implant" },
  { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
  { label: "Peyronie's Disease", href: "/peyronies-disease" },
  { label: "Male Fertility", href: "/male-fertility" },
  { label: "No-Scalpel Vasectomy", href: "/mens-health/vasectomy" },
  ...(features.prpPage
    ? [{ label: "PRP", href: "/erectile-dysfunction/prp" }]
    : []),
];

/**
 * Arabic nav labels (R9 Phase A). Hrefs point at the existing English
 * pages, since no Arabic equivalent exists for any of these yet — this
 * flips automatically to the Arabic route as each one ships in Phase B,
 * once `routes.ts` gains an `arPath` for it (spec §6, §25).
 */
const primaryNavAr: NavItem[] = [
  { label: "الصحة الرجولية", href: "/mens-health" },
  { label: "الطب الجنسي", href: "/sexual-medicine" },
  { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
  { label: "جراحة القضيب", href: "/penile-surgery" },
  { label: "التجميل الذكوري", href: "/male-aesthetics" },
  { label: "نبذة عن الطبيب", href: "/about" },
];

export function getPrimaryNav(locale: "en" | "ar"): NavItem[] {
  return locale === "ar" ? primaryNavAr : primaryNav;
}

export function getBookLabel(locale: "en" | "ar"): string {
  return locale === "ar" ? "الحجز" : "Book";
}

const legalNavAr: NavItem[] = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "الشروط", href: "/terms" },
  { label: "إخلاء المسؤولية الطبية", href: "/medical-disclaimer" },
];

export function getLegalNav(locale: "en" | "ar"): NavItem[] {
  return locale === "ar" ? legalNavAr : legalNav;
}

const footerServiceLinksAr: NavItem[] = [
  { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
  { label: "التجميل الذكوري", href: "/male-aesthetics" },
  { label: "ضعف الانتصاب", href: "/erectile-dysfunction" },
  { label: "سرعة القذف", href: "/sexual-medicine/premature-ejaculation" },
  { label: "زراعة دعامة القضيب", href: "/penile-implant" },
  { label: "التستوستيرون والصحة الهرمونية", href: "/mens-health/testosterone" },
  { label: "مرض بيروني", href: "/peyronies-disease" },
  { label: "خصوبة الرجل", href: "/male-fertility" },
  { label: "قطع القناة المنوية دون مشرط", href: "/mens-health/vasectomy" },
];

export function getFooterServiceLinks(locale: "en" | "ar"): NavItem[] {
  return locale === "ar" ? footerServiceLinksAr : footerServiceLinks;
}
