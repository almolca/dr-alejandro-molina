// src/lib/seo/ar-href-invariant.test.ts
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

/**
 * Guards against the exact bug class the R9 booking funnel
 * correction's final review found three instances of: a literal,
 * hardcoded English href sitting inside a file that only ever
 * renders on an Arabic route, for a path that already has a real
 * Arabic equivalent registered in `routes.ts`.
 *
 * Honest scope (corrected after the Batch 4 final review flagged the
 * original docstring's overclaim): this test's SCAN_ROOTS cover
 * Arabic-only page/section/content source, which is where one of
 * those three historical bugs (the Arabic mens-health hub) lived —
 * Footer.tsx and MobileNav.tsx live in shared bilingual components
 * outside these roots (they render on both /en and /ar routes, so
 * they can never hardcode a bare `/ar`-less literal the way this
 * check assumes) and are covered by the separate
 * "shared bilingual components" check below instead, which handles
 * the different failure shape those two bugs actually had — a bare
 * href reaching a `localizeHref()` call site unwrapped, not always a
 * plain string literal.
 *
 * Deliberately a plain source-text scan, not a JSX/AST analysis: the
 * failure pattern is "the literal string appears in a file that only
 * renders under /ar", which a substring search catches reliably and
 * without needing to understand React's render tree. False positives
 * are possible (a comment mentioning the English path, an English
 * path that happens to be a substring of a longer Arabic one) — the
 * SCAN_ROOTS/allowlist below exist to keep it exactly as narrow as
 * the real bug class, not broader.
 */

const SCAN_ROOTS = ["src/app/(ar)", "src/components/sections/ar", "src/content/ar"];

function collectFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      if (!entry.name.endsWith(".test.ts") && !entry.name.endsWith(".test.tsx")) {
        out.push(full);
      }
    }
  }
  return out;
}

// English routes that have a real Arabic equivalent today. A file
// under SCAN_ROOTS containing a literal `"<path>"` or `'<path>'` for
// one of these — NOT prefixed with /ar — is exactly the bug class
// this test exists to catch.
//
// The homepage route ("/") is deliberately excluded: its path is a
// single-character substring that appears constantly in unrelated
// code (`.split("/")`, `.join("/")`, template literals building up a
// longer path, etc.) — asserting no Arabic file contains a bare `"/"`
// or `'/'` string is a false-positive trap waiting to trigger on
// harmless code, not a meaningful check of this bug class. Every
// other route's path is long enough to be a reliable signal.
const routesWithArPath = routes.filter(
  (r): r is typeof r & { arPath: string } => Boolean(r.arPath) && r.path !== "/",
);

describe("Arabic-only source never hardcodes an English href with a live Arabic equivalent", () => {
  const files = SCAN_ROOTS.flatMap((root) => collectFiles(root));

  it("scanned at least one file per root (sanity check that the scan itself isn't silently empty)", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const route of routesWithArPath) {
    it(`no Arabic-only file hardcodes "${route.path}" (should be "${route.arPath}")`, () => {
      const offenders: string[] = [];
      for (const file of files) {
        const content = readFileSync(file, "utf-8");
        const doubleQuoted = `"${route.path}"`;
        const singleQuoted = `'${route.path}'`;
        if (content.includes(doubleQuoted) || content.includes(singleQuoted)) {
          offenders.push(file);
        }
      }
      expect(offenders).toEqual([]);
    });
  }
});

/**
 * Covers the different failure shape Footer.tsx and MobileNav.tsx
 * actually had (found by the R9 booking funnel correction's final
 * review, fixed earlier on this branch): unlike the mens-health-hub
 * bug above, these are shared bilingual components that render on
 * BOTH /en and /ar routes, so a bare `"/mens-health/vasectomy"`
 * literal in them isn't inherently wrong — what was wrong is a bare
 * literal reaching JSX (or otherwise being used as a real href)
 * WITHOUT first going through `localizeHref(...)` or
 * `getLocalizedPathPair(...)`, which is what actually picks the
 * locale-correct destination at render time.
 *
 * A naive literal-string scan of these files would false-positive
 * constantly, since the safe, fixed pattern is exactly
 * `localizeHref(bookHref, locale)` / `localizeHref("/about", locale)`
 * — both of which legitimately contain the bare path as a substring
 * of the call. So this check strips every `localizeHref(...)` and
 * `getLocalizedPathPair(...)` call (arguments included) out of the
 * file content FIRST, then searches what's left for a bare route
 * literal. A wrapped, safe reference disappears with its call and
 * never triggers; a literal sitting outside any such call — the
 * actual shape of the historical bug — survives the strip and fails
 * the check.
 */
const SHARED_COMPONENT_ROOTS = ["src/components/layout", "src/components/navigation"];

function stripSafeCallSites(content: string): string {
  return content
    .replace(/localizeHref\([^)]*\)/g, "")
    .replace(/getLocalizedPathPair\([^)]*\)/g, "");
}

describe("Shared bilingual components never hardcode a bare, unwrapped href with a live Arabic equivalent", () => {
  const files = SHARED_COMPONENT_ROOTS.flatMap((root) => collectFiles(root));

  it("scanned at least one file per root (sanity check that the scan itself isn't silently empty)", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const route of routesWithArPath) {
    it(`no shared component hardcodes a bare, unwrapped "${route.path}" (outside localizeHref/getLocalizedPathPair)`, () => {
      const offenders: string[] = [];
      for (const file of files) {
        const rawContent = readFileSync(file, "utf-8");
        const strippedContent = stripSafeCallSites(rawContent);
        const doubleQuoted = `"${route.path}"`;
        const singleQuoted = `'${route.path}'`;
        if (strippedContent.includes(doubleQuoted) || strippedContent.includes(singleQuoted)) {
          offenders.push(file);
        }
      }
      expect(offenders).toEqual([]);
    });
  }
});
