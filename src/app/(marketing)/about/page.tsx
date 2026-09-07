import type { Metadata } from "next";
import Link from "next/link";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { BookingCta } from "@/components/ui/BookingCta";
import { BrandCurve } from "@/components/ui/BrandCurve";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PullQuote } from "@/components/ui/PullQuote";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaAppearancesSection } from "@/components/sections/MediaAppearancesSection";
import { RecognitionSection } from "@/components/sections/RecognitionSection";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/about";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Dr. Alejandro Molina — Consultant Urologist & Andrologist at NMC Royal Hospital Khalifa City, Abu Dhabi. European surgical training, evolving toward andrology and men's health.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "About", href: PATH },
];

const narrative = [
  {
    eyebrow: "European training",
    heading: "A Foundation in Spain",
    body: "Dr. Molina's medical training began in Spain, with clinical experience shaped by Hospital Clínic Barcelona — one of Europe's leading academic medical centres. That foundation, in a rigorous and academically driven environment, shaped an evidence-based, detail-oriented approach that has carried through the rest of his career.",
  },
  {
    eyebrow: "Surgical background",
    heading: "Years of Tertiary Urology Practice",
    body:
      "Extensive tertiary hospital experience followed, spanning advanced laparoscopic surgery and renal transplantation, alongside the broader scope of general urological training — including uro-oncology and functional urology." +
      (doctor.yearsOfExperience !== undefined
        ? ` This surgical foundation, built over ${doctor.yearsOfExperience}+ years in Urology, still informs how complex cases are approached today.`
        : " This surgical foundation still informs how complex cases are approached today."),
  },
  {
    eyebrow: "Evolution toward andrology",
    heading: "A Narrowing Focus on Men's Health",
    body: "Over time, clinical focus narrowed toward andrology and male sexual medicine — the areas of urology concerned specifically with men's sexual, hormonal and reproductive health. Erectile dysfunction, testosterone and male hormonal health, and male fertility are each approached with the same diagnostic rigor as the broader surgical background behind them.",
  },
  {
    eyebrow: "Male genital aesthetics",
    heading: "A Flagship Focus: Penile Girth Enhancement",
    body:
      "This focus extended to male genital aesthetics — approached within an andrology and urology context, anatomy-led and medically supervised, rather than offered as a standalone cosmetic service." +
      (doctor.girthEnhancementSince !== undefined || doctor.girthProcedureCount !== undefined
        ? ` Dr. Molina has been performing penile girth enhancement${
            doctor.girthEnhancementSince !== undefined ? ` since ${doctor.girthEnhancementSince}` : ""
          }${
            doctor.girthProcedureCount !== undefined
              ? `, with ${doctor.girthProcedureCount} procedures performed`
              : ""
          }.`
        : ""),
    href: "/male-aesthetics/penile-girth-enhancement",
    linkLabel: "Explore Penile Girth Enhancement",
  },
  {
    eyebrow: "Academic activity",
    heading: "A Continued Connection to Teaching",
    body:
      "Dr. Molina has maintained academic and teaching involvement throughout his clinical career, reflecting a commitment to the field beyond individual patient care." +
      (doctor.medicalTrainer?.description ? ` ${doctor.medicalTrainer.description}` : ""),
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* order-last on mobile: identity/H1 before the placeholder
              image, even though the image sits left on desktop — found
              in the Phase 5 UX audit. */}
          <MaskedReveal className="order-last aspect-[3/4] w-full border border-border bg-surface lg:order-first">
            <ImagePlaceholder index={doctor.displayName} label="Portrait of Dr. Alejandro Molina" />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                About
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                European Training. Surgical Background. Dedicated Focus
                on Men&rsquo;s Health.
              </h1>
              <BrandCurve className="mt-6 h-4 w-32 text-accent-strong" />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 border-t border-border pt-6">
                <p className="font-display text-xl text-foreground">{doctor.displayName}</p>
                <p className="text-sm text-muted-foreground">{doctor.title}</p>
                <p className="mt-3 text-sm text-muted-foreground">{practiceLocationLine}</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
                {isPhysicianProfileConfigured && (
                  <a
                    href={practice.physicianProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    View NMC Profile
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Authority block — Phase R2.1/R3, key facts right after the hero */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <AuthorityBlock />
        </Container>
      </section>

      {/* Narrative — alternating editorial rows */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <div className="border-t border-border">
            {narrative.map((section, index) => (
              <Reveal key={section.heading} delay={index * 0.04}>
                <div
                  className={`grid gap-4 border-b border-border py-12 md:grid-cols-[1fr_2fr] md:gap-16 ${
                    index % 2 === 1 ? "md:text-right" : ""
                  }`}
                >
                  <p
                    className={`text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    {section.eyebrow}
                  </p>
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <h2 className="font-display text-2xl text-foreground md:text-3xl">
                      {section.heading}
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:ml-auto">
                      {section.body}
                    </p>
                    {section.href && section.linkLabel && (
                      <Link
                        href={section.href}
                        className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4 md:ml-auto"
                      >
                        {section.linkLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pull quote — Phase R2.1/R3, breaks up the text-heavy narrative section */}
      <Container className="max-w-2xl py-section-y">
        <PullQuote>
          Penile girth enhancement is approached within an andrology and
          urology context — anatomy-led and medically supervised, never
          as a standalone cosmetic service.
        </PullQuote>
      </Container>

      {/* Medical Education & Training — SEO_RESTRUCTURE_IMPLEMENTATION_
          PLAN.md Phase B4. Deliberately has no BookingCta or any
          clinical CTA — kept as a purely informational section so the
          B2B training proposition never mixes with the clinical B2C
          booking flow (owner's explicit instruction). Renders nothing
          if `doctor.medicalTrainer` is ever unset. */}
      {doctor.medicalTrainer?.description && (
        <section className="border-t border-border py-section-y">
          <Container className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Medical Education &amp; Training
              </p>
              <p className="mt-6 text-body-lg text-muted-foreground">
                {doctor.medicalTrainer.description}
              </p>
              {doctor.medicalTrainer.programUrl && (
                <a
                  href={doctor.medicalTrainer.programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  Visit {doctor.medicalTrainer.program}
                </a>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      {/* Structured credential list — spec §15: "use structured credential list separately" */}
      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture />
        <Container>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Background
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">Credentials</h2>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctor.credentials.map((item) => (
              <StaggerItem key={item} className="flex items-baseline gap-3">
                <span aria-hidden className="h-px w-4 shrink-0 bg-accent-strong" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <RecognitionSection />
      <MediaAppearancesSection />

      {/* Closing CTA */}
      <section className="bg-surface py-section-y">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-display text-display-md text-foreground">
              Consult {doctor.displayName} in {practice.city}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">{practiceLocationLine}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="page-closing-cta" size="lg" />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
