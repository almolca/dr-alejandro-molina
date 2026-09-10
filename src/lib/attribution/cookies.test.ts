import { describe, expect, it } from "vitest";
import { parseAttributionCookie, serializeTouch, type AttributionTouch } from "./cookies";

describe("attribution cookies", () => {
  it("round-trips a touch through serialize/parse", () => {
    const touch: AttributionTouch = { source: "google_business", page: "/book", at: "2026-09-10T00:00:00.000Z" };
    const parsed = parseAttributionCookie(serializeTouch(touch));
    expect(parsed).toEqual(touch);
  });

  it("returns null for undefined input", () => {
    expect(parseAttributionCookie(undefined)).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseAttributionCookie("%7Bnot-json")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    expect(parseAttributionCookie(encodeURIComponent(JSON.stringify({ source: "direct" })))).toBeNull();
  });
});
