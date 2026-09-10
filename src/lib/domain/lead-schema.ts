import { z } from "zod";
import { SERVICE_INTEREST_VALUES } from "./service-interest";
import { SOURCES } from "./source";

/**
 * Lead validation — R7.2 brief §18. Normalizes (trim strings, lowercase
 * email, collapse phone whitespace) without aggressively reformatting
 * international numbers. `honeypot` and `renderedAt` are anti-spam
 * fields (brief §19), validated here but stripped before the DB insert.
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
  phone: trimmed(40).transform((v) => v.replace(/\s+/g, " ")),
  serviceInterest: z.enum(SERVICE_INTEREST_VALUES),
  preferredContactMethod: z.enum(["phone", "email", "whatsapp"]).optional(),
  privacyConsent: z.literal(true, {
    message: "Privacy consent is required.",
  }),
  marketingConsent: z.boolean().default(false),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  renderedAt: z.coerce.number(),
});

const utmField = z.string().trim().max(200).optional();

export const createLeadServerSchema = leadFormSchema.extend({
  referrer: z.string().trim().max(2000).optional(),
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
