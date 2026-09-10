import { NextResponse, type NextRequest } from "next/server";
import { normalizeSource } from "@/lib/attribution/normalize-source";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_SECONDS,
  serializeTouch,
  type AttributionTouch,
} from "@/lib/attribution/cookies";

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
  const response = NextResponse.next();
  const { searchParams, pathname } = request.nextUrl;

  const utmSource = searchParams.get("utm_source");
  const refererHeader = request.headers.get("referer");
  let refererHost: string | null = null;
  try {
    refererHost = refererHeader ? new URL(refererHeader).host : null;
  } catch {
    refererHost = null;
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
