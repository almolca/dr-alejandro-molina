import type { Metadata } from "next";
import { AmpersandText } from "@/components/ui/AmpersandText";
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

const PATH = "/erectile-dysfunction";

export const metadata: Metadata = buildMetadata({
  title: "Erectile Dysfunction Assessment & Treatment",
  description:
    "Specialist assessment and treatment for erectile dysfunction in Abu Dhabi — vascular, hormonal, metabolic and psychosexual causes, matched to an individual treatment plan.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Sexual Medicine", href: "/sexual-medicine" },
  { name: "Erectile Dysfunction", href: PATH },
];

/** Spec §10 cause matrix, with brief patient-education-level context per cause. */
const causes = [
  {
    label: "Vascular",
    description:
      "Reduced blood flow to the penis, often related to cardiovascular risk factors such as high blood pressure, cholesterol or smoking.",
  },
  {
    label: "Hormonal",
    description:
      "Low testosterone or other hormonal imbalances can contribute to reduced erectile function and libido.",
  },
  {
    label: "Metabolic",
    description:
      "Diabetes and metabolic syndrome are common contributors, affecting blood vessels and nerve function over time.",
  },
  {
    label: "Neurological",
    description:
      "Conditions affecting the nerves — including diabetes, spinal injury or pelvic surgery — can disrupt the signals involved in an erection.",
  },
  {
    label: "Medication-related",
    description:
      "Certain medications, including some antidepressants and blood pressure treatments, can affect erectile function as a side effect.",
  },
  {
    label: "Psychosexual",
    description:
      "Stress, anxiety, relationship factors and mood can play a role, independently or alongside physical causes.",
  },
  {
    label: "Pelvic / structural",
    description:
      "Previous pelvic surgery, radiotherapy, or structural conditions such as Peyronie's disease can affect erectile function directly.",
  },
];

/** Spec §10 treatment ladder — assessment always precedes any step below. */
const ladder = [
  {
    title: "Lifestyle / risk-factor management",
    description:
      "Addressing cardiovascular risk factors, weight, activity levels, alcohol and smoking where relevant to the underlying cause.",
  },
  {
    title: "PDE5 inhibitors",
    description:
      "Oral medication that can support erectile function in appropriately selected patients, prescribed after assessment.",
  },
  {
    title: "Hormonal treatment when indicated",
    description:
      "Considered only when a hormonal cause, such as testosterone deficiency, has been identified on assessment.",
  },
  {
    title: "Vacuum / device options",
    description:
      "Non-invasive mechanical devices that can support erectile function for selected patients.",
  },
  {
    title: "Selected shockwave treatment",
    description:
      "Low-intensity shockwave therapy may be considered for selected patients where clinically appropriate.",
  },
  {
    title: "Intracavernosal therapy",
    description:
      "Injectable therapy administered directly into the penis, used when oral treatments are not suitable or effective.",
  },
  {
    title: "Penile implant surgery",
    description:
      "A surgical option considered for severe or refractory erectile dysfunction, once other treatments no longer provide reliable results.",
  },
];

const faqItems = [
  {
    question: "Is erectile dysfunction always a physical problem?",
    answer:
      "No. Erectile dysfunction can have physical, hormonal and psychological contributors, often together. Assessment aims to identify which factors are relevant before treatment is planned.",
  },
  {
    question: "Do I need a penile implant?",
    answer:
      "Most men are not surgical candidates. A penile implant is only considered for severe or refractory erectile dysfunction, once other treatment options have been explored.",
  },
  {
    question: "What is a Penile Doppler assessment?",
    answer:
      "It is an ultrasound assessment of blood flow in the penis, used when a vascular cause needs to be evaluated as part of assessment.",
  },
  {
    question: "Can erectile dysfunction be linked to testosterone?",
    answer:
      "It can be. Hormonal assessment, including testosterone, is part of a full evaluation — though not every case of erectile dysfunction is hormonal.",
  },
  {
    question: "How do I arrange a consultation?",
    answer:
      "Consultations take place at NMC Royal Hospital Khalifa City, Abu Dhabi. Use the Book a Consultation option on this page, which directs you to the official NMC appointment process.",
  },
];

export default function ErectileDysfunctionPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Erectile Dysfunction Assessment & Treatment",
            description:
              "Specialist assessment and treatment for erectile dysfunction — vascular, hormonal, metabolic and psychosexual causes, matched to an individual treatment plan.",
            path: PATH,
            aboutType: "MedicalCondition",
            aboutName: "Erectile Dysfunction",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Sexual Medicine
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-display-xl text-foreground">
              <AmpersandText text="Erectile Dysfunction Assessment & Treatment" />
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Treatment is selected according to the underlying cause,
              medical history and individual priorities — not a single
              default prescription.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
              <a
                href="#treatment-ladder"
                className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                See the treatment ladder
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Assessment vs treatment framing */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="Assessment first"
            heading="A Diagnosis Before a Prescription"
            size="md"
            description="Erectile dysfunction can have vascular, hormonal, metabolic, neurological, medication-related and psychosexual contributors. A consultation and appropriate assessment come before any treatment is recommended."
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Assessment vs. treatment
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Assessment</strong>{" "}
              means understanding the cause: history, relevant
              examination, and hormonal or vascular investigations where
              indicated. <strong className="text-foreground">Treatment</strong>{" "}
              is only selected once that picture is clear — not the
              other way around.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cause matrix */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Understanding the cause" heading="Possible Contributors" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((cause) => (
              <StaggerItem key={cause.label} className="border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{cause.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{cause.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Treatment ladder — dark section, this page's one dark moment */}
      <section id="treatment-ladder" className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="Treatment ladder" heading="Matched to the Cause, Step by Step" />
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Not every patient starts at step one, and not every patient
            needs every step — the ladder reflects the range of options
            considered, not a fixed sequence every man follows.
          </p>

          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {ladder.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="grid grid-cols-[3rem_1fr] gap-x-6 gap-y-2 py-7 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline">
                  <span className="font-display text-2xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl text-foreground sm:col-start-2">
                    {step.title}
                  </h3>
                  <p className="col-span-2 text-sm text-muted-foreground sm:col-span-1 sm:col-start-3">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Risks / realistic expectations */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Realistic expectations"
            heading="Risks and Limitations"
            size="md"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Every option on the treatment ladder carries its own
              considerations — from medication interactions and
              contraindications with PDE5 inhibitors, to the surgical
              risks associated with penile implant surgery. Response to
              any treatment, including shockwave therapy, varies between
              individuals and is not guaranteed. These are discussed in
              detail at consultation, alongside your medical history, so
              that any plan reflects your individual circumstances
              rather than a general assumption.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Penile Doppler", href: "/erectile-dysfunction/penile-doppler" },
          { label: "Shockwave Therapy", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Start With an Assessment, Not an Assumption"
        sourcePage={PATH}
        secondary={{ label: "Explore Penile Implants", href: "/penile-implant" }}
      />
    </>
  );
}
