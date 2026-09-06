import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { InsightArticle } from "@/content/insights/articles";

/**
 * "Related Insights" section for an article page — spec Phase C §7:
 * "Relevant Insights should show 2-4 related articles." Renders nothing
 * when there are none (fail-safe pattern, same as `AuthorityStripSection`),
 * so articles with no `relatedArticleSlugs` simply omit this section
 * rather than showing an empty band.
 */
export function RelatedInsights({ articles }: { articles: InsightArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
          Related Insights
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {articles.map((article) => (
            <Reveal key={article.slug}>
              <Link href={`/insights/${article.slug}`} className="group block">
                <h3 className="font-display text-lg text-foreground transition-colors group-hover:text-accent-strong">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
