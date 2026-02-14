//app/%28admin%29/dashboard/page.tsx
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function DashboardPage() {
  const { data } = await supabase
    .from("campaign_targets")
    .select("clicked_at, submitted_at")

  const total = data?.length ?? 0
  const clicked = data?.filter(d => d.clicked_at).length ?? 0
  const submitted = data?.filter(d => d.submitted_at).length ?? 0

  const clickRate = total ? ((clicked / total) * 100).toFixed(1) : 0
  const submitRate = total ? ((submitted / total) * 100).toFixed(1) : 0

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Targets</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {total}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Click Rate</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {clickRate}%
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credential Submission</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-red-500">
          {submitRate}%
        </CardContent>
      </Card>
    </div>
  )
}
