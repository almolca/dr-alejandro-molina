"use client";

import { useEffect, useRef, useState } from "react";

const SCROLLED_THRESHOLD = 24;
const COMPACT_ENTER = 80;
const COMPACT_EXIT = 40;

export type HeaderScrollState = { scrolled: boolean; compact: boolean };

/**
 * Hysteresis, not a single cutoff: entering compact at `enter` and only
 * exiting at `exit` means scroll jitter in the dead zone between them
 * can never flip `compact` back and forth — it always holds whatever
 * it was already showing.
 */
export function nextCompact(scrollY: number, wasCompact: boolean, enter = COMPACT_ENTER, exit = COMPACT_EXIT): boolean {
  if (scrollY >= enter) return true;
  if (scrollY <= exit) return false;
  return wasCompact;
}

/** Drives the header's bg/blur ("scrolled") and compact-height ("compact") states from one scroll listener. */
export function useHeaderScrollState(): HeaderScrollState {
  const [state, setState] = useState<HeaderScrollState>({ scrolled: false, compact: false });
  const compactRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const compact = nextCompact(y, compactRef.current);
      compactRef.current = compact;
      setState({ scrolled: y > SCROLLED_THRESHOLD, compact });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
