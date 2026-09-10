"use client";

import { reopenConsentBanner } from "./ConsentBanner";

/**
 * "Change my choice" control (R8.1C privacy audit §6) — reopens the
 * existing consent banner rather than introducing a second consent UI.
 * A small client component so `Footer.tsx` itself can stay a server
 * component.
 */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={reopenConsentBanner}
      className="transition-colors hover:text-foreground"
    >
      Cookie Settings
    </button>
  );
}
