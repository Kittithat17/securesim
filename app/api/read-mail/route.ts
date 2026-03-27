//app/api/read-mail/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"



export async function POST(req: Request) {
  const { emailId } = await req.json()
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from("fake_emails")
    .update({ is_read: true })
    .eq("id", emailId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}