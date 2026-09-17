# R9 Phase B — Batch 3 (Male Aesthetics) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship genuine Arabic versions of `/male-aesthetics/penile-girth-enhancement`, `/male-aesthetics/penile-filler-correction`, `/male-aesthetics/scrotal-lift` at their `/ar/...` equivalents — full content depth, no shortened summaries, and no dilution or amplification of this batch's clinical-tone constraints (see Global Constraints) — plus the one shared-component fix this batch's flagship page requires, and every now-resolvable cross-link flip across the whole site (not just this batch's own pages), found via a **multi-shape structural search**, not a single `href="..."` grep.

**Architecture:** Same as Batches 1–2 (see architecture spec). One `page.tsx` per route under `src/app/(ar)/ar/(marketing)/male-aesthetics/<slug>/page.tsx`, Arabic content inlined directly, composing shared UI/section/editorial components. This batch's shared-component audit found one new gap: `src/components/editorial/ProcedureFramework.tsx` exports four components (`ClinicalPathway`, `ProcedureFramework`, `VariabilityFactors`, `CareStages`) used only by the flagship `penile-girth-enhancement` page, all fully hardcoded English with zero locale awareness — Task 1 fixes all four before Task 2 needs them. `PhysicianAuthority` (used with its `dark` prop on the flagship page) and every other component these three pages touch were already confirmed locale-aware or fully prop-driven in earlier batches, verified again here by direct reading. Once infra is done, the three pages compose it (Tasks 2–4). Then `arPath` gets registered for all three in `routes.ts`, and — this batch's key process change — every temporary-English link to these three destinations anywhere on the Arabic site gets flipped, found via a search that checks every shape a route reference can take (`href="..."` JSX attribute, `href: "..."` object property, values inside arrays/CTA-config objects/component props/metadata objects), not the single JSX-attribute-shaped grep that missed 13 links in Batch 2.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md` (shared across all 4 batches) — read it first. Batches 1 and 2's plans (`docs/superpowers/plans/2026-09-13-r9-phase-b-batch1-core-hubs.md`, `docs/superpowers/plans/2026-09-13-r9-phase-b-batch2-clinical-pages.md`) are the reference implementations for every convention referenced here — all already committed and confirmed live on this branch. Batch 2's final whole-branch review (see that plan's git history around commits `d3ea7c5`/`3c5d47f`) found and fixed two live defects this plan explicitly designs around: (1) a link-flip task that only searched `href="..."` JSX form missed 13 stale links in `href: "..."` object-property form — Task 5 below uses a shape-agnostic search from the start; (2) a clinical-terminology inconsistency (`زراعة القضيب` read as ambiguous, since corrected sitewide to `دعامة القضيب`/`جراحة زراعة دعامة القضيب`) — this batch's own new content must not introduce a parallel inconsistency for its own procedures, so Global Constraints below pin the exact, already-established Arabic terms for all three procedures.

## Global Constraints

- Work happens in the existing worktree `.worktrees/feat-arabic-localization-r9-phase-b`, branch `feat/arabic-localization-r9-phase-b`. No new worktree, no new branch. Batches 1–2 plus the post-Batch-2 terminology fix are already fully committed on this branch (`git log` confirms through `5c0d174`) and `npm run typecheck`/`lint`/`test` all pass clean at the start of this batch — verified directly before writing this plan.
- **Clinical-tone constraints (owner's explicit brief for this batch — binding on every page, not stylistic preference):** premium tone; proportion (not maximum size/volume); contour; anatomy-led planning; realistic expectations; staged treatment where appropriate; correction expertise; **no exaggerated enlargement claims**; **no proprietary technique disclosure**. The English source pages already embody every one of these (e.g. `penile-girth-enhancement`'s own code comment: "Dr. Molina's Approach — the genuine clinical philosophy behind the flagship procedure, **without exposing procedural technique**"; its FAQ explicitly declines to publish outcome numbers: "specific outcome measurements aren't published here — they're discussed in detail... at consultation"). Translation must preserve every hedge, caveat, and declined claim exactly — never soften a limitation into a promise, and never add specificity (a number, a technique name, a guarantee) that the English source deliberately omits.
- **Established Arabic terminology — reuse verbatim, do not re-coin:** confirmed by reading the already-live `/ar/male-aesthetics` hub page (Batch 1) directly before writing this plan:
  - Penile Girth Enhancement → `زيادة سماكة القضيب` (used pervasively already: homepage sections, `/ar/about`, `/ar/male-aesthetics` hub CTA).
  - Penile Filler Correction → `تصحيح حشو القضيب` (used as the hub's own CTA label and card title).
  - Scrotal Lift → `شد الصفن` (used as the hub's own CTA label and card title).
  - Male Genital Aesthetics (breadcrumb parent) → `التجميل الذكوري`.
  - Doctor identity: `AR_IDENTITY.doctorTitle`/`AR_IDENTITY.doctorDisplayName` (from `src/lib/i18n/ar-identity.ts`) — never a new local literal.
  - Training positioning line: `AR_REPUTATION.trainingPositioningLine` (from `src/lib/i18n/ar-reputation.ts`) mirrors `trainingPrograms[0].positioningLine` — reuse it on the flagship page rather than retranslating.
  - Post-terminology-fix vocabulary from the immediately-preceding fix (commits `3c5d47f`/`5c0d174`) has no overlap with this batch's three procedures (that fix was scoped to `دعامة القضيب`/penile implant only) — nothing to reconcile here, but any future reference these three pages make to penile implants (none currently do) would need to use that vocabulary.
- **Letter-spacing discipline (from all prior batches):** `tracking-widest`/`tracking-[0.2em]` must NEVER apply to Arabic-language text.
- **`BookingCta`/`TreatmentCtaSection` explicit-text rule (from all prior batches):** every Arabic call site passes explicit Arabic text, even where the English source relies on a shared constant like `BOOKING_LABEL` or the component's own default.
- **`AmpersandText` is never used on Arabic pages** (Arabic uses `و`, not `&`) — none of this batch's three English sources use it either, so this is a non-issue here, noted for completeness.
- **No invented `/ar/*` destination URLs.** Per outbound link, confirmed by reading both the English sources and the current state of `routes.ts`/live Arabic pages before writing this plan:
  - Live in Arabic already: `/male-aesthetics` → `/ar/male-aesthetics` (Batch 1), `/erectile-dysfunction` → `/ar/erectile-dysfunction` (Batch 2), `/peyronies-disease` → `/ar/peyronies-disease` (Batch 2), `/about` → `/ar/about` (Batch 1).
  - Live in Arabic by the end of *this* batch (all three ship together): `/male-aesthetics/penile-girth-enhancement`, `/male-aesthetics/penile-filler-correction`, `/male-aesthetics/scrotal-lift`.
  - `/insights/...` links stay English per the owner's brief (Insights out of scope), labels marked `(مقال بالإنجليزية)`.
- **Multi-shape link search is mandatory, not optional, for Task 5 and Task 7 (QA).** A single `grep -rn 'href="..."'` is insufficient — it is exactly the pattern that missed 13 real links in Batch 2. Every search in this plan for outbound-link occurrences must check the bare quoted path string regardless of what precedes it (`href:`, `href=`, `readMoreHref:`, inside an array literal, inside a `secondary={{ ... }}` object, inside a `cta: { href: ... }` config object, inside `navigation.ts`'s `NavItem[]` arrays). The concrete pattern (confirmed to work in Batch 2's fix): `grep -rn '"path"'` — a bare double-quoted path substring — across every candidate file, then manually classify each hit, rather than pre-supposing a syntactic shape.
- **`localizeHref`/`getLocalizedPathPair` self-healing nav entries need no manual edit.** Confirmed by reading `src/config/navigation.ts` directly: `primaryNavAr` and `footerServiceLinksAr` write hrefs as canonical English paths and resolve them through `localizeHref(item.href, locale)` at call time, which itself calls `getLocalizedPathPair` — once `arPath` is registered in `routes.ts` for a route, any nav entry referencing that route's canonical English path automatically resolves to the Arabic path with no further code change. `primaryNavAr` line 87 and `footerServiceLinksAr` line 114 (`penile-girth-enhancement`) are exactly this pattern — do not "fix" them; Task 5 explicitly verifies they need no edit rather than skipping them out of uncertainty.
- No new unit tests for presentational components/pages — matches the established convention. Verification is `npm run typecheck` + targeted grep/read checks per task, and a final `npm run build`/`lint`/`test` pass. **Exception carried forward from Batch 2's own final-verification finding:** if any task in this plan touches a file with pre-existing hardcoded-list tests (as `routes.ts`/`sitemap.ts` did in Batch 2), that task's own steps must update those tests in the same task — do not defer route-registry test maintenance to a later "final verification" surprise.
- No push, no Preview deploy, no PR update, **no merge to `main`, no Production deploy** after this batch — explicit owner instruction, carried forward unchanged from Batches 1–2.

---

### Task 1: Add `locale="ar"` support to `ProcedureFramework.tsx`'s four exports

Found during this batch's shared-component audit: `ClinicalPathway`, `ProcedureFramework`, `VariabilityFactors`, and `CareStages` are used only by the English `penile-girth-enhancement` page (confirmed via `grep -rl` across `src/app/` — no other consumer exists), and every one of the four is fully hardcoded English with no `locale` prop. `CareStages` additionally takes an `items` prop (already generic per-item `title`/`description`/`href`/`linkLabel`), but its internal three-item stage-label array (`"Understand before treatment"`, etc.) is hardcoded and unindexed by any prop.

**Files:**
- Modify: `src/components/editorial/ProcedureFramework.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import Link from "next/link";
import { Layers3, Scan, Pipette, Ruler, Activity, CalendarCheck } from "lucide-react";
import styles from "./Editorial.module.css";

const stepsEn = [
  ["Consultation", "Discuss your goals, medical history and expectations."],
  ["Anatomical assessment", "Assess individual anatomy and any previous treatment."],
  ["Individual treatment planning", "Discuss suitability, options, limitations and risks."],
  ["Procedure", "Proceed only after assessment and an agreed treatment plan."],
  ["Settling / tissue adaptation period", "Follow the aftercare guidance specific to your procedure."],
  ["Follow-up", "Review your progress and any concerns with your clinician."],
];

const stepsAr = [
  ["الاستشارة", "مناقشة أهدافك وتاريخك المرضي وتوقعاتك."],
  ["التقييم التشريحي", "تقييم التشريح الفردي وأي علاج سابق."],
  ["التخطيط العلاجي الفردي", "مناقشة الملاءمة والخيارات والحدود والمخاطر."],
  ["الإجراء", "يُنفَّذ فقط بعد التقييم والاتفاق على خطة العلاج."],
  ["فترة الاستقرار / تكيّف الأنسجة", "اتباع إرشادات الرعاية اللاحقة الخاصة بإجرائك."],
  ["المتابعة", "مراجعة تقدمك وأي مخاوف مع طبيبك المعالج."],
];

export function ClinicalPathway({ locale }: { locale?: "ar" } = {}) {
  const steps = locale === "ar" ? stepsAr : stepsEn;
  return <ol className={styles.pathway}>{steps.map(([title,body],index)=><li className={styles.step} key={title}>
    <span className={styles.stepNumber}>{String(index+1).padStart(2,"0")}</span>
    <h3 className="mt-3 font-display text-xl">{title}</h3><p className="mt-3 max-w-xs text-sm text-muted-foreground">{body}</p>
  </li>)}</ol>;
}

export function ProcedureFramework({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  return <figure className={styles.framework}>
    <p className={`text-xs uppercase text-accent-strong ${isAr ? "" : "tracking-widest"}`}>{isAr ? "إطار التخطيط" : "The planning framework"}</p>
    <svg viewBox="0 0 500 360" className={styles.contour} fill="none" aria-hidden="true">
      {[0,1,2,3,4].map(i=><ellipse key={i} cx="250" cy="170" rx={60+i*26} ry={45+i*21} transform={`rotate(-25 250 170)`} stroke="currentColor" strokeWidth={i===2?2:1} />)}
      <path d="M55 170H445M250 20V320" stroke="currentColor" strokeDasharray="3 7" opacity=".5" />
      <circle cx="250" cy="170" r="5" fill="currentColor" />
    </svg>
    <figcaption className="text-sm text-muted-foreground">{isAr ? "التشريح · خصائص الأنسجة · العلاج السابق" : "Anatomy · Tissue characteristics · Previous treatment"}<br /><span className="mt-2 block text-xs">{isAr ? "رسم توضيحي تجريدي للتخطيط" : "Abstract planning illustration"}</span></figcaption>
  </figure>;
}

const variabilityFactorsEn = [
  { label: "Anatomy", Icon: Scan },
  { label: "Technique", Icon: Layers3 },
  { label: "Product", Icon: Pipette },
  { label: "Volume", Icon: Ruler },
  { label: "Tissue response", Icon: Activity },
  { label: "Follow-up", Icon: CalendarCheck },
];

const variabilityFactorsAr = [
  { label: "التشريح", Icon: Scan },
  { label: "التقنية", Icon: Layers3 },
  { label: "المنتج", Icon: Pipette },
  { label: "الحجم", Icon: Ruler },
  { label: "استجابة الأنسجة", Icon: Activity },
  { label: "المتابعة", Icon: CalendarCheck },
];

export function VariabilityFactors({ locale }: { locale?: "ar" } = {}) {
  const variabilityFactors = locale === "ar" ? variabilityFactorsAr : variabilityFactorsEn;
  return <ul className={styles.variables}>{variabilityFactors.map(({ label, Icon }) => <li key={label}>
    <Icon aria-hidden="true" strokeWidth={1.25} /><p className="font-display text-xl">{label}</p>
  </li>)}</ul>;
}

type CareStage = {title:string;description:string;href?:string;linkLabel?:string};
const careStageLabelsEn = ["Understand before treatment","Care during recovery","Assess concerns individually"];
const careStageLabelsAr = ["افهم قبل العلاج","العناية أثناء التعافي","تقييم المخاوف بشكل فردي"];

export function CareStages({items, locale}: {items:CareStage[]; locale?: "ar"}) {
  const isAr = locale === "ar";
  const stageLabels = isAr ? careStageLabelsAr : careStageLabelsEn;
  return <ol className={styles.care}>{items.map((item,index)=><li key={item.title}>
    <span className={styles.stepNumber}>{String(index+1).padStart(2,"0")}</span>
    <div><p className={`text-xs uppercase text-foreground ${isAr ? "" : "tracking-widest"}`}>{stageLabels[index]}</p><h3 className="mt-2 font-display text-2xl">{item.title}</h3><p className="mt-3 text-sm text-muted-foreground">{item.description}</p>{item.href && <Link className="mt-4 inline-block text-sm underline decoration-accent-strong underline-offset-4" href={item.href}>{item.linkLabel}</Link>}</div>
  </li>)}</ol>;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -rn "ClinicalPathway\|ProcedureFramework()\|VariabilityFactors\|CareStages" src/app/\(en\)` — confirm the existing English call site (`penile-girth-enhancement/page.tsx`) omits `locale` on all four — renders unchanged (English arrays/labels, `tracking-widest` retained).

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/ProcedureFramework.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to ProcedureFramework.tsx's four exports

ClinicalPathway, ProcedureFramework, VariabilityFactors, and CareStages
were fully hardcoded English with no locale awareness — needed for
Batch 3's flagship /ar/male-aesthetics/penile-girth-enhancement page,
their only consumer.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Build `/ar/male-aesthetics/penile-girth-enhancement`

Mirrors `src/app/(en)/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx` section-for-section — this is the flagship procedure page and the largest/most content-dense of the three. Uses `ProcedureFramework`'s four exports with `locale="ar"` (Task 1), and `PhysicianAuthority` with both `dark` and `locale="ar"` (already supports both, confirmed by reading the component directly).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx`

**Link status:** `/male-aesthetics` (breadcrumb parent, related, secondary CTA, "About" panel link target `/about`) → `/ar/male-aesthetics` (live, Batch 1) and `/ar/about` (live, Batch 1). `/male-aesthetics/penile-filler-correction` (Correction Expertise pillar, Risks/Aftercare/Revision `CareStages` item, RelatedTreatments) → `/ar/male-aesthetics/penile-filler-correction` (live, this batch — Task 3). `/erectile-dysfunction` → `/ar/erectile-dysfunction` (live, Batch 2). `/peyronies-disease` → `/ar/peyronies-disease` (live, Batch 2).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";
import { doctor } from "@/config/doctor";
import { trainingPrograms } from "@/config/reputation";
import { PhysicianAuthority } from "@/components/editorial/PhysicianAuthority";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { ClinicalPathway, ProcedureFramework, VariabilityFactors, CareStages } from "@/components/editorial/ProcedureFramework";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-aesthetics/penile-girth-enhancement";

export const metadata: Metadata = buildMetadata({
  title: "زيادة سماكة القضيب بحمض الهيالورونيك",
  description:
    "زيادة سماكة القضيب المتخصصة في أبوظبي مع د. أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة — أكثر من 500 إجراء منجز، خبرة منذ 2018. نهج قائم على التشريح، خيارات حمض الهيالورونيك والجراحة، وتوقعات واقعية.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: "/ar/male-aesthetics" },
  { name: "زيادة سماكة القضيب", href: PATH },
];

const strapline = ["قائم على التشريح", "تحت إشراف طبي", "مخطط له فرديًا"];

const options = [
  {
    label: "غير جراحي: حمض الهيالورونيك",
    description:
      "يُحقن حمض الهيالورونيك لزيادة السماكة، ويُخطَّط له وفقًا للتشريح الفردي. تؤثر التقنية واختيار المنتج والرعاية اللاحقة جميعها على النتيجة، ويُجرى العلاج ضمن سياق طبي بقيادة طبيب الذكورة — وهو نقطة البداية الأكثر مناقشة عند الاستشارة. تدعم الأدبيات السريرية المنشورة حمض الهيالورونيك كخيار لزيادة سماكة القضيب، رغم أن النتائج تختلف باختلاف التشريح والتقنية وخطة العلاج المختارة — ولهذا فإن التخطيط الفردي أهم من أي رقم منشور بمفرده.",
  },
  {
    label: "الخيارات الجراحية",
    description:
      "لا تُطرح الخيارات الجراحية لتكبير القضيب إلا حيث تكون معتمدة حاليًا ومناسبة سريريًا، وتُناقش بشكل فردي — لا كنقطة بداية مفترضة.",
  },
];

const approachPillars = [
  {
    title: "التشريح أولاً",
    description:
      "يُخطَّط العلاج وفقًا للتشريح الفردي، لا وفق بروتوكول ثابت يُطبَّق بالطريقة نفسها على كل مريض. ما يناسب تشريح رجل قد لا يناسب آخر، ويعكس التخطيط ذلك منذ الاستشارة الأولى.",
  },
  {
    title: "التناسب فوق أقصى حجم",
    description:
      "الهدف هو التناسب الطبيعي والملامس والتماثل — لا أكبر حجم يمكن تحقيقه في جلسة واحدة. السؤال السريري الأساسي هو ما يبدو ويُشعَر به متناسبًا لتشريح مريض معين، لا كمية المنتج التي يمكن حقنها.",
  },
  {
    title: "تخطيط علاجي فردي",
    description:
      "يُشكِّل التشريح وخصائص الأنسجة وأي إجراءات سابقة وحالة الختان والأهداف الشخصية جميعها الخطة. يمكن أن يحصل مريضان بأهداف متشابهة على خطط علاج مختلفة، لأن تشريحهما وتاريخهما يختلفان.",
  },
  {
    title: "علاج مرحلي عند الحاجة",
    description:
      "لا يُناسب كل مريض علاجًا كاملًا مخططًا له في جلسة واحدة. حيثما كان ذلك مناسبًا، يُقسَّم العلاج على مراحل، مما يتيح تقييم استجابة الأنسجة قبل أي قرار بشأن حجم إضافي.",
  },
  {
    title: "تقييم بقيادة طب الذكورة",
    description:
      "يُقيَّم التشريح التناسلي والوظيفة الجنسية ضمن سياق طب المسالك البولية والذكورة، لا كخدمة حقن تجميلية عامة — لأن التشريح نفسه الذي يحدد التخطيط الجمالي يرتبط أيضًا بوظيفة الانتصاب والوظيفة الجنسية.",
  },
  {
    title: "متابعة منظمة",
    description:
      "لا ينتهي الإجراء عند انتهاء جلسة العلاج. تتيح المتابعة مراجعة استقرار الأنسجة ومعالجة أي مخاوف كجزء من المسار المخطط له، لا أن تُترك للمريض ليثيرها من تلقاء نفسه.",
  },
  {
    title: "خبرة في التصحيح",
    description:
      "يمكن تقييم الحشو السابق — سواء أُجري هنا أو في مكان آخر — بما في ذلك عدم الانتظام أو عدم التماثل أو العقيدات أو الانزياح، بشكل منفصل ومفصّل.",
    href: "/ar/male-aesthetics/penile-filler-correction",
    linkLabel: "استكشف تصحيح حشو القضيب",
  },
];

const afterConsiderations = [
  {
    title: "المخاطر",
    description:
      "كما هو الحال مع أي إجراء تكبير، يمكن أن تشمل المخاطر التورم أو الكدمات أو عدم التماثل أو عدم الانتظام أو عدم الرضا عن النتيجة المحققة. تُراجَع هذه المخاطر بشكل فردي، بناءً على الخيار المطروح.",
  },
  {
    title: "الرعاية اللاحقة",
    description:
      "تُقدَّم إرشادات الرعاية اللاحقة بعد أي إجراء، وتكون خاصة بالخيار المختار، وتُناقش كجزء من خطة علاجك الفردية.",
  },
  {
    title: "التصحيح / المراجعة",
    description:
      "عندما لا يكون المريض راضيًا عن إجراء سابق — سواء أُجري هنا أو في مكان آخر — تُقيَّم المراجعة بشكل فردي، مع مراعاة العلاج الأصلي والتشريح الحالي.",
    href: "/ar/male-aesthetics/penile-filler-correction",
    linkLabel: "استكشف تصحيح حشو القضيب",
  },
];

const faqItems = [
  {
    question: "هل زيادة سماكة القضيب آمنة؟",
    answer:
      "لا يوجد إجراء تجميلي أو طبي خالٍ تمامًا من المخاطر. ما تعتمد عليه السلامة فعليًا هو التقييم القائم على التشريح مسبقًا، والتقنية، وخطة علاج تُلائم نسيج الفرد — لا المنتج وحده. يُجرى الإجراء ضمن ممارسة استشاري أمراض المسالك البولية والذكورة، وتُناقش مخاطر مثل التورم أو الكدمات أو عدم التماثل أو عدم الانتظام وتُراجَع بشكل فردي قبل المضي قدمًا، لا أن تُستبعد. انظر المخاطر والرعاية اللاحقة والمراجعة أدناه للتفاصيل.",
  },
  {
    question: "كم مقدار الزيادة في الحجم يمكن أن أتوقعه؟",
    answer:
      "يعتمد ذلك على ثلاثة أمور: تشريحك الأساسي ومرونة أنسجتك، والتقنية والحجم المخطط لعلاجك، وما إذا كان العلاج يُقدَّم في جلسة واحدة أو على مراحل. ولأن هذه العوامل الثلاثة تختلف بشكل كبير بين المرضى، لا تُنشر قياسات نتائج محددة هنا — بل تُناقش بالتفصيل، وفي سياق تشريحك الخاص، أثناء الاستشارة.",
    readMoreHref: "/insights/how-much-girth-can-penile-filler-add",
    readMoreLabel: "اقرأ المزيد: How Much Girth Can Penile Filler Actually Add? (مقال بالإنجليزية)",
  },
  {
    question: "هل هذا جراحي أم غير جراحي؟",
    answer:
      "يُنظر في كلا الخيارين. تُناقش الخيارات غير الجراحية، بما في ذلك الزيادة القائمة على حمض الهيالورونيك، أولاً بشكل أكثر شيوعًا؛ ولا تُطرح الخيارات الجراحية إلا حيث تكون معتمدة حاليًا ومناسبة سريريًا.",
  },
  {
    question: "ماذا لو كانت لدي تجربة سيئة مع الحشو في مكان آخر؟",
    answer:
      "يركز التقييم على تشريحك وحالتك الحالية — عدم التماثل وعدم الانتظام والعقيدات أو الانزياح المشتبه به هي النتائج المحددة التي يبحث عنها — لا على المزود أو المنتج الأصلي. تُدرَس المراجعة، بما في ذلك الإذابة عند الاقتضاء، بشكل فردي بمجرد اكتمال ذلك التقييم.",
    readMoreHref: "/ar/male-aesthetics/penile-filler-correction",
    readMoreLabel: "استكشف تصحيح حشو القضيب",
  },
  {
    question: "هل النتيجة دائمة؟",
    answer:
      "لا — يتحلل حمض الهيالورونيك تدريجيًا في الجسم بمرور الوقت، ولهذا لا تكون النتيجة دائمة عادةً. تختلف مدة بقائها باختلاف المنتج المستخدم والحجم والتقنية والأيض الفردي؛ وتُناقش الخيارات الجراحية، عند الاقتضاء، بشكل منفصل لأن ملف استمراريتها يختلف.",
    readMoreHref: "/insights/how-long-does-penile-filler-last",
    readMoreLabel: "اقرأ المزيد: How Long Does Penile Filler Last? (مقال بالإنجليزية)",
  },
  {
    question: "ماذا تتضمن الرعاية اللاحقة؟",
    answer:
      "بشكل عام، تشمل الرعاية اللاحقة قيودًا على النشاط خلال فترة الاستقرار الأولية، وما يمكن توقعه من تورم أو صلابة مقابل ما يستدعي التواصل مع العيادة، ومراجعة متابعة مجدولة بمجرد استقرار الأنسجة. تُصمَّم الإرشادات المحددة التي تتلقاها وفقًا للخيار والحجم المخطط لك.",
  },
  {
    question: "هل يمكن أن ينزاح الحشو أو تتكوّن عقيدات؟",
    answer:
      "من الممكن ذلك، رغم أن هذا ليس المسار المتوقع أو النموذجي. الانزياح والعقيدات نتائج محددة يبحث عنها التقييم في المتابعة وفي أي مراجعة لاحقة — وليست شيئًا يُترك للمرضى لتشخيصه بأنفسهم. يُعد الاشتباه بالانزياح أو ظهور عقيدة جديدة سببًا معقولاً لطلب التقييم، سواء أُجري العلاج الأصلي هنا أو في مكان آخر.",
    readMoreHref: "/insights/penile-filler-nodules-and-irregularities",
    readMoreLabel: "اقرأ المزيد: Penile Filler Nodules and Irregularities (مقال بالإنجليزية)",
  },
  {
    question: "هل يمكنني الخضوع للعلاج إذا لم أكن مختونًا؟",
    answer:
      "حالة الختان أحد العوامل التشريحية التي تُراجَع أثناء التقييم وتُؤخذ بعين الاعتبار في التخطيط — ولا تستبعد العلاج أو تسمح به بمفردها. ما يهم هو كيفية تفاعلها مع تشريحك وأهدافك المحددة، ويُقيَّم ذلك بشكل فردي لا افتراضي.",
  },
  {
    question: "هل يؤثر الإجراء على الانتصاب أو الإحساس؟",
    answer:
      "يستهدف العلاج جلد الجسم الأسطواني والأنسجة تحت الجلد، ويُخطَّط له لتجنّب البُنى المسؤولة عن وظيفة الانتصاب. يمكن أن تحدث تغيرات مؤقتة في الإحساس بسبب التورم أو العلاج نفسه خلال فترة الاستقرار، لكن التأثير الدائم على وظيفة الانتصاب أو الإحساس ليس النتيجة المتوقعة — ويُناقش هذا بشكل فردي إذا كانت لديك مخاوف محددة.",
  },
  {
    question: "لماذا يتلقى مرضى مختلفون خطط علاج مختلفة؟",
    answer:
      "لأن التشريح وخصائص الأنسجة والإجراءات السابقة وحالة الختان والأهداف الشخصية تختلف بين المرضى — يمكن لرجلين بطلب مبدئي متشابه أن ينتهي بهما الأمر بخطط مختلفة بشكل معقول بمجرد تقييم تشريحهما الفردي. هذا هو أساس النهج القائم على التشريح الموضح أعلاه، لا تناقضًا بين المرضى.",
  },
  {
    question: "كيف أبدأ؟",
    answer:
      "تبدأ العملية باستشارة لتقييم التشريح والأهداف والملاءمة قبل التخطيط لأي خيار.",
  },
];

export default function PenileGirthEnhancementPageAr() {
  const training = trainingPrograms[0];
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "زيادة سماكة القضيب",
              description: "نهج طبي متخصص لتكبير القضيب، مع تخطيط علاجي قائم على التشريح والأهداف والتوقعات الواقعية.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Girth Enhancement",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <EditorialField className={`${visual.flagshipHero} py-14`}>
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الإجراء الرائد · أبوظبي
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-display-2xl text-foreground">
              زيادة سماكة القضيب
            </h1>
            <div className={visual.flagshipMetrics}><p><strong>{doctor.girthProcedureCount}</strong><span>الإجراءات المنجزة</span></p><p><strong>منذ {doctor.girthEnhancementSince}</strong><span>زيادة سماكة القضيب</span></p></div>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              نهج طبي متخصص لتكبير القضيب، مع تخطيط علاجي قائم على
              التشريح والأهداف والتوقعات الواقعية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase text-muted-foreground">
              {strapline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_girth" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-muted-foreground">{AR_IDENTITY.doctorDisplayName}<br />{AR_IDENTITY.doctorTitle} · مدرّب طبي</p>
          </div>
          <EditorialFrame slot="girthFlagship" landscape priority tone="dark" />
        </Container>
      </EditorialField>

      {/* Authority block */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <PhysicianAuthority dark locale="ar" />
        </Container>
      </section>

      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="مسارك السريري" heading="من المحادثة الأولى إلى المتابعة" locale="ar" />
          <ClinicalPathway locale="ar" />
        </Container>
      </section>

      {/* What patients want, briefly, then the full clinical philosophy */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <ProcedureFramework locale="ar" />
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الأهداف الشائعة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              الحجم والثقة والتماثل
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يرغب الرجال الذين يفكرون في زيادة سماكة القضيب عادةً في
              معالجة مخاوف تتعلق بالحجم أو الثقة أو التماثل — أهداف
              تُناقش بصراحة ودون حكم مسبق أثناء الاستشارة، ثم تُترجَم
              إلى خطة فردية أدناه.
            </p>
          </div>
        </Container>
      </section>

      {/* Dr. Molina's Approach — clinical philosophy, without exposing procedural technique */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="الفلسفة السريرية"
            heading="نهج د. مولينا في زيادة سماكة القضيب"
            description="سبعة مبادئ تُشكِّل كل خطة علاجية — ليست لغة تسويقية، بل كيفية عمل التخطيط القائم على التشريح فعليًا في الممارسة."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {approachPillars.map((pillar) => (
              <StaggerItem key={pillar.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                {pillar.href && (
                  <Link
                    href={pillar.href}
                    className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    {pillar.linkLabel}
                  </Link>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
          {training && (
            <Reveal delay={0.1}>
              <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-border pt-10">
                {training.logoSrc && (
                  <Image src={training.logoSrc} alt={training.program} width={140} height={44} style={{ height: "2rem", width: "auto" }} />
                )}
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">مدرّب طبي في زيادة سماكة القضيب.</strong>{" "}
                  {AR_REPUTATION.trainingPositioningLine}
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* Options — non-surgical first-line, surgical only where approved */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="الخيارات المطروحة" heading="غير جراحي أولاً، وجراحي فقط حيث يكون مناسبًا" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {options.map((option, index) => (
              <StaggerItem key={option.label}>
                <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[2fr_3fr] sm:gap-16">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">
                      {option.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          تعتمد النتائج على التشريح والتقنية والخيار المختار — وتُناقش
          النتائج بشكل فردي، ولا تُوعَد بها مسبقًا أبدًا.
        </PullQuote>
      </Container>

      {/* Expected variability — dark section, used to give the "no numbers" honesty real weight */}
      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture watermark={false} />
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              التباين المتوقع
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              تختلف النتائج بين الأفراد.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تعتمد النتائج على التشريح والتقنية والخيار المختار. لا
              تُذكَر قياسات نتائج محددة هنا — بل تُناقش بشكل فردي، وفي
              سياقها، أثناء الاستشارة، لا أن تُوعَد بها مسبقًا.
            </p>
          </Reveal>
          <VariabilityFactors locale="ar" />
        </Container>
      </section>

      {/* Risks, aftercare, revision */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="قبل وبعد" heading="المخاطر والرعاية اللاحقة والمراجعة" locale="ar" />
          <CareStages items={afterConsiderations} locale="ar" />
        </Container>
      </section>

      {/* About Dr. Molina */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className={visual.split}>
          <div>
            <PhotoFrame slot="girthConsultation" landscape />
          </div>
          <div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              نبذة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {AR_IDENTITY.doctorDisplayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              تُجرى زيادة سماكة القضيب ضمن ممارسة استشاري أمراض المسالك
              البولية والذكورة
              {doctor.yearsOfExperience !== undefined &&
                ` — بخبرة تزيد عن ${doctor.yearsOfExperience} عامًا في طب المسالك البولية`}
              {doctor.girthEnhancementSince !== undefined &&
                `، وإجراء زيادة سماكة القضيب منذ ${doctor.girthEnhancementSince}`}
              . إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا
              متخصصًا في تقنيات تجميل القضيب لأطباء المسالك البولية
              وأطباء التجميل من خلال برنامج AndroMax Training.
            </p>
            <Link
              href="/ar/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              نبذة عن {AR_IDENTITY.doctorDisplayName}
            </Link>
          </div>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "التجميل الذكوري", href: "/ar/male-aesthetics" },
          { label: "تصحيح حشو القضيب", href: "/ar/male-aesthetics/penile-filler-correction" },
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش تشريحك وأهدافك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "العودة إلى التجميل الذكوري", href: "/ar/male-aesthetics" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]\|AmpersandText" "src/app/(ar)/ar/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx"` — must return nothing. Confirm `ClinicalPathway`/`ProcedureFramework`/`VariabilityFactors`/`CareStages` all receive `locale="ar"` and `PhysicianAuthority` receives both `dark` and `locale="ar"`. Confirm no exaggerated-claim or numeric-outcome language was introduced anywhere the English source deliberately declines to give one (the FAQ "How much size increase" and the "Expected variability" section are the two places most at risk of this — re-read both against the English source's exact hedging before marking this task done).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/male-aesthetics/penile-girth-enhancement

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Build `/ar/male-aesthetics/penile-filler-correction`

Mirrors `src/app/(en)/(marketing)/male-aesthetics/penile-filler-correction/page.tsx` section-for-section. Uses `ContourReviewDiagram` exactly as English does (confirmed zero hardcoded text, title-prop-only, no changes needed).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/male-aesthetics/penile-filler-correction/page.tsx`

**Link status:** `/male-aesthetics` (breadcrumb parent, related) → `/ar/male-aesthetics` (live, Batch 1). `/male-aesthetics/penile-girth-enhancement` (RelatedTreatments) → `/ar/male-aesthetics/penile-girth-enhancement` (live, this batch — Task 2). `/peyronies-disease` → `/ar/peyronies-disease` (live, Batch 2). `/erectile-dysfunction` → `/ar/erectile-dysfunction` (live, Batch 2). `/about` → `/ar/about` (live, Batch 1). Three `/insights/...` FAQ links stay English, labels marked `(مقال بالإنجليزية)`.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/male-aesthetics/penile-filler-correction/page.tsx
import type { Metadata } from "next";
import { ContourReviewDiagram } from "@/components/illustrations/ContourReviewDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-aesthetics/penile-filler-correction";
const BOOKING_LABEL = "احجز استشارتك السرية";

export const metadata: Metadata = buildMetadata({
  title: "تصحيح حشو القضيب",
  description:
    "تقييم متخصص في أبوظبي لعدم التماثل أو عدم انتظام الملامس أو العقيدات أو الانزياح بعد علاج سابق بحشو القضيب — يُقيَّمه د. أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة، مع النظر في الإذابة أو المراجعة عند الاقتضاء.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: "/ar/male-aesthetics" },
  { name: "تصحيح حشو القضيب", href: PATH },
];

const presentations = [
  { label: "عدم التماثل", description: "نتيجة غير متساوية بين جانب وآخر، أو على طول الجسم الأسطواني." },
  { label: "عدم انتظام الملامس", description: "مناطق تُشعَر أو تظهر غير منتظمة أو متكتلة أو غير متسقة مع الأنسجة المحيطة." },
  { label: "العقيدات", description: "مناطق صلبة منفصلة يمكن أن تتكوّن عند موضع الحقن مع مرور الوقت." },
  { label: "الانزياح", description: "منتج انتقل من منطقة العلاج الأصلية." },
  { label: "توزيع غير متساوٍ", description: "منتج مُركَّز بشكل غير متساوٍ بدلاً من توزيعه كما خُطِّط له أصلاً." },
  { label: "تورم مستمر", description: "تورم لم يستقر ضمن فترة الاستقرار المتوقعة، حيثما كان ذلك ذا صلة سريرية." },
];

const correctionOptions = [
  {
    label: "المراقبة",
    description:
      "لا تتطلب كل حالة عدم انتظام تدخلاً فعالاً. حيثما كانت النتيجة طفيفة أو من المرجح أن تُحل من تلقاء نفسها، قد تكون المراقبة الخطوة الأولى الأنسب.",
  },
  {
    label: "الإذابة",
    description:
      "حيثما كان ذلك مناسبًا، يمكن إذابة الحشو القائم على حمض الهيالورونيك. وتعتمد ملاءمة ذلك — والنتيجة المتوقعة بعده — على الحالة الفردية، وتُقيَّم بدلاً من افتراضها.",
  },
  {
    label: "المراجعة أو إعادة العلاج",
    description:
      "حيثما لا تعالج الإذابة وحدها المشكلة، أو كانت هناك رغبة في نتيجة معدَّلة، يُخطَّط لعلاج إضافي بشكل فردي حول التشريح الحالي — لا كخطوة تالية معيارية.",
  },
];

const afterConsiderations = [
  {
    title: "المخاطر",
    description:
      "كما هو الحال مع أي إجراء تصحيحي، يمكن أن تشمل المخاطر مزيدًا من التورم أو الكدمات أو عدم التماثل المؤقت أثناء عملية التصحيح، أو نتيجة لا تعالج المخاوف الأصلية بالكامل. تُراجَع هذه المخاطر بشكل فردي، بناءً على الخيار المطروح.",
  },
  {
    title: "المتابعة",
    description:
      "يلي التصحيح، عند إجرائه، مراجعة لتقييم مدى استقرار المنطقة — لا أن يُعامَل كإجراء منفصل بلا تواصل لاحق.",
  },
  {
    title: "ما قد لا يكون قابلاً للتصحيح الكامل",
    description:
      "قد لا تكون بعض التغيرات — خاصة تغيرات الأنسجة طويلة الأمد — قابلة للعكس بالكامل. يُناقَش هذا بصراحة أثناء التقييم، بدلاً من الإيحاء بأن كل حالة يمكن حلها بالكامل.",
  },
];

const faqItems = [
  {
    question: "متى ينبغي تقييم حشو سابق في القضيب؟",
    answer:
      "إذا لاحظت عدم تماثل، أو ملامس غير منتظمة أو متكتلة، أو انزياحًا، أو توزيعًا غير متساوٍ، أو تورمًا لم يستقر كما هو متوقع، فهذا سبب معقول عمومًا لطلب التقييم — بغض النظر عن مكان إجراء العلاج الأصلي.",
  },
  {
    question: "هل يمكن أن ينزاح حشو القضيب؟",
    answer:
      "نعم — يمكن أن ينتقل المنتج من منطقة العلاج الأصلية، وهذا أحد المظاهر التي يبحث عنها التقييم. هذا نمط مختلف عن الاستقرار التدريجي الطبيعي الذي يلي العلاج، ويُقيَّم بشكل فردي بدلاً من افتراضه من وصف عام.",
    readMoreHref: "/insights/penile-filler-migration-what-to-know",
    readMoreLabel: "اقرأ المزيد: Penile Filler Migration — What Patients Should Know (مقال بالإنجليزية)",
  },
  {
    question: "هل يمكن تصحيح جميع مشكلات حشو القضيب؟",
    answer:
      "لا يمكن تصحيح كل حالة بالكامل. تستجيب بعض حالات عدم الانتظام جيدًا للإذابة أو المراجعة؛ بينما قد تتحسن حالات أخرى، خاصة تغيرات الأنسجة طويلة الأمد، جزئيًا فقط. يُقيَّم هذا ويُناقَش بشكل فردي، ولا يُفترض بأي اتجاه.",
  },
  {
    question: "هل الإذابة هي النهج الصحيح دائمًا؟",
    answer:
      "لا. الإذابة خيار واحد من عدة خيارات، وتعتمد ملاءمتها على الحالة المحددة. في بعض الحالات، قد تكون المراقبة أو نهج مختلف أكثر ملاءمة.",
    readMoreHref: "/insights/can-penile-filler-be-dissolved",
    readMoreLabel: "اقرأ المزيد: Can Penile Filler Be Dissolved? (مقال بالإنجليزية)",
  },
  {
    question: "هل ستحتاجون إلى استخدام الموجات فوق الصوتية؟",
    answer:
      "قد تُستخدم الموجات فوق الصوتية حيثما تساعد في توضيح موقع أو مدى أو طبيعة نتيجة ما — خاصة للصلابة أو الاشتباه بالانزياح أو عندما لا تكون الصورة السريرية واضحة من الفحص وحده. لا تُستخدم بشكل روتيني لكل حالة.",
  },
  {
    question: "هل تحتاجون لمعرفة أين أُجري علاجي الأصلي؟",
    answer:
      "هذا سياق مفيد، لكن التقييم يركز على تشريحك وحالتك الحالية — لا على تقييم أو انتقاد المزود أو العلاج الأصلي.",
  },
  {
    question: "كيف أبدأ؟",
    answer:
      "تبدأ العملية باستشارة سرية لتقييم الحالة الحالية، ومناقشة ما قد يكون مناسبًا أو غير مناسب، والتخطيط للخطوات التالية بشكل فردي.",
  },
];

export default function PenileFillerCorrectionPageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "تصحيح حشو القضيب",
              description: "تقييم متخصص لعدم التماثل أو عدم انتظام الملامس أو العقيدات أو الانزياح أو عدم الرضا بعد علاج سابق بحشو القضيب، مع النظر في الإذابة أو المراجعة عند الاقتضاء.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Filler Correction",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              التجميل الذكوري
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              تصحيح حشو القضيب
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم متخصص في أبوظبي للرجال الذين يعانون من عدم تماثل أو
              عدم انتظام أو انزياح أو عدم رضا بعد علاج سابق بحشو القضيب
              — سواء أُجري هنا أو في مكان آخر — يُقيّمه استشاري أمراض
              المسالك البولية والذكورة الذي يُقيّم النتيجة الجمالية
              والتشريح الكامن معًا.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="filler_correction" size="lg">
                {BOOKING_LABEL}
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Common presentations */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="المظاهر الشائعة" heading="ما قد يستدعي التقييم" locale="ar" />
          <Reveal delay={0.05}>
            <ContourReviewDiagram
              className="mt-10 h-28 w-28 text-muted-foreground"
              title="مقارنة الملامس الأصلية بالحالة الحالية، مع تحديد مواضع الاختلاف"
            />
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {presentations.map((item) => (
              <StaggerItem key={item.label}>
                <h3 className="font-display text-lg text-foreground">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Assessment */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              متى قد يساعد التقييم
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              لا يحتاج كل مخاوف إلى إجراء فوري
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يستحق التقييم النظر بشكل عام عند وجود عدم تماثل، أو ملامس
              غير منتظمة، أو عقيدة جديدة، أو اشتباه بانزياح، أو تورم لم
              يستقر كما هو متوقع. بعض النتائج طفيفة وتُراقَب ببساطة؛
              بينما تستفيد أخرى من خطة محددة.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              ما يتضمنه التقييم
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              التاريخ المرضي والفحص والتصوير حيثما كان مفيدًا
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يبدأ التقييم بالتاريخ المرضي والفحص. قد تُستخدم الموجات
              فوق الصوتية حيثما تساعد في توضيح نتيجة ما — خاصة للصلابة
              أو الاشتباه بالانزياح أو عندما تكون الصورة السريرية غير
              واضحة — لا كخطوة روتينية لكل مريض.
            </p>
          </div>
        </Container>
      </section>

      {/* Correction options */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow="الخيارات المطروحة" heading="ما يمكن فعله، ومتى" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {correctionOptions.map((option, index) => (
              <StaggerItem key={option.label}>
                <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[2fr_3fr] sm:gap-16">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">
                      {option.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          تُقيَّم كل حالة بناءً على تشريحها ونتائجها الخاصة — ولا يُنتقَد
          أي مزود أو علاج سابق أبدًا.
        </PullQuote>
      </Container>

      {/* Realistic expectations — dark section */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              توقعات واقعية
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              تُقيَّم على أساسها الخاص — لا من خلال انتقاد أي مزود أو
              علاج سابق.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تُقيَّم كل حالة بناءً على تشريحها الحالي ونتائجها، بغض
              النظر عن مكان إجراء العلاج الأصلي أو الجهة التي أجرته.
              تعتمد خيارات التصحيح على الحالة المحددة، ولا يمكن ضمان
              نتيجة محددة — بما في ذلك الحل الكامل لكل حالة عدم انتظام.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Risks, follow-up, limitations */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="قبل وبعد" heading="المخاطر والمتابعة والحدود" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {afterConsiderations.map((item) => (
              <Reveal key={item.title}>
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" },
          { label: "التجميل الذكوري", href: "/ar/male-aesthetics" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "نبذة عن د. مولينا", href: "/ar/about" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش علاجك السابق"
        sourcePage={PATH}
        secondary={{ label: "العودة إلى التجميل الذكوري", href: "/ar/male-aesthetics" }}
        bookingLabel={BOOKING_LABEL}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/male-aesthetics/penile-filler-correction/page.tsx"` — must return nothing. Confirm no claim was added that "all" cases are correctable — the English source is deliberate that some presentations "may only partially improve" and "no specific outcome... can be guaranteed"; the Arabic must preserve both hedges exactly.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/male-aesthetics/penile-filler-correction/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/male-aesthetics/penile-filler-correction

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Build `/ar/male-aesthetics/scrotal-lift`

Mirrors `src/app/(en)/(marketing)/male-aesthetics/scrotal-lift/page.tsx` section-for-section — the simplest of the three pages, using only already-established, fully locale-safe shared components (no new component audit needed).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/male-aesthetics/scrotal-lift/page.tsx`

**Link status:** `/male-aesthetics` (breadcrumb parent, related, secondary CTA) → `/ar/male-aesthetics` (live, Batch 1). `/male-aesthetics/penile-girth-enhancement` (RelatedTreatments) → `/ar/male-aesthetics/penile-girth-enhancement` (live, this batch — Task 2). `/peyronies-disease` → `/ar/peyronies-disease` (live, Batch 2).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/male-aesthetics/scrotal-lift/page.tsx
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-aesthetics/scrotal-lift";

export const metadata: Metadata = buildMetadata({
  title: "شد الصفن",
  description:
    "جراحة تجميلية للصفن في أبوظبي لعلاج زيادة أو ترهل جلد الصفن — تقييم متخصص، وتخطيط جراحي فردي، ونقاش واقعي حول الندبات والتعافي والحدود.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: "/ar/male-aesthetics" },
  { name: "شد الصفن", href: PATH },
];

const strapline = ["قائم على التشريح", "تحت إشراف طبي", "مخطط له فرديًا"];

const causes = [
  {
    label: "زيادة أو ترهل جلد الصفن",
    description:
      "السبب الأكثر شيوعًا للاستشارة — يمكن أن يتطور ترهل الجلد مع التقدم في العمر أو تغير الوزن أو بعد فقدان وزن كبير، ويُقيَّم بشكل فردي.",
  },
  {
    label: "عدم التماثل أو الانزعاج",
    description:
      "يعاني بعض الرجال من عدم تماثل أو احتكاك أو انزعاج مرتبط بزيادة النسيج، ويُراجَع ذلك إلى جانب التشريح والأهداف أثناء الاستشارة.",
  },
];

const process = [
  {
    title: "التقييم",
    description:
      "تبدأ الاستشارة بفحص تشريح الصفن وجودة الجلد وأي عوامل مساهمة، إلى جانب أهدافك وتاريخك المرضي.",
  },
  {
    title: "التخطيط الجراحي الفردي",
    description:
      "حيثما كانت الجراحة مناسبة، يُخطَّط للنهج — بما في ذلك موضع الشق والندبة — وفقًا لتشريحك المحدد، لا وفق نموذج موحّد.",
  },
  {
    title: "التعافي",
    description:
      "تُناقَش توقعات التعافي وقيود النشاط والمتابعة بالتفصيل مسبقًا، وفقًا للخطة المتفق عليها أثناء الاستشارة.",
  },
];

const faqItems = [
  {
    question: "ما هو شد الصفن؟",
    answer:
      "يعالج شد الصفن، أو الجراحة التجميلية للصفن، زيادة أو ترهل جلد الصفن من خلال نهج جراحي مخطط له فرديًا — يُقيَّم ويُجرى ضمن سياق طب المسالك البولية والذكورة، لا كإجراء تجميلي عام.",
  },
  {
    question: "هل ستظهر ندبات واضحة؟",
    answer:
      "بعض الندبات جزء متوقع من أي جراحة صفن. تُناقَش مواضعها المحتملة ومظهرها وكيفية استقرارها مع مرور الوقت بالتفصيل أثناء الاستشارة، إلى جانب تشريحك الفردي.",
  },
  {
    question: "كم تستغرق فترة التعافي؟",
    answer:
      "يختلف التعافي بين الأفراد ويعتمد على مدى الجراحة المُجراة. تُناقَش الجداول الزمنية العامة وقيود النشاط أثناء الاستشارة بدلاً من ذكرها هنا بمعزل عن السياق.",
  },
  {
    question: "ما هي حدود هذا الإجراء؟",
    answer:
      "كما هو الحال مع أي إجراء جراحي، للنتائج حدود ولا يمكن ضمانها. يُعد التورم وعدم التماثل وتغير الإحساس والندبات من بين المخاطر التي تُراجَع بشكل فردي قبل المضي قدمًا.",
  },
  {
    question: "هل يمكن الجمع بين هذا وزيادة سماكة القضيب؟",
    answer:
      "يثير بعض الرجال كلا المخاوف في الاستشارة نفسها. تعتمد ملاءمة الجمع بين الإجراءين على التشريح الفردي وتُقيَّم حالة بحالة — ولا تُفترض بشكل افتراضي.",
  },
  {
    question: "كيف أبدأ؟",
    answer:
      "تبدأ العملية باستشارة لتقييم التشريح والأهداف والملاءمة قبل مناقشة أي خطة جراحية.",
  },
];

export default function ScrotalLiftPageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "شد الصفن",
              description: "جراحة تجميلية للصفن لعلاج زيادة أو ترهل جلد الصفن، مع تخطيط جراحي فردي قائم على التشريح والأهداف والتوقعات الواقعية.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Scrotal Lift",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              التجميل الذكوري
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              شد الصفن
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              جراحة تجميلية للصفن لعلاج زيادة أو ترهل جلد الصفن، مع
              تخطيط جراحي فردي قائم على التشريح والأهداف والتوقعات
              الواقعية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase text-muted-foreground">
              {strapline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="male_aesthetics" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Common reasons for consultation */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="الأسباب الشائعة للاستشارة" heading="لماذا يفكر الرجال في شد الصفن" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {causes.map((item) => (
              <StaggerItem key={item.label}>
                <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-[1fr_2fr] sm:gap-16">
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {item.label}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Process */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="كيف يعمل هذا" heading="التقييم والتخطيط والتعافي" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {process.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Scarring, recovery and limitations — olive */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              نقاش واقعي
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              تُناقَش الندبات والتعافي والحدود بصراحة.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تُراجَع مواضع الندبات ووقت التعافي المتوقع وتغير الإحساس
              وحدود ما يمكن أن تحققه الجراحة بالتفصيل قبل اتخاذ أي قرار.
              وكما هو الحال مع أي إجراء جراحي، تختلف النتائج بين
              الأفراد ولا يمكن ضمان نتائج محددة.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" },
          { label: "التجميل الذكوري", href: "/ar/male-aesthetics" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش تشريحك وأهدافك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "العودة إلى التجميل الذكوري", href: "/ar/male-aesthetics" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/male-aesthetics/scrotal-lift/page.tsx"` — must return nothing. Confirm "no specific outcome can be guaranteed" hedge is preserved exactly (not softened into an implied guarantee).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/male-aesthetics/scrotal-lift/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/male-aesthetics/scrotal-lift

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Register `arPath` for all three routes; flip every now-resolvable link via a multi-shape search; update the route-registry tests in the same task

Confirmed by reading `src/lib/seo/routes.ts`, `getLocalizedPathPair`, `buildMetadata`, and `src/app/sitemap.ts` directly (same as prior batches): setting `arPath` is the single change that wires the language switcher, reciprocal hreflang, and the sitemap entry. **This task's link audit uses the multi-shape method from the Global Constraints, not a single `href="..."` grep** — confirmed by reading every candidate file's actual occurrences directly before writing this plan (8 files, 15 total occurrences: 1 in `sexual-medicine/page.tsx`, 1 in `mens-health/page.tsx`, 8 in `male-aesthetics/page.tsx`, 1 in `about/page.tsx`, 1 in `HeroSectionAr.tsx`, 1 in `FeaturedProcedureSectionAr.tsx`, 2 in `CoreExpertiseSectionAr.tsx`). **This task also updates `routes.test.ts` and `sitemap.test.ts` directly** (Global Constraints' carried-forward exception from Batch 2's own final-verification finding) — do not defer this to Task 8.

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/lib/seo/routes.test.ts`
- Modify: `src/app/sitemap.test.ts`
- Modify: `src/app/(ar)/ar/(marketing)/sexual-medicine/page.tsx`
- Modify: `src/app/(ar)/ar/(marketing)/mens-health/page.tsx`
- Modify: `src/app/(ar)/ar/(marketing)/male-aesthetics/page.tsx`
- Modify: `src/app/(ar)/ar/(marketing)/about/page.tsx`
- Modify: `src/components/sections/ar/HeroSectionAr.tsx`
- Modify: `src/components/sections/ar/FeaturedProcedureSectionAr.tsx`
- Modify: `src/components/sections/ar/CoreExpertiseSectionAr.tsx`
- Verify only, no edit: `src/config/navigation.ts` (self-heals via `localizeHref`/`getLocalizedPathPair` — see Global Constraints)

- [ ] **Step 1: Register `arPath` in `routes.ts`**

Find:
```ts
  { path: "/male-aesthetics", status: "live", priority: 0.9, arPath: "/ar/male-aesthetics" },
  { path: "/male-aesthetics/penile-girth-enhancement", status: "live", priority: 0.9 },
  { path: "/male-aesthetics/scrotal-lift", status: "live", priority: 0.8 },
  // Built Phase B (SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md). Renamed from
  // the never-built, never-indexed "revision-correction" placeholder to
  // match the brief's more search-intent-precise naming — no redirect
  // needed, since nothing was ever live at the old slug.
  { path: "/male-aesthetics/penile-filler-correction", status: "live", priority: 0.7 },
```
Replace with:
```ts
  { path: "/male-aesthetics", status: "live", priority: 0.9, arPath: "/ar/male-aesthetics" },
  { path: "/male-aesthetics/penile-girth-enhancement", status: "live", priority: 0.9, arPath: "/ar/male-aesthetics/penile-girth-enhancement" },
  { path: "/male-aesthetics/scrotal-lift", status: "live", priority: 0.8, arPath: "/ar/male-aesthetics/scrotal-lift" },
  // Built Phase B (SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md). Renamed from
  // the never-built, never-indexed "revision-correction" placeholder to
  // match the brief's more search-intent-precise naming — no redirect
  // needed, since nothing was ever live at the old slug.
  { path: "/male-aesthetics/penile-filler-correction", status: "live", priority: 0.7, arPath: "/ar/male-aesthetics/penile-filler-correction" },
```

- [ ] **Step 2: Update `routes.test.ts`**

Find the test `"has arPath set on the homepage and all R9 Phase B Batch 1 and Batch 2 routes"` (its exact title after Batch 2's own test fix — read the file to confirm the current title before editing, in case it differs slightly). Update:
- The title to also mention Batch 3 (e.g. `"has arPath set on the homepage and every R9 Phase B Batch 1 + Batch 2 + Batch 3 route"`).
- The `expect(withArPath).toEqual([...])` array to the new 16-entry list, in `routes.ts` registry order:
```ts
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/mens-health",
      "/mens-health/testosterone",
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
    ]);
```
Do not touch any other `describe`/`it` block in this file.

- [ ] **Step 3: Update `sitemap.test.ts`**

Find the corresponding sitemap test and update its title and expected `/ar/...` array the same way, adding the 3 new Arabic paths in the same registry order shown above (i.e. `/ar/male-aesthetics/penile-girth-enhancement`, `/ar/male-aesthetics/scrotal-lift`, `/ar/male-aesthetics/penile-filler-correction` inserted after `/ar/male-aesthetics` and before `/ar/male-fertility`). Do not touch any other test in this file.

- [ ] **Step 4: Flip `sexual-medicine/page.tsx`**

Find:
```tsx
          { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
```
Replace with:
```tsx
          { label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" },
```

- [ ] **Step 5: Flip `mens-health/page.tsx`**

Find:
```tsx
      <RelatedTreatments locale="ar" items={[{ label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" }]} />
```
Replace with:
```tsx
      <RelatedTreatments locale="ar" items={[{ label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" }]} />
```

- [ ] **Step 6: Flip `male-aesthetics/page.tsx` (8 occurrences + 1 comment)**

Find (comment above `secondaryAreas`):
```tsx
/** Temporary EN destinations — ship Batch 3. */
const secondaryAreas = [
  {
    title: "شد الصفن",
    description:
      "جراحة تجميلية للصفن للرجال الذين يعانون من زيادة أو ترهل في جلد الصفن. يُخصَّص التقييم والتخطيط الجراحي فرديًا، مع مناقشة تفصيلية لموضع الندبة والتعافي والقيود.",
    cta: { label: "استكشف شد الصفن", href: "/male-aesthetics/scrotal-lift" },
  },
  {
    title: "تصحيح حشو القضيب",
    description:
      "قد يعاني الرجال الذين خضعوا سابقًا لحقن حشو في القضيب — هنا أو في مكان آخر — من عدم تناسق، أو عقيدات، أو عدم انتظام، أو انزياح، أو عدم رضا عن النتائج السابقة. تُقيَّم هذه الحالات فرديًا، مع النظر في إذابة الحشو أو التصحيح عند الحاجة.",
    cta: { label: "استكشف تصحيح حشو القضيب", href: "/male-aesthetics/penile-filler-correction" },
  },
];
```
Replace with:
```tsx
/** All destinations below now live in Arabic (Batch 3). */
const secondaryAreas = [
  {
    title: "شد الصفن",
    description:
      "جراحة تجميلية للصفن للرجال الذين يعانون من زيادة أو ترهل في جلد الصفن. يُخصَّص التقييم والتخطيط الجراحي فرديًا، مع مناقشة تفصيلية لموضع الندبة والتعافي والقيود.",
    cta: { label: "استكشف شد الصفن", href: "/ar/male-aesthetics/scrotal-lift" },
  },
  {
    title: "تصحيح حشو القضيب",
    description:
      "قد يعاني الرجال الذين خضعوا سابقًا لحقن حشو في القضيب — هنا أو في مكان آخر — من عدم تناسق، أو عقيدات، أو عدم انتظام، أو انزياح، أو عدم رضا عن النتائج السابقة. تُقيَّم هذه الحالات فرديًا، مع النظر في إذابة الحشو أو التصحيح عند الحاجة.",
    cta: { label: "استكشف تصحيح حشو القضيب", href: "/ar/male-aesthetics/penile-filler-correction" },
  },
];
```

Find:
```tsx
              <Link href="/male-aesthetics/penile-girth-enhancement" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">استكشف زيادة سماكة القضيب</Link>
```
Replace with:
```tsx
              <Link href="/ar/male-aesthetics/penile-girth-enhancement" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">استكشف زيادة سماكة القضيب</Link>
```

Find:
```tsx
            <Button asChild size="lg" className="mt-8"><Link href="/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link></Button>
```
Replace with:
```tsx
            <Button asChild size="lg" className="mt-8"><Link href="/ar/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link></Button>
```

Find:
```tsx
          { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "شد الصفن", href: "/male-aesthetics/scrotal-lift" },
          { label: "تصحيح حشو القضيب", href: "/male-aesthetics/penile-filler-correction" },
```
Replace with:
```tsx
          { label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" },
          { label: "شد الصفن", href: "/ar/male-aesthetics/scrotal-lift" },
          { label: "تصحيح حشو القضيب", href: "/ar/male-aesthetics/penile-filler-correction" },
```

Find:
```tsx
        secondary={{
          label: "استكشف زيادة سماكة القضيب",
          href: "/male-aesthetics/penile-girth-enhancement",
        }}
```
Replace with:
```tsx
        secondary={{
          label: "استكشف زيادة سماكة القضيب",
          href: "/ar/male-aesthetics/penile-girth-enhancement",
        }}
```

- [ ] **Step 7: Flip `about/page.tsx`**

Find:
```tsx
    href: "/male-aesthetics/penile-girth-enhancement",
    linkLabel: "استكشف زيادة سماكة القضيب",
```
Replace with:
```tsx
    href: "/ar/male-aesthetics/penile-girth-enhancement",
    linkLabel: "استكشف زيادة سماكة القضيب",
```

- [ ] **Step 8: Flip `HeroSectionAr.tsx`**

Find:
```tsx
              {/* Temporary EN destination — no Arabic page yet, spec §7 */}
              <Button asChild variant="secondary" size="lg">
                <a href="/male-aesthetics/penile-girth-enhancement">
                  استكشف زيادة سماكة القضيب
                </a>
              </Button>
```
Replace with:
```tsx
              <Button asChild variant="secondary" size="lg">
                <a href="/ar/male-aesthetics/penile-girth-enhancement">
                  استكشف زيادة سماكة القضيب
                </a>
              </Button>
```

- [ ] **Step 9: Flip `FeaturedProcedureSectionAr.tsx`**

Find:
```tsx
/** Temporary EN destination for the CTA — no Arabic page yet, spec §7. */
export function FeaturedProcedureSectionAr() {
```
Replace with:
```tsx
export function FeaturedProcedureSectionAr() {
```

Find:
```tsx
            <Link href="/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link>
```
Replace with:
```tsx
            <Link href="/ar/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link>
```

- [ ] **Step 10: Flip `CoreExpertiseSectionAr.tsx`**

Find:
```tsx
/**
 * All primary/secondary hrefs above now point to real Arabic pages
 * except `/male-aesthetics/penile-girth-enhancement` and
 * `/mens-health/vasectomy`, which have no Arabic page yet and stay
 * temporary EN destinations, spec §7. (R9 Phase B: Batch 1 covered
 * `/ar/male-aesthetics` and `/ar/male-fertility`; Batch 2 covered the
 * remaining four — found still un-flipped here during Batch 2's Task 11
 * whole-site regression pass, since this component wasn't in Task 9's
 * declared edit scope.)
 */
```
Replace with:
```tsx
/**
 * All primary/secondary hrefs above now point to real Arabic pages
 * except `/mens-health/vasectomy`, which has no Arabic page yet and
 * stays a temporary EN destination — ships Batch 4. (R9 Phase B: Batch 1
 * covered `/ar/male-aesthetics` and `/ar/male-fertility`; Batch 2
 * covered four more, found un-flipped here during its own Task 11
 * regression pass; Batch 3 covers `/male-aesthetics/penile-girth-enhancement`.)
 */
```

Find:
```tsx
          <Link href="/male-aesthetics/penile-girth-enhancement" className={visual.serviceFeature}>
```
Replace with:
```tsx
          <Link href="/ar/male-aesthetics/penile-girth-enhancement" className={visual.serviceFeature}>
```

- [ ] **Step 11: Verify `navigation.ts` needs no edit**

Run: `grep -n "penile-girth-enhancement" src/config/navigation.ts` — must show exactly 4 hits (`primaryNav`, `footerServiceLinks` — the two ENGLISH arrays, unaffected by this task — plus `primaryNavAr` line ~87 and `footerServiceLinksAr` line ~114), and every one of the two Arabic-array hits must still read the canonical **English** path `/male-aesthetics/penile-girth-enhancement`, not `/ar/...` — confirming they were correctly left untouched (they resolve automatically via `localizeHref`/`getLocalizedPathPair` now that Step 1 registered the `arPath`). Do not edit this file.

- [ ] **Step 12: Full verification**

Run: `npm run typecheck` — must pass. Run: `npm run test` — must pass (routes.test.ts and sitemap.test.ts specifically, plus the full suite). Run the shape-agnostic sweep (the Global Constraints' mandated method — a bare quoted-path substring search, not `href="..."`):
```bash
grep -rn '"/male-aesthetics/penile-girth-enhancement"\|"/male-aesthetics/scrotal-lift"\|"/male-aesthetics/penile-filler-correction"' "src/app/(ar)" src/components/sections/ar/
```
Must return **zero matches** (every occurrence found in this task's own investigation has been flipped; this batch has no "stays English" exception among its own three routes, unlike Batch 2's shockwave-therapy/penile-surgery — all three ship together). Then run the same search restricted to `src/config/navigation.ts` and confirm it still shows the 2 untouched Arabic-array hits (Step 11) plus the 2 unaffected English-array hits.

- [ ] **Step 13: Commit**

```bash
git add src/lib/seo/routes.ts src/lib/seo/routes.test.ts src/app/sitemap.test.ts \
  "src/app/(ar)/ar/(marketing)/sexual-medicine/page.tsx" \
  "src/app/(ar)/ar/(marketing)/mens-health/page.tsx" \
  "src/app/(ar)/ar/(marketing)/male-aesthetics/page.tsx" \
  "src/app/(ar)/ar/(marketing)/about/page.tsx" \
  src/components/sections/ar/HeroSectionAr.tsx \
  src/components/sections/ar/FeaturedProcedureSectionAr.tsx \
  src/components/sections/ar/CoreExpertiseSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): register arPath for Batch 3 routes; flip all resolvable links (multi-shape audit)

Wires the language switcher, reciprocal hreflang, and sitemap entries
for all three Batch 3 pages. Flips every temporary-English link to
these three destinations found via a shape-agnostic search across the
whole Arabic surface (8 files, 15 occurrences) — not the href="..."-only
grep that missed 13 links in Batch 2. Updates routes.test.ts and
sitemap.test.ts in this same task, per the process fix from Batch 2's
final verification (no task should defer route-registry test
maintenance to a later surprise).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Update the Arabic medical glossary

Confirmed by reading the current glossary before writing this plan: all three procedure names (`زيادة سماكة القضيب`, `شد الصفن`, `تصحيح حشو القضيب`) and `حمض الهيالورونيك` already have rows from earlier batches — reused, not re-added. This task adds only the genuinely new clinical terms this batch introduces.

**Files:**
- Modify: `docs/arabic-medical-glossary.md`

- [ ] **Step 1: Append Batch 3's new terms**

Add these rows after the existing last row (`Book a specialist assessment`):

```markdown
| Anatomy-led (planning) | قائم على التشريح | /male-aesthetics/penile-girth-enhancement (Batch 3) | |
| Proportion (aesthetic goal, vs. maximum volume) | التناسب | /male-aesthetics/penile-girth-enhancement (Batch 3) | |
| Staged treatment | علاج مرحلي | /male-aesthetics/penile-girth-enhancement (Batch 3) | |
| Asymmetry | عدم التماثل | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Irregular contour | عدم انتظام الملامس | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Nodules (filler) | العقيدات | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Migration (filler) | الانزياح | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Dissolution (filler) | الإذابة | /male-aesthetics/penile-filler-correction (Batch 3) | |
| Excess/lax scrotal skin | زيادة أو ترهل جلد الصفن | /male-aesthetics/scrotal-lift (Batch 3) | |
```

- [ ] **Step 2: Commit**

```bash
git add docs/arabic-medical-glossary.md
git commit -m "$(cat <<'EOF'
docs(r9-b): extend Arabic medical glossary with Batch 3 terms

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Whole-site QA — multi-shape link audit + structural page QA + clinical-tone fidelity check

Per the owner's explicit instruction, this batch's QA carries forward two things as standing practice from the start, not as an afterthought bolted on after a failure: (1) the multi-shape/shape-agnostic link search (Global Constraints), and (2) a whole-site regression scope, not just this batch's own new pages. This task also adds a check no prior batch's QA needed: **clinical-tone fidelity** — confirming this batch's Arabic content preserves every hedge/caveat/declined-claim from the English source, per this batch's specific Global Constraint.

**Files:**
- Create: `qa/r9-phase-b-batch3/README.md`

- [ ] **Step 1: Attempt the Playwright MCP browser**

Try navigating to each of the three new routes on the local dev server (`npm run dev`) at 390/768/1024/1440px. If the browser tool errors as locked/unavailable (the failure mode every prior QA task in this project has hit — B0's Task 18, Batch 1's Task 20, Batch 2's Task 11), proceed to Step 2 and disclose the failure explicitly in the QA doc.

- [ ] **Step 2: Structural fallback (if Step 1 is unavailable)**

For each of the three new pages, diff section counts and content-array lengths against its English source (same method as Batch 2's Task 11): confirm no section, FAQ item, image slot (`EditorialFrame`/`PhotoFrame` slot names), or CTA was dropped. Confirm `locale="ar"` is present on every `SectionHeading`/`Faq`/`RelatedTreatments`/`PhysicianAuthority`/`ClinicalPathway`/`ProcedureFramework`/`VariabilityFactors`/`CareStages` call, and that no `tracking-widest`/`tracking-[0.2em]` leaked onto Arabic text (sweep all three new files at once).

- [ ] **Step 3: Repo-wide multi-shape link re-audit (independent of Task 5's own check)**

Do not reuse Task 5's verification as sufficient on its own — Batch 2's own history (Task 9's link flip, independently found incomplete by Task 11's separate audit, which was *itself* later found incomplete by the final whole-branch review) shows a single audit pass, even a careful one, can miss occurrences. Run this task's own independent sweep:
```bash
grep -rn '"/male-aesthetics/penile-girth-enhancement"\|"/male-aesthetics/scrotal-lift"\|"/male-aesthetics/penile-filler-correction"' src/
```
scoped to the whole `src/` tree, not just `(ar)`/`sections/ar` — then manually classify every hit: the 3 new Arabic pages' own self-references (expected, `/ar/...` form), the 2 `navigation.ts` Arabic-array entries (expected, canonical-English form, self-healing per Global Constraints), the untouched English-side pages/config (expected, unaffected by locale), and anything else. Anything else is a live finding — investigate and fix within this task, do not defer it.

- [ ] **Step 4: Whole-site regression — previously-shipped pages touched by Task 5**

Confirm the 7 files Task 5 edited (`sexual-medicine/page.tsx`, `mens-health/page.tsx`, `male-aesthetics/page.tsx`, `about/page.tsx`, `HeroSectionAr.tsx`, `FeaturedProcedureSectionAr.tsx`, `CoreExpertiseSectionAr.tsx`) still render their surrounding content correctly — i.e. the diff touched only the href/comment lines specified, nothing else in each file shifted. If Playwright is available, load each of the pages these components appear on (`/ar`, `/ar/sexual-medicine`, `/ar/mens-health`, `/ar/male-aesthetics`, `/ar/about`) and visually confirm no breakage; if not, `git diff` each file against Task 5's commit and confirm the change is exactly and only what Task 5's steps specified.

- [ ] **Step 5: Clinical-tone fidelity check**

Re-read all three new Arabic pages against this plan's Global Constraints (premium tone, proportion over maximum size, anatomy-led, staged treatment, realistic expectations, no exaggerated enlargement claims, no proprietary technique disclosure) and against their English sources side by side. Specifically confirm: (a) no numeric outcome/size claim was added anywhere the English source deliberately omits one (the girth-enhancement FAQ "How much size increase" and "Expected variability" section are the highest-risk spots); (b) the girth-enhancement "Dr. Molina's Approach" section describes principles, not technique steps, matching the English source's own explicit intent; (c) the filler-correction page's "may only partially improve"/"no specific outcome... can be guaranteed" hedges are present in Arabic, not softened; (d) the scrotal-lift page's "results vary... cannot be guaranteed" hedge is present.

- [ ] **Step 6: Write the QA doc**

Document, per page: which method was used (Playwright or structural fallback), what was checked (including the Step 3 repo-wide sweep's exact command and result, and the Step 5 clinical-tone findings), and any issues found and fixed before this task's commit. If Playwright was unavailable, state that plainly and note that a real visual pass at all four breakpoints is still owed before the consolidated pre-Production Preview after Batch 4 — this is now the fourth consecutive batch carrying that same owed check forward (B0, Batch 1, Batch 2, Batch 3); flag this explicitly in the doc as accumulated visual-QA debt worth the owner's attention before Batch 4's Preview.

- [ ] **Step 7: Commit**

```bash
git add qa/r9-phase-b-batch3/README.md
git commit -m "$(cat <<'EOF'
docs(r9-b): whole-site QA for Batch 3 (male aesthetics) — multi-shape link audit + clinical-tone check

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full typecheck, lint, test, build**

Run in order, fixing anything that fails before proceeding (do not attempt a fix without first understanding it — if a failure surfaces a plan gap like Batch 2's stale-test discovery, rule on it and dispatch a scoped fix, then re-run this task in full):
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

- [ ] **Step 2: Confirm sitemap output**

After `npm run build` succeeds, confirm all three new Arabic URLs appear in `sitemap.xml` with reciprocal `alternates.languages` entries, by reading `src/app/sitemap.ts`'s logic against the updated `routes.ts` and/or inspecting the built sitemap output directly.

- [ ] **Step 3: Confirm git state is clean**

Run: `git status --short` — should show no uncommitted changes. Run: `git log --oneline -20` to confirm the batch's full commit sequence is present and in order.

No commit for this task — it only verifies work already committed in Tasks 1–7.

---

## Batch 3 completion criteria

- All three pages listed in the owner's Batch 3 brief exist at their `/ar/...` routes with full content parity (no shortened summaries) and with every clinical-tone constraint (premium, proportionate, anatomy-led, staged where appropriate, realistic, no exaggerated claims, no technique disclosure) preserved from the English source, not diluted or amplified.
- Each page has self-canonical + reciprocal `en-AE`/`ar-AE`/`x-default` hreflang, localized title/description/OG, localized breadcrumbs, localized FAQ schema with `inLanguage: "ar"`, and appears in `sitemap.xml` — automatic from `arPath` registration.
- Every internal link across the *entire* Arabic site pointing at these three destinations now points to the real Arabic route, found via a shape-agnostic search, verified independently at least twice (Task 5's own check, Task 7's independent re-audit) — not a single-pass `href="..."`-only grep.
- Established terminology reused verbatim (`زيادة سماكة القضيب`, `شد الصفن`, `تصحيح حشو القضيب`) — no parallel/inconsistent renderings introduced.
- Route-registry tests (`routes.test.ts`, `sitemap.test.ts`) updated in the same task that changed `routes.ts`, not deferred.
- Per the owner's instruction: no merge to `main`, no Production or Preview deploy after this batch — report to the owner and await instruction on Batch 4.
