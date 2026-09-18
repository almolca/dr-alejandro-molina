# R10 — Arabic SEO Growth: Research Package

**Status: Phase 1 (research) deliverable — STOP POINT 1.** No page content, metadata, schema, or internal links have been changed. This document, plus `docs/r10-arabic-seo-keyword-map.md` and `docs/r10-arabic-content-roadmap.md`, are for owner review and approval before any implementation begins, per the brief's Phase A instruction.

Branch: `feat/r10-arabic-seo-growth` (created from a freshly fast-forwarded `main` — see note below).

## 0. A repo-state issue found and fixed before research began

Local `main` was one commit behind `origin/main` / Production (missing `f3df684`, "complete Arabic localization and direct NMC booking funnel" — the commit that actually built all 19 Arabic pages). Local `main` only had the R9 Phase A "homepage pilot" commit. This was a clean fast-forward (local `main` was a pure ancestor of `origin/main`, no divergent local commits), so it was safe to sync before branching. `feat/r10-arabic-seo-growth` is now correctly based on the real, 19-page-complete production state — the brief's description of current Arabic production state is accurate; only the local checkout was stale.

---

## 1. Arabic Keyword Research (Phase 1)

Full cluster-by-cluster detail, sourcing, and priority is in **`docs/r10-arabic-seo-keyword-map.md`** (15 clusters). Headline findings:

- **The seed terms in the brief are, on the whole, well-chosen** — live SERP research validated nearly all of them as real, natural, medically-appropriate search phrasing rather than dictionary translations.
- **Two seed terms are secondary variants, not primary targets**, based on real usage evidence:
  - `شد كيس الصفن` (brief's seed) — the more common real-world phrasing is `شد الصفن`, which is what the site already uses. No change needed; keep the seed term only as a natural secondary synonym.
  - `تصحيح فيلر القضيب` (brief's seed) vs. the glossary's `تصحيح حشو القضيب` — both are used in the wild; the glossary term is already live on the page and is fine to keep. Not a naturalness problem, just worth noting the brief and the glossary independently arrived at slightly different phrasings for the same page.
- **One high-volume seed-adjacent term is a genuine trap: `تكبير القضيب`.** It has materially higher generic search volume than `زيادة سماكة القضيب`, but its SERP is dominated by overpromising, non-rigorous commercial content (unproven stretching devices, vague "surgical enlargement" claims, conflated length+girth promises). The site's existing precise term is correct and should stay primary; `تكبير القضيب` is only safe to use informationally, inside body copy/FAQ, specifically to *contrast* with what the practice does and does not claim. Full reasoning in keyword-map Cluster 10.
  **Validation-pass update: the live page already does this correctly today.** Direct source reading of `/ar/male-aesthetics/penile-girth-enhancement` confirms `تكبير القضيب` is already used, exactly as recommended, only as a generic descriptor inside body copy — never in the title or H1, which stay `زيادة سماكة القضيب`/`زيادة سماكة القضيب بحمض الهيالورونيك`. Examples found: the hero intro ("نهج طبي متخصص لتكبير القضيب"), the surgical-options paragraph ("لا تُطرح الخيارات الجراحية لتكبير القضيب إلا حيث تكون معتمدة…"), and the male-aesthetics hub's flagship section ("تكبير القضيب بحمض الهيالورونيك هو نقطة البداية الأكثر مناقشة"). The FAQ item "كم مقدار الزيادة في الحجم يمكن أن أتوقعه؟" also already declines to publish a number and defers to individual consultation, and the page's `PullQuote` states results "لا تُوعَد بها مسبقًا أبدًا" (never promised in advance) — matching the brief's "no guaranteed outcomes" rule exactly. **No on-page change is needed for this item; it's confirmed-correct current practice, not a gap.** The one open opportunity is the wave-2 content-roadmap article that addresses the `تكبير القضيب` vs. `زيادة سماكة القضيب` distinction head-on as its own piece of content (see the content roadmap), which is a new-content decision, not an on-page fix.
- **No meaningful GCC dialectal divergence was found.** Saudi- and Kuwait-hosted competitor content uses the same Modern Standard Arabic clinical terminology as UAE content across every cluster tested. GCC secondary relevance is a matter of the existing UAE-targeted pages ranking regionally (plausible), not a case for separate dialect content.
- **Local geographic modifiers earn their place unevenly.** "أبوظبي" belongs in titles/H1s for clearly local-commercial clusters (ED, implant, physician-discovery, aesthetics) because real competitor SERPs already title pages this way. It does not belong forced into purely informational/diagnostic clusters (Doppler mechanics, hormone symptom lists, "does X cause infertility") where the dominant real phrasing nationally/regionally is geography-free. "مدينة خليفة" has negligible standalone search volume — useful as a supporting NAP mention near the NMC Royal Hospital reference, not as a title anchor.

## 2. Competitor / SERP Analysis (Phase 2)

Investigated live (via WebSearch/WebFetch, not assumed): Cleveland Clinic Abu Dhabi, NMC (the practice's own hospital group), Burjeel/Burjeel Medical City, Mediclinic Airport Road Hospital, Sheikh Shakhbout Medical City (SSMC), Reem Hospital, Healthpoint, Novomed, Emirates Hospitals, Tajmeels, Doctors Clinic Dubai, plus the generic Arabic health-portal layer (WebTeb, Altibbi, Vezeeta, Al Jazeera Health) and a long tail of Egypt/Jordan/Turkey-based individual-andrologist content-marketing sites.

Key patterns, by competitor type:

| Competitor type | Pattern found | Implication |
|---|---|---|
| **Large hospital groups** (Cleveland Clinic AD, NMC, Burjeel) | Either broad institutional specialty hubs (e.g., CCAD's "عيادة طب الذكورة" — comprehensive but generalist, 20+ conditions on one page) or thin translated "health-library" articles (CCAD's ED and vasectomy Arabic pages are general informational content, not localized commercial landing pages) | High domain authority, but genuinely shallow on a per-procedure basis. A dedicated, deep, procedure-specific Arabic page can out-structure them without needing to out-authority them. |
| **Mid-size private hospitals** (Mediclinic, Reem, SSMC) | Dedicated, geo-titled service pages (e.g., Mediclinic's "علاج ضعف الانتصاب في أبوظبي") with simple Cause/Diagnosis/Treatment structure, **no FAQ**, moderate depth | The most direct commercial competitors. Beatable on content depth + FAQ schema + structured data, which they largely lack. |
| **Aggressive multi-branch cosmetic/urology chains** (Novomed, Tajmeels, Emirates Hospitals) | High-volume generic terms ("تكبير القضيب"), commercial, sometimes overpromising | Own the broad/loose search terms; not worth competing head-on for those terms. Real opportunity is differentiating on clinical honesty (see Cluster 10 in the keyword map). |
| **Generic Arabic health portals** (WebTeb, Altibbi, Vezeeta) | Own nearly all bare informational queries (symptoms, causes) nationally/regionally | Not a realistic head-to-head target for a single-physician site. The realistic play is FAQ blocks + selected Insights articles capturing long-tail phrasing with clinical + local specificity, not the head term. |
| **Individual-doctor content marketers** (Egypt/Jordan/Turkey-based, e.g., drzaazaa.com, dryaman.com, darelzokora.com) | High volume of well-optimized, SEO-native articles on almost every cluster (implant types, filler safety, enlargement methods) | These are the most SEO-sophisticated single-practitioner competitors globally, but none has UAE/GCC local relevance — an opening for a genuinely local, credentialed page to win Abu Dhabi/GCC-qualified traffic even where these sites outrank on the bare global term. |

**Notable specific finding:** Cleveland Clinic Abu Dhabi — the strongest single local authority competitor — titles its Arabic implant page **"الغريسات القضيبية"**, a less natural, less-searched variant than the site's own owner-approved `دعامة القضيب`. This is a genuine terminology-quality edge over the toughest local competitor and should not be diluted.

**Clearest content-gap finding:** no major competitor has a dedicated, Abu-Dhabi-titled Penile Doppler / venous-leak landing page. The best comparable page nationally (Doctors Clinic Dubai) is Dubai-titled. `/ar/erectile-dysfunction/penile-doppler` — already the single most technically detailed page on the Arabic site per the on-page audit — is well-positioned here with no direct local rival.

## 3. Keyword Cluster Map (Phase 3)

See **`docs/r10-arabic-seo-keyword-map.md`** — 15 clusters, each with primary/secondary Arabic terms, English meaning, intent, geographic-modifier guidance, target URL, priority (P1/P2/P3), cannibalization risk, and sourced notes.

## 4. Existing-Page Mapping (Phase 4)

All 15 procedure/condition clusters map to an **existing** Arabic page — no new commercial landing page is needed anywhere in this research. This matches the brief's own Phase 4 hypothesis exactly (ED→`/ar/erectile-dysfunction`, Doppler→`/ar/erectile-dysfunction/penile-doppler`, etc.) and the on-page audit confirms every one of those 19 target URLs already exists, is live, and is in the sitemap. The only unmapped brief seed cluster is physician/specialty discovery, which correctly maps to `/ar` + `/ar/about` (not a treatment page).

## 5. On-Page SEO Audit (Phase 5)

A full page-by-page audit (title, meta description, H1, heading hierarchy, exact Arabic terminology used, FAQ content, internal links, structured data, breadcrumbs, image alt text, content depth) was completed for all 19 Arabic pages plus the shared SEO infrastructure (`routes.ts`, `metadata.ts`, `json-ld.ts`, `sitemap.ts`) and cross-checked against the terminology glossary. The full page-by-page findings are preserved in this session's working notes; the material findings that affect the R10 strategy are below.

### 5.1 Terminology quality: high, with one confirmed defect

- **No glossary violations found anywhere** on the 19 pages — every superseded term (`الغرسة القضيبية`, bare `زراعة القضيب`, the old malleable adjective) is correctly absent; all owner-decided implant terminology, girth-enhancement vocabulary, and filler-complication vocabulary is used consistently and exactly as documented.
- **One real, fixable inconsistency — SHBG spelling.** Confirmed via direct grep, two spellings exist in exactly two files:
  - **"الغلوبيولين الرابط للهرمونات الجنسية (SHBG)"** — `docs/arabic-medical-glossary.md` row 61, and `src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx:51` (the actual clinical page where the term is explained in technical depth as part of the hormone panel).
  - **"الغلوبولين الرابط للهرمونات الجنسية (SHBG)"** (missing the extra ي after غلوب) — `src/components/sections/ar/SexualHormonalHealthSectionAr.tsx:15`, rendered on the homepage as one line in a pillar list. This spelling traces back to the earlier R9 Phase B0 homepage-parity plan, which predates the glossary's own Batch 2 entry for this term.
  - **Recommended canonical spelling: "الغلوبيولين الرابط للهرمونات الجنسية (SHBG)"** — i.e., keep the glossary's existing entry unchanged, and fix the homepage component to match it, not the other way around. Rationale: (1) it's already the documented canonical entry in `docs/arabic-medical-glossary.md`; (2) it's used on the page where the term actually carries clinical weight (the full hormone-panel explanation), so that page's spelling should anchor the standard, not a passing homepage mention; (3) "غلوبيولين" (retaining the extra ي) is also the more standard rendering pattern in Arabic medical usage generally (compare "غلوبيولين مناعي" for immunoglobulin), which further supports keeping the glossary's existing choice rather than changing it to match the homepage. As with the rest of the glossary, this should still get the native-speaker QA pass the glossary itself already flags as outstanding before Production.
  - **This is a documentation/consistency correction, not a new glossary decision** — no other row in the glossary is affected, and no other page uses either spelling.

### 5.2 Structured data: FAQPage and MedicalWebPage are solid; Person/Physician schema — CORRECTED after validation pass

**This section originally stated "Physician/Person schema is missing sitewide." That was wrong, and has been retracted.** The error: the initial on-page audit only grepped individual `page.tsx` files for direct calls to `personSchema()`/`physicianSchema()`. It never traced the render tree up through the shared root layouts. `personSchema()` and `physicianSchema()` are in fact called exactly once, in `src/components/layout/RootProviders.tsx`, which both `src/app/(en)/layout.tsx` and `src/app/(ar)/layout.tsx` wrap every one of their pages in — by design, per the component's own code comment: *"Person/Physician JSON-LD is locale-invariant (same entity, never duplicated data — spec §10): sharing it identically across the (en) and (ar) roots is correct, not just convenient."* No individual Arabic page ever calls these functions directly because none of them need to — the shared layout already does it for all of them.

**Verified against live Production HTML** (not just source), via direct `curl` + `grep` on the raw response — WebFetch was tried first and unreliable here since it converts HTML to Markdown before analysis, which strips `<script>` tags entirely and produced a false "0 scripts found" on every URL tested:

| Route | ld+json blocks | `@type` values present |
|---|---|---|
| `/` | 2 | Person, Physician |
| `/about` | 3 | Person, Physician, BreadcrumbList |
| `/ar` | 3 | Person, Physician, FAQPage (3 Q&A) |
| `/erectile-dysfunction` | 5 | Person, Physician, BreadcrumbList, MedicalWebPage/MedicalCondition, FAQPage (5 Q&A) |
| `/ar/erectile-dysfunction` | 5 | Person, Physician, BreadcrumbList, MedicalWebPage/MedicalCondition, FAQPage (5 Q&A) |
| `/ar/about` (additionally checked) | 3 | Person, Physician, BreadcrumbList |

**Finding, corrected: Person and Physician JSON-LD are present on every public page tested, in both languages, exactly once each (no duplication), matching the R9 verification the owner described.** The Arabic and English roots render identical Person/Physician entities, which is the clinically and technically correct approach (it's the same physician regardless of the page's language) and requires no change.

Two smaller, still-accurate findings from the original audit stand:

- `medicalWebPageSchema` is applied on every treatment/condition page with `inLanguage: "ar"`, typed `aboutType`, and an English `aboutName` taxonomy value — except:
  - `/ar/mens-health/vasectomy`, whose `medicalWebPageSchema` **and** `breadcrumbSchema` both omit `inLanguage`, and whose `aboutName` is (uniquely) an Arabic string rather than the English taxonomy label every other page uses.
  - `/ar/book` and `/ar/privacy`, whose `breadcrumbSchema` also omits `inLanguage` (lower stakes — neither is a medical-content page).
  - `/ar/male-aesthetics` (hub), whose `medicalWebPageSchema` omits `aboutType`/`aboutName` entirely.
  - `/ar/mens-health` and `/ar/sexual-medicine` (hubs) don't call `medicalWebPageSchema` at all, while `/ar/male-fertility` and `/ar/male-aesthetics` (also hubs) do — an inconsistent pattern across hub pages, not a deliberate policy.
- The sitemap's hreflang block doesn't emit `x-default` (only the per-page `<head>` metadata does) — a minor inconsistency, not a functional bug.

**No Physician/Person schema work is needed or recommended.** Any future edit to `RootProviders.tsx` would affect both languages simultaneously and risks duplicate entities if done carelessly — there is no reason to touch it as part of R10. The `medicalWebPageSchema`/`breadcrumbSchema` `inLanguage` gaps above are the only remaining structured-data items worth a mechanical fix once Phase 6 is approved.

**Methodology note for future audits:** verify structured data (and similar cross-cutting concerns) against the actual render tree — including shared layouts/providers — or against live rendered HTML, not by grepping individual route files alone. This is now the correct precedent for how this kind of claim should be checked going forward.

### 5.3 A real navigation defect: breadcrumbs pointing into English mid-Arabic-browse — confirmed, with exact fix options

Confirmed directly in source (`breadcrumbItems` arrays), not just the audit summary:

- **`/ar/penile-implant`**: breadcrumb chain is "الرئيسية" (`/ar`) → **"جراحة القضيب" (`/penile-surgery`)** → "جراحة زراعة دعامة القضيب" (current page).
- **`/ar/peyronies-disease`**: breadcrumb chain is "الرئيسية" (`/ar`) → **"جراحة القضيب" (`/penile-surgery`)** → "مرض بيروني" (current page).
- **Problematic destination**: `/penile-surgery` is an English-only route — `routes.ts` has no `arPath` for it, and no `/ar/penile-surgery` file exists anywhere in `src/app/(ar)`. A reader on either Arabic page who clicks the middle breadcrumb crumb is dropped into English mid-navigation, with no warning (unlike the site's FAQ "read more" links to English Insights articles, which are honestly labeled "(مقال بالإنجليزية)").
- **This was a known, consciously deferred gap, not an oversight** — both files carry an explicit code comment: `/* Breadcrumb parent stays the English /penile-surgery route — never built in any R9 Phase B batch, out of this phase's scope entirely (not just "later batch"). Label is still Arabic. */`. The R9 team already flagged it; R10 is simply the first phase where fixing it is actually in scope.

**Recommended fix — two options, owner decision needed:**

1. **(Lower-effort, recommended for R10)** Reparent both pages' breadcrumb to skip the missing hub: "الرئيسية" (`/ar`) → current page, a 2-level trail instead of 3. This is not a downgrade — `/penile-implant` and `/peyronies-disease` are already flat, top-level URLs in `routes.ts` (not nested under `/penile-surgery/...`), so a 2-level Arabic breadcrumb would actually match the real URL structure more closely than the current 3-level one does. Zero new pages, `breadcrumbSchema` updated to match, no English exposure.
2. **(Full parity, larger scope)** Build a genuine `/ar/penile-surgery` hub page mirroring the English one, add its `arPath` to `routes.ts`, and keep the 3-level breadcrumb as-is once it points to a real Arabic page. This would become the Arabic site's 20th page and is a legitimate future enhancement, but it's new-page scope beyond "optimize existing pages," so it shouldn't be assumed as part of Phase 6 without explicit sign-off.

This document does not choose between the two — that's the owner's call — but flags option 1 as the one consistent with R10's "improve existing pages, don't create new pages unless justified" framing.

### 5.4 Content depth is uneven — some P1/P2 pages are thinner than their traffic potential warrants

Per the audit, thin pages are: `/ar/sexual-medicine` (hub — no real body prose, just a 4-item link list duplicating its own children), `/ar/male-aesthetics/scrotal-lift` (no images, no risk breakdown), `/ar/male-fertility/varicocele` (no images, no numbered lists), and `/ar/peyronies-disease` (no risk section, no candidacy checklist). Richest pages are `/ar/mens-health/vasectomy` (14-item FAQ), `/ar/erectile-dysfunction` + `/ar/erectile-dysfunction/penile-doppler` (deepest clinical explainers), `/ar/mens-health/testosterone` (10-item FAQ), and `/ar/male-aesthetics/penile-girth-enhancement` (richest single page site-wide). This unevenness doesn't track cleanly with the brief's suggested P1/P2/P3 list — see §7 below.

## 6. Cannibalization Assessment — CORRECTED after validation pass

**The original version of this section over-called cannibalization from keyword/phrase repetition alone, without checking title/H1/primary intent/target query per page.** On direct re-reading of the actual page source (not just the audit's heading-level summary), neither of the two "confirmed" cases from the first pass survives scrutiny as true cannibalization. Both are corrected below, with the actual comparison data the re-check was built on.

### 6.1 "زيادة سماكة القضيب" cluster — RETRACTED, not cannibalization

Direct comparison of all four pages' title, H1, primary intro, and dominant intent:

| Page | Title tag | H1 | Primary intro | Dominant intent | Target query it's actually built for |
|---|---|---|---|---|---|
| `/ar` | "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة، أبوظبي" | "د. أليخاندرو مولينا" | "رعاية متخصصة في الطب الجنسي، والصحة الهرمونية للرجال، وجراحة القضيب، والتجميل الذكوري، مع خبرة خاصة في زيادة سماكة القضيب." | Physician/practice discovery (whole-practice overview, 10 sections spanning every service line) | Cluster 1 (طبيب ذكورة أبوظبي / physician discovery) |
| `/ar/about` | "نبذة عنّا" | "د. أليخاندرو مولينا" | "تدريب أوروبي. خلفية جراحية. تركيز متخصص على صحة الرجل." | EEAT/credential/biography (career timeline, credentials, publications) | Branded/credential-verification queries, not a procedure term |
| `/ar/male-aesthetics` | "التجميل الذكوري" | "التجميل الذكوري" | "رعاية تجميلية للقضيب والصفن بإشراف استشاري، تجمع بين تشريح متخصص في المسالك البولية، وخبرة إجرائية، وتخطيط علاج فردي." | Category hub for the male-aesthetics sub-vertical (girth + scrotal lift + filler correction) | Cluster 13 (التجميل الذكوري, a category term) |
| `/ar/male-aesthetics/penile-girth-enhancement` | "زيادة سماكة القضيب بحمض الهيالورونيك" | "زيادة سماكة القضيب" | "نهج طبي متخصص لتكبير القضيب، مع تخطيط علاجي قائم على التشريح والأهداف والتوقعات الواقعية." | The procedure itself — full candidacy/options/pathway/risk/10-item FAQ | Cluster 10 (زيادة سماكة القضيب — the actual procedure query) |

**Only one of the four pages has "زيادة سماكة القضيب" as its title and H1: the target page itself.** The other three each have their own distinct title, H1, and primary intent (physician discovery, biography, aesthetics category) and mention the flagship procedure exactly once each, as a named pointer with the anchor text "استكشف زيادة سماكة القضيب" linking to the one canonical page. Using a link's actual destination topic as its anchor text is correct, recommended internal-linking practice — it is the opposite of cannibalization, not a milder version of it. The homepage's flagship-procedure section and the hub's flagship section both exist specifically to funnel visitors and link equity toward the one procedure page, which is exactly what a flagship service is supposed to get from its parent pages.

The recurring true fact "500+ procedures, since 2018" appears on both `/ar/male-aesthetics` (via `AuthorityBlock`) and the girth-enhancement page (via `PhysicianAuthority` plus the hero's `flagshipMetrics`) — this is standard trust-signal repetition (the same way "FEBU" or "15+ years" recur across pages), not duplicate content in any SEO-penalizable sense, since it's a short factual credential, not substantial body prose. No action needed.

**Verdict: no rewrite, no de-emphasis, no restructuring required anywhere in this cluster.** The pattern found is textbook hub/home → flagship-spoke linking, functioning as intended.

### 6.2 ED vs. Penile Doppler — RETRACTED, not cannibalization

Direct line-by-line comparison of both pages' actual body copy (not just section headings):

| | `/ar/erectile-dysfunction` | `/ar/erectile-dysfunction/penile-doppler` |
|---|---|---|
| Title / H1 | "تقييم وعلاج ضعف الانتصاب" | "دوبلر القضيب — تقييم متقدم لضعف الانتصاب" / "دوبلر القضيب" |
| Primary intro | "يُختار العلاج وفقًا للسبب الكامن والتاريخ المرضي والأولويات الفردية…" | "تقييم بالموجات فوق الصوتية لتدفق الدم في القضيب، يُستخدم كجزء من التقييم المتقدم لضعف الانتصاب…" |
| Vascular-mechanism content | One "الجانب الوعائي لضعف الانتصاب" section, **3 short cards (~40–60 words each)**: القصور الشرياني، الخلل الوظيفي في الانسداد الوريدي، أنماط وظيفية غير بنيوية — presented as 1 of 7 total cause categories (alongside hormonal, metabolic, neurological, medication, psychosexual, pelvic/structural) | The entire subject of the page: dedicated sections for "ضعف الانتصاب الشرياني" (with a 7-item risk-factor list and PSV explanation), a 3-paragraph "التسرب الوريدي أكثر تعقيدًا مما يبدو" deep-dive, three annotated waveform-pattern comparisons, a PSV/EDV explainer, a 10-factor "context matters" list, and 7 interpretation principles |
| Cross-linking | Explicitly links to the Doppler page inline ("يُعد دوبلر القضيب وسيلة التمييز العملية بين هذه الآليات") and to an English Insights article "لمزيد من التفصيل حول إحداها تحديدًا" | Links back to `/ar/erectile-dysfunction` via `RelatedTreatments`, plus its own English Insights article for the venous-leak deep dive |
| FAQ overlap | 5 items, general (is ED always physical, do I need an implant, what is Doppler, testosterone link, booking) | 11 items, all diagnostic-test-specific (do I need this test, what's involved, arterial ED, venous leak, EDV interpretation, anxiety's effect, masturbation-vs-partner erections, etc.) — **zero question overlap with the ED page's FAQ** |

**The two pages necessarily name the same two underlying vascular mechanisms (arterial insufficiency, veno-occlusive dysfunction/venous leak), because both are legitimately about them at different levels of the same clinical picture — that is unavoidable and correct, not duplication.** What actually differs is depth and purpose: the ED page gives each mechanism a single compact paragraph as one of seven possible causes of the broader condition; the Doppler page is built entirely around explaining, illustrating, and diagnostically interpreting those same two mechanisms in detail. This is exactly the hub-owns-overview / spoke-owns-diagnostic-depth split the brief itself asks for, and it is already implemented correctly, including the explicit inline hand-off link from the hub to the spoke.

**Verdict: sections should remain as they are.** No shortening, no further differentiation, and specifically — per the correction request — **no weakening of the ED page's vascular-cause content merely to create artificial SEO separation.** The one-paragraph mention of each mechanism on the ED page is doing its job (giving a complete cause picture) and is already appropriately brief next to the Doppler page's specialist depth.

### 6.3 Filler-correction vs. girth-enhancement — confirmed not cannibalization (unchanged from first pass)

`/ar/male-aesthetics/penile-girth-enhancement` and `/ar/male-aesthetics/penile-filler-correction` intentionally cross-link (a "خبرة في التصحيح" pillar, and a girth-page FAQ item — "ماذا لو كانت لدي تجربة سيئة مع الحشو في مكان آخر؟" — that routes directly to the correction page). This is appropriate: they serve genuinely different real-world intents (getting the procedure for the first time vs. fixing a prior one done elsewhere, including elsewhere-performed procedures) — see keyword-map Cluster 11. Each page's title/H1/opening line already makes its own intent unambiguous. No change needed.

### 6.4 `/ar/sexual-medicine` hub — reclassified as a content-thinness finding, not cannibalization

On reflection, this was mis-filed as a cannibalization risk in the first pass. Its title/H1 ("الطب الجنسي") is a broader category term, distinct from its children's specific titles ("ضعف الانتصاب", "سرعة القذف") — there is no shared primary target query, so this is not cannibalization by the working definition used above (two or more indexable pages genuinely targeting the same primary intent). The real issue is quality/depth: the hub's body is a bare 4-item link list with one-line descriptions and no independent overview prose, making it a weaker page in its own right and a weaker link in the internal-linking graph than it could be. This belongs with the other thin-page findings in §5.4, addressed as a content-quality improvement in Phase 6, not as a de-duplication exercise.

### Summary

No page in this research requires content to be shortened, removed, or restructured to resolve a cannibalization problem — **there is no confirmed cannibalization anywhere in the current 19-page Arabic site.** The only Phase 6 work implied by this section is the ordinary kind: add genuine overview prose to thin hub pages (§5.4/§6.4), which is a content-quality improvement, not a competing-intent fix.

## 7. Terminology / Glossary Observations

- The existing `docs/arabic-medical-glossary.md` is high-quality and, per the audit, **followed correctly almost everywhere** — this is a strong foundation, not something R10 needs to rebuild.
- Live SERP research **independently corroborates** the two hardest owner terminology calls already made: `دعامة القضيب` over `الغرسة القضيبية`/`زراعة القضيب` (Cluster 6), and the site's disciplined use of `زيادة سماكة القضيب` over the SERP-dominant but clinically loose `تكبير القضيب` (Cluster 10).
- Two brief seed terms are better treated as secondary synonyms than primary changes (`شد كيس الصفن`, and the filler-correction phrasing) — see §1.
- One glossary-adjacent defect found and documented: the SHBG spelling inconsistency (§5.1).

## 8. Content-Gap Analysis & Arabic Insights Roadmap (Phases 9–10)

Full detail in **`docs/r10-arabic-content-roadmap.md`**. Summary: the English Insights library (~24 articles) already contains several owner-approved articles that map 1:1 onto P1 Arabic service pages. Rather than inventing new topics or translating the whole library, the recommended first wave is **6 articles, each adapted (not literally translated) from an existing approved EN article**, each targeting one validated Arabic query cluster, each linking to exactly one P1 service page:

1. Venous leak / what Doppler really shows → `/ar/erectile-dysfunction/penile-doppler`
2. When is a penile implant the right option → `/ar/penile-implant`
3. Inflatable vs. malleable implant comparison → `/ar/penile-implant`
4. Testosterone–ED relationship (resolves the Cluster 2/5 overlap by giving it a dedicated home) → `/ar/mens-health/testosterone`
5. When to seek Peyronie's assessment → `/ar/peyronies-disease`
6. Girth-enhancement real-world experience (500+ procedures) → `/ar/male-aesthetics/penile-girth-enhancement`

A dedicated `/ar/insights` hub is **not recommended yet** — 6 articles don't justify one, and the existing `InsightsSectionAr.tsx` component already has an honest, deliberate pattern (explicitly disclosing "these articles are currently English-only") that can be extended once real Arabic articles exist, rather than needing to be replaced.

## 9. Recommended Implementation Sequence

Matches the brief's Phase A–H structure, adjusted for what the research actually found:

- **Phase B (on-page audit)** — effectively done by this research pass; findings above are ready to act on once approved. Corrected after validation: this phase surfaced no cannibalization requiring rewrite and no schema gap requiring new Person/Physician work — both were false positives from the first pass (see §5.2, §6).
- **Phase C (optimize P1 pages)** — the brief's suggested P1 list (`/ar`, ED, Doppler, PE, testosterone, implant, girth-enhancement) holds up well against the research, with one addition worth owner consideration: **`/ar/sexual-medicine` hub** is thinner than its P3 placement suggests, given it's the direct parent of two P1 pages (ED and PE) — consider pulling it into the P1/P2 boundary rather than treating it as P3, specifically to add genuine overview prose (§6.4) alongside its children's work, not after. This is a content-depth improvement, not a de-duplication fix.
- **Phase D (P2/P3)** — no change to the brief's list; `/ar/male-fertility/varicocele`, `/ar/peyronies-disease`, and `/ar/male-aesthetics/scrotal-lift`'s thinness (§5.4) makes them reasonable to prioritize slightly earlier within P2 rather than last.
- **Phase E (internal linking + FAQ)** — no cannibalization-driven rework needed here (§6 confirmed the girth cluster and ED/Doppler pattern are both already correct hub/spoke structure). This phase's real work is the mechanical items below plus normal FAQ/internal-link polish per page.
- **Phase F (content-gap roadmap)** — delivered as `docs/r10-arabic-content-roadmap.md`, refined per this validation pass with explicit per-article intent/cannibalization/link-direction/source fields.
- **Phase G (first-wave articles)** — the 6 articles above, in the sequencing order given in the roadmap doc.
- **Phase H (QA + Preview)** — should include: the SHBG spelling fix (§5.1, homepage component only), the breadcrumb-parent decision for `/ar/penile-implant`/`/ar/peyronies-disease` (§5.3, two options for the owner to choose between), and the small `medicalWebPageSchema`/`breadcrumbSchema` `inLanguage` gaps (vasectomy, book, privacy, male-aesthetics hub) — all low-risk, mechanical fixes once approved. **No Person/Physician schema work belongs in this phase** — it's already correctly implemented sitewide via `RootProviders` and verified live; touching it is out of scope for R10.

## 10. What Requires Owner Approval Before Implementation

Per the brief's Stop Point 1, nothing below has been implemented. Updated after the validation pass:

1. Keyword clusters and priority (this doc + keyword map)
2. Competitor findings and positioning read (§2)
3. Search-intent mapping (keyword map, per cluster)
4. Target-URL mapping (§4 — no new pages needed)
5. Proposed on-page changes: thin-hub content additions (§5.4/§6.4), SHBG spelling fix (§5.1), breadcrumb-parent fix (§5.3, two options), and the minor structured-data `inLanguage`/`aboutType` gaps (§5.2) — **not** schema additions, and **not** any cannibalization-driven rewrite, both retracted per §5.2/§6
6. Proposed article roadmap (`docs/r10-arabic-content-roadmap.md`), refined with per-article validation fields
7. Confirmation that no true cannibalization exists in the current 19-page site (§6) — nothing to resolve, no sign-off needed on a fix that isn't happening
8. Terminology decisions (§7 — mostly confirming existing decisions, two minor secondary-synonym notes, SHBG canonical spelling)

**Awaiting approval to proceed to Phase B/C implementation.**
