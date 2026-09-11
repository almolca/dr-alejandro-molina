import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./events";

/**
 * This project's vitest environment is "node" (see vitest.config.ts), so
 * `window`/`fetch` don't exist by default — stub minimal fakes rather than
 * pulling in jsdom, following the pattern established in `consent.test.ts`.
 *
 * `./consent` and `./session` are mocked directly so these tests can force
 * consent "granted" without touching real localStorage/cookie plumbing,
 * and so `anonymousSessionId` is deterministic.
 */
vi.mock("./consent", () => ({
  hasAnalyticsConsent: () => true,
}));

vi.mock("./session", () => ({
  getAnonymousSessionId: () => "test-session-id",
}));

describe("trackEvent", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  function stubWindow(pathname: string) {
    vi.stubGlobal("window", { location: { pathname } });
  }

  beforeEach(() => {
    fetchMock = vi.fn().mockReturnValue({ catch: () => {} });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function lastRequestBody(): Record<string, unknown> {
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    return JSON.parse(init.body as string);
  }

  it("R9: reports locale 'ar' when the current pathname is under /ar, regardless of the event's own path/source_page property", () => {
    stubWindow("/ar");

    trackEvent({
      name: "book_cta_click",
      properties: { source_page: "global-header", cta_position: "header" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(lastRequestBody()).toMatchObject({ locale: "ar", path: "global-header" });
  });

  it("R9: reports locale 'ar' for a nested /ar/* pathname", () => {
    stubWindow("/ar/mobile-nav-page");

    trackEvent({
      name: "book_cta_click",
      properties: { source_page: "mobile-nav", cta_position: "mobile-drawer" },
    });

    expect(lastRequestBody()).toMatchObject({ locale: "ar" });
  });

  it("reports locale 'en' for a non-Arabic pathname", () => {
    stubWindow("/some-english-page");

    trackEvent({
      name: "book_cta_click",
      properties: { source_page: "global-header", cta_position: "header" },
    });

    expect(lastRequestBody()).toMatchObject({ locale: "en" });
  });

  it("still uses the event's own path property (a real URL) as the POST body's path for path-based events", () => {
    stubWindow("/erectile-dysfunction");

    trackEvent({
      name: "page_view",
      properties: { path: "/erectile-dysfunction" },
    });

    expect(lastRequestBody()).toMatchObject({ locale: "en", path: "/erectile-dysfunction" });
  });
});
