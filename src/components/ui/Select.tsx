import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-sm border bg-background px-4 text-sm text-foreground outline-none transition-colors duration-150",
        "focus:border-accent-strong",
        invalid ? "border-red-600" : "border-border",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}
