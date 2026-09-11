# R9 Phase A — Arabic i18n Foundation + Homepage Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the routing, RTL rendering, content-authoring pattern, and SEO plumbing (hreflang, canonical, sitemap, analytics locale) for Arabic localization, and prove it end-to-end with one real page: `/ar` (Arabic homepage pilot).

**Architecture:** Static `app/ar/...` folder tree (no `[locale]` dynamic segment). `lang`/`dir` are set on a wrapper element inside `app/ar/layout.tsx`, not on the true `<html>` root (avoids touching `/admin` or Next.js's 404 handling). A single route registry (`src/lib/seo/routes.ts`) with a new `arPath` field is the one source of truth for the language switcher, hreflang, and sitemap. The Arabic homepage is built from a typed content object (`HomePageContent`) rendered by a new `HomePageTemplate` component reusing existing shared primitives — the English homepage's own page file is not modified beyond a one-line hreflang addition to its metadata.

**Tech Stack:** Next.js 16.3.4 (App Router), React 19, TypeScript (strict), Tailwind v4, Zod v4, Vitest, Supabase (Postgres). `next/font/google` for `Noto Sans Arabic`.

**Spec:** `docs/superpowers/specs/2026-09-11-r9-phase-a-arabic-i18n-foundation-design.md`

## Global Constraints

- Zero changes to any existing English URL, English page content/JSX, or English page behavior — only additive, backward-compatible prop/field changes to shared code (default values preserve current output exactly).
- Zero changes to `/admin`.
- `lang`/`dir` are set on a wrapper element inside `app/ar/layout.tsx`, never on `<html>` (see spec §4) — do not attempt a multiple-root-layouts restructure.
- Language switcher: only render a link to the other locale when the route registry (`getLocalizedPathPair`) confirms a real pair exists. Never redirect, never show a disabled placeholder for a missing pair — omit it entirely. The current language is always shown as plain, non-link text.
- No new npm dependency for i18n (native Next.js routing + typed content, per spec).
- `locale` is required (`z.enum(["en", "ar"])`) on `analyticsEventSchema`, derived automatically inside `trackEvent()` from the event's `path` — no call-site changes anywhere else in the app.
- No `locale` column on the `leads` table (rejected per spec §9 — not part of this plan).
- Homepage pilot is an intentionally reduced "representative subset" (hero, trust/authority stats, FAQ, booking CTA) — not full 10-section parity with the English homepage. Do not expand scope to the other 9 sections.
- All new Arabic UI strings are professional-effort MSA but explicitly flagged for a native-speaker QA pass before Phase B scales the pattern (spec §14) — do not present them as final-reviewed.
- Run `npm run typecheck && npm run lint && npm run build && npm test` before considering any task done; all must stay green.

---

### Task 1: Feature branch + route registry `arPath` + `getLocalizedPathPair`

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/components/ui/InternalLink.tsx`
- Test: `src/lib/seo/routes.test.ts` (new)

**Interfaces:**
- Produces: `RouteEntry.arPath?: string`, `getLocalizedPathPair(path: string): { en: string; ar: string } | null` — exported from `src/lib/seo/routes.ts`, used by Tasks 2, 3, 9.

- [ ] **Step 1: Create the feature branch**

```bash
git checkout main
git pull
git checkout -b feat/arabic-localization-r9
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/seo/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getLocalizedPathPair, routes } from "./routes";

describe("getLocalizedPathPair", () => {
  it("returns the en/ar pair for the English homepage", () => {
    expect(getLocalizedPathPair("/")).toEqual({ en: "/", ar: "/ar" });
  });

  it("returns the same pair when looked up from the Arabic side", () => {
    expect(getLocalizedPathPair("/ar")).toEqual({ en: "/", ar: "/ar" });
  });

  it("returns null for an English route with no Arabic equivalent yet", () => {
    expect(getLocalizedPathPair("/mens-health")).toBeNull();
  });

  it("returns null for an Arabic path with no matching registry entry", () => {
    expect(getLocalizedPathPair("/ar/mens-health")).toBeNull();
  });
});

describe("routes registry", () => {
  it("only the homepage has an arPath set in Phase A", () => {
    const withArPath = routes.filter((r) => r.arPath);
    expect(withArPath).toEqual([expect.objectContaining({ path: "/", arPath: "/ar" })]);
  });
});
```

- [ ] **Step 2b: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/routes.test.ts`
Expected: FAIL — `getLocalizedPathPair` is not exported / `arPath` doesn't exist.

- [ ] **Step 3: Implement `arPath` and `getLocalizedPathPair`**

In `src/lib/seo/routes.ts`, update the `RouteEntry` type and the `/` entry, and add the resolver function:

```ts
export type RouteEntry = {
  path: string;
  status: "live" | "planned";
  priority: number;
  index?: boolean;
  /**
   * Arabic equivalent path (e.g. "/ar"), when a real translated page
   * exists. Only set this once the page is actually live — this field
   * is the single source of truth for the language switcher, hreflang,
   * and sitemap (R9 Phase A spec §8).
   */
  arPath?: string;
};

export const routes: RouteEntry[] = [
  { path: "/", status: "live", priority: 1.0, arPath: "/ar" },
  { path: "/about", status: "live", priority: 0.7 },
  // ...(rest of the array unchanged)
```

(Only the `/` entry's line changes — every other entry stays exactly as it is today.)

At the bottom of the file, after `sitemapRoutes`:

```ts
/**
 * Resolves the English/Arabic pair for a given path, in either
 * direction — the single lookup used by the language switcher,
 * hreflang generation, and the sitemap (R9 Phase A spec §8). Returns
 * `null` when no real Arabic equivalent exists yet, so callers never
 * construct a guessed or broken URL.
 */
export function getLocalizedPathPair(path: string): { en: string; ar: string } | null {
  if (path.startsWith("/ar")) {
    const entry = routes.find((route) => route.arPath === path);
    return entry ? { en: entry.path, ar: path } : null;
  }
  const entry = routes.find((route) => route.path === path);
  return entry?.arPath ? { en: path, ar: entry.arPath } : null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/seo/routes.test.ts`
Expected: PASS

- [ ] **Step 5: Extend `InternalLink`'s prefetch check to cover Arabic paths**

In `src/components/ui/InternalLink.tsx`, change:

```ts
const livePaths = new Set(liveRoutes.map((route) => route.path));
```

to:

```ts
const livePaths = new Set(
  liveRoutes.flatMap((route) => (route.arPath ? [route.path, route.arPath] : [route.path])),
);
```

This is a one-line, backward-compatible addition (every existing English path is still included exactly as before); no existing test covers this file, and none needs to change.

- [ ] **Step 6: Run full test suite and commit**

Run: `npm test`
Expected: all pass.

```bash
git add src/lib/seo/routes.ts src/lib/seo/routes.test.ts src/components/ui/InternalLink.tsx
git commit -m "feat(r9): add arPath to route registry as single source of truth for locale pairing"
```

---

### Task 2: `buildMetadata()` locale/hreflang support

**Files:**
- Modify: `src/lib/seo/metadata.ts`
- Modify: `src/lib/seo/metadata.test.ts`
- Modify: `src/app/(marketing)/page.tsx` (metadata-only edit, no JSX/content change)

**Interfaces:**
- Consumes: `getLocalizedPathPair` from Task 1.
- Produces: `buildMetadata()` now emits `alternates.languages` and locale-correct `openGraph.locale` automatically based on `path` — no new required parameter, so every existing call site keeps working unchanged.

- [ ] **Step 1: Write the failing tests**

Add to `src/lib/seo/metadata.test.ts`:

```ts
it("R9: emits reciprocal hreflang alternates when an Arabic equivalent exists", () => {
  const metadata = buildMetadata({
    title: "Dr. Alejandro Molina",
    description: "Specialist care.",
    path: "/",
  });

  expect(metadata.alternates?.languages).toEqual({
    "en-AE": `${siteUrl}/`,
    "ar-AE": `${siteUrl}/ar`,
    "x-default": `${siteUrl}/`,
  });
});

it("R9: emits the same reciprocal alternates and ar_AE og:locale from the Arabic side", () => {
  const metadata = buildMetadata({
    title: "د. أليخاندرو مولينا",
    description: "رعاية متخصصة.",
    path: "/ar",
  });

  expect(metadata.alternates?.languages).toEqual({
    "en-AE": `${siteUrl}/`,
    "ar-AE": `${siteUrl}/ar`,
    "x-default": `${siteUrl}/`,
  });
  expect(metadata.openGraph?.locale).toBe("ar_AE");
});

it("R9: emits no hreflang alternates when no Arabic equivalent exists yet", () => {
  const metadata = buildMetadata({
    title: "Men's Health",
    description: "Specialist care.",
    path: "/mens-health",
  });

  expect(metadata.alternates?.languages).toBeUndefined();
});
```

Note: `new URL("/", siteUrl).toString()` produces `${siteUrl}/` (trailing slash) — this matches existing `buildMetadata` URL construction behavior; keep the assertions exactly as above.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/seo/metadata.test.ts`
Expected: FAIL — no `alternates.languages`, `openGraph.locale` is always `site.locale`.

- [ ] **Step 3: Implement locale inference and hreflang**

In `src/lib/seo/metadata.ts`, add the import and update `buildMetadata`:

```ts
import { getLocalizedPathPair } from "./routes";
```

```ts
export function buildMetadata({
  title,
  description,
  path,
  index = true,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();
  const locale = path.startsWith("/ar") ? "ar" : "en";
  const pair = getLocalizedPathPair(path);
  const languages = pair
    ? {
        "en-AE": new URL(pair.en, siteUrl).toString(),
        "ar-AE": new URL(pair.ar, siteUrl).toString(),
        "x-default": new URL(pair.en, siteUrl).toString(),
      }
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: locale === "ar" ? "ar_AE" : site.locale,
      type: "website",
      images: [fallbackSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fallbackSocialImage],
    },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/seo/metadata.test.ts`
Expected: PASS (including the three pre-existing tests, unchanged).

- [ ] **Step 5: Add reciprocal hreflang to the English homepage's existing metadata (metadata-only edit)**

`src/app/(marketing)/page.tsx` does not use `buildMetadata()` — it hand-writes a `Metadata` literal. Add the reciprocal `languages` block using the same registry, without touching any JSX/content in the file:

```tsx
import { getLocalizedPathPair } from "@/lib/seo/routes";
```

```tsx
const homePair = getLocalizedPathPair("/");

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
    ...(homePair
      ? {
          languages: {
            "en-AE": siteUrl,
            "ar-AE": new URL(homePair.ar, siteUrl).toString(),
            "x-default": siteUrl,
          },
        }
      : {}),
  },
};
```

- [ ] **Step 6: Run full test suite and commit**

Run: `npm test && npm run typecheck`
Expected: all pass.

```bash
git add src/lib/seo/metadata.ts src/lib/seo/metadata.test.ts "src/app/(marketing)/page.tsx"
git commit -m "feat(r9): buildMetadata emits reciprocal hreflang when an Arabic pair exists"
```

---

### Task 3: Sitemap Arabic entries + hreflang alternates

**Files:**
- Modify: `src/app/sitemap.ts`
- Test: `src/app/sitemap.test.ts` (new)

**Interfaces:**
- Consumes: `sitemapRoutes` (existing), the `arPath` field from Task 1.

- [ ] **Step 1: Write the failing test**

Create `src/app/sitemap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteUrl } from "@/config/site";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("includes the Arabic homepage", () => {
    const ar = entries.find((e) => e.url === `${siteUrl}/ar`);
    expect(ar).toBeDefined();
    expect(ar?.priority).toBe(1.0);
  });

  it("gives the Arabic homepage reciprocal hreflang alternates", () => {
    const ar = entries.find((e) => e.url === `${siteUrl}/ar`);
    expect(ar?.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/`,
      "ar-AE": `${siteUrl}/ar`,
    });
  });

  it("gives the English homepage reciprocal hreflang alternates too", () => {
    const en = entries.find((e) => e.url === `${siteUrl}/`);
    expect(en?.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/`,
      "ar-AE": `${siteUrl}/ar`,
    });
  });

  it("includes no other /ar/* route yet", () => {
    const arEntries = entries.filter((e) => e.url.includes(`${siteUrl}/ar`));
    expect(arEntries).toHaveLength(1);
  });

  it("still includes insight articles (regression check)", () => {
    const articleEntries = entries.filter((e) => e.url.includes("/insights/"));
    expect(articleEntries.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: FAIL — no `/ar` entry exists yet.

- [ ] **Step 3: Implement Arabic sitemap entries**

Replace `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { insightArticles } from "@/content/insights/articles";
import { sitemapRoutes } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = sitemapRoutes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    priority: route.priority,
    ...(route.arPath
      ? {
          alternates: {
            languages: {
              "en-AE": new URL(route.path, siteUrl).toString(),
              "ar-AE": new URL(route.arPath, siteUrl).toString(),
            },
          },
        }
      : {}),
  }));

  const arPages: MetadataRoute.Sitemap = sitemapRoutes
    .filter((route): route is typeof route & { arPath: string } => Boolean(route.arPath))
    .map((route) => ({
      url: new URL(route.arPath, siteUrl).toString(),
      priority: route.priority,
      alternates: {
        languages: {
          "en-AE": new URL(route.path, siteUrl).toString(),
          "ar-AE": new URL(route.arPath, siteUrl).toString(),
        },
      },
    }));

  // Individual /insights/[slug] articles — derived directly from the
  // article content data, so the sitemap can never list a slug that
  // doesn't actually have a page.
  const articles: MetadataRoute.Sitemap = insightArticles.map((article) => ({
    url: new URL(`/insights/${article.slug}`, siteUrl).toString(),
    lastModified: article.datePublished,
    priority: 0.5,
  }));

  return [...pages, ...arPages, ...articles];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat(r9): add Arabic sitemap entries with reciprocal hreflang alternates"
```

---

### Task 4: Analytics `locale` field (schema, trackEvent, route handler, migration)

**Files:**
- Modify: `src/lib/analytics/event-schema.ts`
- Modify: `src/lib/analytics/event-schema.test.ts`
- Modify: `src/lib/analytics/events.ts`
- Modify: `src/app/api/events/route.ts`
- Modify: `src/app/api/events/route.test.ts`
- Create: `supabase/migrations/0006_add_locale_to_analytics_events.sql`

**Interfaces:**
- Produces: `AnalyticsEventInput.locale: "en" | "ar"` (required), derived automatically in `trackEvent()` from `path.startsWith("/ar")` — no other call site in the app changes.

- [ ] **Step 1: Write the failing schema tests**

In `src/lib/analytics/event-schema.test.ts`, update `validPayload` and add cases:

```ts
const validPayload = {
  name: "book_cta_click" as const,
  anonymousSessionId: "abc-123",
  path: "/erectile-dysfunction",
  serviceInterest: "erectile_dysfunction",
  source: "google_business",
  locale: "en" as const,
};

describe("analyticsEventSchema", () => {
  it("accepts a valid payload", () => {
    expect(analyticsEventSchema.safeParse(validPayload).success).toBe(true);
  });

  it("accepts locale 'ar'", () => {
    const result = analyticsEventSchema.safeParse({ ...validPayload, path: "/ar", locale: "ar" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid locale value", () => {
    const result = analyticsEventSchema.safeParse({ ...validPayload, locale: "fr" });
    expect(result.success).toBe(false);
  });

  it("rejects a payload missing locale", () => {
    const rest: Record<string, unknown> = { ...validPayload };
    delete rest.locale;
    expect(analyticsEventSchema.safeParse(rest).success).toBe(false);
  });

  // ...(existing "rejects an unknown event name", "rejects a payload missing required fields",
  // and the PII-field loop stay exactly as they are — they already spread `validPayload`,
  // which now includes `locale`)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/analytics/event-schema.test.ts`
Expected: FAIL — `locale` isn't a recognized field yet.

- [ ] **Step 3: Add `locale` to the schema**

In `src/lib/analytics/event-schema.ts`:

```ts
export const analyticsEventSchema = z
  .object({
    name: z.enum(EVENT_NAMES),
    anonymousSessionId: z.string().trim().min(1).max(100),
    path: z.string().trim().min(1).max(500),
    locale: z.enum(["en", "ar"]),
    serviceInterest: z.string().trim().max(60).optional(),
    source: z.string().trim().max(30).optional(),
    utmSource: z.string().trim().max(200).optional(),
    utmMedium: z.string().trim().max(200).optional(),
    utmCampaign: z.string().trim().max(200).optional(),
    referrerCategory: z.string().trim().max(30).optional(),
  })
  .strict();
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/analytics/event-schema.test.ts`
Expected: PASS

- [ ] **Step 5: Derive `locale` automatically in `trackEvent()`**

In `src/lib/analytics/events.ts`, inside `trackEvent`, after `const path = ...`:

```ts
const locale = path?.startsWith("/ar") ? "ar" : "en";
```

Add `locale` to the POST body:

```ts
body: JSON.stringify({
  name: event.name,
  anonymousSessionId: getAnonymousSessionId(),
  path,
  locale,
  serviceInterest: properties.service,
  source: properties.source,
  utmSource: properties.utm_source,
  utmMedium: properties.utm_medium,
  utmCampaign: properties.utm_campaign,
}),
```

This is the only production call site that needs to change — every component calling `trackEvent()` (`PageViewTracker`, `BookingCta`, etc.) is untouched, since `locale` is computed here from the already-passed `path`.

- [ ] **Step 6: Write the failing route test**

In `src/app/api/events/route.test.ts`, update the two request bodies that currently omit `locale` and add a plumbing assertion:

```ts
it("returns 200 for a valid event", async () => {
  const res = await POST(
    makeRequest({
      name: "page_view",
      anonymousSessionId: "abc-123",
      path: "/",
      locale: "en",
    }),
  );
  expect(res.status).toBe(200);
  expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ locale: "en" }));
});

it("returns 400 for malformed JSON", async () => {
  const req = new NextRequest("http://localhost/api/events", {
    method: "POST",
    body: "{not json",
  });
  const res = await POST(req);
  expect(res.status).toBe(400);
});

it("returns 400 for an event name outside the allow-list", async () => {
  const res = await POST(
    makeRequest({ name: "custom_event", anonymousSessionId: "abc-123", path: "/", locale: "en" }),
  );
  expect(res.status).toBe(400);
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run src/app/api/events/route.test.ts`
Expected: FAIL — `locale` missing from request bodies makes schema validation fail (400 instead of 200); `insertMock` assertion fails.

- [ ] **Step 8: Map `locale` through in the route handler**

In `src/app/api/events/route.ts`, add to the insert object:

```ts
await supabase.from("analytics_events").insert({
  anonymous_session_id: parsed.data.anonymousSessionId,
  event_name: parsed.data.name,
  path: parsed.data.path,
  locale: parsed.data.locale,
  service_interest: parsed.data.serviceInterest ?? null,
  source: parsed.data.source ?? null,
  utm_source: parsed.data.utmSource ?? null,
  utm_medium: parsed.data.utmMedium ?? null,
  utm_campaign: parsed.data.utmCampaign ?? null,
  referrer_category: parsed.data.referrerCategory ?? null,
});
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run src/app/api/events/route.test.ts`
Expected: PASS

- [ ] **Step 10: Write the Supabase migration**

Create `supabase/migrations/0006_add_locale_to_analytics_events.sql`:

```sql
-- 0006_add_locale_to_analytics_events.sql
-- R9 Phase A: tag analytics_events with the locale (en/ar) the event
-- fired from. Derived client-side from the page path in trackEvent()
-- (src/lib/analytics/events.ts) — not user input, not PII. Nullable so
-- any pre-migration rows remain valid; every new row going forward
-- always carries a value since trackEvent() always computes one.

alter table public.analytics_events add column locale text;

alter table public.analytics_events add constraint analytics_events_locale_check
  check (locale is null or locale in ('en', 'ar'));

create index analytics_events_locale_idx on public.analytics_events (locale);
```

- [ ] **Step 11: Apply the migration**

Use the Supabase MCP tool (`mcp__claude_ai_Supabase__apply_migration`) against the project referenced in `docs/superpowers/specs/2026-09-11-r9-phase-a-arabic-i18n-foundation-design.md` (project ref `wsgudfdifdqwacnbntbr`), passing the SQL from Step 10. Confirm with `mcp__claude_ai_Supabase__list_migrations` that `0006_add_locale_to_analytics_events` is applied. This is an additive, nullable column — non-breaking for existing rows and the running production app.

- [ ] **Step 12: Run full test suite and commit**

Run: `npm test && npm run typecheck`
Expected: all pass.

```bash
git add src/lib/analytics/event-schema.ts src/lib/analytics/event-schema.test.ts \
  src/lib/analytics/events.ts src/app/api/events/route.ts src/app/api/events/route.test.ts \
  supabase/migrations/0006_add_locale_to_analytics_events.sql
git commit -m "feat(r9): tag analytics events with locale, derived automatically from path"
```

---

### Task 5: `HomePageContent` type + Arabic homepage content data

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/ar/home.ts`

**Interfaces:**
- Produces: `HomePageContent` type and `homeContentAr: HomePageContent` — consumed by Task 7 (`HomePageTemplate`) and Task 15 (`/ar` page).

No test in this task — it's pure typed data with no branching logic to unit-test; its correctness is verified structurally by `HomePageTemplate` compiling against the type (Task 7) and visually in Task 16's QA pass.

- [ ] **Step 1: Create the content type**

Create `src/content/types.ts`:

```ts
/**
 * Typed content shape for the homepage template (R9 Phase A). Content
 * only — no JSX, no layout decisions, no `any`. Additional page-family
 * types get added here as Phase B builds more templates.
 */
export type HomePageContent = {
  hero: {
    eyebrow: string;
    heading: string;
    specialtyLine: string;
    description: string;
    credentialLine: string;
    locationLine: string;
    ctaLabel: string;
  };
  trust: {
    eyebrow: string;
    heading: string;
    stats: string[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: { question: string; answer: string }[];
  };
  booking: {
    heading: string;
    description: string;
    supportingLine: string;
    ctaLabel: string;
  };
};
```

- [ ] **Step 2: Write the Arabic homepage content**

Create `src/content/ar/home.ts`:

```ts
import type { HomePageContent } from "@/content/types";

/**
 * Arabic homepage pilot content (R9 Phase A). Professional-effort
 * Modern Standard Arabic; flagged for a native-speaker QA pass before
 * Phase B scales this pattern to the remaining priority pages (spec
 * §14, §30 of the master R9 brief).
 */
export const homeContentAr: HomePageContent = {
  hero: {
    eyebrow: "استشاري أمراض المسالك البولية والذكورة · أبوظبي",
    heading: "د. أليخاندرو مولينا",
    specialtyLine: "طب الذكورة · الصحة الجنسية للرجال · التجميل الذكوري",
    description:
      "رعاية متخصصة في الطب الجنسي، الصحة الهرمونية للرجال، جراحة القضيب، والتجميل الذكوري، مع خبرة خاصة في زيادة سماكة القضيب.",
    credentialLine: "FEBU · زميل المجلس الأوروبي لطب المسالك البولية",
    locationLine: "استشارات في مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي",
    ctaLabel: "احجز استشارة",
  },
  trust: {
    eyebrow: "الخبرة والثقة",
    heading: "خبرة موثوقة في طب الذكورة",
    stats: [
      "+15 عامًا من الخبرة في طب المسالك البولية",
      "أكثر من 500 إجراء لزيادة سماكة القضيب",
      "يُجري إجراءات زيادة السماكة بحمض الهيالورونيك منذ عام 2018",
      "Top Doctors Spain 2020 · Doctoralia Awards Spain 2022",
    ],
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    heading: "الأسئلة الشائعة",
    items: [
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
    ],
  },
  booking: {
    heading: "ابدأ استشارتك اليوم",
    description: "احجز استشارتك مع د. أليخاندرو مولينا للحصول على تقييم متخصص يراعي احتياجاتك الفردية.",
    supportingLine: "سيتم توجيهك إلى نظام حجز مستشفى إن إم سي رويال لإكمال الحجز.",
    ctaLabel: "احجز استشارة",
  },
};
```

- [ ] **Step 3: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/content/types.ts src/content/ar/home.ts
git commit -m "feat(r9): add HomePageContent type and Arabic homepage pilot content"
```

---

### Task 6: `Faq` component — configurable heading, `inLanguage`, logical text alignment

**Files:**
- Modify: `src/lib/seo/json-ld.ts`
- Modify: `src/components/ui/Faq.tsx`

**Interfaces:**
- Produces: `faqPageSchema(items, options?: { inLanguage?: string })`; `Faq` accepts optional `heading` and `locale` props (both default to today's exact behavior — zero change for every existing English caller).

- [ ] **Step 1: Let `faqPageSchema` accept an optional `inLanguage`**

In `src/lib/seo/json-ld.ts`, update `faqPageSchema` (spec §10/§24: Arabic FAQ structured data must carry `inLanguage`, never silently reuse an unmarked/English-implied schema):

```ts
/** Only render when the page has genuinely visible FAQ content (spec §24). */
export function faqPageSchema(
  items: { question: string; answer: string }[],
  options?: { inLanguage?: string },
) {
  return prune({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: options?.inLanguage,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}
```

(`prune()` already drops `undefined` values, so every existing English caller — which passes no `options` — gets byte-identical output to today.)

- [ ] **Step 2: Make `Faq`'s heading configurable, pass through `locale`, fix text alignment**

In `src/components/ui/Faq.tsx`, change the function signature and the two spots noted:

```tsx
export function Faq({
  items,
  eyebrow = "FAQs",
  heading = "Frequently Asked Questions",
  locale,
}: {
  items: FaqItem[];
  eyebrow?: string;
  heading?: string;
  /** When set, tags the FAQPage JSON-LD with `inLanguage` (spec §10/§24). Omit for English. */
  locale?: "ar";
}) {
  return (
    <section className="py-section-y">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} heading={heading} size="md" />

        <Accordion.Root type="single" collapsible className="mt-10 border-t border-border">
          {items.map((item) => (
            <Accordion.Item
              key={item.question}
              value={item.question}
              className="border-b border-border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-start font-display text-lg text-foreground sm:text-xl">
```

...and at the bottom of the component, change the `JsonLd` call:

```tsx
      <JsonLd data={faqPageSchema(items, locale ? { inLanguage: locale } : undefined)} />
```

(Only `heading`/`locale` in the function signature, the `JsonLd`/`faqPageSchema` call, and `text-left` → `text-start` on `Accordion.Trigger`'s className, change. Every other line stays identical.)

`text-start` resolves to `left` under `dir="ltr"` (identical to today's `text-left` for every existing English page) and to `right` under `dir="rtl"` — a behavior-preserving change for English, correct for Arabic.

- [ ] **Step 3: Run full test suite (regression check) and typecheck**

Run: `npm test && npm run typecheck`
Expected: all pass — no existing test asserts on this class or the literal heading string, so nothing breaks.

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo/json-ld.ts src/components/ui/Faq.tsx
git commit -m "feat(r9): make Faq heading/locale configurable, tag Arabic FAQ schema with inLanguage"
```

---

### Task 7: `HomePageTemplate` component

**Files:**
- Create: `src/components/templates/HomePageTemplate.tsx`

**Interfaces:**
- Consumes: `HomePageContent` (Task 5), `Container`, `SectionHeading`, `Faq` (Task 6), `BookingCta`, `HeroAtmosphere`, `Reveal` (all existing, unmodified except `Faq`).
- Produces: `HomePageTemplate({ content }: { content: HomePageContent })` — consumed by Task 15.

- [ ] **Step 1: Create the template**

Create `src/components/templates/HomePageTemplate.tsx`:

```tsx
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { Reveal } from "@/components/motion/Reveal";
import type { HomePageContent } from "@/content/types";

/**
 * Homepage page-family template (R9 Phase A, spec §5 Approach C). Takes
 * typed content and renders it with the existing shared primitives — no
 * layout decisions live in the content object itself. This is an
 * intentionally reduced "representative subset" of the full English
 * homepage's ~10 sections (hero, trust/authority stats, FAQ, booking
 * CTA only) — full section parity is a Phase B follow-up, not built
 * here.
 */
export function HomePageTemplate({ content }: { content: HomePageContent }) {
  return (
    <div>
      <section className="relative overflow-hidden py-section-y">
        <HeroAtmosphere align="left" />
        <Container className="relative z-10">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              {content.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-display-2xl text-foreground">
              {content.hero.heading}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {content.hero.specialtyLine}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
              {content.hero.description}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">{content.hero.credentialLine}</p>
              <p className="mt-1 text-sm text-muted-foreground">{content.hero.locationLine}</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <BookingCta sourcePage="/ar" ctaPosition="homepage-pilot-hero">
                {content.hero.ctaLabel}
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow={content.trust.eyebrow} heading={content.trust.heading} size="md" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {content.trust.stats.map((stat) => (
              <li key={stat} className="border-t border-border pt-4 text-body-lg text-foreground">
                {stat}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq
        items={content.faq.items}
        eyebrow={content.faq.eyebrow}
        heading={content.faq.heading}
        locale="ar"
      />

      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-2xl text-center">
          <h2 className="font-display text-display-lg text-foreground">{content.booking.heading}</h2>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground">
            {content.booking.description}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{content.booking.supportingLine}</p>
          <div className="mt-8 flex justify-center">
            <BookingCta sourcePage="/ar" ctaPosition="homepage-pilot-booking" size="lg">
              {content.booking.ctaLabel}
            </BookingCta>
          </div>
        </Container>
      </section>
    </div>
  );
}
```

`BookingCta`'s `href` always points at `/book` (hardcoded in that component) — correct as-is, since `/ar/book` doesn't exist until Phase C; this is the documented "link to English, no Arabic equivalent yet" fallback (spec §6).

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/components/templates/HomePageTemplate.tsx
git commit -m "feat(r9): add HomePageTemplate presentational component"
```

---

### Task 8: Locale-aware navigation config

**Files:**
- Modify: `src/config/navigation.ts`

**Interfaces:**
- Produces: `getPrimaryNav(locale)`, `getLegalNav(locale)`, `getFooterServiceLinks(locale)` — consumed by Tasks 10–12. Existing exports (`primaryNav`, `bookHref`, `legalNav`, `footerServiceLinks`) are unchanged.

- [ ] **Step 1: Add Arabic nav arrays and locale-aware getters**

Append to `src/config/navigation.ts` (all existing exports above stay untouched):

```ts
/**
 * Arabic nav labels (R9 Phase A). Hrefs point at the existing English
 * pages, since no Arabic equivalent exists for any of these yet — this
 * flips automatically to the Arabic route as each one ships in Phase B,
 * once `routes.ts` gains an `arPath` for it (spec §6, §25).
 */
const primaryNavAr: NavItem[] = [
  { label: "الصحة الرجولية", href: "/mens-health" },
  { label: "الطب الجنسي", href: "/sexual-medicine" },
  { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
  { label: "جراحة القضيب", href: "/penile-surgery" },
  { label: "التجميل الذكوري", href: "/male-aesthetics" },
  { label: "نبذة عن الطبيب", href: "/about" },
];

export function getPrimaryNav(locale: "en" | "ar"): NavItem[] {
  return locale === "ar" ? primaryNavAr : primaryNav;
}

export function getBookLabel(locale: "en" | "ar"): string {
  return locale === "ar" ? "الحجز" : "Book";
}

const legalNavAr: NavItem[] = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "الشروط", href: "/terms" },
  { label: "إخلاء المسؤولية الطبية", href: "/medical-disclaimer" },
];

export function getLegalNav(locale: "en" | "ar"): NavItem[] {
  return locale === "ar" ? legalNavAr : legalNav;
}

const footerServiceLinksAr: NavItem[] = [
  { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
  { label: "التجميل الذكوري", href: "/male-aesthetics" },
  { label: "ضعف الانتصاب", href: "/erectile-dysfunction" },
  { label: "سرعة القذف", href: "/sexual-medicine/premature-ejaculation" },
  { label: "زراعة دعامة القضيب", href: "/penile-implant" },
  { label: "التستوستيرون والصحة الهرمونية", href: "/mens-health/testosterone" },
  { label: "مرض بيروني", href: "/peyronies-disease" },
  { label: "خصوبة الرجل", href: "/male-fertility" },
  { label: "قطع القناة المنوية دون مشرط", href: "/mens-health/vasectomy" },
];

export function getFooterServiceLinks(locale: "en" | "ar"): NavItem[] {
  return locale === "ar" ? footerServiceLinksAr : footerServiceLinks;
}
```

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/config/navigation.ts
git commit -m "feat(r9): add locale-aware navigation getters with Arabic labels"
```

---

### Task 9: `LanguageSwitcher` component

**Files:**
- Create: `src/components/navigation/LanguageSwitcher.tsx`

**Interfaces:**
- Consumes: `getLocalizedPathPair` (Task 1).
- Produces: `LanguageSwitcher()` (no props — self-sufficient via `usePathname()`) — consumed by Tasks 10 and 12.

- [ ] **Step 1: Create the component**

Create `src/components/navigation/LanguageSwitcher.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getLocalizedPathPair } from "@/lib/seo/routes";

/**
 * Language switcher (R9 Phase A spec §7 — final decision). Only ever
 * renders a link to the other locale when the route registry confirms
 * a real pair exists; otherwise the other-language slot is omitted
 * entirely — never a disabled placeholder, never a fallback to the
 * locale homepage. The current language is always shown as plain,
 * non-link text.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");
  const pair = getLocalizedPathPair(pathname);
  const currentLabel = isArabic ? "العربية" : "EN";
  const otherHref = pair ? (isArabic ? pair.en : pair.ar) : null;

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span aria-current="true" className="text-foreground">
        {currentLabel}
      </span>
      {otherHref && (
        <>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link
            href={otherHref}
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {isArabic ? "English" : "العربية"}
          </Link>
        </>
      )}
    </div>
  );
}
```

No new unit test here: the branching logic this component depends on (`getLocalizedPathPair`) is already fully covered by Task 1's tests; there's no DOM-rendering test framework configured in this project (Vitest is `environment: "node"`, no `@testing-library/react`/jsdom — consistent with every other component in this codebase having zero render tests). Correctness of the rendered output is verified visually in Task 16's QA pass.

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/components/navigation/LanguageSwitcher.tsx
git commit -m "feat(r9): add LanguageSwitcher, gated strictly on the route registry"
```

---

### Task 10: `Header` / `DesktopNav` / `MobileNav` locale support

Grouped as one task: `Header` renders `MobileNav` and `DesktopNav` directly, so their `locale` props can't be reviewed or typechecked independently of each other — this task ends in a fully green state, unlike a split that would leave an intermediate step with a deliberately failing typecheck.

**Files:**
- Modify: `src/components/navigation/MobileNav.tsx`
- Modify: `src/components/navigation/DesktopNav.tsx`
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `getPrimaryNav`, `getBookLabel` (Task 8), `LanguageSwitcher` (Task 9).
- Produces: `Header({ locale?: "en" | "ar" })`, `DesktopNav({ locale?: "en" | "ar" })`, `MobileNav({ locale?: "en" | "ar" })` — all default to `"en"`, so every existing call site (currently rendered with no props) is unaffected.

- [ ] **Step 1: Update `MobileNav`**

Replace `src/components/navigation/MobileNav.tsx`:

```tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { useState } from "react";
import { bookHref, getBookLabel, getPrimaryNav } from "@/config/navigation";
import { BookingCta } from "@/components/ui/BookingCta";

const copy = {
  en: { openMenu: "Open menu", menuTitle: "Menu", closeMenu: "Close menu", ctaLabel: "Book a Consultation" },
  ar: {
    openMenu: "فتح القائمة",
    menuTitle: "القائمة",
    closeMenu: "إغلاق القائمة",
    ctaLabel: "احجز استشارة",
  },
} as const;

/**
 * Accessible mobile drawer (spec §6). `end-0` (logical inset) instead
 * of `right-0` so the drawer opens from the trailing edge in both
 * directions — the leading-edge/trailing-edge convention RTL layouts
 * expect (R9 Phase A spec §6/§29 mobile-nav RTL requirement).
 */
export function MobileNav({ locale = "en" }: { locale?: "en" | "ar" }) {
  const [open, setOpen] = useState(false);
  const t = copy[locale];
  const items = getPrimaryNav(locale);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t.openMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-foreground xl:hidden"
        >
          <Menu aria-hidden size={22} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-stone-950/40" />
        <Dialog.Content
          className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-background px-gutter py-6 shadow-xl"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-lg">{t.menuTitle}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t.closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-foreground"
              >
                <X aria-hidden size={22} />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Primary" className="mt-6 flex flex-col gap-5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-display text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link href={bookHref} onClick={() => setOpen(false)} className="text-2xl font-display text-foreground">
              {getBookLabel(locale)}
            </Link>
          </nav>

          <div className="mt-auto pt-10">
            <BookingCta sourcePage="mobile-nav" ctaPosition="mobile-drawer" size="lg" className="w-full">
              {t.ctaLabel}
            </BookingCta>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- [ ] **Step 2: Update `DesktopNav`**

Replace `src/components/navigation/DesktopNav.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { getPrimaryNav } from "@/config/navigation";

export function DesktopNav({ locale = "en" }: { locale?: "en" | "ar" }) {
  const pathname = usePathname();
  const items = getPrimaryNav(locale);
  return (
    <nav aria-label="Primary" className="hidden items-center gap-3 xl:flex 2xl:gap-5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className="whitespace-nowrap text-[0.8125rem] leading-snug font-medium aria-[current=page]:underline underline-offset-8 text-foreground/80 transition-colors duration-150 hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Update `Header`**

Replace `src/components/layout/Header.tsx`:

```tsx
"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { useScrolled } from "@/components/navigation/useScrolled";
import { cn } from "@/lib/utils/cn";

/** Spec §6: sticky header after initial scroll, discreet persistent mobile booking CTA. */
export function Header({ locale = "en" }: { locale?: "en" | "ar" }) {
  const scrolled = useScrolled();
  const homeHref = locale === "ar" ? "/ar" : "/";
  const homeAriaLabel =
    locale === "ar" ? "د. أليخاندرو مولينا — الصفحة الرئيسية" : "Dr. Alejandro Molina — Home";
  const bookingCtaLabel = locale === "ar" ? "احجز استشارة" : "Book a Consultation";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-[background-color,box-shadow] duration-300 ease-out",
        scrolled ? "bg-background/90 shadow-sm backdrop-blur-md" : "bg-background",
      )}
    >
      <Container className="flex min-h-28 items-center justify-between gap-x-5">
        <Link href={homeHref} className="shrink-0" aria-label={homeAriaLabel}>
          <BrandLogo />
        </Link>

        <DesktopNav locale={locale} />

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <BookingCta sourcePage="global-header" ctaPosition="header" size="sm">
              {bookingCtaLabel}
            </BookingCta>
          </div>
          <LanguageSwitcher />
          <MobileNav locale={locale} />
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 4: Typecheck and run full test suite**

Run: `npm run typecheck && npm test`
Expected: all pass (default `locale = "en"` reproduces the exact previous output for every existing caller of all three components).

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/MobileNav.tsx src/components/navigation/DesktopNav.tsx src/components/layout/Header.tsx
git commit -m "feat(r9): make Header/DesktopNav/MobileNav locale-aware, add language switcher to header"
```

---

### Task 11: `Footer` locale support

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/ui/CookieSettingsLink.tsx`

**Interfaces:**
- Consumes: `getFooterServiceLinks`, `getLegalNav` (Task 8).
- Produces: `Footer({ locale?: "en" | "ar" })`, `CookieSettingsLink({ locale?: "en" | "ar" })` — both default to `"en"`.

- [ ] **Step 1: Update `CookieSettingsLink`**

Replace `src/components/ui/CookieSettingsLink.tsx`:

```tsx
"use client";

import { reopenConsentBanner } from "./ConsentBanner";

export function CookieSettingsLink({ locale = "en" }: { locale?: "en" | "ar" }) {
  return (
    <button type="button" onClick={reopenConsentBanner} className="transition-colors hover:text-foreground">
      {locale === "ar" ? "إعدادات ملفات تعريف الارتباط" : "Cookie Settings"}
    </button>
  );
}
```

- [ ] **Step 2: Update `Footer`**

Replace `src/components/layout/Footer.tsx`:

```tsx
import visual from "@/components/editorial/VisualSystem.module.css";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CookieSettingsLink } from "@/components/ui/CookieSettingsLink";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import { bookHref, getFooterServiceLinks, getLegalNav } from "@/config/navigation";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { Container } from "@/components/ui/Container";

const copy = {
  en: {
    homeHref: "/",
    homeAriaLabel: "Dr. Alejandro Molina — Home",
    tagline: "Andrology · Men’s Sexual Health · Male Genital Aesthetics",
    consultationsAt: (location: string) => `Consultations at ${location}`,
    careAreas: "Care Areas",
    yourConsultation: "Your consultation",
    about: "About Dr. Molina",
    insights: "Patient Insights",
    book: "Book a Consultation",
    nmcProfile: "View NMC Profile",
    rightsReserved: "All rights reserved.",
  },
  ar: {
    homeHref: "/ar",
    homeAriaLabel: "د. أليخاندرو مولينا — الصفحة الرئيسية",
    tagline: "طب الذكورة · الصحة الجنسية للرجال · التجميل الذكوري",
    consultationsAt: (location: string) => `استشارات في ${location}`,
    careAreas: "مجالات الرعاية",
    yourConsultation: "استشارتك",
    about: "نبذة عن د. مولينا",
    insights: "رؤى للمرضى",
    book: "احجز استشارة",
    nmcProfile: "عرض الملف الشخصي في NMC",
    rightsReserved: "جميع الحقوق محفوظة.",
  },
} as const;

export function Footer({ locale = "en" }: { locale?: "en" | "ar" }) {
  const year = new Date().getFullYear();
  const t = copy[locale];
  const footerServiceLinks = getFooterServiceLinks(locale);
  const legalNav = getLegalNav(locale);

  return (
    <footer className={`${visual.footer} text-foreground`}>
      <Container className="py-section-y">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_0.7fr]">
          <div className={visual.footerBrand}>
            <Link href={t.homeHref} className="inline-block" aria-label={t.homeAriaLabel}>
              <BrandLogo footer />
            </Link>
            <p className={visual.footerIntro}>{t.tagline}</p>
            <p className="mt-6 text-sm text-muted-foreground">{t.consultationsAt(practiceLocationLine)}</p>
          </div>

          <nav aria-label="Services" className="text-sm">
            <p className="text-eyebrow font-medium uppercase tracking-widest text-muted-foreground">
              {t.careAreas}
            </p>
            <ul className="mt-4 space-y-3">
              {footerServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-foreground/85 transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="text-sm">
            <p className="text-eyebrow font-medium uppercase tracking-widest text-muted-foreground">
              {t.yourConsultation}
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-foreground/85 transition-colors hover:text-foreground">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-foreground/85 transition-colors hover:text-foreground">
                  {t.insights}
                </Link>
              </li>
              <li>
                <Link href={bookHref} className="text-foreground/85 transition-colors hover:text-foreground">
                  {t.book}
                </Link>
              </li>
              {isPhysicianProfileConfigured && (
                <li>
                  <a
                    href={practice.physicianProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {t.nmcProfile}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {doctor.displayName}. {t.rightsReserved}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <CookieSettingsLink locale={locale} />
          </nav>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 3: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS (default `locale = "en"` reproduces the exact previous output for every existing caller).

```bash
git add src/components/layout/Footer.tsx src/components/ui/CookieSettingsLink.tsx
git commit -m "feat(r9): make Footer/CookieSettingsLink locale-aware"
```

---

### Task 12: `ConsentBanner` Arabic copy

**Files:**
- Modify: `src/components/ui/ConsentBanner.tsx`

**Interfaces:**
- Produces: `ConsentBanner({ locale?: "en" | "ar" })`, default `"en"`.

- [ ] **Step 1: Add a `locale` prop with Arabic copy**

In `src/components/ui/ConsentBanner.tsx`, update the function signature and JSX (everything else — state, effects, `choose`, event wiring — stays exactly as-is):

```tsx
const copy = {
  en: {
    body: (
      <>
        This site may use analytics cookies to understand how visitors use it. No health or
        symptom information is ever included. You can accept or decline, and change your choice
        anytime — see our{" "}
        <Link href="/privacy" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
          Privacy Policy
        </Link>
        .
      </>
    ),
    decline: "Decline",
    accept: "Accept",
  },
  ar: {
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
    decline: "رفض",
    accept: "قبول",
  },
} as const;

export function ConsentBanner({ locale = "en" }: { locale?: "en" | "ar" }) {
  const [visible, setVisible] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getConsent() === "unset");
    resyncConsentCookie();

    function handleReopen() {
      setVisible(true);
    }
    window.addEventListener(REOPEN_EVENT, handleReopen);
    return () => window.removeEventListener(REOPEN_EVENT, handleReopen);
  }, []);

  if (!visible) return null;

  function choose(status: "granted" | "denied") {
    setConsent(status);
    setVisible(false);
  }

  return (
    <div role="region" aria-label="Cookie preferences" className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-editorial flex-col gap-4 px-gutter py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">{t.body}</p>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="sm" onClick={() => choose("denied")}>
            {t.decline}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => choose("granted")}>
            {t.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

Note: the Privacy Policy link stays `/privacy` (English) for both locales — `/ar/privacy` doesn't exist until Phase C (spec §13/§14).

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/components/ui/ConsentBanner.tsx
git commit -m "feat(r9): add Arabic copy to ConsentBanner via locale prop"
```

---

### Task 13: `PageShell` locale prop threading

**Files:**
- Modify: `src/components/layout/PageShell.tsx`

**Interfaces:**
- Consumes: `Header`, `Footer` (both now locale-aware).
- Produces: `PageShell({ locale?: "en" | "ar" })` — consumed by Task 15.

- [ ] **Step 1: Thread `locale` through**

Replace `src/components/layout/PageShell.tsx`:

```tsx
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

/** Global shell — spec §38 Phase 1: "global shell, header/footer". */
export function PageShell({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: "en" | "ar";
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SkipLink />
      <Header locale={locale} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: Run full test suite + typecheck and commit**

Run: `npm test && npm run typecheck`
Expected: all pass.

```bash
git add src/components/layout/PageShell.tsx
git commit -m "feat(r9): thread locale prop through PageShell to Header/Footer"
```

---

### Task 14: `app/ar/layout.tsx` — RTL wrapper, Arabic font, JSON-LD

**Files:**
- Create: `src/app/ar/layout.tsx`

**Interfaces:**
- Consumes: `ConsentBanner` (Task 12), `MotionProvider`, `JsonLd`, `personSchema`, `physicianSchema` (all existing, unmodified).
- Produces: the root shell for everything under `/ar`, consumed by Task 15.

- [ ] **Step 1: Create the layout**

Create `src/app/ar/layout.tsx`:

```tsx
import type { CSSProperties, ReactNode } from "react";
import { Noto_Sans_Arabic } from "next/font/google";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { personSchema, physicianSchema } from "@/lib/seo/json-ld";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

/**
 * R9 Phase A spec §4: `lang`/`dir` are set here, on a wrapper just
 * inside `<body>` — not on the true `<html>` root. `<html>` (defined
 * once in `src/app/layout.tsx`) always stays `lang="en"`; that's an
 * accepted, documented trade-off (see spec §4/§14) that avoids the real
 * costs of Next.js's multiple-root-layouts pattern (touching `/admin`,
 * an experimental `globalNotFound` flag, full-reload navigation between
 * `(marketing)`/`(legal)`). `dir`/`lang` on this element still cascade
 * correctly to every descendant for RTL rendering and assistive tech.
 *
 * `display: contents` (via the `contents` class) removes this element
 * from the layout/box tree entirely, so it can't interrupt the
 * `h-full`/`min-h-full` height chain from `<body>` down to `PageShell` —
 * `dir`/`lang`/CSS custom properties still inherit to children exactly
 * as they would from a normal element.
 */
const arabicFontVars = {
  "--font-display": "var(--font-noto-sans-arabic)",
  "--font-sans": "var(--font-noto-sans-arabic)",
} as CSSProperties;

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className={`${notoSansArabic.variable} contents`} style={arabicFontVars}>
      <JsonLd data={[personSchema(), physicianSchema()]} />
      <MotionProvider>
        <ConsentBanner locale="ar" />
        {children}
      </MotionProvider>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/app/ar/layout.tsx
git commit -m "feat(r9): add /ar root shell with RTL wrapper and Arabic font"
```

---

### Task 15: `/ar` homepage pilot page

**Files:**
- Create: `src/app/ar/(marketing)/layout.tsx`
- Create: `src/app/ar/(marketing)/page.tsx`

**Interfaces:**
- Consumes: `PageShell` (Task 13), `PageViewTracker` (existing, unmodified), `buildMetadata` (Task 2), `homeContentAr` (Task 5), `HomePageTemplate` (Task 7).

- [ ] **Step 1: Create the Arabic marketing layout**

Create `src/app/ar/(marketing)/layout.tsx`:

```tsx
import { Suspense, type ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default function ArabicMarketingLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell locale="ar">
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PageShell>
  );
}
```

- [ ] **Step 2: Create the Arabic homepage page**

Create `src/app/ar/(marketing)/page.tsx`:

```tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { homeContentAr } from "@/content/ar/home";
import { HomePageTemplate } from "@/components/templates/HomePageTemplate";

export const metadata: Metadata = buildMetadata({
  title: "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة، أبوظبي",
  description:
    "رعاية متخصصة في الطب الجنسي، الصحة الهرمونية للرجال، جراحة القضيب، الخصوبة، والتجميل الذكوري في أبوظبي، الإمارات العربية المتحدة.",
  path: "/ar",
});

export default function ArabicHomePage() {
  return <HomePageTemplate content={homeContentAr} />;
}
```

- [ ] **Step 3: Full build, typecheck, lint, test**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all pass, build succeeds with `/ar` as a new route.

- [ ] **Step 4: Commit**

```bash
git add "src/app/ar/(marketing)/layout.tsx" "src/app/ar/(marketing)/page.tsx"
git commit -m "feat(r9): wire up /ar homepage pilot page"
```

---

### Task 16: Local verification + RTL visual QA pass

**Files:** none created — this task drives fixes into whichever files above actually need them, based on what's visually observed.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)

- [ ] **Step 2: Verify the English site is unchanged**

Using Playwright (`mcp__plugin_playwright_playwright__browser_navigate` / `browser_take_screenshot`), load `/` and 2–3 other existing English pages (e.g. `/about`, `/erectile-dysfunction`). Confirm: visually identical to before this branch, no console errors (`browser_console_messages`), language switcher shows "EN" plain text with no "العربية" link (since those specific pages have no `arPath` yet) except on `/` where "العربية" now appears and links to `/ar`.

- [ ] **Step 3: Verify `/ar` at all four required breakpoints**

Navigate to `/ar`, resize to 390, 768, 1024, and 1440px (`browser_resize`) and screenshot each. Check against the spec §12 exit criteria:
- `dir="rtl"`, Arabic font rendering, no LTR-leaking text runs.
- Header: logo links to `/ar`, nav shows Arabic labels, language switcher shows "العربية" (current, plain text) + "EN" linking back to `/`.
- Mobile nav (390px): drawer opens from the correct trailing edge, Arabic labels, no horizontal overflow.
- FAQ accordion: expands/collapses correctly, chevron/plus icon and text alignment read correctly RTL.
- Footer: Arabic labels, correct links, Cookie Settings label in Arabic.
- Cookie banner (trigger via `CookieSettingsLink` or clear site data and reload): Arabic copy, Accept/Decline buttons.
- No hydration errors, no console errors (`browser_console_messages`).

- [ ] **Step 4: Fix anything found**

If a visual RTL issue turns up (e.g. an icon or spacing utility that doesn't flip correctly), fix it in the specific component file responsible, re-screenshot to confirm, and commit that fix separately with a message describing exactly what broke and why (e.g. `fix(r9): flip icon-x spacing for RTL in ComponentY`). Do not batch unrelated fixes into one commit.

- [ ] **Step 5: Verify canonical/hreflang/sitemap on the running dev server**

Fetch `/ar`'s rendered `<head>` (via `browser_navigate` + reading page source, or `curl http://localhost:3000/ar` if the dev server is reachable via Bash) and confirm `<link rel="canonical">` points to the Arabic URL and `<link rel="alternate" hreflang="...">` tags are present and reciprocal. Fetch `/sitemap.xml` and confirm the `/ar` entry and its alternates appear, and that no other `/ar/*` path is listed.

- [ ] **Step 6: Full verification suite**

Run: `npm run typecheck && npm run lint && npm run build && npm test && git diff --check`
Expected: all clean.

- [ ] **Step 7: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix(r9): RTL/visual QA fixes for /ar homepage pilot"
```

(Skip this commit if Step 4 found nothing to fix.)

---

### Task 17: Push, deploy Preview, exit-criteria walkthrough

**Files:** none.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/arabic-localization-r9
```

- [ ] **Step 2: Deploy to Preview**

Use the Vercel MCP tooling (`mcp__claude_ai_Vercel__deploy_to_vercel` or the project's normal PR-preview flow) to get a Preview URL for this branch.

- [ ] **Step 3: Re-run the Task 16 QA pass against the Preview URL, not just localhost**

Repeat steps 2, 3, and 5 from Task 16 against the real Preview deployment (production-like environment, real `siteUrl` resolution, real Supabase connectivity for the analytics `locale` field via a manual `book_cta_click`/`page_view` check if convenient).

- [ ] **Step 4: Walk through the spec's exit criteria explicitly**

Open `docs/superpowers/specs/2026-09-11-r9-phase-a-arabic-i18n-foundation-design.md` §12 and confirm each of the 7 items against the Preview deployment. Report the result of each one back to the user — do not merge or claim Phase A complete until every item is confirmed, per the spec's explicit "do not start Phase B until..." gate.

- [ ] **Step 5: Report to the user**

Summarize: Preview URL, exit-criteria results, any open items flagged for native-Arabic-speaker review (spec §14), and that Production has not been touched (`main` unchanged). Do not merge to `main` — that decision is the user's, made after they've reviewed the Preview themselves.
