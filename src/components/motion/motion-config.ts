/**
 * Shared motion tokens — spec §17.
 *
 * "Very subtle. No excessive parallax. No flashy effects." Durations and
 * distances here are deliberately small; components should not need to
 * override them per-instance.
 */

/** Mirrors `--ease-soft` in tokens.css, expressed as a cubic-bezier tuple for motion/react. */
export const easeSoft = [0.22, 1, 0.36, 1] as const;

export const durations = {
  fast: 0.15,
  base: 0.5,
  slow: 0.9,
} as const;

/** Small, restrained travel distance for reveal-on-scroll effects. */
export const revealDistance = 20;

export const fadeUpVariants = {
  hidden: { opacity: 0, y: revealDistance },
  visible: { opacity: 1, y: 0 },
};

/** Default transition for reveal-on-scroll effects; spread and override `delay` as needed. */
export const revealTransition = { duration: durations.base, ease: easeSoft };

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/** Default viewport config: animate once, slightly before fully in view. */
export const defaultViewport = { once: true, margin: "-10% 0px" } as const;
