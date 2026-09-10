import { z } from "zod";

/**
 * Server-side validation for POST /api/events — R7.2 brief §11/§51.
 * `.strict()` rejects any unlisted key outright, so a caller can never
 * accidentally (or deliberately) smuggle name/email/phone/medical text
 * through the analytics pipeline — the schema itself is the guarantee,
 * not a policy comment.
 */
export const EVENT_NAMES = [
  "page_view",
  "book_cta_click",
  "book_page_view",
  "lead_submit_success",
  "lead_submit_error",
  "nmc_booking_click",
  "physician_profile_click",
] as const;

export const analyticsEventSchema = z
  .object({
    name: z.enum(EVENT_NAMES),
    anonymousSessionId: z.string().trim().min(1).max(100),
    path: z.string().trim().min(1).max(500),
    serviceInterest: z.string().trim().max(60).optional(),
    source: z.string().trim().max(30).optional(),
    utmSource: z.string().trim().max(200).optional(),
    utmMedium: z.string().trim().max(200).optional(),
    utmCampaign: z.string().trim().max(200).optional(),
    referrerCategory: z.string().trim().max(30).optional(),
  })
  .strict();

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
