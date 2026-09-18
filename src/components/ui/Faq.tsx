"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqPageSchema } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/JsonLd";

export type FaqItem = {
  question: string;
  answer: string;
  /** Optional "short answer → read more" link into a deeper Insights article (spec Phase C §6/§7). */
  readMoreHref?: string;
  readMoreLabel?: string;
};

/**
 * FAQ accordion — spec §24 "FAQ where genuinely useful", §25 FAQPage
 * schema only when visible FAQ content exists. Renders both the
 * visible accordion and its matching JSON-LD from the same data, so
 * they can never drift apart.
 */
export function Faq({
  items,
  locale,
  // R10 fix: these previously defaulted to English regardless of
  // `locale`, so any Arabic call site that didn't ALSO separately pass
  // its own Arabic eyebrow/heading silently rendered "FAQs" /
  // "Frequently Asked Questions" on an otherwise fully Arabic page
  // (found on /ar/penile-implant and /ar/peyronies-disease during
  // final visual QA — both used `<Faq items={faqItems} locale="ar" />`
  // with no override). Every other locale-aware shared component in
  // this codebase (AuthorityBlock, PatientFeedbackSection,
  // RecognitionSection, etc.) branches its default text on `locale`
  // internally instead of relying on the caller to override a static
  // English default — this now matches that pattern. Destructuring
  // `locale` before `eyebrow`/`heading` is required so their defaults
  // can reference it.
  eyebrow = locale === "ar" ? "الأسئلة الشائعة" : "FAQs",
  heading = locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions",
}: {
  items: FaqItem[];
  eyebrow?: string;
  heading?: string;
  /** When set, tags the FAQPage JSON-LD with `inLanguage` (spec §10/§24) and switches the default eyebrow/heading to Arabic. Omit for English. */
  locale?: "ar";
}) {
  return (
    <section className="py-section-y">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} heading={heading} size="md" locale={locale} />

        <Accordion.Root type="single" collapsible className="mt-10 border-t border-border">
          {items.map((item) => (
            <Accordion.Item
              key={item.question}
              value={item.question}
              className="border-b border-border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-start font-display text-lg text-foreground sm:text-xl">
                  {item.question}
                  <Plus
                    aria-hidden
                    size={18}
                    className="shrink-0 text-accent-strong transition-transform duration-200 ease-out group-data-[state=open]:rotate-45"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-none data-[state=open]:pb-6">
                <p className="max-w-2xl">{item.answer}</p>
                {item.readMoreHref && item.readMoreLabel && (
                  <Link
                    href={item.readMoreHref}
                    className="mt-3 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    {item.readMoreLabel}
                  </Link>
                )}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>

      <JsonLd data={faqPageSchema(items, locale ? { inLanguage: locale } : undefined)} />
    </section>
  );
}
