import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { homepageFeaturedArticles as articles } from "@/content/insights/homepage-featured";

/**
 * Arabic mirror of `InsightsSection`. Article titles/tags are kept in
 * English — they're real, specific published titles with no Arabic
 * article at the linked URL yet; inventing Arabic titles would imply a
 * translated article that doesn't exist. See spec §8.
 */
export function InsightsSectionAr() {
  return (
    <section className="py-section-y">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">مقالات ورؤى</p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">رؤى في طب الذكورة وصحة الرجل</h2>
          </div>
          <Link href="/insights" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
            جميع المقالات
          </Link>
        </Reveal>

        <p className="mt-6 text-xs text-muted-foreground">
          المقالات التالية متاحة حاليًا باللغة الإنجليزية فقط
        </p>

        <div className="mt-10 grid gap-x-16 gap-y-12 border-t border-border pt-12 lg:grid-cols-2">
          {articles
            .filter((a) => a.featured)
            .map((article) => (
              <Reveal key={article.href} className="lg:row-span-2">
                <Link href={article.href} className="group block card-hover rounded-sm p-2 -m-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">{article.tag}</span>
                  <h3
                    dir="ltr"
                    className="mt-4 text-start font-display text-display-md leading-tight text-foreground transition-colors group-hover:text-accent-strong"
                  >
                    {article.title}
                  </h3>
                </Link>
              </Reveal>
            ))}

          <div className="flex flex-col divide-y divide-border">
            {articles
              .filter((a) => !a.featured)
              .map((article, index) => (
                <Reveal key={article.href} delay={0.05 * (index + 1)} className="py-8 first:pt-0">
                  <Link href={article.href} className="group block card-hover rounded-sm p-2 -m-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">{article.tag}</span>
                    <h3
                      dir="ltr"
                      className="mt-3 text-start font-display text-xl leading-snug text-foreground transition-colors group-hover:text-accent-strong sm:text-2xl"
                    >
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
