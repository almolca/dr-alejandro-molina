import type { Metadata } from "next";
import { site, siteUrl } from "@/config/site";
import { getLocalizedPathPair, isArabicPath } from "./routes";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/erectile-dysfunction". Used for canonical + OG url. */
  path: string;
  /** Set false for pages that must not be indexed (none expected in MVP). */
  index?: boolean;
};

/**
 * Site-wide fallback social share image — R8.2.1. Next's file-convention
 * `opengraph-image.tsx` only resolves for the exact route segment it
 * lives in (`src/app/opengraph-image.tsx` → the root `/` route only);
 * it does not propagate to descendant routes the way the root file's
 * own doc comment assumed. Every page built through `buildMetadata()`
 * (i.e. every page except the root layout) was shipping with no
 * `og:image`/`twitter:image` at all as a result. Rather than adding a
 * same-content `opengraph-image.tsx` file under every route segment,
 * point every page's Open Graph/Twitter metadata at the one branded
 * image already generated at `/opengraph-image` — same asset the
 * homepage uses, so this is reuse, not a new design.
 */
const fallbackSocialImage = {
  url: new URL("/opengraph-image", siteUrl).toString(),
  width: 1200,
  height: 630,
  alt: site.defaultTitle,
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
  const locale = isArabicPath(path) ? "ar" : "en";
  const pair = getLocalizedPathPair(path);
  const languages = pair
    ? {
        "en-AE": new URL(pair.en, siteUrl).toString(),
        "ar-AE": new URL(pair.ar, siteUrl).toString(),
        "x-default": new URL(pair.en, siteUrl).toString(),
      }
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
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
      locale: locale === "ar" ? "ar_AE" : site.locale,
      type: "website",
      images: [fallbackSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fallbackSocialImage],
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
