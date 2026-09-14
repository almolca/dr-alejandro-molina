import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { ContourPlanningDiagram } from "@/components/illustrations/ContourPlanningDiagram";
import { Button } from "@/components/ui/Button";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TonalSection } from "@/components/ui/TonalSection";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-aesthetics";

export const metadata: Metadata = buildMetadata({
  title: "التجميل الذكوري",
  description:
    "تقييم متخصص في طب المسالك البولية والذكورة في أبوظبي للرجال الذين يفكرون في تجميل القضيب أو تصحيح علاج سابق — بنهج قائم على التشريح وتحت إشراف طبي. الإجراء الرائد: زيادة سماكة القضيب بحمض الهيالورونيك.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: PATH },
];

const girthAuthorityLineAr = [
  doctor.girthProcedureCount !== undefined && `${doctor.girthProcedureCount} إجراء منجز`,
  doctor.girthEnhancementSince !== undefined && `خبرة منذ ${doctor.girthEnhancementSince}`,
]
  .filter((part): part is string => Boolean(part))
  .join("، ");

/** Temporary EN destinations — ship Batch 3. */
const secondaryAreas = [
  {
    title: "شد الصفن",
    description:
      "جراحة تجميلية للصفن للرجال الذين يعانون من زيادة أو ترهل في جلد الصفن. يُخصَّص التقييم والتخطيط الجراحي فرديًا، مع مناقشة تفصيلية لموضع الندبة والتعافي والقيود.",
    cta: { label: "استكشف شد الصفن", href: "/male-aesthetics/scrotal-lift" },
  },
  {
    title: "تصحيح حشو القضيب",
    description:
      "قد يعاني الرجال الذين خضعوا سابقًا لحقن حشو في القضيب — هنا أو في مكان آخر — من عدم تناسق، أو عقيدات، أو عدم انتظام، أو انزياح، أو عدم رضا عن النتائج السابقة. تُقيَّم هذه الحالات فرديًا، مع النظر في إذابة الحشو أو التصحيح عند الحاجة.",
    cta: { label: "استكشف تصحيح حشو القضيب", href: "/male-aesthetics/penile-filler-correction" },
  },
];

const faqItems = [
  {
    question: "هل هذا مماثل لعلاج الحشو التجميلي العام؟",
    answer:
      "لا. يُعالَج التجميل الذكوري ضمن سياق طب الذكورة والمسالك البولية، مع تقييم تشريحي وطبي كامل — وليس إجراءً تجميليًا عامًا بلا موعد مسبق.",
  },
  {
    question: "ماذا لو خضعت لحقن حشو في مكان آخر ولم أكن راضيًا عن النتيجة؟",
    answer:
      "تُقيَّم مشكلات الحشو السابقة — بما في ذلك عدم التناسق أو العقيدات أو عدم الانتظام — فرديًا، مع النظر في التصحيح عند الحاجة.",
  },
  {
    question: "هل تتوفر خيارات جراحية؟",
    answer:
      "يُنظر في الخيارات الجراحية فقط عند الحاجة والموافقة عليها، وتُناقش فرديًا أثناء الاستشارة — وليست خيارًا افتراضيًا. شد الصفن، للرجال الذين يعانون من زيادة أو ترهل في جلد الصفن، هو أحد هذه الخيارات الجراحية.",
  },
  {
    question: "هل يمكن ضمان نتيجة محددة؟",
    answer:
      "لا يمكن ضمان أي نتيجة محددة. تختلف النتائج الفردية، وتُناقش التوقعات الواقعية بالتفصيل كجزء من التقييم.",
  },
  {
    question: "كيف تبدأ العملية؟",
    answer:
      "تبدأ العملية باستشارة طبية لتقييم التشريح والأهداف والملاءمة قبل مناقشة أي خيار بشكل أعمق.",
  },
];

export default function MaleAestheticsPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" }),
          medicalWebPageSchema(
            {
              name: "التجميل الذكوري",
              description:
                "تقييم متخصص في طب المسالك البولية والذكورة للرجال الذين يفكرون في تجميل القضيب أو تصحيح علاج سابق.",
              path: PATH,
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <EditorialField className="py-14">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first">
            <EditorialFrame slot="aestheticsHero" landscape priority />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                التجميل الذكوري · أبوظبي
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                التجميل الذكوري
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
                رعاية تجميلية للقضيب والصفن بإشراف استشاري، تجمع بين
                تشريح متخصص في المسالك البولية، وخبرة إجرائية، وتخطيط
                علاج فردي.
              </p>
              <Link href="/male-aesthetics/penile-girth-enhancement" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">استكشف زيادة سماكة القضيب</Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="male_aesthetics" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
              </div>
            </Reveal>
          <div className={visual.physicianIdentity}><p>{AR_IDENTITY.doctorDisplayName}</p><span>{AR_IDENTITY.doctorTitle}</span></div>
          </div>
        </Container>
      </EditorialField>

      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.6fr] lg:items-center lg:gap-16">
          <div>
          <SectionHeading eyebrow="الإجراء الرائد" heading="زيادة سماكة القضيب" size="xl" locale="ar" />
          <div className="my-8"><AuthorityBlock locale="ar" /></div>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              الإجراء الرائد في هذه الممارسة، والهدف الأكثر شيوعًا الذي
              يُطرح في الاستشارة. تكبير القضيب بحمض الهيالورونيك هو نقطة
              البداية الأكثر مناقشة، ويُخطَّط وفق التشريح الفردي — وليس
              إجراءً تجميليًا بلا موعد مسبق — مع النظر في الخيارات
              الجراحية فقط عند الحاجة.
              {girthAuthorityLineAr ? ` يتمتع د. مولينا بـ${girthAuthorityLineAr}.` : ""}
            </p>
            <Button asChild size="lg" className="mt-8"><Link href="/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link></Button>
          </Reveal>
          </div>
          <Reveal delay={0.1} className="hidden justify-self-center lg:flex">
            <ContourPlanningDiagram className="h-40 w-40 text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      <TonalSection tone="warm" className="border-t border-border">
        <Container>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            متوفر أيضًا
          </p>
          <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-12 pt-10 md:grid-cols-2">
            {secondaryAreas.map((area) => (
              <Reveal key={area.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-xl text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <Link
                  href={area.cta.href}
                  className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4 hover:decoration-accent"
                >
                  {area.cta.label}
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </TonalSection>

      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              لماذا يهم التقييم المتخصص
            </p>
            <p className="mt-6 text-body-lg text-foreground">
              يختلف تشريح القضيب بشكل كبير بين الأفراد. العلاج المخطَّط
              له دون تقييم تشريحي وطبي مناسب يحمل خطرًا أكبر لعدم
              التناسق أو عدم الانتظام أو عدم الرضا.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "التشريح",
                "خصائص الأنسجة",
                "العلاجات السابقة",
                "الأهداف",
                "المخاطر",
                "خيارات التصحيح",
                "المتابعة",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              كما هو الحال مع أي إجراء تجميلي أو تكبيري، تختلف النتائج
              الفردية ولا يمكن ضمانها. تعتمد المخاطر على النهج المحدد
              الذي يُنظر فيه، وتُستعرض بالتفصيل أثناء الاستشارة إلى جانب
              التوقعات الواقعية.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              نبذة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {AR_IDENTITY.doctorDisplayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يُجرى التجميل الذكوري في هذه الممارسة ضمن ممارسة {AR_IDENTITY.doctorTitle}
              {doctor.girthEnhancementSince !== undefined &&
                `، بخبرة في زيادة سماكة القضيب منذ ${doctor.girthEnhancementSince}`}
              .
            </p>
            <Link
              href="/ar/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              نبذة عن {AR_IDENTITY.doctorDisplayName}
            </Link>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "شد الصفن", href: "/male-aesthetics/scrotal-lift" },
          { label: "تصحيح حشو القضيب", href: "/male-aesthetics/penile-filler-correction" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ باستشارة طبية"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{
          label: "استكشف زيادة سماكة القضيب",
          href: "/male-aesthetics/penile-girth-enhancement",
        }}
      />
    </div>
  );
}
