import visual from "@/components/editorial/VisualSystem.module.css";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { ArrowUpRight } from "lucide-react";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";


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
  { label: "Premature Ejaculation", href: "/sexual-medicine/premature-ejaculation" },
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

        <div className={visual.services}>
          <Link href="/male-aesthetics/penile-girth-enhancement" className={visual.serviceFeature}>
            <span className="text-xs uppercase tracking-widest">Flagship procedure</span>
            <div><h3 className="font-display text-3xl">Penile Girth Enhancement</h3><p className="mt-4 text-sm text-stone-200">Anatomy-led planning within a Consultant Urologist &amp; Andrologist&rsquo;s practice.</p></div>
            <span className="mt-6 text-sm">Explore the procedure <span aria-hidden="true">↗</span></span>
          </Link>
          <div className={visual.serviceList}>
            {primaryAreas.map((area) => (
              <Link key={area.number} href={area.href} className={visual.serviceLink}>
                <span className={visual.serviceNumber} aria-hidden="true">{area.number}</span>
                <span><span className="block font-display text-xl"><AmpersandText text={area.title} /></span><span className="mt-2 block max-w-lg text-sm text-muted-foreground">{area.description}</span></span>
                <ArrowUpRight aria-hidden size={18} />
              </Link>
            ))}
          </div>
        </div>

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
