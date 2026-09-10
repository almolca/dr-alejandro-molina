import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { ResponseThresholdDiagram } from "@/components/illustrations/ResponseThresholdDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/sexual-medicine/premature-ejaculation";

export const metadata: Metadata = buildMetadata({
  title: "Premature Ejaculation",
  description:
    "Specialist assessment for premature ejaculation in Abu Dhabi — behavioural, psychosexual, medical and procedural options matched to the individual, including hyaluronic acid treatment at the glans in selected cases.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Sexual Medicine", href: "/sexual-medicine" },
  { name: "Premature Ejaculation", href: PATH },
];

/** Contributing factors — assessed together, not as a single cause. */
const factors = [
  {
    label: "Psychological / performance anxiety",
    description:
      "Anxiety about sexual performance, whether longstanding or situational, can itself shorten time to ejaculation.",
  },
  {
    label: "Relationship context",
    description:
      "New relationships, infrequent sexual activity, or relationship stress can all be relevant contributing factors.",
  },
  {
    label: "Sensitivity / response threshold",
    description:
      "Some men have a naturally lower threshold for ejaculatory response, present from the first sexual experiences onward.",
  },
  {
    label: "Erectile dysfunction",
    description:
      "Anxiety about maintaining an erection can independently shorten time to ejaculation — the two are often assessed together.",
  },
  {
    label: "Hormonal or medical factors",
    description:
      "Less commonly, hormonal, prostate-related or neurological factors can contribute and are considered where relevant.",
  },
  {
    label: "Previous experience",
    description:
      "Learned patterns from earlier sexual experiences can play a role, independently of any physical cause.",
  },
];

/** Spec-consistent structure with the ED treatment ladder: options considered, not a fixed sequence. */
const approaches = [
  {
    title: "Behavioural techniques",
    description:
      "Structured techniques, such as stop-start or squeeze approaches, aimed at building awareness and control over time.",
  },
  {
    title: "Psychosexual support",
    description:
      "Considered where performance anxiety, relationship factors or past experience appear to be significant contributors.",
  },
  {
    title: "Medical treatment",
    description:
      "Oral or topical options can be considered after assessment, matched to the pattern involved and any contraindications.",
  },
  {
    title: "Procedural options in selected cases",
    description:
      "A small number of patients may be suitable for a procedural option, discussed individually and only after the approaches above have been considered.",
  },
];

const glansProcedurePoints = [
  "Suitability is assessed individually, based on symptoms, medical history, anatomy and expectations — not offered as a routine or default option.",
  "Goals and realistic limitations are discussed in detail before any procedure is considered.",
  "It is one part of a broader management strategy, not a stand-alone guaranteed solution.",
  "It is only ever discussed alongside the behavioural, psychosexual and medical approaches above, matched to individual assessment findings.",
];

const faqItems = [
  {
    question: "Is premature ejaculation common?",
    answer:
      "Occasional early ejaculation is common and not automatically a medical concern. Assessment focuses on frequency, degree of control, and the distress or difficulty it causes — not on a single timed threshold.",
  },
  {
    question: "What's the difference between lifelong and acquired premature ejaculation?",
    answer:
      "Lifelong premature ejaculation has been present from a man's first sexual experiences onward. Acquired premature ejaculation develops later, often alongside a specific contributing factor. The distinction matters for how it's assessed and approached.",
  },
  {
    question: "Is premature ejaculation linked to erectile dysfunction?",
    answer:
      "It can be. Anxiety about maintaining an erection can independently shorten time to ejaculation, which is why both are assessed together rather than treating either in isolation.",
  },
  {
    question: "What is hyaluronic acid treatment at the glans, and is it right for me?",
    answer:
      "It's a procedural option that may be considered in selected cases as part of a broader management strategy — not the first or only option. Suitability depends on individual assessment and is never assumed in advance.",
  },
  {
    question: "Will I automatically be offered medication or a procedure?",
    answer:
      "No. Treatment is selected according to the pattern involved, contributing factors and individual priorities — behavioural and psychosexual approaches are considered alongside medical and procedural options, not skipped over.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a confidential consultation to understand the pattern involved, any contributing factors, and which approach — or combination of approaches — may be appropriate.",
  },
];

export default function PrematureEjaculationPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Premature Ejaculation",
            description:
              "Specialist assessment for premature ejaculation — behavioural, psychosexual, medical and procedural options matched to the individual.",
            path: PATH,
            aboutType: "MedicalCondition",
            aboutName: "Premature Ejaculation",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero — the editorial image is part of the composition itself, not a separate block below */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Sexual Medicine
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-display-xl text-foreground">
                Premature Ejaculation
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                Specialist assessment for ejaculation that happens sooner
                than wanted, with treatment considered across
                behavioural, psychosexual, medical and procedural
                options — matched to the individual, not a single
                default approach.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="premature_ejaculation" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
                <a
                  href="#treatment-approach"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  See the treatment approach
                </a>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="peHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* What it is */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="What it is"
            heading="Reduced Control Over When Ejaculation Happens"
            size="md"
            description="Premature ejaculation refers to ejaculation that happens sooner than a man or his partner would like, often with little perceived control, and with associated distress."
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Not a single timed threshold
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Occasional early ejaculation is common and not automatically
              a medical concern. Assessment focuses on{" "}
              <strong className="text-foreground">frequency</strong>,{" "}
              <strong className="text-foreground">degree of control</strong>,
              and the{" "}
              <strong className="text-foreground">distress or difficulty</strong>{" "}
              it causes — not on comparing against a fixed number.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Contributing factors — ResponseThresholdDiagram lives here now, away from the hero's raster image */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow="Why assessment matters" heading="Several Factors Can Contribute" />
          <Reveal delay={0.05} className="mt-10 flex justify-center sm:justify-start">
            <ResponseThresholdDiagram className="h-24 w-24 text-muted-foreground" />
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {factors.map((factor) => (
              <StaggerItem key={factor.label} className="border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{factor.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{factor.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Treatment approach — dark section, this page's one dark moment */}
      <section id="treatment-approach" className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="Treatment approach" heading="Matched to the Individual, Not a Fixed Sequence" />
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Not every man needs every approach, and there is no single
            correct starting point — the approach depends on whether the
            pattern is lifelong or acquired, whether erectile dysfunction
            is also present, and personal and relationship factors.
          </p>

          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {approaches.map((step, index) => (
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

      {/* Selected procedural option — hyaluronic acid at the glans. Deliberately
          plain, text-led, with no illustration or visual emphasis, so this
          reads as one clinically-gated option among several — not a
          promoted or advertised procedure. */}
      <section className="border-t border-border py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Selected procedural option
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            Hyaluronic Acid Treatment at the Glans
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            In selected cases, hyaluronic acid treatment at the glans may
            be considered as part of a broader management strategy for
            premature ejaculation. This is not the first or only option,
            is not suitable for every patient, and is only considered
            after assessment has clarified the pattern involved and the
            approaches above have been discussed.
          </p>
          <ul className="mt-8 space-y-4 border-t border-border pt-8">
            {glansProcedurePoints.map((point) => (
              <li key={point} className="flex gap-4 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          Every approach — behavioural, psychosexual, medical or
          procedural — is considered on individual assessment, never
          assumed from a general description alone.
        </PullQuote>
      </Container>

      {/* Why specialist care */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Why specialist care
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            {doctor.displayName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Premature ejaculation is assessed within a Consultant
            Urologist &amp; Andrologist&rsquo;s practice, alongside
            related sexual and hormonal health — since erectile
            function, hormonal factors and psychosexual context can all
            be relevant to the same presentation.
          </p>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Sexual Medicine", href: "/sexual-medicine" },
          { label: "About Dr. Molina", href: "/about" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Start With an Individual Assessment"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
      />
    </>
  );
}
