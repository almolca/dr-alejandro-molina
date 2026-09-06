import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/erectile-dysfunction/penile-doppler";

export const metadata: Metadata = buildMetadata({
  title: "Penile Doppler — Advanced ED Assessment",
  description:
    "Penile Doppler (penile duplex ultrasound) assessment in Abu Dhabi — arterial inflow, veno-occlusive function, and how findings inform erectile dysfunction treatment planning.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Erectile Dysfunction", href: "/erectile-dysfunction" },
  { name: "Penile Doppler", href: PATH },
];

const evaluates = [
  {
    title: "Arterial inflow",
    description:
      "Blood flow into the penis, assessed to identify whether reduced arterial supply is contributing to erectile dysfunction.",
  },
  {
    title: "Veno-occlusive function",
    description:
      "How well the penis retains blood during an erection. Impaired veno-occlusive function can allow blood to drain too quickly, affecting rigidity.",
  },
  {
    title: "Response to stimulation",
    description:
      "The test typically involves an intracavernosal injection to pharmacologically stimulate an erection, allowing blood flow to be assessed under standardised conditions.",
  },
];

const faqItems = [
  {
    question: "Do I need a Penile Doppler test?",
    answer:
      "Not necessarily. It's considered when a vascular cause is suspected, when initial treatment hasn't worked as expected, or ahead of certain procedures — assessed individually, not routinely for every patient.",
  },
  {
    question: "What does the test involve?",
    answer:
      "The test involves an injection to stimulate an erection for assessment purposes, followed by ultrasound imaging of blood flow. What to expect is explained in detail beforehand.",
  },
  {
    question: "What happens after the test?",
    answer:
      "Results are reviewed alongside your full clinical picture and used to help inform — not replace — treatment planning discussed at consultation.",
  },
  {
    question: "Does a normal result rule out erectile dysfunction?",
    answer:
      "No single test provides a complete picture. Results are interpreted in context, alongside your history and examination.",
  },
];

export default function PenileDopplerPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Doppler — Advanced ED Assessment",
            description:
              "Penile duplex ultrasound assessment of arterial inflow and veno-occlusive function, used as part of advanced erectile dysfunction assessment.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Duplex Ultrasound",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Advanced ED Assessment
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Penile Doppler
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Ultrasound assessment of penile blood flow, used as part
              of advanced erectile dysfunction assessment when a
              vascular cause needs to be evaluated in detail.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* When indicated */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="When it may be indicated"
            heading="Not a Routine Test for Every Patient"
            size="md"
            description="Penile Doppler may be considered when a vascular cause is suspected, when initial treatment hasn't provided the expected response, or when planning is needed ahead of a procedure such as penile implant surgery — assessed individually, not as a default step."
          />
        </Container>
      </section>

      {/* What the test evaluates */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="What the test evaluates" heading="Three Things the Scan Looks At" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 border-t border-border pt-12 md:grid-cols-3">
            {evaluates.map((item, index) => (
              <StaggerItem key={item.title}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Interpretation — olive, this page's one distinctive moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Interpreting the results
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Context, not a verdict.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Findings are interpreted alongside your history,
              examination and other assessment findings — not in
              isolation. Results can help clarify whether a vascular
              contributor is present and inform which options on the
              erectile dysfunction treatment ladder may be most
              appropriate, but the test itself does not replace
              clinical judgment or determine treatment on its own.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Shockwave Therapy", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection heading="Discuss Whether Assessment Is Right for You" sourcePage={PATH} />
    </>
  );
}
