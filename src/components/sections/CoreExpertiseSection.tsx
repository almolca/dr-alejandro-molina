import { InternalLink as Link } from "@/components/ui/InternalLink";
import { ArrowUpRight } from "lucide-react";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

/**
 * Spec §7 Section 2 — Core Expertise. Deliberately not a card grid
 * ("Cards must feel editorial, not SaaS dashboard cards" — spec's own
 * words): an editorial numbered index, closer to a magazine contents
 * page than a component-library card grid.
 */
const primaryAreas = [
  {
    number: "01",
    title: "Erectile Dysfunction & Penile Implants",
    description:
      "Diagnosis before treatment — from PDE5 therapy to penile prosthesis for refractory cases.",
    href: "/erectile-dysfunction",
  },
  {
    number: "02",
    title: "Testosterone & Male Hormonal Health",
    description:
      "Full hormonal and metabolic assessment before treatment is ever considered.",
    href: "/mens-health/testosterone",
  },
  {
    number: "03",
    title: "Male Genital Aesthetics",
    description:
      "An anatomy-led, medically supervised approach to penile enhancement and revision.",
    href: "/male-aesthetics",
  },
  {
    number: "04",
    title: "Male Fertility",
    description:
      "Semen analysis, hormonal evaluation and varicocele assessment.",
    href: "/male-fertility",
  },
];

const secondaryLinks = [
  { label: "Peyronie's Disease", href: "/peyronies-disease" },
  { label: "Penile Doppler", href: "/erectile-dysfunction/penile-doppler" },
  { label: "Premature Ejaculation", href: "/sexual-medicine" },
  { label: "Varicocele", href: "/male-fertility/varicocele" },
];

export function CoreExpertiseSection() {
  return (
    <section id="core-expertise" className="py-section-y">
      <Container>
        <SectionHeading
          eyebrow="Care areas"
          heading="Specialist Care for Men’s Health"
        />

        <StaggerGroup className="mt-16 border-t border-border">
          {primaryAreas.map((area) => (
            <StaggerItem key={area.number}>
              <Link
                href={area.href}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 border-b border-border py-8 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-x-10"
              >
                <span className="font-display text-2xl text-accent-strong sm:text-3xl">
                  {area.number}
                </span>
                <span className="col-span-2 sm:col-span-1">
                  <span className="block font-display text-2xl text-foreground transition-colors sm:text-3xl">
                    <AmpersandText text={area.title} />
                  </span>
                  <span className="mt-2 block max-w-lg text-sm text-muted-foreground sm:text-base">
                    {area.description}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  size={22}
                  className="hidden shrink-0 text-muted-foreground transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-strong sm:block"
                />
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Also assessed
          </span>
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
