import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { insightArticles } from "@/content/insights/articles";
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
  // doesn't actually have a page.
  const articles: MetadataRoute.Sitemap = insightArticles.map((article) => ({
    url: new URL(`/insights/${article.slug}`, siteUrl).toString(),
    lastModified: article.datePublished,
    priority: 0.5,
  }));

  return [...pages, ...arPages, ...articles];
}
