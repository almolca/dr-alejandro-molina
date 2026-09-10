import { describe, expect, it } from "vitest";
import { analyticsEventSchema } from "./event-schema";

const validPayload = {
  name: "book_cta_click" as const,
  anonymousSessionId: "abc-123",
  path: "/erectile-dysfunction",
  serviceInterest: "erectile_dysfunction",
  source: "google_business",
};

describe("analyticsEventSchema", () => {
  it("accepts a valid payload", () => {
    expect(analyticsEventSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects an unknown event name", () => {
    const result = analyticsEventSchema.safeParse({ ...validPayload, name: "form_submit" });
    expect(result.success).toBe(false);
  });

  it("rejects a payload missing required fields", () => {
    const rest: Record<string, unknown> = { ...validPayload };
    delete rest.path;
    expect(analyticsEventSchema.safeParse(rest).success).toBe(false);
  });

  for (const piiField of ["email", "phone", "fullName", "patientName"]) {
    it(`rejects a payload carrying an extra "${piiField}" field (no PII, brief §11)`, () => {
      const result = analyticsEventSchema.safeParse({ ...validPayload, [piiField]: "leaked-value" });
      expect(result.success).toBe(false);
    });
  }
});
