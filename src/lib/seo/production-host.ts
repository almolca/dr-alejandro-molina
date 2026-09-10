/**
 * Production-indexing safeguard — R8 §5/§6. Any request whose Host
 * header isn't the canonical production domain (apex or `www`) gets a
 * `X-Robots-Tag: noindex, nofollow` response header from `src/proxy.ts`
 * — defense in depth alongside Vercel's own Preview deployment
 * protection, in case that protection is ever disabled without
 * realizing the SEO implication.
 */
export function isProductionHost(host: string, productionSiteUrl: string): boolean {
  const productionHost = new URL(productionSiteUrl).host;
  const normalizedHost = host.toLowerCase();
  return normalizedHost === productionHost || normalizedHost === `www.${productionHost}`;
}
