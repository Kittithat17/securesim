//app/mail/[recipientId]/MailboxClient.tsx
"use client";

import { useState } from "react";

interface Email {
  id: string;
  subject: string;
  body_html: string;
  is_read: boolean;
}

export default function MailboxClient({ emails }: { emails: Email[] }) {
  const [mailList, setMailList] = useState(emails || []);

  const [selectedId, setSelectedId] = useState(
    mailList?.[mailList.length - 1]?.id
  );

  const reversedEmails = [...mailList].reverse();

  const selected = reversedEmails.find((e) => e.id === selectedId);
  const handleOpenMail = async (emailId: string) => {
    setSelectedId(emailId);

    // update UI ทันที
    setMailList((prev) =>
      prev.map((mail) =>
        mail.id === emailId ? { ...mail, is_read: true } : mail
      )
    );

    await fetch("/api/read-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailId }),
    });
  };
  return (
    <>
      {/* Mail List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        {/* 3️⃣ Map through the reversed list instead of the original one */}
        {reversedEmails?.map((email) => (
          <div
            key={email.id}
            onClick={() => handleOpenMail(email.id)}
            className={`p-4 border-b cursor-pointer
              ${selectedId === email.id
                ? "bg-gray-100"
                : !email.is_read
                ? "bg-gray-200 font-semibold"
                : "bg-white"
              }
            `}
          >
            <div className="font-medium text-sm">{email.subject}</div>
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
            <h2 className="text-xl font-semibold mb-4">{selected.subject}</h2>

            <div
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: selected.body_html,
              }}
            />
          </>
        ) : (
          <div className="text-gray-500">No emails</div>
        )}
      </div>
    </>
  );
}
