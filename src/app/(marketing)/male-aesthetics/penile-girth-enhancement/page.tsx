import type { Metadata } from "next";
import Link from "next/link";
import { doctor } from "@/config/doctor";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/male-aesthetics/penile-girth-enhancement";

export const metadata: Metadata = buildMetadata({
  title: "Penile Girth Enhancement",
  description:
    "Specialist penile girth enhancement in Abu Dhabi with Dr. Alejandro Molina, Consultant Urologist & Andrologist — 500+ procedures performed, experience since 2018. Anatomy-led, hyaluronic acid and surgical options, realistic expectations.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Genital Aesthetics", href: "/male-aesthetics" },
  { name: "Penile Girth Enhancement", href: PATH },
];

const strapline = ["Anatomy-led", "Medically supervised", "Individually planned"];

const options = [
  {
    label: "Non-surgical: hyaluronic acid",
    description:
      "Hyaluronic acid is injected to increase girth, planned according to individual anatomy. Technique, product choice and aftercare all affect the result, and treatment is carried out within a medical, andrology-led context — the more commonly discussed starting point at consultation.",
  },
  {
    label: "Surgical approaches",
    description:
      "Surgical approaches to penile augmentation are only offered where currently approved and clinically appropriate, and are discussed individually — not assumed as a starting point.",
  },
];

const afterConsiderations = [
  {
    title: "Risks",
    description:
      "As with any augmentation procedure, risks can include swelling, bruising, asymmetry, irregularity, or dissatisfaction with the outcome achieved. These are reviewed individually, based on the option considered.",
  },
  {
    title: "Aftercare",
    description:
      "Aftercare guidance is provided following any procedure and is specific to the option chosen, discussed as part of your individual treatment plan.",
  },
  {
    title: "Revision / correction",
    description:
      "Where a patient is not satisfied with a previous procedure — whether performed here or elsewhere — revision is assessed individually, considering the original treatment and current anatomy.",
    href: "/male-aesthetics/penile-filler-correction",
    linkLabel: "Explore Penile Filler Correction",
  },
];

const faqItems = [
  {
    question: "Is penile girth enhancement safe?",
    answer:
      "No aesthetic or medical procedure is entirely risk-free. Performed within a Consultant Urologist & Andrologist's practice, with anatomy-led assessment beforehand, risks such as swelling, bruising, asymmetry or irregularity are discussed and reviewed individually — not eliminated. See Risks, Aftercare and Revision below for detail.",
  },
  {
    question: "How much size increase can I expect?",
    answer:
      "Specific outcome measurements aren't published here, since results depend on individual anatomy, technique and the option chosen. This is discussed in detail, and in context, at consultation.",
    readMoreHref: "/insights/how-much-girth-can-penile-filler-add",
    readMoreLabel: "Read more: How Much Girth Can Penile Filler Actually Add?",
  },
  {
    question: "Is this surgical or non-surgical?",
    answer:
      "Both are considered. Non-surgical options, including hyaluronic acid-based augmentation, are more commonly discussed first; surgical approaches are only offered where currently approved and clinically appropriate.",
  },
  {
    question: "What if I've had a bad experience with filler elsewhere?",
    answer:
      "Previous procedures, including those performed elsewhere, are assessed individually — revision is considered where appropriate.",
    readMoreHref: "/male-aesthetics/penile-filler-correction",
    readMoreLabel: "Explore Penile Filler Correction",
  },
  {
    question: "Is the result permanent?",
    answer:
      "This depends on the option chosen and is discussed individually. Hyaluronic acid-based results are not typically permanent, for example, while other options may differ.",
    readMoreHref: "/insights/how-long-does-penile-filler-last",
    readMoreLabel: "Read more: How Long Does Penile Filler Last?",
  },
  {
    question: "What does aftercare involve?",
    answer:
      "Aftercare guidance is specific to the procedure performed and is provided as part of your individual treatment plan.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a consultation to assess anatomy, goals and suitability before any option is planned.",
  },
];

export default function PenileGirthEnhancementPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Girth Enhancement",
            description:
              "A specialist medical approach to penile augmentation, with treatment planning based on anatomy, goals and realistic expectations.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Girth Enhancement",
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
              Penile Girth Enhancement
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              A specialist medical approach to penile augmentation, with
              treatment planning based on anatomy, goals and realistic
              expectations.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {strapline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                Book a Confidential Consultation
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Authority block — procedure-specific experience first for this page (Phase A brief) */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <AuthorityBlock />
        </Container>
      </section>

      {/* What patients want + consultation/anatomy */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Common goals
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Size, Confidence and Symmetry
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Men considering penile girth enhancement typically want to
              address concerns about size, confidence or symmetry —
              goals that are discussed openly and without judgment at
              consultation.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Consultation and anatomy
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Planning Starts With Your Anatomy
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Treatment planning begins with an assessment of individual
              anatomy, medical history and goals. What may be suitable
              varies significantly from one patient to another.
            </p>
          </div>
        </Container>
      </section>

      {/* Options — non-surgical first-line, surgical only where approved */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Options considered" heading="Non-Surgical First, Surgical Only Where Appropriate" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {options.map((option, index) => (
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

      {/* Pull quote — Phase R2.1/R3 */}
      <Container className="max-w-2xl py-14">
        <PullQuote>
          Results depend on anatomy, technique and the option chosen —
          outcomes are discussed individually, never promised in advance.
        </PullQuote>
      </Container>

      {/* Expected variability — dark section, this page's one dark moment, used to give the "no numbers" honesty real weight */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Expected variability
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Results vary between individuals.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Outcomes depend on anatomy, technique and the option
              chosen. Specific outcome measurements are not quoted here
              — they are discussed individually, and in context, at
              consultation, rather than promised in advance.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Risks, aftercare, revision */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Before and after" heading="Risks, Aftercare and Revision" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {afterConsiderations.map((item) => (
              <Reveal key={item.title}>
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                {item.href && item.linkLabel && (
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    {item.linkLabel}
                  </Link>
                )}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* About Dr. Molina — brief §11: performed by a Consultant, not a generic injector */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              About
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {doctor.displayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Penile girth enhancement is performed within a Consultant
              Urologist &amp; Andrologist&rsquo;s practice
              {doctor.yearsOfExperience !== undefined &&
                ` — ${doctor.yearsOfExperience}+ years of experience in Urology`}
              {doctor.girthEnhancementSince !== undefined &&
                `, performing penile girth enhancement since ${doctor.girthEnhancementSince}`}
              . {doctor.medicalTrainer?.description}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              About {doctor.displayName}
            </Link>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Male Genital Aesthetics", href: "/male-aesthetics" },
          { label: "Penile Filler Correction", href: "/male-aesthetics/penile-filler-correction" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Your Anatomy and Goals"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Back to Male Genital Aesthetics", href: "/male-aesthetics" }}
      />
    </>
  );
}
