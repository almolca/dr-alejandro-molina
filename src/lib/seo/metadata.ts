import type { Metadata } from "next";
import { site, siteUrl } from "@/config/site";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/erectile-dysfunction". Used for canonical + OG url. */
  path: string;
  /** Set false for pages that must not be indexed (none expected in MVP). */
  index?: boolean;
};

/**
 * SEO utility — builds a consistent `Metadata` object per spec §24
 * on-page SEO rules: unique title, unique description, canonical, Open
 * Graph. Every route-level `page.tsx` should call this rather than
 * hand-assembling metadata, so title templates and OG defaults stay
 * consistent site-wide.
 */
export function buildMetadata({
  title,
  description,
  path,
  index = true,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    // `follow: true` even when `index` is false — for a `noindex`
    // utility page (legal pages), search engines should still crawl
    // through its links rather than treating it as a dead end. Found
    // during the Phase 5 SEO audit (SEO_AUDIT.md): the previous
    // `index:false` path also set `follow:false`, which is the wrong
    // default for pages like these.
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Root metadata for the site, used only by the root layout. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.description,
  openGraph: {
    title: site.defaultTitle,
    description: site.description,
    siteName: site.name,
    locale: site.locale,
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.description,
  },
};
