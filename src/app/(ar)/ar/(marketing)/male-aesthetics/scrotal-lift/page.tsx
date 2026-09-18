// src/app/(ar)/ar/(marketing)/male-aesthetics/scrotal-lift/page.tsx
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

const PATH = "/ar/male-aesthetics/scrotal-lift";

export const metadata: Metadata = buildMetadata({
  title: "شد الصفن",
  description:
    "جراحة تجميلية للصفن في أبوظبي لعلاج زيادة أو ترهل جلد الصفن — تقييم متخصص، وتخطيط جراحي فردي، ونقاش واقعي حول الندبات والتعافي والحدود.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: "/ar/male-aesthetics" },
  { name: "شد الصفن", href: PATH },
];

const strapline = ["قائم على التشريح", "تحت إشراف طبي", "مخطط له فرديًا"];

const causes = [
  {
    label: "زيادة أو ترهل جلد الصفن",
    description:
      "السبب الأكثر شيوعًا للاستشارة — يمكن أن يتطور ترهل الجلد مع التقدم في العمر أو تغير الوزن أو بعد فقدان وزن كبير، ويُقيَّم بشكل فردي.",
  },
  {
    label: "عدم التماثل أو الانزعاج",
    description:
      "يعاني بعض الرجال من عدم تماثل أو احتكاك أو انزعاج مرتبط بزيادة النسيج، ويُراجَع ذلك إلى جانب التشريح والأهداف أثناء الاستشارة.",
  },
];

const process = [
  {
    title: "التقييم",
    description:
      "تبدأ الاستشارة بفحص تشريح الصفن وجودة الجلد وأي عوامل مساهمة، إلى جانب أهدافك وتاريخك المرضي.",
  },
  {
    title: "التخطيط الجراحي الفردي",
    description:
      "حيثما كانت الجراحة مناسبة، يُخطَّط للنهج — بما في ذلك موضع الشق والندبة — وفقًا لتشريحك المحدد، لا وفق نموذج موحّد.",
  },
  {
    title: "التعافي",
    description:
      "تُناقَش توقعات التعافي وقيود النشاط والمتابعة بالتفصيل مسبقًا، وفقًا للخطة المتفق عليها أثناء الاستشارة.",
  },
];

const faqItems = [
  {
    question: "هل ترهل جلد الصفن أمر طبيعي؟",
    answer:
      "نعم، إلى حد كبير. يفقد جلد الصفن مرونته تدريجيًا مع التقدم في العمر نتيجة فقدان الكولاجين، وهذا تغيّر طبيعي شائع لا يستدعي بحد ذاته أي قلق صحي. يصبح الأمر موضع نقاش طبي فقط عندما يسبب الترهل انزعاجًا فعليًا أو تأثيرًا على الثقة يدفع الرجل لطلب تقييم — لا لأن الترهل نفسه حالة مرضية.",
  },
  {
    question: "ما هو شد الصفن؟",
    answer:
      "يعالج شد الصفن، أو الجراحة التجميلية للصفن، زيادة أو ترهل جلد الصفن من خلال نهج جراحي مخطط له فرديًا — يُقيَّم ويُجرى ضمن سياق طب المسالك البولية والذكورة، لا كإجراء تجميلي عام.",
  },
  {
    question: "هل ستظهر ندبات واضحة؟",
    answer:
      "بعض الندبات جزء متوقع من أي جراحة صفن. تُناقَش مواضعها المحتملة ومظهرها وكيفية استقرارها مع مرور الوقت بالتفصيل أثناء الاستشارة، إلى جانب تشريحك الفردي.",
  },
  {
    question: "كم تستغرق فترة التعافي؟",
    answer:
      "يختلف التعافي بين الأفراد ويعتمد على مدى الجراحة المُجراة. تُناقَش الجداول الزمنية العامة وقيود النشاط أثناء الاستشارة بدلاً من ذكرها هنا بمعزل عن السياق.",
  },
  {
    question: "ما هي حدود هذا الإجراء؟",
    answer:
      "كما هو الحال مع أي إجراء جراحي، للنتائج حدود ولا يمكن ضمانها. يُعد التورم وعدم التماثل وتغير الإحساس والندبات من بين المخاطر التي تُراجَع بشكل فردي قبل المضي قدمًا.",
  },
  {
    question: "هل يمكن الجمع بين هذا وزيادة سماكة القضيب؟",
    answer:
      "يثير بعض الرجال كلا المخاوف في الاستشارة نفسها. تعتمد ملاءمة الجمع بين الإجراءين على التشريح الفردي وتُقيَّم حالة بحالة — ولا تُفترض بشكل افتراضي.",
  },
  {
    question: "كيف أبدأ؟",
    answer:
      "تبدأ العملية باستشارة لتقييم التشريح والأهداف والملاءمة قبل مناقشة أي خطة جراحية.",
  },
];

export default function ScrotalLiftPageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "شد الصفن",
              description: "جراحة تجميلية للصفن لعلاج زيادة أو ترهل جلد الصفن، مع تخطيط جراحي فردي قائم على التشريح والأهداف والتوقعات الواقعية.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Scrotal Lift",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              التجميل الذكوري
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              شد الصفن
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              جراحة تجميلية للصفن لعلاج زيادة أو ترهل جلد الصفن، مع
              تخطيط جراحي فردي قائم على التشريح والأهداف والتوقعات
              الواقعية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase text-muted-foreground">
              {strapline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="male_aesthetics" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Common reasons for consultation */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="الأسباب الشائعة للاستشارة" heading="لماذا يفكر الرجال في شد الصفن" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {causes.map((item) => (
              <StaggerItem key={item.label}>
                <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-[1fr_2fr] sm:gap-16">
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {item.label}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Process */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="كيف يعمل هذا" heading="التقييم والتخطيط والتعافي" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {process.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Scarring, recovery and limitations — olive */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              نقاش واقعي
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              تُناقَش الندبات والتعافي والحدود بصراحة.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تُراجَع مواضع الندبات ووقت التعافي المتوقع وتغير الإحساس
              وحدود ما يمكن أن تحققه الجراحة بالتفصيل قبل اتخاذ أي قرار.
              وكما هو الحال مع أي إجراء جراحي، تختلف النتائج بين
              الأفراد ولا يمكن ضمان نتائج محددة.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" },
          { label: "التجميل الذكوري", href: "/ar/male-aesthetics" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش تشريحك وأهدافك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "العودة إلى التجميل الذكوري", href: "/ar/male-aesthetics" }}
      />
    </>
  );
}
