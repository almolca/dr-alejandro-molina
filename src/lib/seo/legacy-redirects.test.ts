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
});
