import { describe, expect, it } from "vitest";
import { getFooterServiceLinks, getLegalNav, getPrimaryNav } from "./navigation";

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

describe("getPrimaryNav (R11 Laparoscopic Surgery submenu)", () => {
  it("keeps the parent href at /urologic-surgery (no route rename) while relabeling it Laparoscopic Surgery", () => {
    const enItems = getPrimaryNav("en");
    const item = enItems.find((i) => i.label === "Laparoscopic Surgery");
    expect(item?.href).toBe("/urologic-surgery");
  });

  it("localizes both submenu children to their Arabic routes", () => {
    const arItems = getPrimaryNav("ar");
    const item = arItems.find((i) => i.label === "الجراحة بالمنظار");
    expect(item?.href).toBe("/ar/urologic-surgery");
    expect(item?.children).toEqual([
      { label: "استئصال البروستاتا الجذري", href: "/ar/urologic-surgery/laparoscopic-radical-prostatectomy" },
      { label: "عرض جميع جراحات المنظار", href: "/ar/urologic-surgery" },
    ]);
  });

  it("leaves English submenu children unresolved to Arabic paths", () => {
    const enItems = getPrimaryNav("en");
    const item = enItems.find((i) => i.label === "Laparoscopic Surgery");
    expect(item?.children).toEqual([
      { label: "Radical Prostatectomy", href: "/urologic-surgery/laparoscopic-radical-prostatectomy" },
      { label: "View all Laparoscopic Surgery", href: "/urologic-surgery" },
    ]);
  });

  it("does not add a submenu to items that never had one", () => {
    const enItems = getPrimaryNav("en");
    const item = enItems.find((i) => i.label === "Men's Health");
    expect(item?.children).toBeUndefined();
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
