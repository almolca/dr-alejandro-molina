# Phase C — Topical Authority Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deepen topical authority around Dr Alejandro Molina / Penile Girth Enhancement / Penile Filler Correction / Abu Dhabi by (a) shipping a video-ready Insights architecture, (b) closing genuine content gaps in the Penile Girth Enhancement cluster with 5 new articles (not 8 — 3 are rejected as duplicative, documented below), (c) hardening GEO/AEO readability on the flagship pages via direct-answer FAQ + read-more links + a real related-articles system, and (d) producing a Search Console monitoring plan — without redesigning the site, adding routes, enabling PRP, or publishing unverified awards.

**Architecture:** This is a content-and-config change, not a structural one. Everything hangs off the existing `InsightArticle` data model in `src/content/insights/articles.ts` (extended with two new optional fields), the existing `FaqItem` model in `src/components/ui/Faq.tsx` (extended with one optional field), and two new small presentational components that follow the codebase's established fail-safe pattern (render `null`/nothing when the backing data is absent, exactly like `AuthorityStripSection` and `RecognitionSection` already do). No new routes are created; `insights/[slug]` is already dynamic, so 5 new articles just need new entries in the existing content array.

**Tech Stack:** Next.js 16 (App Router), TypeScript strict, Tailwind CSS 4, Radix UI Accordion, `motion`. No test runner is configured in this repo (see `package.json` — only `lint`, `typecheck`, `build`). Verification convention here is `tsc --noEmit` + `eslint` + `next build` + real-browser QA (Playwright), per `IMPLEMENTATION_REPORT.md`'s documented QA method — not unit tests. Every task below ends with that verification cycle, not a TDD unit test cycle.

**Spec:** The Phase C prompt (owner-supplied, not a repo file) + `SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md` + `SEO_RESTRUCTURE_GAP_ANALYSIS.md` + `CLINICAL_CONTENT_REVIEW.md` (existing repo docs this plan continues from). Context-recovery findings (Phase A/B already fully implemented and verified) are folded into this plan's Global Constraints and are not re-verified from scratch — see Task 16 for the one remaining audit pass.

## Global Constraints

- `features.prpPage` stays `false`. Do not touch `src/config/features.ts`, do not add `/erectile-dysfunction/prp` anywhere.
- `doctor.awards[].publishReady` stays `false` on both entries. Do not touch `src/config/doctor.ts` awards data, `RecognitionSection.tsx`, or `awardEntries()` in `json-ld.ts`.
- Do not create `/penile-girth-enhancement-abu-dhabi`, `/male-genital-aesthetics`, `/penile-filler-correction-abu-dhabi`, or any Dubai/second-location page. No new routes are created in this plan at all — only new `insightArticles` entries (served by the existing `insights/[slug]` dynamic route) and edits to existing pages.
- Every new/edited Insights article entry has `clinicalReviewRequired: true`.
- Do not fabricate statistics, complication rates, study citations, longevity numbers, or patient outcomes. Where clinical mechanism is stated (e.g. "hyaluronidase breaks down hyaluronic acid"), state it as a general, non-patient-specific pharmacological fact only — never a specific timeframe, success rate, or outcome number.
- Do not invent video URLs, YouTube/Vimeo IDs, or thumbnails. The video architecture ships with zero populated `video` fields; every new component must render nothing when `article.video` is undefined.
- `bookingUrl` and `physicianProfileUrl` stay exactly as configured in `src/config/practice.ts` — no task in this plan touches that file.
- `NEXT_PUBLIC_SITE_URL` is intentionally out of scope for this plan (documented launch blocker, not a Phase C task).
- Of the 8 candidate articles in the owner's brief, this plan builds 5 and explicitly rejects 3 (Task 10 preamble documents the reasoning) — do not build the rejected 3 as part of any task below.

---

## Overlap audit — which of the 8 candidate articles get built

Read in full: all 11 existing `insightArticles` bodies (`src/content/insights/articles.ts`), the flagship `/male-aesthetics/penile-girth-enhancement` page, and the `/male-aesthetics/penile-filler-correction` page.

**Build (5):**
1. Penile Filler Migration: What Patients Should Know — migration is only a one-line list item on the Correction page (`presentations` array) and a passing mention in `what-happens-to-penile-filler-over-time`; no article explains what it is, why it happens, or how it differs from normal settling. Genuine gap.
2. Penile Filler Nodules and Irregularities — same situation: one line on the Correction page, no depth anywhere. Genuine gap.
3. Can Penile Filler Be Dissolved? — the Correction page has a one-paragraph "Dissolution" option and one FAQ answer ("Is dissolution always the right approach?") but nothing explains what dissolution actually is (hyaluronidase) or what happens afterward. High-intent standalone query, complements rather than duplicates the Correction page.
4. Why Can Penile Filler Feel Different Between Patients? — distinct from "how much girth" (volume) and "weeks to settle" (timing); no existing content addresses tactile/texture variability specifically. Genuine gap, reinforces the anatomical-variability theme.
5. What I Have Learned From 500+ Penile Girth Enhancement Procedures — explicitly requested with special framing (Task 14); no equivalent reflective/experience piece exists.

**Do not build (3) — document why:**
1. **Penile Filler vs Fat Transfer** — fat transfer is not a technique Dr Molina offers or that appears anywhere else on the site. Writing an authoritative comparison would require making clinical claims about a procedure not performed here, which the spec's "do not fabricate" rule and `doctor.ts`'s "don't invent beyond verified source material" convention both rule out. It would also dilute topical focus on HA filler rather than reinforcing it.
2. **Is Penile Girth Enhancement Safe?** — this is the flagship page's own "Risks, Aftercare and Revision" section and FAQ in everything but name. A separate article targeting the same query would cannibalize the money page. Instead: Task 8 adds a direct, concise "Is penile girth enhancement safe?" FAQ entry to the flagship page itself (GEO-friendly direct-answer pattern) rather than forking a competing page.
3. **Penile Filler Correction: When Is It Necessary?** — this is verbatim the Correction page's own thesis ("Not Every Concern Needs Immediate Action" section + "When should I have previous penile filler assessed?" FAQ). Building it as a separate article would violate the Phase B principle, already established in this codebase, that "penile filler complications are covered within that page, not a separate page." Direct duplicate intent.

---

### Task 1: Extend the Insights content model (video + related-articles fields)

**Files:**
- Modify: `src/content/insights/articles.ts:1-56` (type definitions + new helper, appended after `getInsightArticle`)

**Interfaces:**
- Produces: `InsightVideo` type, `InsightArticle.video?: InsightVideo`, `InsightArticle.relatedArticleSlugs?: string[]`, `getRelatedArticles(article: InsightArticle): InsightArticle[]` — consumed by Task 3 (`ArticleVideoBlock`), Task 4 (`RelatedInsights`), Task 5 (wiring).

- [ ] **Step 1: Add the `InsightVideo` type and extend `InsightArticle`**

In `src/content/insights/articles.ts`, after the existing `InsightSection` type (currently lines 27-30) and before `export type InsightArticle = {`, add:

```ts
/**
 * Optional video metadata for an Insights article — Phase C video-ready
 * architecture. Every field is populated only when a real, owner-supplied
 * video exists; nothing here should ever be invented (no placeholder
 * YouTube/Vimeo URLs). `ArticleVideoBlock` renders nothing when an
 * article has no `video` field at all.
 */
export type InsightVideo = {
  title: string;
  /** Real hosted video URL (YouTube, Vimeo, or self-hosted file) — never invented. */
  url: string;
  thumbnailUrl?: string;
  /** Short summary shown near the video, distinct from the full transcript. */
  summary?: string;
  /** Full transcript text, for accessibility and search — not auto-generated filler. */
  transcript?: string;
  durationMinutes?: number;
};
```

Then extend `InsightArticle` (currently lines 32-51) by adding two optional fields after `secondaryRelatedLabel?: string;` and before `sections: InsightSection[];`:

```ts
  /** Optional physician video — see `InsightVideo`. Omitted on every article until a real video exists. */
  video?: InsightVideo;
  /**
   * Slugs of 2-4 other `insightArticles` this one is most thematically
   * related to, for the on-page "Related Insights" section (Task 4).
   * Optional/additive — the 5 pre-existing non-cluster articles don't
   * need it.
   */
  relatedArticleSlugs?: string[];
```

- [ ] **Step 2: Add `getRelatedArticles` helper**

At the end of the file, after the existing `getInsightArticle` function, add:

```ts
/**
 * Resolves `article.relatedArticleSlugs` to real `InsightArticle` objects,
 * capped at 4. Silently drops any slug that doesn't resolve (defensive —
 * matches the fail-safe pattern used elsewhere in this codebase, e.g.
 * `AuthorityStripSection`'s empty-array guard) rather than throwing, so a
 * future typo in a slug degrades gracefully instead of breaking the page.
 */
export function getRelatedArticles(article: InsightArticle): InsightArticle[] {
  if (!article.relatedArticleSlugs) return [];
  return article.relatedArticleSlugs
    .map((slug) => getInsightArticle(slug))
    .filter((related): related is InsightArticle => Boolean(related) && related.slug !== article.slug)
    .slice(0, 4);
}
```

- [ ] **Step 3: Verify**

Run: `cd /Users/alejandro/Projects/andrologist && npx tsc --noEmit`
Expected: no new errors (existing 11 articles are unaffected since both new fields are optional).

- [ ] **Step 4: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): add optional video and related-article fields to content model"
```

---

### Task 2: Add `videoObjectSchema()` builder

**Files:**
- Modify: `src/lib/seo/json-ld.ts` (append after `articleSchema`)

**Interfaces:**
- Consumes: nothing new.
- Produces: `videoObjectSchema(input)` — consumed by Task 5.

- [ ] **Step 1: Add the builder**

At the end of `src/lib/seo/json-ld.ts`, after `articleSchema`, add:

```ts
/**
 * VideoObject schema — Phase C video-ready architecture. Callers must
 * only invoke this when `article.video` AND `article.video.thumbnailUrl`
 * both exist (Google's structured-data guidelines treat `thumbnailUrl`
 * as required for VideoObject) — see the guard in `insights/[slug]/page.tsx`.
 * Never called speculatively; with no real videos yet, this function is
 * simply unreachable in production until owner-supplied video content
 * exists.
 */
export function videoObjectSchema(input: {
  video: { title: string; url: string; thumbnailUrl?: string; summary?: string };
  datePublished: string;
}) {
  return prune({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.video.title,
    description: input.video.summary || input.video.title,
    thumbnailUrl: input.video.thumbnailUrl,
    uploadDate: input.datePublished,
    contentUrl: input.video.url,
  });
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo/json-ld.ts
git commit -m "feat(seo): add videoObjectSchema builder for video-ready Insights architecture"
```

---

### Task 3: Build `ArticleVideoBlock` component

**Files:**
- Create: `src/components/sections/ArticleVideoBlock.tsx`

**Interfaces:**
- Consumes: `InsightArticle["video"]` (Task 1's `InsightVideo` type).
- Produces: `ArticleVideoBlock({ video }: { video?: InsightVideo })` — consumed by Task 5.

- [ ] **Step 1: Write the component**

```tsx
import type { InsightVideo } from "@/content/insights/articles";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Optional physician-video block for an Insights article — Phase C.
 * Renders nothing when the article has no `video` field, exactly like
 * `AuthorityStripSection`'s empty-metrics guard. Never fabricates a
 * thumbnail or embed — if `thumbnailUrl` is absent, the card falls back
 * to a plain text link rather than a broken image.
 */
export function ArticleVideoBlock({ video }: { video?: InsightVideo }) {
  if (!video) return null;

  return (
    <Reveal>
      <div className="border-y border-border py-8">
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
          Watch
        </p>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          {video.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-auto w-full max-w-xs rounded-md border border-border sm:w-48"
            />
          )}
          <div>
            <h3 className="font-display text-lg text-foreground underline decoration-accent-strong underline-offset-4">
              {video.title}
            </h3>
            {video.summary && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {video.summary}
              </p>
            )}
            {video.durationMinutes && (
              <p className="mt-1 text-xs text-muted-foreground">
                {video.durationMinutes} min
              </p>
            )}
          </div>
        </a>
        {video.transcript && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Read transcript
            </summary>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {video.transcript}
            </p>
          </details>
        )}
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/sections/ArticleVideoBlock.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ArticleVideoBlock.tsx
git commit -m "feat(insights): add ArticleVideoBlock component (renders nothing without video data)"
```

---

### Task 4: Build `RelatedInsights` component

**Files:**
- Create: `src/components/sections/RelatedInsights.tsx`

**Interfaces:**
- Consumes: `InsightArticle[]` (from Task 1's `getRelatedArticles`).
- Produces: `RelatedInsights({ articles }: { articles: InsightArticle[] })` — consumed by Task 5.

- [ ] **Step 1: Write the component**

```tsx
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { InsightArticle } from "@/content/insights/articles";

/**
 * "Related Insights" section for an article page — spec Phase C §7:
 * "Relevant Insights should show 2-4 related articles." Renders nothing
 * when there are none (fail-safe pattern, same as `AuthorityStripSection`),
 * so the 6 pre-existing non-cluster articles with no `relatedArticleSlugs`
 * simply omit this section rather than showing an empty band.
 */
export function RelatedInsights({ articles }: { articles: InsightArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
          Related Insights
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {articles.map((article) => (
            <Reveal key={article.slug}>
              <Link href={`/insights/${article.slug}`} className="group block">
                <h3 className="font-display text-lg text-foreground transition-colors group-hover:text-accent-strong">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/components/sections/RelatedInsights.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/RelatedInsights.tsx
git commit -m "feat(insights): add RelatedInsights component for cross-article internal linking"
```

---

### Task 5: Wire video block, related insights, and video schema into the article page

**Files:**
- Modify: `src/app/(marketing)/insights/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ArticleVideoBlock` (Task 3), `RelatedInsights` + `getRelatedArticles` (Task 4/1), `videoObjectSchema` (Task 2).

- [ ] **Step 1: Add imports**

At the top of `src/app/(marketing)/insights/[slug]/page.tsx`, add to the existing import block:

```ts
import { ArticleVideoBlock } from "@/components/sections/ArticleVideoBlock";
import { RelatedInsights } from "@/components/sections/RelatedInsights";
import { getInsightArticle, getRelatedArticles, insightArticles } from "@/content/insights/articles";
import { articleSchema, breadcrumbSchema, videoObjectSchema } from "@/lib/seo/json-ld";
```

(This replaces the existing `import { getInsightArticle, insightArticles } from "@/content/insights/articles";` and `import { articleSchema, breadcrumbSchema } from "@/lib/seo/json-ld";` lines — merge rather than duplicate.)

- [ ] **Step 2: Build the optional video schema and pass it into `JsonLd`**

Inside `InsightArticlePage`, after `const path = ...` and before the `return`, add:

```ts
  const relatedArticles = getRelatedArticles(article);
  // Google's structured-data guidelines require thumbnailUrl for VideoObject —
  // only emit the schema when both video and a real thumbnail exist.
  const videoSchema =
    article.video?.thumbnailUrl
      ? videoObjectSchema({ video: article.video, datePublished: article.datePublished })
      : undefined;
```

Then update the `JsonLd` call's `data` array (currently `[breadcrumbSchema(...), articleSchema(...)]`) to:

```tsx
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          articleSchema({
            headline: article.title,
            description: article.excerpt,
            path,
            datePublished: article.datePublished,
          }),
          ...(videoSchema ? [videoSchema] : []),
        ]}
      />
```

- [ ] **Step 3: Render the video block after the author block**

Immediately after the existing `<ArticleAuthorBlock />` `</Container>` block (right before the `{/* Body */}` comment), add:

```tsx
      {article.video && (
        <Container className="max-w-2xl">
          <ArticleVideoBlock video={article.video} />
        </Container>
      )}
```

- [ ] **Step 4: Render Related Insights before the closing CTA**

Immediately before the existing `<RelatedTreatments ... />` element, add:

```tsx
      <RelatedInsights articles={relatedArticles} />
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three pass clean. Then run `npm run dev` and open `http://localhost:3000/insights/how-long-does-penile-filler-last` — confirm the page renders exactly as before (no video block, no Related Insights section yet, since no article has either field populated until Task 6/10-14).

- [ ] **Step 6: Commit**

```bash
git add src/app/\(marketing\)/insights/\[slug\]/page.tsx
git commit -m "feat(insights): wire video block, related insights, and VideoObject schema into article page"
```

---

### Task 6: Add `relatedArticleSlugs` across the existing Penile Girth Enhancement cluster

**Files:**
- Modify: `src/content/insights/articles.ts` (6 Phase B article objects + the original `penile-girth-enhancement-assessment` article)

**Interfaces:**
- Consumes: Task 1's `relatedArticleSlugs?: string[]` field. No consumers yet reference the 5 new slugs added here (they're created in Tasks 10-14) — Step 1 below only cross-links among the 7 articles that already exist; Task 15 adds the reverse links to/from the 5 new articles once they exist.

- [ ] **Step 1: Add `relatedArticleSlugs` to the 7 existing girth-cluster articles**

In `src/content/insights/articles.ts`, add a `relatedArticleSlugs` line to each of these 7 existing article objects (insert right after each one's `secondaryRelatedLabel` line, or after `relatedLabel` if it has no secondary link):

- `penile-girth-enhancement-assessment` → add:
  ```ts
    relatedArticleSlugs: ["how-much-girth-can-penile-filler-add", "how-long-does-penile-filler-last"],
  ```
- `how-much-girth-can-penile-filler-add` → add:
  ```ts
    relatedArticleSlugs: ["how-much-hyaluronic-acid-used-penile-girth-enhancement", "penile-girth-enhancement-assessment"],
  ```
- `how-much-hyaluronic-acid-used-penile-girth-enhancement` → add:
  ```ts
    relatedArticleSlugs: ["how-much-girth-can-penile-filler-add", "how-long-does-penile-filler-last"],
  ```
- `how-long-does-penile-filler-last` → add:
  ```ts
    relatedArticleSlugs: ["what-happens-to-penile-filler-over-time", "why-penile-filler-takes-weeks-to-settle"],
  ```
- `what-happens-to-penile-filler-over-time` → add:
  ```ts
    relatedArticleSlugs: ["why-penile-filler-takes-weeks-to-settle", "how-long-does-penile-filler-last"],
  ```
- `when-can-you-have-sex-after-penile-girth-enhancement` → add:
  ```ts
    relatedArticleSlugs: ["why-penile-filler-takes-weeks-to-settle", "how-long-does-penile-filler-last"],
  ```
- `why-penile-filler-takes-weeks-to-settle` → add:
  ```ts
    relatedArticleSlugs: ["what-happens-to-penile-filler-over-time", "when-can-you-have-sex-after-penile-girth-enhancement"],
  ```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (all referenced slugs already exist in the file).

- [ ] **Step 3: Manually spot-check in-browser**

Run: `npm run dev`, open `http://localhost:3000/insights/how-long-does-penile-filler-last` — confirm a "Related Insights" section now appears near the bottom with 2 cards, correctly titled and linked.

- [ ] **Step 4: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): cross-link the existing Penile Girth Enhancement article cluster"
```

---

### Task 7: Add optional read-more link to `FaqItem`

**Files:**
- Modify: `src/components/ui/Faq.tsx`

**Interfaces:**
- Produces: `FaqItem.readMoreHref?: string`, `FaqItem.readMoreLabel?: string` — consumed by Task 8/9/15.

- [ ] **Step 1: Extend the type and render the link**

Change line 10 from:
```ts
export type FaqItem = { question: string; answer: string };
```
to:
```ts
export type FaqItem = {
  question: string;
  answer: string;
  /** Optional "short answer → read more" link into a deeper Insights article (spec Phase C §6/§7). */
  readMoreHref?: string;
  readMoreLabel?: string;
};
```

Then change the `Accordion.Content` block (currently just `<p className="max-w-2xl">{item.answer}</p>`) to:

```tsx
              <Accordion.Content className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-none data-[state=open]:pb-6">
                <p className="max-w-2xl">{item.answer}</p>
                {item.readMoreHref && item.readMoreLabel && (
                  <Link
                    href={item.readMoreHref}
                    className="mt-3 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    {item.readMoreLabel}
                  </Link>
                )}
              </Accordion.Content>
```

This requires importing the internal link component — add to the top of the file:
```ts
import { InternalLink as Link } from "@/components/ui/InternalLink";
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. All existing `FaqItem` usages across the site (flagship page, correction page, and any other page using `<Faq>`) are unaffected since both new fields are optional.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Faq.tsx
git commit -m "feat(faq): support optional read-more link into deeper Insights content"
```

---

### Task 8: Add direct-answer safety FAQ + read-more wiring on the flagship Girth Enhancement page

**Files:**
- Modify: `src/app/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx:90-121` (`faqItems` array)

- [ ] **Step 1: Add a new FAQ item and wire two read-more links**

Replace the `faqItems` array with (changes: new first-position safety FAQ answering the AEO query "is penile girth enhancement safe?" with a direct answer before elaboration; `readMoreHref`/`readMoreLabel` added to the two FAQs where a deeper Insights article already exists):

```ts
const faqItems = [
  {
    question: "Is penile girth enhancement safe?",
    answer:
      "No aesthetic or medical procedure is entirely risk-free. Performed within a Consultant Urologist & Andrologist's practice, with anatomy-led assessment beforehand, risks such as swelling, bruising, asymmetry or irregularity are discussed and reviewed individually — not eliminated. See Risks, Aftercare and Revision below for detail.",
  },
  {
    question: "How much size increase can I expect?",
    answer:
      "Specific outcome measurements aren't published here, since results depend on individual anatomy, technique and the option chosen. This is discussed in detail, and in context, at consultation.",
    readMoreHref: "/insights/how-much-girth-can-penile-filler-add",
    readMoreLabel: "Read more: How Much Girth Can Penile Filler Actually Add?",
  },
  {
    question: "Is this surgical or non-surgical?",
    answer:
      "Both are considered. Non-surgical options, including hyaluronic acid-based augmentation, are more commonly discussed first; surgical approaches are only offered where currently approved and clinically appropriate.",
  },
  {
    question: "What if I've had a bad experience with filler elsewhere?",
    answer:
      "Previous procedures, including those performed elsewhere, are assessed individually — revision is considered where appropriate.",
    readMoreHref: "/male-aesthetics/penile-filler-correction",
    readMoreLabel: "Explore Penile Filler Correction",
  },
  {
    question: "Is the result permanent?",
    answer:
      "This depends on the option chosen and is discussed individually. Hyaluronic acid-based results are not typically permanent, for example, while other options may differ.",
    readMoreHref: "/insights/how-long-does-penile-filler-last",
    readMoreLabel: "Read more: How Long Does Penile Filler Last?",
  },
  {
    question: "What does aftercare involve?",
    answer:
      "Aftercare guidance is specific to the procedure performed and is provided as part of your individual treatment plan.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a consultation to assess anatomy, goals and suitability before any option is planned.",
  },
];
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean. `faqPageSchema(faqItems)` (called inside `<Faq>`) automatically includes the new question in `FAQPage` JSON-LD since it derives from the same array — no separate schema edit needed.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/male-aesthetics/penile-girth-enhancement/page.tsx
git commit -m "feat(girth-page): add direct-answer safety FAQ and read-more links into Insights cluster"
```

---

### Task 9: Add migration FAQ + prep read-more wiring on the Filler Correction page

**Files:**
- Modify: `src/app/(marketing)/male-aesthetics/penile-filler-correction/page.tsx:94-125` (`faqItems` array)

- [ ] **Step 1: Add a new "Can penile filler migrate?" FAQ item**

Insert a new item into `faqItems`, right after the existing "When should I have previous penile filler assessed?" item:

```ts
  {
    question: "Can penile filler migrate?",
    answer:
      "Yes — product can move from its original treatment area, which is one of the presentations assessment looks for. This is a different pattern from the normal, gradual settling that follows treatment, and it's assessed individually rather than assumed from a general description.",
    readMoreHref: "/insights/penile-filler-migration-what-to-know",
    readMoreLabel: "Read more: Penile Filler Migration — What Patients Should Know",
  },
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: **this will not yet fail** (TypeScript doesn't validate that the href points to a real route), but the link will 404 until Task 10 creates the article. This is intentional ordering — Task 10 must land before this page is QA'd in a browser. Note this dependency and proceed.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/male-aesthetics/penile-filler-correction/page.tsx
git commit -m "feat(correction-page): add migration FAQ with read-more link (article added in Task 10)"
```

---

### Task 10: Write article — "Penile Filler Migration: What Patients Should Know"

**Files:**
- Modify: `src/content/insights/articles.ts` (add new `PUBLISHED_PHASE_C` date constant + new article object)

- [ ] **Step 1: Add the `PUBLISHED_PHASE_C` constant**

Immediately after the existing `PUBLISHED_PHASE_B` constant (line 55), add:

```ts
/** Real date this batch of Phase C (topical-authority expansion) articles was added. */
const PUBLISHED_PHASE_C = "2026-09-06";
```

- [ ] **Step 2: Add the article**

Add a new comment divider `// --- Phase C: topical authority expansion ---` after the closing `},` of the last Phase B article (`why-penile-filler-takes-weeks-to-settle`) and before the closing `];` of `insightArticles`, then add:

```ts
  {
    slug: "penile-filler-migration-what-to-know",
    title: "Penile Filler Migration: What Patients Should Know",
    category: "Male Aesthetics",
    excerpt:
      "Product moving from where it was originally placed is one of the more specific reasons for assessment after penile filler. Here's what migration actually means, and how it differs from normal settling.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-filler-correction",
    relatedLabel: "Penile Filler Correction",
    secondaryRelatedHref: "/male-aesthetics/penile-girth-enhancement",
    secondaryRelatedLabel: "Penile Girth Enhancement",
    relatedArticleSlugs: [
      "why-penile-filler-takes-weeks-to-settle",
      "what-happens-to-penile-filler-over-time",
      "penile-filler-nodules-and-irregularities",
    ],
    sections: [
      {
        heading: "What migration means",
        body: [
          "Migration refers to filler product moving away from where it was originally placed, rather than staying within the treated area as intended. It's a specific finding, distinct from the general softening and settling that's a normal part of the process for every patient.",
        ],
      },
      {
        heading: "Why it can happen",
        body: [
          "Several factors can contribute, including the technique used, the specific product's characteristics, how the tissue responds individually, and mechanical forces on the area over time. This is discussed in general terms because the relevant factors — and whether any of them apply — are specific to each presentation, not something a general article can determine.",
        ],
      },
      {
        heading: "How migration differs from normal settling",
        body: [
          "The early weeks after treatment involve expected swelling and settling — see our related article on why penile filler can take several weeks to settle. Migration is a different pattern: it tends to present as new asymmetry or a change in a specific area, and it can appear later, after the initial settling period is already complete, rather than during it.",
        ],
      },
      {
        heading: "What assessment and correction involve",
        body: [
          "If migration is suspected, assessment starts with history and examination, with ultrasound used where it helps clarify the location and extent of the finding. From there, options are considered individually — including observation, dissolution or revision — at our Penile Filler Correction page, rather than assumed in advance from this article alone.",
        ],
      },
    ],
  },
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean build. Run `npm run dev`, open `http://localhost:3000/insights/penile-filler-migration-what-to-know` — confirm it renders with correct title, both related-treatment links, a 3-card Related Insights section, and the "Clinical review pending" badge. Then re-check `http://localhost:3000/male-aesthetics/penile-filler-correction` — the Task 9 FAQ read-more link should now resolve correctly instead of 404ing.

- [ ] **Step 4: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): add Penile Filler Migration article (Phase C)"
```

---

### Task 11: Write article — "Penile Filler Nodules and Irregularities"

**Files:**
- Modify: `src/content/insights/articles.ts` (add article object, after the migration article)

- [ ] **Step 1: Add the article**

```ts
  {
    slug: "penile-filler-nodules-and-irregularities",
    title: "Penile Filler Nodules and Irregularities",
    category: "Male Aesthetics",
    excerpt:
      "A firm area or an uneven contour after penile filler isn't automatically a problem, but it's not something to self-diagnose either. Here's how these findings are actually assessed.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-filler-correction",
    relatedLabel: "Penile Filler Correction",
    secondaryRelatedHref: "/male-aesthetics/penile-girth-enhancement",
    secondaryRelatedLabel: "Penile Girth Enhancement",
    relatedArticleSlugs: [
      "penile-filler-migration-what-to-know",
      "why-penile-filler-takes-weeks-to-settle",
    ],
    sections: [
      {
        heading: "What a nodule is",
        body: [
          "A nodule is a discrete firm area that can develop at or near an injection site. An irregularity more broadly can also mean an uneven contour or a texture that feels inconsistent with the surrounding tissue, rather than a single firm lump specifically.",
        ],
      },
      {
        heading: "Possible contributing factors",
        body: [
          "Product distribution during treatment, individual tissue response, and how the treated area has settled can all contribute to how a nodule or irregularity develops. As with migration, which factor is relevant for a given presentation is an individual question, not a general one.",
        ],
      },
      {
        heading: "Normal early firmness versus a reasonable trigger for assessment",
        body: [
          "Some firmness is expected in the early weeks as swelling resolves and the product integrates with surrounding tissue. A new nodule that appears well after that settling period, or an irregularity that doesn't gradually soften the way the rest of the result does, is a more reasonable trigger for assessment than firmness noticed in the first days or weeks.",
        ],
      },
      {
        heading: "What assessment and treatment may involve",
        body: [
          "Assessment starts with history and examination, with ultrasound used where it helps clarify a finding. From there, the same range of options considered for other presentations applies — observation, dissolution, or revision — set out in full at our Penile Filler Correction page, and chosen based on the specific finding rather than a fixed rule.",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean. Browser-check `http://localhost:3000/insights/penile-filler-nodules-and-irregularities`.

- [ ] **Step 3: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): add Penile Filler Nodules and Irregularities article (Phase C)"
```

---

### Task 12: Write article — "Can Penile Filler Be Dissolved?"

**Files:**
- Modify: `src/content/insights/articles.ts` (add article object, after the nodules article)

- [ ] **Step 1: Add the article**

```ts
  {
    slug: "can-penile-filler-be-dissolved",
    title: "Can Penile Filler Be Dissolved?",
    category: "Male Aesthetics",
    excerpt:
      "Short answer: hyaluronic acid-based penile filler can generally be dissolved, though whether it's the right option depends on assessment. Here's what dissolution actually involves.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-filler-correction",
    relatedLabel: "Penile Filler Correction",
    secondaryRelatedHref: "/male-aesthetics/penile-girth-enhancement",
    secondaryRelatedLabel: "Penile Girth Enhancement",
    relatedArticleSlugs: [
      "penile-filler-nodules-and-irregularities",
      "penile-filler-migration-what-to-know",
    ],
    sections: [
      {
        heading: "The short answer",
        body: [
          "Hyaluronic acid-based penile filler can generally be dissolved using hyaluronidase, an enzyme that breaks down hyaluronic acid. Whether dissolution is the right option for a given presentation — rather than observation or revision — is an assessed decision, not an automatic one.",
        ],
      },
      {
        heading: "What dissolution actually involves",
        body: [
          "Hyaluronidase works specifically on hyaluronic acid-based products; it doesn't affect the body's own tissue the same way. In practice, this means dissolution is a targeted option for hyaluronic acid filler specifically, assessed and planned around the individual presentation rather than applied as a blanket first step.",
        ],
      },
      {
        heading: "What to expect afterward",
        body: [
          "The tissue moves gradually back toward its pre-treatment state rather than changing instantly. Whether any further treatment is considered afterward — and when — is a separate decision made at follow-up, based on the result and the patient's own goals, not assumed as an automatic next step.",
        ],
      },
      {
        heading: "When dissolution may not be the first choice",
        body: [
          "Not every finding needs dissolution. Some are better suited to observation, and others to revision rather than dissolution alone — the full range of options, and how the choice is actually made, is set out at our Penile Filler Correction page.",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean. Browser-check `http://localhost:3000/insights/can-penile-filler-be-dissolved`.

- [ ] **Step 3: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): add Can Penile Filler Be Dissolved article (Phase C)"
```

---

### Task 13: Write article — "Why Can Penile Filler Feel Different Between Patients?"

**Files:**
- Modify: `src/content/insights/articles.ts` (add article object, after the dissolution article)

- [ ] **Step 1: Add the article**

```ts
  {
    slug: "why-penile-filler-feels-different-between-patients",
    title: "Why Can Penile Filler Feel Different Between Patients?",
    category: "Male Aesthetics",
    excerpt:
      "Two patients can have a broadly similar treatment and still describe the result differently. Here's why comparing texture and feel between patients isn't a reliable way to judge an outcome.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    relatedArticleSlugs: [
      "how-much-girth-can-penile-filler-add",
      "why-penile-filler-takes-weeks-to-settle",
    ],
    sections: [
      {
        heading: "Anatomy varies between patients",
        body: [
          "Baseline tissue thickness, elasticity and sensitivity all vary from one individual to another. Because filler integrates with a patient's own tissue, the same product and volume can reasonably feel different depending on that underlying anatomy — this isn't a sign that something has been done differently or incorrectly.",
        ],
      },
      {
        heading: "Technique and placement play a role",
        body: [
          "How and where product is placed also affects how it's felt afterward. This is one of the reasons treatment planning is anatomy-led rather than standardised — the plan for a given patient is built around their own anatomy, not a fixed technique applied uniformly.",
        ],
      },
      {
        heading: "Settling stage affects feel as much as appearance",
        body: [
          "Texture, like appearance, changes as swelling resolves and the product settles over the following weeks — see our related article on why penile filler can take several weeks to settle. Comparing feel before that process has completed adds another variable on top of individual anatomy.",
        ],
      },
      {
        heading: "Why comparing results between patients isn't meaningful",
        body: [
          "Given how many individual factors are involved, one patient's description of feel doesn't reliably predict another's experience — the same honest reasoning already applied to size outcomes on the Penile Girth Enhancement page applies here too. What matters for any one patient is discussed and reviewed individually, at consultation and follow-up.",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean. Browser-check `http://localhost:3000/insights/why-penile-filler-feels-different-between-patients`.

- [ ] **Step 3: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): add Why Penile Filler Feels Different Between Patients article (Phase C)"
```

---

### Task 14: Write article — "What I Have Learned From 500+ Penile Girth Enhancement Procedures" (special framing)

**Files:**
- Modify: `src/content/insights/articles.ts` (add article object, after the "feels different" article)

**Constraint specific to this task:** the spec explicitly requires this article NOT read as self-promotion, testimonial marketing, or anecdote-as-science. The first section must explicitly distinguish personal clinical experience from published evidence, and no section may present experience as guideline-level evidence.

- [ ] **Step 1: Add the article**

```ts
  {
    slug: "lessons-from-500-penile-girth-enhancement-procedures",
    title: "What I Have Learned From 500+ Penile Girth Enhancement Procedures",
    category: "Male Aesthetics",
    excerpt:
      "Clinical observations and practical considerations from substantial procedure experience — offered as personal clinical experience, not as published evidence or a guideline.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    relatedArticleSlugs: [
      "penile-girth-enhancement-assessment",
      "why-penile-filler-feels-different-between-patients",
      "why-penile-filler-takes-weeks-to-settle",
    ],
    sections: [
      {
        heading: "Personal clinical experience, not a clinical study",
        body: [
          "What follows is drawn from personal clinical experience across a substantial number of penile girth enhancement procedures — observations and practical considerations, not findings from a controlled study. Experience of this kind is useful for informing how a practice is run and what a consultation focuses on, but it is not a substitute for, and shouldn't be read as, published guideline-level evidence.",
        ],
      },
      {
        heading: "Anatomical variability is the constant",
        body: [
          "The single most consistent observation across a large number of procedures is how much baseline anatomy varies between patients — which is the practical reason results, volumes and timelines are discussed as individual, anatomy-led decisions throughout this site rather than as fixed figures.",
        ],
      },
      {
        heading: "Why the same product doesn't behave identically twice",
        body: [
          "Even with a consistent technique and product, individual tissue response means two patients with a similar starting point can reasonably end up with a somewhat different result or feel. This is a practical observation, not a claim about how the product performs in general — see our related article on why penile filler can feel different between patients.",
        ],
      },
      {
        heading: "Settling time deserves patience",
        body: [
          "Judging a result before it has genuinely settled is one of the more common sources of unnecessary concern in practice — see our related article on why penile filler can take several weeks to settle for more on this specifically. Building adequate follow-up timing into the treatment plan, rather than reacting to an early impression, tends to serve patients better.",
        ],
      },
      {
        heading: "Patient selection and expectations shape outcomes as much as technique",
        body: [
          "In practice, a thorough anatomical assessment and an honest conversation about realistic expectations beforehand matter at least as much as the technical execution of the procedure itself — which is why assessment is treated as its own step, not a formality before treatment.",
        ],
      },
      {
        heading: "Why correction, when needed, requires specialist assessment",
        body: [
          "Where a previous result — here or elsewhere — hasn't met expectations, experience across a large number of cases has reinforced that a generic fix isn't appropriate: correction needs its own anatomical assessment, considering the original treatment and current presentation, set out at our Penile Filler Correction page.",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean. Browser-check `http://localhost:3000/insights/lessons-from-500-penile-girth-enhancement-procedures` — specifically re-read the first section on-page to confirm it reads as a disclaimer distinguishing experience from evidence, not as marketing copy.

- [ ] **Step 3: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): add 500+ procedures reflective article, framed as experience not evidence (Phase C)"
```

---

### Task 15: Complete reverse cross-links from the 7 pre-existing cluster articles to the 5 new ones

**Files:**
- Modify: `src/content/insights/articles.ts` (adjust `relatedArticleSlugs` on 2 of the articles touched in Task 6)

Now that the 5 new articles exist, tighten two of the Task 6 cross-links so the highest-relevance new articles are surfaced, not just old-to-old links.

- [ ] **Step 1: Update `what-happens-to-penile-filler-over-time`**

Change its `relatedArticleSlugs` (set in Task 6) from:
```ts
    relatedArticleSlugs: ["why-penile-filler-takes-weeks-to-settle", "how-long-does-penile-filler-last"],
```
to:
```ts
    relatedArticleSlugs: [
      "why-penile-filler-takes-weeks-to-settle",
      "penile-filler-migration-what-to-know",
      "penile-filler-nodules-and-irregularities",
    ],
```

(This article's own body text already says "The second pattern is what specialist assessment ... is for" when discussing asymmetry/lumps/migration signs — so linking it forward to the two new complication-specific articles is a direct topical match.)

- [ ] **Step 2: Update `penile-girth-enhancement-assessment`**

Change its `relatedArticleSlugs` (set in Task 6) from:
```ts
    relatedArticleSlugs: ["how-much-girth-can-penile-filler-add", "how-long-does-penile-filler-last"],
```
to:
```ts
    relatedArticleSlugs: [
      "how-much-girth-can-penile-filler-add",
      "lessons-from-500-penile-girth-enhancement-procedures",
    ],
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/content/insights/articles.ts
git commit -m "feat(insights): tighten cross-links to surface the new Phase C articles"
```

---

### Task 16: Entity-consistency audit (verification pass, edit only if a real inconsistency is found)

**Files:**
- No files modified unless a genuine inconsistency is found (in which case: fix in place, exact file noted at that time).

- [ ] **Step 1: Grep for name/title variants**

Run:
```bash
cd /Users/alejandro/Projects/andrologist
grep -rn "Dr\.\? Alejandro Molina" src --include="*.tsx" --include="*.ts" | grep -v "config/doctor.ts"
grep -rn "Consultant Urologist" src --include="*.tsx" --include="*.ts"
grep -rn "Urologist &amp;\? Andrologist\|Urologist and Andrologist" src --include="*.tsx" --include="*.ts"
```

- [ ] **Step 2: Manually review the output**

Confirm every hardcoded occurrence matches `doctor.displayName` ("Dr. Alejandro Molina") and `doctor.title` ("Consultant Urologist & Andrologist") exactly, or is legitimately reading from `doctor.displayName`/`doctor.title` directly rather than hardcoding. Flag any component that hardcodes a divergent form (e.g. "Dr Molina" without the period, or "Urologist and Andrologist" spelled out instead of using the `&`).

- [ ] **Step 3: Fix in place if found, otherwise document "no discrepancy found"**

If a divergent hardcoded string is found, replace it with a reference to `doctor.displayName`/`doctor.title` (import from `@/config/doctor`) rather than a corrected literal string, so it can't drift again. If nothing is found, no code change is needed — record this outcome for Task 18's report.

- [ ] **Step 4: Verify (only if Step 3 made a change)**

Run: `npx tsc --noEmit && npm run build`

- [ ] **Step 5: Commit (only if Step 3 made a change)**

```bash
git add <changed file>
git commit -m "fix(entity-consistency): use doctor config instead of hardcoded name/title string"
```

---

### Task 17: Create `SEARCH_CONSOLE_MONITORING_PLAN.md`

**Files:**
- Create: `SEARCH_CONSOLE_MONITORING_PLAN.md` (repo root, matching the flat convention of the other 10 root-level `.md` docs)

- [ ] **Step 1: Write the file**

```markdown
# Search Console Monitoring Plan

**Status:** Not yet actionable — `NEXT_PUBLIC_SITE_URL` is unset and the site has not been deployed to a production domain (see `LAUNCH_CHECKLIST.md`). This document defines the monitoring plan to execute once the site is live and verified in Google Search Console; it contains no ranking forecasts, since none exist yet for a site with zero deployment history.

## Purpose

Track real query performance after launch to validate (or correct) the SEO restructure's targeting decisions — particularly whether the Penile Girth Enhancement flagship page, the Penile Filler Correction page, and the Insights cluster are being matched to the queries they were built for, without cannibalizing each other.

## Setup (post-launch, one-time)

1. Verify the production domain in Google Search Console (domain property, not just URL-prefix, to capture all subpaths).
2. Submit `sitemap.xml` (already generated at `/sitemap.xml` via `src/app/sitemap.ts`).
3. Confirm crawl coverage shows no unexpected `noindex` or `Excluded` pages beyond the 3 legal pages (which are deliberately `index: false`).

## Query groups to track

Pull Search Console's Performance report filtered to each group below. Group by query, then by page, on at least a rolling 28-day and 3-month view once enough data exists (Search Console data is sparse and noisy in the first few weeks post-launch — avoid drawing conclusions before ~4-6 weeks of data).

### Brand
- Alejandro Molina
- Dr Alejandro Molina
- Alejandro Molina urologist
- Alejandro Molina Abu Dhabi

### Penile Girth
- penile girth enhancement Abu Dhabi
- penile filler Abu Dhabi
- penis filler Abu Dhabi
- penile thickening Abu Dhabi
- penile augmentation Abu Dhabi

### Correction
- penile filler correction Abu Dhabi
- penile filler migration
- penile filler nodules
- penile filler complications

### Andrology
- andrologist Abu Dhabi
- men's health doctor Abu Dhabi
- sexual medicine Abu Dhabi

## Metrics per query group

For each group above, record monthly:
- Impressions
- Clicks
- CTR
- Average position
- Which page(s) each query maps to (Search Console's query→page breakdown)

## Cannibalization checks

Specifically watch for:
- The same query appearing against both `/male-aesthetics/penile-girth-enhancement` and `/male-aesthetics/penile-filler-correction` with split impressions — would indicate the two pages are competing rather than serving distinct intents.
- Any Insights article outranking its own linked treatment page for a clearly commercial query (e.g. an article outranking the Girth page for "penile girth enhancement Abu Dhabi") — would suggest the treatment page's on-page targeting needs strengthening, not that the article should be removed.
- Queries in the "Correction" group landing on the Girth page instead of the Correction page, or vice versa — would indicate the FAQ/read-more linking added in this Phase C plan needs adjustment.

## Pages to improve based on real query data

This section is intentionally left as a template — do not pre-fill it with guesses. Once real Search Console data exists, populate it with: page, underperforming query, current position/CTR, and the specific on-page change being tested (e.g. FAQ wording, title tag, added internal link) — one row per finding, dated.

| Date | Page | Query | Position | CTR | Change made |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Review cadence

Monthly for the first 6 months post-launch, then quarterly — consistent with how slowly a newly-launched site's index coverage and rankings typically stabilize. Do not react to week-to-week fluctuations in a domain with no ranking history yet.
```

- [ ] **Step 2: Verify**

Run: `ls /Users/alejandro/Projects/andrologist/SEARCH_CONSOLE_MONITORING_PLAN.md`
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add SEARCH_CONSOLE_MONITORING_PLAN.md
git commit -m "docs: add Search Console monitoring plan for post-launch query tracking"
```

---

### Task 18: Update `IMPLEMENTATION_REPORT.md`, `SEO_AUDIT.md`, `CLINICAL_CONTENT_REVIEW.md` with a Phase C section

**Files:**
- Modify: `IMPLEMENTATION_REPORT.md` (append new "Phase 9 — SEO Restructure Phase C" section, following the existing Phase 7/8 format)
- Modify: `SEO_AUDIT.md` (append a "Phase C" section, following the existing Phase A/B section format)
- Modify: `CLINICAL_CONTENT_REVIEW.md` (add the 5 new articles to the claim-by-claim table, following the existing format)

- [ ] **Step 1: Read the exact existing Phase B section headers in each file to match formatting**

Run:
```bash
grep -n "^#" /Users/alejandro/Projects/andrologist/IMPLEMENTATION_REPORT.md | tail -5
grep -n "^#" /Users/alejandro/Projects/andrologist/SEO_AUDIT.md | tail -5
grep -n "^#" /Users/alejandro/Projects/andrologist/CLINICAL_CONTENT_REVIEW.md | tail -5
```

- [ ] **Step 2: Append the Phase C section to each file**

Match each file's existing heading level and table structure exactly (read the Phase B section immediately preceding the append point first, in full, so the new section is a stylistic match — not a placeholder). Content to cover in each:

- `IMPLEMENTATION_REPORT.md`: what was built (5 new articles + video architecture + related-insights system + FAQ read-more links + 3 candidate articles rejected with reasons), verification results (tsc/eslint/build output), explicitly not done (video content itself, since none was supplied).
- `SEO_AUDIT.md`: updated sitemap entry count (30 + 5 = 35), confirmation no duplicate-intent URLs were introduced, confirmation of the new internal-link graph (Related Insights + FAQ read-more links).
- `CLINICAL_CONTENT_REVIEW.md`: add 5 rows to the claim-by-claim table for the 5 new articles, each classified consistently with the existing rows (expect `CLINICAL REVIEW REQUIRED` given `clinicalReviewRequired: true` is uniform site-wide).

- [ ] **Step 3: Verify**

Run: `git diff --stat IMPLEMENTATION_REPORT.md SEO_AUDIT.md CLINICAL_CONTENT_REVIEW.md`
Expected: only additive diffs (no existing content removed/altered).

- [ ] **Step 4: Commit**

```bash
git add IMPLEMENTATION_REPORT.md SEO_AUDIT.md CLINICAL_CONTENT_REVIEW.md
git commit -m "docs: record Phase C build in implementation, SEO audit, and clinical content review reports"
```

---

### Task 19: Full QA pass

**Files:** none modified unless QA surfaces a defect (in which case, fix and note which earlier task's file it belongs to).

- [ ] **Step 1: Static checks**

Run:
```bash
cd /Users/alejandro/Projects/andrologist
npx tsc --noEmit
npm run lint
npm run build
```
Expected: all three exit 0 with no errors/warnings.

- [ ] **Step 2: Sitemap/robots check**

Run: `npm run start` (after build), then:
```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"
curl -s http://localhost:3000/sitemap.xml | grep "penile-filler\|penile-girth\|feels-different\|500-penile"
curl -s http://localhost:3000/robots.txt
```
Expected: url count = 35 (30 prior + 5 new articles), all 5 new article slugs present, robots.txt unchanged (`Allow: /`, sitemap line present).

- [ ] **Step 3: Real-browser QA via Playwright**

Using the Playwright MCP tools, for each of: `/male-aesthetics/penile-girth-enhancement`, `/male-aesthetics/penile-filler-correction`, `/insights`, `/insights/penile-filler-migration-what-to-know`, `/insights/penile-filler-nodules-and-irregularities`, `/insights/can-penile-filler-be-dissolved`, `/insights/why-penile-filler-feels-different-between-patients`, `/insights/lessons-from-500-penile-girth-enhancement-procedures`:
- Navigate at 390px width, take a screenshot, check for horizontal overflow (page width should equal viewport width) and console errors.
- Navigate at 1440px width, take a screenshot, check for console errors.
- Confirm exactly one `<h1>` per page.
- Confirm the FAQ read-more links (Task 8/9) navigate to the correct destinations.
- Confirm the Related Insights section renders with correct titles/links (skip for pages with no `relatedArticleSlugs`).
- Confirm the booking CTA link points to `practice.bookingUrl` (not the physician profile URL).

- [ ] **Step 4: JSON-LD spot check**

For `/insights/penile-filler-migration-what-to-know`, view page source and confirm the `Article` and `BreadcrumbList` JSON-LD blocks are present and valid JSON, and that no `VideoObject` block is present (since this article has no `video` field — confirms the fail-safe guard from Task 5 works).

- [ ] **Step 5: Record results**

If all checks pass, this task's completion is the final entry in Task 18's `IMPLEMENTATION_REPORT.md` Phase C section (append a short "QA: pass" line with the date). If any check fails, fix the specific file responsible, re-run the failing check only, then re-run Step 1 in full before continuing.

- [ ] **Step 6: Commit (if Step 5 required a fix)**

```bash
git add <fixed file>
git commit -m "fix: address Phase C QA finding"
```

---

## Self-review notes (completed during plan authoring)

- **Spec coverage:** All 12 numbered sections of the Phase C prompt map to a task: §1/§2 → Tasks 10-14 (content cluster + 500+ framing); §3 → Tasks 1-3, 5; §4 → Tasks 8, 9, 10-13 (direct-answer framing throughout); §5 → Task 16; §6 → Task 8; §7 → Tasks 4, 6, 15; §8 → already satisfied by existing `practice` config, reinforced by Task 9's Abu Dhabi-context correction FAQ; §9 → Task 17; §10 → Task 19 Step 2; §11 → Task 2/5 (VideoObject) plus confirmation no `aggregateRating`/awards are touched (Global Constraints); §12 → Task 19.
- **Placeholder scan:** no task contains "TBD"/"add appropriate handling"/unshown code — every article body, every component, every schema builder is written out in full above.
- **Type consistency:** `InsightVideo`, `getRelatedArticles`, `videoObjectSchema`, `ArticleVideoBlock`, `RelatedInsights`, and `FaqItem.readMoreHref/readMoreLabel` are each defined once (Tasks 1, 1, 2, 3, 4, 7 respectively) and referenced identically in every later task that consumes them.
