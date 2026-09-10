import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border bg-background px-4 text-sm text-foreground outline-none transition-colors duration-150",
        "placeholder:text-muted-foreground focus:border-accent-strong",
        invalid ? "border-red-600" : "border-border",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
