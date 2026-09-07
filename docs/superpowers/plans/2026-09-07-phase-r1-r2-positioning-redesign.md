# Phase R1-R2 — Positioning, UX/UI & Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the confirmed P0 launch blockers (live placeholder text, cookie-banner CTA overlap, three content bugs), then evolve the site's global design system and its highest-value pages so visual hierarchy actually agrees with the stated positioning: Dr. Alejandro Molina, Consultant Urologist & Andrologist, flagship Penile Girth Enhancement.

**Architecture:** Pure evolution of the existing Next.js/Tailwind v4 codebase — no new routes, no framework change, no rebuild. Homepage section count drops from 13 to 10 by merging four thin/overlapping sections into two new ones and dropping two redundant ones; three new small shared components are added (`AuthorityBlock`, `SexualHormonalHealthSection`, `AdvancedPenileSurgerySection`, `MedicalTrainingSection`); `ImagePlaceholder` stops rendering visible caption text; the cookie banner reserves layout space instead of overlapping content.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS 4, Radix UI, `motion`. Verification convention (no test runner configured): `tsc --noEmit` + `eslint` + `next build` + real-browser QA via Playwright, per established project convention.

**Spec:** The user's "PHASE R1-R2" prompt (25 numbered items + P0 fixes + QA + docs), built directly on `POSITIONING_UX_COPY_AUDIT.md` and `POSITIONING_UX_REDESIGN_PLAN.md`.

## Global Constraints

- No new routes. No route in `src/lib/seo/routes.ts` changes.
- `features.prpPage` stays `false`. `doctor.awards[].publishReady` stays `false`. Neither is touched.
- `practice.bookingUrl` / `practice.physicianProfileUrl` are never edited.
- No invented photography — every `ImagePlaceholder` usage keeps its clean visual surface; only the *visible caption text* is removed, moved to `MEDIA_REQUIREMENTS.md`.
- Do not fabricate new authority stats — only `doctor.ts`'s existing confirmed fields (`yearsOfExperience`, `girthProcedureCount`, `girthEnhancementSince`, `medicalTrainer`) may be surfaced.
- "Book a Confidential Consultation" is used as the primary CTA label only on pages dealing directly with genital/sexual anatomy or intimate conditions: Male Aesthetics hub, Penile Girth Enhancement, Penile Filler Correction (already has it), Scrotal Lift, Peyronie's Disease, Erectile Dysfunction + its two sub-pages, Penile Implant. Every other page keeps "Book a Consultation".
- Every task ends with `npx tsc --noEmit && npm run lint && npm run build` passing clean before commit — same convention as Phase C.

---

## PART A — P0 LAUNCH BLOCKERS

### Task A1: Stop rendering `ImagePlaceholder` caption text as visible copy

**Files:**
- Modify: `src/components/ui/ImagePlaceholder.tsx`
- Modify (caller sites, swap `caption` for a short `aria-label` only): `src/components/sections/HeroSection.tsx`, `src/components/sections/AboutSection.tsx`, `src/components/sections/MaleAestheticsSection.tsx` (deleted in Task B-Home, so skip if that task lands first), `src/app/(marketing)/about/page.tsx`, `src/app/(marketing)/male-aesthetics/page.tsx`, `src/app/(marketing)/penile-implant/page.tsx`
- Modify: `MEDIA_REQUIREMENTS.md` (confirmation note only — the detailed per-slot captions already documented there become the sole source of truth)

- [ ] **Step 1: Rewrite `ImagePlaceholder`**

```tsx
/**
 * Art-directed neutral placeholder for image-dependent sections (spec
 * §18: clearly labelled as a surface, never generic stock imagery, no
 * invented photographs of Dr. Molina). Renders no visible instruction
 * text — full per-slot photography intent lives in
 * MEDIA_REQUIREMENTS.md, not on the live page (Phase R1-R2 P0 fix).
 * `label` is a short, generic accessibility string only (e.g.
 * "Portrait of Dr. Alejandro Molina, photography pending") — never the
 * detailed internal brief.
 */
export function ImagePlaceholder({
  label,
  index,
  className,
}: {
  label: string;
  index?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative h-full w-full border border-border bg-surface ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-border) 0px, var(--color-border) 1px, transparent 1px, transparent 28px)",
      }}
    >
      {index && (
        <span className="absolute left-6 top-6 font-display text-sm text-accent-strong">
          {index}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update every caller to pass a short `label` instead of the old detailed `caption`**

`HeroSection.tsx`: `<ImagePlaceholder index="01" label="Portrait of Dr. Alejandro Molina" />` (drop the `doctor.profileImage.alt` wiring here — replace with this static short string; `doctor.profileImage.alt` remains the field a real `next/image` will eventually use).

`AboutSection.tsx`: `<ImagePlaceholder index={doctor.displayName} label="Portrait of Dr. Alejandro Molina" />`

`about/page.tsx`: same as above.

`male-aesthetics/page.tsx`: `<ImagePlaceholder index="§13" label="Editorial imagery pending" />`

`penile-implant/page.tsx`: `<ImagePlaceholder index="§8" label="Medical diagram pending" />`

(`MaleAestheticsSection.tsx`'s own usage is removed entirely in Task B1 since the component is deleted — do not update it if B1 has already landed.)

- [ ] **Step 3: Add a confirmation note to `MEDIA_REQUIREMENTS.md`**

At the top, under the existing intro paragraph, add: "As of Phase R1-R2, the detailed per-slot descriptions in this document are the **only** place this photography intent is written down — `ImagePlaceholder` no longer renders any caption text on the live site, only a short generic accessibility label and the visual surface itself."

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`. Then grep the rendered HTML of `/`, `/about`, `/male-aesthetics`, `/penile-implant` for the old caption strings ("no genital close-ups", "pending photography", "Photography/diagram pending") — expect zero matches.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ImagePlaceholder.tsx MEDIA_REQUIREMENTS.md
git commit -m "fix(placeholder): stop rendering internal photography briefs as visible page copy"
```

(Caller-site changes get committed together with whichever task touches that file next, since several are rewritten wholesale in later tasks — see Task notes below for which caller edits ride along with which commit.)

---

### Task A2: Fix cookie banner overlapping page content

**Files:**
- Modify: `src/components/ui/ConsentBanner.tsx`
- Modify: `src/app/globals.css`

**Problem:** confirmed via DOM measurement in the audit — the fixed-position banner overlaps whatever content occupies the bottom ~109–201px of the viewport, including the hero CTA on mobile at first paint.

**Solution:** the banner measures its own real rendered height and writes it to a CSS custom property; `body` reserves that much bottom padding while the banner is visible, so content is pushed up above it rather than being covered — no dark pattern, no shrinking of the legally-required text, works at any viewport/font-size without guessing pixel values.

- [ ] **Step 1: Add height-reporting to `ConsentBanner`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getConsent, setConsent } from "@/lib/analytics/consent";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Button } from "@/components/ui/Button";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getConsent() === "unset");
  }, []);

  // Reserve exactly as much bottom space as the banner actually
  // occupies, so it pushes page content up instead of covering it —
  // fixes the confirmed mobile hero-CTA overlap (Phase R1-R2 P0 fix).
  useEffect(() => {
    const root = document.documentElement;
    if (!visible || !bannerRef.current) {
      root.style.setProperty("--consent-banner-space", "0px");
      return;
    }
    const el = bannerRef.current;
    const updateSpace = () => {
      root.style.setProperty("--consent-banner-space", `${el.offsetHeight}px`);
    };
    updateSpace();
    const observer = new ResizeObserver(updateSpace);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.setProperty("--consent-banner-space", "0px");
    };
  }, [visible]);

  if (!visible) return null;

  function choose(status: "granted" | "denied") {
    setConsent(status);
    setVisible(false);
  }

  return (
    <div
      ref={bannerRef}
      role="region"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background"
    >
      <div className="mx-auto flex w-full max-w-editorial flex-col gap-4 px-gutter py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          This site may use analytics cookies to understand how
          visitors use it. No health or symptom information is ever
          included. You can accept or decline, and change your choice
          anytime — see our{" "}
          <Link
            href="/privacy"
            className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="sm" onClick={() => choose("denied")}>
            Decline
          </Button>
          <Button variant="secondary" size="sm" onClick={() => choose("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Reserve the space in `globals.css`**

In the existing `body` rule inside `@layer base`, add:

```css
  body {
    background: var(--color-background);
    color: var(--color-foreground);
    padding-bottom: var(--consent-banner-space, 0px);
    transition: padding-bottom 200ms var(--ease-soft);
  }
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`. Then browser-check at 390×844 with `localStorage` cleared: confirm the hero "Book a Confidential Consultation"/"Book a Consultation" button sits fully above the banner, not behind it (re-run the exact DOM-rect overlap check used in the original audit — expect `overlap: false`).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ConsentBanner.tsx src/app/globals.css
git commit -m "fix(consent-banner): reserve layout space instead of overlapping page content"
```

---

### Task A3: Fix the three confirmed content/metadata bugs

**Files:**
- Modify: `src/components/sections/AboutSection.tsx`
- Modify: `src/app/(marketing)/about/page.tsx`

- [ ] **Step 1: Fix the FEBU exact-match bug**

In `AboutSection.tsx`, change:
```ts
const highlightLabels = [
  "Hospital Clínic Barcelona training",
  "European Board of Urology",
  "Advanced laparoscopic surgery",
  "Practicing in the United Arab Emirates",
];
```
to:
```ts
const highlightLabels = [
  "Hospital Clínic Barcelona training",
  "FEBU — Fellow of the European Board of Urology",
  "Advanced laparoscopic surgery",
  "Practicing in the United Arab Emirates",
];
```

- [ ] **Step 2: Fix the duplicate "Alongside" sentence**

In `about/page.tsx`'s `narrative` array, the 5th entry's `body` currently reads:
```ts
"Alongside clinical practice, Dr. Molina has maintained academic and teaching involvement, reflecting an ongoing commitment to the field beyond individual patient care." +
      (doctor.medicalTrainer?.description ? ` ${doctor.medicalTrainer.description}` : ""),
```
Change the leading sentence to:
```ts
"Dr. Molina has maintained academic and teaching involvement throughout his clinical career, reflecting a commitment to the field beyond individual patient care." +
      (doctor.medicalTrainer?.description ? ` ${doctor.medicalTrainer.description}` : ""),
```
(`doctor.medicalTrainer.description` itself already starts with "Alongside his clinical practice, Dr. Molina provides..." — leaving that field untouched, since it's shared with the homepage's new Medical Training section and the About page's own Medical Education section; only the narrative row's own leading sentence changes.)

- [ ] **Step 3: Fix the duplicate page title**

Change:
```ts
export const metadata: Metadata = buildMetadata({
  title: "About Dr. Alejandro Molina",
```
to:
```ts
export const metadata: Metadata = buildMetadata({
  title: "About",
```
(The sitewide template already appends `| Dr. Alejandro Molina`, so the rendered title becomes "About | Dr. Alejandro Molina" instead of the doubled "About Dr. Alejandro Molina | Dr. Alejandro Molina".)

- [ ] **Step 4: Fix the dead "Low Libido" link on the Men's Health hub**

Covered in Task C2 (Men's Health hub rewrite) since that page is rewritten wholesale there — not a separate edit here.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check `/about`: confirm FEBU now appears in the homepage About teaser's highlight row, confirm the teaching-row paragraph no longer opens two sentences with "Alongside", confirm the browser tab title reads "About | Dr. Alejandro Molina".

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/AboutSection.tsx "src/app/(marketing)/about/page.tsx"
git commit -m "fix: FEBU credential exact-match, duplicate About narrative sentence, duplicate About title"
```

---

## PART B — PHASE R1: GLOBAL SYSTEM

### Task B1: Homepage — hero rewrite, flagship/implant hierarchy swap, section consolidation (13 → 10 sections)

This is the largest single task in the plan. It covers items 8, 9, 10, 11 together since they all touch `src/app/(marketing)/page.tsx` and its section components as one coherent change.

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/FeaturedProcedureSection.tsx` (light → dark, flagship treatment)
- Create: `src/components/sections/SexualHormonalHealthSection.tsx` (merges `ErectileDysfunctionSection` + `TestosteroneSection`)
- Create: `src/components/sections/AdvancedPenileSurgerySection.tsx` (merges `PenileImplantSection` + `AdvancedAssessmentSection`, demoted from dark to light)
- Create: `src/components/sections/MedicalTrainingSection.tsx`
- Delete: `src/components/sections/MaleAestheticsSection.tsx`, `src/components/sections/ConditionsSection.tsx`, `src/components/sections/ErectileDysfunctionSection.tsx`, `src/components/sections/TestosteroneSection.tsx`, `src/components/sections/PenileImplantSection.tsx`, `src/components/sections/AdvancedAssessmentSection.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Confirm nothing outside the homepage imports the six components being deleted**

Run: `grep -rln "MaleAestheticsSection\|ConditionsSection\|ErectileDysfunctionSection\|TestosteroneSection\|PenileImplantSection\|AdvancedAssessmentSection" src --include="*.tsx" | grep -v "src/app/(marketing)/page.tsx"`
Expected: no output (all six are homepage-only). If anything else matches, stop and re-scope this task before deleting.

- [ ] **Step 2: Rewrite `HeroSection.tsx`**

```tsx
import { practiceLocationLine } from "@/config/practice";
import { BookingCta } from "@/components/ui/BookingCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

const trustStrip = [
  "European-trained",
  "Andrology & Sexual Medicine",
  "Penile Surgery",
  "Male Genital Aesthetics",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid min-h-[85vh] items-center gap-12 py-section-y lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Consultant Urologist &amp; Andrologist · Abu Dhabi
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-display-2xl text-foreground">
              Dr. Alejandro Molina
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Andrology · Men&rsquo;s Sexual Health · Male Genital Aesthetics
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
              Specialist care in sexual medicine, male hormonal health,
              penile surgery and male genital aesthetics, with
              particular expertise in Penile Girth Enhancement.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Consultant Urologist &amp; Andrologist
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {practiceLocationLine}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage="/" ctaPosition="hero" size="lg">
                Book a Confidential Consultation
              </BookingCta>
              <Button asChild variant="secondary" size="lg">
                <a href="/male-aesthetics/penile-girth-enhancement">
                  Explore Penile Girth Enhancement
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <MaskedReveal className="aspect-[4/5] w-full border border-border bg-surface lg:aspect-[3/4]">
          <ImagePlaceholder index="01" label="Portrait of Dr. Alejandro Molina" />
        </MaskedReveal>
      </Container>

      <div className="border-t border-border bg-surface">
        <Container>
          <Reveal>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {trustStrip.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
```

Note: `AmpersandText` import is dropped since the H1 no longer contains an ampersand; `doctor` import is dropped since the name is now a literal H1 rather than `{doctor.displayName}` (matches the brief's explicit recommended copy verbatim — if `doctor.displayName` ever changes, this H1 should be revisited, but the brief specifies the literal string, not a config reference).

- [ ] **Step 3: Give `FeaturedProcedureSection` the flagship dark treatment**

Replace the section's wrapper and add the same 4-metric authority block the Girth Enhancement page already uses (imported from the new `AuthorityBlock` created in Task B2 — **do Task B2 before this step**, or inline the metrics array here and refactor later; this plan does B2 first, see task ordering note below):

```tsx
import Link from "next/link";
import { doctor } from "@/config/doctor";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedProcedureSection() {
  return (
    <section className="section-dark bg-background py-section-y text-foreground">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Flagship Procedure
          </p>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Penile Girth Enhancement
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground">
            Dr. Molina provides specialist, Consultant-led penile girth
            enhancement using hyaluronic acid — planned around individual
            anatomy, with realistic expectations and specialist
            follow-up.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10">
            <AuthorityBlock align="center" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/male-aesthetics/penile-girth-enhancement">
                Learn About Penile Girth Enhancement
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

(`doctor` import stays only if still referenced — remove if unused after this edit; TypeScript/ESLint will flag it if so.)

- [ ] **Step 4: Create `SexualHormonalHealthSection.tsx`**

```tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const contributors = [
  "Vascular",
  "Hormonal",
  "Metabolic",
  "Neurological",
  "Medication-related",
  "Psychosexual",
];

const pillars = [
  "Symptoms",
  "Total & free testosterone",
  "SHBG",
  "LH / FSH",
  "Prolactin",
  "Thyroid",
  "Metabolic health",
  "Sleep",
  "Fertility plans",
];

/**
 * Homepage section merging the former standalone ErectileDysfunction
 * and Testosterone sections into one "Sexual & Hormonal Health" module
 * — Phase R1-R2 homepage consolidation (13 → 10 sections).
 */
export function SexualHormonalHealthSection() {
  return (
    <section className="py-section-y">
      <Container>
        <SectionHeading eyebrow="Sexual & Hormonal Health" heading="Diagnosis Before Treatment, in Both Directions" />

        <div className="mt-16 grid gap-16 border-t border-border pt-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h3 className="font-display text-display-md text-foreground">
              Erectile Dysfunction Deserves a Diagnosis, Not Just a Prescription
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Erectile dysfunction can have vascular, hormonal, metabolic,
              neurological, medication-related and psychosexual
              contributors. Treatment is selected according to the
              underlying cause, medical history and individual priorities.
            </p>
            <StaggerGroup className="relative mt-8 border-l border-border pl-8">
              {contributors.map((item) => (
                <StaggerItem key={item} className="relative py-2">
                  <span className="absolute -left-[calc(2rem+3px)] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-strong" />
                  <span className="text-sm text-foreground">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link
                href="/erectile-dysfunction"
                className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                Explore Erectile Dysfunction
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <blockquote className="font-display text-display-md italic leading-snug text-foreground">
              &ldquo;Symptoms come first.
              <br />
              Numbers need context.&rdquo;
            </blockquote>
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              What assessment considers
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {pillars.map((pillar) => (
                <li
                  key={pillar}
                  className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
                >
                  {pillar}
                </li>
              ))}
            </ul>
            <Link
              href="/mens-health/testosterone"
              className="mt-8 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Male Hormonal Health
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Create `AdvancedPenileSurgerySection.tsx`** (light treatment — this is the demotion from the old full-dark Implant band)

```tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const facts = [
  {
    title: "Inflatable implants",
    description:
      "Two- or three-piece devices designed to closely mirror natural rigidity and flaccidity.",
  },
  {
    title: "Malleable implants",
    description:
      "Semi-rigid rods that can be manually positioned, with no mechanical parts.",
  },
];

const steps = [
  "Consultation",
  "Hormonal / metabolic assessment",
  "Penile vascular assessment where indicated",
  "Individual treatment strategy",
];

/**
 * Homepage section merging the former standalone PenileImplant and
 * AdvancedAssessment sections — Phase R1-R2 consolidation. Deliberately
 * NOT `.section-dark`: Penile Girth Enhancement now holds the
 * homepage's one dark "flagship" moment (FeaturedProcedureSection), so
 * this secondary-priority surgical section uses the site's plain light
 * treatment instead, correcting the previous visual-priority mismatch.
 */
export function AdvancedPenileSurgerySection() {
  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow="Advanced Penile Surgery"
          heading="A Definitive Option, Reached Through Assessment"
          description="Penile implant surgery is a considered, later-stage option — reached after a structured assessment, not offered as a first step."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2">
          {facts.map((fact) => (
            <StaggerItem key={fact.title}>
              <h3 className="font-display text-xl text-foreground">
                <AmpersandText text={fact.title} />
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{fact.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-14 border-t border-border pt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How the cause is confirmed first
          </p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, index) => (
              <StaggerItem key={step}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 max-w-[20ch] text-sm text-foreground">{step}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
            <Link
              href="/penile-implant"
              className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Penile Implants
            </Link>
            <Link
              href="/erectile-dysfunction/penile-doppler"
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              Penile Duplex Ultrasound
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Create `MedicalTrainingSection.tsx`**

```tsx
import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Short homepage teaser for AndroMax training — new in Phase R1-R2
 * (item 8's target section list). Deliberately no CTA, mirroring the
 * About page's own Medical Education section: keeps the B2B training
 * proposition separate from the clinical B2C booking flow. Renders
 * nothing if `doctor.medicalTrainer` is unset (fail-safe pattern).
 */
export function MedicalTrainingSection() {
  if (!doctor.medicalTrainer?.description) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Medical Education &amp; Training
          </p>
          <p className="mt-6 text-body-lg text-muted-foreground">
            {doctor.medicalTrainer.description}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 7: Delete the six superseded components**

```bash
rm src/components/sections/MaleAestheticsSection.tsx
rm src/components/sections/ConditionsSection.tsx
rm src/components/sections/ErectileDysfunctionSection.tsx
rm src/components/sections/TestosteroneSection.tsx
rm src/components/sections/PenileImplantSection.tsx
rm src/components/sections/AdvancedAssessmentSection.tsx
```

- [ ] **Step 8: Rewrite `page.tsx`'s composition to the 10-section target sequence**

```tsx
import { AboutSection } from "@/components/sections/AboutSection";
import { AdvancedPenileSurgerySection } from "@/components/sections/AdvancedPenileSurgerySection";
import { AuthorityStripSection } from "@/components/sections/AuthorityStripSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { CoreExpertiseSection } from "@/components/sections/CoreExpertiseSection";
import { FeaturedProcedureSection } from "@/components/sections/FeaturedProcedureSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { MedicalTrainingSection } from "@/components/sections/MedicalTrainingSection";
import { SexualHormonalHealthSection } from "@/components/sections/SexualHormonalHealthSection";
// ... existing metadata export stays unchanged ...

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AuthorityStripSection />
      <FeaturedProcedureSection />
      <CoreExpertiseSection />
      <SexualHormonalHealthSection />
      <AdvancedPenileSurgerySection />
      <AboutSection />
      <MedicalTrainingSection />
      <InsightsSection />
      <BookingSection />
    </>
  );
}
```

(Keep the file's existing top-of-file `metadata` export exactly as-is — only the import list and JSX body change.)

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Browser-check `/` at 390px and 1440px: confirm exactly 10 sections in the new order, confirm Featured Procedure now has the dark treatment and Advanced Penile Surgery does not, confirm H1 reads "Dr. Alejandro Molina", confirm mobile page height has measurably decreased from the ~13,000px baseline.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/ src/app/\(marketing\)/page.tsx
git commit -m "feat(homepage): rewrite hero, swap flagship/implant visual hierarchy, consolidate 13 sections to 10"
```

---

### Task B2: Extract reusable `AuthorityBlock` component

**Files:**
- Create: `src/components/ui/AuthorityBlock.tsx`
- Modify: `src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx` (use the new shared component instead of its inline block)

**Note on ordering:** do this task **before** Task B1 Step 3, since the new `FeaturedProcedureSection` consumes this component. If executing strictly in the order written in this plan, do B2 first, then return to B1.

- [ ] **Step 1: Create the component**

```tsx
import { doctor } from "@/config/doctor";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils/cn";

/**
 * Shared authority-metrics block — extracted from the Penile Girth
 * Enhancement page (Phase R1-R2, was previously a one-off there).
 * Same fail-safe, config-driven pattern as AuthorityStripSection: never
 * renders a metric whose backing config field is unset.
 */
const metrics = [
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

export function AuthorityBlock({ align = "left" }: { align?: "left" | "center" }) {
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
          className={align === "center" ? "text-center" : "text-center lg:text-left"}
        >
          <p className="font-display text-display-md text-foreground">{metric.value}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {metric.label}
          </p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
```

- [ ] **Step 2: Refactor the Girth Enhancement page to use it**

In `penile-girth-enhancement/page.tsx`, remove the page-local `authorityMetrics` array and its `filter(...)` line, and replace the authority-block JSX:
```tsx
      {authorityMetrics.length > 0 && (
        <section className="border-t border-border bg-background py-14">
          <Container>
            <StaggerGroup className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-6">
              {authorityMetrics.map((metric) => (
                ...
              ))}
            </StaggerGroup>
          </Container>
        </section>
      )}
```
with:
```tsx
      <section className="border-t border-border bg-background py-14">
        <Container>
          <AuthorityBlock />
        </Container>
      </section>
```
Add the import: `import { AuthorityBlock } from "@/components/ui/AuthorityBlock";`. Remove the now-unused `StaggerGroup`/`StaggerItem` import from this file if nothing else on the page still uses them (check before removing — the options list also uses `StaggerGroup`/`StaggerItem`, so keep the import).

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check `/male-aesthetics/penile-girth-enhancement`: confirm the authority block renders identically to before (500+, Since 2018, Consultant, Medical Trainer).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/AuthorityBlock.tsx "src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx"
git commit -m "refactor: extract AuthorityBlock as a shared component"
```

---

### Task B3: Header identity — compact two-level brand lockup

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add the specialty subtitle, desktop only**

Replace:
```tsx
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground"
        >
          {doctor.displayName}
        </Link>
```
with:
```tsx
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="font-display text-lg tracking-tight text-foreground">
            {doctor.displayName}
          </span>
          <span className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground md:block">
            {doctor.title}
          </span>
        </Link>
```
(`hidden md:block` keeps mobile compact per the brief's explicit instruction — the subtitle only appears at the `md` breakpoint and above, alongside the desktop nav.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check header at 390px (name only, no subtitle, no crowding of the hamburger trigger) and 1440px (name + "Consultant Urologist & Andrologist" stacked tightly beneath it, header height still reasonable — confirm it doesn't visually compete with the nav links' vertical centering).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(header): add compact Consultant Urologist & Andrologist subtitle on desktop"
```

---

### Task B4: Typography — sitewide body-text readability

**Files:**
- Modify: `src/styles/tokens.css`

**Problem:** the overwhelming majority of body paragraphs sitewide use Tailwind's `text-sm` utility (0.875rem/14px default), which the audit flagged as too small/light. Since this one utility class is reused almost everywhere paragraph copy appears, overriding its underlying theme value is a single-file, low-risk, sitewide fix — not a multi-file sweep.

- [ ] **Step 1: Override `--text-sm` in the `@theme inline` block**

Add, alongside the existing `--text-body-lg` / `--text-eyebrow` tokens:
```css
  --text-sm: 0.9375rem;
  --text-sm--line-height: 1.65;
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check several treatment-page paragraphs and FAQ answers at 1440px and 390px: confirm visibly improved legibility/line-height without any wrapping/overflow regressions in nav labels, footer links, or button text (spot-check the header nav and footer specifically, since both use `text-sm`).

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(typography): increase sitewide body text size and line-height via text-sm token"
```

---

### Task B5: Global content density — tighten section rhythm

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Tighten `--spacing-section-y`**

Change:
```css
  --spacing-section-y: clamp(4rem, 3rem + 5vw, 8rem);
```
to:
```css
  --spacing-section-y: clamp(3rem, 2.5rem + 4vw, 6.5rem);
```
(Lowers the floor, midpoint, and ceiling modestly — reduces excess air, especially on mobile where the floor value dominates, without collapsing the premium editorial rhythm at desktop widths.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check the homepage and a treatment page at 390px and 1440px: confirm sections read as connected rather than disconnected, confirm nothing feels cramped.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(spacing): tighten section-y rhythm to reduce excess whitespace"
```

---

### Task B6: CTA hierarchy — "Book a Confidential Consultation" on intimate-treatment pages, stronger primary button

**Files:**
- Modify: `src/components/ui/Button.tsx` (subtle primary-variant emphasis)
- Modify (CTA label only, hero + closing CTA): `src/app/(marketing)/male-aesthetics/page.tsx`, `src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx`, `src/app/(marketing)/male-aesthetics/scrotal-lift/page.tsx`, `src/app/(marketing)/peyronies-disease/page.tsx`, `src/app/(marketing)/erectile-dysfunction/page.tsx`, `src/app/(marketing)/erectile-dysfunction/penile-doppler/page.tsx`, `src/app/(marketing)/erectile-dysfunction/shockwave-therapy/page.tsx`, `src/app/(marketing)/penile-implant/page.tsx`

(`penile-filler-correction/page.tsx` already uses "Book a Confidential Consultation" — no change needed there.)

- [ ] **Step 1: Add a subtle primary-button emphasis**

In `Button.tsx`, change the `primary` variant from:
```ts
        primary:
          "bg-foreground text-background hover:bg-foreground/90",
```
to:
```ts
        primary:
          "bg-foreground text-background shadow-sm hover:bg-foreground/90 hover:shadow-md",
```

- [ ] **Step 2: Update each targeted page's hero `BookingCta`**

For each of the 8 files listed above, wrap the hero's `<BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />` to pass children:
```tsx
<BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
  Book a Confidential Consultation
</BookingCta>
```
(For `erectile-dysfunction/page.tsx`, which has two hero CTAs — the booking CTA and a "See the treatment ladder" anchor — only the booking CTA changes.)

- [ ] **Step 3: Update each targeted page's closing `TreatmentCtaSection`**

Add `bookingLabel="Book a Confidential Consultation"` to each page's `<TreatmentCtaSection ... />` call (matching the prop already used on Filler Correction).

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check each of the 8 pages: confirm both hero and closing CTA read "Book a Confidential Consultation"; confirm the homepage, About, Men's Health, Testosterone, Male Fertility, Sexual Medicine, Penile Surgery, Book, and Insights pages still read "Book a Consultation" (unchanged).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.tsx "src/app/(marketing)/male-aesthetics" "src/app/(marketing)/peyronies-disease" "src/app/(marketing)/erectile-dysfunction" "src/app/(marketing)/penile-implant"
git commit -m "feat(cta): use Book a Confidential Consultation on intimate-treatment pages; add primary-button emphasis"
```

---

### Task B7: Reusable FAQ + closing-CTA pattern for thin hubs — prep only

No separate component needed — `Faq` and `TreatmentCtaSection` already exist and are reused as-is in Part C for the three thin hubs. This task is a placeholder marker in the plan for sequencing; no files change here.

---

## PART C — PHASE R2: HIGH-VALUE COMMERCIAL PAGES

### Task C1: Male Genital Aesthetics hub — authority block, flagship dominance, earlier differentiation, physician presence

**Files:**
- Modify: `src/app/(marketing)/male-aesthetics/page.tsx`

- [ ] **Step 1: Strengthen the hero**

Change the eyebrow from `"Male Genital Aesthetics"` to `"Male Genital Aesthetics · Abu Dhabi"`, and the hero body paragraph from the current text to:
```
"Consultant-led penile and scrotal aesthetic care combining specialist urological anatomy, procedural experience and individual treatment planning."
```

- [ ] **Step 2: Add the authority block immediately after the hero**

Insert, right after the existing hero `<section>` and before the "Consultation framing" section:
```tsx
      <section className="border-t border-border bg-background py-14">
        <Container>
          <AuthorityBlock />
        </Container>
      </section>
```
Add `import { AuthorityBlock } from "@/components/ui/AuthorityBlock";`.

- [ ] **Step 3: Move "Why specialist assessment matters" earlier and strengthen it**

Move the existing `.section-olive` block (currently positioned after "What This Covers") to sit directly after the new authority block, before "What This Covers". Expand its second paragraph into a short list making the assessment components explicit:
```tsx
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Why specialist assessment matters
            </p>
            <p className="mt-6 text-body-lg text-foreground">
              Penile anatomy varies significantly between individuals.
              Treatment planned without a proper anatomical and medical
              assessment carries a greater risk of asymmetry,
              irregularity or dissatisfaction.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Anatomy",
                "Tissue characteristics",
                "Previous treatments",
                "Goals",
                "Risks",
                "Correction options",
                "Follow-up",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
```

- [ ] **Step 4: Give Penile Girth Enhancement standalone flagship treatment; demote the other two to a shared secondary row**

Replace the single `focusAreas.map(...)` alternating-row loop with two distinct blocks. First, a standalone, larger-scale Girth Enhancement feature:
```tsx
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Flagship procedure" heading="Penile Girth Enhancement" size="xl" />
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              The flagship procedure at this practice, and the most
              common goal raised at consultation. Hyaluronic acid
              penile augmentation is the more commonly discussed
              starting point, planned around individual anatomy — not
              a walk-in cosmetic procedure — with surgical approaches
              considered only where appropriate.
              {girthAuthorityLine ? ` Dr. Molina's ${girthAuthorityLine}.` : ""}
            </p>
            <Link
              href="/male-aesthetics/penile-girth-enhancement"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Penile Girth Enhancement
            </Link>
          </Reveal>
        </Container>
      </section>
```
Then, a visually secondary two-column pair for the other two services:
```tsx
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Also available
          </p>
          <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-12 border-t border-border pt-10 md:grid-cols-2">
            {secondaryAreas.map((area) => (
              <Reveal key={area.title}>
                <h3 className="font-display text-xl text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <Link
                  href={area.cta.href}
                  className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  {area.cta.label}
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
```
Update the data arrays accordingly: keep `girthAuthorityLine` as-is; split the existing `focusAreas` array into the Girth Enhancement paragraph above (inlined, no longer array-driven) and a new `secondaryAreas` array containing just the Scrotal Lift and Penile Filler Correction entries (same `title`/`description`/`cta` shape as before). Remove the now-unused `SectionHeading eyebrow="Areas of focus" heading="What This Covers"` wrapper and the old alternating-row `focusAreas.map` block entirely.

- [ ] **Step 5: Add a physician-presence section before the closing FAQ**

Insert before `<RelatedTreatments ...>`:
```tsx
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <MaskedReveal className="aspect-[3/4] w-full border border-border bg-surface">
            <ImagePlaceholder index={doctor.displayName} label="Portrait of Dr. Alejandro Molina" />
          </MaskedReveal>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              About
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {doctor.displayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Male genital aesthetics at this practice is performed
              within a Consultant Urologist &amp; Andrologist&rsquo;s
              practice{doctor.girthEnhancementSince !== undefined && `, with penile girth enhancement experience since ${doctor.girthEnhancementSince}`}.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              About {doctor.displayName}
            </Link>
          </div>
        </Container>
      </section>
```
Add imports: `MaskedReveal`, `ImagePlaceholder`.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Browser-check `/male-aesthetics` at 390px and 1440px: confirm authority block appears right after hero, confirm "why specialist assessment" now appears before "What This Covers" (renamed/restructured), confirm Girth Enhancement has visibly larger/more prominent treatment than the Scrotal Lift/Filler Correction pair, confirm the new physician-presence section renders with no visible placeholder caption text.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(marketing)/male-aesthetics/page.tsx"
git commit -m "feat(male-aesthetics-hub): authority block, earlier specialist-assessment framing, flagship dominance, physician presence"
```

---

### Task C2: Men's Health hub — reposition around hormonal/sexual health, add diagnostic narrative, fix dead link

**Files:**
- Modify: `src/app/(marketing)/mens-health/page.tsx`

- [ ] **Step 1: Rewrite hero copy**

Change the hero body paragraph to:
```
"Hormonal, metabolic and sexual-health assessment for men experiencing low testosterone, reduced libido, fatigue or changes in sexual function."
```

- [ ] **Step 2: Add a diagnostic-narrative section**

Insert after the hero, before the existing area list:
```tsx
      <section className="border-t border-border py-section-y">
        <Container>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How assessment works
          </p>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
            {[
              "Symptoms",
              "Hormonal assessment",
              "Metabolic / medical contributors",
              "Sexual function",
              "Individual treatment strategy",
            ].map((step, index) => (
              <StaggerItem key={step}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 max-w-[18ch] text-sm text-foreground">{step}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Not every symptom means low testosterone, and not every low
            result automatically requires treatment — assessment
            establishes which factors are actually relevant before any
            treatment is discussed.
          </p>
        </Container>
      </section>
```
Add import: `StaggerGroup, StaggerItem` from `@/components/motion/Stagger`.

- [ ] **Step 3: Fix the dead "Low Libido" link and surface Testosterone properly**

Replace the `areas` array:
```ts
const areas = [
  {
    label: "Testosterone & Male Hormonal Health",
    description: "Symptoms, diagnosis and when treatment is clinically appropriate.",
    href: "/mens-health/testosterone",
  },
  {
    label: "Low Libido",
    description: "Assessed alongside hormonal, medical and psychosexual factors.",
    href: "/mens-health/low-libido",
  },
];
```
with:
```ts
const areas = [
  {
    label: "Testosterone & Male Hormonal Health",
    description: "Symptoms, diagnosis and when treatment is clinically appropriate — including reduced libido, assessed alongside hormonal, medical and psychosexual factors.",
    href: "/mens-health/testosterone",
  },
  {
    label: "Erectile Dysfunction",
    description: "Sexual-function changes are assessed as part of the same hormonal and metabolic picture where relevant.",
    href: "/erectile-dysfunction",
  },
];
```
(Removes the link to the unbuilt `/mens-health/low-libido` route entirely, folds "reduced libido" into the Testosterone row's own description instead, and adds Erectile Dysfunction as the "contextually appropriate" second link per the brief.)

- [ ] **Step 4: Add FAQ and closing CTA, matching the Male Aesthetics hub's pattern**

Add before the closing `</>`:
```tsx
      <Faq
        items={[
          {
            question: "Does every symptom mean I have low testosterone?",
            answer:
              "No. Fatigue, low libido and reduced performance can be associated with testosterone deficiency, but they can also have many other causes — assessment looks at the full picture before attributing symptoms to any one cause.",
          },
          {
            question: "Will I automatically be offered treatment?",
            answer:
              "No. Treatment is considered only after appropriate clinical and biochemical assessment, and only when there's a clear indication for it.",
          },
          {
            question: "Is erectile dysfunction always related to hormones?",
            answer:
              "Not always. It can have hormonal, vascular, metabolic, neurological, medication-related and psychosexual contributors — assessment identifies which are relevant for you specifically.",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="Begin With a Hormonal Health Assessment"
        sourcePage={PATH}
        secondary={{ label: "Explore Testosterone & Male Hormonal Health", href: "/mens-health/testosterone" }}
      />
```
Add imports: `Faq` from `@/components/ui/Faq`, `TreatmentCtaSection` from `@/components/sections/TreatmentCtaSection`.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Browser-check `/mens-health`: confirm no link to `/mens-health/low-libido` remains anywhere on the page, confirm the diagnostic-narrative steps render, confirm FAQ and closing CTA appear.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(marketing)/mens-health/page.tsx"
git commit -m "feat(mens-health-hub): reposition around hormonal/sexual health, add diagnostic narrative, remove dead Low Libido link, add FAQ and closing CTA"
```

---

### Task C3: About page — already covered by Task A3; confirm final state

**Files:** none additional — Task A3 already applied the required bug fixes; Task A1 already removed the visible placeholder captions on this page.

- [ ] **Step 1: Re-read the final page after A1+A3 land and confirm no further change is needed per items 18-19 of the brief** (no CV-dump restructuring was requested beyond the bug fixes already applied — the audit rated this page's prose as the site's best-written content).

---

### Task C4: Penile Girth Enhancement — covered by Task B2; Penile Filler Correction — no changes needed

**Files:** none additional.

- [ ] **Step 1: Confirm** the flagship page now uses the shared `AuthorityBlock` (Task B2) and, per item 21, that its existing section segmentation (options → variability → risks/aftercare/revision → about → FAQ) already provides clear scanning structure — no further restructuring applied, per the brief's own "improve visual hierarchy rather than rewriting unnecessarily" instruction.
- [ ] **Step 2: Confirm** Penile Filler Correction already uses "Book a Confidential Consultation" (pre-existing) and already frames its value proposition as specialist assessment rather than criticism of prior providers (per item 22) — no change needed.

---

### Task C5: Penile Implant — remove placeholder caption (covered by A1), apply confidential CTA (covered by B6)

**Files:** none additional beyond A1 and B6.

- [ ] **Step 1: Confirm** both changes landed via their respective tasks; no page-specific redesign needed beyond what A1/B6 already cover, per item 23's instruction not to diminish the page's own clinical seriousness or restructure it further.

---

### Task C6: Sexual Medicine and Penile Surgery hubs — add FAQ, closing CTA, brief expanded copy

**Files:**
- Modify: `src/app/(marketing)/sexual-medicine/page.tsx`
- Modify: `src/app/(marketing)/penile-surgery/page.tsx`

- [ ] **Step 1: Sexual Medicine — add FAQ + closing CTA**

Append before the closing `</>`:
```tsx
      <Faq
        items={[
          {
            question: "Where do I start if I'm not sure what's causing the problem?",
            answer:
              "With an assessment. Erectile dysfunction can have several contributing causes, and treatment is matched to what's actually found — not assumed from symptoms alone.",
          },
          {
            question: "Is Penile Doppler always required?",
            answer:
              "No. It's used when a vascular cause needs to be evaluated specifically, not as a routine step for every patient.",
          },
          {
            question: "Is shockwave therapy a first-line treatment?",
            answer:
              "No. It's one option that may be considered for selected patients after assessment, not a stand-alone starting point.",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="Start With an Assessment, Not an Assumption"
        sourcePage={PATH}
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
        bookingLabel="Book a Confidential Consultation"
      />
```
Add imports: `Faq`, `TreatmentCtaSection`.

- [ ] **Step 2: Penile Surgery — add FAQ + closing CTA**

Append before the closing `</>`:
```tsx
      <Faq
        items={[
          {
            question: "Is surgery always the first option?",
            answer:
              "No. Surgical options here are considered once appropriate assessment — and, where relevant, non-surgical treatment — have been explored first.",
          },
          {
            question: "How are penile implant surgery and Peyronie's disease related?",
            answer:
              "They're separate conditions, but Peyronie's disease can affect erectile function, and prior pelvic surgery or structural conditions can be relevant to both — assessment considers them together where relevant.",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="Discuss Whether Surgery Is Right for You"
        sourcePage={PATH}
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
        bookingLabel="Book a Confidential Consultation"
      />
```
Add imports: `Faq`, `TreatmentCtaSection`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Browser-check both pages: confirm FAQ and closing CTA render, confirm both hubs remain noticeably shorter than a full treatment page (per the brief's explicit "do not make hubs as long as treatment pages" instruction).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(marketing)/sexual-medicine/page.tsx" "src/app/(marketing)/penile-surgery/page.tsx"
git commit -m "feat(hubs): add FAQ and closing CTA to Sexual Medicine and Penile Surgery hubs"
```

---

### Task C7: Footer — physician identity

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add the credential and specialty lines**

Replace:
```tsx
          <div>
            <p className="font-display text-2xl">{doctor.displayName}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {doctor.specialtyLine}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Consultations at {practiceLocationLine}
            </p>
          </div>
```
with:
```tsx
          <div>
            <p className="font-display text-2xl">{doctor.displayName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{doctor.title}</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Andrology · Men&rsquo;s Sexual Health · Male Genital Aesthetics
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Consultations at {practiceLocationLine}
            </p>
          </div>
```
(Keeps the existing "Consultations at NMC..." wording exactly as-is — it already correctly implies location, not ownership, per the brief's explicit constraint. `doctor.specialtyLine` is no longer used in the footer; leave the config field itself untouched since it may still be referenced elsewhere — verify with a grep before assuming it's now fully unused.)

- [ ] **Step 2: Verify**

Run: `grep -rn "specialtyLine" src` to confirm whether it's still used elsewhere (if not, this is fine to leave defined in config unused — do not delete the config field itself, since removing a documented, owner-approved config value is out of scope for this plan). Then `npx tsc --noEmit && npm run build`. Browser-check the footer at 390px and 1440px: confirm "Dr. Alejandro Molina / Consultant Urologist & Andrologist / Andrology · Men's Sexual Health · Male Genital Aesthetics / Consultations at NMC Royal Hospital Khalifa City, Abu Dhabi" all render legibly without crowding.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(footer): add Consultant Urologist & Andrologist and specialty line to physician identity block"
```

---

## PART D — MEDIA REQUIREMENTS UPDATE

### Task D1: Update `MEDIA_REQUIREMENTS.md` for the two new physician-presence slots

**Files:**
- Modify: `MEDIA_REQUIREMENTS.md`

- [ ] **Step 1: Add an entry for the Male Aesthetics hub's new physician-presence portrait slot**

This reuses `doctor.profileImage` (same config value as items 1-2), consistent with the existing "3 places" note — update that note to "4 places" and list the new Male Aesthetics hub usage alongside Home hero, Home About section, and `/about`.

- [ ] **Step 2: Verify**

Read the file back and confirm the summary table's "Used at" / count references are internally consistent with the actual current call sites (re-grep `doctor.profileImage` usage across `src` to get the true count before finalizing the wording).

- [ ] **Step 3: Commit**

```bash
git add MEDIA_REQUIREMENTS.md
git commit -m "docs: update MEDIA_REQUIREMENTS.md for the new Male Aesthetics hub physician-presence slot"
```

---

## PART E — QA

### Task E1: Full verification pass

**Files:** none modified unless QA surfaces a defect.

- [ ] **Step 1: Static checks**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Expect clean on all three.

- [ ] **Step 2: Sitemap/robots/route sanity**

Confirm `next build`'s route list still shows the same set of routes as before this plan (no new routes added, none removed) — the static page count should be unchanged from Phase C's baseline (45) since this plan touches zero routes.

- [ ] **Step 3: Real-browser QA via Playwright**

For each of the 7 pages named in the brief (`/`, `/male-aesthetics`, `/mens-health`, `/about`, `/male-aesthetics/penile-girth-enhancement`, `/male-aesthetics/penile-filler-correction`, `/penile-implant`), at each of the 7 viewports (375, 390, 430, 768, 1024, 1440, 1728):
- Screenshot and visually inspect.
- Confirm the cookie banner (with `localStorage` cleared first) never overlaps an interactive element — re-run the DOM-rect overlap check from Task A2 at 375/390/430 specifically.
- Confirm zero visible placeholder/developer copy anywhere (grep rendered HTML for the retired caption strings).
- Confirm exactly one `<h1>` per page.
- Confirm no horizontal overflow.
- Confirm zero console errors (the pre-existing `NEXT_PUBLIC_SITE_URL` warning is expected and not a regression).
- Confirm nav links, booking links (`booking.nmc.ae`), and FAQ accordions all function.
- Emulate `prefers-reduced-motion: reduce` and confirm reveal animations are effectively instant (no motion-sickness-inducing transitions), consistent with the existing sitewide `MotionConfig` behavior.

- [ ] **Step 4: Metadata/schema spot check**

View source on `/about` and confirm the title tag now reads "About | Dr. Alejandro Molina". View source on `/male-aesthetics` and confirm `medicalWebPageSchema` still emits correctly around the restructured sections. Confirm `personSchema()`/`physicianSchema()` JSON-LD is unaffected (still emitted from `layout.tsx`, untouched by this plan).

- [ ] **Step 5: Record results, fix and re-verify anything failing**

If any check fails, fix the specific file responsible, re-run the failing check, then re-run Step 1 in full before continuing.

- [ ] **Step 6: Commit any QA-driven fixes**

```bash
git add <fixed files>
git commit -m "fix: address Phase R1-R2 QA finding"
```

---

## PART F — DOCUMENTATION

### Task F1: Update tracking docs

**Files:**
- Modify: `IMPLEMENTATION_REPORT.md` (new "Phase 11 — Positioning, UX & Copy Implementation (R1-R2)" section)
- Modify: `POSITIONING_UX_COPY_AUDIT.md` (mark each P0/P1 finding addressed in this plan as resolved, with a one-line pointer to the relevant task)
- Modify: `POSITIONING_UX_REDESIGN_PLAN.md` (mark R1.1-R1.9 and the R2 items implemented in this plan as done; leave anything genuinely deferred — e.g. real photography sourcing itself — marked as still pending)
- Modify: `SEO_AUDIT.md` (note the About title fix, the homepage H1 change, and confirm no route/sitemap changes occurred)

- [ ] **Step 1: Write the `IMPLEMENTATION_REPORT.md` section**

Cover: P0 fixes shipped (placeholder captions, cookie banner, 3 content bugs), homepage restructure (13→10 sections, hierarchy swap), new shared components (`AuthorityBlock`), typography/spacing/CTA global changes, per-page R2 changes (Male Aesthetics hub, Men's Health hub, footer, header), what was explicitly NOT done (no new routes, no photography sourced, PRP/awards untouched, `NEXT_PUBLIC_SITE_URL` still unset), and QA results.

- [ ] **Step 2: Verify**

Run: `git diff --stat IMPLEMENTATION_REPORT.md POSITIONING_UX_COPY_AUDIT.md POSITIONING_UX_REDESIGN_PLAN.md SEO_AUDIT.md` — confirm only additive/status-marking diffs, no accidental content loss.

- [ ] **Step 3: Commit**

```bash
git add IMPLEMENTATION_REPORT.md POSITIONING_UX_COPY_AUDIT.md POSITIONING_UX_REDESIGN_PLAN.md SEO_AUDIT.md
git commit -m "docs: record Phase R1-R2 implementation across tracking documents"
```

---

## Self-review notes

- **Spec coverage:** P0 items 1-3 → Tasks A1-A3. R1 items 4-7 → Tasks B3, B4, B5, B6. R2 homepage items 8-11 → Task B1 (+B2 for the authority block dependency). Male Aesthetics items 12-15 → Task C1. Men's Health items 16-17 → Task C2. About items 18-19 → Task C3 (already covered by A1/A3). Girth Enhancement/Filler Correction items 20-22 → Task C4 (mostly already-adequate, confirmed not rewritten unnecessarily). Penile Implant item 23 → Task C5. Thin hubs item 24 → Task C6. Footer item 25 → Task C7. Photography section → Task D1. QA section → Task E1. Documentation section → Task F1.
- **Placeholder scan:** every task specifies exact file paths and either full replacement code or precise before/after diffs — no "add appropriate X" phrasing anywhere.
- **Type/prop consistency:** `AuthorityBlock`'s `align` prop, `ImagePlaceholder`'s `label`/`index` props, and the CTA `bookingLabel` prop are each defined once and referenced identically everywhere they're consumed across Tasks B1-B2, B6, C1, C6.
- **Ordering dependency flagged explicitly:** Task B2 (AuthorityBlock) must land before Task B1 Step 3 (FeaturedProcedureSection), and both must land before Task C1 (Male Aesthetics hub also consumes AuthorityBlock) — noted inline in B1 and reflected in execution order below.

## Execution order

A1 → A2 → A3 → B2 → B1 → B3 → B4 → B5 → B6 → C1 → C2 → C3 → C4 → C5 → C6 → C7 → D1 → E1 → F1
