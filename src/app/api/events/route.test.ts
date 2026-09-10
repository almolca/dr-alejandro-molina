import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const insertMock = vi.fn().mockResolvedValue({ error: null });
vi.mock("@/lib/supabase/service-client", () => ({
  getServiceSupabase: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

const { POST } = await import("./route");

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/events", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/events", () => {
  it("returns 200 for a valid event", async () => {
    const res = await POST(
      makeRequest({
        name: "page_view",
        anonymousSessionId: "abc-123",
        path: "/",
      }),
    );
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalled();
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
      makeRequest({ name: "custom_event", anonymousSessionId: "abc-123", path: "/" }),
    );
    expect(res.status).toBe(400);
  });
});
