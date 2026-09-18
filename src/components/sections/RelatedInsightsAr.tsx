import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { InsightArticleAr } from "@/content/insights/articles-ar";

/**
 * Arabic mirror of `RelatedInsights` (R10 Phase C). Kept as a sibling
 * component, typed to `InsightArticleAr` and linking under
 * `/ar/insights/...`, rather than adding a locale branch to the
 * English component — same rationale as `ArticleAuthorBlockAr`.
 */
export function RelatedInsightsAr({ articles }: { articles: InsightArticleAr[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <p className="text-eyebrow font-medium uppercase text-accent-strong">
          مقالات ذات صلة
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {articles.map((article) => (
            <Reveal key={article.slug}>
              <Link href={`/ar/insights/${article.slug}`} className="group block">
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
