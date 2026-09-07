/**
 * Media & editorial appearances — Phase R2.1/R3. The owner has stated
 * Dr. Molina collaborates with Men's Health and has participated in
 * other media outlets, but no outlet name, article title, or URL has
 * been verified yet. This array ships empty — populate each entry only
 * once the owner supplies the real outlet, title, year and URL; never
 * invent any of these fields. `publishReady` gates rendering exactly
 * like `doctor.awards` does — an entry can exist here as a draft
 * without ever reaching the live page.
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
