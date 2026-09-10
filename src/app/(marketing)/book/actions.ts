"use server";

import { cookies, headers } from "next/headers";
import { createLeadServerSchema } from "@/lib/domain/lead-schema";
import { ATTRIBUTION_COOKIE, parseAttributionCookie } from "@/lib/attribution/cookies";
import { getServiceSupabase } from "@/lib/supabase/service-client";

/**
 * Lead capture + NMC handoff — R7.2 brief §20/§21. `createLead` is the
 * only path into `leads` (browser never talks to Supabase directly, per
 * brief §17). `markSentToNmc` must never throw: the redirect to NMC has
 * to proceed even if the DB update fails (brief §21 — booking UX over
 * analytics completeness).
 */

const DOUBLE_SUBMIT_MIN_MS = 2000;

export async function createLead(
  formData: FormData,
): Promise<{ ok: true; leadId: string } | { ok: false; error: string }> {
  const honeypot = String(formData.get("company") ?? "");
  const renderedAt = Number(formData.get("renderedAt") ?? 0);

  if (honeypot.length > 0) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  if (!renderedAt || Date.now() - renderedAt < DOUBLE_SUBMIT_MIN_MS) {
    return { ok: false, error: "Please wait a moment before submitting." };
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const firstTouch = parseAttributionCookie(cookieStore.get(ATTRIBUTION_COOKIE.first)?.value);
  const lastTouch = parseAttributionCookie(cookieStore.get(ATTRIBUTION_COOKIE.last)?.value);

  const rawPayload = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    serviceInterest: String(formData.get("serviceInterest") ?? ""),
    preferredContactMethod: formData.get("preferredContactMethod")
      ? String(formData.get("preferredContactMethod"))
      : undefined,
    privacyConsent: formData.get("privacyConsent") === "on",
    marketingConsent: formData.get("marketingConsent") === "on",
    honeypot,
    renderedAt,
    referrer: headerStore.get("referer") ?? undefined,
    utmSource: formData.get("utmSource") ? String(formData.get("utmSource")) : undefined,
    utmMedium: formData.get("utmMedium") ? String(formData.get("utmMedium")) : undefined,
    utmCampaign: formData.get("utmCampaign") ? String(formData.get("utmCampaign")) : undefined,
    utmTerm: formData.get("utmTerm") ? String(formData.get("utmTerm")) : undefined,
    utmContent: formData.get("utmContent") ? String(formData.get("utmContent")) : undefined,
    firstTouchSource: firstTouch?.source,
    firstTouchLandingPage: firstTouch?.page,
    firstTouchAt: firstTouch?.at,
    lastTouchSource: lastTouch?.source,
    lastTouchPage: lastTouch?.page,
    lastTouchAt: lastTouch?.at,
  };

  const parsed = createLeadServerSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const now = new Date().toISOString();

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        service_interest: parsed.data.serviceInterest,
        status: "lead_created",
        preferred_contact_method: parsed.data.preferredContactMethod ?? null,
        first_touch_source: parsed.data.firstTouchSource ?? null,
        first_touch_landing_page: parsed.data.firstTouchLandingPage ?? null,
        first_touch_at: parsed.data.firstTouchAt ?? null,
        last_touch_source: parsed.data.lastTouchSource ?? null,
        last_touch_page: parsed.data.lastTouchPage ?? null,
        last_touch_at: parsed.data.lastTouchAt ?? null,
        referrer: parsed.data.referrer ?? null,
        utm_source: parsed.data.utmSource ?? null,
        utm_medium: parsed.data.utmMedium ?? null,
        utm_campaign: parsed.data.utmCampaign ?? null,
        utm_term: parsed.data.utmTerm ?? null,
        utm_content: parsed.data.utmContent ?? null,
        privacy_consent: true,
        privacy_consent_at: now,
        marketing_consent: parsed.data.marketingConsent,
        marketing_consent_at: parsed.data.marketingConsent ? now : null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[createLead] insert failed", error);
      return { ok: false, error: "We couldn't submit your details. Please try again." };
    }

    return { ok: true, leadId: data.id as string };
  } catch (err) {
    console.error("[createLead] unexpected error", err);
    return { ok: false, error: "We couldn't submit your details. Please try again." };
  }
}

export async function markSentToNmc(leadId: string): Promise<{ ok: boolean }> {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from("leads")
      .update({ status: "sent_to_nmc", booking_clicked_at: new Date().toISOString() })
      .eq("id", leadId)
      .eq("status", "lead_created");

    if (error) {
      console.error("[markSentToNmc] update failed", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[markSentToNmc] unexpected error", err);
    return { ok: false };
  }
}
