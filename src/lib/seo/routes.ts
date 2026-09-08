import { features } from "@/config/features";

/**
 * Central route registry — single source of truth for `sitemap.ts`.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §5, §12, §24
 *
 * Mirrors the full MVP site map (§5) so the target architecture is
 * visible in one place, but the sitemap only emits routes marked
 * `status: "live"` — this is what keeps sitemap.xml honest as pages
 * ship phase by phase (spec §24: "do not create thin pages", and the
 * Phase 5 QA checklist's "broken links" check).
 *
 * When a page ships in a later phase, flip its `status` to "live".
 * Do not flip status ahead of the page actually existing.
 */

export type RouteEntry = {
  path: string;
  status: "live" | "planned";
  priority: number;
  /**
   * Whether this route should appear in sitemap.xml. Defaults to
   * `true` when omitted. Set `false` for pages whose own metadata is
   * `noindex` (legal pages) — listing a noindex page in the sitemap
   * sends search engines a contradictory signal (found in the Phase 5
   * SEO audit, SEO_AUDIT.md). This is independent of `status: "live"`,
   * which still governs `InternalLink` prefetching — a noindex page is
   * still a real, navigable, prefetchable page.
   */
  index?: boolean;
};

export const routes: RouteEntry[] = [
  { path: "/", status: "live", priority: 1.0 },
  { path: "/about", status: "live", priority: 0.7 },
  { path: "/book", status: "live", priority: 0.8 },

  { path: "/mens-health", status: "live", priority: 0.8 },
  { path: "/mens-health/testosterone", status: "live", priority: 0.9 },
  { path: "/mens-health/low-libido", status: "planned", priority: 0.5 },

  { path: "/sexual-medicine", status: "live", priority: 0.7 },
  { path: "/sexual-medicine/premature-ejaculation", status: "live", priority: 0.8 },
  { path: "/erectile-dysfunction", status: "live", priority: 0.9 },
  // "/erectile-dysfunction/assessment" (spec §5) was deliberately not
  // built as a separate route — Phase 4's "Penile Doppler / Advanced ED
  // Assessment" brief treated the two as one page; it lives at
  // "/erectile-dysfunction/penile-doppler" instead. See
  // IMPLEMENTATION_REPORT.md for the reasoning.
  { path: "/erectile-dysfunction/penile-doppler", status: "live", priority: 0.7 },
  { path: "/erectile-dysfunction/shockwave-therapy", status: "live", priority: 0.7 },

  { path: "/penile-surgery", status: "live", priority: 0.7 },
  { path: "/penile-implant", status: "live", priority: 0.9 },
  { path: "/peyronies-disease", status: "live", priority: 0.7 },

  { path: "/male-aesthetics", status: "live", priority: 0.9 },
  { path: "/male-aesthetics/penile-girth-enhancement", status: "live", priority: 0.9 },
  { path: "/male-aesthetics/scrotal-lift", status: "live", priority: 0.8 },
  // Built Phase B (SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md). Renamed from
  // the never-built, never-indexed "revision-correction" placeholder to
  // match the brief's more search-intent-precise naming — no redirect
  // needed, since nothing was ever live at the old slug.
  { path: "/male-aesthetics/penile-filler-correction", status: "live", priority: 0.7 },

  { path: "/male-fertility", status: "live", priority: 0.7 },
  { path: "/male-fertility/varicocele", status: "live", priority: 0.6 },
  { path: "/male-fertility/semen-analysis", status: "planned", priority: 0.5 },

  { path: "/insights", status: "live", priority: 0.5 },
  // Individual /insights/[slug] article routes are appended in
  // sitemap.ts directly from content/insights/articles.ts, rather than
  // duplicated here — that's the single source of truth for which
  // articles actually exist.

  { path: "/privacy", status: "live", priority: 0.1, index: false },
  { path: "/terms", status: "live", priority: 0.1, index: false },
  { path: "/medical-disclaimer", status: "live", priority: 0.1, index: false },

  // PRP route intentionally omitted unless explicitly enabled and built
  // under compliance review (spec §12). Never auto-included.
  ...(features.prpPage
    ? [{ path: "/erectile-dysfunction/prp", status: "planned" as const, priority: 0.5 }]
    : []),
];

export const liveRoutes = routes.filter((route) => route.status === "live");

/** Routes that belong in sitemap.xml — live and not explicitly noindex. */
export const sitemapRoutes = liveRoutes.filter((route) => route.index !== false);
