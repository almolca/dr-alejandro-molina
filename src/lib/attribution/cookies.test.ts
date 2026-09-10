import { describe, expect, it } from "vitest";
import {
  parseAttributionCookie,
  parseBookOrigin,
  serializeTouch,
  type AttributionTouch,
} from "./cookies";

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

describe("parseBookOrigin", () => {
  it("returns the page path unchanged", () => {
    expect(parseBookOrigin("/erectile-dysfunction")).toBe("/erectile-dysfunction");
  });

  it("returns null for undefined", () => {
    expect(parseBookOrigin(undefined)).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parseBookOrigin("")).toBeNull();
  });
});
