import { NextResponse, type NextRequest } from "next/server";
import { normalizeSource } from "@/lib/attribution/normalize-source";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_SECONDS,
  BOOK_ORIGIN_COOKIE,
  BOOK_ORIGIN_MAX_AGE_SECONDS,
  serializeTouch,
  type AttributionTouch,
} from "@/lib/attribution/cookies";
import { PRODUCTION_SITE_URL } from "@/config/site";
import { isProductionHost } from "@/lib/seo/production-host";
import { legacyGonePaths } from "@/lib/seo/legacy-redirects";

/**
 * Captures UTM/referrer attribution into first-party cookies on every
 * marketing-page request — R7.2 brief §9/§10. Runs as Next.js 16's
 * `proxy` (the renamed `middleware` convention, see
 * node_modules/next/dist/docs/.../file-conventions/proxy.md).
 *
 * A "fresh entry" (utm params present, or an external/first-ever
 * referer) sets first-touch once and always overwrites last-touch.
 * Pure internal navigation (same-origin referer, no utm) does not
 * touch either cookie — last-touch intentionally represents the most
 * recent *marketing* touch, not just "the previous page" (see
 * docs/patient-acquisition.md for the full rationale).
 */
export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|brand).*)",
  ],
};

export function proxy(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  // R8 §20 — deliberate 410 Gone for legacy content that will never be
  // replaced (off-topic/out-of-scope), rather than a misleading
  // redirect to an unrelated current page. See docs/r8-seo-migration.md
  // for the reasoning behind each entry.
  if (legacyGonePaths.includes(pathname)) {
    return new NextResponse(null, { status: 410 });
  }

  const response = NextResponse.next();

  // R8 §5/§6 — defense in depth alongside Vercel's own Preview
  // deployment protection: any request not on the canonical production
  // host gets marked noindex, so a disabled/misconfigured deployment
  // protection setting can never silently let a Preview URL get indexed.
  if (!isProductionHost(request.nextUrl.host, PRODUCTION_SITE_URL)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  const utmSource = searchParams.get("utm_source");
  const refererHeader = request.headers.get("referer");
  let refererHost: string | null = null;
  let refererPath: string | null = null;
  try {
    if (refererHeader) {
      const refererUrl = new URL(refererHeader);
      refererHost = refererUrl.host;
      refererPath = refererUrl.pathname + refererUrl.search;
    }
  } catch {
    refererHost = null;
    refererPath = null;
  }

  // Origin-page capture (R7.2 UX addendum) — independent of the
  // first/last-touch "fresh entry" logic below, so it runs on every
  // /book load, including pure internal navigation from a marketing
  // page. Only set when the referer is same-origin and isn't /book
  // itself (e.g. a reload of /book, or the POST-time self-referer).
  if (
    pathname === "/book" &&
    refererPath &&
    refererHost === request.nextUrl.host &&
    !refererPath.startsWith("/book")
  ) {
    response.cookies.set(BOOK_ORIGIN_COOKIE, refererPath, {
      maxAge: BOOK_ORIGIN_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  const hasFirstTouchCookie = Boolean(request.cookies.get(ATTRIBUTION_COOKIE.first));
  const isExternalReferer = refererHost !== null && refererHost !== request.nextUrl.host;
  const isFreshEntry = Boolean(utmSource) || isExternalReferer || !hasFirstTouchCookie;

  if (!isFreshEntry) return response;

  const source = normalizeSource({
    utmSource,
    utmMedium: searchParams.get("utm_medium"),
    utmCampaign: searchParams.get("utm_campaign"),
    refererHost,
    siteHost: request.nextUrl.host,
  });

  const touch: AttributionTouch = { source, page: pathname, at: new Date().toISOString() };
  const cookieOpts = {
    maxAge: ATTRIBUTION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  if (!hasFirstTouchCookie) {
    response.cookies.set(ATTRIBUTION_COOKIE.first, serializeTouch(touch), cookieOpts);
  }
  response.cookies.set(ATTRIBUTION_COOKIE.last, serializeTouch(touch), cookieOpts);

  return response;
}
