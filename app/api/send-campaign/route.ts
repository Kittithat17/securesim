//api/send-campaign/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const domainMap: Record<string, string> = {
  facebook: process.env.FACEBOOK_DOMAIN!,
  instagram: process.env.INSTAGRAM_DOMAIN!,
};

export async function POST(req: Request) {
  const { name, landing_type } = await req.json();
  
  if (!domainMap[landing_type]) {
    return NextResponse.json({ error: "Invalid landing" }, { status: 400 });
  }
  
  const baseUrl = domainMap[landing_type];

  // --- 1. DYNAMIC BRANDING LOGIC ADDED HERE ---
  const isInstagram = landing_type === "instagram";
  const brandName = isInstagram ? "Instagram" : "Facebook";
  const avatarLetter = isInstagram ? "I" : "F";
  const avatarColorHex = isInstagram ? "E1306C" : "1877f2"; // Insta Pink vs FB Blue
  const buttonStyle = isInstagram 
    ? "background-color: #E1306C; background-image: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);"
    : "background-color: #007bff;";
  // --------------------------------------------

// 2. Using your locally hosted images from the public/images folder!
  const logoUrl = isInstagram
    ? "/images/igalt.png"
    : "/images/facebook.png";

  // 1. Create campaign
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({ name })
    .select()
    .single();

  if (campaignError) {
    return NextResponse.json({ error: campaignError.message }, { status: 500 });
  }

  // 2. Get recipients
  const { data: recipients } = await supabase.from("recipients").select("*");

  // 3. Loop to create targets and emails
  for (const r of recipients ?? []) {
    const token = crypto.randomUUID();

    const link = `${baseUrl}/account-review/${landing_type}?session=${token}`;

    const { data: target, error: targetError } = await supabase
      .from("campaign_targets")
      .insert({
        campaign_id: campaign.id,
        recipient_id: r.id,
        token,
        landing_type,
      })
      .select()
      .single();

    if (targetError) continue;

    // Create fake email
    await supabase.from("fake_emails").insert({
      campaign_target_id: target.id,
      subject: "Action Required: Account Verification",
      body_html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 40px;">
            
            <div style="font-size: 12px; color: #888888; margin-bottom: 25px;">
              <span style="float: right;">Today, 11:23 PM <span style="color: #ffc107; font-size: 14px;">★</span></span>
              <span>From <strong style="color: #0056b3;">Security</strong> to <strong style="color: #0056b3;">Personal</strong></span>
            </div>
            <div style="clear: both;"></div>

            <h2 style="color: #1a2238; font-size: 26px; font-weight: 800; margin: 0 0 30px 0; letter-spacing: -0.5px;">
              Account Notification
            </h2>

            <div style="margin-bottom: 30px;">
              <img src="${logoUrl}" alt="${brandName} Logo" style="height: 35px; width: auto; display: block;" />
            </div>

            <div style="margin-bottom: 20px;">
              <img src="https://ui-avatars.com/api/?name=${avatarLetter}&background=f0f2f5&color=${avatarColorHex}&rounded=true" alt="Avatar" style="width: 36px; height: 36px; border-radius: 50%; vertical-align: middle; margin-right: 12px;" />
              <span style="font-size: 15px; color: #333333; font-weight: bold; vertical-align: middle;">Hello,</span>
            </div>

            <div style="padding-left: 52px;">
              <p style="font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 25px 0;">
                We have detected a new sign-in attempt. Please verify your identity immediately.
              </p>

              <div style="margin: 30px 0;">
                <a href="${link}" 
                   style="${buttonStyle} color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Verify Account Now
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.5; color: #888888; margin: 0 0 40px 0;">
                If you did not request this, please verify your account immediately.
              </p>

              <div style="border-top: 1px solid #eeeeee; padding-top: 20px;">
                <p style="font-size: 12px; color: #aaaaaa; margin: 0;">
                  © 2026 ${brandName}. All rights reserved.
                </p>
              </div>
            </div>

          </div>
        </div>
      `,
    });
  }

  return NextResponse.json({ success: true });
}
