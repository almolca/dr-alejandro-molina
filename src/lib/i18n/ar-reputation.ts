/**
 * Centralized Arabic mirrors of owner-approved strings in
 * `config/reputation.ts` / `config/mediaAppearances.ts`. Introduced in
 * R9 Phase B Batch 1 after a third and fourth consumer needed the same
 * facts B0 had already duplicated between PhysicianAuthority and
 * AuthorityMediaSectionAr with only a sync comment linking them — this
 * is the single source those comments now point to. Every value here
 * translates an existing owner-approved English string; this file adds
 * no new facts. If the underlying English string in config/reputation.ts
 * ever changes, update the matching value here too.
 */
export const AR_REPUTATION = {
  /** Mirrors config/reputation.ts's `publicReviewHeadline`. */
  reviewHeadline: "أكثر من 450 تقييمًا من المرضى عبر منصات مستقلة",
  /** Mirrors config/reputation.ts's `publicReviewHeadlineWithPlatforms`. */
  reviewHeadlineWithPlatforms: "أكثر من 450 تقييمًا من المرضى عبر Google وDoctoralia وTop Doctors",
  /** Mirrors config/reputation.ts's `trainingPrograms[0].positioningLine`. */
  trainingPositioningLine: "نهج تطوّر عبر سنوات من الممارسة السريرية، ويُدرَّس الآن لأطباء آخرين.",
  /** Mirrors config/mediaAppearances.ts's `editorialContributions` wording, keyed by `outletName`. Components fall back to the English wording when no Arabic entry exists for a given outlet — never a fabricated translation. */
  editorialWordingByOutlet: {
    "Men's Health Spain": "مساهم في مجلة Men's Health إسبانيا",
  } as Record<string, string>,
};
