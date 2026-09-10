import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border border-border text-accent-strong outline-none focus-visible:ring-2 focus-visible:ring-accent-strong",
        className,
      )}
      {...props}
    />
  );
}
