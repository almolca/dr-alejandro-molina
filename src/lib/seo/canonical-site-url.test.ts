import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./canonical-site-url";

const productionSiteUrl = "https://dralejandromolinaurologist.com";

describe("resolveSiteUrl", () => {
  it("R8 §4/§5: any Vercel deployment (Preview included) emits the production canonical URL", () => {
    expect(
      resolveSiteUrl({ isVercelDeployment: true, productionSiteUrl, devSiteUrl: undefined }),
    ).toBe(productionSiteUrl);
  });

  it("a Vercel deployment ignores a locally-configured dev site URl override", () => {
    expect(
      resolveSiteUrl({
        isVercelDeployment: true,
        productionSiteUrl,
        devSiteUrl: "https://dr-alejandro-molina-git-pha.vercel.app",
      }),
    ).toBe(productionSiteUrl);
  });

  it("local dev uses the configured dev site URL when set", () => {
    expect(
      resolveSiteUrl({
        isVercelDeployment: false,
        productionSiteUrl,
        devSiteUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000");
  });

  it("local dev falls back to localhost when no dev site URL is configured", () => {
    expect(
      resolveSiteUrl({ isVercelDeployment: false, productionSiteUrl, devSiteUrl: undefined }),
    ).toBe("http://localhost:3000");
  });
});
