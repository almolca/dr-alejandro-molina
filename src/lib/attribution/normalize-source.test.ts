import { describe, expect, it } from "vitest";
import { normalizeSource } from "./normalize-source";

const siteHost = "dralejandromolinaurologist.com";

describe("normalizeSource", () => {
  it("maps utm_source=google_business directly", () => {
    expect(normalizeSource({ utmSource: "google_business", siteHost })).toBe("google_business");
  });

  it("maps utm_source=google with a gbp campaign to google_business", () => {
    expect(
      normalizeSource({ utmSource: "google", utmCampaign: "gbp_booking", siteHost }),
    ).toBe("google_business");
  });

  it("maps utm_source=google without a gbp campaign to google_organic", () => {
    expect(normalizeSource({ utmSource: "google", utmCampaign: "spring_promo", siteHost })).toBe(
      "google_organic",
    );
  });

  it("maps utm_source=mens_health", () => {
    expect(normalizeSource({ utmSource: "mens_health", siteHost })).toBe("mens_health");
  });

  it("maps an unknown utm_source to other", () => {
    expect(normalizeSource({ utmSource: "some_unknown_partner", siteHost })).toBe("other");
  });

  it("maps no utm and no referer to direct", () => {
    expect(normalizeSource({ siteHost })).toBe("direct");
  });

  it("maps no utm with a same-origin referer to direct", () => {
    expect(normalizeSource({ refererHost: siteHost, siteHost })).toBe("direct");
  });

  it("maps a google.com referer with no utm to google_organic", () => {
    expect(normalizeSource({ refererHost: "www.google.com", siteHost })).toBe("google_organic");
  });

  it("maps an instagram.com referer to instagram", () => {
    expect(normalizeSource({ refererHost: "l.instagram.com", siteHost })).toBe("instagram");
  });

  it("maps an unrelated external referer to referral", () => {
    expect(normalizeSource({ refererHost: "some-blog.example", siteHost })).toBe("referral");
  });
});
