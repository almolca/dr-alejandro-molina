import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getConsent, hasAnalyticsConsent, resyncConsentCookie, setConsent } from "./consent";

/**
 * This project's vitest environment is "node" (see vitest.config.ts),
 * so `window`/`document`/`localStorage` don't exist by default —
 * `consent.ts` guards every access for exactly that reason. These
 * tests stub minimal fakes rather than pulling in jsdom, since that's
 * all `consent.ts` actually touches.
 */
function makeFakeLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } as Storage;
}

describe("consent", () => {
  let cookieValue = "";

  function stubWindow(protocol: "http:" | "https:") {
    vi.stubGlobal("window", {
      localStorage: makeFakeLocalStorage(),
      location: { protocol },
    });
  }

  beforeEach(() => {
    cookieValue = "";
    stubWindow("https:"); // production-like default; individual tests override for http://
    vi.stubGlobal("document", {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        // Real document.cookie appends/updates one cookie per assignment;
        // for these tests only the consent cookie is ever written, so a
        // straight overwrite is an accurate enough fake.
        cookieValue = v;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defaults to unset with nothing stored", () => {
    expect(getConsent()).toBe("unset");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("accept: persists granted in localStorage and mirrors it into a cookie", () => {
    setConsent("granted");
    expect(getConsent()).toBe("granted");
    expect(hasAnalyticsConsent()).toBe(true);
    expect(cookieValue).toContain("cookie_consent=granted");
  });

  it("reject: persists denied and does not report analytics consent", () => {
    setConsent("denied");
    expect(getConsent()).toBe("denied");
    expect(hasAnalyticsConsent()).toBe(false);
    expect(cookieValue).toContain("cookie_consent=denied");
  });

  it("persistence: a later getConsent() call (simulating reload) sees the same choice", () => {
    setConsent("granted");
    // Nothing re-initializes storage between these calls, matching how
    // localStorage genuinely persists across a real page reload.
    expect(getConsent()).toBe("granted");
    expect(getConsent()).toBe("granted");
  });

  it("changing choice (reopen/change settings path) overwrites both the stored value and the mirrored cookie", () => {
    setConsent("granted");
    setConsent("denied");
    expect(getConsent()).toBe("denied");
    expect(cookieValue).toContain("cookie_consent=denied");
    expect(cookieValue).not.toContain("cookie_consent=granted");
  });

  it("resyncConsentCookie: backfills the mirror cookie for a choice made before the mirror existed (localStorage set directly, cookie never written)", () => {
    // Simulates a visitor who accepted before this fix shipped: granted
    // in localStorage, but setConsent() (and so the cookie write) never ran.
    window.localStorage.setItem("consent:analytics:v1", "granted");
    expect(cookieValue).toBe(""); // mirror not yet written
    resyncConsentCookie();
    expect(cookieValue).toContain("cookie_consent=granted");
  });

  it("resyncConsentCookie: does nothing when no choice has been made yet", () => {
    resyncConsentCookie();
    expect(cookieValue).toBe("");
  });

  it("R8.1D: marks the mirror cookie Secure over https:// (production)", () => {
    stubWindow("https:");
    setConsent("granted");
    expect(cookieValue).toMatch(/;\s*Secure/i);
  });

  it("R8.1D: omits Secure over http:// (local dev) — a Secure cookie would otherwise silently never be set", () => {
    stubWindow("http:");
    setConsent("granted");
    expect(cookieValue).not.toMatch(/;\s*Secure/i);
    expect(cookieValue).toContain("cookie_consent=granted");
  });

  it("R8.1D: resyncConsentCookie also respects the current protocol", () => {
    stubWindow("http:");
    window.localStorage.setItem("consent:analytics:v1", "denied");
    resyncConsentCookie();
    expect(cookieValue).toContain("cookie_consent=denied");
    expect(cookieValue).not.toMatch(/;\s*Secure/i);
  });
});
