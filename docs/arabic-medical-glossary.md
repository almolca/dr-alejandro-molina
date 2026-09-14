# Arabic Medical Glossary — R9 Phase B

One row per clinical/technical term used across the Arabic site, so the
same English term always gets the same Arabic rendering everywhere it
appears. Updated every batch. Professional Modern Standard Arabic,
flagged for a native-speaker QA pass before Production (same caveat
carried since R9 Phase A/B0).

| English term | Arabic term | First used in | Notes |
|---|---|---|---|
| Andrology | طب الذكورة | / (homepage, B0) | |
| Urologist & Andrologist | أمراض المسالك البولية والذكورة | / (homepage, B0) | |
| Consultant | استشاري | / (homepage, B0) | |
| Erectile dysfunction | ضعف الانتصاب | / (homepage, B0) | |
| Testosterone | التستوستيرون | / (homepage, B0) | |
| Male hormonal health | الصحة الهرمونية للرجال | / (homepage, B0) | |
| Penile girth enhancement | زيادة سماكة القضيب | / (homepage, B0) | Flagship procedure name — keep exact wording everywhere |
| Male genital aesthetics | التجميل الذكوري | / (homepage, B0) | |
| Male fertility | خصوبة الرجل | / (homepage, B0) | |
| Peyronie's disease | مرض بيروني | / (homepage, B0) | |
| Penile Doppler | دوبلر القضيب | / (homepage, B0) | |
| Premature ejaculation | سرعة القذف | / (homepage, B0) | |
| Varicocele | دوالي الخصية | / (homepage, B0) | |
| No-scalpel vasectomy | قطع القناة المنوية بدون مشرط | / (homepage, B0) | |
| FEBU — Fellow of the European Board of Urology | FEBU — زميل المجلس الأوروبي لطب المسالك البولية | / (homepage, B0) | Keep "FEBU" in Latin script — it's a credential abbreviation, not translated anywhere |
| Sexual medicine | الطب الجنسي | /sexual-medicine (Batch 1) | |
| Men's health | صحة الرجل | /mens-health (Batch 1) | |
| Semen analysis | تحليل السائل المنوي | /male-fertility (Batch 1) | |
| Hormonal evaluation | التقييم الهرموني | /male-fertility (Batch 1) | |
| Male-factor infertility | العقم بعامل الذكور | /male-fertility (Batch 1) | |
| Sperm DNA fragmentation | تجزؤ الحمض النووي للحيوانات المنوية | /male-fertility (Batch 1) | |
| Scrotal lift | شد الصفن | /male-aesthetics (Batch 1) | |
| Penile filler correction | تصحيح حشو القضيب | /male-aesthetics (Batch 1) | |
| Professional recognition | الاعتراف المهني | /about (Batch 1) | |
| Editorial / media contributions | المساهمات التحريرية / الإعلامية | /about (Batch 1) | |
| Medical education / training | التعليم الطبي / التدريب الطبي | /about (Batch 1) | |
| Medical trainer | مدرّب طبي | /about (Batch 1) | |
| Patient feedback / independently reviewed | آراء المرضى / تقييمات مستقلة | /about (Batch 1) | |
| Verified profile | ملف موثّق | /about (Batch 1) | |
| Related (treatments) | مواضيع ذات صلة | shared component (Batch 1) | `RelatedTreatments` |
| Book a consultation | احجز استشارة | shared (BookingCta call sites) | Default English string has no Arabic equivalent in the component itself — every Arabic call site must pass this explicitly |
| Book a confidential consultation | احجز استشارتك السرية | shared (BookingCta call sites) | Used where English says "confidential" |
| Frequently Asked Questions | الأسئلة الشائعة | shared (`Faq` component, B0) | |
| Arterial inflow | التدفق الشرياني الداخل | /erectile-dysfunction (Batch 2) | |
| Veno-occlusion / veno-occlusive dysfunction | الانسداد الوريدي / الخلل الوظيفي الانسدادي الوريدي | /erectile-dysfunction (Batch 2) | |
| Venous leak | التسرب الوريدي | /erectile-dysfunction/penile-doppler (Batch 2) | |
| Peak systolic velocity (PSV) | ذروة السرعة الانقباضية (PSV) | /erectile-dysfunction/penile-doppler (Batch 2) | Keep "PSV" abbreviation in Latin script alongside the Arabic term |
| End-diastolic velocity (EDV) | السرعة الانبساطية النهائية (EDV) | /erectile-dysfunction/penile-doppler (Batch 2) | Keep "EDV" abbreviation in Latin script alongside the Arabic term |
| PDE5 inhibitors | مثبطات PDE5 | /erectile-dysfunction (Batch 2) | Keep "PDE5" in Latin script — standard in Arabic medical literature |
| Intracavernosal therapy | العلاج داخل الكهفي | /erectile-dysfunction (Batch 2) | |
| Penile implant | دعامة القضيب | /penile-implant (Batch 2) | **Owner-decided terminology (2026-09-14).** Primary patient-facing term — use throughout the site. Superseded prior term `الغرسة القضيبية` (retained below only as a historical note). |
| Penile implant surgery | جراحة زراعة دعامة القضيب | /penile-implant (Batch 2) | Owner-decided (2026-09-14). Use for the procedure/surgery, not the bare device. |
| Inflatable penile implant | دعامة قضيبية قابلة للنفخ | /penile-implant (Batch 2) | Owner-decided (2026-09-14). |
| Malleable penile implant | دعامة قضيبية مرنة | /penile-implant (Batch 2) | Owner-decided (2026-09-14). Adjective is `مرنة` (flexible), not `القابلة للثني`. |
| ~~Malleable (adjective, superseded)~~ | ~~القابلة/القابل للثني~~ | /penile-implant (Batch 2) | **Do not use for the implant type.** Superseded 2026-09-14 alongside the primary-term change, for consistency — replaced by `مرن`/`مرنة` (agreement-matched to the noun modified). Controller judgment call, applied sitewide during the same fix; not independently dictated by the owner but kept consistent with it. |
| ~~Penile implant (superseded)~~ | ~~الغرسة القضيبية~~ | /penile-implant (Batch 2) | **Do not use.** Superseded 2026-09-14 by `دعامة القضيب` for consistency and natural Gulf/UAE patient-facing Arabic — not incorrect, just no longer the site standard. |
| ~~Penile implant (do not use)~~ | ~~زراعة القضيب~~ | — | **Do not use, ever.** Clinically ambiguous — reads as implantation/transplantation of the penis itself rather than placement of a penile prosthesis. Use `دعامة القضيب` (device) or `جراحة زراعة دعامة القضيب` (procedure) instead. |
| Shockwave therapy | العلاج بالموجات الصادمة | /erectile-dysfunction (Batch 2) | |
| Vacuum device | الأجهزة الفراغية | /erectile-dysfunction (Batch 2) | |
| Hyaluronic acid | حمض الهيالورونيك | /sexual-medicine/premature-ejaculation (Batch 2) | |
| SHBG (sex hormone-binding globulin) | الغلوبيولين الرابط للهرمونات الجنسية (SHBG) | /mens-health/testosterone (Batch 2) | Keep "SHBG" abbreviation in Latin script alongside the Arabic term |
| LH / FSH | LH / FSH | /mens-health/testosterone (Batch 2) | Kept in Latin script — standard clinical shorthand, no established single-term Arabic abbreviation in patient-facing material |
| Prolactin | البرولاكتين | /mens-health/testosterone (Batch 2) | |
| Hematocrit | الهيماتوكريت | /mens-health/testosterone (Batch 2) | |
| Prostate-specific antigen (PSA) | مستضد البروستاتا النوعي (PSA) | /mens-health/testosterone (Batch 2) | Keep "PSA" abbreviation in Latin script alongside the Arabic term |
| Penile curvature | انحناء القضيب | /peyronies-disease (Batch 2) | |
| Plaque (Peyronie's) | لويحة ليفية | /peyronies-disease (Batch 2) | |
| Clinical vs. subclinical varicocele | دوالي خصية سريرية / دون سريرية (تحت الإكلينيكية) | /male-fertility/varicocele (Batch 2) | |
| Semen parameters | معايير السائل المنوي | /male-fertility/varicocele (Batch 2) | |
| Testicular function | وظيفة الخصية | /male-fertility/varicocele (Batch 2) | |
| Book a specialist assessment | احجز تقييمًا متخصصًا | /male-fertility/varicocele (Batch 2) | Used where English says "Specialist Assessment" instead of "Consultation" |
| Anatomy-led (planning) | قائم على التشريح | /male-aesthetics/penile-girth-enhancement (Batch 3) | |
| Proportion (aesthetic goal, vs. maximum volume) | التناسب | /male-aesthetics/penile-girth-enhancement (Batch 3) | |
| Staged treatment | علاج مرحلي | /male-aesthetics/penile-girth-enhancement (Batch 3) | |
| Asymmetry | عدم التماثل | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Irregular contour | عدم انتظام الملامس | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Nodules (filler) | العقيدات | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Migration (filler) | الانزياح | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Dissolution (filler) | الإذابة | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Excess/lax scrotal skin | زيادة أو ترهل جلد الصفن | /male-aesthetics/scrotal-lift (Batch 3) | |
