/**
 * Doctor / personal-brand content configuration.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §22, §39, §41
 *
 * Every public claim here must derive from verified source material or
 * explicit owner-provided copy (spec §41). Fields below are seeded ONLY
 * from what the master spec itself states as positioning or "verified
 * professional background" (§0, §8, §39). Anything the spec does not
 * state (exact dates, institutions beyond what's named, awards, academic
 * titles, languages spoken, phone, social handles, biography prose) is
 * left empty and marked for owner input rather than invented.
 */

export const doctor = {
  fullName: "Alejandro Molina",
  displayName: "Dr. Alejandro Molina",
  title: "Consultant Urologist & Andrologist",

  /** Spec §2 supporting positioning line. */
  specialtyLine:
    "Advanced Andrology · Sexual Medicine · Penile Surgery · Men's Health",

  location: {
    city: "Abu Dhabi",
    country: "United Arab Emirates",
  },

  /**
   * Subspecialty identity areas — spec §0 non-negotiable positioning.
   * Drives nav/section structure; do not reorder Tier 1 below Tier 2/3
   * (spec §3 commercial priority matrix).
   */
  expertise: [
    "Andrology & Men's Health",
    "Sexual Medicine / Erectile Dysfunction",
    "Testosterone & Male Hormonal Health",
    "Penile Implant Surgery",
    "Male Genital Aesthetics / Penile Enhancement",
    "Peyronie's Disease / Penile Curvature",
    "Male Fertility",
  ] as const,

  /**
   * From spec §8 "verified professional background", plus two items
   * (uro-oncology, functional urology) added per explicit owner
   * instruction in the Phase 4 prompt — additional verified background
   * beyond what the original master spec text captured, supplied
   * directly rather than invented (spec §22/§41 both treat explicit
   * owner-provided copy as a valid source, same as the spec text
   * itself). Kept as fragments intentionally — do not expand further
   * with invented specifics (institution years, exact degree titles,
   * transplant volumes, etc.) without owner/source confirmation.
   */
  credentials: [
    "Medical degree and training in Spain",
    "Hospital Clínic Barcelona training",
    "FEBU — Fellow of the European Board of Urology",
    "Extensive tertiary hospital experience",
    "Advanced laparoscopic surgery",
    "Renal transplantation surgery",
    "Uro-oncology",
    "Functional urology",
    "Andrology and male sexual health",
    "Male genital aesthetics",
    "Academic and teaching background",
    "Practicing in the United Arab Emirates",
  ] as const,

  /**
   * TODO(owner): confirm languages spoken before publishing. Spanish and
   * English are plausible given training/practice history but are not
   * explicitly stated in the master spec, so left empty per spec §41.
   */
  languages: [] as const,

  /**
   * Authority facts — owner-confirmed 2026-09-05, in response to the
   * "Authority Claims Verification Status" table in
   * SEO_RESTRUCTURE_GAP_ANALYSIS.md. Wording below is the owner's own
   * preferred phrasing verbatim, not paraphrased or expanded.
   *
   * Every consumer of these fields (AuthorityStripSection,
   * FeaturedProcedureSection, the Penile Girth Enhancement page, the
   * About page, personSchema()) must render nothing for a field that is
   * `undefined` — never a fallback placeholder, never an invented
   * number. This is the same fail-safe pattern already used for
   * `isBookingConfigured` in config/practice.ts.
   */
  yearsOfExperience: 15,
  girthEnhancementSince: 2018,
  girthProcedureCount: "500+",

  /**
   * B2B medical-education activity — kept as its own field, deliberately
   * separate from the clinical `credentials`/`expertise` above, per the
   * owner's explicit instruction to keep clinical (B2C) services and
   * AndroMax (B2B) education clearly separated.
   */
  medicalTrainer: {
    role: "Medical Trainer in Penile Girth Enhancement",
    program: "AndroMax Training",
    description:
      "Alongside his clinical practice, Dr. Molina provides dedicated training in penile enhancement techniques to urologists and aesthetic physicians through AndroMax Training.",
    /** TODO(owner): official AndroMax Training URL, if it should be linked out to. */
    programUrl: undefined as string | undefined,
  },

  /** Owner-confirmed for publication in the R4 authority correction.
   * Use these exact names; no additional category or ranking is asserted.
   */
  awards: [
    {
      issuer: "Top Doctors Spain",
      year: 2020,
      officialTitle: "Top Doctors Spain 2020",
      ownerConfirmed: true,
      publishReady: true,
    },
    {
      issuer: "Doctoralia Awards Spain",
      year: 2022,
      officialTitle: "Doctoralia Awards Spain 2022",
      ownerConfirmed: true,
      publishReady: true,
    },
  ],

  /** TODO(owner): verified academic/teaching roles, if approved for publication. */
  academicRoles: [] as const,

  /**
   * TODO(owner-or-photographer): replace with real photography per spec
   * §18. Referenced path does not exist yet — see public/images/doctor/.
   */
  profileImage: {
    src: "/images/doctor/placeholder-portrait.jpg",
    alt: "Portrait of Dr. Alejandro Molina — placeholder pending photography",
  },

  /** TODO(owner): populate only official, owner-approved profile links. */
  socialLinks: {} as Record<string, string>,

  /**
   * Institutional reference only (spec §39) — the public NMC profile
   * lists a broader set of interests (e.g. PRP, Botulinum Toxin) than
   * this site currently advertises. Do not use this list to justify
   * adding pages/claims without going through the compliance checklist
   * in spec §28.
   */
  institutionalReferenceNote:
    "Institutional context per current public NMC profile only (spec §39). Site claims require independent owner/compliance review before publication.",
} as const;
