"use client";

import { usePathname } from "next/navigation";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { getPrimaryNav } from "@/config/navigation";

export function DesktopNav({ locale = "en" }: { locale?: "en" | "ar" }) {
  const pathname = usePathname();
  const items = getPrimaryNav(locale);
  return (
    <nav aria-label="Primary" className="hidden items-center gap-3 xl:flex 2xl:gap-5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className="whitespace-nowrap text-[0.8125rem] leading-snug font-medium aria-[current=page]:underline underline-offset-8 text-foreground/80 transition-colors duration-150 hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
