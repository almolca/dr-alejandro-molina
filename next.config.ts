import type { NextConfig } from "next";

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

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
