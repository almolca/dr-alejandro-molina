import { describe, expect, it } from "vitest";
import { getLocalizedPathPair, isArabicPath, routes } from "./routes";

describe("getLocalizedPathPair", () => {
  it("returns the en/ar pair for the English homepage", () => {
    expect(getLocalizedPathPair("/")).toEqual({ en: "/", ar: "/ar" });
  });

  it("returns the same pair when looked up from the Arabic side", () => {
    expect(getLocalizedPathPair("/ar")).toEqual({ en: "/", ar: "/ar" });
  });

  it("returns the en/ar pair for /book, now that /ar/book exists (R9 booking funnel correction)", () => {
    expect(getLocalizedPathPair("/book")).toEqual({ en: "/book", ar: "/ar/book" });
  });

  it("returns the same pair when looked up from the Arabic side", () => {
    expect(getLocalizedPathPair("/ar/book")).toEqual({ en: "/book", ar: "/ar/book" });
  });

  it("returns the en/ar pair for a Batch 1 hub route", () => {
    expect(getLocalizedPathPair("/mens-health")).toEqual({ en: "/mens-health", ar: "/ar/mens-health" });
  });

  it("returns the same Batch 1 pair when looked up from the Arabic side", () => {
    expect(getLocalizedPathPair("/ar/mens-health")).toEqual({ en: "/mens-health", ar: "/ar/mens-health" });
  });

  it("returns the en/ar pair for /mens-health/vasectomy, now live in Arabic (Batch 4)", () => {
    expect(getLocalizedPathPair("/mens-health/vasectomy")).toEqual({
      en: "/mens-health/vasectomy",
      ar: "/ar/mens-health/vasectomy",
    });
  });

  it("returns the en/ar pair for /privacy, now live in Arabic (Batch 4)", () => {
    expect(getLocalizedPathPair("/privacy")).toEqual({ en: "/privacy", ar: "/ar/privacy" });
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
  it("has arPath set on the homepage and every R9 Phase B Batch 1 + Batch 2 + Batch 3 route", () => {
    const withArPath = routes.filter((r) => r.arPath).map((r) => r.path);
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/book",
      "/mens-health",
      "/mens-health/testosterone",
      "/mens-health/vasectomy",
      "/sexual-medicine",
      "/sexual-medicine/premature-ejaculation",
      "/erectile-dysfunction",
      "/erectile-dysfunction/penile-doppler",
      "/penile-implant",
      "/peyronies-disease",
      "/male-aesthetics",
      "/male-aesthetics/penile-girth-enhancement",
      "/male-aesthetics/scrotal-lift",
      "/male-aesthetics/penile-filler-correction",
      "/male-fertility",
      "/male-fertility/varicocele",
      "/privacy",
    ]);
  });
});
