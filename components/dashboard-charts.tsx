"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IconShield,
  IconMail,
  IconMouse,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconBook,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type DashboardData = {
  total: number
  read: number
  clicked: number
  submitted: number
  trainingCompleted: number
  quizPassed: number
  quizFailed: number
  campaignStats: {
    name: string
    total: number
    opened: number
    clicked: number
    submitted: number
    openRate: number
    clickRate: number
    submitRate: number
  }[]
  timelineData: {
    date: string
    clicked: number
    submitted: number
  }[]
  landingTypes: {
    name: string
    value: number
  }[]
}

// ─── KPI cards ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
  trend,
}: {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: string
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={`absolute inset-0 opacity-5 ${accent}`}
        style={{ background: `radial-gradient(ellipse at top right, currentColor 0%, transparent 70%)` }}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-sm font-medium">{label}</CardDescription>
        <div className={`p-2 rounded-lg ${accent} bg-opacity-10`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {trend === "up" && <IconTrendingUp className="size-3 text-emerald-500" />}
          {trend === "down" && <IconTrendingDown className="size-3 text-red-500" />}
          {sub}
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Attack Funnel ────────────────────────────────────────────────────────────

function AttackFunnel({ data }: { data: DashboardData }) {
  const funnelData = [
    { name: "Emails Sent", value: data.total, fill: "#6366f1" },
    { name: "Opened", value: data.read, fill: "#8b5cf6" },
    { name: "Clicked Link", value: data.clicked, fill: "#f59e0b" },
    { name: "Submitted Creds", value: data.submitted, fill: "#ef4444" },
  ]

  const pct = (n: number) =>
    data.total > 0 ? ((n / data.total) * 100).toFixed(1) : "0.0"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Phishing Attack Funnel</CardTitle>
        <CardDescription>Conversion at each stage of the campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {funnelData.map((step, i) => (
            <div key={step.name} className="flex items-center gap-3">
              <div className="w-28 text-xs text-muted-foreground shrink-0 text-right">
                {step.name}
              </div>
              <div className="flex-1 relative h-9 rounded overflow-hidden bg-muted">
                <div
                  className="h-full rounded transition-all duration-700"
                  style={{
                    width: `${pct(step.value)}%`,
                    background: step.fill,
                    opacity: 0.75,
                    minWidth: step.value > 0 ? "2rem" : 0,
                  }}
                />
                <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-foreground">
                  {step.value.toLocaleString()}
                </span>
              </div>
              <div className="w-14 text-right text-sm font-bold tabular-nums text-foreground">
                {pct(step.value)}%
              </div>
              {i < funnelData.length - 1 && (
                <div className="absolute" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex gap-4 flex-wrap">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-amber-500">Open→Click drop-off: </span>
            {data.read > 0
              ? (((data.read - data.clicked) / data.read) * 100).toFixed(1)
              : "—"}%
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-red-500">Click→Submit rate: </span>
            {data.clicked > 0
              ? ((data.submitted / data.clicked) * 100).toFixed(1)
              : "—"}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({ data }: { data: DashboardData }) {
  if (data.timelineData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No timeline data available yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Over Time</CardTitle>
        <CardDescription>Clicks and credential submissions per day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data.timelineData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradClicked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(var(--border))" }}
              labelFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              }
            />
            <Area
              type="monotone"
              dataKey="clicked"
              name="Clicked"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#gradClicked)"
            />
            <Area
              type="monotone"
              dataKey="submitted"
              name="Submitted"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#gradSubmitted)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block rounded" /> Clicks</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" /> Submissions</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Campaign bar chart ───────────────────────────────────────────────────────

function CampaignBars({ data }: { data: DashboardData }) {
  if (data.campaignStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Comparison</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No campaign data available yet.
        </CardContent>
      </Card>
    )
  }

  const barData = data.campaignStats.map((c) => ({
    name: c.name.length > 16 ? c.name.slice(0, 14) + "…" : c.name,
    "Open Rate": parseFloat(c.openRate.toFixed(1)),
    "Click Rate": parseFloat(c.clickRate.toFixed(1)),
    "Submit Rate": parseFloat(c.submitRate.toFixed(1)),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Campaign Comparison</CardTitle>
        <CardDescription>Open, click & submission rates per campaign (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(var(--border))" }}
              formatter={(v: number) => `${v}%`}
            />
            <Bar dataKey="Open Rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Click Rate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Submit Rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-500 inline-block rounded-sm" /> Open Rate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-400 inline-block rounded-sm" /> Click Rate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 inline-block rounded-sm" /> Submit Rate</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Landing Type Donut ───────────────────────────────────────────────────────

const DONUT_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"]

function LandingDonut({ data }: { data: DashboardData }) {
  if (data.landingTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Landing Page Types</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No landing type data available.
        </CardContent>
      </Card>
    )
  }

  const total = data.landingTypes.reduce((s, d) => s + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Landing Page Types</CardTitle>
        <CardDescription>Distribution of phishing page templates used</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data.landingTypes}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
            >
              {data.landingTypes.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(var(--border))" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 flex-1">
          {data.landingTypes.map((lt, i) => (
            <div key={lt.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                <span className="capitalize">{lt.name || "Unknown"}</span>
              </span>
              <span className="font-semibold tabular-nums">
                {total > 0 ? ((lt.value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Training Statistics ──────────────────────────────────────────────────────

function TrainingStats({ data }: { data: DashboardData }) {
  const trainingRate = data.submitted > 0 ? (data.trainingCompleted / data.submitted) * 100 : 0
  const passRate = data.trainingCompleted > 0 ? (data.quizPassed / data.trainingCompleted) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <IconBook className="size-4 text-blue-500" />
          Training & Retraining Progress
        </CardTitle>
        <CardDescription>Phishing awareness training completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Training Completion */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Training Completed</span>
              <span className="text-sm font-bold text-blue-500">
                {data.trainingCompleted} / {data.submitted}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${trainingRate}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{trainingRate.toFixed(1)}% completion rate</p>
          </div>

          {/* Quiz Pass Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Quiz Pass Rate</span>
              <span className="text-sm font-bold">
                <span className="text-green-500">{data.quizPassed}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-red-500">{data.quizFailed}</span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-2 transition-all duration-700"
                  style={{
                    width: `${passRate}%`,
                  }}
                />
              </div>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-2 transition-all duration-700"
                  style={{
                    width: `${100 - passRate}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{passRate.toFixed(1)}% pass rate on first attempt</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{data.submitted}</div>
              <div className="text-xs text-muted-foreground">Fallen for phish</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-500">{data.trainingCompleted}</div>
              <div className="text-xs text-muted-foreground">Started training</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{data.quizPassed}</div>
              <div className="text-xs text-muted-foreground">Passed quiz</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Risk Score Badge ─────────────────────────────────────────────────────────

function RiskScore({ data }: { data: DashboardData }) {
  const submitRate = data.total > 0 ? (data.submitted / data.total) * 100 : 0
  const clickRate = data.total > 0 ? (data.clicked / data.total) * 100 : 0

  // Weighted risk: submission is more critical
  const score = Math.min(100, Math.round(clickRate * 0.3 + submitRate * 0.7))

  const level =
    score >= 70 ? { label: "Critical", color: "bg-red-500", text: "text-red-500" } :
    score >= 40 ? { label: "High", color: "bg-orange-500", text: "text-orange-500" } :
    score >= 20 ? { label: "Medium", color: "bg-amber-400", text: "text-amber-500" } :
    { label: "Low", color: "bg-emerald-500", text: "text-emerald-500" }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-500 to-transparent" />
      <CardHeader className="pb-2">
        <CardDescription className="text-sm font-medium flex items-center gap-2">
          <IconShield className="size-4" />
          Organization Risk Score
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end gap-4">
        <div>
          <div className="text-5xl font-black tabular-nums tracking-tight">{score}</div>
          <div className={`text-sm font-bold mt-0.5 ${level.text}`}>{level.label} Risk</div>
        </div>
        <div className="flex-1 pb-1">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${level.color}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DashboardCharts({ data }: { data: DashboardData }) {
  const clickRate = data.total > 0 ? ((data.clicked / data.total) * 100).toFixed(1) : "0.0"
  const submitRate = data.total > 0 ? ((data.submitted / data.total) * 100).toFixed(1) : "0.0"
  const readRate = data.total > 0 ? ((data.read / data.total) * 100).toFixed(1) : "0.0"

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Targets"
          value={data.total.toLocaleString()}
          sub={`across ${data.campaignStats.length} campaign${data.campaignStats.length !== 1 ? "s" : ""}`}
          icon={<IconMail className="size-4 text-indigo-500" />}
          accent="bg-indigo-500"
        />
        <KpiCard
          label="Email Open Rate"
          value={`${readRate}%`}
          sub={`${data.read} of ${data.total} opened`}
          icon={<IconMail className="size-4 text-violet-500" />}
          accent="bg-violet-500"
          trend="neutral"
        />
        <KpiCard
          label="Link Click Rate"
          value={`${clickRate}%`}
          sub={`${data.clicked} employees clicked`}
          icon={<IconMouse className="size-4 text-amber-500" />}
          accent="bg-amber-500"
          trend={parseFloat(clickRate) > 30 ? "down" : "neutral"}
        />
        <KpiCard
          label="Credential Submission"
          value={`${submitRate}%`}
          sub={`${data.submitted} submitted credentials`}
          icon={<IconAlertTriangle className="size-4 text-red-500" />}
          accent="bg-red-500"
          trend={parseFloat(submitRate) > 10 ? "down" : "neutral"}
        />
      </div>

      {/* Risk + Funnel + Training */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex flex-col gap-4">
          <RiskScore data={data} />
          <LandingDonut data={data} />
        </div>
        <div className="md:col-span-2">
          <AttackFunnel data={data} />
        </div>
      </div>

      {/* Training Stats */}
      <TrainingStats data={data} />

      {/* Timeline + Campaign Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Timeline data={data} />
        <CampaignBars data={data} />
      </div>
    </div>
  )
}
