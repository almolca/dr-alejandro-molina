import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Editorial container — spec §16 "large margins, asymmetric editorial
 * grids". Caps line/content width while keeping generous, fluid side
 * gutters at every viewport in the responsive QA list (spec §33).
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-editorial px-gutter", className)}>
      {children}
    </Tag>
  );
}
