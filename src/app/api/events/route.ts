import { NextResponse, type NextRequest } from "next/server";
import { analyticsEventSchema } from "@/lib/analytics/event-schema";
import { getServiceSupabase } from "@/lib/supabase/service-client";
import {
  ATTRIBUTION_COOKIE,
  BOOK_ORIGIN_COOKIE,
  parseAttributionCookie,
  parseBookOrigin,
} from "@/lib/attribution/cookies";

/**
 * First-party analytics ingestion — R7.2 brief §11/§16. Validates and
 * allow-lists every field before insert; never echoes DB errors to the
 * client, and never fails loudly for a dropped analytics event (losing
 * one event is acceptable, breaking the page/booking flow is not) — but
 * a dropped insert (including the resolved `{ error }` supabase-js
 * returns instead of throwing, e.g. a missing column before a pending
 * migration is applied) is always logged server-side via console.error
 * so a failure is diagnosable, never silent-and-undiagnosable.
 *
 * R9 booking funnel correction: `source` and `origin_page` are also
 * backfilled here, server-side, from the same httpOnly attribution
 * cookies `src/proxy.ts` already sets (`attr_last`, `book_origin`). The
 * client can never read an httpOnly cookie, so this is the only place
 * these signals can reach `analytics_events` — and because they're
 * derived from a cookie the browser can't touch, they can't be spoofed
 * by a crafted request body either. A client-supplied `source` (only
 * ever sent today for `page_view`/`book_page_view`/`lead_submit_*`, via
 * `FunnelEventProperties`) still wins when present.
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

  const lastTouch = parseAttributionCookie(request.cookies.get(ATTRIBUTION_COOKIE.last)?.value);
  const originPage = parseBookOrigin(request.cookies.get(BOOK_ORIGIN_COOKIE)?.value);

  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase.from("analytics_events").insert({
      anonymous_session_id: parsed.data.anonymousSessionId,
      event_name: parsed.data.name,
      path: parsed.data.path,
      locale: parsed.data.locale ?? null,
      service_interest: parsed.data.serviceInterest ?? null,
      source: parsed.data.source ?? lastTouch?.source ?? null,
      origin_page: originPage ?? null,
      utm_source: parsed.data.utmSource ?? null,
      utm_medium: parsed.data.utmMedium ?? null,
      utm_campaign: parsed.data.utmCampaign ?? null,
      referrer_category: parsed.data.referrerCategory ?? null,
    });
    if (error) {
      console.error("[analytics_events insert failed]", error);
    }
  } catch (err) {
    console.error("[analytics_events insert failed]", err);
  }

  return NextResponse.json({ ok: true });
}
