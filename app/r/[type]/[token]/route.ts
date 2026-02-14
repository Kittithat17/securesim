import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string; token: string } }
) {
  const { type, token } = params;

  const { data } = await supabase
    .from("campaign_targets")
    .select("id, clicked_at")
    .eq("token", token)
    .maybeSingle();

  if (!data) {
    return NextResponse.redirect(
      new URL("/awareness?status=invalid", req.url)
    );
  }

  if (!data.clicked_at) {
    await supabase
      .from("campaign_targets")
      .update({
        clicked_at: new Date().toISOString(),
        interaction_level: "clicked",
      })
      .eq("id", data.id);
  }

  // ใช้ type ตรงกับ folder ที่คุณมี
  const landingPath = `/landing/${type}`;

  const url = new URL(landingPath, req.url);
  url.searchParams.set("token", token);

  return NextResponse.redirect(url.toString());
}
