"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  cardHoverLift,
  defaultViewport,
  fadeUpVariants,
  hasCardHoverClass,
  revealTransition,
  staggerContainerVariants,
} from "./motion-config";

/**
 * Staggered reveal group (spec §17 "staggered expertise cards"). Wrap a
 * grid/list in `StaggerGroup` and each direct visual item in
 * `StaggerItem`.
 */
export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainerVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const isCardHover = hasCardHoverClass(className);

  return (
    <motion.div
      className={className}
      style={isCardHover ? { transitionProperty: "box-shadow, border-color" } : undefined}
      variants={fadeUpVariants}
      transition={revealTransition}
      whileHover={isCardHover ? cardHoverLift : undefined}
      whileFocus={isCardHover ? cardHoverLift : undefined}
    >
      {children}
    </motion.div>
  );
}
