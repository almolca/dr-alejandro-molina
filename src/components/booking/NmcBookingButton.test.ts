import { describe, expect, it, vi, beforeEach } from "vitest";
import { practice } from "@/config/practice";
import { findAll } from "@/lib/test-utils/react-element";

vi.mock("@/lib/analytics/events", () => ({ trackEvent: vi.fn() }));

import { trackEvent } from "@/lib/analytics/events";
import { NmcBookingButton } from "./NmcBookingButton";

describe("NmcBookingButton", () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it("renders a real anchor pointing at the official NMC booking URL — navigation must work with zero JS", () => {
    const tree = NmcBookingButton({ sourcePage: "/book", label: "Continue to NMC Booking" });
    const anchors = findAll(tree, (el) => el.type === "a");
    expect(anchors).toHaveLength(1);
    expect(anchors[0].props.href).toBe(practice.bookingUrl);
    expect(anchors[0].props.children).toBe("Continue to NMC Booking");
  });

  it("never calls preventDefault in its click handler — booking must never depend on consent or JS succeeding", () => {
    const tree = NmcBookingButton({ sourcePage: "/book", label: "Continue to NMC Booking" });
    const anchor = findAll(tree, (el) => el.type === "a")[0];
    const event = { preventDefault: vi.fn() };
    anchor.props.onClick(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("fires nmc_booking_click with the given source_page on click", () => {
    const tree = NmcBookingButton({ sourcePage: "/ar/book", label: "المتابعة إلى حجز الموعد عبر NMC" });
    const anchor = findAll(tree, (el) => el.type === "a")[0];
    anchor.props.onClick({ preventDefault: vi.fn() });
    expect(trackEvent).toHaveBeenCalledWith({
      name: "nmc_booking_click",
      properties: { source_page: "/ar/book", cta_position: "book-page-primary" },
    });
  });
});
