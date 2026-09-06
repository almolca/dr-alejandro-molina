import { z } from "zod";

/**
 * Strict env validation (spec §32). Extend this schema as real
 * env-driven config (analytics IDs, etc.) is introduced — every value
 * consumed from `process.env` should be validated here rather than read
 * ad hoc, so a missing/malformed value fails fast at build/start time.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
