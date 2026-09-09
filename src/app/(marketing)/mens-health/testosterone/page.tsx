import type { Metadata } from "next";
import Image from "next/image";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { HormoneBalanceDiagram } from "@/components/illustrations/HormoneBalanceDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import { publications } from "@/config/reputation";
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

const PATH = "/mens-health/testosterone";

export const metadata: Metadata = buildMetadata({
  title: "Testosterone & Male Hormonal Health in Abu Dhabi",
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

const approachPillars = [
  {
    title: "Symptoms and biochemistry, together",
    description: "A number on its own is not a diagnosis, and neither are symptoms alone. The two are read together, because either in isolation can mislead.",
  },
  {
    title: "Free testosterone and SHBG in context",
    description: "Total testosterone alone can be misleading. SHBG affects how much is actually biologically available, which is why free testosterone and SHBG are interpreted together rather than total testosterone in isolation.",
  },
  {
    title: "Looking beyond the number itself",
    description: "Pituitary hormones (LH/FSH) and prolactin help identify where in the hormonal axis a pattern originates — not just whether a single figure is low.",
  },
  {
    title: "Metabolic and sleep context",
    description: "Obesity, insulin resistance and untreated sleep apnoea can all lower testosterone or mimic its symptoms. Treating the number without addressing these is treating the wrong problem.",
  },
  {
    title: "Fertility plans checked first",
    description: "Some hormonal treatments can affect fertility. This is asked about, and factored in, before any treatment begins — not discovered afterward.",
  },
  {
    title: "Monitoring, not a one-time prescription",
    description: "Treatment, where appropriate, is followed with regular review and bloodwork — not started and left unmonitored.",
  },
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
    readMoreHref: "/insights/trt-who-is-it-for",
    readMoreLabel: "Read more: Testosterone Replacement Therapy, Who Is It For?",
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
  {
    question: "What's the difference between free and total testosterone?",
    answer:
      "Total testosterone measures all the testosterone in your blood, including the portion bound to SHBG and unavailable for the body to use. Free testosterone measures only the unbound, biologically active portion — which is why the two are interpreted together rather than total testosterone alone.",
    readMoreHref: "/insights/shbg-and-free-testosterone-explained",
    readMoreLabel: "Read more: SHBG and Free Testosterone Explained",
  },
  {
    question: "Testosterone injections or gel — which is used?",
    answer:
      "Both are established delivery methods, and the choice depends on individual preference, lifestyle and how your levels respond — not a one-size-fits-all decision. They differ in how often they're used and how levels fluctuate between doses, which is part of what's discussed when choosing between them.",
  },
  {
    question: "Does treatment affect hematocrit or blood count?",
    answer:
      "Testosterone treatment can raise red blood cell count (hematocrit), which is one of the specific markers checked with regular bloodwork while on treatment — not something reviewed only if symptoms appear. If levels rise outside a safe range, treatment is adjusted or paused rather than continued unchanged.",
  },
  {
    question: "Does testosterone treatment affect the prostate or PSA?",
    answer:
      "PSA and prostate health are checked before starting treatment and monitored alongside it, as standard practice for any testosterone treatment — one of the safety markers referred to in ongoing monitoring, not a separate afterthought.",
  },
  {
    question: "Is low testosterone linked to erectile dysfunction?",
    answer:
      "It can be, though it's rarely the only factor — an erection depends primarily on vascular and neurological mechanisms, with testosterone contributing to libido and supporting parts of the process. This is why the two are assessed together rather than assuming a low reading explains erectile symptoms on its own.",
    readMoreHref: "/insights/testosterone-and-erectile-dysfunction",
    readMoreLabel: "Read more: Testosterone and Erectile Dysfunction",
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

      {/* Hero — left-aligned split, image beside copy in the first viewport (distinct rhythm from ED's narrower media column and Implant's split) */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Men&rsquo;s Health
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                <AmpersandText text="Testosterone & Male Hormonal Health" />
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                Low energy, reduced libido and sexual symptoms can be
                associated with testosterone deficiency — but they can
                also have many other causes.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="testosteroneHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Physician authority — hormonal health assessment led by a Consultant, not a generic TRT clinic */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <div className={editorialStyles.authority}>
            <p className="mb-6 text-xs font-medium uppercase tracking-widest">{doctor.title}</p>
            <dl className={editorialStyles.metrics}>
              {doctor.yearsOfExperience !== undefined && (
                <AuthorityMetric value={`${doctor.yearsOfExperience}+`} label="Years in Urology" />
              )}
              <AuthorityMetric value="FEBU" label="Fellow of the European Board of Urology" />
              <AuthorityMetric value="Consultant" label="Urologist & Andrologist" />
            </dl>
            <div className={editorialStyles.rail}>
              <p>Hormonal, metabolic and sexual-health assessment — not a performance-enhancement clinic</p>
              {doctor.medicalTrainer && (
                <p>
                  <strong>Medical Trainer</strong> · {doctor.medicalTrainer.program}
                </p>
              )}
            </div>
          </div>
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

      {/* Dr. Molina's Approach — ties the page's existing depth into one distinct, quotable authority statement */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Clinical philosophy"
            heading="Dr. Molina's Approach to Male Hormonal Health"
            description="Not a testosterone number treated in isolation — an assessment of whether symptoms, biochemistry and the wider health picture actually fit together."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {approachPillars.map((pillar) => (
              <StaggerItem key={pillar.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
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
          <Reveal delay={0.05}>
            <HormoneBalanceDiagram className="mt-10 h-24 w-24 text-muted-foreground" />
          </Reveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {panel.map((item) => (
              <StaggerItem key={item.label} className="card-hover border-t border-border pt-5">
                <h3 className="font-display text-base text-foreground">{item.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Pull quote — Phase R3 correction */}
      <Container className="max-w-2xl py-14">
        <PullQuote>
          Treatment is considered only after appropriate clinical and
          biochemical assessment — never as a default response to
          symptoms alone.
        </PullQuote>
      </Container>

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

      {/* Restrained authorship reference — clinical content stays primary, this is a footnote-weight credential, not a media feature */}
      {publications.length > 0 && (
        <section className="border-t border-border py-14">
          <Container className="flex flex-wrap items-center gap-6">
            <Image src="/brand/authority/mens-health.jpg" alt="Men's Health Spain" width={100} height={44} style={{ height: "1.5rem", width: "auto" }} className="opacity-80" />
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">Contributor &amp; Author — Men&rsquo;s Health Spain.</span>{" "}
              Selected articles:{" "}
              {publications.map((item, index) => (
                <span key={item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
                    {item.label}
                  </a>
                  {index < publications.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </Container>
        </section>
      )}

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
