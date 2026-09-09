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

const PATH = "/erectile-dysfunction/penile-doppler";

export const metadata: Metadata = buildMetadata({
  title: "Penile Doppler — Advanced ED Assessment",
  description:
    "Penile Doppler (penile duplex ultrasound) assessment in Abu Dhabi — arterial inflow, veno-occlusive function, and how findings inform erectile dysfunction treatment planning.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Erectile Dysfunction", href: "/erectile-dysfunction" },
  { name: "Penile Doppler", href: PATH },
];

const evaluates = [
  {
    title: "Arterial inflow",
    description:
      "Blood flow into the penis, assessed to identify whether reduced arterial supply is contributing to erectile dysfunction.",
  },
  {
    title: "Veno-occlusive function",
    description:
      "How well the penis retains blood during an erection. Impaired veno-occlusive function can allow blood to drain too quickly, affecting rigidity.",
  },
  {
    title: "Response to stimulation",
    description:
      "The test typically involves an intracavernosal injection to pharmacologically stimulate an erection, allowing blood flow to be assessed under standardised conditions.",
  },
];

const arterialContributors = [
  "Diabetes", "Smoking", "Hypertension", "Metabolic syndrome",
  "Vascular disease", "Endothelial dysfunction", "Ageing",
];

const dopplerContextFactors = [
  "The quality of erection actually achieved during the study",
  "Timing of measurement after the stimulating injection",
  "Individual response to the pharmacological agent used",
  "Adequacy of stimulation during the test",
  "Symptoms and history reported at consultation",
  "Whether spontaneous erections still occur",
  "Whether erections during masturbation differ from those with a partner",
  "Vascular risk factors",
  "Metabolic context",
  "Hormonal context",
];

const approachPrinciples = [
  "Symptoms and history are read first, not the numbers in isolation",
  "The quality of the erection actually achieved during the study is taken into account, not just the velocities measured",
  "Arterial and veno-occlusive findings are interpreted together, not as two independent verdicts",
  "Hormonal and metabolic contributors are considered alongside the scan",
  "Spontaneous and masturbatory erections provide real-world context a single test cannot",
  "An apparent venous leak is never assumed automatically from one elevated value",
  "Treatment follows the mechanism identified — not a Doppler label applied on its own",
];

const faqItems = [
  {
    question: "Do I need a Penile Doppler test?",
    answer:
      "Not necessarily. It's considered when a vascular cause is suspected, when initial treatment hasn't worked as expected, or ahead of certain procedures — assessed individually, not routinely for every patient.",
  },
  {
    question: "What does the test involve?",
    answer:
      "The test involves an injection to stimulate an erection for assessment purposes, followed by ultrasound imaging of blood flow. What to expect is explained in detail beforehand.",
  },
  {
    question: "What is arterial erectile dysfunction?",
    answer:
      "It's erectile dysfunction where the main contributor is reduced blood flow reaching the penis through the supplying arteries — often related to diabetes, smoking, hypertension, metabolic syndrome, vascular disease or ageing. Penile Doppler helps assess arterial inflow specifically, though a single measurement is not overdiagnosed as arterial disease without the wider clinical picture.",
  },
  {
    question: "What is venous leak?",
    answer:
      "It's a pattern where venous outflow appears to remain higher than expected during an erection, sometimes described as blood \"draining too quickly\". It is more complex than a simple leaking pipe, though — normal veno-occlusion depends on adequate inflow and full cavernosal expansion compressing the outflow, so an incomplete erection can show a similar pattern without a fixed structural vein problem.",
    readMoreHref: "#venous-leak",
    readMoreLabel: "Read more below: Venous Leak Is More Complex Than It Sounds",
  },
  {
    question: "Does a high EDV always mean venous leak?",
    answer:
      "No. End-diastolic velocity (EDV) helps assess how much outflow persists during erection, but it has to be read alongside how rigid the erection actually was during the scan. If full cavernosal expansion wasn't achieved — from insufficient stimulation, anxiety, or a suboptimal response to the test injection — outflow can appear elevated without a fixed structural leak being present.",
  },
  {
    question: "Can anxiety affect a penile Doppler?",
    answer:
      "Yes. The test relies on achieving a genuine erectile response to a stimulating injection, and anxiety in that setting can affect how fully the erectile tissue relaxes and expands — which can in turn affect the velocities measured, independent of any underlying vascular problem.",
  },
  {
    question: "Can sympathetic activity make an erection difficult to maintain?",
    answer:
      "In some men, an apparent veno-occlusive pattern may reflect incomplete cavernosal relaxation or incomplete rigidity rather than a fixed structural defect — and heightened sympathetic tone (the body's stress response) is one factor that can contribute to incomplete relaxation in a clinical setting like a Doppler study.",
  },
  {
    question: "Why can erections be better during masturbation than intercourse?",
    answer:
      "This is a genuinely useful piece of history, not a curiosity — it points toward performance-related or contextual factors playing a role, rather than a fixed structural problem, since the underlying vascular anatomy is identical in both situations. It's one of the specific things asked about at assessment, and part of why spontaneous and masturbatory erections provide context a single test cannot.",
  },
  {
    question: "Can testosterone affect erectile function?",
    answer:
      "It can contribute, alongside vascular and neurological mechanisms — though it's rarely the only factor. Hormonal assessment is considered as part of a full erectile dysfunction work-up where relevant, not treated as a separate, unrelated question.",
    readMoreHref: "/mens-health/testosterone",
    readMoreLabel: "Explore Testosterone & Hormonal Health",
  },
  {
    question: "When is Penile Doppler useful?",
    answer:
      "It's useful when a vascular cause genuinely needs clarifying — for example when treatment hasn't responded as expected, when surgery such as a penile implant is being planned, or when distinguishing an arterial from a veno-occlusive contributor would change the treatment discussion. It is not a routine first step for every patient with erectile dysfunction.",
  },
  {
    question: "Can Doppler distinguish arterial from veno-occlusive problems?",
    answer:
      "It can help — peak systolic velocity (PSV) primarily reflects arterial inflow, while end-diastolic velocity (EDV) helps assess persistent outflow. But both are read in the context of the erection quality achieved, the timing and response to the test injection, and your wider clinical picture — not as two numbers that produce a diagnosis on their own.",
  },
  {
    question: "Does venous leak always require surgery?",
    answer:
      "No. Since an apparent veno-occlusive pattern can reflect incomplete relaxation, insufficient stimulation, or metabolic and hormonal contributors rather than a fixed structural defect, treatment follows the mechanism actually identified — which may mean addressing a contributing factor rather than surgery. Surgical options are only relevant for a genuinely confirmed structural pattern, discussed individually.",
  },
];

export default function PenileDopplerPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Doppler — Advanced ED Assessment",
            description:
              "Penile duplex ultrasound assessment of arterial inflow and veno-occlusive function, used as part of advanced erectile dysfunction assessment.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Duplex Ultrasound",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Advanced ED Assessment
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Penile Doppler
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Ultrasound assessment of penile blood flow, used as part
              of advanced erectile dysfunction assessment when a
              vascular cause needs to be evaluated in detail.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                Book a Confidential Consultation
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* When indicated */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="When it may be indicated"
            heading="Not a Routine Test for Every Patient"
            size="md"
            description="Penile Doppler may be considered when a vascular cause is suspected, when initial treatment hasn't provided the expected response, or when planning is needed ahead of a procedure such as penile implant surgery — assessed individually, not as a default step."
          />
        </Container>
      </section>

      {/* What the test evaluates */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="What the test evaluates" heading="Three Things the Scan Looks At" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 border-t border-border pt-12 md:grid-cols-3">
            {evaluates.map((item, index) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Arterial erectile dysfunction */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="One of two mechanisms"
            heading="Arterial Erectile Dysfunction"
            size="md"
            description="Arterial erectile dysfunction means the main contributor is reduced blood flow reaching the penis through the arteries that supply it — the 'inflow' side of the physiology described above."
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              What commonly contributes
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {arterialContributors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Penile Doppler can help assess arterial inflow specifically,
              measured as peak systolic velocity (PSV). But a single
              number is not, on its own, overdiagnosed as arterial
              disease — it is read alongside vascular risk factors,
              symptoms and the rest of the clinical picture.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Venous leak — the more nuanced mechanism */}
      <section id="venous-leak" className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="The other mechanism"
            heading="Venous Leak Is More Complex Than It Sounds"
            size="md"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              A so-called venous leak does not necessarily mean a vein
              is permanently defective, or simply left open. Normal
              veno-occlusion — the reduction in outflow that maintains
              an erection — depends on adequate arterial inflow,
              smooth-muscle relaxation, full cavernosal expansion, and
              the resulting compression of venous outflow against the
              tunica. It&rsquo;s the end result of a sequence, not an
              independent switch.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              If rigidity during assessment is incomplete for any
              reason, venous outflow may remain measurable simply
              because full compression was never achieved. This is why
              an elevated end-diastolic velocity (EDV) should not be
              interpreted automatically, in isolation, as a fixed
              structural venous leak.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Functional veno-occlusive patterns — careful, non-overclaiming wording */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Why context matters"
            heading="Functional Veno-Occlusive Patterns"
            size="md"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              In some men, an apparent veno-occlusive pattern may
              reflect incomplete cavernosal relaxation or incomplete
              rigidity during the study — rather than a fixed structural
              defect. Contributors can include insufficient stimulation,
              performance anxiety, heightened sympathetic tone, a
              suboptimal response to the pharmacological agent used, or
              metabolic and hormonal factors. This is why the erection
              quality actually achieved during the scan is part of how
              the result is read, not a footnote to it.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Reading PSV and EDV in context */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Reading the numbers"
            heading="PSV and EDV Are a Starting Point, Not a Diagnosis"
          />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <Reveal className="card-hover border-t border-border pt-6">
              <h3 className="font-display text-lg text-foreground">PSV</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Peak systolic velocity — primarily reflects arterial inflow.</p>
            </Reveal>
            <Reveal delay={0.05} className="card-hover border-t border-border pt-6">
              <h3 className="font-display text-lg text-foreground">EDV</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">End-diastolic velocity — helps assess persistent outflow during erection.</p>
            </Reveal>
          </div>
          <p className="mt-10 max-w-2xl text-sm font-medium uppercase tracking-widest text-muted-foreground">
            But both are interpreted alongside
          </p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {dopplerContextFactors.map((factor) => (
              <StaggerItem key={factor} className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {factor}
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              A Doppler is not simply a machine that produces a diagnosis
              from one number — it is one part of an assessment that is
              only as useful as the context it&rsquo;s read within.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Dr. Molina's approach — the differentiated section */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="Our approach" heading="Interpreting the Doppler in Context" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {approachPrinciples.map((principle, index) => (
              <StaggerItem key={principle}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{principle}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Interpretation — olive, this page's one distinctive tonal moment, kept as the short closing punctuation */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Interpreting the results
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Context, not a verdict.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Findings are interpreted alongside your history,
              examination and other assessment findings — not in
              isolation. Results can help clarify whether a vascular
              contributor is present and inform which options on the
              erectile dysfunction treatment ladder may be most
              appropriate, but the test itself does not replace
              clinical judgment or determine treatment on its own.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Shockwave Therapy", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Whether Assessment Is Right for You"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
      />
    </>
  );
}
