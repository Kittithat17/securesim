//app/mail/%5BrecipientId%5D/page.tsx
import { createClient } from "@supabase/supabase-js"
import MailboxClient from "./MailboxClient"



export default async function MailboxPage({
  params,
}: {
  params: Promise<{ recipientId: string }>
}) {
  const { recipientId } = await params   // ✅ ต้อง await

  if (!recipientId) {
    return <div>Invalid recipient</div>
  }
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from("fake_emails")
    .select(`
      *,
      campaign_targets!inner(
        recipient_id
      )
    `)
    .eq("campaign_targets.recipient_id", recipientId)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="h-screen flex bg-gray-100">
      
      {/* Sidebar (ของเดิมคุณ 100%) */}
      <div className="w-60 bg-white border-r p-4 space-y-4">
        <h1 className="text-xl font-bold text-red-500">Mail</h1>

        <nav className="space-y-2 text-sm">
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded font-medium">
            Inbox
          </div>
          <div className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
            Sent
          </div>
          <div className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
            Trash
          </div>
        </nav>
      </div>

      {/* 🔥 ตรงนี้เรียก Client Component */}
      <MailboxClient emails={data ?? []} />

    </div>
  )
  
}

