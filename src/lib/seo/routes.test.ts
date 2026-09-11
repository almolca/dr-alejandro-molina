import { describe, expect, it } from "vitest";
import { getLocalizedPathPair, isArabicPath, routes } from "./routes";

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

describe("isArabicPath", () => {
  it("returns true for the exact /ar path", () => {
    expect(isArabicPath("/ar")).toBe(true);
  });

  it("returns true for a nested /ar/* path", () => {
    expect(isArabicPath("/ar/foo")).toBe(true);
  });

  it("returns false for an English route that merely starts with the letters 'ar'", () => {
    expect(isArabicPath("/articles")).toBe(false);
  });

  it("returns false for the root path", () => {
    expect(isArabicPath("/")).toBe(false);
  });
});

describe("routes registry", () => {
  it("only the homepage has an arPath set in Phase A", () => {
    const withArPath = routes.filter((r) => r.arPath);
    expect(withArPath).toEqual([expect.objectContaining({ path: "/", arPath: "/ar" })]);
  });
});
