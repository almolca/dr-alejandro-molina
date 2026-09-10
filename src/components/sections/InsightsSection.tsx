import { InternalLink as Link } from "@/components/ui/InternalLink";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Spec §7 Section 10 — three featured articles, verbatim titles from
 * spec's "initial article ideas". No dates or bylines are shown (spec:
 * "do not publish fake content dates or fake research claims") — a
 * category tag stands in for the usual article-card metadata. Slugs are
 * an implementation detail for Phase 4, not a claim; the pages
 * themselves don't exist yet, so links resolve to the site's 404 for
 * now, consistent with the rest of the nav (spec §38 phase gating).
 */
const articles = [
  {
    title: "When Is a Penile Implant Considered for Erectile Dysfunction?",
    tag: "Penile Implant Surgery",
    href: "/insights/penile-implant-when-considered",
    featured: true,
  },
  {
    title:
      "Low Testosterone: Symptoms, Diagnosis and When Treatment Is Appropriate",
    tag: "Hormonal Health",
    href: "/insights/low-testosterone-symptoms-diagnosis",
  },
  {
    title:
      "Penile Girth Enhancement: What a Medical Assessment Should Consider",
    tag: "Male Genital Aesthetics",
    href: "/insights/penile-girth-enhancement-assessment",
  },
];

export function InsightsSection() {
  return (
    <section className="py-section-y">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Insights
            </p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">
              <AmpersandText text="Insights in Andrology & Men’s Health" />
            </h2>
          </div>
          <Link
            href="/insights"
            className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
          >
            All Insights
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-x-16 gap-y-12 border-t border-border pt-12 lg:grid-cols-2">
          {articles
            .filter((a) => a.featured)
            .map((article) => (
              <Reveal key={article.href} className="lg:row-span-2">
                <Link href={article.href} className="group block card-hover rounded-sm p-2 -m-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">
                    {article.tag}
                  </span>
                  <h3 className="mt-4 font-display text-display-md leading-tight text-foreground transition-colors group-hover:text-accent-strong">
                    {article.title}
                  </h3>
                </Link>
              </Reveal>
            ))}

          <div className="flex flex-col divide-y divide-border">
            {articles
              .filter((a) => !a.featured)
              .map((article, index) => (
                <Reveal
                  key={article.href}
                  delay={0.05 * (index + 1)}
                  className="py-8 first:pt-0"
                >
                  <Link href={article.href} className="group block card-hover rounded-sm p-2 -m-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-accent-strong">
                      {article.tag}
                    </span>
                    <h3 className="mt-3 font-display text-xl leading-snug text-foreground transition-colors group-hover:text-accent-strong sm:text-2xl">
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
