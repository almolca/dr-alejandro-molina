import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/seo/legacy-redirects";

/**
 * Spec §32 Security: security headers, CSP where practical, no exposed
 * secrets. This is a conservative baseline for an MVP with no auth, no
 * forms, and no third-party scripts beyond self-hosted fonts (spec §19
 * "No auth required... No custom patient database"). Revisit the CSP
 * `connect-src`/`script-src` if GA4/Vercel Analytics are added later
 * (spec §27 — only after cookie/privacy implementation).
 *
 * `script-src` includes `'unsafe-inline'` deliberately, matching Next's
 * own documented "Without Nonces" baseline CSP. A nonce-based CSP is
 * stricter, but requires forcing every page into dynamic rendering
 * (Next.js content-security-policy guide) — disabling static
 * generation/ISR/CDN caching site-wide, which conflicts with spec §31's
 * performance targets, for a site that spec §32 already confirms
 * handles no patient data or forms. Confirmed via headless-browser
 * testing: without `'unsafe-inline'`, Chrome blocks Next's own inline
 * hydration bootstrap script as well as this site's JSON-LD
 * `<script>` tags, breaking hydration and structured data outright.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/**
 * R8 §16 security-header audit additions. Both are additive/low-risk —
 * neither changes what the CSP already allows, so neither can break
 * the Next.js/Vercel/Supabase/NMC-navigation behavior already verified
 * safe with this CSP.
 *
 * X-Frame-Options: DENY — legacy-browser equivalent of the CSP's
 * `frame-ancestors 'none'` above, for clients that don't honor CSP.
 *
 * HSTS: no `preload` directive deliberately — submitting to browsers'
 * HSTS preload list is a separate, hard-to-reverse decision (removal
 * can take months to propagate) that belongs to the owner post-launch,
 * once the domain has been running on HTTPS-only reliably for a
 * while, not something to opt into automatically here. `max-age` is 6
 * months, which is the standard conservative starting point.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return legacyRedirects.map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
