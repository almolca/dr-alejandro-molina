import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import type { Metadata } from "next";
import { ConsultationPathwayDiagram } from "@/components/illustrations/ConsultationPathwayDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/sexual-medicine";

export const metadata: Metadata = buildMetadata({
  title: "الطب الجنسي",
  description:
    "طب جنسي متخصص في أبوظبي — تقييم ضعف الانتصاب وسرعة القذف، ودوبلر القضيب والعلاج بموجات الصدمة، مع علاج يتناسب مع السبب الكامن.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "الطب الجنسي", href: PATH },
];

/** All four now live in Arabic (Batch 2), except shockwave-therapy, which is outside all four R9 Phase B batches (no scheduled Arabic build). */
const areas = [
  {
    label: "ضعف الانتصاب",
    description: "تقييم يبدأ بالتشخيص، وسلّم علاجي يتناسب مع السبب.",
    href: "/ar/erectile-dysfunction",
  },
  {
    label: "سرعة القذف",
    description: "خيارات سلوكية ونفسية-جنسية وطبية وإجرائية تتناسب مع كل فرد.",
    href: "/ar/sexual-medicine/premature-ejaculation",
  },
  {
    label: "دوبلر القضيب",
    description: "تقييم متقدم بالموجات فوق الصوتية لتدفق الدم في القضيب، عند الحاجة.",
    href: "/ar/erectile-dysfunction/penile-doppler",
  },
  {
    label: "العلاج بموجات الصدمة",
    description: "Li-SWT — أحد الخيارات التي يُنظر فيها لمرضى مختارين، بعد التقييم.",
    href: "/erectile-dysfunction/shockwave-therapy",
  },
];

export default function SexualMedicinePageAr() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الطب الجنسي
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">الطب الجنسي</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم وعلاج متخصص لضعف الانتصاب وسرعة القذف، يتناسب مع
              السبب الكامن بدلًا من نهج افتراضي واحد.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">احجز استشارة</BookingCta>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ConsultationPathwayDiagram className="mt-14 h-16 w-full max-w-md text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <StaggerGroup className="border-t border-border">
            {areas.map((area, index) => (
              <StaggerItem key={area.href}>
                <Link
                  href={area.href}
                  className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-6 gap-y-2 border-b border-border py-8 sm:grid-cols-[4rem_1fr_1fr] sm:items-center"
                >
                  <span className="font-display text-2xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-2 font-display text-2xl text-foreground sm:col-span-1">
                    {area.label}
                  </span>
                  <span className="col-span-2 max-w-sm text-sm text-muted-foreground sm:col-span-1">
                    {area.description}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq
        eyebrow="الأسئلة الشائعة"
        heading="الأسئلة الشائعة"
        locale="ar"
        items={[
          {
            question: "من أين أبدأ إذا لم أكن متأكدًا من سبب المشكلة؟",
            answer:
              "بالتقييم. قد يكون لضعف الانتصاب وسرعة القذف عدة أسباب مساهمة، ويتناسب العلاج مع ما يُكتشف فعليًا — وليس افتراضًا من الأعراض وحدها.",
          },
          {
            question: "هل دوبلر القضيب مطلوب دائمًا؟",
            answer:
              "لا. يُستخدم عندما يلزم تقييم سبب وعائي تحديدًا، وليس كخطوة روتينية لكل مريض.",
          },
          {
            question: "هل العلاج بموجات الصدمة خيار علاجي أول؟",
            answer:
              "لا. هو أحد الخيارات التي قد يُنظر فيها لمرضى مختارين بعد التقييم، وليس نقطة بداية قائمة بذاتها.",
          },
          {
            question: "هل تعالجون سرعة القذف أيضًا، وليس فقط ضعف الانتصاب؟",
            answer:
              "نعم. تُقيَّم سرعة القذف بنفس النهج المتخصص، مع مراعاة الخيارات السلوكية والنفسية-الجنسية والطبية — والإجرائية في حالات مختارة.",
            readMoreHref: "/ar/sexual-medicine/premature-ejaculation",
            readMoreLabel: "استكشف سرعة القذف",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="ابدأ بالتقييم، لا بالافتراض"
        sourcePage={PATH}
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
        bookingLabel="احجز استشارتك السرية"
      />
    </>
  );
}
