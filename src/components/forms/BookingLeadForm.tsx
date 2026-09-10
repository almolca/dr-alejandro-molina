"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { practice } from "@/config/practice";
import type { ServiceInterest } from "@/lib/domain/service-interest";
import {
  DISCUSSION_TOPICS,
  PREFER_NOT_TO_SAY,
  isDiscussionTopic,
  mapServiceToDiscussionTopic,
  type DiscussionTopic,
} from "@/lib/domain/discussion-topic";
import { leadFormSchema } from "@/lib/domain/lead-schema";
import { trackEvent } from "@/lib/analytics/events";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { createLead } from "@/app/(marketing)/book/actions";

/**
 * Single-step booking gateway — R7.2 UX simplification. One submission
 * both creates the lead and (server-side, same action) immediately
 * attempts the sent_to_nmc transition; this component only needs to
 * redirect once `createLead` resolves, no second confirmation step.
 *
 * "What would you like to discuss?" is optional and uses the broader
 * `DISCUSSION_TOPICS` set, not the fine-grained page-context
 * `ServiceInterest` enum — a visitor is never recorded as having a
 * specific condition merely because of which marketing page linked
 * them here. `defaultService` (page context) only suggests a
 * convenience default via `mapServiceToDiscussionTopic`; the visitor
 * can freely change or clear it, including to "Prefer not to say",
 * which is never sent to the server as a value (see `handleSubmit`).
 */
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
  const [discussionTopic, setDiscussionTopic] = useState<DiscussionTopic | typeof PREFER_NOT_TO_SAY>(
    mapServiceToDiscussionTopic(defaultService) ?? PREFER_NOT_TO_SAY,
  );
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

  const chosenTopic = discussionTopic === PREFER_NOT_TO_SAY ? undefined : discussionTopic;

  function handleSubmit(formData: FormData) {
    setFormError(null);

    // "Prefer not to say" is a UI-only sentinel — never sent as a value.
    if (formData.get("discussionTopic") === PREFER_NOT_TO_SAY) {
      formData.delete("discussionTopic");
    }

    const clientCheck = leadFormSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      discussionTopic: formData.get("discussionTopic") || undefined,
      privacyConsent: formData.get("privacyConsent") === "on",
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
          properties: { path: sourcePage, service: chosenTopic, source: utm.utmSource || undefined },
        });
        return;
      }

      trackEvent({
        name: "lead_submit_success",
        properties: { path: sourcePage, service: chosenTopic, source: utm.utmSource || undefined },
      });
      // The server action already attempted sent_to_nmc in the same
      // step — this event marks the client-observed handoff moment.
      trackEvent({
        name: "nmc_booking_click",
        properties: { source_page: sourcePage, service: chosenTopic, cta_position: "book-lead-form" },
      });

      setIsRedirecting(true);
      window.location.href = practice.bookingUrl;
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-5 rounded-sm border border-border bg-surface p-6 text-left sm:p-8"
      noValidate
    >
      {/* Honeypot — hidden from real users, anti-spam */}
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

      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input id="email" name="email" type="email" className="mt-2" required invalid={Boolean(fieldErrors.email)} />
        {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="discussionTopic" className="text-sm font-medium text-foreground">
          What would you like to discuss? <span className="text-muted-foreground">(optional)</span>
        </label>
        <Select
          id="discussionTopic"
          name="discussionTopic"
          className="mt-2"
          value={discussionTopic}
          onChange={(e) => {
            const value = e.target.value;
            if (value === PREFER_NOT_TO_SAY || isDiscussionTopic(value)) {
              setDiscussionTopic(value);
            }
          }}
        >
          <option value={PREFER_NOT_TO_SAY}>Prefer not to say</option>
          {DISCUSSION_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="privacyConsent" name="privacyConsent" required />
        <label htmlFor="privacyConsent" className="text-xs leading-relaxed text-muted-foreground">
          I agree to the{" "}
          <a href="/privacy" className="underline decoration-accent-strong underline-offset-2" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{" "}
          and consent to my details being used to facilitate my appointment booking.
        </label>
      </div>
      {fieldErrors.privacyConsent && <p className="text-xs text-red-600">{fieldErrors.privacyConsent}</p>}

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending || isRedirecting}>
          {isPending || isRedirecting ? "Redirecting…" : "Continue to NMC Booking"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          You&rsquo;ll be redirected to {practice.facilityShortName} to complete your booking.
        </p>
      </div>
    </form>
  );
}
