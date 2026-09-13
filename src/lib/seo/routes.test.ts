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
    expect(getLocalizedPathPair("/book")).toBeNull();
  });

  it("returns null for an Arabic path with no matching registry entry", () => {
    expect(getLocalizedPathPair("/ar/book")).toBeNull();
  });

  it("returns the en/ar pair for a Batch 1 hub route", () => {
    expect(getLocalizedPathPair("/mens-health")).toEqual({ en: "/mens-health", ar: "/ar/mens-health" });
  });

  it("returns the same Batch 1 pair when looked up from the Arabic side", () => {
    expect(getLocalizedPathPair("/ar/mens-health")).toEqual({ en: "/mens-health", ar: "/ar/mens-health" });
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
  it("has arPath set on the homepage and the five R9 Phase B Batch 1 hub routes", () => {
    const withArPath = routes.filter((r) => r.arPath).map((r) => r.path);
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/mens-health",
      "/sexual-medicine",
      "/male-aesthetics",
      "/male-fertility",
    ]);
  });
});
