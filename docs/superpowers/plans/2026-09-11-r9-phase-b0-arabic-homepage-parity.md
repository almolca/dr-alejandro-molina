# R9 Phase B0 — Arabic Homepage Content & Visual Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `/ar` to genuine content and visual parity with the production English homepage `/`, replacing the Phase A pilot's 4-block `HomePageTemplate` with 10 dedicated Arabic section components mirroring the English homepage's real, permanent composition.

**Architecture:** One new Arabic component per English homepage section (`src/components/sections/ar/*SectionAr.tsx`), reusing the exact same shared primitives/imagery/illustrations as their English counterparts. Two shared primitives (`PhysicianAuthority`, `ClinicalDecisionFlow`) gain a `locale?: "ar"` prop, matching the pattern already used by `Faq`/`Header`. `HomePageTemplate`, `homeContentAr`, `HomePageContent` are retired (confirmed unused elsewhere). `src/app/(ar)/ar/(marketing)/page.tsx` is rewritten to compose the new sections in the same order as `src/app/(en)/(marketing)/page.tsx`, plus the existing bonus FAQ block, all wrapped in `visual.scope` (needed for the dark/olive section color overrides the flagship and booking sections rely on — the current pilot never wrapped in this scope because it never used those variants).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md` — read it first; this plan implements it task-by-task.

## Global Constraints

- No changes to any English route, English page content, or English page behavior — verify with `git diff` touching only `src/app/(ar)/**`, new `src/components/sections/ar/**` files, and the specific shared-primitive/CSS files named below.
- No invented `/ar/*` destination URLs — every internal link not yet backed by a live `arPath` in `src/lib/seo/routes.ts` points to its real English page (see spec §7 table).
- No new photography generated; reuse existing approved assets in `src/config/photography.ts` (`homeHero`, `homeClinical`), with Arabic `alt` overrides.
- No new claims, numbers, or credentials — every stat/award/credential renders from the same config the English components already read (`config/doctor.ts`, `config/reputation.ts`, `config/mediaAppearances.ts`, `config/practice.ts`); only surrounding prose is translated.
- This codebase has no unit/snapshot tests for presentational section components (confirmed: all 18 existing `*.test.ts` files cover `lib/`/`app/api` logic only) — verification per task is `npm run typecheck` (fast, catches prop/import errors) plus a final full `npm run build` + `npm run lint` + Playwright visual QA, not new unit tests. Do not invent tests for pure-JSX components; that would fight the codebase's established convention.
- Target branch: `feat/arabic-localization-r9-phase-b` (already created off `main` at `b11234e`). Deploy target: **Preview only**. Do not merge to `main`, do not deploy Production.

---

### Task 1: Extract shared Insights homepage-article data

English's `InsightsSection.tsx` hardcodes its 3 article teasers locally. `InsightsSectionAr` needs the same titles/tags/hrefs (spec §8: Arabic keeps the real English titles rather than inventing translated ones) — extracting to a shared module keeps both in sync with zero risk of drift, and is a zero-visual-change refactor for English.

**Files:**
- Create: `src/content/insights/homepage-featured.ts`
- Modify: `src/components/sections/InsightsSection.tsx`

**Interfaces:**
- Produces: `homepageFeaturedArticles: HomepageFeaturedArticle[]` (fields: `title: string`, `tag: string`, `href: string`, `featured?: boolean`), consumed by Task 14 (`InsightsSectionAr`).

- [ ] **Step 1: Create the shared data module**

```ts
// src/content/insights/homepage-featured.ts
export type HomepageFeaturedArticle = {
  title: string;
  tag: string;
  href: string;
  featured?: boolean;
};

/**
 * The homepage's 3 featured article teasers — shared between
 * `InsightsSection` (English) and `InsightsSectionAr` (R9 Phase B0) so
 * titles/tags/hrefs have one source of truth. No dates or bylines (spec:
 * "do not publish fake content dates or fake research claims").
 */
export const homepageFeaturedArticles: HomepageFeaturedArticle[] = [
  {
    title: "When Is a Penile Implant Considered for Erectile Dysfunction?",
    tag: "Penile Implant Surgery",
    href: "/insights/penile-implant-when-considered",
    featured: true,
  },
  {
    title: "Low Testosterone: Symptoms, Diagnosis and When Treatment Is Appropriate",
    tag: "Hormonal Health",
    href: "/insights/low-testosterone-symptoms-diagnosis",
  },
  {
    title: "Penile Girth Enhancement: What a Medical Assessment Should Consider",
    tag: "Male Genital Aesthetics",
    href: "/insights/penile-girth-enhancement-assessment",
  },
];
```

- [ ] **Step 2: Point `InsightsSection.tsx` at the shared module**

In `src/components/sections/InsightsSection.tsx`, replace the local `const articles = [...]` (lines 15–34) with:

```tsx
import { homepageFeaturedArticles as articles } from "@/content/insights/homepage-featured";
```

Remove the now-redundant inline comment block above the old `const articles` if it only documented that local array (keep it if it documents something still true of the section itself — check before deleting).

- [ ] **Step 3: Verify no visual change**

Run: `npm run typecheck`
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000/` in a browser, confirm the Insights section renders identically to before (3 article teasers, same titles/tags/links).

- [ ] **Step 4: Commit**

```bash
git add src/content/insights/homepage-featured.ts src/components/sections/InsightsSection.tsx
git commit -m "$(cat <<'EOF'
refactor(r9-b0): extract homepage Insights articles to shared content module

Prep for InsightsSectionAr (R9 Phase B0) — both English and Arabic
homepage Insights sections now read the same title/tag/href source
instead of risking drift between two hand-copied arrays.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add Arabic alt-text override to `HeroPortrait` and `PhotoFrame`

Spec §5/§9: "Alt text must be localized into Arabic where appropriate." Both components currently always render the English `alt` baked into `src/config/photography.ts`. Add an optional override prop rather than forking the image config.

**Files:**
- Modify: `src/components/editorial/HeroPortrait.tsx`
- Modify: `src/components/editorial/PhotoFrame.tsx`

**Interfaces:**
- Produces: `HeroPortrait({ slot, priority?, objectPosition?, alt? })`, `PhotoFrame({ slot, landscape?, priority?, tone?, alt? })` — new `alt?: string` prop on both, English call sites unaffected (prop omitted → same behavior as today).

- [ ] **Step 1: Add the `alt` prop to `HeroPortrait`**

```tsx
// src/components/editorial/HeroPortrait.tsx
import Image from "next/image";
import { photography } from "@/config/photography";
import styles from "./VisualSystem.module.css";

/**
 * Transparent-cutout physician portrait for hero compositions (Home,
 * About). Unlike PhotoFrame, this renders with no bordered box — the
 * source PNG's own transparency is meant to sit directly in the hero's
 * own atmosphere (see HeroAtmosphere), with a soft bottom fade instead
 * of a hard crop line. `objectPosition` is per-instance since each
 * portrait's headroom/crop needs are its own, not a shared default.
 */
export function HeroPortrait({
  slot,
  priority = false,
  objectPosition = "center 4%",
  alt,
}: {
  slot: keyof typeof photography;
  priority?: boolean;
  objectPosition?: string;
  /** Overrides the config's (English) alt text — used to localize alt text without forking the image asset (R9 Phase B0, spec §5). */
  alt?: string;
}) {
  const asset = photography[slot];
  const ready = asset.approved && asset.src?.startsWith("/images/");
  if (!ready || !asset.src) return null;
  return (
    <div className={styles.portrait} data-photo-slot={slot}>
      <Image
        src={asset.src}
        alt={alt ?? asset.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        preload={priority}
        style={{ objectFit: "cover", objectPosition }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add the same `alt` prop to `PhotoFrame`**

```tsx
// src/components/editorial/PhotoFrame.tsx
import Image from "next/image";
import { photography } from "@/config/photography";
import styles from "./VisualSystem.module.css";

/** A reserved photograph surface, never a synthetic portrait or decorative text panel. */
export function PhotoFrame({ slot, landscape = false, priority = false, tone = "light", alt }: {
  slot: keyof typeof photography;
  landscape?: boolean;
  priority?: boolean;
  /** "dark" sits this frame on a charcoal section — avoids a bright box pasted on a dark background. */
  tone?: "light" | "dark";
  /** Overrides the config's (English) alt text — used to localize alt text without forking the image asset (R9 Phase B0, spec §5). */
  alt?: string;
}) {
  const asset = photography[slot];
  const ready = asset.approved && asset.src?.startsWith("/images/");
  return (
    <div
      data-photo-slot={slot}
      className={`${styles.media} ${landscape ? styles.mediaLandscape : ""} ${tone === "dark" ? styles.mediaDark : ""}`}
      aria-hidden={!ready || undefined}
    >
      {ready && asset.src && (
        tone === "dark" ? (
          <div className={styles.mediaInset}>
            <Image src={asset.src} alt={alt ?? asset.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" preload={priority} />
          </div>
        ) : (
          <Image src={asset.src} alt={alt ?? asset.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" preload={priority} />
        )
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: no errors. All existing English call sites (`HeroSection`, `AboutSection`, and the other `PhotoFrame`/`HeroPortrait` consumers listed by `grep -rl "PhotoFrame\|HeroPortrait" src/components/sections`) omit `alt` and keep rendering the English config text exactly as before.

- [ ] **Step 4: Commit**

```bash
git add src/components/editorial/HeroPortrait.tsx src/components/editorial/PhotoFrame.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add alt-text override to HeroPortrait and PhotoFrame

Optional alt prop lets a locale render Arabic alt text against the
same shared (English) photography config, without forking image
assets. No behavior change when omitted.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add `locale="ar"` support to `PhysicianAuthority`

This is the authority-strip primitive (animated stats, award-logo recognition rail, medical-trainer rail) — the biggest single content/visual gap in the current `/ar` (spec §1, row 2). Needs Arabic labels while keeping every number/award/logo sourced from the same config.

**Files:**
- Modify: `src/components/editorial/PhysicianAuthority.tsx`

**Interfaces:**
- Produces: `PhysicianAuthority({ dark?, recognition?, locale? })` — new `locale?: "ar"` prop; omitted/undefined behaves identically to today.

- [ ] **Step 1: Add the `locale` prop and Arabic label table**

Replace the file's function signature and body per the diff below (imports, `AuthorityMetric`, `SINCE_STAT_COUNT_FROM`, `AWARD_LOGO_RATIOS` stay unchanged — only `PhysicianAuthority` itself changes):

```tsx
// src/components/editorial/PhysicianAuthority.tsx — full replacement of the PhysicianAuthority function only
/**
 * Arabic label/wording overrides (R9 Phase B0) — colocated here rather
 * than in `config/doctor.ts` / `config/reputation.ts` since these are
 * UI-facing translations of already-verified facts, not new source
 * data. Every value/number/award name itself still comes from the same
 * shared config the English render path uses — only the surrounding
 * prose is swapped.
 */
const AR = {
  yearsLabel: "سنوات الخبرة في المسالك البولية",
  girthProcedureLabel: "إجراءات زيادة سماكة القضيب",
  girthSinceLabel: "زيادة سماكة القضيب",
  girthSinceValue: (year: number) => `منذ ${year}`,
  girthSincePrefix: "منذ ",
  febuLine: "زميل المجلس الأوروبي لطب المسالك البولية",
  medicalTrainerLabel: "مدرّب طبي",
  medicalTrainerTrains: "يُدرّب أطباء المسالك البولية وأطباء التجميل",
  editorialWording: "مساهم في مجلة Men's Health إسبانيا",
  professionalRecognition: "الاعتراف المهني",
};

export function PhysicianAuthority({
  dark = false,
  recognition = false,
  locale,
}: {
  dark?: boolean;
  recognition?: boolean;
  locale?: "ar";
}) {
  const isAr = locale === "ar";
  return <div className={`${styles.authority} ${dark ? styles.authorityDark : ""}`}>
    <p className="mb-6 text-xs font-medium uppercase tracking-widest">{doctor.title}</p>
    <dl className={styles.metrics}>
      {doctor.yearsOfExperience !== undefined && (
        <AuthorityMetric
          value={`${doctor.yearsOfExperience}+`}
          label={isAr ? AR.yearsLabel : "Years in Urology"}
          animate={{ from: 0, to: doctor.yearsOfExperience, suffix: "+" }}
        />
      )}
      {doctor.girthProcedureCount && (
        <AuthorityMetric
          value={doctor.girthProcedureCount}
          label={isAr ? AR.girthProcedureLabel : "Penile Girth Enhancement procedures"}
          animate={{ from: 0, to: doctor.girthProcedureCountValue, suffix: "+" }}
        />
      )}
      {doctor.girthEnhancementSince !== undefined && (
        <AuthorityMetric
          value={isAr ? AR.girthSinceValue(doctor.girthEnhancementSince) : `Since ${doctor.girthEnhancementSince}`}
          label={isAr ? AR.girthSinceLabel : "Penile Girth Enhancement"}
          animate={{ from: SINCE_STAT_COUNT_FROM, to: doctor.girthEnhancementSince, prefix: isAr ? AR.girthSincePrefix : "Since " }}
        />
      )}
    </dl>
    <div className={styles.rail}>
      {doctor.credentials.includes("FEBU — Fellow of the European Board of Urology") && (
        <p><strong>FEBU</strong> · {isAr ? AR.febuLine : "Fellow of the European Board of Urology"}</p>
      )}
      {doctor.medicalTrainer && (
        <p className={styles.railItem}>
          {trainingPrograms[0]?.logoSrc && (
            <Image src={trainingPrograms[0].logoSrc} alt={trainingPrograms[0].program} width={32} height={32} className={styles.railLogo} />
          )}
          <span>
            <strong>{isAr ? AR.medicalTrainerLabel : "Medical Trainer"}</strong> · {doctor.medicalTrainer.program}
            <br />
            {isAr ? AR.medicalTrainerTrains : "Trains urologists & aesthetic physicians"}
          </span>
        </p>
      )}
      {editorialContributions.filter(item => item.publishReady).map((item) => {
        const publicationLogo = publications.find((pub) => pub.outletName === item.outletName)?.logoSrc;
        return (
          <p key={item.outletName} className={styles.railItem}>
            {publicationLogo && <Image src={publicationLogo} alt={item.outletName} width={57} height={32} className={styles.railLogo} />}
            <span>{isAr ? AR.editorialWording : item.wording}</span>
          </p>
        );
      })}
    </div>
    {recognition && (
      <div className={styles.recognitionRow}>
        <p className={styles.recognitionEyebrow}>{isAr ? AR.professionalRecognition : "Professional Recognition"}</p>
        <ul className={styles.recognitionRail} aria-label={isAr ? AR.professionalRecognition : "Professional recognition"}>
          {doctor.awards
            .filter((award) => award.publishReady)
            .map((award) => {
              const logoSrc = awardLogos[award.officialTitle];
              const ratio = AWARD_LOGO_RATIOS[award.officialTitle];
              return (
                <li key={award.officialTitle}>
                  {logoSrc && ratio ? (
                    <Image
                      src={logoSrc}
                      alt={award.officialTitle}
                      width={ratio.width}
                      height={ratio.height}
                      className={styles.recognitionLogo}
                    />
                  ) : (
                    award.officialTitle
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    )}
  </div>;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors. Confirm `AuthorityStripSection.tsx` (English, `src/components/sections/AuthorityStripSection.tsx`) still calls `<PhysicianAuthority recognition />` with no `locale` — output unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/PhysicianAuthority.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add locale=\"ar\" support to PhysicianAuthority

Arabic labels for the animated-stats/recognition-rail primitive,
colocated in the component since they're UI-facing translations of
facts already sourced from config/doctor.ts, config/reputation.ts and
config/mediaAppearances.ts — no new data, no change to English output.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Add `locale="ar"` support to `ClinicalDecisionFlow`

**Files:**
- Modify: `src/components/editorial/ClinicalDecisionFlow.tsx`

**Interfaces:**
- Produces: `ClinicalDecisionFlow({ locale? })` — new `locale?: "ar"` prop; omitted behaves identically to today.

- [ ] **Step 1: Add the prop and Arabic steps**

```tsx
// src/components/editorial/ClinicalDecisionFlow.tsx
import styles from "./VisualSystem.module.css";

const STEPS_EN = ["Symptoms", "History", "Examination", "Targeted tests", "Diagnosis", "Individual treatment plan"];
const STEPS_AR = ["الأعراض", "التاريخ المرضي", "الفحص السريري", "فحوصات موجّهة", "التشخيص", "خطة علاج فردية"];

/** An assessment sequence, not a promise that every patient needs every test. */
export function ClinicalDecisionFlow({ locale }: { locale?: "ar" } = {}) {
  const steps = locale === "ar" ? STEPS_AR : STEPS_EN;
  return <ol className={styles.flow} aria-label={locale === "ar" ? "تسلسل التقييم السريري" : "Clinical assessment sequence"}>
    {steps.map((step, index) => (
      <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
    ))}
  </ol>;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors. `SexualHormonalHealthSection.tsx` (English) calls `<ClinicalDecisionFlow />` with no args — output unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/ClinicalDecisionFlow.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add locale=\"ar\" support to ClinicalDecisionFlow

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Fix RTL logical-property bugs in `VisualSystem.module.css`

Spec §5: `.flow`/`.flow li::before` (used by `ClinicalDecisionFlow`, about to be reused under `dir="rtl"` for the first time in Task 10) and `.footerBrand` (sitewide, already live under `/ar` since Phase A) both use physical `left`/`padding-left`/`padding-right` instead of logical properties, so they don't mirror under `dir="rtl"`.

**Files:**
- Modify: `src/components/editorial/VisualSystem.module.css`

- [ ] **Step 1: Fix `.flow` and `.flow li::before`**

Find (around line 116):
```css
.flow li { position: relative; border-top: 1px solid #a8aca4; padding: 1.5rem 1.5rem 2rem 0; }
.flow li::before { content: ''; position: absolute; left: 0; top: -.2rem; width: .4rem; height: .4rem; background: #898e82; border-radius: 50%; }
```

Replace with:
```css
.flow li { position: relative; border-top: 1px solid #a8aca4; padding-block: 1.5rem 2rem; padding-inline: 0 1.5rem; }
.flow li::before { content: ''; position: absolute; inset-inline-start: 0; top: -.2rem; width: .4rem; height: .4rem; background: #898e82; border-radius: 50%; }
```

(Logical-property equivalent of the same LTR values: `padding-inline: 0 1.5rem` = `padding-left: 0; padding-right: 1.5rem` under `dir="ltr"`, matching the original shorthand exactly — English rendering is pixel-identical. Under `dir="rtl"` these now correctly flip to the reading-direction start/end instead of staying pinned physically left.)

- [ ] **Step 2: Fix `.footerBrand`**

Find (around line 135):
```css
.footerBrand { padding-right: 2rem; }
```

Replace with:
```css
.footerBrand { padding-inline-end: 2rem; }
```

- [ ] **Step 3: Verify English is visually unchanged**

Run: `npm run dev`, open `http://localhost:3000/` (any page using `SexualHormonalHealthSection` or the footer, e.g. `/`), confirm the clinical-flow numbered list and the footer brand column look pixel-identical to before.

- [ ] **Step 4: Commit**

```bash
git add src/components/editorial/VisualSystem.module.css
git commit -m "$(cat <<'EOF'
fix(r9-b0): use logical CSS properties for .flow and .footerBrand

Both used physical left/padding-left/padding-right, so they silently
broke under dir="rtl" — .footerBrand has been live-broken on /ar since
the Phase A pilot shipped, and .flow is about to be reused there for
the first time (SexualHormonalHealthSectionAr). Logical-property values
are chosen to match the original LTR shorthand exactly, so English
rendering is unchanged.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Build `HeroSectionAr`

Mirrors `HeroSection.tsx`. Adds the missing physician portrait and second CTA; upgrades the primary CTA wording to match English's "confidential" framing.

**Files:**
- Create: `src/components/sections/ar/HeroSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/HeroSectionAr.tsx
import visual from "@/components/editorial/VisualSystem.module.css";
import { BookingCta } from "@/components/ui/BookingCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { HeroPortrait } from "@/components/editorial/HeroPortrait";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

/**
 * R9 Phase B0 — Arabic mirror of `HeroSection`. `align="left"` on
 * `HeroAtmosphere` (English uses "right") because the grid's visual
 * column order flips under `dir="rtl"`: the portrait ends up on the
 * left, so the atmosphere plane leans the same way, matching the Phase
 * A pilot's existing choice. See spec §6/§7.
 */
export function HeroSectionAr() {
  return (
    <EditorialField>
      <HeroAtmosphere align="left" />
      <Container className={`${visual.heroGrid} relative z-10`}>
        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              استشاري أمراض المسالك البولية والذكورة · أبوظبي
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-display-2xl text-foreground">
              د. أليخاندرو مولينا
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              طب الذكورة · الصحة الجنسية للرجال · التجميل الذكوري
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
              رعاية متخصصة في الطب الجنسي، والصحة الهرمونية للرجال، وجراحة
              القضيب، والتجميل الذكوري، مع خبرة خاصة في زيادة سماكة القضيب.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                FEBU · زميل المجلس الأوروبي لطب المسالك البولية
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage="/ar" ctaPosition="hero" size="lg">
                احجز استشارتك السرية
              </BookingCta>
              {/* Temporary EN destination — no Arabic page yet, spec §7 */}
              <Button asChild variant="secondary" size="lg">
                <a href="/male-aesthetics/penile-girth-enhancement">
                  استكشف زيادة سماكة القضيب
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className={visual.heroMedia}>
          <MaskedReveal>
            <HeroPortrait
              slot="homeHero"
              priority
              objectPosition="center 4%"
              alt="صورة الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة"
            />
          </MaskedReveal>
        </div>
      </Container>
    </EditorialField>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors (component not yet wired into a page — this just confirms types/imports resolve).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/HeroSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add HeroSectionAr

Arabic mirror of HeroSection — adds the physician portrait and second
CTA the Phase A pilot's hero block was missing.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Build `AuthorityStripSectionAr`

**Files:**
- Create: `src/components/sections/ar/AuthorityStripSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/AuthorityStripSectionAr.tsx
import { PhysicianAuthority } from "@/components/editorial/PhysicianAuthority";
import { Container } from "@/components/ui/Container";

export function AuthorityStripSectionAr() {
  return <section className="py-8"><Container><PhysicianAuthority recognition locale="ar" /></Container></section>;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/AuthorityStripSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add AuthorityStripSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Build `FeaturedProcedureSectionAr`

The dark flagship band. Note the RTL-flipped divider (`border-r`/`pr-8` instead of English's `border-l`/`pl-8` — Tailwind's `border-l`/`pl-*` are physical utilities that do not mirror under `dir="rtl"`, and the grid's visual column order does flip, so the divider must flip with it) and the reading-direction-correct arrow (`←` instead of `→`, spec §5).

**Files:**
- Create: `src/components/sections/ar/FeaturedProcedureSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/FeaturedProcedureSectionAr.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BrandCurve } from "@/components/ui/BrandCurve";
import { Reveal } from "@/components/motion/Reveal";

/** Temporary EN destination for the CTA — no Arabic page yet, spec §7. */
export function FeaturedProcedureSectionAr() {
  return (
    <section className="section-dark relative overflow-hidden bg-background py-section-y text-foreground">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">الإجراء الرائد</p>
          <h2 className="mt-4 max-w-xl font-display text-display-xl">زيادة سماكة القضيب</h2>
          <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
            يقدّم د. مولينا إجراءً متخصصًا لزيادة سماكة القضيب باستخدام حمض
            الهيالورونيك، بإشراف استشاري مباشر — يُخطَّط وفق التشريح الفردي
            لكل حالة، مع توقعات واقعية ومتابعة متخصصة.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link>
          </Button>
        </Reveal>
        <div className="border-r border-accent-strong/50 pr-8">
          <BrandCurve className="mb-10 h-8 w-full text-accent-strong" />
          <p className="font-display text-3xl leading-snug">
            التشريح.<br />الدقة.<br /><em>استمرارية الرعاية.</em>
          </p>
          <p className="mt-6 text-sm text-muted-foreground">التقييم ← التخطيط الفردي ← المتابعة</p>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/FeaturedProcedureSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add FeaturedProcedureSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Build `CoreExpertiseSectionAr`

**Files:**
- Create: `src/components/sections/ar/CoreExpertiseSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/CoreExpertiseSectionAr.tsx
import visual from "@/components/editorial/VisualSystem.module.css";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const primaryAreas = [
  {
    number: "01",
    title: "ضعف الانتصاب وزراعة القضيب",
    description: "التشخيص قبل العلاج — من العلاج بمثبطات PDE5 إلى الدعامة القضيبية للحالات المستعصية.",
    href: "/erectile-dysfunction",
  },
  {
    number: "02",
    title: "التستوستيرون والصحة الهرمونية للرجال",
    description: "تقييم هرموني وأيضي شامل قبل النظر في أي علاج.",
    href: "/mens-health/testosterone",
  },
  {
    number: "03",
    title: "التجميل الذكوري",
    description: "نهج قائم على التشريح وتحت إشراف طبي لتجميل القضيب وتصحيحه.",
    href: "/male-aesthetics",
  },
  {
    number: "04",
    title: "خصوبة الرجل",
    description: "تحليل السائل المنوي، والتقييم الهرموني، وتقييم دوالي الخصية.",
    href: "/male-fertility",
  },
];

const secondaryLinks = [
  { label: "مرض بيروني", href: "/peyronies-disease" },
  { label: "دوبلر القضيب", href: "/erectile-dysfunction/penile-doppler" },
  { label: "سرعة القذف", href: "/sexual-medicine/premature-ejaculation" },
  { label: "دوالي الخصية", href: "/male-fertility/varicocele" },
  { label: "قطع القناة المنوية بدون مشرط", href: "/mens-health/vasectomy" },
];

/** Temporary EN destinations throughout — no Arabic pages yet, spec §7. */
export function CoreExpertiseSectionAr() {
  return (
    <section className="py-section-y">
      <Container>
        <SectionHeading eyebrow="مجالات الرعاية" heading="رعاية متخصصة لصحة الرجال" />

        <div className={visual.services}>
          <Link href="/male-aesthetics/penile-girth-enhancement" className={visual.serviceFeature}>
            <span className="text-xs uppercase tracking-widest">الإجراء الرائد</span>
            <div>
              <h3 className="font-display text-3xl">زيادة سماكة القضيب</h3>
              <p className="mt-4 text-sm text-stone-200">تخطيط قائم على التشريح ضمن ممارسة استشاري أمراض المسالك البولية والذكورة.</p>
            </div>
            <span className="mt-6 text-sm">استكشف الإجراء <span aria-hidden="true">↗</span></span>
          </Link>
          <div className={visual.serviceList}>
            {primaryAreas.map((area) => (
              <Link key={area.number} href={area.href} className={visual.serviceLink}>
                <span className={visual.serviceNumber} aria-hidden="true">{area.number}</span>
                <span>
                  <span className="block font-display text-xl">{area.title}</span>
                  <span className="mt-2 block max-w-lg text-sm text-muted-foreground">{area.description}</span>
                </span>
                <ArrowUpRight aria-hidden size={18} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">أيضًا يُقيَّم</span>
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/CoreExpertiseSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add CoreExpertiseSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Build `SexualHormonalHealthSectionAr`

Uses the now-locale-aware `ClinicalDecisionFlow` (Task 4) and the now-RTL-fixed `.flow` CSS (Task 5). Flips the contributors list's physical `border-l`/`pl-8`/`-left-[...]` to `border-r`/`pr-8`/`-right-[...]` for the same reason as Task 8.

**Files:**
- Create: `src/components/sections/ar/SexualHormonalHealthSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/SexualHormonalHealthSectionAr.tsx
import { ClinicalDecisionFlow } from "@/components/editorial/ClinicalDecisionFlow";
import visual from "@/components/editorial/VisualSystem.module.css";
import { VascularFlowDiagram } from "@/components/illustrations/VascularFlowDiagram";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const contributors = ["وعائي", "هرموني", "أيضي", "عصبي", "مرتبط بالأدوية", "نفسي-جنسي"];

const pillars = [
  "الأعراض",
  "التستوستيرون الكلي والحر",
  "الغلوبولين الرابط للهرمونات الجنسية (SHBG)",
  "الهرمون الملوتن / الهرمون المنبه للجريب (LH/FSH)",
  "البرولاكتين",
  "الغدة الدرقية",
  "الصحة الأيضية",
  "النوم",
  "خطط الإنجاب",
];

/** Temporary EN destinations for both links — no Arabic pages yet, spec §7. */
export function SexualHormonalHealthSectionAr() {
  return (
    <section className={`${visual.clinicalBand} py-section-y`}>
      <Container>
        <SectionHeading eyebrow="الصحة الجنسية والهرمونية" heading="التشخيص قبل العلاج، في الاتجاهين" />

        <ClinicalDecisionFlow locale="ar" />

        <div className="mt-10 grid gap-16 border-t border-border pt-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h3 className="font-display text-display-md text-foreground">
              ضعف الانتصاب يستحق تشخيصًا، لا مجرد وصفة علاجية
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              قد يكون لضعف الانتصاب أسباب وعائية أو هرمونية أو أيضية أو عصبية
              أو مرتبطة بالأدوية أو نفسية-جنسية. يُختار العلاج وفقًا للسبب
              الكامن، والتاريخ المرضي، والأولويات الفردية لكل مريض.
            </p>
            <StaggerGroup className="relative mt-8 border-r border-border pr-8">
              {contributors.map((item) => (
                <StaggerItem key={item} className="relative py-2">
                  <span className="absolute -right-[calc(2rem+3px)] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-strong" />
                  <span className="text-sm text-foreground">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link
                href="/erectile-dysfunction"
                className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                استكشف ضعف الانتصاب
              </Link>
            </div>
            <VascularFlowDiagram className="mt-10 h-20 w-32 text-muted-foreground" />
          </Reveal>

          <Reveal delay={0.05}>
            <blockquote className="font-display text-display-md italic leading-snug text-foreground">
              الأعراض أولًا.
              <br />
              والأرقام تحتاج إلى سياق.
            </blockquote>
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              ما يأخذه التقييم بعين الاعتبار
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {pillars.map((pillar) => (
                <li key={pillar} className="border-b border-border px-1 py-2 text-sm text-foreground">
                  {pillar}
                </li>
              ))}
            </ul>
            <Link
              href="/mens-health/testosterone"
              className="mt-8 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              استكشف الصحة الهرمونية للرجال
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/SexualHormonalHealthSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add SexualHormonalHealthSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Build `AdvancedPenileSurgerySectionAr`

**Files:**
- Create: `src/components/sections/ar/AdvancedPenileSurgerySectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/AdvancedPenileSurgerySectionAr.tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const facts = [
  {
    title: "الدعامات القابلة للنفخ",
    description: "أجهزة من قطعتين أو ثلاث قطع، مصممة لمحاكاة الصلابة والارتخاء الطبيعيين بدقة.",
  },
  {
    title: "الدعامات القابلة للثني",
    description: "قضبان شبه صلبة يمكن توجيهها يدويًا، دون أجزاء ميكانيكية.",
  },
];

const steps = [
  "الاستشارة",
  "التقييم الهرموني والأيضي",
  "تقييم الأوعية الدموية القضيبية عند الحاجة",
  "استراتيجية علاج فردية",
];

/** Temporary EN destinations for both links — no Arabic pages yet, spec §7. */
export function AdvancedPenileSurgerySectionAr() {
  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow="جراحة القضيب المتقدمة"
          heading="خيار نهائي، يُتوصَّل إليه عبر التقييم"
          description="تُعد جراحة زراعة القضيب خيارًا مدروسًا في مرحلة لاحقة — يُتوصَّل إليه بعد تقييم منظم، ولا يُطرح كخطوة أولى."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2">
          {facts.map((fact) => (
            <StaggerItem key={fact.title}>
              <h3 className="font-display text-xl text-foreground">{fact.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{fact.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-14 border-t border-border pt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">كيف يتم تأكيد السبب أولًا</p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, index) => (
              <StaggerItem key={step}>
                <span className="font-display text-2xl text-accent-strong">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 max-w-[20ch] text-sm text-foreground">{step}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
            <Link href="/penile-implant" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
              استكشف زراعة القضيب
            </Link>
            <Link
              href="/erectile-dysfunction/penile-doppler"
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              الموجات فوق الصوتية الدوبلر للقضيب
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/AdvancedPenileSurgerySectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add AdvancedPenileSurgerySectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Build `AboutSectionAr`

Uses the `alt` override from Task 2. Keeps the same `lg:order-first` photo placement as English (a deliberate non-mirrored composition choice — see spec §5 note on `AboutSection`), since CSS `order` doesn't interact with `dir` and changing it would be arbitrary rather than principled.

**Files:**
- Create: `src/components/sections/ar/AboutSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/AboutSectionAr.tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

const highlightLabels = [
  "Hospital Clínic Barcelona training",
  "FEBU — Fellow of the European Board of Urology",
  "Advanced laparoscopic surgery",
  "Practicing in the United Arab Emirates",
];

const HIGHLIGHTS_AR: Record<string, string> = {
  "Hospital Clínic Barcelona training": "تدريب في مستشفى كلينيك برشلونة",
  "FEBU — Fellow of the European Board of Urology": "FEBU — زميل المجلس الأوروبي لطب المسالك البولية",
  "Advanced laparoscopic surgery": "جراحة متقدمة بالمنظار",
  "Practicing in the United Arab Emirates": "يمارس الطب في دولة الإمارات العربية المتحدة",
};

const highlights = doctor.credentials
  .filter((c) => highlightLabels.includes(c))
  .map((c) => HIGHLIGHTS_AR[c]);

/** Temporary EN destination — no Arabic /about yet, spec §7. */
export function AboutSectionAr() {
  return (
    <section className="py-section-y">
      <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <MaskedReveal className="order-last w-full lg:order-first">
          <PhotoFrame slot="homeClinical" landscape alt="الدكتور أليخاندرو مولينا في إطار العمل السريري" />
        </MaskedReveal>

        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">نبذة عن د. مولينا</p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">
              تدريب أوروبي. خلفية جراحية. تركيز متخصص على صحة الرجل.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
              {highlights.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              تعرّف على د. مولينا
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/AboutSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add AboutSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Build `AuthorityMediaSectionAr`

**Files:**
- Create: `src/components/sections/ar/AuthorityMediaSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/AuthorityMediaSectionAr.tsx
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { verifiedReviewTotal } from "@/config/reputation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const REVIEW_HEADLINE_AR = "أكثر من 450 تقييمًا من المرضى عبر منصات مستقلة";
const EDITORIAL_WORDING_AR = "مساهم في مجلة Men's Health إسبانيا";

/**
 * Arabic mirror of `AuthorityMediaSection`. Award names (e.g. "Top
 * Doctors Spain 2020") are kept verbatim — proper nouns, not
 * translated — matching how the Phase A pilot's existing trust block
 * already handled them. `mediaAppearances` is currently an empty array
 * in production (see config/mediaAppearances.ts) so, like the English
 * component, this renders nothing for that block until it's populated.
 */
export function AuthorityMediaSectionAr() {
  const publishableAwards = doctor.awards.filter((a) => a.publishReady);
  const publishableEditorial = editorialContributions.filter((e) => e.publishReady);
  const hasTraining = Boolean(doctor.medicalTrainer?.description);
  const hasReviews = verifiedReviewTotal > 0;

  if (!hasTraining && publishableAwards.length === 0 && !hasReviews) {
    return null;
  }

  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          {publishableAwards.length > 0 && (
            <p className="mb-3 text-sm text-foreground">
              {publishableAwards.map((a) => a.officialTitle).join(" · ")}
            </p>
          )}
          {hasReviews && <p className="mb-3 text-sm text-foreground">{REVIEW_HEADLINE_AR}</p>}
          {publishableEditorial.length > 0 && (
            <p className="mt-3 text-sm text-foreground">{EDITORIAL_WORDING_AR}</p>
          )}
          {hasTraining && (
            <>
              <p className="mt-8 text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">التعليم والتدريب الطبي</p>
              <h2 className="mt-4 font-display text-display-md">{doctor.medicalTrainer.program}</h2>
              <p className="mt-6 text-body-lg text-muted-foreground">
                إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا متخصصًا في
                تقنيات تجميل القضيب لأطباء المسالك البولية وأطباء التجميل من
                خلال برنامج AndroMax Training.
              </p>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/AuthorityMediaSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add AuthorityMediaSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Build `InsightsSectionAr`

Uses the shared article data from Task 1. Implements the spec §8 bilingual-honesty decision: Arabic chrome, English article titles/tags kept verbatim (with `dir="ltr"` on each title for correct bidi rendering), plus one explicit Arabic notice that these particular articles are English-only for now.

**Files:**
- Create: `src/components/sections/ar/InsightsSectionAr.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ar/InsightsSectionAr.tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { homepageFeaturedArticles as articles } from "@/content/insights/homepage-featured";

/**
 * Arabic mirror of `InsightsSection`. Article titles/tags are kept in
 * English — they're real, specific published titles with no Arabic
 * article at the linked URL yet; inventing Arabic titles would imply a
 * translated article that doesn't exist. See spec §8.
 */
export function InsightsSectionAr() {
  return (
    <section className="py-section-y">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">مقالات ورؤى</p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">رؤى في طب الذكورة وصحة الرجل</h2>
          </div>
          <Link href="/insights" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
            جميع المقالات
          </Link>
        </Reveal>

        <p className="mt-6 text-xs text-muted-foreground">
          المقالات التالية متاحة حاليًا باللغة الإنجليزية فقط
        </p>

        <div className="mt-10 grid gap-x-16 gap-y-12 border-t border-border pt-12 lg:grid-cols-2">
          {articles
            .filter((a) => a.featured)
            .map((article) => (
              <Reveal key={article.href} className="lg:row-span-2">
                <Link href={article.href} className="group block card-hover rounded-sm p-2 -m-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">{article.tag}</span>
                  <h3
                    dir="ltr"
                    className="mt-4 text-start font-display text-display-md leading-tight text-foreground transition-colors group-hover:text-accent-strong"
                  >
                    {article.title}
                  </h3>
                </Link>
              </Reveal>
            ))}

          <div className="flex flex-col divide-y divide-border">
            {articles
              .filter((a) => !a.featured)
              .map((article, index) => (
                <Reveal key={article.href} delay={0.05 * (index + 1)} className="py-8 first:pt-0">
                  <Link href={article.href} className="group block card-hover rounded-sm p-2 -m-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">{article.tag}</span>
                    <h3
                      dir="ltr"
                      className="mt-3 text-start font-display text-xl leading-snug text-foreground transition-colors group-hover:text-accent-strong sm:text-2xl"
                    >
                      {article.title}
                    </h3>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ar/InsightsSectionAr.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): add InsightsSectionAr

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Build `BookingSectionAr` and the Arabic FAQ content module

Adds the "View NMC Profile" secondary link the current pilot's booking block was missing. Also relocates the 3 existing FAQ items out of the about-to-be-retired `homeContentAr` into a small dedicated module, unchanged.

**Files:**
- Create: `src/components/sections/ar/BookingSectionAr.tsx`
- Create: `src/content/ar/homeFaq.ts`

- [ ] **Step 1: Create `BookingSectionAr`**

```tsx
// src/components/sections/ar/BookingSectionAr.tsx
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function BookingSectionAr() {
  return (
    <section className="section-olive bg-background py-section-y text-foreground">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">الاستشارة</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-display-xl text-foreground">
            استشر د. أليخاندرو مولينا في أبوظبي
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground">
            مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BookingCta sourcePage="/ar" ctaPosition="closing-section" size="lg">
              احجز استشارة
            </BookingCta>
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
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Create the Arabic FAQ content module**

```ts
// src/content/ar/homeFaq.ts
import type { FaqItem } from "@/components/ui/Faq";

/**
 * The Arabic homepage's FAQ block — additive relative to the English
 * homepage (which has no homepage FAQ section at all), carried over
 * unchanged from the R9 Phase A pilot. See spec §1 (Arabic-only row)
 * and §9 (FAQPage schema is unaffected — same 3 items, same wording).
 */
export const homeFaqItemsAr: FaqItem[] = [
  {
    question: "ماذا يحدث خلال الاستشارة الأولى؟",
    answer:
      "تتضمن الاستشارة الأولى مناقشة سرية لحالتك الصحية وأهدافك، وقد يوصي د. مولينا بفحوصات إضافية حسب الحاجة. كل خطة علاجية تُبنى على تقييم فردي دقيق.",
  },
  {
    question: "هل تُعامل استشارتي بسرية تامة؟",
    answer: "نعم. جميع المعلومات التي تشاركها تُعامل بسرية تامة وفقًا لأعلى معايير الخصوصية الطبية.",
  },
  {
    question: "كيف يمكنني الحجز؟",
    answer:
      "يمكنك حجز استشارة عبر هذا الموقع، وستتم إحالتك إلى نظام الحجز الرسمي لمستشفى إن إم سي رويال لإتمام الموعد.",
  },
];
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ar/BookingSectionAr.tsx src/content/ar/homeFaq.ts
git commit -m "$(cat <<'EOF'
feat(r9-b0): add BookingSectionAr and Arabic homepage FAQ content module

BookingSectionAr adds the "View NMC Profile" secondary link the pilot's
booking block was missing. homeFaq.ts relocates the pilot's 3 FAQ items
out of the about-to-be-retired homeContentAr/HomePageTemplate, content
unchanged.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Assemble the Arabic homepage and retire `HomePageTemplate`/`homeContentAr`/`HomePageContent`

Composes all 10 new sections (plus the bonus FAQ) in the same order as `src/app/(en)/(marketing)/page.tsx`, wrapped in `visual.scope` — required for `FeaturedProcedureSectionAr`'s `.section-dark` and `BookingSectionAr`'s `.section-olive` color overrides to apply (defined in `VisualSystem.module.css`'s `.scope :global(.section-dark)` / `.scope :global(.section-olive)` rules); the Phase A pilot never wrapped in this scope because it never used those section variants.

**Files:**
- Modify: `src/app/(ar)/ar/(marketing)/page.tsx`
- Delete: `src/components/templates/HomePageTemplate.tsx`
- Delete: `src/content/ar/home.ts`
- Modify: `src/content/types.ts` (remove `HomePageContent` — confirmed unused elsewhere by Task-0 grep in the spec's §2)

- [ ] **Step 1: Rewrite the Arabic homepage page**

```tsx
// src/app/(ar)/ar/(marketing)/page.tsx
import type { Metadata } from "next";
import visual from "@/components/editorial/VisualSystem.module.css";
import { buildMetadata } from "@/lib/seo/metadata";
import { homeFaqItemsAr } from "@/content/ar/homeFaq";
import { Faq } from "@/components/ui/Faq";
import { HeroSectionAr } from "@/components/sections/ar/HeroSectionAr";
import { AuthorityStripSectionAr } from "@/components/sections/ar/AuthorityStripSectionAr";
import { FeaturedProcedureSectionAr } from "@/components/sections/ar/FeaturedProcedureSectionAr";
import { CoreExpertiseSectionAr } from "@/components/sections/ar/CoreExpertiseSectionAr";
import { SexualHormonalHealthSectionAr } from "@/components/sections/ar/SexualHormonalHealthSectionAr";
import { AdvancedPenileSurgerySectionAr } from "@/components/sections/ar/AdvancedPenileSurgerySectionAr";
import { AboutSectionAr } from "@/components/sections/ar/AboutSectionAr";
import { AuthorityMediaSectionAr } from "@/components/sections/ar/AuthorityMediaSectionAr";
import { InsightsSectionAr } from "@/components/sections/ar/InsightsSectionAr";
import { BookingSectionAr } from "@/components/sections/ar/BookingSectionAr";

export const metadata: Metadata = buildMetadata({
  title: "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة، أبوظبي",
  description:
    "رعاية متخصصة في الطب الجنسي، الصحة الهرمونية للرجال، جراحة القضيب، الخصوبة، والتجميل الذكوري في أبوظبي، الإمارات العربية المتحدة.",
  path: "/ar",
});

/**
 * R9 Phase B0 — full Arabic homepage, mirroring the English homepage's
 * 10-section composition (`src/app/(en)/(marketing)/page.tsx`) 1:1,
 * plus one Arabic-only FAQ block (no English-homepage equivalent).
 * Wrapped in `visual.scope` like the English page — required for the
 * dark/olive section color overrides used below. See
 * `docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md`.
 */
export default function ArabicHomePage() {
  return (
    <div className={visual.scope}>
      <HeroSectionAr />
      <AuthorityStripSectionAr />
      <FeaturedProcedureSectionAr />
      <CoreExpertiseSectionAr />
      <SexualHormonalHealthSectionAr />
      <AdvancedPenileSurgerySectionAr />
      <AboutSectionAr />
      <AuthorityMediaSectionAr />
      <InsightsSectionAr />
      <Faq items={homeFaqItemsAr} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />
      <BookingSectionAr />
    </div>
  );
}
```

- [ ] **Step 2: Delete the retired template/content files**

```bash
git rm src/components/templates/HomePageTemplate.tsx src/content/ar/home.ts
```

- [ ] **Step 3: Remove `HomePageContent` from `src/content/types.ts`**

Since `src/content/types.ts` currently exports only `HomePageContent`, and nothing references it after Step 2, delete the file entirely:

```bash
git rm src/content/types.ts
```

(If a future Phase B page still wants a typed-content-module pattern for a different page family, that type gets reintroduced then, scoped to what it actually needs — not kept around unused.)

- [ ] **Step 4: Verify nothing else references the retired files**

Run: `grep -rn "HomePageTemplate\|HomePageContent\|homeContentAr\|content/types" src --include="*.ts" --include="*.tsx"`
Expected: no matches.

- [ ] **Step 5: Typecheck and build**

Run: `npm run typecheck`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds, `/ar` listed in the route output.

- [ ] **Step 6: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000/ar`. Confirm all 10 sections render in order, RTL layout looks correct, no console errors, images load, FAQ accordion still works.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(ar\)/ar/\(marketing\)/page.tsx
git commit -m "$(cat <<'EOF'
feat(r9-b0): assemble full Arabic homepage; retire HomePageTemplate

/ar now composes the same 10 sections as the English homepage (plus
the existing bonus FAQ block), wrapped in visual.scope so the dark
flagship and olive booking sections render with correct colors.
HomePageTemplate, homeContentAr and the HomePageContent type are
retired — confirmed unused elsewhere; the Phase A pilot's own code
comment called this an "intentionally reduced representative subset,"
which this task replaces with real section parity.

Closes the Phase B0 parity gap documented in
docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Full-suite verification

**Files:** none (verification only).

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors. Fix any RTL-file-specific lint issues (e.g. unused imports left over from the `HomePageTemplate` deletion) before proceeding.

- [ ] **Step 3: Unit tests**

Run: `npm run test`
Expected: all existing 18 test files still pass — none of them touch the files changed in this plan, so this is a regression guard, not new coverage.

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: succeeds; both `/` and `/ar` appear in the build's route list; no new build warnings introduced by this plan's files.

- [ ] **Step 5: Commit (only if lint/build required fixes)**

If Steps 1–4 required any fixes, stage and commit them:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(r9-b0): address lint/typecheck/build findings from Phase B0 review

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

If no fixes were needed, skip this step (no empty commit).

---

### Task 18: Responsive QA — screenshot comparison and parity report sign-off

Spec §10/§11. Uses the Playwright MCP tools already available in this environment.

**Files:**
- Create: `qa/r9-phase-b0/` (screenshots)
- Modify: `docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md` (check off §11 exit criteria, note any QA findings)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)

- [ ] **Step 2: Capture screenshots at all 4 breakpoints, both routes**

For each width in `390, 768, 1024, 1440`: use `mcp__plugin_playwright_playwright__browser_resize` to set the viewport, `browser_navigate` to `http://localhost:3000/` then `http://localhost:3000/ar`, and `browser_take_screenshot` (full page) for each, saving to `qa/r9-phase-b0/{width}-en.png` and `qa/r9-phase-b0/{width}-ar.png`.

- [ ] **Step 3: Check the spec's §10 checklist at each breakpoint**

For each of the 8 screenshot pairs, confirm: comparable content completeness (10 sections + Ar's bonus FAQ, both visible), comparable visual richness (dark flagship band and olive booking band render with correct colors — validates Task 16's `visual.scope` wrap), images present (hero portrait, clinical photo, award/training/publication logos), no horizontal overflow, no broken media (broken-image icons), RTL mirroring correct on `/ar` (text right-aligned, `SexualHormonalHealthSectionAr`'s contributor list dot on the correct side, `FeaturedProcedureSectionAr`'s divider on the correct side), English screenshots pixel-comparable to before this plan (Tasks 1–5 were designed to be zero-visual-change for English — use this step to confirm that held).

- [ ] **Step 4: Record findings and check off exit criteria**

In `docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md` §11, check off each exit-criteria box only once confirmed by this QA pass; if anything fails, fix it (new task, or amend the relevant existing task's file) before checking that box.

- [ ] **Step 5: Commit**

```bash
git add qa/r9-phase-b0/ docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md
git commit -m "$(cat <<'EOF'
docs(r9-b0): responsive QA screenshots and parity exit-criteria sign-off

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 19: Push branch and confirm Preview deployment

Per the owner's explicit instruction: Preview only, no merge to `main`, no Production deploy without owner review.

**Files:** none.

- [ ] **Step 1: Push the branch**

Run: `git push -u origin feat/arabic-localization-r9-phase-b`

- [ ] **Step 2: Confirm the Preview deployment**

If this repo's Vercel project is reachable via the `claude.ai Vercel` MCP connector, use it (`list_projects` → `list_deployments` for this branch, or `deploy_to_vercel`) to confirm a Preview deployment was created for the pushed branch/commit and to get its URL. Otherwise, note in the final summary that the branch is pushed and Vercel's GitHub integration (if configured) will create the Preview automatically — ask the owner for the Preview URL if it can't be confirmed programmatically.

- [ ] **Step 3: Report to the owner**

Summarize: branch pushed, Preview URL (if obtained), parity spec file location, and an explicit reminder that merge/Production deploy require owner review per the brief.

Do not open a PR, merge, or deploy Production as part of this task unless the owner explicitly asks for that next.
