import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { OutcomeBenchmarkTable, type BenchmarkColumn, type BenchmarkRow } from "@/components/sections/OutcomeBenchmarkTable";
import { SurgicalSeriesStats, type SurgicalSeriesStat } from "@/components/sections/SurgicalSeriesStats";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/urologic-surgery/laparoscopic-radical-prostatectomy";
const series = doctor.laparoscopicProstatectomy;

export const metadata: Metadata = buildMetadata({
  title: "Laparoscopic Radical Prostatectomy in Abu Dhabi",
  description:
    `Laparoscopic radical prostatectomy for prostate cancer in Abu Dhabi with Dr. Alejandro Molina, Consultant Urologist & Andrologist — ${series.procedureCount} procedures performed. Transparent laparoscopic vs robotic comparison, published benchmark outcomes, and Dr. Molina's own surgical series.`,
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Urologic Surgery", href: "/urologic-surgery" },
  { name: "Laparoscopic Radical Prostatectomy", href: PATH },
];

const experienceFactors = [
  {
    title: "Learning curve",
    description:
      "Published data on laparoscopic radical prostatectomy consistently show that outcomes — particularly positive surgical margins — improve substantially over a surgeon's early case volume, and continue to improve well beyond the first 100–200 cases before reaching a plateau.",
  },
  {
    title: "Surgical volume",
    description:
      "Higher cumulative case volume is associated with better oncologic and functional outcomes across the published literature, independent of which minimally invasive platform is used.",
  },
  {
    title: "Apical dissection",
    description:
      "The prostate's apex is anatomically the most common site of a positive surgical margin. Precise dissection at this level, balancing complete cancer removal against preservation of the urinary sphincter, is one of the technically demanding steps in the operation.",
  },
  {
    title: "Bladder-neck management",
    description:
      "How the bladder neck is handled and reconstructed affects both early continence recovery and the technical quality of the reconnection to the urethra.",
  },
  {
    title: "Neurovascular bundle preservation",
    description:
      "Where oncologically appropriate, preserving the neurovascular bundles adjacent to the prostate is central to erectile function recovery — a judgment made individually, not applied uniformly to every patient.",
  },
  {
    title: "Vesicourethral anastomosis",
    description:
      "The reconnection between bladder and urethra needs to be precise and watertight — its quality affects catheter duration and early continence.",
  },
  {
    title: "Oncological decision-making",
    description:
      "Intraoperative decisions — how wide a margin to take in a given location, whether to modify or abandon nerve-sparing based on what is found — are judgment calls informed by experience, not steps that can be fully standardized in advance.",
  },
  {
    title: "Patient selection",
    description:
      "Recognizing which patients are, and are not, good candidates for a nerve-sparing approach — and setting realistic expectations accordingly — is itself a skill that develops with experience.",
  },
];

const benchmarkColumns: BenchmarkColumn[] = [
  { label: "Dr. Alejandro Molina", sublabel: "Personal laparoscopic radical prostatectomy series", highlight: true },
  { label: "LRP — learning curve", sublabel: "Lower-volume published series" },
  { label: "LRP — high-volume", sublabel: "Expert published series" },
  { label: "RARP — contemporary", sublabel: "High-volume published series" },
];

const socialContinenceNote = "Not consistently reported using the same 0–1 safety-pad definition in the published literature identified.";
const potencyLearningCurveNote = "~30–50% (estimated from the general learning-curve literature; not directly reported at this definition in a dedicated study)";

const benchmarkRows: BenchmarkRow[] = [
  {
    metric: "12-month strict continence",
    definition: "0 pads/day",
    values: ["89%", "~65–80%", "85–94%", "85–95%"],
  },
  {
    metric: "12-month social continence",
    definition: "0–1 safety pad/day",
    values: ["93%", socialContinenceNote, socialContinenceNote, socialContinenceNote],
  },
  {
    metric: "12-month potency",
    definition: "Previously potent patients, bilateral nerve-sparing, erections sufficient for penetration with or without PDE5 inhibitor therapy",
    values: ["74%", potencyLearningCurveNote, "65–76%", "55–85%"],
  },
  {
    metric: "Global positive surgical margins",
    values: ["16%", "20–30%", "~8–15%", "10–20%"],
  },
  {
    metric: "pT2 positive surgical margins",
    values: ["6%", "~18–30%", "~10–15%", "~7–10%"],
  },
  {
    metric: "pT3 positive surgical margins",
    values: ["18%", "~30–45%", "~28–35%", "~30–40%"],
  },
  {
    metric: "Major complications",
    definition: "Clavien-Dindo grade ≥III",
    values: ["2.5%", "~5–10%", "~3–6%", "~3–5%"],
  },
];

const seriesStats: SurgicalSeriesStat[] = [
  { value: series.procedureCount, label: "Procedures performed", definition: "Laparoscopic radical prostatectomies, personal series." },
  { value: `${series.outcomes.strictContinence.value}%`, label: "Strict continence", definition: `${series.outcomes.strictContinence.timeframe}, ${series.outcomes.strictContinence.definition}.` },
  { value: `${series.outcomes.socialContinence.value}%`, label: "Social continence", definition: `${series.outcomes.socialContinence.timeframe}, ${series.outcomes.socialContinence.definition}.` },
  { value: `${series.outcomes.potency.value}%`, label: "Potency", definition: `${series.outcomes.potency.timeframe}, among ${series.outcomes.potency.definition}.` },
  { value: `${series.outcomes.marginsOverall.value}%`, label: "Global positive margins", definition: series.outcomes.marginsOverall.definition + "." },
  { value: `${series.outcomes.marginsPT2.value}%`, label: "pT2 positive margins", definition: series.outcomes.marginsPT2.definition + "." },
  { value: `${series.outcomes.marginsPT3.value}%`, label: "pT3 positive margins", definition: series.outcomes.marginsPT3.definition + "." },
  { value: `${series.outcomes.majorComplications.value}%`, label: "Major complications", definition: series.outcomes.majorComplications.definition + "." },
];

const faqItems = [
  {
    question: "Is robotic prostatectomy better than laparoscopic prostatectomy?",
    answer:
      "Not in a way that can be stated as a blanket rule. Robotic technology can offer technical advantages, but published outcomes vary substantially between surgeons and centres, and high-volume laparoscopic series can achieve oncological and functional outcomes within the range reported by contemporary high-volume robotic programs. The surgical platform is only one part of the outcome — surgeon experience, technique, patient selection and surgical volume also play a major role. See the benchmark comparison above for the published ranges this is based on.",
  },
  {
    question: "Does the robot perform the surgery?",
    answer:
      "No. In robot-assisted surgery, the surgeon controls every instrument movement in real time from a console — the robotic platform is a tool the surgeon operates, not an autonomous system that operates independently or makes decisions. Dr. Molina performs laparoscopic, not robot-assisted, radical prostatectomy.",
  },
  {
    question: "Does surgeon experience matter?",
    answer:
      "Yes, substantially. Published learning-curve studies show that outcomes — particularly cancer-control measures like positive surgical margins — improve markedly over a surgeon's case experience, with laparoscopic radical prostatectomy specifically shown to have a slower learning curve than open surgery. This is true regardless of which minimally invasive platform is used.",
  },
  {
    question: "What is the continence rate after radical prostatectomy?",
    answer:
      `Continence recovery varies with the definition used. In Dr. Molina's own series, ${series.outcomes.strictContinence.value}% of patients are fully pad-free (${series.outcomes.strictContinence.definition}) at ${series.outcomes.strictContinence.timeframe}, and ${series.outcomes.socialContinence.value}% meet a social-continence standard of ${series.outcomes.socialContinence.definition} by the same timepoint. These figures are from Dr. Molina's personal series — see the definitions and published benchmark ranges below for context.`,
  },
  {
    question: "What are the chances of erectile-function recovery?",
    answer:
      `This depends heavily on baseline erectile function, age, and whether nerve-sparing is oncologically appropriate and technically performed on one or both sides. In Dr. Molina's series, ${series.outcomes.potency.value}% of ${series.outcomes.potency.definition} at ${series.outcomes.potency.timeframe}. This figure does not apply to patients who were not previously potent, who did not have bilateral nerve-sparing, or whose cancer required a wider excision for oncological safety.`,
  },
  {
    question: "What is a positive surgical margin?",
    answer:
      "A positive surgical margin means cancer cells are found at the outer edge of the removed tissue under the pathologist's microscope, suggesting some cancer may not have been fully excised. It is a marker that can be associated with a higher chance of biochemical recurrence over time, but a positive margin does not by itself mean the cancer has recurred or will recur — the risk depends on the margin's location, extent and the tumour's other pathological features, discussed individually at follow-up.",
  },
  {
    question: "Can nerves always be preserved?",
    answer:
      "No. Oncological safety comes first — nerve-sparing is only appropriate when it does not compromise cancer control, based on the tumour's location and characteristics found at assessment and confirmed intraoperatively. Some patients are suitable for bilateral nerve-sparing, some for unilateral, and for some patients nerve-sparing is not appropriate at all. This is assessed and discussed individually, not assumed in advance.",
  },
  {
    question: "How long does recovery take?",
    answer:
      "A urinary catheter is typically required for a short period after surgery, with most patients spending a small number of days in hospital. Return to light activity generally follows within a few weeks, with fuller activity resuming over the following weeks to months, and continence and erectile function continuing to recover gradually over the following months. Specific timelines are discussed individually based on your surgery and recovery.",
  },
];

export default function LaparoscopicRadicalProstatectomyPage() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Laparoscopic Radical Prostatectomy",
            description:
              "Laparoscopic surgical treatment for localized prostate cancer, with transparent explanation of the laparoscopic vs robotic distinction and published benchmark outcomes shown alongside Dr. Molina's personal surgical series.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Laparoscopic Radical Prostatectomy",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* 1. Hero */}
      <EditorialField className={`${visual.flagshipHero} py-14`}>
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Advanced Urologic Surgery · Abu Dhabi
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-display-2xl text-foreground">
                Laparoscopic Radical Prostatectomy for Prostate Cancer
              </h1>
              <p className="mt-4 max-w-xl font-display text-display-sm text-accent-strong">
                Experience Beyond the Technology
              </p>
              {/* 2. Experience / authority */}
              <div className={visual.flagshipMetrics}>
                <p><strong>{series.procedureCount}</strong><span>Laparoscopic radical prostatectomies</span></p>
                <p><strong>{series.outcomes.majorComplications.value}%</strong><span>Major complications (Clavien-Dindo ≥III)</span></p>
              </div>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                More than 500 laparoscopic radical prostatectomies with a
                focus on cancer control, urinary continence and
                preservation of sexual function when oncologically
                appropriate.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Dr. Molina performs laparoscopic, not robotic, radical
                prostatectomy — this page explains the difference between
                the two approaches, and why the surgical platform is only
                one part of the outcome.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="urologic_surgery" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
              </div>
            </Reveal>
            <p className="mt-6 text-sm text-muted-foreground">{doctor.displayName}<br />{doctor.title}</p>
          </div>
          <EditorialFrame slot="prostatectomyFlagship" landscape priority tone="dark" />
        </Container>
      </EditorialField>

      {/* 3. What radical prostatectomy is */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Understanding the procedure"
            heading="What Radical Prostatectomy Is"
            description="Radical prostatectomy is the surgical removal of the entire prostate gland, along with the seminal vesicles, as a treatment for prostate cancer. The goal is to remove the cancer completely while, where oncologically appropriate, preserving the structures responsible for urinary control and erectile function."
          />
        </Container>
      </section>

      {/* 4. Who may be a candidate */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Candidacy"
            heading="Who May Be a Candidate"
            description="Radical prostatectomy is generally considered for men with prostate cancer confined to the gland (localized disease), and sometimes for select cases of locally advanced disease, depending on overall health, life expectancy and personal preference relative to other treatment options such as radiotherapy or active surveillance. This is not a recommendation that surgery is the right choice for every man with prostate cancer — candidacy is assessed individually, based on your specific diagnosis, imaging, biopsy pathology and overall health, and discussed alongside the alternatives relevant to your case."
          />
        </Container>
      </section>

      {/* 5. The laparoscopic approach */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="The approach"
            heading="The Laparoscopic Approach"
            description="Laparoscopic radical prostatectomy is performed through several small incisions in the abdomen, using a camera (laparoscope) and long, specialized instruments the surgeon operates directly by hand, rather than through a single large open incision. This minimally invasive approach is associated with less blood loss, smaller scars and generally faster early recovery than open surgery, while allowing the same surgical goals — complete cancer removal and, where appropriate, nerve preservation — to be pursued."
          />
        </Container>
      </section>

      {/* 6. Laparoscopic vs Robotic — the transparency section */}
      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture watermark={false} />
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="A transparent comparison"
            heading="Laparoscopic vs Robotic Radical Prostatectomy"
          />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Both laparoscopic and robot-assisted radical prostatectomy
              are minimally invasive approaches — the prostate is removed
              through several small incisions rather than one large open
              incision, using a camera and instruments rather than the
              surgeon&rsquo;s hands directly inside the body.
            </p>
            <p>
              Robotic surgery uses a robotic surgical platform that the
              surgeon controls in real time from a console a few feet
              away, translating the surgeon&rsquo;s hand movements into
              the instruments&rsquo; movements inside the patient. The
              robot does not operate autonomously and does not make
              surgical decisions independently — every movement is the
              surgeon&rsquo;s.
            </p>
            <p>
              Laparoscopy and robotics differ technically — in
              instrumentation, visualization and how directly the surgeon
              manipulates the instruments — but the surgical platform
              alone does not determine the outcome. The surgical platform
              is only one part of the outcome: surgeon experience,
              technique, patient selection and surgical volume also play
              a major role. Robotic technology can offer technical
              advantages, but published outcomes vary substantially
              between surgeons and centres, and high-volume laparoscopic
              series can achieve oncological and functional outcomes
              within the range reported by contemporary high-volume
              robotic programs.
            </p>
            <p className="font-display text-lg text-foreground">
              Dr. Molina performs laparoscopic, not robotic, radical
              prostatectomy.
            </p>
          </div>
        </Container>
      </section>

      {/* 7. Why surgeon experience matters */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Why it matters"
            heading="Why Surgeon Experience Matters"
            description="Radical prostatectomy — by any minimally invasive platform — is a technically demanding operation in which a number of specific factors, developed over a surgeon's career, materially affect both cancer control and functional recovery."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {experienceFactors.map((factor) => (
              <StaggerItem key={factor.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{factor.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{factor.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          The surgical platform is only one part of the outcome. Surgeon
          experience, technique, patient selection and surgical volume
          also play a major role.
        </PullQuote>
      </Container>

      {/* 8. Outcomes depend on more than the platform */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="The evidence"
            heading="Outcomes Depend on More Than the Platform"
            description="Published benchmark ranges — not a randomized comparison. Published series are not directly interchangeable: results vary according to patient selection, tumour stage, baseline function, nerve-sparing eligibility, outcome definitions, surgeon volume and follow-up. These figures are provided as context, not as a direct comparative trial."
          />
          <div className="mt-10">
            <OutcomeBenchmarkTable
              columns={benchmarkColumns}
              rows={benchmarkRows}
              disclaimer="These are published benchmark ranges, not a randomized comparison. Published series are not directly interchangeable: results vary according to patient selection, tumour stage, baseline function, nerve-sparing eligibility, outcome definitions, surgeon volume and follow-up. These figures are provided as context, not as a direct comparative trial."
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Dr. Molina&rsquo;s outcomes sit within the range reported by
              contemporary high-volume laparoscopic and robotic series.
              Where individual figures — such as pT2 and pT3 margin rates
              — are numerically favourable compared with published
              ranges, this is best described as consistent with the
              favourable end of published ranges, not as evidence of
              general superiority over any specific approach.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 9. Dr. Molina's series */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Dr. Molina's series"
            heading="Dr. Molina's Laparoscopic Radical Prostatectomy Series"
          />
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The following outcomes are Dr. Molina&rsquo;s own laparoscopic
            radical prostatectomy series — practice-series data supplied
            by the treating surgeon, not an independently audited
            registry or a randomized comparative trial. Published
            benchmark ranges are shown separately, above, as context
            rather than a head-to-head comparison.
          </p>
          <div className="mt-12">
            <SurgicalSeriesStats stats={seriesStats} />
          </div>
        </Container>
      </section>

      {/* 10. Cancer control */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="After surgery" heading="Cancer Control" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              After surgery, the removed prostate and any excised tissue
              is examined by a pathologist, who reports the pathological
              stage (how far the cancer extends within or beyond the
              prostate), the tumour&rsquo;s grade, and whether a positive
              surgical margin is present at any point around the
              specimen&rsquo;s outer edge.
            </p>
            <p>
              A positive surgical margin is a pathological finding, not a
              diagnosis of recurrence — it means cancer cells were found
              at the cut edge of the removed tissue, which can be
              associated with a higher chance of biochemical recurrence
              over time, but does not by itself mean the cancer has come
              back or will come back.
            </p>
            <p>
              Follow-up after surgery centres on PSA (prostate-specific
              antigen) monitoring. Because the prostate has been removed,
              PSA should fall to an undetectable level; a confirmed rise
              from that point is what defines biochemical recurrence — a
              laboratory finding that may or may not require further
              treatment, discussed individually if it occurs.
            </p>
          </div>
        </Container>
      </section>

      {/* 11. Urinary continence */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Recovery" heading="Urinary Continence" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Continence is generally reported in two ways: a strict
              definition of zero pads used per day, and a social
              continence definition allowing at most one safety pad per
              day for reassurance rather than genuine leakage. Both are
              legitimate ways of describing recovery, and both are
              reported separately here so the difference is clear rather
              than blended into one number.
            </p>
            <p>
              Continence typically recovers gradually over the weeks and
              months following catheter removal, rather than
              immediately — early leakage in the first weeks is expected
              and does not predict the eventual result. In Dr.
              Molina&rsquo;s series, {series.outcomes.strictContinence.value}%
              of patients are using {series.outcomes.strictContinence.definition} at{" "}
              {series.outcomes.strictContinence.timeframe}, and{" "}
              {series.outcomes.socialContinence.value}% meet the{" "}
              {series.outcomes.socialContinence.definition} social-continence
              standard by the same timepoint.
            </p>
          </div>
        </Container>
      </section>

      {/* 12. Nerve-sparing and erectile function */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Sexual function" heading="Nerve-Sparing and Erectile Function" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Oncological safety comes first. Nerve-sparing — preserving
              the neurovascular bundles that run alongside the prostate
              and are responsible for erectile function — is only
              appropriate when it does not compromise complete removal of
              the cancer, based on tumour location and characteristics.
            </p>
            <p>
              Not every patient is a candidate for nerve-sparing, and
              among those who are, some are suitable for bilateral
              (both-sided) preservation while others are only suitable
              for unilateral (one-sided) preservation, or none. Baseline
              erectile function before surgery, age, and the specific
              anatomy and pathology found all factor into this
              individualized decision.
            </p>
            <p>
              In Dr. Molina&rsquo;s series, {series.outcomes.potency.value}%
              of {series.outcomes.potency.definition}, at{" "}
              {series.outcomes.potency.timeframe}. This figure applies
              specifically to that group — previously potent patients who
              underwent bilateral nerve-sparing — and does not
              generalize to patients outside that definition.
            </p>
            <p>
              For men who experience persistent erectile dysfunction
              after prostate cancer treatment, this is assessed and
              managed the same way as{" "}
              <Link href="/erectile-dysfunction" className="text-foreground underline decoration-accent-strong underline-offset-4">
                erectile dysfunction from any other cause
              </Link>
              , including rehabilitation and medication where
              appropriate. Where erectile function does not recover and
              is significantly affecting quality of life, and other
              treatments have not been effective,{" "}
              <Link href="/penile-implant" className="text-foreground underline decoration-accent-strong underline-offset-4">
                penile implant surgery
              </Link>{" "}
              is one option discussed at that stage.
            </p>
          </div>
        </Container>
      </section>

      {/* 13. Complications / safety */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Safety" heading="Complications and Safety" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              As with any major surgery, radical prostatectomy carries
              risk of complications, most of which are minor and
              managed straightforwardly. Major complications are
              classified using the Clavien-Dindo system, where grade ≥III
              specifically means a complication requiring surgical,
              endoscopic or radiological intervention under anaesthesia,
              or a life-threatening or fatal event — a meaningfully
              higher bar than any complication at all.
            </p>
            <p>
              In Dr. Molina&rsquo;s series, the rate of major
              complications ({series.outcomes.majorComplications.definition})
              is {series.outcomes.majorComplications.value}%. Specific
              risks relevant to your individual case are discussed in
              detail at consultation, before any decision to proceed.
            </p>
          </div>
        </Container>
      </section>

      {/* 14. Recovery */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="What to expect"
            heading="Recovery"
            description="A urinary catheter is typically kept in place for a short period after surgery to allow the reconnection between bladder and urethra to heal, and most patients spend a small number of days in hospital. Light activity generally resumes within a few weeks, with fuller activity over the following weeks to months. PSA is checked at intervals during follow-up to confirm it falls to an undetectable level and stays there, and continence and erectile function — where relevant — continue to recover gradually over the following months. Individual recovery varies, and specific expectations for your situation are discussed as part of your treatment plan."
          />
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Urologic Surgery", href: "/urologic-surgery" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
          { label: "Men's Health", href: "/mens-health" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Your Diagnosis and Options"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Back to Urologic Surgery", href: "/urologic-surgery" }}
      />
    </div>
  );
}
