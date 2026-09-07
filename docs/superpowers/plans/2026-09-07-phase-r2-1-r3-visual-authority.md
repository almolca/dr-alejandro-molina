# Phase R2.1/R3 — Visual Enrichment & Authority Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce visual flatness and build out a config-driven authority/media/review architecture (Recognition, Media Appearances, Patient Reviews), without rendering any unverified claim — every new trust surface must render nothing until the owner supplies real, verified data. Introduce a navy/ink color layer, restrained texture, targeted pull-quotes/icons to break up text-heavy pages, and reorganize the About page into a stronger authority sequence.

**Architecture:** Continues the existing fail-safe, config-driven pattern used throughout this codebase (`AuthorityStripSection`, `RecognitionSection`, `AuthorityBlock`): every new trust component checks its backing config for real/`publishReady` data and returns `null` otherwise. No new routes. New CSS tokens are additive (a new `ink` color scale alongside the existing `stone`/`bronze`/`olive` scales), not a rename of existing ones.

**Tech Stack:** Next.js 16, TypeScript strict, Tailwind CSS 4, `lucide-react` (already a dependency, already used in 4 files — reused for the new iconography, not a new library).

**Spec:** The user's "PHASE R2.1/R3" prompt (27 numbered sections), building on `POSITIONING_UX_REDESIGN_PLAN.md` and the completed Phase R1-R2 work.

**Known blocker, explicitly deferred:** the owner will save two real logo files (`public/brand/logo-full.png`, `public/brand/logo-symbol.png` — exact paths TBC) into the repo separately; this plan's Part A covers everything **except** wiring those files into Header/Footer/favicon, which is a short follow-up once the files exist (steps are specified at the end of Part A so they're ready to execute the moment the files land).

## Global Constraints

- No new routes.
- No unverified claim ever renders: `mediaAppearances`, `patientReviews`, and `doctor.awards` all follow the existing `publishReady`-gate pattern — a component with zero publish-ready entries returns `null`, not a placeholder, not an empty section shell.
- No invented outlet names, logos, URLs, ratings, review counts, or award titles anywhere — every new config array ships empty or with `publishReady: false` placeholders that never reach a rendered page, exactly like `doctor.awards` already does.
- No new heavy dependencies — texture and icons use CSS/SVG and the already-installed `lucide-react`.
- `features.prpPage`, `doctor.awards` data, `bookingUrl`, `physicianProfileUrl` untouched.
- Every task ends with `npx tsc --noEmit && npm run lint && npm run build` passing clean before commit.

---

## PART A — Config-driven authority/media/review architecture

### Task A1: Media Appearances config + component

**Files:**
- Create: `src/config/mediaAppearances.ts`
- Create: `src/components/sections/MediaAppearancesSection.tsx`

- [ ] **Step 1: Create the config module**

```ts
/**
 * Media & editorial appearances — Phase R2.1/R3. The owner has stated
 * Dr. Molina collaborates with Men's Health and has participated in
 * other media outlets, but no outlet name, article title, or URL has
 * been verified yet. This array ships empty — populate each entry only
 * once the owner supplies the real outlet, title, year and URL; never
 * invent any of these fields. `publishReady` gates rendering exactly
 * like `doctor.awards` does — an entry can exist here as a draft
 * without ever reaching the live page.
 */
export type MediaAppearanceType =
  | "Editorial Contributor"
  | "Interview"
  | "Expert Commentary"
  | "Featured Physician"
  | "Media Appearance";

export type MediaAppearance = {
  outletName: string;
  logo?: string;
  title: string;
  type: MediaAppearanceType;
  year: number;
  url?: string;
  publishReady: boolean;
};

export const mediaAppearances: MediaAppearance[] = [];
```

- [ ] **Step 2: Create the component**

```tsx
import { mediaAppearances } from "@/config/mediaAppearances";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Renders nothing until at least one `mediaAppearances` entry has
 * `publishReady: true` — currently always nothing, since the array
 * ships empty. Do not add a fallback/placeholder state; an empty
 * trust section is worse than no section (spec §9/§24).
 */
export function MediaAppearancesSection() {
  const publishable = mediaAppearances.filter((item) => item.publishReady);
  if (publishable.length === 0) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Media &amp; Editorial Contributions
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
                      View
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

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`. Confirm the component renders nothing anywhere it's used (empty array today).

- [ ] **Step 4: Commit**

```bash
git add src/config/mediaAppearances.ts src/components/sections/MediaAppearancesSection.tsx
git commit -m "feat(authority): add gated Media Appearances config and component"
```

---

### Task A2: Patient Reviews config + component

**Files:**
- Create: `src/config/patientReviews.ts`
- Create: `src/components/sections/PatientReviewsCta.tsx`

- [ ] **Step 1: Create the config module**

```ts
/**
 * Verified patient-review trust signal — Phase R2.1/R3. No rating,
 * review count, or platform is configured yet. Never render a star
 * rating or review count that isn't `publishReady` and backed by a
 * real, owner-supplied `profileUrl` — this must link to an actual
 * verified profile (Google, Doctoralia, etc.), never a fabricated one.
 */
export type PatientReviewProfile = {
  platformName: string;
  rating?: number;
  reviewCount?: number;
  profileUrl: string;
  lastVerifiedAt?: string;
  publishReady: boolean;
};

export const patientReviews: PatientReviewProfile | undefined = undefined;
```

- [ ] **Step 2: Create the component**

```tsx
import { patientReviews } from "@/config/patientReviews";

/**
 * Renders nothing until `patientReviews` is configured with
 * `publishReady: true` and a real `profileUrl`. Per spec §11: if a
 * rating/count is ever configured but not yet verified, still show
 * only a neutral CTA linking to the verified profile — never a star
 * rating or count without verification. Today this always renders
 * nothing, since no profile is configured at all.
 */
export function PatientReviewsCta() {
  if (!patientReviews?.publishReady || !patientReviews.profileUrl) return null;

  const showRating =
    patientReviews.rating !== undefined && patientReviews.reviewCount !== undefined;

  return (
    <a
      href={patientReviews.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
    >
      {showRating
        ? `${patientReviews.rating} · ${patientReviews.reviewCount} reviews on ${patientReviews.platformName}`
        : `Read Verified Patient Reviews on ${patientReviews.platformName}`}
    </a>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`.

- [ ] **Step 4: Commit**

```bash
git add src/config/patientReviews.ts src/components/sections/PatientReviewsCta.tsx
git commit -m "feat(authority): add gated Patient Reviews config and component"
```

---

### Task A3: Restyle `RecognitionSection` for a more editorial treatment

**Files:**
- Modify: `src/components/sections/RecognitionSection.tsx`

Still fully gated — this only improves the presentation for whenever an award is flipped `publishReady: true`; nothing changes visibly today.

- [ ] **Step 1: Give it a slightly stronger, editorial (not badge-wall) treatment**

```tsx
import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function RecognitionSection() {
  const publishable = doctor.awards.filter((award) => award.publishReady);
  if (publishable.length === 0) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Professional Recognition
          </p>
          <div className="mt-8 flex flex-col items-center gap-6 divide-y divide-border">
            {publishable.map((award) => (
              <p
                key={`${award.issuer}-${award.year}`}
                className="pt-6 font-display text-lg text-foreground first:pt-0"
              >
                {award.officialTitle}
                <span className="mt-1 block text-sm text-muted-foreground">
                  {award.issuer}, {award.year}
                </span>
              </p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add src/components/sections/RecognitionSection.tsx
git commit -m "feat(authority): give RecognitionSection a more editorial layout (still fully gated)"
```

---

### Task A4 (deferred until logo files exist): wire the real logo

**Files (when unblocked):** `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/opengraph-image.tsx`.

- [ ] Not started this round — no logo files exist on disk yet. Once `public/brand/logo-full.png` and `public/brand/logo-symbol.png` (or their real paths) exist: replace `icon.tsx`/`apple-icon.tsx` code-generated marks with the AM symbol (via `next/image` or a static file at that route, per Next's file-based icon convention); add the full lockup to the footer's brand column, at a restrained size, without displacing existing text (keep `doctor.displayName`/title/specialty text — spec §2 explicitly requires text to remain available for accessibility/SEO); leave the header's compact text lockup as the primary header treatment (per spec §2 "do not overuse the logo" and the header's proven 768px-width tightness — see `IMPLEMENTATION_REPORT.md` Phase 11's QA finding), adding the AM symbol only if width allows without reintroducing overflow.

---

## PART B — Color system: navy/ink layer

### Task B1: Add an `ink` color scale and apply it to `.section-dark`

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Add the ink scale**

In the `@theme` block, alongside the existing bronze scale:

```css
  /*
   * Deep navy/ink scale — Phase R2.1/R3 brand-color direction ("deep
   * navy / ink blue" primary). Low-chroma, cool dark blue — applied to
   * .section-dark below so the site's existing "premium dark section"
   * moments read as navy-branded rather than neutral near-black stone.
   * The light theme (background/surface/border) is unchanged — it
   * already matches the requested "warm white / soft ivory / light
   * stone" direction.
   */
  --color-ink-50: oklch(96% 0.012 255);
  --color-ink-100: oklch(91% 0.024 255);
  --color-ink-400: oklch(45% 0.05 255);
  --color-ink-800: oklch(22% 0.045 255);
  --color-ink-900: oklch(17% 0.04 255);
  --color-ink-950: oklch(12% 0.035 255);
```

- [ ] **Step 2: Apply it to `.section-dark`**

Change:
```css
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
to:
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
(Bronze accent stays exactly as-is — only the base ink/ground tones change, keeping the accent restrained and consistent, per spec §3's "do not turn every heading/button gold.")

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check the homepage's flagship dark section and the footer (both `.section-dark`) at 1440px and 390px — confirm a visibly navy-toned dark section rather than neutral black/gray, confirm text contrast still passes (ink-50 foreground on ink-950 background is a very high-contrast pairing, same structure as the previous stone-50-on-stone-950).

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(brand): introduce navy/ink color scale, apply to .section-dark"
```

---

## PART C — Restrained background texture

### Task C1: Add a subtle, CSS/SVG-only texture treatment

**Files:**
- Create: `src/components/ui/TextureOverlay.tsx`

- [ ] **Step 1: Create a pure-CSS radial-glow + hairline contour texture, off by default, opt-in per section**

```tsx
/**
 * Restrained background texture for select authority/trust sections —
 * Phase R2.1/R3 §4. Pure CSS (radial gradient + the same hairline
 * pattern already used by ImagePlaceholder, at very low opacity) — no
 * bitmap asset, no JS, no animation. `pointer-events-none` and
 * `aria-hidden` since it's purely decorative. Must be layered behind
 * content (absolute, negative z-index within a `relative` parent) —
 * callers are responsible for giving their section `className="relative"`.
 */
export function TextureOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 32px), radial-gradient(ellipse at 20% 0%, currentColor 0%, transparent 60%)",
        color: "var(--color-accent-strong)",
      }}
    />
  );
}
```

- [ ] **Step 2: Apply it to 2-3 key authority-heavy sections**

Add `className="relative"` + `<TextureOverlay />` as the first child to: the homepage's `FeaturedProcedureSection` (`.section-dark` flagship band) and the About page's Credentials section (`.section-dark`). Do not apply it broadly — 2-3 sections only, per spec §4's "never feel like wallpaper."

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`. Browser-check both sections at 1440px and 390px — confirm the texture is genuinely subtle (barely perceptible, not a visible pattern competing with text), confirm no legibility regression.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/TextureOverlay.tsx src/components/sections/FeaturedProcedureSection.tsx "src/app/(marketing)/about/page.tsx"
git commit -m "feat(brand): add restrained texture overlay to 2 key authority sections"
```

---

## PART D — Text-wall reduction: pull-quote component

### Task D1: Add a reusable `PullQuote` component and apply it to 3 text-heavy pages

**Files:**
- Create: `src/components/ui/PullQuote.tsx`
- Modify: `src/app/(marketing)/about/page.tsx`, `src/app/(marketing)/mens-health/page.tsx`, `src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Reveal } from "@/components/motion/Reveal";

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <blockquote className="border-l-2 border-accent-strong py-1 pl-6 font-display text-xl italic leading-snug text-foreground sm:text-2xl">
        {children}
      </blockquote>
    </Reveal>
  );
}
```

- [ ] **Step 2: Apply on About** — insert after the narrative section, before "Medical Education & Training":
```tsx
<Container className="max-w-2xl py-section-y">
  <PullQuote>
    Penile girth enhancement is approached within an andrology and
    urology context — anatomy-led and medically supervised, never as a
    standalone cosmetic service.
  </PullQuote>
</Container>
```

- [ ] **Step 3: Apply on Men's Health** — insert after the diagnostic-narrative section:
```tsx
<Container className="max-w-2xl py-section-y">
  <PullQuote>
    Not every symptom means low testosterone, and not every low result
    automatically requires treatment.
  </PullQuote>
</Container>
```

- [ ] **Step 4: Apply on Penile Girth Enhancement** — insert between the "Options considered" section and the dark "Expected variability" section:
```tsx
<Container className="max-w-2xl py-14">
  <PullQuote>
    Results depend on anatomy, technique and the option chosen —
    outcomes are discussed individually, never promised in advance.
  </PullQuote>
</Container>
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add src/components/ui/PullQuote.tsx "src/app/(marketing)/about/page.tsx" "src/app/(marketing)/mens-health/page.tsx" "src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx"
git commit -m "feat(content): add PullQuote component, apply to About, Men's Health, Girth Enhancement"
```

---

## PART E — About page authority sequence + homepage authority/media layer

### Task E1: Reorder About into the recommended authority sequence + add AuthorityBlock

**Files:**
- Modify: `src/app/(marketing)/about/page.tsx`

- [ ] **Step 1: Add `AuthorityBlock` right after the hero** (before the narrative section) — same pattern as Task B2 in the R1-R2 plan:
```tsx
<section className="border-t border-border bg-background py-14">
  <Container>
    <AuthorityBlock />
  </Container>
</section>
```
Add import: `import { AuthorityBlock } from "@/components/ui/AuthorityBlock";`.

- [ ] **Step 2: Add `MediaAppearancesSection` after `RecognitionSection`** (both fully gated, so no visible change today, but the sequence is now: narrative → key facts (AuthorityBlock) → Medical Education → Credentials → Recognition → Media → closing CTA, matching spec §14):
```tsx
<RecognitionSection />
<MediaAppearancesSection />
```
Add import: `import { MediaAppearancesSection } from "@/components/sections/MediaAppearancesSection";`.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add "src/app/(marketing)/about/page.tsx"
git commit -m "feat(about): add AuthorityBlock and Media Appearances slot, complete the R2.1 authority sequence"
```

---

### Task E2: Homepage — consolidate Medical Training into a compact "Authority & Media" section

**Files:**
- Modify: `src/components/sections/MedicalTrainingSection.tsx` → rename to `src/components/sections/AuthorityMediaSection.tsx`
- Modify: `src/app/(marketing)/page.tsx`

**Rationale:** spec §13 asks for one compact homepage section combining Recognition + Media + Medical Training. Recognition and Media both render nothing today (no verified data), so in practice this section renders exactly what `MedicalTrainingSection` already rendered — but the component is now structured to grow into the full combination the moment Recognition/Media data exists, without another homepage restructure.

- [ ] **Step 1: Rename and extend the component**

```bash
git mv src/components/sections/MedicalTrainingSection.tsx src/components/sections/AuthorityMediaSection.tsx
```

```tsx
import { doctor } from "@/config/doctor";
import { mediaAppearances } from "@/config/mediaAppearances";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Compact homepage authority layer — Phase R2.1/R3 §13. Combines
 * Professional Recognition + Media/Editorial Contributions + Medical
 * Training in one section, per the brief, rather than three separate
 * homepage sections (which would re-lengthen the page the R1-R2
 * consolidation just shortened). Today, Recognition and Media both
 * have zero publish-ready entries, so this renders exactly the Medical
 * Training content alone — the structure is ready to grow the moment
 * real, verified Recognition/Media data exists, without another
 * homepage restructure.
 */
export function AuthorityMediaSection() {
  const publishableAwards = doctor.awards.filter((a) => a.publishReady);
  const publishableMedia = mediaAppearances.filter((m) => m.publishReady);
  const hasTraining = Boolean(doctor.medicalTrainer?.description);

  if (!hasTraining && publishableAwards.length === 0 && publishableMedia.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          {publishableAwards.length > 0 && (
            <p className="text-sm text-foreground">
              {publishableAwards.map((a) => `${a.officialTitle} — ${a.issuer}, ${a.year}`).join(" · ")}
            </p>
          )}
          {publishableMedia.length > 0 && (
            <p className="mt-3 text-sm text-foreground">
              {publishableMedia.map((m) => `${m.title} — ${m.outletName}`).join(" · ")}
            </p>
          )}
          {hasTraining && (
            <>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Medical Education &amp; Training
              </p>
              <p className="mt-6 text-body-lg text-muted-foreground">
                {doctor.medicalTrainer!.description}
              </p>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Update `page.tsx`**

Replace `import { MedicalTrainingSection } from "@/components/sections/MedicalTrainingSection";` with `import { AuthorityMediaSection } from "@/components/sections/AuthorityMediaSection";`, and `<MedicalTrainingSection />` with `<AuthorityMediaSection />`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`. Browser-check `/` — confirm the section still renders (Medical Training content, unchanged visually from before), confirm the homepage's section count/length is unaffected.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/AuthorityMediaSection.tsx "src/app/(marketing)/page.tsx"
git commit -m "feat(homepage): consolidate Medical Training into a growable Authority & Media section"
```

---

## PART F — Iconography for existing step sequences

### Task F1: Add restrained line icons to the Men's Health and Erectile Dysfunction step sequences

**Files:**
- Modify: `src/app/(marketing)/mens-health/page.tsx`
- Modify: `src/app/(marketing)/erectile-dysfunction/page.tsx`

- [ ] **Step 1: Men's Health diagnostic steps** — pair each of the 5 steps with a matching `lucide-react` icon (already a dependency): `Stethoscope` (Symptoms), `TestTube` (Hormonal assessment), `Activity` (Metabolic/medical contributors), `HeartPulse` (Sexual function), `ClipboardList` (Individual treatment strategy). Render each icon at `size={20}` in `text-accent-strong`, above the existing numbered index, not replacing it:
```tsx
import { Activity, ClipboardList, HeartPulse, Stethoscope, TestTube } from "lucide-react";

const diagnosticSteps = [
  { label: "Symptoms", icon: Stethoscope },
  { label: "Hormonal assessment", icon: TestTube },
  { label: "Metabolic / medical contributors", icon: Activity },
  { label: "Sexual function", icon: HeartPulse },
  { label: "Individual treatment strategy", icon: ClipboardList },
];
```
Update the `.map` to render `<step.icon aria-hidden size={20} className="text-accent-strong" />` above the existing number/label.

- [ ] **Step 2: ED treatment ladder (7 steps)** — same pattern, icons: `Activity` (Lifestyle), `Pill` (PDE5 inhibitors), `TestTube` (Hormonal treatment), `Wind` (Vacuum/device — use a neutral option, not a literal device icon), `Zap` (Shockwave), `Syringe` (Intracavernosal), `Stethoscope` (Implant surgery, reusing the assessment icon since surgery itself has no tasteful literal icon here — keep it abstract).

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add "src/app/(marketing)/mens-health/page.tsx" "src/app/(marketing)/erectile-dysfunction/page.tsx"
git commit -m "feat(content): add restrained line icons to Men's Health and ED step sequences"
```

---

## PART G — Insights template enrichment (optional fields, additive)

### Task G1: Add optional `keyTakeaway` field to articles + render support

**Files:**
- Modify: `src/content/insights/articles.ts`
- Modify: `src/app/(marketing)/insights/[slug]/page.tsx`

- [ ] **Step 1: Add the optional field to the type**

```ts
  /** Optional short "key takeaway" callout, rendered near the top of the article — additive, most articles won't set it. */
  keyTakeaway?: string;
```

- [ ] **Step 2: Set it on one representative article** ("What I Have Learned From 500+ Penile Girth Enhancement Procedures"):
```ts
    keyTakeaway:
      "Anatomical variability, not technique alone, is the biggest driver of how different two patients' results can look and feel.",
```

- [ ] **Step 3: Render it in the template**, right after `ArticleAuthorBlock` and before `ArticleVideoBlock`:
```tsx
{article.keyTakeaway && (
  <Container className="max-w-2xl">
    <PullQuote>{article.keyTakeaway}</PullQuote>
  </Container>
)}
```
Add import: `import { PullQuote } from "@/components/ui/PullQuote";`.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add src/content/insights/articles.ts "src/app/(marketing)/insights/[slug]/page.tsx"
git commit -m "feat(insights): add optional keyTakeaway field, applied to the 500+ procedures article"
```

---

## PART H — Documentation

### Task H1: Create `BRAND_AUTHORITY_ASSET_REQUIREMENTS.md`

**Files:**
- Create: `BRAND_AUTHORITY_ASSET_REQUIREMENTS.md`

- [ ] **Step 1: Write the file**, listing exactly what's still needed from the owner, matching `MEDIA_REQUIREMENTS.md`'s table-driven style: full logo file (status: owner saving separately, expected at `public/brand/logo-full.png`), AM symbol file (`public/brand/logo-symbol.png`), favicon regeneration from the AM symbol once available, real photography (already tracked in `MEDIA_REQUIREMENTS.md`, cross-referenced not duplicated), Men's Health collaboration exact wording + logo + link, Top Doctors Spain 2020 exact official title, Doctoralia Awards Spain 2022 exact official title, any other media outlet names/titles/years/URLs for `mediaAppearances`, Google Reviews or Doctoralia profile URL + current rating/count if intended to display, AndroMax Training URL (`doctor.medicalTrainer.programUrl`).

- [ ] **Step 2: Commit**

```bash
git add BRAND_AUTHORITY_ASSET_REQUIREMENTS.md
git commit -m "docs: add BRAND_AUTHORITY_ASSET_REQUIREMENTS.md tracking exactly which owner assets remain"
```

### Task H2: Update `IMPLEMENTATION_REPORT.md`, `POSITIONING_UX_REDESIGN_PLAN.md`, `SEO_AUDIT.md`

- [ ] Append a "Phase 12" section to `IMPLEMENTATION_REPORT.md` covering everything in Parts A-G, explicitly noting the logo-wiring deferral and why. Update `POSITIONING_UX_REDESIGN_PLAN.md`'s status note. Confirm `SEO_AUDIT.md` needs no change (no routes, no metadata changes this phase) or add a one-line confirmation note if useful.

---

## PART I — QA

### Task I1: Full verification pass

- [ ] Run `npx tsc --noEmit && npm run lint && npm run build` clean.
- [ ] Real-browser QA at 375/390/430/768/1024/1440/1728 on: Homepage, About, Male Aesthetics, Penile Girth Enhancement, Penile Filler Correction, Men's Health, Insights index, one Insight article — no overflow (768px specifically, given the R1-R2 QA finding), one H1, zero console errors, booking links intact, texture doesn't harm legibility at any width.
- [ ] Confirm every new gated component (`MediaAppearancesSection`, `PatientReviewsCta`, `RecognitionSection`) renders nothing anywhere it's placed.
- [ ] Confirm `.section-dark` sections read navy, not neutral black, at both viewports checked.

---

## Self-review notes

- **Spec coverage:** §1 (audit) → done via this planning pass itself, drawing on the Phase D audit already on file. §2 (logo) → Task A4, explicitly deferred. §3 (color) → Part B. §4 (texture) → Part C. §5 (motion) → judged already adequately covered by the existing Reveal/Stagger/MaskedReveal system plus Phase R1-R2's button hover work; no new task, noted in H2. §6 (text-wall) → Part D. §7-8 (About authority/recognition) → Part E + A3. §9 (media) → A1. §10 (Men's Health collaboration wording) → covered by A1's config structure; no hard-coded wording added anywhere, per the spec's own instruction to keep it config-driven and pending owner-approved wording. §11 (reviews) → A2. §12 (trust logo strip) → deferred alongside A4 (needs real logos same as the brand mark). §13 (homepage authority layer) → E2. §14 (About sequence) → E1. §15 (photography prep) → no new work; already fully covered by the existing `MEDIA_REQUIREMENTS.md` architecture, cross-referenced in H1. §16 (Insights) → Part G. §17 (iconography) → Part F. §18 (page-by-page) → distributed across B/C/D/E/F/G. §19-22 (responsive/performance/accessibility/SEO) → covered by Task I1 plus the CSS-only/no-new-dependency constraints already built into every task. §23 (config-driven) → Parts A/E/G. §24 (verification gates) → built into every new component from the start. §25-26 (QA/docs) → Parts H/I.
- **Placeholder scan:** no task uses "add appropriate X" phrasing; every component and config module is written out in full.
- **Type consistency:** `MediaAppearance`, `PatientReviewProfile`, and the `InsightArticle.keyTakeaway` field are each defined once and referenced identically wherever consumed.
