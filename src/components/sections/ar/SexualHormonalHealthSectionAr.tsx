import { ClinicalDecisionFlow } from "@/components/editorial/ClinicalDecisionFlow";
import visual from "@/components/editorial/VisualSystem.module.css";
import { VascularFlowDiagram } from "@/components/illustrations/VascularFlowDiagram";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const contributors = ["وعائي", "هرموني", "أيضي", "عصبي", "مرتبط بالأدوية", "نفسي-جنسي"];

const pillars = [
  "الأعراض",
  "التستوستيرون الكلي والحر",
  "الغلوبولين الرابط للهرمونات الجنسية (SHBG)",
  "الهرمون الملوتن / الهرمون المنبه للجريب (LH/FSH)",
  "البرولاكتين",
  "الغدة الدرقية",
  "الصحة الأيضية",
  "النوم",
  "خطط الإنجاب",
];

/** Temporary EN destinations for both links — no Arabic pages yet, spec §7. */
export function SexualHormonalHealthSectionAr() {
  return (
    <section className={`${visual.clinicalBand} py-section-y`}>
      <Container>
        <SectionHeading eyebrow="الصحة الجنسية والهرمونية" heading="التشخيص قبل العلاج، في الاتجاهين" locale="ar" />

        <ClinicalDecisionFlow locale="ar" />

        <div className="mt-10 grid gap-16 border-t border-border pt-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h3 className="font-display text-display-md text-foreground">
              ضعف الانتصاب يستحق تشخيصًا، لا مجرد وصفة علاجية
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              قد يكون لضعف الانتصاب أسباب وعائية أو هرمونية أو أيضية أو عصبية
              أو مرتبطة بالأدوية أو نفسية-جنسية. يُختار العلاج وفقًا للسبب
              الكامن، والتاريخ المرضي، والأولويات الفردية لكل مريض.
            </p>
            <StaggerGroup className="relative mt-8 border-r border-border pr-8">
              {contributors.map((item) => (
                <StaggerItem key={item} className="relative py-2">
                  <span className="absolute -right-[calc(2rem+3px)] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-strong" />
                  <span className="text-sm text-foreground">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link
                href="/erectile-dysfunction"
                className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                استكشف ضعف الانتصاب
              </Link>
            </div>
            <VascularFlowDiagram className="mt-10 h-20 w-32 text-muted-foreground" />
          </Reveal>

          <Reveal delay={0.05}>
            <blockquote className="font-display text-display-md italic leading-snug text-foreground">
              الأعراض أولًا.
              <br />
              والأرقام تحتاج إلى سياق.
            </blockquote>
            <p className="mt-8 text-xs font-medium uppercase text-muted-foreground">
              ما يأخذه التقييم بعين الاعتبار
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {pillars.map((pillar) => (
                <li key={pillar} className="border-b border-border px-1 py-2 text-sm text-foreground">
                  {pillar}
                </li>
              ))}
            </ul>
            <Link
              href="/mens-health/testosterone"
              className="mt-8 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              استكشف الصحة الهرمونية للرجال
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
