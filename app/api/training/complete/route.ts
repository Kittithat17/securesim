import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = String(body.token || "");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // Update the campaign_target record to mark training as completed
    const { error } = await supabase
      .from("campaign_targets")
      .update({
        training_completed_at: new Date().toISOString(),
      })
      .eq("token", token);

    if (error) {
      return NextResponse.json({ error: "Failed to update training status" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Training marked as completed" });
  } catch (error) {
    console.error("Error in training/complete:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
