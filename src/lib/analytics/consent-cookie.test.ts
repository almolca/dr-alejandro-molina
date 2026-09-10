import { describe, expect, it } from "vitest";
import { buildConsentCookieString, CONSENT_COOKIE_NAME } from "./consent-cookie";

describe("buildConsentCookieString", () => {
  it("encodes a granted choice with the expected attributes", () => {
    const cookie = buildConsentCookieString("granted");
    expect(cookie).toContain(`${CONSENT_COOKIE_NAME}=granted`);
    expect(cookie).toContain("path=/");
    expect(cookie).toContain("max-age=15552000"); // 180 days
    expect(cookie).toContain("SameSite=Lax");
  });

  it("encodes a denied choice", () => {
    expect(buildConsentCookieString("denied")).toContain(`${CONSENT_COOKIE_NAME}=denied`);
  });

  it("omits Secure by default (would silently fail to set over local http:// dev if forced on)", () => {
    expect(buildConsentCookieString("granted")).not.toMatch(/;\s*Secure/i);
    expect(buildConsentCookieString("granted", {})).not.toMatch(/;\s*Secure/i);
    expect(buildConsentCookieString("granted", { secure: false })).not.toMatch(/;\s*Secure/i);
  });

  it("adds Secure when explicitly requested (R8.1D — production/HTTPS)", () => {
    const cookie = buildConsentCookieString("granted", { secure: true });
    expect(cookie).toMatch(/;\s*Secure/i);
    expect(cookie).toContain(`${CONSENT_COOKIE_NAME}=granted`);
  });
});
