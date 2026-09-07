import Image from "next/image";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import {
  bookHref,
  footerServiceLinks,
  legalNav,
  primaryNav,
} from "@/config/navigation";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-dark border-t border-border bg-background text-foreground">
      <Container className="py-section-y">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {/* The symbol is navy-on-transparent, so it disappears
                against this section's own dark background — a light
                mark gives it real contrast. Squared (not circular) to
                match the site's own editorial language, with a bronze
                border rather than a plain white fill, so it reads as
                an intentional part of the identity, not a patch
                (Phase R3 correction). */}
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-accent-strong/40 bg-stone-50 p-2">
              <Image src="/brand/logo-symbol.png" alt="" width={30} height={30} />
            </div>
            <p className="mt-4 font-display text-2xl">{doctor.displayName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{doctor.title}</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Andrology · Men&rsquo;s Sexual Health · Male Genital Aesthetics
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Consultations at {practiceLocationLine}
            </p>
          </div>

          <nav aria-label="Services" className="text-sm">
            <p className="text-eyebrow font-medium uppercase tracking-widest text-muted-foreground">
              Care Areas
            </p>
            <ul className="mt-4 space-y-3">
              {footerServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="text-sm">
            <p className="text-eyebrow font-medium uppercase tracking-widest text-muted-foreground">
              Site
            </p>
            <ul className="mt-4 space-y-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={bookHref}
                  className="text-foreground/85 transition-colors hover:text-foreground"
                >
                  Book a Consultation
                </Link>
              </li>
              {isPhysicianProfileConfigured && (
                <li>
                  <a
                    href={practice.physicianProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/85 transition-colors hover:text-foreground"
                  >
                    View NMC Profile
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {doctor.displayName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
