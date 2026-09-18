import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { insightArticles } from "@/content/insights/articles";
import { insightArticlesAr } from "@/content/insights/articles-ar";
import { sitemapRoutes } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = sitemapRoutes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    priority: route.priority,
    ...(route.arPath
      ? {
          alternates: {
            languages: {
              "en-AE": new URL(route.path, siteUrl).toString(),
              "ar-AE": new URL(route.arPath, siteUrl).toString(),
            },
          },
        }
      : {}),
  }));

  const arPages: MetadataRoute.Sitemap = sitemapRoutes
    .filter((route): route is typeof route & { arPath: string } => Boolean(route.arPath))
    .map((route) => ({
      url: new URL(route.arPath, siteUrl).toString(),
      priority: route.priority,
      alternates: {
        languages: {
          "en-AE": new URL(route.path, siteUrl).toString(),
          "ar-AE": new URL(route.arPath, siteUrl).toString(),
        },
      },
    }));

  // Individual /insights/[slug] articles — derived directly from the
  // article content data, so the sitemap can never list a slug that
  // doesn't actually have a page. The reverse lookup mirrors the one in
  // the EN insights page's own generateMetadata (R10): only the 5
  // genuinely 1:1-paired Arabic articles get a reciprocal alternate here.
  const articles: MetadataRoute.Sitemap = insightArticles.map((article) => {
    const arEquivalent = insightArticlesAr.find((a) => a.enEquivalentSlug === article.slug);
    return {
      url: new URL(`/insights/${article.slug}`, siteUrl).toString(),
      lastModified: article.datePublished,
      priority: 0.5,
      ...(arEquivalent
        ? {
            alternates: {
              languages: {
                "en-AE": new URL(`/insights/${article.slug}`, siteUrl).toString(),
                "ar-AE": new URL(`/ar/insights/${arEquivalent.slug}`, siteUrl).toString(),
              },
            },
          }
        : {}),
    };
  });

  // Arabic Insights articles (R10 Phase C) — same pattern, derived
  // directly from content/insights/articles-ar.ts. Only articles with a
  // genuine `enEquivalentSlug` get an hreflang alternate here, matching
  // the same per-article decision `buildMetadata`'s `languagePair` uses
  // in the page's own <head> — an article that merges/adapts more than
  // one English source (no single true equivalent) is listed without one
  // rather than forcing an artificial pair.
  const articlesAr: MetadataRoute.Sitemap = insightArticlesAr.map((article) => ({
    url: new URL(`/ar/insights/${article.slug}`, siteUrl).toString(),
    lastModified: article.datePublished,
    priority: 0.5,
    ...(article.enEquivalentSlug
      ? {
          alternates: {
            languages: {
              "en-AE": new URL(`/insights/${article.enEquivalentSlug}`, siteUrl).toString(),
              "ar-AE": new URL(`/ar/insights/${article.slug}`, siteUrl).toString(),
            },
          },
        }
      : {}),
  }));

  return [...pages, ...arPages, ...articles, ...articlesAr];
}
