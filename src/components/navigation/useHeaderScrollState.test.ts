import { describe, expect, it } from "vitest";
import { nextCompact } from "./useHeaderScrollState";

/**
 * Hysteresis, not a single cutoff: without a dead zone, scroll jitter
 * right at the boundary (e.g. inertial scrolling settling at 61px,
 * 59px, 61px...) would flip `compact` on every scroll event, visibly
 * flickering the header between sizes.
 */
describe("nextCompact", () => {
  it("stays expanded below the enter threshold", () => {
    expect(nextCompact(0, false)).toBe(false);
    expect(nextCompact(79, false)).toBe(false);
  });

  it("enters compact at the enter threshold (80px)", () => {
    expect(nextCompact(80, false)).toBe(true);
    expect(nextCompact(200, false)).toBe(true);
  });

  it("stays compact while scrolled well past the enter threshold", () => {
    expect(nextCompact(100, true)).toBe(true);
  });

  it("exits compact at the exit threshold (40px)", () => {
    expect(nextCompact(40, true)).toBe(false);
    expect(nextCompact(0, true)).toBe(false);
  });

  it("holds the previous state inside the 40-80px dead zone", () => {
    expect(nextCompact(60, true)).toBe(true);
    expect(nextCompact(60, false)).toBe(false);
    expect(nextCompact(41, true)).toBe(true);
    expect(nextCompact(79, false)).toBe(false);
  });

  it("supports custom thresholds", () => {
    expect(nextCompact(50, false, 50, 20)).toBe(true);
    expect(nextCompact(20, true, 50, 20)).toBe(false);
    expect(nextCompact(30, true, 50, 20)).toBe(true);
  });
});
