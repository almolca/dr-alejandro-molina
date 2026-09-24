import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { doctor } from "@/config/doctor";
import { Button } from "@/components/ui/Button";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/urologic-surgery";

export const metadata: Metadata = buildMetadata({
  title: "جراحة المسالك البولية المتقدمة في أبوظبي",
  description:
    "رعاية جراحية بالمنظار لسرطان البروستاتا مع د. أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة في أبوظبي — بما في ذلك استئصال البروستاتا الجذري بالمنظار، مع شرح شفاف لكيفية تأثير خبرة الجراح والتقنية على النتائج.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة المسالك البولية", href: PATH },
];

const faqItems = [
  {
    question: "هل هذه نفس الممارسة التي تركز على الصحة الجنسية للرجال؟",
    answer:
      "نعم. تستمر ممارسة د. مولينا في طب الذكورة والطب الجنسي كما كانت — وتُعد جراحة المسالك البولية مجالًا إضافيًا منفصلاً يعكس تدريبه وخبرته الأوسع كاستشاري أمراض المسالك البولية، مع تركيز خاص على استئصال البروستاتا الجذري بالمنظار لعلاج سرطان البروستاتا.",
  },
  {
    question: "هل يُجري د. مولينا جراحة روبوتية؟",
    answer:
      "لا. يُجري د. مولينا استئصال البروستاتا الجذري بالمنظار، وليس بمساعدة الروبوت. توضح صفحة استئصال البروستاتا الجذري بالمنظار الفرق بين النهجين، ولماذا تُعد المنصة الجراحية جزءًا واحدًا فقط من النتيجة.",
    readMoreHref: "/ar/urologic-surgery/laparoscopic-radical-prostatectomy",
    readMoreLabel: "استكشف استئصال البروستاتا الجذري بالمنظار",
  },
  {
    question: "ما الإجراءات الأخرى التي تندرج ضمن جراحة المسالك البولية؟",
    answer:
      "يُعد استئصال البروستاتا الجذري بالمنظار محور التركيز الحالي في هذا المجال. تشمل خلفية د. مولينا الجراحية الأوسع في المسالك البولية أيضًا جراحة الكلى بالمنظار؛ وستُضاف صفحات مخصصة لإجراءات إضافية هنا عند اكتمالها.",
  },
  {
    question: "كيف أبدأ؟",
    answer:
      "تبدأ العملية باستشارة لمراجعة تشخيصك وصورك الإشعاعية وتقرير علم الأمراض، ومناقشة ما إذا كان استئصال البروستاتا الجذري بالمنظار خيارًا مناسبًا لحالتك.",
  },
];

export default function UrologicSurgeryPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "جراحة المسالك البولية المتقدمة",
              description: "رعاية جراحية بالمنظار لسرطان البروستاتا، مع شرح شفاف لكيفية تأثير خبرة الجراح والتقنية على النتائج.",
              path: PATH,
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <EditorialField className="py-14">
        <HeroAtmosphere align="left" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first">
            <EditorialFrame slot="urologicSurgeryHero" landscape priority />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                جراحة المسالك البولية المتقدمة · أبوظبي
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                جراحة المسالك البولية المتقدمة
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
                رعاية جراحية بالمنظار لأمراض البروستاتا والكلى، من
                استشاري أمراض المسالك البولية والذكورة — مع تركيز خاص على
                استئصال البروستاتا الجذري بالمنظار لعلاج سرطان البروستاتا.
              </p>
              <Link href="/ar/urologic-surgery/laparoscopic-radical-prostatectomy" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">
                استكشف استئصال البروستاتا الجذري بالمنظار
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="urologic_surgery" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
              </div>
            </Reveal>
            <div className={visual.physicianIdentity}><p>{AR_IDENTITY.doctorDisplayName}</p><span>{AR_IDENTITY.doctorTitle}</span></div>
          </div>
        </Container>
      </EditorialField>

      {/* Flagship — استئصال البروستاتا الجذري بالمنظار */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.6fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading eyebrow="مجال التركيز" heading="استئصال البروستاتا الجذري بالمنظار" size="xl" locale="ar" />
            <div className={visual.flagshipMetrics}>
              <p><strong>{doctor.laparoscopicProstatectomy.procedureCount}</strong><span>استئصال بروستاتا جذري بالمنظار</span></p>
              <p><strong>{doctor.laparoscopicProstatectomy.outcomes.majorComplications.value}%</strong><span>مضاعفات كبرى (Clavien-Dindo ≥III)</span></p>
            </div>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                علاج جراحي لسرطان البروستاتا الموضعي، يُجرى بالمنظار — لا
                بالروبوت. المنصة الجراحية جزء واحد فقط من النتيجة: تؤدي
                خبرة الجراح والتقنية واختيار المرضى وحجم الجراحات دورًا
                رئيسيًا أيضًا، وهو ما يُشرح بشفافية في صفحة الإجراء
                الكاملة، إلى جانب نطاقات مرجعية منشورة كسياق.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/ar/urologic-surgery/laparoscopic-radical-prostatectomy">استكشف استئصال البروستاتا الجذري بالمنظار</Link>
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* الخلفية الجراحية الأوسع — نص فقط، بدون روابط لصفحات غير موجودة بعد */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="الخلفية الجراحية"
            heading="ما وراء جراحة سرطان البروستاتا"
            description="يمتد تدريب د. مولينا وخبرته كاستشاري أمراض المسالك البولية إلى ما هو أبعد من جراحة سرطان البروستاتا، ليشمل جراحة الكلى بالمنظار. ستُضاف صفحات مخصصة لهذه المجالات هنا عند اكتمالها — ويمكن مناقشتها مباشرة أثناء الاستشارة في الوقت الحالي."
            locale="ar"
          />
        </Container>
      </section>

      {/* نبذة عن د. مولينا */}
      <section className="border-t border-border bg-background py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            نبذة
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            {AR_IDENTITY.doctorDisplayName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            تُجرى جراحة المسالك البولية في هذه الممارسة ضمن ممارسة
            استشاري أمراض المسالك البولية والذكورة
            {doctor.yearsOfExperience !== undefined &&
              ` — بخبرة تزيد عن ${doctor.yearsOfExperience} عامًا في طب المسالك البولية`}
            .
          </p>
          <Link
            href="/ar/about"
            className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
          >
            نبذة عن {AR_IDENTITY.doctorDisplayName}
          </Link>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "استئصال البروستاتا الجذري بالمنظار", href: "/ar/urologic-surgery/laparoscopic-radical-prostatectomy" },
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "زراعة دعامة القضيب", href: "/ar/penile-implant" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش تشخيصك وخياراتك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
      />
    </div>
  );
}
