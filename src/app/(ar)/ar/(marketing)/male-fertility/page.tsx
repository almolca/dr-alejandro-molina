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

const PATH = "/ar/male-fertility";

export const metadata: Metadata = buildMetadata({
  title: "خصوبة الرجل",
  description:
    "تقييم متخصص لخصوبة الرجل في أبوظبي — التاريخ المرضي، وتحليل السائل المنوي، والتقييم الهرموني، والتصوير، لتحديد العوامل المساهمة قبل النظر في أي علاج.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "خصوبة الرجل", href: PATH },
];

const historyExam = [
  "التاريخ الإنجابي — بما في ذلك مدة محاولة الإنجاب والتاريخ المرضي ذو الصلة",
  "الفحص السريري",
];

const labsImaging = [
  "تحليل السائل المنوي",
  "التقييم الهرموني",
  "الموجات فوق الصوتية، عند الحاجة",
];

/** varicocele stays temporary EN — ships Batch 2. */
const findings = [
  { label: "دوالي الخصية", href: "/male-fertility/varicocele" },
  { label: "معايير غير طبيعية للسائل المنوي", href: undefined },
  { label: "العقم بعامل الذكور", href: undefined },
  { label: "تجزؤ الحمض النووي للحيوانات المنوية، عند الحاجة السريرية", href: undefined },
];

const contributors = [
  {
    title: "نمط الحياة والأيض",
    description:
      "يمكن أن يؤثر الوزن ومستوى النشاط والتدخين والكحول والصحة الأيضية على معايير السائل المنوي والتوازن الهرموني.",
  },
  {
    title: "الأدوية والهرمونات",
    description:
      "قد تؤثر بعض الأدوية والاختلالات الهرمونية — بما في ذلك العوامل المرتبطة بالتستوستيرون — على الخصوبة، وتُراجَع كجزء من التقييم.",
  },
];

const faqItems = [
  {
    question: "هل يعني تحليل السائل المنوي غير الطبيعي أنني بحاجة إلى علاج؟",
    answer:
      "ليس بالضرورة. تُفسَّر النتائج كجزء من تقييم شامل — التاريخ المرضي، والفحص، والتقييم الهرموني، والتصوير عند الحاجة — وليس من نتيجة فحص واحدة بمعزل عن غيرها.",
  },
  {
    question: "ماذا لو تم اكتشاف دوالي خصية بالموجات فوق الصوتية؟",
    answer:
      "لا تتطلب كل دوالي خصية تُكتشف بالتصوير علاجًا. تُقيَّم أهميتها بالنسبة للخصوبة ووظيفة الخصية بشكل فردي.",
  },
  {
    question: "هل سأحتاج إلى جراحة؟",
    answer:
      "معظم الرجال لا يحتاجون إلى ذلك. عندما يكون خيار جراحي مثل إصلاح دوالي الخصية مناسبًا سريريًا، يُنظر فيه كجزء من تقييم أوسع. تُعالَج بعض أسباب العقم من خلال علاج إنجابي إضافي — بما في ذلك الاستخراج الجراحي للحيوانات المنوية في حالات مختارة — وهو أمر يقع خارج نطاق خدمات هذه الممارسة ويُنسَّق مع فرق الإنجاب المساعد عند الحاجة.",
  },
  {
    question: "هل تتعاونون مع عيادات الخصوبة؟",
    answer:
      "لا توجد شراكة رسمية مع عيادة خصوبة أو مركز أطفال أنابيب محدد. عند صلة الإنجاب المساعد بالحالة، يدعم التقييم والنتائج رعاية الخصوبة متعددة التخصصات — بالتنسيق مع فرق الإنجاب المساعد عند الحاجة.",
  },
];

export default function MaleFertilityPageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" }),
          medicalWebPageSchema(
            {
              name: "خصوبة الرجل",
              description:
                "تقييم متخصص لخصوبة الرجل، يجمع بين التاريخ المرضي والفحص السريري وتحليل السائل المنوي والتقييم الهرموني لتحديد العوامل المساهمة.",
              path: PATH,
              aboutType: "MedicalCondition",
              /** Kept in English — a schema.org machine-readable taxonomy field, not visible page copy. */
              aboutName: "Male Infertility",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              خصوبة الرجل
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              خصوبة الرجل
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم متخصص يجمع بين التاريخ المرضي والفحص السريري
              وتحليل السائل المنوي والتقييم الهرموني لتحديد العوامل
              المساهمة وتوجيه الخطوات التالية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="fertility" size="lg">
                احجز استشارة خصوبة الرجل
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="كيف يتم التقييم" heading="التاريخ والفحص، والمختبر والتصوير" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                التاريخ والفحص
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
              <p className="text-xs font-medium uppercase text-muted-foreground">
                المختبر والتصوير
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

      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="النتائج الشائعة" heading="ما قد يكشفه التقييم" locale="ar" />
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
                      معرفة المزيد
                    </Link>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {contributors.map((item) => (
            <Reveal key={item.title}>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                العوامل المساهمة
              </p>
              <h2 className="mt-4 font-display text-display-md text-foreground">{item.title}</h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              ما بعد التقييم
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              الحفاظ على الخصوبة والرعاية التعاونية.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              عند الحاجة، تُناقَش إمكانية الحفاظ على الخصوبة كجزء من
              ظروفك الفردية. يدعم التقييم رعاية الخصوبة متعددة
              التخصصات، بالتنسيق مع فرق الإنجاب المساعد عند الحاجة —
              دون وجود شراكة رسمية مع عيادة أو مركز محدد. يُعدّ العلاج
              الإنجابي الإضافي، بما في ذلك الاستخراج الجراحي للحيوانات
              المنوية، خيارًا معترفًا به ضمن طب الإنجاب لتشخيصات
              مختارة؛ وعند صلته بفهم مسارك العلاجي، تُناقَش هذه الخيارات
              لأغراض تثقيفية، رغم أنها ليست خدمة تُقدَّم مباشرة هنا. لا
              تتطلب كل نتيجة فحص غير طبيعية علاجًا؛ إذ تُفسَّر النتائج
              دائمًا كجزء من تقييم شامل.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "دوالي الخصية", href: "/male-fertility/varicocele" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/mens-health/testosterone" },
          { label: "المقالات الطبية (بالإنجليزية)", href: "/insights" },
        ]}
      />

      <Faq items={faqItems} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />

      <TreatmentCtaSection heading="ابدأ بتقييم الخصوبة" sourcePage={PATH} bookingLabel="احجز استشارة" />
    </>
  );
}
