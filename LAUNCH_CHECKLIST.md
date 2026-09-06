# Launch Checklist

Status as of Phase 5. Cross-references the phase's own audit documents
rather than duplicating their detail — read those for the full
reasoning behind each item.

## Must complete before launch

- [ ] **Production domain** — set `NEXT_PUBLIC_SITE_URL` to the real
      domain. Everything else (canonical, OG, sitemap) is already
      wired to it (`SEO_AUDIT.md` §12); a production build without it
      set now logs a visible warning rather than shipping silently
      (`src/config/site.ts`).
- [ ] **Real photography** — see `MEDIA_REQUIREMENTS.md` for the full
      manifest, filenames and specs. Nothing has been faked; every
      slot is a labelled placeholder.
- [ ] **Clinical content review** — see `CLINICAL_CONTENT_REVIEW.md`.
      No content is marked clinically approved by this process; it
      never can be. The three scoping questions originally collected
      here (surgical sperm retrieval, fertility-clinic collaboration,
      current aesthetics-service availability) were answered by the
      owner on 2026-09-04 and the site updated accordingly — what
      remains is qualified clinical/compliance sign-off on wording, not
      further scoping decisions.
- [ ] **DoH/regulatory compliance review** — see
      `UAE_COMPLIANCE_REVIEW.md`, especially the Male Genital
      Aesthetics / Penile Girth Enhancement / Scrotal Lift cluster
      (the new Scrotal Lift page specifically hasn't had a compliance
      pass yet) and the Shockwave Therapy page.
- [ ] **Legal review** — `/privacy`, `/terms`, `/medical-disclaimer`
      are professional drafts (Phase 4/5), not lawyer-reviewed. Each
      page's source carries an explicit "DRAFT — pending review"
      comment.
- [ ] **Cookie consent / analytics decision** — the consent banner and
      architecture are built and tested (`ANALYTICS_PRIVACY_PLAN.md`),
      but no analytics provider is connected. Decide whether GA4/
      Vercel Analytics ships at launch or after, and follow that
      document's "before GA4 is actually added" steps when it does.
- [ ] **Final analytics setup** — contingent on the item above; the
      integration point in `trackEvent()` is ready but empty.
- [ ] **Favicon / social assets — final version** — the current
      favicon, Apple touch icon and Open Graph image
      (`src/app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`) are
      explicitly temporary, code-generated typographic marks, not a
      designed brand identity. Functional and already live at every
      required slot — replace with real brand assets when available,
      not required to unblock anything else. The final direction is
      now confirmed (AM monogram + "Dr. Alejandro Molina" +
      "CONSULTANT UROLOGIST & ANDROLOGIST", one restrained bronze/gold
      gesture, no NMC/Abu Dhabi/UAE/hospital or geographic reference in
      the mark itself — full brief in `MEDIA_REQUIREMENTS.md` "Brand
      identity / logo — confirmed final direction") — what's missing is
      the actual design execution, not a decision.

## Recommended before launch

- [ ] **Cross-browser QA** — this build's real-browser testing used
      Chrome only (the only browser available in this environment).
      Safari and Firefox — especially Safari, given iOS usage patterns
      for a UAE audience — haven't been checked.
- [ ] **Arabic roadmap** — spec §0 marks the architecture
      "Arabic-ready... not required for MVP." No i18n scaffolding
      exists yet; explicitly out of scope again this phase per the
      instruction not to build it.
- [ ] **Google Search Console** — not set up (requires the real
      production domain first; see the domain item above).
- [ ] **Final Open Graph preview check** — the generated OG image
      renders correctly in this build's own testing (verified by
      fetching and viewing it), but hasn't been checked inside an
      actual Facebook/LinkedIn/X share-preview debugger against a real
      public URL, since no public URL exists yet.
- [ ] **`script-src 'unsafe-eval'` decision** — found during this
      phase's Lighthouse run (see `IMPLEMENTATION_REPORT.md` Phase 5):
      the FAQ accordion pages score Best Practices 96/100 instead of
      100/100 because the CSP correctly blocks an `eval()` call
      originating from a shared framework/library chunk, only
      triggered on pages using the Radix Accordion. Functionality is
      unaffected (extensively QA'd) and 96 is still above the ≥95
      target — this is the CSP doing its job, not a bug. Worth a
      decision, not a required fix: loosen `script-src` to
      `'unsafe-eval'` for a few Lighthouse points, or keep the
      stricter policy as-is.

## Can wait until post-launch

- [ ] CMS (spec §35 explicitly defers this)
- [ ] Additional Insights articles beyond the initial 5
- [ ] International-patient content
- [ ] Physician referral page
- [ ] Additional assessment/condition pages (`/mens-health/low-libido`,
      `/erectile-dysfunction/assessment` — deliberately not built, see
      `SEO_AUDIT.md` §9 — `/male-aesthetics/revision-correction`,
      `/male-fertility/semen-analysis`). Note:
      `/male-aesthetics/hyaluronic-acid` was removed from the route
      registry entirely (not deferred) — HA augmentation is Penile
      Girth Enhancement's own primary modality, not a separate service;
      see `SEO_AUDIT.md` §9a.
- [ ] Multi-category cookie consent (currently one accept/decline
      choice, proportionate to the site's single current need — see
      `ANALYTICS_PRIVACY_PLAN.md`)
- [ ] PRP/P-Shot — stays disabled indefinitely, not just "for now";
      only revisit given explicit compliance approval (spec §12)
