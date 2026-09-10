import { describe, expect, it, vi, beforeEach } from "vitest";

const insertSingleMock = vi.fn();
const selectMock = vi.fn(() => ({ single: insertSingleMock }));
const insertMock = vi.fn((payload: Record<string, unknown>) => {
  void payload;
  return { select: selectMock };
});
const eqMock = vi.fn();
const updateMock = vi.fn();

vi.mock("@/lib/supabase/service-client", () => ({
  getServiceSupabase: () => ({
    from: () => ({
      insert: insertMock,
      update: updateMock,
    }),
  }),
}));

let cookieValues: Record<string, string> = {};
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (name in cookieValues ? { value: cookieValues[name] } : undefined),
  }),
  headers: async () => ({
    get: () => null,
  }),
}));

const { createLead } = await import("./actions");

function validFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  fd.set("fullName", "Jane Doe");
  fd.set("email", "jane@example.com");
  fd.set("privacyConsent", "on");
  fd.set("company", "");
  fd.set("renderedAt", String(Date.now() - 5000));
  for (const [k, v] of Object.entries(overrides)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  insertSingleMock.mockReset().mockResolvedValue({ data: { id: "lead-1" }, error: null });
  insertMock.mockClear();
  updateMock.mockReset().mockReturnValue({ eq: () => ({ eq: eqMock }) });
  eqMock.mockReset().mockResolvedValue({ error: null });
  cookieValues = {};
});

describe("createLead", () => {
  it("succeeds with only name, email and privacy consent (no phone, no topic)", async () => {
    const result = await createLead(validFormData());
    expect(result).toEqual({ ok: true, leadId: "lead-1" });
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("does not include phone/preferredContactMethod/marketingConsent form fields", () => {
    const fd = validFormData();
    expect(fd.has("phone")).toBe(false);
    expect(fd.has("preferredContactMethod")).toBe(false);
    expect(fd.has("marketingConsent")).toBe(false);
  });

  it("rejects when privacy consent is missing", async () => {
    const fd = validFormData();
    fd.delete("privacyConsent");
    const result = await createLead(fd);
    expect(result.ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("succeeds with a valid discussion topic", async () => {
    const result = await createLead(validFormData({ discussionTopic: "fertility" }));
    expect(result.ok).toBe(true);
    expect(insertMock.mock.calls[0][0]).toMatchObject({ service_interest: "fertility" });
  });

  it("stores a null service_interest when no discussion topic is given", async () => {
    await createLead(validFormData());
    expect(insertMock.mock.calls[0][0]).toMatchObject({ service_interest: null });
  });

  it("R7.2.2: still succeeds with a null topic if the prefer-not-to-say sentinel somehow reaches the server directly (defense in depth — never reject a valid decline)", async () => {
    const result = await createLead(validFormData({ discussionTopic: "prefer_not_to_say" }));
    expect(result.ok).toBe(true);
    expect(insertMock.mock.calls[0][0]).toMatchObject({ service_interest: null });
  });

  it("R7.2.2: still succeeds with a null topic for a garbage discussionTopic value (never a diagnosis, never a rejection)", async () => {
    const result = await createLead(validFormData({ discussionTopic: "not-a-real-topic" }));
    expect(result.ok).toBe(true);
    expect(insertMock.mock.calls[0][0]).toMatchObject({ service_interest: null });
  });

  it("rejects an invalid email without calling the DB", async () => {
    const result = await createLead(validFormData({ email: "not-an-email" }));
    expect(result.ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects a filled honeypot without calling the DB", async () => {
    const result = await createLead(validFormData({ company: "I am a bot" }));
    expect(result.ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects a submission rendered less than 2s ago (double-submit guard)", async () => {
    const result = await createLead(validFormData({ renderedAt: String(Date.now()) }));
    expect(result.ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns a safe error when the DB insert fails, without throwing", async () => {
    insertSingleMock.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    const result = await createLead(validFormData());
    expect(result.ok).toBe(false);
  });

  it("immediately attempts to mark the lead sent_to_nmc within the same action", async () => {
    await createLead(validFormData());
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: "sent_to_nmc" }),
    );
  });

  it("still returns ok:true when the sent_to_nmc update fails (redirect must not be blocked)", async () => {
    eqMock.mockResolvedValueOnce({ error: { message: "db down" } });
    const result = await createLead(validFormData());
    expect(result).toEqual({ ok: true, leadId: "lead-1" });
  });

  it("still returns ok:true when the sent_to_nmc update throws synchronously", async () => {
    updateMock.mockImplementationOnce(() => {
      throw new Error("boom");
    });
    const result = await createLead(validFormData());
    expect(result).toEqual({ ok: true, leadId: "lead-1" });
  });

  it("captures origin_page from the book_origin cookie, not the request referer", async () => {
    cookieValues.book_origin = "/erectile-dysfunction";
    await createLead(validFormData());
    expect(insertMock.mock.calls[0][0]).toMatchObject({ origin_page: "/erectile-dysfunction" });
  });

  it("stores a null origin_page when no book_origin cookie is present", async () => {
    await createLead(validFormData());
    expect(insertMock.mock.calls[0][0]).toMatchObject({ origin_page: null });
  });

  it("never stores the referer-derived value as the diagnosis-bearing discussionTopic just because the visitor came from a treatment page", async () => {
    cookieValues.book_origin = "/erectile-dysfunction";
    await createLead(validFormData());
    // origin_page (attribution) and service_interest (patient-stated topic) must stay independent.
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      origin_page: "/erectile-dysfunction",
      service_interest: null,
    });
  });
});
