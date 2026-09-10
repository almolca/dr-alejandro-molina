import visual from "@/components/editorial/VisualSystem.module.css";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CookieSettingsLink } from "@/components/ui/CookieSettingsLink";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import {
  bookHref,
  footerServiceLinks,
  legalNav,
} from "@/config/navigation";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={`${visual.footer} text-foreground`}>
      <Container className="py-section-y">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_0.7fr]">
          <div className={visual.footerBrand}>
            <Link href="/" className="inline-block" aria-label="Dr. Alejandro Molina — Home"><BrandLogo footer /></Link>
            <p className={visual.footerIntro}>
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
              Your consultation
            </p>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-foreground/85 transition-colors hover:text-foreground">About Dr. Molina</Link></li>
              <li><Link href="/insights" className="text-foreground/85 transition-colors hover:text-foreground">Patient Insights</Link></li>
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
            <CookieSettingsLink />
          </nav>
        </div>
      </Container>
    </footer>
  );
}
