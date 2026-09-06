"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { defaultViewport, durations, easeSoft } from "./motion-config";

/**
 * Masked image reveal (spec §17): a solid panel wipes away to reveal the
 * content beneath, rather than a plain opacity fade. Intended for hero
 * and editorial photography.
 */
export function MaskedReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {children}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-surface"
        style={{ transformOrigin: "right" }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={defaultViewport}
        transition={{ duration: durations.slow, ease: easeSoft }}
      />
    </div>
  );
}
