"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide motion config — spec §17 "respect prefers-reduced-motion".
 *
 * `reducedMotion="user"` makes every transform-based animation in the
 * app resolve instantly for users with the OS-level reduced-motion
 * preference, without each component having to check it individually.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
