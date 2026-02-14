import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { name, landing_type } = await req.json()

  // 1️⃣ สร้าง campaign
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({ name })
    .select()
    .single()

  if (campaignError) {
    return NextResponse.json({ error: campaignError.message }, { status: 500 })
  }

  // 2️⃣ ดึงพนักงานทั้งหมด
  const { data: recipients } = await supabase
    .from("recipients")
    .select("*")

  // 3️⃣ loop สร้าง target + fake email
  for (const r of recipients ?? []) {
    const token = crypto.randomUUID()

    const { data: target, error: targetError } = await supabase
      .from("campaign_targets")
      .insert({
        campaign_id: campaign.id,
        recipient_id: r.id,
        token,
        landing_type,
      })
      .select()
      .single()

    if (targetError) continue

    // ✅ สร้าง fake email ให้แต่ละคน
    await supabase.from("fake_emails").insert({
      campaign_target_id: target.id,
      subject: "Account Verification Required",
      body_html: `
        <p>Your account requires verification.</p>
        <a href="http://localhost:3000/landing/${landing_type}?token=${token}">
          Verify Now
        </a>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
