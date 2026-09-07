/**
 * Verified patient-review trust signal — Phase R2.1/R3. No rating,
 * review count, or platform is configured yet. Never render a star
 * rating or review count that isn't `publishReady` and backed by a
 * real, owner-supplied `profileUrl` — this must link to an actual
 * verified profile (Google, Doctoralia, etc.), never a fabricated one.
 */
export type PatientReviewProfile = {
  platformName: string;
  rating?: number;
  reviewCount?: number;
  profileUrl: string;
  lastVerifiedAt?: string;
  publishReady: boolean;
};

export const patientReviews: PatientReviewProfile | undefined = undefined;
