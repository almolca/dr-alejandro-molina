"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getConsent, resyncConsentCookie, setConsent } from "@/lib/analytics/consent";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Button } from "@/components/ui/Button";

/**
 * Cookie/analytics consent banner — spec §27, Phase 5 brief §7.
 *
 * This gates a real, active first-party analytics pipeline (R7.2
 * onward — see `lib/analytics/events.ts`, which posts to `/api/events`
 * and inserts into Supabase `analytics_events`), not a forward-looking
 * placeholder — `trackEvent()` checks `hasAnalyticsConsent()` before
 * every call, and R8.1C additionally gates the non-essential
 * attribution cookies this site sets (`src/proxy.ts`) on the same
 * choice. No third-party analytics/advertising provider (GA4, Meta
 * Pixel, etc.) is present.
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
/**
 * R8.1C privacy audit — "change my choice" path (brief §6). Reuses this
 * exact banner rather than a second consent UI: the footer's "Cookie
 * Settings" control (`CookieSettingsLink.tsx`) dispatches this event,
 * which forces the banner visible again regardless of the stored
 * choice, without altering that choice until the visitor picks again.
 * A plain DOM event, not shared React state, since the banner and the
 * footer live in unrelated parts of the tree under `layout.tsx` and
 * this is the smallest change that connects them.
 */
const REOPEN_EVENT = "cookie-consent:reopen";

export function reopenConsentBanner(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(REOPEN_EVENT));
  }
}

/**
 * R9 Arabic i18n foundation (Phase A) — pure text-localization layer.
 * The Privacy Policy link intentionally stays pointed at `/privacy`
 * (English) for both locales: `/ar/privacy` doesn't exist until Phase C
 * (spec §13/§14). All consent mechanics below are unchanged by this.
 *
 * Locale is self-detected via `usePathname()` rather than threaded
 * through as a required prop: the root layout (`src/app/layout.tsx`)
 * renders exactly one `<ConsentBanner />` instance for every route,
 * including `/ar/*` — `src/app/ar/layout.tsx` deliberately does not
 * render a second, locale-scoped instance of its own (that would
 * duplicate, not replace, the root's). The optional `locale` prop is
 * kept only as an explicit override for tests/future call sites; the
 * default resolves from the current pathname.
 */
const copy = {
  en: {
    body: (
      <>
        This site may use analytics cookies to understand how visitors use it. No health or
        symptom information is ever included. You can accept or decline, and change your choice
        anytime — see our{" "}
        <Link href="/privacy" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
          Privacy Policy
        </Link>
        .
      </>
    ),
    decline: "Decline",
    accept: "Accept",
  },
  ar: {
    body: (
      <>
        قد يستخدم هذا الموقع ملفات تعريف ارتباط تحليلية لفهم كيفية استخدام الزوار له. لا يتم تضمين
        أي معلومات صحية أو أعراض على الإطلاق. يمكنك القبول أو الرفض، وتغيير اختيارك في أي وقت — راجع{" "}
        <Link href="/privacy" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
          سياسة الخصوصية
        </Link>
        .
      </>
    ),
    decline: "رفض",
    accept: "قبول",
  },
} as const;

export function ConsentBanner({ locale }: { locale?: "en" | "ar" } = {}) {
  const pathname = usePathname();
  const resolvedLocale = locale ?? (pathname?.startsWith("/ar") ? "ar" : "en");
  const t = copy[resolvedLocale];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deliberate: localStorage isn't available during SSR, so both the
    // server render and the client's first render must start hidden
    // (`visible` defaults to `false`) — updating it here, after mount,
    // is what avoids a hydration mismatch, not what causes one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getConsent() === "unset");
    // Covers visitors who chose before the cookie mirror existed — see
    // resyncConsentCookie()'s own comment.
    resyncConsentCookie();

    function handleReopen() {
      setVisible(true);
    }
    window.addEventListener(REOPEN_EVENT, handleReopen);
    return () => window.removeEventListener(REOPEN_EVENT, handleReopen);
  }, []);

  if (!visible) return null;

  function choose(status: "granted" | "denied") {
    setConsent(status);
    setVisible(false);
  }

  return (
    <div role="region" aria-label="Cookie preferences" className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-editorial flex-col gap-4 px-gutter py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">{t.body}</p>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="sm" onClick={() => choose("denied")}>
            {t.decline}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => choose("granted")}>
            {t.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
