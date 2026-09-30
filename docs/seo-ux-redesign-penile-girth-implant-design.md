# SEO + UX Competitive Redesign — Design Plan (Phase B, pre-code)

**Status:** Design only. No code changed. Awaiting owner approval before implementation.
**Scope:** `/male-aesthetics/penile-girth-enhancement`, `/penile-implant`, and their `/ar/...` equivalents.
**Relationship to the previously-approved "Quick Wins" list:** this redesign is additive, not a replacement. Every item from the earlier approval (EN girth title fix, hero alt fix, girth length-vs-girth clarity statement, 4 FAQ additions, the unsupported-literature-claim rewrite, the implant-page Medical Trainer correction, the AR footer term fix, the AR "زيادة محيط القضيب" secondary variant, the two glossary additions, and the new "Penile Implant After Radical Prostatectomy" article) is folded into the relevant section below rather than dropped. Flagging this explicitly in case that assumption needs correcting.

**Component-reuse audit performed before drafting this plan** (so "component to reuse/create" below is grounded, not guessed):
- `ClinicalPathway` (`ProcedureFramework.tsx`) — numbered step list, already responsive (3-col desktop → 1-col mobile), already used for the girth page's journey.
- `VariabilityFactors` — icon+label grid, lucide-react icons at `strokeWidth={1.25}`, already the site's "restrained thin-line icon" precedent.
- `CandidateCheck` — two-column good/not-good card pair, already responsive (stacks below 768px), currently used only on the implant page.
- `PhysicianAuthority` / `AuthorityMetric` — the existing authority-strip component. It is **shared** with the About and Testosterone pages (confirmed via grep), so its core 3-stat grid should not be modified for girth-specific content — a page-scoped addition sits beside it instead.
- `OutcomeBenchmarkTable` — a 4-column **card grid**, not an HTML `<table>` (deliberate, documented decision: "the codebase has no horizontal-scroll-table precedent"). Its visual pattern (bordered cards, one per column, metrics stacked inside) is the right model for a new qualitative 2-column device-comparison component — the component itself is benchmark/numeric-specific and disclaimer-bound, so a sibling component is cleaner than overloading it.
- `ExpertiseTimeline` + its `.timeline`/`.milestone` CSS — already a responsive vertical/2-column timeline (1-col mobile, 2-col desktop with first/last milestone spanning full width), currently hardwired to About-page career copy. The **CSS pattern** is reusable for a new generic recovery timeline; the component itself is not.
- `ImplantDeviceDiagram` (`illustrations/ImplantDeviceDiagram.tsx`) — an abstract, non-anatomical SVG schematic (cylinder/pump/reservoir as connected shapes), built on a shared `illustration-base` helper. Only the inflatable device has a diagram today; malleable does not.

No new icon library, no new image assets, no photographic/anatomical illustration is proposed anywhere below — every new visual is either an existing component reused as-is, or a new component built from the same CSS/SVG primitives already in the codebase.

---

## 1. PENILE GIRTH ENHANCEMENT (EN) — section-by-section

| # | Section | Current issue | Proposed copy improvement | Proposed visual treatment | SEO intent served | Component | Status |
|---|---|---|---|---|---|---|---|
| 1 | Metadata/title | Title omits "Abu Dhabi" | `"Penile Girth Enhancement with Hyaluronic Acid in Abu Dhabi"` | — | penile girth enhancement Abu Dhabi | `buildMetadata` call | Reworded (1 line) |
| 2 | Hero | H1/intro don't state the girth-not-length distinction or name "filler"/"enlargement" as search synonyms | Add one clarifying sentence adapted from the owner's suggested conceptual line, naturally naming "penile filler" and "non-surgical penile enlargement" as terms patients search, while stating the procedure increases circumference, not length | No new component — extend existing hero paragraph | penile filler, hyaluronic acid penile filler, penile enlargement (clarified as girth) | Existing hero markup | Reworded (content retained, one sentence added) |
| 2b | Hero image | Empty `alt=""` on `girthFlagship` | N/A (alt text, not copy) | Descriptive alt describing the actual abstract illustration (three stepped cylindrical forms with measurement guides — verified by viewing the asset) — does not claim to depict Dr. Molina or a real patient | image accessibility/SEO | `editorial-media.ts` config | Fixed (1 field) |
| 3 | **NEW: Authority strip supplement** | `PhysicianAuthority` already shows 1,000+ / Since 2018 / Medical Trainer — but "Correction Experience" isn't part of it, and it's shared with About/Testosterone pages so shouldn't be modified for girth-only content | Add a 4th, page-scoped qualitative card: "Correction Experience — Previous filler / irregularity / revision assessment", no invented count | New small card placed immediately beside/after the existing `<PhysicianAuthority dark />` block, matching its dark card styling | correction/revision authority signal | New minimal component (e.g. `AuthorityHighlightCard`) — does not touch shared `PhysicianAuthority` | New (small, additive) |
| 4 | **NEW: "What this treatment can — and cannot — do"** | This exact distinction (girth-not-length, not an ED treatment, no guaranteed cm, not universally suitable, reversible via dissolution) is currently scattered across FAQ items 1, 2, 3, 5, 9 — no single scannable summary exists | Two-column CAN / DOES NOT card, wording drawn from what's already approved (no new claims): **Can** — increase circumference, improve contour/proportion where appropriate, be staged individually, be dissolved if clinically required. **Does not** — increase length, treat erectile dysfunction, guarantee a specific size, suit every patient | Reuse `CandidateCheck`'s two-column card shell (already responsive, already RTL-safe) with restrained icons per line (lucide-react, same stroke weight as `VariabilityFactors`) | penile girth enhancement, penile enlargement (clarified), hyaluronic acid filler reversibility | `CandidateCheck` (reused, new heading labels) | New section, placed right after the hero/authority — a visual summary of facts the detailed sections below (options, FAQ) already state in prose |
| 5 | Clinical pathway ("From the first conversation to follow-up") | Already a 6-step `ClinicalPathway` — close to the owner's requested "Assessment → Anatomical planning → Treatment → Early recovery → Follow-up → Refinement" journey, but doesn't name "Refinement" as an explicit final step | Relabel the 6 existing steps to match the requested journey language; add "Refinement when appropriate" as the final step, tying directly to the Correction Expertise differentiator | No new component | treatment pathway comprehension | `ClinicalPathway` (existing, content updated) | Reworded (existing component, updated copy) |
| 6 | **NEW: "Who may be suitable?"** | Suitability factors (anatomy, expectations, circumcision status, previous filler, fibrosis/Peyronie's, erectile function) are answered individually inside FAQ items and the "Individual Treatment Planning" pillar, but never summarized as a single scannable set | 6 short cards, one line each, each pointing down to (not duplicating) the fuller existing explanation | Reuse the same `StaggerGroup`/`StaggerItem` card-grid shell already used for `approachPillars`, with a small lucide icon per card (new, small, 6-item array) | penile girth enhancement candidacy, penile filler suitability | `StaggerGroup`/`StaggerItem` (existing pattern, new content array) | New section — visual summary placed before the existing detailed "Dr. Molina's Approach" pillars, which remain as the detailed layer underneath |
| 7 | "Dr. Molina's Approach" (7 pillars) + training credit | Full clinical philosophy — already strong | No rewording needed | No change, except the "Correction Expertise" card (item 7) gets a subtle accent border to visually connect it to the new Correction-Experience authority card above | anatomy-led planning, medical trainer | Unchanged | **Unchanged** (content), minor CSS accent only |
| 8 | Options considered (Non-surgical vs Surgical) | Contains the flagged unsupported claim: *"Published clinical literature supports hyaluronic acid as an option for penile girth enhancement, though outcomes vary..."* | Rewrite to remove the uncited "published literature supports" framing; keep the accurate, non-citation-dependent part about outcomes varying by anatomy/technique/plan | No visual change | avoids an unsupported scientific-sounding claim sitting on an otherwise rigorous page | Existing `options` array text | Reworded (1 sentence, factual correction) |
| 9 | Pull quote | Fine as-is | — | — | — | Unchanged | **Unchanged** |
| 10 | Expected variability (dark) + `VariabilityFactors` | Fine as-is, already icon-based and restrained | — | — | — | Unchanged | **Unchanged** |
| 11 | **NEW: Recovery timeline** | No visual timeline exists; recovery/return-to-sex timing is only in prose (vaguely, "settling period" / "follow-up review") | Phase-based (not day-count-based) timeline: Immediate period → Early recovery → Return to sexual activity (individualized) → Follow-up. Deliberately does **not** invent a day/week number the page doesn't already commit to — mirrors the site's existing, intentional "timing discussed individually" stance | New small vertical timeline built on the existing `.timeline`/`.milestone` CSS pattern from `ExpertiseTimeline` (generalized into reusable props), 1-col mobile / 2-col desktop | penile filler recovery, return to sexual activity after penile girth enhancement | New generic component (e.g. `RecoveryTimeline`, props-driven, not About-page-specific) | New section |
| 12 | Risks, Aftercare and Revision (`CareStages`, 3 items) | Fine — already covers Risks/Aftercare/Revision | No content change | Add a visible anchor/heading tie-in from the new "Correction Experience" authority card and the "Correction Expertise" pillar, so all three correction mentions feel connected rather than repeated in isolation | correction/revision authority | Unchanged component | **Unchanged** (content), added anchor link target only |
| 13 | About Dr. Molina | Fine | — | — | — | Unchanged | **Unchanged** |
| 14 | RelatedTreatments | Fine | — | — | — | Unchanged | **Unchanged** |
| 15 | FAQ (11 → 13 items) | Missing "Can penile filler be dissolved?" and "When can I return to sexual activity?" | Add both, each linking to its existing EN Insights article (`can-penile-filler-be-dissolved`, `when-can-you-have-sex-after-penile-girth-enhancement`) | No visual change — same `Faq` accordion, which already auto-emits FAQPage schema | can penile filler be dissolved, return to sex after penile girth enhancement | `Faq` (existing, 2 new items) | Added (no duplication of existing 11) |
| 16 | TreatmentCtaSection | Fine | — | — | — | Unchanged | **Unchanged** |

---

## 2. PENILE GIRTH ENHANCEMENT (AR) — section-by-section

Same structural changes as EN, applied with approved terminology. Differences worth calling out individually:

| # | Section | Current issue | Proposed change | Status |
|---|---|---|---|---|
| Title/meta | Already includes "أبوظبي" and "حمض الهيالورونيك" | No change needed (EN gap doesn't exist in AR) | **Unchanged** |
| Hero | No "فيلر"/"محيط" secondary terms | Add one sentence naming **"زيادة محيط القضيب"** as a secondary phrase (confirmed via live competitor research as a real, commonly used Arabic variant) — explicitly *alongside*, never replacing, the approved primary term "زيادة سماكة القضيب"; used once, not repeated | New (1 sentence) |
| CAN/CANNOT card | New module, same as EN | Arabic wording drawn from existing approved AR FAQ/option copy, not a fresh translation from scratch | New (mirrors EN) |
| Who may be suitable | New module, same as EN | 6 Arabic cards, same factors, own natural phrasing (not machine-translated from the EN card labels) | New (mirrors EN) |
| Pathway relabel | Same 6-step reword as EN | Arabic step labels for the same journey, "التحسين عند الاقتضاء" (Refinement when appropriate) as the new final step | Reworded |
| Unsupported claim | Same Arabic sentence exists (line ~51 of the AR page, mirroring the EN claim word-for-word) | Same rewrite applied in Arabic | Reworded |
| Recovery timeline | New, same phase structure as EN | Arabic phase labels, same "individualized, not a fixed day-count" framing | New (mirrors EN) |
| FAQ additions | AR page currently links its "permanence/dissolution" and "return to sex" content to **English-only** Insights URLs in 2 existing FAQ items (a flagged parity gap) | Add the 2 new FAQ items (dissolution, return-to-sex) as **self-contained Arabic answers with no `readMoreHref`** — deliberately not linking out to English-only articles again, since that would reproduce the exact gap already flagged. The dissolution answer is where the new **"الهيالورونيداز"** glossary term gets used for the first time on the site. New AR Insights articles are out of scope for this phase (per the original Phase A decision to defer the wider content-cluster roadmap) | New (2 items, self-contained) |
| "فيلر القضيب" usage | Term already appears informally in one existing AR Insights article title/body, but has no formal glossary entry | Formalize in the glossary (see §5 below) and use it once naturally in the new CAN/CANNOT card or hero sentence, alongside the formal "حشو" term already used elsewhere on the site — not replacing it | Documented + used once |

---

## 3. PENILE IMPLANT (EN) — section-by-section

| # | Section | Current issue | Proposed copy improvement | Proposed visual treatment | SEO intent served | Component | Status |
|---|---|---|---|---|---|---|---|
| 1 | Metadata/title | Already matches the owner's own suggested title exactly | No change | — | penile implant surgery Abu Dhabi | Unchanged | **Unchanged** |
| 2 | Hero | Fine | Minor: naturally work in "penile prosthesis" once more (it already appears once, in the candidacy description further down) | — | penile prosthesis, erectile dysfunction implant | Existing hero markup | **Unchanged** |
| 3 | Physician authority | "Medical Trainer · AndroMax Training" renders unqualified, implying implant-specific training expertise the credential doesn't cover (it's girth-specific per `doctor.medicalTrainer.role`) | Remove the Medical Trainer line from this page's authority rail only — the credential stays fully visible on the girth page and in `doctor.ts`; nothing removed globally | No visual addition, one line removed | authority accuracy (avoids an implied claim) | Existing inline authority block | Fixed (1 line removed) |
| 4 | **NEW: "When is a penile implant considered?" visual pathway** | The ED-treatment-ladder escalation (medication → other non-surgical options → persistent/refractory ED → implant) currently exists only inside one FAQ answer, never shown as an early visual summary | 5-step visual pathway: Erectile dysfunction → Oral medication (PDE5 inhibitors) → Other non-surgical options (vacuum device, shockwave, intracavernosal injection) → Persistent/refractory ED → Implant assessment. Explicitly framed as educational sequencing, not a rigid mandatory protocol (matching the existing FAQ's own framing) | Reuse `ClinicalPathway` (same component as the girth page), new 5-step content | when is a penile implant considered, erectile dysfunction implant | `ClinicalPathway` (reused) | New section, placed near the top as a visual summary; existing "Our approach" pathwayPrinciples cards (cause/severity, previous treatments, wider context, realistic expectations, device selection) remain immediately after it as the detailed layer |
| 5 | "Our approach" (5 pathwayPrinciples cards) | Fine, already strong detail layer | No change | — | — | Unchanged | **Unchanged** |
| 6 | Candidacy (`CandidateCheck`) | Fine | No change | — | — | Unchanged | **Unchanged** |
| 7 | Inflatable vs Malleable | Only inflatable has a diagram; comparison is two separate bullet-list cards, not a structured side-by-side | Add a matching abstract SVG diagram for the malleable device (same non-anatomical engineering-schematic style as the existing `ImplantDeviceDiagram`, same `illustration-base` infrastructure — two simple rods, no new visual language). Restructure the comparison into an explicit neutral side-by-side across: mechanism, flaccid-state appearance, concealment, components, operation/use, patient considerations. No winner declared — existing "considered when a simpler approach is preferred" framing is preserved, not sharpened into a recommendation | New sibling diagram (e.g. `MalleableDeviceDiagram`, same file pattern) + new 2-column comparison component modeled visually on `OutcomeBenchmarkTable`'s card-grid pattern, but qualitative (no disclaimer, no highlight column, no numeric-bidi handling needed) | inflatable penile implant, malleable penile implant | New component (e.g. `DeviceComparisonCards`) + new diagram | Restructured (existing bullet content redistributed into the new comparison rows, nothing deleted) |
| 8 | Pathway (dark, Assessment/Surgery/Recovery) | Already a reasonable 3-phase visual | No change | — | — | Unchanged | **Unchanged** |
| 9 | **NEW: "What an implant changes — and what it doesn't"** | Sensation/orgasm/ejaculation/length content is correct but spread across 2 prose paragraphs and 3 separate FAQ items, no single scannable summary | Card summary: **Changes** — provides mechanical rigidity. **Generally unchanged** — sensation, orgasm. **Depends on underlying status** — ejaculation. **Does not** — restore spontaneous natural erectile physiology, inherently increase length | Same card-shell component as the girth page's CAN/CANNOT module (shared generic component, different content per page) | does an implant affect sensation or orgasm, does an implant increase length | Shared new component (e.g. `TreatmentScopeCards`, used on both pages) | New — placed at the top of "Sexual Function After Surgery"; the two existing prose paragraphs stay directly beneath it as the detailed explanation |
| 10 | **NEW: "Penile Implant After Radical Prostatectomy"** | Topic exists only as one FAQ answer; no dedicated section despite being an owner-named priority and the subject of a new companion article | Full section: why ED can occur after prostatectomy (nerve-related and otherwise), why nerve-sparing doesn't guarantee recovery, rehabilitation options already covered elsewhere (PDE5 inhibitors, vacuum devices, intracavernosal injection — all already named on this page's FAQ), when persistent ED may justify implant discussion. Links to `/urologic-surgery/laparoscopic-radical-prostatectomy` and the new Insights article. The existing FAQ item is shortened to a short-answer + link into this new section, rather than repeating the full explanation twice | New named `SectionHeading` + prose, same visual register as "Sexual Function After Surgery" | penile implant after radical prostatectomy, erectile dysfunction after prostatectomy | New section (prose, no new component) | New — FAQ item retained but trimmed |
| 11 | **NEW: "Peyronie's Disease and Penile Implant"** | Peyronie's appears only as a `RelatedTreatments` card, never explained on-page | Short paragraph (not a full module): when severe Peyronie's disease coexists with ED not responding to other treatment, an implant can sometimes address both simultaneously — discussed individually, not asserted as a default. Links to `/peyronies-disease` | Grouped visually with the Post-Prostatectomy section as a small pair of "special clinical situations" | penile implant for Peyronie's disease | New short prose block | New (small) |
| 12 | **NEW: Recovery timeline** | Recovery is described in prose (3 phases, no explicit visual) inside one FAQ answer | Same generic `RecoveryTimeline` component as the girth page, populated with the *same 3 phases already stated in the existing FAQ* (initial healing/restricted activity → gradual return to normal activity → guided device-use introduction), plus Follow-up as an explicit closing node. No day/week counts invented — the existing FAQ already deliberately avoids quoting one | `RecoveryTimeline` (shared component, implant-specific content) | penile implant recovery timeline | `RecoveryTimeline` (reused from girth page work) | New section |
| 13 | Risks and Complications | Fine | No change | — | — | Unchanged | **Unchanged** |
| 14 | RelatedTreatments / FAQ / CTA | Fine structurally; FAQ items for the two topics promoted to full sections (10, 11 above) get shortened, not deleted | Add 2 new FAQ items per the earlier approval: "Can penile implants treat Peyronie's disease?" and "What is the infection risk?" | No visual change | penile implant Peyronie's disease, penile implant infection risk | `Faq` (existing, 2 new items + 1 shortened) | Reworded/added |

---

## 4. PENILE IMPLANT (AR) — section-by-section

Mirrors the EN plan exactly, with these AR-specific notes:

| Item | Note |
|---|---|
| Medical Trainer fix | Same single-line removal from the AR authority rail (`مدرّب طبي · AndroMax Training`) |
| Footer terminology | The sitewide AR footer link for this page currently reads "زراعة دعامة القضيب" — fixed to the approved primary term "دعامة القضيب" (glossary-documented decision) |
| Prostatectomy-page anchor text | The AR prostatectomy page's existing link to `/ar/penile-implant` uses anchor text "زراعة دعامة القضيب" — the same near-miss pattern as the footer. **Not changed in this phase** (out of the explicitly named scope — footer only was named in the prior approval); flagged again here as a known follow-up item, not silently fixed |
| New pathway/comparison/scope-card modules | Same components, Arabic content — not translated word-for-word from English, written to read naturally in Arabic (matching this site's established practice for every other AR page) |
| Post-prostatectomy + Peyronie's sections | Link to `/ar/urologic-surgery/laparoscopic-radical-prostatectomy`, `/ar/peyronies-disease`, and the Arabic version of the new article |
| Recovery timeline | Same 3-phase language, Arabic phase labels |

---

## 5. ARABIC GLOSSARY ADDITIONS (unchanged from the prior approval, restated for completeness)

Two new rows to add to `docs/arabic-medical-glossary.md`:

| English term | Arabic term | Note |
|---|---|---|
| Penile filler | فيلر القضيب | Complementary to, not a replacement for, the existing formal "حشو القضيب" (filler correction) — "فيلر" already appears informally in one live AR Insights article title; this formalizes it rather than introducing new usage |
| Hyaluronidase | الهيالورونيداز | No existing Arabic rendering anywhere on the site; needed for the new AR "can it be dissolved" FAQ answer |

---

## 6. NEW ARTICLE: "Penile Implant After Radical Prostatectomy" (EN + AR)

Unchanged from the prior approval's specification — restated briefly since the new "Post-Prostatectomy ED" on-page section (Implant page, item 10 above) links to it directly:

- **EN slug/title concept:** `penile-implant-after-radical-prostatectomy` — "Penile Implant After Radical Prostatectomy"
- **AR:** a natural (not literal) Arabic title for the same topic, own `enEquivalentSlug` pairing for reciprocal hreflang, following the exact pattern already used by `when-penile-implant-is-considered` / `penile-implant-when-considered`
- **Content:** why ED can occur after prostatectomy, nerve-sparing and why recovery varies, PDE5 inhibitors / vacuum devices / intracavernosal injections as earlier steps, when persistent ED may justify implant consideration, inflatable vs malleable, sensation/orgasm expectations, length expectations, individualized assessment — explicitly avoiding any claim that every post-prostatectomy patient needs an implant, any fixed recovery deadline, or guaranteed functional recovery
- **Internal links:** to `/urologic-surgery/laparoscopic-radical-prostatectomy`, `/erectile-dysfunction`, `/penile-implant` (AR to their AR equivalents)
- **Placement in `articles.ts`:** alongside the existing implant cluster (`penile-implant-when-considered`, `inflatable-vs-malleable-penile-implant`, `orgasm-ejaculation-after-penile-implant`)

---

## COMPONENT ARCHITECTURE SUMMARY

**Reused as-is (no code change to the component itself):**
- `ClinicalPathway` — girth journey relabel; new implant "when is an implant considered" pathway
- `CandidateCheck` — girth CAN/CANNOT card (new heading labels, same shell)
- `Faq`, `RelatedTreatments`, `CareStages`, `VariabilityFactors`, `SectionHeading`, `StaggerGroup`/`StaggerItem` — unchanged, reused for new content arrays

**New, small, generic components (not page-specific, reusable if a future page needs the same shape):**
1. `AuthorityHighlightCard` (or similar) — the standalone "Correction Experience" card sitting beside `PhysicianAuthority` on the girth page only. Does not modify the shared `PhysicianAuthority` component.
2. `TreatmentScopeCards` — the "Can / Cannot" and "Changes / Doesn't change" card pattern, used on both the girth page (girth content) and implant page (implant content) with different props. One component, two call sites.
3. `RecoveryTimeline` — generic vertical/2-column timeline built on the existing `.timeline`/`.milestone` CSS from `ExpertiseTimeline`, generalized to accept `{ label, description }[]` instead of About-page-hardcoded career copy. Used on both pages with different phase content.
4. `DeviceComparisonCards` — the 2-column qualitative device-comparison grid for Inflatable vs Malleable, modeled visually on `OutcomeBenchmarkTable`'s card pattern but without its numeric/disclaimer/bidi-fix logic (not needed for qualitative text).
5. `MalleableDeviceDiagram` — a new sibling SVG in `components/illustrations/`, same abstract non-anatomical style and `illustration-base` infrastructure as `ImplantDeviceDiagram`. **Flagging for explicit confirmation**: this is a simple engineering-schematic line diagram built the same way the existing one was (developer-authored SVG, not AI-generated imagery), but since the brief says "do not generate medical illustrations without owner review," I'd rather have this specific call made explicitly before drawing it, even though it's the same category of asset as the diagram already live on the page today.

**Config/content changes (no new components):**
- `editorial-media.ts` — girth hero alt text
- `doctor.ts` — no changes (no new numeric claims of any kind)
- `navigation.ts` — AR footer term fix
- `docs/arabic-medical-glossary.md` — 2 new rows
- `content/insights/articles.ts` / `articles-ar.ts` — 1 new EN article + 1 new AR article

**Nothing proposed touches:** `routes.ts`, `sitemap.ts`, canonical URLs, hreflang architecture (beyond the new article's own reciprocal pair), or JSON-LD schema types already in use.

---

## MOBILE BEHAVIOR

Every new/changed module already has a mobile-safe pattern to inherit, not invent:
- `ClinicalPathway` — 3-col → 1-col below 640px (existing CSS)
- `CandidateCheck` / `TreatmentScopeCards` — 2-col → 1-col below 768px (existing CSS)
- `RecoveryTimeline` — 2-col → 1-col below 768px (existing `.timeline` CSS)
- `DeviceComparisonCards` — modeled on `OutcomeBenchmarkTable`, which already stacks its cards to full width on mobile by design (explicitly documented as the reason no `<table>` is used anywhere on the site)
- The existing `Faq` accordion already handles progressive disclosure for FAQ growth on mobile

No dense tables, no horizontal scroll, no new text walls are introduced anywhere in this plan.

---

## EXPECTED SEO BENEFIT

- Closes the one confirmed title gap (girth EN) and the one confirmed accessibility/image-SEO gap (empty alt).
- Removes an unsupported claim that could be a genuine E-E-A-T liability if scrutinized.
- Adds on-page, crawlable coverage for: penile filler, hyaluronic acid penile filler, penile circumference enhancement, penile enlargement (correctly scoped to girth), penile prosthesis, erectile dysfunction implant, penile implant after radical prostatectomy, penile implant for Peyronie's disease — all via real prose sections, not keyword insertion.
- Doubles the FAQPage schema surface on both pages (4 new FAQ items total across both pages, in a schema type that already auto-generates correctly via the shared `Faq` component) without creating any duplicate or cannibalizing page.
- Strengthens the topical cluster around the new prostatectomy pillar via a genuinely new, non-thin article plus a full on-page section (not just a link).

## EXPECTED CONVERSION/UX BENEFIT

- A patient can now get the two or three facts that matter most (girth-not-length, reversible, not an ED treatment; implant is end-of-pathway, device types compared neutrally, sensation/orgasm generally preserved) in 10 seconds of scanning, before ever reaching the full clinical prose — without the clinical depth being shortened for anyone who reads further.
- The Correction Expertise differentiator — currently the 7th of 7 cards on the girth page, easy to miss — becomes visible within the first screen or two.
- Two clinically real, currently-underserved patient situations (post-prostatectomy ED, Peyronie's + ED) get an actual explanation instead of a bare link, directly connecting three parts of the site (prostatectomy pillar, ED page, implant page, Peyronie's page) that a real patient journey would naturally traverse.

---

## OPEN QUESTIONS FOR OWNER BEFORE IMPLEMENTATION

1. Confirm the new `MalleableDeviceDiagram` SVG (abstract, non-anatomical, same style as the existing inflatable one) does not need separate design/illustration review, given it's the same category of asset already live on the page — or say if it does.
2. Confirm the Recovery Timeline components should stay purely phase-based (no day/week numbers) rather than sourcing more specific timing from anywhere else — this plan assumes "only use timings already medically approved" means not inventing beyond what the existing FAQ prose already states.
3. Confirm the AR prostatectomy-page anchor-text near-miss ("زراعة دعامة القضيب") should stay out of scope this phase (matching how the prior approval scoped the fix to the footer only), or should be folded in now since this phase already touches Arabic implant terminology broadly.
