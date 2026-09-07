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

const PATH = "/mens-health/testosterone";

export const metadata: Metadata = buildMetadata({
  title: "Testosterone & Male Hormonal Health",
  description:
    "Testosterone and male hormonal health assessment in Abu Dhabi — symptoms, diagnosis, full biochemical workup, and when treatment is clinically appropriate.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Men's Health", href: "/mens-health" },
  { name: "Testosterone & Male Hormonal Health", href: PATH },
];

/** Spec §9 diagnostic panel, with brief context per marker. */
const panel = [
  { label: "Total & free testosterone", description: "The primary hormone measured, both bound and unbound." },
  { label: "SHBG", description: "Sex hormone-binding globulin — affects how much testosterone is biologically available." },
  { label: "LH / FSH", description: "Pituitary hormones that help distinguish primary from secondary patterns." },
  { label: "Prolactin", description: "Assessed as a potential contributor to hormonal and sexual symptoms." },
  { label: "Thyroid", description: "Thyroid function can independently affect energy, libido and mood." },
  { label: "Metabolic health", description: "Weight, insulin resistance and metabolic syndrome all interact with testosterone." },
  { label: "Sleep", description: "Poor sleep, including untreated sleep apnoea, can lower testosterone levels." },
  { label: "Fertility plans", description: "Relevant before starting any hormonal treatment that could affect fertility." },
];

const monitoring = [
  "Regular follow-up bloodwork while on any treatment",
  "Reviewing symptoms alongside biochemistry, not biochemistry alone",
  "Monitoring for contraindications and relevant safety markers over time",
  "Adjusting or stopping treatment if it isn't clinically appropriate to continue",
];

const faqItems = [
  {
    question: "Do my symptoms mean I have low testosterone?",
    answer:
      "Not necessarily. Fatigue, low libido and reduced performance can be associated with testosterone deficiency, but they can also have many other causes. A full assessment is needed before symptoms are attributed to testosterone.",
  },
  {
    question: "What does the assessment involve?",
    answer:
      "A review of symptoms and medical history, alongside blood tests that typically include total and free testosterone, SHBG, LH/FSH, prolactin and thyroid function — plus a look at metabolic health and sleep.",
  },
  {
    question: "Will I automatically be offered testosterone treatment?",
    answer:
      "No. Testosterone treatment is considered only after appropriate clinical and biochemical assessment, and only when there is a clear indication for it.",
  },
  {
    question: "Is this the same as a bodybuilding or performance clinic?",
    answer:
      "No. This is a clinical hormonal health assessment, not a performance-enhancement service, and treatment is not offered for that purpose.",
  },
  {
    question: "What if I'm planning a family?",
    answer:
      "Fertility plans are discussed as part of assessment, since some hormonal treatments can affect fertility — this is factored into any recommendation.",
  },
];

export default function TestosteronePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Testosterone & Male Hormonal Health",
            description:
              "Assessment and management of testosterone and male hormonal health — symptoms, diagnosis, biochemical workup, and when treatment is appropriate.",
            path: PATH,
            aboutType: "MedicalCondition",
            aboutName: "Testosterone Deficiency",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero — centered, distinct rhythm from ED (left-aligned) and Implant (split) */}
      <section className="py-section-y">
        <Container className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Men&rsquo;s Health
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              <AmpersandText text="Testosterone & Male Hormonal Health" />
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground">
              Low energy, reduced libido and sexual symptoms can be
              associated with testosterone deficiency — but they can
              also have many other causes.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Symptoms are not diagnosis */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-display text-display-md italic leading-snug text-foreground">
              &ldquo;Symptoms come first. Numbers need context.&rdquo;
            </p>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              Not every man with fatigue, low libido or reduced sexual
              performance needs testosterone. The first step is
              understanding why — symptoms alone are not a diagnosis,
              and biochemistry is read alongside them, not instead of
              them.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Diagnostic panel */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="How diagnosis is made"
            heading="A Full Hormonal and Metabolic Picture"
            description="Assessment looks beyond a single number, considering how these markers relate to one another and to your symptoms."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {panel.map((item) => (
              <StaggerItem key={item.label} className="border-t border-border pt-5">
                <h3 className="font-display text-base text-foreground">{item.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Obesity/sleep/fertility framing + when therapy may be considered */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Contributing factors
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Weight, Sleep and Metabolic Health
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Obesity, metabolic syndrome and poor sleep — including
              untreated sleep apnoea — can all lower testosterone
              levels or worsen symptoms. Addressing these factors is
              often part of the picture before, or alongside, any
              hormonal treatment.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              When treatment may be considered
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Treatment Only When Clinically Indicated
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Testosterone treatment is considered only after
              appropriate clinical and biochemical assessment, and only
              when a clear indication is present — never as a default
              response to symptoms alone, and never for bodybuilding or
              performance enhancement.
            </p>
          </div>
        </Container>
      </section>

      {/* Monitoring and safety */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Ongoing care" heading="Monitoring and Safety" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {monitoring.map((item, index) => (
              <StaggerItem key={item}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              As with any hormonal treatment, testosterone therapy
              carries contraindications and risks that are reviewed
              individually before starting and monitored throughout —
              it is not appropriate for every man, and is stopped or
              adjusted if it no longer suits your circumstances.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Male Fertility", href: "/male-fertility" },
          { label: "Varicocele", href: "/male-fertility/varicocele" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Understand the Cause Before Considering Treatment"
        sourcePage={PATH}
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
      />
    </>
  );
}
