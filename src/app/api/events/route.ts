import { NextResponse, type NextRequest } from "next/server";
import { analyticsEventSchema } from "@/lib/analytics/event-schema";
import { getServiceSupabase } from "@/lib/supabase/service-client";

/**
 * First-party analytics ingestion — R7.2 brief §11/§16. Validates and
 * allow-lists every field before insert; never echoes DB errors to the
 * client, and never fails loudly for a dropped analytics event (losing
 * one event is acceptable, breaking the page/booking flow is not).
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabase();
    await supabase.from("analytics_events").insert({
      anonymous_session_id: parsed.data.anonymousSessionId,
      event_name: parsed.data.name,
      path: parsed.data.path,
      locale: parsed.data.locale,
      service_interest: parsed.data.serviceInterest ?? null,
      source: parsed.data.source ?? null,
      utm_source: parsed.data.utmSource ?? null,
      utm_medium: parsed.data.utmMedium ?? null,
      utm_campaign: parsed.data.utmCampaign ?? null,
      referrer_category: parsed.data.referrerCategory ?? null,
    });
  } catch (err) {
    console.error("[analytics_events insert failed]", err);
  }

  return NextResponse.json({ ok: true });
}
