import { describe, expect, it } from "vitest";
import { leadFormSchema } from "./lead-schema";

const validPayload = {
  fullName: "  Jane Doe  ",
  email: "Jane.Doe@Example.com",
  phone: "+971 50 123 4567",
  serviceInterest: "erectile_dysfunction" as const,
  privacyConsent: true as const,
  marketingConsent: false,
  honeypot: "",
  renderedAt: Date.now() - 5000,
};

describe("leadFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = leadFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("lowercases and trims the email", () => {
    const result = leadFormSchema.safeParse(validPayload);
    expect(result.success && result.data.email).toBe("jane.doe@example.com");
  });

  it("trims the full name", () => {
    const result = leadFormSchema.safeParse(validPayload);
    expect(result.success && result.data.fullName).toBe("Jane Doe");
  });

  it("rejects an invalid email", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects missing privacy consent", () => {
    const { privacyConsent: _drop, ...rest } = validPayload;
    const result = leadFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects privacy consent set to false", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, privacyConsent: false });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid service_interest", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, serviceInterest: "diagnosis" });
    expect(result.success).toBe(false);
  });

  it("rejects an oversized full name", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, fullName: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, honeypot: "I am a bot" });
    expect(result.success).toBe(false);
  });
});
