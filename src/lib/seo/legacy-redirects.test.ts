import { describe, expect, it } from "vitest";
import { legacyRedirects, legacyGonePaths } from "./legacy-redirects";

describe("legacyRedirects", () => {
  it("has no duplicate source paths", () => {
    const sources = legacyRedirects.map((r) => r.source);
    const unique = new Set(sources);
    expect(unique.size).toBe(sources.length);
  });

  it("has no redirect chains (no destination is itself a source)", () => {
    const sources = new Set(legacyRedirects.map((r) => r.source));
    for (const { destination } of legacyRedirects) {
      expect(sources.has(destination)).toBe(false);
    }
  });

  it("has no redirect loops (source never equals its own destination)", () => {
    for (const { source, destination } of legacyRedirects) {
      expect(source).not.toBe(destination);
    }
  });

  it("every source is a legacy path, never a new-site path (no accidental self-redirects)", () => {
    for (const { source } of legacyRedirects) {
      expect(source.startsWith("/en/") || !source.match(/^\/(about|book|privacy|terms)$/)).toBe(
        true,
      );
    }
  });

  it("no path appears in both the redirect map and the 410 list", () => {
    const sources = new Set(legacyRedirects.map((r) => r.source));
    for (const gonePath of legacyGonePaths) {
      expect(sources.has(gonePath)).toBe(false);
    }
  });

  it("all destinations are relative paths (never accidentally absolute/external)", () => {
    for (const { destination } of legacyRedirects) {
      expect(destination.startsWith("/")).toBe(true);
      expect(destination).not.toMatch(/^https?:\/\//);
    }
  });

  it("no-scalpel vasectomy legacy URLs resolve to the dedicated vasectomy page, not the fertility hub (R8.0.2)", () => {
    const bySource = new Map(legacyRedirects.map((r) => [r.source, r.destination]));
    expect(bySource.get("/en/no-scalpel-vasectomy")).toBe("/mens-health/vasectomy");
    expect(bySource.get("/vasectomia-sin-bisturi")).toBe("/mens-health/vasectomy");
  });

  it("vasectomy reversal legacy URLs still resolve to the fertility hub (reversal is a fertility-restoration intent)", () => {
    const bySource = new Map(legacyRedirects.map((r) => [r.source, r.destination]));
    expect(bySource.get("/en/vasovasostomy")).toBe("/male-fertility");
    expect(bySource.get("/vasovasostomia")).toBe("/male-fertility");
  });

  it("circumcision legacy URLs are absent from the redirect map — left to fall through to a normal 404, not force-redirected (R8.0.3)", () => {
    const sources = new Set(legacyRedirects.map((r) => r.source));
    expect(sources.has("/en/circumcision")).toBe(false);
    expect(sources.has("/circuncision")).toBe(false);
  });

  it("circumcision legacy URLs are not in the 410 list either — no migration-specific reason to assert 'permanently gone'", () => {
    expect(legacyGonePaths.includes("/en/circumcision")).toBe(false);
    expect(legacyGonePaths.includes("/circuncision")).toBe(false);
  });
});
