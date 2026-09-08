import type { SVGProps } from "react";

/**
 * Shared visual language for every illustration in this directory: thin
 * inherited stroke, no fill, rounded joins. Presentation attributes set on
 * `<svg>` cascade to children via normal SVG/CSS inheritance, so individual
 * paths only need to override `stroke`/`opacity` where they intentionally
 * diverge (e.g. the one restrained accent element per illustration).
 */
export const STROKE_WIDTH = 1.25;

export const illustrationBaseProps: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export type IllustrationProps = {
  /** Sizing and color: e.g. "h-40 w-40 text-muted-foreground". Color defaults to inherited text color. */
  className?: string;
  /**
   * Only set this when the illustration conveys information not already
   * present in adjacent text — it switches the SVG from decorative
   * (`aria-hidden`) to an accessible image with `role="img"` and a
   * `<title>`. Every current use in this codebase pairs the illustration
   * with an explanatory heading/paragraph, so the default is decorative.
   */
  title?: string;
};

/** Spreads either `aria-hidden` (decorative, the default) or `role="img"` + accessible name. */
export function accessibilityProps(title?: string) {
  return title
    ? ({ role: "img" as const, "aria-label": title })
    : ({ "aria-hidden": true as const });
}
