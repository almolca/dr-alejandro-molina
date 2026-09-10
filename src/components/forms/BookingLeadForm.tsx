"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { practice } from "@/config/practice";
import { SERVICE_INTERESTS, isServiceInterest, type ServiceInterest } from "@/lib/domain/service-interest";
import { leadFormSchema } from "@/lib/domain/lead-schema";
import { trackEvent } from "@/lib/analytics/events";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { createLead, markSentToNmc } from "@/app/(marketing)/book/actions";

const NMC_REDIRECT_TIMEOUT_MS = 1500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function BookingLeadForm({
  defaultService,
  sourcePage,
}: {
  defaultService?: ServiceInterest;
  sourcePage: string;
}) {
  const searchParams = useSearchParams();
  // Lazy initializer — React's sanctioned escape hatch for one-time
  // non-deterministic values (Date.now()) computed during render.
  const [renderedAt] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"form" | "success">("form");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [service, setService] = useState<ServiceInterest>(defaultService ?? "erectile_dysfunction");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const utm = {
    utmSource: searchParams.get("utm_source") ?? "",
    utmMedium: searchParams.get("utm_medium") ?? "",
    utmCampaign: searchParams.get("utm_campaign") ?? "",
    utmTerm: searchParams.get("utm_term") ?? "",
    utmContent: searchParams.get("utm_content") ?? "",
  };

  function handleSubmit(formData: FormData) {
    setFormError(null);

    const clientCheck = leadFormSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      serviceInterest: formData.get("serviceInterest"),
      preferredContactMethod: formData.get("preferredContactMethod") || undefined,
      privacyConsent: formData.get("privacyConsent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
      honeypot: formData.get("company") ?? "",
      renderedAt,
    });

    if (!clientCheck.success) {
      const errors: Record<string, string> = {};
      for (const issue of clientCheck.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      const result = await createLead(formData);
      if (!result.ok) {
        setFormError(result.error);
        trackEvent({
          name: "lead_submit_error",
          properties: { path: sourcePage, service, source: utm.utmSource || undefined },
        });
        return;
      }
      trackEvent({
        name: "lead_submit_success",
        properties: { path: sourcePage, service, source: utm.utmSource || undefined },
      });
      setLeadId(result.leadId);
      setStep("success");
    });
  }

  async function handleContinueToNmc() {
    if (isRedirecting) return;
    setIsRedirecting(true);
    trackEvent({
      name: "nmc_booking_click",
      properties: { source_page: sourcePage, service, cta_position: "book-lead-form-success" },
    });
    try {
      if (leadId) {
        await Promise.race([markSentToNmc(leadId), delay(NMC_REDIRECT_TIMEOUT_MS)]);
      }
    } finally {
      window.location.href = practice.bookingUrl;
    }
  }

  if (step === "success") {
    return (
      <div className="rounded-sm border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl text-foreground">Thank you — your details were received.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          The next step takes you to the official {practice.facilityShortName} booking system to select
          your appointment time.
        </p>
        <div className="mt-6">
          <Button size="lg" onClick={handleContinueToNmc} disabled={isRedirecting}>
            {isRedirecting ? "Redirecting…" : "Continue to NMC Booking"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-5 rounded-sm border border-border bg-surface p-6 text-left sm:p-8"
      noValidate
    >
      {/* Honeypot — hidden from real users, brief §19 */}
      <div aria-hidden="true" className="sr-only" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <input type="hidden" name="utmSource" value={utm.utmSource} />
      <input type="hidden" name="utmMedium" value={utm.utmMedium} />
      <input type="hidden" name="utmCampaign" value={utm.utmCampaign} />
      <input type="hidden" name="utmTerm" value={utm.utmTerm} />
      <input type="hidden" name="utmContent" value={utm.utmContent} />

      <div>
        <label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full name
        </label>
        <Input id="fullName" name="fullName" className="mt-2" required invalid={Boolean(fieldErrors.fullName)} />
        {fieldErrors.fullName && <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input id="email" name="email" type="email" className="mt-2" required invalid={Boolean(fieldErrors.email)} />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Mobile number
          </label>
          <Input id="phone" name="phone" type="tel" className="mt-2" required invalid={Boolean(fieldErrors.phone)} />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="serviceInterest" className="text-sm font-medium text-foreground">
          Service of interest
        </label>
        <Select
          id="serviceInterest"
          name="serviceInterest"
          className="mt-2"
          value={service}
          onChange={(e) => {
            if (isServiceInterest(e.target.value)) setService(e.target.value);
          }}
        >
          {SERVICE_INTERESTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="preferredContactMethod" className="text-sm font-medium text-foreground">
          Preferred contact method <span className="text-muted-foreground">(optional)</span>
        </label>
        <Select id="preferredContactMethod" name="preferredContactMethod" className="mt-2" defaultValue="">
          <option value="">No preference</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </Select>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="privacyConsent" name="privacyConsent" required />
        <label htmlFor="privacyConsent" className="text-xs leading-relaxed text-muted-foreground">
          I agree to the{" "}
          <a href="/privacy" className="underline decoration-accent-strong underline-offset-2" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{" "}
          and consent to my contact details being used to respond to my enquiry and facilitate appointment booking.
        </label>
      </div>
      {fieldErrors.privacyConsent && <p className="text-xs text-red-600">{fieldErrors.privacyConsent}</p>}

      <div className="flex items-start gap-3">
        <Checkbox id="marketingConsent" name="marketingConsent" />
        <label htmlFor="marketingConsent" className="text-xs leading-relaxed text-muted-foreground">
          I&rsquo;d also like to receive occasional updates about services and availability{" "}
          <span className="text-muted-foreground/80">(optional)</span>.
        </label>
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit Details"}
      </Button>
    </form>
  );
}
