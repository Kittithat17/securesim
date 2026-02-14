import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { name, landing_type } = await req.json()

  // 1️⃣ สร้าง campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .insert({ name })
    .select()
    .single()

  // 2️⃣ ดึงพนักงานทั้งหมด
  const { data: recipients } = await supabase
    .from("recipients")
    .select("*")

  // 3️⃣ loop สร้าง campaign_targets
  for (const r of recipients ?? []) {
    const token = crypto.randomUUID()

    await supabase.from("campaign_targets").insert({
      campaign_id: campaign.id,
      recipient_id: r.id,
      token,
      landing_type,
    })
  }

  return NextResponse.json({ success: true })
}
