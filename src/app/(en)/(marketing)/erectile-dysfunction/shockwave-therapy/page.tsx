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

const PATH = "/erectile-dysfunction/shockwave-therapy";

export const metadata: Metadata = buildMetadata({
  title: "Shockwave Therapy for Erectile Dysfunction",
  description:
    "Low-Intensity Shockwave Therapy (Li-SWT) for erectile dysfunction in Abu Dhabi — rationale, patient selection, evidence limitations and realistic expectations, considered after assessment.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Erectile Dysfunction", href: "/erectile-dysfunction" },
  { name: "Shockwave Therapy", href: PATH },
];

const considerations = [
  {
    title: "Rationale",
    description:
      "Li-SWT delivers low-intensity acoustic wave pulses to penile tissue. The rationale is to stimulate a localised tissue response, which may support erectile function in appropriately selected patients.",
  },
  {
    title: "Who may be considered",
    description:
      "Shockwave therapy may be considered for selected patients — particularly where a vascular contributor is relevant and first-line options have already been discussed. It is not appropriate for every cause of erectile dysfunction.",
  },
  {
    title: "Alternatives",
    description:
      "Li-SWT is one option among several on the erectile dysfunction treatment ladder. Lifestyle measures, PDE5 inhibitors, hormonal treatment, device options and other therapies remain relevant alternatives, discussed alongside it.",
  },
];

const faqItems = [
  {
    question: "Is shockwave therapy a cure for erectile dysfunction?",
    answer:
      "No. It is one treatment option that may be considered for selected patients, not a stand-alone cure. It doesn't replace identifying and addressing the underlying cause.",
  },
  {
    question: "Am I a candidate for shockwave therapy?",
    answer:
      "This depends on the cause of your erectile dysfunction and your overall assessment. It's discussed individually, alongside other options on the treatment ladder.",
  },
  {
    question: "How many sessions are needed?",
    answer:
      "Protocols vary between devices and providers. If shockwave therapy is considered appropriate for you, this is discussed individually as part of your treatment plan.",
  },
  {
    question: "Does shockwave therapy work for everyone?",
    answer:
      "Response varies between individuals and is not guaranteed. This is explained clearly as part of assessment, alongside realistic expectations and alternatives.",
  },
];

export default function ShockwaveTherapyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Shockwave Therapy for Erectile Dysfunction",
            description:
              "Low-Intensity Shockwave Therapy (Li-SWT) considered for selected patients as part of erectile dysfunction treatment, after assessment.",
            path: PATH,
            aboutType: "MedicalTherapy",
            aboutName: "Low-Intensity Shockwave Therapy",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Erectile Dysfunction
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Shockwave Therapy
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Low-Intensity Shockwave Therapy (Li-SWT) is one option
              that may be considered for selected patients as part of
              erectile dysfunction treatment — after assessment, not
              instead of it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta
                sourcePage={PATH}
                ctaPosition="hero"
                service="erectile_dysfunction"
                size="lg"
              >
                Book an ED Assessment
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Assessment comes first */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Assessment first"
            heading="Erectile Dysfunction Deserves a Diagnosis Before Any Treatment"
            size="md"
            description="Shockwave therapy is only ever considered after erectile dysfunction has been assessed — never as a first response to symptoms. Treatment is matched to the cause, in the same way as every other option on the treatment ladder."
          />
        </Container>
      </section>

      {/* Rationale / selection / alternatives */}
      <section className="py-section-y">
        <Container>
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 border-t border-border pt-12 md:grid-cols-3">
            {considerations.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <h2 className="font-display text-xl text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Evidence and limitations — dark, this page's one distinctive moment */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Evidence and limitations
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Evolving evidence, individual response.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Evidence for Li-SWT is still evolving, and protocols vary
              between devices and providers. Response to treatment is
              not guaranteed and varies between individuals. Li-SWT is
              not offered as a stand-alone cure, and it does not replace
              identifying and addressing the underlying cause of
              erectile dysfunction — this is discussed openly at
              consultation, alongside alternative options.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Penile Doppler", href: "/erectile-dysfunction/penile-doppler" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Start With an ED Assessment"
        sourcePage={PATH}
        secondary={{ label: "Explore the Treatment Ladder", href: "/erectile-dysfunction" }}
      />
    </>
  );
}
