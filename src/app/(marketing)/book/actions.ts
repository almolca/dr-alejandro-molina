"use server";

import { cookies, headers } from "next/headers";
import { createLeadServerSchema } from "@/lib/domain/lead-schema";
import { resolveSubmittedDiscussionTopic } from "@/lib/domain/discussion-topic";
import {
  ATTRIBUTION_COOKIE,
  BOOK_ORIGIN_COOKIE,
  parseAttributionCookie,
  parseBookOrigin,
} from "@/lib/attribution/cookies";
import { getServiceSupabase } from "@/lib/supabase/service-client";

/**
 * Lead capture + immediate NMC handoff — R7.2 UX simplification.
 * `/book` is a single-step attribution gateway: one submission both
 * creates the lead (`status=lead_created`) and immediately attempts
 * the `sent_to_nmc` transition, in the same server action, before the
 * client redirects. The `sent_to_nmc` attempt is best-effort and must
 * never block or fail the overall submission — the redirect to NMC has
 * to happen regardless (see `attemptMarkSentToNmc` below).
 *
 * `createLead` is the only path into `leads` (browser never talks to
 * Supabase directly).
 */

const DOUBLE_SUBMIT_MIN_MS = 2000;

async function attemptMarkSentToNmc(leadId: string): Promise<void> {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from("leads")
      .update({ status: "sent_to_nmc", booking_clicked_at: new Date().toISOString() })
      .eq("id", leadId)
      .eq("status", "lead_created");

    if (error) {
      console.error("[createLead] sent_to_nmc update failed", error);
    }
  } catch (err) {
    console.error("[createLead] sent_to_nmc update threw", err);
  }
}

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
  const originPage = parseBookOrigin(cookieStore.get(BOOK_ORIGIN_COOKIE)?.value);

  const rawPayload = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    // Same resolver the client uses (R7.2.2) — defense in depth, so a
    // raw "prefer_not_to_say"/garbage value reaching this action
    // directly is treated as "no topic," never rejected outright.
    discussionTopic: resolveSubmittedDiscussionTopic(formData.get("discussionTopic")?.toString()),
    privacyConsent: formData.get("privacyConsent") === "on",
    honeypot,
    renderedAt,
    referrer: headerStore.get("referer") ?? undefined,
    originPage: originPage ?? undefined,
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
        service_interest: parsed.data.discussionTopic ?? null,
        status: "lead_created",
        origin_page: parsed.data.originPage ?? null,
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
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[createLead] insert failed", error);
      return { ok: false, error: "We couldn't submit your details. Please try again." };
    }

    const leadId = data.id as string;
    // Best-effort, in the same action — never blocks the response.
    await attemptMarkSentToNmc(leadId);

    return { ok: true, leadId };
  } catch (err) {
    console.error("[createLead] unexpected error", err);
    return { ok: false, error: "We couldn't submit your details. Please try again." };
  }
}
