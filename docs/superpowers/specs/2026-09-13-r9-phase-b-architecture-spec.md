# R9 Phase B — Full Site Localization: Architecture & Conventions

Status: approved for implementation
Scope: this spec establishes the shared architecture and conventions that ALL FOUR batches of R9 Phase B follow (18 pages total: 5 core hubs, 7 priority clinical pages, 3 male-aesthetics pages, 3 booking/vasectomy/privacy pages). Each batch gets its own implementation plan; this document is their shared reference so conventions don't drift between batches. It supersedes nothing from R9 Phase A or Phase B0 — it extends the same patterns to the rest of the site.

## 1. Non-goals carried over unchanged

- No merge to `main`, no Production deploy, without owner review (per the owner's brief).
- No Arabic Insights articles yet (`/ar/insights/[slug]` routes are explicitly out of scope — English-only for now, clearly labeled where referenced).
- No invented `/ar/*` destination URLs — a link only becomes Arabic once its target page has actually shipped in some batch. This is now dynamic across batches: a link that's "temporary English" in Batch 1 may become a real Arabic link once its target ships in Batch 2/3/4 — each batch's own plan documents which of *its* outbound links resolve to already-live Arabic destinations vs. still-temporary English ones, based on what's shipped by the time that batch runs.
- All work stays on `feat/arabic-localization-r9-phase-b`, in the existing worktree at `.worktrees/feat-arabic-localization-r9-phase-b`. No push/Preview-deploy checkpoint after each batch — only local commits, verified and reviewed; one full push + Preview confirmation happens after Batch 4.

## 2. Route/page pattern (non-homepage)

Unlike the homepage (which required ten bespoke section components under `src/components/sections/ar/`), every English page audited for Batch 1 is a single monolithic `page.tsx` that inlines its JSX directly and composes *shared* UI/section components — it does not break itself into named section components the way the homepage did. Arabic mirrors follow the same convention: **one `page.tsx` per route, directly under the mirrored path in `src/app/(ar)/ar/(marketing)/<path>/page.tsx`**, with Arabic content and hrefs inlined the same way English inlines English content — no intermediate `*PageAr.tsx` component files.

Every new Arabic `page.tsx`:
- Calls `buildMetadata({ title, description, path: "/ar/<path>" })` with Arabic title/description. `buildMetadata` (already generic, `src/lib/seo/metadata.ts`) auto-derives self-canonical AND reciprocal `en-AE`/`ar-AE`/`x-default` hreflang from `getLocalizedPathPair`, driven entirely by `routes.ts`'s `arPath` field — **no manual hreflang code needed on either the English or Arabic page**, confirmed by reading the function directly.
- Renders its own `breadcrumbItems` (Arabic labels, Arabic hrefs where the target is live, English hrefs otherwise per §1) and passes them to `JsonLd(breadcrumbSchema(...))` and `<Breadcrumb items={...} />` — both already fully prop-driven and safe to reuse, once Breadcrumb's chevron RTL bug (§4) is fixed.
- Never renders `<BookingCta>` without explicit Arabic `children` — `BookingCta`'s own default (`"Book a Consultation"`, `src/components/ui/BookingCta.tsx:20`) is English and has no locale awareness; English pages that omit `children` rely on that default, so every Arabic page must pass Arabic text explicitly at every call site, with no exception.

## 3. Sitemap and language switcher — fully automatic, confirmed

Read directly (not assumed): `src/app/sitemap.ts` emits both the English and Arabic URL for any route with `arPath` set, with reciprocal `alternates.languages` on each entry. `LanguageSwitcher` (`src/components/navigation/LanguageSwitcher.tsx`) calls the same `getLocalizedPathPair` and renders nothing when no pair exists — never a placeholder, never a guess. **The entire "Language Switcher" and "SEO/sitemap" sections of the owner's brief are satisfied by one change per route: setting `arPath` in `src/lib/seo/routes.ts` once that route's Arabic page is actually live** — no other code changes. Never set `arPath` ahead of the page actually existing (matches the registry's own existing convention/comment).

## 4. Shared-component locale audit (Batch 1 findings; re-audit per later batch as new components appear)

Confirmed by reading every file directly. Components with **zero hardcoded English text** — reusable as-is by any Arabic page, no changes: `Breadcrumb` (after the chevron fix below), `TonalSection`, `EditorialFrame`, `PullQuote`, `EditorialTexture`, and the `title`-prop-only illustration components (`MedicalEducationDiagram`, `ConsultationPathwayDiagram`, `ContourPlanningDiagram`, and by the same pattern any other file under `src/components/illustrations/`).

Components needing a `locale?: "ar"` prop (same pattern as `Faq`/`Header`/`PhysicianAuthority`/`ClinicalDecisionFlow` from Phase A/B0), each covered by a Batch 1 task: `RelatedTreatments`, `AuthorityBlock`, `FlagshipAuthorityFeature`, `ExpertiseTimeline`, `RecognitionSection`, `MediaAppearancesSection`, `PatientFeedbackSection`, `PatientReviewsCta`. `PhysicianAuthority` and `ClinicalDecisionFlow` already have `locale` support from B0 and need no further change to be reused on these pages.

Two RTL-correctness bugs found during this audit (neither caught by the B0 spec's narrower homepage-only scope):
- **`Breadcrumb`'s `ChevronRight` icon never flips under `dir="rtl"`** (`src/components/ui/Breadcrumb.tsx:23`) — under RTL the trail reads right-to-left but the chevron still points right, backwards relative to reading direction. Fix: `rtl:rotate-180` on the icon (or an explicit `dir`-scoped class), verified not to affect English (`ltr`) rendering.
- **`AuthorityBlock`'s `align="left"` branch uses the physical `lg:text-left`** (`src/components/ui/AuthorityBlock.tsx:45`), which stays LTR-forced under `dir="rtl"`. Fix: `lg:text-start` (logical property, resolves to `left` under `ltr` — zero English change — and `right` under `rtl`).

## 5. Structured-data locale tagging

`faqPageSchema` (`src/lib/seo/json-ld.ts`) already accepts `options?: { inLanguage?: string }`. `breadcrumbSchema` and `medicalWebPageSchema` in the same file do not — both need the identical option added, mirroring `faqPageSchema` exactly, so Arabic pages' structured data is correctly tagged `inLanguage: "ar"`. English call sites must omit the option and render unchanged (optional parameter, no behavior change when absent).

## 6. Centralizing recurring Arabic reputation strings

B0's final review flagged that `PhysicianAuthority.tsx` and `AuthorityMediaSectionAr.tsx` each held their own copy of the same Arabic review-headline/editorial-wording strings, with only a sync comment (not a shared source) linking them. Batch 1 needs the *same* strings again in `PatientFeedbackSection` and `PatientReviewsCta`, plus a new one (`trainingPrograms[0].positioningLine`'s Arabic mirror) in `RecognitionSection`. A third and fourth duplicate of the same facts is the point past which a comment-based sync stops being enough. Batch 1 introduces one shared module, `src/lib/i18n/ar-reputation.ts`, holding every Arabic mirror of an owner-approved `config/reputation.ts` string, and migrates the two existing B0 call sites onto it alongside the two new ones — a real DRY fix, not a new duplicate.

## 7. Arabic medical glossary

`docs/arabic-medical-glossary.md` is created in Batch 1 and updated in every subsequent batch. One row per clinical/technical term that recurs across pages (e.g. "ضعف الانتصاب" for erectile dysfunction, "زيادة سماكة القضيب" for penile girth enhancement), so the same English term always gets the same Arabic rendering everywhere it appears, and a native-speaker reviewer has one place to check terminology consistency. Format: `| English term | Arabic term | First used in | Notes |`.

## 8. Visual QA method

Per B0's experience, the Playwright MCP browser may be locked by another concurrent session — if so, the same structural/source-based substitute method from B0's Task 18 applies (curl-fetched SSR HTML, HTTP status checks on image URLs, source diffing), explicitly disclosed as such, never presented as pixel-level confirmation. A real manual visual pass remains recommended before Production regardless of which method was available during implementation.

## 9. Batch sequencing

Each batch is its own implementation plan (`docs/superpowers/plans/2026-09-13-r9-phase-b-batch<N>-*.md`), executed via `superpowers:subagent-driven-development` in this same worktree, with its own SDD ledger. A batch's plan documents, per outbound link from its pages, whether the destination is already live in Arabic (from an earlier batch) and should get an Arabic href, or is not yet built and must stay a documented temporary English href per §1. After each batch: full verification (typecheck/lint/test/build), a task-level and final-review pass identical in rigor to B0's, and a QA pass — then proceed to the next batch without a separate Preview deploy. One consolidated Preview deploy and final route-by-route parity matrix happen after Batch 4.

## 10. Batch 1 QA status (Task 20)

Batch 1's responsive QA (Task 20) found the Playwright MCP browser locked by
another live session again (same failure mode as B0's Task 18), so it fell
back to the same structural/source-based method: full section-by-section
`page.tsx` diffing, image-URL HTTP checks, hreflang/canonical/`inLanguage`
verification, a `git`-confirmed zero-content-change guarantee for the 5
English hub pages (pure renames in `b11234e`), and direct source
confirmation that the §4 Breadcrumb-chevron and AuthorityBlock-alignment
fixes plus the locale-agnostic `section-dark`/`section-olive` tokens are
correctly wired on all 5 pairs. No issues found by this method. See
`qa/r9-phase-b-batch1/README.md` for the full breakdown. As with B0, this
does not confirm actual pixel layout at 390/768/1024/1440px — a real
Playwright/manual visual pass on all pages (B0's homepage included) is still
owed before the consolidated pre-Production Preview after Batch 4.
