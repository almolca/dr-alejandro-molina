import { describe, expect, it } from "vitest";
import { siteUrl } from "@/config/site";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("includes the Arabic homepage", () => {
    const ar = entries.find((e) => e.url === `${siteUrl}/ar`);
    expect(ar).toBeDefined();
    expect(ar?.priority).toBe(1.0);
  });

  it("gives the Arabic homepage reciprocal hreflang alternates", () => {
    const ar = entries.find((e) => e.url === `${siteUrl}/ar`);
    expect(ar?.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/`,
      "ar-AE": `${siteUrl}/ar`,
    });
  });

  it("gives the English homepage reciprocal hreflang alternates too", () => {
    const en = entries.find((e) => e.url === `${siteUrl}/`);
    expect(en?.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/`,
      "ar-AE": `${siteUrl}/ar`,
    });
  });

  it("includes no other /ar/* route yet", () => {
    const arEntries = entries.filter((e) => e.url.includes(`${siteUrl}/ar`));
    expect(arEntries).toHaveLength(1);
  });

  it("still includes insight articles (regression check)", () => {
    const articleEntries = entries.filter((e) => e.url.includes("/insights/"));
    expect(articleEntries.length).toBeGreaterThan(0);
  });
});
