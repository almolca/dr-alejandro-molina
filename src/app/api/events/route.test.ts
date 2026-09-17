import { NextRequest } from "next/server";
import { describe, expect, it, vi, beforeEach } from "vitest";

const insertMock = vi.fn().mockResolvedValue({ error: null });
const fromMock = vi.fn(() => ({ insert: insertMock }));
vi.mock("@/lib/supabase/service-client", () => ({
  getServiceSupabase: () => ({ from: fromMock }),
}));

import { POST } from "./route";

function makeRequest(body: unknown, cookies: Record<string, string> = {}): NextRequest {
  return {
    json: async () => body,
    cookies: {
      get: (name: string) => (name in cookies ? { name, value: cookies[name] } : undefined),
    },
  } as unknown as NextRequest;
}

const validBody = {
  name: "nmc_booking_click",
  anonymousSessionId: "sess-1",
  path: "/book",
  locale: "en",
};

describe("POST /api/events", () => {
  it("returns 200 for a valid event", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({
          name: "page_view",
          anonymousSessionId: "abc-123",
          path: "/",
          locale: "en",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ locale: "en" }));
  });

  it("R9: returns 200 for a payload missing locale and inserts locale: null (pre-deploy in-flight beacon must not be dropped)", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({
          name: "page_view",
          anonymousSessionId: "abc-123",
          path: "/",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ locale: null }));
  });

  it("returns 400 for malformed JSON", async () => {
    const req = new NextRequest("http://localhost/api/events", {
      method: "POST",
      body: "{not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for an event name outside the allow-list", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/events", {
        method: "POST",
        body: JSON.stringify({ name: "custom_event", anonymousSessionId: "abc-123", path: "/", locale: "en" }),
      }),
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/events — attribution enrichment", () => {
  beforeEach(() => {
    insertMock.mockClear();
    fromMock.mockClear();
  });

  it("inserts with source/origin_page null when no attribution cookies are present", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: null, origin_page: null }));
  });

  it("backfills source from the httpOnly attr_last cookie for an event with no client-supplied source (e.g. nmc_booking_click)", async () => {
    const attrLast = JSON.stringify({ source: "google_business", page: "/erectile-dysfunction", at: "2026-01-01T00:00:00.000Z" });
    const res = await POST(makeRequest(validBody, { attr_last: attrLast }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: "google_business" }));
  });

  it("prefers a client-supplied source over the attr_last cookie fallback", async () => {
    const attrLast = JSON.stringify({ source: "google_business", page: "/x", at: "2026-01-01T00:00:00.000Z" });
    const res = await POST(makeRequest({ ...validBody, source: "direct" }, { attr_last: attrLast }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: "direct" }));
  });

  it("backfills origin_page from the httpOnly book_origin cookie", async () => {
    const res = await POST(makeRequest(validBody, { book_origin: "/erectile-dysfunction" }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ origin_page: "/erectile-dysfunction" }));
  });

  it("ignores a malformed attr_last cookie rather than failing the request", async () => {
    const res = await POST(makeRequest(validBody, { attr_last: "not-json" }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: null }));
  });

  it("still returns ok:true with no consent check anywhere in this route — booking analytics never gates on consent server-side", async () => {
    const res = await POST(makeRequest(validBody));
    await expect(res.json()).resolves.toEqual({ ok: true });
  });
});
