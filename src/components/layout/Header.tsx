"use client";

import Image from "next/image";
import Link from "next/link";
import { doctor } from "@/config/doctor";
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
          : "bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-x-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo-symbol.png"
            alt=""
            width={26}
            height={26}
            className="shrink-0"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg tracking-tight text-foreground">
              {doctor.displayName}
            </span>
            <span className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground xl:block">
              {doctor.title}
            </span>
          </span>
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
