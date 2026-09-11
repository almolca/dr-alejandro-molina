import type { Metadata } from "next";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { insightArticles, type InsightCategory } from "@/content/insights/articles";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/insights";

export const metadata: Metadata = buildMetadata({
  title: "Insights in Andrology & Men's Health",
  description:
    "Editorial insights in andrology and men's health from Dr. Alejandro Molina — erectile dysfunction, testosterone, penile surgery, male aesthetics, fertility and Peyronie's disease.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Insights", href: PATH },
];

const categories: InsightCategory[] = [
  "Erectile Dysfunction",
  "Testosterone",
  "Penile Surgery",
  "Male Aesthetics",
  "Fertility",
  "Peyronie's Disease",
];

export default function InsightsIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Insights
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              <AmpersandText text="Insights in Andrology & Men's Health" />
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Clinical topics in andrology and men&rsquo;s health,
              written to inform — not to replace an individual
              consultation.
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
            {insightArticles.map((article) => (
              <StaggerItem key={article.slug}>
                <Link
                  href={`/insights/${article.slug}`}
                  className="group grid grid-cols-1 gap-3 border-b border-border py-10 md:grid-cols-[1fr_2fr] md:gap-16"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.datePublished).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
