import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/mens-health";

export const metadata: Metadata = buildMetadata({
  title: "Men's Health",
  description:
    "Specialist men's health care in Abu Dhabi — testosterone and hormonal health, and related areas, assessed individually before any treatment is considered.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Men's Health", href: PATH },
];

const diagnosticSteps = [
  "Symptoms",
  "Hormonal assessment",
  "Metabolic / medical contributors",
  "Sexual function",
  "Individual treatment strategy",
];

/**
 * Phase R1-R2: "Low Libido" previously linked to `/mens-health/low-libido`,
 * a route whose own status in `lib/seo/routes.ts` is `"planned"` — a
 * live link to a page that doesn't exist. Removed; reduced libido is
 * now folded into the Testosterone row's own description instead.
 * Erectile Dysfunction added as the "contextually appropriate" second
 * link (brief item 16).
 */
const areas = [
  {
    label: "Testosterone & Male Hormonal Health",
    description:
      "Symptoms, diagnosis and when treatment is clinically appropriate — including reduced libido, assessed alongside hormonal, medical and psychosexual factors.",
    href: "/mens-health/testosterone",
  },
  {
    label: "Erectile Dysfunction",
    description:
      "Sexual-function changes are assessed as part of the same hormonal and metabolic picture where relevant.",
    href: "/erectile-dysfunction",
  },
];

const faqItems = [
  {
    question: "Does every symptom mean I have low testosterone?",
    answer:
      "No. Fatigue, low libido and reduced performance can be associated with testosterone deficiency, but they can also have many other causes — assessment looks at the full picture before attributing symptoms to any one cause.",
  },
  {
    question: "Will I automatically be offered treatment?",
    answer:
      "No. Treatment is considered only after appropriate clinical and biochemical assessment, and only when there's a clear indication for it.",
  },
  {
    question: "Is erectile dysfunction always related to hormones?",
    answer:
      "Not always. It can have hormonal, vascular, metabolic, neurological, medication-related and psychosexual contributors — assessment identifies which are relevant for you specifically.",
  },
];

export default function MensHealthPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Men&rsquo;s Health
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Men&rsquo;s Health</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Hormonal, metabolic and sexual-health assessment for men
              experiencing low testosterone, reduced libido, fatigue or
              changes in sexual function.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Diagnostic narrative — Phase R1-R2 */}
      <section className="border-t border-border py-section-y">
        <Container>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How assessment works
          </p>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
            {diagnosticSteps.map((step, index) => (
              <StaggerItem key={step}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 max-w-[18ch] text-sm text-foreground">{step}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Not every symptom means low testosterone, and not every low
            result automatically requires treatment — assessment
            establishes which factors are actually relevant before any
            treatment is discussed.
          </p>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <StaggerGroup className="border-t border-border">
            {areas.map((area) => (
              <StaggerItem key={area.href}>
                <Link
                  href={area.href}
                  className="group flex flex-col gap-2 border-b border-border py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  <span className="font-display text-2xl text-foreground">{area.label}</span>
                  <span className="max-w-sm text-sm text-muted-foreground">{area.description}</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Begin With a Hormonal Health Assessment"
        sourcePage={PATH}
        secondary={{ label: "Explore Testosterone & Male Hormonal Health", href: "/mens-health/testosterone" }}
      />
    </>
  );
}
