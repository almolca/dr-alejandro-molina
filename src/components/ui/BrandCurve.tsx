"use client";

import { motion } from "motion/react";
import { defaultViewport, durations, easeSoft } from "@/components/motion/motion-config";

/**
 * Decorative curve derived from the gold swoosh in the logo — Phase R3
 * correction. Draws itself in via stroke-dashoffset once, on scroll
 * into view (respects prefers-reduced-motion globally via the
 * sitewide MotionConfig, same as every other animated primitive).
 * Purely decorative — `aria-hidden`.
 */
export function BrandCurve({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 24"
      className={className ?? "h-4 w-40 text-accent-strong"}
      fill="none"
    >
      <motion.path
        d="M2 20 C 60 4, 140 4, 238 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={defaultViewport}
        transition={{ duration: durations.slow, ease: easeSoft }}
      />
    </svg>
  );
}
