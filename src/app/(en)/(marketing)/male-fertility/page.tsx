import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/male-fertility";

export const metadata: Metadata = buildMetadata({
  title: "Male Fertility",
  description:
    "Specialist male fertility assessment in Abu Dhabi — history, semen analysis, hormonal evaluation and imaging, identifying contributing factors before any treatment is considered.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Fertility", href: PATH },
];

const historyExam = [
  "Fertility history — including duration trying to conceive and relevant past medical history",
  "Physical examination",
];

const labsImaging = [
  "Semen analysis",
  "Hormonal evaluation",
  "Ultrasound, where appropriate",
];

const findings = [
  { label: "Varicocele", href: "/male-fertility/varicocele" },
  { label: "Abnormal semen parameters", href: undefined },
  { label: "Male-factor infertility", href: undefined },
  { label: "Sperm DNA fragmentation, where clinically relevant", href: undefined },
];

const contributors = [
  {
    title: "Lifestyle and metabolic",
    description:
      "Weight, activity levels, smoking, alcohol and metabolic health can all influence semen parameters and hormonal balance.",
  },
  {
    title: "Medication and hormonal",
    description:
      "Certain medications and hormonal imbalances — including testosterone-related factors — can affect fertility and are reviewed as part of assessment.",
  },
];

const faqItems = [
  {
    question: "Does an abnormal semen analysis mean I need treatment?",
    answer:
      "Not necessarily. Findings are interpreted as part of a full evaluation — history, examination, hormonal assessment and imaging where relevant — not from a single test result in isolation.",
  },
  {
    question: "What if a varicocele is found on ultrasound?",
    answer:
      "Not every varicocele found on imaging requires treatment. Its relevance to fertility and testicular function is assessed individually.",
  },
  {
    question: "Will I need surgery?",
    answer:
      "Most men do not. Where a surgical option such as varicocele repair is clinically appropriate, it is considered as part of a wider evaluation. Some causes of infertility are addressed through further reproductive treatment — including surgical sperm retrieval in select cases — which sits outside this practice's services and is coordinated with assisted reproduction teams when required.",
  },
  {
    question: "Do you work with fertility clinics?",
    answer:
      "There is no formal partnership with a specific fertility clinic or IVF center. Where assisted reproduction is relevant, assessment and findings support multidisciplinary fertility care — coordinating with assisted reproduction teams as needed.",
  },
];

export default function MaleFertilityPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Male Fertility",
            description:
              "Specialist assessment of male fertility, combining history, examination, semen analysis and hormonal evaluation to identify contributing factors.",
            path: PATH,
            aboutType: "MedicalCondition",
            aboutName: "Male Infertility",
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
              Male Fertility
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Specialist assessment combining history, examination,
              semen analysis and hormonal evaluation to identify
              contributing factors and guide next steps.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="fertility" size="lg">
                Book a Male Fertility Consultation
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How assessment works */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="How assessment works" heading="History and Examination, Laboratory and Imaging" />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                History &amp; examination
              </p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6">
                {historyExam.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Laboratory &amp; imaging
              </p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6">
                {labsImaging.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Common findings */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Common findings" heading="What Assessment May Identify" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {findings.map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-wrap items-center justify-between gap-4 py-6">
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {item.label}
                  </span>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                    >
                      Learn more
                    </Link>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Contributing factors */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {contributors.map((item) => (
            <Reveal key={item.title}>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Contributing factors
              </p>
              <h2 className="mt-4 font-display text-display-md text-foreground">{item.title}</h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Beyond assessment — olive, this page's one distinctive moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Beyond assessment
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Fertility preservation and collaborative care.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Where relevant, fertility preservation is discussed as
              part of your individual circumstances. Assessment
              supports multidisciplinary fertility care, coordinating
              with assisted reproduction teams when required — there is
              no formal partnership with a specific clinic or center.
              Further reproductive treatment, including surgical sperm
              retrieval, is recognized as an option within reproductive
              medicine for select diagnoses; where relevant to
              understanding your pathway, this is discussed
              educationally, though it is not a service offered
              directly here. Not every abnormal test result requires
              treatment; findings are always interpreted as part of a
              full evaluation.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Varicocele", href: "/male-fertility/varicocele" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Insights", href: "/insights" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection heading="Begin With a Fertility Assessment" sourcePage={PATH} />
    </>
  );
}
