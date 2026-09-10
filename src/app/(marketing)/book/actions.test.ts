import { describe, expect, it, vi, beforeEach } from "vitest";

const insertSingleMock = vi.fn();
const selectMock = vi.fn(() => ({ single: insertSingleMock }));
const insertMock = vi.fn(() => ({ select: selectMock }));
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

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
  }),
  headers: async () => ({
    get: () => null,
  }),
}));

const { createLead, markSentToNmc } = await import("./actions");

function validFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  fd.set("fullName", "Jane Doe");
  fd.set("email", "jane@example.com");
  fd.set("phone", "+971501234567");
  fd.set("serviceInterest", "erectile_dysfunction");
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
});

describe("createLead", () => {
  it("succeeds with a valid payload", async () => {
    const result = await createLead(validFormData());
    expect(result).toEqual({ ok: true, leadId: "lead-1" });
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("rejects when privacy consent is missing", async () => {
    const fd = validFormData();
    fd.delete("privacyConsent");
    const result = await createLead(fd);
    expect(result.ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
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
});

describe("markSentToNmc", () => {
  it("resolves ok on a successful update", async () => {
    const result = await markSentToNmc("lead-1");
    expect(result).toEqual({ ok: true });
  });

  it("resolves { ok: false } (never throws) when the DB update fails", async () => {
    eqMock.mockResolvedValueOnce({ error: { message: "db down" } });
    await expect(markSentToNmc("lead-1")).resolves.toEqual({ ok: false });
  });

  it("resolves { ok: false } (never throws) when the client throws synchronously", async () => {
    updateMock.mockImplementationOnce(() => {
      throw new Error("boom");
    });
    await expect(markSentToNmc("lead-1")).resolves.toEqual({ ok: false });
  });
});
