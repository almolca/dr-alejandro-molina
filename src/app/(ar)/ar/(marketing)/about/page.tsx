import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { HeroPortrait } from "@/components/editorial/HeroPortrait";
import { FlagshipAuthorityFeature } from "@/components/editorial/FlagshipAuthorityFeature";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { PhysicianAuthority } from "@/components/editorial/PhysicianAuthority";
import { ExpertiseTimeline } from "@/components/editorial/ExpertiseTimeline";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { MedicalEducationDiagram } from "@/components/illustrations/MedicalEducationDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { PullQuote } from "@/components/ui/PullQuote";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaAppearancesSection } from "@/components/sections/MediaAppearancesSection";
import { PatientReviewsCta } from "@/components/sections/PatientReviewsCta";
import { PatientFeedbackSection } from "@/components/sections/PatientFeedbackSection";
import { RecognitionSection } from "@/components/sections/RecognitionSection";
import { publications } from "@/config/reputation";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/about";

export const metadata: Metadata = buildMetadata({
  title: "نبذة عنّا",
  description:
    "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة في مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي. تدريب جراحي أوروبي، مع تطور نحو طب الذكورة وصحة الرجل.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "نبذة عنّا", href: PATH },
];

/** Credential-list translations — keys are the exact English strings in doctor.credentials, translation-only. */
const CREDENTIALS_AR: Record<string, string> = {
  "Medical degree and training in Spain": "شهادة طبية وتدريب في إسبانيا",
  "Hospital Clínic Barcelona training": "تدريب في مستشفى كلينيك برشلونة",
  "FEBU — Fellow of the European Board of Urology": "FEBU — زميل المجلس الأوروبي لطب المسالك البولية",
  "Extensive tertiary hospital experience": "خبرة واسعة في المستشفيات الثالثية",
  "Advanced laparoscopic surgery": "جراحة متقدمة بالمنظار",
  "Renal transplantation surgery": "جراحة زراعة الكلى",
  "Uro-oncology": "أورام المسالك البولية",
  "Functional urology": "طب المسالك البولية الوظيفي",
  "Andrology and male sexual health": "طب الذكورة والصحة الجنسية للرجل",
  "Male genital aesthetics": "التجميل الذكوري",
  "Academic and teaching background": "خلفية أكاديمية وتعليمية",
  "Practicing in the United Arab Emirates": "يمارس الطب في دولة الإمارات العربية المتحدة",
};

/** Article-topic label translations for the Men's Health Spain publications — external Spanish-language articles; these are topic descriptions, not translated titles of an Arabic destination. */
const PUBLICATION_LABELS_AR: Record<string, string> = {
  "Testosterone and the body's daily rhythm": "التستوستيرون والإيقاع اليومي للجسم",
  "Testosterone, explained by an andrologist": "التستوستيرون بشرح طبيب الذكورة",
  "What testosterone actually does": "ما الذي يفعله التستوستيرون فعليًا",
};

const narrative = [
  {
    eyebrow: "التدريب الأوروبي",
    heading: "أساس تأسس في إسبانيا",
    body:
      "بدأ التدريب الطبي للدكتور مولينا في إسبانيا، حيث اكتسب خبرة سريرية تشكّلت في مستشفى كلينيك برشلونة — أحد أبرز المراكز الطبية الأكاديمية في أوروبا. هذا الأساس، ضمن بيئة صارمة وقائمة على الدقة الأكاديمية، شكّل نهجًا قائمًا على الأدلة ومهتمًا بالتفاصيل استمر طوال بقية مسيرته المهنية.",
  },
  {
    eyebrow: "الخلفية الجراحية",
    heading: "سنوات من ممارسة طب المسالك البولية الثالثي",
    body:
      "تلت ذلك سنوات من الخبرة الواسعة في المستشفيات الثالثية، شملت جراحة متقدمة بالمنظار وزراعة الكلى، إلى جانب التدريب الأوسع في طب المسالك البولية العام — بما في ذلك أورام المسالك البولية وطب المسالك البولية الوظيفي." +
      (doctor.yearsOfExperience !== undefined
        ? ` هذا الأساس الجراحي، الذي تشكّل عبر أكثر من ${doctor.yearsOfExperience} عامًا في طب المسالك البولية، لا يزال يوجّه طريقة التعامل مع الحالات المعقدة اليوم.`
        : " لا يزال هذا الأساس الجراحي يوجّه طريقة التعامل مع الحالات المعقدة اليوم."),
  },
  {
    eyebrow: "التطور نحو طب الذكورة",
    heading: "تركيز يتجه نحو صحة الرجل",
    body:
      "بمرور الوقت، تركّز التوجه السريري بشكل متزايد نحو طب الذكورة والطب الجنسي للرجال — وهما مجالان في طب المسالك البولية يُعنيان تحديدًا بالصحة الجنسية والهرمونية والإنجابية للرجل. يُعالَج ضعف الانتصاب والتستوستيرون والصحة الهرمونية للرجال وخصوبة الرجل جميعها بنفس الدقة التشخيصية التي ميّزت الخلفية الجراحية الأوسع.",
  },
  {
    eyebrow: `التجميل الذكوري · منذ ${doctor.girthEnhancementSince} · ${doctor.girthProcedureCount} إجراء`,
    heading: "التركيز الرائد: زيادة سماكة القضيب",
    body:
      "امتد هذا التركيز ليشمل التجميل الذكوري — الذي يُعالَج ضمن سياق طب الذكورة والمسالك البولية، بنهج قائم على التشريح وتحت إشراف طبي، وليس كخدمة تجميلية قائمة بذاتها." +
      (doctor.girthEnhancementSince !== undefined || doctor.girthProcedureCount !== undefined
        ? ` يُجري د. مولينا زيادة سماكة القضيب${
            doctor.girthEnhancementSince !== undefined ? ` منذ ${doctor.girthEnhancementSince}` : ""
          }${
            doctor.girthProcedureCount !== undefined ? `، بعدد ${doctor.girthProcedureCount} إجراء منجز` : ""
          }.`
        : ""),
    href: "/male-aesthetics/penile-girth-enhancement",
    linkLabel: "استكشف زيادة سماكة القضيب",
  },
  {
    eyebrow: "النشاط الأكاديمي",
    heading: "استمرارية الارتباط بالتعليم",
    body:
      "حافظ د. مولينا على ارتباطه بالتعليم والتدريب الأكاديمي طوال مسيرته السريرية، بما يعكس التزامًا بالمجال يتجاوز رعاية المريض الفردية." +
      (doctor.medicalTrainer?.description
        ? // Arabic translation of `doctor.medicalTrainer.description` (src/config/doctor.ts) — keep in sync with it and with this page's other copy below, and with AuthorityMediaSectionAr.tsx's copy of the same translation.
          " إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا متخصصًا في تقنيات تجميل القضيب لأطباء المسالك البولية وأطباء التجميل من خلال برنامج AndroMax Training."
        : ""),
  },
];

export default function AboutPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <EditorialField className="py-14">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first lg:max-w-lg">
            <HeroPortrait
              slot="aboutPortrait"
              priority
              objectPosition="center 4%"
              alt="صورة الدكتور أليخاندرو مولينا"
            />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                نبذة
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                د. أليخاندرو مولينا
              </h1>
              <p className="mt-6 max-w-lg font-display text-2xl leading-snug">تدريب أوروبي. خلفية جراحية. تركيز متخصص على صحة الرجل.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">استشاري أمراض المسالك البولية والذكورة</p>
                {/* Arabic translation of `practiceLocationLine` (src/config/practice.ts) — keep in sync with it and with BookingSectionAr.tsx's copy of this same line. */}
                <p className="mt-3 text-sm text-muted-foreground">مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">احجز استشارة</BookingCta>
                {isPhysicianProfileConfigured && (
                  <a
                    href={practice.physicianProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    عرض الملف الشخصي في NMC
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </EditorialField>

      <section className="border-t border-border bg-background py-14">
        <Container>
          <PhysicianAuthority locale="ar" />
        </Container>
      </section>

      <RecognitionSection locale="ar" />

      {/* Narrative — alternating editorial rows */}
      <section className="border-t border-border py-section-y">
        <Container>
          <p className="text-xs uppercase text-accent-strong">الرحلة السريرية</p>
          <h2 className="mt-4 max-w-xl font-display text-display-lg">أساس جراحي. تركيز يزداد تخصصًا.</h2>
          <ExpertiseTimeline items={narrative} locale="ar" />
        </Container>
      </section>

      <section className="py-section-y">
        <Container className={visual.split}>
          <div>
            <PhotoFrame slot="aboutConsultation" landscape alt="الدكتور أليخاندرو مولينا أثناء استشارة سريرية" />
            <div className="mt-8"><PullQuote>تُعالَج زيادة سماكة القضيب ضمن سياق طب الذكورة والمسالك البولية — بنهج قائم على التشريح وتحت إشراف طبي، وليست خدمة تجميلية قائمة بذاتها.</PullQuote></div>
          </div>
          <FlagshipAuthorityFeature locale="ar" />
        </Container>
      </section>

      {/* Medical Education & Training. Deliberately has no BookingCta or any
          clinical CTA — kept as a purely informational section so the
          B2B training proposition never mixes with the clinical B2C
          booking flow (owner's explicit instruction, mirrored from the
          English page). Renders nothing if `doctor.medicalTrainer` is
          ever unset. */}
      {doctor.medicalTrainer?.description && (
        <section className="border-t border-border py-section-y">
          <Container className={visual.split}>
            <PhotoFrame slot="aboutTraining" landscape alt="الدكتور أليخاندرو مولينا في زي طبي" />
            <Reveal>
              <MedicalEducationDiagram
                className="mb-6 h-16 w-16 text-muted-foreground"
                title="إرشاد الأطباء والتدريب الموجّه بالموجات فوق الصوتية"
              />
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                التعليم والتدريب الطبي
              </p>
              <h2 className="mt-4 font-display text-display-md">{doctor.medicalTrainer.program}</h2>
              {/* Arabic translation of `doctor.medicalTrainer.description` (src/config/doctor.ts) — keep in sync with it and with the narrative[] copy above, and with AuthorityMediaSectionAr.tsx's copy of the same translation. */}
              <p className="mt-6 text-body-lg text-muted-foreground">
                إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا متخصصًا في تقنيات تجميل القضيب لأطباء المسالك البولية وأطباء التجميل من خلال برنامج AndroMax Training.
              </p>
              {doctor.medicalTrainer.programUrl && (
                <a
                  href={doctor.medicalTrainer.programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  زيارة {doctor.medicalTrainer.program}
                </a>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture />
        <Container>
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            الخلفية
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">المؤهلات</h2>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctor.credentials.map((item) => (
              <StaggerItem key={item} className="flex items-baseline gap-3">
                <span aria-hidden className="h-px w-4 shrink-0 bg-accent-strong" />
                <span className="text-sm text-muted-foreground">{CREDENTIALS_AR[item] ?? item}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <MediaAppearancesSection locale="ar" />

      {publications.length > 0 && (
        <section className="border-t border-border py-section-y">
          <Container>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              منشورات مختارة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">مساهم وكاتب — مجلة Men&rsquo;s Health إسبانيا</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
              {publications.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group block border-t border-border pt-6"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.outletName}</p>
                  <p className="mt-3 font-display text-lg text-foreground underline decoration-transparent underline-offset-4 group-hover:decoration-accent-strong">
                    {PUBLICATION_LABELS_AR[item.label] ?? item.label}
                  </p>
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}

      <PatientFeedbackSection locale="ar" />

      <section className="bg-surface py-section-y">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-display text-display-md text-foreground">
              استشر د. أليخاندرو مولينا في أبوظبي
            </h2>
            {/* Arabic translation of `practiceLocationLine` (src/config/practice.ts) — keep in sync with it and with BookingSectionAr.tsx's copy of this same line. */}
            <p className="mt-4 text-sm text-muted-foreground">مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="page-closing-cta" size="lg">احجز استشارة</BookingCta>
            </div>
            <div className="mt-6">
              <PatientReviewsCta locale="ar" />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
