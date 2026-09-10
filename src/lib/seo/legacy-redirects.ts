/**
 * Legacy URL → new-site redirect map — R8 §2/§19. Single source of
 * truth, consumed by `next.config.ts`'s `redirects()`. Full audit,
 * classification (A–E) and reasoning for every entry lives in
 * docs/r8-seo-migration.md — this file is deliberately just the
 * mechanical source/destination pairs actually implemented (A/B/C
 * classifications only; D entries are served a real 410 by
 * `src/proxy.ts`, E entries are intentionally left to the normal 404).
 *
 * All permanent (308). Trailing-slash variants are deliberately NOT
 * listed here as separate entries: this project uses Next's default
 * `trailingSlash: false`, which strips a trailing slash via Next's own
 * built-in redirect *before* these custom rules are ever evaluated —
 * verified empirically (a request for `/en/curved-penis/` 308s to
 * `/en/curved-penis` first, then a second 308 to the real destination).
 * Adding a matching `/…/ ` entry here would be genuinely dead code (it
 * can never match), not a second safety net. The two-hop result for a
 * slash-suffixed legacy URL is an accepted, documented tradeoff of
 * Next's default trailing-slash behavior, not a redirect chain this
 * map itself introduces — see docs/r8-seo-migration.md §2.
 */
export type LegacyRedirect = {
  source: string;
  destination: string;
};

export const legacyRedirects: LegacyRedirect[] = [
  // ---- Homepage ----
  { source: "/en/home", destination: "/" },
  { source: "/en/", destination: "/" },
  { source: "/en", destination: "/" },

  // ---- About / physician bio ----
  { source: "/en/dr-molina-2", destination: "/about" },
  { source: "/dr-molina", destination: "/about" },

  // ---- Treatments hub (no single new-site equivalent — homepage serves this role) ----
  { source: "/en/treatments", destination: "/" },
  { source: "/tratamientos", destination: "/" },

  // ---- Erectile dysfunction (direct slug match, English) ----
  { source: "/en/erectile-dysfunction", destination: "/erectile-dysfunction" },
  { source: "/disfuncion-erectil", destination: "/erectile-dysfunction" },
  {
    source: "/en/causes-of-erectile-dysfunction-impotence",
    destination: "/erectile-dysfunction",
  },

  // ---- Premature ejaculation ----
  { source: "/en/premature-ejaculation", destination: "/sexual-medicine/premature-ejaculation" },
  { source: "/eyaculacion-precoz", destination: "/sexual-medicine/premature-ejaculation" },

  // ---- Penis enlargement -> penile girth enhancement ----
  { source: "/en/penis-enlargement", destination: "/male-aesthetics/penile-girth-enhancement" },
  { source: "/aumento-de-pene", destination: "/male-aesthetics/penile-girth-enhancement" },

  // ---- Penile prosthesis -> penile implant ----
  { source: "/en/penis-prosthesis", destination: "/penile-implant" },
  { source: "/protesis-de-pene", destination: "/penile-implant" },

  // ---- Curved penis -> Peyronie's disease ----
  { source: "/en/curved-penis", destination: "/peyronies-disease" },
  { source: "/incurvacion-de-pene", destination: "/peyronies-disease" },

  // ---- No-scalpel vasectomy (dedicated page — R8.0.2) ----
  { source: "/en/no-scalpel-vasectomy", destination: "/mens-health/vasectomy" },
  { source: "/vasectomia-sin-bisturi", destination: "/mens-health/vasectomy" },

  // ---- Vasectomy reversal (fertility-restoration intent -> fertility hub) ----
  { source: "/en/vasovasostomy", destination: "/male-fertility" },
  { source: "/vasovasostomia", destination: "/male-fertility" },

  // ---- Scrotoplasty -> scrotal lift ----
  { source: "/en/scrotoplasty", destination: "/male-aesthetics/scrotal-lift" },
  { source: "/escrotoplastia", destination: "/male-aesthetics/scrotal-lift" },

  // ---- Circumcision (no dedicated new page -> penile surgery hub) ----
  { source: "/en/circumcision", destination: "/penile-surgery" },
  { source: "/circuncision", destination: "/penile-surgery" },

  // ---- Blog / insights ----
  { source: "/en/blog-2", destination: "/insights" },
  { source: "/blog", destination: "/insights" },

  // ---- Testosterone (Spanish-only legacy articles) ----
  { source: "/deficit-testosterona", destination: "/mens-health/testosterone" },
  { source: "/caida-testosterona-a-partir-de-los-50", destination: "/mens-health/testosterone" },

  // ---- General "where do I go" article -> sexual medicine hub ----
  {
    source: "/en/i-have-a-sexual-health-problem-where-do-i-go",
    destination: "/sexual-medicine",
  },

  // ---- Legal pages ----
  { source: "/en/privacy-policy", destination: "/privacy" },
  { source: "/politica-de-privacidad", destination: "/privacy" },
  { source: "/en/cookies-policy", destination: "/privacy" },
  { source: "/politica-de-cookies", destination: "/privacy" },
  { source: "/en/legal-warning", destination: "/terms" },
  { source: "/aviso-legal", destination: "/terms" },

  // ---- Contact -> booking gateway ----
  { source: "/en/contact", destination: "/book" },
  { source: "/contacto", destination: "/book" },
];

/** Paths that should return a genuine 410 Gone rather than a redirect — see docs/r8-seo-migration.md for the reasoning behind each. */
export const legacyGonePaths: string[] = [
  "/en/3-most-common-sex-fantasies-among-women",
  "/labioplastia-vaginal",
];
