import { describe, expect, it } from "vitest";
import { practice } from "@/config/practice";
import { findAll } from "@/lib/test-utils/react-element";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import BookPage from "./page";

describe("BookPage (English)", () => {
  it("renders no form and no name/email/discussion-topic/privacy-consent inputs", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    expect(findAll(tree, (el) => el.type === "form")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "input")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "select")).toHaveLength(0);
  });

  it("renders the H1 'Book a Consultation'", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const h1s = findAll(tree, (el) => el.type === "h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].props.children).toBe("Book a Consultation");
  });

  it("renders exactly one NmcBookingButton wired to the official NMC handoff from /book", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const ctas = findAll(tree, (el) => el.type === NmcBookingButton);
    expect(ctas).toHaveLength(1);
    expect(ctas[0].props.label).toBe("Continue to NMC Booking");
    expect(ctas[0].props.sourcePage).toBe("/book");
  });

  it("passes path=\"/book\" to BookPageViewTracker so book_page_view still fires with the right path", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers).toHaveLength(1);
    expect(trackers[0].props.path).toBe("/book");
  });

  it("carries service context from ?service= through to both the tracker and (for now) does not add a form for it", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({ service: "penile_girth" }) });
    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers[0].props.service).toBe("penile_girth");
  });

  it("still links to the NMC physician profile as a secondary, non-form action", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const profileLinks = findAll(tree, (el) => el.type === "a" && el.props.href === practice.physicianProfileUrl);
    expect(profileLinks).toHaveLength(1);
  });
});
