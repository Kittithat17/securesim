"use client"

import { useState } from "react"

interface Email {
  id: string
  subject: string
  body_html: string
}

export default function MailboxClient({
  emails,
}: {
  emails: Email[]
}) {
  const [selectedId, setSelectedId] = useState(
    emails?.[0]?.id
  )

  const selected = emails.find(e => e.id === selectedId)

  return (
    <>
      {/* Mail List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        {emails?.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedId(email.id)}
            className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
              selectedId === email.id ? "bg-gray-100" : ""
            }`}
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

      {/* Preview Panel  */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {selected ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {selected.subject}
            </h2>

            <div
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: selected.body_html,
              }}
            />
          </>
        ) : (
          <div className="text-gray-500">
            No emails
          </div>
        )}
      </div>
    </>
  )
}
