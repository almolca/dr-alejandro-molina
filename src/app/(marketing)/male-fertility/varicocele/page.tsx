import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/male-fertility/varicocele";

export const metadata: Metadata = buildMetadata({
  title: "Varicocele",
  description:
    "Varicocele assessment in Abu Dhabi — clinical vs. ultrasound-detected varicocele, fertility relevance, observation and when intervention may be considered.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Fertility", href: "/male-fertility" },
  { name: "Varicocele", href: PATH },
];

const faqItems = [
  {
    question: "Does every varicocele need treatment?",
    answer:
      "No. Many varicoceles are simply observed, particularly when there are no symptoms and fertility is not currently a concern. An ultrasound finding on its own is not treated in isolation.",
  },
  {
    question: "Will treating a varicocele guarantee improved fertility?",
    answer:
      "No specific outcome can be guaranteed. Many men with a varicocele have normal fertility, and response to any intervention varies between individuals.",
  },
  {
    question: "What's the difference between a clinical and subclinical varicocele?",
    answer:
      "A clinical varicocele can be felt on physical examination. A subclinical varicocele is only visible on ultrasound. This distinction affects how significant the finding is considered to be.",
  },
  {
    question: "Is a varicocele always painful?",
    answer:
      "No. Some men experience discomfort, particularly after standing for long periods; many have no symptoms at all and the varicocele is found incidentally.",
  },
];

export default function VaricocelePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Varicocele",
            description:
              "Assessment of varicocele — clinical vs. ultrasound-detected, fertility relevance, observation and when intervention may be considered.",
            path: PATH,
            aboutType: "MedicalCondition",
            aboutName: "Varicocele",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Male Fertility
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Varicocele
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              An enlargement of veins within the scrotum, similar to
              varicose veins elsewhere in the body. It is a common
              finding, and not every varicocele requires treatment.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                Book a Specialist Assessment
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Clinical vs ultrasound + fertility relevance */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              How it&rsquo;s found
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Clinical vs. Ultrasound-Detected
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              A varicocele may be found on physical examination — a
              clinical varicocele — or only be visible on ultrasound,
              known as subclinical. This distinction matters, since not
              every ultrasound finding carries the same significance.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Fertility and function
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Relevance to Fertility and Testicular Function
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Varicoceles can, in some men, affect semen parameters and
              testicular function over time. Many men with a varicocele
              have normal fertility, and its presence alone does not
              predict infertility.
            </p>
          </div>
        </Container>
      </section>

      {/* Symptoms + observation vs intervention */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Symptoms
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Pain Is Not Universal
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Some men experience discomfort or a dragging sensation,
              particularly after standing for long periods. Many others
              have no symptoms at all, and the varicocele is found
              incidentally.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Management
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Observation vs. Intervention
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Many varicoceles are simply observed, particularly when
              there are no symptoms and fertility is not currently a
              concern. Intervention may be considered where there is
              pain, a clear effect on semen parameters, or testicular
              size concerns.
            </p>
          </div>
        </Container>
      </section>

      {/* Restraint — dark, this page's one distinctive moment */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              An imaging finding, not a verdict
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Findings, not decisions in isolation.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              An ultrasound finding on its own is not treated in
              isolation. Whether intervention is appropriate depends on
              symptoms, fertility goals, semen analysis and clinical
              examination together — assessed as a whole, not from
              imaging alone.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Male Fertility", href: "/male-fertility" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Whether Intervention Is Right for You"
        sourcePage={PATH}
        secondary={{ label: "Back to Male Fertility", href: "/male-fertility" }}
      />
    </>
  );
}
