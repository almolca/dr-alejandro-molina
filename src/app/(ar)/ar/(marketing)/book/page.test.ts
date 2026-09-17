import { describe, expect, it } from "vitest";
import { findAll } from "@/lib/test-utils/react-element";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import BookPageAr from "./page";

describe("BookPageAr", () => {
  it("renders no form and no name/email/discussion-topic/privacy-consent inputs", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    expect(findAll(tree, (el) => el.type === "form")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "input")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "select")).toHaveLength(0);
  });

  it("renders the localized H1 'احجز موعداً'", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const h1s = findAll(tree, (el) => el.type === "h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].props.children).toBe("احجز موعداً");
  });

  it("renders exactly one NmcBookingButton with the localized CTA label, sourced from /ar/book", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const ctas = findAll(tree, (el) => el.type === NmcBookingButton);
    expect(ctas).toHaveLength(1);
    expect(ctas[0].props.label).toBe("المتابعة إلى حجز الموعد عبر NMC");
    expect(ctas[0].props.sourcePage).toBe("/ar/book");
  });

  it("passes path=\"/ar/book\" to BookPageViewTracker", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers).toHaveLength(1);
    expect(trackers[0].props.path).toBe("/ar/book");
  });

  it("renders the practice-location facility name via AR_IDENTITY, with booking CTA/tracker props unchanged (Batch 4)", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const paragraphs = findAll(tree, (el) => el.type === "p");
    const facilityParagraph = paragraphs.find(
      (p) => typeof p.props.children === "string" && p.props.children.includes("إن إم سي رويال"),
    );
    expect(facilityParagraph).toBeDefined();

    const ctas = findAll(tree, (el) => el.type === NmcBookingButton);
    expect(ctas).toHaveLength(1);
    expect(ctas[0].props.label).toBe("المتابعة إلى حجز الموعد عبر NMC");
    expect(ctas[0].props.sourcePage).toBe("/ar/book");

    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers).toHaveLength(1);
    expect(trackers[0].props.path).toBe("/ar/book");
  });
});
