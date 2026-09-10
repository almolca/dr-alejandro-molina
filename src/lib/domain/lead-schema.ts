import { z } from "zod";
import { DISCUSSION_TOPIC_VALUES } from "./discussion-topic";
import { SOURCES } from "./source";

/**
 * Lead validation — R7.2 UX/privacy addendum. `/book` is a low-friction
 * attribution gateway before the NMC handoff, not a contact/intake
 * form: only name, email, an *optional* discussion topic, and privacy
 * consent are collected. Phone, preferred contact method, and
 * marketing consent were removed from the public form entirely (kept
 * nullable in the DB for backward compatibility — see
 * supabase/migrations/0003_make_phone_optional.sql).
 *
 * `discussionTopic` uses the broader, patient-facing enum
 * (`discussion-topic.ts`), never the fine-grained page-context enum —
 * a visitor must never be recorded as having a specific diagnosis
 * merely because of which marketing page linked them here. The
 * "Prefer not to say" sentinel is intentionally NOT a valid value
 * here: the client omits the field entirely when that's chosen (see
 * `BookingLeadForm.tsx`), so "no topic" and "declined" are both
 * represented the same way — absence, not a stored value.
 *
 * `honeypot` and `renderedAt` are anti-spam fields, validated here but
 * stripped before the DB insert.
 */
const trimmed = (max: number) => z.string().trim().min(1).max(max);

export const leadFormSchema = z.object({
  fullName: trimmed(200),
  email: z
    .string()
    .trim()
    .max(254)
    .email()
    .transform((v) => v.toLowerCase()),
  discussionTopic: z.enum(DISCUSSION_TOPIC_VALUES).optional(),
  privacyConsent: z.literal(true, {
    message: "Privacy consent is required.",
  }),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  renderedAt: z.coerce.number(),
});

const utmField = z.string().trim().max(200).optional();

export const createLeadServerSchema = leadFormSchema.extend({
  referrer: z.string().trim().max(2000).optional(),
  originPage: z.string().trim().max(500).optional(),
  utmSource: utmField,
  utmMedium: utmField,
  utmCampaign: utmField,
  utmTerm: utmField,
  utmContent: utmField,
  firstTouchSource: z.enum(SOURCES).optional(),
  firstTouchLandingPage: z.string().trim().max(500).optional(),
  firstTouchAt: z.string().datetime().optional(),
  lastTouchSource: z.enum(SOURCES).optional(),
  lastTouchPage: z.string().trim().max(500).optional(),
  lastTouchAt: z.string().datetime().optional(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;
export type CreateLeadInput = z.infer<typeof createLeadServerSchema>;
