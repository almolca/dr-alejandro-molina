# Penile Implant Authority + E-E-A-T Plan

**Status:** Audit (§1-§8) complete and implemented on `feat/penile-implant-authority-eeat`, deployed to Preview only. §9-§14 (NMC/GBP copy, external roadmap, monitoring plan) are recommendations only — no NMC or Google Business changes made or submitted.
**Scope:** Penile implant authority, E-E-A-T, internal topic-cluster strength, local Abu Dhabi relevance. Explicitly excludes another redesign or broad rewrite of `/penile-implant`.

---

## Implemented, this phase

- `lastReviewedDate?: string` replaces `clinicalReviewRequired: boolean` sitewide (EN+AR). No article has a confirmed date, so "Clinical review pending" / "قيد المراجعة الطبية" is gone from all 31 pre-existing articles plus the 4 new ones — nothing review-related renders publicly anywhere right now. See **Articles ready for owner sign-off** below.
- `ArticleAuthorBlock`/`ArticleAuthorBlockAr` render a "Medically reviewed by Dr. Alejandro Molina / Consultant Urologist & Andrologist / Last medically reviewed: [date]" block, conditional on `lastReviewedDate`. `articleSchema()` emits matching `reviewedBy`/`lastReviewed` JSON-LD, mirroring the dormant fields already on `medicalWebPageSchema()`.
- EN H1 → "Penile Implant Surgery in Abu Dhabi"; AR H1 → "جراحة دعامة القضيب في أبوظبي" (owner's explicit, deliberate wording — confirmed as intentional, not a terminology-consistency gap; the fuller `جراحة زراعة دعامة القضيب` remains in body copy, breadcrumbs and JSON-LD `name` unchanged).
- Hero intro refined (EN+AR, 1-2 sentences) to naturally include Abu Dhabi, Consultant Urologist & Andrologist, refractory ED, inflatable-as-primary, "penile prosthesis" synonym, post-prostatectomy ED, and Peyronie's+ED.
- Anchor-text diversified across all 7 EN + 7 AR implant-cluster articles' `relatedLabel` (was identical "Penile Implant Surgery" / "جراحة زراعة دعامة القضيب" everywhere).
- New in-prose contextual links (not just the structural Related-Treatments module) via a small `[label](/path)` syntax now supported by both Insights templates — used in the "when considered" article, the new length article, the prostatectomy article, and both Peyronie's articles (two-way link to/from `/penile-implant` added where none existed).
- `/penile-implant` (EN) gained the one missing cluster `readMoreHref` (→ "When Is a Penile Implant Considered?") plus 2 more into the new length/lifespan articles; AR gained equivalents and had its 2 EN-fallback FAQ links ("مقال بالإنجليزية") replaced with the new genuine AR articles.
- AR parity restored: `penile-implant-recovery-ar` and `orgasm-ejaculation-after-implant-ar` are real MSA adaptations (not machine-translated), each with reciprocal hreflang, Arabic breadcrumbs, `inLanguage: "ar"` Article schema, and sitemap inclusion.
- 2 new EN+AR article pairs: `penile-length-after-penile-implant` / `penile-length-after-implant-ar`, and `penile-implant-lifespan-revision` / `penile-implant-lifespan-revision-ar`. The infection-risk candidate was **not** built (existing FAQ coverage judged adequate; see §8).

**Articles ready for owner medical review/sign-off** (this phase's scope — reporting, not deciding): the 5 pre-existing implant-cluster articles plus the 4 new/restored ones are the most load-bearing E-E-A-T surface right now and are the recommended starting set once the owner is ready to confirm real review dates:
`penile-implant-when-considered` / `when-penile-implant-is-considered`, `inflatable-vs-malleable-penile-implant` / `inflatable-vs-malleable-implant-ar`, `penile-implant-recovery-what-to-expect` / `penile-implant-recovery-ar`, `orgasm-ejaculation-after-penile-implant` / `orgasm-ejaculation-after-implant-ar`, `penile-implant-after-radical-prostatectomy` / `-ar`, `penile-length-after-penile-implant` / `-ar`, `penile-implant-lifespan-revision` / `-ar`. No date has been set for any of them — that is the owner's decision, not mine.

---

## 1. Review-signal audit: "Clinical review pending"

Single source of truth, two template files (not duplicated per article):
- `src/app/(en)/(marketing)/insights/[slug]/page.tsx:105-109` — renders "Clinical review pending" whenever `article.clinicalReviewRequired === true`.
- `src/app/(ar)/ar/(marketing)/insights/[slug]/page.tsx:~114` — Arabic equivalent, "قيد المراجعة الطبية".

**Finding:** Every single article — all 24 EN entries in `src/content/insights/articles.ts` and all 7 AR entries in `src/content/insights/articles-ar.ts` — has `clinicalReviewRequired: true`, with zero exceptions anywhere in the dataset. This badge is currently showing on **every Insights article site-wide**, not just the implant cluster. That includes the 5 implant-cluster articles:

| Slug | clinicalReviewRequired |
|---|---|
| penile-implant-when-considered | true |
| inflatable-vs-malleable-penile-implant | true |
| penile-implant-recovery-what-to-expect | true |
| orgasm-ejaculation-after-penile-implant | true |
| penile-implant-after-radical-prostatectomy | true |

**Implication:** fixing this only for the implant cluster would leave the badge live on ~26 other articles, which looks inconsistent (some reviewed, most not) and invites the question "why weren't the others reviewed?" Recommend treating this as a site-wide toggle, not an implant-specific patch — see §2 for the proposed mechanism.

## 2. Review/author architecture audit

**Author (already implemented, site-wide, visible):**
- `ArticleAuthorBlock.tsx` / `ArticleAuthorBlockAr.tsx` render Dr. Molina's name, title, and a config-driven credential line on every article page (`insights/[slug]/page.tsx:118-120`). Data comes from `src/config/doctor.ts` — not hardcoded per article.
- `articleSchema()` in `src/lib/seo/json-ld.ts:199` emits `author: { "@type": "Person", name: doctor.displayName }` on every `Article` JSON-LD — centralized, not duplicated.

**Reviewer (not yet implemented, but already anticipated in the schema layer):**
- `medicalWebPageSchema()` in `json-ld.ts:147-148` already has `lastReviewed: undefined` and `reviewedBy: undefined` as explicit (pruned-when-empty) placeholder fields — this was scaffolded for exactly this purpose and never wired up. `articleSchema()` has no `reviewedBy`/`dateModified`-driven review field at all yet.
- There is no visible "Medically reviewed by" UI anywhere today — only the binary pending/not-shown badge.

**dateModified / datePublished:**
- `datePublished` is real and set per article (`PUBLISHED`, `PUBLISHED_R7`, `PUBLISHED_R11` constants in `articles.ts`). `articleSchema()` already supports an optional `dateModified`, defaulting to `datePublished` if not given — correct fallback, no fake precision.

**Proposed architecture (not implemented yet):**
Since Dr. Molina is both the sole clinical author and the sole qualified reviewer on this site, "reviewed by" and "author" will be the same person — this is normal and expected for a single-physician practice site, not a fabricated E-E-A-T signal.

1. Add to `src/config/doctor.ts` (single source, already the pattern for `yearsOfExperience`, `girthProcedureCount`, etc.):
   ```ts
   reviewer: {
     name: doctor.displayName,       // reuse, don't duplicate the string
     title: doctor.title,
     // Per-article review dates live in articles.ts/articles-ar.ts (below),
     // not here — this just holds the shared name/title/credential fragment.
   }
   ```
2. Replace the boolean `clinicalReviewRequired: true` field with a nullable field, e.g. `lastReviewedDate?: string`. When present → show "Medically reviewed by Dr. Alejandro Molina · Consultant Urologist & Andrologist · Last medically reviewed: [date]" and emit `reviewedBy`/`lastReviewed` in `medicalWebPageSchema()`/`articleSchema()`. When absent → show nothing publicly (no "pending" badge, per the brief's explicit instruction not to show fake precision or a visible "not yet reviewed" flag).
3. This is a one-field schema change plus a template-rendering change in exactly two files (`insights/[slug]/page.tsx` EN+AR) — low risk, no visual redesign, no copy rewrite. Dates get filled in per-article only once the owner confirms the actual review date for that specific article; until then the field stays `undefined` and nothing publishes.

**Do not** hardcode "Medically reviewed by Dr. Alejandro Molina" as a repeated literal string in each of the 31 article objects — centralize the name/title string once (already done via `doctor.ts` + `ArticleAuthorBlock`) and reuse it in whatever renders the reviewer line, exactly as the author block already does.

## 3. Penile implant H1 / local intent audit

| | EN | AR |
|---|---|---|
| `<title>` metadata | "Penile Implant Surgery **in Abu Dhabi**" (already fixed, prior phase) | "جراحة زراعة دعامة القضيب **في أبوظبي**" (already fixed) |
| Live H1 | "Penile Implant Surgery" (`page.tsx:231-233`) — **no "in Abu Dhabi"** | "جراحة زراعة دعامة القضيب" (`page.tsx:200-202`) — **no "في أبوظبي"** |

Confirmed gap: the `<title>` tag already carries the Abu Dhabi local-intent signal from the prior SEO pass, but the visible H1 was never updated to match. This is exactly the low-risk, narrowly-scoped fix the brief describes — a one-line text change in each of 2 files, no layout change, no URL change.

Proposed H1s (per brief, both already natural against the current hero copy — the hero subhead already reads "a surgical solution for severe erectile dysfunction," so appending the city reads as a normal local clarifier, not a keyword stuff):
- EN: `Penile Implant Surgery in Abu Dhabi`
- AR: `جراحة دعامة القضيب في أبوظبي` *(brief's requested Arabic exactly matches the glossary's already-approved procedure term `جراحة زراعة دعامة القضيب` minus `زراعة` — see §13 note on which exact string to use before implementing)*

## 4. Penile implant intro audit (first 1–2 paragraphs only)

Current hero intro (EN):
> "Penile Implant Surgery" / "A surgical solution for severe erectile dysfunction when other treatments no longer provide reliable results."

Against the brief's checklist of what the intro should naturally establish:

| Element | Present today? |
|---|---|
| Abu Dhabi | No (only in `<title>`, not in visible copy) |
| Consultant Urologist & Andrologist | No (shown lower on the page in the authority strip, not the intro) |
| Inflatable as primary focus | No (device type not mentioned in the intro at all) |
| "Penile prosthesis" as synonym | No |
| Refractory ED | Implicit ("other treatments no longer provide reliable results") but not the term itself |
| Post-prostatectomy ED | No |
| Peyronie's + ED | No |

This confirms a genuine, bounded gap: the intro is currently generic and doesn't front-load any of the terms that already have full sections later on the page (post-prostatectomy pathway, Peyronie's+ED graphic, inflatable-as-primary). A 1-2 sentence addition/rewrite of just the hero subhead — not the rest of the page — can close this without touching the approved visual/copy architecture below it.

## 5. Article cluster audit

| Article (EN slug) | Target query (inferred) | Current title = H1 | Real review signal? | Links to /penile-implant? | /penile-implant links back? | AR equivalent? | Hreflang? | Cannibalization risk | GSC signal (owner-provided) |
|---|---|---|---|---|---|---|---|---|---|
| `penile-implant-when-considered` | "when is a penile implant needed/considered" | "When Is a Penile Implant Considered for Erectile Dysfunction?" | No (pending badge) | Yes — `relatedHref: /penile-implant`, anchor "Penile Implant Surgery" (structural module + closing CTA only, not in-prose) | **No** — `/penile-implant` has no `readMoreHref` pointing to this article | Yes — `when-penile-implant-is-considered` | Yes, reciprocal | Low — informational "when/why" framing is distinct from the commercial page's "what/how" framing | ~Position 7, low volume (per owner) |
| `inflatable-vs-malleable-penile-implant` | "inflatable vs malleable penile implant" | "Inflatable vs Malleable Penile Implant: What's the Difference?" | No | Yes (same structural pattern) | Yes — `readMoreHref` present | Yes — `inflatable-vs-malleable-implant-ar` | Yes, reciprocal | Low | Not provided |
| `penile-implant-recovery-what-to-expect` | "penile implant recovery" | "Penile Implant Recovery: What to Expect" | No | Yes (structural) | Yes — `readMoreHref` present | **No AR equivalent exists** | N/A (one-sided, EN only) | Low | Not provided |
| `orgasm-ejaculation-after-penile-implant` | "orgasm/ejaculation after penile implant" | "Can You Orgasm and Ejaculate With a Penile Implant?" | No | Yes (structural) | Yes — `readMoreHref` present | **No AR equivalent exists** | N/A (one-sided, EN only) | Low | Not provided |
| `penile-implant-after-radical-prostatectomy` | "penile implant after prostatectomy" | "Penile Implant After Radical Prostatectomy" | No | Yes, plus a secondary link to the prostatectomy pillar | Yes — `readMoreHref` present | Yes — `penile-implant-after-radical-prostatectomy-ar` | Yes, reciprocal | Low | Not provided (newest article, likely not yet indexed with meaningful impressions) |
| `peyronies-disease-when-to-seek-assessment` (adjacent, not implant-specific) | "Peyronie's disease assessment" | "Peyronie's Disease: When Should You Seek Specialist Assessment?" | No | **No** — `relatedHref` points to `/peyronies-disease`, not `/penile-implant`; no implant mention anywhere in the body | No | Yes — `peyronies-disease-when-to-seek-assessment-ar` | Yes, reciprocal | None (different page) | Not provided |

**Cross-cutting finding — identical anchor text:** all 5 implant-cluster articles use the exact same `relatedLabel: "Penile Implant Surgery"` linking to `/penile-implant`. This is the one item in this audit that directly matches the brief's "do not use the exact same anchor everywhere" caution. The link itself is present and correct on every article; only the anchor-text variety is the gap, and only across articles (each individual article still only shows its own anchor twice — in the Related Treatments module and the closing CTA — which is normal, not duplicate-anchor spam within a single page).

**Cross-cutting finding — link is structural, not contextual:** on every article, the link to `/penile-implant` exists only via the fixed `RelatedTreatments` module and the closing CTA block — never as an inline, in-prose link inside the article body itself (`section.body` is plain paragraph text with no embedded links anywhere in the codebase). The brief's "natural, contextual link" ask is not fully met today, even though a link technically exists on every page.

*(Both findings above — identical anchors, and structural-only links — are addressed in the "Implemented, this phase" section at the top of this doc: anchors are now diversified, and a handful of in-prose links are now live via the new `[label](/path)` syntax both Insights templates support. The "No AR equivalent exists" cells for `penile-implant-recovery-what-to-expect` and `orgasm-ejaculation-after-penile-implant` are also now resolved — see §13 and the top summary.)

## 6–7. Internal-link map (current state)

```
penile-implant-when-considered  ──(structural only)──▶  /penile-implant
inflatable-vs-malleable-penile-implant  ◀──readMoreHref──  /penile-implant
penile-implant-recovery-what-to-expect  ◀──readMoreHref──  /penile-implant
orgasm-ejaculation-after-penile-implant  ◀──readMoreHref──  /penile-implant
penile-implant-after-radical-prostatectomy  ◀──readMoreHref──  /penile-implant
                                          ◀──readMoreHref──  /urologic-surgery/laparoscopic-radical-prostatectomy
peyronies-disease-when-to-seek-assessment  ─── (no link either direction) ───  /penile-implant
```

**Gap:** `/penile-implant` has 4 of 5 possible `readMoreHref`s into the cluster — missing only a link to `penile-implant-when-considered`, which is arguably the single most relevant companion article (it covers exactly the "when is this appropriate" question the page's own "When Is an Implant Considered" pathway visual raises, and it's also the best-performing article in the cluster per the owner's GSC figures — position ~7). The brief caps this at "3-5 most useful," and the page's existing 4 are already within that range; adding this 5th would put it at the top end of that ceiling, worth flagging rather than assuming.

**Gap:** no link exists in either direction between `/penile-implant` (which now has a full Peyronie's+ED section/graphic from the prior visual pass) and `peyronies-disease-when-to-seek-assessment`. This is a natural, low-risk addition on both sides.

## 8. New-article gap analysis

| Candidate | Existing on-page coverage | Search intent | Cannibalization risk | Clinical value of a dedicated article | AR equivalent warranted? | Recommendation |
|---|---|---|---|---|---|---|
| A. Penile Implant Infection Risk | Already has a dedicated FAQ ("What is the infection risk?") with a substantive answer covering modern devices, protocols, and diabetes/health-factor risk. | High commercial-adjacent intent, but largely satisfied by the existing FAQ+FAQPage schema entry. | High — a standalone article would likely compete with the commercial page's own FAQ for the same query rather than complementing it. | Low incremental — the FAQ answer is already specific and accurate; a full article would mostly restate it at greater length. | No | **Do not build.** Existing FAQ coverage is adequate; revisit only if GSC later shows the FAQ isn't capturing this query at all. |
| B. Penile Length After Penile Implant | Covered only by one FAQ ("Will my penis look or feel shorter after implant surgery?") plus one line in the "What changes/doesn't" grid — both brief, ~3 sentences total. | Clear, frequently-searched, standalone informational intent distinct from the commercial page's framing. | Low — same pattern as the already-successful `orgasm-ejaculation-after-penile-implant` article, which exists precisely because its on-page FAQ coverage was similarly thin. | Genuine — this is a real patient anxiety topic (perceived shortening, tissue/fibrosis mechanics, realistic-expectations framing) that supports a fuller, citation-backed explanation than a 3-sentence FAQ can carry. | Yes, if built | **Genuine gap — candidate for implementation, pending owner approval.** Matches the site's existing precedent (orgasm/ejaculation article) for "FAQ exists but is thin → build the fuller companion article." |
| C. How Long Does a Penile Implant Last? / Revision & Lifespan | Only a single clause, buried in the "Is a penile implant permanent?" FAQ ("mechanical parts can wear over time and some patients may eventually need revision surgery") — no dedicated treatment of device lifespan data, revision rates, or what revision surgery involves. | High-value, frequently-searched informational query with real clinical substance (device longevity studies, mechanical failure/revision rates) not addressed anywhere on the site today. | Low — distinct from the commercial page's candidacy/pathway framing. | Genuine — this is exactly the kind of query that benefits from citation-backed depth (device-generation lifespan data, revision-surgery expectations) that the commercial page should not carry (brief explicitly restricts the landing page to no major changes). | Yes, if built | **Genuine gap — candidate for implementation, pending owner approval.** Strongest clinical-value case of the three. |

**Recommendation:** implement B and C only, each with an Arabic equivalent from day one (matching the site's established 1:1 EN/AR pairing pattern), and skip A. This is 2 new articles, not "many" — consistent with the brief's "do not automatically create many new articles."

## 9. NMC profile audit (read-only — no NMC changes made)

Fetched both live profile surfaces:
- `https://nmc.ae/en/doctors/dr-alejandro-molina`
- `https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina`

Both list, under Andrology services, the bare term **"Penile prosthesis"** — a single unexpanded line item sitting alongside unrelated andrology services (PRP, shockwave, Botox, hyaluronic acid treatments, testosterone deficiency, infertility). Neither profile uses "inflatable penile prosthesis," "erectile dysfunction surgery," "penile implant surgery," or ties the term to refractory ED or post-prostatectomy ED anywhere. This matches the brief's premise: the wording exists but is weak and buried.

**Proposed wording block for NMC to use** (copy only — not submitted or edited anywhere; requires owner authorization before any submission to NMC). Strengthens, in order: Penile Implant Surgery, Inflatable Penile Prosthesis, Refractory Erectile Dysfunction, Post-Prostatectomy Erectile Dysfunction, Peyronie's Disease + ED, Andrology/Sexual Medicine — no procedural volume invented:

> **Penile Implant Surgery (Penile Prosthesis)**
> Surgical treatment for severe or refractory erectile dysfunction, including erectile dysfunction following radical prostatectomy. Inflatable penile prosthesis — the option most commonly selected — and malleable alternatives, individually assessed. Also considered in selected cases of Peyronie's disease with associated erectile dysfunction. Part of a broader andrology and sexual medicine practice.

This expands the existing bare "Penile prosthesis" bullet into a short, specific, clinically accurate block that surfaces every term the owner named, without inventing any claim — no case counts, no outcome figures. **No action taken on NMC's systems** — this is proposed copy only, pending explicit owner authorization to submit it.

## 10. Google Business Profile — recommended service set

Recommended labels and short descriptions, if the GBP "Services" interface supports structured listings for this category — exact copy below, nothing else proposed:

| Service label | Short description |
|---|---|
| Penile Implant Surgery | Surgical treatment for severe or refractory erectile dysfunction, including after prostate surgery. |
| Inflatable Penile Prosthesis | The most commonly selected penile implant option, individually assessed at consultation. |
| Erectile Dysfunction Treatment | Assessment and treatment across the full ED care pathway, from oral medication through surgical options. |
| Peyronie's Disease Treatment | Assessment and treatment of penile curvature, including when it coexists with erectile dysfunction. |

No change recommended to business name, category, address, phone, or hours. No keyword-stuffed name variants. This list is conceptual pending the owner (or whoever has GBP access) confirming what the interface actually allows — I have no direct access to verify the live GBP listing.

## 11. External authority roadmap

### P0 — in progress or ready now
| Opportunity | SEO value | Authority value | Feasibility | Owner effort |
|---|---|---|---|---|
| NMC profile wording strengthening (§9) | Medium — authoritative .ae hospital domain context, strengthens off-site E-E-A-T footprint | High — official institutional confirmation of the exact services | High — copy is ready now, just needs NMC's standard profile-update channel | Low (submit copy, confirm with NMC) |
| Article medical-review architecture (§1-§2) | Low direct SEO value; supports E-E-A-T signals Google's own guidelines name explicitly | High — genuine reviewer attribution, not decorative | Done — architecture live on Preview; only real review dates remain outstanding | Low (confirm review dates when ready) |
| Arabic cluster parity (§13) | Medium — closes a real content gap for Arabic-language queries | Medium | Done — both missing AR articles now live on Preview | None remaining for this batch |

### P1 — next, pending owner initiative
| Opportunity | SEO value | Authority value | Feasibility | Owner effort |
|---|---|---|---|---|
| NMC patient-education article (hospital-hosted, authored/reviewed by Dr. Molina) | Medium-high — a .ae hospital-domain article on penile implants, ideally linking to the practice, is a strong topical + authority backlink | High — hospital-published patient education carries strong institutional trust | Medium — depends on NMC's content program accepting physician-contributed material | Medium (drafting + NMC coordination) |
| Manufacturer surgeon directory, if eligible | Medium — manufacturer domains are typically well-trusted, high-authority backlinks | High — manufacturer-verified surgeon status is a strong, independently-verified signal | Depends entirely on manufacturer eligibility criteria — owner needs to confirm directly | Low once eligible (mostly a one-time application) |
| High-quality LinkedIn clinical-education content | Low direct SEO value (nofollow), but drives referral traffic and branded search | Medium — builds personal authority among referring GPs and peers | High — fully within the owner's control | Low-medium (owner's own voice) |
| Relevant professional/medical directories (established .ae health directories, not low-quality aggregators) | Medium — a legitimate, well-trafficked UAE health directory is a relevant, geographically-targeted backlink | Medium — depends on the directory's own legitimacy | High — usually a straightforward profile submission | Low |

### P2 — long-term, data- or opportunity-dependent
| Opportunity | SEO value | Authority value | Feasibility | Owner effort |
|---|---|---|---|---|
| Academic/case-series publication | Low direct SEO value; indirect long-term authority | Very high — the strongest, most durable E-E-A-T signal available | Low short-term — requires real case data and journal review timelines | High (data collection, writing, submission, revision cycles) |
| Congress/society content | Low direct SEO value, but proceedings are sometimes indexed/citable and can lead to real backlinks | High — genuine clinical-authority building, not a marketing move | Low to initiate quickly — depends on congress calendars and abstract cycles | High (real case data, abstract writing, travel) |
| Expert commentary/interviews | Medium — earned media often includes a backlink and drives branded search | High — third-party validation is a strong trust signal | Medium — depends on media outreach/relationships | Medium (PR outreach, outside this project's current scope) |
| Implant-specific outcomes/series, once reliable data exist | None until data exist | Very high once published | Depends entirely on the owner compiling verified case data (§12) | High |

No low-quality backlink schemes (paid directories, link farms, guest-post networks) are included or recommended anywhere in this roadmap.

## 12. Clinical authority data — placeholder (owner input required)

**No numbers below are published anywhere until the owner explicitly confirms them.** This section exists only to define what would strengthen implant-specific authority once (and if) real figures are confirmed — following the exact same fail-safe pattern already used for `girthProcedureCount` in `doctor.ts` (a field that stays `undefined`/unrendered until explicitly owner-confirmed, never a placeholder or estimate).

| Metric | Current status |
|---|---|
| Total penile implant cases performed | Not confirmed — no figure exists in `doctor.ts` or anywhere else in the codebase today |
| Years performing implant surgery specifically | Not confirmed (distinct from the general `yearsOfExperience: 15` figure, which covers urology broadly, not implants specifically) |
| Inflatable vs malleable case proportion | Not confirmed |
| Revision-surgery experience/volume | Not confirmed |
| Peyronie's/fibrosis case experience | Not confirmed |
| Infection-outcome rate | Not confirmed |
| Post-prostatectomy implant case volume | Not confirmed |

If and when the owner supplies any of these, the correct implementation pattern is a new field on `doctor.ts` (e.g. `implantProcedureCount`), consumed by the same fail-safe rendering pattern as `girthProcedureCount` — render nothing if `undefined`, never fall back to an invented or rounded figure.

## 13. Arabic authority audit

| Check | Status |
|---|---|
| Review-signal parity | Same site-wide gap as EN (§1) — AR template has the identical "pending" badge, same fix needed in parallel |
| Reviewer info | Not yet implemented in either language — same architecture proposal (§2) covers both |
| Local Abu Dhabi wording | `<title>` already includes "في أبوظبي"; H1 does not yet (same gap as EN, §3) |
| Internal-link parity | 3 of 5 EN articles have AR equivalents with reciprocal hreflang (`when-penile-implant-is-considered`, `inflatable-vs-malleable-implant-ar`, `penile-implant-after-radical-prostatectomy-ar`); **2 EN articles have no AR equivalent at all** — `penile-implant-recovery-what-to-expect` and `orgasm-ejaculation-after-penile-implant` |
| Arabic article coverage | Genuine gap confirmed above — these 2 missing AR articles are a clearer, lower-ambiguity gap than the new-article candidates in §8, since they're 1:1 translations of already-approved, already-reviewed EN content rather than new topics |
| Glossary consistency | Already strong. `docs/arabic-medical-glossary.md` has owner-decided (2026-09-14) approved terms matching 3 of the brief's 4 priority phrases exactly: `دعامة القضيب` (bare device), `جراحة زراعة دعامة القضيب` (procedure), `دعامة قضيبية قابلة للنفخ` (inflatable) — all already in active use on the AR implant page. `دعامة القضيب بعد استئصال البروستاتا` (post-prostatectomy) is already the live section heading and article title, verbatim. |

**Resolved — AR H1 wording:** the owner confirmed `جراحة دعامة القضيب في أبوظبي` is a deliberate decision, not an oversight — the fuller `جراحة زراعة دعامة القضيب` continues to be used naturally in body copy, breadcrumbs and JSON-LD `name` where it already appeared. Implemented as specified; glossary doc left as-is since the owner characterized this as a patient-facing H1 choice specific to this page, not a sitewide terminology change.

## 14. Search Console monitoring plan

Baseline (owner-provided, current):
- `/penile-implant`: ~position 22-23 overall over the last 7 days
- "penile implant in abu dhabi": ~position 21, very low impressions
- `/insights/penile-implant-when-considered` ("When Is a Penile Implant Considered?"): ~position 7, low impressions

These are early, low-volume signals — the monitoring plan below is designed to avoid overreacting to week-to-week swings, per the owner's own caution not to overinterpret them or justify another major landing-page rewrite off one week of data.

**Queries to track weekly** (English + the Arabic equivalents the owner named):
- penile implant in abu dhabi
- penile implant abu dhabi
- penile prosthesis abu dhabi
- inflatable penile implant abu dhabi
- penile implant UAE
- دعامة القضيب (bare device term)
- دعامة القضيب في أبوظبي (device + Abu Dhabi)
- دعامة قضيبية قابلة للنفخ (inflatable penile prosthesis)

**Metrics per query/landing page:** impressions, clicks, CTR, average position, landing page, plus `/book` visits and NMC booking-link clicks attributed to implant-cluster sessions (via the existing `BookingCta` `sourcePage`/`ctaPosition` attribution already instrumented across the implant page and every article's closing CTA — no new instrumentation needed).

| Checkpoint | What to look at | What counts as a real signal vs. noise |
|---|---|---|
| 7-day | Impressions/clicks/CTR/position for `/penile-implant` and the 7 cluster articles (EN+AR), the query list above, `/book` + NMC-click counts | A single week's position swing of a few places on a low-volume query is expected noise, not a signal either way |
| 14-day | Same metrics, trended against the first 7-day window; new queries appearing; whether the 2 new articles have started accumulating impressions at all | A consistent directional move across both 7-day windows (not just one) starts to be meaningful |
| 28-day | Full trend across all 4 weekly windows; landing-page growth; `/book`/NMC-click trend | The first point where a real ranking-movement conclusion is defensible — also the right checkpoint to ask whether the H1/intro/internal-link/AR-parity changes in this phase correlate with any measurable shift |

## 15. Landing-page change freeze

Implemented this phase on `/penile-implant` (EN+AR): H1 text, hero intro (1-2 sentences), 3 new FAQ `readMoreHref` links into the cluster (no new FAQ questions, no visual change). Nothing else on the landing page changed — the visual module architecture from the prior two passes (ConnectedPathway, icon system, CAN/CANNOT, recovery timeline, inflatable-primary/malleable-secondary structure) is untouched.

Per the owner's instruction, `/penile-implant` content/layout is now **frozen for approximately 2-3 weeks** from this deploy, while Google processes the recent major SEO/UX changes. Work in that window should stay on cluster authority, Arabic parity, medical review, and off-page authority (§9-§14) — not further landing-page edits.
