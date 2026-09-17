// src/proxy.test.ts
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { PRODUCTION_SITE_URL } from "@/config/site";
import { CONSENT_COOKIE_NAME } from "@/lib/analytics/consent-cookie";
import { BOOK_ORIGIN_COOKIE } from "@/lib/attribution/cookies";
import { proxy } from "./proxy";

function requestTo(pathname: string, opts: { referer?: string; consent?: boolean } = {}): NextRequest {
  const url = new URL(pathname, PRODUCTION_SITE_URL);
  const headers = new Headers();
  if (opts.referer) headers.set("referer", opts.referer);
  if (opts.consent) headers.set("cookie", `${CONSENT_COOKIE_NAME}=granted`);
  return new NextRequest(url, { headers });
}

describe("proxy — book_origin cookie scope", () => {
  it("sets book_origin when landing on /book from an internal marketing page (with consent) — unchanged prior behavior", () => {
    const request = requestTo("/book", { referer: `${PRODUCTION_SITE_URL}/erectile-dysfunction`, consent: true });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)?.value).toBe("/erectile-dysfunction");
  });

  it("also sets book_origin when landing on /ar/book from an internal Arabic marketing page (with consent) — the fix", () => {
    const request = requestTo("/ar/book", { referer: `${PRODUCTION_SITE_URL}/ar/erectile-dysfunction`, consent: true });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)?.value).toBe("/ar/erectile-dysfunction");
  });

  it("does not set book_origin without analytics consent — non-essential enrichment only, never required for booking to work", () => {
    const request = requestTo("/ar/book", { referer: `${PRODUCTION_SITE_URL}/ar/erectile-dysfunction`, consent: false });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)).toBeUndefined();
  });

  it("does not overwrite book_origin on a same-page reload of /ar/book", () => {
    const request = requestTo("/ar/book", { referer: `${PRODUCTION_SITE_URL}/ar/book`, consent: true });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)).toBeUndefined();
  });

  it("strips the query string from a referrer URL, storing only the bare path in book_origin", () => {
    const request = requestTo("/book", {
      referer: `${PRODUCTION_SITE_URL}/erectile-dysfunction?utm_source=x`,
      consent: true,
    });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)?.value).toBe("/erectile-dysfunction");
  });
});
