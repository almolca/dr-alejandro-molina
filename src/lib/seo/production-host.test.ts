import { describe, expect, it } from "vitest";
import { isProductionHost } from "./production-host";

const productionSiteUrl = "https://dralejandromolinaurologist.com";

describe("isProductionHost", () => {
  it("accepts the apex production host", () => {
    expect(isProductionHost("dralejandromolinaurologist.com", productionSiteUrl)).toBe(true);
  });

  it("accepts the www production host", () => {
    expect(isProductionHost("www.dralejandromolinaurologist.com", productionSiteUrl)).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isProductionHost("DrAlejandroMolinaUrologist.com", productionSiteUrl)).toBe(true);
  });

  it("rejects a Vercel preview host", () => {
    expect(
      isProductionHost(
        "dr-alejandro-molina-git-pha-e5996e-alejandros-projects-55692fea.vercel.app",
        productionSiteUrl,
      ),
    ).toBe(false);
  });

  it("rejects localhost", () => {
    expect(isProductionHost("localhost:3000", productionSiteUrl)).toBe(false);
  });

  it("rejects an unrelated domain that merely contains the production host as a substring", () => {
    expect(isProductionHost("dralejandromolinaurologist.com.evil.example", productionSiteUrl)).toBe(
      false,
    );
  });
});
