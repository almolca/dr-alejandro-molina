# R4.3 — Brand Integration, Photography & Authority Final Pass

Completed locally on 2026-09-07 on `phase-r3-correction-visual-brand`. Awaiting owner visual review. No commit, merge or deployment.

This focused pass builds on the existing uncommitted R4/R4.2 implementation. It preserves the five-page architecture, content routes, canonical strategy, approved authority facts, clinical content and navigation destinations. R4.2 screenshots remain the comparison baseline.

## Required visual-review answers

### 1. Is the logo genuinely integrated without a visible background rectangle?

Yes. Header and footer now use `public/brand/logo-full-transparent.png`, an RGBA derivative of the approved `logo-full.png`. The original source remains unchanged. Only the near-white matte's alpha was removed: every RGB channel, the 1536×1024 canvas, proportions, monogram, bronze curve, signature and specialty lettering are preserved.

The image-editing tool returned another opaque image, which was not used. The final derivative uses a reproducible alpha-only matte removal script. Independent pixel verification found **zero RGB differences** and a fully transparent outer border. Chrome's optimized logo images also have zero corner alpha at all eight required widths. No filters, blending, recoloring, redraw, distortion or white backing box is used. Desktop and mobile header/footer screenshots were visually inspected for canvas mismatch.

Evidence: [source verification](qa/r4-3/logo-verification.json), [alpha statistics](qa/r4-3/logo-alpha.json), [optimized browser images](qa/r4-3/browser-logo.json). Reproduction: `node qa/r4-3/prepare-logo.mjs`; verification: `node qa/r4-3/verify-logo.mjs`.

### 2. Where was gold reduced?

The five-page scope now uses neutral light/dark accent tokens instead of bronze in dark-section labels and rules. Diagnostic sequence nodes and expert-insight borders became muted grey. Recognition headings use larger neutral serif text rather than bronze uppercase micro-labels. Existing grey timeline numbers and clinical markers remain restrained. Photo frames now use a simple vertical neutral tonal fill and one subtle border, with the inset decorative frame and Home's dark backing shape removed.

The original logo's bronze remains intact. A short footer brand rule and the existing selected flagship curve retain a controlled signature accent. No global palette or layout rewrite was applied to supporting treatment routes.

### 3. Where were physician photo positions added?

R4.2 already contained all nine required permanent positions, so this pass refined those slots rather than duplicating them. They are present on:

| Page | Positions |
|---|---|
| Home | Hero portrait; mid-page clinical image |
| About | Hero portrait; consultation/professional image; medical training image |
| Penile Girth Enhancement | Hero clinical image; secondary consultation/detail image |
| Male Aesthetics | Hero clinical-environment image |
| Men's Health | Hero consultation/diagnostic image |

All are responsive `PhotoFrame` surfaces configured in `src/config/photography.ts`. Home's caption beneath an empty image was removed; no caption or decorative text appears inside any frame. The Girth clinical frame is now integrated into its charcoal hero. Male Aesthetics and Men's Health have clearer adjacent physician identity; Home highlights FEBU beside its clinical positioning. About's duplicate physician-name line was removed.

No photographs are supplied or approved yet. No stock or AI physician images were used, and empty frames remain hidden from assistive technology.

### 4. Where are Top Doctors / Doctoralia / Men's Health visible?

- **Home:** near-top authority module retains all clinical metrics, FEBU, training and Men's Health Spain contribution. Exact award names now use larger serif typography in its compact recognition rail. The existing mid-page education section remains.
- **About:** a prominent charcoal section immediately after clinical authority has three clearly separated columns: **Professional Recognition**, **Editorial / Media**, and **Medical Education**. It displays **Top Doctors Spain 2020**, **Doctoralia Awards Spain 2022**, **Contributor to Men's Health Spain**, **AndroMax Training**, **Medical Trainer**, and **Training of urologists and aesthetic physicians**.
- **Girth:** the established clinical authority module still includes the Men's Health Spain contribution, FEBU and medical training.

Both awards remain `publishReady: true`. No categories, rankings, reviews, ratings, extra outlets or fabricated logos were introduced. Names render as typography because no official award/outlet logo assets have been supplied.

### 5. What changed in header/footer?

Header uses the transparent full lockup at 210px desktop, 200px tablet and 180px mobile, scaled proportionally. Navigation spacing is tighter and intentional; the former maximum link width was removed so **Penile Girth Enhancement** stays on one line at desktop widths. The existing six links and booking CTA remain directly accessible; the drawer remains the tablet/mobile navigation.

Footer full-logo width increased to 320px within the existing light stone brand region. One short bronze rule introduces the brand block; neutral rules and spacing clarify Care Areas and Your Consultation. Positioning, consultation location, service links, site links and legal links remain. There is no isolated white rectangle behind the logo.

### 6. How is Girth visually differentiated as flagship?

It now opens with a dedicated charcoal hero, larger two-line procedure heading, independently prominent **500+** and **Since 2018** metrics, light consultation CTA, explicit physician name/title/Medical Trainer and a clinical photo-ready composition. Supporting pages retain light heroes.

Its six-stage pathway has more breathing room, numbered markers and restrained nodes. Variability factors use six distinct supporting icons beside their text labels: anatomy, technique, product, volume, tissue response and follow-up. The non-explicit planning illustration, dark expertise, clinical limitations, and structured risks/aftercare/correction system remain intact. No outcome promises or new treatment claims were added.

### 7. Which final photography assets are still needed?

Owner-approved physician portrait(s), clinical-practice/consultation photographs, medical education/training photograph, and non-explicit clinical/detail imagery appropriate to the nine positions listed above. Portrait heroes use 4:5 on desktop; landscape clinical frames use 3:2. Mobile portrait slots use a compact 5:4 crop. Supply sufficient surrounding space for responsive cropping and accurate final alt text.

All slots remain `src: null`, `approved: false`. Approved local `/images/` files can be assigned in `src/config/photography.ts`. Reuse across appropriate slots is possible; nine layout positions do not require nine different photographs. Actual physician photography is the remaining asset dependency, not an invented visual substituted by this pass.

## QA and evidence

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass, including QA scripts |
| `npm run build` | Pass; 45 existing generated pages |
| `git diff --check` | Pass |
| Five pages × 375, 390, 430, 768, 1024, 1280, 1440, 1728px | 40 passes; one H1, no overflow, no console/page errors, responsive media, loaded logos, desktop nav on one line |
| Navigation | Direct flagship link, drawer navigation, Escape and focus return pass |
| Booking | Exact configured NMC handoff verified via intercepted new tab; no appointment submitted |
| FAQ / biography | Disclosure controls work; original biography preserved |
| Axe WCAG checks | No reported violations across all five pages at 390/1440px |
| Reduced motion | Preference detected, heading visible, no overflow |
| Logo alpha | Source RGB/canvas preserved; transparent optimized output confirmed at all eight widths |
| Visual inspection | All five desktop full pages; Home/About/Girth mobile compositions; desktop/mobile header and footer; dedicated authority and pathway details |

Browser results: [results.json](qa/r4-3/results.json). Browser automation uses existing Playwright and local Chrome against the production build on port 3502. This is not a full accessibility certification or Safari/Firefox verification. No application dependency was added. The existing local `NEXT_PUBLIC_SITE_URL` warning remains; domain and SEO configuration were outside this pass.

Lint initially caught CommonJS imports in the prior phase's capture scripts and the new asset helper. Those QA files now use ES modules. A mobile footer element screenshot included the sticky header; the final footer detail was correctly cropped from the full-page capture and the capture script updated. These were verification-artifact issues, not application routing changes.

## Screenshot comparison

[Open R4.2 → R4.3 gallery](qa/r4-3/index.html).

New 1440px full-page screenshots: Home, About, Girth, Male Aesthetics, Men's Health. New 390px full-page screenshots: Home, About, Girth. Additional 1440/390px header and footer close-ups, plus recognition, hero media, timeline and pathway. The gallery references preserved R4.2 full-page screenshots side by side.

## Stop state

R4.3 implementation, screenshots, required QA and this report are complete. The local verification server is stopped after checks. Await owner visual review. No merge or deployment.
