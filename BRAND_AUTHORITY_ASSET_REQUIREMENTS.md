# Brand & Authority Asset Requirements

Phase R2.1/R3. This document lists exactly which owner-supplied assets and verified facts are still needed to finish wiring the brand/authority architecture built this phase. Nothing below has been invented — every config module this phase added (`mediaAppearances`, `patientReviews`) ships empty, and `doctor.awards` stays `publishReady: false`, until the real values listed here are supplied. See `MEDIA_REQUIREMENTS.md` for photography specifically (not duplicated here).

## 1. Logo files — DONE (2026-09-07)

| | |
|---|---|
| **Status** | Wired in. `public/brand/logo-symbol.png` (AM monogram, 1254×1254, transparent) and `public/brand/logo-full.png` (full lockup: AM monogram + "Dr. Alejandro Molina" + "CONSULTANT UROLOGIST & ANDROLOGIST", 1536×1024) — used exactly as supplied, not redrawn or recolored. |
| **Wired into** | `src/app/icon.png` (64×64, favicon) and `src/app/apple-icon.jpg` (180×180, flattened onto white per Apple's convention — the source has a transparent background, which iOS would otherwise fill with black) — both replace the previous temporary code-generated typographic mark. Footer brand column: the symbol sits in a small light circular chip (the source is navy-on-transparent, invisible against the footer's own navy `.section-dark` background without one) above the existing `doctor.displayName`/title/specialty text, which is unchanged. |
| **Not yet placed** | `logo-full.png` (the full lockup) isn't used anywhere yet — a natural future spot is the About page hero, once real photography also exists there, so the two aren't competing for the same visual moment. The header intentionally stays text-only (adding the symbol risks reintroducing the 768px overflow found and fixed in Phase 11's QA — the header lockup is already tight at that exact breakpoint). |
| **Note on the source folder** | `public/brand/` also contained 5 (as of this check, 7) AI-generated "doctor" photographs and one apparently unrelated marketing asset, mixed in with the 2 real logo files. Per explicit owner instruction, none of those are used or committed — they remain on disk, untracked. Using any of them as if they were real photography of Dr. Molina would violate this project's standing rule against invented photography (`MEDIA_REQUIREMENTS.md`). If any of those 7 files should be removed or were added by mistake, that's an owner decision, not made here. |

## 2. Professional recognition — exact official titles

| Entry | Status | What's needed |
|---|---|---|
| Top Doctors Spain 2020 | Owner-confirmed real, `publishReady: false` | Exact official award title/category as it appears on the primary source, so `doctor.awards[0].officialTitle` can be corrected from its current placeholder value and flipped to `publishReady: true`. |
| Doctoralia Awards Spain 2022 | Owner-confirmed real, `publishReady: false` | Same — exact official title/category for `doctor.awards[1].officialTitle`. |

## 3. Media & editorial appearances

`src/config/mediaAppearances.ts` ships as an empty array. For each real appearance to add, need: `outletName`, `title` (article/segment title), `type` (Editorial Contributor / Interview / Expert Commentary / Featured Physician / Media Appearance), `year`, `url`, and optionally a `logo` asset. Do not supply approximate or remembered titles/dates — only what can be verified against the original.

## 4. Men's Health collaboration — exact wording

The owner has stated Dr. Molina collaborates with/contributes to Men's Health. Before this appears anywhere on the site (as a `mediaAppearances` entry or otherwise), need:
- The exact relationship wording the owner approves — do **not** default to "Official partner," "Medical advisor," or "Ambassador" unless explicitly confirmed. A safe placeholder direction discussed: "Contributor to Men's Health Spain" or "Editorial contributor to Men's Health Spain" — pending explicit sign-off before use.
- Men's Health outlet logo (if it should be shown) and any specific article/link to reference.

## 5. Patient reviews

`src/config/patientReviews.ts` ships as `undefined`. To activate the `PatientReviewsCta` component, need:
- The real, verified profile URL (Google Reviews, Doctoralia, or another platform) — this must be a genuine, owner-supplied link, not searched for or guessed.
- If a rating/review count should also display: the current verified rating and count, plus the date it was checked (`lastVerifiedAt`). If not yet ready to show a number, the component already supports showing only a neutral "Read Verified Patient Reviews" CTA once `profileUrl` exists — rating/count can stay unset.

## 6. AndroMax Training URL

`doctor.medicalTrainer.programUrl` is currently `undefined`. If AndroMax Training has a public URL that should be linked from the About page's Medical Education section, supply it here.

## 7. Trust / authority logo strip (deferred)

Section 12 of the Phase R2.1/R3 brief asks for a restrained logo strip of verified authority entities (Men's Health, Top Doctors, Doctoralia, media outlets). This depends on items 1, 3, and 4 above (real logos + verified relationships) and hasn't been built yet — revisit once those assets exist, so the strip only ever shows entities with confirmed, real relationships.

## Summary table

| # | Asset | Status |
|---|---|---|
| 1 | Full logo file | **Done** — supplied, not yet placed on a page (About page is the natural future spot) |
| 1 | AM symbol file | **Done** — wired into favicon, apple-icon, and footer |
| 2 | Top Doctors Spain 2020 — exact official title | Not yet verified |
| 2 | Doctoralia Awards Spain 2022 — exact official title | Not yet verified |
| 3 | Media appearance entries (outlet/title/year/url) | None supplied yet |
| 4 | Men's Health collaboration — exact approved wording | Not yet confirmed |
| 4 | Men's Health logo/link | Not supplied |
| 5 | Verified review profile URL | Not supplied |
| 5 | Verified rating/review count (optional) | Not supplied |
| 6 | AndroMax Training URL | Not supplied |
| 7 | Trust/authority logo strip | Deferred — depends on 1, 3, 4 |
