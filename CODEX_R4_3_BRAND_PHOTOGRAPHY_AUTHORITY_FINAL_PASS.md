# CODEX TASK — R4.3 BRAND INTEGRATION, PHOTOGRAPHY & AUTHORITY FINAL PASS

You are working on an EXISTING production-oriented Next.js website for Dr Alejandro Molina.

This is a focused visual correction pass.

DO NOT rebuild the site.
DO NOT change routes.
DO NOT change SEO strategy.
DO NOT create new content clusters.
DO NOT deploy.
DO NOT merge automatically.

The current R4.2 implementation is technically sound but the rendered result still feels insufficiently premium and insufficiently physician-led.

Main remaining issues observed in the actual screenshots:

1. the full logo still looks visually pasted onto the interface because the asset/background treatment is not integrated correctly
2. physician photography is still not structurally present enough
3. recognition/media authority is visible but too weak visually
4. beige/gold remains overused
5. the site still feels somewhat templated/editorial rather than premium specialist medical
6. Penile Girth Enhancement still needs stronger flagship differentiation
7. footer/header brand integration still needs refinement

The goal of R4.3 is NOT another global redesign.
The goal is to refine identity, physician presence, authority, and hierarchy.

Use the repository and current R4.2 output as the source of truth.

---

# 0. RECOVER CURRENT STATE

Before editing:

Read and inspect:

- R4_2_IMPLEMENTATION_REPORT.md
- R4_IMPLEMENTATION_REPORT.md
- IMPLEMENTATION_REPORT.md
- BRAND_AUTHORITY_ASSET_REQUIREMENTS.md
- LAUNCH_CHECKLIST.md
- current logo assets
- current header/footer
- Home
- About
- Penile Girth Enhancement
- Male Aesthetics
- Men’s Health
- current authority/media config
- current screenshots under qa/r4-2

Do not revert valid R4.2 work.

---

# 1. FIX THE FULL LOGO INTEGRATION PROPERLY

The current full logo still visually appears to sit on a different background surface.

This is not acceptable.

Inspect the actual logo asset used in header/footer.

## Requirement

Use a genuinely transparent logo asset with alpha transparency.

Preserve exactly:
- AM monogram
- gold/bronze curve
- Dr Alejandro Molina signature/name
- CONSULTANT UROLOGIST & ANDROLOGIST
- original proportions
- original typography
- original brand colors

Remove only the baked-in white/off-white background if present.

Do NOT:
- redraw the logo
- recreate it with HTML
- recolor it
- distort it
- use CSS filters
- use mix-blend-mode to fake integration
- place it inside a white rectangle/card/chip

## Header

The full logo must sit naturally on the actual header background.

There must be no visible rectangular canvas around it.

Desktop:
- full logo clearly readable

Tablet:
- scaled proportionally

Mobile:
- compact but still brand-correct

## Footer

Use the full logo in a visually intentional brand block.

If contrast is an issue on a dark footer:
- use a proper transparent light-compatible variant only if already approved
- otherwise create a deliberate light footer brand region as part of the layout

Do NOT add an arbitrary white box behind the logo.

---

# 2. REDUCE GOLD / BRONZE USAGE FURTHER

R4.2 improved the palette, but gold/bronze still appears too frequently.

Gold must be a signature accent, not the default visual answer.

Use it only for:
- selected thin rules
- occasional milestone nodes
- one or two key metrics
- subtle hover states
- selected micro-labels
- logo-derived detail

Do NOT use gold on:
- every eyebrow
- every divider
- every section number
- every timeline element
- every decorative curve

The visual system should feel primarily:
- warm white
- charcoal
- stone
- neutral grey

with gold as a controlled accent.

---

# 3. PHYSICIAN PHOTOGRAPHY MUST BECOME STRUCTURAL

The current website still lacks enough visible physician presence.

Create permanent image positions as part of the layout.

Do NOT use unapproved AI doctor images.

Do NOT use stock doctor images.

Do NOT use fake photo content.

Create refined photo-ready frames only.

## Home

Required:
1. hero portrait area
2. one mid-page physician/clinical image area

## About

Required:
1. hero portrait
2. professional/consultation image
3. education/training/professional activity image

## Penile Girth Enhancement

Required:
1. physician-led technical/clinical hero or near-hero image
2. secondary consultation/detail image

## Male Aesthetics

Required:
1. physician/clinical environment image

## Men’s Health

Required:
1. consultation/diagnostic image

The layout must clearly anticipate approved photography.

Do not use:
- diagonal placeholder hatching
- fake captions
- giant decorative text inside image frames
- abstract “magazine cover” substitutes

Until final images are supplied:
- use simple elegant media frames
- light tonal fill
- subtle border
- correct aspect ratio
- responsive behavior

---

# 4. MAKE THE PHYSICIAN THE VISUAL CENTER

The website still feels too content-led and not enough physician-led.

Across the five key pages, ensure the viewer sees:

Dr Alejandro Molina

as the central authority figure, not just as a name in the header.

Use:
- physician media placement
- authority metrics
- concise expert statements
- professional recognition
- medical training authority

Do not over-repeat biography copy.

---

# 5. PROFESSIONAL RECOGNITION MUST HAVE REAL VISUAL WEIGHT

The following are owner-confirmed and must remain publicly visible:

- Top Doctors Spain 2020
- Doctoralia Awards Spain 2022
- collaboration/contribution with Men’s Health Spain
- FEBU
- 15+ years in Urology
- 500+ Penile Girth Enhancement procedures
- Penile Girth Enhancement since 2018
- Medical Trainer
- AndroMax Training
- training of urologists and aesthetic physicians

Current issue:
Recognition/media is visible but visually weak.

## About

Create a dedicated, high-visibility section:

Professional Recognition
- Top Doctors Spain 2020
- Doctoralia Awards Spain 2022

Editorial & Media
- Men’s Health Spain
- other owner-confirmed media entries already present in project data

Medical Education
- AndroMax Training
- Training of urologists and aesthetic physicians

These should be clearly scannable within seconds.

Do not bury them in paragraph text.

## Home

Use a compact recognition/authority strip.

Do not make the homepage longer unnecessarily.

## Logos

If official logos are not available:
- use clean typographic treatment

Do NOT invent logo assets.

---

# 6. HEADER REFINEMENT

The current header is functionally correct but still needs a more premium balance.

Improve:
- logo sizing
- whitespace
- nav rhythm
- CTA positioning
- vertical alignment
- visual hierarchy

Do not make the logo too small.

Do not make the nav feel crowded.

Do not allow Penile Girth Enhancement to wrap awkwardly on desktop if avoidable.

Keep direct one-click navigation to:
Penile Girth Enhancement

Recommended nav:

Men’s Health
Sexual Medicine
Penile Girth Enhancement
Penile Surgery
Male Aesthetics
About

CTA:
Book a Consultation

---

# 7. FOOTER REFINEMENT

The footer still feels too functional/site-map-like.

Keep:
- full logo
- care areas
- site links
- legal links
- consultation location

Improve:
- brand hierarchy
- spacing
- visual separation
- concise positioning
- one restrained accent line/detail
- stronger logo presence

Avoid:
- excessive columns
- tiny logo
- generic grey list appearance
- white box behind logo

The footer should feel like the end of a premium personal medical brand.

---

# 8. HOME — FINAL BRAND PRESENCE PASS

Do not rebuild Home.

Refine these areas:

## Hero
- physician-led composition
- photo-ready hero frame
- stronger personal brand presence
- less empty/abstract space
- better visual balance

## Authority
Ensure the following are clearly visible:
- 15+ Years in Urology
- 500+ procedures
- Since 2018
- FEBU
- Medical Trainer
- Men’s Health Spain
- Top Doctors Spain 2020
- Doctoralia Awards Spain 2022

## Visual rhythm
Reduce text-wall feel using:
- media
- short authority statements
- one stronger contrast section
- visual diagnostic pathway

Do not add more overall content volume.

---

# 9. ABOUT — FINAL AUTHORITY + PHYSICIAN PRESENCE PASS

The About page must feel like the strongest personal authority page.

## Hero
Use a real photo-ready physician portrait area.

Do not use abstract editorial substitute panels.

## Authority
Make recognition/media unmistakable.

## Career story
Keep the trajectory, but reduce repetitive beige card appearance.

Use:
- shorter visible copy
- photo breaks
- fewer decorative gold elements
- stronger dark/light rhythm
- larger milestone moments

## Flagship expertise
One high-contrast section should communicate:

Penile Girth Enhancement
500+ procedures
Since 2018
Medical Trainer

This section should feel clinically authoritative, not cosmetic.

---

# 10. PENILE GIRTH ENHANCEMENT — STRONGER FLAGSHIP DIFFERENTIATION

This page still requires stronger flagship identity.

Do not change route or canonical.

## Hero
Make the hero clearly superior in visual weight to other treatment pages.

Must communicate immediately:
- Penile Girth Enhancement
- Consultant Urologist & Andrologist
- 500+ procedures
- Since 2018
- Medical Trainer
- photo-ready physician media

## Expertise section
Use a strong visual authority module.

## Clinical pathway
Keep visual pathway but improve:
- spacing
- iconography/markers
- hierarchy
- scanability

## Variability
Make anatomy / technique / product / volume / tissue response / follow-up more visually understandable.

## Risks / aftercare / correction
Keep as a structured visual system, not plain text.

## Photography
Add dedicated approved-photo-ready slots.

---

# 11. MALE AESTHETICS

Maintain clear hierarchy:

PRIMARY:
Penile Girth Enhancement

SECONDARY:
Scrotal Lift
Penile Filler Correction

Reduce beige/gold decoration.

Use one physician-photo-ready clinical media block.

Ensure flagship CTA is visually dominant.

---

# 12. MEN’S HEALTH

Keep the clinical framework introduced in R4.2.

Add:
- one clear physician consultation photo-ready section
- more personal physician presence
- stronger diagnostic authority
- less abstract/editorial feeling

Do not turn it into a condition directory.

---

# 13. BACKGROUND / DEPTH REFINEMENT

Do not add more decorative pattern for the sake of it.

Instead use:
- subtle tonal gradients
- charcoal contrast
- controlled stone fields
- layered media surfaces
- restrained grain
- occasional logo-derived line detail

The effect should feel sophisticated, not visibly “designed”.

Avoid:
- excessive swirls
- excessive curved gold lines
- wallpaper-like patterns
- repeated decorative motifs

---

# 14. VISUAL QUALITY STANDARD

The visual target is:

premium specialist physician website
+
strong personal brand
+
clinical trust
+
recognition
+
modern editorial refinement

NOT:
- luxury clinic
- beige lifestyle brand
- magazine template
- generic CMS
- SaaS layout

---

# 15. SCREENSHOT QA

Generate new screenshots:

1440px:
- Home
- About
- Penile Girth Enhancement
- Male Aesthetics
- Men’s Health
- header close-up
- footer close-up

390px:
- Home
- About
- Penile Girth Enhancement
- header
- footer

Compare against R4.2.

The report must explicitly answer:

1. Is the logo now genuinely integrated without a visible background rectangle?
2. Where was gold reduced?
3. Where were physician photo positions added?
4. Where are Top Doctors / Doctoralia / Men’s Health now visible?
5. What changed in header/footer?
6. How is Girth now visually differentiated as flagship?
7. Which final photography assets are still needed?

---

# 16. QA

Run:

- typecheck
- lint
- production build
- real-browser QA

Viewports:
375
390
430
768
1024
1280
1440
1728

Verify:
- no overflow
- no logo canvas mismatch
- no visible white/off-white rectangle around transparent logo
- no broken nav
- full logo readable
- booking CTA works
- one H1
- reduced motion
- no console errors
- no invented claims

---

# 17. DO NOT TOUCH

Do not:
- create articles
- modify routes
- change canonical strategy
- enable PRP
- invent reviews
- invent ratings
- invent awards
- invent media appearances
- deploy
- merge automatically

---

# STOP CONDITION

Stop after:
- R4.3 visual corrections are complete
- screenshots are generated
- QA passes
- R4.3 implementation report is written

Do not merge.
Do not deploy.

Wait for owner visual review.
