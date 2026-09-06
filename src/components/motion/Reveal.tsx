"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { defaultViewport, fadeUpVariants, revealTransition } from "./motion-config";

/**
 * Soft reveal-on-scroll primitive (spec §17). Wrap any section/element
 * that should fade + lift gently into view once, not on every scroll
 * pass.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeUpVariants}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </MotionTag>
  );
}
