import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { insightArticlesAr, type InsightCategoryAr } from "@/content/insights/articles-ar";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/insights";

export const metadata: Metadata = buildMetadata({
  title: "رؤى في طب الذكورة وصحة الرجل",
  description:
    "مقالات معلوماتية في طب الذكورة وصحة الرجل من الدكتور أليخاندرو مولينا — ضعف الانتصاب، التستوستيرون، جراحة القضيب، التجميل الذكوري، ومرض بيروني.",
  path: PATH,
  // No explicit languagePair needed — the route registry now carries
  // this page's EN/AR pairing directly, so getLocalizedPathPair()
  // derives the same hub-level pair automatically (see the code
  // comment on that registry entry for the coarser-grained
  // hub-equivalence rationale).
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "رؤى", href: PATH },
];

const categories: InsightCategoryAr[] = [
  "ضعف الانتصاب",
  "التستوستيرون",
  "جراحة القضيب",
  "التجميل الذكوري",
  "مرض بيروني",
];

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function formatArabicDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${ARABIC_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export default function InsightsIndexPageAr() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })), { inLanguage: "ar" })} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              رؤى
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              رؤى في طب الذكورة وصحة الرجل
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              مواضيع طبية في طب الذكورة وصحة الرجل، كُتبت لتوضيح المعلومة
              — لا لتحل محل استشارة طبية فردية.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Article index */}
      <section className="border-t border-border py-section-y">
        <Container>
          <StaggerGroup className="border-t border-border">
            {insightArticlesAr.map((article) => (
              <StaggerItem key={article.slug}>
                <Link
                  href={`/ar/insights/${article.slug}`}
                  className="group grid grid-cols-1 gap-3 border-b border-border py-10 md:grid-cols-[1fr_2fr] md:gap-16"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatArabicDate(article.datePublished)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-foreground transition-colors group-hover:text-accent-strong md:text-3xl">
                      {article.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>
    </>
  );
}
