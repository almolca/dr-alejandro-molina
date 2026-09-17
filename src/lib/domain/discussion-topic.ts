/**
 * Patient-facing "what would you like to discuss" options — R7.2 UX
 * addendum. Retained after the R9 booking funnel correction removed
 * the public lead-capture form: `DISCUSSION_TOPICS` and
 * `discussionTopicLabel` are still used by admin pages to display the
 * discussion topic stored on historical leads created before this
 * correction. The form-submission helpers that used to live here
 * (`resolveSubmittedDiscussionTopic`, `mapServiceToDiscussionTopic`,
 * `isDiscussionTopic`, `PREFER_NOT_TO_SAY`) were removed — their only
 * callers, `BookingLeadForm.tsx` and `book/actions.ts`, no longer exist.
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

export function discussionTopicLabel(value: string | null | undefined): string {
  if (!value) return "Not specified";
  return DISCUSSION_TOPICS.find((t) => t.value === value)?.label ?? "Not specified";
}
