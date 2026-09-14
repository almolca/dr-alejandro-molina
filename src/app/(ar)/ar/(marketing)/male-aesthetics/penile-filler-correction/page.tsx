// src/app/(ar)/ar/(marketing)/male-aesthetics/penile-filler-correction/page.tsx
import type { Metadata } from "next";
import { ContourReviewDiagram } from "@/components/illustrations/ContourReviewDiagram";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/male-aesthetics/penile-filler-correction";
const BOOKING_LABEL = "احجز استشارتك السرية";

export const metadata: Metadata = buildMetadata({
  title: "تصحيح حشو القضيب",
  description:
    "تقييم متخصص في أبوظبي لعدم التماثل أو عدم انتظام الملامس أو العقيدات أو الانزياح بعد علاج سابق بحشو القضيب — يُقيَّمه د. أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة، مع النظر في الإذابة أو المراجعة عند الاقتضاء.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "التجميل الذكوري", href: "/ar/male-aesthetics" },
  { name: "تصحيح حشو القضيب", href: PATH },
];

const presentations = [
  { label: "عدم التماثل", description: "نتيجة غير متساوية بين جانب وآخر، أو على طول الجسم الأسطواني." },
  { label: "عدم انتظام الملامس", description: "مناطق تُشعَر أو تظهر غير منتظمة أو متكتلة أو غير متسقة مع الأنسجة المحيطة." },
  { label: "العقيدات", description: "مناطق صلبة منفصلة يمكن أن تتكوّن عند موضع الحقن مع مرور الوقت." },
  { label: "الانزياح", description: "منتج انتقل من منطقة العلاج الأصلية." },
  { label: "توزيع غير متساوٍ", description: "منتج مُركَّز بشكل غير متساوٍ بدلاً من توزيعه كما خُطِّط له أصلاً." },
  { label: "تورم مستمر", description: "تورم لم يستقر ضمن فترة الاستقرار المتوقعة، حيثما كان ذلك ذا صلة سريرية." },
];

const correctionOptions = [
  {
    label: "المراقبة",
    description:
      "لا تتطلب كل حالة عدم انتظام تدخلاً فعالاً. حيثما كانت النتيجة طفيفة أو من المرجح أن تُحل من تلقاء نفسها، قد تكون المراقبة الخطوة الأولى الأنسب.",
  },
  {
    label: "الإذابة",
    description:
      "حيثما كان ذلك مناسبًا، يمكن إذابة الحشو القائم على حمض الهيالورونيك. وتعتمد ملاءمة ذلك — والنتيجة المتوقعة بعده — على الحالة الفردية، وتُقيَّم بدلاً من افتراضها.",
  },
  {
    label: "المراجعة أو إعادة العلاج",
    description:
      "حيثما لا تعالج الإذابة وحدها المشكلة، أو كانت هناك رغبة في نتيجة معدَّلة، يُخطَّط لعلاج إضافي بشكل فردي حول التشريح الحالي — لا كخطوة تالية معيارية.",
  },
];

const afterConsiderations = [
  {
    title: "المخاطر",
    description:
      "كما هو الحال مع أي إجراء تصحيحي، يمكن أن تشمل المخاطر مزيدًا من التورم أو الكدمات أو عدم التماثل المؤقت أثناء عملية التصحيح، أو نتيجة لا تعالج المخاوف الأصلية بالكامل. تُراجَع هذه المخاطر بشكل فردي، بناءً على الخيار المطروح.",
  },
  {
    title: "المتابعة",
    description:
      "يلي التصحيح، عند إجرائه، مراجعة لتقييم مدى استقرار المنطقة — لا أن يُعامَل كإجراء منفصل بلا تواصل لاحق.",
  },
  {
    title: "ما قد لا يكون قابلاً للتصحيح الكامل",
    description:
      "قد لا تكون بعض التغيرات — خاصة تغيرات الأنسجة طويلة الأمد — قابلة للعكس بالكامل. يُناقَش هذا بصراحة أثناء التقييم، بدلاً من الإيحاء بأن كل حالة يمكن حلها بالكامل.",
  },
];

const faqItems = [
  {
    question: "متى ينبغي تقييم حشو سابق في القضيب؟",
    answer:
      "إذا لاحظت عدم تماثل، أو ملامس غير منتظمة أو متكتلة، أو انزياحًا، أو توزيعًا غير متساوٍ، أو تورمًا لم يستقر كما هو متوقع، فهذا سبب معقول عمومًا لطلب التقييم — بغض النظر عن مكان إجراء العلاج الأصلي.",
  },
  {
    question: "هل يمكن أن ينزاح حشو القضيب؟",
    answer:
      "نعم — يمكن أن ينتقل المنتج من منطقة العلاج الأصلية، وهذا أحد المظاهر التي يبحث عنها التقييم. هذا نمط مختلف عن الاستقرار التدريجي الطبيعي الذي يلي العلاج، ويُقيَّم بشكل فردي بدلاً من افتراضه من وصف عام.",
    readMoreHref: "/insights/penile-filler-migration-what-to-know",
    readMoreLabel: "اقرأ المزيد: Penile Filler Migration — What Patients Should Know (مقال بالإنجليزية)",
  },
  {
    question: "هل يمكن تصحيح جميع مشكلات حشو القضيب؟",
    answer:
      "لا يمكن تصحيح كل حالة بالكامل. تستجيب بعض حالات عدم الانتظام جيدًا للإذابة أو المراجعة؛ بينما قد تتحسن حالات أخرى، خاصة تغيرات الأنسجة طويلة الأمد، جزئيًا فقط. يُقيَّم هذا ويُناقَش بشكل فردي، ولا يُفترض بأي اتجاه.",
  },
  {
    question: "هل الإذابة هي النهج الصحيح دائمًا؟",
    answer:
      "لا. الإذابة خيار واحد من عدة خيارات، وتعتمد ملاءمتها على الحالة المحددة. في بعض الحالات، قد تكون المراقبة أو نهج مختلف أكثر ملاءمة.",
    readMoreHref: "/insights/can-penile-filler-be-dissolved",
    readMoreLabel: "اقرأ المزيد: Can Penile Filler Be Dissolved? (مقال بالإنجليزية)",
  },
  {
    question: "هل ستحتاجون إلى استخدام الموجات فوق الصوتية؟",
    answer:
      "قد تُستخدم الموجات فوق الصوتية حيثما تساعد في توضيح موقع أو مدى أو طبيعة نتيجة ما — خاصة للصلابة أو الاشتباه بالانزياح أو عندما لا تكون الصورة السريرية واضحة من الفحص وحده. لا تُستخدم بشكل روتيني لكل حالة.",
  },
  {
    question: "هل تحتاجون لمعرفة أين أُجري علاجي الأصلي؟",
    answer:
      "هذا سياق مفيد، لكن التقييم يركز على تشريحك وحالتك الحالية — لا على تقييم أو انتقاد المزود أو العلاج الأصلي.",
  },
  {
    question: "كيف أبدأ؟",
    answer:
      "تبدأ العملية باستشارة سرية لتقييم الحالة الحالية، ومناقشة ما قد يكون مناسبًا أو غير مناسب، والتخطيط للخطوات التالية بشكل فردي.",
  },
];

export default function PenileFillerCorrectionPageAr() {
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
              name: "تصحيح حشو القضيب",
              description: "تقييم متخصص لعدم التماثل أو عدم انتظام الملامس أو العقيدات أو الانزياح أو عدم الرضا بعد علاج سابق بحشو القضيب، مع النظر في الإذابة أو المراجعة عند الاقتضاء.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Filler Correction",
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
              تصحيح حشو القضيب
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم متخصص في أبوظبي للرجال الذين يعانون من عدم تماثل أو
              عدم انتظام أو انزياح أو عدم رضا بعد علاج سابق بحشو القضيب
              — سواء أُجري هنا أو في مكان آخر — يُقيّمه استشاري أمراض
              المسالك البولية والذكورة الذي يُقيّم النتيجة الجمالية
              والتشريح الكامن معًا.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="filler_correction" size="lg">
                {BOOKING_LABEL}
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Common presentations */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="المظاهر الشائعة" heading="ما قد يستدعي التقييم" locale="ar" />
          <Reveal delay={0.05}>
            <ContourReviewDiagram
              className="mt-10 h-28 w-28 text-muted-foreground"
              title="مقارنة الملامس الأصلية بالحالة الحالية، مع تحديد مواضع الاختلاف"
            />
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {presentations.map((item) => (
              <StaggerItem key={item.label}>
                <h3 className="font-display text-lg text-foreground">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Assessment */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              متى قد يساعد التقييم
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              لا يحتاج كل مخاوف إلى إجراء فوري
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يستحق التقييم النظر بشكل عام عند وجود عدم تماثل، أو ملامس
              غير منتظمة، أو عقيدة جديدة، أو اشتباه بانزياح، أو تورم لم
              يستقر كما هو متوقع. بعض النتائج طفيفة وتُراقَب ببساطة؛
              بينما تستفيد أخرى من خطة محددة.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              ما يتضمنه التقييم
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              التاريخ المرضي والفحص والتصوير حيثما كان مفيدًا
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يبدأ التقييم بالتاريخ المرضي والفحص. قد تُستخدم الموجات
              فوق الصوتية حيثما تساعد في توضيح نتيجة ما — خاصة للصلابة
              أو الاشتباه بالانزياح أو عندما تكون الصورة السريرية غير
              واضحة — لا كخطوة روتينية لكل مريض.
            </p>
          </div>
        </Container>
      </section>

      {/* Correction options */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow="الخيارات المطروحة" heading="ما يمكن فعله، ومتى" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {correctionOptions.map((option, index) => (
              <StaggerItem key={option.label}>
                <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[2fr_3fr] sm:gap-16">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">
                      {option.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          تُقيَّم كل حالة بناءً على تشريحها ونتائجها الخاصة — ولا يُنتقَد
          أي مزود أو علاج سابق أبدًا.
        </PullQuote>
      </Container>

      {/* Realistic expectations — dark section */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              توقعات واقعية
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              تُقيَّم على أساسها الخاص — لا من خلال انتقاد أي مزود أو
              علاج سابق.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تُقيَّم كل حالة بناءً على تشريحها الحالي ونتائجها، بغض
              النظر عن مكان إجراء العلاج الأصلي أو الجهة التي أجرته.
              تعتمد خيارات التصحيح على الحالة المحددة، ولا يمكن ضمان
              نتيجة محددة — بما في ذلك الحل الكامل لكل حالة عدم انتظام.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Risks, follow-up, limitations */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="قبل وبعد" heading="المخاطر والمتابعة والحدود" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 md:grid-cols-3">
            {afterConsiderations.map((item) => (
              <Reveal key={item.title}>
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "زيادة سماكة القضيب", href: "/ar/male-aesthetics/penile-girth-enhancement" },
          { label: "التجميل الذكوري", href: "/ar/male-aesthetics" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "نبذة عن د. مولينا", href: "/ar/about" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش علاجك السابق"
        sourcePage={PATH}
        secondary={{ label: "العودة إلى التجميل الذكوري", href: "/ar/male-aesthetics" }}
        bookingLabel={BOOKING_LABEL}
      />
    </>
  );
}
