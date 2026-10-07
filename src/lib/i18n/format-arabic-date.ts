const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/**
 * Formats an ISO date as "18 سبتمبر 2026" — matching the literal
 * Gregorian-with-Arabic-month-names style already used on /ar/privacy.
 * Deliberately not `toLocaleDateString("ar", ...)`: several `ar-*`
 * locales default to the Hijri calendar or Eastern Arabic numerals,
 * neither of which matches the rest of the site's date conventions.
 *
 * Extracted from `insights/[slug]/page.tsx` (R10) so `ArticleAuthorBlockAr`
 * can reuse it for the "Last medically reviewed" line without duplicating
 * the formatting logic (penile implant authority/E-E-A-T phase).
 */
export function formatArabicDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${ARABIC_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
