# CODEX TASK — STRATEGIC VISUAL + PRODUCT CORRECTION PASS

You are working on an EXISTING production-oriented Next.js website for Dr Alejandro Molina.

DO NOT rebuild the project.
DO NOT replace the architecture.
DO NOT create duplicate routes.
DO NOT change SEO strategy unless explicitly requested below.
DO NOT deploy.
DO NOT merge branches automatically.

Your job is to improve the CURRENT site in four specific areas:

1. product/navigation hierarchy
2. physician authority presentation
3. visual composition/art direction
4. flagship treatment positioning

Use the repository as source of truth.

---

## 0. RECOVER CURRENT STATE FIRST

Before changing anything:

Read:
- IMPLEMENTATION_REPORT.md
- LAUNCH_CHECKLIST.md
- BRAND_AUTHORITY_ASSET_REQUIREMENTS.md
- POSITIONING_UX_COPY_AUDIT.md
- POSITIONING_UX_REDESIGN_PLAN.md
- SEARCH_CONSOLE_MONITORING_PLAN.md
- any R1/R2/R3/R4 reports/plans
- config files for doctor/site/authority/media/reviews

Inspect:
- current branch
- current working tree
- routes
- navigation
- homepage
- About
- Male Aesthetics
- Penile Girth Enhancement
- footer/header
- logo assets
- current screenshots if available

Do not rely on prior chat memory.

---

# 1. PRODUCT HIERARCHY — FIX PENILE GIRTH ACCESS

Penile Girth Enhancement is the flagship commercial procedure.

It must be directly accessible from the primary navigation.

Keep the existing canonical route:

/male-aesthetics/penile-girth-enhancement

Do NOT create a second URL.

Add a primary navigation item:

Penile Girth Enhancement

Recommended nav order:

Men’s Health
Sexual Medicine
Penile Girth Enhancement
Penile Surgery
Male Aesthetics
About

Keep Book a Consultation as CTA.

The user should reach the flagship page in one click.

Also ensure direct visibility from:
- homepage
- About
- Male Aesthetics
- footer
- relevant hubs

---

# 2. HEADER + FOOTER BRAND CORRECTION

Use the approved FULL logo asset as the primary brand identity.

Do not use the favicon or isolated AM icon as the main header/footer identity.

Header:
- desktop: full approved logo
- tablet: compact responsive full lockup
- mobile: compact logo treatment, preserving brand identity

Footer:
- full approved logo
- no tiny favicon chip
- no recreated logo typography in HTML

Do not redraw or reinterpret the logo.

---

# 3. ABOUT PAGE — AUTHORITY MUST BE OBVIOUS

The current About page is too weak and too CV-like.

Create a visually strong authority section.

Must include verified/owner-confirmed facts:

Clinical authority:
- 15+ years in Urology
- Penile Girth Enhancement since 2018
- 500+ procedures
- Consultant Urologist & Andrologist
- FEBU

Medical education:
- AndroMax Training
- trains urologists and aesthetic physicians

Editorial/media:
- owner-confirmed collaboration/contribution with Men’s Health Spain
- support verified media appearances via config

Professional recognition:
- Top Doctors Spain 2020
- Doctoralia Awards Spain 2022

IMPORTANT:
Top Doctors and Doctoralia exact official naming/category must stay publish-gated until verified.

Do not invent titles or categories.

This authority section must be visually scannable in seconds.

Do not bury it in paragraphs.

---

# 4. HOMEPAGE AUTHORITY

Near the top of the homepage, communicate quickly:

15+ Years in Urology
500+ Penile Girth Procedures
Since 2018
FEBU
Medical Trainer
Men’s Health contribution

Use a strong editorial composition.

Do not make the homepage longer unnecessarily.

---

# 5. VISUAL ART DIRECTION — CURRENT SITE IS TOO FLAT

The site currently feels too dependent on:
- white background
- text
- horizontal rules
- repeated sections

Improve the actual visual composition.

Do not merely add subtle 2% opacity textures.

Introduce visible but restrained depth using:

- warm ivory gradients
- soft stone fields
- oversized low-opacity brand curves
- gold/bronze line motifs
- layered section backgrounds
- subtle grain
- abstract contour geometry
- asymmetric layouts
- stronger contrast cadence
- intentional whitespace
- visual pathways/timelines
- editorial callouts

The result should be visibly richer without becoming flashy.

Avoid:
- SaaS dashboards
- generic card grids everywhere
- luxury-hotel black/gold cliché
- cosmetic-clinic look

Target:
premium
medical
specialist
editorial
physician-led

---

# 6. DESIGN INFORMATION, NOT JUST TEXT

Create reusable visual components where they improve understanding:

- ClinicalPathway
- ExpertiseTimeline
- AuthorityMetric
- ExpertInsight
- ProcedureFramework
- HighlightRail
- LayeredEditorialPanel

Use them selectively.

The site should not read as endless paragraphs.

---

# 7. HOMEPAGE HERO

The current empty diagonal placeholder looks unfinished.

Until approved photography exists:
- remove the obvious placeholder treatment
- create an intentional photography-ready art-directed composition
- use brand curve / tonal fields / subtle annotation / layered frame

It should look complete even without a photo.

Do not use fake doctor imagery.

---

# 8. ABOUT — TURN BIOGRAPHY INTO A STORY

Use a clear visual narrative:

Spain
→ tertiary urology
→ surgical practice
→ andrology
→ men’s sexual health
→ male genital aesthetics
→ 500+ procedures
→ medical education

Use:
- timeline
- milestones
- alternating composition
- visual connectors

Preserve truthful existing content.

---

# 9. PENILE GIRTH ENHANCEMENT — TRUE FLAGSHIP PAGE

This page must be visually and strategically stronger than other treatment pages.

Do not change route/canonical.

Improve:

Hero:
- strong positioning
- 500+
- Since 2018
- Consultant Urologist & Andrologist
- Medical Trainer

Clinical pathway:
01 Consultation
02 Anatomical assessment
03 Individual planning
04 Procedure
05 Settling/remodelling period
06 Follow-up

Anatomy-led module:
- abstract/non-explicit medical visual
- explain anatomy-dependent planning

Variability module:
- anatomy
- technique
- product
- volume
- tissue response
- follow-up

Expertise block:
- 15+ years
- 500+
- since 2018
- medical trainer

Risks / aftercare / correction:
- visual three-stage system
- not plain text columns

The page must feel like the flagship procedure.

Do not overpromise outcomes.

---

# 10. MALE AESTHETICS HUB

Visual hierarchy must clearly be:

PRIMARY:
Penile Girth Enhancement

SECONDARY:
Scrotal Lift
Penile Filler Correction

Do not give equal visual weight to all three.

---

# 11. MEDIA / RECOGNITION / REVIEWS

Use existing config-driven architecture.

Only render publish-ready verified items.

Men’s Health can render using owner-approved wording.

Top Doctors / Doctoralia remain gated until exact naming is verified.

Do not create fake reviews, ratings or logos.

---

# 12. MOTION

Use restrained motion only where it reinforces design:

- line/path draw
- timeline progression
- metric entrance
- masked frame reveal
- subtle hover transitions

Respect prefers-reduced-motion.

---

# 13. DO NOT USE AI DOCTOR PHOTOS

Do not use the unapproved AI doctor images in public/brand.

Prepare photography-ready layouts only.

---

# 14. VISUAL VERIFICATION

Before/after screenshots required for:

1440px:
- Home
- About
- Male Aesthetics
- Penile Girth Enhancement

390px:
- Home
- Penile Girth Enhancement

Do not judge completion from code only.

If the pages still look mostly like text on flat white/grey backgrounds, the task is incomplete.

---

# 15. QA

Run:
- typecheck
- lint
- production build
- browser QA

Viewports:
375
390
430
768
1024
1440
1728

Verify:
- no overflow
- nav works
- logo scales correctly
- booking CTA works
- one H1
- no console errors
- accessibility
- reduced motion
- no unverified authority claims

---

# STOP CONDITION

Do not deploy.
Do not merge automatically.
Do not create new SEO articles.
Do not enable PRP.

Stop after implementation and provide:
- summary of visible changes
- before/after screenshots
- files changed
- QA results
- remaining gated items
