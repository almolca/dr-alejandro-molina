# R10 — Arabic Content Roadmap (Insights Articles)

Status: research/planning deliverable (Phases 9–10), refined after the R10 Stop Point 1 validation pass. No articles have been written or published. This is a plan to review, not a build.

## Guiding constraint

The brief is explicit: do not translate the English Insights library wholesale, and do not publish a "20 thin articles" wave. The English library (`src/content/insights/articles.ts`) already has ~24 published, clinically-approved articles. Rather than inventing new Arabic topics from scratch, the highest-leverage, lowest-risk first wave is to **adapt (not literally translate) the small subset of existing English articles that map directly onto a P1 Arabic service page**, because:

- Their clinical claims are already owner-approved — no new clinical review surface.
- They already prove the topic has enough depth to be an article rather than a paragraph.
- Each one has an obvious, non-cannibalizing internal-link target (a specific P1 service page, not its hub).

This keeps the first wave inside the brief's 4–6 article ceiling while still answering genuine Arabic search intent identified in the keyword research.

**Localization vs. adaptation, defined for this doc:** *localization* means translating the EN article's existing structure and claims into natural Arabic with light local/cultural adjustment. *Adaptation* means restructuring — different framing, different emphasis, sometimes merging two EN articles' material — because the Arabic query behavior or the target page's needs don't map 1:1 onto the EN article as written. All 6 below lean toward adaptation rather than pure localization, because none of the underlying EN articles were written with an Arabic keyword cluster in mind; each needs its lead question and framing rebuilt around the actual validated Arabic query, even though the clinical substance carries over directly.

## First-wave candidates (recommended: build these 6)

### 1. التسرب الوريدي وضعف الانتصاب: ماذا يُظهر فحص دوبلر القضيب فعلاً؟

- **EN source article exists?** Yes — `venous-leak-erectile-dysfunction` ("Venous Leak and Erectile Dysfunction: What Penile Doppler Really Shows"). Clinically pre-approved.
- **Localization or adaptation?** Adaptation. The EN article is written toward a general audience with no specific query in mind; the Arabic version should open directly on the validated query "ما هو التسرب الوريدي؟" / "هل يمكن علاج التسرب الوريدي؟" rather than the EN piece's own lead-in.
- **Exact target informational intent:** A patient has been told "you may have a venous leak" (by this practice, a Doppler report, or another clinic) and wants to understand what that actually means before/after the diagnostic test — this is a *concept* query, not a "find a doctor" query.
- **Primary query / secondary queries:** التسرب الوريدي للقضيب / ما هو التسرب الوريدي، متى أحتاج فحص دوبلر للقضيب، هل يمكن علاج التسرب الوريدي
- **Service page it supports:** `/ar/erectile-dysfunction/penile-doppler`
- **Why it will not cannibalize that page:** The service page's job (confirmed on direct reading, see `docs/r10-arabic-seo-research.md` §6.2) is the diagnostic pathway — when the test is used, what it measures, how to read PSV/EDV. The article's job is the *concept* explainer for someone who already has the term "venous leak" in hand, at a level of plain-language depth a commercial service page shouldn't try to match. Different depth, different moment in the patient's journey — not the same target.
- **Internal link direction:**
  - Article → service: primary CTA to `/ar/erectile-dysfunction/penile-doppler`, secondary mention of `/ar/erectile-dysfunction`.
  - Service → article: **a ready-made slot already exists.** The Doppler page's FAQ item "ما هو التسرب الوريدي؟" currently has `readMoreHref: "#venous-leak"` (an in-page anchor) and the page separately links out twice to the English Insights article. Once this Arabic article exists, the *service-page body copy's* two English outbound links (not the FAQ's in-page anchor, which should stay) are the natural swap target — same location, becomes Arabic.
- **Priority:** P1 (Cluster 3 has the least direct Abu Dhabi competition of any cluster researched)

### 2. متى تكون دعامة القضيب الخيار المناسب لعلاج ضعف الانتصاب؟

- **EN source article exists?** Yes — `penile-implant-when-considered` ("When Is a Penile Implant Considered for Erectile Dysfunction?"). Clinically pre-approved.
- **Localization or adaptation?** Adaptation — reframed around the decision-pathway query rather than the EN article's original structure.
- **Exact target informational intent:** A man who has already tried other ED treatments (PDE5 inhibitors, injections) without success and wants to understand *when* — not *whether* — an implant becomes the appropriate next step, before booking a consultation.
- **Primary query / secondary queries:** متى تُستخدم دعامة القضيب / دعامة القضيب بعد فشل الأدوية، هل دعامة القضيب هي الحل الأخير
- **Service page it supports:** `/ar/penile-implant`
- **Why it will not cannibalize that page:** The service page (confirmed on direct reading) already frames itself as "نهاية مسار تقييم — لا بدايته" (the end of an evaluation path, not its start) and covers candidacy pillars, device types, and the surgical pathway. The article narrows in on just the decision *trigger* — "when," specifically — which the service page mentions but doesn't dwell on as its own subject.
- **Internal link direction:**
  - Article → service: primary CTA to `/ar/penile-implant`.
  - Service → article: the implant page's FAQ already has English-only `readMoreHref` links on 4 of its 9 FAQ items (per the on-page audit) — one of those slots is the natural home for this article once built, likely attached to the "ما هي بدائل دعامة القضيب؟" or an equivalent candidacy-framed question.
- **Priority:** P1

### 3. الفرق بين الدعامة القابلة للنفخ والدعامة المرنة

- **EN source article exists?** Yes — `inflatable-vs-malleable-penile-implant` ("Inflatable vs Malleable Penile Implant: What's the Difference?"). Clinically pre-approved.
- **Localization or adaptation?** Closer to localization than the others — this is a direct comparison piece and the EN structure (trade-offs table: cost, complexity, naturalness, procedure) maps cleanly onto the validated Arabic query.
- **Exact target informational intent:** A man who has already accepted an implant is the right path and is now comparing the two device types before or during consultation — later-stage decision intent than article #2.
- **Primary query / secondary queries:** الفرق بين الدعامة القابلة للنفخ والدعامة المرنة / أنواع دعامة القضيب، دعامة هيدروليكية أم مرنة
- **Service page it supports:** `/ar/penile-implant`
- **Why it will not cannibalize that page:** The service page's own "القابل للنفخ مقابل المرن" section (confirmed on direct reading) already covers both device types, but as one part of a longer candidacy/pathway/risk page. The article's entire purpose is the comparison itself, with room for a trade-off framing (cost, complexity, how natural it feels day-to-day) the service page doesn't have space for. This is depth-on-one-subtopic, the same pattern as #1, not a competing target — the risk is only that the article should lead with trade-offs rather than re-explaining what each device is from scratch, since the service page already does that part.
- **Internal link direction:**
  - Article → service: primary CTA to `/ar/penile-implant`.
  - Service → article: same FAQ `readMoreHref` mechanism as #2 — the implant page's device-type FAQ item ("ما الفرق بين الدعامات القضيبية القابلة للنفخ والمرنة؟") is the exact existing slot this article should be attached to once built.
- **Priority:** P1 — sequence directly after #2, same target page, natural pair.

### 4. التستوستيرون وضعف الانتصاب: ما العلاقة بينهما؟

- **EN source article exists?** Yes — `testosterone-and-erectile-dysfunction` ("Testosterone and Erectile Dysfunction: How Are They Connected?"). Clinically pre-approved.
- **Localization or adaptation?** Adaptation — the Arabic version should lead with the corrective framing ("no, low T is rarely the sole cause") that research found is the genuinely common misconception, more directly than the EN piece may need to for its own audience.
- **Exact target informational intent:** A man assumes his ED must be caused by low testosterone (or the reverse — assumes testosterone therapy will fix his ED) and is trying to understand the actual, more limited relationship before or instead of booking a consultation.
- **Primary query / secondary queries:** هل نقص التستوستيرون يسبب ضعف الانتصاب / علاقة التستوستيرون بالانتصاب، هل علاج التستوستيرون يحسن الانتصاب
- **Service page it supports:** `/ar/mens-health/testosterone` (primary)
- **Why it will not cannibalize either page it touches:** This is the one topic that genuinely sits between two P1 pages (`/ar/erectile-dysfunction` and `/ar/mens-health/testosterone`), and direct reading confirms **both pages already handle their own side of it correctly and briefly** — the ED page's FAQ has one line ("هل يمكن أن يرتبط ضعف الانتصاب بالتستوستيرون؟ — نعم، من الممكن ذلك... رغم أن ضعف الانتصاب ليس هرمونيًا في كل الحالات") and the Doppler page has its own one-line version with a `readMoreHref` already pointing to `/ar/mens-health/testosterone`. Neither page over-explains the nuance today, so there is no existing cannibalization to fix — the article's role is additive: give this specific cross-cutting question the depth neither commercial page should carry, and become the thing both pages' brief mentions can eventually point to instead of just pointing at each other.
- **Internal link direction:**
  - Article → service: primary CTA to `/ar/mens-health/testosterone`, secondary mention of `/ar/erectile-dysfunction`.
  - Service → article: two existing slots to eventually retarget — the ED page's FAQ item above, and the Doppler page's FAQ item whose `readMoreHref` currently points straight to `/ar/mens-health/testosterone` (that link could point to this article instead once it exists, or stay as-is with the article added as a second reference — an implementation-time editorial call, not a research one).
- **Priority:** P1

### 5. متى يجب طلب تقييم متخصص لمرض بيروني؟

- **EN source article exists?** Yes — `peyronies-disease-when-to-seek-assessment` ("Peyronie's Disease: When Should You Seek Specialist Assessment?"). Clinically pre-approved.
- **Localization or adaptation?** Adaptation — restructured around the staged decision framing (observe → non-surgical → surgical) that live competitor research found is how patients actually encounter this topic in Arabic.
- **Exact target informational intent:** A man has noticed curvature and doesn't know whether it's serious enough to need a doctor yet, or whether it will resolve/worsen on its own — a threshold-for-care question, not a treatment-options question.
- **Primary query / secondary queries:** مرض بيروني متى يحتاج علاج / انحناء القضيب متى يكون خطيراً، هل انحناء القضيب البسيط يحتاج علاج
- **Service page it supports:** `/ar/peyronies-disease`
- **Why it will not cannibalize that page:** The service page (per the on-page audit) is comparatively thin — no risk section, no candidacy checklist — and doesn't currently have a dedicated "when to seek care" thread beyond its active/stable-phase framing. The article fills a real gap rather than competing with existing depth; if anything, this article's existence is *also* useful as a source of future FAQ content for the service page itself (§5.4/§6.4 territory).
- **Internal link direction:**
  - Article → service: primary CTA to `/ar/peyronies-disease`.
  - Service → article: **no existing `readMoreHref` slot found** on this page (unlike #1–#4) — the on-page audit found no English Insights links on `/ar/peyronies-disease`'s FAQ. Adding one is a small, net-new FAQ-link edit at implementation time, not a swap of an existing stub.
- **Priority:** P2 (sequence after the four P1-linked articles above, per the brief's own P2 placement for this cluster)

### 6. زيادة سماكة القضيب بالفيلر: ما الذي تُظهره الخبرة الفعلية؟

- **EN source article exists?** Yes, two candidates — `lessons-from-500-penile-girth-enhancement-procedures` ("What I Have Learned From 500+ Penile Girth Enhancement Procedures") and `how-much-girth-can-penile-filler-add`. Recommend leading with the "lessons learned" article for its E-E-A-T value, folding in the girth-can-add article's substance rather than publishing both as separate pieces in wave 1.
- **Localization or adaptation?** Adaptation — merges two EN sources into one Arabic article, framed around the trust/safety query research found rather than either EN article's original framing.
- **Exact target informational intent:** A man is specifically wary after encountering conflicting, often overly cautious or overly promotional Arabic-language claims elsewhere about filler safety/permanence, and wants a grounded, experience-based answer before consultation — this is a *trust-building* query, not a pure mechanics query.
- **Primary query / secondary queries:** هل زيادة سماكة القضيب بالفيلر دائمة / كم تزيد سماكة القضيب بالفيلر، ما المتوقع بعد الحقن، تجربة فعلية
- **Service page it supports:** `/ar/male-aesthetics/penile-girth-enhancement`
- **Why it will not cannibalize that page:** Confirmed on direct reading — the service page's own FAQ already explicitly declines to publish expected-size numbers or promise permanence ("لا تُنشر قياسات نتائج محددة هنا") and defers to individual consultation; the article's job is the *experience/outcomes* framing (500+ cases, since 2018) that a candidacy-and-consent-framed service page shouldn't carry as its main content. Different register, same honesty standard, no overlap in what each is trying to be.
- **Internal link direction:**
  - Article → service: primary CTA to `/ar/male-aesthetics/penile-girth-enhancement`.
  - Service → article: **a ready-made slot already exists and is the cleanest match in the whole first wave.** The service page's FAQ item "كم مقدار الزيادة في الحجم يمكن أن أتوقعه؟" already has `readMoreHref: "/insights/how-much-girth-can-penile-filler-add"` — swap that one link to the new Arabic article once built.
- **Priority:** P1 — flagship procedure, highest strategic value.

## Backlog (wave 2+ candidates — do not build yet)

These surfaced as genuine, validated search intent during research but should wait until the first wave is live, indexed, and (ideally) showing measurable engagement — consistent with the brief's "no 20 thin articles" instruction:

| Working title | Primary query | Target page | Why it waits |
|---|---|---|---|
| هل دوالي الخصية تسبب تأخر الإنجاب؟ | هل دوالي الخصية تسبب العقم | `/ar/male-fertility/varicocele` | P2 cluster; no directly-adaptable EN article currently exists — would need new clinical drafting/review, unlike the first wave |
| متى تحتاج دوالي الخصية إلى جراحة؟ | متى تحتاج دوالي الخصية إلى جراحة | `/ar/male-fertility/varicocele` | Same as above; also close in scope to the article above — risk of splitting one intent into two thin articles instead of one solid one |
| ما الفرق بين زيادة سماكة القضيب وتكبير القضيب؟ | تكبير القضيب مقابل زيادة سماكة القضيب | `/ar/male-aesthetics/penile-girth-enhancement` | Validated as genuinely useful (the terminology distinction is real and already handled correctly on-page, per §5's validation note — this article would deepen that distinction, not fix a gap), but overlaps with first-wave article #6 above — sequence it second, once #6's real performance is visible |
| فيلر القضيب: الفرق بين زيادة السماكة وتصحيح المشاكل | فيلر القضيب مشاكل | `/ar/male-aesthetics/penile-filler-correction` | The intent-differentiation this would support is **already correctly in place on-page** (validated — see `docs/r10-arabic-seo-research.md` §6.3), so this is a nice-to-have depth piece, not a fix for anything broken |
| ما أسباب سرعة القذف؟ | أسباب سرعة القذف | `/ar/sexual-medicine/premature-ejaculation` | P1 page, but no directly-adaptable EN article exists; the service page's own FAQ block may already be sufficient without a separate article |

## Explicitly rejected / deferred ideas

- **A dedicated `/ar/insights` hub now:** Rejected for this wave. The brief is explicit that an empty or thin Arabic Insights hub must not be created. With only 6 articles, the right home for them is inline linking from their respective P1 service pages (mirroring how `RelatedTreatments`/`InsightsSection` already work on the English side) — the same pattern the existing `InsightsSectionAr.tsx` component already uses to honestly disclose English-only content today. Revisit a dedicated `/ar/insights` hub once the article count is large enough (roughly 10+) to justify a genuine landing page rather than a stub.
- **Literal translation of all ~24 EN articles:** Rejected per the brief. Most of the EN library's penile-filler mechanics articles (settling time, migration, nodules, dissolution, feel-between-patients) are valuable but represent incremental depth on one already-served topic (girth enhancement/filler) rather than new search-intent coverage — a wave-3+ consideration at most, not first-wave.
- **Any article whose title uses "تكبير القضيب" as the primary keyword:** Rejected. Per the Cluster 10 findings (validated against the live page, see research doc §1), this term's SERP is dominated by overpromising content; adopting it as a primary title would associate the practice with that content category rather than differentiating from it. It belongs only inside body copy/FAQ framing that explicitly clarifies what is and isn't claimed — exactly as the service page itself already does.

## Sequencing recommendation

Build in this order, each gated on the previous one shipping cleanly (schema, canonical, sitemap, internal links verified per Phase G/H of the brief):

1. Venous leak / Doppler article (#1) — supports the cluster with the least competition, has a ready-made service-page link slot
2. Testosterone–ED relationship article (#4) — gives the cross-cutting P1/P1 topic a dedicated home before it needs one
3. Penile implant "when considered" (#2) and inflatable-vs-malleable comparison (#3) — natural pair, same target page, both have ready-made FAQ link slots
4. Girth-enhancement experience article (#6) — flagship procedure, highest strategic value, and has the cleanest existing link slot of the whole wave
5. Peyronie's assessment-timing article (#5) — P2, lowest urgency, and the only one needing a net-new FAQ link rather than a swap

Only after these six are live, indexed (verified via Search Console), and internally linked should the wave-2 backlog or a dedicated `/ar/insights` hub be reconsidered.
