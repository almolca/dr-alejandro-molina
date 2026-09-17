import { describe, expect, it } from "vitest";
import { getFooterServiceLinks, getLegalNav } from "./navigation";

describe("getFooterServiceLinks (Batch 4 regression)", () => {
  it("resolves the No-Scalpel Vasectomy footer link to /ar/mens-health/vasectomy on the Arabic side, with no code change to navigation.ts itself", () => {
    const arLinks = getFooterServiceLinks("ar");
    const vasectomyLink = arLinks.find((l) => l.href.includes("vasectomy"));
    expect(vasectomyLink?.href).toBe("/ar/mens-health/vasectomy");
  });

  it("still resolves the English footer link to /mens-health/vasectomy unchanged", () => {
    const enLinks = getFooterServiceLinks("en");
    const vasectomyLink = enLinks.find((l) => l.href.includes("vasectomy"));
    expect(vasectomyLink?.href).toBe("/mens-health/vasectomy");
  });
});

describe("getLegalNav (Batch 4 regression)", () => {
  it("resolves the Privacy Policy legal-nav link to /ar/privacy now that arPath is registered (Batch 4)", () => {
    const arLinks = getLegalNav("ar");
    const privacyLink = arLinks.find((l) => l.label.includes("الخصوصية"));
    expect(privacyLink?.href).toBe("/ar/privacy");
  });

  it("still resolves the English Privacy Policy legal-nav link to /privacy unchanged", () => {
    const enLinks = getLegalNav("en");
    const privacyLink = enLinks.find((l) => l.label === "Privacy Policy");
    expect(privacyLink?.href).toBe("/privacy");
  });
});
