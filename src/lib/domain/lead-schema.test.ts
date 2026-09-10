import { describe, expect, it } from "vitest";
import { leadFormSchema } from "./lead-schema";

const validPayload = {
  fullName: "  Jane Doe  ",
  email: "Jane.Doe@Example.com",
  privacyConsent: true as const,
  honeypot: "",
  renderedAt: Date.now() - 5000,
};

describe("leadFormSchema", () => {
  it("accepts a valid payload with no discussion topic (it's optional)", () => {
    const result = leadFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts a valid payload with a discussion topic", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, discussionTopic: "fertility" });
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

  it("rejects missing full name", () => {
    const rest: Record<string, unknown> = { ...validPayload };
    delete rest.fullName;
    const result = leadFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing privacy consent", () => {
    const rest: Record<string, unknown> = { ...validPayload };
    delete rest.privacyConsent;
    const result = leadFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects privacy consent set to false", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, privacyConsent: false });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid discussion topic", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, discussionTopic: "erectile_dysfunction" });
    expect(result.success).toBe(false);
  });

  it("rejects the prefer-not-to-say sentinel as a stored discussion topic (client must omit it instead)", () => {
    const result = leadFormSchema.safeParse({ ...validPayload, discussionTopic: "prefer_not_to_say" });
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

  it("does not require a phone number", () => {
    expect("phone" in validPayload).toBe(false);
    const result = leadFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });
});
