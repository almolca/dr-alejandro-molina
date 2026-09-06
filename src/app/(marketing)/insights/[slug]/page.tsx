import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { Reveal } from "@/components/motion/Reveal";
import { ArticleAuthorBlock } from "@/components/sections/ArticleAuthorBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { getInsightArticle, insightArticles } from "@/content/insights/articles";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return insightArticles.map((article) => ({ slug: article.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightArticle(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
  });
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getInsightArticle(slug);
  if (!article) notFound();

  const path = `/insights/${article.slug}`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
    { name: article.title, href: path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          articleSchema({
            headline: article.title,
            description: article.excerpt,
            path,
            datePublished: article.datePublished,
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-2xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              {article.category}
            </p>
            <h1 className="mt-4 font-display text-display-lg text-foreground">
              {article.title}
            </h1>
            <p className="mt-6 text-body-lg text-muted-foreground">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span>
                {new Date(article.datePublished).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {article.clinicalReviewRequired && (
                <span className="rounded-full border border-border px-3 py-1">
                  Clinical review pending
                </span>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Physician authorship — visible counterpart to the schema-only
          `author` field on articleSchema() (E-E-A-T, Phase B). Applied
          uniformly to every article, not just the new cluster. */}
      <Container className="max-w-2xl">
        <ArticleAuthorBlock />
      </Container>

      {/* Body */}
      <section className="border-t border-border py-section-y">
        <Container className="max-w-2xl">
          <div className="space-y-14">
            {article.sections.map((section) => (
              <Reveal key={section.heading}>
                <h2 className="font-display text-2xl text-foreground">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-16 border-t border-border pt-8">
              <p className="text-xs text-muted-foreground">
                This article is informational and does not replace an
                individual medical assessment. See our{" "}
                <Link
                  href="/medical-disclaimer"
                  className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
                >
                  medical disclaimer
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: article.relatedLabel, href: article.relatedHref },
          ...(article.secondaryRelatedHref && article.secondaryRelatedLabel
            ? [{ label: article.secondaryRelatedLabel, href: article.secondaryRelatedHref }]
            : []),
        ]}
      />

      {/* Closing CTA */}
      <section className="bg-surface py-section-y">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="mx-auto max-w-lg font-display text-display-md text-foreground">
              Discuss This With Dr. Alejandro Molina
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={path} ctaPosition="page-closing-cta" size="lg" />
              <Link
                href={article.relatedHref}
                className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                Explore {article.relatedLabel}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
