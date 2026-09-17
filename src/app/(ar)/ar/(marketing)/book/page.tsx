import type { Metadata } from "next";
import { Suspense } from "react";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { isServiceInterest, type ServiceInterest } from "@/lib/domain/service-interest";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";

const PATH = "/ar/book";

export const metadata: Metadata = buildMetadata({
  title: "احجز موعداً",
  description:
    "احجز استشارة مع الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة، في مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "احجز موعداً", href: PATH },
];

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPageAr({ searchParams }: Props) {
  const params = await searchParams;
  const defaultService: ServiceInterest | undefined =
    params.service && isServiceInterest(params.service) ? params.service : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Suspense fallback={null}>
        <BookPageViewTracker path={PATH} service={defaultService} />
      </Suspense>

      <Breadcrumb items={breadcrumbItems} />

      {/* Direct NMC handoff — R9 booking funnel correction: no form. */}
      <section className="py-section-y">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">الاستشارة</p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">احجز موعداً</h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              تُدار مواعيد الاستشارة مع {AR_IDENTITY.doctorDisplayName} من خلال مستشفى إن إم سي رويال –
              مدينة خليفة.
            </p>

            <div className="mt-10">
              <NmcBookingButton sourcePage={PATH} label="المتابعة إلى حجز الموعد عبر NMC" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              سيتم تحويلك إلى نظام الحجز الرسمي لدى NMC.
            </p>

            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-11 items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                عرض الملف الشخصي في NMC
              </a>
            )}
          </Reveal>
        </Container>
      </section>

      {/* Practice details */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">الطبيب</p>
            <p className="mt-4 font-display text-2xl text-foreground">{AR_IDENTITY.doctorDisplayName}</p>
            <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-eyebrow font-medium text-accent-strong">موقع العيادة</p>
            <p className="mt-4 font-display text-2xl text-foreground">{AR_IDENTITY.facilityName}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {AR_IDENTITY.city}، {AR_IDENTITY.country}
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
