/**
 * Pure resolver for `siteUrl` — R8 §4/§5. Extracted from
 * `config/site.ts` so the Vercel-vs-local-dev precedence is unit
 * testable without needing to mutate `process.env` at module-load
 * time.
 */
export function resolveSiteUrl(input: {
  isVercelDeployment: boolean;
  productionSiteUrl: string;
  devSiteUrl: string | undefined;
}): string {
  if (input.isVercelDeployment) return input.productionSiteUrl;
  return input.devSiteUrl ?? "http://localhost:3000";
}
