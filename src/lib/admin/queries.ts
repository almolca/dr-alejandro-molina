import { getServiceSupabase } from "@/lib/supabase/service-client";

/**
 * Admin dashboard data access — R7.2 brief §27–§33/§44/§45. Each RPC
 * wrapper is a thin call to the SECURITY DEFINER functions from
 * supabase/migrations/0001_leads_and_analytics.sql. `getLeads`/`getLead`
 * read `leads` directly with an explicit column list (never `select("*")`
 * on a table holding PII, so the returned columns stay auditable).
 */

export type OverviewKpis = {
  visitors: number;
  page_views: number;
  book_cta_clicks: number;
  leads_created: number;
  nmc_booking_clicks: number;
};

export type FunnelRow = {
  visits: number;
  book_cta_clicks: number;
  book_page_views: number;
  leads_created: number;
  nmc_booking_clicks: number;
};

export type PagePerformanceRow = {
  path: string;
  views: number;
  book_clicks: number;
  leads: number;
  nmc_clicks: number;
};

export type SourcePerformanceRow = {
  source: string;
  sessions: number;
  book_clicks: number;
  leads: number;
  nmc_clicks: number;
};

export type ServicePerformanceRow = {
  service_interest: string;
  leads: number;
  nmc_clicks: number;
};

export type LeadRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  service_interest: string;
  status: string;
  last_touch_source: string | null;
  first_touch_source: string | null;
  booking_clicked_at: string | null;
};

const LEAD_LIST_COLUMNS =
  "id, created_at, full_name, email, phone, service_interest, status, last_touch_source, first_touch_source, booking_clicked_at";

const LEAD_DETAIL_COLUMNS =
  "id, created_at, updated_at, full_name, email, phone, service_interest, status, preferred_contact_method, " +
  "first_touch_source, first_touch_landing_page, first_touch_at, last_touch_source, last_touch_page, last_touch_at, " +
  "referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, booking_clicked_at, " +
  "privacy_consent, privacy_consent_at, marketing_consent, marketing_consent_at";

function toIso(date: Date) {
  return date.toISOString();
}

export async function getOverviewKpis(start: Date, end: Date): Promise<OverviewKpis> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .rpc("admin_overview_kpis", { start_at: toIso(start), end_at: toIso(end) })
    .single();
  if (error || !data) {
    console.error("[getOverviewKpis]", error);
    return { visitors: 0, page_views: 0, book_cta_clicks: 0, leads_created: 0, nmc_booking_clicks: 0 };
  }
  return data as OverviewKpis;
}

export async function getFunnel(start: Date, end: Date): Promise<FunnelRow> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .rpc("admin_funnel", { start_at: toIso(start), end_at: toIso(end) })
    .single();
  if (error || !data) {
    console.error("[getFunnel]", error);
    return { visits: 0, book_cta_clicks: 0, book_page_views: 0, leads_created: 0, nmc_booking_clicks: 0 };
  }
  return data as FunnelRow;
}

export async function getPagePerformance(start: Date, end: Date): Promise<PagePerformanceRow[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.rpc("admin_page_performance", {
    start_at: toIso(start),
    end_at: toIso(end),
  });
  if (error) {
    console.error("[getPagePerformance]", error);
    return [];
  }
  return (data ?? []) as PagePerformanceRow[];
}

export async function getSourcePerformance(start: Date, end: Date): Promise<SourcePerformanceRow[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.rpc("admin_source_performance", {
    start_at: toIso(start),
    end_at: toIso(end),
  });
  if (error) {
    console.error("[getSourcePerformance]", error);
    return [];
  }
  return (data ?? []) as SourcePerformanceRow[];
}

export async function getServicePerformance(start: Date, end: Date): Promise<ServicePerformanceRow[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.rpc("admin_service_performance", {
    start_at: toIso(start),
    end_at: toIso(end),
  });
  if (error) {
    console.error("[getServicePerformance]", error);
    return [];
  }
  return (data ?? []) as ServicePerformanceRow[];
}

export async function getLeads(filters: {
  status?: string;
  serviceInterest?: string;
  from?: Date;
  to?: Date;
  page: number;
  pageSize: number;
}): Promise<{ rows: LeadRow[]; total: number }> {
  const supabase = getServiceSupabase();
  let query = supabase
    .from("leads")
    .select(LEAD_LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.serviceInterest) query = query.eq("service_interest", filters.serviceInterest);
  if (filters.from) query = query.gte("created_at", toIso(filters.from));
  if (filters.to) query = query.lt("created_at", toIso(filters.to));

  const from = filters.page * filters.pageSize;
  const to = from + filters.pageSize - 1;
  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("[getLeads]", error);
    return { rows: [], total: 0 };
  }
  return { rows: (data ?? []) as LeadRow[], total: count ?? 0 };
}

export async function getLead(id: string): Promise<Record<string, unknown> | null> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getLead]", error);
    return null;
  }
  return data as Record<string, unknown> | null;
}
