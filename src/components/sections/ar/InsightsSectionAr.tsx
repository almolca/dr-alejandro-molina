import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { insightArticlesAr } from "@/content/insights/articles-ar";

/**
 * Arabic mirror of `InsightsSection` — R10 Phase C rewrite. Previously
 * this section linked out to the English `/insights` index with
 * English-only titles, honestly disclosed as such (see git history).
 * Now that 6 genuine Arabic articles exist, it features them directly
 * instead — no more need for the English-only disclosure this section
 * used to carry.
 *
 * Featured slugs picked editorially: the girth-enhancement experience
 * piece (flagship procedure) and the venous-leak/Doppler piece (the
 * cluster research found has the least direct local competition) —
 * same visual treatment (larger, row-span-2) the English homepage
 * gives its own two featured articles.
 */
const FEATURED_SLUGS = ["penile-girth-enhancement-real-world-experience", "venous-leak-and-penile-doppler"];

const featured = insightArticlesAr.filter((a) => FEATURED_SLUGS.includes(a.slug));
const rest = insightArticlesAr.filter((a) => !FEATURED_SLUGS.includes(a.slug));

export function InsightsSectionAr() {
  return (
    <section className="py-section-y">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">مقالات ورؤى</p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">رؤى في طب الذكورة وصحة الرجل</h2>
          </div>
          <Link href="/ar/insights" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
            جميع المقالات
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-x-16 gap-y-12 border-t border-border pt-12 lg:grid-cols-2">
          {featured.map((article) => (
            <Reveal key={article.slug} className="lg:row-span-2">
              <Link href={`/ar/insights/${article.slug}`} className="group block card-hover rounded-sm p-2 -m-2">
                <span className="text-xs font-medium uppercase text-accent-strong">{article.category}</span>
                <h3 className="mt-4 text-start font-display text-display-md leading-tight text-foreground transition-colors group-hover:text-accent-strong">
                  {article.title}
                </h3>
              </Link>
            </Reveal>
          ))}

          <div className="flex flex-col divide-y divide-border">
            {rest.map((article, index) => (
              <Reveal key={article.slug} delay={0.05 * (index + 1)} className="py-8 first:pt-0">
                <Link href={`/ar/insights/${article.slug}`} className="group block card-hover rounded-sm p-2 -m-2">
                  <span className="text-xs font-medium uppercase text-accent-strong">{article.category}</span>
                  <h3 className="mt-3 text-start font-display text-xl leading-snug text-foreground transition-colors group-hover:text-accent-strong sm:text-2xl">
                    {article.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
