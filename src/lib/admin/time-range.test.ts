import { describe, expect, it } from "vitest";
import { resolveTimeRange } from "./time-range";

describe("resolveTimeRange", () => {
  it("defaults to the last 30 days", () => {
    const { start, end, rangeParam } = resolveTimeRange({});
    expect(rangeParam).toBe("30d");
    const days = (end.getTime() - start.getTime()) / 86_400_000;
    expect(days).toBeCloseTo(30, 0);
  });

  it("resolves 7d", () => {
    const { rangeParam } = resolveTimeRange({ range: "7d" });
    expect(rangeParam).toBe("7d");
  });

  it("resolves 90d", () => {
    const { rangeParam } = resolveTimeRange({ range: "90d" });
    expect(rangeParam).toBe("90d");
  });

  it("resolves a valid custom range", () => {
    const result = resolveTimeRange({ from: "2026-01-01", to: "2026-01-15" });
    expect(result.rangeParam).toBe("custom");
  });

  it("falls back to 30d when the custom range is invalid (from after to)", () => {
    const result = resolveTimeRange({ from: "2026-01-15", to: "2026-01-01" });
    expect(result.rangeParam).toBe("30d");
  });
});
