import { type ServiceInterest } from "./service-interest";

/**
 * Patient-facing "what would you like to discuss" options — R7.2 UX
 * addendum. Deliberately broader/softer than the internal
 * `SERVICE_INTERESTS` page-context enum (`service-interest.ts`):
 * `/book` is a low-friction attribution gateway, and a visitor should
 * never be recorded as having a specific diagnosis merely because of
 * which marketing page linked them here. This field is optional and
 * entirely patient-controlled — "Prefer not to say" collapses to no
 * selection (`undefined`/`null`), never a stored value.
 */
export const DISCUSSION_TOPICS = [
  { value: "mens_sexual_health", label: "Men's Sexual Health" },
  { value: "penile_doppler_vascular", label: "Penile Doppler / Vascular Assessment" },
  { value: "male_hormonal_health", label: "Male Hormonal Health" },
  { value: "penile_girth", label: "Penile Girth Enhancement" },
  { value: "penile_surgery", label: "Penile Surgery" },
  { value: "male_aesthetics", label: "Male Aesthetics" },
  { value: "fertility", label: "Fertility" },
  { value: "general_urology", label: "General Urology" },
] as const;

export type DiscussionTopic = (typeof DISCUSSION_TOPICS)[number]["value"];

export const DISCUSSION_TOPIC_VALUES = DISCUSSION_TOPICS.map(
  (t) => t.value,
) as [DiscussionTopic, ...DiscussionTopic[]];

/** UI-only sentinel — never stored. `createLead` maps this (and "") to `undefined`. */
export const PREFER_NOT_TO_SAY = "prefer_not_to_say" as const;

export function isDiscussionTopic(value: string): value is DiscussionTopic {
  return (DISCUSSION_TOPIC_VALUES as readonly string[]).includes(value);
}

export function discussionTopicLabel(value: string | null | undefined): string {
  if (!value) return "Not specified";
  return DISCUSSION_TOPICS.find((t) => t.value === value)?.label ?? "Not specified";
}

/**
 * The single source of truth for "what does the submitted select value
 * actually mean" — R7.2.2. Used by `BookingLeadForm` to decide what
 * (if anything) to send to the server: omitted/empty and the
 * "Prefer not to say" sentinel both resolve to `undefined` (no topic),
 * exactly like leaving the field untouched — a declined answer is
 * indistinguishable from no answer, by design. Anything that isn't a
 * real `DiscussionTopic` (including the fine-grained page-context
 * enum, or garbage) also resolves to `undefined` rather than being
 * passed through, so this function alone determines what can ever
 * reach the server for this field.
 */
export function resolveSubmittedDiscussionTopic(
  raw: string | null | undefined,
): DiscussionTopic | undefined {
  if (!raw || raw === PREFER_NOT_TO_SAY) return undefined;
  return isDiscussionTopic(raw) ? raw : undefined;
}

/**
 * Maps a marketing page's fine-grained service context (the
 * `?service=` a `BookingCta` link carries) to the closest broad
 * discussion topic, purely to suggest a convenience default on the
 * optional select — never treated as a confirmed answer. Some
 * fine-grained values (e.g. `other`) have no confident broad mapping
 * and intentionally return `undefined`, leaving the field unprefilled.
 */
const SERVICE_TO_TOPIC: Partial<Record<ServiceInterest, DiscussionTopic>> = {
  erectile_dysfunction: "mens_sexual_health",
  premature_ejaculation: "mens_sexual_health",
  penile_doppler: "penile_doppler_vascular",
  venous_leak: "penile_doppler_vascular",
  penile_girth: "penile_girth",
  filler_correction: "male_aesthetics",
  male_aesthetics: "male_aesthetics",
  penile_implant: "penile_surgery",
  peyronies: "penile_surgery",
  testosterone: "male_hormonal_health",
  fertility: "fertility",
  varicocele: "general_urology",
  vasectomy: "general_urology",
  general_urology: "general_urology",
};

export function mapServiceToDiscussionTopic(
  service: ServiceInterest | undefined,
): DiscussionTopic | undefined {
  if (!service) return undefined;
  return SERVICE_TO_TOPIC[service];
}
