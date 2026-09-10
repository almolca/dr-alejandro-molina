/**
 * Dated media appearances remain empty until their title/year/source are
 * verified. R4 owner-approved relationship wording is stored separately
 * below; it does not imply an approved article, date, logo or partnership.
 */
export type MediaAppearanceType =
  | "Editorial Contributor"
  | "Interview"
  | "Expert Commentary"
  | "Featured Physician"
  | "Media Appearance";

export type MediaAppearance = {
  outletName: string;
  logo?: string;
  title: string;
  type: MediaAppearanceType;
  year: number;
  url?: string;
  publishReady: boolean;
};

export const mediaAppearances: MediaAppearance[] = [];

/** Relationship wording approved by the owner in CODEX_R4 §3/§11.
 * Kept separate from dated appearances: no article, date or URL was supplied.
 */
export const editorialContributions: {
  outletName: string;
  wording: string;
  publishReady: boolean;
}[] = [{
  outletName: "Men's Health Spain",
  wording: "Contributor to Men's Health Spain",
  publishReady: true,
}];
