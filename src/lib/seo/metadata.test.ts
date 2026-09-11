import { describe, expect, it } from "vitest";
import { buildMetadata } from "./metadata";
import { siteUrl } from "@/config/site";

describe("buildMetadata", () => {
  it("R8.2.1: falls back to the site-wide branded /opengraph-image for openGraph.images", () => {
    const metadata = buildMetadata({
      title: "Erectile Dysfunction",
      description: "Specialist assessment and treatment.",
      path: "/erectile-dysfunction",
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: expect.any(String),
      },
    ]);
  });

  it("R8.2.1: falls back to the same image for twitter.images (summary_large_image needs one)", () => {
    const metadata = buildMetadata({
      title: "Peyronie's Disease",
      description: "Specialist assessment and treatment.",
      path: "/peyronies-disease",
    });

    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [{ url: `${siteUrl}/opengraph-image` }],
    });
  });

  it("builds an absolute URL off the resolved site URL, never a bare relative path or vercel.app", () => {
    const metadata = buildMetadata({
      title: "About",
      description: "About the practice.",
      path: "/about",
    });

    const imageUrl = (metadata.openGraph?.images as Array<{ url: string }>)[0].url;
    expect(imageUrl).toBe(`${siteUrl}/opengraph-image`);
    expect(imageUrl).toContain("://");
    expect(imageUrl).not.toContain("vercel.app");
  });

  it("R9: emits reciprocal hreflang alternates when an Arabic equivalent exists", () => {
    const metadata = buildMetadata({
      title: "Dr. Alejandro Molina",
      description: "Specialist care.",
      path: "/",
    });

    expect(metadata.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/`,
      "ar-AE": `${siteUrl}/ar`,
      "x-default": `${siteUrl}/`,
    });
  });

  it("R9: emits the same reciprocal alternates and ar_AE og:locale from the Arabic side", () => {
    const metadata = buildMetadata({
      title: "د. أليخاندرو مولينا",
      description: "رعاية متخصصة.",
      path: "/ar",
    });

    expect(metadata.alternates?.languages).toEqual({
      "en-AE": `${siteUrl}/`,
      "ar-AE": `${siteUrl}/ar`,
      "x-default": `${siteUrl}/`,
    });
    expect(metadata.openGraph?.locale).toBe("ar_AE");
  });

  it("R9: emits no hreflang alternates when no Arabic equivalent exists yet", () => {
    const metadata = buildMetadata({
      title: "Men's Health",
      description: "Specialist care.",
      path: "/mens-health",
    });

    expect(metadata.alternates?.languages).toBeUndefined();
  });
});
