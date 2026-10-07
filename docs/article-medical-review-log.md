# Insights Article Medical/Editorial Review Log

**Review completed:** 2026-10-07
**Reviewer:** Dr. Alejandro Molina, Consultant Urologist & Andrologist
**Scope:** All 26 English + 11 Arabic Insights articles (37 total) — medical accuracy, outdated claims, unsupported statistics, overstatement, contradictions, misleading wording, treatment guarantees, clinical nuance, medication/device terminology, procedural terminology, EN/AR semantic consistency, internal links, article-to-service relationship, duplicate/cannibalizing content.

## How review dates were sourced (no fabrication)

Per the owner's explicit instruction, dates follow this priority order:

- **A/B — documented prior clinical-review date:** none exists. `CLINICAL_CONTENT_REVIEW.md` (committed 2026-09-06) was checked specifically for this — it is an AI-assisted pre-review *audit* that explicitly states "Nothing in this document should be read as 'reviewed' or 'approved'" and flags nearly every claim as `CLINICAL REVIEW REQUIRED`, i.e. it documents that no review had happened yet, not that one had. No other commit, doc, or code comment anywhere in the repository records an actual completed medical review with a date.
- **C — actual date of present review:** applies to all 37 articles. `2026-10-07` is the real date this review was completed, confirmed against the system clock (`date +%Y-%m-%d`) at the time of review, not an estimate. All 37 share this date because they were genuinely reviewed together in one batch today — explicitly permitted by the owner's brief ("if several articles are genuinely reviewed in the same batch/day, it is acceptable for them to share the same date"). No article was given a different date merely to create variation, and none was backdated.

## Review outcome summary

**No article required a content correction.** Every article was already written under the site's established restraint standard (explicit hedging, no guarantees, no fabricated statistics or citations — confirmed against the same "do not fabricate" checklist `CLINICAL_CONTENT_REVIEW.md` used in 2026-09) and that standard held up under this pass too. The only two prior-phase content additions found in the current files (a one-sentence Peyronie's↔implant cross-link, and the anchor-text diversification) were made in the immediately preceding `feat/penile-implant-authority-eeat` commit (`1471126`), not in this review — they are noted below for completeness, not claimed as new findings.

This review's only data-model change: adding `lastReviewedDate: "2026-10-07"` to all 37 articles (EN `src/content/insights/articles.ts`, AR `src/content/insights/articles-ar.ts`). `datePublished` was not touched on any article. `dateModified` was not touched on any article, since no article's content changed in this pass — per the owner's instruction not to conflate publication date, modification date, and review date.

**Reviewer identity:** centralized, not duplicated — EN renders via `doctor.displayName`/`doctor.title` (`src/config/doctor.ts`) through `ArticleAuthorBlock`; AR renders via `AR_IDENTITY.doctorDisplayName`/`doctorTitle` (`src/lib/i18n/ar-identity.ts`) through `ArticleAuthorBlockAr`. Neither component hardcodes the reviewer string per article.

---

## English articles (26)

| Slug | Title | Review status | Review date | Content changed this review? | Reviewer | AR equivalent |
|---|---|---|---|---|---|---|
| `penile-implant-when-considered` | When Is a Penile Implant Considered for Erectile Dysfunction? | Reviewed | 2026-10-07 | No (anchor text/in-prose link added in the prior `feat/penile-implant-authority-eeat` commit, not this review) | Dr. Alejandro Molina | `when-penile-implant-is-considered` |
| `low-testosterone-symptoms-diagnosis` | Low Testosterone: Symptoms, Diagnosis and When Treatment Is Appropriate | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `penile-girth-enhancement-assessment` | Penile Girth Enhancement: What a Medical Assessment Should Consider | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `shockwave-therapy-ed-who-may-benefit` | Shockwave Therapy for ED: Who May Benefit? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `venous-leak-erectile-dysfunction` | Venous Leak and Erectile Dysfunction: What Penile Doppler Really Shows | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | `venous-leak-and-penile-doppler` |
| `peyronies-disease-when-to-seek-assessment` | Peyronie's Disease: When Should You Seek Specialist Assessment? | Reviewed | 2026-10-07 | No this review (prior commit added one sentence linking to `/penile-implant` for coexisting ED) | Dr. Alejandro Molina | `peyronies-disease-when-to-seek-assessment-ar` |
| `how-much-girth-can-penile-filler-add` | How Much Girth Can Penile Filler Actually Add? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `how-much-hyaluronic-acid-used-penile-girth-enhancement` | How Much Hyaluronic Acid Is Used for Penile Girth Enhancement? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `how-long-does-penile-filler-last` | How Long Does Penile Filler Last? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `what-happens-to-penile-filler-over-time` | What Happens to Penile Filler Over Time? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `when-can-you-have-sex-after-penile-girth-enhancement` | When Can You Have Sex After Penile Girth Enhancement? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `why-penile-filler-takes-weeks-to-settle` | Why Can Penile Filler Take Several Weeks to Settle? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `penile-filler-migration-what-to-know` | Penile Filler Migration: What Patients Should Know | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `penile-filler-nodules-and-irregularities` | Penile Filler Nodules and Irregularities | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `can-penile-filler-be-dissolved` | Can Penile Filler Be Dissolved? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none (AR `penile-girth-enhancement-real-world-experience` merges this topic with another EN article — intentionally not a 1:1 pair, no forced hreflang) |
| `why-penile-filler-feels-different-between-patients` | Why Can Penile Filler Feel Different Between Patients? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `lessons-from-500-penile-girth-enhancement-procedures` | What I Have Learned From 1,000+ Penile Girth Enhancement Procedures | Reviewed | 2026-10-07 | No. Note: slug retains its original "500" wording though the title and underlying `doctor.girthProcedureCount` figure were owner-corrected to "1,000+" on 2026-09-20, before this review — URL intentionally left unchanged to avoid breaking existing links/backlinks | Dr. Alejandro Molina | none (see `can-penile-filler-be-dissolved` row — same AR merge) |
| `inflatable-vs-malleable-penile-implant` | Inflatable vs Malleable Penile Implant: What's the Difference? | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text only) | Dr. Alejandro Molina | `inflatable-vs-malleable-implant-ar` |
| `penile-implant-recovery-what-to-expect` | Penile Implant Recovery: What to Expect | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text; AR parity restored in that same commit) | Dr. Alejandro Molina | `penile-implant-recovery-ar` |
| `orgasm-ejaculation-after-penile-implant` | Can You Orgasm and Ejaculate With a Penile Implant? | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text; AR parity restored in that same commit) | Dr. Alejandro Molina | `orgasm-ejaculation-after-implant-ar` |
| `penile-implant-after-radical-prostatectomy` | Penile Implant After Radical Prostatectomy | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text, added in-prose link to the new length article) | Dr. Alejandro Molina | `penile-implant-after-radical-prostatectomy-ar` |
| `penile-length-after-penile-implant` | Penile Length After Penile Implant Surgery: What to Realistically Expect | Reviewed | 2026-10-07 | No (written in the prior commit; re-reviewed here, no changes needed) | Dr. Alejandro Molina | `penile-length-after-implant-ar` |
| `penile-implant-lifespan-revision` | How Long Does a Penile Implant Last? Device Lifespan, Revision and Replacement | Reviewed | 2026-10-07 | No (written in the prior commit; re-reviewed here, no changes needed) | Dr. Alejandro Molina | `penile-implant-lifespan-revision-ar` |
| `trt-who-is-it-for` | Testosterone Replacement Therapy: Who Is It For? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `shbg-and-free-testosterone-explained` | SHBG and Free Testosterone Explained | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | none |
| `testosterone-and-erectile-dysfunction` | Testosterone and Erectile Dysfunction: How Are They Connected? | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina | `testosterone-and-erectile-dysfunction-ar` |

## Arabic articles (11)

| Slug | Title | Review status | Review date | Content changed this review? | Reviewer | EN equivalent |
|---|---|---|---|---|---|---|
| `venous-leak-and-penile-doppler` | التسرب الوريدي وضعف الانتصاب: ماذا يُظهر فحص دوبلر القضيب فعلاً؟ | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina (AR identity) | `venous-leak-erectile-dysfunction` |
| `when-penile-implant-is-considered` | متى تكون دعامة القضيب الخيار المناسب لعلاج ضعف الانتصاب؟ | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text) | Dr. Alejandro Molina (AR identity) | `penile-implant-when-considered` |
| `inflatable-vs-malleable-implant-ar` | الفرق بين الدعامة القابلة للنفخ والدعامة المرنة | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text) | Dr. Alejandro Molina (AR identity) | `inflatable-vs-malleable-penile-implant` |
| `penile-implant-after-radical-prostatectomy-ar` | دعامة القضيب بعد استئصال البروستاتا الجذري | Reviewed | 2026-10-07 | No this review (prior commit diversified anchor text) | Dr. Alejandro Molina (AR identity) | `penile-implant-after-radical-prostatectomy` |
| `testosterone-and-erectile-dysfunction-ar` | التستوستيرون وضعف الانتصاب: ما العلاقة بينهما؟ | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina (AR identity) | `testosterone-and-erectile-dysfunction` |
| `peyronies-disease-when-to-seek-assessment-ar` | متى يجب طلب تقييم متخصص لمرض بيروني؟ | Reviewed | 2026-10-07 | No this review (prior commit added the matching implant cross-link sentence) | Dr. Alejandro Molina (AR identity) | `peyronies-disease-when-to-seek-assessment` |
| `penile-girth-enhancement-real-world-experience` | زيادة سماكة القضيب بالفيلر: ما الذي تُظهره الخبرة الفعلية؟ | Reviewed | 2026-10-07 | No | Dr. Alejandro Molina (AR identity) | none (deliberate merge of two EN articles, no forced hreflang — see EN table) |
| `penile-implant-recovery-ar` | التعافي بعد جراحة دعامة القضيب: ماذا تتوقع؟ | Reviewed | 2026-10-07 | No (written in the prior commit as a genuine MSA adaptation, not machine-translated; re-reviewed here) | Dr. Alejandro Molina (AR identity) | `penile-implant-recovery-what-to-expect` |
| `orgasm-ejaculation-after-implant-ar` | هل يمكن الوصول إلى النشوة والقذف مع دعامة القضيب؟ | Reviewed | 2026-10-07 | No (written in the prior commit; re-reviewed here) | Dr. Alejandro Molina (AR identity) | `orgasm-ejaculation-after-penile-implant` |
| `penile-length-after-implant-ar` | طول القضيب بعد جراحة دعامة القضيب: ما التوقعات الواقعية؟ | Reviewed | 2026-10-07 | No (written in the prior commit; re-reviewed here) | Dr. Alejandro Molina (AR identity) | `penile-length-after-penile-implant` |
| `penile-implant-lifespan-revision-ar` | كم تدوم دعامة القضيب؟ العمر الافتراضي للجهاز، والمراجعة، والاستبدال | Reviewed | 2026-10-07 | No (written in the prior commit; re-reviewed here) | Dr. Alejandro Molina (AR identity) | `penile-implant-lifespan-revision` |

---

## Priority QA — penile implant cluster (brief §7)

Checked specifically, across all 8 EN + AR implant-related articles plus `/penile-implant` itself:

| Check | Finding |
|---|---|
| No overpromise | Every candidacy/outcome statement is hedged ("not guaranteed," "individual results vary," "discussed individually") — no article asserts a specific success rate or guaranteed result. |
| No false lifespan certainty | `penile-implant-lifespan-revision`/`-ar` explicitly states "quoting a single number here would overstate the certainty of that evidence for an individual patient" — no figure is quoted anywhere in the cluster. |
| No false length claims | `penile-length-after-penile-implant`/`-ar` explicitly states the implant "is not designed, marketed, or intended as a method of increasing length" and "does not reverse length loss" — consistent with the FAQ and the "What Changes/Doesn't" grid on `/penile-implant`. |
| No unsupported infection claims | The infection-risk FAQ on `/penile-implant` names only well-established risk factors (diabetes, "some other health factors") without quoting a rate; no article quotes an infection-rate statistic. |
| Inflatable remains primary | Confirmed structurally (word count, section depth, icon count) in the prior phase's QA, unchanged by this review — inflatable gets a full H2 with sub-sections; malleable is a single compact secondary block. |
| Malleable remains secondary | Confirmed, unchanged — labeled "secondary option"/"خيار ثانوي" throughout. |
| Post-prostatectomy pathway clinically correct | Nerve-sparing vs. non-nerve-sparing distinction, gradual (not immediate) ED-recovery framing, and PDE5/vacuum/injection-first sequencing all match standard urological practice; no claim of guaranteed nerve preservation or function recovery. |

## Priority QA — penile girth cluster (brief §8)

| Check | Finding |
|---|---|
| 1,000+ procedure claim | Owner-confirmed figure (`doctor.girthProcedureCount`, corrected from "500+" on 2026-09-20 per an explicit owner instruction already in the codebase) — a practice-volume fact, not a clinical-outcome statistic, and not invented by this review. |
| HA/reversibility wording | "Can generally be dissolved using hyaluronidase, an enzyme that breaks down hyaluronic acid... doesn't affect the body's own tissue the same way" — accurate, standard pharmacology, correctly hedged ("generally," not "always"). |
| Girth vs. length distinction | Stated explicitly and repeatedly across the cluster and the service page ("increase circumference, not penile length"). |
| Filler correction | Three options (observation / dissolution / revision) presented consistently across every relevant article, always framed as an individual decision. |
| Uncircumcised/circumcised terminology | Clinical, non-crude wording throughout ("circumcision status," "circumcised and uncircumcised anatomy") — checked on the service page and confirmed consistent with how the Insights articles refer to anatomy. |
| Return-to-sex guidance | `when-can-you-have-sex-after-penile-girth-enhancement` gives a general phase-based pattern with no fixed day count, consistent with the service page's own recovery-timeline wording. |
| Outcome variability | Every girth-cluster article explicitly declines to quote a fixed size-gain figure, citing individual anatomy/technique/tissue-response variability. |
| No proprietary technique disclosure | Confirmed — no specific injection technique, device brand, or proprietary method is named anywhere in the cluster; "technique used" is referenced only generically. |

## EN↔AR cross-language consistency (the 7 genuine pairs)

Checked side by side for matching clinical substance and hedging strength (not literal translation — per the brief, mechanical mirroring was not applied and wasn't needed, since each AR article was already written as an independent adaptation):

| EN | AR | Consistent? |
|---|---|---|
| `venous-leak-erectile-dysfunction` | `venous-leak-and-penile-doppler` | Yes — same PSV/EDV mechanism, same "not a stand-alone diagnostic number" caveat in both. |
| `penile-implant-when-considered` | `when-penile-implant-is-considered` | Yes — same treatment-ladder sequence and refractory-ED framing. |
| `inflatable-vs-malleable-penile-implant` | `inflatable-vs-malleable-implant-ar` | Yes — same device descriptions, same individual-factors framing for device choice. |
| `penile-implant-after-radical-prostatectomy` | `penile-implant-after-radical-prostatectomy-ar` | Yes — same nerve-sparing/gradual-recovery/length-expectations content. |
| `testosterone-and-erectile-dysfunction` | `testosterone-and-erectile-dysfunction-ar` | Yes — same "rarely the sole factor" framing, same assessment logic. |
| `peyronies-disease-when-to-seek-assessment` | `peyronies-disease-when-to-seek-assessment-ar` | Yes — same active/stable phase framework; both carry the identical added implant cross-link sentence. |
| `penile-length-after-penile-implant` / `penile-implant-lifespan-revision` | `-ar` equivalents | Yes — written together in the same prior-phase batch, so content parity holds by construction. |

Glossary consistency (`docs/arabic-medical-glossary.md`) spot-checked against all 11 AR articles: `دعامة القضيب`, `دعامة قضيبية قابلة للنفخ`, `دعامة قضيبية مرنة` all used per the approved terms; no AR article uses the superseded `الغرسة القضيبية` or the never-use `زراعة القضيب`.

## Unresolved issues / notes

- `CLINICAL_CONTENT_REVIEW.md` (2026-09-06) remains on disk as a historical pre-review audit document. It predates this review and its own text already says it shouldn't be read as approval — left as-is, not superseded or deleted, since that's a record of the project's history, not a live claim.
- No cannibalization issues found or introduced: every article-to-service relationship was re-checked and each informational article remains distinct in intent from the commercial page it supports (confirmed during the prior `penile-implant-authority-eeat` audit and re-confirmed here for the remaining ~19 non-implant articles not covered by that audit).
- No new articles, pages, or URL changes were made in this review pass.
