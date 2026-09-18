import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { Reveal } from "@/components/motion/Reveal";
import { ArticleAuthorBlockAr } from "@/components/sections/ArticleAuthorBlockAr";
import { RelatedInsightsAr } from "@/components/sections/RelatedInsightsAr";
import { JsonLd } from "@/components/seo/JsonLd";
import { getInsightArticleAr, getRelatedArticlesAr, insightArticlesAr } from "@/content/insights/articles-ar";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return insightArticlesAr.map((article) => ({ slug: article.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/**
 * Formats an ISO date as "18 سبتمبر 2026" — matching the literal
 * Gregorian-with-Arabic-month-names style already used on /ar/privacy.
 * Deliberately not `toLocaleDateString("ar", ...)`: several `ar-*`
 * locales default to the Hijri calendar or Eastern Arabic numerals,
 * neither of which matches the rest of the site's date conventions.
 */
function formatArabicDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${ARABIC_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightArticleAr(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/ar/insights/${article.slug}`,
    // R10 rule: only pair hreflang when the Arabic article is genuinely
    // the equivalent of one specific English article (see file header
    // in content/insights/articles-ar.ts for the per-article decision).
    languagePair: article.enEquivalentSlug
      ? { en: `/insights/${article.enEquivalentSlug}`, ar: `/ar/insights/${article.slug}` }
      : undefined,
  });
}

export default async function InsightArticlePageAr({ params }: Props) {
  const { slug } = await params;
  const article = getInsightArticleAr(slug);
  if (!article) notFound();

  const path = `/ar/insights/${article.slug}`;
  // R10 Phase C follow-up: now that /ar/insights is a genuine, live
  // Arabic hub (re-evaluated once the 6-article first wave shipped —
  // see docs/r10-arabic-seo-research.md), the full 3-level trail is
  // restored, matching the same "richer hierarchy once a real page
  // exists" principle used for the penile-implant/peyronies-disease
  // breadcrumb fix.
  const breadcrumbItems = [
    { name: "الرئيسية", href: "/ar" },
    { name: "رؤى", href: "/ar/insights" },
    { name: article.title, href: path },
  ];
  const relatedArticles = getRelatedArticlesAr(article);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          articleSchema(
            {
              headline: article.title,
              description: article.excerpt,
              path,
              datePublished: article.datePublished,
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-2xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              {article.category}
            </p>
            <h1 className="mt-4 font-display text-display-lg text-foreground">
              {article.title}
            </h1>
            <p className="mt-6 text-body-lg text-muted-foreground">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span>{formatArabicDate(article.datePublished)}</span>
              {article.clinicalReviewRequired && (
                <span className="rounded-full border border-border px-3 py-1">
                  قيد المراجعة الطبية
                </span>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="max-w-2xl">
        <ArticleAuthorBlockAr />
      </Container>

      {article.keyTakeaway && (
        <Container className="max-w-2xl py-10">
          <PullQuote>{article.keyTakeaway}</PullQuote>
        </Container>
      )}

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
                هذا المقال معلوماتي ولا يُغني عن تقييم طبي فردي. راجع{" "}
                <Link
                  href="/medical-disclaimer"
                  className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
                >
                  إخلاء المسؤولية الطبية (بالإنجليزية)
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <RelatedInsightsAr articles={relatedArticles} />

      <RelatedTreatments
        locale="ar"
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
              ناقش هذا الموضوع مع الدكتور أليخاندرو مولينا
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={path} ctaPosition="page-closing-cta" size="lg">
                احجز استشارتك السرية
              </BookingCta>
              <Link
                href={article.relatedHref}
                className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                استكشف {article.relatedLabel}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
