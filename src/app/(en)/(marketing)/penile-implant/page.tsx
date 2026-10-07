import type { Metadata } from "next";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import { CandidateCheck } from "@/components/editorial/CandidateCheck";
import { ConnectedPathway } from "@/components/editorial/ConnectedPathway";
import { RecoveryTimeline } from "@/components/editorial/RecoveryTimeline";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import {
  Activity, Pill, Syringe, AlertCircle, Scissors, Bandage, CalendarCheck,
  Fingerprint, Ruler, Droplet, EyeOff, Layers, ListChecks, Waves, Hand,
  HeartPulse, History, Scan, Target,
} from "lucide-react";
import { ImplantDeviceDiagram, PumpIcon, RigidityIcon, CurvatureAssessmentDiagram } from "@/components/illustrations";
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

const PATH = "/penile-implant";

export const metadata: Metadata = buildMetadata({
  title: "Penile Implant Surgery in Abu Dhabi",
  description:
    "Penile implant surgery for severe erectile dysfunction in Abu Dhabi — inflatable and malleable options, candidacy, the surgical pathway, recovery and realistic expectations.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Penile Surgery", href: "/penile-surgery" },
  { name: "Penile Implant Surgery", href: PATH },
];

const inflatableFeatures = [
  { title: "Components", description: "Two or three pieces: cylinders placed within the erectile chambers, a fluid reservoir, and a pump — most often placed in the scrotum.", Icon: Layers },
  { title: "Inflation", description: "Pressing the pump moves fluid from the reservoir into the cylinders, producing rigidity when desired.", Icon: PumpIcon },
  { title: "Deflation", description: "A release mechanism returns the fluid to the reservoir, allowing a return to a flaccid state.", Icon: Waves },
  { title: "Flaccid-state appearance", description: "When deflated, the flaccid appearance is close to natural for most men, and the device is not generally noticeable in clothing.", Icon: EyeOff },
  { title: "Patient operation", description: "The patient operates the pump himself, achieving and releasing rigidity when he chooses.", Icon: Hand },
  { title: "Why it's the option most commonly selected", description: "Its inflate/deflate mechanism most closely mirrors the natural cycle of rigidity and flaccidity.", Icon: HeartPulse },
];

const howItWorksStages = [
  { Icon: Waves, title: "Resting / flaccid", description: "The default state — no fluid in the cylinders." },
  { Icon: PumpIcon, title: "Pump activation", description: "The patient presses the pump, moving fluid from the reservoir." },
  { Icon: RigidityIcon, title: "Rigidity for intercourse", description: "Fluid fills the cylinders, producing rigidity on demand." },
];

const pathway = [
  {
    phase: "Assessment",
    description:
      "Confirming that erectile dysfunction is severe or refractory, reviewing previous treatments tried, and evaluating overall health and expectations before surgery is considered.",
    Icon: ListChecks,
  },
  {
    phase: "Surgery",
    description:
      "Performed under appropriate anaesthesia. The chosen device — inflatable or malleable — is placed within the erectile chambers of the penis.",
    Icon: Scissors,
  },
  {
    phase: "Recovery",
    description:
      "A structured recovery period follows, with activity gradually resumed and device use introduced under guidance, timelines discussed individually at consultation.",
    Icon: Bandage,
  },
];

const risks = [
  "Infection",
  "Mechanical wear or device malfunction over time, in some cases requiring revision surgery",
  "Changes in sensation",
  "Bleeding or bruising",
  "Risks associated with anaesthesia and surgery generally",
];

const notAppropriate = [
  "Active infection at the time of assessment",
  "Reversible or unaddressed causes of erectile dysfunction not yet fully explored",
  "Expectations that don't align with what the surgery is designed to do",
  "Certain anatomical or medical factors identified at assessment",
];

const candidateGoodIf = [
  "Erectile dysfunction is severe or refractory",
  "Oral medication, vacuum devices or injectable therapy have not provided reliable results",
  "The underlying cause has already been appropriately assessed",
];

const pathwayPrinciples = [
  {
    title: "Cause and severity",
    description: "Confirming that erectile dysfunction is genuinely severe or refractory — not assumed from symptoms alone.",
    Icon: AlertCircle,
  },
  {
    title: "Previous treatments",
    description: "Reviewing what has already been tried — oral medication, vacuum devices, injectable therapy — and why it did or didn't work.",
    Icon: History,
  },
  {
    title: "Wider clinical context",
    description: "Vascular, hormonal and anatomical factors that may be contributing are assessed, not overlooked in favour of a quick surgical fix.",
    Icon: Scan,
  },
  {
    title: "Realistic expectations",
    description: "What an implant can and cannot restore — for rigidity, sensation, orgasm and perceived length — discussed before any surgical decision, not after.",
    Icon: Target,
  },
  {
    title: "Device selection",
    description: "Inflatable or malleable, chosen according to anatomy, health and personal preference, not offered as a single default recommendation.",
    Icon: PumpIcon,
  },
];

const faqItems = [
  {
    question: "Is a penile implant permanent?",
    answer:
      "The device is intended for long-term use, though mechanical parts can wear over time and some patients may eventually need revision surgery. It is not offered as a universal cure, and is only considered after other treatments have been explored.",
    readMoreHref: "/insights/penile-implant-lifespan-revision",
    readMoreLabel: "Read more: How Long Does a Penile Implant Last?",
  },
  {
    question: "What's the difference between inflatable and malleable implants?",
    answer:
      "Inflatable devices use a pump mechanism to mirror natural rigidity and flaccidity. Malleable devices are simpler semi-rigid rods that are manually positioned. Which is discussed depends on your anatomy, health and preference.",
    readMoreHref: "/insights/inflatable-vs-malleable-penile-implant",
    readMoreLabel: "Read more: Inflatable vs Malleable Penile Implant",
  },
  {
    question: "Will sensation be normal after surgery?",
    answer:
      "The implant is designed to support rigidity for penetration. It does not aim to change sensation, which is generally governed by separate mechanisms — this is discussed individually during assessment.",
    readMoreHref: "/insights/orgasm-ejaculation-after-penile-implant",
    readMoreLabel: "Read more: Can You Orgasm and Ejaculate With a Penile Implant?",
  },
  {
    question: "How long is recovery?",
    answer:
      "Recovery generally moves through three phases: an initial healing period with restricted activity, a gradual return to normal daily activity, and finally a guided introduction of device use once healing is sufficient. The specific timeline within that structure depends on your individual healing and surgical plan, and is set at consultation rather than quoted as a single number here.",
    readMoreHref: "/insights/penile-implant-recovery-what-to-expect",
    readMoreLabel: "Read more: Penile Implant Recovery, What to Expect",
  },
  {
    question: "Am I a candidate for a penile implant?",
    answer:
      "Candidacy depends on three things: whether erectile dysfunction is confirmed as severe or refractory, whether other treatments have already been tried without reliable results, and your overall health and expectations. All three are assessed together at consultation — see the candidacy check above for how this is typically weighed.",
    readMoreHref: "/insights/penile-implant-when-considered",
    readMoreLabel: "Read more: When Is a Penile Implant Considered for Erectile Dysfunction?",
  },
  {
    question: "What are the alternatives to a penile implant?",
    answer:
      "A penile implant sits at the end of the erectile dysfunction treatment ladder, not the start. Alternatives explored first typically include lifestyle and risk-factor management, PDE5 inhibitors, hormonal treatment where indicated, vacuum devices, shockwave therapy and intracavernosal injection therapy — an implant is considered once these no longer give reliable results.",
    readMoreHref: "/erectile-dysfunction",
    readMoreLabel: "See the full Erectile Dysfunction treatment ladder",
  },
  {
    question: "How does the device actually work day to day?",
    answer:
      "An inflatable device is operated by a pump mechanism, most often placed in the scrotum, which the patient uses himself to achieve and release rigidity when desired. A malleable device has no pump — it is simply positioned by hand into a rigid or less rigid position. Which mechanism suits you better is one of the factors discussed when choosing between device types.",
  },
  {
    question: "Will my penis look or feel shorter after implant surgery?",
    answer:
      "Some men do perceive a reduction in length compared to the erections they had before erectile dysfunction developed. This is generally related to tissue changes from the underlying condition itself — particularly if ED has been longstanding — rather than something the implant surgery removes. It's part of the realistic-expectations discussion at assessment, not something left as a surprise afterward.",
    readMoreHref: "/insights/penile-length-after-penile-implant",
    readMoreLabel: "Read more: Penile Length After Penile Implant Surgery",
  },
  {
    question: "Can I have a penile implant after prostate surgery?",
    answer:
      "Yes — erectile dysfunction following prostatectomy is a recognised and well-established reason patients consider a penile implant, particularly once other treatments have not given reliable results.",
    readMoreHref: "/insights/penile-implant-after-radical-prostatectomy",
    readMoreLabel: "Read more: Penile Implant After Radical Prostatectomy",
  },
  {
    question: "Can penile implants treat Peyronie's disease?",
    answer:
      "An implant can address the erectile component when Peyronie's disease coexists with erectile dysfunction that hasn't responded reliably to other treatment, and in some cases the surgical technique used at the time of implant placement can help address curvature too. It isn't the default approach to Peyronie's disease alone, and suitability is assessed individually.",
    readMoreHref: "/peyronies-disease",
    readMoreLabel: "Explore Peyronie's Disease",
  },
  {
    question: "What is the infection risk?",
    answer:
      "Infection is an uncommon but serious complication of implant surgery. Modern devices and strict surgical protocols are specifically intended to reduce that risk. Diabetes and some other health factors can increase individual risk, which is discussed and managed as part of your pre-surgical assessment.",
  },
];

export default function PenileImplantPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Implant Surgery",
            description:
              "Penile implant surgery for severe or refractory erectile dysfunction — inflatable and malleable options, candidacy, surgical pathway, recovery and realistic expectations.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Implant Surgery",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero — asymmetric split, distinct from the ED page's centered text-only hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Penile Surgery
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                Penile Implant Surgery in Abu Dhabi
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                Dr. Alejandro Molina, Consultant Urologist &amp; Andrologist
                in Abu Dhabi, treats severe and refractory erectile
                dysfunction — including after radical prostatectomy, and
                where Peyronie&rsquo;s disease is also present — with
                penile implant surgery (penile prosthesis). The inflatable
                penile implant is the option most commonly selected, with
                the malleable alternative considered individually.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_implant" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
                <a
                  href="#candidacy"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  Who may be a candidate
                </a>
              </div>
            </Reveal>
          </div>

          <MaskedReveal className="w-full self-start">
            <PhotoFrame slot="implantPhysician" priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Physician authority — Consultant-level expertise, not a generic surgical listing */}
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
              <p>Advanced laparoscopic surgery · tertiary hospital experience</p>
            </div>
          </div>
        </Container>
      </section>

      {/* When is an implant considered — visual summary of the ED treatment ladder; the existing "Our approach" cards below are the detailed layer. Educational sequencing, not a rigid protocol. */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Where this fits"
            heading="When Is a Penile Implant Considered?"
            description="This reflects how erectile dysfunction is generally approached, not a rigid sequence every patient must follow — some steps may be skipped or reordered depending on individual circumstances."
          />
          <ConnectedPathway
            nodes={[
              { Icon: Activity, title: "Erectile dysfunction", description: "Confirmed and assessed for underlying cause." },
              { Icon: Pill, title: "Oral medication", description: "PDE5 inhibitors are typically tried first." },
              { Icon: Syringe, title: "Other non-surgical options", description: "Vacuum devices, shockwave therapy or injections." },
              { Icon: AlertCircle, title: "Persistent / refractory ED", description: "Considered when the above have not given reliable results." },
              { Icon: PumpIcon, title: "Implant assessment", description: "Candidacy and device type discussed individually." },
            ]}
          />
        </Container>
      </section>

      {/* The differentiated clinical approach — a specialist ED pathway, not a generic implant provider */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Our approach"
            heading="Penile Implant Surgery Is the End of an Assessment Pathway — Not the Beginning"
            description="A penile implant is a surgical decision, and surgical decisions deserve more than a single conversation about a device. Before it is discussed as a realistic option, assessment covers:"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pathwayPrinciples.map((item) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <item.Icon aria-hidden strokeWidth={1.25} className="h-6 w-6 text-accent-strong" />
                <h3 className="mt-3 font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              This is what separates a specialist ED pathway from a
              generic implant provider — the device is the last step of
              an assessment, not the first conversation.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What is it / candidacy */}
      <section id="candidacy" className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="What is a penile implant?"
            heading="A Device Placed Within the Penis to Restore Rigidity"
            size="md"
            description="A penile prosthesis is a surgically implanted device, placed within the erectile chambers of the penis, designed to allow a man to achieve a rigid erection when desired."
          />
          <div className="mt-4">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Candidacy — reviewed individually, never assumed
            </p>
            <CandidateCheck
              goodHeading="Often considered once"
              goodIf={candidateGoodIf}
              notHeading="Addressed or reassessed first"
              notIf={notAppropriate}
            />
          </div>
        </Container>
      </section>

      {/* Primary focus: the inflatable prosthesis — the option most commonly selected. Malleable follows as a smaller, secondary card, deliberately not given equal visual weight. */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Primary option" heading="The Inflatable Penile Implant" description="Most patients who go on to have implant surgery choose an inflatable device — the option covered in most depth here." />
          <Reveal delay={0.05}>
            <ImplantDeviceDiagram
              className="mt-10 h-24 w-full max-w-xl text-muted-foreground"
              title="Schematic of a three-piece inflatable prosthesis: cylinder, pump and reservoir"
            />
            <ul className="mt-4 flex max-w-xl flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <li>Cylinders</li>
              <li>Pump</li>
              <li>Reservoir</li>
            </ul>
          </Reveal>
          <MaskedReveal className="mt-10 max-w-xl">
            <PhotoFrame slot="implantDevice" landscape />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {inflatableFeatures.map((feature) => (
              <StaggerItem key={feature.title} className="border-t border-border pt-6">
                <feature.Icon aria-hidden strokeWidth={1.25} className="h-6 w-6 text-accent-strong" />
                <h3 className="mt-3 font-display text-lg text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* How it works — 3-stage schematic, kept intentionally simple rather than graphic */}
          <div className="mt-16 border-t border-border pt-10">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">How it works</p>
            <ConnectedPathway nodes={howItWorksStages} />
          </div>

          {/* Malleable — compact, secondary card. Not inferior, not a competing flagship comparison. */}
          <div className="mt-16 max-w-xl border-t border-border pt-10">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Secondary option</p>
            <h3 className="mt-3 font-display text-xl text-foreground">Malleable Penile Implant</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A simpler, semi-rigid device with no pump — the rods are manually
              positioned. It is not considered inferior or obsolete: it remains
              a useful option in selected circumstances, including where
              simplicity, manual dexterity, anatomy or a previous surgery make
              a mechanically simpler device more appropriate. Which device
              suits you is discussed individually, not assumed in advance.
            </p>
          </div>
        </Container>
      </section>

      {/* Pathway — dark section, this page's one dark moment */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="The surgical pathway" heading="Assessment, Surgery, Recovery" />
          <MaskedReveal className="mt-10 max-w-2xl">
            <PhotoFrame slot="implantSurgical" landscape tone="dark" />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathway.map((step, index) => (
              <StaggerItem key={step.phase} className="card-hover border-t border-border pt-6 md:border-t-0 md:pt-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-border md:[&:not(:first-child)]:pl-8">
                <div className="flex items-center gap-3">
                  <step.Icon aria-hidden strokeWidth={1.25} className="h-6 w-6 text-accent-strong" />
                  <span className="font-display text-sm text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl text-foreground">{step.phase}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Sexual function after implantation */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="After implantation"
            heading="Sexual Function After Surgery"
            size="md"
          />
          <div className="mt-10">
            <CandidateCheck
              goodHeading="What it changes"
              goodIf={[
                { Icon: RigidityIcon, text: "Provides mechanical rigidity suitable for intercourse" },
                { Icon: EyeOff, text: "Not generally noticeable in clothing once deflated" },
              ]}
              notHeading="What it doesn't change"
              notIf={[
                { Icon: Fingerprint, text: "Sensation — generally preserved if present beforehand, not automatically changed by the device" },
                { Icon: HeartPulse, text: "Orgasm — depends on the same nerve and hormonal pathways as before surgery" },
                { Icon: Ruler, text: "Penile length — does not inherently increase" },
                { Icon: Droplet, text: "Ejaculation — depends on your underlying prostate/reproductive status" },
              ]}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
              A penile implant is designed to allow a man to achieve a
              rigid erection when desired. It does not change sensation,
              orgasm or ejaculation, which are governed by separate
              mechanisms. As with any surgery, individual results vary,
              and expectations are discussed in detail during
              assessment — the aim is a realistic understanding of what
              the device can and cannot do before proceeding.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Day to day, an inflatable device is activated by a pump
              mechanism, most often placed in the scrotum, that a man
              operates himself when he wants rigidity; a malleable
              device is simply positioned by hand. Some men also
              perceive a reduction in length compared to their erections
              before erectile dysfunction developed — this is generally
              related to the underlying condition itself, including
              tissue changes that occur with longstanding untreated ED,
              rather than something the implant surgery removes. This is
              part of the realistic-expectations conversation at
              assessment, not a surprise left for after surgery.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Pull quote — Phase R3 correction */}
      <Container className="max-w-2xl py-14">
        <PullQuote>
          The aim is a realistic understanding of what the device can
          and cannot do — before proceeding, not after.
        </PullQuote>
      </Container>

      {/* Post-prostatectomy ED and Peyronie's + ED — two specific clinical situations where an implant intersects with another diagnosis already covered elsewhere on this site, each explained rather than left as a bare link */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="A specific clinical pathway" heading="Penile Implant After Radical Prostatectomy" />
          <ConnectedPathway
            nodes={[
              { Icon: Scissors, title: "Radical prostatectomy", description: "Nerve-sparing performed where oncologically appropriate." },
              { Icon: Bandage, title: "Recovery / rehabilitation", description: "PDE5 inhibitors, vacuum therapy and/or injections." },
              { Icon: AlertCircle, title: "Persistent ED", description: "When function hasn't recovered sufficiently over time." },
              { Icon: PumpIcon, title: "Implant assessment", description: "Discussed in selected patients, individually." },
            ]}
          />
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Erectile dysfunction can persist after radical prostatectomy,
              even when surgery goes well and, where oncologically
              appropriate, nerve-sparing was performed. Nerve-sparing
              reduces the risk of permanent erectile dysfunction, but does
              not guarantee recovery — baseline erectile function before
              surgery, age, and individual nerve healing all affect the
              outcome.
            </p>
            <p>
              Rehabilitation after prostatectomy typically starts with the
              same treatment ladder used for erectile dysfunction from any
              cause — PDE5 inhibitors, vacuum erection devices, and
              intracavernosal injection therapy — often introduced early to
              support recovery while nerve function is still resolving.
            </p>
            <p>
              Where erectile function has not recovered sufficiently over
              this period, and other treatments have not given reliable
              results, a penile implant is one option discussed in
              selected patients — assessed with the same principles used
              for any candidate, applied to your specific situation.
            </p>
            <p className="flex flex-wrap gap-x-2">
              <Link href="/urologic-surgery/laparoscopic-radical-prostatectomy" className="text-foreground underline decoration-accent-strong underline-offset-4">
                Learn more about laparoscopic radical prostatectomy
              </Link>
              <span aria-hidden>·</span>
              <Link href="/insights/penile-implant-after-radical-prostatectomy" className="text-foreground underline decoration-accent-strong underline-offset-4">
                Read: Penile Implant After Radical Prostatectomy
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="A specific clinical pathway" heading="Peyronie's Disease and Penile Implant" />
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <CurvatureAssessmentDiagram className="h-16 w-16 text-accent-strong" />
              <p className="text-sm font-medium text-foreground">Peyronie&rsquo;s deformity</p>
            </div>
            <span aria-hidden className="font-display text-2xl text-muted-foreground">+</span>
            <div className="flex flex-col items-center gap-2 text-center">
              <Activity aria-hidden strokeWidth={1.25} className="h-12 w-12 text-accent-strong" />
              <p className="text-sm font-medium text-foreground">Severe ED</p>
            </div>
            <span aria-hidden className="font-display text-2xl text-muted-foreground rtl:rotate-180">→</span>
            <div className="flex flex-col items-center gap-2 text-center">
              <PumpIcon className="h-12 w-12 text-accent-strong" />
              <p className="text-sm font-medium text-foreground">Implant assessment<br />in selected cases</p>
            </div>
          </div>
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Severe Peyronie&rsquo;s disease — where curvature, deformity or
              shortening significantly affects sexual function — can
              coexist with erectile dysfunction that does not respond
              reliably to other treatment. In selected patients, a penile
              implant can address the erectile component, and depending on
              the surgical technique used, some of the curvature, in a
              single procedure. This is assessed individually and is not
              the default approach to Peyronie&rsquo;s disease alone.
            </p>
            <Link href="/peyronies-disease" className="inline-flex text-foreground underline decoration-accent-strong underline-offset-4">
              Explore Peyronie&rsquo;s Disease
            </Link>
          </div>
        </Container>
      </section>

      {/* Recovery timeline — phase-based, reusing the exact three phases already stated in the "How long is recovery?" FAQ below, no invented day/week counts */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="What to expect" heading="Recovery, Phase by Phase" />
          <RecoveryTimeline
            phases={[
              { Icon: Bandage, label: "Initial healing", description: "Restricted activity while early healing takes place after surgery." },
              { Icon: Activity, label: "Gradual return to activity", description: "Normal daily activity is resumed gradually, following guidance specific to your surgery." },
              { Icon: PumpIcon, label: "Device-use introduction", description: "Once healing is sufficient, use of the device is introduced under guidance." },
              { Icon: CalendarCheck, label: "Follow-up", description: "Progress and any concerns are reviewed as part of your individual recovery plan." },
            ]}
          />
        </Container>
      </section>

      {/* Risks — "not appropriate" cases already covered in the candidacy check above, not repeated here */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Realistic expectations
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            Risks and Complications
          </h2>
          <ul className="mt-8 space-y-3">
            {risks.map((risk) => (
              <li key={risk} className="flex gap-4 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {risk}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Shockwave Therapy", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "Penile Doppler", href: "/erectile-dysfunction/penile-doppler" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading={<AmpersandText text="Discuss Candidacy & Next Steps" />}
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
      />
    </>
  );
}
