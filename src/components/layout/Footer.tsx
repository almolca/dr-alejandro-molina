import visual from "@/components/editorial/VisualSystem.module.css";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CookieSettingsLink } from "@/components/ui/CookieSettingsLink";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import { bookHref, getFooterServiceLinks, getLegalNav } from "@/config/navigation";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { Container } from "@/components/ui/Container";

const copy = {
  en: {
    homeHref: "/",
    homeAriaLabel: "Dr. Alejandro Molina — Home",
    tagline: "Andrology · Men’s Sexual Health · Male Genital Aesthetics",
    consultationsAt: (location: string) => `Consultations at ${location}`,
    careAreas: "Care Areas",
    yourConsultation: "Your consultation",
    about: "About Dr. Molina",
    insights: "Patient Insights",
    book: "Book a Consultation",
    nmcProfile: "View NMC Profile",
    rightsReserved: "All rights reserved.",
  },
  ar: {
    homeHref: "/ar",
    homeAriaLabel: "د. أليخاندرو مولينا — الصفحة الرئيسية",
    tagline: "طب الذكورة · الصحة الجنسية للرجال · التجميل الذكوري",
    consultationsAt: (location: string) => `استشارات في ${location}`,
    careAreas: "مجالات الرعاية",
    yourConsultation: "استشارتك",
    about: "نبذة عن د. مولينا",
    insights: "رؤى للمرضى",
    book: "احجز استشارة",
    nmcProfile: "عرض الملف الشخصي في NMC",
    rightsReserved: "جميع الحقوق محفوظة.",
  },
} as const;

export function Footer({ locale = "en" }: { locale?: "en" | "ar" }) {
  const year = new Date().getFullYear();
  const t = copy[locale];
  const footerServiceLinks = getFooterServiceLinks(locale);
  const legalNav = getLegalNav(locale);

  return (
    <footer className={`${visual.footer} text-foreground`}>
      <Container className="py-section-y">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_0.7fr]">
          <div className={visual.footerBrand}>
            <Link href={t.homeHref} className="inline-block" aria-label={t.homeAriaLabel}>
              <BrandLogo footer />
            </Link>
            <p className={visual.footerIntro}>{t.tagline}</p>
            <p className="mt-6 text-sm text-muted-foreground">{t.consultationsAt(practiceLocationLine)}</p>
          </div>

          <nav aria-label="Services" className="text-sm">
            <p className="text-eyebrow font-medium uppercase tracking-widest text-muted-foreground">
              {t.careAreas}
            </p>
            <ul className="mt-4 space-y-3">
              {footerServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-foreground/85 transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="text-sm">
            <p className="text-eyebrow font-medium uppercase tracking-widest text-muted-foreground">
              {t.yourConsultation}
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-foreground/85 transition-colors hover:text-foreground">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-foreground/85 transition-colors hover:text-foreground">
                  {t.insights}
                </Link>
              </li>
              <li>
                <Link href={bookHref} className="text-foreground/85 transition-colors hover:text-foreground">
                  {t.book}
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
                    {t.nmcProfile}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {doctor.displayName}. {t.rightsReserved}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <CookieSettingsLink locale={locale} />
          </nav>
        </div>
      </Container>
    </footer>
  );
}
