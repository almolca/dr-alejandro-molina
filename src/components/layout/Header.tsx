"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useScrolled } from "@/components/navigation/useScrolled";
import { cn } from "@/lib/utils/cn";

/** Spec §6: sticky header after initial scroll, discreet persistent mobile booking CTA. */
export function Header() {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-[background-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "bg-background/90 shadow-sm backdrop-blur-md"
          : "bg-background",
      )}
    >
      <Container className="flex min-h-28 items-center justify-between gap-x-5">
        <Link href="/" className="shrink-0" aria-label="Dr. Alejandro Molina — Home">
          <BrandLogo />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <BookingCta
              sourcePage="global-header"
              ctaPosition="header"
              size="sm"
            />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
