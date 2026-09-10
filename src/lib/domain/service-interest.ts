/**
 * Fine-grained page-context enum — R7.2 brief §6. Used by `BookingCta`'s
 * `?service=` link/prefill context and page-level analytics event
 * properties. Deliberately NOT the enum stored on a lead (see
 * `discussion-topic.ts`): a visitor must never be recorded as having a
 * specific condition merely because of which marketing page linked
 * them to `/book` (R7.2 UX/privacy addendum). Do not derive logic from
 * the human labels below.
 */
export const SERVICE_INTERESTS = [
  { value: "erectile_dysfunction", label: "Erectile Dysfunction" },
  { value: "penile_doppler", label: "Penile Doppler" },
  { value: "venous_leak", label: "Venous Leak / Veno-Occlusive Dysfunction" },
  { value: "premature_ejaculation", label: "Premature Ejaculation" },
  { value: "penile_girth", label: "Penile Girth Enhancement" },
  { value: "filler_correction", label: "Penile Filler Correction" },
  { value: "male_aesthetics", label: "Male Aesthetics" },
  { value: "penile_implant", label: "Penile Implant" },
  { value: "peyronies", label: "Peyronie's Disease" },
  { value: "testosterone", label: "Testosterone / Hormonal Health" },
  { value: "fertility", label: "Fertility" },
  { value: "varicocele", label: "Varicocele" },
  { value: "vasectomy", label: "Vasectomy" },
  { value: "general_urology", label: "General Urology" },
  { value: "other", label: "Other" },
] as const;

export type ServiceInterest = (typeof SERVICE_INTERESTS)[number]["value"];

export const SERVICE_INTEREST_VALUES = SERVICE_INTERESTS.map(
  (s) => s.value,
) as [ServiceInterest, ...ServiceInterest[]];

export function isServiceInterest(value: string): value is ServiceInterest {
  return (SERVICE_INTEREST_VALUES as readonly string[]).includes(value);
}
