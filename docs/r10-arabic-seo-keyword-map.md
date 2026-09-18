# R10 — Arabic SEO Keyword Cluster Map

Status: research deliverable (Phase 3). No page content has been changed yet.
Scope: UAE/Abu Dhabi primary, GCC (Saudi Arabia, Kuwait, Qatar, Bahrain, Oman) secondary.
Method: live SERP research (WebSearch/WebFetch, September 2026) against the seed terms in the R10 brief, cross-checked against `docs/arabic-medical-glossary.md` (owner-approved terminology) and the current route registry (`src/lib/seo/routes.ts`). Sources are cited inline per cluster.

Priority key: **P1** = optimize now, **P2** = optimize after P1, **P3** = light-touch / lower urgency. These match the brief's Phase 6 priority list; where research suggested a change, it's called out in Notes.

---

## Cluster 1 — Physician / Specialty Discovery (local, top-of-funnel)

| Field | Value |
|---|---|
| Primary Arabic keyword | طبيب ذكورة أبوظبي |
| Secondary variants | طبيب مسالك بولية أبوظبي، طبيب أمراض ذكورة أبوظبي، طبيب صحة الرجل أبوظبي، دكتور ذكورة الإمارات |
| English meaning | "Andrologist / urologist Abu Dhabi" |
| Intent | Local, decision-stage (choosing a doctor) |
| Geographic modifier | أبوظبي required in title/H1; مدينة خليفة optional, low search volume on its own |
| Target existing URL | `/ar` (home) + `/ar/about` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Low — home and about serve different sub-intents (home = specialty/procedure entry, about = credential/trust verification) provided about doesn't duplicate home's service list |
| Notes | SERP is dominated by aggregator/directory sites (altibbi, DoctorUna, HeliumDoc, Medigence, Vaidam) and hospital department pages (Cleveland Clinic Abu Dhabi, Burjeel, Mediclinic), not individual physician microsites — a credentialed, named-physician page with strong Physician/Person schema is comparatively rare in this SERP and a genuine differentiation opportunity. NMC's own directory listing for Dr. Molina (if any) is a same-brand asset, not a threat. "مدينة خليفة" alone returns almost no dedicated content — real local whitespace, but too low-volume to be a title anchor on its own; use as a supporting mention near NMC Royal Hospital – Khalifa City references instead. |

Sources: [Cleveland Clinic Abu Dhabi Andrology Clinic](https://www.clevelandclinicabudhabi.ae/ar-ae/institutes-and-specialties/integrated-surgical-institute/andrology-clinic-men-health), [Altibbi Abu Dhabi urology directory](https://altibbi.com/), [Burjeel Medical City — Dr. Ahmad Allam](https://burjeelmedicalcity.com/doctors/ahmad-allam/), [SSMC Men's Health](https://ssmc.ae/mens-health-at-ssmc/)

---

## Cluster 2 — Erectile Dysfunction (core commercial)

| Field | Value |
|---|---|
| Primary Arabic keyword | ضعف الانتصاب |
| Secondary variants | علاج ضعف الانتصاب، ضعف الانتصاب عند الرجال، علاج ضعف الانتصاب أبوظبي، أسباب ضعف الانتصاب عند الشباب، الفرق بين ضعف الانتصاب النفسي والعضوي |
| English meaning | Erectile dysfunction / ED treatment |
| Intent | Mixed: بدون geo modifier = informational/diagnostic; with أبوظبي = commercial/local |
| Geographic modifier | Natural and expected in title/meta ("… في أبوظبي") — this is the one cluster where competitors (Mediclinic) already title the page this way |
| Target existing URL | `/ar/erectile-dysfunction` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Low — validated directly against both pages' actual body copy (see `docs/r10-arabic-seo-research.md` §6.2): the ED page already gives each vascular mechanism one compact paragraph as 1-of-7 causes and explicitly hands off depth to the Doppler page inline; the Doppler page's FAQ has zero question overlap with the ED page's FAQ. Already correctly structured; no rewrite needed. |
| Notes | Mediclinic Airport Road's Arabic ED page (`علاج ضعف الانتصاب في أبوظبي`) is the direct commercial competitor: 3 plain H2s (Causes/Diagnosis/Treatment), **no FAQ**, moderate depth. A well-built FAQPage block + fuller causal breakdown (vascular vs. hormonal vs. psychological, matching the "نفسي vs. عضوي" query) beats it on depth and structured data without needing to compete on domain authority. |

Sources: [Mediclinic Airport Road — ED treatment](https://www.mediclinic.ae/ar/airport-road-hospital/services/erectile-dysfunction-ar.html), [Reem Hospital — ED](https://www.reemhospital.com/specialties/urology/erectile-dysfunction/), [ART Fertility Clinics — ED in young men](https://www.artfertilityclinics.com/uae/ar/blog/erectile-dysfunction-in-young-men)

---

## Cluster 3 — Penile Doppler / Venous Leak (diagnostic)

| Field | Value |
|---|---|
| Primary Arabic keyword | دوبلر القضيب |
| Secondary variants | فحص دوبلر القضيب، دوبلر القضيب أبوظبي، التسرب الوريدي، التسرب الوريدي للقضيب، متى أحتاج فحص دوبلر للقضيب |
| English meaning | Penile Doppler ultrasound / venous leak |
| Intent | Diagnostic/research-stage, moving toward commercial once venous leak is suspected |
| Geographic modifier | Optional — most real competitor content for this exact procedure is Dubai-based and not geo-titled; أبوظبي in title is genuine local whitespace |
| Target existing URL | `/ar/erectile-dysfunction/penile-doppler` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Low, provided venous-leak explanatory depth lives here and only a brief pointer exists on the parent ED hub |
| Notes | No Abu-Dhabi-specific dedicated Doppler landing page found among major competitors — Doctors Clinic Dubai has the most comprehensive one nationally, but it's Dubai-titled. This is the clearest geographic content gap in the whole research set: a genuinely Abu-Dhabi-titled, clinically deep Doppler + venous-leak page has essentially no direct local competitor. |

Sources: [Doctors Clinic Dubai — Penile Doppler](https://doctorsclinicdubai.ae/services/diagnostic-radiology/penile-doppler), [Altibbi — Penile Doppler injection Q&A](https://altibbi.com/), [Dar Al-Zokora — Venous leak](https://www.darelzokora.com/%D8%A7%D9%84%D8%AA%D8%B3%D8%B1%D8%A8-%D8%A7%D9%84%D9%88%D8%B1%D9%8A%D8%AF%D9%8A/)

---

## Cluster 4 — Premature Ejaculation

| Field | Value |
|---|---|
| Primary Arabic keyword | سرعة القذف |
| Secondary variants | علاج سرعة القذف، أسباب سرعة القذف، علاج سرعة القذف عند الرجال |
| English meaning | Premature ejaculation / PE treatment |
| Intent | Mostly informational nationally; commercial once narrowed to "علاج" + local |
| Geographic modifier | Optional; national health portals (WebTeb, Altibbi, Vezeeta) dominate the bare informational query — geo modifier helps differentiate for local commercial intent |
| Target existing URL | `/ar/sexual-medicine/premature-ejaculation` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Low vs. `/ar/sexual-medicine` hub, provided the hub stays a brief overview/menu |
| Notes | SERP is generic health-portal territory (WebTeb, Altibbi, Vezeeta, Saudi German Health) — largely informational, home-remedy-heavy content (beetroot, ginkgo, Kegel exercises). A clinically precise, non-sensational page with genuine treatment-pathway depth (behavioral, pharmacologic, topical) is a credibility upgrade over this SERP, not a head-to-head ranking fight for the bare term. |

Sources: [WebTeb — PE](https://www.webteb.com/man-health/diseases/%D8%B3%D8%B1%D8%B9%D8%A9-%D8%A7%D9%84%D9%82%D8%B0%D9%81), [Altibbi — PE](https://altibbi.com/), [International Clinics — PE](https://internationalclinics.com/ar/blog/%D8%B9%D9%84%D8%A7%D8%AC-%D8%B3%D8%B1%D8%B9%D8%A9-%D8%A7%D9%84%D9%82%D8%B0%D9%81/)

---

## Cluster 5 — Testosterone / Male Hormonal Health

| Field | Value |
|---|---|
| Primary Arabic keyword | نقص التستوستيرون |
| Secondary variants | التستوستيرون، نقص هرمون التستوستيرون، أعراض نقص التستوستيرون، ضعف هرمون الذكورة (colloquial secondary — see note) |
| English meaning | Testosterone deficiency / low T |
| Intent | Informational (symptoms) → commercial (treatment) |
| Geographic modifier | Not expected on the bare term; add only on the treatment-focused sections |
| Target existing URL | `/ar/mens-health/testosterone` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Medium — testosterone↔ED overlap is real in patient search behavior ("هل نقص التستوستيرون يسبب ضعف الانتصاب"); this page should own the hormonal-diagnostic depth (SHBG, LH/FSH, prolactin — already in the glossary), while `/ar/erectile-dysfunction` only cross-links to it as one possible cause |
| Notes | "ضعف هرمون الذكورة" is a real colloquial variant patients use, but every SERP for it converges back onto standard "نقص (هرمون) التستوستيرون" content — treat it as a natural body-copy/FAQ synonym, not a title/H1 target. Multiple sources are explicit that low testosterone alone rarely causes ED directly — this nuance itself is a strong FAQ candidate (`هل نقص التستوستيرون يسبب ضعف الانتصاب؟`) because it corrects a common patient misconception, which is exactly the kind of clinically honest content Google's medical-content guidelines reward. |

Sources: [Al Jazeera Health — Testosterone symptoms](https://www.aljazeera.net/health/2022/6/23/), [Mayo Clinic AR — Testosterone therapy](https://www.mayoclinic.org/healthy-lifestyle/sexual-health/in-depth/testosterone-therapy/art-20045728), [New York Urology Specialists — Low T and ED](https://www.newyorkurologyspecialists.com/ed/cause/hypogonadism/)

---

## Cluster 6 — Penile Implant

| Field | Value |
|---|---|
| Primary Arabic keyword | دعامة القضيب |
| Secondary variants | زراعة دعامة القضيب (per glossary: procedure = جراحة زراعة دعامة القضيب), عملية دعامة القضيب، دعامة قضيبية قابلة للنفخ، دعامة قضيبية مرنة، الفرق بين الدعامة القابلة للنفخ والمرنة |
| English meaning | Penile implant / prosthesis |
| Intent | Commercial, decision-stage — this is a considered-purchase query pattern (comparison, cost, "متى تكون مناسبة") |
| Geographic modifier | أبوظبي useful in title, not required in every heading |
| Target existing URL | `/ar/penile-implant` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Low |
| Notes | **Terminology already owner-decided** (see `docs/arabic-medical-glossary.md`) — `دعامة القضيب` primary, never `زراعة القضيب` (clinically ambiguous, reads as transplantation). Live-SERP validation supports this decision: general search results overwhelmingly use `دعامة القضيب` / `دعامة الانتصاب`, not `الغرسة القضيبية`. Notably, **Cleveland Clinic Abu Dhabi's own Arabic page is titled "الغريسات القضيبية"** — a less natural, less-searched variant. This is a genuine terminology-quality edge over the single strongest local authority competitor; do not weaken it. The "inflatable vs. malleable" comparison query has real informational demand and is a strong FAQ/article candidate (see content roadmap). |

Sources: [Cleveland Clinic Abu Dhabi — Penile Implants](https://www.clevelandclinicabudhabi.ae/ar-ae/health-hub/health-resource/treatments-and-procedures/penile-implants), [Dar Al-Zokora — implant shape](https://www.darelzokora.com/), `docs/arabic-medical-glossary.md` rows 51–57

---

## Cluster 7 — Peyronie's Disease

| Field | Value |
|---|---|
| Primary Arabic keyword | مرض بيروني |
| Secondary variants | انحناء القضيب، علاج انحناء القضيب |
| English meaning | Peyronie's disease / penile curvature |
| Intent | Informational → commercial once curvature interferes with function |
| Geographic modifier | Not required — national informational term |
| Target existing URL | `/ar/peyronies-disease` |
| New page needed? | No |
| Priority | **P2** |
| Cannibalization risk | Low |
| Notes | SERP is mostly Egypt/Jordan-based individual-doctor content and international references (Mayo Clinic AR, MSD Manual AR) — no strong UAE-specific competitor found. Content should clearly stage the options (observation → non-surgical → surgical → implant for end-stage) since that staged-decision structure is what real competitor content already uses and matches patient mental models. |

Sources: [Mayo Clinic AR — Peyronie's](https://www.mayoclinic.org/diseases-conditions/peyronies-disease/diagnosis-treatment/drc-20353473), [MSD Manual AR — Peyronie's](https://www.msdmanuals.com/ar/home/), [International Clinics — curvature correction](https://internationalclinics.com/ar/blog/)

---

## Cluster 8 — Male Fertility / Varicocele

| Field | Value |
|---|---|
| Primary Arabic keyword | دوالي الخصية |
| Secondary variants | علاج دوالي الخصية، خصوبة الرجل، تأخر الإنجاب عند الرجال، هل دوالي الخصية تسبب العقم، متى تحتاج دوالي الخصية لجراحة |
| English meaning | Varicocele / male fertility |
| Intent | Informational (cause/diagnosis) → commercial (surgery) |
| Geographic modifier | أبوظبي useful for the treatment-intent variant; not needed for the "does X cause infertility" informational variant |
| Target existing URL | `/ar/male-fertility/varicocele` (procedure-specific), `/ar/male-fertility` (broader hub) |
| New page needed? | No |
| Priority | **P2** |
| Cannibalization risk | Medium — `/ar/male-fertility` (hub) and `/ar/male-fertility/varicocele` (spoke) both plausibly rank for "خصوبة الرجل" if the hub over-details varicocele; hub should stay broad (semen analysis, hormonal eval, varicocele, obstruction — one paragraph each) and defer depth to the spoke |
| Notes | Sheikh Shakhbout Medical City (government hospital, strong domain authority) has a dedicated varicocele surgery page — the most credible Abu Dhabi competitor in this cluster. Real patient search includes a widely-cited "~40% of male infertility linked to varicocele" statistic and a grading-based surgical threshold (Grade III often needs intervention) — useful, verifiable framing for FAQ content once clinically confirmed by the owner. |

Sources: [SSMC — Varicocele surgery](https://ssmc.ae/doctors-specialities/surgery-for-testicular-varicoceles/), [Dr. Anas Al-Obaidi — Varicocele & infertility](https://www.dranasurologist.com/ar/post/varicocele-infertility-treatment-arabic), [ART Fertility Clinics UAE — Varicocele](https://www.artfertilityclinics.com/uae/ar/blog/varicocele-and-infertility-treatment-uae)

---

## Cluster 9 — No-Scalpel Vasectomy

| Field | Value |
|---|---|
| Primary Arabic keyword | قطع القناة المنوية |
| Secondary variants | قطع القناة المنوية بدون مشرط، قطع القناة الدافقة |
| English meaning | (No-scalpel) vasectomy |
| Intent | Commercial/decision-stage, lower volume than other clusters |
| Geographic modifier | Optional |
| Target existing URL | `/ar/mens-health/vasectomy` |
| New page needed? | No |
| Priority | **P3** |
| Cannibalization risk | Low |
| Notes | Cleveland Clinic Abu Dhabi has an Arabic vasectomy health-library page (translated general content, not a localized commercial page) — same pattern as their ED page. Lower-volume cluster overall; light-touch optimization is appropriate per the brief's own P3 placement. |

Sources: [Cleveland Clinic Abu Dhabi — Vasectomy](https://www.clevelandclinicabudhabi.ae/ar-ae/health-hub/health-resource/treatments-and-procedures/vasectomy), [Reem Hospital — Male sterilization](https://www.reemhospital.com/ar/health-hub/)

---

## Cluster 10 — Penile Girth Enhancement (flagship — special care)

| Field | Value |
|---|---|
| Primary Arabic keyword | زيادة سماكة القضيب |
| Secondary variants | زيادة محيط القضيب (validated natural synonym), حقن حمض الهيالورونيك للقضيب, تكبير القضيب (see note — do NOT use as primary) |
| English meaning | Penile girth enhancement (HA filler) |
| Intent | Commercial, but the broader "تكبير القضيب" umbrella term mixes in length-enhancement and unproven-device searches |
| Geographic modifier | أبوظبي useful in title |
| Target existing URL | `/ar/male-aesthetics/penile-girth-enhancement` |
| New page needed? | No |
| Priority | **P1** |
| Cannibalization risk | Low, by design — validated against actual page source (see `docs/r10-arabic-seo-research.md` §6.3). `/ar/male-aesthetics/penile-girth-enhancement` and `/ar/male-aesthetics/penile-filler-correction` (Cluster 11) both legitimately use "فيلر," but each page's title/H1/opening line already makes its own intent unambiguous (getting the procedure vs. fixing a prior one elsewhere), and they cross-link deliberately. No rewrite needed. |
| Notes | **This is the cluster the brief specifically flags for special care, and the research confirms why.** "تكبير القضيب" (generic "penis enlargement") is the higher-volume umbrella term, but it is dominated by aggressive, often overpromising commercial content (stretching devices claimed to give "permanent" length, vague "surgical" enlargement claims) with no consistent clinical rigor. "زيادة سماكة القضيب" / "زيادة محيط القضيب" (girth/circumference specifically) is the clinically precise term the site already uses correctly — real competitor content (e.g. Quartz Clinique, HE Clinics) confirms this is a recognized, distinct sub-term, not a synonym coined only by this site. **Recommendation: keep زيادة سماكة القضيب as the primary/title/H1 term.** **Validated: this is already exactly what the live page does today** — `تكبير القضيب` already appears only informationally in body copy (hero intro, surgical-options paragraph), never in title/H1, and the FAQ/PullQuote already decline to promise a specific size increase or permanence. No on-page change needed for this item; confirmed-correct current practice. |

Sources: [Quartz Clinique — girth vs. filler](https://www.quartzclinique.com/ar/%D8%B2%D9%8A%D8%A7%D8%AF%D8%A9-%D8%B3%D9%85%D8%A7%D9%83%D8%A9-%D8%A7%D9%84%D9%82%D8%B6%D9%8A%D8%A8), [HE Clinics — girth vs. length priorities](https://heclinics.com/ar/penis-girth-vs-length-patients-prioritize-most-2025/), [Dr. Zaazaa — enlargement methods 2026](https://www.drzaazaa.com/%D8%B7%D8%B1%D9%82-%D8%AA%D9%83%D8%A8%D9%8A%D8%B1-%D8%A7%D9%84%D9%82%D8%B6%D9%8A%D8%A8/), [Mayo Clinic AR — enlargement products](https://www.mayoclinic.org/healthy-lifestyle/sexual-health/in-depth/penis/art-20045363)

---

## Cluster 11 — Penile Filler Correction

| Field | Value |
|---|---|
| Primary Arabic keyword | تصحيح فيلر القضيب |
| Secondary variants | تصحيح حشو القضيب (current glossary term), مضاعفات فيلر القضيب، عقيدات الفيلر، انزياح الفيلر، إذابة الفيلر |
| English meaning | Correcting complications from prior penile filler |
| Intent | Commercial, but problem-driven (patient already has a prior procedure elsewhere and now has a complaint) — distinct from Cluster 10's "considering the procedure for the first time" intent |
| Geographic modifier | Optional |
| Target existing URL | `/ar/male-aesthetics/penile-filler-correction` |
| New page needed? | No |
| Priority | **P2** |
| Cannibalization risk | Low vs. Cluster 10, by design — **validated against actual page source**, not just assumed (see `docs/r10-arabic-seo-research.md` §6.3). This page's title ("تصحيح حشو القضيب"), H1, and opening line already lead with "prior procedure elsewhere / not satisfied with the result" language; the girth-enhancement page's own FAQ ("ماذا لو كانت لدي تجربة سيئة مع الحشو في مكان آخر؟") routes here explicitly. No further editorial change needed — the intent signaling this row originally called for is already in place. |
| Notes | Real search behavior ("هل فيلر القضيب آمن؟", complications, dissatisfaction) shows the market genuinely searches for filler *safety and problems*, separately from searching to *get* filler — so the two pages are not artificial cannibalization, they serve two real, distinct intents matching the glossary's "Asymmetry / Irregular contour / Nodules / Migration / Dissolution" vocabulary already in use on this page. |

Sources: [Altibbi — is filler safe for girth](https://altibbi.com/%D8%A7%D8%B3%D8%A6%D9%84%D8%A9-%D8%B7%D8%A8%D9%8A%D8%A9/), [Dr. Al-Fozan — filler injection harms](https://dralfozan.com/%D8%A3%D8%B6%D8%B1%D8%A7%D8%B1-%D8%AD%D9%82%D9%86-%D8%A7%D9%84%D9%81%D9%8A%D9%84%D8%B1-%D9%84%D9%84%D8%B9%D8%B6%D9%88-%D8%A7%D9%84%D8%B0%D9%83%D8%B1%D9%8A/)

---

## Cluster 12 — Scrotal Lift

| Field | Value |
|---|---|
| Primary Arabic keyword | شد الصفن (current site term) |
| Secondary variants | شد كيس الصفن (brief's seed — less common in real usage, keep as a secondary synonym not the primary), ترهل جلد الصفن، ارتخاء كيس الصفن (patient-descriptive symptom phrase), تصغير كيس الصفن |
| English meaning | Scrotal lift / scrotoplasty |
| Intent | Mixed — "ترهل/ارتخاء كيس الصفن" is how patients describe the *problem* (informational, often health-anxiety-driven — see the Altibbi Q&A tone); "شد الصفن" is the *procedure* search (commercial) |
| Geographic modifier | Optional |
| Target existing URL | `/ar/male-aesthetics/scrotal-lift` |
| New page needed? | No |
| Priority | **P2** |
| Cannibalization risk | Low |
| Notes | Live research confirms "شد الصفن" (not "شد كيس الصفن") is the more common real-world phrasing for the procedure itself — the site's existing term is already well-chosen; the brief's seed term is a reasonable secondary variant, not a needed primary-term change. A meaningful share of real queries here are anxious/normalizing in tone ("هل هذا مرض؟") — an FAQ that gently normalizes age-related laxity before presenting the surgical option will match searcher intent better than jumping straight to the procedure pitch. |

Sources: [Altibbi — scrotal skin laxity Q&A](https://altibbi.com/), [WebTeb — scrotal laxity](https://www.webteb.com/articles/), [Urohealth Arabia — scrotal sagging](https://urohealtharabia.com/r/)

---

## Cluster 13 — Male Aesthetics Hub (overview)

| Field | Value |
|---|---|
| Primary Arabic keyword | التجميل الذكوري |
| Secondary variants | (none — this is a category/hub term, not a high-volume standalone query) |
| Intent | Category navigation, not a primary independent search target |
| Target existing URL | `/ar/male-aesthetics` |
| New page needed? | No |
| Priority | **P2** |
| Cannibalization risk | Low, validated — this hub's own title/H1 is "التجميل الذكوري" (the category term), not any spoke's procedure name; its flagship section prominently features and links to `/ar/male-aesthetics/penile-girth-enhancement`, which is correct, expected hub→flagship-spoke behavior, not competing targeting (see `docs/r10-arabic-seo-research.md` §6.1). |
| Notes | Already functions as a genuine menu/overview page — hero + flagship spotlight + "متوفر أيضًا" pointers to the two secondary spokes + its own FAQ (category-level questions like "هل يمكن ضمان نتيجة محددة؟", distinct from the girth-enhancement page's procedure-specific FAQ). No content needs trimming for cannibalization reasons; any future edit here should be for quality/depth, not de-duplication. |

---

## Cluster 14 — Hub Pages (Men's Health, Sexual Medicine)

| Field | Value |
|---|---|
| Primary Arabic keywords | صحة الرجل، الطب الجنسي |
| Intent | Category navigation / broad informational |
| Target existing URLs | `/ar/mens-health`, `/ar/sexual-medicine` |
| New page needed? | No |
| Priority | **P3** |
| Cannibalization risk | Medium vs. their own spokes (testosterone/vasectomy; ED/PE) — same hub-discipline logic as Cluster 13 |
| Notes | Lower standalone search volume than their spokes; treat as internal-linking scaffolding first, keyword target second. |

---

## Cluster 15 — About / EEAT

| Field | Value |
|---|---|
| Primary Arabic keywords | (branded/credential — not a volume keyword play) نبذة عن الطبيب، استشاري مسالك بولية وذكورة |
| Intent | Trust verification — visited after a service page, or by a searcher who already has the physician's name |
| Target existing URL | `/ar/about` |
| New page needed? | No |
| Priority | **P3** |
| Cannibalization risk | Low |
| Notes | Not a keyword-volume page — its SEO job is E-E-A-T signal (credentials, FEBU, 15+ years, media contributions, awards) supporting every other page's authority, and Person/Physician schema accuracy. See the brief's EEAT section — use these facts selectively, not repeated site-wide. |

---

## Cross-Cluster Observations

**On geographic modifiers:** "أبوظبي" earns its place in titles/H1s for clusters where real competitor SERPs already do this (ED, implant, physician-discovery, aesthetics) — i.e., clearly local-commercial queries. It does not belong forced into informational/diagnostic clusters (Doppler mechanics, hormone symptom lists, "does X cause infertility") where the dominant real-world phrasing is nationless. "مدينة خليفة" and "الإمارات" are supporting mentions in body copy/NAP context, not title anchors — search volume for hyper-local Khalifa City queries is negligible on its own.

**On GCC secondary markets:** No meaningful dialectal divergence was found across the seed terms — Saudi- and Kuwait-hosted competitor content uses the same Modern Standard Arabic clinical terms (دعامة القضيب، دوالي الخصية، تكبير القضيب, etc.) as UAE content. GCC secondary relevance is therefore a matter of the UAE pages themselves ranking regionally (plausible given MSA consistency and Google's regional SERP overlap), not a case for separate GCC-dialect content.

**On informational SERPs generally:** Bare symptom/cause queries (PE causes, testosterone symptoms, "does X cause infertility") are dominated by large generic Arabic health portals (WebTeb, Altibbi, Vezeeta, Al Jazeera Health) and by individual-doctor content-marketing sites based in Egypt/Jordan/Turkey. These are not realistic head-to-head ranking targets for a single-physician Abu Dhabi site on the bare informational term. The realistic play is (a) FAQ blocks on the relevant commercial page that capture the long-tail phrasing of these questions with local + clinical specificity added, and (b) the first-wave Insights articles (see `docs/r10-arabic-content-roadmap.md`), not competing on the head term itself.
