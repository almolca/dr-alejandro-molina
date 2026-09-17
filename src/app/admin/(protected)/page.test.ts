import { describe, expect, it, vi } from "vitest";
import { findAll } from "@/lib/test-utils/react-element";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { KpiCard } from "@/components/admin/KpiCard";

vi.mock("@/lib/admin/queries", () => ({
  getOverviewKpis: vi.fn().mockResolvedValue({
    visitors: 10,
    page_views: 20,
    book_cta_clicks: 5,
    leads_created: 2,
    nmc_booking_clicks: 3,
  }),
  getFunnel: vi.fn().mockResolvedValue({
    visits: 10,
    book_cta_clicks: 5,
    book_page_views: 4,
    leads_created: 2,
    nmc_booking_clicks: 3,
  }),
}));

import AdminOverviewPage from "./page";

describe("AdminOverviewPage", () => {
  it("keeps the primary booking funnel to Book Page Visits -> NMC Booking Clicks, without a Leads Created stage", async () => {
    const tree = await AdminOverviewPage({ searchParams: Promise.resolve({}) });
    const funnels = findAll(tree, (el) => el.type === FunnelChart);
    expect(funnels).toHaveLength(1);
    const stageLabels = (funnels[0].props.stages as { label: string }[]).map((s) => s.label);
    expect(stageLabels).not.toContain("Leads Created");
    expect(stageLabels[stageLabels.length - 1]).toBe("NMC Booking Clicks");
    expect(stageLabels[stageLabels.length - 2]).toBe("Book Page Visits");
  });

  it("still shows Leads as a separate legacy KPI card, not folded into the funnel", async () => {
    const tree = await AdminOverviewPage({ searchParams: Promise.resolve({}) });
    const kpis = findAll(tree, (el) => el.type === KpiCard);
    const leadsCard = kpis.find((k) => k.props.label === "Leads");
    expect(leadsCard).toBeDefined();
    expect(leadsCard!.props.value).toBe(2);
  });
});
