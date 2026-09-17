# R9 Phase B — Batch 4 (Vasectomy + Privacy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete R9 Phase B's Arabic localization by building `/ar/mens-health/vasectomy` and `/ar/privacy` with full content parity (not summaries), wiring every sitewide link that can now resolve to a real Arabic destination, adding a permanent automated safeguard against the "hardcoded English href on an Arabic page" bug class the booking-funnel-correction's final review found three instances of, then producing one final, consolidated Phase B Preview across every Arabic route built across Batches 1–4 plus the booking correction — matching `docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md`'s own stated plan ("One consolidated Preview deploy and final route-by-route parity matrix happen after Batch 4").

**Architecture:** Two new Arabic pages, built directly (not as mechanical string-swaps) following every convention established across Batches 1–3 and the booking correction: `buildMetadata` for self-canonical + automatic reciprocal hreflang once `arPath` is registered, `AR_IDENTITY` for shared physician/practice strings (extended here with four new fields two new pages both need), `locale="ar"` on `Faq`/`RelatedTreatments`/`SectionHeading`, no `uppercase`/`tracking-widest`/`tracking-[0.2em]` on Arabic text, and the same multi-shape sitewide link-audit methodology used in every prior batch. `/ar/book` is explicitly **not** touched by the page-building tasks (it already exists, built directly to the new low-friction spec by the booking correction) — this plan only makes one small, optional, already-justified improvement to it (reusing new `AR_IDENTITY` fields instead of a hardcoded string), never structural changes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, vitest.

**Spec:** `docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md` (the original Phase B architecture spec — its plan for "after Batch 4" is what Task 10 below fulfills) plus the owner's Batch 4 scoping message (2026-09-17), reproduced in the Global Constraints below.

## Global Constraints

- Work happens in the existing worktree `.worktrees/feat-arabic-localization-r9-phase-b`, branch `feat/arabic-localization-r9-phase-b`. `npm run typecheck`/`lint`/`test`/`build` all pass clean at the start of this plan.
- **No merge to `main`. No Production deploy.** A Preview deploy IS in scope for this plan's final task (explicitly requested: "produce one final complete Phase B Preview and stop for owner review") — but nothing beyond Preview.
- **`/ar/book` is already implemented under the new direct-to-NMC booking model — do NOT rebuild it, do NOT reintroduce a form.** No task in this plan may add: a lead-capture form, an email-capture field, a discussion-topic field, an enquiry CTA, or a manual-contact workflow, anywhere on the site. The one `/ar/book` edit in this plan (Task 6, optional sub-step) is a one-line constant-reuse change with zero behavioral impact — verified by that task's own tests, which assert the booking flow's behavior is byte-for-byte unchanged.
- **Full content parity, not summaries.** Both new Arabic pages translate every section, every list item, every FAQ entry of their English source pages (vasectomy: 6 procedure steps, 7 benefits, 7 recovery items, 5 sexual-function reassurance items, 9 risks, 3 good-candidate + 5 needs-discussion items, all 14 FAQ items including the one with a `readMoreHref`; privacy: all 11 sections). No section may be shortened, merged, or dropped relative to the English source, with one documented exception: the RelatedTreatments "Insights" link, which the English page points at `/insights` (no Arabic content exists there at all, even after this batch) — the Arabic vasectomy page's RelatedTreatments has 2 items instead of 3, omitting a link to English-only content rather than sending an Arabic reader into an all-English hub. This is a navigational-link decision, not a content-parity gap, and is called out explicitly in Task 3.
- **Register `arPath` only after each route is complete** — this plan's task ordering enforces that: Task 3 builds the vasectomy page with NO `arPath` yet; Task 4 registers it only after Task 3's page is reviewed and merged into the branch. Same pattern for privacy (Tasks 5→6).
- **Established Arabic-page conventions (binding, from Batches 1–3 and the booking correction):** no `uppercase`/`tracking-widest`/`tracking-[0.2em]` on Arabic text; `locale="ar"` passed to `Faq`, `RelatedTreatments`, `SectionHeading` wherever they appear on an Arabic page; `AR_IDENTITY` reused for shared physician/practice strings rather than each page re-typing its own copy; breadcrumbs match the destination hub's own H1/title exactly; every internal link on an Arabic page points at a real Arabic route or is a documented, temporary, explicitly-commented English fallback.
- **Terminology (from `docs/arabic-medical-glossary.md`, already established — reuse verbatim, do not re-translate):** "No-scalpel vasectomy" = `قطع القناة المنوية بدون مشرط` (glossary + already used in `CoreExpertiseSectionAr.tsx` and the `/ar/mens-health` hub's own card copy — this exact phrase, not the `دون` variant `navigation.ts`'s footer list happens to use elsewhere, which is a pre-existing, unrelated inconsistency out of scope for this plan). "Book a confidential consultation" = `احجز استشارتك السرية`. New term this batch coins and adds to the glossary: "Vasovasostomy" = `مفاغرة الأسهر` (a standard, literal Arabic rendering — "anastomosis of the vas deferens" — with no prior site usage to conflict with).
- **No PII, no lead-form, no consent-independent-booking regressions.** These pages are informational/legal content only — neither one touches the booking funnel, `analytics_events`, or `leads` in any way. The one `/api`-adjacent surface either page touches is `BookingCta` (vasectomy page only, via the existing shared component, already locale-aware since the booking correction's Task 10 — no change needed here).
- **Stale-comment cleanup (owner-requested, item 8):** every comment in the codebase that says "ships Batch 4" or "temporary EN destination" referring specifically to `/mens-health/vasectomy` or `/privacy` must be corrected or removed once those routes go live in Arabic. A repo-wide grep for both phrases is part of Task 7's regression sweep, not left to be found by accident.
- **The href/arPath invariant check (owner-requested, item 8, "if it can be implemented safely without broad scope expansion"):** Task 8 adds exactly one new test file, purely additive, that would have caught all three hardcoded-href bugs the booking correction's final review found (`Footer.tsx`, `MobileNav.tsx`, the Arabic `mens-health/page.tsx`). It does not refactor any existing component, does not change any existing test, and does not gate anything beyond its own new assertions — see Task 8 for the exact scope boundary.
- Verification per task: `npx tsc --noEmit`, `npx eslint <touched files>`, and the task's own new/updated tests. Full suite (`npm run test`) plus `npm run lint`/`npm run build`/`git diff --check` run once at the end of Task 9, matching every prior batch's closing rigor.

---

### Task 1: Extend `AR_IDENTITY` with facility name/short-name/city/country

**Why:** `src/app/(en)/(legal)/privacy/page.tsx` interpolates `practice.facilityName`, `practice.facilityShortName`, `practice.city`, and `practice.country` as four *separate* strings across its 11 sections (not the already-existing combined `AR_IDENTITY.practiceLocationLine`, which mixes facility+city into one string). `ar-identity.ts`'s own docstring states its purpose is exactly this — "Centralized Arabic mirrors of physician-identity strings that recur across nearly every Arabic page" — so the four new fields belong here, not hardcoded per-page (which is the pattern the booking correction's final review flagged as a minor debt on `/ar/book`, not something to repeat here).

**Files:**
- Modify: `src/lib/i18n/ar-identity.ts`

**Interfaces:**
- Produces: `AR_IDENTITY.facilityName`, `AR_IDENTITY.facilityShortName`, `AR_IDENTITY.city`, `AR_IDENTITY.country` — consumed by Task 5 (`/ar/privacy`) and optionally Task 6's `/ar/book` cleanup sub-step.

- [ ] **Step 1: Add the four fields**

Replace the full contents of `src/lib/i18n/ar-identity.ts`:

```ts
/**
 * Centralized Arabic mirrors of physician-identity strings that recur
 * across nearly every Arabic page — title, display name, practice
 * location. Introduced after these were found duplicated across many
 * files with no shared source (R9 Phase B Batch 1 final review).
 * Every value here translates an existing owner-approved English
 * string in config/doctor.ts / config/practice.ts; this file adds no
 * new facts. If the underlying English string ever changes, update
 * the matching value here too.
 *
 * facilityName/facilityShortName/city/country (Batch 4) were added
 * because /ar/privacy needs these as four separate interpolated
 * strings, matching exactly how the English privacy page interpolates
 * practice.facilityName/facilityShortName/city/country individually —
 * practiceLocationLine (below) combines facility+city into one string
 * and isn't a substitute for the granular fields legal copy needs.
 */
export const AR_IDENTITY = {
  /** Mirrors config/doctor.ts's `doctor.title`. */
  doctorTitle: "استشاري أمراض المسالك البولية والذكورة",
  /** Mirrors config/doctor.ts's `doctor.displayName`. */
  doctorDisplayName: "د. أليخاندرو مولينا",
  /** Mirrors config/practice.ts's `practiceLocationLine`. */
  practiceLocationLine: "مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي",
  /** Mirrors config/practice.ts's `practice.facilityName`. */
  facilityName: "مستشفى إن إم سي رويال، مدينة خليفة",
  /** Mirrors config/practice.ts's `practice.facilityShortName`. */
  facilityShortName: "مستشفى إن إم سي رويال",
  /** Mirrors config/practice.ts's `practice.city`. */
  city: "أبوظبي",
  /** Mirrors config/practice.ts's `practice.country`. */
  country: "الإمارات العربية المتحدة",
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` — expected clean (this is a purely additive object-literal change; no existing consumer's destructured field names change).

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n/ar-identity.ts
git commit -m "$(cat <<'EOF'
feat(ar): add facilityName/facilityShortName/city/country to AR_IDENTITY

/ar/privacy (next commit) needs these as four separate interpolated
strings, matching how the English privacy page uses
practice.facilityName/facilityShortName/city/country individually —
the existing practiceLocationLine combines facility+city and isn't a
substitute. Purely additive; no existing consumer's fields change.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Fix a stale sentence in the English privacy page (found while preparing this batch's translation)

**Bug found during Batch 4 prep, not previously caught:** `src/app/(en)/(legal)/privacy/page.tsx`'s "Cookies and Analytics" section — untouched by the booking-funnel-correction's privacy-copy task (Task 11 of that plan only edited "Information We Collect", "Booking and Third-Party Links", "Data Security", "Your Rights") — still contains: *"...analytics events are never linked to the contact details you submit through the booking form."* There is no longer a booking form anywhere on the site; this sentence describes a mechanism that was removed. Translating this stale claim into Arabic would propagate the error into the new page — fixing the English source first, then translating the corrected sentence, is the only defensible order.

**Files:**
- Modify: `src/app/(en)/(legal)/privacy/page.tsx`

- [ ] **Step 1: Fix the sentence**

In the "Cookies and Analytics" section's second paragraph, change:

```tsx
                Consultation&rdquo; button click) are only recorded once you
                accept analytics cookies. No symptom, health, or appointment
                information is ever sent to analytics, and analytics events are
                never linked to the contact details you submit through the
                booking form.
```

to:

```tsx
                Consultation&rdquo; button click) are only recorded once you
                accept analytics cookies. No symptom, health, or appointment
                information is ever sent to analytics, and analytics events are
                never linked to any personal contact details.
```

(Only the final clause changes — "never linked to the contact details you submit through the booking form" → "never linked to any personal contact details" — still true, and now accurate regardless of whether the booking form ever existed.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint "src/app/(en)/(legal)/privacy/page.tsx"` — expected clean. No test covers this page's prose (matches the pre-existing convention, unchanged by this fix) — verify by re-reading the diff that no other sentence in the file was touched.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(en)/(legal)/privacy/page.tsx"
git commit -m "$(cat <<'EOF'
fix(privacy): remove stale "booking form" reference in Cookies and Analytics

Found while preparing the Arabic translation for Batch 4 — this
sentence survived the R9 booking funnel correction's privacy-copy
pass (out of that task's scope) but still described a mechanism
(the booking form) that no longer exists.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Build `/ar/mens-health/vasectomy` (no `arPath` yet)

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/mens-health/vasectomy/page.tsx`

**Interfaces:**
- Consumes: `BookingCta` (locale-aware since the booking correction), `Faq`/`RelatedTreatments`/`SectionHeading` with `locale="ar"`, `PullQuote`, `TreatmentCtaSection`, `AR_IDENTITY.doctorTitle`.
- Produces: nothing new — this route stays undiscoverable (no `arPath` in `routes.ts`, no inbound Arabic link) until Task 4.

- [ ] **Step 1: Create the full page**

```tsx
// src/app/(ar)/ar/(marketing)/mens-health/vasectomy/page.tsx
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/mens-health/vasectomy";

export const metadata: Metadata = buildMetadata({
  title: "قطع القناة المنوية بدون مشرط في أبوظبي",
  description:
    "قطع القناة المنوية بدون مشرط في أبوظبي مع الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة — نهج طفيف التوغل مع استشارة منظمة، ورعاية بعد الإجراء، وفحوصات ما بعد قطع القناة المنوية.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "صحة الرجل", href: "/ar/mens-health" },
  { name: "قطع القناة المنوية بدون مشرط", href: PATH },
];

const conventional = [
  "شق جلدي واحد أو أكثر",
  "فتح أكبر للجلد والنسيج",
  "قد تكون الغرز ضرورية، حسب التقنية المستخدمة",
];

const noScalpel = [
  "فتحة مركزية صغيرة جدًا بالوخز",
  "تشريح محدود",
  "يمكن الوصول عادة إلى كلا الأسهرين من الفتحة نفسها",
  "غالبًا لا تكون هناك حاجة لغرز جلدية",
  "بشكل عام انزعاج وتورم أقل مرتبطان بالجرح",
  "عودة سريعة عادة إلى النشاط اليومي المعتاد",
];

const procedureSteps = [
  "يُطبَّق مخدر موضعي على جلد الصفن والأنسجة المحيطة به.",
  "يُحدَّد كل أسهر ويُثبَّت تحت الجلد.",
  "تُصنع فتحة مركزية صغيرة جدًا في الصفن.",
  "يُخرَج كل أسهر عبر الفتحة نفسها بالتتابع.",
  "يُقطَع الأسهر ويُغلَق باستخدام التقنية التي يختارها الجرّاح.",
  "غالبًا ما تُغلَق الفتحة الصغيرة من تلقاء نفسها أو تحتاج فقط إلى عناية بسيطة بالجرح.",
];

const benefits = [
  { title: "فتحة جلدية أصغر", description: "وخزة مركزية صغيرة واحدة بدلاً من شقوق منفصلة على كل جانب." },
  { title: "تعامل أقل مع الأنسجة", description: "تشريح محدود مقارنة بالنهج الجراحي التقليدي بالشق." },
  { title: "عبء أقل على الجرح", description: "تعطيل أقل للجلد والنسيج بشكل عام، وغالبًا دون الحاجة إلى غرز." },
  { title: "بشكل عام انزعاج وكدمات أقل", description: "يُبلغ معظم المرضى عن مسار أكثر راحة بعد الإجراء، رغم أن ذلك يختلف فرديًا." },
  { title: "خطر أقل لبعض مضاعفات الجرح", description: "الفتحة الأصغر تقلل من بعض مخاطر الجرح مقارنة بالشقوق الأكبر." },
  { title: "تعافٍ سريع لمعظم المرضى", description: "يعود كثير من المرضى إلى العمل المكتبي خلال يوم أو يومين، حسب مستوى الراحة." },
  { title: "لا تأثير على الوظيفة الجنسية", description: "لا يتأثر عادة إنتاج التستوستيرون، ولا الانتصاب، ولا الرغبة الجنسية، ولا النشوة." },
];

const recoveryAdvice = [
  "الراحة في يوم الإجراء",
  "ملابس داخلية داعمة لعدة أيام",
  "كمادات ثلج أو باردة بشكل متقطع، إذا أُوصي بذلك",
  "مسكنات بسيطة عند الحاجة",
  "تجنّب التمارين الشاقة ورفع الأثقال لعدة أيام",
  "تجنّب النشاط الجنسي لمدة أسبوع تقريبًا، أو حسب التوجيه الطبي",
  "غالبًا ما تكون العودة إلى العمل المكتبي ممكنة خلال يوم إلى يومين، حسب مستوى الراحة",
];

const sexualFunction = [
  "إنتاج التستوستيرون",
  "الرغبة الجنسية",
  "جودة الانتصاب",
  "النشوة الجنسية",
  "الإحساس أثناء القذف",
];

const risks = [
  "الكدمات",
  "التورم",
  "انزعاج مؤقت",
  "نزيف أو تجمع دموي",
  "العدوى",
  "الورم الحبيبي المنوي",
  "ألم صفني مستمر (متلازمة الألم بعد قطع القناة المنوية)",
  "إعادة الاتصال المبكرة أو المتأخرة",
  "عدم تحقيق مستوى مقبول من الخلو من الحيوانات المنوية في التحليل بعد الإجراء",
];

const goodCandidates = [
  "الرجال المتأكدون من اكتمال أسرتهم",
  "الرجال الباحثون عن وسيلة منع حمل دائمة وفعالة",
  "المرضى الذين يدركون أن إعادة الوصل غير مضمونة",
];

const needsDiscussion = [
  "عدم اليقين بشأن إنجاب أطفال مستقبلاً",
  "عدوى صفنية نشطة",
  "مشكلات تشريحية صفنية ملحوظة",
  "ألم مزمن في الخصية أو الصفن",
  "جراحة صفنية معقدة سابقة، عند الاقتضاء",
];

const faqItems = [
  {
    question: "هل قطع القناة المنوية بدون مشرط مؤلم؟",
    answer:
      "يُجرى الإجراء تحت مخدر موضعي، لذا يشعر معظم المرضى بضغط أو شد أكثر من ألم حاد أثناء الإجراء نفسه. بعض الانزعاج والكدمات والتورم بعد الإجراء أمر طبيعي وعادة ما يمكن التحكم به بمسكنات بسيطة.",
  },
  {
    question: "ما حجم الفتحة؟",
    answer:
      "تستخدم تقنية عدم استخدام المشرط وخزة مركزية صغيرة جدًا في جلد الصفن بدلاً من شقوق منفصلة — أصغر بكثير من النهج التقليدي بالشق.",
  },
  {
    question: "هل تلزم الغرز؟",
    answer:
      "غالبًا لا. نظرًا لصغر الفتحة، فإنها غالبًا ما تُغلَق من تلقاء نفسها دون غرز، رغم أن ذلك قد يعتمد على التشريح الفردي وتفاصيل إجرائك.",
  },
  {
    question: "متى يمكنني العودة إلى العمل؟",
    answer:
      "يعود كثير من المرضى إلى العمل المكتبي خلال يوم إلى يومين، حسب مستوى الراحة. العمل ذو الجهد البدني عادة ما يحتاج وقتًا أطول — يُناقَش ذلك بشكل فردي.",
  },
  {
    question: "متى يمكنني ممارسة الرياضة مجددًا؟",
    answer:
      "يُنصح عادة بتجنّب التمارين الشاقة ورفع الأثقال لعدة أيام. يُحدَّد الجدول الزمني الخاص بك عند الإجراء والمتابعة.",
  },
  {
    question: "متى يمكنني ممارسة العلاقة الحميمة بعد قطع القناة المنوية؟",
    answer: "يُنصح عادة بتجنّب النشاط الجنسي لمدة أسبوع تقريبًا، أو حسب توجيه الجرّاح.",
  },
  {
    question: "هل أصبح عقيمًا فور الإجراء؟",
    answer:
      "لا. لا يؤدي قطع القناة المنوية إلى عقم فوري — يبقى بعض الحيوانات المنوية المتبقية في الجزء الذي يلي موضع الإغلاق. يجب الاستمرار في وسيلة منع حمل بديلة حتى يؤكد تحليل السائل المنوي بعد الإجراء الخلو الكافي من الحيوانات المنوية، ويُجرى الفحص بعد فترة مناسبة وفق بروتوكول طبيبك المعالج.",
  },
  {
    question: "هل يؤثر قطع القناة المنوية على التستوستيرون؟",
    answer:
      "لا. يقطع الإجراء الأسهر، وليس إنتاج الهرمونات في الخصيتين — لا تتأثر مستويات التستوستيرون عادة.",
  },
  {
    question: "هل يؤثر قطع القناة المنوية على الانتصاب أو القذف؟",
    answer:
      "لا. لا تتأثر عادة جودة الانتصاب ولا الرغبة الجنسية ولا النشوة ولا الإحساس أثناء القذف. كما أن حجم السائل المنوي يتغير قليلاً جدًا، لأن الحيوانات المنوية تشكل جزءًا صغيرًا فقط من السائل المنوي — ومعظم السائل يأتي من البروستاتا والحويصلات المنوية.",
  },
  {
    question: "هل يمكن عكس قطع القناة المنوية؟",
    answer:
      "إجراءات إعادة الوصل مثل مفاغرة الأسهر ممكنة في حالات مختارة، لكنها أكثر تعقيدًا من الإجراء الأصلي وغير مضمونة لاستعادة الخصوبة — تختلف النتائج حسب المدة منذ قطع القناة المنوية وعوامل فردية أخرى. يجب اعتبار قطع القناة المنوية وسيلة منع حمل دائمة.",
    readMoreHref: "/ar/male-fertility",
    readMoreLabel: "اعرف المزيد عن تقييم خصوبة الرجل",
  },
  {
    question: "هل يمكن أن يعيد الأسهر الاتصال من تلقاء نفسه؟",
    answer:
      "نادرًا، نعم — إعادة الاتصال المبكرة أو المتأخرة خطر معروف وغير شائع، وهو أحد أسباب استخدام تحليل السائل المنوي بعد الإجراء للتأكد من الخلو الكافي قبل الاعتماد على الإجراء لمنع الحمل.",
  },
  {
    question: "هل سيبدو السائل المنوي مختلفًا؟",
    answer:
      "ليس بشكل ملحوظ. تمثل الحيوانات المنوية جزءًا صغيرًا فقط من حجم القذف، لذا يبدو السائل المنوي ويشعر به عادة بشكل مشابه إلى حد كبير بعد الإجراء.",
  },
  {
    question: "هل يزيد قطع القناة المنوية من خطر سرطان البروستاتا؟",
    answer:
      "لا تدعم الأدلة الحالية اعتبار قطع القناة المنوية سببًا لسرطان البروستاتا. كان هذا موضوع اهتمام بحثي، لكن لم تُثبَت أي علاقة سببية.",
  },
  {
    question: "ما هي متلازمة الألم بعد قطع القناة المنوية؟",
    answer:
      "تشير إلى انزعاج صفني أو خصوي مستمر يستمر بعد فترة التعافي المتوقعة. وهو خطر غير شائع لكنه معروف، وهو أحد العوامل التي تُناقَش كجزء من الموافقة المستنيرة قبل المتابعة.",
  },
];

export default function VasectomyPageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "قطع القناة المنوية بدون مشرط",
            description:
              "قطع القناة المنوية بدون مشرط — وسيلة دائمة لمنع الحمل لدى الرجال تُجرى عبر فتحة صفنية مركزية صغيرة، مع استشارة حول التعافي والمخاطر والفحوصات بعد الإجراء.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "قطع القناة المنوية بدون مشرط",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">قطع القناة المنوية بدون مشرط</p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              نهج طفيف التوغل لمنع الحمل الدائم لدى الرجال
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              يستخدم قطع القناة المنوية بدون مشرط فتحة صفنية مركزية صغيرة جدًا
              للوصول إلى الأسهر بأقل قدر من تعطيل الأنسجة، ما يوفر نهجًا فعالًا
              في العيادة الخارجية لمنع الحمل بشكل دائم.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="vasectomy" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
            <p className="mt-6 text-xs font-medium text-muted-foreground">
              استشاري أمراض المسالك البولية والذكورة · أبوظبي
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What is it */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="ما هو" heading="ما هو قطع القناة المنوية بدون مشرط؟" locale="ar" />
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                قطع القناة المنوية هو إجراء دائم لمنع الحمل لدى الرجال، حيث
                يُقطَع الأسهر — الأنبوب الذي ينقل الحيوانات المنوية — بحيث لا
                تعود الحيوانات المنوية إلى القذف.
              </p>
              <p>
                في تقنية عدم استخدام المشرط، بدلاً من الشقوق الجلدية التقليدية
                على كل جانب، يُصَل إلى الأسهر عبر فتحة صغيرة جدًا، عادة في
                الجلد المركزي للصفن. يمكن عادة معالجة كلا الجانبين من خلال
                هذه الفتحة الصغيرة نفسها.
              </p>
              <p className="text-foreground">
                لا يؤثر ذلك على إنتاج التستوستيرون أو الانتصاب أو الرغبة
                الجنسية أو القدرة على النشوة. يتغير حجم القذف قليلاً جدًا،
                لأن الحيوانات المنوية تمثل جزءًا صغيرًا فقط من حجم السائل
                المنوي.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How the technique differs */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="التقنية"
            heading="كيف تختلف تقنية عدم استخدام المشرط"
            description="مقارنة بين الأساليب، وليست حكمًا على قطع القناة المنوية التقليدي — كلاهما تقنيتان معتمدتان وصالحتان."
            locale="ar"
          />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">النهج التقليدي</p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                {conventional.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">نهج عدم استخدام المشرط</p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                {noScalpel.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* The procedure */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="ما يمكن توقعه" heading="الإجراء" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {procedureSteps.map((step, index) => (
              <StaggerItem key={step}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{step}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              هذا عرض عام موجّه للمريض. تُناقَش التقنية الدقيقة المستخدمة لقطع
              وإغلاق الأسهر بشكل فردي كجزء من استشارتك، ولا تُوحَّد مسبقًا
              لكل مريض.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="مزايا محتملة"
            heading="فوائد نهج عدم استخدام المشرط"
            description="مزايا محتملة، وليست ضمانات — تختلف النتائج الفردية."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Recovery */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الرعاية بعد الإجراء" heading="التعافي" locale="ar" />
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {recoveryAdvice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يختلف التعافي فرديًا. هذا إرشاد عام، وليس بديلاً عن تعليمات
              الرعاية المحددة التي تُعطى لك أثناء إجرائك.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Not immediately sterile — the page's one distinctive dark/olive moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">مهم</p>
            <p className="mt-6 font-display text-display-md text-foreground">
              لست عقيمًا فورًا بعد قطع القناة المنوية.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              لا يؤدي قطع القناة المنوية إلى عقم فوري. يبقى بعض الحيوانات
              المنوية المتبقية أسفل موضع الإغلاق. يجب الاستمرار في وسيلة
              منع حمل بديلة حتى يؤكد تحليل السائل المنوي بعد الإجراء الخلو
              الكافي من الحيوانات المنوية. يُجرى الفحص عادة بعد فترة مناسبة
              بعد الإجراء، وفق بروتوكول طبيبك المعالج والمختبر.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Sexual function */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="طمأنة" heading="التأثير على الوظيفة الجنسية" locale="ar" />
          <Reveal delay={0.05}>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              لا يؤثر قطع القناة المنوية عادة على:
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
              {sexualFunction.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يبقى السائل المنوي يبدو مشابهًا إلى حد كبير بعد قطع القناة
              المنوية، لأن معظم سائل القذف يأتي من البروستاتا والحويصلات
              المنوية، وليس من الخصيتين.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Permanence / reversal */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الموافقة المستنيرة" heading="الديمومة وإعادة الوصل" locale="ar" />
          <div className="mt-10">
            <PullQuote>يجب اعتبار قطع القناة المنوية وسيلة منع حمل دائمة.</PullQuote>
          </div>
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                إجراءات إعادة الوصل مثل{" "}
                <Link
                  href="/ar/male-fertility"
                  className="text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  مفاغرة الأسهر
                </Link>{" "}
                ممكنة في حالات مختارة، لكنها أكثر تعقيدًا من الإجراء الأصلي
                وغير مضمونة لاستعادة الخصوبة — تختلف النتائج حسب المدة منذ
                قطع القناة المنوية وعوامل فردية أخرى.
              </p>
              <p>
                قد يرغب المرضى غير المتأكدين من خصوبتهم المستقبلية في مناقشة
                تجميد الحيوانات المنوية قبل المتابعة. لا يُوصى بذلك بشكل
                روتيني لكل مريض، لكن يُطرَح عند وجود صلة بالظروف الفردية.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Risks */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الموافقة المستنيرة" heading="المخاطر" locale="ar" />
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              المضاعفات الخطيرة غير شائعة، لكن لا يوجد إجراء خالٍ تمامًا من
              المخاطر. تُراجَع هذه المخاطر بشكل فردي كجزء من الموافقة
              المستنيرة قبل المتابعة.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Who is it for */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium text-accent-strong">لمن هذا الإجراء</p>
            <h2 className="mt-4 font-display text-display-md text-foreground">المرشحون المناسبون</h2>
            <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {goodCandidates.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow font-medium text-accent-strong">يستحق النقاش أولاً</p>
            <h2 className="mt-4 font-display text-display-md text-foreground">يتطلب مزيدًا من النقاش</h2>
            <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {needsDiscussion.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/*
        Only 2 items, not 3: the English page's third RelatedTreatments
        item links to /insights, which has no Arabic content at all
        (individual /insights/[slug] articles are English-only) — a
        navigational choice, not a content gap. See this plan's Global
        Constraints for the explicit ruling.
      */}
      <RelatedTreatments
        locale="ar"
        items={[
          { label: "خصوبة الرجل", href: "/ar/male-fertility" },
          { label: "التستوستيرون والصحة الهرمونية للرجال", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} locale="ar" eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" />

      <TreatmentCtaSection
        heading="ناقش ما إذا كان قطع القناة المنوية مناسبًا لك"
        sourcePage={PATH}
        secondary={{ label: "استكشف صحة الرجل", href: "/ar/mens-health" }}
        bookingLabel="احجز استشارتك السرية"
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint "src/app/(ar)/ar/(marketing)/mens-health/vasectomy/page.tsx" && npm run build`

The build step matters here specifically: this route has no `arPath` yet and no inbound link from anywhere else in the site, so it is only reachable by typing the URL directly — confirm the build output lists `○ /ar/mens-health/vasectomy` (or `ƒ`) as a real compiled route despite being unlinked.

- [ ] **Step 3: Self-review checklist**

Before committing, confirm by re-reading the file: all 14 FAQ items present (including the one `readMoreHref`), all 6 procedure steps, all 7 benefits, all 7 recovery items, all 5 sexual-function items, all 9 risks, 3+5 candidate/discussion items — nothing shortened relative to the English source at `src/app/(en)/(marketing)/mens-health/vasectomy/page.tsx`. No `uppercase`/`tracking-widest`/`tracking-[0.2em]` class anywhere in the new file (grep it: `grep -n "uppercase\|tracking-widest\|tracking-\[0.2em\]"` should return nothing).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/mens-health/vasectomy/page.tsx"
git commit -m "$(cat <<'EOF'
feat(ar): add /ar/mens-health/vasectomy (full content parity, no arPath yet)

Complete Arabic translation of every section of the English source —
all 14 FAQ items, 6 procedure steps, 7 benefits, 7 recovery items, 5
sexual-function reassurance items, 9 risks, candidate/discussion
lists. RelatedTreatments has 2 items instead of 3 (omits the
English-only /insights link, a navigational choice, not a content
gap — see plan). No arPath registered yet — this route is
unreachable from the rest of the site until the next commit
registers it, per the owner's "register arPath only after each route
is complete" instruction.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Register `arPath` for vasectomy; flip every resolvable link; clean up stale comments

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/lib/seo/routes.test.ts`
- Modify: `src/app/sitemap.test.ts`
- Modify: `src/app/(ar)/ar/(marketing)/mens-health/page.tsx` (hardcoded href + stale comment)
- Modify: `src/components/sections/ar/CoreExpertiseSectionAr.tsx` (hardcoded href + stale comment)

**Interfaces:**
- Consumes: Task 3's page must already exist and be committed.
- Produces: `getLocalizedPathPair("/mens-health/vasectomy")` now returns `{ en: "/mens-health/vasectomy", ar: "/ar/mens-health/vasectomy" }` — this alone auto-fixes `src/config/navigation.ts`'s `getFooterServiceLinks("ar")` (its `localizeHref` call), with no code change to `navigation.ts` needed (verified in Step 4 below).

- [ ] **Step 1: Register the route**

In `src/lib/seo/routes.ts`, change:

```ts
  { path: "/mens-health/vasectomy", status: "live", priority: 0.6 },
```

to:

```ts
  { path: "/mens-health/vasectomy", status: "live", priority: 0.6, arPath: "/ar/mens-health/vasectomy" },
```

- [ ] **Step 2: Flip the two hardcoded hrefs**

In `src/app/(ar)/ar/(marketing)/mens-health/page.tsx`, change the vasectomy card's href:

```ts
    href: "/mens-health/vasectomy",
```

to:

```ts
    href: "/ar/mens-health/vasectomy",
```

and update the now-stale comment immediately above the `areas` array from:

```ts
/** Testosterone and ED now live in Arabic (Batch 2). Vasectomy stays temporary EN — ships Batch 4. */
```

to:

```ts
/** Testosterone and ED live in Arabic since Batch 2; vasectomy since Batch 4 — all four areas now link to real Arabic pages. */
```

In `src/components/sections/ar/CoreExpertiseSectionAr.tsx`, change the secondary link's href:

```ts
  { label: "قطع القناة المنوية بدون مشرط", href: "/mens-health/vasectomy" },
```

to:

```ts
  { label: "قطع القناة المنوية بدون مشرط", href: "/ar/mens-health/vasectomy" },
```

and update the now-stale comment block above `export function CoreExpertiseSectionAr()` — since this was the LAST temporary-EN destination in this file's `secondaryLinks`/`primaryAreas` arrays, replace the whole comment:

```ts
/**
 * All primary/secondary hrefs above now point to real Arabic pages
 * except `/mens-health/vasectomy`, which has no Arabic page yet and
 * stays a temporary EN destination — ships Batch 4. (R9 Phase B: Batch 1
 * covered `/ar/male-aesthetics` and `/ar/male-fertility`; Batch 2
 * covered four more, found un-flipped here during its own Task 11
 * regression pass; Batch 3 covers `/male-aesthetics/penile-girth-enhancement`.)
 */
```

with:

```ts
/**
 * All primary/secondary hrefs above now point to real Arabic pages —
 * `/mens-health/vasectomy` was the last temporary-EN destination in
 * this file and now resolves to `/ar/mens-health/vasectomy` (Batch 4).
 */
```

- [ ] **Step 3: Update `routes.test.ts`**

Add `"/mens-health/vasectomy"` to the `withArPath` array, in registry-declaration order (it sits between `/mens-health/testosterone` and `/sexual-medicine` in `routes.ts`):

```ts
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/book",
      "/mens-health",
      "/mens-health/testosterone",
      "/mens-health/vasectomy",
      "/sexual-medicine",
```

(rest of the array unchanged). Also add one new `getLocalizedPathPair` test case near the existing `/mens-health` ones:

```ts
  it("returns the en/ar pair for /mens-health/vasectomy, now live in Arabic (Batch 4)", () => {
    expect(getLocalizedPathPair("/mens-health/vasectomy")).toEqual({
      en: "/mens-health/vasectomy",
      ar: "/ar/mens-health/vasectomy",
    });
  });
```

- [ ] **Step 4: Update `sitemap.test.ts`**

Add `"/ar/mens-health/vasectomy"` to the arEntries array (position doesn't matter, the test sorts both sides):

```ts
      [
        "/ar",
        "/ar/about",
        "/ar/book",
        "/ar/mens-health",
        "/ar/mens-health/testosterone",
        "/ar/mens-health/vasectomy",
        "/ar/sexual-medicine",
```

(rest unchanged). Rename the test's title to include "Batch 4".

- [ ] **Step 5: Write a test proving `navigation.ts` needs no code change**

This is the direct verification that `getFooterServiceLinks("ar")`'s existing `localizeHref` call — not a new code path — now resolves the vasectomy footer link correctly, with zero lines changed in `navigation.ts` itself.

```ts
// Add to src/config/navigation.test.ts if it exists, or create it if not — check first.
import { describe, expect, it } from "vitest";
import { getFooterServiceLinks, getLegalNav } from "./navigation";

describe("getFooterServiceLinks (Batch 4 regression)", () => {
  it("resolves the No-Scalpel Vasectomy footer link to /ar/mens-health/vasectomy on the Arabic side, with no code change to navigation.ts itself", () => {
    const arLinks = getFooterServiceLinks("ar");
    const vasectomyLink = arLinks.find((l) => l.href.includes("vasectomy"));
    expect(vasectomyLink?.href).toBe("/ar/mens-health/vasectomy");
  });

  it("still resolves the English footer link to /mens-health/vasectomy unchanged", () => {
    const enLinks = getFooterServiceLinks("en");
    const vasectomyLink = enLinks.find((l) => l.href.includes("vasectomy"));
    expect(vasectomyLink?.href).toBe("/mens-health/vasectomy");
  });
});

describe("getLegalNav (Batch 4 regression)", () => {
  it("resolves the Privacy Policy legal-nav link to /privacy unchanged (arPath not registered until Task 6)", () => {
    const arLinks = getLegalNav("ar");
    const privacyLink = arLinks.find((l) => l.label.includes("الخصوصية"));
    expect(privacyLink?.href).toBe("/privacy");
  });
});
```

If `src/config/navigation.test.ts` already exists, add these `describe` blocks to it rather than creating a duplicate file — check with `ls src/config/navigation.test.ts` first.

- [ ] **Step 6: Run all affected tests**

Run: `npx vitest run src/lib/seo/routes.test.ts src/app/sitemap.test.ts src/config/navigation.test.ts`

Expected: all pass, including the new vasectomy-specific assertions.

- [ ] **Step 7: Full verification**

Run: `npx tsc --noEmit && npm run lint && npm run build` — confirm `/ar/mens-health/vasectomy` appears in the build's route list, and that `npm run build`'s sitemap generation succeeds with the new entry.

- [ ] **Step 8: Commit**

```bash
git add src/lib/seo/routes.ts src/lib/seo/routes.test.ts src/app/sitemap.test.ts \
  "src/app/(ar)/ar/(marketing)/mens-health/page.tsx" \
  src/components/sections/ar/CoreExpertiseSectionAr.tsx \
  src/config/navigation.test.ts
git commit -m "$(cat <<'EOF'
feat(ar): register arPath for /mens-health/vasectomy; flip all resolvable links

/ar/mens-health/vasectomy (previous commit) is now discoverable:
self-canonical + reciprocal hreflang via buildMetadata(), sitemap
inclusion, and every sitewide link that pointed at the English
/mens-health/vasectomy from an Arabic context now resolves correctly.
navigation.ts itself needed zero changes — getFooterServiceLinks's
existing localizeHref() call picks up the new arPath automatically,
verified by a new regression test. Two hardcoded hrefs (the Arabic
mens-health hub's own card, CoreExpertiseSectionAr's secondary link)
needed manual flips since they don't go through navigation.ts's
helpers; both now point at /ar/mens-health/vasectomy, and their
"ships Batch 4" stale comments are corrected.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Build `/ar/privacy` (no `arPath` yet)

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/privacy/page.tsx`

Note the route group: this file lives under `(ar)/ar/(marketing)/`, matching every other Arabic marketing page's location — **not** under an `(ar)/ar/(legal)/` group, since no such group exists yet for Arabic and creating one for a single page would be scope beyond what this task needs (the English `/privacy` lives in `(en)/(legal)/`, a route-group naming choice that doesn't need to be mirrored 1:1 in the Arabic tree — route groups don't affect the URL path, only file organization).

**Interfaces:**
- Consumes: `AR_IDENTITY.doctorDisplayName`, `AR_IDENTITY.doctorTitle`, `AR_IDENTITY.facilityName`, `AR_IDENTITY.facilityShortName`, `AR_IDENTITY.city`, `AR_IDENTITY.country` (all from Task 1).
- Produces: nothing new — unreachable until Task 6 registers `arPath`.

- [ ] **Step 1: Create the full page**

```tsx
// src/app/(ar)/ar/(marketing)/privacy/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * DRAFT — pending final UAE legal/compliance review, same status as
 * the English source (src/app/(en)/(legal)/privacy/page.tsx). This is
 * a full translation of that page as of its "17 September 2026" text
 * (post R9 booking funnel correction + the Batch 4 "booking form"
 * sentence fix) — keep both pages in lockstep on future edits.
 */

const PATH = "/ar/privacy";
const LAST_UPDATED = "17 سبتمبر 2026 (Batch 4 — الترجمة العربية)";

export const metadata: Metadata = buildMetadata({
  title: "سياسة الخصوصية",
  description: `سياسة الخصوصية للموقع الشخصي لـ ${AR_IDENTITY.doctorDisplayName}.`,
  path: PATH,
  index: false,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "سياسة الخصوصية", href: PATH },
];

export default function PrivacyPageAr() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium text-accent-strong">قانوني</p>
          <h1 className="mt-4 font-display text-display-lg text-foreground">سياسة الخصوصية</h1>
          <p className="mt-4 text-sm text-muted-foreground">آخر تحديث: {LAST_UPDATED}</p>

          <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-xl text-foreground">مقدمة</h2>
              <p className="mt-3">
                توضح سياسة الخصوصية هذه كيفية التعامل مع المعلومات على هذا
                الموقع، الموقع الشخصي لـ {AR_IDENTITY.doctorDisplayName}،{" "}
                {AR_IDENTITY.doctorTitle}، الذي يمارس مهنته في{" "}
                {AR_IDENTITY.facilityName}، {AR_IDENTITY.city}،{" "}
                {AR_IDENTITY.country}. هذا الموقع مستقل عن{" "}
                {AR_IDENTITY.facilityShortName} ولا يعمل نيابة عنه، إلا فيما
                هو منصوص عليه صراحة.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">المعلومات التي نجمعها</h2>
              <p className="mt-3">
                لا يتطلب حجز موعد عبر هذا الموقع منك تقديم اسمك أو بريدك
                الإلكتروني أو أي معلومات صحية إلينا. تنقلك صفحة &ldquo;احجز
                استشارة&rdquo; مباشرة إلى نظام الحجز الرسمي لدى{" "}
                {AR_IDENTITY.facilityShortName}، حيث تُقدَّم أي معلومات لازمة
                لتحديد موعدك مباشرة إلى {AR_IDENTITY.facilityShortName}،
                وليس إلى هذا الموقع. لا نطلب ولا نجمع الأعراض أو التشخيص أو
                التاريخ المرضي أو الأدوية أو نتائج الفحوصات أو السجلات
                السريرية من خلال هذا الموقع.
              </p>
              <p className="mt-3">
                نسجّل من أين جاءت الزيارة — مثل الموقع المُحيل، أو محرك
                البحث، أو رابط الحملة الإعلانية (معاملات UTM) — وعند
                الاقتضاء، أي صفحة على هذا الموقع أوصلتك إلى صفحة الحجز.
                يُستخدَم ذلك فقط لفهم القنوات التي تجلب الزوار إلى الموقع،
                وليس لبناء ملف تعريف عنك كفرد.
              </p>
              <p className="mt-3">
                قد تُسجَّل أيضًا معلومات تقنية عامة (مثل نوع المتصفح وبيانات
                الاستخدام العامة) تلقائيًا بواسطة البنية التحتية للاستضافة
                التي تُشغّل هذا الموقع، كما هو معتاد في أي موقع إلكتروني.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">ملفات تعريف الارتباط والتحليلات</h2>
              <p className="mt-3">
                يستخدم هذا الموقع عددًا صغيرًا من ملفات تعريف الارتباط
                الخاصة بالطرف الأول وغير الإعلانية، ولا يُستخدَم أي منها
                للإعلان أو يُشارَك مع أي شبكة إعلانية. يتذكر اثنان منها من
                أين جاءت الزيارة أولًا وآخر مرة (مثل محرك بحث، أو وسائل
                التواصل الاجتماعي، أو رابط حملة معينة)، ويتذكر ثالث أي صفحة
                أوصلتك إلى صفحة الحجز — تساعدنا هذه الملفات على فهم القنوات
                التي تجلب الاستفسارات، وتنتهي صلاحيتها بعد 180 يومًا (30
                دقيقة للملف الخاص بالإحالة إلى الحجز)، ولا تخزّن سوى رمز
                قصير (مثل &ldquo;google_business&rdquo; أو
                &ldquo;direct&rdquo;) ومسار صفحة — ولا تخزّن أبدًا اسمك أو
                بريدك الإلكتروني أو رقم هاتفك. مثل المعرّف المجهول الموضح
                أدناه، لا تُضبَط هذه الملفات إلا بعد موافقتك على ملفات
                تعريف الارتباط التحليلية عبر الشريط الظاهر على هذا الموقع.
              </p>
              <p className="mt-3">
                يُستخدَم معرّف مجهول منفصل (رمز عشوائي، غير مشتق من أي
                معلومات شخصية)، بموجب موافقتك أدناه، لإحصاء مشاهدات الصفحات
                ونقرات الأزرار دون التعرف عليك كفرد. لا تُسجَّل أحداث
                التحليل المجهولة والمجمّعة (مثل مشاهدة صفحة أو نقرة على زر
                &ldquo;احجز استشارة&rdquo;) إلا بعد موافقتك على ملفات
                تعريف الارتباط التحليلية. لا تُرسَل أي معلومات عن الأعراض
                أو الصحة أو المواعيد إلى التحليلات مطلقًا، ولا تُربَط أحداث
                التحليل أبدًا بأي بيانات تواصل شخصية.
              </p>
              <p className="mt-3">
                يمكنك تغيير اختيارك الخاص بملفات تعريف الارتباط في أي وقت
                باستخدام رابط &ldquo;إعدادات ملفات تعريف الارتباط&rdquo; في
                تذييل هذا الموقع، والذي يعيد فتح الشريط نفسه الذي ظهر عند
                زيارتك الأولى.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">أين تُعالَج المعلومات</h2>
              <p className="mt-3">
                يُبنى هذا الموقع ويُستضاف على Vercel، وتُخزَّن بيانات
                الحجز/العملاء المحتملين والتحليلات في قاعدة بيانات تديرها
                Supabase. هذان هما مزودا البنية التحتية وقاعدة البيانات
                المستخدمان حاليًا لتشغيل هذا الموقع. استنادًا إلى المناطق
                المُهيَّأة حاليًا لديهما، يعمل التطبيق نفسه في الولايات
                المتحدة الأمريكية، وتقع قاعدة البيانات في الهند — كلاهما
                خارج دولة الإمارات العربية المتحدة. يعمل هذان المزودان فقط
                بناءً على تعليمات هذا الموقع، بصفتهما معالِجَين للبيانات،
                ولا يستخدمان بياناتك بشكل مستقل لأغراضهما الخاصة. نستخدمهما
                لأنهما يوفران البنية التحتية التقنية التي يعمل عليها هذا
                الموقع، وليس تفضيلًا لأي دولة معينة، وسيُحدَّث هذا القسم
                إذا تغيّرت تلك البنية التحتية.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">الاحتفاظ بالبيانات</h2>
              <p className="mt-3">
                تُحفَظ سجلات الحجز/العملاء المحتملين التي لا تؤدي إلى
                استشارة مؤكدة لمدة تصل إلى 12 شهرًا من تاريخ تقديمها،
                وبعدها تصبح مؤهلة للحذف. تُحفَظ بيانات التحليلات (المعرّف
                المجهول وسجلات الأحداث الموضحة أعلاه) فقط طالما كانت مفيدة
                بشكل معقول لفهم كيفية استخدام الموقع وفقًا لاحتياجاتنا
                التشغيلية الحالية.
              </p>
              <p className="mt-3">
                يوضّح هذا ممارستنا المقصودة في الاحتفاظ بالبيانات. لم يُطبَّق
                بعد حذف آلي ومجدوَل لتنفيذ ذلك — وهذا مُحدَّد كمتطلب تشغيلي
                لاحق، وليس أمرًا قائمًا بالفعل. بغض النظر عن المدة التي
                احتُفظ فيها بالمعلومات، يمكنك أن تطلب منا حذف معلوماتك في
                أي وقت (انظر &ldquo;حقوقك&rdquo;).
              </p>
              <p className="mt-3">
                ينطبق نهج الاحتفاظ هذا فقط على المعلومات التي تُجمَع من
                خلال هذا الموقع. ولا ينطبق على سجلاتك الطبية أو تاريخ
                مواعيدك أو أي معلومات سريرية يحتفظ بها{" "}
                {AR_IDENTITY.facilityShortName}، والتي تخضع لسياسات{" "}
                {AR_IDENTITY.facilityShortName} الخاصة، لا لهذه السياسة.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">الحجز والروابط الخارجية</h2>
              <p className="mt-3">
                يؤدي النقر على &ldquo;المتابعة إلى حجز الموعد عبر
                NMC&rdquo; (أو رابط &ldquo;عرض الملف الشخصي في
                NMC&rdquo;) في صفحة الحجز إلى نقلك مباشرة إلى منصات{" "}
                {AR_IDENTITY.facilityShortName} الرسمية، التي تعمل بموجب
                سياسة الخصوصية الخاصة بها. لا يعالج هذا الموقع جدولة
                المواعيد بنفسه، ولا يجمع اسمك أو بريدك الإلكتروني أو
                معلوماتك الصحية كجزء من الحجز، وليس لديه أي وصول إلى أي
                معلومات تقدّمها على أنظمة {AR_IDENTITY.facilityShortName}.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">أمن البيانات</h2>
              <p className="mt-3">
                لا يمكن الوصول إلى قاعدة بيانات هذا الموقع مباشرة من
                المتصفح: تتم جميع عمليات القراءة والكتابة عبر خادم هذا
                الموقع نفسه، وقاعدة البيانات نفسها مُهيَّأة لرفض الوصول
                المباشر تمامًا، ولا يمكن الوصول إليها إلا عبر ذلك الخادم.
                لا يؤدي حجز موعد إلى إرسال اسمك أو بريدك الإلكتروني أو
                معلوماتك الصحية إلى هذا الموقع. تُستخدَم تدابير تقنية
                معقولة للمساعدة في حماية هذا الموقع بشكل عام. وكما ذُكر
                أعلاه، لا يجمع هذا الموقع الأعراض أو التشخيص أو التاريخ
                المرضي أو الأدوية أو نتائج الفحوصات أو السجلات السريرية.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">حقوقك</h2>
              <p className="mt-3">
                قد تكون لديك حقوق فيما يتعلق بأي بيانات شخصية تُعالَج عنك
                بموجب قانون حماية البيانات المعمول به في دولة الإمارات
                العربية المتحدة، بما في ذلك الحق في معرفة المعلومات التي
                نحتفظ بها عنك، وطلب تصحيحها أو حذفها، وسحب أي موافقة
                قدّمتها في أي وقت. لا يؤثر سحب الموافقة على مشروعية أي
                إجراء تم بالفعل بناءً عليها. بالنسبة لملفات تعريف الارتباط
                التحليلية تحديدًا، يكون السحب فوريًا عبر رابط &ldquo;إعدادات
                ملفات تعريف الارتباط&rdquo; في التذييل. إذا سبق أن قدّمت
                معلومات من خلال نموذج الحجز الخاص بهذا الموقع، أو لأي طلب
                آخر متعلق بحماية البيانات، تواصل معنا باستخدام التفاصيل
                أدناه. أما المعلومات التي تقدّمها مباشرة إلى{" "}
                {AR_IDENTITY.facilityShortName} كجزء من الحجز أو حضور
                استشارة، فيجب توجيه مثل هذه الطلبات إلى{" "}
                {AR_IDENTITY.facilityShortName}.
              </p>
              <p className="mt-3">
                لا يرسل هذا الموقع اتصالات تسويقية، ولن يفعل ذلك إلا بناءً
                على موافقة صريحة ومنفصلة تُؤخَذ لهذا الغرض تحديدًا.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">التغييرات على هذه السياسة</h2>
              <p className="mt-3">
                قد تُحدَّث هذه السياسة من وقت لآخر. يعكس تاريخ &ldquo;آخر
                تحديث&rdquo; أعلاه أحدث مراجعة.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">التواصل</h2>
              <p className="mt-3">
                للاستفسارات حول هذه السياسة، يُرجى استخدام بيانات التواصل
                التي يوفرها {AR_IDENTITY.facilityShortName} لـ{" "}
                {AR_IDENTITY.doctorDisplayName}.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint "src/app/(ar)/ar/(marketing)/privacy/page.tsx" && npm run build` — confirm `/ar/privacy` compiles as a real route.

- [ ] **Step 3: Self-review checklist**

Re-read the file against the English source (`src/app/(en)/(legal)/privacy/page.tsx`, post-Task-2 fix): all 11 sections present in the same order (Introduction, Information We Collect, Cookies and Analytics, Where Information Is Processed, Retention, Booking and Third-Party Links, Data Security, Your Rights, Changes to This Policy, Contact — note the Arabic page's section ORDER matches the English source's actual order, which interleaves Retention before Booking/Third-Party Links; do not reorder). Confirm the "never linked to any personal contact details" fix from Task 2 is reflected in the Arabic Cookies and Analytics section (it is, above) rather than the old stale phrasing. Confirm no `uppercase`/`tracking-widest` classes.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/privacy/page.tsx"
git commit -m "$(cat <<'EOF'
feat(ar): add /ar/privacy (full content parity, no arPath yet)

Complete Arabic translation of all 11 sections of the English source,
including the Task 2 "booking form" phrasing fix. Uses the new
AR_IDENTITY.facilityName/facilityShortName/city/country fields (Task
1) rather than hardcoding facility strings. index: false, matching
the English page — this is a legal/compliance page, not meant for
search indexing, in either language. No arPath registered yet.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Register `arPath` for privacy; flip resolvable links; optional `/ar/book` cleanup

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/lib/seo/routes.test.ts`
- Modify: `src/app/sitemap.test.ts`
- Modify: `src/config/navigation.test.ts` (extend Task 4's new tests)
- Modify: `src/components/ui/ConsentBanner.tsx` (hardcoded href + stale comment)
- Modify (optional, see Step 5): `src/app/(ar)/ar/(marketing)/book/page.tsx`

- [ ] **Step 1: Register the route**

In `src/lib/seo/routes.ts`, change:

```ts
  { path: "/privacy", status: "live", priority: 0.1, index: false },
```

to:

```ts
  { path: "/privacy", status: "live", priority: 0.1, index: false, arPath: "/ar/privacy" },
```

Because `index: false` is already set, `sitemapRoutes` (which filters on `index !== false`) will correctly exclude BOTH `/privacy` and `/ar/privacy` from the sitemap — this is existing, unmodified behavior in `src/app/sitemap.ts`, not something this task needs to special-case. `buildMetadata()` will still generate reciprocal hreflang between the two pages regardless of the noindex status (a `noindex` page can still declare hreflang — the two signals aren't contradictory), which is correct: `/ar/privacy` needs a canonical/hreflang relationship with `/privacy` even though neither should be indexed.

- [ ] **Step 2: Flip the ConsentBanner link + fix its stale comment**

In `src/components/ui/ConsentBanner.tsx`, change the Arabic copy's link (inside the `ar:` key of the `copy` object):

```tsx
    body: (
      <>
        قد يستخدم هذا الموقع ملفات تعريف ارتباط تحليلية لفهم كيفية استخدام الزوار له. لا يتم تضمين
        أي معلومات صحية أو أعراض على الإطلاق. يمكنك القبول أو الرفض، وتغيير اختيارك في أي وقت — راجع{" "}
        <Link href="/privacy" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
          سياسة الخصوصية
        </Link>
        .
      </>
    ),
```

to:

```tsx
    body: (
      <>
        قد يستخدم هذا الموقع ملفات تعريف ارتباط تحليلية لفهم كيفية استخدام الزوار له. لا يتم تضمين
        أي معلومات صحية أو أعراض على الإطلاق. يمكنك القبول أو الرفض، وتغيير اختيارك في أي وقت — راجع{" "}
        <Link href="/ar/privacy" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
          سياسة الخصوصية
        </Link>
        .
      </>
    ),
```

(The English `en:` key's `href="/privacy"` stays completely unchanged.)

And fix the now-stale doc comment above the `copy` const (currently reads, in relevant part): *"R9 Arabic i18n foundation (Phase A) — pure text-localization layer. The Privacy Policy link intentionally stays pointed at `/privacy` (English) for both locales: `/ar/privacy` doesn't exist until Phase C (spec §13/§14)."* — replace that specific paragraph with:

```
 * R9 Arabic i18n foundation (Phase A) — pure text-localization layer.
 * The Privacy Policy link pointed at `/privacy` (English) for both
 * locales until Batch 4, when `/ar/privacy` shipped — the Arabic
 * copy's link now points there; the English copy's link is unchanged.
```

(Keep every other paragraph of that large doc comment — the RTL/font rationale — completely unchanged; only this one paragraph is stale.)

- [ ] **Step 3: Update `routes.test.ts` and `sitemap.test.ts`**

In `routes.test.ts`, add `"/privacy"` to the `withArPath` array in declaration order (after `/insights` — wait, `/insights` itself has no `arPath`, so `/privacy` slots in wherever it sits relative to OTHER arPath-bearing entries; per `routes.ts`'s actual order, `/privacy` comes after `/male-fertility/varicocele` and before `/terms`, so append it at the end of the array):

```ts
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/book",
      "/mens-health",
      "/mens-health/testosterone",
      "/mens-health/vasectomy",
      "/sexual-medicine",
      "/sexual-medicine/premature-ejaculation",
      "/erectile-dysfunction",
      "/erectile-dysfunction/penile-doppler",
      "/penile-implant",
      "/peyronies-disease",
      "/male-aesthetics",
      "/male-aesthetics/penile-girth-enhancement",
      "/male-aesthetics/scrotal-lift",
      "/male-aesthetics/penile-filler-correction",
      "/male-fertility",
      "/male-fertility/varicocele",
      "/privacy",
    ]);
```

Add a `getLocalizedPathPair` test:

```ts
  it("returns the en/ar pair for /privacy, now live in Arabic (Batch 4)", () => {
    expect(getLocalizedPathPair("/privacy")).toEqual({ en: "/privacy", ar: "/ar/privacy" });
  });
```

In `sitemap.test.ts`, **do not** add `/ar/privacy` to the arEntries array — `/privacy`'s `index: false` means neither `/privacy` nor `/ar/privacy` appear in the sitemap at all (see Step 1's reasoning). Instead, add one new test confirming this explicitly, so the noindex+arPath interaction has its own regression coverage:

```ts
  it("excludes /ar/privacy from the sitemap, matching /privacy's index:false (Batch 4)", () => {
    const privacyEntries = entries.filter((e) => e.url.includes("/privacy"));
    expect(privacyEntries).toHaveLength(0);
  });
```

- [ ] **Step 4: Extend `navigation.test.ts`'s privacy test from Task 4**

Task 4 added a test asserting `getLegalNav("ar")`'s Privacy Policy link resolves to `/privacy` ("arPath not registered until Task 6"). Update that test now that it's wrong:

```ts
  it("resolves the Privacy Policy legal-nav link to /ar/privacy now that arPath is registered (Batch 4)", () => {
    const arLinks = getLegalNav("ar");
    const privacyLink = arLinks.find((l) => l.label.includes("الخصوصية"));
    expect(privacyLink?.href).toBe("/ar/privacy");
  });

  it("still resolves the English Privacy Policy legal-nav link to /privacy unchanged", () => {
    const enLinks = getLegalNav("en");
    const privacyLink = enLinks.find((l) => l.label === "Privacy Policy");
    expect(privacyLink?.href).toBe("/privacy");
  });
```

(Replace the old single test with these two — the old one's title and assertion are both now stale.)

- [ ] **Step 5 (optional, small, already-justified): reuse `AR_IDENTITY` in `/ar/book`**

The booking-funnel-correction's final review flagged (Minor, M5) that `/ar/book` hardcodes `"مستشفى إن إم سي رويال – مدينة خليفة"` and `"أبوظبي، الإمارات العربية المتحدة"` directly instead of using a shared constant — at the time, no such granular constant existed. Task 1 of this plan added exactly the fields needed. Apply this now, since it's a direct, trivial consequence of Task 1 existing and costs nothing to skip if it introduces any risk — if the implementer finds this doesn't cleanly match `AR_IDENTITY.facilityName`'s exact wording (`"مستشفى إن إم سي رويال، مدينة خليفة"`, comma not en-dash), use `AR_IDENTITY.facilityName` for the facility-name reference and `AR_IDENTITY.city`/`AR_IDENTITY.country` for the location line, accepting the minor punctuation-style difference (comma vs en-dash) as an improvement toward consistency, not a regression — and if anything about this feels like it risks touching `/ar/book`'s booking behavior, **skip this step entirely** and note it in the task report; it is explicitly optional and must never come at the cost of touching `/ar/book`'s CTA, tracker, or any booking-relevant logic.

In `src/app/(ar)/ar/(marketing)/book/page.tsx`, the "Practice details" section currently has (per the booking correction's Task 9):

```tsx
          <Reveal delay={0.08}>
            <p className="text-eyebrow font-medium text-accent-strong">موقع العيادة</p>
            <p className="mt-4 font-display text-2xl text-foreground">مستشفى إن إم سي رويال – مدينة خليفة</p>
            <p className="mt-2 text-sm text-muted-foreground">أبوظبي، الإمارات العربية المتحدة</p>
          </Reveal>
```

Change to:

```tsx
          <Reveal delay={0.08}>
            <p className="text-eyebrow font-medium text-accent-strong">موقع العيادة</p>
            <p className="mt-4 font-display text-2xl text-foreground">{AR_IDENTITY.facilityName}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {AR_IDENTITY.city}، {AR_IDENTITY.country}
            </p>
          </Reveal>
```

(`AR_IDENTITY` is already imported in this file, used for `AR_IDENTITY.doctorTitle`/`doctorDisplayName` elsewhere on the same page — no new import needed.) If this step is applied, add one test to `src/app/(ar)/ar/(marketing)/book/page.test.ts` (the existing test file from the booking correction) confirming the rendered facility-name text still contains "إن إم سي رويال" and the booking CTA/tracker props are byte-for-byte unchanged from before this edit — i.e. this step touches only static display text, nothing behavioral.

- [ ] **Step 6: Run all affected tests**

Run: `npx vitest run src/lib/seo/routes.test.ts src/app/sitemap.test.ts src/config/navigation.test.ts "src/app/(ar)/ar/(marketing)/book/page.test.ts"`

- [ ] **Step 7: Full verification**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Confirm `/ar/privacy` appears in the build output. Confirm the sitemap step of the build succeeds (it will call `sitemap()`, which must not error on the new noindex+arPath combination).

- [ ] **Step 8: Commit**

```bash
git add src/lib/seo/routes.ts src/lib/seo/routes.test.ts src/app/sitemap.test.ts \
  src/config/navigation.test.ts src/components/ui/ConsentBanner.tsx
# If Step 5 was applied:
git add "src/app/(ar)/ar/(marketing)/book/page.tsx" "src/app/(ar)/ar/(marketing)/book/page.test.ts"
git commit -m "$(cat <<'EOF'
feat(ar): register arPath for /privacy; flip ConsentBanner's Arabic link

/ar/privacy (previous commit) is now discoverable: self-canonical +
reciprocal hreflang via buildMetadata(), correctly excluded from the
sitemap (matching /privacy's own index:false — verified by a new
regression test on that exact interaction). ConsentBanner's Arabic
copy now links to /ar/privacy instead of the English page; its stale
"doesn't exist until Phase C" comment is corrected. Optionally
reuses the new AR_IDENTITY facility fields on /ar/book's practice-
location display text (Batch correction's own M5 minor finding),
touching only static text, verified not to affect booking behavior.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Whole-site Arabic regression sweep

Carries forward the multi-shape link/route search methodology used in every prior batch, refined further after the booking correction's final review found three hardcoded-href instances a directory-scoped search had missed.

- [ ] **Step 1: Repo-wide stale-comment sweep**

```bash
grep -rn "ships Batch 4\|temporary EN destination\|stays temporary EN" src docs --include="*.tsx" --include="*.ts"
```

Every hit referring to `/mens-health/vasectomy` or `/privacy` specifically must already be fixed by Tasks 4/6 — if this grep finds any live-code hit (not inside `docs/superpowers/plans/*.md`, which are historical records and correctly left alone) still describing either route as temporary/unshipped, that is a real gap: fix it in this task. A hit referring to some OTHER still-unbuilt route (e.g. `/mens-health/low-libido`, `/male-fertility/semen-analysis`, both `status: "planned"`) is expected and correct — do not touch those.

- [ ] **Step 2: Unrestricted, shape-agnostic href sweep for both routes**

Run each of these — bare quoted-substring search across the WHOLE `src/` tree, not scoped to any directory, per the lesson from the booking correction's final review (its I1/I2 findings existed specifically because an earlier search was scoped to "the BookingCta component" rather than "everywhere the string `/book` appears"):

```bash
grep -rn '"/mens-health/vasectomy"' src --include="*.tsx" --include="*.ts" | grep -v "\.test\."
grep -rn "'/mens-health/vasectomy'" src --include="*.tsx" --include="*.ts" | grep -v "\.test\."
grep -rn '"/privacy"' src --include="*.tsx" --include="*.ts" | grep -v "\.test\."
grep -rn "'/privacy'" src --include="*.tsx" --include="*.ts" | grep -v "\.test\."
```

For each hit, classify it:
- **English-context file** (e.g. `src/app/(en)/...`, `src/config/navigation.ts`'s `legalNav`/`footerServiceLinks` English arrays, `legacy-redirects.ts`) — correctly stays pointed at the English path. No action.
- **Arabic-context file** (`src/app/(ar)/...`, any `*Ar.tsx` component) with a literal hardcoded English href — this should be zero after Tasks 4 and 6. If this sweep finds one that was missed, fix it now, following the same pattern as Task 4/6's fixes, and note it explicitly in this task's report as a gap those tasks' own more-targeted search missed.
- **A call into `localizeHref()`/`getLocalizedPathPair()`** with the English path as an argument — correct by design (this is exactly how the mechanism is supposed to work), not a hit to fix.

- [ ] **Step 3: Confirm the FlagshipAuthorityFeature-class of bug has no analog here**

Batch 3's final review found a shared, locale-aware component (`FlagshipAuthorityFeature.tsx`) with a hardcoded English href despite being rendered on an Arabic page. Grep specifically for any shared (non-`Ar.tsx`-suffixed, non-`(ar)`-scoped) component that might render on both English and Arabic pages and reference either `/mens-health/vasectomy` or `/privacy`:

```bash
grep -rln "vasectomy\|/privacy" src/components/editorial src/components/sections --include="*.tsx" | grep -v "/ar/"
```

For any hit, read the file and confirm it either (a) doesn't actually render on any Arabic route, or (b) already handles locale-awareness correctly (e.g. via `isArabicPath`/`usePathname`, matching `BookingCta`'s or `Footer.tsx`'s established pattern). Report either finding explicitly — do not silently pass over a hit.

- [ ] **Step 4: Full verification**

Run: `npx tsc --noEmit && npm run lint && npm run test && npm run build`.

- [ ] **Step 5: Commit** (only if Step 2/3 found and fixed anything; otherwise this task ends with a report and no commit)

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(ar): whole-site regression sweep for Batch 4 (vasectomy + privacy)

[Describe exactly what the sweep found and fixed, if anything — or
state explicitly that the sweep found zero additional issues beyond
what Tasks 4 and 6 already fixed, and this commit does not exist.]

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Href/arPath invariant check — a permanent, minimally-scoped safeguard

**Why:** The booking correction's final review found three separate hardcoded-English-href-on-an-Arabic-page bugs (`Footer.tsx`, `MobileNav.tsx`, the Arabic `mens-health/page.tsx`'s own `/book` reference), each missed by a task-scoped search that didn't look broadly enough. This task adds one automated test that makes that entire bug class structurally visible going forward — not by refactoring any component, but by scanning source files directly for the specific failure pattern.

**Scope boundary (binding — do not exceed):** this task creates exactly ONE new test file. It does not modify any existing component, does not change any existing test, does not introduce a build-time lint rule, and does not attempt to validate JSX at runtime. It is a static source-text scan, run once as part of the normal test suite.

**Files:**
- Create: `src/lib/seo/ar-href-invariant.test.ts`

- [ ] **Step 1: Write the test**

```ts
// src/lib/seo/ar-href-invariant.test.ts
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

/**
 * Guards against the exact bug class the R9 booking funnel
 * correction's final review found three instances of: a literal,
 * hardcoded English href sitting inside a file that only ever
 * renders on an Arabic route, for a path that already has a real
 * Arabic equivalent registered in `routes.ts`. Each of those three
 * bugs (Footer.tsx, MobileNav.tsx, the Arabic mens-health hub) was
 * missed by a search scoped too narrowly to "this one component" —
 * this test scans unrestricted, everywhere Arabic-only source lives.
 *
 * Deliberately a plain source-text scan, not a JSX/AST analysis: the
 * failure pattern is "the literal string appears in a file that only
 * renders under /ar", which a substring search catches reliably and
 * without needing to understand React's render tree. False positives
 * are possible (a comment mentioning the English path, an English
 * path that happens to be a substring of a longer Arabic one) — the
 * SCAN_ROOTS/allowlist below exist to keep it exactly as narrow as
 * the real bug class, not broader.
 */

const SCAN_ROOTS = ["src/app/(ar)", "src/components/sections/ar"];

function collectFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      if (!entry.name.endsWith(".test.ts") && !entry.name.endsWith(".test.tsx")) {
        out.push(full);
      }
    }
  }
  return out;
}

// English routes that have a real Arabic equivalent today. A file
// under SCAN_ROOTS containing a literal `"<path>"` or `'<path>'` for
// one of these — NOT prefixed with /ar — is exactly the bug class
// this test exists to catch.
const routesWithArPath = routes.filter((r): r is typeof r & { arPath: string } => Boolean(r.arPath));

describe("Arabic-only source never hardcodes an English href with a live Arabic equivalent", () => {
  const files = SCAN_ROOTS.flatMap((root) => collectFiles(root));

  it("scanned at least one file per root (sanity check that the scan itself isn't silently empty)", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const route of routesWithArPath) {
    it(`no Arabic-only file hardcodes "${route.path}" (should be "${route.arPath}")`, () => {
      const offenders: string[] = [];
      for (const file of files) {
        const content = readFileSync(file, "utf-8");
        const doubleQuoted = `"${route.path}"`;
        const singleQuoted = `'${route.path}'`;
        if (content.includes(doubleQuoted) || content.includes(singleQuoted)) {
          offenders.push(file);
        }
      }
      expect(offenders).toEqual([]);
    });
  }
});
```

- [ ] **Step 2: Run it against the current tree — it must pass immediately**

Run: `npx vitest run src/lib/seo/ar-href-invariant.test.ts`

Expected: all tests pass, given Tasks 4 and 6 already fixed every known instance and Task 7's sweep confirmed no others exist. If this test fails on first run, that means Task 7's sweep missed something real — go fix it (do not weaken this test to make it pass; the test is correct, the source is not).

- [ ] **Step 3: Verify the test actually catches the bug class it's designed for**

This is worth proving once, not left as an assumption. Temporarily (in a scratch, uncommitted edit) reintroduce one of the three original bugs — e.g. change `src/app/(ar)/ar/(marketing)/mens-health/page.tsx`'s vasectomy href back to the bare English path — and confirm this new test fails with a clear message naming that exact file. Then revert the scratch edit (`git checkout -- "src/app/(ar)/ar/(marketing)/mens-health/page.tsx"`) before continuing. Record in the task report that this was done and what the failure looked like — this is the evidence that the invariant check is real, not just present.

- [ ] **Step 4: Full verification**

Run: `npx tsc --noEmit && npm run lint && npm run test` — confirm the new test file is picked up by the full suite and passes alongside everything else.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/ar-href-invariant.test.ts
git commit -m "$(cat <<'EOF'
test(ar): add a permanent invariant check against hardcoded English hrefs

Scans every file under src/app/(ar) and src/components/sections/ar
for a literal hardcoded href matching any route that already has a
live arPath — the exact bug class the booking correction's final
review found three instances of (Footer.tsx, MobileNav.tsx, the
Arabic mens-health hub), each missed by a component-scoped search
rather than an unrestricted one. Purely additive: one new test file,
no existing component or test touched. Verified to actually catch
the bug class by temporarily reintroducing one of the three original
instances and confirming this test fails on it (see task report).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Final whole-branch review of Batch 4

Follow the same process as every prior batch and the booking correction: full verification suite, then a final review dispatched on the most capable available model, scoped to this batch's own commits (from the tip of the booking correction's fix wave through this batch's last commit) — not the entire multi-week branch history, per the ruling already established and re-applied identically here.

- [ ] **Step 1: Full verification suite**

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
git diff --check
```

All five must pass clean.

- [ ] **Step 2: Final review**

Dispatch on the most capable available model. Point it at: this plan's Global Constraints, the SDD ledger for this plan (rulings made during implementation), and the diff range from the booking correction's last commit through this batch's last commit. Ask it to specifically verify: (a) genuine content parity on both new pages against their English sources (not just "a page exists"); (b) the `/ar/mens-health/vasectomy` and `/ar/privacy` routes are reachable from at least one real sitewide navigation path (not just directly-typed URLs); (c) the invariant test from Task 8 is real (re-derive or trust the task report's reintroduction-test evidence); (d) no lead-form/email-capture/discussion-topic/enquiry-CTA was introduced anywhere, on either new page or any file touched by this batch; (e) `/ar/book` was either untouched or, if Task 6 Step 5 was applied, that the change is genuinely display-text-only with no behavioral difference.

- [ ] **Step 3: Fix wave (if findings) and adjudication**

Same process as every prior final review in this branch: one fix dispatch covering all Critical/Important findings together, one scoped re-review, park or rule on any residual at the cap.

- [ ] **Step 4: Report**

Produce a short completion report (files changed, both pages' word/section counts vs. English sources as parity evidence, the exact sitemap/hreflang entries added, the invariant test's reintroduction-test result) before proceeding to Task 10.

---

### Task 10: Push, wait for Preview, and produce the final consolidated Phase B route-by-route Preview report

This is the "one consolidated Preview deploy and final route-by-route parity matrix" the architecture spec always intended to happen after Batch 4 — and the owner's explicit request to "produce one final complete Phase B Preview and stop for owner review."

**Known environment constraint, carried forward from the booking correction:** this session has no GitHub push credentials (`git push` returns 403; no `gh auth`; SSH to GitHub times out). The booking correction's Preview was only reachable after the owner pushed the branch from their own machine. **The controller must ask the owner to push again** before this task's Preview verification can run — do not attempt to work around this with a manual Vercel file-upload (already established as impractical for this asset-heavy app) and do not skip this task's verification and merely claim it's done.

- [ ] **Step 1: Ask the owner to push**

State plainly, before doing anything else in this task: "Batch 4 is committed locally on `feat/arabic-localization-r9-phase-b`. Please push the branch so I can verify the resulting Preview." Wait for confirmation.

- [ ] **Step 2: Wait for the Vercel deployment matching the new HEAD commit to become READY**

Use `list_deployments`/`get_deployment` (Vercel MCP) exactly as in the booking correction's Preview verification — match on `meta.githubCommitSha` equal to the new local `HEAD`, not just "the newest deployment" (a stale build could otherwise be mistaken for the current one).

- [ ] **Step 3: Obtain Preview access**

Use `get_access_to_vercel_url` (Vercel MCP) to get a temporary owner-account bypass link, exactly as before, and establish a `curl` cookie jar from it.

- [ ] **Step 4: Route-by-route parity matrix — every Arabic route shipped across Batches 1–4 plus the booking correction**

For each of the following, `curl` both the English and Arabic URL through the bypass jar and confirm: HTTP 200, `lang`/`dir` attributes correct (`en`/`ltr` vs `ar`/`rtl`), and — for the two new Batch 4 routes specifically — no `<form>` element (matching the "no enquiry CTA, no manual contact workflow" constraint) and the presence of at least one section heading confirming real translated content, not a stub:

| English | Arabic |
|---|---|
| `/` | `/ar` |
| `/about` | `/ar/about` |
| `/book` | `/ar/book` |
| `/mens-health` | `/ar/mens-health` |
| `/mens-health/testosterone` | `/ar/mens-health/testosterone` |
| `/mens-health/vasectomy` | `/ar/mens-health/vasectomy` **(new this batch)** |
| `/sexual-medicine` | `/ar/sexual-medicine` |
| `/sexual-medicine/premature-ejaculation` | `/ar/sexual-medicine/premature-ejaculation` |
| `/erectile-dysfunction` | `/ar/erectile-dysfunction` |
| `/erectile-dysfunction/penile-doppler` | `/ar/erectile-dysfunction/penile-doppler` |
| `/penile-implant` | `/ar/penile-implant` |
| `/peyronies-disease` | `/ar/peyronies-disease` |
| `/male-aesthetics` | `/ar/male-aesthetics` |
| `/male-aesthetics/penile-girth-enhancement` | `/ar/male-aesthetics/penile-girth-enhancement` |
| `/male-aesthetics/scrotal-lift` | `/ar/male-aesthetics/scrotal-lift` |
| `/male-aesthetics/penile-filler-correction` | `/ar/male-aesthetics/penile-filler-correction` |
| `/male-fertility` | `/ar/male-fertility` |
| `/male-fertility/varicocele` | `/ar/male-fertility/varicocele` |
| `/privacy` | `/ar/privacy` **(new this batch)** |

- [ ] **Step 5: Spot-check the sitewide link fixes are live**

`curl` the Arabic mens-health hub, `curl` the Arabic homepage (for `CoreExpertiseSectionAr`'s secondary links), and grep the response bodies for `href="/ar/mens-health/vasectomy"` (expect ≥1 hit, 0 hits for a bare `href="/mens-health/vasectomy"`), and similarly confirm the Arabic consent banner (visible on first load, before any consent cookie is set) links to `/ar/privacy`, not `/privacy`.

- [ ] **Step 6: Confirm `/privacy` and `/ar/privacy` are correctly absent from the live sitemap**

`curl` `/sitemap.xml` through the bypass jar and confirm neither `/privacy` nor `/ar/privacy` appear anywhere in it — matching the `index: false` design confirmed in Task 6.

- [ ] **Step 7: Produce the final report and stop**

Report to the owner: the Preview URL; the full route-by-route parity matrix (Step 4's table, each row marked pass/fail with evidence); the link-fix spot-checks (Step 5); the sitemap confirmation (Step 6); a summary of what Batch 4 added (two new pages, full content parity, one new automated invariant test, all stale comments resolved); confirmation that no lead-form/email-capture/discussion-topic/enquiry-CTA exists anywhere on the site (structurally guaranteed — nothing in this batch touches the booking funnel at all); and explicit confirmation of what did NOT happen: no merge to `main`, no Production deploy. Then **stop** for owner review, per the owner's explicit instruction — this is the end of R9 Phase B's Arabic localization work as currently scoped.
