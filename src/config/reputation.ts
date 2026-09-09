/**
 * Central reputation configuration (R7.1) — the single source of truth
 * for review-platform data, external publications and the AndroMax
 * training reference. Supersedes the earlier `config/reviews.ts`
 * scaffold (never consumed by any component, safely replaced).
 *
 * Deliberately does NOT duplicate `doctor.awards` or
 * `config/mediaAppearances.ts` — those already centralize the
 * owner-confirmed awards (Top Doctors Spain 2020, Doctoralia Awards
 * Spain 2022) and the Men's Health Spain contributor wording, and are
 * already consumed correctly by RecognitionSection / AuthorityStripSection
 * / AuthorityMediaSection. `awardLogos` below only adds the logo asset
 * path for each, keyed by the exact `officialTitle` already in doctor.ts.
 *
 * Verification provenance:
 * - Google: rating/count owner-confirmed directly (not independently
 *   re-verified by fetch — Google profiles aren't reliably fetchable
 *   without an API key).
 * - Doctoralia: independently re-verified via a live fetch of the
 *   profile URL (2026-09-09). Fetched via an automated tool, not a
 *   manual screenshot — a human spot-check is still recommended.
 * - Top Doctors (both profiles): the profile URLs were confirmed real
 *   via web search, and this automated tool's own attempts to fetch the
 *   individual profile pages were blocked. The owner subsequently
 *   independently verified the current rating/review count directly
 *   from Top Doctors' own live specialty/directory pages (R7.1
 *   correction, 2026-09-09) — recorded here as owner-verified, not
 *   re-derived by this tool.
 *
 * Also surfaced during verification but NOT added here, pending
 * explicit owner sign-off (only the two awards below are owner-
 * approved for publication): Doctoralia "Certificates of Excellence"
 * 2016–2020, Doctoralia Awards nominations 2020/2021, and a "Spain
 * Prestige Awards 2021" listed on Doctoralia's own profile page.
 * Also NOT used: a "22 years of experience" figure and a "2,000+
 * procedures" figure surfaced on third-party/marketing sources — both
 * conflict with the owner-confirmed figures already in doctor.ts
 * (15+ years, 500+ Girth Enhancement procedures) and are not used.
 */

export type ReviewPlatform = {
  platform: "Google" | "Doctoralia" | "Top Doctors";
  /** Distinguishes multiple profiles on the same platform (e.g. Top Doctors' separate Urología/Andrología profiles). */
  label?: string;
  profileUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  lastVerified: string | null;
  verificationMethod?: string;
  /** True only once profileUrl + rating + reviewCount + lastVerified are all real. */
  verified: boolean;
};

export const reviewPlatforms: ReviewPlatform[] = [
  {
    platform: "Google",
    profileUrl: null, // TODO(owner): supply the public Google Business Profile / review URL to link out to.
    rating: 4.9,
    reviewCount: 58,
    lastVerified: "2026-09-09",
    verificationMethod: "Owner-confirmed",
    verified: true,
  },
  {
    platform: "Doctoralia",
    profileUrl: "https://www.doctoralia.es/alejandro-molina-cabeza/urologo-andrologo/valencia",
    rating: 5,
    reviewCount: 237,
    lastVerified: "2026-09-09",
    verificationMethod: "Live automated fetch of the profile page",
    verified: true,
  },
  {
    platform: "Top Doctors",
    label: "Andrología",
    profileUrl: "https://www.topdoctors.es/doctor/alejandro-molina-cabeza-doctor/",
    rating: 5,
    reviewCount: 14,
    lastVerified: "2026-09-09",
    verificationMethod: "Owner-verified via Top Doctors' live specialty/directory pages (R7.1 correction)",
    verified: true,
  },
  {
    platform: "Top Doctors",
    label: "Urología",
    profileUrl: "https://www.topdoctors.es/doctor/alejandro-molina-cabeza/",
    rating: 5,
    reviewCount: 147,
    lastVerified: "2026-09-09",
    verificationMethod: "Owner-verified via Top Doctors' live specialty/directory pages (R7.1 correction)",
    verified: true,
  },
];

/**
 * A rounded aggregate headline is only safe to publish once the sum of
 * *verified* platform counts actually supports it. As of the R7.1
 * correction that's 58 (Google) + 237 (Doctoralia) + 147 (Top Doctors
 * Urología) + 14 (Top Doctors Andrología) = 456 — which supports the
 * "450+ patient reviews across independent platforms" headline. If any
 * platform's `verified` flag is ever set back to false, this constant
 * (and the headline it supports) updates automatically.
 */
export const verifiedReviewTotal = reviewPlatforms
  .filter((p) => p.verified && p.reviewCount !== null)
  .reduce((sum, p) => sum + (p.reviewCount ?? 0), 0);

/**
 * UI-simplicity aggregate of the two separate Top Doctors profiles
 * (Urología 147 + Andrología 14 = 161), per the R7.1.1 correction —
 * the public review card shows one combined Top Doctors figure while
 * `reviewPlatforms` above still keeps both profiles/links available
 * individually. Never hand-typed: both `rating` and `reviewCount` are
 * derived from the same verified per-platform data. `verified` is
 * false (and `rating`/`reviewCount` reflect no data) whenever no Top
 * Doctors entry is verified — the component must fall back to a bare
 * "Verified profile" line in that case, exactly like Google/Doctoralia.
 */
const verifiedTopDoctorsEntries = reviewPlatforms.filter(
  (p) => p.platform === "Top Doctors" && p.verified && p.reviewCount !== null,
);

export const topDoctorsAggregate = {
  rating:
    verifiedTopDoctorsEntries.length > 0
      ? verifiedTopDoctorsEntries.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
        verifiedTopDoctorsEntries.length
      : null,
  reviewCount: verifiedTopDoctorsEntries.reduce((sum, p) => sum + (p.reviewCount ?? 0), 0),
  verified: verifiedTopDoctorsEntries.length > 0,
};

/**
 * The approved public-facing headline (R7.1.1 correction). Deliberately
 * a fixed, owner-approved string rather than `${verifiedReviewTotal}+`
 * — the live sum is 456, but the approved wording rounds down to
 * "450+" rather than restating the exact figure. If `verifiedReviewTotal`
 * ever drops below 450, this constant must be revisited by the owner
 * before publishing — it is intentionally not auto-derived.
 */
export const publicReviewHeadline = "450+ patient reviews across independent platforms";

/**
 * A platform-naming variant of `publicReviewHeadline` above (R7.1.2 §7)
 * — same "450+" rounding rationale (see that export's own comment): a
 * fixed, owner-approved string, not derived from `verifiedReviewTotal`.
 * Used where naming the specific platforms adds trust-surface value,
 * e.g. next to the booking CTA.
 */
export const publicReviewHeadlineWithPlatforms =
  "450+ patient reviews across Google, Doctoralia & Top Doctors";

/** Logo asset path per award, keyed by the exact `officialTitle` in `doctor.awards`. Both approved and supplied by the owner (R7.1). */
export const awardLogos: Record<string, string> = {
  "Top Doctors Spain 2020": "/brand/authority/top-doctors-awards-2020.png",
  "Doctoralia Awards Spain 2022": "/brand/authority/doctoralia-awards-2022.jpg",
};

export type Publication = {
  /** A topic-based label, not a claimed verbatim headline — see file header on Men's Health verification. */
  label: string;
  outletName: string;
  date: string | null;
  url: string;
  logoSrc: string | null;
  approved: boolean;
};

/**
 * Owner-supplied Men's Health Spain author profile + selected articles
 * (R7.1). The exact published headlines could not be independently
 * verified — menshealth.com blocks automated fetching and the URLs
 * don't yet appear in search indexes — so `label` below is a topic
 * description, not a claimed exact title. URLs are used as supplied by
 * the owner. Recommend a manual click-through check before relying on
 * these further.
 */
export const mensHealthAuthorProfileUrl =
  "https://www.menshealth.com/es/author/285057/alejandro-molina-medico-urologo-andrologo/";

export const publications: Publication[] = [
  {
    label: "Testosterone and the body's daily rhythm",
    outletName: "Men's Health Spain",
    date: null,
    url: "https://www.menshealth.com/es/salud-bienestar/a70935311/testosterona-ritmo-diario-alta-manana/",
    logoSrc: "/brand/authority/mens-health.jpg",
    approved: true,
  },
  {
    label: "Testosterone, explained by an andrologist",
    outletName: "Men's Health Spain",
    date: null,
    url: "https://www.menshealth.com/es/salud-bienestar/a70119367/testosterona-andrologo-hormona-testiculos/",
    logoSrc: "/brand/authority/mens-health.jpg",
    approved: true,
  },
  {
    label: "What testosterone actually does",
    outletName: "Men's Health Spain",
    date: null,
    url: "https://www.menshealth.com/es/salud-bienestar/a32810591/testosterona-que-hace/",
    logoSrc: "/brand/authority/mens-health.jpg",
    approved: true,
  },
];

export type TrainingProgram = {
  program: string;
  role: string;
  positioningLine: string;
  logoSrc: string | null;
  url?: string;
};

/** AndroMax — used as a teaching-authority signal, never as a channel for proprietary technique (R7.1 §C). */
export const trainingPrograms: TrainingProgram[] = [
  {
    program: "AndroMax Training",
    role: "Medical Trainer in Penile Girth Enhancement",
    positioningLine: "An approach refined through years of clinical practice and now taught to other doctors.",
    logoSrc: "/brand/authority/andromax-training.png",
  },
];
