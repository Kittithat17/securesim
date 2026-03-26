//app/%28admin%29/layout.tsx
import { AdminSidebar } from "@/components/admin-sidebar"
import { Toaster } from "sonner"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
      <Toaster richColors position="top-center" />
    </div>
  )
}
