"use client"

import Link from "next/link"
import { LayoutDashboard, Mail, Users } from "lucide-react"

export function AdminSidebar() {
  return (
    <div className="w-64 bg-background border-r p-6">
      <h1 className="text-xl font-semibold mb-8">
        SecureSim
      </h1>

      <nav className="space-y-3">
        <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link href="/campaigns" className="flex items-center gap-2 hover:text-primary">
          <Mail size={18} />
          Campaigns
        </Link>
        <Link href="/employees" className="flex items-center gap-2 hover:text-primary">
          <Users size={18} />
          Employees
        </Link>

        
      </nav>
    </div>
  )
}
