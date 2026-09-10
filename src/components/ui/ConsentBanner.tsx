"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/analytics/consent";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Button } from "@/components/ui/Button";

/**
 * Cookie/analytics consent banner — spec §27, Phase 5 brief §7.
 *
 * Honest framing: no analytics provider is active yet (see
 * `lib/analytics/events.ts`), so this does not claim tracking is
 * currently happening — it's a forward-looking preference capture, so
 * that if/when GA4 or Vercel Analytics is added, existing visitors'
 * choice is already respected rather than needing to ask again.
 *
 * Accessibility / anti-dark-pattern requirements, all deliberate:
 * - Both actions use the same visual weight (`variant="secondary"` on
 *   both) — neither is styled to visually nudge toward "Accept".
 * - No pre-ticked options, no forced choice that blocks the page.
 * - `role="region"` + `aria-label` so it's announced as a distinct
 *   landmark, not silently skipped by screen readers.
 *
 * Phase R1-R2 P0 fix: this was previously `position: fixed` at the
 * bottom of the viewport, and was confirmed (via DOM measurement) to
 * overlap the hero's primary CTA on mobile. Two fixes were tried and
 * rejected before this one: shrinking the hero's viewport-height sizing
 * to "make room" doesn't work, because mobile hero content (including
 * the stacked portrait placeholder) already exceeds the viewport
 * height on its own, so nothing about the banner's presence can
 * reposition it; delaying the banner's first appearance only defers
 * the same overlap to whenever it eventually appears, since a realistic
 * visitor takes more than a second or two before clicking anything. A
 * `position: fixed` overlay, by definition, floats on top of whatever
 * happens to occupy its screen region — there is no reliable way to
 * guarantee it never overlaps arbitrary page content while staying
 * fixed. The banner is now rendered in normal document flow, at the
 * very top of the page (rendered before `PageShell`/`Header` in
 * `layout.tsx`), instead of as a fixed overlay — nothing can ever sit
 * "underneath" an in-flow element, so no interactive content can ever
 * be obscured, at any viewport size, regardless of hero content length.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deliberate: localStorage isn't available during SSR, so both the
    // server render and the client's first render must start hidden
    // (`visible` defaults to `false`) — updating it here, after mount,
    // is what avoids a hydration mismatch, not what causes one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getConsent() === "unset");
  }, []);

  if (!visible) return null;

  function choose(status: "granted" | "denied") {
    setConsent(status);
    setVisible(false);
  }

  return (
    <div role="region" aria-label="Cookie preferences" className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-editorial flex-col gap-4 px-gutter py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          This site may use analytics cookies to understand how
          visitors use it. No health or symptom information is ever
          included. You can accept or decline, and change your choice
          anytime — see our{" "}
          <Link
            href="/privacy"
            className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="sm" onClick={() => choose("denied")}>
            Decline
          </Button>
          <Button variant="secondary" size="sm" onClick={() => choose("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
