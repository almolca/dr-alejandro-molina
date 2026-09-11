import visual from "@/components/editorial/VisualSystem.module.css";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const primaryAreas = [
  {
    number: "01",
    title: "ضعف الانتصاب وزراعة القضيب",
    description: "التشخيص قبل العلاج — من العلاج بمثبطات PDE5 إلى الدعامة القضيبية للحالات المستعصية.",
    href: "/erectile-dysfunction",
  },
  {
    number: "02",
    title: "التستوستيرون والصحة الهرمونية للرجال",
    description: "تقييم هرموني وأيضي شامل قبل النظر في أي علاج.",
    href: "/mens-health/testosterone",
  },
  {
    number: "03",
    title: "التجميل الذكوري",
    description: "نهج قائم على التشريح وتحت إشراف طبي لتجميل القضيب وتصحيحه.",
    href: "/male-aesthetics",
  },
  {
    number: "04",
    title: "خصوبة الرجل",
    description: "تحليل السائل المنوي، والتقييم الهرموني، وتقييم دوالي الخصية.",
    href: "/male-fertility",
  },
];

const secondaryLinks = [
  { label: "مرض بيروني", href: "/peyronies-disease" },
  { label: "دوبلر القضيب", href: "/erectile-dysfunction/penile-doppler" },
  { label: "سرعة القذف", href: "/sexual-medicine/premature-ejaculation" },
  { label: "دوالي الخصية", href: "/male-fertility/varicocele" },
  { label: "قطع القناة المنوية بدون مشرط", href: "/mens-health/vasectomy" },
];

/** Temporary EN destinations throughout — no Arabic pages yet, spec §7. */
export function CoreExpertiseSectionAr() {
  return (
    <section className="py-section-y">
      <Container>
        <SectionHeading eyebrow="مجالات الرعاية" heading="رعاية متخصصة لصحة الرجال" />

        <div className={visual.services}>
          <Link href="/male-aesthetics/penile-girth-enhancement" className={visual.serviceFeature}>
            <span className="text-xs uppercase tracking-widest">الإجراء الرائد</span>
            <div>
              <h3 className="font-display text-3xl">زيادة سماكة القضيب</h3>
              <p className="mt-4 text-sm text-stone-200">تخطيط قائم على التشريح ضمن ممارسة استشاري أمراض المسالك البولية والذكورة.</p>
            </div>
            <span className="mt-6 text-sm">استكشف الإجراء <span aria-hidden="true">↗</span></span>
          </Link>
          <div className={visual.serviceList}>
            {primaryAreas.map((area) => (
              <Link key={area.number} href={area.href} className={visual.serviceLink}>
                <span className={visual.serviceNumber} aria-hidden="true">{area.number}</span>
                <span>
                  <span className="block font-display text-xl">{area.title}</span>
                  <span className="mt-2 block max-w-lg text-sm text-muted-foreground">{area.description}</span>
                </span>
                <ArrowUpRight aria-hidden size={18} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">أيضًا يُقيَّم</span>
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
