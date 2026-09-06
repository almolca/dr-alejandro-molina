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

const PATH = "/male-aesthetics/penile-filler-correction";
const BOOKING_LABEL = "Book a Confidential Consultation";

export const metadata: Metadata = buildMetadata({
  title: "Penile Filler Correction",
  description:
    "Specialist assessment in Abu Dhabi for asymmetry, irregular contour, nodules or migration following previous penile filler treatment — evaluated by Dr. Alejandro Molina, Consultant Urologist & Andrologist, with dissolution or revision considered where appropriate.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Genital Aesthetics", href: "/male-aesthetics" },
  { name: "Penile Filler Correction", href: PATH },
];

const presentations = [
  {
    label: "Asymmetry",
    description: "An uneven result between one side and the other, or along the length of the shaft.",
  },
  {
    label: "Irregular contour",
    description: "Areas that feel or appear uneven, lumpy, or inconsistent with the surrounding tissue.",
  },
  {
    label: "Nodules",
    description: "Discrete firm areas that can develop at the injection site over time.",
  },
  {
    label: "Migration",
    description: "Product that has moved from its original treatment area.",
  },
  {
    label: "Uneven distribution",
    description: "Product concentrated unevenly rather than distributed as originally planned.",
  },
  {
    label: "Persistent swelling",
    description: "Swelling that hasn't resolved within an expected settling period, where clinically relevant.",
  },
];

const correctionOptions = [
  {
    label: "Observation",
    description:
      "Not every irregularity requires active intervention. Where a finding is minor or likely to resolve on its own, monitoring may be the more appropriate first step.",
  },
  {
    label: "Dissolution",
    description:
      "Where appropriate, hyaluronic acid-based filler can be dissolved. Whether this is suitable — and what result to expect afterward — depends on the individual presentation and is assessed rather than assumed.",
  },
  {
    label: "Revision or re-treatment",
    description:
      "Where dissolution alone wouldn't address the concern, or a revised result is wanted, further treatment is planned individually around the current anatomy — not as a standard follow-on step.",
  },
];

const afterConsiderations = [
  {
    title: "Risks",
    description:
      "As with any corrective procedure, risks can include further swelling, bruising, temporary asymmetry during the correction process, or an outcome that doesn't fully resolve the original concern. These are reviewed individually, based on the option considered.",
  },
  {
    title: "Follow-up",
    description:
      "Correction, where undertaken, is followed by review to assess how the area has settled — not treated as a single isolated procedure with no further contact.",
  },
  {
    title: "What may not be fully correctable",
    description:
      "Some changes — particularly longstanding tissue changes — may not be fully reversible. This is discussed honestly at assessment, rather than implying every presentation can be fully resolved.",
  },
];

const faqItems = [
  {
    question: "When should I have previous penile filler assessed?",
    answer:
      "If you notice asymmetry, an irregular or lumpy contour, migration, uneven distribution, or swelling that hasn't settled as expected, that's generally a reasonable reason to seek assessment — regardless of where the original treatment was performed.",
  },
  {
    question: "Can penile filler migrate?",
    answer:
      "Yes — product can move from its original treatment area, which is one of the presentations assessment looks for. This is a different pattern from the normal, gradual settling that follows treatment, and it's assessed individually rather than assumed from a general description.",
    readMoreHref: "/insights/penile-filler-migration-what-to-know",
    readMoreLabel: "Read more: Penile Filler Migration — What Patients Should Know",
  },
  {
    question: "Can all penile filler problems be corrected?",
    answer:
      "Not every presentation can be fully corrected. Some irregularities respond well to dissolution or revision; others, particularly longstanding tissue changes, may only partially improve. This is assessed and discussed individually, not assumed either way.",
  },
  {
    question: "Is dissolution always the right approach?",
    answer:
      "No. Dissolution is one option among several, and its suitability depends on the specific presentation. In some cases, observation or a different approach may be more appropriate.",
  },
  {
    question: "Will you need to use ultrasound?",
    answer:
      "Ultrasound may be used where it helps clarify the location, extent or nature of a finding — particularly for firmness, suspected migration, or when the clinical picture isn't clear from examination alone. It isn't used routinely for every presentation.",
  },
  {
    question: "Do you need to know where my original treatment was performed?",
    answer:
      "It's helpful context, but assessment focuses on your current anatomy and presentation — not on evaluating or criticising the original provider or treatment.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a confidential consultation to assess the current presentation, discuss what may or may not be appropriate, and plan next steps individually.",
  },
];

export default function PenileFillerCorrectionPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Filler Correction",
            description:
              "Specialist assessment for asymmetry, irregular contour, nodules, migration or dissatisfaction following previous penile filler treatment, with dissolution or revision considered where appropriate.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Filler Correction",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Male Genital Aesthetics
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Penile Filler Correction
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Specialist assessment in Abu Dhabi for men experiencing
              asymmetry, irregularity, migration or dissatisfaction
              following previous penile filler treatment — whether
              performed here or elsewhere — evaluated by a Consultant
              Urologist &amp; Andrologist who assesses both the
              cosmetic result and the underlying anatomy.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                {BOOKING_LABEL}
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Common presentations — complications covered here as a substantial section, not a separate page */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="Common presentations" heading="What May Prompt an Assessment" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {presentations.map((item) => (
              <StaggerItem key={item.label}>
                <h3 className="font-display text-lg text-foreground">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Assessment — when it may help + what it involves */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              When assessment may help
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Not Every Concern Needs Immediate Action
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Assessment is generally worth considering when there&rsquo;s
              asymmetry, an irregular contour, a new nodule, suspected
              migration, or swelling that hasn&rsquo;t settled as expected.
              Some findings are minor and simply monitored; others
              benefit from a specific plan.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              What assessment involves
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              History, Examination and Imaging Where Useful
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Assessment starts with history and examination. Ultrasound
              may be used where it helps clarify a finding — particularly
              for firmness, suspected migration, or an unclear clinical
              picture — rather than as a routine step for every patient.
            </p>
          </div>
        </Container>
      </section>

      {/* Correction options — observation, dissolution, revision */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow="Options considered" heading="What Can Be Done, and When" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {correctionOptions.map((option, index) => (
              <StaggerItem key={option.label}>
                <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[2fr_3fr] sm:gap-16">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">
                      {option.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Realistic expectations — dark section, this page's one dark moment */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Realistic expectations
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Assessed on its own merits — not through criticism of any
              prior provider or treatment.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Every presentation is evaluated on its current anatomy and
              findings, regardless of where or by whom the original
              treatment was performed. Correction options depend on the
              specific presentation, and no specific outcome — including
              complete resolution of every irregularity — can be
              guaranteed.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Risks, follow-up, limitations */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Before and after" heading="Risks, Follow-Up and Limitations" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {afterConsiderations.map((item) => (
              <Reveal key={item.title}>
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "Male Genital Aesthetics", href: "/male-aesthetics" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "About Dr. Molina", href: "/about" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Your Previous Treatment"
        sourcePage={PATH}
        secondary={{ label: "Back to Male Genital Aesthetics", href: "/male-aesthetics" }}
        bookingLabel={BOOKING_LABEL}
      />
    </>
  );
}
