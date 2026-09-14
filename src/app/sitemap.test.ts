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

  it("includes the R9 Phase B Batch 1 and Batch 2 /ar/* routes", () => {
    const arEntries = entries.filter((e) => e.url.includes(`${siteUrl}/ar`));
    expect(arEntries.map((e) => e.url).sort()).toEqual(
      [
        "/ar",
        "/ar/about",
        "/ar/mens-health",
        "/ar/mens-health/testosterone",
        "/ar/sexual-medicine",
        "/ar/sexual-medicine/premature-ejaculation",
        "/ar/erectile-dysfunction",
        "/ar/erectile-dysfunction/penile-doppler",
        "/ar/penile-implant",
        "/ar/peyronies-disease",
        "/ar/male-aesthetics",
        "/ar/male-fertility",
        "/ar/male-fertility/varicocele",
      ]
        .map((path) => `${siteUrl}${path}`)
        .sort(),
    );
  });

  it("still includes insight articles (regression check)", () => {
    const articleEntries = entries.filter((e) => e.url.includes("/insights/"));
    expect(articleEntries.length).toBeGreaterThan(0);
  });
});
