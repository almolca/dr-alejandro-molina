# Positioning, UX & Redesign Plan

Phase D deliverable — **an implementation plan, not code.** Nothing in this document has been built. It is organized into three phases (R1 global system, R2 high-value commercial pages, R3 supporting pages) so that whichever phase is approved next can be scoped and executed independently, following the same recovery-first discipline used in Phases A–C.

Every item specifies: problem, proposed solution, component/page affected, expected UX/positioning benefit, SEO impact, compliance risk, and implementation complexity (low / medium / high).

This plan does not resolve `NEXT_PUBLIC_SITE_URL` / deployment — that remains the pre-existing launch blocker documented in `LAUNCH_CHECKLIST.md` and is out of scope here.

**Implementation status (2026-09-07):** most of PHASE R1 and the highest-priority items of PHASE R2 are now implemented (branch `phase-r1-r2-positioning-redesign`, 19 commits — full detail in `IMPLEMENTATION_REPORT.md` Phase 11 and `docs/superpowers/plans/2026-09-07-phase-r1-r2-positioning-redesign.md`).

- **Done:** R1.1 (cookie banner — implemented differently than originally proposed; see the plan doc's own note on why), R1.2 (placeholder captions), R1.3 (documentation only — photography itself not sourced), R1.4 (header identity), R1.5 (AuthorityBlock extraction), R1.9 (confirmed bugs); R2.1 (Homepage), R2.2 (Male Aesthetics hub), R2.5 (Men's Health hub), R2.8 (Penile Implant — both sub-items satisfied via A1's placeholder fix and R2.1's homepage reweighting), R2.9 (About, via the P0 bug fixes). Also done but not originally itemized here: FAQ + closing CTA added to the Sexual Medicine and Penile Surgery hubs (R3.4 pulled forward), footer physician-identity update (item 25 of the owner's brief).
- **Not done — still open:** R1.6 (FAQ support in the article template), R1.7 (functional category filtering on the Insights index), R1.8 (the broader sitewide hedge-phrase copy variation pass — CTA wording and structural fixes landed, but the phrase-level rewrite itself wasn't done), R2.3 (a Girth-Enhancement-specific distinguishing template element beyond the now-shared AuthorityBlock — e.g. a page-specific strapline or correction-experience callout), R2.4 (Filler Correction's presentations-grid visual differentiation), R2.7 (AuthorityBlock exists and is reusable but hasn't been added to the ED page itself), and all of PHASE R3 except the two hub items pulled forward above.

**Visual enrichment layer (2026-09-07):** a separate initiative — not itemized in this document — added a real logo, a charcoal (not navy) dark-section palette, reusable texture/curve/tonal-section primitives, additional motion, and further text-wall breaks across several of the pages this plan already touched. Full detail in `IMPLEMENTATION_REPORT.md` Phase 12 (first pass, judged incomplete by the owner) and Phase 13 (the correction pass that actually completed it, including a real before/after screenshot comparison). Notably this strengthens R1.4 (header identity) beyond what's described below — the header now carries the actual AM logo mark, not just text — and touches R2.1 (Homepage), R2.2 (Male Aesthetics), R2.9 (About) again with palette/texture/motion changes layered on top of the positioning/copy work already recorded as done. It does not change any of the "Not done" items listed above; those remain open.

**R4 correction (2026-09-07):** the dedicated flagship treatment in R2.3 is now implemented: anatomy-planning artwork, six-step clinical pathway, variability factors and a staged care/revision system. Home and About now have scannable clinical/education/editorial authority; About has an alternating connected timeline. Full logo lockups replace the header/footer symbol-and-text treatment. The primary navigation exposes the existing Girth Enhancement canonical route directly. See `R4_IMPLEMENTATION_REPORT.md` and `qa/r4-visual-review.html` for evidence. Other unrelated open items above retain their prior status.

Read each item below for its original, unedited recommendation; this status note is the single place tracking what's actually landed versus still open.

---

## PHASE R1 — GLOBAL SYSTEM

Fixes here affect every page at once and should land before page-specific work in R2/R3, since several R2/R3 recommendations assume these exist (e.g., the authority-module and read-more patterns).

### R1.1 — Cookie banner overlapping primary CTA (mobile)

- **Problem:** Confirmed via DOM measurement: the fixed-position cookie banner overlaps the hero "Book a Consultation" button on 390px viewports at first paint, before any user interaction. This is the single highest-severity conversion defect found in the audit.
- **Proposed solution:** Either (a) reduce the banner's default height/reposition it as a slim bottom bar that reserves guaranteed clear space above it for the last ~80px of viewport, or (b) offset the hero CTA's minimum bottom margin on mobile so it can never sit inside the banner's maximum footprint, or (c) delay the banner's appearance by a short interval (e.g., after first scroll or a few seconds) so the very first paint isn't obstructed. Do not simply shrink the legally-required copy to fit — content and consent choices must stay fully legible.
- **Component/page affected:** `src/components/ui/ConsentBanner.tsx`; possibly `src/components/sections/HeroSection.tsx` spacing.
- **Expected UX/positioning benefit:** Removes a hard, silent conversion blocker affecting every first-time mobile visitor.
- **SEO impact:** None directly, but Core Web Vitals / mobile-usability signals in Search Console could reflect layout-overlap issues if Google's mobile-friendliness checks flag it.
- **Compliance risk:** None — the consent banner's legal function (offer accept/decline, link to privacy policy) is unaffected; this is purely a layout fix.
- **Implementation complexity:** Low.

### R1.2 — Live "developer caption" text on `ImagePlaceholder`

- **Problem:** Placeholder captions like "Material / texture imagery — anatomy-led, not a clinical photograph. No genital close-ups." and "Illustration only. Photography/diagram pending." are real, visible, indexable text on the production page — confirmed via live DOM inspection, not just source reading.
- **Proposed solution:** Two options, not mutually exclusive: (a) restyle the placeholder so the caption reads as an intentional editorial label rather than an internal brief — shorter, more polished wording ("Photography in progress" rather than a full photographer's brief) — and (b), more importantly, treat each placeholder's replacement as a tracked, prioritized launch task (see R1.3) so the true fix is removing the placeholder entirely, not just making it look nicer while it remains.
- **Component/page affected:** `src/components/ui/ImagePlaceholder.tsx`; every page listed in the audit's Photography section.
- **Expected UX/positioning benefit:** Removes the single most visually damaging "unfinished site" signal.
- **SEO impact:** Minor positive — current caption text is somewhat off-brand alt-text-adjacent content; cleaner captions (or real images with proper `alt` text) improve image-search relevance once real photography exists.
- **Compliance risk:** None for the wording fix. Real photography must still respect the existing "no genital close-ups" constraint already established in the codebase's own comments — this constraint should be preserved, not relaxed, when real images are sourced.
- **Implementation complexity:** Low (caption wording) to High (sourcing and approving real photography — see R1.4).

### R1.3 — Photography priority order

- **Problem:** Zero real photography exists anywhere on the site. Not all placeholder instances are equally damaging — some (About's portrait) sit on the highest-trust page; others (Male Aesthetics' texture image) are lower-stakes.
- **Proposed solution:** A prioritized photography shot list, to be commissioned and approved before general visual polish work:
  1. **About page hero portrait** — highest priority. Standing or seated editorial portrait, professional attire, neutral/clinical-adjacent but not sterile background (consulting room or hospital corridor context, not a plain studio backdrop). This is the single highest-trust-impact image on the site.
  2. **Homepage hero portrait** — same portrait style as About, or a closely related second frame from the same shoot, so the two pages feel like one continuous brand rather than two separate photo sessions.
  3. **Consultation-context image** (About page's second placeholder, or a new homepage AboutSection slot) — Dr. Molina in a consultation-room setting, conveying the "specialist assessment" narrative the copy already emphasizes throughout the site.
  4. **Penile Implant device-placement diagram** — not photography; a clean, simple, clinical line-art or 3D-render diagram (explicitly non-photographic per the existing placeholder's own note), since this is illustrating anatomy/device mechanics, not the physician.
  5. **Male Aesthetics hub texture/material image** — lowest priority; genuinely optional given the explicit "no genital close-ups" constraint makes this the hardest slot to fill meaningfully. Consider whether removing this specific placeholder (see R2.2) is a better outcome than commissioning an image for it.
- **Component/page affected:** `doctor.profileImage`, `ImagePlaceholder` instances across Homepage, About, Male Aesthetics hub, Penile Implant.
- **Expected UX/positioning benefit:** Directly resolves the audit's single largest positioning gap — moves the site from "premium but faceless" toward "premium and personally credible."
- **SEO impact:** Positive — real, properly-alt-tagged images support image search, and Person schema's existing `image` field (`doctor.profileImage.src`) will finally point to a real asset rather than a non-existent placeholder path.
- **Compliance risk:** Low, provided photography follows the site's own already-established constraints (no genital imagery, no implied patient identities, real consent for the physician's own likeness — trivially satisfied since it's the site owner). No new compliance exposure beyond what already exists.
- **Implementation complexity:** Medium (professional photography commissioning is a real-world logistics task, not a code task) once shot, Low to implement in code (replacing `ImagePlaceholder` calls with `next/image` — note: the codebase currently has **zero** `next/image` usage anywhere; introducing it here is the right moment to start, for proper responsive/optimized image delivery).

### R1.4 — Persistent header credential

- **Problem:** "Consultant Urologist & Andrologist" appears only in page-specific hero content, never in the persistent header/nav — a visitor scrolling past the hero, or landing deep on an inner page via search, loses that credential signal in the chrome that follows them throughout the visit.
- **Proposed solution:** Add a small, subtle subtitle beneath or beside "Dr. Alejandro Molina" in the header — small caps or a lighter weight, e.g. "Dr. Alejandro Molina" / "Consultant Urologist & Andrologist" stacked tightly, sized to not compete with the primary nav. Must be tested at the header's narrowest responsive breakpoint to confirm it doesn't crowd the mobile hamburger trigger.
- **Component/page affected:** `src/components/layout/Header.tsx`.
- **Expected UX/positioning benefit:** Reinforces physician-level authority on every single page view, not just hero-visible ones — directly addresses the brief's §12 question and the audit's "risks reading as (D) a general urologist" positioning finding.
- **SEO impact:** Neutral to mildly positive — additional visible text reinforcing the "Consultant Urologist & Andrologist" entity phrase sitewide, in the header specifically (crawled on every page).
- **Compliance risk:** None.
- **Implementation complexity:** Low.

### R1.5 — Authority module consistency

- **Problem:** The Girth Enhancement page's 4-metric authority block is the best-executed authority placement on the site, but it's page-specific, hand-built for that one page rather than a reusable pattern. Other treatment pages have no equivalent, even where a general (non-procedure-specific) authority stat would help — e.g., ED and Penile Implant pages could use 15+ years / tertiary hospital background.
- **Proposed solution:** Extract the Girth Enhancement authority block into a reusable `AuthorityBlock` component accepting a metrics array (mirroring the existing config-driven, fail-safe pattern already used by `AuthorityStripSection`), so any treatment page can opt into an authority block with page-appropriate metrics rather than each page inventing its own or going without.
- **Component/page affected:** New shared component, extracted from `penile-girth-enhancement/page.tsx`'s existing `authorityMetrics` logic; consumed by ED, Penile Implant, and potentially Peyronie's/Fertility pages.
- **Expected UX/positioning benefit:** Spreads the audit's single best-scoring authority pattern across more of the site, rather than leaving it as a one-page exception.
- **SEO impact:** Neutral.
- **Compliance risk:** None — same fail-safe rendering discipline as the existing pattern (never fabricate a stat, render nothing if a field is unset).
- **Implementation complexity:** Low (the underlying logic already exists and works; this is an extraction/reuse task, not new design).

### R1.6 — Read-more / FAQ pattern extended to article template

- **Problem:** The `Faq` component (with its Phase C read-more extension) exists and works well, but the Insights article template doesn't use it — several articles are naturally Q&A-shaped and would benefit from FAQPage-style structuring at the article level, not just the treatment-page level.
- **Proposed solution:** Add an optional `faqItems?: FaqItem[]` field to the `InsightArticle` type, rendered via the existing `Faq` component when present — purely additive, consistent with how `video` and `relatedArticleSlugs` were added in Phase C.
- **Component/page affected:** `src/content/insights/articles.ts` (type only, no content yet), `src/app/(marketing)/insights/[slug]/page.tsx`.
- **Expected UX/positioning benefit:** Improves scan-ability and AEO structure for articles that are already implicitly FAQ-shaped.
- **SEO impact:** Positive — genuine `FAQPage` schema opportunities at the article level, matching Google's stated preference for visible FAQ content backed by matching structured data.
- **Compliance risk:** None.
- **Implementation complexity:** Low (type/template change only; populating actual FAQ content per article is separate content work, not part of this system change).

### R1.7 — Category filtering on Insights index

- **Problem:** Category chips on `/insights` are decorative, not functional.
- **Proposed solution:** Make chips client-side filters (no new route needed — filter the existing `insightArticles` array in a client component).
- **Component/page affected:** `src/app/(marketing)/insights/page.tsx`.
- **Expected UX/positioning benefit:** Better content discovery, especially as the Insights library grows past its current 16 articles.
- **SEO impact:** Neutral (client-side filtering of an already-fully-listed, already-crawlable page doesn't change indexation).
- **Compliance risk:** None.
- **Implementation complexity:** Low.

### R1.8 — Copy-system pass: de-templating hedge phrases

- **Problem:** Sitewide repetition of "assessed individually," "not assumed," "no specific outcome can be guaranteed," etc., documented across at least 8 pages' FAQs.
- **Proposed solution:** Not a single global find-and-replace (that would just create a different repeated phrase) — a manual, page-by-page copy pass that preserves the exact same restrained *meaning* on every instance while varying the *wording*, using the specific examples given per-page in the audit document as a starting model. This is content work, not a component change.
- **Component/page affected:** All treatment-page FAQ arrays; `src/content/insights/articles.ts` where similar patterns recur.
- **Expected UX/positioning benefit:** Reduces the "templated" feeling flagged repeatedly in the audit without sacrificing medical restraint.
- **SEO impact:** Mildly positive — reduces near-duplicate phrasing across pages, which can marginally help distinct-content signals for each page.
- **Compliance risk:** Low — care must be taken that rewording doesn't accidentally introduce a firmer claim than the original restrained phrasing intended (e.g., "not guaranteed" must not become "usually works" in the process of varying the sentence). Any rewrite should go through the same clinical-review process as new content.
- **Implementation complexity:** Medium (touches many small pieces of copy across the whole site; low technical complexity, moderate editorial effort).

### R1.9 — Fix confirmed content bugs found during this audit

- **Problem:** Two concrete defects confirmed during this audit: (a) `AboutSection.tsx`'s credential-highlight filter doesn't exactly match "FEBU — Fellow of the European Board of Urology," silently dropping that highlight on the homepage About teaser; (b) the About page's title metadata duplicates the physician's name ("About Dr. Alejandro Molina | Dr. Alejandro Molina").
- **Proposed solution:** (a) Fix the filter's match string to the exact credential string, or better, use a dedicated field rather than string-matching against the general credentials list. (b) Change the About page's `title` to "About" so the sitewide template produces "About | Dr. Alejandro Molina."
- **Component/page affected:** `src/components/sections/AboutSection.tsx`; `src/app/(marketing)/about/page.tsx`.
- **Expected UX/positioning benefit:** Restores a dropped trust signal (FEBU) to the homepage; cleaner, less redundant browser-tab/search-result title.
- **SEO impact:** Mildly positive (cleaner title tag).
- **Compliance risk:** None.
- **Implementation complexity:** Low.

---

## PHASE R2 — HIGH-VALUE COMMERCIAL PAGES

Ordered per the brief's stated priority.

### R2.1 — Homepage

- **Problem:** Generic H1; flagship procedure visually underweighted relative to Penile Implant; excessive length/section count.
- **Proposed solution:** Rewrite H1 to carry either the physician name or the flagship claim (see audit's example copy). Give the Featured Procedure section a visual treatment matching or exceeding the current Penile Implant dark-band treatment — do not simply move the dark treatment onto Featured Procedure verbatim (that would just relocate the mismatch), design a distinct, appropriately weighted treatment for it. Evaluate consolidating 2-3 of the thinner section-pairs (e.g., Conditions index folded into the Insights section, or the "Also assessed" links folded into Core Expertise) to reduce total section count without losing coverage.
- **Component/page affected:** `src/app/(marketing)/page.tsx` and its section components (`HeroSection`, `FeaturedProcedureSection`, `PenileImplantSection`, `ConditionsSection`, `InsightsSection`).
- **Expected UX/positioning benefit:** Directly resolves the audit's top-scored positioning and visual-hierarchy problems on the highest-traffic page.
- **SEO impact:** H1 changes should be tested carefully — the current H1 already ranks for nothing yet (site undeployed), so this is a clean opportunity to set the strongest possible entity/topic H1 before any ranking history accumulates.
- **Compliance risk:** None — this is presentation and emphasis, not new medical claims.
- **Implementation complexity:** Medium (touches multiple homepage sections' visual treatment, requires design decisions beyond pure content edits).

### R2.2 — Male Genital Aesthetics hub

- **Problem:** Placeholder caption visible; all three services rendered with equal visual weight despite explicit flagship copy.
- **Proposed solution:** Give the Penile Girth Enhancement row distinct visual treatment (larger heading scale, a leading stat pulled from `doctor.girthProcedureCount`/`girthEnhancementSince`, or simply first position with more surrounding whitespace) so the flagship claim is visible in layout, not just legible in paragraph text. Revisit whether the texture-image placeholder is worth keeping given the "no genital close-ups" constraint makes it the hardest slot to fill meaningfully (see R1.3) — removing it and reallocating that space to the flagship treatment may be the better near-term outcome.
- **Component/page affected:** `src/app/(marketing)/male-aesthetics/page.tsx`.
- **Expected UX/positioning benefit:** Makes the hub's own layout agree with its own copy about what the flagship service is.
- **SEO impact:** Neutral to positive (stronger visual/structural signal around the flagship procedure's keyword cluster on the hub page that links to it).
- **Compliance risk:** None.
- **Implementation complexity:** Low to Medium.

### R2.3 — Penile Girth Enhancement (flagship)

- **Problem:** Template-identical to every secondary treatment page; generic strapline reused verbatim on Scrotal Lift.
- **Proposed solution:** Design one distinguishing structural element unique to this page — options include an additional module below the existing authority block (e.g., a "Correction experience" callout linking to the Filler Correction page, reinforcing that this practice sees and fixes other providers' work, which no competitor page can credibly claim), or a visually distinct hero treatment reserved only for the flagship. Replace the generic strapline with page-specific wording pulling from real facts (see audit's example: "500+ procedures · Consultant-led · Correction experience on hand").
- **Component/page affected:** `src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx`.
- **Expected UX/positioning benefit:** Makes the single highest-commercial-priority page feel like the practice's flagship in presentation, not just in copy.
- **SEO impact:** Positive — a page with genuinely differentiated structure (not just differentiated words) tends to earn more organic engagement signals.
- **Compliance risk:** None, provided any new "correction experience" framing stays as restrained as the existing Filler Correction page's own honest, non-disparaging tone.
- **Implementation complexity:** Medium.

### R2.4 — Penile Filler Correction

- **Problem:** "Common presentations" grid is visually flat for a page whose core value is precise differential diagnosis.
- **Proposed solution:** Differentiate the six presentations visually — sequential numbering (matching the site's existing numbered-list pattern used elsewhere), or a severity/urgency indicator distinguishing "generally reasonable to monitor" (persistent swelling, uneven distribution) from "worth prompt assessment" (migration, new nodules) — using language already present elsewhere on the same page (e.g., "Some findings are minor and simply monitored; others benefit from a specific plan") but not yet reflected in the grid's visual treatment.
- **Component/page affected:** `src/app/(marketing)/male-aesthetics/penile-filler-correction/page.tsx`.
- **Expected UX/positioning benefit:** Reinforces diagnostic authority visually, not just verbally, on the page most responsible for reputation-protection and revision-case conversion.
- **SEO impact:** Neutral.
- **Compliance risk:** Low — any severity/urgency labeling must avoid implying a diagnosis before actual assessment; frame as "worth mentioning at consultation" rather than a self-diagnosis tool.
- **Implementation complexity:** Low to Medium.

### R2.5 — Men's Health (hub) + repositioning

- **Problem:** Near-empty hub; doesn't surface its own best content (Testosterone); one live link points to an unbuilt route.
- **Proposed solution:** Per the brief's §9 request for a positioning recommendation without changing the route: reposition `/mens-health` around male hormonal health specifically, since that's where the actual substance lives, rather than keeping it as a maximally broad "men's health" umbrella that currently has nothing broad to offer. Concretely: surface Testosterone & Male Hormonal Health as a full content row (mirroring the Male Aesthetics hub's service-row pattern) rather than a single line-item; either build the Low Libido page before linking to it live, or remove the link until it exists; add an FAQ and closing CTA matching every other hub-adjacent page's pattern.
- **Component/page affected:** `src/app/(marketing)/mens-health/page.tsx`.
- **Expected UX/positioning benefit:** Resolves the single lowest-scoring page in the audit; makes the "Men's Health" nav item lead somewhere that matches its prominence.
- **SEO impact:** Positive — a hub with real content and internal links to its child page is a stronger topical signal than a near-empty stub.
- **Compliance risk:** None — this is a content-depth and information-architecture fix, not a new clinical claim.
- **Implementation complexity:** Medium (real content needs writing, following the same restrained/specific standard as Testosterone's existing copy; the Low Libido question needs a decision — build the page or remove the link).

### R2.6 — Testosterone

- **Problem:** None specific to this page — it's one of the strongest pages audited.
- **Proposed solution:** No changes recommended beyond what flows from R2.5 (better discoverability once the parent hub surfaces it properly).
- **Component/page affected:** None.
- **Expected UX/positioning benefit:** N/A.
- **SEO impact:** N/A.
- **Compliance risk:** N/A.
- **Implementation complexity:** N/A.

### R2.7 — Erectile Dysfunction

- **Problem:** No physician-specific authority stat; treatment-ladder visual pattern isn't reused elsewhere.
- **Proposed solution:** Apply R1.5's new `AuthorityBlock` component here with general surgical/urological metrics (15+ years, tertiary hospital background). Evaluate extending the ladder's dark-band numbered-step treatment to Peyronie's Disease's conservative/procedural/surgical pathway for visual consistency (see R3.2).
- **Component/page affected:** `src/app/(marketing)/erectile-dysfunction/page.tsx`.
- **Expected UX/positioning benefit:** Brings the site's best-structured page up to the same authority standard as the Girth Enhancement page.
- **SEO impact:** Neutral.
- **Compliance risk:** None.
- **Implementation complexity:** Low (once R1.5 exists).

### R2.8 — Penile Implant

- **Problem:** Two live placeholder captions on one page; disproportionate homepage visual weight relative to stated commercial priority.
- **Proposed solution:** Prioritize the device-placement diagram (R1.3, item 4) specifically for this page. Address the homepage weighting as part of R2.1 rather than here (the fix is on the homepage, not this page itself).
- **Component/page affected:** `src/app/(marketing)/penile-implant/page.tsx`.
- **Expected UX/positioning benefit:** Removes the compounded placeholder problem (two instances on one page) and resolves the visual-priority mismatch at its source.
- **SEO impact:** Neutral.
- **Compliance risk:** None (diagram must remain the clean, non-explicit style already specified in the existing placeholder captions).
- **Implementation complexity:** Low (page itself) once the diagram asset exists.

### R2.9 — About

- **Problem:** Two placeholder portraits on the highest-trust page; duplicate-sentence copy defect; redundant title tag.
- **Proposed solution:** Prioritize About-page photography first in the R1.3 shot list (already reflected there). Fix the "Alongside...Alongside" sentence (exact rewrite given in the audit). Fix the title metadata per R1.9.
- **Component/page affected:** `src/app/(marketing)/about/page.tsx`.
- **Expected UX/positioning benefit:** Resolves the single highest-impact photography gap and a confirmed copy-editing miss on the practice's most trust-critical page.
- **SEO impact:** Positive (cleaner title, real portrait image feeding Person schema's `image` field with an asset that actually exists).
- **Compliance risk:** None.
- **Implementation complexity:** Low (copy/metadata fixes) to Medium (dependent on photography timeline).

---

## PHASE R3 — SUPPORTING PAGES

### R3.1 — Scrotal Lift

- **Problem:** Template-identical to the flagship page; no procedure-specific authority stat.
- **Proposed solution:** Once R2.3 gives Girth Enhancement a distinguishing treatment, Scrotal Lift's *unchanged* current template will automatically read as appropriately secondary by comparison — no separate redesign needed here, only confirmation that it stays as-is while Girth Enhancement changes around it. If a genuine volume/experience figure for this procedure is ever verified, add it via R1.5's authority block; do not invent one in the meantime.
- **Component/page affected:** None required directly; contingent on R2.3.
- **Expected UX/positioning benefit:** Correct relative positioning restored via contrast, without extra work on this page.
- **SEO impact:** Neutral.
- **Compliance risk:** None.
- **Implementation complexity:** Low (verification/monitoring only).

### R3.2 — Peyronie's Disease

- **Problem:** Hedge-phrase repetition; 3-step pathway could match the ED ladder's stronger visual treatment.
- **Proposed solution:** Apply R1.8's copy pass to this page's FAQ. Extend the ED treatment-ladder visual pattern (dark band, numbered, larger typographic treatment) to this page's Conservative/Procedural/Surgical pathway.
- **Component/page affected:** `src/app/(marketing)/peyronies-disease/page.tsx`.
- **Expected UX/positioning benefit:** Visual-system consistency; reduces repetition.
- **SEO impact:** Neutral.
- **Compliance risk:** None.
- **Implementation complexity:** Low.

### R3.3 — Male Fertility

- **Problem:** FAQ #3 conflates three ideas into one hard-to-parse answer.
- **Proposed solution:** Split into two FAQ items per the audit's exact rewrite.
- **Component/page affected:** `src/app/(marketing)/male-fertility/page.tsx`.
- **Expected UX/positioning benefit:** Clearer, easier-to-scan answer to a sensitive question.
- **SEO impact:** Positive (two distinct, clearly-answered FAQ entries are individually better FAQPage schema candidates than one conflated answer).
- **Compliance risk:** Low — ensure the split doesn't lose the existing careful "not offered directly here... coordinated with assisted reproduction teams" language; both new questions must retain it in the correct place.
- **Implementation complexity:** Low.

### R3.4 — Remaining thin hubs (Sexual Medicine, Penile Surgery)

- **Problem:** Same structural pattern as Men's Health — thin stub hubs with no FAQ/RelatedTreatments/closing CTA, existing only as link-lists to real child pages.
- **Proposed solution:** Apply the same treatment recommended for Men's Health (R2.5) — surface child-page content more substantively, add FAQ and closing CTA sections matching the site's established hub pattern (as already done well on the Male Aesthetics and Male Fertility hubs, which should serve as the template).
- **Component/page affected:** `src/app/(marketing)/sexual-medicine/page.tsx`, `src/app/(marketing)/penile-surgery/page.tsx`.
- **Expected UX/positioning benefit:** Removes the "metadata stronger than visible content" pattern from 2 more of the site's 6 primary nav destinations.
- **SEO impact:** Positive — more substantive hub content strengthens the topical cluster these pages sit at the top of.
- **Compliance risk:** None.
- **Implementation complexity:** Medium (real content needs writing for both).

### R3.5 — Insights index

- **Problem:** Non-functional category chips; no visual cluster distinction; no body CTA.
- **Proposed solution:** R1.7 (functional filtering) covers the first issue. Add a visually distinct "featured cluster" treatment for the Penile Girth Enhancement article group. Add a closing CTA section matching the pattern used on every treatment page.
- **Component/page affected:** `src/app/(marketing)/insights/page.tsx`.
- **Expected UX/positioning benefit:** Better content discovery and a conversion opportunity on a currently CTA-free page.
- **SEO impact:** Neutral to positive.
- **Compliance risk:** None.
- **Implementation complexity:** Low to Medium.

### R3.6 — Article template

- **Problem:** No FAQ support in the template (see R1.6); uniform "review pending" badge across all 16 articles.
- **Proposed solution:** R1.6 covers the FAQ addition. The review-badge issue is not a template problem — it's a launch-readiness/process item (get genuine clinical review done on at least the flagship cluster) rather than something to fix in code; flagged here for visibility but owned outside this redesign plan.
- **Component/page affected:** `src/app/(marketing)/insights/[slug]/page.tsx`.
- **Expected UX/positioning benefit:** Better AEO structure for Q&A-shaped articles.
- **SEO impact:** Positive (see R1.6).
- **Compliance risk:** None for the template change; the review-badge issue itself is a compliance/process matter, not a UX one — do not mark anything as reviewed without an actual review having occurred.
- **Implementation complexity:** Low (template) / Not applicable (review process, outside engineering scope).

### R3.7 — Book page

- **Problem:** None identified — this page performs its function well and is appropriately minimal.
- **Proposed solution:** No changes recommended.
- **Component/page affected:** None.
- **Expected UX/positioning benefit:** N/A.
- **SEO impact:** N/A.
- **Compliance risk:** N/A.
- **Implementation complexity:** N/A.

---

## Sequencing note

R1 items should land before R2/R3 wherever a dependency exists (R1.5's `AuthorityBlock` before R2.7; R1.7's filtering before R3.5; R1.3's photography before R2.9/R2.2/R2.8's placeholder replacements can fully close out — though the layout/copy portions of those page-level items can proceed independently of photography timing). R1.1 (cookie banner) and R1.9 (confirmed bugs) have no dependencies and are the lowest-complexity, highest-clarity fixes in this entire plan — they are the natural starting point for any execution phase that follows.

## R4.2 status — 2026-09-07

The global visual correction is implemented on the five requested pages. [Report and validation](R4_2_IMPLEMENTATION_REPORT.md); [before/after gallery](qa/r4-2/index.html). Awaiting owner visual review and approved photography. No deployment or merge.

## R4.3 status — 2026-09-07

Focused transparent-logo, header/footer, physician identity, recognition/education and flagship hierarchy refinements completed. [Report](R4_3_IMPLEMENTATION_REPORT.md); [visual comparison](qa/r4-3/index.html). Await owner visual review and approved photography. No merge or deployment.
