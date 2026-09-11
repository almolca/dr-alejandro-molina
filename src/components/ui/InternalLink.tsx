import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { liveRoutes } from "@/lib/seo/routes";

const livePaths = new Set(
  liveRoutes.flatMap((route) => (route.arPath ? [route.path, route.arPath] : [route.path])),
);

/**
 * Thin wrapper around `next/link` that only prefetches routes actually
 * marked `status: "live"` in the routes registry (`lib/seo/routes.ts`).
 *
 * Confirmed via headless-browser QA: with prefetch on for a not-yet-built
 * route, Next triggers a background RSC-payload fetch that 404s as soon
 * as the link scrolls into view — harmless to visitors, but console
 * noise and wasted requests. Deriving the prefetch decision from the
 * same registry `sitemap.ts` uses means this self-corrects as each
 * phase ships more routes, instead of needing to be revisited by hand.
 */
export function InternalLink({
  children,
  href,
  prefetch,
  ...props
}: LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { children?: ReactNode }) {
  const rawPath = typeof href === "string" ? href : href.pathname;
  const path = rawPath?.split(/[?#]/)[0];
  const isLive = path ? livePaths.has(path) : false;

  return (
    <Link href={href} prefetch={prefetch ?? isLive} {...props}>
      {children}
    </Link>
  );
}
