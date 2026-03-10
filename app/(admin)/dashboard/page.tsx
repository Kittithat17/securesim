import { createClient } from "@supabase/supabase-js"
import { DashboardCharts, type DashboardData } from "@/components/dashboard-charts"

export const dynamic = "force-dynamic"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function DashboardPage() {
  const { data: targets = [] } = await supabase
    .from("campaign_targets")
    .select("campaign_id, sent_at, clicked_at, submitted_at, landing_type")

  // Fetch fake_emails joined with campaign_targets to get per-campaign open counts
  const { data: fakeEmails = [] } = await supabase
    .from("fake_emails")
    .select("is_read, campaign_targets(campaign_id)")

  const { data: campaigns = [] } = await supabase
    .from("campaigns")
    .select("id, name")

  const safeTargets = targets ?? []
  const safeCampaigns = campaigns ?? []
  const safeEmails = fakeEmails ?? []

  const total = safeTargets.length
  const read = safeEmails.filter((e: any) => e.is_read).length
  const clicked = safeTargets.filter((t: any) => t.clicked_at).length
  const submitted = safeTargets.filter((t: any) => t.submitted_at).length

  const campaignMap = new Map<string, { name: string; total: number; opened: number; clicked: number; submitted: number }>()
  for (const c of safeCampaigns as any[]) {
    campaignMap.set(c.id, { name: c.name, total: 0, opened: 0, clicked: 0, submitted: 0 })
  }
  for (const t of safeTargets as any[]) {
    if (!t.campaign_id) continue
    if (!campaignMap.has(t.campaign_id)) {
      campaignMap.set(t.campaign_id, { name: `Campaign ${t.campaign_id.slice(0, 8)}`, total: 0, opened: 0, clicked: 0, submitted: 0 })
    }
    const entry = campaignMap.get(t.campaign_id)!
    entry.total++
    if (t.clicked_at) entry.clicked++
    if (t.submitted_at) entry.submitted++
  }

  // Count opens per campaign from fake_emails
  for (const e of safeEmails as any[]) {
    if (!e.is_read) continue
    const campaignId = e.campaign_targets?.campaign_id
    if (!campaignId) continue
    const entry = campaignMap.get(campaignId)
    if (entry) entry.opened++
  }

  const campaignStats = Array.from(campaignMap.values()).map((c) => ({
    ...c,
    openRate: c.total > 0 ? (c.opened / c.total) * 100 : 0,
    clickRate: c.total > 0 ? (c.clicked / c.total) * 100 : 0,
    submitRate: c.total > 0 ? (c.submitted / c.total) * 100 : 0,
  }))

  const dateMap = new Map<string, { clicked: number; submitted: number }>()
  const toDateKey = (iso: string | null) => iso ? iso.slice(0, 10) : null

  for (const t of safeTargets as any[]) {
    const clickDate = toDateKey(t.clicked_at)
    const submitDate = toDateKey(t.submitted_at)
    if (clickDate) {
      if (!dateMap.has(clickDate)) dateMap.set(clickDate, { clicked: 0, submitted: 0 })
      dateMap.get(clickDate)!.clicked++
    }
    if (submitDate) {
      if (!dateMap.has(submitDate)) dateMap.set(submitDate, { clicked: 0, submitted: 0 })
      dateMap.get(submitDate)!.submitted++
    }
  }

  const timelineData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }))

  const landingMap = new Map<string, number>()
  for (const t of safeTargets as any[]) {
    const key = t.landing_type ?? "unknown"
    landingMap.set(key, (landingMap.get(key) ?? 0) + 1)
  }
  const landingTypes = Array.from(landingMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  const dashboardData: DashboardData = {
    total,
    read,
    clicked,
    submitted,
    campaignStats,
    timelineData,
    landingTypes,
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Phishing simulation overview — security awareness metrics
        </p>
      </div>
      <DashboardCharts data={dashboardData} />
    </div>
  )
}
