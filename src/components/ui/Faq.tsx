"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqPageSchema } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/JsonLd";

export type FaqItem = { question: string; answer: string };

/**
 * FAQ accordion — spec §24 "FAQ where genuinely useful", §25 FAQPage
 * schema only when visible FAQ content exists. Renders both the
 * visible accordion and its matching JSON-LD from the same data, so
 * they can never drift apart.
 */
export function Faq({ items, eyebrow = "FAQs" }: { items: FaqItem[]; eyebrow?: string }) {
  return (
    <section className="py-section-y">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} heading="Frequently Asked Questions" size="md" />

        <Accordion.Root type="single" collapsible className="mt-10 border-t border-border">
          {items.map((item) => (
            <Accordion.Item
              key={item.question}
              value={item.question}
              className="border-b border-border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg text-foreground sm:text-xl">
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
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>

      <JsonLd data={faqPageSchema(items)} />
    </section>
  );
}
