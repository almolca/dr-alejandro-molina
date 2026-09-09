import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { HeroPortrait } from "@/components/editorial/HeroPortrait";
import { FlagshipAuthorityFeature } from "@/components/editorial/FlagshipAuthorityFeature";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { PhysicianAuthority } from "@/components/editorial/PhysicianAuthority";
import { ExpertiseTimeline } from "@/components/editorial/ExpertiseTimeline";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { MedicalEducationDiagram } from "@/components/illustrations/MedicalEducationDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { PullQuote } from "@/components/ui/PullQuote";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaAppearancesSection } from "@/components/sections/MediaAppearancesSection";
import { PatientReviewsCta } from "@/components/sections/PatientReviewsCta";
import { PatientFeedbackSection } from "@/components/sections/PatientFeedbackSection";
import { RecognitionSection } from "@/components/sections/RecognitionSection";
import { publications } from "@/config/reputation";
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
    eyebrow: `Male genital aesthetics · Since ${doctor.girthEnhancementSince} · ${doctor.girthProcedureCount} procedures`,
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
    <div className={visual.scope}>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <EditorialField className="py-14">
        <HeroAtmosphere align="left" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Identity precedes the physician portrait on mobile. */}
          <MaskedReveal className="order-last w-full lg:order-first lg:max-w-lg">
            <HeroPortrait slot="aboutPortrait" priority objectPosition="center 4%" />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                About
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                {doctor.displayName}
              </h1>
              <p className="mt-6 max-w-lg font-display text-2xl leading-snug">European Training. Surgical Background. Dedicated Focus on Men&rsquo;s Health.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 border-t border-border pt-6">
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
      </EditorialField>

      {/* Verified clinical and editorial authority, readable at a glance. */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <PhysicianAuthority />
        </Container>
      </section>

      <RecognitionSection />

      {/* Narrative — alternating editorial rows */}
      <section className="border-t border-border py-section-y">
        <Container>
          <p className="text-xs uppercase tracking-widest text-accent-strong">The clinical journey</p>
          <h2 className="mt-4 max-w-xl font-display text-display-lg">A surgical foundation. An increasingly dedicated focus.</h2>
          <ExpertiseTimeline items={narrative} />
        </Container>
      </section>

      <section className="py-section-y">
        <Container className={visual.split}>
          <div>
            <PhotoFrame slot="aboutConsultation" landscape />
            <div className="mt-8"><PullQuote>Penile girth enhancement is approached within an andrology and urology context — anatomy-led and medically supervised, never as a standalone cosmetic service.</PullQuote></div>
          </div>
          <FlagshipAuthorityFeature />
        </Container>
      </section>

      {/* Medical Education & Training — SEO_RESTRUCTURE_IMPLEMENTATION_
          PLAN.md Phase B4. Deliberately has no BookingCta or any
          clinical CTA — kept as a purely informational section so the
          B2B training proposition never mixes with the clinical B2C
          booking flow (owner's explicit instruction). Renders nothing
          if `doctor.medicalTrainer` is ever unset. */}
      {doctor.medicalTrainer?.description && (
        <section className="border-t border-border py-section-y">
          <Container className={visual.split}>
            <PhotoFrame slot="aboutTraining" landscape />
            <Reveal>
              <MedicalEducationDiagram
                className="mb-6 h-16 w-16 text-muted-foreground"
                title="Physician mentorship and ultrasound-guided training"
              />
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Medical Education &amp; Training
              </p>
              <h2 className="mt-4 font-display text-display-md">{doctor.medicalTrainer.program}</h2>
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

      <MediaAppearancesSection />

      {publications.length > 0 && (
        <section className="border-t border-border py-section-y">
          <Container>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Selected Publications
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">Contributor &amp; Author — Men&rsquo;s Health Spain</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
              {publications.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group block border-t border-border pt-6"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.outletName}</p>
                  <p className="mt-3 font-display text-lg text-foreground underline decoration-transparent underline-offset-4 group-hover:decoration-accent-strong">
                    {item.label}
                  </p>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}

      <PatientFeedbackSection />

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
            <div className="mt-6">
              <PatientReviewsCta />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
