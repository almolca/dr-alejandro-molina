/**
 * Practice / facility configuration.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §1.D, §21, §26
 *
 * This is the ONLY place the current clinical location and booking
 * destination should be defined. Components must read from `practice`
 * rather than hard-coding "NMC Royal Hospital Khalifa City" or any URL,
 * so the practice location can change without touching dozens of files.
 */

export const practice = {
  /** Full legal/public facility name as used in copy and schema.org data. */
  facilityName: "NMC Royal Hospital Khalifa City",
  /** Shorter form for tight UI spaces (nav, footer badges, mobile CTA). */
  facilityShortName: "NMC Royal Hospital",
  city: "Abu Dhabi",
  emirate: "Abu Dhabi",
  country: "United Arab Emirates",
  countryCode: "AE",

  /**
   * Official NMC online booking / appointment URL for Dr. Alejandro
   * Molina, confirmed by the owner in Phase 4. This is the primary
   * destination for every "Book a Consultation" CTA site-wide
   * (`components/ui/BookingCta.tsx`) — never the physician profile URL
   * below, even though both point at NMC.
   */
  bookingUrl:
    "https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina",

  /**
   * Official NMC physician profile URL for Dr. Alejandro Molina,
   * confirmed by the owner in Phase 4. Used only for secondary actions
   * ("View NMC Profile", hospital-affiliation reference) and the
   * `Person` schema's `sameAs` — never as a booking CTA destination.
   */
  physicianProfileUrl: "https://nmc.ae/en/doctors/dr-alejandro-molina",

  /**
   * TODO(owner): official facility website URL, if it should be linked
   * anywhere (footer, schema.org). Not provided in the master spec.
   */
  facilityUrl: "",

  /** TODO(owner): only populate once a phone number is approved for publication (spec §21). */
  phone: "",

  /** TODO(owner): Google Maps / directions URL for the facility, if needed. */
  mapsUrl: "",
} as const;

/** True once the real NMC booking destination has been supplied. */
export const isBookingConfigured = practice.bookingUrl.length > 0;

/** True once the real NMC physician profile URL has been supplied. */
export const isPhysicianProfileConfigured =
  practice.physicianProfileUrl.length > 0;

/**
 * Human-readable location line used throughout the site, e.g.
 * "Consultations at NMC Royal Hospital Khalifa City, Abu Dhabi" (spec §26).
 */
export const practiceLocationLine = `${practice.facilityName}, ${practice.city}`;
