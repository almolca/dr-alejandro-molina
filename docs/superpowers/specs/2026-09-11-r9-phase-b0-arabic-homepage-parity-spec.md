# R9 Phase B0 — Arabic Homepage Content & Visual Parity

Status: approved for implementation (owner correction, 2026-09-11)
Scope: brings `/ar` to genuine content/visual parity with the production English homepage `/` (commit `b11234e`), before any other Phase B page translation starts. Supersedes the R9 Phase A pilot's homepage content only — Phase A's routing/RTL/hreflang/sitemap architecture is untouched and explicitly not being redone.

## 0. Why this exists

R9 Phase A shipped `/ar` as an architecture pilot with a deliberately reduced homepage — `HomePageTemplate.tsx`'s own header comment says so directly: *"an intentionally reduced 'representative subset' of the full English homepage's ~10 sections (hero, trust/authority stats, FAQ, booking CTA only) — full section parity is a Phase B follow-up, not built here."*

The owner compared the live `/` and `/ar` and confirmed that gap is now unacceptable to carry into Phase B: 4 thin blocks vs. the English homepage's 10 fully-composed, image-bearing, richly-linked sections. This spec is the parity audit and remediation design; the implementation plan is `docs/superpowers/plans/2026-09-11-r9-phase-b0-arabic-homepage-parity.md`.

## 1. English source of truth — section inventory

Audited directly from `src/app/(en)/(marketing)/page.tsx` (10 sections, in render order) against the current `/ar` implementation (`src/app/(ar)/ar/(marketing)/page.tsx` → `HomePageTemplate` + `homeContentAr`).

| # | English section (component) | Exists in `/ar` today? | Arabic content complete? | Imagery/media present? | CTAs/links localized? |
|---|---|---|---|---|---|
| 1 | `HeroSection` — H1, specialty line, description, credential line, location, 2 CTAs, physician portrait | Partial (`HomePageTemplate` hero block) | Partial — copy exists but softer than English ("Book a Confidential Consultation" → plain "Book"); missing 2nd CTA ("Explore Penile Girth Enhancement") | **No** — portrait image entirely missing | Partial — 1 of 2 CTAs present, routes to `/book` (already live for both locales) |
| 2 | `AuthorityStripSection` (`PhysicianAuthority`, animated stats + award-logo recognition rail) | **No** — replaced by a plain bulleted "trust" stat list | No — real component (animated metrics, award logos, medical-trainer rail, editorial-contribution rail) not present | **No** — award logos, AndroMax logo, Men's Health logo all missing | N/A — no links in this section |
| 3 | `FeaturedProcedureSection` — dark flagship band, Penile Girth Enhancement | **No** | No | **No** — no BrandCurve accent | N/A (no equivalent to check) |
| 4 | `CoreExpertiseSection` — flagship service card + 4 primary care areas + 5 secondary links | **No** | No | No | No |
| 5 | `SexualHormonalHealthSection` — `ClinicalDecisionFlow` diagram, ED paragraph + 6 contributors, hormonal quote + 9 assessment pillars | **No** | No | No (`VascularFlowDiagram` illustration also absent) | No |
| 6 | `AdvancedPenileSurgerySection` — 2 implant types, 4-step "how the cause is confirmed" | **No** | No | No | No |
| 7 | `AboutSection` — physician narrative, 4 credential highlights, clinical photo | **No** | No | **No** — `PhotoFrame` clinical photo missing | No |
| 8 | `AuthorityMediaSection` — awards line, review headline, editorial contribution, AndroMax training description | **No** | No | No | N/A |
| 9 | `InsightsSection` — 3 featured article teasers + "All Insights" link | **No** | No | No | No |
| 10 | `BookingSection` — closing CTA band + "View NMC Profile" secondary link | Partial (`HomePageTemplate` booking block) | Mostly — heading/description/CTA present | N/A (no imagery on English version either) | Partial — main CTA present, "View NMC Profile" secondary link missing |
| — | *(Arabic-only)* FAQ (3 items) | **Arabic has this, English homepage does not** | Complete | N/A | N/A |

**Verdict:** 8 of 10 English sections have no Arabic equivalent at all today. This confirms the owner's observation exactly and is the reason Phase B0 exists.

## 2. Root cause (architecture, not a bug)

The English homepage composes 10 dedicated, hand-built section components directly in `page.tsx` — this has always been the site's real, permanent homepage pattern. `/ar` instead renders a generic `HomePageContent`-typed object through `HomePageTemplate.tsx`, a template built to prove the Phase A routing/RTL/SEO chain worked end-to-end, covering only 4 of the 10 sections by design. Nothing else consumes `HomePageContent`/`HomePageTemplate`/`homeContentAr` (confirmed by repo-wide search) — they are safe to retire in favor of dedicated Arabic section components that mirror the English ones, which is both more consistent with the codebase's established pattern and enables genuine visual parity (same primitives, same imagery, same composition).

## 3. Remediation approach

Build one dedicated Arabic section component per English section (`src/components/sections/ar/*SectionAr.tsx`), each reusing the *exact same* shared visual primitives, imagery slots, and illustrations as its English counterpart (`Container`, `SectionHeading`, `HeroAtmosphere`, `HeroPortrait`, `PhotoFrame`, `ClinicalDecisionFlow`, `VascularFlowDiagram`, `BrandCurve`, `PhysicianAuthority`, `Faq`, `BookingCta`, `Button`), with Arabic copy and RTL-correct composition. `src/app/(ar)/ar/(marketing)/page.tsx` composes them in the same order as the English `page.tsx`, plus the existing bonus FAQ block. `HomePageTemplate`, `homeContentAr`, and `HomePageContent` are deleted as dead code once nothing references them.

Two shared primitives carry hardcoded English strings and need a `locale?: "ar"` prop (same pattern already used by `Faq` and `Header`) rather than a parallel Arabic component, since duplicating them would fork the underlying data (animated stat values, award logos, clinical-flow steps) away from its single source of truth:
- `PhysicianAuthority` (`src/components/editorial/PhysicianAuthority.tsx`) — labels ("Years in Urology", "Professional Recognition", medical-trainer rail text, editorial-contribution wording).
- `ClinicalDecisionFlow` (`src/components/editorial/ClinicalDecisionFlow.tsx`) — the 6-step list + `aria-label`.

## 4. Visual parity — imagery decisions

All physician/clinical photography (`homeHero`, `homeClinical` slots in `src/config/photography.ts`) is AI-generated/AI-edited imagery based on Dr. Molina's own likeness, explicitly approved for branded use, with generic professional-identity alt text — **no baked-in English text in any photograph**. These assets are reused as-is for `/ar` (same files, new Arabic `alt` text), per instruction §5 — no new imagery generated, no duplicate files.

Two categories of image **do** carry fixed non-Arabic text and are flagged rather than silently reused as if translated:
- **Award badge logos** (`awardLogos` in `src/config/reputation.ts`: Top Doctors Spain 2020, Doctoralia Awards Spain 2022) — official third-party award seals with their own baked-in branding/typography. These are reused unmodified, the same way an English-language site would display a foreign-issued award unchanged; the surrounding Arabic label ("الاعتراف المهني") gives it context. Not a defect — just documented here per instruction §5.
- **Publication/partner logos** (Men's Health Spain, AndroMax Training) — same treatment, reused unmodified as brand marks.

Decorative SVG primitives (`BrandCurve`, `VascularFlowDiagram`) carry no text at all and are reused with zero changes.

## 5. RTL correctness — CSS findings

`src/app/(ar)/layout.tsx` already sets a true `<html lang="ar" dir="rtl">` root (Phase A). Auditing every shared class the newly-added sections pull in against that root surfaced two pre-existing physical-property (not logical-property) rules that do **not** mirror correctly under `dir="rtl"`, in `src/components/editorial/VisualSystem.module.css`:

- `.flow` / `.flow li::before` (used by `ClinicalDecisionFlow`, reused in `SexualHormonalHealthSectionAr`) — uses `padding: 1.5rem 1.5rem 2rem 0` and `left: 0` for the step marker dot. Under RTL this pins the dot to the physical left instead of the reading-direction start, breaking the numbered-flow layout.
- `.footerBrand` — uses `padding-right: 2rem`, which is sitewide (every `/ar` page, footer included) and has silently been wrong since the Phase A pilot shipped.

Both get fixed to logical properties (`padding-inline`, `inset-inline-start`, `padding-inline-end`) as part of this work — a small, additive CSS change with no visible effect on English (`dir="ltr"`) rendering, verified by keeping English screenshots unchanged in QA (§10 below).

Two minor **visual-judgment, not-a-bug** calls, documented rather than silently decided:
- `FeaturedProcedureSectionAr`'s "Assessment → Individual planning → Follow-up" mini-flow uses `←` instead of `→` in Arabic, since the arrow should point toward reading-direction progression (right-to-left), not mirror the English glyph literally.
- The decorative `↗` arrow-glyph in `CoreExpertiseSection`'s "Explore the procedure ↗" link is left un-mirrored in Arabic — it reads as a generic "open/expand" accent, not a literal directional indicator, consistent with instruction §4 ("do not mechanically mirror... use visual judgment").

## 6. Copy — full section-by-section Arabic translation

Professional-effort Modern Standard Arabic, same standard already applied (and flagged for native-speaker QA) in the Phase A pilot's existing 4 blocks. No new claims are introduced; every statistic, credential, and award name is carried over unchanged from the same source config the English components read (`config/doctor.ts`, `config/reputation.ts`, `config/mediaAppearances.ts`, `config/practice.ts`) — translation only changes labels/prose around those facts, never the facts themselves. Full copy is written out in the implementation plan, task-by-task, so translation and code ship together and stay reviewable as a unit.

## 7. Internal links — what's real vs. temporary

Per the route registry (`src/lib/seo/routes.ts`), **only `/` has a live `arPath` (`/ar`)** — no other Arabic destination page exists yet. Every deep link the new Arabic homepage sections need (procedure pages, `/about`, `/insights/*`, etc.) therefore points to its **existing English page**, exactly like the site's Arabic header/footer nav already does today (Phase A spec §6: *"since no other `/ar` pages exist yet, the pilot's header/footer nav links point to the existing English content pages... this is intentional and temporary."*). This spec continues that same, already-established pattern — no invented `/ar/*` URLs.

Full link table (all temporary English destinations until their Phase B Arabic page ships):

| Arabic link label | Destination | Status |
|---|---|---|
| استكشف زيادة سماكة القضيب (hero + flagship + core expertise) | `/male-aesthetics/penile-girth-enhancement` | Temporary EN |
| استكشف ضعف الانتصاب | `/erectile-dysfunction` | Temporary EN |
| استكشف الصحة الهرمونية للرجال | `/mens-health/testosterone` | Temporary EN |
| التجميل الذكوري (core expertise card) | `/male-aesthetics` | Temporary EN |
| خصوبة الرجل (core expertise card) | `/male-fertility` | Temporary EN |
| مرض بيروني / دوبلر القضيب / سرعة القذف / دوالي الخصية / قطع القناة المنوية (secondary links) | `/peyronies-disease`, `/erectile-dysfunction/penile-doppler`, `/sexual-medicine/premature-ejaculation`, `/male-fertility/varicocele`, `/mens-health/vasectomy` | Temporary EN |
| استكشف زراعة القضيب / الموجات فوق الصوتية الدوبلر للقضيب | `/penile-implant`, `/erectile-dysfunction/penile-doppler` | Temporary EN |
| تعرّف على د. مولينا | `/about` | Temporary EN |
| جميع المقالات + 3 article teasers | `/insights`, `/insights/[slug]` | Temporary EN — flagged in-page (§8 below) |
| عرض الملف الشخصي في NMC | `practice.physicianProfileUrl` (external, NMC site) | Permanent — external, not a site route |
| احجز استشارتك السرية / احجز استشارة | `/book` | Permanent — already live for both locales |

Once each destination's Arabic page ships in later Phase B work, its `arPath` gets added to `routes.ts` and the corresponding homepage link is updated — no other code changes needed at that point.

## 8. Insights section — bilingual honesty decision

Translating the three article *teasers* while linking to English-only articles would misrepresent the destination. Decision: keep the section chrome (eyebrow, heading, "All Insights" link) in Arabic, keep the three article titles/tags in their original English (they are real, specific published titles — inventing Arabic ones would be a new, unverified claim), and add one small Arabic notice above the article grid: *"المقالات التالية متاحة حاليًا باللغة الإنجليزية فقط"* ("The following articles are currently available in English only"). Revisit once Arabic articles exist.

## 9. SEO — unchanged

`/ar` self-canonical, reciprocal `en-AE`/`ar-AE`/`x-default` hreflang, sitemap inclusion, and `FAQPage` JSON-LD (`inLanguage: "ar"`) are all untouched — this work only changes what renders in the page body, not the metadata block in `src/app/(ar)/ar/(marketing)/page.tsx`. The FAQ item set is unchanged (3 items, relocated from `homeContentAr.faq.items` to a small dedicated `src/content/ar/homeFaq.ts` module), so no schema content changes. English homepage SEO is not touched at all.

## 10. Responsive QA plan

Compare `/` and `/ar` at 390 / 768 / 1024 / 1440 via Playwright screenshots (both routes, both directions) after implementation, checking: section-for-section content completeness, image presence, RTL mirroring correctness (especially the two CSS fixes in §5), no overflow, no broken media, spacing/typography comparable. Full checklist and screenshot capture steps are in the implementation plan's final task.

## 11. Exit criteria (from the owner's brief, carried forward verbatim)

- [ ] Every substantive English homepage section has an Arabic equivalent (table in §1, closed out)
- [ ] Arabic homepage copy is complete (§6, no abbreviation)
- [ ] Approved imagery is present (§4)
- [ ] Visual richness is comparable (same primitives/composition, §3)
- [ ] RTL is correct (§5 CSS fixes verified)
- [ ] Internal links are safe — no invented `/ar/*` URLs (§7)
- [ ] Metadata/schema remain correct (§9)
- [ ] Owner can compare `/` and `/ar` and reasonably consider them equivalent language versions

Deploy target: **Preview only**, on `feat/arabic-localization-r9-phase-b`. No merge to `main`, no Production deploy, without owner review.
