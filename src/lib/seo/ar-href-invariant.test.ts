// src/lib/seo/ar-href-invariant.test.ts
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

/**
 * Guards against the exact bug class the R9 booking funnel
 * correction's final review found three instances of: a literal,
 * hardcoded English href sitting inside a file that only ever
 * renders on an Arabic route, for a path that already has a real
 * Arabic equivalent registered in `routes.ts`. Each of those three
 * bugs (Footer.tsx, MobileNav.tsx, the Arabic mens-health hub) was
 * missed by a search scoped too narrowly to "this one component" —
 * this test scans unrestricted, everywhere Arabic-only source lives.
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

const SCAN_ROOTS = ["src/app/(ar)", "src/components/sections/ar"];

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
const routesWithArPath = routes.filter((r): r is typeof r & { arPath: string } => Boolean(r.arPath));

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
