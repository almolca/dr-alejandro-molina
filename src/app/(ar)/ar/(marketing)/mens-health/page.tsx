import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { ClinicalDecisionFlow } from "@/components/editorial/ClinicalDecisionFlow";
import { ConsultationPathwayDiagram } from "@/components/illustrations/ConsultationPathwayDiagram";
import visual from "@/components/editorial/VisualSystem.module.css";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/mens-health";

export const metadata: Metadata = buildMetadata({
  title: "صحة الرجل",
  description:
    "رعاية متخصصة لصحة الرجل في أبوظبي — تقييم التستوستيرون والصحة الهرمونية، والمجالات ذات الصلة، بشكل فردي قبل النظر في أي علاج.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "صحة الرجل", href: PATH },
];

/** Temporary EN destinations for testosterone/ED/vasectomy — Batch 2/4. sexual-medicine/male-fertility are live Arabic (this batch). */
const areas = [
  {
    label: "التستوستيرون والصحة الهرمونية للرجال",
    description:
      "الأعراض، والتشخيص، ومتى يكون العلاج مناسبًا سريريًا — بما في ذلك انخفاض الرغبة الجنسية، ويُقيَّم إلى جانب العوامل الهرمونية والطبية والنفسية-الجنسية.",
    href: "/mens-health/testosterone",
  },
  {
    label: "ضعف الانتصاب",
    description:
      "تُقيَّم تغيرات الوظيفة الجنسية كجزء من الصورة الهرمونية والأيضية نفسها عند الحاجة.",
    href: "/erectile-dysfunction",
  },
  {
    label: "سرعة القذف ومرض بيروني",
    description:
      "التحكم بالقذف وانحناء القضيب من الأسباب الشائعة الأخرى لاستشارة الطبيب — ويُعالَج كل منهما بنفس النهج المتخصص.",
    href: "/ar/sexual-medicine",
  },
  {
    label: "قطع القناة المنوية بدون مشرط",
    description:
      "نهج طفيف التوغل لمنع الحمل الدائم، مع استشارة منظمة حول التعافي والمخاطر والفحوصات بعد الإجراء.",
    href: "/mens-health/vasectomy",
  },
];

const faqItems = [
  {
    question: "هل يعني كل عرض أن لدي انخفاضًا في التستوستيرون؟",
    answer:
      "لا. قد يرتبط الإرهاق وانخفاض الرغبة الجنسية وضعف الأداء بنقص التستوستيرون، لكن قد تكون لها أسباب أخرى عديدة أيضًا — ينظر التقييم إلى الصورة الكاملة قبل عزو الأعراض إلى سبب واحد.",
  },
  {
    question: "هل سيُعرض عليّ العلاج تلقائيًا؟",
    answer:
      "لا. يُنظر في العلاج فقط بعد تقييم سريري وكيميائي حيوي مناسب، وفقط عند وجود مؤشر واضح له.",
  },
  {
    question: "هل يرتبط ضعف الانتصاب دائمًا بالهرمونات؟",
    answer:
      "ليس دائمًا. قد يكون له أسباب هرمونية أو وعائية أو أيضية أو عصبية أو مرتبطة بالأدوية أو نفسية-جنسية — يحدد التقييم أيها ذو صلة بحالتك تحديدًا.",
  },
];

export default function MensHealthPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      <section className={visual.hero}>
        <HeroAtmosphere align="left" restrained />
        <Container className={`${visual.heroGrid} relative z-10`}>
          <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              صحة الرجل
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">صحة الرجل</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم هرموني وأيضي وجنسي للرجال الذين يعانون من انخفاض
              التستوستيرون، أو انخفاض الرغبة الجنسية، أو الإرهاق، أو
              تغيرات في الوظيفة الجنسية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">احجز استشارة</BookingCta>
            </div>
          </Reveal>
          <div className={visual.physicianIdentity}><p>{AR_IDENTITY.doctorDisplayName}</p><span>{AR_IDENTITY.doctorTitle} · FEBU · أبوظبي</span></div>
          </div>
          <EditorialFrame slot="mensHealthHero" landscape priority />
        </Container>
      </section>

      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-xs uppercase text-muted-foreground">كيف يتم التقييم</p>
              <h2 className="mt-4 font-display text-display-lg">افهم الصورة الكاملة قبل اختيار العلاج.</h2>
              <div className="mt-8"><PullQuote>ليس كل عرض يعني انخفاض التستوستيرون، وليست كل نتيجة منخفضة تستلزم العلاج تلقائيًا.</PullQuote></div>
            </div>
            <div className="bg-surface p-6 lg:p-8">
              <ClinicalDecisionFlow locale="ar" />
              <p className="mt-4 text-sm text-muted-foreground">التقييم الهرموني · العوامل الأيضية / الطبية · الوظيفة الجنسية</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-section-y">
        <Container>
          <div className={visual.split}>
            <div>
              <p className="text-xs uppercase text-muted-foreground">مجالات رعاية مترابطة</p>
              <h2 className="mt-4 font-display text-display-md">الأعراض في سياقها.</h2>
              <p className="mt-6 max-w-md text-sm text-muted-foreground">تُسهم الصحة الجنسية والصحة الهرمونية والخصوبة ومخاوف المسالك البولية/الذكورة في توجيه تقييم مستهدف وخطة علاج فردية.</p>
              <ConsultationPathwayDiagram className="mt-8 h-14 w-full max-w-xs text-muted-foreground" />
              <div className={visual.clinicalAreas}>
                <Link href="/ar/sexual-medicine"><span>01</span>الصحة الجنسية</Link>
                <Link href="/ar/mens-health/testosterone"><span>02</span>الصحة الهرمونية</Link>
                <Link href="/ar/male-fertility"><span>03</span>الخصوبة</Link>
                <Link href="/book"><span>04</span>مخاوف المسالك البولية/الذكورة</Link>
              </div>
            </div>
            <div className="bg-surface p-8">
              {areas.map((area) => <div className="py-6 first:pt-0 last:pb-0" key={area.href}>
                <h3 className="font-display text-2xl"><Link className="underline decoration-border underline-offset-4" href={area.href}>{area.label}</Link></h3>
                <p className="mt-4 text-sm text-muted-foreground">{area.description}</p>
              </div>)}
            </div>
          </div>
        </Container>
      </section>

      <RelatedTreatments locale="ar" items={[{ label: "زيادة سماكة القضيب", href: "/male-aesthetics/penile-girth-enhancement" }]} />

      <Faq items={faqItems} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ بتقييم صحي هرموني"
        sourcePage={PATH}
        bookingLabel="احجز استشارة"
        secondary={{ label: "استكشف التستوستيرون والصحة الهرمونية للرجال", href: "/mens-health/testosterone" }}
      />
    </div>
  );
}
