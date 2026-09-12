import type { ElementType, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

/**
 * Shared eyebrow + heading + support-copy rhythm used across the
 * homepage sections (spec §7). Kept intentionally plain — the variety
 * between sections comes from surrounding composition, not from this
 * primitive growing variants.
 */
export function SectionHeading({
  eyebrow,
  heading,
  description,
  as: Heading = "h2",
  size = "lg",
  className,
  align = "left",
  locale,
}: {
  eyebrow?: string;
  heading: ReactNode;
  description?: ReactNode;
  as?: ElementType;
  size?: "md" | "lg" | "xl";
  className?: string;
  align?: "left" | "center";
  locale?: "ar";
}) {
  const headingSize = {
    md: "text-display-md",
    lg: "text-display-lg",
    xl: "text-display-xl",
  }[size];

  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-eyebrow font-medium uppercase text-accent-strong",
            // Letter-spacing distorts joined Arabic script — see W3C i18n
            // guidance. Only Latin-script (default) eyebrows get tracking.
            locale === "ar" ? undefined : "tracking-[0.2em]",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "font-display text-foreground",
          headingSize,
          eyebrow && "mt-4",
        )}
      >
        {heading}
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-6 text-body-lg text-muted-foreground",
            align === "left" ? "max-w-2xl" : "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
