"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { useScrolled } from "@/components/navigation/useScrolled";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { cn } from "@/lib/utils/cn";

/** Spec §6: sticky header after initial scroll, discreet persistent mobile booking CTA. */
export function Header({ locale = "en" }: { locale?: "en" | "ar" }) {
  const scrolled = useScrolled();
  const homeHref = locale === "ar" ? "/ar" : "/";
  const homeAriaLabel =
    locale === "ar" ? `${AR_IDENTITY.doctorDisplayName} — الصفحة الرئيسية` : "Dr. Alejandro Molina — Home";
  const bookingCtaLabel = locale === "ar" ? "احجز استشارة" : "Book a Consultation";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-[background-color,box-shadow] duration-300 ease-out",
        scrolled ? "bg-background/90 shadow-sm backdrop-blur-md" : "bg-background",
      )}
    >
      {/* min-h-28 is the actual mobile header height, not just a floor — BrandLogo's
          mobile width (160px, 3:2 ratio) is sized to render under 112px so nothing
          stretches this taller and destabilizes the sticky offset content relies on. */}
      <Container className="flex min-h-28 items-center justify-between gap-x-5">
        <Link href={homeHref} className="shrink-0" aria-label={homeAriaLabel}>
          <BrandLogo />
        </Link>

        <DesktopNav locale={locale} />

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <BookingCta sourcePage="global-header" ctaPosition="header" size="sm">
              {bookingCtaLabel}
            </BookingCta>
          </div>
          <LanguageSwitcher />
          <MobileNav locale={locale} />
        </div>
      </Container>
    </header>
  );
}
