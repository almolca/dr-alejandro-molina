"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { easeSoft } from "./motion-config";

/**
 * Counts a number from `from` to `to` once, when it first scrolls into
 * view — spec R7.1.2 §2. Direction (up or down) follows from `from`/`to`
 * alone; e.g. `from={2026} to={2018}` counts down.
 *
 * SSR/first-paint and reduced-motion both render `to` directly (the
 * `useState(to)` initializer runs identically on server and client, so
 * there is no hydration mismatch and no flash of the wrong value) —
 * the count-up only plays once the element is in view AND the user has
 * no reduced-motion preference. A `sr-only` span carries `finalText` so
 * screen readers hear only the one final value, never intermediate
 * counted values; the visible animated span is `aria-hidden`.
 */
export function AnimatedNumber({
  from,
  to,
  prefix = "",
  suffix = "",
  finalText,
  durationSeconds = 1.2,
}: {
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  finalText: string;
  durationSeconds?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(to);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const controls = animate(from, to, {
      duration: durationSeconds,
      ease: easeSoft,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, shouldReduceMotion, from, to, durationSeconds]);

  return (
    <>
      <span ref={ref} aria-hidden="true" style={{ fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="sr-only">{finalText}</span>
    </>
  );
}
