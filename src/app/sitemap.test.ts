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

  it("includes the R9 Phase B Batch 1 + Batch 2 + Batch 3 + Batch 4 + the booking funnel correction /ar/* routes", () => {
    // Excludes /ar/insights and /ar/insights/* deliberately — the hub
    // and its articles are R10 Phase C additions (see the dedicated
    // test below), not part of the R9 batches this test guards.
    const arEntries = entries.filter(
      (e) => e.url.includes(`${siteUrl}/ar`) && !e.url.includes("/ar/insights"),
    );
    expect(arEntries.map((e) => e.url).sort()).toEqual(
      [
        "/ar",
        "/ar/about",
        "/ar/book",
        "/ar/mens-health",
        "/ar/mens-health/testosterone",
        "/ar/mens-health/vasectomy",
        "/ar/sexual-medicine",
        "/ar/sexual-medicine/premature-ejaculation",
        "/ar/erectile-dysfunction",
        "/ar/erectile-dysfunction/penile-doppler",
        "/ar/penile-implant",
        "/ar/peyronies-disease",
        "/ar/male-aesthetics",
        "/ar/male-aesthetics/penile-girth-enhancement",
        "/ar/male-aesthetics/scrotal-lift",
        "/ar/male-aesthetics/penile-filler-correction",
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

  it("includes the R10 Arabic Insights hub, hub-paired with the English /insights index", () => {
    const hub = entries.find((e) => e.url === `${siteUrl}/ar/insights`);
    expect(hub).toBeDefined();
    expect(hub?.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/insights`,
      "ar-AE": `${siteUrl}/ar/insights`,
    });
  });

  it("includes the R10 first-wave Arabic Insights articles, with hreflang only where a genuine EN equivalent exists", () => {
    const arArticleEntries = entries.filter((e) => e.url.includes("/ar/insights/"));
    expect(arArticleEntries).toHaveLength(6);

    const venousLeak = arArticleEntries.find((e) => e.url.endsWith("/ar/insights/venous-leak-and-penile-doppler"));
    expect(venousLeak?.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/insights/venous-leak-erectile-dysfunction`,
      "ar-AE": `${siteUrl}/ar/insights/venous-leak-and-penile-doppler`,
    });

    // This one adapts/merges two English source articles rather than
    // mirroring one 1:1 — per R10's rule, it must NOT get a forced
    // hreflang pair.
    const girthExperience = arArticleEntries.find((e) =>
      e.url.endsWith("/ar/insights/penile-girth-enhancement-real-world-experience"),
    );
    expect(girthExperience?.alternates).toBeUndefined();
  });

  it("excludes /ar/privacy from the sitemap, matching /privacy's index:false (Batch 4)", () => {
    const privacyEntries = entries.filter((e) => e.url.includes("/privacy"));
    expect(privacyEntries).toHaveLength(0);
  });
});
