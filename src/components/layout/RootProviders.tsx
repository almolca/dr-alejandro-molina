import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { personSchema, physicianSchema } from "@/lib/seo/json-ld";

/**
 * Shared root-level providers, used identically by all three independent
 * root layouts (app/(en)/layout.tsx, app/(ar)/layout.tsx,
 * app/admin/layout.tsx) so none of them duplicate this logic.
 *
 * Person/Physician JSON-LD is locale-invariant (same entity, never
 * duplicated data — spec §10): sharing it identically across the (en) and
 * (ar) roots is correct, not just convenient, since it's the same physician
 * regardless of language. Its presence in admin's root (below) is a different
 * matter — see the note there.
 *
 * ConsentBanner and public structured data are, strictly speaking, only
 * meaningful for the PUBLIC (en/ar) roots — admin is an internal,
 * noindex, authenticated tool with no public visitors to consent-gate or
 * to serve Physician schema to. It inherits both here purely to preserve
 * today's exact pre-migration behavior (the single old shared root
 * layout rendered both unconditionally for every route, admin included)
 * at minimal migration risk. This is NOT a permanent design requirement
 * — splitting admin onto its own, narrower provider set is a legitimate
 * future cleanup, not performed here to keep this migration's scope to
 * "preserve behavior, fix html lang/dir" only.
 */
export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={[personSchema(), physicianSchema()]} />
      <MotionProvider>
        <ConsentBanner />
        {children}
      </MotionProvider>
    </>
  );
}
