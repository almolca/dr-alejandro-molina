# R9 Phase A — Multiple Root Layouts Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the wrapper-level `dir`/`lang` approach with genuine per-locale `<html>` ownership via Next.js's multiple-root-layouts pattern, so `/ar` renders `<html lang="ar" dir="rtl">` and English pages render `<html lang="en" dir="ltr">` — without changing any public English URL.

**Architecture:** Delete the single shared `src/app/layout.tsx`. Three independent root layouts take its place: `app/(en)/layout.tsx` (wraps the existing `(marketing)`/`(legal)` route groups, moved under it — route groups never affect URLs, so `/mens-health` etc. are unchanged), `app/(ar)/layout.tsx` (wraps a real `ar/` segment containing the existing `ar/(marketing)` tree, moved under it — `/ar` unchanged), and `app/admin/layout.tsx` (upgraded in place, same path, from a thin pass-through into its own root). A new shared `RootProviders` component (JsonLd + MotionProvider + ConsentBanner) is used identically by all three, so nothing gets duplicated. `app/global-not-found.tsx` + `next.config.ts`'s experimental `globalNotFound` flag handle genuinely unmatched URLs (the one thing multiple root layouts can't compose on their own); `(en)/not-found.tsx` and `admin/not-found.tsx` handle the two real in-tree `notFound()` calls.

**Tech Stack:** Next.js 16.3.4 (App Router), React 19, TypeScript (strict), Tailwind v4, Vitest.

**Spec:** This plan was authorized directly by the human via an in-chat design (no separate spec doc) — see the migration design and its approval in this session's transcript. The original Phase A spec/plan remain the authority for everything this migration doesn't change.

## Global Constraints

- Every existing English public URL must resolve identically after this migration — route groups contribute nothing to URLs, so moving `(marketing)`/`(legal)` under `(en)` must be content-for-content, zero internal changes to any moved file.
- `/ar` stays exactly `/ar` — moving `ar/(marketing)` under `(ar)/ar/(marketing)` must not change its resolved URL.
- Do not add `(ar)/not-found.tsx` — explicitly deferred by the human until a real Arabic route needs it.
- Do not remove or "clean up" the existing explicit `dir`/`lang`/font overrides on `MobileNav`'s `Dialog.Content` or `ConsentBanner` (from Tasks 16–17 of the original Phase A plan) — they become structurally redundant under this architecture but must be left in place as-is; removing already-reviewed working code is out of scope here.
- `RootProviders` is shared by all three roots (including admin) for this migration — acceptable per the human's explicit instruction, but the shared-forever assumption must NOT be treated as permanent: document (in `RootProviders`'s own doc comment) that admin doesn't inherently need public JsonLd/ConsentBanner, and that a future split is a legitimate follow-up, not required now.
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `src/proxy.ts`, `legacy-redirects.ts` are not touched by this migration — they don't render through the root layout and have no dependency on this restructuring.
- No merge to `main`, no Production deployment, no Phase B work.
- Run `npm run typecheck && npm run lint && npm test && npm run build && git diff --check` before considering any task done; all must stay green.

---

### Task 1: Extract `RootProviders`

**Files:**
- Create: `src/components/layout/RootProviders.tsx`

**Interfaces:**
- Produces: `RootProviders({ children }: { children: ReactNode })` — consumed by Tasks 2–4. Purely additive; not wired into anything by this task, so it cannot affect any existing behavior yet.

- [ ] **Step 1: Create the component**

Create `src/components/layout/RootProviders.tsx`:

```tsx
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { personSchema, physicianSchema } from "@/lib/seo/json-ld";

/**
 * Shared root-level providers, used identically by all three independent
 * root layouts (app/(en)/layout.tsx, app/(ar)/layout.tsx,
 * app/admin/layout.tsx) so none of them duplicate this logic.
 *
 * Person/Physician JSON-LD is locale-invariant (same entity, never
 * duplicated data — spec §10) and genuinely global, so sharing it across
 * all three roots is correct, not just convenient.
 *
 * ConsentBanner and public structured data are, strictly speaking, only
 * meaningful for the PUBLIC (en/ar) roots — admin is an internal,
 * noindex, authenticated tool with no public visitors to consent-gate or
 * to serve Physician schema to. It inherits both here purely to preserve
 * today's exact pre-migration behavior (the single old shared root
 * layout rendered both unconditionally for every route, admin included)
 * at minimal migration risk. This is NOT a permanent design requirement
 * — splitting admin onto its own, narrower provider set is a legitimate
 * future cleanup, not performed here to keep this migration's scope to
 * "preserve behavior, fix html lang/dir" only.
 */
export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={[personSchema(), physicianSchema()]} />
      <MotionProvider>
        <ConsentBanner />
        {children}
      </MotionProvider>
    </>
  );
}
```

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS (new file compiles; nothing imports it yet, so no other output changes).

```bash
git add src/components/layout/RootProviders.tsx
git commit -m "feat(r9): extract RootProviders, shared by the 3 upcoming independent root layouts"
```

---

### Task 2: The migration flip — three independent roots, route moves, global 404

This is one task because the site cannot be in a valid intermediate state otherwise: `app/layout.tsx` must be deleted in the same change that makes `(en)`, `(ar)`, and `admin` genuine roots (Next.js doesn't allow two ancestors in the same chain to both render `<html>`, so there's no safe halfway point). Every sub-step below is part of one coherent commit.

**Files:**
- Delete: `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/ar/layout.tsx`
- Move (git mv, directory-level, zero content changes): `src/app/(marketing)/` → `src/app/(en)/(marketing)/`, `src/app/(legal)/` → `src/app/(en)/(legal)/`, `src/app/ar/(marketing)/` → `src/app/(ar)/ar/(marketing)/`
- Create: `src/app/(en)/layout.tsx`, `src/app/(en)/not-found.tsx`, `src/app/(ar)/layout.tsx`, `src/app/global-not-found.tsx`
- Modify: `src/app/admin/layout.tsx` (upgrade in place — same path), `next.config.ts`

**Interfaces:**
- Consumes: `RootProviders` (Task 1), `src/lib/fonts/arabic.ts`'s `notoSansArabic` (already exists on this branch, from the earlier Phase A font fix), `rootMetadata` (`src/lib/seo/metadata.ts`, unchanged).

- [ ] **Step 1: Move the English route groups**

```bash
mkdir -p "src/app/(en)"
git mv "src/app/(marketing)" "src/app/(en)/(marketing)"
git mv "src/app/(legal)" "src/app/(en)/(legal)"
```

Do not edit any file inside these two moved trees — the move must be content-for-content identical. (Two stray `.DS_Store` files may be present in `(marketing)` and `mens-health/` — leave them exactly where `git mv` puts them; do not delete or specially handle them, they're outside this task's scope.)

- [ ] **Step 2: Move the Arabic route group**

```bash
mkdir -p "src/app/(ar)/ar"
git mv "src/app/ar/(marketing)" "src/app/(ar)/ar/(marketing)"
git rm "src/app/ar/layout.tsx"
rmdir "src/app/ar" 2>/dev/null || true
```

(`src/app/ar/layout.tsx`'s content is superseded by the new `src/app/(ar)/layout.tsx` in Step 4 below — don't try to preserve its body, just remove it; the new file replaces its job entirely.)

- [ ] **Step 3: Create `src/app/(en)/layout.tsx`**

```tsx
import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { rootMetadata } from "@/lib/seo/metadata";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="h-full font-sans antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
```

(This is the old `src/app/layout.tsx` content, relocated one level deeper — `../globals.css` because this file now lives in `app/(en)/` instead of `app/` — plus an explicit `dir="ltr"` that the old file never bothered setting since browser default already was `ltr`; setting it explicitly now costs nothing and matches the exit criteria's literal ask.)

- [ ] **Step 4: Create `src/app/(en)/not-found.tsx`**

Move the exact content of the now-deleted `src/app/not-found.tsx` here unchanged (same imports, same JSX, same `PageShell` wrapping) — this is what `(marketing)/insights/[slug]/page.tsx:39`'s `notFound()` call bubbles up to.

- [ ] **Step 5: Create `src/app/(ar)/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { notoSansArabic } from "@/lib/fonts/arabic";
import { RootProviders } from "@/components/layout/RootProviders";

/**
 * The genuine Arabic root — <html lang="ar" dir="rtl"> is now set at the
 * true document root (not a wrapper element inside a shared en-rooted
 * document, per the earlier Phase A interim approach). --font-fraunces
 * and --font-inter are still the CSS custom-property names to override
 * (not --font-display/--font-sans): Tailwind v4 inlines those exact
 * variable names into the generated .font-display/.font-sans utility
 * classes at build time, so overriding anything else is a no-op — this
 * part of the mechanism is unchanged from the original font fix, only
 * WHERE it's applied has moved (the true <html>/<body> now, instead of
 * an inner wrapper div that other content could render outside of).
 */
const arabicFontVars = {
  "--font-fraunces": "var(--font-noto-sans-arabic)",
  "--font-inter": "var(--font-noto-sans-arabic)",
} as React.CSSProperties;

export default function ArabicRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${notoSansArabic.variable} h-full font-sans`}
      style={arabicFontVars}
    >
      <body className="h-full antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
```

Read `src/lib/fonts/arabic.ts` first to confirm the exact export name (`notoSansArabic`) and its `.variable` property before writing this — do not guess the import.

`src/lib/fonts/arabic.ts`'s own doc comment references `src/app/ar/layout.tsx` (the file this step deletes) — update those two path references in that comment to `src/app/(ar)/layout.tsx` so the comment doesn't point at a file that no longer exists. Don't change anything else in that file.

Note: `globals.css` is NOT re-imported here — it's already imported by `(en)/layout.tsx`, and Next.js/webpack dedupes a CSS module imported from multiple entry points into one stylesheet rather than emitting it twice. Verify this assumption in Step 8's build check (inspect the built output for duplicate stylesheet links) rather than trusting it blindly.

- [ ] **Step 6: Upgrade `src/app/admin/layout.tsx` in place**

Replace its content (same file path — this is an edit, not a move):

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { rootMetadata } from "@/lib/seo/metadata";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/**
 * /admin's own root (upgraded in place from a thin pass-through that
 * used to inherit the single shared app/layout.tsx — that shared root no
 * longer exists after the multi-root migration, so admin now owns its
 * own <html>/<body> exactly like (en) and (ar) do).
 *
 * Combines the site's base metadata (title template, OG defaults — for
 * parity with what admin used to inherit from the old shared root) with
 * the noindex override this file already had, in one export instead of
 * two, since there's no longer an ancestor root to inherit the base
 * metadata from automatically.
 *
 * Uses RootProviders (JsonLd/ConsentBanner/MotionProvider) purely to
 * preserve exact pre-migration behavior — the old shared root rendered
 * all three unconditionally for every route including /admin. None of
 * the three is inherently required by an internal, authenticated,
 * noindex admin tool; splitting admin onto a narrower provider set is a
 * legitimate future cleanup, intentionally not done here.
 */
export const metadata: Metadata = {
  ...rootMetadata,
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="h-full font-sans antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create `src/app/admin/not-found.tsx`**

A minimal branded 404 for admin's own tree (what `admin/(protected)/leads/[id]/page.tsx:22`'s `notFound()` call bubbles up to) — admin has no `PageShell` (that's public-site chrome), so keep this simple:

```tsx
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="font-display text-2xl text-foreground">Not found</h1>
      <p className="text-sm text-muted-foreground">The item you're looking for doesn't exist.</p>
      <Link href="/admin" className="text-sm font-medium text-foreground underline underline-offset-4">
        Back to admin
      </Link>
    </div>
  );
}
```

- [ ] **Step 8: Create `src/app/global-not-found.tsx`**

For genuinely unmatched URLs sitewide (the one thing multiple root layouts can't compose on their own — this is the Next.js-documented purpose-built answer to exactly this gap). Must be fully self-contained per Next's requirement (it bypasses normal layout rendering entirely, so it imports its own fonts/styles):

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or hasn't been published yet.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="flex h-full flex-col items-center justify-center gap-4 bg-background px-gutter text-center font-sans antialiased">
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">404</p>
        <h1 className="font-display text-display-lg text-foreground">Page not found</h1>
        <p className="max-w-md text-body-lg text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist or hasn&rsquo;t been published yet.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-sm bg-foreground px-6 text-sm font-medium text-background shadow-sm transition-colors hover:bg-foreground/90"
        >
          Return home
        </Link>
      </body>
    </html>
  );
}
```

(Reproduces the same copy and CTA as the original `not-found.tsx`, styled directly rather than via `PageShell`/`Button`/`Container` — those components assume they're rendered inside a root layout's `<body>` with the site's providers already in scope, which `global-not-found.tsx` deliberately bypasses per Next's own constraint on this file.)

- [ ] **Step 9: Enable the experimental flag**

In `next.config.ts`, add to the `nextConfig` object (alongside the existing `headers()`/`redirects()`):

```ts
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    // ...unchanged...
  },
  async redirects() {
    // ...unchanged...
  },
};
```

- [ ] **Step 10: Verify zero public URL changes**

Before running the full suite, do this check specifically (the human explicitly asked for it): list every route file under the new tree and confirm each still maps to its pre-migration URL. Run:

```bash
find "src/app/(en)" "src/app/(ar)" src/app/admin -name "page.tsx" | sort
```

For each, mentally strip every `(parenthesized)` segment and confirm the remaining path matches what it resolved to before this task (e.g. `src/app/(en)/(marketing)/mens-health/page.tsx` → `/mens-health`, unchanged; `src/app/(ar)/ar/(marketing)/page.tsx` → `/ar`, unchanged). Note this confirmation explicitly in your report — list at least 5 representative routes with their before/after URL.

- [ ] **Step 11: Run the full verification suite**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all pass. The build output's route table is the authoritative check for Step 10 — cross-reference it against the pre-migration route list (available via `git show 8016396:src/lib/seo/routes.ts` if needed for comparison, or simply: every route this branch's `routes.ts`/`sitemap.ts` already declares as live must still appear in the build's route table at the identical path).

If the build reports duplicate CSS output or any other issue from `globals.css` being imported by 3 separate root layouts (flagged as a risk to verify in Step 5), investigate and report it rather than guessing a fix.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(r9): migrate to multiple root layouts — genuine <html lang/dir> per locale

Replaces the wrapper-level dir/lang approach (Phase A's original
approach, now superseded) with real per-locale document roots:
app/(en)/layout.tsx, app/(ar)/layout.tsx, and an upgraded-in-place
app/admin/layout.tsx, sharing a new RootProviders component so none
duplicate JsonLd/MotionProvider/ConsentBanner. Route groups move
(marketing)/(legal)/ar's marketing tree under their respective root
without changing any public URL. global-not-found.tsx + the
experimental globalNotFound Next.js flag handle genuinely unmatched
URLs, the one thing multiple root layouts can't compose on their own;
(en)/not-found.tsx and admin/not-found.tsx handle the two real
in-tree notFound() call sites.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Live verification — document roots, route parity, 404s, no duplication

This task has no new source files — it's a live, real-browser QA pass (start the dev server, use Playwright) verifying the migration actually did what Task 2 claims, plus a Preview deployment and report.

**Files:** none created.

- [ ] **Step 1: Start the dev server and verify document roots directly**

For `/`, `/about`, `/ar`, and `/admin/login`, navigate and check `document.documentElement.getAttribute('lang')` and `document.documentElement.getAttribute('dir')` via `getComputedStyle`/DOM inspection (not inferred from any wrapper element). Expected: `/` and `/about` → `lang="en"`, `dir="ltr"`; `/ar` → `lang="ar"`, `dir="rtl"`; `/admin/login` → `lang="en"`, `dir="ltr"`.

- [ ] **Step 2: Route parity spot-check**

Navigate to at least 8 representative English routes spanning different former nesting depths (e.g. `/`, `/about`, `/mens-health`, `/mens-health/testosterone`, `/male-aesthetics/penile-girth-enhancement`, `/insights`, `/insights/<a-real-slug>`, `/privacy`, `/terms`) and confirm each returns 200 and renders its expected content (spot-check heading/title, not full visual QA — that already happened in the original Phase A).

- [ ] **Step 3: Legacy redirect / 404 / 410 spot-check**

Pick 2–3 entries from `src/lib/seo/legacy-redirects.ts`'s `legacyRedirects` array and confirm they still 308-redirect to their destination in one hop. Pick 1–2 entries from `legacyGonePaths` and confirm they still return 410. Navigate to a genuinely nonexistent URL (e.g. `/this-definitely-does-not-exist`) and confirm the NEW branded `global-not-found.tsx` page renders (200/404 status per Next's streaming behavior — check what the original `not-found.tsx` returned for comparison, should be consistent).

- [ ] **Step 4: `notFound()` call sites**

Navigate to `/insights/<a-slug-that-does-not-exist>` and confirm `(en)/not-found.tsx` renders (branded, `PageShell`-wrapped). For the admin case (`admin/(protected)/leads/[id]/page.tsx`), this requires admin auth — either test it with real admin credentials if available in this environment, or read the code path carefully and report that this specific case could not be live-verified without admin access, rather than skipping it silently.

- [ ] **Step 5: No duplicate runtime infrastructure**

On `/ar` and on `/` (whichever currently shows the consent banner — clear localStorage/cookies first if needed), confirm via DOM query: exactly one `[role="region"][aria-label="Cookie preferences"]` element, exactly one set of `Person`/`Physician` JSON-LD `<script>` tags (count them), no duplicate `page_view` firing (check `PageViewTracker`'s network requests — one `POST /api/events` per navigation, not two).

- [ ] **Step 6: SEO spot-check**

On `/` and `/ar`, confirm canonical + reciprocal hreflang are unchanged from the pre-migration values (same URLs, same `en-AE`/`ar-AE`/`x-default` structure — this logic wasn't touched by this migration, so this is a regression check, not new behavior). Fetch `/sitemap.xml` and `/robots.txt` and confirm both are byte-identical in content to before this migration (neither file was touched).

- [ ] **Step 7: Typography spot-check**

Repeat the `getComputedStyle` font check from the original Phase A QA: `/ar`'s h1 and body text compute `Noto Sans Arabic`; `/about`'s compute `Fraunces`/`Inter` unchanged.

- [ ] **Step 8: Full verification suite + push + Preview**

Run: `npm run typecheck && npm run lint && npm test && npm run build && git diff --check`. Push the branch (already tracking `origin/feat/arabic-localization-r9`) and confirm the resulting Vercel Preview build reaches `READY`. Repeat Steps 1, 5, 6, 7 above against the live Preview URL, not just the local dev server — this branch's history includes at least one bug (the ConsentBanner font issue) that only showed up on a live deployment, not local dev, so the Preview check is not redundant with the local one.

- [ ] **Step 9: Report**

Write a full report covering every step above with concrete evidence (computed-style values, route status codes, screenshot/DOM references, test/build output). Do not push to `main`, do not deploy Production, do not start Phase B.
