import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/peyronies-disease";

export const metadata: Metadata = buildMetadata({
  title: "Peyronie's Disease",
  description:
    "Specialist assessment for Peyronie's disease in Abu Dhabi — penile curvature and its effect on erectile function, with conservative, procedural and surgical pathways matched to phase and severity.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Penile Surgery", href: "/penile-surgery" },
  { name: "Peyronie's Disease", href: PATH },
];

const phases = [
  {
    label: "Active phase",
    description:
      "Curvature, plaque or pain may still be changing. Treatment during this phase is generally conservative, since the condition has not yet settled.",
  },
  {
    label: "Stable phase",
    description:
      "Once the condition has settled and curvature is no longer changing, a wider range of options — including procedural or surgical correction — can be considered where appropriate.",
  },
];

const pathways = [
  {
    tier: "Conservative",
    description:
      "Observation and management of associated symptoms, particularly appropriate during the active phase or with mild curvature that isn't affecting function.",
  },
  {
    tier: "Procedural",
    description:
      "Selected non-surgical or minimally invasive options may be considered once the condition has stabilized, depending on severity and impact.",
  },
  {
    tier: "Surgical",
    description:
      "Surgical correction is considered for more significant curvature affecting function, once the condition is stable and non-surgical options have been reviewed.",
  },
];

const faqItems = [
  {
    question: "What is Peyronie's disease?",
    answer:
      "A condition involving the development of fibrous plaque within the penis, which can cause curvature and, in some cases, pain or effects on erectile function.",
  },
  {
    question: "Will my curvature get worse?",
    answer:
      "This varies. Peyronie's disease often has an active phase where changes can still occur, followed by a stable phase — assessment helps determine which phase you are in.",
  },
  {
    question: "Do I need surgery?",
    answer:
      "Not necessarily. Many cases are managed conservatively, especially during the active phase or with mild curvature. Surgery is considered for more significant, stable curvature affecting function.",
  },
  {
    question: "Is ultrasound always needed?",
    answer:
      "Not always. It may be used where appropriate, particularly to assess plaque or blood flow when erectile function is also affected.",
  },
  {
    question: "Can Peyronie's disease affect erections?",
    answer:
      "In some men, yes. Curvature and erectile function are assessed together, since one can influence the other.",
  },
];

export default function PeyroniesDiseasePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Peyronie's Disease",
            description:
              "Specialist assessment for penile curvature and Peyronie's disease, with treatment matched to phase and severity.",
            path: PATH,
            aboutType: "MedicalCondition",
            aboutName: "Peyronie's Disease",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Penile Surgery
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Peyronie&rsquo;s Disease
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Specialist assessment for penile curvature, plaque and its
              effects on erectile function — with treatment matched to
              phase and severity.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                Book a Confidential Consultation
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Active vs stable phase */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="Understanding phase" heading="Active and Stable Phase" />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {phases.map((phase, index) => (
              <Reveal key={phase.label} delay={index * 0.08}>
                <div className={index === 1 ? "md:border-l md:border-border md:pl-16" : ""}>
                  <h3 className="font-display text-2xl text-foreground">{phase.label}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Curvature and erectile function + assessment */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Curvature and function
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Assessed Together, Not in Isolation
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Peyronie&rsquo;s disease can affect the shape of the penis during
              erection, and in some men, erectile function itself. Both
              are assessed together, since they can influence treatment
              planning.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              How assessment works
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              History, Examination, Ultrasound Where Appropriate
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Assessment includes a history and relevant examination.
              Ultrasound may be used where appropriate to assess plaque
              and blood flow, particularly when erectile function is
              also affected.
            </p>
          </div>
        </Container>
      </section>

      {/* Pathways — olive, this page's one distinctive tonal moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading
            eyebrow="Management"
            heading="Conservative, Procedural and Surgical Pathways"
          />
          <div className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathways.map((pathway, index) => (
              <Reveal key={pathway.tier} delay={index * 0.06}>
                <span className="font-display text-sm text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{pathway.tier}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{pathway.description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              Not every case of Peyronie&rsquo;s disease requires active
              treatment. Mild curvature without functional impact may
              simply be monitored. As with any treatment for
              Peyronie&rsquo;s disease, response varies between individuals, and no
              specific outcome — including complete straightening — can
              be guaranteed.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Your Phase and Severity"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
      />
    </>
  );
}
