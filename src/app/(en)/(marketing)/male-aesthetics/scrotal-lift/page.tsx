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

const PATH = "/male-aesthetics/scrotal-lift";

export const metadata: Metadata = buildMetadata({
  title: "Scrotal Lift",
  description:
    "Scrotal aesthetic surgery in Abu Dhabi for excess or lax scrotal skin — specialist assessment, individualized surgical planning, and a realistic discussion of scarring, recovery and limitations.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Genital Aesthetics", href: "/male-aesthetics" },
  { name: "Scrotal Lift", href: PATH },
];

const strapline = ["Anatomy-led", "Medically supervised", "Individually planned"];

const causes = [
  {
    label: "Excess or lax scrotal skin",
    description:
      "The most common reason for consultation — skin laxity can develop with age, weight change, or after significant weight loss, and is assessed on an individual basis.",
  },
  {
    label: "Asymmetry or discomfort",
    description:
      "Some men present with asymmetry, chafing, or discomfort related to excess tissue, which is reviewed alongside anatomy and goals at consultation.",
  },
];

const process = [
  {
    title: "Assessment",
    description:
      "Consultation begins with an examination of scrotal anatomy, skin quality and any contributing factors, alongside your goals and medical history.",
  },
  {
    title: "Individualized surgical planning",
    description:
      "Where surgery is appropriate, the approach — including incision and scar placement — is planned around your specific anatomy, not a standard template.",
  },
  {
    title: "Recovery",
    description:
      "Recovery expectations, activity restrictions and follow-up are discussed in detail beforehand, specific to the plan agreed at consultation.",
  },
];

const faqItems = [
  {
    question: "What is a scrotal lift?",
    answer:
      "Scrotal lift, or scrotal aesthetic surgery, addresses excess or lax scrotal skin through an individually planned surgical approach — assessed and performed within a urological and andrological context, not as a generic cosmetic procedure.",
  },
  {
    question: "Will there be visible scarring?",
    answer:
      "Some scarring is an expected part of any scrotal surgery. Its likely placement, appearance and how it tends to settle over time are discussed in detail during consultation, alongside your individual anatomy.",
  },
  {
    question: "How long is recovery?",
    answer:
      "Recovery varies between individuals and depends on the extent of surgery performed. General timelines and activity restrictions are discussed at consultation rather than quoted here in isolation.",
  },
  {
    question: "What are the limitations of this procedure?",
    answer:
      "As with any surgical procedure, results have limitations and cannot be guaranteed. Swelling, asymmetry, altered sensation and scarring are among the risks reviewed individually before proceeding.",
  },
  {
    question: "Can this be combined with penile girth enhancement?",
    answer:
      "Some men raise both concerns at the same consultation. Whether combining procedures is appropriate depends on individual anatomy and is assessed case by case — it is not assumed by default.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a consultation to assess anatomy, goals and suitability before any surgical plan is discussed.",
  },
];

export default function ScrotalLiftPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Scrotal Lift",
            description:
              "Scrotal aesthetic surgery for excess or lax scrotal skin, with individualized surgical planning based on anatomy, goals and realistic expectations.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Scrotal Lift",
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
              Scrotal Lift
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Scrotal aesthetic surgery for excess or lax scrotal skin,
              with individualized surgical planning based on anatomy,
              goals and realistic expectations.
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
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="male_aesthetics" size="lg">
                Book a Confidential Consultation
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Common reasons for consultation */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="Common reasons for consultation" heading="Why Men Consider a Scrotal Lift" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {causes.map((item) => (
              <StaggerItem key={item.label}>
                <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-[1fr_2fr] sm:gap-16">
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {item.label}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Process */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="How this works" heading="Assessment, Planning and Recovery" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {process.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Scarring, recovery and limitations — olive, this page's one distinctive tonal moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              A realistic discussion
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Scarring, recovery and limitations are discussed openly.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Scar placement, expected recovery time, altered sensation
              and the limits of what surgery can achieve are reviewed in
              detail before any decision is made. As with any surgical
              procedure, results vary between individuals and specific
              outcomes cannot be guaranteed.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "Male Genital Aesthetics", href: "/male-aesthetics" },
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
