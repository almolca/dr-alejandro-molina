# Phase R3 Correction — Visual Enrichment & Brand Authority (Materially Visible) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the previous visual-enrichment pass's shortfall right — the owner's explicit feedback is that Phase R2.1/R3 "mostly integrated favicon/footer assets and left the existing visual system substantially unchanged." This pass must produce a **materially, immediately visible** difference: correct the brand palette away from navy-dominant toward charcoal/ivory/bronze (matching the approved logo), actually integrate the logo into the header across breakpoints (not avoid it), place the full logo lockup somewhere real, add genuine background depth and a brand-derived decorative motif, extend motion, break up more text-heavy pages, and give the About page's authority signals real visual weight — then prove it with before/after screenshots.

**Architecture:** Token-level palette correction cascades automatically to every `.section-dark` moment (no per-component find/replace). Three new reusable primitives (`EditorialTexture` replacing the narrower `TextureOverlay`, `BrandCurve`, `TonalSection`) extend the existing `Reveal`/`Stagger`/`MaskedReveal` motion system rather than replacing it. No new heavy dependencies.

**Tech Stack:** Next.js 16, TypeScript strict, Tailwind CSS 4, `motion` (already used), `lucide-react` (already used), `next/image` (introduced in the prior phase for the logo, extended here).

**Spec:** The owner's "CORRECTION PASS" prompt (17 numbered sections), explicitly correcting `POSITIONING_UX_REDESIGN_PLAN.md`/Phase R2.1's execution.

**Before-state evidence:** 4 full-page screenshots already captured at 1440px (Homepage, About, Male Aesthetics, Penile Girth Enhancement) before this plan's first edit — referenced in the final comparison report, not committed to the repo (working artifacts only).

## Global Constraints

- No unverified claim renders: `mediaAppearances`, `patientReviews`, `doctor.awards` stay exactly as gated as before — this phase is visual/architectural, not a data-verification pass.
- Navy is not removed from existence (the logo itself is navy) — it stops being the *dominant* dark-section color. Bronze/gold stays exactly as restrained as before (no "everything gold").
- No bitmap texture assets — texture stays CSS/SVG only.
- `features.prpPage`, `bookingUrl`, `physicianProfileUrl` untouched. No new routes.
- Every task ends with `npx tsc --noEmit && npm run lint && npm run build` passing clean before commit.
- Every visual task gets an actual browser screenshot check before commit — "the component compiles" is not sufficient evidence of a visible change this time.

---

## PART A — Palette correction (foundational; do first, everything else builds on it)

### Task A1: Replace `.section-dark`'s navy/ink base with warm charcoal

**Files:**
- Modify: `src/styles/tokens.css`

**Problem:** Phase R2.1 introduced a navy `ink` scale and made it the *dominant* dark-section color across the homepage flagship band, footer, About Credentials, Girth Enhancement's variability section, and the ED treatment ladder. The owner's explicit correction: charcoal/near-black, not navy, is the primary dark identity — navy stays only where "extremely subordinate."

- [ ] **Step 1: Confirm `ink` isn't used anywhere else before removing it**

Run: `grep -rn "color-ink" src` — expect matches only inside `tokens.css` itself (`@theme` definition + `.section-dark`).

- [ ] **Step 2: Revert `.section-dark` to a warm charcoal base**

Change:
```css
.section-dark {
  --background: var(--color-ink-950);
  --foreground: var(--color-ink-50);
  --surface: var(--color-ink-900);
  --muted-foreground: var(--color-ink-400);
  --border: var(--color-ink-800);
  --accent: var(--color-bronze-400);
  --accent-strong: var(--color-bronze-300);
  --focus-ring: var(--color-ink-50);
}
```
to:
```css
/*
 * Phase R3 correction: reverted from the navy `ink` scale (Phase
 * R2.1) back to warm charcoal/near-black — the owner's explicit
 * direction is that navy is not the dominant brand color, even though
 * the logo itself uses navy. `stone-950` is a warm, near-black neutral
 * (not blue-tinted), matching "deep charcoal / near-black."
 */
.section-dark {
  --background: var(--color-stone-950);
  --foreground: var(--color-stone-50);
  --surface: var(--color-stone-900);
  --muted-foreground: var(--color-stone-400);
  --border: var(--color-stone-800);
  --accent: var(--color-bronze-400);
  --accent-strong: var(--color-bronze-300);
  --focus-ring: var(--color-stone-50);
}
```

- [ ] **Step 3: Remove the now-unused `ink` scale**

Delete the `--color-ink-*` block from `@theme` (added in Phase R2.1).

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check the homepage's flagship band and the footer at 1440px: confirm both now read as warm charcoal/near-black, not navy.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css
git commit -m "fix(brand): revert dark sections from navy to warm charcoal per owner correction"
```

---

## PART B — Header: real responsive brand integration

### Task B1: Three-tier responsive logo lockup

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add the AM symbol at every breakpoint, subtitle only at `lg:`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { doctor } from "@/config/doctor";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useScrolled } from "@/components/navigation/useScrolled";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-[background-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "bg-background/90 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo-symbol.png"
            alt=""
            width={26}
            height={26}
            className="shrink-0"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg tracking-tight text-foreground">
              {doctor.displayName}
            </span>
            <span className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground lg:block">
              {doctor.title}
            </span>
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <BookingCta
              sourcePage="global-header"
              ctaPosition="header"
              size="sm"
            />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
```
(Removed the unused `"use client"` directive check — `useScrolled` is a hook, so this file already needed `"use client"`; keep it. The symbol renders at all sizes; only the subtitle is breakpoint-gated, matching the brief's "AM + Dr Alejandro Molina, small specialty line if it fits" for the mid tier and "AM symbol + Dr Alejandro Molina" for mobile.)

- [ ] **Step 2: Verify no regression at the exact breakpoint that broke before**

Run: `npx tsc --noEmit && npm run build`. Browser-check at 768px specifically (DOM rect / `scrollWidth > clientWidth` check, not just a screenshot glance) — this is the breakpoint that overflowed in Phase 11. If it overflows with the symbol present, reduce the symbol to `width={22} height={22}` and re-check before trying anything more drastic (do not silently drop the symbol again — the owner explicitly rejected that fallback).

- [ ] **Step 3: Check the remaining viewports**

375, 390, 430, 1024, 1440, 1728 — confirm zero overflow at each.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(header): integrate AM symbol at every breakpoint, not just the footer"
```

---

## PART C — Reusable visual primitives

### Task C1: `EditorialTexture` (replaces `TextureOverlay`) — contour lines + subtle AM watermark

**Files:**
- Create: `src/components/ui/EditorialTexture.tsx`
- Delete: `src/components/ui/TextureOverlay.tsx`
- Modify: every caller of `TextureOverlay` (currently `FeaturedProcedureSection.tsx`, About page's Credentials section) to use the new component and name

- [ ] **Step 1: Create the new component**

```tsx
/**
 * Editorial background texture — Phase R3 correction, replaces the
 * narrower TextureOverlay. Pure CSS/SVG (hairline contour pattern +
 * soft radial glow + an extremely faint, oversized AM watermark using
 * the real logo symbol) — no bitmap texture asset beyond the logo
 * itself, no JS, no animation. `pointer-events-none` + `aria-hidden`
 * since it's purely decorative. Callers give their section
 * `className="relative"` and render this as the first child.
 */
export function EditorialTexture({ watermark = true }: { watermark?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 32px), radial-gradient(ellipse at 20% 0%, currentColor 0%, transparent 60%)",
          color: "var(--color-accent-strong)",
        }}
      />
      {watermark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/logo-symbol.png"
          alt=""
          className="absolute -right-24 -top-24 w-[28rem] opacity-[0.025] grayscale"
        />
      )}
    </div>
  );
}
```
(Plain `<img>`, not `next/image`, deliberately — this is a purely decorative, oversized, cropped background element where Next's layout/sizing machinery adds no value and a plain tag is simpler; the real logo usage in Header/Footer uses `next/image` as normal.)

- [ ] **Step 2: Update callers**

In `FeaturedProcedureSection.tsx` and `about/page.tsx`: replace `import { TextureOverlay } from "@/components/ui/TextureOverlay";` with `import { EditorialTexture } from "@/components/ui/EditorialTexture";`, and `<TextureOverlay />` with `<EditorialTexture />`.

- [ ] **Step 3: Delete the old component**

```bash
git rm src/components/ui/TextureOverlay.tsx
```

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add -A
git commit -m "feat(brand): replace TextureOverlay with EditorialTexture (adds subtle AM watermark)"
```

---

### Task C2: `BrandCurve` — decorative gold-line motif with draw-in motion

**Files:**
- Create: `src/components/ui/BrandCurve.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion } from "motion/react";
import { defaultViewport } from "@/components/motion/motion-config";

/**
 * Decorative curve derived from the gold swoosh in the logo — Phase R3
 * correction §5/§6. Draws itself in via stroke-dashoffset once, on
 * scroll into view (motion respects prefers-reduced-motion globally
 * via the sitewide MotionConfig, same as every other animated
 * primitive). Purely decorative — `aria-hidden`.
 */
export function BrandCurve({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 24"
      className={className ?? "h-4 w-40 text-accent-strong"}
      fill="none"
    >
      <motion.path
        d="M2 20 C 60 4, 140 4, 238 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={defaultViewport}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Apply as a section-divider accent in 3 places** — under the H1 on the Girth Enhancement hero, under the "Flagship procedure" heading on the Male Aesthetics hub, and under the About hero's identity block. Insert `<BrandCurve className="mt-6 h-4 w-32 text-accent-strong" />` at each location.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add src/components/ui/BrandCurve.tsx <the 3 modified page files>
git commit -m "feat(brand): add BrandCurve decorative motif with draw-in motion, applied to 3 hero moments"
```

---

### Task C3: `TonalSection` — reusable background-tone wrapper

**Files:**
- Create: `src/components/ui/TonalSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const toneClass = {
  ivory: "bg-background",
  stone: "bg-surface",
  charcoal: "section-dark bg-background text-foreground",
  warm: "bg-gradient-to-b from-surface to-background",
} as const;

/**
 * Reusable tonal background wrapper — Phase R3 correction §5. Gives
 * new sections a consistent way to opt into a tone without repeating
 * className logic. Does not replace `.section-dark`/`.section-olive`
 * directly (those remain for existing call sites) — `tone="charcoal"`
 * here is a convenience alias for the same treatment.
 */
export function TonalSection({
  tone = "ivory",
  className,
  children,
}: {
  tone?: keyof typeof toneClass;
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn(toneClass[tone], "py-section-y", className)}>{children}</section>;
}
```

- [ ] **Step 2: Use `tone="warm"` for one new moment** — the Male Aesthetics hub's "Also available" (Scrotal Lift / Filler Correction) section, replacing its current plain `border-t border-border bg-surface` with `<TonalSection tone="warm" className="border-t border-border">`, giving it a subtle warm gradient instead of a flat surface color.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add src/components/ui/TonalSection.tsx "src/app/(marketing)/male-aesthetics/page.tsx"
git commit -m "feat(brand): add TonalSection primitive, apply warm-gradient tone to Male Aesthetics secondary services"
```

---

### Task C4: `ImagePlaceholder` — editorial frame redesign

**Files:**
- Modify: `src/components/ui/ImagePlaceholder.tsx`

- [ ] **Step 1: Add a bronze corner accent so the surface reads as an intentional frame, not a generic gray box**

```tsx
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
      <span aria-hidden className="absolute left-0 top-0 h-8 w-px bg-accent-strong" />
      <span aria-hidden className="absolute left-0 top-0 h-px w-8 bg-accent-strong" />
      {index && (
        <span className="absolute left-6 top-6 font-display text-sm text-accent-strong">
          {index}
        </span>
      )}
    </div>
  );
}
```
(A small bronze corner bracket — two thin lines forming an "L" in the top-left — reads as an intentional editorial frame device, echoing the kind of corner-mark used in print/editorial layout, rather than a plain placeholder box.)

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add src/components/ui/ImagePlaceholder.tsx
git commit -m "feat(brand): give ImagePlaceholder an editorial corner-frame accent"
```

---

## PART D — Full logo placement (2 spots, both light backgrounds for contrast)

### Task D1: Place `logo-full.png` on About (near the authority block) and the homepage (Authority & Media section)

**Files:**
- Modify: `src/app/(marketing)/about/page.tsx`
- Modify: `src/components/sections/AuthorityMediaSection.tsx`

- [ ] **Step 1: About — small full-lockup mark above the AuthorityBlock section's eyebrow**, on the existing light `bg-background` section:
```tsx
<Image src="/brand/logo-full.png" alt="" width={180} height={120} className="mx-auto opacity-90" />
```
Placed centered, above the `<AuthorityBlock />` call, modest size (~180px wide) so it reads as a brand mark, not a repeated header.

- [ ] **Step 2: Homepage `AuthorityMediaSection`** — same small mark, centered above the section's content (only when the section actually renders something — i.e., inside the existing `if (...) return null` guard, so it never appears on an empty section).

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add "src/app/(marketing)/about/page.tsx" src/components/sections/AuthorityMediaSection.tsx
git commit -m "feat(brand): place the full logo lockup on About and the homepage Authority & Media section"
```

---

## PART E — Footer: redesign the "patch" chip

### Task E1: Replace the circular white chip with a bordered square chip matching the site's non-circular editorial language

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Swap `rounded-full` for the site's standard `rounded-sm`, add a bronze border instead of relying on a stark white fill alone**

```tsx
<div className="flex h-12 w-12 items-center justify-center rounded-sm border border-accent-strong/40 bg-stone-50 p-2">
  <Image src="/brand/logo-symbol.png" alt="" width={30} height={30} />
</div>
```

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add src/components/layout/Footer.tsx
git commit -m "feat(footer): replace circular chip with a bordered square mark matching the site's editorial language"
```

---

## PART F — Text-wall reduction (4 more pages)

### Task F1: Add one visual break each to Male Aesthetics, Penile Filler Correction, Testosterone, Penile Implant

**Files:**
- Modify: `src/app/(marketing)/male-aesthetics/page.tsx` (already has one; this adds the `BrandCurve`, covered in C2 — no separate `PullQuote` needed here, it already got a specialist-assessment list treatment in R2.1)
- Modify: `src/app/(marketing)/male-aesthetics/penile-filler-correction/page.tsx`
- Modify: `src/app/(marketing)/mens-health/testosterone/page.tsx`
- Modify: `src/app/(marketing)/penile-implant/page.tsx`

- [ ] **Step 1: Filler Correction** — add a `PullQuote` after the "What Can Be Done, and When" (options) section, before the dark "Realistic expectations" section:
```tsx
<Container className="max-w-2xl py-14">
  <PullQuote>
    Every presentation is evaluated on its own anatomy and findings —
    never through criticism of any prior provider or treatment.
  </PullQuote>
</Container>
```

- [ ] **Step 2: Testosterone** — the page already has a plain `<blockquote>` ("Symptoms come first. Numbers need context.") — replace it with the shared `PullQuote` component for visual consistency with the rest of the site, rather than its own one-off blockquote styling.

- [ ] **Step 3: Penile Implant** — add a `PullQuote` between "Sexual Function After Surgery" and "Risks and Complications":
```tsx
<Container className="max-w-2xl py-14">
  <PullQuote>
    The aim is a realistic understanding of what the device can and
    cannot do — before proceeding, not after.
  </PullQuote>
</Container>
```

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add "src/app/(marketing)/male-aesthetics/penile-filler-correction/page.tsx" "src/app/(marketing)/mens-health/testosterone/page.tsx" "src/app/(marketing)/penile-implant/page.tsx"
git commit -m "feat(content): extend PullQuote to Filler Correction, Testosterone, Penile Implant"
```

---

## PART G — About: apply the new brand primitives + Google Reviews slot

### Task G1: Texture, BrandCurve, and PatientReviewsCta wired onto About

**Files:**
- Modify: `src/app/(marketing)/about/page.tsx`

- [ ] **Step 1: Add `<PatientReviewsCta />` near the closing CTA** (renders nothing today — no profile configured — but is now present in the render tree, "visually implemented" per the brief, ready to appear the moment a verified profile exists):
```tsx
<div className="mt-4">
  <PatientReviewsCta />
</div>
```
placed just below the existing closing-CTA `BookingCta`.

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add "src/app/(marketing)/about/page.tsx"
git commit -m "feat(about): wire PatientReviewsCta into the closing CTA (renders nothing until a verified profile exists)"
```

---

## PART H — Girth Enhancement: visual sophistication pass

### Task H1: EditorialTexture on the dark section, BrandCurve on the hero (already covered by C2), confirm section rhythm

**Files:**
- Modify: `src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx`

- [ ] **Step 1: Add `EditorialTexture` to the "Expected variability" dark section** (currently `.section-dark` with no texture):
```tsx
<section className="section-dark relative bg-background py-section-y text-foreground">
  <EditorialTexture watermark={false} />
  ...
```
(`watermark={false}` here — the homepage and About already carry the watermark; a third instance close in the page hierarchy would start to feel repetitive per the "do not repeat excessively" instruction, so this instance uses only the contour/glow layer.)

- [ ] **Step 2: Confirm the `BrandCurve` from Task C2 and the `PullQuote`/`AuthorityBlock` from earlier phases are all present and create a genuine rhythm** — hero (H1 + BrandCurve) → AuthorityBlock → goals/anatomy → options → PullQuote → textured dark variability section → risks/aftercare → about-physician teaser → FAQ. No structural rewrite needed beyond the additions above; this step is a verification checkpoint, not new code.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add "src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx"
git commit -m "feat(girth-page): add texture to the variability section, confirm full visual rhythm"
```

---

## PART I — Motion polish

### Task I1: Subtle scale-in on AuthorityBlock numbers

**Files:**
- Modify: `src/components/ui/AuthorityBlock.tsx`

- [ ] **Step 1: Add a slight scale to the existing fade+rise on the metric value specifically** (the label stays as plain fade, only the large number gets the extra emphasis):
```tsx
<motion.p
  className="font-display text-display-md text-foreground"
  initial={{ opacity: 0, scale: 0.94 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={defaultViewport}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  {metric.value}
</motion.p>
```
Requires importing `motion` from `motion/react` and `defaultViewport` from `@/components/motion/motion-config` in this file.

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add src/components/ui/AuthorityBlock.tsx
git commit -m "feat(motion): add subtle scale-in to AuthorityBlock's metric numbers"
```

**Note on motion scope:** `MaskedReveal` (already sitewide on every `ImagePlaceholder`) already satisfies "masked image reveal" and "editorial image motion." `BrandCurve` (Task C2) already satisfies "gold-line draw animation" and functions as a "section-divider animation." Background parallax is explicitly skipped — the brief marks it "only if performant," and scroll-linked JS parallax adds real complexity/risk for marginal effect inconsistent with "do not create SaaS-style movement."

---

## PART J — Verification (mandatory, not optional)

### Task J1: After screenshots + explicit before/after comparison

**Files:** none modified unless this surfaces a defect.

- [ ] **Step 1: Capture "after" screenshots** at the same 4 pages/viewport already captured "before" (Homepage, About, Male Aesthetics, Penile Girth Enhancement at 1440px full-page), plus 390px for the same 4, plus a check on Men's Health, Penile Implant, and one Insight article.

- [ ] **Step 2: Write the explicit comparison**, answering all 8 questions from the brief's §16 directly (not deferred to "see screenshots"):
1. What visual changes can a user immediately see?
2. Where is the approved full logo now visible?
3. Where was navy removed/reduced?
4. Where were texture/depth elements introduced?
5. What motion was added?
6. How were text walls broken up?
7. Where do recognition/media/review signals appear?
8. Which authority elements remain hidden due to verification gates?

- [ ] **Step 3: If any page still looks substantially the same as its "before" screenshot, that page is not done** — go back and apply the relevant Part C/D/F/H task to it before proceeding to QA.

---

## PART K — QA

### Task K1: Full verification pass

- [ ] Run `npx tsc --noEmit && npm run lint && npm run build` clean.
- [ ] Real-browser QA at 375/390/430/768/1024/1440/1728 on: Homepage, About, Male Aesthetics, Penile Girth Enhancement, Men's Health, Penile Implant, one Insight article — zero overflow (768px specifically, given the header change), one `<h1>` per page, zero console errors, all CTAs/external links functional, no visible developer/placeholder text, no unverified claims rendered anywhere.
- [ ] Confirm `MediaAppearancesSection`, `PatientReviewsCta`, `RecognitionSection` still render nothing everywhere they're placed.

### Task K2: Documentation

- [ ] Update `IMPLEMENTATION_REPORT.md` with a new phase section covering this correction pass, explicitly referencing the before/after comparison from Task J1.
- [ ] Update `POSITIONING_UX_REDESIGN_PLAN.md`'s status note.
- [ ] Update `BRAND_AUTHORITY_ASSET_REQUIREMENTS.md` if the full-lockup placement changes its "not yet placed" note.

---

## Self-review notes

- **Spec coverage:** §1 (palette) → Part A. §2 (header) → Part B. §3 (full logo) → Part D. §4 (navy removal) → automatic cascade from Part A, verified visually in Part J. §5 (texture/depth primitives) → Part C. §6 (motion) → Part I + notes on what's already covered by existing primitives. §7 (text-wall) → Part F (plus F/H/G's prior-phase work). §8 (About authority) → Parts C, D, G. §9 (media logo system) → already architected in R2.1, no further code change possible without data (noted in J1 answer to question 8). §10 (reviews) → Part G Task G1. §11 (homepage authority) → Part D Task D1 step 2. §12 (Male Aesthetics) → Parts C1/C2/C3. §13 (Girth Enhancement) → Part H. §14 (image system) → Part C Task C4. §15 (footer) → Part E. §16 (verification) → Part J, mandatory. §17 (QA) → Part K.
- **Placeholder scan:** every component in this plan is written out in full; no "add appropriate X."
- **Type consistency:** `EditorialTexture`'s `watermark` prop, `BrandCurve`'s `className` prop, and `TonalSection`'s `tone` union are each defined once and used identically at every call site.
