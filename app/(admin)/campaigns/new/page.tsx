"use client"

import { useState } from "react"

export default function NewCampaignPage() {
  const [name, setName] = useState("")
  const [landing, setLanding] = useState("facebook")

  async function handleSubmit() {
    await fetch("/api/send-campaign", {
      method: "POST",
      body: JSON.stringify({
        name,
        landing_type: landing,
      }),
    })

    alert("Campaign Sent")
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create Campaign</h1>

      <input
        className="border p-2 w-full"
        placeholder="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="border p-2 w-full"
        value={landing}
        onChange={(e) => setLanding(e.target.value)}
      >
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
      </select>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Send Campaign
      </button>
    </div>
  )
}
