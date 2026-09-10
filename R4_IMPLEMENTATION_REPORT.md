# R4 — Strategic visual and product correction

Implemented on 2026-09-07, on the existing `phase-r3-correction-visual-brand` branch. Working tree initially contained only the untracked R4 task document. No deployment, merge or commit was performed.

## Visible changes

- **Navigation and brand:** Penile Girth Enhancement is the third primary navigation item, using `/male-aesthetics/penile-girth-enhancement`. Direct contextual links also appear in the three related hubs. Fertility remains accessible through care areas and the footer. Header and footer now use the complete, approved logo image, without cropping, redrawing, recoloring or recreating its typography. The footer uses a light stone surface so the source artwork remains legible.
- **Home:** the diagonal portrait placeholder is replaced by layered ivory/stone editorial artwork with visible contours, an inset frame and clinical experience. The opening authority composition presents 15+ years, 500+ procedures, since 2018, FEBU, medical training and the Men's Health Spain contribution. The flagship section becomes an asymmetric editorial spread. Repeated metric/branding blocks were consolidated; no extra homepage section was added.
- **About:** the original biography is retained in an alternating, connected timeline. Spain, tertiary/surgical practice, andrology/sexual health, genital aesthetics, procedure experience and education form a visible progression. A prominent authority block separates the opening identity from the narrative. Medical education remains informational and separate from clinical booking.
- **Flagship procedure:** an expanded split hero, six-step clinical pathway, non-explicit abstract planning illustration, six variability factors and a stepped risks/aftercare/correction system distinguish this page from supporting treatments. Existing limitations, options, FAQ, links and realistic-outcome wording remain intact.
- **Male Aesthetics:** direct flagship access in the hero; the larger, tonal flagship section now precedes the secondary Scrotal Lift / Filler Correction pair and the explanatory assessment section.
- **Motion:** existing masked reveals and timeline entrances are reused. BrandCurve explicitly bypasses the path animation with reduced motion. Decorative artwork carries no clinical information that depends on animation.

## Before / after evidence

[Open the comparison gallery](qa/r4-visual-review.html). Each image can be opened at full resolution; the gallery is a local QA artifact, not a new site route.

| Page / viewport | Before | After |
|---|---|---|
| Home · 1440px | [Before](qa/screenshots/r4/before-home-1440.png) | [After](qa/screenshots/r4/after-home-1440.png) |
| About · 1440px | [Before](qa/screenshots/r4/before-about-1440.png) | [After](qa/screenshots/r4/after-about-1440.png) |
| Male Aesthetics · 1440px | [Before](qa/screenshots/r4/before-male-aesthetics-1440.png) | [After](qa/screenshots/r4/after-male-aesthetics-1440.png) |
| Penile Girth Enhancement · 1440px | [Before](qa/screenshots/r4/before-girth-1440.png) | [After](qa/screenshots/r4/after-girth-1440.png) |
| Home · 390px | [Before](qa/screenshots/r4/before-home-390.png) | [After](qa/screenshots/r4/after-home-390.png) |
| Penile Girth Enhancement · 390px | [Before](qa/screenshots/r4/before-girth-390.png) | [After](qa/screenshots/r4/after-girth-390.png) |

Before captures were taken before changing rendered components, against the existing development server at port 3001. They retain the pre-existing Next development issue indicator. Final after captures were taken against the completed production build at port 3502. Both use 1000px viewport height, full-page captures and scroll-through to trigger reveals. The changed layouts were visually inspected, including mobile crops and full-page composition.

## QA

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed, generating the existing 45 static pages. The existing `NEXT_PUBLIC_SITE_URL` warning remains: the production domain is not configured. No SEO/domain configuration was changed.
- **56 page/viewport combinations** in production Chrome: Home, About, Male Aesthetics, Girth Enhancement, Men's Health, Sexual Medicine and Penile Surgery at 375, 390, 430, 768, 1024, 1280, 1440 and 1728px.
- All returned 200, had one H1, no horizontal overflow, no page/console errors, loaded full header/footer logos, and no rendered placeholder/PRP claims. The footer was scrolled into view and its lazy image decoded before evaluating image loading.
- Primary flagship links clicked at desktop and mobile/tablet widths; drawer closes on navigation and Escape, with focus returning to the trigger. FAQ opens correctly.
- Booking CTA clicked and the exact configured NMC destination verified through a locally intercepted new-tab navigation. No booking was submitted, and the external clinic's availability was not tested.
- Axe WCAG 2 A/AA, 2.1 AA and 2.2 AA checks on the four priority pages at 390 and 1440px: no reported violations in the final pass. This is automated Chrome verification, not a claim of full accessibility certification or Safari/Firefox coverage.
- Reduced-motion emulation: preference detected, content visible, no overflow; the SVG path animation has an explicit reduced-motion branch.
- `git diff --check`: passed.

Machine-readable evidence: [browser results](qa/r4-results.json) and [accessibility after scrolling through all reveal content](qa/r4-revealed-accessibility.json), with zero reported violations in all eight additional checks. Reusable harness: [r4-browser.mjs](qa/r4-browser.mjs), with `R4_PLAYWRIGHT_MODULE` and optional `R4_AXE_PATH` pointing to existing local tooling. No app dependencies were added. `agent-browser` was unavailable and its package lookup failed; the existing Playwright installation and Chrome were used instead.

Two real contrast defects in the staged care labels were found and corrected. An initial footer image check was adjusted to account for lazy loading. Turbopack also cached a sandbox port-binding failure during verification; only its generated cache was moved aside, and a clean production build then succeeded outside the sandbox. No application security headers were weakened.

## Authority and launch gates retained

| Item | Final state |
|---|---|
| Men's Health Spain relationship | R4 owner-approved “Contributor to Men's Health Spain”, separately config-driven and publish-ready |
| Specific media articles / appearances | Empty until title, date and source are verified |
| Top Doctors Spain 2020 | Owner-confirmed and published exactly as supplied; `publishReady: true` |
| Doctoralia Awards Spain 2022 | Owner-confirmed and published exactly as supplied; `publishReady: true` |
| Patient reviews / ratings | Unset; no fabricated reviews, score, count or profile |
| AndroMax public URL | Unset; educational activity shown without an invented link |
| Approved physician photography | Pending; no AI doctor photos used |
| PRP | Disabled |
| Routes / canonical / sitemap strategy | Unchanged |
| Production domain and existing clinical/legal launch reviews | Existing launch checklist still applies |

## Files changed

- [BRAND_AUTHORITY_ASSET_REQUIREMENTS.md](BRAND_AUTHORITY_ASSET_REQUIREMENTS.md)
- [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)
- [POSITIONING_UX_REDESIGN_PLAN.md](POSITIONING_UX_REDESIGN_PLAN.md)
- [R4_IMPLEMENTATION_REPORT.md](R4_IMPLEMENTATION_REPORT.md)
- [qa/r4-browser.mjs](qa/r4-browser.mjs)
- [qa/r4-results.json](qa/r4-results.json)
- [qa/r4-visual-review.html](qa/r4-visual-review.html)
- [src/app/(marketing)/about/page.tsx](src/app/(marketing)/about/page.tsx)
- [src/app/(marketing)/male-aesthetics/page.tsx](src/app/(marketing)/male-aesthetics/page.tsx)
- [src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx](src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx)
- [src/app/(marketing)/mens-health/page.tsx](src/app/(marketing)/mens-health/page.tsx)
- [src/app/(marketing)/penile-surgery/page.tsx](src/app/(marketing)/penile-surgery/page.tsx)
- [src/app/(marketing)/sexual-medicine/page.tsx](src/app/(marketing)/sexual-medicine/page.tsx)
- [src/components/editorial/Editorial.module.css](src/components/editorial/Editorial.module.css)
- [src/components/editorial/ExpertiseTimeline.tsx](src/components/editorial/ExpertiseTimeline.tsx)
- [src/components/editorial/LayeredEditorialPanel.tsx](src/components/editorial/LayeredEditorialPanel.tsx)
- [src/components/editorial/PhysicianAuthority.tsx](src/components/editorial/PhysicianAuthority.tsx)
- [src/components/editorial/ProcedureFramework.tsx](src/components/editorial/ProcedureFramework.tsx)
- [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- [src/components/layout/Header.tsx](src/components/layout/Header.tsx)
- [src/components/navigation/DesktopNav.tsx](src/components/navigation/DesktopNav.tsx)
- [src/components/navigation/MobileNav.tsx](src/components/navigation/MobileNav.tsx)
- [src/components/sections/AboutSection.tsx](src/components/sections/AboutSection.tsx)
- [src/components/sections/AuthorityMediaSection.tsx](src/components/sections/AuthorityMediaSection.tsx)
- [src/components/sections/AuthorityStripSection.tsx](src/components/sections/AuthorityStripSection.tsx)
- [src/components/sections/FeaturedProcedureSection.tsx](src/components/sections/FeaturedProcedureSection.tsx)
- [src/components/sections/HeroSection.tsx](src/components/sections/HeroSection.tsx)
- [src/components/ui/BrandCurve.tsx](src/components/ui/BrandCurve.tsx)
- [src/components/ui/BrandLogo.tsx](src/components/ui/BrandLogo.tsx)
- [src/config/mediaAppearances.ts](src/config/mediaAppearances.ts)
- [src/config/navigation.ts](src/config/navigation.ts)
- `qa/screenshots/r4/`: 12 full-page before/after PNGs listed above.
- [qa/r4-revealed-accessibility.json](qa/r4-revealed-accessibility.json)

## Owner-confirmed recognition correction — 2026-09-07

The earlier pending-verification status was incorrect and is corrected above. The owner explicitly authorizes **Top Doctors Spain 2020** and **Doctoralia Awards Spain 2022**. Both entries are now `publishReady: true` and their `officialTitle` is exactly that text. No category, ranking, extra title or fabricated logo is added. Existing structured-data output uses the same exact names without duplicated issuer/year wording.

About now displays Professional Recognition and Editorial / Media directly after the clinical authority block. Home includes the two names in the existing compact education/authority section, adding no new section. Existing typography is used because no official outlet/award logos were supplied.

Confirmed visible on both pages: Contributor to Men's Health Spain; AndroMax Training; Medical Trainer; training of urologists and aesthetic physicians; FEBU; 15+ years in Urology; 500+ penile girth procedures; experience since 2018.

Typecheck, lint and production build passed. Chrome visual verification at 390px and 1440px passed for Home and About, with one H1, no overflow and no console/page errors. The existing production-domain build warning remains unchanged. [Machine-readable checks](qa/r4-authority-results.json).

| Page | 390px | 1440px |
|---|---|---|
| Home | [Full page](qa/screenshots/r4/authority-home-390.png) · [Authority detail](qa/screenshots/r4/authority-detail-home-390.png) | [Full page](qa/screenshots/r4/authority-home-1440.png) · [Authority detail](qa/screenshots/r4/authority-detail-home-1440.png) |
| About | [Full page](qa/screenshots/r4/authority-about-390.png) · [Authority detail](qa/screenshots/r4/authority-detail-about-390.png) | [Full page](qa/screenshots/r4/authority-about-1440.png) · [Authority detail](qa/screenshots/r4/authority-detail-about-1440.png) |

Correction files: `src/config/doctor.ts`, `src/components/sections/RecognitionSection.tsx`, `src/components/sections/AuthorityMediaSection.tsx`, `src/app/(marketing)/about/page.tsx`, `src/lib/seo/json-ld.ts` (exact recognition formatting only), `qa/r4-browser.mjs` (remove obsolete assertion that awards must be absent), this report and the superseding status note in `BRAND_AUTHORITY_ASSET_REQUIREMENTS.md`. No routes, SEO strategy or other visual modules were redesigned. No merge or deployment.

## R4.2 follow-up — 2026-09-07

The five-page global visual correction is documented in [R4_2_IMPLEMENTATION_REPORT.md](R4_2_IMPLEMENTATION_REPORT.md), with [before/after review](qa/r4-2/index.html). It supersedes the R4 beige/editorial-panel visual treatment while retaining approved branding, routes and all owner-confirmed authority. No merge or deployment.
