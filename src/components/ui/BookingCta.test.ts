import { describe, expect, it } from "vitest";
import { resolveBookHref } from "./BookingCta";

describe("resolveBookHref", () => {
  it("routes to /book from an English page", () => {
    expect(resolveBookHref("/erectile-dysfunction")).toBe("/book");
  });

  it("routes to /ar/book from an Arabic page — the fix for the site-wide CTA", () => {
    expect(resolveBookHref("/ar/erectile-dysfunction")).toBe("/ar/book");
  });

  it("routes to /ar/book from the bare Arabic homepage", () => {
    expect(resolveBookHref("/ar")).toBe("/ar/book");
  });

  it("appends the service query param onto the locale-correct path", () => {
    expect(resolveBookHref("/ar/male-aesthetics/scrotal-lift", "scrotal_lift")).toBe(
      "/ar/book?service=scrotal_lift",
    );
    expect(resolveBookHref("/male-aesthetics/scrotal-lift", "scrotal_lift")).toBe("/book?service=scrotal_lift");
  });

  it("URI-encodes the service value", () => {
    expect(resolveBookHref("/erectile-dysfunction", "a b")).toBe("/book?service=a%20b");
  });
});
