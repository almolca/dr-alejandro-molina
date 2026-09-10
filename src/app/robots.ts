import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private admin dashboard (R7.2 brief §34) — never indexed.
      disallow: "/admin",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
