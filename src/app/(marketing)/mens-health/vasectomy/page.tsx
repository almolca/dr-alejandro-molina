import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/mens-health/vasectomy";

export const metadata: Metadata = buildMetadata({
  title: "No-Scalpel Vasectomy in Abu Dhabi",
  description:
    "No-scalpel vasectomy in Abu Dhabi with Consultant Urologist & Andrologist Dr. Alejandro Molina — a minimally invasive approach with structured counselling, aftercare and post-vasectomy testing.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Men's Health", href: "/mens-health" },
  { name: "No-Scalpel Vasectomy", href: PATH },
];

const conventional = [
  "One or more small skin incisions",
  "More skin and tissue opening",
  "Sutures may be required, depending on technique",
];

const noScalpel = [
  "A very small central puncture/opening",
  "Limited dissection",
  "Both vas deferens usually accessible through the same opening",
  "Often no skin sutures required",
  "Generally less wound-related discomfort and swelling",
  "Usually a rapid return to normal daily activity",
];

const procedureSteps = [
  "Local anaesthetic is applied to the scrotal skin and surrounding tissue.",
  "Each vas deferens is identified and stabilised beneath the skin.",
  "A very small central scrotal opening is created.",
  "Each vas deferens is brought through the same opening in turn.",
  "The vas is divided and occluded using the surgeon's chosen technique.",
  "The small opening generally closes naturally or needs only minimal wound care.",
];

const benefits = [
  { title: "Smaller skin opening", description: "A single small central puncture rather than separate incisions on each side." },
  { title: "Less tissue manipulation", description: "Limited dissection compared with a conventional incisional approach." },
  { title: "Lower wound burden", description: "Less skin and tissue disruption overall, often without the need for sutures." },
  { title: "Generally less discomfort and bruising", description: "Most patients report a more comfortable postoperative course, though this varies individually." },
  { title: "Lower risk of some wound-related complications", description: "A smaller opening reduces certain wound-related risks compared with larger incisions." },
  { title: "Rapid recovery for most patients", description: "Many patients return to desk-based work within a day or two, depending on comfort." },
  { title: "No effect on sexual function", description: "Testosterone production, erections, libido and orgasm are not normally affected." },
];

const recoveryAdvice = [
  "Rest on the day of the procedure",
  "Supportive underwear for several days",
  "Ice or cold packs intermittently, if recommended",
  "Simple analgesia if required",
  "Avoid strenuous exercise and heavy lifting for several days",
  "Avoid sexual activity for approximately one week, or as advised",
  "Return to desk-based work is often possible within one to two days, depending on comfort",
];

const sexualFunction = [
  "Testosterone production",
  "Libido",
  "Erection quality",
  "Orgasm",
  "Ejaculation sensation",
];

const risks = [
  "Bruising",
  "Swelling",
  "Temporary discomfort",
  "Bleeding or haematoma",
  "Infection",
  "Sperm granuloma",
  "Persistent scrotal pain (post-vasectomy pain syndrome)",
  "Early or late recanalisation",
  "Failure to achieve an acceptable clearance on post-procedure semen testing",
];

const goodCandidates = [
  "Men who are certain they have completed their family",
  "Men seeking a permanent, effective form of contraception",
  "Patients who understand that reversal cannot be guaranteed",
];

const needsDiscussion = [
  "Uncertainty about having children in future",
  "Active scrotal infection",
  "Significant scrotal anatomical issues",
  "Chronic testicular or scrotal pain",
  "Previous complex scrotal surgery, where relevant",
];

const faqItems = [
  {
    question: "Is no-scalpel vasectomy painful?",
    answer:
      "The procedure is performed under local anaesthetic, so most patients feel pressure or tugging rather than sharp pain during the procedure itself. Some postoperative discomfort, bruising and swelling is normal and usually manageable with simple analgesia.",
  },
  {
    question: "How big is the opening?",
    answer:
      "The no-scalpel technique uses a very small central puncture in the scrotal skin rather than separate incisions — considerably smaller than a conventional incisional approach.",
  },
  {
    question: "Are stitches required?",
    answer:
      "Often not. Because the opening is so small, it frequently closes naturally without sutures, though this can depend on individual anatomy and the specifics of your procedure.",
  },
  {
    question: "How quickly can I return to work?",
    answer:
      "Many patients return to desk-based work within one to two days, depending on comfort. Physically demanding work typically needs longer — this is discussed individually.",
  },
  {
    question: "When can I exercise again?",
    answer:
      "Strenuous exercise and heavy lifting are generally avoided for several days. Your specific timeline is confirmed at your procedure and follow-up.",
  },
  {
    question: "When can I have sex after vasectomy?",
    answer:
      "Sexual activity is generally avoided for approximately one week, or according to your surgeon's advice.",
  },
  {
    question: "Am I sterile immediately after the procedure?",
    answer:
      "No. Vasectomy does not produce immediate sterility — residual sperm remain downstream of the site of occlusion. Alternative contraception must continue until post-vasectomy semen analysis confirms adequate clearance, tested after an appropriate interval according to your treating physician's protocol.",
  },
  {
    question: "Does vasectomy affect testosterone?",
    answer:
      "No. Vasectomy interrupts the vas deferens, not the testicles' hormone production — testosterone levels are not normally affected.",
  },
  {
    question: "Does vasectomy affect erections or ejaculation?",
    answer:
      "No. Erection quality, libido, orgasm and ejaculation sensation are not normally affected. Ejaculate volume also changes very little, since sperm make up only a small fraction of semen — most fluid comes from the prostate and seminal vesicles.",
  },
  {
    question: "Can vasectomy be reversed?",
    answer:
      "Reversal procedures such as vasovasostomy are possible in selected cases, but they are more complex than the original vasectomy and are not guaranteed to restore fertility — outcomes vary with time since vasectomy and other individual factors. Vasectomy should be considered permanent contraception.",
    readMoreHref: "/male-fertility",
    readMoreLabel: "Learn more about Male Fertility assessment",
  },
  {
    question: "Can the vas deferens reconnect on its own?",
    answer:
      "Rarely, yes — early or late recanalisation is a recognised, uncommon risk, which is part of why post-vasectomy semen testing is used to confirm adequate clearance before relying on the procedure for contraception.",
  },
  {
    question: "Will semen look different?",
    answer:
      "Not noticeably. Sperm represent only a small fraction of ejaculate volume, so semen typically looks and feels broadly similar after vasectomy.",
  },
  {
    question: "Does vasectomy increase prostate cancer risk?",
    answer:
      "Current evidence does not support vasectomy as a cause of prostate cancer. This has been a subject of research interest, but no causal link has been established.",
  },
  {
    question: "What is post-vasectomy pain syndrome?",
    answer:
      "It refers to persistent scrotal or testicular discomfort that continues beyond the expected recovery period. It is an uncommon but recognised risk, and is one of the factors discussed as part of informed consent before proceeding.",
  },
];

export default function VasectomyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "No-Scalpel Vasectomy",
            description:
              "Minimally invasive no-scalpel vasectomy — permanent male contraception performed through a small central scrotal opening, with counselling on recovery, risks and post-procedure testing.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "No-Scalpel Vasectomy",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              No-Scalpel Vasectomy
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              A Minimally Invasive Approach to Permanent Male Contraception
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              A no-scalpel vasectomy uses a very small central scrotal
              opening to access the vas deferens with minimal tissue
              disruption, offering an efficient outpatient approach to
              permanent contraception.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="vasectomy" size="lg">
                Book a Confidential Consultation
              </BookingCta>
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Consultant Urologist &amp; Andrologist · Abu Dhabi
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What is a no-scalpel vasectomy */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="What is it" heading="What Is a No-Scalpel Vasectomy?" />
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                A vasectomy is a permanent male contraception procedure
                in which the vas deferens — the tubes that carry sperm —
                are interrupted so sperm no longer enter the ejaculate.
              </p>
              <p>
                In the no-scalpel technique, instead of conventional
                skin incisions on each side, the vas deferens are
                accessed through a very small opening, typically in the
                central scrotal skin. Both sides can usually be treated
                through that same small access.
              </p>
              <p className="text-foreground">
                This does not affect testosterone production, erections,
                libido or the ability to orgasm. Ejaculate volume
                changes very little, since sperm represent only a small
                fraction of semen volume.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How the no-scalpel technique differs */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="The technique"
            heading="How the No-Scalpel Technique Differs"
            description="A comparison of approach, not a judgment on conventional vasectomy — both are established, valid techniques."
          />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Conventional approach
              </p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                {conventional.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                No-scalpel approach
              </p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                {noScalpel.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* The procedure */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="What to expect" heading="The Procedure" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {procedureSteps.map((step, index) => (
              <StaggerItem key={step}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{step}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is a patient-facing overview. The exact technique used
              for dividing and occluding the vas deferens is discussed
              individually as part of your consultation, not standardised
              in advance for every patient.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Potential advantages"
            heading="Benefits of the No-Scalpel Approach"
            description="Potential advantages, not guarantees — individual results vary."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Recovery */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Aftercare" heading="Recovery" />
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {recoveryAdvice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Individual recovery varies. This is general guidance, not a
              substitute for the specific aftercare instructions given at
              your procedure.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Not immediately sterile — deliberately the page's one distinctive dark/olive moment, per spec's "must be prominent" */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Important
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              You are not immediately sterile after vasectomy.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Vasectomy does not produce immediate sterility. Residual
              sperm remain downstream from the site of occlusion.
              Alternative contraception must continue until post-vasectomy
              semen analysis confirms adequate clearance. Testing is
              typically performed after an appropriate post-procedure
              interval, according to your treating physician and
              laboratory&rsquo;s protocol.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Sexual function */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Reassurance" heading="Effect on Sexual Function" />
          <Reveal delay={0.05}>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Vasectomy does not normally affect:
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
              {sexualFunction.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Semen still appears broadly similar after vasectomy, because
              most ejaculate fluid comes from the prostate and seminal
              vesicles, not the testicles.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Permanence / reversal */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Informed consent" heading="Permanence and Reversal" />
          <div className="mt-10">
            <PullQuote>
              Vasectomy should be considered permanent contraception.
            </PullQuote>
          </div>
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Reversal procedures such as{" "}
                <Link
                  href="/male-fertility"
                  className="text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  vasovasostomy
                </Link>{" "}
                are possible in selected cases, but they are more complex
                than the original procedure and are not guaranteed to
                restore fertility — outcomes vary with time since
                vasectomy and other individual factors.
              </p>
              <p>
                Patients who are uncertain about future fertility may wish
                to discuss sperm freezing before proceeding. This is not
                routinely recommended to every patient, but is raised
                where relevant to individual circumstances.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Risks */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Informed consent" heading="Risks" />
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Serious complications are uncommon, but no procedure is
              risk-free. These are reviewed individually as part of
              informed consent before proceeding.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Who is it for */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Who is it for
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Good Candidates
            </h2>
            <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {goodCandidates.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Worth discussing first
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Requires Further Discussion
            </h2>
            <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {needsDiscussion.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Male Fertility", href: "/male-fertility" },
          { label: "Testosterone & Male Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Insights", href: "/insights" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Whether Vasectomy Is Right for You"
        sourcePage={PATH}
        secondary={{ label: "Explore Men's Health", href: "/mens-health" }}
        bookingLabel="Book a Confidential Consultation"
      />
    </>
  );
}
