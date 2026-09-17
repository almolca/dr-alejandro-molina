# R9 Phase B — Batch 2 (Priority Clinical Pages) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship genuine Arabic versions of `/erectile-dysfunction`, `/erectile-dysfunction/penile-doppler`, `/sexual-medicine/premature-ejaculation`, `/mens-health/testosterone`, `/penile-implant`, `/peyronies-disease`, `/male-fertility/varicocele` at their `/ar/...` equivalents — full content depth, no shortened summaries — plus the one shared-component locale fix this batch's pages require, and the cross-link flips this batch's own pages plus the already-live Batch 1 pages and homepage sections need once these seven destinations exist.

**Architecture:** Same as Batch 1 (see spec). One `page.tsx` per route under `src/app/(ar)/ar/(marketing)/<path>/page.tsx`, Arabic content inlined directly, composing shared UI/section components. Batch 1 already made `Faq`, `SectionHeading`, `Breadcrumb`, `TreatmentCtaSection`, `CandidateCheck`, `AuthorityMetric`, and every non-text-bearing illustration component reusable as-is (all confirmed prop-driven by direct reading — `TreatmentCtaSection` and `CandidateCheck` in particular take 100% of their text as props, so need zero changes). This batch's own component audit (below) found exactly one new fix needed: `DopplerWaveformPanel` (used on the Penile Doppler page) hardcodes English SVG axis/annotation labels (`"Time →"`, `"Velocity"`, `"PSV — adequate"`, etc.) with no locale awareness — Task 1 fixes it before Task 3 (the Penile Doppler page) needs it. Once infra is done, the seven pages compose it (Tasks 2–8). Then `arPath` gets registered for all seven in `routes.ts` and every temporary-English link that pointed at these seven destinations — in this batch's own pages' cross-links, in the three already-live Batch 1 hub pages, and in the two homepage section components — gets flipped to the new Arabic routes (Task 9).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md` (shared across all 4 batches) — read it first. This plan's Batch 1 predecessor, `docs/superpowers/plans/2026-09-13-r9-phase-b-batch1-core-hubs.md`, is the reference implementation for every convention referenced here (`AR_IDENTITY`, `AR_REPUTATION`, the RTL fixes, the letter-spacing rule) — all already committed and confirmed live on this branch.

## Global Constraints

- Work happens in the existing worktree `.worktrees/feat-arabic-localization-r9-phase-b`, branch `feat/arabic-localization-r9-phase-b`. No new worktree, no new branch. Batch 1 is already fully committed on this branch (`git log` confirms through `d81cd6e`) and `npm run typecheck` passes clean at the start of this batch — verified directly before writing this plan.
- No changes to any English route's rendered output when a component's new `locale` prop is omitted.
- **Letter-spacing discipline (from B0/Batch 1):** `tracking-widest`/`tracking-[0.2em]` must NEVER apply to Arabic-language text. Every raw eyebrow/label span below drops the tracking utility on its Arabic branch; every `SectionHeading`/`Faq` call passes `locale="ar"` so the component's own internal fix applies.
- **`BookingCta`'s default (`children` omitted) is the English string `"Book a Consultation"`, and `TreatmentCtaSection`'s `bookingLabel` has no default at all (renders as empty children if omitted)** — every Arabic page task below passes explicit Arabic text at every `BookingCta`/`TreatmentCtaSection` call site, including the two pages (`testosterone`, `varicocele`) where the English source omits `children`/`bookingLabel` and relies on the English default.
- **`AmpersandText` only matters where the string literally contains `&`** (confirmed by reading it — it splits on `&` and re-sets just that glyph in the sans face; with no `&` present it's a no-op passthrough). Arabic uses `و` for "and", never `&`, so no Arabic page below imports or uses `AmpersandText` — headings render as plain strings.
- **Centralized identity/reputation strings exist and must be reused, not re-typed:** `AR_IDENTITY` (`src/lib/i18n/ar-identity.ts`) exports `doctorTitle` ("استشاري أمراض المسالك البولية والذكورة"), `doctorDisplayName` ("د. أليخاندرو مولينا"), and `practiceLocationLine` ("مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي"). Every page task below that needs the doctor's title/name or the practice address imports and uses these — never a new local literal.
- **No invented `/ar/*` destination URLs.** Per outbound link, this batch's own pages resolve as follows (confirmed by reading both the English source pages and the current state of `routes.ts`/the already-live Arabic pages before writing this plan):
  - Live in Arabic already (Batch 1): `/sexual-medicine` → `/ar/sexual-medicine`, `/mens-health` → `/ar/mens-health`, `/male-fertility` → `/ar/male-fertility`, `/about` → `/ar/about`.
  - Live in Arabic by the end of *this* batch (all seven ship together): `/erectile-dysfunction`, `/erectile-dysfunction/penile-doppler`, `/mens-health/testosterone`, `/penile-implant`, `/peyronies-disease`, `/male-fertility/varicocele` — each gets a real `/ar/...` href from every other Batch-2 page once created.
  - Stays temporary English, with an inline comment naming why: `/erectile-dysfunction/shockwave-therapy` (not scheduled in any of the four R9 Phase B batches — out of the owner's brief entirely), `/penile-surgery` (same — the breadcrumb parent of `penile-implant` and `peyronies-disease`, never listed in any batch), and every `/insights/...` link (Insights explicitly out of scope per the owner's brief).
  - `/insights/...` links keep their English `href` **and** their label text in English, with a trailing `"（مقال بالإنجليزية）"`-style parenthetical — actually rendered as `"(مقال بالإنجليزية)"` — appended so the link never reads as if it were Arabic content. This is the concrete form of the architecture spec's "Any reference to Insights content stays visibly English (label says so)" rule.
  - `/book` has no `arPath` (not part of this batch — ships in Batch 4) and is never linked to from any of this batch's pages, matching the English sources (none of the seven link to `/book` directly; all booking goes through `BookingCta`, which internally routes to `/book?service=...` regardless of locale — that internal routing is unaffected by locale and requires no change).
- No new unit tests for presentational components/pages — matches the established convention continued from Batch 1. Verification is `npm run typecheck` + targeted grep/read checks per task, and a final `npm run build`/`lint`/`test` pass.
- No push, no Preview deploy, no PR update after this batch — those happen once, after Batch 4, per the owner's explicit instruction.

---

### Task 1: Add `locale="ar"` support to `DopplerWaveformPanel`

Found during this batch's shared-component audit (not caught by Batch 1's narrower hub-page scope, since no hub page uses this component): `PATTERN_CONFIG`'s `psvLabel`/`edvLabel` values and the two hardcoded axis labels (`"Time →"`, `"Velocity"`) are always English, regardless of who calls the component. The Penile Doppler page (Task 3) uses this component four times (once for the illustrative example, three times for the pattern-comparison grid) and needs Arabic labels in all four.

**Files:**
- Modify: `src/components/illustrations/DopplerWaveformPanel.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import { useId } from "react";
import styles from "./DopplerWaveformPanel.module.css";

export type DopplerPattern = "normal" | "arterial-insufficiency" | "veno-occlusive";

const PATTERN_CONFIG_EN: Record<DopplerPattern, { peakY: number; troughY: number; psvLabel: string; edvLabel: string }> = {
  normal: { peakY: 18, troughY: 124, psvLabel: "PSV — adequate", edvLabel: "EDV — falls near zero" },
  "arterial-insufficiency": { peakY: 68, troughY: 120, psvLabel: "PSV — reduced", edvLabel: "EDV — falls near zero" },
  "veno-occlusive": { peakY: 18, troughY: 68, psvLabel: "PSV — adequate", edvLabel: "EDV — persistently elevated" },
};

/** Same peakY/troughY geometry as the English config — only the labels are translated. Keeping geometry in one place per pattern would be a premature abstraction for two three-entry records; the risk of drift is the same class the English config already accepts. */
const PATTERN_CONFIG_AR: Record<DopplerPattern, { peakY: number; troughY: number; psvLabel: string; edvLabel: string }> = {
  normal: { peakY: 18, troughY: 124, psvLabel: "PSV — كافية", edvLabel: "EDV — تنخفض نحو الصفر" },
  "arterial-insufficiency": { peakY: 68, troughY: 120, psvLabel: "PSV — منخفضة", edvLabel: "EDV — تنخفض نحو الصفر" },
  "veno-occlusive": { peakY: 18, troughY: 68, psvLabel: "PSV — كافية", edvLabel: "EDV — مرتفعة باستمرار" },
};

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 160;
const CYCLES = 3;
const ZERO_LINE_Y = 130;

/** Hand-shaped pulsatile trace: steep systolic upstroke, rounded peak, decay to a per-pattern diastolic trough, held flat until the next cycle. */
function buildWaveformPath(peakY: number, troughY: number): string {
  const cycleWidth = VIEW_WIDTH / CYCLES;
  let d = `M0,${troughY}`;
  for (let i = 0; i < CYCLES; i++) {
    const x0 = i * cycleWidth;
    const xPeak = x0 + cycleWidth * 0.18;
    const xDecayEnd = x0 + cycleWidth * 0.5;
    const xCycleEnd = x0 + cycleWidth;
    d += ` C${x0 + cycleWidth * 0.06},${troughY} ${x0 + cycleWidth * 0.1},${peakY} ${xPeak},${peakY}`;
    d += ` C${xPeak + cycleWidth * 0.08},${peakY} ${x0 + cycleWidth * 0.32},${troughY} ${xDecayEnd},${troughY}`;
    d += ` L${xCycleEnd},${troughY}`;
  }
  return d;
}

/** Closes the open wave trace down to the zero-line, for use as a fill area — spec R7.1.3 §2C: a filled "spectral envelope" reads closer to a real Doppler display than a bare stroked line. */
function buildFillPath(wavePath: string): string {
  return `${wavePath} L${VIEW_WIDTH},${ZERO_LINE_Y} L0,${ZERO_LINE_Y} Z`;
}

export function DopplerWaveformPanel({
  pattern,
  label,
  description,
  className = "",
  locale,
}: {
  pattern: DopplerPattern;
  label: string;
  description: string;
  className?: string;
  locale?: "ar";
}) {
  const isAr = locale === "ar";
  const { peakY, troughY, psvLabel, edvLabel } = (isAr ? PATTERN_CONFIG_AR : PATTERN_CONFIG_EN)[pattern];
  const path = buildWaveformPath(peakY, troughY);
  const fillPath = buildFillPath(path);
  const uid = useId();

  return (
    <div className={`${styles.panel} ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className={styles.trace}
        role="img"
        aria-label={`${label}: ${description}`}
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cba876" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#cba876" stopOpacity="0.02" />
          </linearGradient>
          <filter id={`${uid}-grain`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
          </filter>
        </defs>
        <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.panelBg} />
        <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="none" filter={`url(#${uid}-grain)`} opacity="0.4" />
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" x2={VIEW_WIDTH} y1={y} y2={y} className={styles.gridLine} />
        ))}
        <line x1="0" x2={VIEW_WIDTH} y1={ZERO_LINE_Y} y2={ZERO_LINE_Y} className={styles.floorLine} strokeDasharray="2 6" />
        <path d={fillPath} fill={`url(#${uid}-fill)`} stroke="none" />
        <path d={path} className={styles.wave} />
        <text x="12" y={Math.max(peakY - 8, 14)} className={styles.annotation}>{psvLabel}</text>
        <text x="12" y={troughY + 16} className={styles.annotation}>{edvLabel}</text>
        <text x="8" y={VIEW_HEIGHT - 6} className={styles.axisLabel}>{isAr ? "الوقت ←" : "Time →"}</text>
        <text x={VIEW_WIDTH - 8} y="14" textAnchor="end" className={styles.axisLabel}>{isAr ? "السرعة" : "Velocity"}</text>
      </svg>
      <p className={styles.panelLabel}>{label}</p>
      <p className={styles.panelCaption}>{description}</p>
    </div>
  );
}
```

Note on the time-axis arrow: the SVG's x-axis still runs left-to-right (the waveform geometry is unchanged), so the arrow is flipped to `←` for the Arabic label to match the reading direction of the Arabic word preceding it, not the data direction — this is a label-only convention choice, not a change to the chart's underlying geometry.

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -rn "DopplerWaveformPanel" src/app` — confirm the existing English call site (`/erectile-dysfunction/penile-doppler/page.tsx`, 4 usages) omits `locale` — renders with `PATTERN_CONFIG_EN` and `"Time →"`/`"Velocity"`, unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/illustrations/DopplerWaveformPanel.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to DopplerWaveformPanel

PATTERN_CONFIG's PSV/EDV labels and the axis labels ("Time →",
"Velocity") were always English regardless of caller. Needed for
Batch 2's Penile Doppler page, which uses this component four times.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Build `/ar/erectile-dysfunction`

Mirrors `src/app/(en)/(marketing)/erectile-dysfunction/page.tsx` section-for-section.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/erectile-dysfunction/page.tsx`

**Link status:** `/sexual-medicine` (breadcrumb parent) → `/ar/sexual-medicine` (live, Batch 1). `/mens-health/testosterone` → `/ar/mens-health/testosterone` (live, this batch — Task 4). `/erectile-dysfunction/penile-doppler` → `/ar/erectile-dysfunction/penile-doppler` (live, this batch — Task 3). `/erectile-dysfunction/shockwave-therapy` → stays English (not scheduled in any R9 Phase B batch). `/penile-implant` → `/ar/penile-implant` (live, this batch — Task 5). `/peyronies-disease` → `/ar/peyronies-disease` (live, this batch — Task 6). `/insights/venous-leak-erectile-dysfunction` → stays English, label marked `(مقال بالإنجليزية)`.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/erectile-dysfunction/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Brain, CircleDot, Droplets, Pill, Stethoscope, Syringe, TestTube, Waves, Zap } from "lucide-react";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { VascularFlowDiagram } from "@/components/illustrations/VascularFlowDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/erectile-dysfunction";

export const metadata: Metadata = buildMetadata({
  title: "تقييم وعلاج ضعف الانتصاب",
  description:
    "تقييم وعلاج متخصص لضعف الانتصاب في أبوظبي — أسباب وعائية وهرمونية واستقلابية ونفسية-جنسية، مع خطة علاج فردية تُلائم كل حالة.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "الطب الجنسي", href: "/ar/sexual-medicine" },
  { name: "ضعف الانتصاب", href: PATH },
];

const erectionStages = [
  {
    title: "التدفق الشرياني الداخل",
    description: "يجب أن يتدفق الدم بكمية كافية إلى القضيب عبر الشرايين المغذية له — وهو الشرط الأول، والأكثر ارتباطًا في الأذهان بمفهوم الانتصاب.",
  },
  {
    title: "استرخاء العضلات الملساء الكهفية",
    description: "يجب أن تسترخي العضلات الملساء داخل الأنسجة الكهفية (الجسم الكهفي)، مما يسمح لهذه الأنسجة بالتمدد والامتلاء بالدم.",
  },
  {
    title: "الانسداد الوريدي",
    description: "مع تمدد الأجسام الكهفية داخل الغلاف المحيط بها، تُضغط الأوردة التي تُصرّف الدم عادةً خارج القضيب، مما يقلل التدفق الخارج — وهي نتيجة ميكانيكية للتمدد الكامل، وليست صمامًا منفصلاً يُغلق.",
  },
  {
    title: "الصلابة",
    description: "يحافظ التدفق الداخل الكافي، والتمدد الكامل، وانخفاض التدفق الخارج معًا على الصلابة. وإذا كانت إحدى هذه المراحل غير مكتملة، فقد يضعف الانتصاب أو يصعب الحفاظ عليه.",
  },
];

const causes = [
  { label: "وعائية", description: "انخفاض تدفق الدم إلى القضيب، غالبًا ما يرتبط بعوامل خطر القلب والأوعية الدموية مثل ارتفاع ضغط الدم أو الكوليسترول أو التدخين." },
  { label: "هرمونية", description: "يمكن أن يسهم انخفاض التستوستيرون أو اختلالات هرمونية أخرى في ضعف وظيفة الانتصاب والرغبة الجنسية." },
  { label: "استقلابية", description: "يُعد السكري ومتلازمة الاستقلاب من الأسباب الشائعة، إذ يؤثران على الأوعية الدموية ووظيفة الأعصاب مع مرور الوقت." },
  { label: "عصبية", description: "يمكن أن تؤثر الحالات التي تصيب الأعصاب — بما في ذلك السكري وإصابات العمود الفقري وجراحات الحوض — على الإشارات المرتبطة بالانتصاب." },
  { label: "مرتبطة بالأدوية", description: "قد تؤثر بعض الأدوية، ومنها مضادات الاكتئاب وعلاجات ضغط الدم، على وظيفة الانتصاب كأثر جانبي." },
  { label: "نفسية-جنسية", description: "يمكن أن يكون للتوتر والقلق وعوامل العلاقة والمزاج دور، سواء بشكل مستقل أو إلى جانب أسباب جسدية." },
  { label: "حوضية / بنيوية", description: "يمكن أن تؤثر جراحات الحوض السابقة، أو العلاج الإشعاعي، أو حالات بنيوية مثل مرض بيروني، على وظيفة الانتصاب بشكل مباشر." },
];

const vascularMechanisms = [
  {
    title: "القصور الشرياني",
    description: "انخفاض تدفق الدم الواصل إلى القضيب عبر الشرايين المغذية له — وهو الجانب «الداخل» من هذه الآلية الفسيولوجية. غالبًا ما يرتبط بعوامل خطر القلب والأوعية الدموية مثل ارتفاع ضغط الدم أو الكوليسترول أو التدخين.",
    icon: Droplets,
  },
  {
    title: "الخلل الوظيفي في الانسداد الوريدي",
    description: "يُعرف أحيانًا بـ«التسرب الوريدي» — إذ لا ينخفض التدفق الخارج بالقدر الكافي بعد اكتمال الانتصاب، حتى مع كفاية التدفق الداخل. وهي نتيجة ميكانيكية لتمدد كهفي غير مكتمل، وليست صمامًا معطلاً منفصلاً.",
    icon: Waves,
  },
  {
    title: "أنماط وظيفية غير بنيوية",
    description: "ليس كل نمط يبدو وعائيًا هو نمط بنيوي بالضرورة. فقد ينتج نمط مشابه دون سبب تشريحي ثابت بسبب ضعف التحفيز أو القلق أو ارتفاع النشاط الودي أو عوامل استقلابية.",
    icon: Brain,
  },
];

const ladder = [
  { title: "إدارة نمط الحياة وعوامل الخطر", description: "معالجة عوامل خطر القلب والأوعية الدموية والوزن ومستوى النشاط والكحول والتدخين، حيثما كانت ذات صلة بالسبب الكامن.", icon: Activity },
  { title: "مثبطات PDE5", description: "دواء فموي يمكن أن يدعم وظيفة الانتصاب لدى المرضى المختارين بعناية، ويُوصف بعد التقييم.", icon: Pill },
  { title: "العلاج الهرموني عند الحاجة", description: "يُؤخذ بعين الاعتبار فقط عند تحديد سبب هرموني، مثل نقص التستوستيرون، أثناء التقييم.", icon: TestTube },
  { title: "خيارات الأجهزة الفراغية", description: "أجهزة ميكانيكية غير جراحية يمكن أن تدعم وظيفة الانتصاب لدى مرضى مختارين.", icon: CircleDot },
  { title: "علاج مختار بالموجات الصادمة", description: "يمكن النظر في العلاج بالموجات الصادمة منخفضة الشدة لدى مرضى مختارين حيثما كان ذلك مناسبًا سريريًا.", icon: Zap },
  { title: "العلاج داخل الكهفي", description: "علاج بالحقن يُعطى مباشرة داخل القضيب، ويُستخدم عندما لا تكون العلاجات الفموية مناسبة أو فعالة.", icon: Syringe },
  { title: "جراحة الغرسة القضيبية", description: "خيار جراحي يُؤخذ بعين الاعتبار في حالات ضعف الانتصاب الشديدة أو المقاومة للعلاج، بعد أن لم تعد العلاجات الأخرى تحقق نتائج موثوقة.", icon: Stethoscope },
];

const faqItems = [
  {
    question: "هل ضعف الانتصاب مشكلة جسدية دائمًا؟",
    answer: "لا. يمكن أن يكون لضعف الانتصاب أسباب جسدية وهرمونية ونفسية، وغالبًا ما تجتمع معًا. يهدف التقييم إلى تحديد العوامل ذات الصلة قبل التخطيط للعلاج.",
  },
  {
    question: "هل أحتاج إلى غرسة قضيبية؟",
    answer: "لا يحتاج معظم الرجال إلى تدخل جراحي. لا يُنظر في الغرسة القضيبية إلا في حالات ضعف الانتصاب الشديدة أو المقاومة للعلاج، بعد استكشاف خيارات العلاج الأخرى.",
  },
  {
    question: "ما هو تقييم دوبلر القضيب؟",
    answer: "هو فحص بالموجات فوق الصوتية لتدفق الدم في القضيب، يُستخدم عند الحاجة إلى تقييم سبب وعائي كجزء من التقييم الشامل.",
  },
  {
    question: "هل يمكن أن يرتبط ضعف الانتصاب بالتستوستيرون؟",
    answer: "نعم، من الممكن ذلك. يُعد التقييم الهرموني، بما في ذلك التستوستيرون، جزءًا من التقييم الشامل — رغم أن ضعف الانتصاب ليس هرمونيًا في كل الحالات.",
  },
  {
    question: "كيف يمكنني حجز استشارة؟",
    answer: `تُجرى الاستشارات في ${AR_IDENTITY.practiceLocationLine}. استخدم خيار «احجز استشارة» في هذه الصفحة، والذي يوجهك إلى إجراءات الحجز الرسمية لدى NMC.`,
  },
];

export default function ErectileDysfunctionPageAr() {
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
              name: "تقييم وعلاج ضعف الانتصاب",
              description: "تقييم وعلاج متخصص لضعف الانتصاب — أسباب وعائية وهرمونية واستقلابية ونفسية-جنسية، مع خطة علاج فردية تُلائم كل حالة.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Erectile Dysfunction",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.7fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                الطب الجنسي
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-display-xl text-foreground">
                تقييم وعلاج ضعف الانتصاب
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                يُختار العلاج وفقًا للسبب الكامن والتاريخ المرضي والأولويات
                الفردية — وليس وصفة موحدة تُطبق على الجميع.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="erectile_dysfunction" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
                <a
                  href="#treatment-ladder"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  اطّلع على سلّم العلاج
                </a>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="edHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Assessment vs treatment framing */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="التقييم أولاً"
            heading="تشخيص قبل الوصفة"
            size="md"
            description="يمكن أن يكون لضعف الانتصاب أسباب وعائية وهرمونية واستقلابية وعصبية ومرتبطة بالأدوية ونفسية-جنسية. تسبق الاستشارة والتقييم المناسب أي توصية علاجية."
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase text-muted-foreground">
              التقييم مقابل العلاج
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              يعني <strong className="text-foreground">التقييم</strong>{" "}
              فهم السبب: التاريخ المرضي، والفحص المناسب، والفحوصات
              الهرمونية أو الوعائية عند الحاجة. لا يُختار{" "}
              <strong className="text-foreground">العلاج</strong> إلا بعد
              وضوح هذه الصورة — وليس العكس.
            </p>
            <VascularFlowDiagram className="mt-8 h-24 w-full max-w-xs text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      {/* How an erection is maintained */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading
            eyebrow="فهم الآلية"
            heading="كيف يُحافظ على الانتصاب"
            description="أربع مراحل، لا آلية واحدة — ولهذا نادرًا ما يُفسَّر ضعف الانتصاب بالكامل بعبارة واحدة مثل «نقص الدم» أو «تسرب الأوردة»."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {erectionStages.map((stage, index) => (
              <StaggerItem key={stage.title} className="card-hover border-t border-border pt-6">
                <span className="font-display text-sm text-accent-strong">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg text-foreground">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Vascular mechanisms */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="التمييز بين الآليات"
            heading="الجانب الوعائي لضعف الانتصاب"
            description="يمثل انخفاض التدفق الشرياني الداخل، وضعف الانسداد الوريدي (يُعرف غالبًا بـ«التسرب الوريدي»)، والأنماط الوظيفية غير البنيوية ثلاث آليات وعائية مختلفة فعليًا — ويُستخدم تقييم دوبلر القضيب للتمييز بينها."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {vascularMechanisms.map((mechanism) => (
              <StaggerItem key={mechanism.title} className="card-hover border-t border-border pt-6">
                <mechanism.icon className="h-6 w-6 text-accent-strong" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg text-foreground">{mechanism.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mechanism.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-14 max-w-3xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              يُعد{" "}
              <Link href="/ar/erectile-dysfunction/penile-doppler" className="text-foreground underline decoration-accent-strong underline-offset-4">
                دوبلر القضيب
              </Link>{" "}
              وسيلة التمييز العملية بين هذه الآليات. لمزيد من التفصيل حول
              إحداها تحديدًا، انظر{" "}
              <Link href="/insights/venous-leak-erectile-dysfunction" className="text-foreground underline decoration-accent-strong underline-offset-4">
                Venous Leak and Erectile Dysfunction: What Penile Doppler
                Really Shows (مقال بالإنجليزية)
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cause matrix */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="فهم السبب" heading="العوامل المحتملة" locale="ar" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((cause) => (
              <StaggerItem key={cause.label} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{cause.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{cause.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Treatment ladder — dark section */}
      <section id="treatment-ladder" className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="سلّم العلاج" heading="علاج يُلائم السبب، خطوة بخطوة" locale="ar" />
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            لا يبدأ كل مريض من الخطوة الأولى، ولا يحتاج كل مريض إلى كل
            خطوة — يعكس السلّم نطاق الخيارات المطروحة، لا تسلسلاً ثابتًا
            يتبعه كل رجل.
          </p>

          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {ladder.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="card-hover grid grid-cols-[3rem_1fr] gap-x-6 gap-y-2 rounded-sm px-3 py-7 -mx-3 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline">
                  <div className="flex flex-col gap-1">
                    <step.icon aria-hidden size={18} className="text-accent-strong" />
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-foreground sm:col-start-2">
                    {step.title}
                  </h3>
                  <p className="col-span-2 text-sm text-muted-foreground sm:col-span-1 sm:col-start-3">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Risks / realistic expectations */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="توقعات واقعية" heading="المخاطر والحدود" size="md" locale="ar" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يحمل كل خيار في سلّم العلاج اعتباراته الخاصة — من تداخلات
              الأدوية وموانع الاستعمال مع مثبطات PDE5، إلى المخاطر
              الجراحية المرتبطة بجراحة الغرسة القضيبية. وتختلف الاستجابة
              لأي علاج، بما في ذلك العلاج بالموجات الصادمة، من شخص لآخر
              وغير مضمونة. تُناقش هذه الجوانب بالتفصيل أثناء الاستشارة،
              إلى جانب تاريخك المرضي، بحيث تعكس أي خطة علاجية ظروفك
              الفردية بدلاً من افتراض عام.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "دوبلر القضيب", href: "/ar/erectile-dysfunction/penile-doppler" },
          { label: "العلاج بالموجات الصادمة", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "جراحة الغرسة القضيبية", href: "/ar/penile-implant" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ بتقييم، لا بافتراض"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف الغرسات القضيبية", href: "/ar/penile-implant" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "AmpersandText\|tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/erectile-dysfunction/page.tsx"` — must return nothing (confirms the letter-spacing rule and the no-`AmpersandText`-on-Arabic rule were both followed). Confirm `RelatedTreatments` accepts a `locale` prop (added Batch 1, Task 4) and `Faq` accepts one (added Phase A/B0) — both already do, per direct reading.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/erectile-dysfunction/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/erectile-dysfunction

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Build `/ar/erectile-dysfunction/penile-doppler`

Mirrors `src/app/(en)/(marketing)/erectile-dysfunction/penile-doppler/page.tsx` section-for-section. Uses `DopplerWaveformPanel` with `locale="ar"` (Task 1).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/erectile-dysfunction/penile-doppler/page.tsx`

**Link status:** `/erectile-dysfunction` (breadcrumb parent + self) → `/ar/erectile-dysfunction` (live, this batch — Task 2). `/mens-health/testosterone` → `/ar/mens-health/testosterone` (live, this batch — Task 4). `/erectile-dysfunction/shockwave-therapy` → stays English. `/penile-implant` → `/ar/penile-implant` (live, this batch — Task 5). `/peyronies-disease` → `/ar/peyronies-disease` (live, this batch — Task 6). `/insights/venous-leak-erectile-dysfunction` → stays English, label marked `(مقال بالإنجليزية)`.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/erectile-dysfunction/penile-doppler/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DopplerWaveformPanel, UltrasoundEchoFan } from "@/components/illustrations";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/erectile-dysfunction/penile-doppler";

export const metadata: Metadata = buildMetadata({
  title: "دوبلر القضيب — تقييم متقدم لضعف الانتصاب",
  description:
    "تقييم دوبلر القضيب (الموجات فوق الصوتية الثنائية للقضيب) في أبوظبي — التدفق الشرياني الداخل، وظيفة الانسداد الوريدي، وكيفية توجيه النتائج لخطة علاج ضعف الانتصاب.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
  { name: "دوبلر القضيب", href: PATH },
];

const evaluates = [
  {
    title: "التدفق الشرياني الداخل",
    description: "تدفق الدم إلى القضيب، يُقيَّم لتحديد ما إذا كان انخفاض الإمداد الشرياني يسهم في ضعف الانتصاب.",
  },
  {
    title: "وظيفة الانسداد الوريدي",
    description: "مدى احتفاظ القضيب بالدم أثناء الانتصاب. يمكن أن يسمح ضعف وظيفة الانسداد الوريدي بتصريف الدم بسرعة زائدة، مما يؤثر على الصلابة.",
  },
  {
    title: "الاستجابة للتحفيز",
    description: "يتضمن الفحص عادة حقنة داخل الكهفي لتحفيز الانتصاب دوائيًا، مما يتيح تقييم تدفق الدم في ظروف موحدة.",
  },
];

const arterialContributors = [
  "السكري", "التدخين", "ارتفاع ضغط الدم", "متلازمة الاستقلاب",
  "أمراض الأوعية الدموية", "الخلل البطاني", "التقدم في العمر",
];

const dopplerContextFactors = [
  "جودة الانتصاب المتحقق فعليًا أثناء الفحص",
  "توقيت القياس بعد الحقنة المحفزة",
  "الاستجابة الفردية للعامل الدوائي المستخدم",
  "مدى كفاية التحفيز أثناء الفحص",
  "الأعراض والتاريخ المرضي المذكور أثناء الاستشارة",
  "ما إذا كانت الانتصابات التلقائية ما زالت تحدث",
  "ما إذا كانت الانتصابات أثناء الاستمناء تختلف عنها مع الشريك",
  "عوامل الخطر الوعائية",
  "السياق الاستقلابي",
  "السياق الهرموني",
];

const approachPrinciples = [
  "تُقرأ الأعراض والتاريخ المرضي أولاً، لا الأرقام بمعزل عنها",
  "تُؤخذ جودة الانتصاب المتحقق فعليًا أثناء الفحص بعين الاعتبار، لا السرعات المقاسة فقط",
  "تُفسَّر النتائج الشريانية والانسدادية الوريدية معًا، لا كحكمين مستقلين",
  "تُراعى العوامل الهرمونية والاستقلابية إلى جانب الفحص",
  "توفر الانتصابات التلقائية والانتصابات أثناء الاستمناء سياقًا واقعيًا لا يقدمه فحص واحد",
  "لا يُفترض وجود تسرب وريدي ظاهر تلقائيًا من قيمة مرتفعة واحدة",
  "يتبع العلاج الآلية المحددة فعليًا — لا تصنيف دوبلر يُطبَّق بمفرده",
];

const faqItems = [
  {
    question: "هل أحتاج إلى فحص دوبلر القضيب؟",
    answer: "ليس بالضرورة. يُنظر فيه عند الاشتباه بسبب وعائي، أو عندما لا يستجيب العلاج الأولي كما هو متوقع، أو قبل إجراءات معينة — يُقيَّم بشكل فردي، وليس روتينيًا لكل مريض.",
  },
  {
    question: "ماذا يتضمن الفحص؟",
    answer: "يتضمن الفحص حقنة لتحفيز الانتصاب لأغراض التقييم، تليها تصوير بالموجات فوق الصوتية لتدفق الدم. يُشرح ما يمكن توقعه بالتفصيل مسبقًا.",
  },
  {
    question: "ما هو ضعف الانتصاب الشرياني؟",
    answer: "هو ضعف انتصاب يكون فيه العامل الرئيسي انخفاض تدفق الدم الواصل إلى القضيب عبر الشرايين المغذية له — وغالبًا ما يرتبط بالسكري أو التدخين أو ارتفاع ضغط الدم أو متلازمة الاستقلاب أو أمراض الأوعية الدموية أو التقدم في العمر. يساعد دوبلر القضيب في تقييم التدفق الشرياني الداخل تحديدًا، رغم أن قياسًا واحدًا لا يُشخَّص كمرض شرياني دون النظر إلى الصورة السريرية الأوسع.",
  },
  {
    question: "ما هو التسرب الوريدي؟",
    answer: "هو نمط يبدو فيه التدفق الوريدي الخارج أعلى من المتوقع أثناء الانتصاب، ويوصف أحيانًا بأن الدم «يتسرب بسرعة زائدة». لكن الأمر أكثر تعقيدًا من مجرد أنبوب مسرّب — فالانسداد الوريدي الطبيعي يعتمد على كفاية التدفق الداخل والتمدد الكهفي الكامل الذي يضغط على التدفق الخارج، لذا فإن انتصابًا غير مكتمل قد يُظهر نمطًا مشابهًا دون وجود مشكلة وريدية بنيوية ثابتة.",
    readMoreHref: "#venous-leak",
    readMoreLabel: "اقرأ المزيد أدناه: التسرب الوريدي أكثر تعقيدًا مما يبدو",
  },
  {
    question: "هل تعني السرعة الانبساطية النهائية (EDV) المرتفعة دائمًا وجود تسرب وريدي؟",
    answer: "لا. تساعد السرعة الانبساطية النهائية (EDV) في تقييم مقدار التدفق الخارج المستمر أثناء الانتصاب، لكن يجب قراءتها إلى جانب مدى صلابة الانتصاب فعليًا أثناء الفحص. فإذا لم يتحقق التمدد الكهفي الكامل — بسبب ضعف التحفيز أو القلق أو استجابة غير مثالية لحقنة الفحص — فقد يبدو التدفق الخارج مرتفعًا دون وجود تسرب بنيوي ثابت.",
  },
  {
    question: "هل يمكن أن يؤثر القلق على فحص دوبلر القضيب؟",
    answer: "نعم. يعتمد الفحص على تحقيق استجابة انتصابية حقيقية لحقنة محفزة، ويمكن للقلق في هذا السياق أن يؤثر على مدى استرخاء وتمدد الأنسجة الكهفية — مما قد يؤثر بدوره على السرعات المقاسة، بمعزل عن أي مشكلة وعائية كامنة.",
  },
  {
    question: "هل يمكن أن يجعل النشاط الودي الحفاظ على الانتصاب صعبًا؟",
    answer: "قد يعكس النمط الانسدادي الوريدي الظاهر لدى بعض الرجال استرخاءً كهفيًا غير مكتمل أو صلابة غير مكتملة بدلاً من عيب بنيوي ثابت — ويُعد ارتفاع النشاط الودي (استجابة الجسم للتوتر) أحد العوامل التي يمكن أن تسهم في استرخاء غير مكتمل في بيئة سريرية مثل فحص الدوبلر.",
  },
  {
    question: "لماذا قد تكون الانتصابات أفضل أثناء الاستمناء منها أثناء الجماع؟",
    answer: "هذه معلومة مفيدة فعليًا في التاريخ المرضي، وليست مجرد ملاحظة عابرة — فهي تشير إلى دور عوامل الأداء أو السياق، بدلاً من مشكلة بنيوية ثابتة، إذ إن التشريح الوعائي الكامن واحد في كلتا الحالتين. وهي من الأمور المحددة التي تُسأل عنها أثناء التقييم، وجزء من سبب كون الانتصابات التلقائية وانتصابات الاستمناء توفر سياقًا لا يقدمه فحص واحد.",
  },
  {
    question: "هل يمكن أن يؤثر التستوستيرون على وظيفة الانتصاب؟",
    answer: "يمكن أن يسهم، إلى جانب آليات وعائية وعصبية — رغم أنه نادرًا ما يكون العامل الوحيد. يُراعى التقييم الهرموني كجزء من التقييم الشامل لضعف الانتصاب عند الحاجة، ولا يُعامل كسؤال منفصل غير ذي صلة.",
    readMoreHref: "/ar/mens-health/testosterone",
    readMoreLabel: "استكشف التستوستيرون والصحة الهرمونية",
  },
  {
    question: "متى يكون دوبلر القضيب مفيدًا؟",
    answer: "يكون مفيدًا عندما تحتاج الحالة الوعائية إلى توضيح فعلي — على سبيل المثال عندما لا يستجيب العلاج كما هو متوقع، أو عند التخطيط لجراحة مثل الغرسة القضيبية، أو عند الحاجة للتمييز بين عامل شرياني وآخر انسدادي وريدي بما يغيّر مسار النقاش العلاجي. وهو ليس خطوة أولى روتينية لكل مريض يعاني من ضعف الانتصاب.",
  },
  {
    question: "هل يمكن لدوبلر القضيب التمييز بين المشكلات الشريانية والانسدادية الوريدية؟",
    answer: "يمكن أن يساعد — إذ تعكس ذروة السرعة الانقباضية (PSV) بشكل أساسي التدفق الشرياني الداخل، بينما تساعد السرعة الانبساطية النهائية (EDV) في تقييم التدفق الخارج المستمر. لكن كلاهما يُقرأ في سياق جودة الانتصاب المتحقق، وتوقيت الاستجابة لحقنة الفحص، وصورتك السريرية الأوسع — لا كرقمين ينتجان تشخيصًا بمفردهما.",
  },
  {
    question: "هل يتطلب التسرب الوريدي جراحة دائمًا؟",
    answer: "لا. بما أن النمط الانسدادي الوريدي الظاهر قد يعكس استرخاءً غير مكتمل أو ضعف تحفيز أو عوامل استقلابية وهرمونية بدلاً من عيب بنيوي ثابت، فإن العلاج يتبع الآلية المحددة فعليًا — وهو ما قد يعني معالجة عامل مساهم بدلاً من الجراحة. لا تُطرح الخيارات الجراحية إلا لنمط بنيوي مؤكد فعليًا، وتُناقش بشكل فردي.",
  },
];

export default function PenileDopplerPageAr() {
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
              name: "دوبلر القضيب — تقييم متقدم لضعف الانتصاب",
              description: "تقييم دوبلر القضيب الثنائي للتدفق الشرياني الداخل ووظيفة الانسداد الوريدي، يُستخدم كجزء من التقييم المتقدم لضعف الانتصاب.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Duplex Ultrasound",
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
              تقييم متقدم لضعف الانتصاب
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              دوبلر القضيب
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم بالموجات فوق الصوتية لتدفق الدم في القضيب، يُستخدم
              كجزء من التقييم المتقدم لضعف الانتصاب عند الحاجة لتقييم
              سبب وعائي بالتفصيل.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_doppler" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Illustrative Doppler visual */}
      <section className="border-t border-border py-section-y">
        <Container className="max-w-3xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start">
            <div>
              <UltrasoundEchoFan className="w-full max-w-[11rem]" />
              <p className="mt-3 text-xs text-muted-foreground">صورة توضيحية محاكاة للموجات فوق الصوتية</p>
            </div>
            <DopplerWaveformPanel
              pattern="normal"
              label="مثال توضيحي لموجة دوبلر"
              description="تصور توضيحي محاكى لمخطط دوبلر طيفي طبيعي — وليس فحصًا لمريض حقيقي. تختلف الفحوصات الفعلية بين الأفراد."
              locale="ar"
            />
          </div>
        </Container>
      </section>

      {/* When indicated */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="متى قد يُشار إليه"
            heading="ليس فحصًا روتينيًا لكل مريض"
            size="md"
            description="قد يُنظر في دوبلر القضيب عند الاشتباه بسبب وعائي، أو عندما لا يقدم العلاج الأولي الاستجابة المتوقعة، أو عند التخطيط قبل إجراء مثل جراحة الغرسة القضيبية — يُقيَّم بشكل فردي، لا كخطوة افتراضية."
            locale="ar"
          />
        </Container>
      </section>

      {/* What the test evaluates */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="ما الذي يقيّمه الفحص" heading="ثلاثة أمور ينظر إليها الفحص" locale="ar" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 border-t border-border pt-12 md:grid-cols-3">
            {evaluates.map((item, index) => (
              <StaggerItem key={item.title} className="card-hover">
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Arterial ED */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="إحدى آليتين"
            heading="ضعف الانتصاب الشرياني"
            size="md"
            description="يعني ضعف الانتصاب الشرياني أن العامل الرئيسي هو انخفاض تدفق الدم الواصل إلى القضيب عبر الشرايين المغذية له — وهو الجانب «الداخل» من الآلية الفسيولوجية الموضحة أعلاه."
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase text-muted-foreground">
              ما يسهم فيه عادة
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {arterialContributors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              يمكن لدوبلر القضيب أن يساعد في تقييم التدفق الشرياني الداخل
              تحديدًا، ويُقاس بذروة السرعة الانقباضية (PSV). لكن رقمًا
              واحدًا لا يُشخَّص بمفرده كمرض شرياني — إذ يُقرأ إلى جانب
              عوامل الخطر الوعائية والأعراض وبقية الصورة السريرية.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Venous leak */}
      <section id="venous-leak" className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="الآلية الأخرى"
            heading="التسرب الوريدي أكثر تعقيدًا مما يبدو"
            size="md"
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              لا يعني ما يُسمى بالتسرب الوريدي بالضرورة أن أحد الأوردة
              معطل بشكل دائم أو مفتوح ببساطة. يعتمد الانسداد الوريدي
              الطبيعي — وهو انخفاض التدفق الخارج الذي يحافظ على
              الانتصاب — على كفاية التدفق الشرياني الداخل، واسترخاء
              العضلات الملساء، والتمدد الكهفي الكامل، وما ينتج عنه من
              ضغط على التدفق الوريدي الخارج مقابل الغلاف الكهفي. إنه
              نتيجة نهائية لسلسلة من الأحداث، لا مفتاحًا مستقلاً.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              إذا كانت الصلابة أثناء التقييم غير مكتملة لأي سبب، فقد
              يبقى التدفق الوريدي الخارج قابلاً للقياس ببساطة لأن الضغط
              الكامل لم يتحقق قط. ولهذا السبب لا ينبغي تفسير ارتفاع
              السرعة الانبساطية النهائية (EDV) تلقائيًا وبمعزل عن غيره
              كتسرب وريدي بنيوي ثابت.
            </p>
            <p className="mt-6 text-sm">
              <Link href="/insights/venous-leak-erectile-dysfunction" className="text-foreground underline decoration-accent-strong underline-offset-4">
                اقرأ المقال كاملاً: Venous Leak and Erectile Dysfunction
                (مقال بالإنجليزية)
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three-pattern Doppler comparison */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="مقارنة الأنماط"
            heading="ثلاثة أنماط استجابة في دوبلر"
            size="md"
            description="مخططات موجية توضيحية وتعليمية — وليست فحوصات تشخيصية حقيقية — توضح كيف يمكن أن تبدو الآليات الثلاث المذكورة أعلاه على مخطط دوبلر طيفي."
            locale="ar"
          />
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <DopplerWaveformPanel
              pattern="normal"
              label="أ. استجابة طبيعية"
              description="تدفق شرياني داخل كافٍ. ترتفع ذروة السرعة الانقباضية (PSV) بشكل مناسب وتنخفض السرعة الانبساطية النهائية (EDV) نحو الصفر مع اكتمال الصلابة."
              locale="ar"
            />
            <DopplerWaveformPanel
              pattern="arterial-insufficiency"
              label="ب. القصور الشرياني"
              description="انخفاض التدفق الشرياني الداخل، وينعكس ذلك في استجابة أقل لذروة السرعة الانقباضية (PSV)."
              locale="ar"
            />
            <DopplerWaveformPanel
              pattern="veno-occlusive"
              label="ج. الخلل الوظيفي الانسدادي الوريدي (التسرب الوريدي)"
              description="قد يكون التدفق الشرياني الداخل كافيًا، لكن التدفق الخارج لا يُثبَّط بشكل كافٍ — وتبقى السرعة الانبساطية النهائية (EDV) مرتفعة باستمرار رغم الانتصاب."
              locale="ar"
            />
          </div>
        </Container>
      </section>

      {/* Functional veno-occlusive patterns */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="لماذا يهم السياق" heading="الأنماط الانسدادية الوريدية الوظيفية" size="md" locale="ar" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              قد يعكس النمط الانسدادي الوريدي الظاهر لدى بعض الرجال
              استرخاءً كهفيًا غير مكتمل أو صلابة غير مكتملة أثناء الفحص —
              لا عيبًا بنيويًا ثابتًا. وقد تشمل العوامل المساهمة ضعف
              التحفيز، أو قلق الأداء، أو ارتفاع النشاط الودي، أو استجابة
              غير مثالية للعامل الدوائي المستخدم، أو عوامل استقلابية
              وهرمونية. ولهذا السبب تُعد جودة الانتصاب المتحقق فعليًا
              أثناء الفحص جزءًا من كيفية قراءة النتيجة، لا هامشًا عليها.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Reading PSV and EDV in context */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="قراءة الأرقام" heading="ذروة السرعة الانقباضية والسرعة الانبساطية النهائية نقطة بداية، لا تشخيص" locale="ar" />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <Reveal className="card-hover border-t border-border pt-6">
              <h3 className="font-display text-lg text-foreground">PSV</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">ذروة السرعة الانقباضية — تعكس بشكل أساسي التدفق الشرياني الداخل.</p>
            </Reveal>
            <Reveal delay={0.05} className="card-hover border-t border-border pt-6">
              <h3 className="font-display text-lg text-foreground">EDV</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">السرعة الانبساطية النهائية — تساعد في تقييم التدفق الخارج المستمر أثناء الانتصاب.</p>
            </Reveal>
          </div>
          <p className="mt-10 max-w-2xl text-sm font-medium uppercase text-muted-foreground">
            لكن كلاهما يُفسَّر إلى جانب
          </p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {dopplerContextFactors.map((factor) => (
              <StaggerItem key={factor} className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {factor}
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              ليس الدوبلر مجرد جهاز ينتج تشخيصًا من رقم واحد — بل هو جزء
              واحد من تقييم لا يكون مفيدًا إلا بقدر السياق الذي يُقرأ
              ضمنه.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Dr. Molina's approach */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="نهجنا" heading="تفسير الدوبلر ضمن سياقه" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {approachPrinciples.map((principle, index) => (
              <StaggerItem key={principle}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{principle}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Interpretation — olive */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              تفسير النتائج
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              سياق، لا حكم نهائي.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تُفسَّر النتائج إلى جانب تاريخك المرضي والفحص السريري
              ونتائج التقييم الأخرى — لا بمعزل عنها. يمكن أن تساعد
              النتائج في توضيح وجود عامل وعائي، وتوجيه اختيار الخيارات
              الأنسب على سلّم علاج ضعف الانتصاب، لكن الفحص نفسه لا يحل
              محل الحكم السريري ولا يحدد العلاج بمفرده.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "العلاج بالموجات الصادمة", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "جراحة الغرسة القضيبية", href: "/ar/penile-implant" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش ما إذا كان التقييم مناسبًا لك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass (confirms `DopplerWaveformPanel`'s new `locale` prop from Task 1 is used correctly here). Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/erectile-dysfunction/penile-doppler/page.tsx"` — must return nothing.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/erectile-dysfunction/penile-doppler/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/erectile-dysfunction/penile-doppler

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Build `/ar/sexual-medicine/premature-ejaculation`

Mirrors `src/app/(en)/(marketing)/sexual-medicine/premature-ejaculation/page.tsx` section-for-section.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/sexual-medicine/premature-ejaculation/page.tsx`

**Link status:** `/sexual-medicine` (breadcrumb parent + related) → `/ar/sexual-medicine` (live, Batch 1). `/mens-health/testosterone` → `/ar/mens-health/testosterone` (live, this batch — Task 5). `/about` → `/ar/about` (live, Batch 1).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/sexual-medicine/premature-ejaculation/page.tsx
import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { ResponseThresholdDiagram } from "@/components/illustrations/ResponseThresholdDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/sexual-medicine/premature-ejaculation";

export const metadata: Metadata = buildMetadata({
  title: "سرعة القذف",
  description:
    "تقييم متخصص لسرعة القذف في أبوظبي — خيارات سلوكية ونفسية-جنسية وطبية وإجرائية تُلائم كل حالة، بما في ذلك علاج حمض الهيالورونيك في الحشفة في حالات مختارة.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "الطب الجنسي", href: "/ar/sexual-medicine" },
  { name: "سرعة القذف", href: PATH },
];

const factors = [
  { label: "نفسية / قلق الأداء", description: "يمكن أن يؤدي القلق بشأن الأداء الجنسي، سواء كان طويل الأمد أو ظرفيًا، إلى تقصير زمن القذف بحد ذاته." },
  { label: "سياق العلاقة", description: "يمكن أن تكون العلاقات الجديدة، أو قلة النشاط الجنسي، أو التوتر في العلاقة، عوامل مساهمة ذات صلة." },
  { label: "الحساسية / عتبة الاستجابة", description: "يمتلك بعض الرجال عتبة استجابة قذفية منخفضة بطبيعتهم، موجودة منذ التجارب الجنسية الأولى." },
  { label: "ضعف الانتصاب", description: "يمكن أن يؤدي القلق بشأن الحفاظ على الانتصاب إلى تقصير زمن القذف بشكل مستقل — وغالبًا ما يُقيَّم الاثنان معًا." },
  { label: "عوامل هرمونية أو طبية", description: "بشكل أقل شيوعًا، يمكن أن تسهم عوامل هرمونية أو متعلقة بالبروستاتا أو عصبية، وتُراعى عند الحاجة." },
  { label: "التجارب السابقة", description: "يمكن أن تلعب الأنماط المكتسبة من تجارب جنسية سابقة دورًا، بمعزل عن أي سبب جسدي." },
];

const approaches = [
  { title: "تقنيات سلوكية", description: "تقنيات منظمة، مثل أسلوبي التوقف والبدء أو الضغط، تهدف إلى بناء الوعي والتحكم مع مرور الوقت." },
  { title: "الدعم النفسي-الجنسي", description: "يُنظر فيه عندما يبدو أن قلق الأداء أو عوامل العلاقة أو التجارب السابقة عوامل مساهمة مهمة." },
  { title: "العلاج الطبي", description: "يمكن النظر في خيارات فموية أو موضعية بعد التقييم، بما يلائم النمط المعني وأي موانع استعمال." },
  { title: "خيارات إجرائية في حالات مختارة", description: "قد يكون عدد قليل من المرضى مرشحين لخيار إجرائي، يُناقش بشكل فردي وبعد النظر في الخيارات أعلاه فقط." },
];

const glansProcedurePoints = [
  "تُقيَّم الملاءمة بشكل فردي، بناءً على الأعراض والتاريخ المرضي والتشريح والتوقعات — ولا يُطرح كخيار روتيني أو افتراضي.",
  "تُناقش الأهداف والحدود الواقعية بالتفصيل قبل النظر في أي إجراء.",
  "هو جزء واحد من استراتيجية إدارة أوسع، لا حلاً قائمًا بذاته مضمون النتيجة.",
  "لا يُناقش إلا إلى جانب الخيارات السلوكية والنفسية-الجنسية والطبية أعلاه، بما يلائم نتائج التقييم الفردي.",
];

const faqItems = [
  {
    question: "هل سرعة القذف شائعة؟",
    answer: "القذف المبكر العرضي شائع وليس مصدر قلق طبي بالضرورة. يركز التقييم على التكرار، ودرجة التحكم، والضيق أو الصعوبة التي يسببها — لا على عتبة زمنية واحدة.",
  },
  {
    question: "ما الفرق بين سرعة القذف الدائمة والمكتسبة؟",
    answer: "سرعة القذف الدائمة موجودة منذ التجارب الجنسية الأولى للرجل. أما سرعة القذف المكتسبة فتتطور لاحقًا، وغالبًا إلى جانب عامل مساهم محدد. هذا التمييز مهم لكيفية التقييم والتعامل مع الحالة.",
  },
  {
    question: "هل ترتبط سرعة القذف بضعف الانتصاب؟",
    answer: "من الممكن ذلك. يمكن أن يؤدي القلق بشأن الحفاظ على الانتصاب إلى تقصير زمن القذف بشكل مستقل، ولهذا يُقيَّم الاثنان معًا بدلاً من التعامل مع كل منهما بمعزل عن الآخر.",
  },
  {
    question: "ما هو علاج حمض الهيالورونيك في الحشفة، وهل هو مناسب لي؟",
    answer: "هو خيار إجرائي قد يُنظر فيه في حالات مختارة كجزء من استراتيجية إدارة أوسع — وليس الخيار الأول أو الوحيد. تعتمد الملاءمة على التقييم الفردي ولا تُفترض مسبقًا أبدًا.",
  },
  {
    question: "هل سأُعرض عليّ الأدوية أو الإجراء تلقائيًا؟",
    answer: "لا. يُختار العلاج وفقًا للنمط المعني والعوامل المساهمة والأولويات الفردية — تُراعى الخيارات السلوكية والنفسية-الجنسية إلى جانب الخيارات الطبية والإجرائية، لا يُتجاوزان.",
  },
  {
    question: "كيف أبدأ؟",
    answer: "تبدأ العملية باستشارة سرية لفهم النمط المعني، وأي عوامل مساهمة، والنهج — أو مجموعة النُهج — التي قد تكون مناسبة.",
  },
];

export default function PrematureEjaculationPageAr() {
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
              name: "سرعة القذف",
              description: "تقييم متخصص لسرعة القذف — خيارات سلوكية ونفسية-جنسية وطبية وإجرائية تُلائم كل حالة.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Premature Ejaculation",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                الطب الجنسي
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-display-xl text-foreground">
                سرعة القذف
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                تقييم متخصص للقذف الذي يحدث أسرع من المرغوب، مع النظر في
                العلاج عبر خيارات سلوكية ونفسية-جنسية وطبية وإجرائية —
                تُلائم الفرد، لا نهجًا افتراضيًا واحدًا.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="premature_ejaculation" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
                <a
                  href="#treatment-approach"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  اطّلع على نهج العلاج
                </a>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="peHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* What it is */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="ما هي"
            heading="تراجع التحكم في توقيت القذف"
            size="md"
            description="تشير سرعة القذف إلى حدوث القذف أسرع مما يرغب الرجل أو شريكته، غالبًا مع شعور محدود بالتحكم، وما يصاحب ذلك من ضيق."
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase text-muted-foreground">
              ليست عتبة زمنية واحدة
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              القذف المبكر العرضي شائع وليس مصدر قلق طبي بالضرورة. يركز
              التقييم على <strong className="text-foreground">التكرار</strong>،
              و<strong className="text-foreground">درجة التحكم</strong>،
              و<strong className="text-foreground">الضيق أو الصعوبة</strong>{" "}
              التي يسببها — لا على مقارنته برقم ثابت.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Contributing factors */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow="لماذا يهم التقييم" heading="يمكن أن تسهم عدة عوامل" locale="ar" />
          <Reveal delay={0.05} className="mt-10 flex justify-center sm:justify-start">
            <ResponseThresholdDiagram className="h-24 w-24 text-muted-foreground" />
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {factors.map((factor) => (
              <StaggerItem key={factor.label} className="border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{factor.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{factor.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Treatment approach — dark section */}
      <section id="treatment-approach" className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="نهج العلاج" heading="يُلائم الفرد، لا تسلسلاً ثابتًا" locale="ar" />
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            لا يحتاج كل رجل إلى كل نهج، ولا توجد نقطة بداية صحيحة واحدة —
            يعتمد النهج على ما إذا كان النمط دائمًا أو مكتسبًا، وما إذا
            كان ضعف الانتصاب حاضرًا أيضًا، والعوامل الشخصية وعوامل
            العلاقة.
          </p>

          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {approaches.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="grid grid-cols-[3rem_1fr] gap-x-6 gap-y-2 py-7 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline">
                  <span className="font-display text-2xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl text-foreground sm:col-start-2">
                    {step.title}
                  </h3>
                  <p className="col-span-2 text-sm text-muted-foreground sm:col-span-1 sm:col-start-3">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Selected procedural option */}
      <section className="border-t border-border py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            خيار إجرائي مختار
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            علاج حمض الهيالورونيك في الحشفة
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            في حالات مختارة، يمكن النظر في علاج حمض الهيالورونيك في
            الحشفة كجزء من استراتيجية إدارة أوسع لسرعة القذف. هذا ليس
            الخيار الأول أو الوحيد، وغير مناسب لكل مريض، ولا يُنظر فيه
            إلا بعد أن يوضح التقييم النمط المعني وبعد مناقشة الخيارات
            أعلاه.
          </p>
          <ul className="mt-8 space-y-4 border-t border-border pt-8">
            {glansProcedurePoints.map((point) => (
              <li key={point} className="flex gap-4 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          يُنظر في كل نهج — سلوكي أو نفسي-جنسي أو طبي أو إجرائي — بناءً
          على التقييم الفردي، ولا يُفترض أبدًا من وصف عام.
        </PullQuote>
      </Container>

      {/* Why specialist care */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            لماذا الرعاية المتخصصة
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            {AR_IDENTITY.doctorDisplayName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            تُقيَّم سرعة القذف ضمن ممارسة استشاري أمراض المسالك البولية
            والذكورة، إلى جانب الصحة الجنسية والهرمونية ذات الصلة — إذ
            يمكن أن تكون وظيفة الانتصاب والعوامل الهرمونية والسياق
            النفسي-الجنسي جميعها ذات صلة بالحالة نفسها.
          </p>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "الطب الجنسي", href: "/ar/sexual-medicine" },
          { label: "نبذة عن د. مولينا", href: "/ar/about" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ بتقييم فردي"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/sexual-medicine/premature-ejaculation/page.tsx"` — must return nothing. Confirm `AR_IDENTITY.doctorDisplayName`/`doctorTitle` render instead of any new local literal.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/sexual-medicine/premature-ejaculation/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/sexual-medicine/premature-ejaculation

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Build `/ar/mens-health/testosterone`

Mirrors `src/app/(en)/(marketing)/mens-health/testosterone/page.tsx` section-for-section. **This is the page the already-live `/ar/mens-health` hub and two homepage section components currently link to in temporary English — Task 9 flips those once this page exists.**

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx`

**Link status:** `/mens-health` (breadcrumb parent) → `/ar/mens-health` (live, Batch 1). `/erectile-dysfunction` → `/ar/erectile-dysfunction` (live, this batch — Task 2). `/male-fertility` → `/ar/male-fertility` (live, Batch 1). `/male-fertility/varicocele` → `/ar/male-fertility/varicocele` (live, this batch — Task 8). Four `/insights/...` links → stay English, labels marked `(مقال بالإنجليزية)`. English source omits `BookingCta` `children` and `TreatmentCtaSection` `bookingLabel` (relying on the English default) — per the global constraint, this Arabic page passes both explicitly.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { HormoneBalanceDiagram } from "@/components/illustrations/HormoneBalanceDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import { publications } from "@/config/reputation";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/mens-health/testosterone";

export const metadata: Metadata = buildMetadata({
  title: "التستوستيرون والصحة الهرمونية للرجال في أبوظبي",
  description:
    "تقييم التستوستيرون والصحة الهرمونية للرجال في أبوظبي — الأعراض والتشخيص والفحص الكيميائي الحيوي الكامل، ومتى يكون العلاج مناسبًا سريريًا.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "صحة الرجل", href: "/ar/mens-health" },
  { name: "التستوستيرون والصحة الهرمونية للرجال", href: PATH },
];

/** Topic-label translations for the Men's Health Spain articles — external Spanish-language articles; these are topic descriptions, matching the exact wording used on /ar/about for consistency, not translated titles of an Arabic destination. */
const PUBLICATION_LABELS_AR: Record<string, string> = {
  "Testosterone and the body's daily rhythm": "التستوستيرون والإيقاع اليومي للجسم",
  "Testosterone, explained by an andrologist": "التستوستيرون بشرح طبيب الذكورة",
  "What testosterone actually does": "ما الذي يفعله التستوستيرون فعليًا",
};

const panel = [
  { label: "التستوستيرون الكلي والحر", description: "الهرمون الأساسي الذي يُقاس، سواء المرتبط أو الحر." },
  { label: "SHBG", description: "الغلوبيولين الرابط للهرمونات الجنسية — يؤثر على مقدار التستوستيرون المتاح بيولوجيًا." },
  { label: "LH / FSH", description: "هرمونات نخامية تساعد في التمييز بين الأنماط الأولية والثانوية." },
  { label: "البرولاكتين", description: "يُقيَّم كعامل محتمل مساهم في الأعراض الهرمونية والجنسية." },
  { label: "الغدة الدرقية", description: "يمكن أن تؤثر وظيفة الغدة الدرقية بشكل مستقل على الطاقة والرغبة الجنسية والمزاج." },
  { label: "الصحة الاستقلابية", description: "يتفاعل الوزن ومقاومة الإنسولين ومتلازمة الاستقلاب جميعها مع التستوستيرون." },
  { label: "النوم", description: "يمكن أن يؤدي ضعف النوم، بما في ذلك انقطاع النفس النومي غير المعالج، إلى خفض مستويات التستوستيرون." },
  { label: "خطط الإنجاب", description: "مهمة قبل بدء أي علاج هرموني قد يؤثر على الخصوبة." },
];

const approachPillars = [
  { title: "الأعراض والكيمياء الحيوية معًا", description: "لا يشكل الرقم وحده تشخيصًا، ولا الأعراض وحدها كذلك. يُقرأ الاثنان معًا، لأن كلًا منهما بمعزل عن الآخر قد يُضلل." },
  { title: "التستوستيرون الحر و SHBG في سياقهما", description: "يمكن أن يكون التستوستيرون الكلي وحده مضللاً. يؤثر SHBG على مقدار التستوستيرون المتاح بيولوجيًا فعليًا، ولهذا يُفسَّر التستوستيرون الحر و SHBG معًا بدلاً من التستوستيرون الكلي بمعزل عنهما." },
  { title: "النظر إلى ما هو أبعد من الرقم نفسه", description: "تساعد الهرمونات النخامية (LH/FSH) والبرولاكتين في تحديد الموضع الذي ينشأ منه النمط ضمن المحور الهرموني — لا مجرد ما إذا كان رقم واحد منخفضًا." },
  { title: "السياق الاستقلابي وسياق النوم", description: "يمكن للسمنة ومقاومة الإنسولين وانقطاع النفس النومي غير المعالج أن تخفض التستوستيرون أو تحاكي أعراضه. علاج الرقم دون معالجة هذه العوامل هو علاج للمشكلة الخاطئة." },
  { title: "التحقق من خطط الإنجاب أولاً", description: "يمكن لبعض العلاجات الهرمونية أن تؤثر على الخصوبة. يُسأل عن هذا ويُؤخذ بعين الاعتبار قبل بدء أي علاج — لا يُكتشف لاحقًا." },
  { title: "المتابعة، لا وصفة لمرة واحدة", description: "يُتابع العلاج، عند الحاجة إليه، بمراجعة دورية وفحوصات دم منتظمة — لا يُبدأ ويُترك دون متابعة." },
];

const monitoring = [
  "فحوصات دم دورية للمتابعة أثناء أي علاج",
  "مراجعة الأعراض إلى جانب الكيمياء الحيوية، لا الكيمياء الحيوية وحدها",
  "مراقبة موانع الاستعمال ومؤشرات السلامة ذات الصلة مع مرور الوقت",
  "تعديل العلاج أو إيقافه إذا لم يعد مناسبًا سريريًا للاستمرار",
];

const faqItems = [
  {
    question: "هل تعني أعراضي أنني أعاني من نقص التستوستيرون؟",
    answer: "ليس بالضرورة. يمكن أن ترتبط أعراض مثل التعب وضعف الرغبة الجنسية وتراجع الأداء بنقص التستوستيرون، لكن يمكن أن يكون لها أسباب أخرى عديدة أيضًا. يلزم إجراء تقييم شامل قبل عزو الأعراض إلى التستوستيرون.",
  },
  {
    question: "ماذا يتضمن التقييم؟",
    answer: "مراجعة للأعراض والتاريخ المرضي، إلى جانب فحوصات دم تشمل عادةً التستوستيرون الكلي والحر و SHBG و LH/FSH والبرولاكتين ووظيفة الغدة الدرقية — إضافة إلى النظر في الصحة الاستقلابية والنوم.",
  },
  {
    question: "هل سأُعرض عليّ علاج التستوستيرون تلقائيًا؟",
    answer: "لا. لا يُنظر في علاج التستوستيرون إلا بعد تقييم سريري وكيميائي حيوي مناسب، وفقط عند وجود مؤشر واضح له.",
    readMoreHref: "/insights/trt-who-is-it-for",
    readMoreLabel: "اقرأ المزيد: Testosterone Replacement Therapy, Who Is It For? (مقال بالإنجليزية)",
  },
  {
    question: "هل هذا مماثل لعيادة كمال أجسام أو تحسين أداء؟",
    answer: "لا. هذا تقييم سريري للصحة الهرمونية، وليس خدمة لتحسين الأداء، ولا يُقدَّم العلاج لهذا الغرض.",
  },
  {
    question: "ماذا لو كنت أخطط لتكوين أسرة؟",
    answer: "تُناقش خطط الإنجاب كجزء من التقييم، لأن بعض العلاجات الهرمونية يمكن أن تؤثر على الخصوبة — ويُؤخذ هذا بعين الاعتبار في أي توصية.",
  },
  {
    question: "ما الفرق بين التستوستيرون الحر والكلي؟",
    answer: "يقيس التستوستيرون الكلي كل التستوستيرون في الدم، بما في ذلك الجزء المرتبط بـ SHBG وغير المتاح لاستخدام الجسم. أما التستوستيرون الحر فيقيس فقط الجزء غير المرتبط والنشط بيولوجيًا — ولهذا يُفسَّر الاثنان معًا بدلاً من التستوستيرون الكلي وحده.",
    readMoreHref: "/insights/shbg-and-free-testosterone-explained",
    readMoreLabel: "اقرأ المزيد: SHBG and Free Testosterone Explained (مقال بالإنجليزية)",
  },
  {
    question: "حقن التستوستيرون أم الجل — أيهما يُستخدم؟",
    answer: "كلاهما وسيلتا إعطاء معتمدتان، ويعتمد الاختيار على التفضيل الفردي ونمط الحياة ومدى استجابة مستوياتك — وليس قرارًا موحدًا يناسب الجميع. يختلفان في وتيرة الاستخدام ومدى تذبذب المستويات بين الجرعات، وهو جزء مما يُناقش عند الاختيار بينهما.",
  },
  {
    question: "هل يؤثر العلاج على الهيماتوكريت أو تعداد الدم؟",
    answer: "يمكن أن يرفع علاج التستوستيرون تعداد كريات الدم الحمراء (الهيماتوكريت)، وهو أحد المؤشرات المحددة التي تُفحص بفحوصات الدم الدورية أثناء العلاج — لا شيء يُراجع فقط عند ظهور الأعراض. وإذا ارتفعت المستويات خارج النطاق الآمن، يُعدَّل العلاج أو يُوقف بدلاً من الاستمرار دون تغيير.",
  },
  {
    question: "هل يؤثر علاج التستوستيرون على البروستاتا أو مستضد البروستاتا النوعي (PSA)؟",
    answer: "يُفحص مستضد البروستاتا النوعي (PSA) وصحة البروستاتا قبل بدء العلاج ويُراقبان أثناءه، كممارسة معيارية لأي علاج بالتستوستيرون — وهما من مؤشرات السلامة المشار إليها في المتابعة المستمرة، لا فكرة لاحقة منفصلة.",
  },
  {
    question: "هل يرتبط انخفاض التستوستيرون بضعف الانتصاب؟",
    answer: "من الممكن ذلك، رغم أنه نادرًا ما يكون العامل الوحيد — إذ يعتمد الانتصاب بشكل أساسي على آليات وعائية وعصبية، بينما يسهم التستوستيرون في الرغبة الجنسية ويدعم أجزاء من العملية. ولهذا يُقيَّم الاثنان معًا بدلاً من افتراض أن قراءة منخفضة تفسر الأعراض الجنسية بمفردها.",
    readMoreHref: "/insights/testosterone-and-erectile-dysfunction",
    readMoreLabel: "اقرأ المزيد: Testosterone and Erectile Dysfunction (مقال بالإنجليزية)",
  },
];

export default function TestosteronePageAr() {
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
              name: "التستوستيرون والصحة الهرمونية للرجال",
              description: "تقييم وإدارة التستوستيرون والصحة الهرمونية للرجال — الأعراض والتشخيص والفحص الكيميائي الحيوي، ومتى يكون العلاج مناسبًا.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Testosterone Deficiency",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                صحة الرجل
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                التستوستيرون والصحة الهرمونية للرجال
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                يمكن أن ترتبط قلة الطاقة وضعف الرغبة الجنسية والأعراض
                الجنسية بنقص التستوستيرون — لكن يمكن أن يكون لها أسباب
                أخرى عديدة أيضًا.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="testosterone" size="lg">
                  احجز استشارة
                </BookingCta>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="testosteroneHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Physician authority */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <div className={editorialStyles.authority}>
            <p className="mb-6 text-xs font-medium uppercase">{AR_IDENTITY.doctorTitle}</p>
            <dl className={editorialStyles.metrics}>
              {doctor.yearsOfExperience !== undefined && (
                <AuthorityMetric value={`+${doctor.yearsOfExperience}`} label="سنوات في طب المسالك البولية" />
              )}
              <AuthorityMetric value="FEBU" label="زميل المجلس الأوروبي لطب المسالك البولية" />
              <AuthorityMetric value="استشاري" label="أمراض المسالك البولية والذكورة" />
            </dl>
            <div className={editorialStyles.rail}>
              <p>تقييم هرموني واستقلابي وجنسي — لا عيادة لتحسين الأداء</p>
              {doctor.medicalTrainer && (
                <p>
                  <strong>مدرّب طبي</strong> · {doctor.medicalTrainer.program}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Symptoms are not diagnosis */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-display text-display-md italic leading-snug text-foreground">
              «الأعراض أولاً. الأرقام تحتاج سياقًا.»
            </p>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              لا يحتاج كل رجل يعاني من التعب أو ضعف الرغبة الجنسية أو
              تراجع الأداء الجنسي إلى التستوستيرون. الخطوة الأولى هي فهم
              السبب — فالأعراض وحدها ليست تشخيصًا، وتُقرأ الكيمياء
              الحيوية إلى جانبها، لا بدلاً منها.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Dr. Molina's Approach */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="الفلسفة السريرية"
            heading="نهج د. مولينا في الصحة الهرمونية للرجال"
            description="ليس رقم تستوستيرون يُعالَج بمعزل عن غيره — بل تقييم لمدى تناسق الأعراض والكيمياء الحيوية والصورة الصحية الأوسع فعليًا."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {approachPillars.map((pillar) => (
              <StaggerItem key={pillar.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Diagnostic panel */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="كيف يتم التشخيص"
            heading="صورة هرمونية واستقلابية كاملة"
            description="ينظر التقييم إلى ما هو أبعد من رقم واحد، ويراعي علاقة هذه المؤشرات ببعضها وبأعراضك."
            locale="ar"
          />
          <Reveal delay={0.05}>
            <HormoneBalanceDiagram className="mt-10 h-24 w-24 text-muted-foreground" />
          </Reveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {panel.map((item) => (
              <StaggerItem key={item.label} className="card-hover border-t border-border pt-5">
                <h3 className="font-display text-base text-foreground">{item.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          لا يُنظر في العلاج إلا بعد تقييم سريري وكيميائي حيوي مناسب —
          ولا يُقدَّم كاستجابة افتراضية للأعراض وحدها.
        </PullQuote>
      </Container>

      {/* Contributing factors + when treatment considered */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              عوامل مساهمة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              الوزن والنوم والصحة الاستقلابية
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يمكن للسمنة ومتلازمة الاستقلاب وضعف النوم — بما في ذلك
              انقطاع النفس النومي غير المعالج — أن تخفض جميعها مستويات
              التستوستيرون أو تزيد الأعراض سوءًا. غالبًا ما تكون معالجة
              هذه العوامل جزءًا من الصورة قبل أي علاج هرموني أو إلى
              جانبه.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              متى يُنظر في العلاج
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              العلاج فقط عند وجود مؤشر سريري
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              لا يُنظر في علاج التستوستيرون إلا بعد تقييم سريري وكيميائي
              حيوي مناسب، وفقط عند وجود مؤشر واضح — لا كاستجابة افتراضية
              للأعراض وحدها، ولا لأغراض كمال الأجسام أو تحسين الأداء.
            </p>
          </div>
        </Container>
      </section>

      {/* Monitoring and safety */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="الرعاية المستمرة" heading="المتابعة والسلامة" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {monitoring.map((item, index) => (
              <StaggerItem key={item}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              كما هو الحال مع أي علاج هرموني، يحمل علاج التستوستيرون
              موانع استعمال ومخاطر تُراجع بشكل فردي قبل البدء وتُتابع
              طوال فترة العلاج — فهو غير مناسب لكل رجل، ويُوقف أو يُعدَّل
              إذا لم يعد يلائم ظروفك.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Restrained authorship reference */}
      {publications.length > 0 && (
        <section className="border-t border-border py-14">
          <Container className="flex flex-wrap items-center gap-6">
            <Image src="/brand/authority/mens-health.jpg" alt="Men's Health Spain" width={100} height={44} style={{ height: "1.5rem", width: "auto" }} className="opacity-80" />
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">مساهم وكاتب — مجلة Men&rsquo;s Health إسبانيا.</span>{" "}
              مقالات مختارة (بالإنجليزية):{" "}
              {publications.map((item, index) => (
                <span key={item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
                    {PUBLICATION_LABELS_AR[item.label] ?? item.label}
                  </a>
                  {index < publications.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </Container>
        </section>
      )}

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "خصوبة الرجل", href: "/ar/male-fertility" },
          { label: "دوالي الخصية", href: "/ar/male-fertility/varicocele" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="افهم السبب قبل النظر في العلاج"
        sourcePage={PATH}
        bookingLabel="احجز استشارة"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx"` — must return nothing. Confirm `BookingCta` and `TreatmentCtaSection` both receive explicit Arabic text here even though the English source omits both (relying on the English-only default) — this is the concrete case the global constraint's `BookingCta` rule was written for.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/mens-health/testosterone

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Build `/ar/penile-implant`

Mirrors `src/app/(en)/(marketing)/penile-implant/page.tsx` section-for-section. Uses `CandidateCheck` and `AuthorityMetric` exactly as English does (both confirmed 100% prop-driven, no changes needed).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/penile-implant/page.tsx`

**Link status:** `/penile-surgery` (breadcrumb parent) → stays English (not scheduled in any R9 Phase B batch); label rendered in Arabic (`جراحة القضيب`) with the English href, same pattern as an Insights link but without the `(مقال بالإنجليزية)` suffix since a breadcrumb crumb isn't an article reference — flagged inline as a known gap outside this phase's scope. `/erectile-dysfunction` → `/ar/erectile-dysfunction` (live, this batch — Task 2). `/erectile-dysfunction/shockwave-therapy` → stays English. `/erectile-dysfunction/penile-doppler` → `/ar/erectile-dysfunction/penile-doppler` (live, this batch — Task 3). `/mens-health/testosterone` → `/ar/mens-health/testosterone` (live, this batch — Task 5). `/peyronies-disease` → `/ar/peyronies-disease` (live, this batch — Task 7). Four `/insights/...` FAQ links and one `/erectile-dysfunction` FAQ link → the FAQ's `/erectile-dysfunction` link becomes `/ar/erectile-dysfunction` (self-batch, live); the four Insights links stay English, labels marked `(مقال بالإنجليزية)`.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/penile-implant/page.tsx
import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import { CandidateCheck } from "@/components/editorial/CandidateCheck";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import { ImplantDeviceDiagram } from "@/components/illustrations/ImplantDeviceDiagram";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/penile-implant";

export const metadata: Metadata = buildMetadata({
  title: "جراحة الغرسة القضيبية في أبوظبي",
  description:
    "جراحة الغرسة القضيبية لعلاج ضعف الانتصاب الشديد في أبوظبي — الخيارات القابلة للنفخ والقابلة للثني، الأهلية، المسار الجراحي، التعافي، والتوقعات الواقعية.",
  path: PATH,
});

/** Breadcrumb parent stays the English /penile-surgery route — never built in any R9 Phase B batch, out of this phase's scope entirely (not just "later batch"). Label is still Arabic. */
const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة القضيب", href: "/penile-surgery" },
  { name: "جراحة الغرسة القضيبية", href: PATH },
];

const prosthesisTypes = [
  {
    name: "الغرسة القابلة للنفخ",
    points: [
      "أجهزة من قطعتين أو ثلاث قطع، مصممة لمحاكاة الصلابة والارتخاء الطبيعيين عن قرب",
      "تتضمن آلية مضخة داخلية، تُوضع غالبًا في كيس الصفن",
      "الخيار الأكثر اختيارًا بين المرشحين",
    ],
  },
  {
    name: "الغرسة القابلة للثني",
    points: [
      "تصميم ميكانيكي أبسط، دون مضخة داخلية",
      "قضبان شبه صلبة يمكن وضعها يدويًا",
      "قد يُنظر فيها عند تفضيل نهج جراحي أبسط",
    ],
  },
];

const pathway = [
  { phase: "التقييم", description: "التأكد من أن ضعف الانتصاب شديد أو مقاوم للعلاج، ومراجعة العلاجات السابقة المجربة، وتقييم الصحة العامة والتوقعات قبل النظر في الجراحة." },
  { phase: "الجراحة", description: "تُجرى تحت التخدير المناسب. يُوضع الجهاز المختار — القابل للنفخ أو القابل للثني — داخل الحجرات الكهفية للقضيب." },
  { phase: "التعافي", description: "تلي ذلك فترة تعافٍ منظمة، مع استئناف تدريجي للنشاط وإدخال استخدام الجهاز تحت إشراف طبي، وتُناقش الجداول الزمنية بشكل فردي أثناء الاستشارة." },
];

const risks = [
  "العدوى",
  "التآكل الميكانيكي أو عطل الجهاز مع مرور الوقت، وقد يتطلب ذلك في بعض الحالات جراحة تصحيحية",
  "تغيرات في الإحساس",
  "النزيف أو الكدمات",
  "المخاطر المرتبطة بالتخدير والجراحة بشكل عام",
];

const notAppropriate = [
  "عدوى نشطة وقت التقييم",
  "أسباب قابلة للعكس أو غير مُستكشفة بالكامل لضعف الانتصاب",
  "توقعات لا تتوافق مع ما صُممت الجراحة لتحقيقه",
  "عوامل تشريحية أو طبية معينة تُكتشف أثناء التقييم",
];

const candidateGoodIf = [
  "ضعف الانتصاب شديد أو مقاوم للعلاج",
  "لم تحقق الأدوية الفموية أو الأجهزة الفراغية أو العلاج بالحقن نتائج موثوقة",
  "تم تقييم السبب الكامن بشكل مناسب بالفعل",
];

const pathwayPrinciples = [
  { title: "السبب والشدة", description: "التأكد من أن ضعف الانتصاب شديد أو مقاوم للعلاج فعليًا — لا افتراض ذلك من الأعراض وحدها." },
  { title: "العلاجات السابقة", description: "مراجعة ما جُرِّب بالفعل — الأدوية الفموية، الأجهزة الفراغية، العلاج بالحقن — ولماذا نجح أو لم ينجح." },
  { title: "السياق السريري الأوسع", description: "تُقيَّم العوامل الوعائية والهرمونية والتشريحية التي قد تسهم، ولا تُغفل لصالح حل جراحي سريع." },
  { title: "توقعات واقعية", description: "ما يمكن للغرسة أن تستعيده وما لا يمكنها ذلك — من حيث الصلابة والإحساس والنشوة والطول المتصور — يُناقش قبل أي قرار جراحي، لا بعده." },
  { title: "اختيار الجهاز", description: "قابل للنفخ أو قابل للثني، يُختار وفقًا للتشريح والصحة والتفضيل الشخصي، ولا يُطرح كتوصية افتراضية واحدة." },
];

const faqItems = [
  {
    question: "هل الغرسة القضيبية دائمة؟",
    answer: "الجهاز مصمم للاستخدام طويل الأمد، رغم أن الأجزاء الميكانيكية قد تتآكل مع الوقت وقد يحتاج بعض المرضى في النهاية إلى جراحة تصحيحية. لا تُقدَّم كحل شامل، ولا يُنظر فيها إلا بعد استكشاف علاجات أخرى.",
  },
  {
    question: "ما الفرق بين الغرسات القابلة للنفخ والقابلة للثني؟",
    answer: "تستخدم الأجهزة القابلة للنفخ آلية مضخة لمحاكاة الصلابة والارتخاء الطبيعيين. أما الأجهزة القابلة للثني فهي قضبان شبه صلبة أبسط تُوضع يدويًا. يعتمد اختيار ما يُناقش على تشريحك وصحتك وتفضيلك.",
    readMoreHref: "/insights/inflatable-vs-malleable-penile-implant",
    readMoreLabel: "اقرأ المزيد: Inflatable vs Malleable Penile Implant (مقال بالإنجليزية)",
  },
  {
    question: "هل سيكون الإحساس طبيعيًا بعد الجراحة؟",
    answer: "صُممت الغرسة لدعم الصلابة اللازمة للإيلاج. لا تهدف إلى تغيير الإحساس، الذي تحكمه عمومًا آليات منفصلة — ويُناقش هذا بشكل فردي أثناء التقييم.",
    readMoreHref: "/insights/orgasm-ejaculation-after-penile-implant",
    readMoreLabel: "اقرأ المزيد: Can You Orgasm and Ejaculate With a Penile Implant? (مقال بالإنجليزية)",
  },
  {
    question: "كم تستغرق فترة التعافي؟",
    answer: "يمر التعافي عمومًا بثلاث مراحل: فترة شفاء أولية مع نشاط محدود، وعودة تدريجية إلى النشاط اليومي الطبيعي، وأخيرًا إدخال موجه لاستخدام الجهاز بمجرد كفاية الشفاء. يعتمد الجدول الزمني المحدد ضمن هذا الإطار على شفائك الفردي وخطتك الجراحية، ويُحدَّد أثناء الاستشارة بدلاً من ذكر رقم واحد هنا.",
    readMoreHref: "/insights/penile-implant-recovery-what-to-expect",
    readMoreLabel: "اقرأ المزيد: Penile Implant Recovery, What to Expect (مقال بالإنجليزية)",
  },
  {
    question: "هل أنا مرشح للغرسة القضيبية؟",
    answer: "تعتمد الأهلية على ثلاثة أمور: ما إذا كان ضعف الانتصاب مؤكدًا كشديد أو مقاوم للعلاج، وما إذا جُرِّبت علاجات أخرى دون نتائج موثوقة، وصحتك العامة وتوقعاتك. تُقيَّم هذه الأمور الثلاثة معًا أثناء الاستشارة — انظر فحص الأهلية أعلاه لمعرفة كيفية موازنتها عادة.",
  },
  {
    question: "ما هي بدائل الغرسة القضيبية؟",
    answer: "تقع الغرسة القضيبية في نهاية سلّم علاج ضعف الانتصاب، لا في بدايته. تشمل البدائل المُستكشفة أولاً عادةً إدارة نمط الحياة وعوامل الخطر، ومثبطات PDE5، والعلاج الهرموني عند الحاجة، والأجهزة الفراغية، والعلاج بالموجات الصادمة، والعلاج بالحقن داخل الكهفي — ويُنظر في الغرسة بمجرد أن تتوقف هذه الخيارات عن تحقيق نتائج موثوقة.",
    readMoreHref: "/ar/erectile-dysfunction",
    readMoreLabel: "اطّلع على سلّم علاج ضعف الانتصاب كاملاً",
  },
  {
    question: "كيف يعمل الجهاز فعليًا يوميًا؟",
    answer: "يُشغَّل الجهاز القابل للنفخ بآلية مضخة، تُوضع غالبًا في كيس الصفن، يستخدمها المريض بنفسه لتحقيق الصلابة وإرخائها عند الرغبة. أما الجهاز القابل للثني فلا يحتوي على مضخة — يُوضع ببساطة يدويًا في وضعية صلبة أو أقل صلابة. أي آلية تناسبك أكثر هي أحد العوامل التي تُناقش عند الاختيار بين أنواع الأجهزة.",
  },
  {
    question: "هل سيبدو قضيبي أقصر بعد جراحة الغرسة؟",
    answer: "يلاحظ بعض الرجال بالفعل تراجعًا في الطول مقارنة بالانتصابات التي كانوا يحصلون عليها قبل تطور ضعف الانتصاب. يرتبط هذا عمومًا بتغيرات في الأنسجة ناتجة عن الحالة الكامنة نفسها — خاصة إذا كان ضعف الانتصاب طويل الأمد — لا شيئًا تزيله جراحة الغرسة. وهو جزء من نقاش التوقعات الواقعية أثناء التقييم، وليس مفاجأة تُترك لما بعد الجراحة.",
  },
  {
    question: "هل يمكنني إجراء غرسة قضيبية بعد جراحة البروستاتا؟",
    answer: "نعم — يُعد ضعف الانتصاب الناتج عن استئصال البروستاتا سببًا معترفًا به وراسخًا يدفع المرضى للنظر في الغرسة القضيبية، خاصة بمجرد أن لا تحقق العلاجات الأخرى نتائج موثوقة. تنطبق مبادئ التقييم نفسها: التأكد من الشدة، ومراجعة ما جُرِّب بالفعل، ومناقشة التوقعات الواقعية قبل المضي قدمًا.",
  },
];

export default function PenileImplantPageAr() {
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
              name: "جراحة الغرسة القضيبية",
              description: "جراحة الغرسة القضيبية لعلاج ضعف الانتصاب الشديد أو المقاوم للعلاج — الخيارات القابلة للنفخ والقابلة للثني، الأهلية، المسار الجراحي، التعافي والتوقعات الواقعية.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Implant Surgery",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                جراحة القضيب
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                جراحة الغرسة القضيبية
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                حل جراحي لضعف الانتصاب الشديد عندما لا تعود العلاجات
                الأخرى تحقق نتائج موثوقة.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_implant" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
                <a
                  href="#candidacy"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  من قد يكون مرشحًا
                </a>
              </div>
            </Reveal>
          </div>

          <MaskedReveal className="w-full self-start">
            <PhotoFrame slot="implantPhysician" priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Physician authority */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <div className={editorialStyles.authority}>
            <p className="mb-6 text-xs font-medium uppercase">{AR_IDENTITY.doctorTitle}</p>
            <dl className={editorialStyles.metrics}>
              {doctor.yearsOfExperience !== undefined && (
                <AuthorityMetric value={`+${doctor.yearsOfExperience}`} label="سنوات في طب المسالك البولية" />
              )}
              <AuthorityMetric value="FEBU" label="زميل المجلس الأوروبي لطب المسالك البولية" />
              <AuthorityMetric value="استشاري" label="أمراض المسالك البولية والذكورة" />
            </dl>
            <div className={editorialStyles.rail}>
              <p>جراحة متقدمة بالمنظار · خبرة في المستشفيات الثالثية</p>
              {doctor.medicalTrainer && (
                <p>
                  <strong>مدرّب طبي</strong> · {doctor.medicalTrainer.program}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Our approach */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="نهجنا"
            heading="جراحة الغرسة القضيبية نهاية مسار تقييم — لا بدايته"
            description="قرار الغرسة القضيبية قرار جراحي، والقرارات الجراحية تستحق أكثر من محادثة واحدة عن جهاز. قبل مناقشتها كخيار واقعي، يشمل التقييم:"
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pathwayPrinciples.map((item) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              هذا ما يميز مسار ضعف انتصاب متخصصًا عن مزود غرسات عام —
              فالجهاز هو الخطوة الأخيرة من التقييم، لا المحادثة الأولى.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What is it / candidacy */}
      <section id="candidacy" className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="ما هي الغرسة القضيبية؟"
            heading="جهاز يُوضع داخل القضيب لاستعادة الصلابة"
            size="md"
            description="الغرسة القضيبية جهاز يُزرع جراحيًا، يُوضع داخل الحجرات الكهفية للقضيب، ومصمم للسماح للرجل بتحقيق انتصاب صلب عند الرغبة."
            locale="ar"
          />
          <div className="mt-4">
            <p className="text-sm font-medium uppercase text-muted-foreground">
              الأهلية — تُراجَع بشكل فردي، ولا تُفترض أبدًا
            </p>
            <CandidateCheck
              goodHeading="غالبًا ما يُنظر فيها بمجرد"
              goodIf={candidateGoodIf}
              notHeading="تُعالَج أو يُعاد تقييمها أولاً"
              notIf={notAppropriate}
            />
          </div>
        </Container>
      </section>

      {/* Inflatable vs malleable comparison */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="خيارات الجهاز" heading="القابل للنفخ مقابل القابل للثني" locale="ar" />
          <Reveal delay={0.05}>
            <ImplantDeviceDiagram
              className="mt-10 h-24 w-full max-w-xl text-muted-foreground"
              title="مخطط تخطيطي لغرسة قابلة للنفخ من ثلاث قطع: أسطوانة ومضخة وخزان"
            />
          </Reveal>
          <MaskedReveal className="mt-10 max-w-xl">
            <PhotoFrame slot="implantDevice" landscape />
          </MaskedReveal>
          <div className="mt-14 grid gap-x-16 gap-y-14 border-t border-border pt-14 md:grid-cols-2">
            {prosthesisTypes.map((type) => (
              <Reveal key={type.name} className="card-hover border border-border p-6">
                <h3 className="font-display text-2xl text-foreground">{type.name}</h3>
                <ul className="mt-6 space-y-4">
                  {type.points.map((point) => (
                    <li key={point} className="flex gap-4 text-sm text-muted-foreground">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pathway — dark section */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="المسار الجراحي" heading="التقييم، الجراحة، التعافي" locale="ar" />
          <MaskedReveal className="mt-10 max-w-2xl">
            <PhotoFrame slot="implantSurgical" landscape tone="dark" />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathway.map((step, index) => (
              <StaggerItem key={step.phase} className="card-hover border-t border-border pt-6 md:border-t-0 md:pt-0 md:[&:not(:first-child)]:border-r md:[&:not(:first-child)]:border-border md:[&:not(:first-child)]:pr-8">
                <span className="font-display text-sm text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{step.phase}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Sexual function after implantation */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="بعد الزراعة" heading="الوظيفة الجنسية بعد الجراحة" size="md" locale="ar" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              صُممت الغرسة القضيبية للسماح للرجل بتحقيق انتصاب صلب عند
              الرغبة. لا تغيّر الإحساس أو النشوة أو القذف، التي تحكمها
              آليات منفصلة. وكما هو الحال مع أي جراحة، تختلف النتائج
              الفردية، وتُناقش التوقعات بالتفصيل أثناء التقييم — والهدف
              هو فهم واقعي لما يمكن للجهاز فعله وما لا يمكنه قبل المضي
              قدمًا.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يوميًا، يُفعَّل الجهاز القابل للنفخ بآلية مضخة، تُوضع غالبًا
              في كيس الصفن، يُشغّلها الرجل بنفسه عندما يريد الصلابة؛ أما
              الجهاز القابل للثني فيُوضع ببساطة يدويًا. يلاحظ بعض الرجال
              أيضًا تراجعًا في الطول مقارنة بانتصاباتهم قبل تطور ضعف
              الانتصاب — ويرتبط هذا عمومًا بالحالة الكامنة نفسها، بما في
              ذلك تغيرات الأنسجة التي تحدث مع ضعف الانتصاب طويل الأمد
              غير المعالج، لا شيئًا تزيله جراحة الغرسة. هذا جزء من نقاش
              التوقعات الواقعية أثناء التقييم، لا مفاجأة تُترك لما بعد
              الجراحة.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          الهدف فهم واقعي لما يمكن للجهاز فعله وما لا يمكنه — قبل المضي
          قدمًا، لا بعده.
        </PullQuote>
      </Container>

      {/* Risks */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            توقعات واقعية
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            المخاطر والمضاعفات
          </h2>
          <ul className="mt-8 space-y-3">
            {risks.map((risk) => (
              <li key={risk} className="flex gap-4 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {risk}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "العلاج بالموجات الصادمة", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "دوبلر القضيب", href: "/ar/erectile-dysfunction/penile-doppler" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش الأهلية والخطوات التالية"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/penile-implant/page.tsx"` — must return nothing. Confirm the pathway section's `md:border-l`/`md:pl-8` were correctly mirrored to `md:border-r`/`md:pr-8` (a genuinely RTL-relevant physical-property flip — under RTL, "not first child" cards should get a right border/padding, not left, to read correctly in the reversed grid flow).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/penile-implant/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/penile-implant

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Build `/ar/peyronies-disease`

Mirrors `src/app/(en)/(marketing)/peyronies-disease/page.tsx` section-for-section. Same RTL divider-flip treatment as Task 6's pathway grid applies to this page's two-column phase grid (`md:border-l` → `md:border-r`, `md:pl-16` → `md:pr-16`).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/peyronies-disease/page.tsx`

**Link status:** `/penile-surgery` (breadcrumb parent) → stays English, same documented gap as Task 6. `/erectile-dysfunction` → `/ar/erectile-dysfunction` (live, this batch). `/penile-implant` → `/ar/penile-implant` (live, this batch). `/mens-health/testosterone` → `/ar/mens-health/testosterone` (live, this batch).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/peyronies-disease/page.tsx
import type { Metadata } from "next";
import { CurvatureAssessmentDiagram } from "@/components/illustrations/CurvatureAssessmentDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/peyronies-disease";

export const metadata: Metadata = buildMetadata({
  title: "مرض بيروني",
  description:
    "تقييم متخصص لمرض بيروني في أبوظبي — انحناء القضيب وأثره على وظيفة الانتصاب، مع مسارات علاج تحفظية وإجرائية وجراحية تُلائم المرحلة والشدة.",
  path: PATH,
});

/** Breadcrumb parent stays the English /penile-surgery route — same documented gap as /ar/penile-implant (Task 6). */
const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة القضيب", href: "/penile-surgery" },
  { name: "مرض بيروني", href: PATH },
];

const phases = [
  {
    label: "المرحلة النشطة",
    description: "قد يستمر الانحناء أو اللويحة أو الألم في التغير. يكون العلاج خلال هذه المرحلة تحفظيًا عمومًا، لأن الحالة لم تستقر بعد.",
  },
  {
    label: "المرحلة المستقرة",
    description: "بمجرد استقرار الحالة وتوقف الانحناء عن التغير، يمكن النظر في نطاق أوسع من الخيارات — بما في ذلك التصحيح الإجرائي أو الجراحي — عند الاقتضاء.",
  },
];

const pathways = [
  { tier: "تحفظي", description: "المراقبة وإدارة الأعراض المصاحبة، وهو مناسب بشكل خاص خلال المرحلة النشطة أو مع انحناء خفيف لا يؤثر على الوظيفة." },
  { tier: "إجرائي", description: "يمكن النظر في خيارات مختارة غير جراحية أو طفيفة التوغل بمجرد استقرار الحالة، حسب الشدة والأثر." },
  { tier: "جراحي", description: "يُنظر في التصحيح الجراحي للانحناء الأكثر أهمية والمؤثر على الوظيفة، بمجرد استقرار الحالة ومراجعة الخيارات غير الجراحية." },
];

const faqItems = [
  {
    question: "ما هو مرض بيروني؟",
    answer: "حالة تتضمن تكوّن لويحة ليفية داخل القضيب، يمكن أن تسبب انحناءً، وفي بعض الحالات ألمًا أو تأثيرًا على وظيفة الانتصاب.",
  },
  {
    question: "هل سيزداد انحنائي سوءًا؟",
    answer: "يختلف هذا من حالة لأخرى. غالبًا ما يمر مرض بيروني بمرحلة نشطة يمكن أن تحدث خلالها تغيرات، تليها مرحلة مستقرة — يساعد التقييم في تحديد المرحلة التي تمر بها.",
  },
  {
    question: "هل أحتاج إلى جراحة؟",
    answer: "ليس بالضرورة. تُدار حالات كثيرة تحفظيًا، خاصة خلال المرحلة النشطة أو مع انحناء خفيف. يُنظر في الجراحة للانحناء المستقر الأكثر أهمية والمؤثر على الوظيفة.",
  },
  {
    question: "هل الموجات فوق الصوتية ضرورية دائمًا؟",
    answer: "ليس دائمًا. قد تُستخدم عند الاقتضاء، خاصة لتقييم اللويحة أو تدفق الدم عندما تتأثر وظيفة الانتصاب أيضًا.",
  },
  {
    question: "هل يمكن أن يؤثر مرض بيروني على الانتصاب؟",
    answer: "نعم، لدى بعض الرجال. يُقيَّم الانحناء ووظيفة الانتصاب معًا، لأن كلًا منهما يمكن أن يؤثر على الآخر.",
  },
];

export default function PeyroniesDiseasePageAr() {
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
              name: "مرض بيروني",
              description: "تقييم متخصص لانحناء القضيب ومرض بيروني، مع علاج يُلائم المرحلة والشدة.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Peyronie's Disease",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                جراحة القضيب
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                مرض بيروني
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                تقييم متخصص لانحناء القضيب واللويحة وأثرها على وظيفة
                الانتصاب — مع علاج يُلائم المرحلة والشدة.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="peyronies" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="peyroniesHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Active vs stable phase */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="فهم المرحلة" heading="المرحلة النشطة والمستقرة" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {phases.map((phase, index) => (
              <Reveal key={phase.label} delay={index * 0.08}>
                <div className={`card-hover border-t border-border pt-6 md:border-t-0 md:pt-0 ${index === 1 ? "md:border-r md:border-border md:pr-16" : ""}`}>
                  <h3 className="font-display text-2xl text-foreground">{phase.label}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Curvature and erectile function + assessment */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الانحناء والوظيفة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              يُقيَّمان معًا، لا بمعزل عن بعضهما
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يمكن أن يؤثر مرض بيروني على شكل القضيب أثناء الانتصاب، وفي
              بعض الرجال، على وظيفة الانتصاب نفسها. يُقيَّم كلاهما معًا،
              لأنهما يمكن أن يؤثرا على تخطيط العلاج.
            </p>
            <CurvatureAssessmentDiagram className="mt-8 h-32 w-40 text-muted-foreground" />
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              كيف يجري التقييم
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              التاريخ المرضي، الفحص، والموجات فوق الصوتية عند الاقتضاء
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يشمل التقييم التاريخ المرضي والفحص المناسب. قد تُستخدم
              الموجات فوق الصوتية عند الاقتضاء لتقييم اللويحة وتدفق
              الدم، خاصة عندما تتأثر وظيفة الانتصاب أيضًا.
            </p>
          </div>
        </Container>
      </section>

      {/* Pathways — olive */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="الإدارة" heading="مسارات تحفظية وإجرائية وجراحية" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathways.map((pathway, index) => (
              <Reveal key={pathway.tier} delay={index * 0.06} className="card-hover">
                <span className="font-display text-sm text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{pathway.tier}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{pathway.description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              لا تتطلب كل حالة من مرض بيروني علاجًا فعالاً. يمكن ببساطة
              مراقبة الانحناء الخفيف الذي لا يؤثر على الوظيفة. وكما هو
              الحال مع أي علاج لمرض بيروني، تختلف الاستجابة من شخص لآخر،
              ولا يمكن ضمان نتيجة محددة — بما في ذلك التقويم الكامل.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "جراحة الغرسة القضيبية", href: "/ar/penile-implant" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش مرحلتك وشدة حالتك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/peyronies-disease/page.tsx"` — must return nothing.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/peyronies-disease/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/peyronies-disease

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Build `/ar/male-fertility/varicocele`

Mirrors `src/app/(en)/(marketing)/male-fertility/varicocele/page.tsx` section-for-section. English source omits `TreatmentCtaSection`'s `bookingLabel` (relies on the English default) — per the global constraint, this Arabic page passes it explicitly.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/male-fertility/varicocele/page.tsx`

**Link status:** `/male-fertility` (breadcrumb parent + related + secondary CTA) → `/ar/male-fertility` (live, Batch 1). `/mens-health/testosterone` → `/ar/mens-health/testosterone` (live, this batch — Task 5).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/male-fertility/varicocele/page.tsx
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-fertility/varicocele";

export const metadata: Metadata = buildMetadata({
  title: "دوالي الخصية",
  description:
    "تقييم دوالي الخصية في أبوظبي — الفرق بين الدوالي السريرية ودون السريرية المكتشفة بالموجات فوق الصوتية، صلتها بالخصوبة، والمراقبة مقابل التدخل عند الاقتضاء.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "خصوبة الرجل", href: "/ar/male-fertility" },
  { name: "دوالي الخصية", href: PATH },
];

const faqItems = [
  {
    question: "هل تحتاج كل دوالي خصية إلى علاج؟",
    answer: "لا. يُكتفى بمراقبة كثير من حالات دوالي الخصية، خاصة عند غياب الأعراض وعدم وجود قلق حالي بشأن الخصوبة. لا يُعالَج اكتشاف بالموجات فوق الصوتية وحده بمعزل عن السياق.",
  },
  {
    question: "هل يضمن علاج دوالي الخصية تحسّن الخصوبة؟",
    answer: "لا يمكن ضمان نتيجة محددة. يتمتع كثير من الرجال المصابين بدوالي الخصية بخصوبة طبيعية، وتختلف الاستجابة لأي تدخل من شخص لآخر.",
  },
  {
    question: "ما الفرق بين دوالي الخصية السريرية ودون السريرية؟",
    answer: "يمكن الشعور بدوالي الخصية السريرية عند الفحص السريري. أما دوالي الخصية دون السريرية (تحت الإكلينيكية) فلا تظهر إلا بالموجات فوق الصوتية. هذا التمييز يؤثر على مدى أهمية النتيجة.",
  },
  {
    question: "هل دوالي الخصية مؤلمة دائمًا؟",
    answer: "لا. يعاني بعض الرجال من انزعاج، خاصة بعد الوقوف لفترات طويلة؛ ولا يعاني كثيرون من أي أعراض على الإطلاق، وتُكتشف دوالي الخصية بشكل عرضي.",
  },
];

export default function VaricocelePageAr() {
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
              name: "دوالي الخصية",
              description: "تقييم دوالي الخصية — سريرية مقابل مكتشفة بالموجات فوق الصوتية، صلتها بالخصوبة، والمراقبة مقابل التدخل عند الاقتضاء.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Varicocele",
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
              خصوبة الرجل
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              دوالي الخصية
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تضخم في أوردة كيس الصفن، يشبه الدوالي في أجزاء أخرى من
              الجسم. وهو اكتشاف شائع، ولا تتطلب كل دوالي خصية علاجًا.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="varicocele" size="lg">
                احجز تقييمًا متخصصًا
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Clinical vs ultrasound + fertility relevance */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              كيف تُكتشف
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              سريرية مقابل مكتشفة بالموجات فوق الصوتية
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              قد تُكتشف دوالي الخصية بالفحص السريري — وتُعرف حينها
              بالسريرية — أو لا تظهر إلا بالموجات فوق الصوتية، وتُعرف
              بدون السريرية (تحت الإكلينيكية). هذا التمييز مهم، إذ لا
              يحمل كل اكتشاف بالموجات فوق الصوتية الأهمية نفسها.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الخصوبة والوظيفة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              صلتها بالخصوبة ووظيفة الخصية
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يمكن لدوالي الخصية، لدى بعض الرجال، أن تؤثر على معايير
              السائل المنوي ووظيفة الخصية مع مرور الوقت. يتمتع كثير من
              الرجال المصابين بدوالي الخصية بخصوبة طبيعية، ولا يتنبأ
              وجودها وحده بالعقم.
            </p>
          </div>
        </Container>
      </section>

      {/* Symptoms + observation vs intervention */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الأعراض
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              الألم ليس أمرًا شاملاً
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يعاني بعض الرجال من انزعاج أو إحساس بالثقل، خاصة بعد
              الوقوف لفترات طويلة. ولا يعاني كثيرون آخرون من أي أعراض
              على الإطلاق، وتُكتشف دوالي الخصية بشكل عرضي.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الإدارة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              المراقبة مقابل التدخل
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يُكتفى بمراقبة كثير من حالات دوالي الخصية، خاصة عند غياب
              الأعراض وعدم وجود قلق حالي بشأن الخصوبة. قد يُنظر في
              التدخل عند وجود ألم، أو تأثير واضح على معايير السائل
              المنوي، أو مخاوف بشأن حجم الخصية.
            </p>
          </div>
        </Container>
      </section>

      {/* Restraint — dark */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              اكتشاف تصويري، لا حكم نهائي
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              نتائج، لا قرارات بمعزل عن غيرها.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              لا يُعالَج اكتشاف بالموجات فوق الصوتية وحده بمعزل عن
              السياق. يعتمد ملاءمة التدخل على الأعراض وأهداف الخصوبة
              وتحليل السائل المنوي والفحص السريري مجتمعة — تُقيَّم ككل،
              لا من التصوير وحده.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "خصوبة الرجل", href: "/ar/male-fertility" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش ما إذا كان التدخل مناسبًا لك"
        sourcePage={PATH}
        bookingLabel="احجز استشارة"
        secondary={{ label: "العودة إلى خصوبة الرجل", href: "/ar/male-fertility" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -n "tracking-widest\|tracking-\[0.2em\]" "src/app/(ar)/ar/(marketing)/male-fertility/varicocele/page.tsx"` — must return nothing. Confirm `TreatmentCtaSection` receives an explicit `bookingLabel` here even though the English source omits it.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/male-fertility/varicocele/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/male-fertility/varicocele

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Register `arPath` for all seven routes; flip every now-resolvable temporary-English link

Confirmed by reading `src/lib/seo/routes.ts`, `getLocalizedPathPair`, `buildMetadata`, and `src/app/sitemap.ts` directly (same as Batch 1): setting `arPath` is the single change that wires the language switcher, reciprocal hreflang, and the sitemap entry — no other code needed. This task also flips the specific temporary-English hrefs identified during this batch's own audit of the three already-live Batch 1 hub pages and the two homepage section components (found by grepping for each of this batch's seven English paths across `src/app/(ar)/` and `src/components/sections/ar/` before writing this plan — see the Global Constraints' link-status table for the full picture).

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/app/(ar)/ar/(marketing)/mens-health/page.tsx`
- Modify: `src/components/sections/ar/AdvancedPenileSurgerySectionAr.tsx`
- Modify: `src/components/sections/ar/SexualHormonalHealthSectionAr.tsx`

- [ ] **Step 1: Register `arPath` in `routes.ts`**

Find each of these seven lines and add `arPath`:

```ts
  { path: "/mens-health/testosterone", status: "live", priority: 0.9 },
```
→
```ts
  { path: "/mens-health/testosterone", status: "live", priority: 0.9, arPath: "/ar/mens-health/testosterone" },
```

```ts
  { path: "/sexual-medicine/premature-ejaculation", status: "live", priority: 0.8 },
```
→
```ts
  { path: "/sexual-medicine/premature-ejaculation", status: "live", priority: 0.8, arPath: "/ar/sexual-medicine/premature-ejaculation" },
```

```ts
  { path: "/erectile-dysfunction", status: "live", priority: 0.9 },
```
→
```ts
  { path: "/erectile-dysfunction", status: "live", priority: 0.9, arPath: "/ar/erectile-dysfunction" },
```

```ts
  { path: "/erectile-dysfunction/penile-doppler", status: "live", priority: 0.7 },
```
→
```ts
  { path: "/erectile-dysfunction/penile-doppler", status: "live", priority: 0.7, arPath: "/ar/erectile-dysfunction/penile-doppler" },
```

```ts
  { path: "/penile-implant", status: "live", priority: 0.9 },
```
→
```ts
  { path: "/penile-implant", status: "live", priority: 0.9, arPath: "/ar/penile-implant" },
```

```ts
  { path: "/peyronies-disease", status: "live", priority: 0.7 },
```
→
```ts
  { path: "/peyronies-disease", status: "live", priority: 0.7, arPath: "/ar/peyronies-disease" },
```

```ts
  { path: "/male-fertility/varicocele", status: "live", priority: 0.6 },
```
→
```ts
  { path: "/male-fertility/varicocele", status: "live", priority: 0.6, arPath: "/ar/male-fertility/varicocele" },
```

`/erectile-dysfunction/shockwave-therapy` and `/penile-surgery` are deliberately **not** touched — neither ships in any R9 Phase B batch, so neither gets an `arPath` (matches the registry's own "never set `arPath` ahead of the page actually existing" convention).

- [ ] **Step 2: Flip the `/ar/mens-health` hub's testosterone link**

In `src/app/(ar)/ar/(marketing)/mens-health/page.tsx`, find:
```tsx
                <Link href="/mens-health/testosterone"><span>02</span>الصحة الهرمونية</Link>
```
Replace with:
```tsx
                <Link href="/ar/mens-health/testosterone"><span>02</span>الصحة الهرمونية</Link>
```

- [ ] **Step 3: Flip the homepage's `AdvancedPenileSurgerySectionAr` links**

In `src/components/sections/ar/AdvancedPenileSurgerySectionAr.tsx`, find:
```tsx
            <Link href="/penile-implant" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
```
Replace with:
```tsx
            <Link href="/ar/penile-implant" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
```

Find:
```tsx
              href="/erectile-dysfunction/penile-doppler"
```
Replace with:
```tsx
              href="/ar/erectile-dysfunction/penile-doppler"
```

- [ ] **Step 4: Flip the homepage's `SexualHormonalHealthSectionAr` links**

In `src/components/sections/ar/SexualHormonalHealthSectionAr.tsx`, find:
```tsx
                href="/erectile-dysfunction"
```
Replace with:
```tsx
                href="/ar/erectile-dysfunction"
```

Find:
```tsx
              href="/mens-health/testosterone"
```
Replace with:
```tsx
              href="/ar/mens-health/testosterone"
```

- [ ] **Step 5: Verify**

Run: `npm run typecheck` — must pass. Run:
```bash
grep -rn 'href="/mens-health/testosterone"\|href="/erectile-dysfunction"\|href="/erectile-dysfunction/penile-doppler"\|href="/penile-implant"\|href="/peyronies-disease"\|href="/male-fertility/varicocele"\|href="/sexual-medicine/premature-ejaculation"' src/app/\(ar\)/ src/components/sections/ar/
```
Must return **zero matches** — every remaining reference to these seven English paths from Arabic-side code has been flipped (the only legitimate remaining English hrefs to any of these seven from Arabic pages are the batch's own pages' self-referencing patterns already written with `/ar/...` in Tasks 2–8). Then run:
```bash
grep -rn '"/erectile-dysfunction/shockwave-therapy"\|"/penile-surgery"' src/app/\(ar\)/
```
— these should still show matches (Tasks 2, 3, 6, 7's intentionally-English hrefs) confirming those two were correctly left alone. Finally, run `npm run build` locally is deferred to Task 12's final pass, but spot-check by reading `src/app/sitemap.ts`'s output logic against the new `arPath` values — no `sitemap.ts` code change is needed (confirmed by reading it: it derives from `routes.ts` generically).

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo/routes.ts "src/app/(ar)/ar/(marketing)/mens-health/page.tsx" src/components/sections/ar/AdvancedPenileSurgerySectionAr.tsx src/components/sections/ar/SexualHormonalHealthSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): register arPath for Batch 2 routes; flip resolvable links

Wires the language switcher, reciprocal hreflang, and sitemap entries
for all seven Batch 2 pages (routes.ts is the single source of truth
for all three, confirmed by reading getLocalizedPathPair/buildMetadata/
sitemap.ts directly). Also flips the /ar/mens-health hub's and two
homepage sections' temporary-English links to these seven destinations,
now that real Arabic pages exist for them.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Update the Arabic medical glossary

**Files:**
- Modify: `docs/arabic-medical-glossary.md`

- [ ] **Step 1: Append Batch 2's new terms**

Add these rows to the existing table (after the last Batch 1 row, `Frequently Asked Questions`):

```markdown
| Arterial inflow | التدفق الشرياني الداخل | /erectile-dysfunction (Batch 2) | |
| Veno-occlusion / veno-occlusive dysfunction | الانسداد الوريدي / الخلل الوظيفي الانسدادي الوريدي | /erectile-dysfunction (Batch 2) | |
| Venous leak | التسرب الوريدي | /erectile-dysfunction/penile-doppler (Batch 2) | |
| Peak systolic velocity (PSV) | ذروة السرعة الانقباضية (PSV) | /erectile-dysfunction/penile-doppler (Batch 2) | Keep "PSV" abbreviation in Latin script alongside the Arabic term |
| End-diastolic velocity (EDV) | السرعة الانبساطية النهائية (EDV) | /erectile-dysfunction/penile-doppler (Batch 2) | Keep "EDV" abbreviation in Latin script alongside the Arabic term |
| PDE5 inhibitors | مثبطات PDE5 | /erectile-dysfunction (Batch 2) | Keep "PDE5" in Latin script — standard in Arabic medical literature |
| Intracavernosal therapy | العلاج داخل الكهفي | /erectile-dysfunction (Batch 2) | |
| Penile implant | الغرسة القضيبية | /penile-implant (Batch 2) | |
| Inflatable / malleable prosthesis | الغرسة القابلة للنفخ / القابلة للثني | /penile-implant (Batch 2) | |
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/arabic-medical-glossary.md
git commit -m "$(cat <<'EOF'
docs(r9-b): extend Arabic medical glossary with Batch 2 terms

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Responsive/structural QA for Batch 2

Same method as B0's Task 18 and Batch 1's Task 20, applied here — if the Playwright MCP browser is available and unlocked, use it for a real visual pass at 390/768/1024/1440px on all seven new pages plus the three modified files (hub link, two homepage sections). If it's locked by another session (the failure mode both prior QA passes hit), fall back to the same structural/source-based substitute, explicitly disclosed as such: full section-by-section diffing of each new `page.tsx` against its English source (confirming no section, image slot, FAQ item, or CTA was dropped), HTTP HEAD checks on every `EditorialFrame`/`PhotoFrame` image slot referenced, and direct source confirmation that `locale="ar"` is passed everywhere required (`SectionHeading`, `Faq`, `RelatedTreatments`, `DopplerWaveformPanel`) and that no `tracking-widest`/`tracking-[0.2em]` leaked onto Arabic text.

**Files:**
- Create: `qa/r9-phase-b-batch2/README.md`

- [ ] **Step 1: Attempt the Playwright MCP browser**

Try navigating to each of the seven new routes on the local dev server (`npm run dev`) at all four breakpoints. If the browser tool errors as locked/unavailable, proceed to Step 2 and note the failure explicitly in the QA doc — do not silently skip to the fallback without recording why.

- [ ] **Step 2: Structural fallback (if Step 1 is unavailable)**

For each of the seven pages, run and record:
```bash
diff <(grep -c "^      <section" "src/app/(en)/(marketing)/<english-path>/page.tsx") <(grep -c "^      <section" "src/app/(ar)/ar/(marketing)/<arabic-path>/page.tsx")
```
adjusted per file for the actual section-tag indentation used, to confirm section counts match (a mismatch means a section was dropped or added unintentionally — investigate before proceeding, don't just note the number).

For every `EditorialFrame`/`PhotoFrame`/`Image` slot referenced in each new page, confirm the same slot name is used as the English source (these components resolve images by slot name from a shared config, so an Arabic page referencing a different or misspelled slot would silently show the wrong image or none — confirmed by reading `EditorialFrame`'s/`PhotoFrame`'s slot-resolution logic, not assumed).

Run:
```bash
grep -Ln 'locale="ar"' $(git diff --name-only HEAD~9 -- 'src/app/(ar)/ar/(marketing)/erectile-dysfunction*/page.tsx' 'src/app/(ar)/ar/(marketing)/sexual-medicine/premature-ejaculation/page.tsx' 'src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx' 'src/app/(ar)/ar/(marketing)/penile-implant/page.tsx' 'src/app/(ar)/ar/(marketing)/peyronies-disease/page.tsx' 'src/app/(ar)/ar/(marketing)/male-fertility/varicocele/page.tsx')
```
— any file listed uses zero `locale="ar"` anywhere, which would be wrong for every one of these seven pages (each uses it on `SectionHeading`, `Faq`, or `RelatedTreatments` at minimum) — investigate any hit.

- [ ] **Step 3: Write the QA doc**

Document, per page: which method was used (Playwright or structural fallback), what was checked, and any issues found and fixed before this task's commit. If Playwright was unavailable, state that plainly — same disclosure standard as B0 Task 18 and Batch 1 Task 20 — and note that a real visual pass at all four breakpoints is still owed before the consolidated pre-Production Preview after Batch 4.

- [ ] **Step 4: Commit**

```bash
git add qa/r9-phase-b-batch2/README.md
git commit -m "$(cat <<'EOF'
docs(r9-b): responsive QA for Batch 2 (priority clinical pages)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full typecheck, lint, test, build**

Run in order, fixing anything that fails before proceeding to the next:
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

- [ ] **Step 2: Confirm sitemap output**

After `npm run build` succeeds, confirm (by reading the built sitemap route or re-reading `src/app/sitemap.ts`'s logic against the updated `routes.ts`) that all seven new Arabic URLs appear in `sitemap.xml` with reciprocal `alternates.languages` entries, and that `/erectile-dysfunction/shockwave-therapy` and `/penile-surgery` still emit only their English URL (no Arabic alternate) since neither has an `arPath`.

- [ ] **Step 3: Confirm git state is clean**

Run: `git status --short` — should show no uncommitted changes (every task above ends with its own commit). Run: `git log --oneline -20` to confirm the batch's full commit sequence is present and in order.

No commit for this task — it only verifies work already committed in Tasks 1–11.

---

## Batch 2 completion criteria

- All seven pages listed in the owner's Batch 2 brief exist at their `/ar/...` routes with full content parity (no shortened summaries), matching the Full Parity Rule (substantive sections, images, authority elements, FAQs, CTAs, internal navigation).
- Each page has self-canonical + reciprocal `en-AE`/`ar-AE`/`x-default` hreflang, localized title/description/OG, localized breadcrumbs, localized FAQ schema with `inLanguage: "ar"`, and appears in `sitemap.xml` — all automatic from `arPath` registration, confirmed in Task 12.
- Every internal link between this batch's own pages, and from the three already-live Batch 1 hub pages and two homepage sections that pointed at these seven destinations, now points to the real Arabic route.
- No invented `/ar/*` URLs: `/erectile-dysfunction/shockwave-therapy` and `/penile-surgery` (this batch's two genuinely out-of-scope destinations, neither scheduled in any R9 Phase B batch) remain English, clearly documented as such, not silently left as an oversight.
- No Arabic Insights routes invented; every Insights reference stays visibly English per the owner's brief.
- Per the owner's instruction: no merge to `main`, no Production or Preview deploy after this batch — proceed directly to Batch 3 after Task 12 passes.
