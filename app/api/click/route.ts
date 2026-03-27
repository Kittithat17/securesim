//app/api/click/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";



export async function POST(req: Request) {
  const { token } = await req.json();
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 });
  }

  await supabase
    .from("campaign_targets")
    .update({ clicked_at: new Date() })
    .eq("token", token)
    .is("clicked_at", null); // กันการอัปเดตซ้ำ

  return NextResponse.json({ success: true });
}
