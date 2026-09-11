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
