/**
 * Review-platform and selected-publication configuration (R7B).
 *
 * This is the single source of truth for anything a future
 * ReviewsSection / PublicationsSection should render. It deliberately
 * does NOT duplicate `doctor.awards` or `config/mediaAppearances.ts` —
 * those are already centralized and already consumed correctly by
 * RecognitionSection / AuthorityStripSection / AuthorityMediaSection.
 * This file exists for the two things that had no home yet: live
 * review-platform data and selected external publications.
 *
 * As of this file's creation, NONE of the fields below are verified:
 * - No Google, Doctoralia or Top Doctors profile URL has been supplied.
 * - No rating or review count has been confirmed by the owner.
 * - No external publication (article, URL, date) has been confirmed.
 *
 * Ratings and review counts change over time and must never be
 * hardcoded from memory or estimation — only from a value the owner
 * has explicitly confirmed as current, with the date it was checked.
 * Every consumer of `reviewPlatforms` / `publications` must render
 * nothing (or a bare, rating-free profile link) for an entry with
 * `verified: false` — never a placeholder number.
 */

export type ReviewPlatform = {
  platform: "Google" | "Doctoralia" | "Top Doctors";
  /** Owner-supplied public profile URL. Null until confirmed — do not guess a URL pattern. */
  profileUrl: string | null;
  /** Star rating out of 5, only ever set alongside `verified: true`. */
  rating: number | null;
  /** Number of reviews backing that rating, only ever set alongside `verified: true`. */
  reviewCount: number | null;
  /** ISO date the rating/count above was last confirmed as current with the owner. */
  lastVerified: string | null;
  /** True only once profileUrl + rating + reviewCount + lastVerified are all real and owner-confirmed. */
  verified: boolean;
};

export const reviewPlatforms: ReviewPlatform[] = [
  { platform: "Google", profileUrl: null, rating: null, reviewCount: null, lastVerified: null, verified: false },
  { platform: "Doctoralia", profileUrl: null, rating: null, reviewCount: null, lastVerified: null, verified: false },
  { platform: "Top Doctors", profileUrl: null, rating: null, reviewCount: null, lastVerified: null, verified: false },
];

export type Publication = {
  articleTitle: string;
  outletName: string;
  /** Real publication year/date only — never invented. */
  date: string | null;
  url: string | null;
  /** Local logo asset path, only once an approved logo file exists in the repo. */
  logoSrc: string | null;
  approved: boolean;
};

/** Empty until real external articles/publications are supplied and approved — see mediaAppearances.ts for the one already-approved relationship (Men's Health Spain, wording only, no dated article yet). */
export const publications: Publication[] = [];
