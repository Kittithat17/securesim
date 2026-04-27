import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = String(body.token || "");
  const score = Number(body.score || 0);
  const passed = Boolean(body.passed);

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // Update the campaign_target record with quiz results
    const { error } = await supabase
      .from("campaign_targets")
      .update({
        quiz_passed: passed,
        quiz_score: score,
        quiz_completed_at: new Date().toISOString(),
      })
      .eq("token", token);

    if (error) {
      return NextResponse.json({ error: "Failed to update quiz status" }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Quiz results recorded",
      passed: passed,
      score: score
    });
  } catch (error) {
    console.error("Error in quiz/complete:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
