/**
 * Centralized Arabic mirrors of physician-identity strings that recur
 * across nearly every Arabic page — title, display name, practice
 * location. Introduced after these were found duplicated across many
 * files with no shared source (R9 Phase B Batch 1 final review).
 * Every value here translates an existing owner-approved English
 * string in config/doctor.ts / config/practice.ts; this file adds no
 * new facts. If the underlying English string ever changes, update
 * the matching value here too.
 */
export const AR_IDENTITY = {
  /** Mirrors config/doctor.ts's `doctor.title`. */
  doctorTitle: "استشاري أمراض المسالك البولية والذكورة",
  /** Mirrors config/doctor.ts's `doctor.displayName`. */
  doctorDisplayName: "د. أليخاندرو مولينا",
  /** Mirrors config/practice.ts's `practiceLocationLine`. */
  practiceLocationLine: "مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي",
};
