/**
 * Service-interest enum — R7.2 brief §6. Stable internal values used by
 * the booking form, `leads.service_interest`, and analytics event
 * properties. Do not derive logic from the human labels below.
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

export function serviceInterestLabel(value: string): string {
  return SERVICE_INTERESTS.find((s) => s.value === value)?.label ?? "Other";
}
