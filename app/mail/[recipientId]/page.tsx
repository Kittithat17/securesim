//app/mail/%5BrecipientId%5D/page.tsx
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function MailboxPage({
  params,
}: {
  params: Promise<{ recipientId: string }>
}) {
  const { recipientId } = await params   // ✅ ต้อง await

  if (!recipientId) {
    return <div>Invalid recipient</div>
  }

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
  
      {/* Sidebar */}
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
  
  
      {/* Mail List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        {data?.map((email) => (
          <div
            key={email.id}
            className="p-4 border-b hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium text-sm">
              {email.subject}
            </div>
            <div className="text-xs text-gray-500 truncate">
              Click to open message
            </div>
          </div>
        ))}
      </div>
  
  
      {/* Preview Panel */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {data && data.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {data[0].subject}
            </h2>
  
            <div
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: data[0].body_html,
              }}
            />
          </>
        ) : (
          <div className="text-gray-500">No emails</div>
        )}
      </div>
  
    </div>
  )
  
}

