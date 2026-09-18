// src/app/(ar)/ar/(marketing)/male-fertility/varicocele/page.tsx
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-fertility/varicocele";

export const metadata: Metadata = buildMetadata({
  title: "دوالي الخصية",
  description:
    "تقييم دوالي الخصية في أبوظبي — الفرق بين الدوالي السريرية ودون السريرية المكتشفة بالموجات فوق الصوتية، صلتها بالخصوبة، والمراقبة مقابل التدخل عند الاقتضاء.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "خصوبة الرجل", href: "/ar/male-fertility" },
  { name: "دوالي الخصية", href: PATH },
];

const faqItems = [
  {
    question: "هل تحتاج كل دوالي خصية إلى علاج؟",
    answer: "لا. يُكتفى بمراقبة كثير من حالات دوالي الخصية، خاصة عند غياب الأعراض وعدم وجود قلق حالي بشأن الخصوبة. لا يُعالَج اكتشاف بالموجات فوق الصوتية وحده بمعزل عن السياق.",
  },
  {
    question: "هل يضمن علاج دوالي الخصية تحسّن الخصوبة؟",
    answer: "لا يمكن ضمان نتيجة محددة. يتمتع كثير من الرجال المصابين بدوالي الخصية بخصوبة طبيعية، وتختلف الاستجابة لأي تدخل من شخص لآخر.",
  },
  {
    question: "هل تسبب دوالي الخصية العقم؟",
    answer: "ليس بالضرورة. يمكن لدوالي الخصية، لدى بعض الرجال، أن تؤثر على معايير السائل المنوي ووظيفة الخصية مع مرور الوقت، لكن كثيرًا من الرجال المصابين بها يتمتعون بخصوبة طبيعية تمامًا. وجودها وحده لا يتنبأ بالعقم، ولا يُتخذ قرار العلاج بناءً على اكتشافها فقط، بل يُنظر إليها ضمن الصورة الكاملة — الأعراض وتحليل السائل المنوي وأهداف الإنجاب معًا.",
  },
  {
    question: "ما الفرق بين دوالي الخصية السريرية ودون السريرية؟",
    answer: "يمكن الشعور بدوالي الخصية السريرية عند الفحص السريري. أما دوالي الخصية دون السريرية (تحت الإكلينيكية) فلا تظهر إلا بالموجات فوق الصوتية. هذا التمييز يؤثر على مدى أهمية النتيجة.",
  },
  {
    question: "هل دوالي الخصية مؤلمة دائمًا؟",
    answer: "لا. يعاني بعض الرجال من انزعاج، خاصة بعد الوقوف لفترات طويلة؛ ولا يعاني كثيرون من أي أعراض على الإطلاق، وتُكتشف دوالي الخصية بشكل عرضي.",
  },
];

export default function VaricocelePageAr() {
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
              name: "دوالي الخصية",
              description: "تقييم دوالي الخصية — سريرية مقابل مكتشفة بالموجات فوق الصوتية، صلتها بالخصوبة، والمراقبة مقابل التدخل عند الاقتضاء.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Varicocele",
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
              خصوبة الرجل
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              دوالي الخصية
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تضخم في أوردة كيس الصفن، يشبه الدوالي في أجزاء أخرى من
              الجسم. وهو اكتشاف شائع، ولا تتطلب كل دوالي خصية علاجًا.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="varicocele" size="lg">
                احجز تقييمًا متخصصًا
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Clinical vs ultrasound + fertility relevance */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              كيف تُكتشف
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              سريرية مقابل مكتشفة بالموجات فوق الصوتية
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              قد تُكتشف دوالي الخصية بالفحص السريري — وتُعرف حينها
              بالسريرية — أو لا تظهر إلا بالموجات فوق الصوتية، وتُعرف
              بدون السريرية (تحت الإكلينيكية). هذا التمييز مهم، إذ لا
              يحمل كل اكتشاف بالموجات فوق الصوتية الأهمية نفسها.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الخصوبة والوظيفة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              صلتها بالخصوبة ووظيفة الخصية
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يمكن لدوالي الخصية، لدى بعض الرجال، أن تؤثر على معايير
              السائل المنوي ووظيفة الخصية مع مرور الوقت. يتمتع كثير من
              الرجال المصابين بدوالي الخصية بخصوبة طبيعية، ولا يتنبأ
              وجودها وحده بالعقم.
            </p>
          </div>
        </Container>
      </section>

      {/* Symptoms + observation vs intervention */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الأعراض
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              الألم ليس أمرًا شاملاً
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يعاني بعض الرجال من انزعاج أو إحساس بالثقل، خاصة بعد
              الوقوف لفترات طويلة. ولا يعاني كثيرون آخرون من أي أعراض
              على الإطلاق، وتُكتشف دوالي الخصية بشكل عرضي.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الإدارة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              المراقبة مقابل التدخل
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يُكتفى بمراقبة كثير من حالات دوالي الخصية، خاصة عند غياب
              الأعراض وعدم وجود قلق حالي بشأن الخصوبة. قد يُنظر في
              التدخل عند وجود ألم، أو تأثير واضح على معايير السائل
              المنوي، أو مخاوف بشأن حجم الخصية.
            </p>
          </div>
        </Container>
      </section>

      {/* Restraint — dark */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              اكتشاف تصويري، لا حكم نهائي
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              نتائج، لا قرارات بمعزل عن غيرها.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              لا يُعالَج اكتشاف بالموجات فوق الصوتية وحده بمعزل عن
              السياق. يعتمد ملاءمة التدخل على الأعراض وأهداف الخصوبة
              وتحليل السائل المنوي والفحص السريري مجتمعة — تُقيَّم ككل،
              لا من التصوير وحده.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "خصوبة الرجل", href: "/ar/male-fertility" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش ما إذا كان التدخل مناسبًا لك"
        sourcePage={PATH}
        bookingLabel="احجز استشارة"
        secondary={{ label: "العودة إلى خصوبة الرجل", href: "/ar/male-fertility" }}
      />
    </>
  );
}
