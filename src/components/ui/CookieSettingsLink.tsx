"use client";

import { reopenConsentBanner } from "./ConsentBanner";

export function CookieSettingsLink({ locale = "en" }: { locale?: "en" | "ar" }) {
  return (
    <button type="button" onClick={reopenConsentBanner} className="transition-colors hover:text-foreground">
      {locale === "ar" ? "إعدادات ملفات تعريف الارتباط" : "Cookie Settings"}
    </button>
  );
}
