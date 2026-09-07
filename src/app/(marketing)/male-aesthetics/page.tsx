import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/male-aesthetics";

export const metadata: Metadata = buildMetadata({
  title: "Male Genital Aesthetics",
  description:
    "Specialist urological and andrological assessment in Abu Dhabi for men considering penile enhancement or revision of previous treatment — anatomy-led, medically supervised. Flagship procedure: penile girth enhancement with hyaluronic acid.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Genital Aesthetics", href: PATH },
];

/**
 * Girth Enhancement's authority line — config-driven per Phase A;
 * simply omitted from the sentence if either field is unset.
 */
const girthAuthorityLine = [
  doctor.girthProcedureCount !== undefined && `${doctor.girthProcedureCount} procedures performed`,
  doctor.girthEnhancementSince !== undefined && `experience since ${doctor.girthEnhancementSince}`,
]
  .filter((part): part is string => Boolean(part))
  .join(", ");

const focusAreas = [
  {
    title: "Penile Girth Enhancement",
    description:
      "The flagship procedure at this practice, and the most common goal raised at consultation. Hyaluronic acid penile augmentation is the more commonly discussed starting point, planned around individual anatomy — not a walk-in cosmetic procedure — with surgical approaches considered only where appropriate." +
      (girthAuthorityLine ? ` Dr. Molina's ${girthAuthorityLine}.` : ""),
    cta: { label: "Explore Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
  },
  {
    title: "Scrotal Lift",
    description:
      "Scrotal aesthetic surgery for men with excess or lax scrotal skin. Assessment and surgical planning are individualized, with scar placement, recovery and limitations discussed in detail.",
    cta: { label: "Explore Scrotal Lift", href: "/male-aesthetics/scrotal-lift" },
  },
  {
    title: "Penile Filler Correction",
    description:
      "Men who have previously had penile filler — here or elsewhere — sometimes present with asymmetry, nodules, irregularity, migration or dissatisfaction with prior results. These cases are assessed individually, with dissolution or revision considered where appropriate.",
    cta: { label: "Explore Penile Filler Correction", href: "/male-aesthetics/penile-filler-correction" },
  },
];

const faqItems = [
  {
    question: "Is this the same as generic cosmetic filler treatment?",
    answer:
      "No. Male genital aesthetics is approached within an andrology and urology context, with a full anatomical and medical assessment — not a generic walk-in cosmetic procedure.",
  },
  {
    question: "What if I've had filler elsewhere that I'm not happy with?",
    answer:
      "Previous filler problems — including asymmetry, nodules or irregularity — are assessed individually, with revision considered where appropriate.",
  },
  {
    question: "Are surgical options available?",
    answer:
      "Surgical approaches are considered only where appropriate and approved, and discussed individually at consultation — not offered as a default option. Scrotal lift, for men with excess or lax scrotal skin, is one such surgical option.",
  },
  {
    question: "Can a specific result be guaranteed?",
    answer:
      "No specific outcome can be guaranteed. Individual results vary, and realistic expectations are discussed in detail as part of assessment.",
  },
  {
    question: "How does the process start?",
    answer:
      "The process begins with a medical consultation to assess anatomy, goals and suitability before any option is discussed further.",
  },
];

export default function MaleAestheticsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Male Genital Aesthetics",
            description:
              "Specialist urological and andrological assessment for men considering penile enhancement or revision of previous treatment.",
            path: PATH,
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero — image left this time, for rhythm distinct from the Implant page's image-right split.
          order-last on mobile: H1/positioning before the placeholder image, even though the
          image sits left on desktop (lg:order-first) — found in the Phase 5 UX audit. */}
      <section className="py-section-y">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last aspect-[4/5] w-full border border-border bg-surface lg:order-first">
            <ImagePlaceholder index="§13" label="Editorial imagery pending" />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Male Genital Aesthetics
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                Male Genital Aesthetics
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
                Specialist urological and andrological assessment for
                men considering penile enhancement or revision of
                previous treatment.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Consultation framing */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-display text-display-md text-foreground">
              Individual assessment, not a menu of procedures.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Every consultation starts with goals and anatomy — what
              you would like to improve, and what is realistic given
              your individual anatomy — before any specific option is
              discussed.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Focus areas — alternating editorial rows, distinct from every other page's grid/list patterns */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Areas of focus" heading="What This Covers" />
          <div className="mt-14 border-t border-border">
            {focusAreas.map((area, index) => (
              <Reveal key={area.title} delay={index * 0.05}>
                <div
                  className={`grid gap-4 border-b border-border py-10 md:grid-cols-2 md:gap-16 ${
                    index % 2 === 1 ? "md:text-right" : ""
                  }`}
                >
                  <h3
                    className={`font-display text-2xl text-foreground md:text-3xl ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    {area.title}
                  </h3>
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:ml-auto">
                      {area.description}
                    </p>
                    {area.cta && (
                      <Link
                        href={area.cta.href}
                        className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                      >
                        {area.cta.label}
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why specialist assessment matters + risks — olive, this page's one distinctive tonal moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Why specialist assessment matters
            </p>
            <p className="mt-6 text-body-lg text-foreground">
              Penile anatomy varies significantly between individuals.
              Treatment planned without a proper anatomical and medical
              assessment carries a greater risk of asymmetry,
              irregularity or dissatisfaction.
            </p>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              As with any aesthetic or augmentation procedure,
              individual results vary and cannot be guaranteed. Risks
              depend on the specific approach considered, and are
              reviewed in detail during consultation alongside what can
              realistically be expected.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "Scrotal Lift", href: "/male-aesthetics/scrotal-lift" },
          { label: "Penile Filler Correction", href: "/male-aesthetics/penile-filler-correction" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Begin With a Medical Consultation"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{
          label: "Explore Penile Girth Enhancement",
          href: "/male-aesthetics/penile-girth-enhancement",
        }}
      />
    </>
  );
}
