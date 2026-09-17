# R9 Phase B — Batch 1 (Core Brand / Hubs) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship genuine Arabic versions of `/about`, `/mens-health`, `/sexual-medicine`, `/male-aesthetics`, `/male-fertility` at `/ar/about`, `/ar/mens-health`, `/ar/sexual-medicine`, `/ar/male-aesthetics`, `/ar/male-fertility` — full content depth, no shortened summaries — plus the shared-component locale support these five pages require.

**Architecture:** Unlike the homepage, every English page in this batch is a single monolithic `page.tsx` (no bespoke section components) composing shared UI/section components. Arabic mirrors follow the same shape: one `page.tsx` per route under `src/app/(ar)/ar/(marketing)/<path>/page.tsx`, Arabic content inlined directly. Eight shared components need a `locale?: "ar"` prop added first (Tasks 1–11); two JSON-LD schema functions need an `inLanguage` option added; one RTL bug (`Breadcrumb`'s chevron) and one logical-property bug (`AuthorityBlock`'s `text-left`) get fixed; recurring Arabic reputation strings get centralized in one new shared module. Once infra is done, the five pages compose it (Tasks 12–16). Then `arPath` gets registered for all five in `routes.ts` (which automatically wires the language switcher, reciprocal hreflang, and sitemap entries — confirmed by reading `getLocalizedPathPair`/`buildMetadata`/`sitemap.ts` directly, no other code needed) and the `/ar` homepage's temporary English links to these five destinations get flipped to their new Arabic routes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md` (shared across all 4 batches) — read it first.

## Global Constraints

- Work happens in the existing worktree `.worktrees/feat-arabic-localization-r9-phase-b`, branch `feat/arabic-localization-r9-phase-b`. No new worktree, no new branch.
- No changes to any English route's rendered output when a component's new `locale` prop is omitted — every shared-component task must verify existing English call sites are unaffected.
- **Letter-spacing discipline (from the B0 final review):** `tracking-widest`/`tracking-[0.2em]` must NEVER apply to Arabic-language text — it breaks joined Arabic letterforms. Every task below that touches an eyebrow/label element rendering Arabic text drops the tracking utility for the Arabic branch; English keeps it unchanged. Do not carry this class into any new Arabic string unless explicitly told to (English-content spans, e.g. article tags, are the only exception).
- **`BookingCta` has no locale awareness and its default (`children` omitted) is the English string `"Book a Consultation"`** (`src/components/ui/BookingCta.tsx:20`). Every Arabic page task below must pass explicit Arabic `children`/`bookingLabel` at every `BookingCta`/`TreatmentCtaSection` call site — never omit it on an Arabic page, even where the English source omits it.
- No invented `/ar/*` destination URLs. Each page task below states, per outbound link, whether the target is another Batch 1 page (real `/ar/...` href, since all five ship together in this batch) or outside Batch 1 (temporary English href, with an inline comment naming which future batch will make it live).
- `/ar/insights` and `/ar/insights/[slug]` do not exist and must not be linked to as if they did. Any reference to Insights content stays visibly English (label says so).
- No new unit tests for presentational components/pages — matches the established codebase convention (0 of 18 pre-existing test files cover `src/components/sections/`, `src/components/ui/`, or `src/app/(en)/(marketing)/`). Verification is `npm run typecheck` + targeted grep/read checks per task, and a final `npm run build`/`lint`/`test` pass.
- No push, no Preview deploy, no PR update after this batch — those happen once, after Batch 4, per the owner's explicit instruction.

---

### Task 1: Centralize Arabic reputation strings; migrate the two existing B0 duplicates onto it

B0's final review flagged `PhysicianAuthority.tsx` and `AuthorityMediaSectionAr.tsx` each holding their own copy of the same Arabic review-headline/editorial-wording facts, linked only by a sync comment. This batch needs the same facts again in two more components (Tasks 10–11) plus one new fact (`RecognitionSection`, Task 8) — a third and fourth duplicate is the point past which a comment stops being enough. This task creates the real shared source and migrates the two existing consumers onto it.

**Files:**
- Create: `src/lib/i18n/ar-reputation.ts`
- Modify: `src/components/editorial/PhysicianAuthority.tsx`
- Modify: `src/components/sections/ar/AuthorityMediaSectionAr.tsx`

**Interfaces:**
- Produces: `AR_REPUTATION: { reviewHeadline: string; reviewHeadlineWithPlatforms: string; trainingPositioningLine: string; editorialWordingByOutlet: Record<string, string> }`, consumed by Tasks 8, 10, 11 and by the two files modified here.

- [ ] **Step 1: Create the shared module**

```ts
// src/lib/i18n/ar-reputation.ts
/**
 * Centralized Arabic mirrors of owner-approved strings in
 * `config/reputation.ts` / `config/mediaAppearances.ts`. Introduced in
 * R9 Phase B Batch 1 after a third and fourth consumer needed the same
 * facts B0 had already duplicated between PhysicianAuthority and
 * AuthorityMediaSectionAr with only a sync comment linking them — this
 * is the single source those comments now point to. Every value here
 * translates an existing owner-approved English string; this file adds
 * no new facts. If the underlying English string in config/reputation.ts
 * ever changes, update the matching value here too.
 */
export const AR_REPUTATION = {
  /** Mirrors config/reputation.ts's `publicReviewHeadline`. */
  reviewHeadline: "أكثر من 450 تقييمًا من المرضى عبر منصات مستقلة",
  /** Mirrors config/reputation.ts's `publicReviewHeadlineWithPlatforms`. */
  reviewHeadlineWithPlatforms: "أكثر من 450 تقييمًا من المرضى عبر Google وDoctoralia وTop Doctors",
  /** Mirrors config/reputation.ts's `trainingPrograms[0].positioningLine`. */
  trainingPositioningLine: "نهج تطوّر عبر سنوات من الممارسة السريرية، ويُدرَّس الآن لأطباء آخرين.",
  /** Mirrors config/mediaAppearances.ts's `editorialContributions` wording, keyed by `outletName`. Components fall back to the English wording when no Arabic entry exists for a given outlet — never a fabricated translation. */
  editorialWordingByOutlet: {
    "Men's Health Spain": "مساهم في مجلة Men's Health إسبانيا",
  } as Record<string, string>,
};
```

- [ ] **Step 2: Migrate `PhysicianAuthority.tsx` onto it**

Read the file's current state (it was last touched in B0's final-review fix round — it now exports its local `AR` object with an `editorialWordingByOutlet` field and is imported by `AuthorityMediaSectionAr.tsx`). Add `import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";`. Remove the `editorialWordingByOutlet` field from the component's own local `AR` object (keep every other field in `AR` — `yearsLabel`, `girthProcedureLabel`, `girthSinceLabel`, `girthSinceValue`, `girthSincePrefix`, `febuLine`, `medicalTrainerLabel`, `medicalTrainerTrains`, `professionalRecognition` — those are page-specific label wording, not `config/reputation.ts` facts, and stay local). At the `editorialContributions.filter(...).map(...)` call site, change the lookup from `AR.editorialWordingByOutlet[item.outletName] ?? item.wording` to `AR_REPUTATION.editorialWordingByOutlet[item.outletName] ?? item.wording`. Do not change anything else in the file — the English render path (`locale` omitted) must stay byte-identical.

- [ ] **Step 3: Migrate `AuthorityMediaSectionAr.tsx` onto it**

Read the file's current state (it currently imports `AR` from `PhysicianAuthority.tsx` for the editorial-wording lookup, and has its own local `REVIEW_HEADLINE_AR` constant). Change the import to `import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";` instead of importing anything from `PhysicianAuthority.tsx`. Replace every use of the local `REVIEW_HEADLINE_AR` constant with `AR_REPUTATION.reviewHeadline`, and delete the now-unused local `REVIEW_HEADLINE_AR` constant. Replace the editorial-wording lookup (whatever it currently references from the old `PhysicianAuthority` import) with `AR_REPUTATION.editorialWordingByOutlet[item.outletName] ?? item.wording`. Do not change anything else in the file.

- [ ] **Step 4: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -rn "REVIEW_HEADLINE_AR\|editorialWordingByOutlet" src` — every remaining reference must resolve to `AR_REPUTATION` in the new module or its two consumers; no leftover local duplicate definitions.

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n/ar-reputation.ts src/components/editorial/PhysicianAuthority.tsx src/components/sections/ar/AuthorityMediaSectionAr.tsx
git commit -m "$(cat <<'EOF'
refactor(r9-b): centralize Arabic reputation strings into one shared module

PhysicianAuthority and AuthorityMediaSectionAr each held their own copy
of the same Arabic review-headline/editorial-wording facts (B0 final
review flagged this, linked only by a sync comment). Batch 1 needs the
same facts in two more components — this is the real single source
those comments now point to, not a third duplicate.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add `inLanguage` option to `breadcrumbSchema` and `medicalWebPageSchema`

Mirrors the option `faqPageSchema` already has in the same file, so Arabic pages' breadcrumb/medical-webpage structured data is correctly tagged `inLanguage: "ar"`.

**Files:**
- Modify: `src/lib/seo/json-ld.ts`

- [ ] **Step 1: Update `breadcrumbSchema`**

Find:
```ts
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}
```

Replace with:
```ts
export function breadcrumbSchema(
  items: { name: string; path: string }[],
  options?: { inLanguage?: string },
) {
  return prune({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: options?.inLanguage,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  });
}
```

- [ ] **Step 2: Update `medicalWebPageSchema`**

Find:
```ts
export function medicalWebPageSchema(input: {
  name: string;
  description: string;
  path: string;
  /** e.g. "MedicalCondition" name this page is about, if applicable. */
  aboutType?: "MedicalCondition" | "MedicalProcedure" | "MedicalTherapy";
  aboutName?: string;
}) {
  return prune({
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: input.name,
    description: input.description,
    url: new URL(input.path, siteUrl).toString(),
    about: input.aboutType
      ? prune({ "@type": input.aboutType, name: input.aboutName })
      : undefined,
    lastReviewed: undefined,
    reviewedBy: undefined,
  });
}
```

Replace with:
```ts
export function medicalWebPageSchema(
  input: {
    name: string;
    description: string;
    path: string;
    /** e.g. "MedicalCondition" name this page is about, if applicable. */
    aboutType?: "MedicalCondition" | "MedicalProcedure" | "MedicalTherapy";
    aboutName?: string;
  },
  options?: { inLanguage?: string },
) {
  return prune({
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    inLanguage: options?.inLanguage,
    name: input.name,
    description: input.description,
    url: new URL(input.path, siteUrl).toString(),
    about: input.aboutType
      ? prune({ "@type": input.aboutType, name: input.aboutName })
      : undefined,
    lastReviewed: undefined,
    reviewedBy: undefined,
  });
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck` — must pass. Run: `grep -rn "breadcrumbSchema(\|medicalWebPageSchema(" src/app` — confirm every existing English call site passes only the first argument (options omitted), so `inLanguage` stays `undefined` and `prune()` drops it — no change to English JSON-LD output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo/json-ld.ts
git commit -m "$(cat <<'EOF'
feat(r9-b): add inLanguage option to breadcrumbSchema and medicalWebPageSchema

Mirrors the option faqPageSchema already has, so Arabic pages' structured
data can be tagged inLanguage: "ar". Optional parameter, no English change.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Fix `Breadcrumb`'s chevron RTL mirroring

The `ChevronRight` separator never flips under `dir="rtl"` — under RTL the trail reads right-to-left but the chevron still points right, backwards relative to reading direction.

**Files:**
- Modify: `src/components/ui/Breadcrumb.tsx`

- [ ] **Step 1: Add the RTL flip**

Find (line 23):
```tsx
                {index > 0 && <ChevronRight aria-hidden size={12} />}
```

Replace with:
```tsx
                {index > 0 && <ChevronRight aria-hidden size={12} className="rtl:rotate-180" />}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. `rtl:rotate-180` is a no-op under `dir="ltr"` (Tailwind's `rtl:` variant only activates under an RTL ancestor), so English breadcrumbs are visually unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Breadcrumb.tsx
git commit -m "$(cat <<'EOF'
fix(r9-b): flip Breadcrumb's chevron separator under RTL

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Add `locale="ar"` support to `RelatedTreatments`

**Files:**
- Modify: `src/components/ui/RelatedTreatments.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

export type RelatedLink = { label: string; href: string };

/**
 * Internal-linking band — spec explicitly requires "strong internal
 * linking between related treatments" on every inner page. Deliberately
 * plain (a labelled list, not cards) so it reads as reference material,
 * not another promotional block.
 */
export function RelatedTreatments({ items, locale }: { items: RelatedLink[]; locale?: "ar" }) {
  return (
    <section className="border-t border-border py-16">
      <Container>
        <Reveal className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
          <span className={cn("text-xs font-medium uppercase text-muted-foreground", locale !== "ar" && "tracking-widest")}>
            {locale === "ar" ? "مواضيع ذات صلة" : "Related"}
          </span>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent-strong"
            >
              {item.label}
            </Link>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Confirm every existing English call site (`grep -rn "RelatedTreatments" src/app`) omits `locale` — renders `"Related"` with `tracking-widest`, unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/RelatedTreatments.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to RelatedTreatments

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Add `locale="ar"` support to `AuthorityBlock`; fix its RTL text-alignment bug

Also fixes the physical `lg:text-left` → logical `lg:text-start` found during this batch's audit (stays LTR-forced under `dir="rtl"` today).

**Files:**
- Modify: `src/components/ui/AuthorityBlock.tsx`

- [ ] **Step 1: Replace the component**

```tsx
"use client";

import { motion } from "motion/react";
import { doctor } from "@/config/doctor";
import { defaultViewport, durations, easeSoft } from "@/components/motion/motion-config";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils/cn";

const metricsEn = [
  doctor.girthProcedureCount !== undefined && {
    value: doctor.girthProcedureCount,
    label: "Procedures Performed",
  },
  doctor.girthEnhancementSince !== undefined && {
    value: `Since ${doctor.girthEnhancementSince}`,
    label: "Penile Girth Enhancement Experience",
  },
  { value: "Consultant", label: "Urologist & Andrologist" },
  doctor.medicalTrainer?.role !== undefined && {
    value: "Medical Trainer",
    label: "Penile Enhancement Techniques",
  },
].filter((metric): metric is { value: string; label: string } => Boolean(metric));

const metricsAr = [
  doctor.girthProcedureCount !== undefined && {
    value: doctor.girthProcedureCount,
    label: "الإجراءات المنجزة",
  },
  doctor.girthEnhancementSince !== undefined && {
    value: `منذ ${doctor.girthEnhancementSince}`,
    label: "خبرة في زيادة سماكة القضيب",
  },
  { value: "استشاري", label: "أمراض المسالك البولية والذكورة" },
  doctor.medicalTrainer?.role !== undefined && {
    value: "مدرّب طبي",
    label: "تقنيات تجميل القضيب",
  },
].filter((metric): metric is { value: string; label: string } => Boolean(metric));

/**
 * Shared authority-metrics block — extracted from the Penile Girth
 * Enhancement page (Phase R1-R2, was previously a one-off there so it
 * could be reused on the homepage and the Male Aesthetics hub). Same
 * fail-safe, config-driven pattern as AuthorityStripSection: never
 * renders a metric whose backing config field is unset.
 */
export function AuthorityBlock({ align = "left", locale }: { align?: "left" | "center"; locale?: "ar" }) {
  const metrics = locale === "ar" ? metricsAr : metricsEn;
  if (metrics.length === 0) return null;

  return (
    <StaggerGroup
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4 lg:gap-6",
        align === "center" && "mx-auto max-w-2xl",
      )}
    >
      {metrics.map((metric) => (
        <StaggerItem
          key={metric.label}
          className={align === "center" ? "text-center" : "text-center lg:text-start"}
        >
          <motion.p
            className="font-display text-display-md text-foreground"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={defaultViewport}
            transition={{ duration: durations.base, ease: easeSoft }}
          >
            {metric.value}
          </motion.p>
          <p className={cn("mt-2 text-xs font-medium uppercase text-muted-foreground", locale !== "ar" && "tracking-widest")}>
            {metric.label}
          </p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Confirm existing English call sites (`grep -rn "AuthorityBlock" src/app`) omit `locale` — `lg:text-start` resolves to `left` under `dir="ltr"`, so English's `align="left"` rendering is pixel-identical to the old `lg:text-left`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/AuthorityBlock.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to AuthorityBlock; use logical text-start

lg:text-left stayed LTR-forced under dir="rtl" — lg:text-start resolves
identically under ltr (no English change) and correctly right-aligns
under rtl.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Add `locale="ar"` support to `FlagshipAuthorityFeature`

Currently a zero-argument component; gains its first prop.

**Files:**
- Modify: `src/components/editorial/FlagshipAuthorityFeature.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import Link from "next/link";
import { doctor } from "@/config/doctor";
import styles from "./VisualSystem.module.css";

/** Temporary EN destination for the CTA link — no /ar/male-aesthetics/penile-girth-enhancement yet (ships Batch 3). */
export function FlagshipAuthorityFeature({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  return <div className={styles.feature}>
    <p className={`text-xs uppercase ${isAr ? "" : "tracking-widest"}`}>{isAr ? "تركيز سريري متخصص" : "A dedicated clinical focus"}</p>
    <h2 className="mt-4 max-w-xl font-display text-display-lg">{isAr ? "زيادة سماكة القضيب" : "Penile Girth Enhancement"}</h2>
    <div className={styles.featureNumbers}>
      <div><strong>{doctor.girthProcedureCount}</strong><span>{isAr ? "الإجراءات المنجزة" : "Procedures performed"}</span></div>
      <div><strong>{doctor.girthEnhancementSince}</strong><span>{isAr ? "خبرة منذ" : "Experience since"}</span></div>
    </div>
    <p className="mb-6 text-sm">{doctor.title}<br />{isAr ? "مدرّب طبي" : "Medical Trainer"} · {doctor.medicalTrainer.program}</p>
    <Link className={styles.featureLink} href="/male-aesthetics/penile-girth-enhancement">{isAr ? "استكشف زيادة سماكة القضيب ←" : "Explore Penile Girth Enhancement →"}</Link>
  </div>;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Confirm the existing English call site (`grep -rn "FlagshipAuthorityFeature" src/app`, used by `/about`) omits `locale` — renders unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/FlagshipAuthorityFeature.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to FlagshipAuthorityFeature

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Add `locale="ar"` support to `ExpertiseTimeline`

**Files:**
- Modify: `src/components/editorial/ExpertiseTimeline.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Editorial.module.css";

type Milestone = { eyebrow: string; heading: string; body: string; href?: string; linkLabel?: string };

const summariesEn = [
  "Medical training in Spain, with clinical experience shaped by Hospital Clínic Barcelona.",
  "Tertiary urology, advanced laparoscopic surgery and renal transplantation, alongside uro-oncology and functional urology.",
  "A dedicated focus on andrology and men's sexual, hormonal and reproductive health.",
  "Male genital aesthetics within a specialist urological practice, informed by individual anatomy.",
  "Clinical practice alongside medical education through AndroMax Training.",
];

const summariesAr = [
  "تدريب طبي في إسبانيا، مع خبرة سريرية تشكّلت في مستشفى كلينيك برشلونة.",
  "طب مسالك بولية ثالثي، وجراحة متقدمة بالمنظار، وزراعة كلى، إلى جانب أورام المسالك البولية وطب المسالك البولية الوظيفي.",
  "تركيز متخصص على طب الذكورة وصحة الرجل الجنسية والهرمونية والإنجابية.",
  "تجميل ذكوري ضمن ممارسة متخصصة في طب المسالك البولية، مبني على التشريح الفردي.",
  "ممارسة سريرية إلى جانب التعليم الطبي من خلال برنامج AndroMax Training.",
];

export function ExpertiseTimeline({ items, locale }: { items: Milestone[]; locale?: "ar" }) {
  const summaries = locale === "ar" ? summariesAr : summariesEn;
  return <ol className={styles.timeline}>
    {items.map((item, index) => <li className={styles.milestone} key={item.heading}>
      <span className={styles.marker} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Reveal className={styles.story}>
        <p className={`text-xs uppercase text-muted-foreground ${locale === "ar" ? "" : "tracking-widest"}`}>{item.eyebrow}</p>
        <h3 className="mt-3 font-display text-2xl">{item.heading}</h3>
        <p className="mt-4 text-sm text-muted-foreground">{summaries[index] ?? item.body}</p>
        <details><summary>{locale === "ar" ? "الخلفية السريرية" : "Clinical background"}</summary><p className="text-sm text-muted-foreground">{item.body}</p></details>
        {item.href && <Link href={item.href} className="mt-5 inline-flex text-sm underline underline-offset-4">{item.linkLabel}</Link>}
      </Reveal>
    </li>)}
  </ol>;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Confirm the existing English call site (`/about`) omits `locale` — unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/ExpertiseTimeline.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to ExpertiseTimeline

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Add `locale="ar"` support to `RecognitionSection`

**Files:**
- Modify: `src/components/sections/RecognitionSection.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import Image from "next/image";
import visual from "@/components/editorial/VisualSystem.module.css";
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { awardLogos, mensHealthAuthorProfileUrl, trainingPrograms } from "@/config/reputation";
import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Owner-approved names and, as of R7.1, owner-supplied official logos. */
export function RecognitionSection({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  const publishable = doctor.awards.filter((award) => award.publishReady);
  const editorial = editorialContributions.filter((item) => item.publishReady);
  const training = trainingPrograms[0];

  if (publishable.length === 0 && editorial.length === 0) return null;

  return (
    <section className={`${visual.recognition} py-section-y`}>
      <Container className={visual.recognitionGrid}>
        {publishable.length > 0 && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">
              {isAr ? "الاعتراف المهني" : "Professional Recognition"}
            </h2>
            <ul className="mt-6 space-y-5">
              {publishable.map((award) => {
                const logoSrc = awardLogos[award.officialTitle];
                return (
                  <li key={`${award.issuer}-${award.year}`}>
                    {logoSrc && (
                      <span className={visual.logoChip}>
                        <Image src={logoSrc} alt={award.officialTitle} width={160} height={44} style={{ height: "1.75rem", width: "auto" }} />
                      </span>
                    )}
                    <p className={`mt-3 ${logoSrc ? `text-sm ${visual.recognitionCaption}` : `font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug ${visual.recognitionHeading}`}`}>
                      {award.officialTitle}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
        {editorial.length > 0 && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">
              {isAr ? "المساهمات التحريرية / الإعلامية" : "Editorial / Media"}
            </h2>
            <ul className="mt-6 space-y-5">
              {editorial.map((item) => (
                <li key={item.outletName}>
                  {item.outletName === "Men's Health Spain" && (
                    <span className={visual.logoChip}>
                      <Image src="/brand/authority/mens-health.jpg" alt="Men's Health Spain" width={100} height={44} style={{ height: "1.75rem", width: "auto" }} />
                    </span>
                  )}
                  <p className={`mt-3 font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug ${visual.recognitionHeading}`}>
                    {isAr ? (AR_REPUTATION.editorialWordingByOutlet[item.outletName] ?? item.wording) : item.wording}
                  </p>
                  {item.outletName === "Men's Health Spain" && (
                    <a
                      href={mensHealthAuthorProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-2 inline-flex text-sm underline underline-offset-4"
                    >
                      {isAr ? "عرض الملف الشخصي للكاتب" : "View author profile"}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {doctor.medicalTrainer && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">{isAr ? "التعليم الطبي" : "Medical Education"}</h2>
            {training?.logoSrc && (
              <span className={`${visual.logoChip} mt-6`}>
                <Image src={training.logoSrc} alt={training.program} width={140} height={44} style={{ height: "1.75rem", width: "auto" }} />
              </span>
            )}
            <p className={`mt-3 font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug ${visual.recognitionHeading}`}>{doctor.medicalTrainer.program}</p>
            <p className="mt-4 text-sm">{isAr ? "مدرّب طبي" : "Medical Trainer"}</p>
            <p className={`mt-2 max-w-xs text-sm ${visual.recognitionBody}`}>
              {isAr
                ? (training?.positioningLine ? AR_REPUTATION.trainingPositioningLine : "تدريب أطباء المسالك البولية وأطباء التجميل")
                : (training?.positioningLine ?? "Training of urologists and aesthetic physicians")}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Confirm the existing English call site (`/about`) omits `locale` — unchanged. None of this component's headings (`font-display text-2xl`) carry `tracking-widest`, so no letter-spacing fix is needed here.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/RecognitionSection.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to RecognitionSection

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Add `locale="ar"` support to `MediaAppearancesSection`

Currently always renders `null` in production (`mediaAppearances` ships empty) — this future-proofs it for Arabic the same way the content it would show is already future-proofed for English.

**Files:**
- Modify: `src/components/sections/MediaAppearancesSection.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import { mediaAppearances } from "@/config/mediaAppearances";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Renders nothing until at least one `mediaAppearances` entry has
 * `publishReady: true` — currently always nothing, since the array
 * ships empty. Do not add a fallback/placeholder state; an empty
 * trust section is worse than no section.
 */
export function MediaAppearancesSection({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  const publishable = mediaAppearances.filter((item) => item.publishReady);
  if (publishable.length === 0) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className={`text-eyebrow font-medium uppercase text-accent-strong ${isAr ? "" : "tracking-[0.2em]"}`}>
            {isAr ? "المساهمات الإعلامية والتحريرية" : "Media & Editorial Contributions"}
          </p>
          <ul className="mt-8 flex flex-col items-center gap-4">
            {publishable.map((item) => (
              <li key={`${item.outletName}-${item.year}`} className="text-sm text-muted-foreground">
                {item.title} — {item.outletName}, {item.year}
                {item.url && (
                  <>
                    {" · "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
                    >
                      {isAr ? "عرض" : "View"}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Both English and Arabic call sites render `null` today (empty array) — no visible behavior change either way; this only affects the currently-unreachable branch.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MediaAppearancesSection.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to MediaAppearancesSection

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Add `locale="ar"` support to `PatientFeedbackSection`

**Files:**
- Modify: `src/components/sections/PatientFeedbackSection.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import { reviewPlatforms, topDoctorsAggregate, verifiedReviewTotal } from "@/config/reputation";
import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Patient Feedback — R7.1. Every number here comes from
 * `config/reputation.ts`, never hardcoded here. An entry with
 * `verified: false` renders a bare profile link, never an invented
 * rating or count (see that file's header for verification provenance
 * per platform). Platform names (Google, Doctoralia, Top Doctors) are
 * proper nouns and stay untranslated in both locales.
 */
export function PatientFeedbackSection({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  const google = reviewPlatforms.find((p) => p.platform === "Google");
  const doctoralia = reviewPlatforms.find((p) => p.platform === "Doctoralia");
  const topDoctors = reviewPlatforms.filter((p) => p.platform === "Top Doctors");

  return (
    <section id="reviews" className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow={isAr ? "آراء المرضى" : "Patient Feedback"}
          heading={isAr ? "تقييمات مستقلة" : "Independently Reviewed"}
          description={verifiedReviewTotal > 0 ? (isAr ? AR_REPUTATION.reviewHeadline : "450+ patient reviews across independent platforms") : undefined}
          locale={isAr ? "ar" : undefined}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {google && (
            <div className={editorialStyles.candidateColumn}>
              <p className={`text-xs font-medium uppercase text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>Google</p>
              {google.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">{google.rating} / 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">{isAr ? `${google.reviewCount} تقييم موثّق` : `${google.reviewCount} verified reviews`}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? "ملف موثّق" : "Verified profile"}</p>
              )}
              {google.profileUrl && (
                <a href={google.profileUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
                  {isAr ? "قراءة تقييمات Google" : "Read Google Reviews"}
                </a>
              )}
            </div>
          )}
          {doctoralia && (
            <div className={editorialStyles.candidateColumn}>
              <p className={`text-xs font-medium uppercase text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>Doctoralia</p>
              {doctoralia.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">{doctoralia.rating} / 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">{isAr ? `${doctoralia.reviewCount} تقييم موثّق` : `${doctoralia.reviewCount} verified reviews`}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? "ملف موثّق" : "Verified profile"}</p>
              )}
              {doctoralia.profileUrl && (
                <a href={doctoralia.profileUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
                  {isAr ? "قراءة تقييمات Doctoralia" : "Read Doctoralia Reviews"}
                </a>
              )}
            </div>
          )}
          {topDoctors.length > 0 && (
            <div className={`${editorialStyles.candidateColumn} ${editorialStyles.candidateColumnAlt}`}>
              <p className={`text-xs font-medium uppercase text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>Top Doctors</p>
              {topDoctorsAggregate.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">
                    {topDoctorsAggregate.rating} / 5
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{isAr ? `${topDoctorsAggregate.reviewCount} تقييم موثّق` : `${topDoctorsAggregate.reviewCount} verified reviews`}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? "ملف موثّق" : "Verified profile"}</p>
              )}
              <div className="mt-4 flex flex-col gap-1">
                {topDoctors.map((entry) =>
                  entry.profileUrl ? (
                    <a
                      key={entry.label}
                      href={entry.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                    >
                      {isAr
                        ? (entry.label ? `عرض الملف الشخصي – ${entry.label}` : "عرض الملف الشخصي")
                        : (entry.label ? `View ${entry.label} profile` : "View profile")}
                    </a>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-xs text-muted-foreground">
            {isAr
              ? "التقييمات وأعداد المراجعات المعروضة مأخوذة مباشرة من كل منصة ويتم تحديثها دوريًا — وهي غير مُنشأة أو مقدَّرة من قبل هذا الموقع."
              : "Ratings and review counts shown are read directly from each platform and updated periodically — they are not generated or estimated by this website."}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. `SectionHeading`'s `locale` prop already exists (added in B0's final-review fix round) — confirm this compiles against its actual signature. Confirm the existing English call site (`/about`) omits `locale` — unchanged (note: English `description` is now the literal string `"450+ patient reviews across independent platforms"` inline rather than importing `publicReviewHeadline` from config — functionally identical value, but confirm this still matches; if you'd rather keep the original import for the English branch, that's an acceptable equivalent — either way the rendered English string must be identical to before this change).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PatientFeedbackSection.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to PatientFeedbackSection

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Add `locale="ar"` support to `PatientReviewsCta`

Also fixes its internal anchor link, which must point at `/ar/about#reviews` (not `/about#reviews`) on the Arabic page.

**Files:**
- Modify: `src/components/sections/PatientReviewsCta.tsx`

- [ ] **Step 1: Replace the component**

```tsx
import Link from "next/link";
import { publicReviewHeadlineWithPlatforms, verifiedReviewTotal } from "@/config/reputation";
import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";

/**
 * Compact aggregate review trust line, used near the booking CTA — the
 * fuller multi-platform breakdown lives in PatientFeedbackSection.
 * Reads from the same centralized `reputation.ts` config (R7.1).
 */
export function PatientReviewsCta({ locale }: { locale?: "ar" } = {}) {
  if (verifiedReviewTotal <= 0) return null;
  const isAr = locale === "ar";

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      <span>{isAr ? AR_REPUTATION.reviewHeadlineWithPlatforms : publicReviewHeadlineWithPlatforms}</span>
      <Link
        href={isAr ? "/ar/about#reviews" : "/about#reviews"}
        className="font-medium text-foreground underline decoration-accent-strong underline-offset-4"
      >
        {isAr ? "عرض آراء المرضى" : "See patient reviews"}
      </Link>
    </p>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`. Confirm the existing English call site omits `locale` — unchanged, still links to `/about#reviews`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PatientReviewsCta.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b): add locale="ar" support to PatientReviewsCta

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Build `/ar/about`

Mirrors `src/app/(en)/(marketing)/about/page.tsx` section-for-section. Uses `PhysicianAuthority`/`ClinicalDecisionFlow` (already locale-aware from B0) and every component made locale-aware in Tasks 4–11. `TreatmentCtaSection` is not used on this page (English doesn't use it here either). `Breadcrumb`, `TonalSection` (unused here), `EditorialField`, `HeroAtmosphere`, `HeroPortrait`, `PhotoFrame`, `MaskedReveal`, `Reveal`, `StaggerGroup`/`StaggerItem`, `EditorialTexture`, `PullQuote`, `MedicalEducationDiagram`, `Container`, `BookingCta`, `JsonLd` are reused exactly as English uses them (all confirmed prop-driven/safe).

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/about/page.tsx`

**Link status:** `/male-aesthetics/penile-girth-enhancement` → temporary EN (ships Batch 3). `/about#reviews` → becomes `/ar/about#reviews` (self, handled by `PatientReviewsCta`'s `locale` prop). `practice.physicianProfileUrl` and `publications[].url` → external, unaffected by locale. `doctor.medicalTrainer.programUrl` → currently `undefined`, block doesn't render in either locale.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/about/page.tsx
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { HeroPortrait } from "@/components/editorial/HeroPortrait";
import { FlagshipAuthorityFeature } from "@/components/editorial/FlagshipAuthorityFeature";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { PhysicianAuthority } from "@/components/editorial/PhysicianAuthority";
import { ExpertiseTimeline } from "@/components/editorial/ExpertiseTimeline";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { MedicalEducationDiagram } from "@/components/illustrations/MedicalEducationDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { PullQuote } from "@/components/ui/PullQuote";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaAppearancesSection } from "@/components/sections/MediaAppearancesSection";
import { PatientReviewsCta } from "@/components/sections/PatientReviewsCta";
import { PatientFeedbackSection } from "@/components/sections/PatientFeedbackSection";
import { RecognitionSection } from "@/components/sections/RecognitionSection";
import { publications } from "@/config/reputation";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/about";

export const metadata: Metadata = buildMetadata({
  title: "نبذة عنّا",
  description:
    "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة في مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي. تدريب جراحي أوروبي، مع تطور نحو طب الذكورة وصحة الرجل.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "نبذة عنّا", href: PATH },
];

/** Credential-list translations — keys are the exact English strings in doctor.credentials, translation-only. */
const CREDENTIALS_AR: Record<string, string> = {
  "Medical degree and training in Spain": "شهادة طبية وتدريب في إسبانيا",
  "Hospital Clínic Barcelona training": "تدريب في مستشفى كلينيك برشلونة",
  "FEBU — Fellow of the European Board of Urology": "FEBU — زميل المجلس الأوروبي لطب المسالك البولية",
  "Extensive tertiary hospital experience": "خبرة واسعة في المستشفيات الثالثية",
  "Advanced laparoscopic surgery": "جراحة متقدمة بالمنظار",
  "Renal transplantation surgery": "جراحة زراعة الكلى",
  "Uro-oncology": "أورام المسالك البولية",
  "Functional urology": "طب المسالك البولية الوظيفي",
  "Andrology and male sexual health": "طب الذكورة والصحة الجنسية للرجل",
  "Male genital aesthetics": "التجميل الذكوري",
  "Academic and teaching background": "خلفية أكاديمية وتعليمية",
  "Practicing in the United Arab Emirates": "يمارس الطب في دولة الإمارات العربية المتحدة",
};

/** Article-topic label translations for the Men's Health Spain publications — external Spanish-language articles; these are topic descriptions, not translated titles of an Arabic destination. */
const PUBLICATION_LABELS_AR: Record<string, string> = {
  "Testosterone and the body's daily rhythm": "التستوستيرون والإيقاع اليومي للجسم",
  "Testosterone, explained by an andrologist": "التستوستيرون بشرح طبيب الذكورة",
  "What testosterone actually does": "ما الذي يفعله التستوستيرون فعليًا",
};

const narrative = [
  {
    eyebrow: "التدريب الأوروبي",
    heading: "أساس تأسس في إسبانيا",
    body:
      "بدأ التدريب الطبي للدكتور مولينا في إسبانيا، حيث اكتسب خبرة سريرية تشكّلت في مستشفى كلينيك برشلونة — أحد أبرز المراكز الطبية الأكاديمية في أوروبا. هذا الأساس، ضمن بيئة صارمة وقائمة على الدقة الأكاديمية، شكّل نهجًا قائمًا على الأدلة ومهتمًا بالتفاصيل استمر طوال بقية مسيرته المهنية.",
  },
  {
    eyebrow: "الخلفية الجراحية",
    heading: "سنوات من ممارسة طب المسالك البولية الثالثي",
    body:
      "تلت ذلك سنوات من الخبرة الواسعة في المستشفيات الثالثية، شملت جراحة متقدمة بالمنظار وزراعة الكلى، إلى جانب التدريب الأوسع في طب المسالك البولية العام — بما في ذلك أورام المسالك البولية وطب المسالك البولية الوظيفي." +
      (doctor.yearsOfExperience !== undefined
        ? ` هذا الأساس الجراحي، الذي تشكّل عبر أكثر من ${doctor.yearsOfExperience} عامًا في طب المسالك البولية، لا يزال يوجّه طريقة التعامل مع الحالات المعقدة اليوم.`
        : " لا يزال هذا الأساس الجراحي يوجّه طريقة التعامل مع الحالات المعقدة اليوم."),
  },
  {
    eyebrow: "التطور نحو طب الذكورة",
    heading: "تركيز يتجه نحو صحة الرجل",
    body:
      "بمرور الوقت، تركّز التوجه السريري بشكل متزايد نحو طب الذكورة والطب الجنسي للرجال — وهما مجالان في طب المسالك البولية يُعنيان تحديدًا بالصحة الجنسية والهرمونية والإنجابية للرجل. يُعالَج ضعف الانتصاب والتستوستيرون والصحة الهرمونية للرجال وخصوبة الرجل جميعها بنفس الدقة التشخيصية التي ميّزت الخلفية الجراحية الأوسع.",
  },
  {
    eyebrow: `التجميل الذكوري · منذ ${doctor.girthEnhancementSince} · ${doctor.girthProcedureCount} إجراء`,
    heading: "التركيز الرائد: زيادة سماكة القضيب",
    body:
      "امتد هذا التركيز ليشمل التجميل الذكوري — الذي يُعالَج ضمن سياق طب الذكورة والمسالك البولية، بنهج قائم على التشريح وتحت إشراف طبي، وليس كخدمة تجميلية قائمة بذاتها." +
      (doctor.girthEnhancementSince !== undefined || doctor.girthProcedureCount !== undefined
        ? ` يُجري د. مولينا زيادة سماكة القضيب${
            doctor.girthEnhancementSince !== undefined ? ` منذ ${doctor.girthEnhancementSince}` : ""
          }${
            doctor.girthProcedureCount !== undefined ? `، بعدد ${doctor.girthProcedureCount} إجراء منجز` : ""
          }.`
        : ""),
    href: "/male-aesthetics/penile-girth-enhancement",
    linkLabel: "استكشف زيادة سماكة القضيب",
  },
  {
    eyebrow: "النشاط الأكاديمي",
    heading: "استمرارية الارتباط بالتعليم",
    body:
      "حافظ د. مولينا على ارتباطه بالتعليم والتدريب الأكاديمي طوال مسيرته السريرية، بما يعكس التزامًا بالمجال يتجاوز رعاية المريض الفردية." +
      (doctor.medicalTrainer?.description
        ? " إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا متخصصًا في تقنيات تجميل القضيب لأطباء المسالك البولية وأطباء التجميل من خلال برنامج AndroMax Training."
        : ""),
  },
];

export default function AboutPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <EditorialField className="py-14">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first lg:max-w-lg">
            <HeroPortrait
              slot="aboutPortrait"
              priority
              objectPosition="center 4%"
              alt="صورة الدكتور أليخاندرو مولينا"
            />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                نبذة
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                {doctor.displayName}
              </h1>
              <p className="mt-6 max-w-lg font-display text-2xl leading-snug">تدريب أوروبي. خلفية جراحية. تركيز متخصص على صحة الرجل.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">استشاري أمراض المسالك البولية والذكورة</p>
                <p className="mt-3 text-sm text-muted-foreground">مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">احجز استشارة</BookingCta>
                {isPhysicianProfileConfigured && (
                  <a
                    href={practice.physicianProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    عرض الملف الشخصي في NMC
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </EditorialField>

      <section className="border-t border-border bg-background py-14">
        <Container>
          <PhysicianAuthority locale="ar" />
        </Container>
      </section>

      <RecognitionSection locale="ar" />

      {/* Narrative — alternating editorial rows */}
      <section className="border-t border-border py-section-y">
        <Container>
          <p className="text-xs uppercase text-accent-strong">الرحلة السريرية</p>
          <h2 className="mt-4 max-w-xl font-display text-display-lg">أساس جراحي. تركيز يزداد تخصصًا.</h2>
          <ExpertiseTimeline items={narrative} locale="ar" />
        </Container>
      </section>

      <section className="py-section-y">
        <Container className={visual.split}>
          <div>
            <PhotoFrame slot="aboutConsultation" landscape alt="الدكتور أليخاندرو مولينا أثناء استشارة سريرية" />
            <div className="mt-8"><PullQuote>تُعالَج زيادة سماكة القضيب ضمن سياق طب الذكورة والمسالك البولية — بنهج قائم على التشريح وتحت إشراف طبي، وليست خدمة تجميلية قائمة بذاتها.</PullQuote></div>
          </div>
          <FlagshipAuthorityFeature locale="ar" />
        </Container>
      </section>

      {doctor.medicalTrainer?.description && (
        <section className="border-t border-border py-section-y">
          <Container className={visual.split}>
            <PhotoFrame slot="aboutTraining" landscape alt="الدكتور أليخاندرو مولينا في زي طبي" />
            <Reveal>
              <MedicalEducationDiagram
                className="mb-6 h-16 w-16 text-muted-foreground"
                title="إرشاد الأطباء والتدريب الموجّه بالموجات فوق الصوتية"
              />
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                التعليم والتدريب الطبي
              </p>
              <h2 className="mt-4 font-display text-display-md">{doctor.medicalTrainer.program}</h2>
              <p className="mt-6 text-body-lg text-muted-foreground">
                إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا متخصصًا في تقنيات تجميل القضيب لأطباء المسالك البولية وأطباء التجميل من خلال برنامج AndroMax Training.
              </p>
              {doctor.medicalTrainer.programUrl && (
                <a
                  href={doctor.medicalTrainer.programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  زيارة {doctor.medicalTrainer.program}
                </a>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture />
        <Container>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            الخلفية
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">المؤهلات</h2>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctor.credentials.map((item) => (
              <StaggerItem key={item} className="flex items-baseline gap-3">
                <span aria-hidden className="h-px w-4 shrink-0 bg-accent-strong" />
                <span className="text-sm text-muted-foreground">{CREDENTIALS_AR[item] ?? item}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <MediaAppearancesSection locale="ar" />

      {publications.length > 0 && (
        <section className="border-t border-border py-section-y">
          <Container>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              منشورات مختارة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">مساهم وكاتب — مجلة Men&rsquo;s Health إسبانيا</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
              {publications.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group block border-t border-border pt-6"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.outletName}</p>
                  <p className="mt-3 font-display text-lg text-foreground underline decoration-transparent underline-offset-4 group-hover:decoration-accent-strong">
                    {PUBLICATION_LABELS_AR[item.label] ?? item.label}
                  </p>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}

      <PatientFeedbackSection locale="ar" />

      <section className="bg-surface py-section-y">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-display text-display-md text-foreground">
              استشر {doctor.displayName} في {practice.city}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="page-closing-cta" size="lg">احجز استشارة</BookingCta>
            </div>
            <div className="mt-6">
              <PatientReviewsCta locale="ar" />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
```

Note: `item.outletName` ("Men's Health Spain") in the publications `<p className="text-xs uppercase tracking-widest ...">` is English text, so `tracking-widest` is correct there and intentionally kept.

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass.

**Also verify visually** (`npm run dev`, open `http://localhost:3000/ar/about`): this hero uses `order-last w-full lg:order-first` on the portrait column, same as English, combined with `HeroAtmosphere align="right"` above (changed from English's `align="left"`) on the theory that CSS Grid's auto-placement respects `direction`, so `order-first` puts the portrait in grid-track 1, which is the *visual right* under `dir="rtl"` (not the left, the way plain DOM-order reasoning might suggest). Confirm in the actual rendered page that the portrait is on the visual right and the decorative atmosphere plane leans the same way. If the portrait instead renders on the visual left, change `align="right"` to `align="left"` to match — note which one was actually needed in your report, since this same pattern repeats in Task 15.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/about/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/about

Full Arabic mirror of /about — hero, authority strip, recognition,
narrative timeline, flagship feature, medical education, credentials,
publications, patient feedback, closing CTA. Girth Enhancement link
stays temporary EN pending Batch 3.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Build `/ar/mens-health`

Mirrors `src/app/(en)/(marketing)/mens-health/page.tsx`. No `visual.scope` wrapper (English doesn't use one here). Uses `Faq` (already locale-aware from B0) and `RelatedTreatments`/`ClinicalDecisionFlow` (locale-aware). `TreatmentCtaSection`, `EditorialFrame`, `ConsultationPathwayDiagram`, `Container`, `BookingCta` reused exactly as English uses them.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/mens-health/page.tsx`

**Link status:** `/sexual-medicine` and `/male-fertility` → REAL Arabic hrefs (`/ar/sexual-medicine`, `/ar/male-fertility` — both ship in this same batch). `/mens-health/testosterone`, `/erectile-dysfunction` → temporary EN (Batch 2). `/mens-health/vasectomy`, `/book` → temporary EN (Batch 4). `/male-aesthetics/penile-girth-enhancement` → temporary EN (Batch 3).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/mens-health/page.tsx
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { ClinicalDecisionFlow } from "@/components/editorial/ClinicalDecisionFlow";
import { ConsultationPathwayDiagram } from "@/components/illustrations/ConsultationPathwayDiagram";
import { doctor } from "@/config/doctor";
import visual from "@/components/editorial/VisualSystem.module.css";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/mens-health";

export const metadata: Metadata = buildMetadata({
  title: "صحة الرجل",
  description:
    "رعاية متخصصة لصحة الرجل في أبوظبي — تقييم التستوستيرون والصحة الهرمونية، والمجالات ذات الصلة، بشكل فردي قبل النظر في أي علاج.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "صحة الرجل", href: PATH },
];

/** Temporary EN destinations for testosterone/ED/vasectomy — Batch 2/4. sexual-medicine/male-fertility are live Arabic (this batch). */
const areas = [
  {
    label: "التستوستيرون والصحة الهرمونية للرجال",
    description:
      "الأعراض، والتشخيص، ومتى يكون العلاج مناسبًا سريريًا — بما في ذلك انخفاض الرغبة الجنسية، ويُقيَّم إلى جانب العوامل الهرمونية والطبية والنفسية-الجنسية.",
    href: "/mens-health/testosterone",
  },
  {
    label: "ضعف الانتصاب",
    description:
      "تُقيَّم تغيرات الوظيفة الجنسية كجزء من الصورة الهرمونية والأيضية نفسها عند الحاجة.",
    href: "/erectile-dysfunction",
  },
  {
    label: "سرعة القذف ومرض بيروني",
    description:
      "التحكم بالقذف وانحناء القضيب من الأسباب الشائعة الأخرى لاستشارة الطبيب — ويُعالَج كل منهما بنفس النهج المتخصص.",
    href: "/ar/sexual-medicine",
  },
  {
    label: "قطع القناة المنوية بدون مشرط",
    description:
      "نهج طفيف التوغل لمنع الحمل الدائم، مع استشارة منظمة حول التعافي والمخاطر والفحوصات بعد الإجراء.",
    href: "/mens-health/vasectomy",
  },
];

const faqItems = [
  {
    question: "هل يعني كل عرض أن لدي انخفاضًا في التستوستيرون؟",
    answer:
      "لا. قد يرتبط الإرهاق وانخفاض الرغبة الجنسية وضعف الأداء بنقص التستوستيرون، لكن قد تكون لها أسباب أخرى عديدة أيضًا — ينظر التقييم إلى الصورة الكاملة قبل عزو الأعراض إلى سبب واحد.",
  },
  {
    question: "هل سيُعرض عليّ العلاج تلقائيًا؟",
    answer:
      "لا. يُنظر في العلاج فقط بعد تقييم سريري وكيميائي حيوي مناسب، وفقط عند وجود مؤشر واضح له.",
  },
  {
    question: "هل يرتبط ضعف الانتصاب دائمًا بالهرمونات؟",
    answer:
      "ليس دائمًا. قد يكون له أسباب هرمونية أو وعائية أو أيضية أو عصبية أو مرتبطة بالأدوية أو نفسية-جنسية — يحدد التقييم أيها ذو صلة بحالتك تحديدًا.",
  },
];

export default function MensHealthPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      <section className={visual.hero}>
        <HeroAtmosphere align="left" restrained />
        <Container className={`${visual.heroGrid} relative z-10`}>
          <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              صحة الرجل
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">صحة الرجل</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم هرموني وأيضي وجنسي للرجال الذين يعانون من انخفاض
              التستوستيرون، أو انخفاض الرغبة الجنسية، أو الإرهاق، أو
              تغيرات في الوظيفة الجنسية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">احجز استشارة</BookingCta>
            </div>
          </Reveal>
          <div className={visual.physicianIdentity}><p>{doctor.displayName}</p><span>استشاري أمراض المسالك البولية والذكورة · FEBU · أبوظبي</span></div>
          </div>
          <EditorialFrame slot="mensHealthHero" landscape priority />
        </Container>
      </section>

      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-xs uppercase text-muted-foreground">كيف يتم التقييم</p>
              <h2 className="mt-4 font-display text-display-lg">افهم الصورة الكاملة قبل اختيار العلاج.</h2>
              <div className="mt-8"><PullQuote>ليس كل عرض يعني انخفاض التستوستيرون، وليست كل نتيجة منخفضة تستلزم العلاج تلقائيًا.</PullQuote></div>
            </div>
            <div className="bg-surface p-6 lg:p-8">
              <ClinicalDecisionFlow locale="ar" />
              <p className="mt-4 text-sm text-muted-foreground">التقييم الهرموني · العوامل الأيضية / الطبية · الوظيفة الجنسية</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-section-y">
        <Container>
          <div className={visual.split}>
            <div>
              <p className="text-xs uppercase text-muted-foreground">مجالات رعاية مترابطة</p>
              <h2 className="mt-4 font-display text-display-md">الأعراض في سياقها.</h2>
              <p className="mt-6 max-w-md text-sm text-muted-foreground">تُسهم الصحة الجنسية والصحة الهرمونية والخصوبة ومخاوف المسالك البولية/الذكورة في توجيه تقييم مستهدف وخطة علاج فردية.</p>
              <ConsultationPathwayDiagram className="mt-8 h-14 w-full max-w-xs text-muted-foreground" />
              <div className={visual.clinicalAreas}>
                <Link href="/ar/sexual-medicine"><span>01</span>الصحة الجنسية</Link>
                <Link href="/mens-health/testosterone"><span>02</span>الصحة الهرمونية</Link>
                <Link href="/ar/male-fertility"><span>03</span>الخصوبة</Link>
                <Link href="/book"><span>04</span>مخاوف المسالك البولية/الذكورة</Link>
              </div>
            </div>
            <div className="bg-surface p-8">
              {areas.map((area) => <div className="py-6 first:pt-0 last:pb-0" key={area.href}>
                <h3 className="font-display text-2xl"><Link className="underline decoration-border underline-offset-4" href={area.href}>{area.label}</Link></h3>
                <p className="mt-4 text-sm text-muted-foreground">{area.description}</p>
              </div>)}
            </div>
          </div>
        </Container>
      </section>

      <RelatedTreatments locale="ar" items={[{ label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" }]} />

      <Faq items={faqItems} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ بتقييم صحي هرموني"
        sourcePage={PATH}
        bookingLabel="احجز استشارة"
        secondary={{ label: "استكشف التستوستيرون والصحة الهرمونية للرجال", href: "/mens-health/testosterone" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/mens-health/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/mens-health

Links to /ar/sexual-medicine and /ar/male-fertility (both live this
batch); testosterone/ED/vasectomy/book stay temporary EN pending
Batch 2/4.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Build `/ar/sexual-medicine`

Mirrors `src/app/(en)/(marketing)/sexual-medicine/page.tsx`. No `visual.scope` wrapper (English doesn't use one). Uses `Faq`/`RelatedTreatments` (locale-aware), `ConsultationPathwayDiagram`, `StaggerGroup`/`StaggerItem`, `Container`, `BookingCta`, `TreatmentCtaSection` reused as-is.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/sexual-medicine/page.tsx`

**Link status:** all four `areas` targets (`/erectile-dysfunction`, `/sexual-medicine/premature-ejaculation`, `/erectile-dysfunction/penile-doppler`, `/erectile-dysfunction/shockwave-therapy`) → temporary EN. `shockwave-therapy` is not in any of the four batches the owner specified — stays temporary EN indefinitely, same treatment as any other not-yet-scheduled page. `/male-aesthetics/penile-girth-enhancement`, `/mens-health/testosterone` → temporary EN (Batch 3/2).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/sexual-medicine/page.tsx
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import type { Metadata } from "next";
import { ConsultationPathwayDiagram } from "@/components/illustrations/ConsultationPathwayDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/sexual-medicine";

export const metadata: Metadata = buildMetadata({
  title: "الطب الجنسي",
  description:
    "طب جنسي متخصص في أبوظبي — تقييم ضعف الانتصاب وسرعة القذف، ودوبلر القضيب والعلاج بموجات الصدمة، مع علاج يتناسب مع السبب الكامن.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "الطب الجنسي", href: PATH },
];

/** All four temporary EN — Batch 2, and shockwave-therapy is outside all four batches (no scheduled Arabic build). */
const areas = [
  {
    label: "ضعف الانتصاب",
    description: "تقييم يبدأ بالتشخيص، وسلّم علاجي يتناسب مع السبب.",
    href: "/erectile-dysfunction",
  },
  {
    label: "سرعة القذف",
    description: "خيارات سلوكية ونفسية-جنسية وطبية وإجرائية تتناسب مع كل فرد.",
    href: "/sexual-medicine/premature-ejaculation",
  },
  {
    label: "دوبلر القضيب",
    description: "تقييم متقدم بالموجات فوق الصوتية لتدفق الدم في القضيب، عند الحاجة.",
    href: "/erectile-dysfunction/penile-doppler",
  },
  {
    label: "العلاج بموجات الصدمة",
    description: "Li-SWT — أحد الخيارات التي يُنظر فيها لمرضى مختارين، بعد التقييم.",
    href: "/erectile-dysfunction/shockwave-therapy",
  },
];

export default function SexualMedicinePageAr() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              الطب الجنسي
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">الطب الجنسي</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم وعلاج متخصص لضعف الانتصاب وسرعة القذف، يتناسب مع
              السبب الكامن بدلًا من نهج افتراضي واحد.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">احجز استشارة</BookingCta>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ConsultationPathwayDiagram className="mt-14 h-16 w-full max-w-md text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <StaggerGroup className="border-t border-border">
            {areas.map((area, index) => (
              <StaggerItem key={area.href}>
                <Link
                  href={area.href}
                  className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-6 gap-y-2 border-b border-border py-8 sm:grid-cols-[4rem_1fr_1fr] sm:items-center"
                >
                  <span className="font-display text-2xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-2 font-display text-2xl text-foreground sm:col-span-1">
                    {area.label}
                  </span>
                  <span className="col-span-2 max-w-sm text-sm text-muted-foreground sm:col-span-1">
                    {area.description}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/mens-health/testosterone" },
        ]}
      />

      <Faq
        eyebrow="الأسئلة الشائعة"
        heading="الأسئلة الشائعة"
        locale="ar"
        items={[
          {
            question: "من أين أبدأ إذا لم أكن متأكدًا من سبب المشكلة؟",
            answer:
              "بالتقييم. قد يكون لضعف الانتصاب وسرعة القذف عدة أسباب مساهمة، ويتناسب العلاج مع ما يُكتشف فعليًا — وليس افتراضًا من الأعراض وحدها.",
          },
          {
            question: "هل دوبلر القضيب مطلوب دائمًا؟",
            answer:
              "لا. يُستخدم عندما يلزم تقييم سبب وعائي تحديدًا، وليس كخطوة روتينية لكل مريض.",
          },
          {
            question: "هل العلاج بموجات الصدمة خيار علاجي أول؟",
            answer:
              "لا. هو أحد الخيارات التي قد يُنظر فيها لمرضى مختارين بعد التقييم، وليس نقطة بداية قائمة بذاتها.",
          },
          {
            question: "هل تعالجون سرعة القذف أيضًا، وليس فقط ضعف الانتصاب؟",
            answer:
              "نعم. تُقيَّم سرعة القذف بنفس النهج المتخصص، مع مراعاة الخيارات السلوكية والنفسية-الجنسية والطبية — والإجرائية في حالات مختارة.",
            readMoreHref: "/sexual-medicine/premature-ejaculation",
            readMoreLabel: "استكشف سرعة القذف",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="ابدأ بالتقييم، لا بالافتراض"
        sourcePage={PATH}
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/erectile-dysfunction" }}
        bookingLabel="احجز استشارتك السرية"
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Confirm `Faq`'s `FaqItem` type accepts `readMoreHref`/`readMoreLabel` (it does, per `src/components/ui/Faq.tsx`).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/sexual-medicine/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/sexual-medicine

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Build `/ar/male-aesthetics`

Mirrors `src/app/(en)/(marketing)/male-aesthetics/page.tsx`. Uses `visual.scope` (English does too — has `.section-dark`/`.section-olive`). Uses `AuthorityBlock`, `RelatedTreatments`, `Faq` (locale-aware), `SectionHeading` (locale-aware from B0), `TonalSection`, `EditorialFrame`, `ContourPlanningDiagram`, `Button`, `Container`, `BookingCta`, `TreatmentCtaSection` reused as-is.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/male-aesthetics/page.tsx`

**Link status:** `/about` → REAL (`/ar/about`, live this batch). `/male-aesthetics/penile-girth-enhancement`, `/male-aesthetics/scrotal-lift`, `/male-aesthetics/penile-filler-correction` → temporary EN (Batch 3). `/peyronies-disease` → temporary EN (Batch 2).

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/male-aesthetics/page.tsx
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { ContourPlanningDiagram } from "@/components/illustrations/ContourPlanningDiagram";
import { Button } from "@/components/ui/Button";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TonalSection } from "@/components/ui/TonalSection";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-aesthetics";

export const metadata: Metadata = buildMetadata({
  title: "التجميل الذكوري",
  description:
    "تقييم متخصص في طب المسالك البولية والذكورة في أبوظبي للرجال الذين يفكرون في تجميل القضيب أو تصحيح علاج سابق — بنهج قائم على التشريح وتحت إشراف طبي. الإجراء الرائد: زيادة سماكة القضيب بحمض الهيالورونيك.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: PATH },
];

const girthAuthorityLineAr = [
  doctor.girthProcedureCount !== undefined && `${doctor.girthProcedureCount} إجراء منجز`,
  doctor.girthEnhancementSince !== undefined && `خبرة منذ ${doctor.girthEnhancementSince}`,
]
  .filter((part): part is string => Boolean(part))
  .join("، ");

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

const faqItems = [
  {
    question: "هل هذا مماثل لعلاج الحشو التجميلي العام؟",
    answer:
      "لا. يُعالَج التجميل الذكوري ضمن سياق طب الذكورة والمسالك البولية، مع تقييم تشريحي وطبي كامل — وليس إجراءً تجميليًا عامًا بلا موعد مسبق.",
  },
  {
    question: "ماذا لو خضعت لحقن حشو في مكان آخر ولم أكن راضيًا عن النتيجة؟",
    answer:
      "تُقيَّم مشكلات الحشو السابقة — بما في ذلك عدم التناسق أو العقيدات أو عدم الانتظام — فرديًا، مع النظر في التصحيح عند الحاجة.",
  },
  {
    question: "هل تتوفر خيارات جراحية؟",
    answer:
      "يُنظر في الخيارات الجراحية فقط عند الحاجة والموافقة عليها، وتُناقش فرديًا أثناء الاستشارة — وليست خيارًا افتراضيًا. شد الصفن، للرجال الذين يعانون من زيادة أو ترهل في جلد الصفن، هو أحد هذه الخيارات الجراحية.",
  },
  {
    question: "هل يمكن ضمان نتيجة محددة؟",
    answer:
      "لا يمكن ضمان أي نتيجة محددة. تختلف النتائج الفردية، وتُناقش التوقعات الواقعية بالتفصيل كجزء من التقييم.",
  },
  {
    question: "كيف تبدأ العملية؟",
    answer:
      "تبدأ العملية باستشارة طبية لتقييم التشريح والأهداف والملاءمة قبل مناقشة أي خيار بشكل أعمق.",
  },
];

export default function MaleAestheticsPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" }),
          medicalWebPageSchema(
            {
              name: "التجميل الذكوري",
              description:
                "تقييم متخصص في طب المسالك البولية والذكورة للرجال الذين يفكرون في تجميل القضيب أو تصحيح علاج سابق.",
              path: PATH,
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <EditorialField className="py-14">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first">
            <EditorialFrame slot="aestheticsHero" landscape priority />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                التجميل الذكوري · أبوظبي
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                التجميل الذكوري
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
                رعاية تجميلية للقضيب والصفن بإشراف استشاري، تجمع بين
                تشريح متخصص في المسالك البولية، وخبرة إجرائية، وتخطيط
                علاج فردي.
              </p>
              <Link href="/male-aesthetics/penile-girth-enhancement" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">استكشف زيادة سماكة القضيب</Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="male_aesthetics" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
              </div>
            </Reveal>
          <div className={visual.physicianIdentity}><p>{doctor.displayName}</p><span>استشاري أمراض المسالك البولية والذكورة</span></div>
          </div>
        </Container>
      </EditorialField>

      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.6fr] lg:items-center lg:gap-16">
          <div>
          <SectionHeading eyebrow="الإجراء الرائد" heading="زيادة سماكة القضيب" size="xl" locale="ar" />
          <div className="my-8"><AuthorityBlock locale="ar" /></div>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              الإجراء الرائد في هذه الممارسة، والهدف الأكثر شيوعًا الذي
              يُطرح في الاستشارة. تكبير القضيب بحمض الهيالورونيك هو نقطة
              البداية الأكثر مناقشة، ويُخطَّط وفق التشريح الفردي — وليس
              إجراءً تجميليًا بلا موعد مسبق — مع النظر في الخيارات
              الجراحية فقط عند الحاجة.
              {girthAuthorityLineAr ? ` يتمتع د. مولينا بـ${girthAuthorityLineAr}.` : ""}
            </p>
            <Button asChild size="lg" className="mt-8"><Link href="/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link></Button>
          </Reveal>
          </div>
          <Reveal delay={0.1} className="hidden justify-self-center lg:flex">
            <ContourPlanningDiagram className="h-40 w-40 text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      <TonalSection tone="warm" className="border-t border-border">
        <Container>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            متوفر أيضًا
          </p>
          <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-12 pt-10 md:grid-cols-2">
            {secondaryAreas.map((area) => (
              <Reveal key={area.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-xl text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <Link
                  href={area.cta.href}
                  className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4 hover:decoration-accent"
                >
                  {area.cta.label}
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </TonalSection>

      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              لماذا يهم التقييم المتخصص
            </p>
            <p className="mt-6 text-body-lg text-foreground">
              يختلف تشريح القضيب بشكل كبير بين الأفراد. العلاج المخطَّط
              له دون تقييم تشريحي وطبي مناسب يحمل خطرًا أكبر لعدم
              التناسق أو عدم الانتظام أو عدم الرضا.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "التشريح",
                "خصائص الأنسجة",
                "العلاجات السابقة",
                "الأهداف",
                "المخاطر",
                "خيارات التصحيح",
                "المتابعة",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              كما هو الحال مع أي إجراء تجميلي أو تكبيري، تختلف النتائج
              الفردية ولا يمكن ضمانها. تعتمد المخاطر على النهج المحدد
              الذي يُنظر فيه، وتُستعرض بالتفصيل أثناء الاستشارة إلى جانب
              التوقعات الواقعية.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              نبذة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {doctor.displayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">استشاري أمراض المسالك البولية والذكورة</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يُجرى التجميل الذكوري في هذه الممارسة ضمن ممارسة استشاري
              أمراض المسالك البولية والذكورة
              {doctor.girthEnhancementSince !== undefined &&
                `، بخبرة في زيادة سماكة القضيب منذ ${doctor.girthEnhancementSince}`}
              .
            </p>
            <Link
              href="/ar/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              نبذة عن {doctor.displayName}
            </Link>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "شد الصفن", href: "/male-aesthetics/scrotal-lift" },
          { label: "تصحيح حشو القضيب", href: "/male-aesthetics/penile-filler-correction" },
          { label: "مرض بيروني", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ باستشارة طبية"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{
          label: "استكشف زيادة سماكة القضيب",
          href: "/male-aesthetics/penile-girth-enhancement",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass. Confirm `SectionHeading`'s `locale` prop is accepted with `size="xl"` (both already exist independently on the component from B0/earlier).

**Also verify visually** (`npm run dev`, open `http://localhost:3000/ar/male-aesthetics`): same `order-last w-full lg:order-first` + `HeroAtmosphere align="right"` pattern as Task 12's `/ar/about`. Check Task 12's report for which `align` value it found actually correct for that page's identical pattern, and use the same value here unless this page's own rendering disagrees — if it does, note the discrepancy rather than silently picking one.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/male-aesthetics/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/male-aesthetics

Links to /ar/about (live this batch); the three procedure pages and
Peyronie's stay temporary EN pending Batch 2/3.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Build `/ar/male-fertility`

Mirrors `src/app/(en)/(marketing)/male-fertility/page.tsx`. No `visual.scope` wrapper (English doesn't use one, even though it has one `.section-olive` band — English relies on the global, non-`.scope`-refined palette for that class, and this page must match that exactly, not force-wrap it). Uses `SectionHeading` (locale-aware), `RelatedTreatments`/`Faq` (locale-aware), `StaggerGroup`/`StaggerItem`, `Container`, `BookingCta`, `TreatmentCtaSection` reused as-is.

**Files:**
- Create: `src/app/(ar)/ar/(marketing)/male-fertility/page.tsx`

**Link status:** `/male-fertility/varicocele`, `/mens-health/testosterone` → temporary EN (Batch 2). `/insights` → stays English indefinitely (explicitly out of scope), labeled to make that clear rather than presented as a seamless destination.

- [ ] **Step 1: Create the page**

```tsx
// src/app/(ar)/ar/(marketing)/male-fertility/page.tsx
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-fertility";

export const metadata: Metadata = buildMetadata({
  title: "خصوبة الرجل",
  description:
    "تقييم متخصص لخصوبة الرجل في أبوظبي — التاريخ المرضي، وتحليل السائل المنوي، والتقييم الهرموني، والتصوير، لتحديد العوامل المساهمة قبل النظر في أي علاج.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "خصوبة الرجل", href: PATH },
];

const historyExam = [
  "التاريخ الإنجابي — بما في ذلك مدة محاولة الإنجاب والتاريخ المرضي ذو الصلة",
  "الفحص السريري",
];

const labsImaging = [
  "تحليل السائل المنوي",
  "التقييم الهرموني",
  "الموجات فوق الصوتية، عند الحاجة",
];

/** varicocele stays temporary EN — ships Batch 2. */
const findings = [
  { label: "دوالي الخصية", href: "/male-fertility/varicocele" },
  { label: "معايير غير طبيعية للسائل المنوي", href: undefined },
  { label: "العقم بعامل الذكور", href: undefined },
  { label: "تجزؤ الحمض النووي للحيوانات المنوية، عند الحاجة السريرية", href: undefined },
];

const contributors = [
  {
    title: "نمط الحياة والأيض",
    description:
      "يمكن أن يؤثر الوزن ومستوى النشاط والتدخين والكحول والصحة الأيضية على معايير السائل المنوي والتوازن الهرموني.",
  },
  {
    title: "الأدوية والهرمونات",
    description:
      "قد تؤثر بعض الأدوية والاختلالات الهرمونية — بما في ذلك العوامل المرتبطة بالتستوستيرون — على الخصوبة، وتُراجَع كجزء من التقييم.",
  },
];

const faqItems = [
  {
    question: "هل يعني تحليل السائل المنوي غير الطبيعي أنني بحاجة إلى علاج؟",
    answer:
      "ليس بالضرورة. تُفسَّر النتائج كجزء من تقييم شامل — التاريخ المرضي، والفحص، والتقييم الهرموني، والتصوير عند الحاجة — وليس من نتيجة فحص واحدة بمعزل عن غيرها.",
  },
  {
    question: "ماذا لو تم اكتشاف دوالي خصية بالموجات فوق الصوتية؟",
    answer:
      "لا تتطلب كل دوالي خصية تُكتشف بالتصوير علاجًا. تُقيَّم أهميتها بالنسبة للخصوبة ووظيفة الخصية بشكل فردي.",
  },
  {
    question: "هل سأحتاج إلى جراحة؟",
    answer:
      "معظم الرجال لا يحتاجون إلى ذلك. عندما يكون خيار جراحي مثل إصلاح دوالي الخصية مناسبًا سريريًا، يُنظر فيه كجزء من تقييم أوسع. تُعالَج بعض أسباب العقم من خلال علاج إنجابي إضافي — بما في ذلك الاستخراج الجراحي للحيوانات المنوية في حالات مختارة — وهو أمر يقع خارج نطاق خدمات هذه الممارسة ويُنسَّق مع فرق الإنجاب المساعد عند الحاجة.",
  },
  {
    question: "هل تتعاونون مع عيادات الخصوبة؟",
    answer:
      "لا توجد شراكة رسمية مع عيادة خصوبة أو مركز أطفال أنابيب محدد. عند صلة الإنجاب المساعد بالحالة، يدعم التقييم والنتائج رعاية الخصوبة متعددة التخصصات — بالتنسيق مع فرق الإنجاب المساعد عند الحاجة.",
  },
];

export default function MaleFertilityPageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" }),
          medicalWebPageSchema(
            {
              name: "خصوبة الرجل",
              description:
                "تقييم متخصص لخصوبة الرجل، يجمع بين التاريخ المرضي والفحص السريري وتحليل السائل المنوي والتقييم الهرموني لتحديد العوامل المساهمة.",
              path: PATH,
              aboutType: "MedicalCondition",
              /** Kept in English — a schema.org machine-readable taxonomy field, not visible page copy. */
              aboutName: "Male Infertility",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              خصوبة الرجل
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              خصوبة الرجل
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم متخصص يجمع بين التاريخ المرضي والفحص السريري
              وتحليل السائل المنوي والتقييم الهرموني لتحديد العوامل
              المساهمة وتوجيه الخطوات التالية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="fertility" size="lg">
                احجز استشارة خصوبة الرجل
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="كيف يتم التقييم" heading="التاريخ والفحص، والمختبر والتصوير" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                التاريخ والفحص
              </p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6">
                {historyExam.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                المختبر والتصوير
              </p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6">
                {labsImaging.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="النتائج الشائعة" heading="ما قد يكشفه التقييم" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {findings.map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-wrap items-center justify-between gap-4 py-6">
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {item.label}
                  </span>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                    >
                      معرفة المزيد
                    </Link>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {contributors.map((item) => (
            <Reveal key={item.title}>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                العوامل المساهمة
              </p>
              <h2 className="mt-4 font-display text-display-md text-foreground">{item.title}</h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              ما بعد التقييم
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              الحفاظ على الخصوبة والرعاية التعاونية.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              عند الحاجة، تُناقَش إمكانية الحفاظ على الخصوبة كجزء من
              ظروفك الفردية. يدعم التقييم رعاية الخصوبة متعددة
              التخصصات، بالتنسيق مع فرق الإنجاب المساعد عند الحاجة —
              دون وجود شراكة رسمية مع عيادة أو مركز محدد. يُعدّ العلاج
              الإنجابي الإضافي، بما في ذلك الاستخراج الجراحي للحيوانات
              المنوية، خيارًا معترفًا به ضمن طب الإنجاب لتشخيصات
              مختارة؛ وعند صلته بفهم مسارك العلاجي، تُناقَش هذه الخيارات
              لأغراض تثقيفية، رغم أنها ليست خدمة تُقدَّم مباشرة هنا. لا
              تتطلب كل نتيجة فحص غير طبيعية علاجًا؛ إذ تُفسَّر النتائج
              دائمًا كجزء من تقييم شامل.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "دوالي الخصية", href: "/male-fertility/varicocele" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/mens-health/testosterone" },
          { label: "المقالات الطبية (بالإنجليزية)", href: "/insights" },
        ]}
      />

      <Faq items={faqItems} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />

      <TreatmentCtaSection heading="ابدأ بتقييم الخصوبة" sourcePage={PATH} bookingLabel="احجز استشارة" />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck` — must pass.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(ar)/ar/(marketing)/male-fertility/page.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): add /ar/male-fertility

Insights link explicitly labeled as English-language content per spec
§1 — no fake /ar/insights route implied.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Register `arPath` for all five Batch 1 routes; update `/ar` homepage's links to them

Once `arPath` is set, `getLocalizedPathPair`/`buildMetadata`/`sitemap.ts`/`LanguageSwitcher` automatically wire hreflang, canonical, sitemap entries, and the switcher for both the English and Arabic side of each pair — confirmed by reading those functions directly (architecture spec §3). No other code changes needed for that part. This task also updates the Arabic homepage's own internal links that currently point to these five pages' English URLs (added in R9 Phase B0), flipping them to the new Arabic routes, per the owner's explicit "do not leave English destinations once an Arabic equivalent is available" instruction.

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/components/sections/ar/AboutSectionAr.tsx`
- Modify: `src/components/sections/ar/CoreExpertiseSectionAr.tsx`
- Modify: `src/components/sections/ar/SexualHormonalHealthSectionAr.tsx`

- [ ] **Step 1: Set `arPath` on the five routes**

In `src/lib/seo/routes.ts`, add `arPath` to these five existing entries (do not change anything else about them):

```ts
{ path: "/about", status: "live", priority: 0.7, arPath: "/ar/about" },
```
```ts
{ path: "/mens-health", status: "live", priority: 0.8, arPath: "/ar/mens-health" },
```
```ts
{ path: "/sexual-medicine", status: "live", priority: 0.7, arPath: "/ar/sexual-medicine" },
```
```ts
{ path: "/male-aesthetics", status: "live", priority: 0.9, arPath: "/ar/male-aesthetics" },
```
```ts
{ path: "/male-fertility", status: "live", priority: 0.7, arPath: "/ar/male-fertility" },
```

- [ ] **Step 2: Update `AboutSectionAr.tsx`'s "تعرّف على د. مولينا" link**

This component (from R9 Phase B0) links to `/about` as a documented temporary destination. Change its `href` from `/about` to `/ar/about`, and remove the "Temporary EN destination" comment above it (it's real now).

- [ ] **Step 3: Update `CoreExpertiseSectionAr.tsx`'s links**

This component (from R9 Phase B0) has a `primaryAreas` entry for "التستوستيرون والصحة الهرمونية للرجال" targeting `/mens-health/testosterone` (stays temporary EN — Batch 2, not this batch) — do not change that one. It does NOT currently link to `/male-aesthetics` or `/sexual-medicine`/`/male-fertility` directly (check the file — if it does, update those specifically to their new `/ar/...` equivalents; if it only links to sub-pages not in this batch, no change needed here). Read the file first and only change hrefs whose target is one of this batch's five routes.

- [ ] **Step 4: Update `SexualHormonalHealthSectionAr.tsx`'s links**

This component (from R9 Phase B0) links "استكشف الصحة الهرمونية للرجال" to `/mens-health/testosterone` (stays temporary EN — Batch 2, not this batch) — do not change that one. Read the file to confirm neither of its two links targets one of this batch's five routes (`/about`, `/mens-health`, `/sexual-medicine`, `/male-aesthetics`, `/male-fertility` themselves, as opposed to their sub-pages) — if neither does, this file needs no change; report that in your commit/report rather than making a no-op edit.

- [ ] **Step 5: Grep for any other B0 Arabic homepage component linking to these five paths**

Run: `grep -rln '"/about"\|"/mens-health"\|"/sexual-medicine"\|"/male-aesthetics"\|"/male-fertility"' src/components/sections/ar` — this must only match exact-path links to the hub pages themselves (not their sub-pages, e.g. `/male-aesthetics/penile-girth-enhancement` should NOT match a bare `"/male-aesthetics"` grep pattern — check each match carefully). Update any other file the grep surfaces the same way as Steps 2–4, following the same "hub page only, sub-pages stay temporary EN" rule.

- [ ] **Step 6: Verify**

Run: `npm run typecheck` — must pass. Run: `npm run build` — must succeed; confirm all five new `/ar/*` routes and their English counterparts appear in the build's route list. Run: `npm run dev`, open `http://localhost:3000/about` (or any of the five English pages) and confirm العربية now appears in the language switcher, linking to the correct `/ar/...` path — this is the first real end-to-end proof the `arPath` wiring works, not just a code read. Open `http://localhost:3000/ar` and confirm the updated links (from Steps 2–5) now go to real Arabic pages instead of English ones.

- [ ] **Step 7: Commit**

```bash
git add src/lib/seo/routes.ts "src/components/sections/ar/AboutSectionAr.tsx" "src/components/sections/ar/CoreExpertiseSectionAr.tsx" "src/components/sections/ar/SexualHormonalHealthSectionAr.tsx"
git commit -m "$(cat <<'EOF'
feat(r9-b): register arPath for Batch 1 routes; flip homepage links to Arabic

Sets arPath on /about, /mens-health, /sexual-medicine, /male-aesthetics,
/male-fertility — this alone wires the language switcher, reciprocal
hreflang, and sitemap entries for all five (buildMetadata/sitemap.ts/
LanguageSwitcher already derive everything from this field). Updates
the /ar homepage's own links to these five pages, previously temporary
English destinations from Phase B0, now that real Arabic pages exist.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 18: Seed `docs/arabic-medical-glossary.md`

**Files:**
- Create: `docs/arabic-medical-glossary.md`

- [ ] **Step 1: Create the glossary, seeded from every recurring term in Batch 1**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/arabic-medical-glossary.md
git commit -m "$(cat <<'EOF'
docs(r9-b): seed Arabic medical glossary with Batch 1 terms

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 19: Full-suite verification

**Files:** none (verification only).

- [ ] **Step 1: Typecheck** — `npm run typecheck`, must pass.
- [ ] **Step 2: Lint** — `npm run lint`, must pass. Fix anything it flags in files this plan touched; leave pre-existing issues elsewhere untouched.
- [ ] **Step 3: Tests** — `npm run test`, all 18/146 must still pass (regression guard only, this plan added no new tests by design).
- [ ] **Step 4: Build** — `npm run build`, must succeed; confirm all five new `/ar/*` routes and their English counterparts appear in the route table.
- [ ] **Step 5: Commit only if fixes were needed** (no empty commit otherwise):

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(r9-b): address lint/typecheck/build findings from Batch 1 review

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 20: Responsive QA — Batch 1

Same method as B0's Task 18: Playwright screenshots at 390/768/1024/1440 for each of the 5 English/Arabic pairs if the browser tool is available; otherwise the same structural/source-based substitute (curl SSR HTML, HTTP status on image URLs, source diffing), explicitly disclosed as such — never presented as pixel-level confirmation.

**Files:**
- Create: `qa/r9-phase-b-batch1/` (screenshots or the structural-method writeup)
- Modify: `docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md` (append a short Batch 1 completion note, not a new exit-criteria section — that lives in the final route-by-route matrix after Batch 4)

- [ ] **Step 1: Start the dev server** (or reuse one already running for this worktree).
- [ ] **Step 2: For each of the 5 pairs** (`/about`↔`/ar/about`, `/mens-health`↔`/ar/mens-health`, `/sexual-medicine`↔`/ar/sexual-medicine`, `/male-aesthetics`↔`/ar/male-aesthetics`, `/male-fertility`↔`/ar/male-fertility`) at each of the 4 breakpoints: capture screenshots (or the structural equivalent) and check: comparable content completeness (every section present), images load, no horizontal overflow, RTL mirroring correct (Breadcrumb chevron direction, `AuthorityBlock`'s text alignment on `/male-aesthetics`), dark/olive sections render with correct colors where the page uses them, English pages show zero visual regression from before this batch.
- [ ] **Step 3: Record findings.** If anything fails, fix it (new task or amend the relevant task's file) before marking it done — do not silently ship a known defect.
- [ ] **Step 4: Commit**

```bash
git add qa/r9-phase-b-batch1/ docs/superpowers/specs/2026-09-13-r9-phase-b-architecture-spec.md
git commit -m "$(cat <<'EOF'
docs(r9-b): responsive QA for Batch 1 (core hubs)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

Do not push, deploy, or open/update a PR after this task — per the owner's explicit instruction, that happens once after Batch 4. Report Batch 1 complete and ready for the next batch.
